import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ContextoUsuario } from "../../contexto/ContextoUsuario";

const Cabecera: React.FC = () => {
  const contexto = useContext(ContextoUsuario);
  
  // Verificación segura por si el contexto no está disponible
  if (!contexto) {
    return (
      <header style={{ 
        borderBottom: '2px solid #333', 
        padding: '1rem',
        backgroundColor: '#2196F3',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>UnaHur Anti-Social Net</h1>
          <nav>
            <Link to="/" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>Inicio</Link>
            <Link to="/login" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/registro" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>Registro</Link>
          </nav>
        </div>
      </header>
    );
  }

  const { estaLogueado, cerrarSesion } = contexto;

  return (
    <header style={{ 
      borderBottom: '2px solid #333', 
      padding: '1rem',
      backgroundColor: '#2196F3',
      color: 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>UnaHur Anti-Social Net</h1>
        <nav>
          <Link to="/" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>Inicio</Link>
          <Link to="/login" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>Login</Link>
          <Link to="/registro" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>Registro</Link>
          {estaLogueado ? (
            <>
              <Link to="/perfil" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>Perfil</Link>
              <Link to="/nueva-publicacion" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>Nueva Publicación</Link>
              <button onClick={cerrarSesion} style={{ marginLeft: '1rem' }}>Cerrar Sesión</button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Cabecera;