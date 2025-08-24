# 📰 API de Noticias - Documentación Frontend

Esta documentación explica cómo usar la API de noticias desde el frontend para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar).

## 🔗 Endpoints Disponibles

### Base URL: `/api/news`

- `GET /api/news` - Obtener todas las noticias
- `POST /api/news` - Crear nueva noticia
- `GET /api/news/[id]` - Obtener noticia específica
- `PUT /api/news/[id]` - Actualizar noticia
- `DELETE /api/news/[id]` - Eliminar noticia

---

## 📖 Documentación Detallada

### 1. 📋 Obtener Todas las Noticias

**Endpoint:** `GET /api/news`

**Descripción:** Obtiene una lista de todas las noticias con opciones de filtrado y paginación.

#### Parámetros de Query (opcionales):
- `page` - Número de página (default: 1)
- `limit` - Noticias por página (default: 10, max: 100)
- `category` - Filtrar por categoría
- `important` - Solo noticias importantes (true/false)
- `search` - Buscar en título y contenido

#### Ejemplo de Uso Frontend:

```javascript
// Obtener todas las noticias
const fetchNews = async () => {
  try {
    const response = await fetch('/api/news');
    const data = await response.json();
    
    if (data.success) {
      console.log('Noticias:', data.data);
      console.log('Total:', data.pagination.total);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Con filtros y paginación
const fetchFilteredNews = async (page = 1, category = '', search = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '12',
    ...(category && { category }),
    ...(search && { search })
  });
  
  try {
    const response = await fetch(`/api/news?${params}`);
    const data = await response.json();
    
    if (data.success) {
      return data;
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usando en React
const [news, setNews] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadNews = async () => {
    setLoading(true);
    const data = await fetchFilteredNews(1, 'educacion');
    if (data) {
      setNews(data.data);
    }
    setLoading(false);
  };
  
  loadNews();
}, []);
```

#### Respuesta:
```json
{
  "success": true,
  "data": [
    {
      "id": "clp123...",
      "title": "Título de la noticia",
      "content": "Contenido completo...",
      "images": ["url1.jpg", "url2.jpg"],
      "category": ["educacion", "juventud"],
      "important": false,
      "isActive": true,
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z",
      "author": {
        "id": "user123",
        "name": "Admin",
        "email": "admin@elojim.org"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "total": 47,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### 2. ➕ Crear Nueva Noticia

**Endpoint:** `POST /api/news`

**Autenticación:** Requerida (cookie de sesión)

**Content-Type:** `multipart/form-data` (para subir imágenes)

#### Campos Requeridos:
- `title` - Título de la noticia (string)
- `content` - Contenido de la noticia (string)

#### Campos Opcionales:
- `category` - Array de categorías (JSON string)
- `important` - Es noticia importante (boolean)
- `isActive` - Está activa (boolean)
- `images` - Archivos de imagen (File[])

#### Ejemplo de Uso Frontend:

```javascript
// Función para crear noticia
const createNews = async (newsData, imageFiles = []) => {
  const formData = new FormData();
  
  // Agregar campos de texto
  formData.append('title', newsData.title);
  formData.append('content', newsData.content);
  formData.append('category', JSON.stringify(newsData.category || []));
  formData.append('important', newsData.important || false);
  formData.append('isActive', newsData.isActive !== false);
  
  // Agregar imágenes
  imageFiles.forEach(file => {
    formData.append('images', file);
  });
  
  try {
    const response = await fetch('/api/news', {
      method: 'POST',
      body: formData,
      credentials: 'include' // Incluir cookies de sesión
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Noticia creada:', data.data);
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error creando noticia:', error);
    throw error;
  }
};

// Ejemplo con React y un formulario
const NewsForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: ['general'],
    important: false,
    isActive: true
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createNews(formData, images);
      alert('Noticia creada exitosamente');
      // Resetear formulario o redireccionar
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 imágenes
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
        required
      />
      
      <textarea
        placeholder="Contenido"
        value={formData.content}
        onChange={(e) => setFormData({...formData, content: e.target.value})}
        required
      />
      
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />
      
      <label>
        <input
          type="checkbox"
          checked={formData.important}
          onChange={(e) => setFormData({...formData, important: e.target.checked})}
        />
        Noticia importante
      </label>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Creando...' : 'Crear Noticia'}
      </button>
    </form>
  );
};
```

---

### 3. 👁️ Obtener Noticia Específica

**Endpoint:** `GET /api/news/[id]`

**Descripción:** Obtiene una noticia específica por su ID.

#### Ejemplo de Uso Frontend:

```javascript
// Función para obtener una noticia específica
const fetchNewsById = async (id) => {
  try {
    const response = await fetch(`/api/news/${id}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error obteniendo noticia:', error);
    throw error;
  }
};

// Componente React para mostrar noticia
const NewsDetail = ({ newsId }) => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await fetchNewsById(newsId);
        setNews(newsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [newsId]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!news) return <div>Noticia no encontrada</div>;

  return (
    <article>
      <h1>{news.title}</h1>
      <div>
        {news.images.map((img, index) => (
          <img key={index} src={img} alt={`Imagen ${index + 1}`} />
        ))}
      </div>
      <div>{news.content}</div>
      <div>Categorías: {news.category.join(', ')}</div>
      <div>Autor: {news.author.name}</div>
      <div>Fecha: {new Date(news.createdAt).toLocaleDateString()}</div>
    </article>
  );
};
```

---

### 4. ✏️ Actualizar Noticia

**Endpoint:** `PUT /api/news/[id]`

**Autenticación:** Requerida (debe ser el autor)

**Content-Type:** `multipart/form-data`

#### Campos Opcionales (solo enviar los que se quieren actualizar):
- `title` - Nuevo título
- `content` - Nuevo contenido
- `category` - Nuevas categorías (JSON string)
- `important` - Cambiar importancia
- `isActive` - Cambiar estado activo
- `newImages` - Nuevas imágenes a agregar
- `deleteImages` - URLs de imágenes a eliminar

#### Ejemplo de Uso Frontend:

```javascript
// Función para actualizar noticia
const updateNews = async (id, updates, newImages = [], deleteImages = []) => {
  const formData = new FormData();
  
  // Agregar campos a actualizar
  Object.keys(updates).forEach(key => {
    if (updates[key] !== undefined) {
      if (key === 'category') {
        formData.append(key, JSON.stringify(updates[key]));
      } else {
        formData.append(key, updates[key]);
      }
    }
  });
  
  // Agregar nuevas imágenes
  newImages.forEach(file => {
    formData.append('newImages', file);
  });
  
  // Agregar imágenes a eliminar
  deleteImages.forEach(url => {
    formData.append('deleteImages', url);
  });
  
  try {
    const response = await fetch(`/api/news/${id}`, {
      method: 'PUT',
      body: formData,
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error actualizando noticia:', error);
    throw error;
  }
};

// Componente React para editar noticia
const EditNews = ({ newsId, initialData }) => {
  const [formData, setFormData] = useState(initialData);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updatedNews = await updateNews(
        newsId,
        formData,
        newImages,
        imagesToDelete
      );
      
      alert('Noticia actualizada exitosamente');
      console.log('Noticia actualizada:', updatedNews);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = (imageUrl) => {
    setImagesToDelete(prev => [...prev, imageUrl]);
    // Remover de la vista
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== imageUrl)
    }));
  };

  return (
    <form onSubmit={handleUpdate}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({...formData, title: e.target.value})}
      />
      
      <textarea
        value={formData.content}
        onChange={(e) => setFormData({...formData, content: e.target.value})}
      />
      
      {/* Mostrar imágenes actuales */}
      <div>
        {formData.images?.map((img, index) => (
          <div key={index}>
            <img src={img} alt={`Imagen ${index}`} width="100" />
            <button
              type="button"
              onClick={() => handleDeleteImage(img)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
      
      {/* Agregar nuevas imágenes */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setNewImages(Array.from(e.target.files))}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Actualizando...' : 'Actualizar'}
      </button>
    </form>
  );
};
```

---

### 5. 🗑️ Eliminar Noticia

**Endpoint:** `DELETE /api/news/[id]`

**Autenticación:** Requerida (debe ser el autor)

#### Ejemplo de Uso Frontend:

```javascript
// Función para eliminar noticia
const deleteNews = async (id) => {
  try {
    const response = await fetch(`/api/news/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success) {
      return true;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error eliminando noticia:', error);
    throw error;
  }
};

// Componente React con confirmación
const DeleteNewsButton = ({ newsId, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que quieres eliminar esta noticia? Esta acción no se puede deshacer.'
    );
    
    if (!confirmDelete) return;
    
    setLoading(true);
    
    try {
      await deleteNews(newsId);
      alert('Noticia eliminada exitosamente');
      onDeleted?.(newsId);
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      {loading ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
};
```

---

## 🔐 Autenticación

Para las operaciones que requieren autenticación (POST, PUT, DELETE), necesitas:

1. **Iniciar sesión primero:**
```javascript
const login = async (email, password) => {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include'
  });
  return response.json();
};
```

2. **Verificar autenticación:**
```javascript
const checkAuth = async () => {
  const response = await fetch('/api/auth/session', {
    credentials: 'include'
  });
  const session = await response.json();
  return session?.user;
};
```

---

## 🎨 Ejemplo Completo: Hook Personalizado React

```javascript
// hooks/useNews.js
import { useState, useEffect } from 'react';

export const useNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/news?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setNews(data.data);
        return data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createNews = async (newsData, images) => {
    // Implementación como se mostró arriba
  };

  const updateNews = async (id, updates, newImages, deleteImages) => {
    // Implementación como se mostró arriba
  };

  const deleteNews = async (id) => {
    // Implementación como se mostró arriba
  };

  return {
    news,
    loading,
    error,
    fetchNews,
    createNews,
    updateNews,
    deleteNews
  };
};

// Uso del hook
const NewsComponent = () => {
  const { news, loading, error, fetchNews, createNews } = useNews();

  useEffect(() => {
    fetchNews({ page: 1, limit: 10 });
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {news.map(item => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.content}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## 📋 Códigos de Estado HTTP

- `200` - Éxito
- `400` - Datos inválidos
- `401` - No autenticado
- `403` - Sin permisos
- `404` - No encontrado
- `500` - Error del servidor

---

## 💡 Consejos de Implementación

1. **Siempre manejar errores** con try/catch
2. **Mostrar estados de carga** para mejor UX
3. **Validar datos** antes de enviar
4. **Usar FormData** para subir archivos
5. **Incluir credentials: 'include'** para autenticación
6. **Confirmar acciones destructivas** como eliminar
7. **Actualizar el estado local** después de operaciones exitosas

Esta documentación te permitirá integrar completamente la API de noticias en tu frontend React/Next.js. 🚀
