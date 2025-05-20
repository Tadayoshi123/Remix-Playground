const STRAPI_URL = 'http://localhost:1337';

// Interfaces modifiées pour correspondre à la structure des données Strapi
export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cover?: {
    id: number;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      thumbnail?: {
        url: string;
      };
      small?: {
        url: string;
      };
    };
    url: string;
  };
  author?: {
    id: number;
    name: string;
    email: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  blocks?: unknown[];
}

export interface ArticleResponse {
  data: Article[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface SingleArticleResponse {
  data: Article;
}

export async function getArticles(): Promise<ArticleResponse> {
  try {
    const apiUrl = `${STRAPI_URL}/api/articles?populate=*`;
    console.log(`Fetching articles from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`API response not OK: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Articles fetched successfully. Count: ${data.data?.length || 0}`);
    return data;
  } catch (error) {
    console.error("Error in getArticles:", error);
    throw error;
  }
}

export async function getArticleById(id: number): Promise<SingleArticleResponse> {
  try {
    // Méthode 1: Utiliser le filtre par ID, plus fiable car le format de réponse est cohérent avec getArticles
    const apiUrl = `${STRAPI_URL}/api/articles?filters[id][$eq]=${id}&populate=*`;
    console.log(`Fetching article by ID from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`API response not OK: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(`Failed to fetch article with ID ${id}: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log(`API Response for ID ${id}:`, JSON.stringify(result, null, 2));
    
    if (!result.data || result.data.length === 0) {
      console.error(`Article not found with ID: ${id}`);
      throw new Error(`Article not found: ${id}`);
    }
    
    console.log(`Article fetched successfully. ID: ${result.data[0].id}`);
    return { data: result.data[0] };
  } catch (error) {
    console.error(`Error in getArticleById for ID '${id}':`, error);
    throw error;
  }
}

export async function getArticleBySlug(slug: string): Promise<SingleArticleResponse> {
  try {
    const apiUrl = `${STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`;
    console.log(`Fetching article by slug from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`API response not OK: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(`Failed to fetch article: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    const { data } = result;
    
    if (!data || data.length === 0) {
      console.error(`Article not found with slug: ${slug}`);
      throw new Error(`Article not found: ${slug}`);
    }
    
    console.log(`Article fetched successfully. ID: ${data[0].id}`);
    return { data: data[0] };
  } catch (error) {
    console.error(`Error in getArticleBySlug for slug '${slug}':`, error);
    throw error;
  }
} 