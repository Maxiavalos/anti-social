import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ContextoUsuario } from '../contexto/ContextoUsuario';
import TarjetaPublicacion from '../componentes/publicaciones/TarjetaPublicacion';
import { 
  publicacionService, 
  comentarioService, 
  imagenService,
  type PublicacionAPI,
  type ComentarioAPI,
  type ImagenAPI 
} from '../servicios/api';

interface Publicacion {
  id: number;
  usuario: string;
  descripcion: string;
  imagenes?: string[];
  fechaCreacion: string;
  comentariosCount: number;
  meGustaCount: number;
  etiquetas?: string[];
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

  // Función para transformar datos de la API al formato del frontend
  const transformarPublicacion = (publicacionAPI: PublicacionAPI, imagenesUrls: string[]): Publicacion => {
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
      comentariosCount: comentarios.length,
      meGustaCount: 0,
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

        // Verificar funciones disponibles (para debugging)
        console.log('Funciones de imagenService:', Object.keys(imagenService));
        console.log('Funciones de comentarioService:', Object.keys(comentarioService));

        // Cargar publicación
        const publicacionData: PublicacionAPI = await publicacionService.obtenerPublicacionPorId(publicacionId);
        console.log('Publicación cargada:', publicacionData);
        
        // Cargar imágenes de la publicación
        let imagenesData: ImagenAPI[] = [];
        try {
          // VERIFICAR: esta función debe llamarse exactamente así en api.js
          imagenesData = await imagenService.obtenerImagenesPorPublicacion(publicacionId);
          console.log('Imágenes cargadas:', imagenesData);
        } catch (error) {
          console.error('Error cargando imágenes:', error);
          // Si falla, continuar sin imágenes
          imagenesData = [];
        }

        // Cargar comentarios
        let comentariosData: ComentarioAPI[] = [];
        try {
          // VERIFICAR: esta función debe llamarse exactamente así en api.js
          comentariosData = await comentarioService.obtenerComentariosPorPublicacion(publicacionId);
          console.log('Comentarios cargados:', comentariosData);
        } catch (error) {
          console.error('Error cargando comentarios:', error);
          // Si falla, continuar sin comentarios
          comentariosData = [];
        }

        // Transformar datos
        const imagenesUrls = imagenesData.map(img => img.url);
        const comentariosTransformados = comentariosData.map(transformarComentario);
        
        const publicacionTransformada = transformarPublicacion(publicacionData, imagenesUrls);
        publicacionTransformada.comentariosCount = comentariosTransformados.length;

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

  const manejarMeGusta = (publicacionId: number) => {
    if (publicacion) {
      setPublicacion({
        ...publicacion,
        meGustaCount: publicacion.meGustaCount + 1
      });
    }
  };

  const manejarNoMeGusta = (publicacionId: number) => {
    if (publicacion) {
      setPublicacion({
        ...publicacion,
        meGustaCount: Math.max(0, publicacion.meGustaCount - 1)
      });
    }
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
      
      // Crear comentario en la API
      const comentarioCreado = await comentarioService.crearComentario({
        content: nuevoComentario.trim(),
        userId: usuario.id,
        postId: publicacion.id
      });

      console.log('Comentario creado en API:', comentarioCreado);

      // Transformar y agregar el nuevo comentario a la lista
      const nuevoCom: Comentario = {
        id: comentarioCreado.id,
        usuario: usuario.nickName,
        contenido: comentarioCreado.content,
        fechaCreacion: 'Hace un momento',
        meGustaCount: 0,
        userId: usuario.id
      };

      // Agregar el nuevo comentario al inicio de la lista
      setComentarios(prev => [nuevoCom, ...prev]);
      setNuevoComentario('');
      
      // Actualizar contador de comentarios en la publicación
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
          <div className="spinner-border text-primary mb-3" role="status">
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
          <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Botón volver */}
      <div className="mb-4">
        <button 
          onClick={() => navigate(-1)}
          className="btn btn-outline-secondary"
        >
          ← Volver
        </button>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Publicación principal */}
          <TarjetaPublicacion
            publicacion={publicacion}
            onMeGusta={manejarMeGusta}
            onNoMeGusta={manejarNoMeGusta}
            esDetalle={true}
          />

          {/* Sección de comentarios */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light">
              <h5 className="mb-0">💬 Comentarios ({comentarios.length})</h5>
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
                      className="btn btn-primary"
                      disabled={!nuevoComentario.trim()}
                    >
                      Comentar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lista de comentarios */}
            <div className="card-body">
              {comentarios.length === 0 ? (
                <p className="text-muted text-center py-3">
                  {usuario ? 'No hay comentarios aún. ¡Sé el primero en comentar!' : 'Inicia sesión para comentar'}
                </p>
              ) : (
                <div>
                  {comentarios.map((comentario) => (
                    <div key={comentario.id} className="border-bottom pb-3 mb-3">
                      <div className="d-flex align-items-start mb-2">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style={{width: '35px', height: '35px', fontSize: '14px'}}>
                          {comentario.usuario.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-0 fw-bold">@{comentario.usuario}</h6>
                              <small className="text-muted">{comentario.fechaCreacion}</small>
                            </div>
                            <button 
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => manejarMeGustaComentario(comentario.id)}
                            >
                              👍 {comentario.meGustaCount}
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