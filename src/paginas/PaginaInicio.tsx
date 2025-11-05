import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ContextoUsuario } from '../contexto/ContextoUsuario';
import ListaPublicaciones from '../componentes/publicaciones/ListaPublicaciones';
import { Person, ShieldCheck, People, Lightning, Pencil, GraphUp, Fire } from 'react-bootstrap-icons';

const PaginaInicio: React.FC = () => {
  const { estaLogueado } = useContext(ContextoUsuario);

  return (
    <div className="container py-3 py-md-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 gap-sm-3 mb-4">
            <div className="flex-grow-1">
              <h2 className="h3 h4-md mb-1">Feed Principal</h2>
              <p className="text-muted mb-0 small">Descubre lo que está pasando en la comunidad</p>
            </div>
            {estaLogueado && (
              <Link 
                to="/nueva-publicacion" 
                className="btn btn-success d-flex align-items-center gap-2 flex-shrink-0"
                style={{ whiteSpace: 'nowrap' }}
              >
                <Pencil size={16} />
                <span className="d-none d-sm-inline">Crear Publicación</span>
                <span className="d-sm-none">Crear</span>
              </Link>
            )}
          </div>

          {estaLogueado ? (
            <ListaPublicaciones />
          ) : (
            <div className="row g-3 g-md-4">
              {/* Características principales */}
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-3 p-md-4">
                    <h4 className="text-center mb-3 mb-md-4 h5 h4-md">¿Por qué elegir Anti-Social?</h4>
                    <div className="row g-3 g-md-4">
                      <div className="col-12 col-md-4 text-center">
                        <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                             style={{width: '50px', height: '50px'}}>
                          <ShieldCheck className="text-success" size={20} />
                        </div>
                        <h6 className="fw-bold">Enfoque en el contenido</h6>
                        <p className="text-muted small">
                          Sin algoritmos que distraigan. Tu contenido llega a quien realmente le importa.
                        </p>
                      </div>
                      <div className="col-12 col-md-4 text-center">
                        <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                             style={{width: '50px', height: '50px'}}>
                          <People className="text-success" size={20} />
                        </div>
                        <h6 className="fw-bold">Comunidad real</h6>
                        <p className="text-muted small">
                          Conecta con estudiantes y profesionales que comparten tus intereses.
                        </p>
                      </div>
                      <div className="col-12 col-md-4 text-center">
                        <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                             style={{width: '50px', height: '50px'}}>
                          <Lightning className="text-success" size={20} />
                        </div>
                        <h6 className="fw-bold">Sin distracciones</h6>
                        <p className="text-muted small">
                          Interfaz limpia y minimalista para que te concentres en lo importante.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ejemplos de contenido */}
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-3 p-md-4">
                    <h5 className="text-center mb-3 mb-md-4 h6 h5-md">Lo que la comunidad está compartiendo</h5>
                    <div className="row g-2 g-md-3">
                      <div className="col-12 col-md-6">
                        <div className="card border">
                          <div className="card-body p-3">
                            <div className="d-flex align-items-center mb-3">
                              <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white me-3" 
                                   style={{width: '35px', height: '35px', fontSize: '12px'}}>
                                AU
                              </div>
                              <div>
                                <div className="fw-bold small">Ana Universidad</div>
                                <div className="text-muted extra-small">Estudiante de Informática</div>
                              </div>
                            </div>
                            <p className="card-text small mb-3">
                              "Acabo de terminar mi proyecto final usando React y TypeScript. ¡La comunidad me ayudó mucho!"
                            </p>
                            <div className="d-flex justify-content-between text-muted extra-small">
                              <span>12 comentarios</span>
                              <span>2 horas</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="card border">
                          <div className="card-body p-3">
                            <div className="d-flex align-items-center mb-3">
                              <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white me-3" 
                                   style={{width: '35px', height: '35px', fontSize: '12px'}}>
                                CP
                              </div>
                              <div>
                                <div className="fw-bold small">Carlos Programador</div>
                                <div className="text-muted extra-small">Desarrollador Senior</div>
                              </div>
                            </div>
                            <p className="card-text small mb-3">
                              "Compartiendo tips sobre mejores prácticas en desarrollo web. ¿Alguien más los usa?"
                            </p>
                            <div className="d-flex justify-content-between text-muted extra-small">
                              <span>8 comentarios</span>
                              <span>5 horas</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Llamada a la acción */}
              <div className="col-12">
                <div className="card border-success border-2">
                  <div className="card-body text-center p-4 p-md-5">
                    <h4 className="text-success mb-3 h5 h4-md">¿Listo para unirte?</h4>
                    <p className="text-muted mb-4">
                      Regístrate ahora y comienza a formar parte de nuestra comunidad educativa
                    </p>
                    <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center flex-wrap">
                      <Link to="/registro" className="btn btn-success btn-lg flex-fill flex-sm-grow-0">
                        Crear mi cuenta
                      </Link>
                      <Link to="/login" className="btn btn-outline-success btn-lg flex-fill flex-sm-grow-0">
                        Ya tengo cuenta
                      </Link>
                    </div>
                    <div className="mt-3">
                      <small className="text-muted">
                        Es rápido, fácil y completamente gratuito
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4 mt-4 mt-lg-0">
          {/* Estadísticas de la comunidad */}
          <div className="card shadow-sm border-0 mb-3 mb-md-4">
            <div className="card-header bg-transparent border-0 pb-0">
              <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                <GraphUp className="text-success" size={18} />
                Nuestra Comunidad
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-4">
                  <div className="h4 text-success mb-1">+1.2k</div>
                  <small className="text-muted">Estudiantes</small>
                </div>
                <div className="col-4">
                  <div className="h4 text-success mb-1">+456</div>
                  <small className="text-muted">Proyectos</small>
                </div>
                <div className="col-4">
                  <div className="h4 text-success mb-1">+2.3k</div>
                  <small className="text-muted">Discusiones</small>
                </div>
              </div>
            </div>
          </div>

          {/* Trending topics */}
          <div className="card shadow-sm border-0 mb-3 mb-md-4">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                <Fire className="text-success" size={18} />
                Temas Populares
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-1 gap-sm-2 mb-3">
                <span className="badge bg-success">#ReactJS</span>
                <span className="badge bg-success">#TypeScript</span>
                <span className="badge bg-success">#NodeJS</span>
                <span className="badge bg-success">#Bootstrap</span>
                <span className="badge bg-success">#SQLite</span>
                <span className="badge bg-success">#Git</span>
              </div>
              <small className="text-muted">
                Participa en estas conversaciones
              </small>
            </div>
          </div>

          {/* Información adicional */}
          {!estaLogueado && (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-transparent border-0">
                <h5 className="card-title mb-0 d-flex align-items-center gap-2">
                  <Person className="text-success" size={18} />
                  ¿Cómo funciona?
                </h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-start mb-3">
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white me-3 flex-shrink-0" 
                       style={{width: '28px', height: '28px', fontSize: '11px'}}>
                    1
                  </div>
                  <div>
                    <small className="fw-bold">Crea tu cuenta</small>
                    <small className="text-muted d-block">Registro rápido y sencillo</small>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-3">
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white me-3 flex-shrink-0" 
                       style={{width: '28px', height: '28px', fontSize: '11px'}}>
                    2
                  </div>
                  <div>
                    <small className="fw-bold">Comparte contenido</small>
                    <small className="text-muted d-block">Publica tus proyectos y preguntas</small>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white me-3 flex-shrink-0" 
                       style={{width: '28px', height: '28px', fontSize: '11px'}}>
                    3
                  </div>
                  <div>
                    <small className="fw-bold">Conecta con otros</small>
                    <small className="text-muted d-block">Interactúa con la comunidad</small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .extra-small {
          font-size: 0.75rem;
        }
        @media (max-width: 576px) {
          .h4-md {
            font-size: 1.1rem;
          }
          .h5-md {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PaginaInicio;