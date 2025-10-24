import React from 'react';

const PaginaNuevaPublicacion: React.FC = () => {
  return (
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px' }}>
      <h1>Página de Nueva Publicación</h1>
      <p>Formulario para crear nueva publicación</p>
      <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
        <h3>Formulario de nueva publicación:</h3>
        <p>Descripción: [input aquí]</p>
        <p>Imágenes: [input aquí]</p>
        <p>Etiquetas: [select aquí]</p>
        <button>Crear Publicación</button>
      </div>
    </div>
  );
};

export default PaginaNuevaPublicacion;