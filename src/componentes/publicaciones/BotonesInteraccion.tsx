import React from 'react';
import { Link } from 'react-router-dom';

interface BotonesInteraccionProps {
  publicacionId: number;
  comentariosCount: number;
  meGustaCount: number;
  onMeGusta: (id: number) => void;
  onNoMeGusta: (id: number) => void;
  esDetalle?: boolean;
}

const BotonesInteraccion: React.FC<BotonesInteraccionProps> = ({
  publicacionId,
  comentariosCount,
  meGustaCount,
  onMeGusta,
  onNoMeGusta,
  esDetalle = false
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center border-top pt-3">
      {/* Botones de interacción */}
      <div className="d-flex gap-3">
        <button 
          className="btn btn-outline-primary btn-sm"
          onClick={() => onMeGusta(publicacionId)}
        >
          👍 {meGustaCount}
        </button>
        <button 
          className="btn btn-outline-secondary btn-sm"
          onClick={() => onNoMeGusta(publicacionId)}
        >
          👎
        </button>
        
           {!esDetalle && (
          <Link 
            to={`/publicacion/${publicacionId}`}
            className="btn btn-outline-info btn-sm"
          >
            💬 {comentariosCount}
          </Link>
        )}
      </div>
      
      {/* Solo mostrar "Ver Más" si no estamos en la vista de detalle */}
      {!esDetalle && (
        <Link 
          to={`/publicacion/${publicacionId}`}
          className="btn btn-primary btn-sm"
        >
          Ver Más
        </Link>
      )}
    </div>
  );
};

export default BotonesInteraccion;