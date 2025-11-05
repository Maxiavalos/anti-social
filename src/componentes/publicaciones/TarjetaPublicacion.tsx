import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BotonesInteraccion from './BotonesInteraccion';
import { Clock, PersonCircle } from 'react-bootstrap-icons';

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

interface TarjetaPublicacionProps {
  publicacion: Publicacion;
  onMeGusta: (id: number) => void;
  onNoMeGusta: (id: number) => void;
  esDetalle?: boolean;
}

const TarjetaPublicacion: React.FC<TarjetaPublicacionProps> = ({
  publicacion,
  onMeGusta,
  onNoMeGusta,
  esDetalle = false
}) => {
  const [mostrarCompleto, setMostrarCompleto] = useState(esDetalle);
  const limiteTexto = 150;

  const textoRecortado = publicacion.descripcion.length > limiteTexto && !mostrarCompleto && !esDetalle
    ? publicacion.descripcion.substring(0, limiteTexto) + '...'
    : publicacion.descripcion;

  const toggleTextoCompleto = () => {
    setMostrarCompleto(!mostrarCompleto);
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body p-3 p-md-4">
        {/* Header de la publicación */}
        <div className="d-flex align-items-center mb-3">
          <Link 
            to={`/perfil/${publicacion.usuario}`}
            className="text-decoration-none d-flex align-items-center"
          >
            <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                 style={{
                   width: '40px', 
                   height: '40px', 
                   fontSize: '16px', 
                   fontWeight: 'bold'
                 }}>
              <PersonCircle size={20} />
            </div>
          </Link>
          <div className="flex-grow-1">
            <Link 
              to={`/perfil/${publicacion.usuario}`}
              className="text-decoration-none"
            >
              <h6 className="mb-0 fw-bold text-dark mb-1">@{publicacion.usuario}</h6>
            </Link>
            <small className="text-muted d-flex align-items-center">
              <Clock size={12} className="me-1" />
              {publicacion.fechaCreacion}
            </small>
          </div>
        </div>

        {/* Contenido de texto */}
        <div className="mb-3">
          <p className="card-text mb-2" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {textoRecortado}
          </p>
          {publicacion.descripcion.length > limiteTexto && !esDetalle && (
            <button 
              onClick={toggleTextoCompleto}
              className="btn btn-link btn-sm p-0 text-decoration-none text-success"
            >
              {mostrarCompleto ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>

        {/* Galería de imágenes */}
        {publicacion.imagenes && publicacion.imagenes.length > 0 && (
          <div className="mb-3">
            <div className={`row g-2 ${esDetalle ? 'row-cols-1 row-cols-md-2' : 'row-cols-2 row-cols-sm-3'}`}>
              {publicacion.imagenes.map((imagen, index) => (
                <div key={index} className="col">
                  <img 
                    src={imagen} 
                    alt={`Imagen ${index + 1} de ${publicacion.usuario}`}
                    className="img-fluid rounded shadow-sm w-100"
                    style={{ 
                      height: esDetalle ? '250px' : '100px', 
                      objectFit: 'cover',
                      minHeight: esDetalle ? '250px' : '100px'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Etiquetas */}
        {publicacion.etiquetas && publicacion.etiquetas.length > 0 && (
          <div className="d-flex flex-wrap gap-1 gap-sm-2 mb-3">
            {publicacion.etiquetas.map((etiqueta: string, index: number) => (
              <span key={index} className="badge bg-success bg-opacity-10 text-success border-0">
                #{etiqueta}
              </span>
            ))}
          </div>
        )}

        {/* Botones de interacción */}
        <BotonesInteraccion
          publicacionId={publicacion.id}
          comentariosCount={publicacion.comentariosCount}
          meGustaCount={publicacion.meGustaCount}
          onMeGusta={onMeGusta}
          onNoMeGusta={onNoMeGusta}
          esDetalle={esDetalle}
        />
      </div>

      <style>{`
        @media (max-width: 576px) {
          .card-body {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TarjetaPublicacion;