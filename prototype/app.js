const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = {
  a: document.querySelector('#panel-a'),
  b: document.querySelector('#panel-b'),
};
const switcher = document.querySelector('#prototype-switcher');
const switcherToggle = document.querySelector('.prototype-switcher-toggle');

function setSwitcher(open) {
  if (!switcher || !switcherToggle) return;
  switcher.classList.toggle('is-open', open);
  switcher.setAttribute('aria-hidden', String(!open));
  switcherToggle.setAttribute('aria-expanded', String(open));
}

function activateDirection(direction, moveFocus = false) {
  const target = direction === 'b' ? 'b' : 'a';
  document.body.dataset.direction = target;

  tabs.forEach((tab) => {
    const selected = tab.dataset.target === target;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && moveFocus) tab.focus();
  });

  Object.entries(panels).forEach(([key, panel]) => {
    panel.hidden = key !== target;
  });

  const mainId = target === 'a' ? 'panel-a' : 'panel-b';
  document.querySelector('.skip-link').setAttribute('href', `#${mainId}`);
  window.history.replaceState(null, '', `#direction-${target}`);
  window.scrollTo({ top: 0, behavior: 'auto' });
  window.dispatchEvent(new CustomEvent('directionchange', { detail: target }));
  setSwitcher(false);
}

switcherToggle?.addEventListener('click', () => {
  setSwitcher(switcherToggle.getAttribute('aria-expanded') !== 'true');
});

document.addEventListener('pointerdown', (event) => {
  if (!switcher?.classList.contains('is-open')) return;
  if (switcher.contains(event.target) || switcherToggle?.contains(event.target)) return;
  setSwitcher(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !switcher?.classList.contains('is-open')) return;
  setSwitcher(false);
  switcherToggle?.focus();
});

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateDirection(tab.dataset.target));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    activateDirection(tabs[nextIndex].dataset.target, true);
  });
});

const initialDirection = window.location.hash === '#direction-a' ? 'a' : 'b';
activateDirection(initialDirection);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const galleryMetadata = {
  'ig-01': ['Cinematic Worldbuilding', 'Dark fantasy, character direction, and a cinematic world built as one frame.'],
  'ig-02': ['Identity in Progress', 'Early lettering studies and visual notes from the evolving NeoRealm LAB identity.'],
  'ig-03': ['AI Art Direction', 'A digital-making scene that connects image generation with a directed visual system.'],
  'ig-04': ['Seasonal Narrative', 'A Mid-Autumn scene shaped through character, prop, and campaign storytelling.'],
  'ig-05': ['Sport Editorial', 'Youth culture and sports styling translated into a social-first portrait.'],
  'ig-06': ['Synthetic Portraits', 'A cool-toned character study exploring identity, surface, and artificial light.'],
  'ig-07': ['Character Play', 'An expressive cat portrait built for immediate, playful recognition.'],
  'ig-08': ['Fashion System', 'A restrained lookbook study of silhouette, styling, and repeatable art direction.'],
  'ig-09': ['Illustrated Characters', 'A vivid hand-painted cat study with a graphic campaign presence.'],
  'ig-10': ['Lunar Story', 'A moonlit festival image combining character direction and narrative atmosphere.'],
  'ig-11': ['Material Portraits', 'Gold fracture and translucent surface treatments reshape a human portrait.'],
  'ig-12': ['Natural Light Editorial', 'A quiet portrait study led by daylight, texture, and understated styling.'],
  'ig-13': ['Denim Study', 'A fashion portrait organized around proportion, attitude, and denim texture.'],
  'ig-14': ['Everyday Editorial', 'Food, gesture, and portraiture turned into a direct editorial moment.'],
  'ig-15': ['Street Fashion Realm', 'Black styling and motorcycles create a sharper urban character world.'],
  'ig-16': ['Surreal Editorial', 'Color, bubbles, and goldfish build a soft but uncanny visual atmosphere.'],
  'ig-17': ['Pop Persona', 'A pink-haired music character developed through styling and expressive detail.'],
  'ig-18': ['Chromatic Portrait', 'Colored light transforms a simple portrait into a cinematic identity study.'],
  'ig-19': ['Product Narrative', 'Portrait and perfume are directed as one coherent beauty campaign image.'],
  'ig-20': ['Food & Color', 'A bright food editorial balancing personality, product, and graphic color.'],
};

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function setupKv() {
  const section = document.querySelector('[data-kv]');
  const video = section?.querySelector('.kv-video');
  const scrollCue = section?.querySelector('.kv-scroll-cue');
  if (!section || !video) return;

  const playbackStart = 6.2;
  let inView = true;
  let frame = 0;

  const syncPlayback = () => {
    const shouldPlay = inView && !document.hidden && document.body.dataset.direction === 'b' && !reducedMotion.matches;
    if (shouldPlay) video.play().catch(() => {});
    else video.pause();
    if (!shouldPlay) section.classList.remove('is-video-live');
  };

  const updateKv = () => {
    frame = 0;
    if (reducedMotion.matches) return;
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    const start = section.getBoundingClientRect().top + window.scrollY;
    const progress = clamp((window.scrollY - start) / travel);
    const mainExit = clamp((progress - 0.08) / 0.38);
    const revealEnter = clamp((progress - 0.42) / 0.3);

    section.style.setProperty('--kv-scale', String(1.04 + progress * 0.07));
    section.style.setProperty('--kv-y', `${progress * -26}px`);
    section.style.setProperty('--kv-main-opacity', String(1 - mainExit));
    section.style.setProperty('--kv-main-y', `${mainExit * -76}px`);
    section.style.setProperty('--kv-reveal-opacity', String(revealEnter));
    section.style.setProperty('--kv-reveal-y', `${(1 - revealEnter) * 40}px`);
    if (scrollCue) scrollCue.style.opacity = String(1 - clamp(progress / 0.18));
  };

  const requestKvUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(updateKv);
  };

  video.addEventListener('timeupdate', () => {
    section.classList.toggle('is-video-live', !reducedMotion.matches && video.currentTime >= playbackStart);
  });

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncPlayback();
  }, { threshold: 0.02 }).observe(section);

  document.addEventListener('visibilitychange', syncPlayback);
  window.addEventListener('directionchange', syncPlayback);
  reducedMotion.addEventListener('change', () => {
    syncPlayback();
    updateKv();
  });
  window.addEventListener('scroll', requestKvUpdate, { passive: true });
  window.addEventListener('resize', requestKvUpdate);
  updateKv();
  syncPlayback();
}

function setupStudioStory() {
  const steps = Array.from(document.querySelectorAll('[data-studio-step]'));
  const images = Array.from(document.querySelectorAll('[data-studio-image]'));
  const index = document.querySelector('.studio-image-index');
  if (!steps.length || !images.length) return;

  const activate = (activeIndex) => {
    steps.forEach((step, itemIndex) => {
      step.classList.toggle('is-active', itemIndex === activeIndex);
      step.classList.toggle('is-before', itemIndex > activeIndex);
      step.classList.toggle('is-past', itemIndex < activeIndex);
    });
    images.forEach((image, itemIndex) => {
      const selected = itemIndex === activeIndex;
      image.classList.toggle('is-active', selected);
      image.setAttribute('aria-hidden', String(!selected));
    });
    if (index) index.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
  };

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) activate(Number(visible.target.dataset.studioStep));
  }, { rootMargin: '-28% 0px -34% 0px', threshold: [0.05, 0.35, 0.7] });

  steps.forEach((step) => observer.observe(step));
  activate(0);
}

function setupTextMotion() {
  const groups = [
    document.querySelector('.waterfall-copy-sticky'),
    document.querySelector('.b-service-title'),
    ...document.querySelectorAll('.service-sequence article'),
    document.querySelector('.archive-copy-sticky'),
    document.querySelector('.contact-copy'),
  ].filter(Boolean);

  if (!groups.length) return;

  const setState = (group, state) => {
    group.classList.toggle('is-in-view', state === 'active');
    group.classList.toggle('is-before', state === 'before');
    group.classList.toggle('is-past', state === 'past');
  };

  groups.forEach((group) => {
    group.dataset.textMotionGroup = '';
    Array.from(group.children).forEach((item, index) => {
      item.dataset.textMotion = '';
      item.style.setProperty('--text-motion-order', String(Math.min(index, 3)));
    });

    const rect = group.getBoundingClientRect();
    if (rect.bottom < window.innerHeight * 0.12) setState(group, 'past');
    else if (rect.top > window.innerHeight * 0.88) setState(group, 'before');
    else setState(group, 'active');
  });

  let frame = 0;
  const refresh = () => {
    frame = 0;
    const enterTop = window.innerHeight * 0.12;
    const enterBottom = window.innerHeight * 0.88;
    groups.forEach((group) => {
      const rect = group.getBoundingClientRect();
      if (rect.bottom < enterTop) setState(group, 'past');
      else if (rect.top > enterBottom) setState(group, 'before');
      else setState(group, 'active');
    });
  };

  const requestRefresh = () => {
    if (!frame) frame = window.requestAnimationFrame(refresh);
  };

  window.addEventListener('scroll', requestRefresh, { passive: true });
  window.addEventListener('resize', requestRefresh);
  refresh();
  document.documentElement.classList.add('text-motion-ready');
}

function setupActiveNavigation() {
  const links = Array.from(document.querySelectorAll('.b-nav .site-links a[href^="#"]'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean)
    .sort((a, b) => a.offsetTop - b.offsetTop);
  if (!links.length || !sections.length) return;

  let frame = 0;
  const refresh = () => {
    frame = 0;
    let activeId = '';
    if (window.scrollY > 180) {
      const marker = window.innerHeight * 0.34;
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= marker) activeId = section.id;
      });
    }

    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const requestRefresh = () => {
    if (!frame) frame = window.requestAnimationFrame(refresh);
  };

  window.addEventListener('scroll', requestRefresh, { passive: true });
  window.addEventListener('resize', requestRefresh);
  window.addEventListener('directionchange', requestRefresh);
  refresh();
}

function setupRandomizedGallery() {
  const railTrack = document.querySelector('.instagram-rail-track');
  const tiles = Array.from(railTrack?.querySelectorAll('.instagram-tile') || []);
  const cards = Array.from(document.querySelectorAll('.b-waterfall .waterfall-card'));
  if (!railTrack || !tiles.length || !cards.length) return;

  const catalog = tiles.map((tile) => {
    const image = tile.querySelector('img');
    const src = image?.getAttribute('src') || '';
    const key = src.match(/ig-\d+/)?.[0] || '';
    const [title, description] = galleryMetadata[key] || ['NeoRealm LAB Visual', 'An ongoing visual experiment from NeoRealm LAB.'];
    const item = {
      src,
      width: image?.getAttribute('width') || '864',
      height: image?.getAttribute('height') || '1080',
      alt: image?.alt || title,
      title,
      description,
    };
    Object.assign(tile.dataset, item);
    tile.setAttribute('aria-label', `放大查看 ${title}`);
    return { ...item, tile };
  });

  const selection = shuffle(catalog).slice(0, cards.length);
  cards.forEach((card, index) => {
    const item = selection[index];
    const imageWrap = card.querySelector('.waterfall-image');
    const image = imageWrap?.querySelector('img');
    if (!item || !imageWrap || !image) return;

    image.src = item.src;
    image.width = Number(item.width);
    image.height = Number(item.height);
    image.alt = item.alt;
    imageWrap.style.setProperty('--ig-image', `url("${item.src}")`);
    Object.assign(card.dataset, item);

    let trigger = card.querySelector('.work-lightbox-trigger');
    if (!trigger) {
      trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'work-lightbox-trigger';
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.setAttribute('aria-controls', 'work-lightbox');
      card.append(trigger);
    }
    trigger.setAttribute('aria-label', `放大查看 ${item.title}`);
  });

  shuffle(catalog).forEach(({ tile }) => railTrack.append(tile));
}

function setupWorkLightbox() {
  const dialog = document.querySelector('#work-lightbox');
  const closeButton = dialog?.querySelector('[data-lightbox-close]');
  const image = dialog?.querySelector('[data-lightbox-image]');
  const title = dialog?.querySelector('[data-lightbox-title]');
  const description = dialog?.querySelector('[data-lightbox-description]');
  const sources = [
    ...document.querySelectorAll('.work-lightbox-trigger'),
    ...document.querySelectorAll('.instagram-tile'),
  ];
  let trigger = null;
  if (!dialog || !closeButton || !image || !title || !description || !sources.length) return;

  const open = (source) => {
    const item = source.classList.contains('instagram-tile') ? source.dataset : source.closest('.waterfall-card')?.dataset;
    if (!item?.src) return;
    trigger = source;
    image.src = item.src;
    image.alt = item.alt || item.title;
    title.textContent = item.title;
    description.textContent = item.description;
    dialog.showModal();
    document.body.classList.add('work-lightbox-open');
    window.requestAnimationFrame(() => {
      dialog.classList.add('is-visible');
      closeButton.focus({ preventScroll: true });
    });
  };

  const close = () => {
    dialog.classList.remove('is-visible');
    document.body.classList.remove('work-lightbox-open');
    const finish = () => {
      if (dialog.open) dialog.close();
      trigger?.focus({ preventScroll: true });
    };
    if (reducedMotion.matches) finish();
    else window.setTimeout(finish, 260);
  };

  sources.forEach((source) => {
    source.addEventListener('click', (event) => {
      event.preventDefault();
      open(source);
    });
  });
  closeButton.addEventListener('click', close);
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener('pointerdown', (event) => {
    if (event.target === dialog) close();
  });
}

function setupInstagramWheel() {
  const viewport = document.querySelector('.instagram-rail-viewport');
  if (!viewport) return;

  viewport.addEventListener('wheel', (event) => {
    if (window.innerWidth <= 720 || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const movingForward = event.deltaY > 0;
    const canMove = movingForward ? viewport.scrollLeft < maxScroll - 1 : viewport.scrollLeft > 1;
    if (!canMove) return;

    event.preventDefault();
    viewport.scrollLeft += event.deltaY;
  }, { passive: false });
}

function setupWaterfallMotion() {
  const sections = Array.from(document.querySelectorAll('[data-waterfall-section]'));
  if (!sections.length) return;
  let frame = 0;

  const render = () => {
    frame = 0;
    if (reducedMotion.matches || window.innerWidth <= 720) {
      document.querySelectorAll('[data-waterfall-column]').forEach((column) => {
        column.style.setProperty('--column-shift', '0px');
      });
      document.querySelectorAll('[data-trail-card]').forEach((card) => {
        card.style.setProperty('--depth-shift', '0px');
        card.style.setProperty('--perspective-x', '0px');
      });
      return;
    }

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const progress = clamp((window.innerHeight - rect.top) / (rect.height + window.innerHeight));
      const columnRange = Number(section.dataset.columnRange || 420);
      const depthRange = Number(section.dataset.depthRange || 46);

      section.querySelectorAll('[data-waterfall-column]').forEach((column) => {
        const speed = Number(column.dataset.speed || 1);
        const shift = (progress - 0.5) * (speed - 0.9) * columnRange;
        column.style.setProperty('--column-shift', `${shift.toFixed(2)}px`);
      });

      section.querySelectorAll('[data-trail-card]').forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const depth = Number(card.dataset.depth || 0.6);
        const driftX = Number(card.dataset.driftX || 0);
        const centerDelta = window.innerHeight / 2 - (cardRect.top + cardRect.height / 2);
        const shift = clamp(centerDelta * 0.045 * depth, -depthRange, depthRange);
        const lateralShift = clamp(centerDelta * driftX, -38, 38);
        card.style.setProperty('--depth-shift', `${shift.toFixed(2)}px`);
        card.style.setProperty('--perspective-x', `${lateralShift.toFixed(2)}px`);
      });
    });
  };

  const requestRender = () => {
    if (!frame) frame = window.requestAnimationFrame(render);
  };

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender);
  reducedMotion.addEventListener('change', requestRender);
  render();
}

function setupImageTrails() {
  const cards = Array.from(document.querySelectorAll('[data-trail-card]'));

  cards.forEach((card) => {
    const image = card.querySelector(':scope > img');
    if (image && !card.querySelector('.trail-clone')) {
      const clone = image.cloneNode();
      clone.className = 'trail-clone';
      clone.alt = '';
      clone.setAttribute('aria-hidden', 'true');
      card.append(clone);
    }

    const reset = () => {
      card.style.setProperty('--media-x', '0px');
      card.style.setProperty('--media-y', '0px');
      card.style.setProperty('--trail-x', '0px');
      card.style.setProperty('--trail-y', '0px');
      card.style.setProperty('--trail-opacity', '0');
    };

    card.addEventListener('pointermove', (event) => {
      if (!finePointer.matches || reducedMotion.matches || window.innerWidth <= 720) return;
      const rect = card.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = clamp((event.clientY - rect.top) / rect.height) * 2 - 1;
      const depth = Number(card.dataset.depth || 0.7);
      card.style.setProperty('--media-x', `${(x * 8 * depth).toFixed(2)}px`);
      card.style.setProperty('--media-y', `${(y * 5 * depth).toFixed(2)}px`);
      card.style.setProperty('--trail-x', `${(-x * 42 * depth).toFixed(2)}px`);
      card.style.setProperty('--trail-y', `${(-y * 26 * depth).toFixed(2)}px`);
      card.style.setProperty('--trail-opacity', '0.56');
    });
    card.addEventListener('pointerleave', reset);
    reset();
  });
}

function setupProjectDialog() {
  const dialog = document.querySelector('#project-dialog');
  const openers = Array.from(document.querySelectorAll('[data-project-open]'));
  const closeButton = dialog?.querySelector('[data-project-close]');
  const form = dialog?.querySelector('[data-project-form]');
  const scroller = dialog?.querySelector('.project-dialog-scroll');
  const status = dialog?.querySelector('[data-form-status]');
  const submit = form?.querySelector('.project-submit');
  const submitLabel = submit?.querySelector('span');
  const serviceSelect = form?.querySelector('#project-service');
  const nameInput = form?.querySelector('#project-name');
  let trigger = null;

  if (!dialog || !form || !openers.length) return;

  const openDialog = (opener) => {
    trigger = opener;
    if (status && submit && submitLabel && !status.classList.contains('is-sending')) {
      status.className = 'project-form-status form-field-wide';
      status.textContent = '';
      submit.disabled = false;
      submitLabel.textContent = '送出專案需求';
    }
    dialog.showModal();
    document.body.classList.add('project-dialog-open');
    if (scroller) scroller.scrollTop = 0;
    window.requestAnimationFrame(() => {
      dialog.classList.add('is-visible');
      closeButton?.focus({ preventScroll: true });
    });
  };

  const closeDialog = () => {
    dialog.classList.remove('is-visible');
    document.body.classList.remove('project-dialog-open');
    const finish = () => {
      if (dialog.open) dialog.close();
      trigger?.focus();
    };
    if (reducedMotion.matches) finish();
    else window.setTimeout(finish, 280);
  };

  openers.forEach((opener) => opener.addEventListener('click', () => openDialog(opener)));
  closeButton?.addEventListener('click', closeDialog);

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog();
  });

  dialog.addEventListener('pointerdown', (event) => {
    if (event.target === dialog) closeDialog();
  });

  dialog.querySelectorAll('[data-plan-select]').forEach((button) => {
    button.addEventListener('click', () => {
      if (serviceSelect) serviceSelect.value = button.dataset.planSelect;
      form.closest('.project-inquiry')?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(() => nameInput?.focus({ preventScroll: true }), reducedMotion.matches ? 0 : 420);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity() || !submit || !submitLabel || !status) return;

    submit.disabled = true;
    submitLabel.textContent = '傳送中…';
    status.className = 'project-form-status form-field-wide is-sending';
    status.textContent = '正在安全傳送需求資料…';

    const payload = Object.fromEntries(new FormData(form).entries());
    payload._url = window.location.href;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error('Submission failed');

      form.reset();
      status.className = 'project-form-status form-field-wide is-success';
      status.textContent = '需求已送出。我會閱讀內容，並回覆到你填寫的 Email。';
      submitLabel.textContent = '已送出';
    } catch (error) {
      status.className = 'project-form-status form-field-wide is-error';
      status.textContent = '目前無法送出。請稍後再試，或直接寄信至 kasseyworks@gmail.com。';
      submit.disabled = false;
      submitLabel.textContent = '重新送出';
    }
  });
}

setupKv();
setupStudioStory();
setupTextMotion();
setupActiveNavigation();
setupRandomizedGallery();
setupWaterfallMotion();
setupImageTrails();
setupWorkLightbox();
setupInstagramWheel();
setupProjectDialog();
