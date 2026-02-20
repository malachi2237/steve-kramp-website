const API_URL = import.meta.env.SONICJS_API_URL || 'http://localhost:8787';

interface SonicJSResponse<T> {
  data: T;
  meta: {
    count: number;
    timestamp: string;
    cache: {
      hit: boolean;
      source: string;
    };
  };
}

interface Resource {
  id: string;
  title: string;
  slug: string;
  status: string;
  data: {
    title: string;
    content: string;
    thumbnail?: string;
    external_link?: string;
    file_attachment?: string;
    publisher?: string;
  };
  created_at: number;
  updated_at: number;
}

// Fetch all published blog posts
export async function getResources(): Promise<Resource[]> {
  const response = await fetch(
    `${API_URL}/api/collections/resources/content?filter[status][equals]=published&sort=-created_at`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }

  const result: SonicJSResponse<Resource[]> = await response.json();
  return result.data;
}

// Fetch a single blog post by slug
export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  const response = await fetch(
    `${API_URL}/api/resources/blog-posts/content?filter[data.slug][equals]=${slug}&filter[status][equals]=published`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch post: ${response.statusText}`);
  }

  const result: SonicJSResponse<Resource[]> = await response.json();
  return result.data[0] || null;
}

// Generic content fetcher with filtering
export async function getContent<T>(
  collection: string,
  options?: {
    limit?: number;
    offset?: number;
    sort?: string;
    filters?: Record<string, string>;
  }
): Promise<SonicJSResponse<T[]>> {
  const params = new URLSearchParams();

  if (options?.limit) params.set('limit', options.limit.toString());
  if (options?.offset) params.set('offset', options.offset.toString());
  if (options?.sort) params.set('sort', options.sort);
  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      params.set(`filter[${key}]`, value);
    });
  }

  const url = `${API_URL}/api/collections/${collection}/content?${params}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch content: ${response.statusText}`);
  }

  return response.json();
}
