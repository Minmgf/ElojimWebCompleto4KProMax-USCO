// hooks/useNews.ts
import { useState, useEffect } from 'react';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string[];
  important: boolean;
  images: string[];
  isActive: boolean;
  authorId: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NewsResponse {
  success: boolean;
  data: {
    news: NewsItem[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  error?: string;
}

export interface CreateNewsData {
  title: string;
  content: string;
  category: string[];
  important?: boolean;
  isActive?: boolean;
  images?: File[];
}

export interface NewsFilters {
  page?: number;
  limit?: number;
  category?: string;
  important?: boolean;
  isActive?: boolean;
  search?: string;
}

/**
 * Hook personalizado para gestionar noticias
 */
export function useNews(filters: NewsFilters = {}) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [pagination, setPagination] = useState<NewsResponse['data']['pagination'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async (newFilters: NewsFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/news?${params.toString()}`, {
        credentials: 'include' // Para incluir cookies de sesión
      });
      const data: NewsResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error fetching news');
      }

      setNews(data.data.news);
      setPagination(data.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    news,
    pagination,
    loading,
    error,
    refetch: fetchNews,
  };
}

/**
 * Hook para crear noticias
 */
export function useCreateNews() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNews = async (data: CreateNewsData): Promise<NewsItem | null> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('category', JSON.stringify(data.category));
      
      if (data.important !== undefined) {
        formData.append('important', data.important.toString());
      }
      
      if (data.isActive !== undefined) {
        formData.append('isActive', data.isActive.toString());
      }

      if (data.images) {
        data.images.forEach(file => {
          formData.append('images', file);
        });
      }

      const response = await fetch('/api/news', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Para autenticación
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error creando noticia');
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createNews,
    loading,
    error,
  };
}

/**
 * Hook para actualizar noticias
 */
export function useUpdateNews() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateNews = async (
    id: string, 
    data: Partial<CreateNewsData> & { 
      newImages?: File[]; 
      deleteImages?: string[]; 
    }
  ): Promise<NewsItem | null> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      if (data.title) formData.append('title', data.title);
      if (data.content) formData.append('content', data.content);
      if (data.category) formData.append('category', JSON.stringify(data.category));
      if (data.important !== undefined) formData.append('important', data.important.toString());
      if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());

      if (data.newImages) {
        data.newImages.forEach(file => {
          formData.append('newImages', file);
        });
      }

      if (data.deleteImages) {
        data.deleteImages.forEach(url => {
          formData.append('deleteImages', url);
        });
      }

      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include' // Para autenticación
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error actualizando noticia');
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateNews,
    loading,
    error,
  };
}

/**
 * Hook para obtener una noticia específica por ID
 */
export function useNewsById(id: string) {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewsById = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/news/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Error obteniendo noticia');
      }

      setNews(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsById();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    news,
    loading,
    error,
    refetch: fetchNewsById,
  };
}

/**
 * Hook para eliminar noticias
 */
export function useDeleteNews() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteNews = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        credentials: 'include' // Para autenticación
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Error eliminando noticia');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteNews,
    loading,
    error,
  };
}
