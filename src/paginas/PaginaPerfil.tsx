import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ContextoUsuario } from '../contexto/ContextoUsuario';
import { publicacionService, imagenService, usuarioService, type PublicacionAPI, type ImagenAPI, type UsuarioAPI, comentarioService } from '../servicios/api';
import { PersonCircle, Pencil, Clock, Chat, People } from 'react-bootstrap-icons';

interface PublicacionUsuario {
  id: number;
  descripcion: string;
  fechaCreacion: string;
  comentariosCount: number;
  imagenes?: string[];
  etiquetas?: string[];
}

const PaginaPerfil: React.FC = () => {
  const { usuario: usuarioParam } = useParams<{ usuario?: string }>();
  const { usuario: usuarioLogueado, estaLogueado } = useContext(ContextoUsuario);
  const [usuarioPerfil, setUsuarioPerfil] = useState<UsuarioAPI | null>(null);
  const [publicaciones, setPublicaciones] = useState<PublicacionUsuario[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Cargar datos del perfil
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setCargando(true);
        setError('');

        console.log('Cargando perfil para:', usuarioParam || 'usuario logueado');

        // Si es un perfil de otro usuario, buscar sus datos
        let usuarioData: UsuarioAPI;
        if (usuarioParam) {
          // Buscar usuario por nickName
          const usuarios = await usuarioService.obtenerUsuarios();
          const usuarioEncontrado = usuarios.find((u: UsuarioAPI) => 
            u.nickName.toLowerCase() === usuarioParam.toLowerCase()
          );
          
          if (!usuarioEncontrado) {
            setError(`Usuario @${usuarioParam} no encontrado`);
            setCargando(false);
            return;
          }
          usuarioData = usuarioEncontrado;
          setUsuarioPerfil(usuarioData);
        } else {
          // Es el perfil propio
          if (!usuarioLogueado) {
            setError('No estás logueado');
            setCargando(false);
            return;
          }
          usuarioData = {
            id: usuarioLogueado.id,
            nickName: usuarioLogueado.nickName,
            email: usuarioLogueado.email || `${usuarioLogueado.nickName}@ejemplo.com`,
            createdAt: usuarioLogueado.createdAt
          };
          setUsuarioPerfil(usuarioData);
        }

        console.log('Usuario encontrado:', usuarioData);

        // Obtener publicaciones del usuario
        const postsDelUsuario: PublicacionAPI[] = await publicacionService.obtenerPublicaciones(usuarioData.id);
        console.log('Publicaciones encontradas:', postsDelUsuario);

        // Cargar imágenes para cada publicación
        const publicacionesConImagenes = await Promise.all(
          postsDelUsuario.map(async (post: PublicacionAPI) => {
            let imagenesUrls: string[] = [];
            try {
              const imagenesData: ImagenAPI[] = await imagenService.obtenerImagenesPorPublicacion(post.id);
              imagenesUrls = imagenesData.map((img: ImagenAPI) => img.url);
              console.log(`Imágenes para post ${post.id}:`, imagenesUrls);
            } catch (error) {
              console.error(`Error cargando imágenes para post ${post.id}:`, error);
            }

            return {
              id: post.id,
              descripcion: post.description,
              fechaCreacion: new Date(post.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }),
              comentariosCount: (await comentarioService.obtenerComentariosPorPublicacion(post.id)).length,
              imagenes: imagenesUrls,
              etiquetas: post.Tags ? post.Tags.map(tag => tag.name) : []
            };
          })
        );

        setPublicaciones(publicacionesConImagenes);
        console.log('Publicaciones con imágenes:', publicacionesConImagenes);

      } catch (error: any) {
        console.error('Error cargando perfil:', error);
        setError(`Error al cargar el perfil: ${error.message}`);
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, [usuarioParam, usuarioLogueado]);

  // Obtener nombre de usuario para mostrar
  const obtenerNombreUsuario = (): string => {
    if (!usuarioPerfil) return 'U';
    return usuarioPerfil.nickName || 'Usuario';
  };

  // Verificar si es el perfil propio
  const esPerfilPropio = !usuarioParam;

  if (!estaLogueado && !usuarioParam) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h4>Debes iniciar sesión para ver tu perfil</h4>
          <Link to="/login" className="btn btn-success mt-3">
            Ir al Login
          </Link>
        </div>
      </div>
    );
  }

  if (error && error.includes('no encontrado')) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <h4>Usuario no encontrado</h4>
          <p>El usuario @{usuarioParam} no existe.</p>
          <Link to="/" className="btn btn-success mt-3">
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-3 py-md-4 pagina-perfil">
      {/* Header del Perfil */}
      <div className="row mb-4 mb-md-5">
        <div className="col-12 col-md-8 mx-auto">
          <div className="card shadow-sm border-0 perfil-card">
            <div className="card-body text-center p-4 p-md-5">
              <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{
                     width: '70px', 
                     height: '70px', 
                     fontSize: '28px'
                   }}>
                <PersonCircle size={32} />
              </div>
              <h1 className="h3 h2-md mb-2">@{obtenerNombreUsuario()}</h1>
              {usuarioPerfil?.email && (
                <p className="text-muted mb-3 mb-md-4">{usuarioPerfil.email}</p>
              )}
              
              <div className="row text-center">
                <div className="col-4">
                  <div className="h4 text-success mb-1">{publicaciones.length}</div>
                  <small className="text-muted">Publicaciones</small>
                </div>
                <div className="col-4">
                  <div className="h4 text-success mb-1">0</div>
                  <small className="text-muted">Comentarios</small>
                </div>
                <div className="col-4">
                  <div className="h4 text-success mb-1">0</div>
                  <small className="text-muted">
                    <People size={14} className="d-none d-md-inline me-1" />
                    Seguidores
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publicaciones del Usuario */}
      <div className="row">
        <div className="col-12 col-lg-8 mx-auto">
          <div className="d-flex justify-content-between align-items-center mb-3 mb-md-4">
            <h3 className="h4 mb-0">
              {esPerfilPropio ? 'Mis Publicaciones' : `Publicaciones de @${obtenerNombreUsuario()}`}
            </h3>
            {esPerfilPropio && (
              <Link to="/nueva-publicacion" className="btn btn-success d-flex align-items-center gap-2">
                <Pencil size={16} />
                <span className="d-none d-sm-inline">Nueva Publicación</span>
              </Link>
            )}
          </div>

          {error && !error.includes('no encontrado') && (
            <div className="alert alert-warning">
              {error}
            </div>
          )}

          {cargando ? (
            <div className="text-center py-4 py-md-5">
              <div className="spinner-border text-success mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted">Cargando publicaciones...</p>
            </div>
          ) : publicaciones.length === 0 ? (
            <div className="card border-0 text-center py-4 py-md-5">
              <div className="card-body">
                <h4 className="text-muted mb-3">
                  {esPerfilPropio 
                    ? 'Aún no tienes publicaciones' 
                    : `@${obtenerNombreUsuario()} aún no tiene publicaciones`
                  }
                </h4>
                <p className="text-muted mb-4">
                  {esPerfilPropio 
                    ? 'Comienza compartiendo tus ideas con la comunidad' 
                    : 'Este usuario aún no ha compartido nada'
                  }
                </p>
                {esPerfilPropio && (
                  <Link to="/nueva-publicacion" className="btn btn-success d-flex align-items-center gap-2 mx-auto" style={{width: 'fit-content'}}>
                    <Pencil size={16} />
                    Crear mi primera publicación
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {publicaciones.map((publicacion) => (
                <div key={publicacion.id} className="col-12">
                  <div className="card shadow-sm border-0 perfil-card">
                    <div className="card-body p-3 p-md-4">
                      <p className="card-text mb-3">{publicacion.descripcion}</p>
                      
                      {/* Galería de imágenes */}
                      {publicacion.imagenes && publicacion.imagenes.length > 0 && (
                        <div className="mb-3">
                          <div className="row g-2">
                            {publicacion.imagenes.map((imagen, index) => (
                              <div key={index} className="col-6 col-md-4">
                                <img 
                                  src={imagen} 
                                  alt={`Imagen ${index + 1} de la publicación`}
                                  className="img-fluid rounded shadow-sm w-100"
                                  style={{ 
                                    height: '100px', 
                                    objectFit: 'cover' 
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPsOXIEltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {publicacion.etiquetas && publicacion.etiquetas.length > 0 && (
                        <div className="d-flex flex-wrap gap-1 gap-sm-2 mb-3">
                          {publicacion.etiquetas.map((etiqueta: string, index: number) => (
                            <span key={index} className="badge bg-success bg-opacity-10 text-success border-0">
                              #{etiqueta}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-center flex-column flex-sm-row gap-2">
                        <small className="text-muted d-flex align-items-center gap-1">
                          <Clock size={12} />
                          {publicacion.fechaCreacion} • 
                          <Chat size={12} className="ms-2" />
                          {publicacion.comentariosCount} comentarios
                        </small>
                        <Link 
                          to={`/publicacion/${publicacion.id}`}
                          className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
                        >
                          <span>Ver Detalles</span>
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