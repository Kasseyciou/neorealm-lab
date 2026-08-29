const api = window.NeoRealmSupabase;
const db = api.client;
const store = window.NeoRealmWebProjects;
const authPanel = document.querySelector('[data-auth-panel]');
const authForm = document.querySelector('[data-auth-form]');
const authStatus = document.querySelector('[data-auth-status]');
const app = document.querySelector('[data-admin-app]');
const signout = document.querySelector('[data-signout]');
const list = document.querySelector('[data-admin-project-list]');
const form = document.querySelector('[data-project-editor]');
const count = document.querySelector('[data-project-count]');
const status = document.querySelector('[data-admin-status]');
const editorTitle = document.querySelector('[data-editor-title]');
const deleteButton = document.querySelector('[data-delete-project]');
const coverPreview = document.querySelector('[data-cover-preview]');
const coverEmpty = document.querySelector('[data-cover-empty]');
const lightboxPreview = document.querySelector('[data-lightbox-preview]');
const lightboxEmpty = document.querySelector('[data-lightbox-empty]');
const instagramTitleList = document.querySelector('[data-instagram-title-list]');
const instagramTitleStatus = document.querySelector('[data-instagram-title-status]');
const instagramSelectionCount = document.querySelector('[data-instagram-selection-count]');
const instagramRefreshButton = document.querySelector('[data-instagram-refresh]');
let projects = [];
let instagramPosts = [];
let instagramTitleOverrides = {};
const instagramTitleDrafts = new Map();
let coverBlob = null;
let pageBlob = null;
let draggedProjectId = '';
let draggedInstagramId = '';
let instagramOrderSaving = false;
let authorizationTask = null;

const say = (message, error = false) => {
  status.textContent = message;
  status.classList.toggle('is-error', error);
};
const setPreview = (image, empty, src = '') => {
  if (src) image.src = src;
  else image.removeAttribute('src');
  image.hidden = !src;
  empty.hidden = Boolean(src);
};
const slugify = (value) => value.toLowerCase().normalize('NFKD')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `project-${Date.now()}`;
const extFor = (blob) => blob?.type === 'image/png' ? 'png' : blob?.type === 'image/webp' ? 'webp' : 'jpg';
const withTimeout = (promise, milliseconds, label) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error(`${label}逾時，請重新整理後再試。`)), milliseconds)),
]);
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function loadAdminData() {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await withTimeout(Promise.all([loadProjects(), setupInstagramTitles()]), 15000, '後台資料載入');
      return;
    } catch (error) {
      lastError = error;
      if (!/JWT issued at future/i.test(error.message || '')) throw error;
      authStatus.textContent = `正在同步安全憑證… (${attempt + 1}/3)`;
      await wait(3500);
      const { error: refreshError } = await db.auth.refreshSession();
      if (refreshError) lastError = refreshError;
    }
  }
  throw lastError;
}

function compressImage(file, { width, height, maxWidth, crop = false }) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onerror = () => reject(new Error('圖片格式無法處理。'));
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (crop) {
        const sourceRatio = image.naturalWidth / image.naturalHeight;
        const targetRatio = width / height;
        const sw = sourceRatio > targetRatio ? image.naturalHeight * targetRatio : image.naturalWidth;
        const sh = sourceRatio > targetRatio ? image.naturalHeight : image.naturalWidth / targetRatio;
        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, (image.naturalWidth - sw) / 2, (image.naturalHeight - sh) / 2, sw, sh, 0, 0, width, height);
      } else {
        const scale = Math.min(1, maxWidth / image.naturalWidth);
        canvas.width = Math.round(image.naturalWidth * scale);
        canvas.height = Math.round(image.naturalHeight * scale);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('圖片壓縮失敗。')), 'image/webp', 0.86);
      URL.revokeObjectURL(image.src);
    };
    image.src = URL.createObjectURL(file);
  });
}

async function upload(bucket, blob, slug) {
  const path = `${slug}/${crypto.randomUUID()}.${extFor(blob)}`;
  const { error } = await db.storage.from(bucket).upload(path, blob, { contentType: blob.type, upsert: false });
  if (error) throw error;
  return path;
}

function resetEditor() {
  form.reset();
  form.elements.id.value = '';
  form.elements.category.value = store.categories[0].value;
  coverBlob = null;
  pageBlob = null;
  setPreview(coverPreview, coverEmpty);
  setPreview(lightboxPreview, lightboxEmpty);
  editorTitle.textContent = '新增作品';
  deleteButton.hidden = true;
  say('');
}

function editProject(id) {
  const project = projects.find((item) => item.id === id);
  if (!project) return;
  form.elements.id.value = project.id;
  form.elements.title.value = project.title;
  form.elements.description.value = project.description;
  form.elements.category.value = project.category;
  form.elements.alt.value = project.alt;
  form.elements.projectUrl.value = project.projectUrl || '';
  coverBlob = null;
  pageBlob = null;
  setPreview(coverPreview, coverEmpty, project.coverImage);
  setPreview(lightboxPreview, lightboxEmpty, project.lightboxImage);
  editorTitle.textContent = `編輯｜${project.title}`;
  deleteButton.hidden = false;
  document.querySelector('.project-editor-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function loadProjects() {
  projects = await api.getProjects();
  renderProjects();
}

async function persistOrder() {
  const results = await Promise.all(projects.map((project, index) => db.from('web_projects').update({ sort_order: index }).eq('id', project.id)));
  const failed = results.find(({ error }) => error);
  if (failed) throw failed.error;
}

function renderProjects() {
  list.textContent = '';
  count.textContent = `${projects.length} projects · drag or use arrows`;
  projects.forEach((project, index) => {
    const item = document.createElement('article');
    item.className = 'admin-project-item';
    item.dataset.projectId = project.id;
    item.draggable = true;
    const handle = document.createElement('span');
    handle.className = 'drag-handle';
    handle.textContent = '⠿';
    const image = new Image();
    image.className = 'project-thumb';
    image.src = project.coverImage;
    image.alt = '';
    const copy = document.createElement('button');
    copy.className = 'project-item-copy';
    copy.type = 'button';
    copy.innerHTML = '<strong></strong><span></span>';
    copy.querySelector('strong').textContent = project.title;
    copy.querySelector('span').textContent = store.categories.find(({ value }) => value === project.category)?.label || project.category;
    copy.onclick = () => editProject(project.id);
    const actions = document.createElement('div');
    actions.className = 'project-order-actions';
    [['↑', -1], ['↓', 1]].forEach(([label, offset]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.disabled = offset < 0 ? index === 0 : index === projects.length - 1;
      button.onclick = async () => {
        const next = index + offset;
        [projects[index], projects[next]] = [projects[next], projects[index]];
        renderProjects();
        try { await persistOrder(); say('作品順序已更新。'); } catch (error) { say(error.message, true); await loadProjects(); }
      };
      actions.append(button);
    });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `刪除 ${project.title}`);
    remove.onclick = () => removeProject(project);
    actions.append(remove);
    item.addEventListener('dragstart', () => { draggedProjectId = project.id; item.classList.add('is-dragging'); });
    item.addEventListener('dragend', () => { draggedProjectId = ''; item.classList.remove('is-dragging'); });
    item.addEventListener('dragover', (event) => event.preventDefault());
    item.addEventListener('drop', async (event) => {
      event.preventDefault();
      if (!draggedProjectId || draggedProjectId === project.id) return;
      const from = projects.findIndex(({ id }) => id === draggedProjectId);
      const to = projects.findIndex(({ id }) => id === project.id);
      const [moved] = projects.splice(from, 1);
      projects.splice(to, 0, moved);
      renderProjects();
      try { await persistOrder(); say('作品順序已更新。'); } catch (error) { say(error.message, true); await loadProjects(); }
    });
    item.append(handle, image, copy, actions);
    list.append(item);
  });
}

async function removeProject(project) {
  if (!confirm(`確定刪除「${project.title}」？`)) return;
  say('刪除中…');
  const { error } = await db.from('web_projects').delete().eq('id', project.id);
  if (error) return say(error.message, true);
  await Promise.all([
    db.storage.from('web-project-covers').remove([project.coverPath]),
    db.storage.from('web-project-pages').remove([project.lightboxPath]),
  ]);
  resetEditor();
  await loadProjects();
  say('作品已刪除。');
}

async function persistInstagramOrder(selectedPosts) {
  const results = await Promise.all(selectedPosts.map((post, index) => (
    db.from('instagram_posts').update({ display_order: index }).eq('media_id', post.id)
  )));
  const failed = results.find(({ error }) => error);
  if (failed) throw failed.error;
}

function clearInstagramDropTargets() {
  instagramTitleList.querySelectorAll('.is-drop-before, .is-drop-after').forEach((row) => {
    row.classList.remove('is-drop-before', 'is-drop-after');
  });
}

function applyLocalInstagramOrder(selectedPosts) {
  const unselectedPosts = instagramPosts.filter((post) => !post.visible);
  instagramPosts = [...selectedPosts, ...unselectedPosts];
}

async function reorderInstagramPosts(sourceId, targetId, placeAfter = false) {
  if (instagramOrderSaving || !sourceId || !targetId || sourceId === targetId) return;

  const selectedPosts = instagramPosts.filter((post) => post.visible);
  const previousSelectedPosts = [...selectedPosts];
  const sourceIndex = selectedPosts.findIndex((post) => post.id === sourceId);
  const targetIndex = selectedPosts.findIndex((post) => post.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) return;

  const [movedPost] = selectedPosts.splice(sourceIndex, 1);
  let insertIndex = targetIndex + (placeAfter ? 1 : 0);
  if (sourceIndex < insertIndex) insertIndex -= 1;
  selectedPosts.splice(insertIndex, 0, movedPost);
  if (selectedPosts.every((post, index) => post.id === previousSelectedPosts[index]?.id)) return;

  instagramOrderSaving = true;
  applyLocalInstagramOrder(selectedPosts);
  renderInstagramLibrary();
  instagramTitleStatus.classList.remove('is-error');
  instagramTitleStatus.textContent = '正在儲存前台 IG 順序…';

  try {
    await persistInstagramOrder(selectedPosts);
    instagramTitleStatus.textContent = '前台 IG 順序已更新。';
  } catch (error) {
    instagramTitleStatus.classList.add('is-error');
    try {
      await persistInstagramOrder(previousSelectedPosts);
      instagramTitleStatus.textContent = `排序儲存失敗，已還原原順序：${error.message}`;
    } catch (rollbackError) {
      instagramTitleStatus.textContent = `排序儲存失敗，且無法自動還原：${rollbackError.message}`;
    }
  }

  instagramOrderSaving = false;
  try {
    await loadInstagramLibrary();
  } catch (loadError) {
    instagramTitleStatus.classList.add('is-error');
    instagramTitleStatus.textContent = `排序已處理，但作品庫重新載入失敗：${loadError.message}`;
  }
}

async function loadInstagramLibrary() {
  [instagramPosts, instagramTitleOverrides] = await Promise.all([
    api.getInstagramPosts(),
    api.getInstagramTitles(),
  ]);
  renderInstagramLibrary();
}

async function refreshInstagramLibrary() {
  if (!instagramRefreshButton || instagramRefreshButton.disabled) return;

  const previousCount = instagramPosts.length;
  const previousSync = Math.max(0, ...instagramPosts.map((post) => Date.parse(post.syncedAt) || 0));
  instagramRefreshButton.disabled = true;
  instagramRefreshButton.textContent = '刷新中…';
  instagramTitleStatus.classList.remove('is-error');
  instagramTitleStatus.textContent = '正在啟動 Instagram 同步…';

  try {
    const { error } = await db.functions.invoke('refresh-instagram', { method: 'POST' });
    if (error) throw error;

    instagramTitleStatus.textContent = '已啟動同步，正在抓取最新貼文；請保持此頁面開啟。';

    for (let attempt = 0; attempt < 30; attempt += 1) {
      await wait(5000);
      const latestPosts = await api.getInstagramPosts();
      const latestSync = Math.max(0, ...latestPosts.map((post) => Date.parse(post.syncedAt) || 0));
      if (latestSync <= previousSync) continue;

      await loadInstagramLibrary();
      const added = Math.max(0, instagramPosts.length - previousCount);
      instagramTitleStatus.textContent = added
        ? `同步完成，新增 ${added} 則貼文；新作品已保留在作品庫，請自行選擇是否顯示於前台。`
        : '同步完成，目前沒有新增貼文；現有作品資料已更新。';
      return;
    }

    instagramTitleStatus.textContent = '同步仍在背景執行，稍後重新整理後台即可查看最新作品。';
  } catch (error) {
    instagramTitleStatus.classList.add('is-error');
    instagramTitleStatus.textContent = `無法啟動同步：${error.message || '請稍後再試。'}`;
  } finally {
    instagramRefreshButton.disabled = false;
    instagramRefreshButton.textContent = '立即刷新';
  }
}

instagramRefreshButton?.addEventListener('click', refreshInstagramLibrary);

function renderInstagramLibrary() {
  instagramTitleList.textContent = '';
  const selected = instagramPosts.filter((post) => post.visible);
  instagramSelectionCount.textContent = `${selected.length} / 20 已選 · 共 ${instagramPosts.length} 則永久保存`;

  if (!instagramPosts.length) {
    const empty = document.createElement('p');
    empty.className = 'instagram-library-empty';
    empty.textContent = '作品庫尚無資料。完成 GitHub 的 Supabase 同步設定後，執行一次 Sync Instagram workflow 即可匯入。';
    instagramTitleList.append(empty);
    return;
  }

  instagramPosts.forEach((item) => {
    const row = document.createElement('article');
    row.className = 'instagram-title-row';
    row.classList.toggle('is-selected', item.visible);
    row.dataset.instagramId = item.id;

    if (item.visible) {
      row.classList.add('is-draggable');
      const dragHandle = document.createElement('span');
      dragHandle.className = 'instagram-drag-handle';
      dragHandle.draggable = !instagramOrderSaving;
      dragHandle.title = '拖曳調整前台順序';
      dragHandle.setAttribute('aria-hidden', 'true');
      dragHandle.innerHTML = `
        <svg viewBox="0 0 16 22" aria-hidden="true">
          <circle cx="5" cy="5" r="1.1"></circle><circle cx="11" cy="5" r="1.1"></circle>
          <circle cx="5" cy="11" r="1.1"></circle><circle cx="11" cy="11" r="1.1"></circle>
          <circle cx="5" cy="17" r="1.1"></circle><circle cx="11" cy="17" r="1.1"></circle>
        </svg>`;
      dragHandle.addEventListener('dragstart', (event) => {
        if (instagramOrderSaving) {
          event.preventDefault();
          return;
        }
        draggedInstagramId = item.id;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', item.id);
        requestAnimationFrame(() => row.classList.add('is-dragging'));
      });
      dragHandle.addEventListener('dragend', () => {
        draggedInstagramId = '';
        row.classList.remove('is-dragging');
        clearInstagramDropTargets();
      });
      row.append(dragHandle);
    }

    const image = new Image();
    image.src = item.src;
    image.alt = '';
    image.loading = 'lazy';

    const field = document.createElement('label');
    const meta = document.createElement('span');
    const parsedDate = item.timestamp ? new Date(item.timestamp) : null;
    const date = parsedDate && !Number.isNaN(parsedDate.getTime())
      ? new Intl.DateTimeFormat('zh-TW', { dateStyle: 'medium' }).format(parsedDate)
      : '日期未提供';
    meta.textContent = `${item.visible ? `前台第 ${selected.findIndex((post) => post.id === item.id) + 1} 則` : '作品庫'} · ${date}`;
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 72;
    input.value = instagramTitleDrafts.has(item.id)
      ? instagramTitleDrafts.get(item.id)
      : instagramTitleOverrides[item.id] || '';
    input.placeholder = item.title || 'NeoRealm LAB Visual';
    input.setAttribute('aria-label', `${item.title || 'Instagram 貼文'}的燈箱標題`);
    input.addEventListener('input', () => instagramTitleDrafts.set(item.id, input.value));
    field.append(meta, input);

    const actions = document.createElement('div');
    actions.className = 'instagram-row-actions';

    const visibility = document.createElement('label');
    visibility.className = 'instagram-visibility-control';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.visible;
    checkbox.disabled = instagramOrderSaving || (!item.visible && selected.length >= 20);
    checkbox.setAttribute('aria-label', `${item.visible ? '從前台移除' : '顯示於前台'} ${item.title}`);
    const visibilityText = document.createElement('span');
    visibilityText.textContent = item.visible ? '前台顯示' : '加入前台';
    visibility.append(checkbox, visibilityText);
    checkbox.onchange = async () => {
      checkbox.disabled = true;
      instagramTitleStatus.classList.remove('is-error');
      instagramTitleStatus.textContent = '正在更新前台選擇…';
      const { error } = await db.rpc('set_instagram_post_visibility', {
        p_media_id: item.id,
        p_visible: checkbox.checked,
      });
      if (error) {
        instagramTitleStatus.classList.add('is-error');
        instagramTitleStatus.textContent = error.message;
      } else {
        instagramTitleStatus.textContent = checkbox.checked ? '已加入前台展示。' : '已從前台移除，作品仍保留在作品庫。';
      }
      try {
        await loadInstagramLibrary();
      } catch (loadError) {
        instagramTitleStatus.classList.add('is-error');
        instagramTitleStatus.textContent = `選擇已更新，但作品庫重新載入失敗：${loadError.message}`;
      }
    };

    const orderActions = document.createElement('div');
    orderActions.className = 'instagram-order-actions';
    if (item.visible) {
      const selectedIndex = selected.findIndex((post) => post.id === item.id);
      const pinButton = document.createElement('button');
      pinButton.type = 'button';
      pinButton.textContent = '置頂';
      pinButton.setAttribute('aria-label', `將 ${item.title} 置頂`);
      pinButton.disabled = instagramOrderSaving || selectedIndex === 0;
      pinButton.onclick = async () => {
        await reorderInstagramPosts(item.id, selected[0].id);
      };
      orderActions.append(pinButton);

      [['上移', -1, '向前移動'], ['下移', 1, '向後移動']].forEach(([symbol, offset, actionLabel]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = symbol;
        button.setAttribute('aria-label', `${actionLabel} ${item.title}`);
        button.disabled = instagramOrderSaving || (offset < 0 ? selectedIndex === 0 : selectedIndex === selected.length - 1);
        button.onclick = async () => {
          const nextIndex = selectedIndex + offset;
          await reorderInstagramPosts(item.id, selected[nextIndex].id, offset > 0);
        };
        orderActions.append(button);
      });
    }

    const save = document.createElement('button');
    save.type = 'button';
    save.className = 'secondary-action';
    save.textContent = '儲存標題';
    save.disabled = instagramOrderSaving;
    save.onclick = async () => {
      save.disabled = true;
      const title = input.value.trim();
      const result = title
        ? await db.from('instagram_title_overrides').upsert({ media_id: item.id, title })
        : await db.from('instagram_title_overrides').delete().eq('media_id', item.id);
      save.disabled = false;
      instagramTitleStatus.classList.toggle('is-error', Boolean(result.error));
      instagramTitleStatus.textContent = result.error ? result.error.message : 'Instagram 燈箱標題已更新。';
      if (!result.error) {
        instagramTitleOverrides[item.id] = title;
        instagramTitleDrafts.delete(item.id);
      }
    };

    actions.append(visibility, orderActions, save);
    row.append(image, field, actions);
    if (item.visible) {
      row.addEventListener('dragover', (event) => {
        if (!draggedInstagramId || draggedInstagramId === item.id || instagramOrderSaving) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        const placeAfter = event.clientY > row.getBoundingClientRect().top + row.offsetHeight / 2;
        clearInstagramDropTargets();
        row.classList.add(placeAfter ? 'is-drop-after' : 'is-drop-before');
      });
      row.addEventListener('drop', async (event) => {
        event.preventDefault();
        if (!draggedInstagramId || draggedInstagramId === item.id || instagramOrderSaving) return;
        const placeAfter = row.classList.contains('is-drop-after');
        const sourceId = draggedInstagramId;
        draggedInstagramId = '';
        clearInstagramDropTargets();
        await reorderInstagramPosts(sourceId, item.id, placeAfter);
      });
    }
    instagramTitleList.append(row);
  });
}

async function setupInstagramTitles() {
  try {
    await loadInstagramLibrary();
  } catch (error) {
    instagramSelectionCount.textContent = '讀取失敗';
    instagramTitleList.textContent = `無法讀取 Instagram 作品庫：${error.message}`;
  }
}

async function runAuthorization(session) {
  if (!session) {
    authPanel.hidden = false; app.hidden = true; signout.hidden = true; return;
  }
  if (session.user.email?.toLowerCase() !== 'kasseyworks@gmail.com') {
    await db.auth.signOut();
    throw new Error('此帳號沒有後台權限。');
  }
  const needsInitialLoad = app.hidden;
  authStatus.textContent = '正在載入管理介面…';
  authPanel.hidden = true; app.hidden = false; signout.hidden = false;
  if (needsInitialLoad) {
    await loadAdminData();
    resetEditor();
  }
}

function authorize(session) {
  if (authorizationTask) return authorizationTask;
  authorizationTask = runAuthorization(session)
    .catch((error) => {
      console.error('NeoRealm admin authorization failed.', error);
      authPanel.hidden = false;
      app.hidden = true;
      signout.hidden = !session;
      authStatus.textContent = `登入成功，但後台初始化失敗：${error.message || '未知錯誤'}`;
    })
    .finally(() => { authorizationTask = null; });
  return authorizationTask;
}

store.categories.forEach(({ value, label }) => form.elements.category.add(new Option(label, value)));
form.elements.coverFile.onchange = async ({ target }) => {
  if (!target.files[0]) return;
  say('處理封面中…');
  try { coverBlob = await compressImage(target.files[0], { width: 600, height: 650, crop: true }); setPreview(coverPreview, coverEmpty, URL.createObjectURL(coverBlob)); say('封面已準備。'); } catch (error) { say(error.message, true); }
};
form.elements.lightboxFile.onchange = async ({ target }) => {
  if (!target.files[0]) return;
  say('處理長圖中…');
  try { pageBlob = await compressImage(target.files[0], { maxWidth: 1400 }); setPreview(lightboxPreview, lightboxEmpty, URL.createObjectURL(pageBlob)); say('長圖已準備。'); } catch (error) { say(error.message, true); }
};
form.onsubmit = async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const existing = projects.find(({ id }) => id === form.elements.id.value);
  if (!existing && (!coverBlob || !pageBlob)) return say('新增作品需要封面與長圖。', true);
  say('上傳與儲存中…');
  try {
    const slug = existing?.slug || slugify(form.elements.title.value);
    const coverPath = coverBlob ? await upload('web-project-covers', coverBlob, slug) : existing.coverPath;
    const lightboxPath = pageBlob ? await upload('web-project-pages', pageBlob, slug) : existing.lightboxPath;
    const payload = {
      slug, title: form.elements.title.value.trim(), description: form.elements.description.value.trim(),
      category: form.elements.category.value, alt_text: form.elements.alt.value.trim(), cover_path: coverPath,
      lightbox_path: lightboxPath, project_url: form.elements.projectUrl.value.trim() || null,
      sort_order: existing?.sortOrder ?? projects.length, published: true,
    };
    const result = existing
      ? await db.from('web_projects').update(payload).eq('id', existing.id)
      : await db.from('web_projects').insert(payload);
    if (result.error) throw result.error;
    if (existing && coverBlob) await db.storage.from('web-project-covers').remove([existing.coverPath]);
    if (existing && pageBlob) await db.storage.from('web-project-pages').remove([existing.lightboxPath]);
    await loadProjects(); resetEditor(); say(existing ? '作品已更新。' : '作品已新增。');
  } catch (error) { say(error.message, true); }
};
deleteButton.onclick = () => { const project = projects.find(({ id }) => id === form.elements.id.value); if (project) removeProject(project); };
document.querySelector('[data-add-project]').onclick = resetEditor;
document.querySelector('[data-cancel-edit]').onclick = resetEditor;
signout.onclick = () => db.auth.signOut();
authForm.onsubmit = async (event) => {
  event.preventDefault();
  const submit = authForm.querySelector('[data-auth-action="signin"]');
  authStatus.textContent = '登入中…';
  submit.disabled = true;
  try {
    const { data, error } = await db.auth.signInWithPassword({
      email: authForm.elements.email.value,
      password: authForm.elements.password.value,
    });
    if (error) throw error;
    await authorize(data.session);
  } catch (error) {
    authStatus.textContent = error.message || '登入失敗，請稍後再試。';
  } finally {
    submit.disabled = false;
  }
};
db.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') setTimeout(() => authorize(null), 0);
  if (event === 'SIGNED_IN' && session) setTimeout(() => authorize(session), 0);
});
db.auth.getSession().then(({ data }) => authorize(data.session));
