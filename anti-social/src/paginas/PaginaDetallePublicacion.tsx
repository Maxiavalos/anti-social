import React from 'react';
import { useParams } from 'react-router-dom';

const PaginaDetallePublicacion: React.FC = () => {
  const { id } = useParams();

  return (
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px' }}>
      <h1>Página de Detalle de Publicación</h1>
      <p>Vista detallada de la publicación ID: {id}</p>
    </div>
  );
};

export default PaginaDetallePublicacion;