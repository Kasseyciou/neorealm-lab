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
let projects = [];
let coverBlob = null;
let pageBlob = null;
let draggedId = '';
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
    item.addEventListener('dragstart', () => { draggedId = project.id; item.classList.add('is-dragging'); });
    item.addEventListener('dragend', () => { draggedId = ''; item.classList.remove('is-dragging'); });
    item.addEventListener('dragover', (event) => event.preventDefault());
    item.addEventListener('drop', async (event) => {
      event.preventDefault();
      if (!draggedId || draggedId === project.id) return;
      const from = projects.findIndex(({ id }) => id === draggedId);
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

async function setupInstagramTitles() {
  try {
    const [feedResponse, overrides] = await Promise.all([
      fetch('./data/instagram-feed.json', { cache: 'no-store' }),
      api.getInstagramTitles(),
    ]);
    const feed = await feedResponse.json();
    instagramTitleList.textContent = '';
    feed.items.forEach((item) => {
      const row = document.createElement('article');
      row.className = 'instagram-title-row';
      const image = new Image(); image.src = item.src; image.alt = ''; image.loading = 'lazy';
      const field = document.createElement('label');
      const label = document.createElement('span'); label.textContent = `貼文 ${item.id}`;
      const input = document.createElement('input'); input.type = 'text'; input.maxLength = 72; input.value = overrides[item.id] || ''; input.placeholder = item.title || 'NeoRealm LAB Visual';
      const save = document.createElement('button'); save.type = 'button'; save.className = 'secondary-action'; save.textContent = '儲存標題';
      save.onclick = async () => {
        const title = input.value.trim();
        const result = title
          ? await db.from('instagram_title_overrides').upsert({ media_id: item.id, title })
          : await db.from('instagram_title_overrides').delete().eq('media_id', item.id);
        instagramTitleStatus.textContent = result.error ? result.error.message : 'Instagram 燈箱標題已更新。';
      };
      field.append(label, input); row.append(image, field, save); instagramTitleList.append(row);
    });
  } catch (error) { instagramTitleList.textContent = error.message; }
}

async function runAuthorization(session) {
  if (!session) {
    authPanel.hidden = false; app.hidden = true; signout.hidden = true; return;
  }
  if (session.user.email?.toLowerCase() !== 'kasseyworks@gmail.com') {
    await db.auth.signOut();
    throw new Error('此帳號沒有後台權限。');
  }
  authStatus.textContent = '正在載入管理介面…';
  authPanel.hidden = true; app.hidden = false; signout.hidden = false;
  await loadAdminData();
  resetEditor();
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
db.auth.onAuthStateChange((_event, session) => setTimeout(() => authorize(session), 0));
db.auth.getSession().then(({ data }) => authorize(data.session));
