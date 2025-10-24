import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContextoUsuario } from '../contexto/ContextoUsuario';

interface Publicacion {
  id: number;
  usuario: string;
  contenido: string;
  etiquetas: string[];
  comentarios: number;
  tiempo: string;
  reacciones: number;
}

const PaginaInicio: React.FC = () => {
  const { estaLogueado } = useContext(ContextoUsuario);
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  // Datos de ejemplo (simulando API)
  useEffect(() => {
    const timer = setTimeout(() => {
      const datosEjemplo: Publicacion[] = [
        {
          id: 1,
          usuario: 'maria_dev',
          contenido: 'Acabo de terminar mi primer proyecto en React con TypeScript. ¡Qué satisfacción ver todo funcionando! ¿Alguien más está aprendiendo desarrollo frontend?',
          etiquetas: ['React', 'TypeScript', 'Desarrollo'],
          comentarios: 8,
          tiempo: '2 horas',
          reacciones: 15
        },
        {
          id: 2,
          usuario: 'coder_ana',
          contenido: '¿Recomiendan algún curso bueno de Bootstrap 5? Quiero mejorar mis habilidades de diseño responsive.',
          etiquetas: ['Bootstrap', 'CSS', 'Frontend'],
          comentarios: 12,
          tiempo: '5 horas',
          reacciones: 23
        },
        {
          id: 3,
          usuario: 'tech_lover',
          contenido: 'Compartiendo mi setup de desarrollo actual: VS Code + React + Bootstrap. ¡Productividad al máximo! 💻',
          etiquetas: ['Setup', 'Productividad', 'Tools'],
          comentarios: 5,
          tiempo: '1 día',
          reacciones: 31
        }
      ];
      setPublicaciones(datosEjemplo);
      setCargando(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container-fluid px-0">
      {/* Contenido Principal */}
      <div className="container py-4">
        <div className="row">
          {/* Columna Principal - Feed */}
          <div className="col-lg-8">
            {/* Header del Feed */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="h3 mb-1">📱 Feed Principal</h2>
                <p className="text-muted mb-0">Descubre lo que está pasando en la comunidad</p>
              </div>
              {estaLogueado && (
                <Link to="/nueva-publicacion" className="btn btn-primary">
                  <i className="bi bi-pencil-square me-2"></i>
                  Crear Publicación
                </Link>
              )}
            </div>

            {/* Publicaciones */}
            {cargando ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-muted">Cargando publicaciones...</p>
              </div>
            ) : (
              <div className="row g-4">
                {publicaciones.map((publicacion) => (
                  <div key={publicacion.id} className="col-12">
                    <div className="card shadow-sm border-0 hover-shadow">
                      <div className="card-body">
                        {/* Header de la publicación */}
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                               style={{width: '45px', height: '45px', fontSize: '18px', fontWeight: 'bold'}}>
                            {publicacion.usuario.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-0 fw-bold">@{publicacion.usuario}</h6>
                            <small className="text-muted">
                              <i className="bi bi-clock me-1"></i>
                              {publicacion.tiempo}
                            </small>
                          </div>
                        </div>

                        {/* Contenido */}
                        <p className="card-text mb-3">{publicacion.contenido}</p>

                        {/* Etiquetas */}
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          {publicacion.etiquetas.map((etiqueta: string, index: number) => (
                            <span key={index} className="badge bg-light text-dark border">
                              #{etiqueta}
                            </span>
                          ))}
                        </div>

                        {/* Stats y Acciones */}
                        <div className="d-flex justify-content-between align-items-center border-top pt-3">
                          <div className="d-flex gap-4 text-muted">
                            <small>
                              <i className="bi bi-chat me-1"></i>
                              {publicacion.comentarios} comentarios
                            </small>
                            <small>
                              <i className="bi bi-heart me-1"></i>
                              {publicacion.reacciones} reacciones
                            </small>
                          </div>
                          <Link 
                            to={`/publicacion/${publicacion.id}`} 
                            className="btn btn-outline-primary btn-sm"
                          >
                            <i className="bi bi-eye me-1"></i>
                            Ver Publicación
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Stats de la Comunidad */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-transparent border-0">
                <h5 className="card-title mb-0">📊 Comunidad Activa</h5>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-4">
                    <div className="h4 text-primary mb-1">1.2k</div>
                    <small className="text-muted">Usuarios</small>
                  </div>
                  <div className="col-4">
                    <div className="h4 text-success mb-1">456</div>
                    <small className="text-muted">Publicaciones</small>
                  </div>
                  <div className="col-4">
                    <div className="h4 text-info mb-1">2.3k</div>
                    <small className="text-muted">Comentarios</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Tags */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-transparent border-0">
                <h5 className="card-title mb-0">🔥 Trending Topics</h5>
              </div>
              <div className="card-body">
                <div className="d-flex flex-wrap gap-2">
                  {['React', 'Bootstrap', 'TypeScript', 'JavaScript', 'CSS', 'Frontend', 'UI/UX', 'Responsive'].map((tag, index) => (
                    <span key={index} className="badge bg-primary bg-opacity-10 text-primary">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sobre Nosotros */}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-transparent border-0">
                <h5 className="card-title mb-0">ℹ️ Sobre Nosotros</h5>
              </div>
              <div className="card-body">
                <p className="card-text">
                  <strong>UnaHur Anti-Social Net</strong> es un espacio para compartir conocimiento 
                  y experiencias sobre desarrollo web y tecnología.
                </p>
                <div className="d-grid gap-2">
                  {!estaLogueado ? (
                    <Link to="/registro" className="btn btn-outline-primary">
                      Únete a la Comunidad
                    </Link>
                  ) : (
                    <Link to="/nueva-publicacion" className="btn btn-primary">
                      Comparte Algo
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos personalizados */}
      <style>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%);
        }
        .hover-shadow {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default PaginaInicio;