const store = window.NeoRealmWebProjects;
const list = document.querySelector('[data-admin-project-list]');
const form = document.querySelector('[data-project-editor]');
const count = document.querySelector('[data-project-count]');
const status = document.querySelector('[data-admin-status]');
const coverPreview = document.querySelector('[data-cover-preview]');
const coverEmpty = document.querySelector('[data-cover-empty]');
const lightboxPreview = document.querySelector('[data-lightbox-preview]');
const lightboxEmpty = document.querySelector('[data-lightbox-empty]');
const editorTitle = document.querySelector('[data-editor-title]');
const deleteButton = document.querySelector('[data-delete-project]');
const categorySelect = form?.elements.category;
let projects = store?.get() || [];
let uploadedCoverImage = '';
let uploadedLightboxImage = '';
let draggedId = '';

const categoryLabel = (value) => store.categories.find((category) => category.value === value)?.label || value;
const icons = {
  drag: '<svg aria-hidden="true" viewBox="0 0 20 24"><path d="M6 5h.01M14 5h.01M6 12h.01M14 12h.01M6 19h.01M14 19h.01" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.4" /></svg>',
  up: '<svg aria-hidden="true" viewBox="0 0 20 20"><path d="m5 11 5-5 5 5M10 6v9" fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="1.5" /></svg>',
  down: '<svg aria-hidden="true" viewBox="0 0 20 20"><path d="m5 9 5 5 5-5M10 14V5" fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="1.5" /></svg>',
  delete: '<svg aria-hidden="true" viewBox="0 0 20 20"><path d="M4.5 6h11M8 3.5h4M6 6l.65 10h6.7L14 6M8.25 8.5v5M11.75 8.5v5" fill="none" stroke="currentColor" stroke-linecap="square" stroke-linejoin="round" stroke-width="1.35" /></svg>',
};

function announce(message, error = false) {
  status.textContent = message;
  status.classList.toggle('is-error', error);
}

function setPreview(preview, empty, source = '') {
  if (source) preview.src = source;
  else preview.removeAttribute('src');
  preview.hidden = !source;
  empty.hidden = Boolean(source);
}

function resetEditor() {
  form.reset();
  form.elements.id.value = '';
  categorySelect.value = store.categories[0].value;
  uploadedCoverImage = '';
  uploadedLightboxImage = '';
  setPreview(coverPreview, coverEmpty);
  setPreview(lightboxPreview, lightboxEmpty);
  editorTitle.textContent = '新增作品';
  deleteButton.hidden = true;
  announce('');
  list.querySelectorAll('.admin-project-item').forEach((item) => item.classList.remove('is-active'));
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
  uploadedCoverImage = project.coverImage;
  uploadedLightboxImage = project.lightboxImage;
  setPreview(coverPreview, coverEmpty, project.coverImage);
  setPreview(lightboxPreview, lightboxEmpty, project.lightboxImage);
  editorTitle.textContent = `編輯｜${project.title}`;
  deleteButton.hidden = false;
  list.querySelectorAll('.admin-project-item').forEach((item) => item.classList.toggle('is-active', item.dataset.projectId === id));
  document.querySelector('.project-editor-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function saveProjects(message) {
  try {
    projects = store.save(projects);
    renderList();
    announce(message);
    return true;
  } catch (error) {
    announce(error.name === 'QuotaExceededError' ? '圖片容量超過瀏覽器限制，請改用較小的圖片。' : error.message, true);
    return false;
  }
}

function moveProject(id, offset) {
  const index = projects.findIndex((project) => project.id === id);
  const nextIndex = index + offset;
  if (index < 0 || nextIndex < 0 || nextIndex >= projects.length) return;
  [projects[index], projects[nextIndex]] = [projects[nextIndex], projects[index]];
  saveProjects('作品順序已更新。');
}

function deleteProject(id) {
  const project = projects.find((item) => item.id === id);
  if (!project) return;
  if (projects.length <= 1) {
    announce('至少需要保留一個網站作品。', true);
    return;
  }
  if (!window.confirm(`確定刪除「${project.title}」？`)) return;

  const previousProjects = projects;
  const wasEditing = form.elements.id.value === id;
  projects = projects.filter((item) => item.id !== id);
  if (!saveProjects('作品已刪除。')) {
    projects = previousProjects;
    renderList();
    return;
  }
  if (wasEditing) {
    resetEditor();
    announce('作品已刪除。');
  }
}

function renderList() {
  list.textContent = '';
  count.textContent = `${projects.length} projects · drag or use arrows`;

  projects.forEach((project, index) => {
    const item = document.createElement('article');
    item.className = 'admin-project-item';
    item.dataset.projectId = project.id;
    item.draggable = true;

    const handle = document.createElement('span');
    handle.className = 'drag-handle';
    handle.innerHTML = icons.drag;
    handle.setAttribute('aria-hidden', 'true');

    const image = document.createElement('img');
    image.className = 'project-thumb';
    image.src = project.coverImage;
    image.alt = '';

    const copy = document.createElement('button');
    copy.className = 'project-item-copy';
    copy.type = 'button';
    copy.innerHTML = `<strong></strong><span></span>`;
    copy.querySelector('strong').textContent = project.title;
    copy.querySelector('span').textContent = categoryLabel(project.category);
    copy.addEventListener('click', () => editProject(project.id));

    const order = document.createElement('div');
    order.className = 'project-order-actions';
    const up = document.createElement('button');
    const down = document.createElement('button');
    up.type = down.type = 'button';
    up.innerHTML = icons.up;
    down.innerHTML = icons.down;
    up.setAttribute('aria-label', `將 ${project.title} 往前移`);
    down.setAttribute('aria-label', `將 ${project.title} 往後移`);
    up.disabled = index === 0;
    down.disabled = index === projects.length - 1;
    up.addEventListener('click', () => moveProject(project.id, -1));
    down.addEventListener('click', () => moveProject(project.id, 1));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'project-delete-action';
    remove.innerHTML = icons.delete;
    remove.setAttribute('aria-label', `刪除 ${project.title}`);
    remove.disabled = projects.length <= 1;
    remove.addEventListener('click', () => deleteProject(project.id));
    order.append(up, down, remove);

    item.addEventListener('dragstart', () => {
      draggedId = project.id;
      item.classList.add('is-dragging');
    });
    item.addEventListener('dragend', () => {
      draggedId = '';
      item.classList.remove('is-dragging');
    });
    item.addEventListener('dragover', (event) => event.preventDefault());
    item.addEventListener('drop', (event) => {
      event.preventDefault();
      if (!draggedId || draggedId === project.id) return;
      const from = projects.findIndex((entry) => entry.id === draggedId);
      const to = projects.findIndex((entry) => entry.id === project.id);
      const [moved] = projects.splice(from, 1);
      projects.splice(to, 0, moved);
      saveProjects('作品順序已更新。');
    });

    item.append(handle, image, copy, order);
    list.append(item);
  });
}

function compressImage(file, { width, height, maxWidth, maxHeight = Number.POSITIVE_INFINITY, crop = false }) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('無法讀取圖片。'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('圖片格式無法處理。'));
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (crop) {
          const sourceRatio = image.naturalWidth / image.naturalHeight;
          const targetRatio = width / height;
          const sourceWidth = sourceRatio > targetRatio ? image.naturalHeight * targetRatio : image.naturalWidth;
          const sourceHeight = sourceRatio > targetRatio ? image.naturalHeight : image.naturalWidth / targetRatio;
          const sourceX = (image.naturalWidth - sourceWidth) / 2;
          const sourceY = (image.naturalHeight - sourceHeight) / 2;
          canvas.width = width;
          canvas.height = height;
          context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
        } else {
          const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
          canvas.width = Math.round(image.naturalWidth * scale);
          canvas.height = Math.round(image.naturalHeight * scale);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
        resolve(canvas.toDataURL('image/jpeg', crop ? 0.86 : 0.8));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

store.categories.forEach((category) => {
  const option = document.createElement('option');
  option.value = category.value;
  option.textContent = category.label;
  categorySelect.append(option);
});

form.elements.coverFile.addEventListener('change', async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  announce('圖片處理中…');
  try {
    uploadedCoverImage = await compressImage(file, { width: 600, height: 650, crop: true });
    setPreview(coverPreview, coverEmpty, uploadedCoverImage);
    announce('600 × 650 封面已準備完成。');
  } catch (error) {
    announce(error.message, true);
  }
});

form.elements.lightboxFile.addEventListener('change', async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  announce('長圖處理中…');
  try {
    uploadedLightboxImage = await compressImage(file, { maxWidth: 1400 });
    setPreview(lightboxPreview, lightboxEmpty, uploadedLightboxImage);
    announce('燈箱長圖已準備完成。');
  } catch (error) {
    announce(error.message, true);
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const id = form.elements.id.value || `project-${Date.now()}`;
  const existingIndex = projects.findIndex((project) => project.id === id);
  if (!uploadedCoverImage || !uploadedLightboxImage) {
    announce('每個作品都需要一張 600 × 650 封面與一張完整長圖。', true);
    return;
  }
  const project = {
    id,
    title: form.elements.title.value.trim(),
    description: form.elements.description.value.trim(),
    category: form.elements.category.value,
    coverImage: uploadedCoverImage,
    lightboxImage: uploadedLightboxImage,
    image: uploadedCoverImage,
    alt: form.elements.alt.value.trim(),
    projectUrl: form.elements.projectUrl.value.trim(),
  };
  if (existingIndex >= 0) projects[existingIndex] = project;
  else projects.push(project);
  saveProjects(existingIndex >= 0 ? '作品已更新，前台分頁將自動重新載入。' : '作品已新增，前台分頁將自動重新載入。');
  editProject(id);
});

deleteButton.addEventListener('click', () => {
  deleteProject(form.elements.id.value);
});

document.querySelector('[data-add-project]').addEventListener('click', resetEditor);
document.querySelector('[data-cancel-edit]').addEventListener('click', resetEditor);

renderList();
resetEditor();
