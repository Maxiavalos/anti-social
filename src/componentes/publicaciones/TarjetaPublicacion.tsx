import React, { useState } from 'react';
import BotonesInteraccion from './BotonesInteraccion';

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
  const [mostrarCompleto, setMostrarCompleto] = useState(esDetalle); // En detalle mostrar completo
  const limiteTexto = 150;

  const textoRecortado = publicacion.descripcion.length > limiteTexto && !mostrarCompleto && !esDetalle
    ? publicacion.descripcion.substring(0, limiteTexto) + '...'
    : publicacion.descripcion;

  const toggleTextoCompleto = () => {
    setMostrarCompleto(!mostrarCompleto);
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        {/* Header de la publicación */}
        <div className="d-flex align-items-center mb-3">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
               style={{width: '45px', height: '45px', fontSize: '18px', fontWeight: 'bold'}}>
            {publicacion.usuario.charAt(0).toUpperCase()}
          </div>
          <div className="flex-grow-1">
            <h6 className="mb-0 fw-bold">@{publicacion.usuario}</h6>
            <small className="text-muted">
              <i className="bi bi-clock me-1"></i>
              {publicacion.fechaCreacion}
            </small>
          </div>
        </div>

        {/* Contenido de texto */}
        <div className="mb-3">
          <p className="card-text" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
            {textoRecortado}
          </p>
          {publicacion.descripcion.length > limiteTexto && !esDetalle && (
            <button 
              onClick={toggleTextoCompleto}
              className="btn btn-link btn-sm p-0 text-decoration-none"
            >
              {mostrarCompleto ? 'Ver menos' : 'Ver más'}
            </button>
          )}
        </div>

        {/* Galería de imágenes */}
        {publicacion.imagenes && publicacion.imagenes.length > 0 && (
          <div className="mb-3">
            <div className={`row g-2 ${esDetalle ? 'row-cols-1 row-cols-md-2' : ''}`}>
              {publicacion.imagenes.map((imagen, index) => (
                <div key={index} className={esDetalle ? 'col' : 'col-6 col-md-4'}>
                  <img 
                    src={imagen} 
                    alt={`Imagen ${index + 1} de ${publicacion.usuario}`}
                    className="img-fluid rounded shadow-sm"
                    style={{ 
                      height: esDetalle ? '300px' : '120px', 
                      width: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Etiquetas */}
        {publicacion.etiquetas && publicacion.etiquetas.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {publicacion.etiquetas.map((etiqueta: string, index: number) => (
              <span key={index} className="badge bg-light text-dark border">
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
    </div>
  );
};

export default TarjetaPublicacion;