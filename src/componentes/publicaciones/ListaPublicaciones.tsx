import React, { useState, useEffect, useContext } from 'react';
import TarjetaPublicacion from './TarjetaPublicacion';
import { ContextoUsuario } from '../../contexto/ContextoUsuario';
import { 
  comentarioService, 
  publicacionService, 
  imagenService, 
  likeService,
  type PublicacionAPI, 
  type ImagenAPI 
} from '../../servicios/api';

interface Publicacion {
  id: number;
  usuario: string;
  descripcion: string;
  imagenes?: string[];
  fechaCreacion: string;
  comentariosCount: number;
  meGustaCount: number;
  etiquetas?: string[];
  userLiked?: boolean;
}

const ListaPublicaciones: React.FC = () => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const { usuario } = useContext(ContextoUsuario);

  // Función para cargar los datos reales de likes desde la API
  const cargarDatosLikes = async (publicacionId: number) => {
    try {
      const [likeCountResponse, likeCheckResponse] = await Promise.all([
        likeService.obtenerLikesCount(publicacionId),
        usuario ? likeService.verificarLike(publicacionId, usuario.id) : Promise.resolve({ liked: false })
      ]);

      return {
        meGustaCount: likeCountResponse.likeCount,
        userLiked: likeCheckResponse.liked
      };
    } catch (error) {
      console.error(`Error cargando datos de likes para post ${publicacionId}:`, error);
      return {
        meGustaCount: 0,
        userLiked: false
      };
    }
  };

  // Función para transformar datos de la API
  const transformarPublicacion = async (publicacionAPI: PublicacionAPI, imagenesUrls: string[]): Promise<Publicacion> => {
    try {
      // Obtener datos en paralelo para mejor performance
      const [comentariosData, datosLikes] = await Promise.all([
        comentarioService.obtenerComentariosPorPublicacion(publicacionAPI.id),
        cargarDatosLikes(publicacionAPI.id)
      ]);

      return {
        id: publicacionAPI.id,
        usuario: publicacionAPI.User?.nickName || 'Usuario',
        descripcion: publicacionAPI.description,
        imagenes: imagenesUrls,
        fechaCreacion: new Date(publicacionAPI.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        comentariosCount: comentariosData.length,
        meGustaCount: datosLikes.meGustaCount,
        userLiked: datosLikes.userLiked,
        etiquetas: publicacionAPI.Tags ? publicacionAPI.Tags.map((tag: any) => tag.name) : []
      };
    } catch (error) {
      console.error(`Error transformando publicación ${publicacionAPI.id}:`, error);
      return {
        id: publicacionAPI.id,
        usuario: publicacionAPI.User?.nickName || 'Usuario',
        descripcion: publicacionAPI.description,
        imagenes: imagenesUrls,
        fechaCreacion: new Date(publicacionAPI.createdAt).toLocaleDateString('es-ES'),
        comentariosCount: 0,
        meGustaCount: 0,
        userLiked: false,
        etiquetas: publicacionAPI.Tags ? publicacionAPI.Tags.map((tag: any) => tag.name) : []
      };
    }
  };

  useEffect(() => {
    const cargarPublicaciones = async () => {
      try {
        setCargando(true);
        setError('');

        
        const publicacionesAPI: PublicacionAPI[] = await publicacionService.obtenerPublicaciones();

        
        const publicacionesTransformadas = await Promise.all(
          publicacionesAPI.map(async (publicacionAPI: PublicacionAPI) => {
            let imagenesUrls: string[] = [];
            try {
              const imagenesData: ImagenAPI[] = await imagenService.obtenerImagenesPorPublicacion(publicacionAPI.id);
              imagenesUrls = imagenesData.map((img: ImagenAPI) => img.url);
            } catch (error) {
              console.error(`Error cargando imágenes para post ${publicacionAPI.id}:`, error);
            }

            return transformarPublicacion(publicacionAPI, imagenesUrls);
          })
        );

        setPublicaciones(publicacionesTransformadas);
        
      } catch (err: any) {
        console.error('Error cargando publicaciones:', err);
        setError('No se pudieron cargar las publicaciones. Verifica que la API esté ejecutándose.');
        setPublicaciones([]);
      } finally {
        setCargando(false);
      }
    };

    cargarPublicaciones();
  }, []);

  const manejarToggleLike = async (id: number) => {
    if (!usuario) {
      setError('Debes iniciar sesión para dar me gusta');
      return;
    }

    try {
      console.log(`Procesando like para publicación ${id} del usuario ${usuario.id}`);

      setPublicaciones(prev => prev.map(pub => {
        if (pub.id === id) {
          const nuevoMeGustaCount = pub.userLiked 
            ? Math.max(0, pub.meGustaCount - 1)
            : pub.meGustaCount + 1;
            
          console.log(`Actualizando publicación ${id}: meGustaCount=${nuevoMeGustaCount}, userLiked=${!pub.userLiked}`);
          
          return { 
            ...pub, 
            meGustaCount: nuevoMeGustaCount,
            userLiked: !pub.userLiked 
          };
        }
        return pub;
      }));


      try {
        await likeService.toggleLike(id, usuario.id);
        console.log('Like guardado en backend');
      } catch (backendError) {
        console.warn('El backend falló, pero mantenemos el estado local. Los likes no serán persistentes hasta que arregles el backend.');
       
      }
      
    } catch (error: any) {
      console.error('Error inesperado:', error);
    }
  };


  const manejarMeGusta = (id: number) => {
    manejarToggleLike(id);
  };

  //const manejarNoMeGusta = (id: number) => {
  //  manejarToggleLike(id);
  //};

  if (cargando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted">Cargando publicaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning text-center">
        <h5>No se pudieron cargar las publicaciones</h5>
        <p className="mb-0">{error}</p>
      </div>
    );
  }

  return (
    <div className="row">
      {publicaciones.map((publicacion) => (
        <div key={publicacion.id} className="col-12">
          <TarjetaPublicacion
            publicacion={publicacion}
            onMeGusta={manejarMeGusta}
            //onNoMeGusta={manejarNoMeGusta}
          />
        </div>
      ))}
    </div>
  );
};

export default ListaPublicaciones;