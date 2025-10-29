import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ContextoUsuario } from '../contexto/ContextoUsuario';
import ListaPublicaciones from '../componentes/publicaciones/ListaPublicaciones';

const PaginaInicio: React.FC = () => {
  const { estaLogueado } = useContext(ContextoUsuario);

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h3 mb-1">📱 Feed Principal</h2>
              <p className="text-muted mb-0">Descubre lo que está pasando en la comunidad</p>
            </div>
            {estaLogueado && (
              <Link to="/nueva-publicacion" className="btn btn-primary">
                Crear Publicación
              </Link>
            )}
          </div>

          {/* ESTA ES LA PARTE IMPORTANTE - Usa ListaPublicaciones */}
          <ListaPublicaciones />
        </div>

        <div className="col-lg-4">
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

          <div className="card shadow-sm border-0">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0">🔥 Trending</h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-primary">#React</span>
                <span className="badge bg-success">#TypeScript</span>
                <span className="badge bg-info">#Bootstrap</span>
                <span className="badge bg-warning">#Frontend</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaInicio;