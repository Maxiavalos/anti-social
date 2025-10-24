import React from 'react';
import { Link } from 'react-router-dom';

const PaginaInicio: React.FC = () => {
  return (
    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#333', margin: 0 }}>Página de Inicio</h1>
          <p style={{ fontSize: '18px', margin: 0 }}>Feed de publicaciones recientes</p>
        </div>
        <Link 
          to="/nueva-publicacion" 
          style={{
            backgroundColor: '#2196F3',
            color: 'white',
            padding: '10px 20px',
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          + Nueva Publicación
        </Link>
      </div>

      <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
        <h3>Publicación de ejemplo 1</h3>
        <p>Esta es una publicación de ejemplo en el feed</p>
        <small style={{ color: '#666' }}>5 comentarios • 2 horas</small>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
        <h3>Publicación de ejemplo 2</h3>
        <p>Otra publicación de ejemplo en el feed</p>
        <small style={{ color: '#666' }}>3 comentarios • 5 horas</small>
      </div>
      <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
        <h3>Publicación de ejemplo 3</h3>
        <p>Una publicación más larga de ejemplo para mostrar cómo se vería el contenido extenso en el feed de la aplicación.</p>
        <small style={{ color: '#666' }}>8 comentarios • 1 día</small>
      </div>
    </div>
  );
};

export default PaginaInicio;