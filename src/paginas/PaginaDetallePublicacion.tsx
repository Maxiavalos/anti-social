import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ContextoUsuario } from '../contexto/ContextoUsuario';
import TarjetaPublicacion from '../componentes/publicaciones/TarjetaPublicacion';
import { 
  publicacionService, 
  comentarioService, 
  imagenService,
  likeService,
  type PublicacionAPI,
  type ComentarioAPI,
  type ImagenAPI 
} from '../servicios/api';
import { ArrowLeft, PersonCircle, Chat, HandThumbsUp, Clock } from 'react-bootstrap-icons';

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

interface Comentario {
  id: number;
  usuario: string;
  contenido: string;
  fechaCreacion: string;
  meGustaCount: number;
  userId: number;
}

const PaginaDetallePublicacion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario } = useContext(ContextoUsuario);
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

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
      console.error('Error cargando datos de likes:', error);
      return {
        meGustaCount: 0,
        userLiked: false
      };
    }
  };

  const transformarPublicacion = async (publicacionAPI: PublicacionAPI, imagenesUrls: string[], comentariosCount: number): Promise<Publicacion> => {
    const datosLikes = await cargarDatosLikes(publicacionAPI.id);

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
      comentariosCount: comentariosCount,
      meGustaCount: datosLikes.meGustaCount,
      userLiked: datosLikes.userLiked,
      etiquetas: publicacionAPI.Tags ? publicacionAPI.Tags.map(tag => tag.name) : []
    };
  };

  const transformarComentario = (comentarioAPI: ComentarioAPI): Comentario => {
    return {
      id: comentarioAPI.id,
      usuario: comentarioAPI.User?.nickName || 'Usuario',
      contenido: comentarioAPI.content,
      fechaCreacion: new Date(comentarioAPI.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      meGustaCount: 0,
      userId: comentarioAPI.UserId
    };
  };

  // Función para recargar los datos de la publicación
  const recargarPublicacion = async () => {
    if (!id || !publicacion) return;

    try {
      const publicacionId = parseInt(id);
      const datosLikes = await cargarDatosLikes(publicacionId);
      
      setPublicacion(prev => prev ? {
        ...prev,
        meGustaCount: datosLikes.meGustaCount,
        userLiked: datosLikes.userLiked
      } : null);
    } catch (error) {
      console.error('Error recargando publicación:', error);
    }
  };

  // Cargar datos de la publicación
  useEffect(() => {
    const cargarDatos = async () => {
      if (!id) {
        setCargando(false);
        setError('ID de publicación no válido');
        return;
      }

      try {
        setCargando(true);
        setError('');

        const publicacionId = parseInt(id);
        console.log('Cargando publicación ID:', publicacionId);

        // Cargar publicación
        const publicacionData: PublicacionAPI = await publicacionService.obtenerPublicacionPorId(publicacionId);
        console.log('Publicación cargada:', publicacionData);
        
        // Cargar imágenes de la publicación
        let imagenesData: ImagenAPI[] = [];
        try {
          imagenesData = await imagenService.obtenerImagenesPorPublicacion(publicacionId);
          console.log('Imágenes cargadas:', imagenesData);
        } catch (error) {
          console.error('Error cargando imágenes:', error);
          imagenesData = [];
        }

        // Cargar comentarios
        let comentariosData: ComentarioAPI[] = [];
        try {
          comentariosData = await comentarioService.obtenerComentariosPorPublicacion(publicacionId);
          console.log('Comentarios cargados:', comentariosData);
        } catch (error) {
          console.error('Error cargando comentarios:', error);
          comentariosData = [];
        }

        // Transformar datos
        const imagenesUrls = imagenesData.map(img => img.url);
        const comentariosTransformados = comentariosData.map(transformarComentario);
        
        const publicacionTransformada = await transformarPublicacion(
          publicacionData, 
          imagenesUrls, 
          comentariosTransformados.length
        );

        setPublicacion(publicacionTransformada);
        setComentarios(comentariosTransformados);
        
      } catch (err: any) {
        console.error('Error cargando publicación:', err);
        setError('No se pudo cargar la publicación. Verifica que exista.');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  const manejarToggleLike = async (publicacionId: number) => {
    if (!usuario) {
      setError('Debes iniciar sesión para dar me gusta');
      return;
    }

    try {
      const response = await likeService.toggleLike(publicacionId, usuario.id);
      await recargarPublicacion();
    } catch (error: any) {
      console.error('Error al procesar like:', error);
      setError('No se pudo procesar el me gusta: ' + error.message);
    }
  };

  const manejarMeGusta = (publicacionId: number) => {
    manejarToggleLike(publicacionId);
  };

  const manejarNoMeGusta = (publicacionId: number) => {
    manejarToggleLike(publicacionId);
  };

  const manejarMeGustaComentario = (comentarioId: number) => {
    setComentarios(prev => prev.map(com => 
      com.id === comentarioId ? { ...com, meGustaCount: com.meGustaCount + 1 } : com
    ));
  };

  const manejarEnviarComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim() || !usuario || !publicacion) return;

    try {
      console.log('Enviando comentario para publicación:', publicacion.id);
      
      const comentarioCreado = await comentarioService.crearComentario({
        content: nuevoComentario.trim(),
        userId: usuario.id,
        postId: publicacion.id
      });

      console.log('Comentario creado en API:', comentarioCreado);

      const nuevoCom: Comentario = {
        id: comentarioCreado.id,
        usuario: usuario.nickName,
        contenido: comentarioCreado.content,
        fechaCreacion: 'Hace un momento',
        meGustaCount: 0,
        userId: usuario.id
      };

      setComentarios(prev => [nuevoCom, ...prev]);
      setNuevoComentario('');
      
      setPublicacion(prev => prev ? {
        ...prev,
        comentariosCount: prev.comentariosCount + 1
      } : null);
      
    } catch (error: any) {
      console.error('Error creando comentario:', error);
      setError('No se pudo enviar el comentario: ' + error.message);
    }
  };

  if (cargando) {
    return (
      <div className="container py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-success mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Cargando publicación...</p>
        </div>
      </div>
    );
  }

  if (error || !publicacion) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger text-center">
          <h4>Publicación no encontrada</h4>
          <p>{error || 'La publicación que buscas no existe o ha sido eliminada.'}</p>
          <Link to="/" className="btn btn-success">Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-3 py-md-4">
      {/* Botón volver */}
      <div className="mb-3 mb-md-4">
        <button 
          onClick={() => navigate(-1)}
          className="btn btn-outline-success d-flex align-items-center gap-2"
        >
          <ArrowLeft size={16} />
          Volver
        </button>
      </div>

      {error && (
        <div className="alert alert-danger mb-3 mb-md-4">
          {error}
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {/* Publicación principal */}
          <TarjetaPublicacion
            publicacion={publicacion}
            onMeGusta={manejarMeGusta}
            onNoMeGusta={manejarNoMeGusta}
            esDetalle={true}
          />

          {/* Sección de comentarios */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-success bg-opacity-10 border-0">
              <h5 className="mb-0 d-flex align-items-center gap-2 text-success">
                <Chat size={18} />
                Comentarios ({comentarios.length})
              </h5>
            </div>
            
            {/* Formulario de nuevo comentario */}
            {usuario && (
              <div className="card-body border-bottom">
                <form onSubmit={manejarEnviarComentario}>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Escribe tu comentario..."
                      value={nuevoComentario}
                      onChange={(e) => setNuevoComentario(e.target.value)}
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button 
                      type="submit" 
                      className="btn btn-success d-flex align-items-center gap-2"
                      disabled={!nuevoComentario.trim()}
                    >
                      <Chat size={14} />
                      Comentar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lista de comentarios */}
            <div className="card-body p-3 p-md-4">
              {comentarios.length === 0 ? (
                <p className="text-muted text-center py-3">
                  {usuario ? 'No hay comentarios aún. ¡Sé el primero en comentar!' : 'Inicia sesión para comentar'}
                </p>
              ) : (
                <div>
                  {comentarios.map((comentario) => (
                    <div key={comentario.id} className="border-bottom pb-3 mb-3">
                      <div className="d-flex align-items-start mb-2">
                        <Link 
                          to={`/perfil/${comentario.usuario}`}
                          className="text-decoration-none"
                        >
                          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                              style={{width: '35px', height: '35px', fontSize: '14px'}}>
                            <PersonCircle size={16} />
                          </div>
                        </Link>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start flex-column flex-sm-row">
                            <div className="mb-1 mb-sm-0">
                              <Link 
                                to={`/perfil/${comentario.usuario}`}
                                className="text-decoration-none"
                              >
                                <h6 className="mb-0 fw-bold text-dark">@{comentario.usuario}</h6>
                              </Link>
                              <small className="text-muted d-flex align-items-center gap-1">
                                <Clock size={12} />
                                {comentario.fechaCreacion}
                              </small>
                            </div>
                            <button 
                              className="btn btn-outline-success btn-sm d-flex align-items-center gap-1 mt-1 mt-sm-0"
                              onClick={() => manejarMeGustaComentario(comentario.id)}
                            >
                              <HandThumbsUp size={12} />
                              {comentario.meGustaCount}
                            </button>
                          </div>
                          <p className="mt-2 mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                            {comentario.contenido}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaDetallePublicacion;