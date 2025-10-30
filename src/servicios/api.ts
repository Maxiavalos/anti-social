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

// Servicio de comentarios - VERSIÓN CORREGIDA
export const comentarioService = {
  obtenerComentariosPorPublicacion: async (postId: number): Promise<ComentarioAPI[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`);
      if (!response.ok) {
        // Si no hay comentarios, devolver array vacío
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

// Función para inicializar datos de prueba (opcional)
export const inicializarDatosPrueba = async (): Promise<void> => {
  try {
    // Verificar si ya hay usuarios
    const usuarios = await usuarioService.obtenerUsuarios();
    if (usuarios.length === 0) {
      console.log('Inicializando datos de prueba...');
      
      // Crear usuario de prueba
      const usuarioPrueba = await usuarioService.crearUsuario({
        nickName: 'usuario_prueba',
        email: 'prueba@ejemplo.com'
      });
      
      console.log('Usuario de prueba creado:', usuarioPrueba);
    }
  } catch (error) {
    console.error('Error inicializando datos de prueba:', error);
  }
};