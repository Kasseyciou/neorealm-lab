(function setupNeoRealmSupabase(global) {
  const url = 'https://lxmfbgpsxkuthyjzoicy.supabase.co';
  const publishableKey = 'sb_publishable_GXYZ4BjSjX0K1ppeORedpA_fqnoE50X';
  const sdk = global.supabase?.createClient?.(url, publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });

  const publicUrl = (bucket, path) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return sdk.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  };

  const mapInstagramPost = (post) => ({
    id: post.media_id,
    title: post.title || 'NeoRealm LAB Visual',
    description: post.description || '',
    alt: post.alt_text || post.title || 'NeoRealm LAB Instagram 作品',
    mediaType: post.media_type || 'IMAGE',
    src: publicUrl('instagram-media', post.cover_path),
    videoSrc: publicUrl('instagram-media', post.video_path),
    permalink: post.permalink,
    timestamp: post.posted_at || '',
    visible: Boolean(post.visible),
    displayOrder: post.display_order,
    carousel: Array.isArray(post.carousel)
      ? post.carousel.map((slide) => ({
        src: slide.src || publicUrl('instagram-media', slide.path),
        mediaType: slide.mediaType || 'IMAGE',
      }))
      : [],
  });

  global.NeoRealmSupabase = {
    url,
    client: sdk,
    publicUrl,
    async getProjects() {
      const { data, error } = await sdk
        .from('web_projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data.map((project) => ({
        id: project.id,
        slug: project.slug,
        title: project.title,
        description: project.description,
        category: project.category,
        alt: project.alt_text,
        coverPath: project.cover_path,
        lightboxPath: project.lightbox_path,
        coverImage: publicUrl('web-project-covers', project.cover_path),
        lightboxImage: publicUrl('web-project-pages', project.lightbox_path),
        image: publicUrl('web-project-covers', project.cover_path),
        projectUrl: project.project_url || '',
        sortOrder: project.sort_order,
        published: project.published,
      }));
    },
    async getInstagramTitles() {
      const { data, error } = await sdk.from('instagram_title_overrides').select('media_id,title');
      if (error) throw error;
      return Object.fromEntries(data.map(({ media_id, title }) => [media_id, title]));
    },
    async getInstagramFeed() {
      const { data, error } = await sdk
        .from('instagram_posts')
        .select('*')
        .eq('visible', true)
        .order('display_order', { ascending: true })
        .limit(20);
      if (error) throw error;
      return data.map(mapInstagramPost);
    },
    async getInstagramPosts() {
      const { data, error } = await sdk
        .from('instagram_posts')
        .select('*')
        .order('visible', { ascending: false })
        .order('display_order', { ascending: true, nullsFirst: false })
        .order('posted_at', { ascending: false });
      if (error) throw error;
      return data.map(mapInstagramPost);
    },
  };
}(window));
