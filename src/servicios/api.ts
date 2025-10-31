const API_BASE_URL = 'http://localhost:3001';

// Interfaces basadas en la API
export interface UsuarioAPI {
  id: number;
  nickName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EtiquetaAPI {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PublicacionAPI {
  id: number;
  description: string;
  UserId: number;
  createdAt: string;
  updatedAt?: string;
  User?: UsuarioAPI;
  Tags?: EtiquetaAPI[];
}

export interface ComentarioAPI {
  id: number;
  content: string;
  UserId: number;
  PostId: number;
  createdAt: string;
  updatedAt?: string;
  User?: UsuarioAPI;
}

export interface ImagenAPI {
  id: number;
  url: string;
  PostId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadResponse {
  success: boolean;
  imageUrl: string;
  filename: string;
}

// Servicio para usuarios
export const usuarioService = {
  obtenerUsuarios: async (): Promise<UsuarioAPI[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },

  obtenerUsuarioPorId: async (id: number): Promise<UsuarioAPI> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      if (!response.ok) {
        throw new Error('Usuario no encontrado');
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  },

  crearUsuario: async (usuario: { nickName: string; email: string }): Promise<UsuarioAPI> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: No se pudo crear el usuario`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  }
};

// Servicio de etiquetas
export const etiquetaService = {
  obtenerEtiquetas: async (): Promise<EtiquetaAPI[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tags`);
      if (!response.ok) {
        throw new Error(`Error ${response.status} al obtener etiquetas`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo etiquetas:', error);
      throw error;
    }
  }
};

// Servicio de publicaciones
export const publicacionService = {
  obtenerPublicaciones: async (userId?: number): Promise<PublicacionAPI[]> => {
    try {
      const url = userId ? `${API_BASE_URL}/posts?userId=${userId}` : `${API_BASE_URL}/posts`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error ${response.status} al obtener publicaciones`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo publicaciones:', error);
      throw error;
    }
  },

  obtenerPublicacionPorId: async (id: number): Promise<PublicacionAPI> => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`);
      if (!response.ok) {
        throw new Error('Publicación no encontrada');
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo publicación:', error);
      throw error;
    }
  },

  crearPublicacion: async (publicacion: { 
    description: string; 
    userId: number; 
    tagIds?: number[] 
  }): Promise<PublicacionAPI> => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: publicacion.description,
          userId: publicacion.userId,
          tagIds: publicacion.tagIds || []
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: No se pudo crear la publicación`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creando publicación:', error);
      throw error;
    }
  }
};

// Servicio de comentarios
export const comentarioService = {
  obtenerComentariosPorPublicacion: async (postId: number): Promise<ComentarioAPI[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`);
      if (!response.ok) {
        return [];
      }
      const comentarios = await response.json();
      
      // FILTRAR SOLO COMENTARIOS DE ESTE POST (doble verificación)
      return comentarios.filter((comentario: ComentarioAPI) => 
        comentario.PostId === postId
      );
    } catch (error) {
      console.error('Error obteniendo comentarios:', error);
      return [];
    }
  },

  crearComentario: async (comentario: { 
    content: string; 
    userId: number; 
    postId: number 
  }): Promise<ComentarioAPI> => {
    try {
      console.log('Creando comentario para post:', comentario.postId);
      
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comentario.content,
          userId: comentario.userId,
          postId: comentario.postId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: No se pudo crear el comentario`);
      }
      
      const comentarioCreado = await response.json();
      console.log('Comentario creado:', comentarioCreado);
      return comentarioCreado;
      
    } catch (error) {
      console.error('Error creando comentario:', error);
      throw error;
    }
  }
};

// Servicio de imágenes
export const imagenService = {
  obtenerImagenesPorPublicacion: async (postId: number): Promise<ImagenAPI[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/postimages/post/${postId}`);
      if (!response.ok) {
        return [];
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo imágenes:', error);
      return [];
    }
  },

  crearImagen: async (imagen: { url: string; postId: number }): Promise<ImagenAPI> => {
    try {
      const response = await fetch(`${API_BASE_URL}/postimages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imagen),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: No se pudo crear la imagen`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creando imagen:', error);
      throw error;
    }
  }
};

// Servicio de upload de imágenes
export const uploadService = {
  subirImagen: async (file: File): Promise<UploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      console.log('Subiendo imagen:', file.name, file.size, file.type);
      
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status} al subir la imagen`);
      }
      
      const result = await response.json();
      console.log('Imagen subida exitosamente:', result);
      return result;
      
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw error;
    }
  }
};

// Función de utilidad para verificar la conexión con la API
export const verificarConexionAPI = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response.ok;
  } catch (error) {
    console.error('No se pudo conectar con la API:', error);
    return false;
  }
};

// Función para verificar que el endpoint de upload funciona
export const verificarUpload = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, { method: 'POST' });
    // Si responde con error de método o falta de archivo, significa que el endpoint existe
    return response.status !== 404;
  } catch (error) {
    console.error('Endpoint /upload no disponible:', error);
    return false;
  }
};