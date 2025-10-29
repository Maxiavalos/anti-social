import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContextoUsuario } from '../contexto/ContextoUsuario';
import { publicacionService, imagenService } from '../servicios/api';

interface PublicacionUsuario {
  id: number;
  descripcion: string;
  fechaCreacion: string;
  comentariosCount: number;
  imagenes?: string[];
  etiquetas?: string[];
}

const PaginaPerfil: React.FC = () => {
  const { usuario, estaLogueado } = useContext(ContextoUsuario);
  const [publicaciones, setPublicaciones] = useState<PublicacionUsuario[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [estadisticas, setEstadisticas] = useState({
    totalPublicaciones: 0,
    totalComentarios: 0
  });

  // Cargar publicaciones del usuario
  useEffect(() => {
    const cargarPublicacionesUsuario = async () => {
      if (!usuario) {
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setError('');
        
        // Obtener y filtrar publicaciones del usuario
        const todasLasPublicaciones = await publicacionService.obtenerPublicaciones();
        const postsDelUsuario = todasLasPublicaciones.filter((post: any) => 
          post.userId === usuario.id
        );

        // Transformar datos y obtener imágenes
        const publicacionesConImagenes = await Promise.all(
          postsDelUsuario.map(async (post: any) => {
            let imagenes: string[] = [];
            try {
              const imagenesData = await imagenService.obtenerImagenes(post.id);
              imagenes = imagenesData.map((img: any) => img.url);
            } catch (error) {
              // No hay imágenes para esta publicación
            }

            return {
              id: post.id,
              descripcion: post.description,
              fechaCreacion: new Date(post.createdAt || post.fechaCreacion || Date.now()).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              comentariosCount: 0,
              imagenes: imagenes,
              etiquetas: post.tags || []
            };
          })
        );

        setPublicaciones(publicacionesConImagenes);
        
        setEstadisticas({
          totalPublicaciones: publicacionesConImagenes.length,
          totalComentarios: publicacionesConImagenes.reduce((total, pub) => total + pub.comentariosCount, 0)
        });

      } catch (error: any) {
        setError(`Error al cargar publicaciones: ${error.message}`);
        
        // Datos de ejemplo en caso de error
        setPublicaciones([
          {
            id: 1,
            descripcion: 'Bienvenido a tu perfil! Esta es tu primera publicación de ejemplo.',
            fechaCreacion: new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            comentariosCount: 0,
            etiquetas: ['Bienvenida']
          }
        ]);
      } finally {
        setCargando(false);
      }
    };

    if (estaLogueado && usuario) {
      cargarPublicacionesUsuario();
    } else {
      setCargando(false);
    }
  }, [usuario, estaLogueado]);

  // Obtener nombre de usuario
  const obtenerNombreUsuario = (): string => {
    if (!usuario) return 'U';
    return usuario.nickName || 'Usuario';
  };

  const obtenerInicial = (): string => {
    const nombre = obtenerNombreUsuario();
    return nombre.charAt(0).toUpperCase();
  };

  if (!estaLogueado || !usuario) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h4>Debes iniciar sesión para ver tu perfil</h4>
          <Link to="/login" className="btn btn-primary mt-3">
            Ir al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header del Perfil */}
      <div className="row mb-5">
        <div className="col-md-8 mx-auto">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center p-5">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{width: '80px', height: '80px', fontSize: '32px'}}>
                {obtenerInicial()}
              </div>
              <h1 className="h2 mb-2">@{obtenerNombreUsuario()}</h1>
              
              <div className="row text-center">
                <div className="col-4">
                  <div className="h4 text-primary mb-1">{estadisticas.totalPublicaciones}</div>
                  <small className="text-muted">Publicaciones</small>
                </div>
                <div className="col-4">
                  <div className="h4 text-success mb-1">{estadisticas.totalComentarios}</div>
                  <small className="text-muted">Comentarios</small>
                </div>
                <div className="col-4">
                  <div className="h4 text-info mb-1">0</div>
                  <small className="text-muted">Seguidores</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publicaciones del Usuario */}
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="h4 mb-0">Mis Publicaciones</h3>
            <Link to="/nueva-publicacion" className="btn btn-primary">
              Nueva Publicación
            </Link>
          </div>

          {error && (
            <div className="alert alert-warning">
              {error}
            </div>
          )}

          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted">Cargando tus publicaciones...</p>
            </div>
          ) : publicaciones.length === 0 ? (
            <div className="card border-0 text-center py-5">
              <div className="card-body">
                <h4 className="text-muted">Aún no tienes publicaciones</h4>
                <Link to="/nueva-publicacion" className="btn btn-primary">
                  Crear mi primera publicación
                </Link>
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {publicaciones.map((publicacion) => (
                <div key={publicacion.id} className="col-12">
                  <div className="card shadow-sm border-0">
                    <div className="card-body">
                      <p className="card-text">{publicacion.descripcion}</p>
                      
                      {publicacion.imagenes && publicacion.imagenes.length > 0 && (
                        <div className="mb-3">
                          <div className="row g-2">
                            {publicacion.imagenes.slice(0, 3).map((imagen, index) => (
                              <div key={index} className="col-4">
                                <img 
                                  src={imagen} 
                                  alt={`Imagen ${index + 1}`}
                                  className="img-fluid rounded"
                                  style={{ height: '80px', width: '100%', objectFit: 'cover' }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {publicacion.etiquetas && publicacion.etiquetas.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          {publicacion.etiquetas.map((etiqueta: string, index: number) => (
                            <span key={index} className="badge bg-light text-dark border">
                              #{etiqueta}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {publicacion.fechaCreacion} • {publicacion.comentariosCount} comentarios
                        </small>
                        <Link 
                          to={`/publicacion/${publicacion.id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Ver Detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaginaPerfil;