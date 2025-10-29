const API_BASE_URL = 'http://localhost:3001';

interface UsuarioParaCrear {
  nickName: string;
}

// Servicio para usuarios
export const usuarioService = {
  obtenerUsuarios: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
    }
  },

  crearUsuario: async (usuario: UsuarioParaCrear) => {
    try {
      // Preparar datos completos del usuario con campos requeridos
      const usuarioCompleto = {
        nickName: usuario.nickName,
        email: `${usuario.nickName}@ejemplo.com`,
        password: "123456",
      };
      
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioCompleto),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  }
};

// Servicio de publicaciones
export const publicacionService = {
  obtenerPublicaciones: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`);
      if (!response.ok) {
        throw new Error(`Error ${response.status} al obtener publicaciones`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo publicaciones:', error);
      throw error;
    }
  },

  obtenerPublicacionPorId: async (id: number) => {
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

  obtenerPublicacionesPorUsuario: async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status} al obtener publicaciones del usuario`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo publicaciones del usuario:', error);
      throw error;
    }
  },

  crearPublicacion: async (publicacion: { description: string; userId: number; tags: string[] }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publicacion),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: No se pudo crear la publicación`);
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
  obtenerComentarios: async (postId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error(`Error ${response.status} al obtener comentarios`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo comentarios:', error);
      throw error;
    }
  },

  crearComentario: async (comentario: { contenido: string; usuarioId: number; publicacionId: number }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...comentario,
          contenido: comentario.contenido
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: No se pudo crear el comentario`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creando comentario:', error);
      throw error;
    }
  }
};

// Servicio de imágenes
export const imagenService = {
  obtenerImagenes: async (postId: number) => {
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

  crearImagen: async (imagen: { url: string; postId: number }) => {
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
        throw new Error(errorData.message || `Error ${response.status}: No se pudo crear la imagen`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creando imagen:', error);
      throw error;
    }
  }
};