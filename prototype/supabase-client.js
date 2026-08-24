(function setupNeoRealmSupabase(global) {
  const url = 'https://lxmfbgpsxkuthyjzoicy.supabase.co';
  const publishableKey = 'sb_publishable_GXYZ4BjSjX0K1ppeORedpA_fqnoE50X';
  const sdk = global.supabase?.createClient?.(url, publishableKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });

  const publicUrl = (bucket, path) => path
    ? sdk.storage.from(bucket).getPublicUrl(path).data.publicUrl
    : '';

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
  };
}(window));
