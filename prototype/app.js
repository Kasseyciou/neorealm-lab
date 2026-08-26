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

function setMediaLoadingState(container, image) {
  if (!container || !image) return;

  const settle = () => {
    container.classList.remove('is-media-loading');
    container.classList.add('is-media-ready');
  };

  container.classList.remove('is-media-ready');
  container.classList.add('is-media-loading');
  image.addEventListener('load', settle, { once: true });
  image.addEventListener('error', settle, { once: true });

  // Cached images do not always emit a new load event after they are inserted.
  queueMicrotask(() => {
    if (image.complete && image.naturalWidth) settle();
  });
}

async function hydrateInstagramFeed() {
  const railTrack = document.querySelector('.instagram-rail-track');
  if (!railTrack) return false;

  try {
    let items = [];
    try {
      items = await window.NeoRealmSupabase?.getInstagramFeed?.() || [];
    } catch (error) {
      console.warn('Supabase Instagram library unavailable; trying the deployed feed snapshot.', error);
    }
    if (!items.length) {
      const response = await fetch('./data/instagram-feed.json', { cache: 'no-store' });
      if (response.ok) {
        const feed = await response.json();
        items = Array.isArray(feed.items) ? feed.items : [];
      }
    }
    if (!items.length) return false;
    let titleOverrides = {};
    try {
      titleOverrides = await window.NeoRealmSupabase?.getInstagramTitles?.() || {};
    } catch {
      try { titleOverrides = JSON.parse(localStorage.getItem('neorealm-instagram-titles-v1') || '{}'); } catch { titleOverrides = {}; }
    }

    const fragment = document.createDocumentFragment();
    items.slice(0, 20).forEach((item) => {
      if (!item?.src || !item?.permalink) return;
      const tile = document.createElement('a');
      tile.className = 'instagram-tile';
      tile.href = item.permalink;
      tile.target = '_blank';
      tile.rel = 'noreferrer';
      tile.classList.toggle('is-reel', item.mediaType === 'VIDEO');
      const displayTitle = String(titleOverrides[item.id] || item.title || 'NeoRealm LAB Visual').trim();
      tile.setAttribute('aria-label', `放大查看 ${displayTitle}`);
      Object.assign(tile.dataset, {
        src: item.src,
        alt: item.alt || item.title || 'NeoRealm LAB Instagram 作品',
        title: displayTitle,
        description: item.description || '',
        mediaType: item.mediaType || 'IMAGE',
        videoSrc: item.videoSrc || '',
        embedSrc: item.mediaType === 'VIDEO' ? `${item.permalink.replace(/\/?$/, '/')}embed/` : '',
        permalink: item.permalink,
        carousel: JSON.stringify(Array.isArray(item.carousel) ? item.carousel : []),
      });

      const image = document.createElement('img');
      image.width = 1080;
      image.height = item.mediaType === 'VIDEO' ? 1920 : 1350;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.alt = tile.dataset.alt;
      image.crossOrigin = 'anonymous';
      setMediaLoadingState(tile, image);
      image.src = item.src;
      tile.append(image);
      if (Array.isArray(item.carousel) && item.carousel.length > 1) {
        tile.classList.add('has-carousel');
        const badge = document.createElement('span');
        badge.className = 'instagram-carousel-badge';
        badge.setAttribute('aria-hidden', 'true');
        badge.innerHTML = '<svg viewBox="0 0 18 18"><rect x="5" y="3" width="10" height="10" fill="none" stroke="currentColor"/><path d="M3 6v9h9" fill="none" stroke="currentColor"/></svg>';
        tile.append(badge);
      }
      fragment.append(tile);
    });

    if (!fragment.childNodes.length) return false;
    railTrack.replaceChildren(fragment);
    railTrack.dataset.feedSource = 'instagram';
    return true;
  } catch (error) {
    console.warn('Live Instagram feed unavailable; using curated fallback.', error);
    return false;
  }
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
    const shouldPlay = inView && !document.hidden && !reducedMotion.matches;
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
  const links = Array.from(document.querySelectorAll('.b-nav .site-links [data-scroll-target]'));
  const sections = links
    .map((link) => document.getElementById(link.dataset.scrollTarget))
    .filter(Boolean)
    .sort((a, b) => a.offsetTop - b.offsetTop);
  if (!links.length || !sections.length) return;

  const initialTarget = links.find((link) => `#${link.dataset.scrollTarget}` === window.location.hash);
  if (initialTarget) {
    window.requestAnimationFrame(() => {
      document.getElementById(initialTarget.dataset.scrollTarget)?.scrollIntoView({ block: 'start' });
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    });
  }

  links.forEach((link) => {
    link.addEventListener('click', () => {
      const section = document.getElementById(link.dataset.scrollTarget);
      section?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      if (window.location.hash) history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    });
  });

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
      const active = link.dataset.scrollTarget === activeId;
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
  refresh();
}

function setupRandomizedGallery() {
  const railTrack = document.querySelector('.instagram-rail-track');
  const tiles = Array.from(railTrack?.querySelectorAll('.instagram-tile') || []);
  const columns = Array.from(document.querySelectorAll('.b-waterfall [data-waterfall-column]'));
  if (!railTrack || !tiles.length || !columns.length) return;

  const catalog = tiles.map((tile) => {
    const image = tile.querySelector('img');
    setMediaLoadingState(tile, image);
    const src = image?.getAttribute('src') || '';
    const key = src.match(/ig-\d+/)?.[0] || '';
    const [fallbackTitle, fallbackDescription] = galleryMetadata[key] || ['NeoRealm LAB Visual', 'An ongoing visual experiment from NeoRealm LAB.'];
    const title = tile.dataset.title || fallbackTitle;
    const description = tile.dataset.description || fallbackDescription;
    const item = {
      src,
      width: image?.getAttribute('width') || '864',
      height: image?.getAttribute('height') || '1080',
      alt: image?.alt || title,
      title,
      description,
      permalink: tile.dataset.permalink || tile.href,
      mediaType: tile.dataset.mediaType || 'IMAGE',
      videoSrc: tile.dataset.videoSrc || '',
      embedSrc: tile.dataset.embedSrc || '',
      carousel: tile.dataset.carousel || '[]',
    };
    Object.assign(tile.dataset, item);
    tile.setAttribute('aria-label', `放大查看 ${title}`);
    return { ...item, tile };
  });

  columns.forEach((column) => {
    const laneCards = shuffle(Array.from(column.querySelectorAll('.waterfall-card')));
    const startsLeft = Math.random() > 0.5;

    laneCards.forEach((card, index) => {
      card.classList.remove('gallery-tail-quiet');
      card.classList.toggle('piece-left', (index % 2 === 0) === startsLeft);
      card.classList.toggle('piece-right', (index % 2 === 0) !== startsLeft);
      card.style.setProperty('--gallery-rotation', `${(Math.random() * 1.1 - 0.55).toFixed(2)}deg`);
      column.append(card);
    });

    if (column.classList.contains('waterfall-column-near') && laneCards.length) {
      laneCards[laneCards.length - 1].classList.add('gallery-tail-quiet');
    }
  });

  const cards = columns.flatMap((column) => Array.from(column.querySelectorAll('.waterfall-card')));
  const selection = shuffle(catalog).slice(0, cards.length);
  cards.forEach((card, index) => {
    const item = selection[index];
    const imageWrap = card.querySelector('.waterfall-image');
    const image = imageWrap?.querySelector('img');
    card.hidden = !item;
    if (!item || !imageWrap || !image) return;

    setMediaLoadingState(imageWrap, image);
    image.crossOrigin = 'anonymous';
    image.src = item.src;
    image.width = Number(item.width);
    image.height = Number(item.height);
    image.alt = item.alt;
    imageWrap.style.setProperty('--ig-image', `url("${item.src}")`);
    Object.assign(card.dataset, item);
    card.classList.toggle('is-reel', item.mediaType === 'VIDEO');

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

function setupScrollTop() {
  const control = document.querySelector('[data-scroll-top]');
  if (!control) return;

  const updateState = () => {
    control.classList.toggle('is-active', window.scrollY > 320);
  };

  control.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  });
  window.addEventListener('scroll', updateState, { passive: true });
  updateState();
}

function setupWorkLightbox() {
  const dialog = document.querySelector('#work-lightbox');
  const closeButton = dialog?.querySelector('[data-lightbox-close]');
  const image = dialog?.querySelector('[data-lightbox-image]');
  const loading = dialog?.querySelector('[data-lightbox-loading]');
  const video = dialog?.querySelector('[data-lightbox-video]');
  const videoFallback = dialog?.querySelector('[data-lightbox-video-fallback]');
  const previousSlide = dialog?.querySelector('[data-lightbox-previous]');
  const nextSlide = dialog?.querySelector('[data-lightbox-next]');
  const slideStatus = dialog?.querySelector('[data-lightbox-slide-status]');
  const title = dialog?.querySelector('[data-lightbox-title]');
  const description = dialog?.querySelector('[data-lightbox-description]');
  const category = dialog?.querySelector('[data-lightbox-category]');
  const launch = dialog?.querySelector('[data-lightbox-launch]');
  const media = dialog?.querySelector('.work-lightbox-media');
  const scrollbar = dialog?.querySelector('[data-lightbox-scrollbar]');
  const scrollbarThumb = dialog?.querySelector('[data-lightbox-scrollbar-thumb]');
  const sources = [
    ...document.querySelectorAll('.work-lightbox-trigger'),
    ...document.querySelectorAll('.instagram-tile'),
  ];
  let trigger = null;
  if (!dialog || !closeButton || !image || !loading || !video || !videoFallback || !previousSlide || !nextSlide || !slideStatus || !title || !description || !category || !launch || !media || !scrollbar || !scrollbarThumb || !sources.length) return;

  let slides = [];
  let slideIndex = 0;
  let imageRequest = 0;
  let currentVideoFallback = null;
  const loadImage = (src, alt) => {
    const request = ++imageRequest;
    dialog.classList.add('is-loading');
    loading.hidden = false;
    image.removeAttribute('src');
    image.alt = '';
    const preload = new Image();
    preload.onload = () => {
      if (request !== imageRequest) return;
      image.src = src;
      image.alt = alt;
    };
    preload.onerror = () => {
      if (request !== imageRequest) return;
      loading.querySelector('em').textContent = 'Image unavailable';
    };
    preload.src = src;
  };
  const renderSlide = () => {
    if (!slides.length) return;
    const slide = slides[slideIndex];
    loadImage(slide.src, `${title.textContent}，第 ${slideIndex + 1} 張，共 ${slides.length} 張`);
    previousSlide.disabled = slideIndex === 0;
    nextSlide.disabled = slideIndex === slides.length - 1;
    slideStatus.textContent = `${String(slideIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };

  const stepSlide = (offset) => {
    const nextIndex = clamp(slideIndex + offset, 0, slides.length - 1);
    if (nextIndex === slideIndex) return;
    slideIndex = nextIndex;
    renderSlide();
  };

  previousSlide.addEventListener('click', () => stepSlide(-1));
  nextSlide.addEventListener('click', () => stepSlide(1));

  const syncScrollbar = () => {
    const scrollable = dialog.classList.contains('is-archive-work') && media.scrollHeight > media.clientHeight + 1;
    scrollbar.hidden = !scrollable;
    if (!scrollable) return;
    const maximum = media.scrollHeight - media.clientHeight;
    const thumbSize = Math.max(48, (media.clientHeight / media.scrollHeight) * scrollbar.clientHeight);
    const thumbTravel = Math.max(0, scrollbar.clientHeight - thumbSize);
    const progress = maximum ? media.scrollTop / maximum : 0;
    scrollbarThumb.style.height = `${thumbSize}px`;
    scrollbarThumb.style.transform = `translateY(${thumbTravel * progress}px)`;
    scrollbar.setAttribute('aria-valuemin', '0');
    scrollbar.setAttribute('aria-valuemax', String(Math.round(maximum)));
    scrollbar.setAttribute('aria-valuenow', String(Math.round(media.scrollTop)));
  };

  const scrollFromPointer = (clientY) => {
    const rect = scrollbar.getBoundingClientRect();
    const progress = clamp((clientY - rect.top) / rect.height, 0, 1);
    media.scrollTop = progress * (media.scrollHeight - media.clientHeight);
  };

  let draggingScrollbar = false;
  scrollbar.addEventListener('pointerdown', (event) => {
    if (scrollbar.hidden) return;
    draggingScrollbar = true;
    scrollbar.setPointerCapture(event.pointerId);
    scrollFromPointer(event.clientY);
    event.preventDefault();
  });
  scrollbar.addEventListener('pointermove', (event) => {
    if (draggingScrollbar) scrollFromPointer(event.clientY);
  });
  scrollbar.addEventListener('pointerup', () => { draggingScrollbar = false; });
  scrollbar.addEventListener('pointercancel', () => { draggingScrollbar = false; });
  scrollbar.addEventListener('keydown', (event) => {
    if (scrollbar.hidden) return;
    const page = Math.max(80, media.clientHeight * 0.82);
    if (event.key === 'ArrowDown' || event.key === 'PageDown') media.scrollTop += page;
    else if (event.key === 'ArrowUp' || event.key === 'PageUp') media.scrollTop -= page;
    else if (event.key === 'Home') media.scrollTop = 0;
    else if (event.key === 'End') media.scrollTop = media.scrollHeight;
    else return;
    event.preventDefault();
  });
  dialog.addEventListener('keydown', (event) => {
    if (dialog.classList.contains('has-carousel') && !event.target.closest('input, textarea, select')) {
      if (event.key === 'ArrowLeft') {
        stepSlide(-1);
        event.preventDefault();
        return;
      }
      if (event.key === 'ArrowRight') {
        stepSlide(1);
        event.preventDefault();
        return;
      }
    }
    if (!dialog.classList.contains('is-archive-work') || event.target.closest('a, button, input, textarea, select')) return;
    const step = Math.max(80, media.clientHeight * 0.82);
    if (event.key === 'ArrowDown' || event.key === 'PageDown') media.scrollTop += step;
    else if (event.key === 'ArrowUp' || event.key === 'PageUp') media.scrollTop -= step;
    else if (event.key === 'Home') media.scrollTop = 0;
    else if (event.key === 'End') media.scrollTop = media.scrollHeight;
    else return;
    event.preventDefault();
  });
  media.addEventListener('scroll', syncScrollbar, { passive: true });
  image.addEventListener('load', () => {
    dialog.classList.remove('is-loading');
    loading.hidden = true;
    loading.querySelector('em').textContent = 'Loading visual…';
    window.requestAnimationFrame(syncScrollbar);
  });
  const showVideoFallback = () => {
    if (!currentVideoFallback || !dialog.classList.contains('is-video-work')) return;
    video.pause();
    video.hidden = true;
    image.hidden = false;
    videoFallback.hidden = false;
    videoFallback.href = currentVideoFallback.permalink;
    videoFallback.setAttribute('aria-label', `在 Instagram 觀看 ${currentVideoFallback.title}`);
    dialog.classList.add('is-video-fallback');
    loadImage(currentVideoFallback.src, currentVideoFallback.alt || currentVideoFallback.title);
  };
  video.addEventListener('error', showVideoFallback);
  window.addEventListener('resize', syncScrollbar);

  const open = (source) => {
    const owner = source.closest('.waterfall-card, .archive-case');
    const item = source.classList.contains('instagram-tile') ? source.dataset : owner?.dataset;
    if (!item?.src) return;
    trigger = source;
    dialog.classList.toggle('is-archive-work', item.lightboxKind === 'archive');
    media.scrollTop = 0;
    title.textContent = item.title;
    description.textContent = item.description;
    const isArchive = item.lightboxKind === 'archive';
    description.tabIndex = isArchive ? -1 : 0;
    if (isArchive) description.removeAttribute('aria-label');
    else description.setAttribute('aria-label', 'Instagram 貼文說明；內容過長時可上下捲動閱讀');
    const isVideo = !isArchive && item.mediaType === 'VIDEO';
    let carousel = [];
    try { carousel = JSON.parse(item.carousel || '[]'); } catch { carousel = []; }
    slides = !isArchive && !isVideo && carousel.length > 1 ? carousel : [];
    slideIndex = 0;
    dialog.classList.toggle('has-carousel', slides.length > 1);
    previousSlide.hidden = slides.length <= 1;
    nextSlide.hidden = slides.length <= 1;
    slideStatus.hidden = slides.length <= 1;
    if (slides.length > 1) renderSlide();
    else if (!isVideo) loadImage(item.src, item.alt || item.title);
    const hasNativeVideo = isVideo && item.videoSrc;
    currentVideoFallback = isVideo && item.permalink ? item : null;
    dialog.classList.toggle('is-video-work', isVideo);
    dialog.classList.remove('is-video-fallback');
    const categoryLabel = window.NeoRealmWebProjects?.categories
      .find((entry) => entry.value === item.category)?.label;
    category.hidden = !isArchive || !categoryLabel;
    category.textContent = categoryLabel || '';
    launch.hidden = !isArchive || !item.projectUrl;
    if (item.projectUrl) launch.href = item.projectUrl;
    else launch.removeAttribute('href');
    image.hidden = Boolean(isVideo);
    video.hidden = !hasNativeVideo;
    videoFallback.hidden = true;
    videoFallback.removeAttribute('href');
    if (hasNativeVideo) {
      dialog.classList.remove('is-loading');
      loading.hidden = true;
      video.poster = item.src;
      video.src = item.videoSrc;
      video.load();
    } else {
      video.pause();
      video.removeAttribute('src');
      video.removeAttribute('poster');
      video.load();
    }
    if (isVideo && !hasNativeVideo) showVideoFallback();
    dialog.showModal();
    document.body.classList.add('work-lightbox-open');
    window.requestAnimationFrame(() => {
      dialog.classList.add('is-visible');
      syncScrollbar();
      if (isArchive) media.focus({ preventScroll: true });
      else closeButton.focus({ preventScroll: true });
    });
  };

  const close = () => {
    dialog.classList.remove('is-visible');
    document.body.classList.remove('work-lightbox-open');
    const finish = () => {
      if (dialog.open) dialog.close();
      dialog.classList.remove('is-archive-work');
      dialog.classList.remove('is-video-work');
      dialog.classList.remove('is-video-fallback');
      dialog.classList.remove('has-carousel');
      slides = [];
      video.pause();
      video.removeAttribute('src');
      video.removeAttribute('poster');
      video.load();
      currentVideoFallback = null;
      videoFallback.hidden = true;
      videoFallback.removeAttribute('href');
      scrollbar.hidden = true;
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
  const section = document.querySelector('.b-instagram-rail');
  const viewport = document.querySelector('.instagram-rail-viewport');
  if (!section || !viewport) return;

  let targetScroll = viewport.scrollLeft;
  let animationFrame = 0;

  const stopAnimation = () => {
    if (!animationFrame) return;
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  const animateScroll = () => {
    const distance = targetScroll - viewport.scrollLeft;
    if (Math.abs(distance) < 0.5) {
      viewport.scrollLeft = targetScroll;
      animationFrame = 0;
      return;
    }

    viewport.scrollLeft += distance * 0.16;
    animationFrame = requestAnimationFrame(animateScroll);
  };

  section.addEventListener('wheel', (event) => {
    if (window.innerWidth <= 720 || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const movingForward = event.deltaY > 0;
    const currentScroll = viewport.scrollLeft;
    if (!animationFrame) targetScroll = currentScroll;
    const atStart = targetScroll <= 0.5;
    const atEnd = targetScroll >= maxScroll - 0.5;
    const visuallyAtStart = currentScroll <= 0.5;
    const visuallyAtEnd = currentScroll >= maxScroll - 0.5;

    if ((!movingForward && (atStart || visuallyAtStart)) || (movingForward && (atEnd || visuallyAtEnd))) {
      stopAnimation();
      targetScroll = movingForward ? maxScroll : 0;
      viewport.scrollLeft = targetScroll;
      return;
    }

    event.preventDefault();
    const impulse = Math.max(-180, Math.min(180, event.deltaY * 1.15));
    targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + impulse));
    if (!animationFrame) animationFrame = requestAnimationFrame(animateScroll);
  }, { passive: false });

  viewport.addEventListener('scroll', () => {
    if (!animationFrame) targetScroll = viewport.scrollLeft;
  }, { passive: true });
}

async function setupWebArchive() {
  const store = window.NeoRealmWebProjects;
  const flow = document.querySelector('[data-archive-projects]');
  const filters = Array.from(document.querySelectorAll('[data-archive-filter]'));
  const status = document.querySelector('[data-archive-filter-status]');
  if (!store || !flow || !filters.length) return;

  const projects = await (store.getRemote?.() || store.get());
  const depthPattern = [0.72, 1, 0.58, 0.88, 0.66, 0.94];

  const createImage = (project) => {
    const image = document.createElement('img');
    image.crossOrigin = 'anonymous';
    image.src = project.coverImage;
    image.alt = project.alt;
    image.width = 600;
    image.height = 650;
    image.loading = 'lazy';
    image.decoding = 'async';
    return image;
  };

  const prepareLightbox = (figure, project) => {
    const projectUrl = /^https?:\/\//i.test(String(project.projectUrl || ''))
      ? project.projectUrl
      : '';
    Object.assign(figure.dataset, {
      src: project.lightboxImage,
      alt: project.alt,
      title: project.title,
      description: project.description,
      category: project.category,
      // Older local records can contain the literal "undefined". Keep the
      // action absent unless it is an explicitly valid external URL.
      projectUrl,
      lightboxKind: 'archive',
    });

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'work-lightbox-trigger archive-lightbox-trigger';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', 'work-lightbox');
    trigger.setAttribute('aria-label', `完整查看 ${project.title} 網站作品`);
    figure.append(trigger);
  };

  projects.forEach((project, index) => {
    const figure = document.createElement('figure');
    figure.className = 'archive-case';
    figure.dataset.trailCard = '';
    figure.dataset.depth = String(depthPattern[index % depthPattern.length]);
    figure.dataset.archiveCategory = project.category;
    figure.dataset.projectId = project.id;
    figure.append(createImage(project));

    const caption = document.createElement('figcaption');
    const title = document.createElement('strong');
    title.textContent = project.title;
    caption.append(title);
    figure.append(caption);
    prepareLightbox(figure, project);
    flow.append(figure);

  });

  const cards = Array.from(flow.querySelectorAll('[data-archive-category]'));
  const projectCount = (category) => projects.filter((project) => category === 'all' || project.category === category).length;

  const filterArchive = (category) => {
    const previousRects = new Map(cards.filter((card) => !card.hidden).map((card) => [card, card.getBoundingClientRect()]));
    cards.forEach((card) => {
      card.hidden = category !== 'all' && card.dataset.archiveCategory !== category;
    });

    filters.forEach((filter) => {
      const active = filter.dataset.archiveFilter === category;
      filter.setAttribute('aria-pressed', String(active));
    });

    if (status) {
      const activeLabel = filters.find((filter) => filter.dataset.archiveFilter === category)?.textContent.trim() || 'All Projects';
      status.textContent = `${activeLabel} · ${projectCount(category)} projects`;
    }

    requestAnimationFrame(() => {
      cards.filter((card) => !card.hidden).forEach((card) => {
        const previous = previousRects.get(card);
        const current = card.getBoundingClientRect();
        if (!previous) {
          card.animate(
            [{ opacity: 0, transform: 'translate3d(0, 24px, 0)' }, { opacity: 1, transform: 'translate3d(0, var(--depth-shift, 0px), 0)' }],
            { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
          );
          return;
        }
        const deltaX = previous.left - current.left;
        const deltaY = previous.top - current.top;
        if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
        card.animate(
          [
            { transform: `translate3d(${deltaX}px, ${deltaY}px, 0)` },
            { transform: 'translate3d(0, var(--depth-shift, 0px), 0)' },
          ],
          { duration: reducedMotion.matches ? 1 : 560, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        );
      });
    });
  };

  filters.forEach((filter) => {
    filter.addEventListener('click', () => filterArchive(filter.dataset.archiveFilter));
  });
  filterArchive('all');

  window.addEventListener('storage', (event) => {
    if (event.key === store.STORAGE_KEY) window.location.reload();
  });
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
    // hCaptcha can time out while the dialog is closed or the visitor is reading prices.
    // Resetting it when the dialog opens always presents a fresh, clickable checkbox.
    window.setTimeout(() => window.hcaptcha?.reset?.(), 180);
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

    const captchaToken = form.querySelector('textarea[name="h-captcha-response"]')?.value;
    if (!captchaToken) {
      window.hcaptcha?.reset?.();
      status.className = 'project-form-status form-field-wide is-error';
      status.textContent = '請先勾選「我是實體訪客」並完成真人驗證，再送出需求。';
      form.querySelector('[data-project-captcha]')?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'center' });
      return;
    }

    submit.disabled = true;
    submitLabel.textContent = '傳送中…';
    status.className = 'project-form-status form-field-wide is-sending';
    status.textContent = '正在安全傳送你的需求…';

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) throw new Error(result?.message || 'Form service unavailable');

      form.reset();
      window.hcaptcha?.reset?.();
      status.className = 'project-form-status form-field-wide is-success';
      status.textContent = '需求已送出。我會閱讀內容，並回覆到你填寫的 Email。';
      submitLabel.textContent = '已送出';
    } catch (error) {
      status.className = 'project-form-status form-field-wide is-error';
      status.textContent = error.name === 'AbortError'
        ? '傳送逾時，請確認網路後再試一次。'
        : '目前無法送出需求，請稍後再試，或直接來信 neorealmlab@gmail.com。';
      submit.disabled = false;
      submitLabel.textContent = '再試一次';
    } finally {
      window.clearTimeout(timeout);
    }
  });
}

async function boot() {
  setupKv();
  setupStudioStory();
  setupTextMotion();
  setupActiveNavigation();
  await hydrateInstagramFeed();
  setupRandomizedGallery();
  await setupWebArchive();
  setupWaterfallMotion();
  window.NeoRealmColorfulHover?.setup();
  setupWorkLightbox();
  setupInstagramWheel();
  setupProjectDialog();
  setupScrollTop();
}

boot();
