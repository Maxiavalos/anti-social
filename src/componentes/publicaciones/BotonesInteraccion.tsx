import React from 'react';
import { Link } from 'react-router-dom';
import { HandThumbsUp, HandThumbsDown, Chat, ArrowRight } from 'react-bootstrap-icons';

interface BotonesInteraccionProps {
  publicacionId: number;
  comentariosCount: number;
  meGustaCount: number;
  onMeGusta: (id: number) => void;
  //onNoMeGusta: (id: number) => void;
  esDetalle?: boolean;
}

const BotonesInteraccion: React.FC<BotonesInteraccionProps> = ({
  publicacionId,
  comentariosCount,
  meGustaCount,
  onMeGusta,
  //onNoMeGusta,
  esDetalle = false
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center border-top pt-3">
      {/* Botones de interacción */}
      <div className="d-flex gap-2 gap-sm-3 flex-wrap">
        <button 
          className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
          onClick={() => onMeGusta(publicacionId)}
        >
          <HandThumbsUp size={14} />
          <span>{meGustaCount}</span>
        </button>
        
        
        {!esDetalle && (
          <Link 
            to={`/publicacion/${publicacionId}`}
            className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
          >
            <Chat size={14} />
            <span>{comentariosCount}</span>
          </Link>
        )}
      </div>
      
      {/* Solo mostrar "Ver Más" si no estamos en la vista de detalle */}
      {!esDetalle && (
        <Link 
          to={`/publicacion/${publicacionId}`}
          className="btn btn-success btn-sm d-flex align-items-center gap-1 ms-2"
        >
          <span>Ver Más</span>
          <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
};

export default BotonesInteraccion;