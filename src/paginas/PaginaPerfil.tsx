import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContextoUsuario } from '../contexto/ContextoUsuario';

interface PublicacionUsuario {
  id: number;
  descripcion: string;
  fechaCreacion: string;
  comentarios: number;
}

const PaginaPerfil: React.FC = () => {
  const { usuario } = useContext(ContextoUsuario);
  const [publicaciones, setPublicaciones] = useState<PublicacionUsuario[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  // Simular carga de publicaciones del usuario
  useEffect(() => {
    const timer = setTimeout(() => {
      const publicacionesUsuario: PublicacionUsuario[] = [
        {
          id: 1,
          descripcion: 'Mi primera publicación en UnaHur Anti-Social Net. ¡Estoy emocionado de ser parte de esta comunidad!',
          fechaCreacion: '2024-01-15',
          comentarios: 3
        },
        {
          id: 2,
          descripcion: 'Compartiendo mi progreso en el aprendizaje de React con TypeScript. Los tipos hacen toda la diferencia.',
          fechaCreacion: '2024-01-14',
          comentarios: 7
        },
        {
          id: 3,
          descripcion: '¿Alguien más está trabajando en el TP de Construcción de Interfaces? ¡Intercambiemos ideas!',
          fechaCreacion: '2024-01-12',
          comentarios: 5
        }
      ];
      setPublicaciones(publicacionesUsuario);
      setCargando(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!usuario) {
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
                {usuario.nickName.charAt(0).toUpperCase()}
              </div>
              <h1 className="h2 mb-2">@{usuario.nickName}</h1>
              <p className="text-muted mb-4">
                <i className="bi bi-person me-1"></i>
                Miembro de UnaHur Anti-Social Net
              </p>
              
              <div className="row text-center">
                <div className="col-4">
                  <div className="h4 text-primary mb-1">{publicaciones.length}</div>
                  <small className="text-muted">Publicaciones</small>
                </div>
                <div className="col-4">
                  <div className="h4 text-success mb-1">
                    {publicaciones.reduce((total, pub) => total + pub.comentarios, 0)}
                  </div>
                  <small className="text-muted">Comentarios</small>
                </div>
                <div className="col-4">
                  <div className="h4 text-info mb-1">42</div>
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
            <h3 className="h4 mb-0">📝 Mis Publicaciones</h3>
            <Link to="/nueva-publicacion" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Publicación
            </Link>
          </div>

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
                <i className="bi bi-journal-text display-1 text-muted mb-3"></i>
                <h4 className="text-muted">Aún no tienes publicaciones</h4>
                <p className="text-muted mb-4">
                  Comparte tus primeros pensamientos con la comunidad
                </p>
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
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>
                          {publicacion.fechaCreacion} • 
                          <i className="bi bi-chat ms-2 me-1"></i>
                          {publicacion.comentarios} comentarios
                        </small>
                        <Link 
                          to={`/publicacion/${publicacion.id}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          <i className="bi bi-eye me-1"></i>
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