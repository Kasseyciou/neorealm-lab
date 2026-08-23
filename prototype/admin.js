const store = window.NeoRealmWebProjects;
const list = document.querySelector('[data-admin-project-list]');
const form = document.querySelector('[data-project-editor]');
const count = document.querySelector('[data-project-count]');
const status = document.querySelector('[data-admin-status]');
const preview = document.querySelector('[data-image-preview]');
const emptyPreview = document.querySelector('[data-image-empty]');
const editorTitle = document.querySelector('[data-editor-title]');
const deleteButton = document.querySelector('[data-delete-project]');
const categorySelect = form?.elements.category;
let projects = store?.get() || [];
let uploadedImage = '';
let draggedId = '';

const categoryLabel = (value) => store.categories.find((category) => category.value === value)?.label || value;
const icons = {
  drag: '<svg aria-hidden="true" viewBox="0 0 20 24"><path d="M6 5h.01M14 5h.01M6 12h.01M14 12h.01M6 19h.01M14 19h.01" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.4" /></svg>',
  up: '<svg aria-hidden="true" viewBox="0 0 20 20"><path d="m5 11 5-5 5 5M10 6v9" fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="1.5" /></svg>',
  down: '<svg aria-hidden="true" viewBox="0 0 20 20"><path d="m5 9 5 5 5-5M10 14V5" fill="none" stroke="currentColor" stroke-linecap="square" stroke-width="1.5" /></svg>',
};

function announce(message, error = false) {
  status.textContent = message;
  status.classList.toggle('is-error', error);
}

function setPreview(source = '') {
  preview.src = source;
  preview.hidden = !source;
  emptyPreview.hidden = Boolean(source);
}

function resetEditor() {
  form.reset();
  form.elements.id.value = '';
  form.elements.layout.value = 'tall';
  categorySelect.value = store.categories[0].value;
  uploadedImage = '';
  setPreview();
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
  form.elements.layout.value = project.layout;
  form.elements.detail.checked = project.detail;
  uploadedImage = project.image;
  setPreview(project.image);
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
  } catch (error) {
    announce(error.name === 'QuotaExceededError' ? '圖片容量超過瀏覽器限制，請改用較小的圖片。' : error.message, true);
  }
}

function moveProject(id, offset) {
  const index = projects.findIndex((project) => project.id === id);
  const nextIndex = index + offset;
  if (index < 0 || nextIndex < 0 || nextIndex >= projects.length) return;
  [projects[index], projects[nextIndex]] = [projects[nextIndex], projects[index]];
  saveProjects('作品順序已更新。');
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
    image.src = project.image;
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
    order.append(up, down);

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

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('無法讀取圖片。'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('圖片格式無法處理。'));
      image.onload = () => {
        const maxSize = 1600;
        const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.naturalWidth * scale);
        canvas.height = Math.round(image.naturalHeight * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
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

form.elements.imageFile.addEventListener('change', async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  announce('圖片處理中…');
  try {
    uploadedImage = await compressImage(file);
    setPreview(uploadedImage);
    announce('圖片已準備完成，請儲存作品。');
  } catch (error) {
    announce(error.message, true);
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const id = form.elements.id.value || `project-${Date.now()}`;
  const existingIndex = projects.findIndex((project) => project.id === id);
  if (!uploadedImage) {
    announce('請先上傳作品圖片。', true);
    return;
  }
  const project = {
    id,
    title: form.elements.title.value.trim(),
    description: form.elements.description.value.trim(),
    category: form.elements.category.value,
    image: uploadedImage,
    alt: form.elements.alt.value.trim(),
    layout: form.elements.layout.value,
    detail: form.elements.detail.checked,
    detailPosition: existingIndex >= 0 ? projects[existingIndex].detailPosition : '50% 50%',
  };
  if (existingIndex >= 0) projects[existingIndex] = project;
  else projects.push(project);
  saveProjects(existingIndex >= 0 ? '作品已更新，前台分頁將自動重新載入。' : '作品已新增，前台分頁將自動重新載入。');
  editProject(id);
});

deleteButton.addEventListener('click', () => {
  const id = form.elements.id.value;
  const project = projects.find((item) => item.id === id);
  if (!project || !window.confirm(`確定刪除「${project.title}」？`)) return;
  projects = projects.filter((item) => item.id !== id);
  saveProjects('作品已刪除。');
  resetEditor();
});

document.querySelector('[data-add-project]').addEventListener('click', resetEditor);
document.querySelector('[data-cancel-edit]').addEventListener('click', resetEditor);
document.querySelector('[data-reset-projects]').addEventListener('click', () => {
  if (!window.confirm('確定恢復四筆預設作品？目前的本機修改會被覆蓋。')) return;
  projects = store.reset();
  renderList();
  resetEditor();
  announce('已恢復預設作品。');
});

renderList();
resetEditor();
