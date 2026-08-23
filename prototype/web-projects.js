(function setupWebProjectStore(global) {
  const STORAGE_KEY = 'neorealm.webProjects.v1';
  const categories = [
    { value: 'brand', label: 'Brand Website' },
    { value: 'campaign', label: 'Campaign' },
  ];

  const defaults = [
    {
      id: 'duopel',
      title: 'Duopel',
      description: 'Responsive product website',
      category: 'brand',
      image: './assets/archive-duopel.jpg',
      alt: 'Duopel 響應式產品網站畫面',
      layout: 'tall',
      detail: true,
      detailPosition: '70% 30%',
    },
    {
      id: 'echarm',
      title: '醫創網',
      description: 'Healthcare service platform',
      category: 'campaign',
      image: './assets/archive-echarm.jpg',
      alt: '醫創網服務平台網站畫面',
      layout: 'medium',
    },
    {
      id: 'marryu',
      title: 'MarryU × Peggy Yu',
      description: 'Content and service website',
      category: 'campaign',
      image: './assets/archive-marryu.jpg',
      alt: 'MarryU 與 Peggy Yu 婚禮服務網站畫面',
      layout: 'wide',
      detail: true,
      detailPosition: '30% 80%',
    },
    {
      id: 'gama-bears',
      title: 'GAMA BEARS 橘子熊',
      description: 'Brand website',
      category: 'brand',
      image: './assets/archive-gama-bears.jpg',
      alt: 'GAMA BEARS 橘子熊網站畫面',
      layout: 'tall',
    },
  ];

  const copy = (value) => JSON.parse(JSON.stringify(value));

  const normalize = (projects) => projects
    .filter((project) => project && project.id && project.title && project.image)
    .map((project, index) => ({
      id: String(project.id),
      title: String(project.title),
      description: String(project.description || ''),
      category: project.category === 'platform'
        ? 'campaign'
        : categories.some(({ value }) => value === project.category)
          ? project.category
          : 'brand',
      image: String(project.image),
      alt: String(project.alt || `${project.title} 網站作品畫面`),
      layout: ['tall', 'medium', 'wide'].includes(project.layout) ? project.layout : ['tall', 'medium', 'wide'][index % 3],
      detail: Boolean(project.detail),
      detailPosition: String(project.detailPosition || '50% 50%'),
    }));

  const get = () => {
    try {
      const saved = JSON.parse(global.localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved)) {
        const projects = normalize(saved);
        if (projects.length) return projects;
      }
    } catch (error) {
      console.warn('NeoRealm project data could not be read.', error);
    }
    return copy(defaults);
  };

  const save = (projects) => {
    const normalized = normalize(projects);
    if (!normalized.length) throw new Error('至少需要保留一個網站作品。');
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return copy(normalized);
  };

  const reset = () => {
    global.localStorage.removeItem(STORAGE_KEY);
    return copy(defaults);
  };

  global.NeoRealmWebProjects = {
    STORAGE_KEY,
    categories: copy(categories),
    defaults: copy(defaults),
    get,
    save,
    reset,
  };
}(window));
