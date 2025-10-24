import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ContextoUsuario } from "../../contexto/ContextoUsuario";

const Cabecera: React.FC = () => {
  const { estaLogueado, cerrarSesion, usuario } = useContext(ContextoUsuario);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  const handleCerrarSesion = (): void => {
    cerrarSesion();
    setMenuAbierto(false);
    setDropdownAbierto(false);
    navigate('/');
  };

  const toggleMenu = (): void => {
    setMenuAbierto(!menuAbierto);
  };

  const toggleDropdown = (): void => {
    setDropdownAbierto(!dropdownAbierto);
  };

  const cerrarMenus = (): void => {
    setMenuAbierto(false);
    setDropdownAbierto(false);
  };

  const manejarNavegacion = (): void => {
    cerrarMenus();
  };

  const esPaginaActiva = (path: string): string => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <>
      {/* Navbar Principal */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          {/* Logo */}
          <Link to="/" className="navbar-brand fw-bold d-flex align-items-center" onClick={manejarNavegacion}>
            <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                 style={{width: '32px', height: '32px'}}>
              <span className="fw-bold">U</span>
            </div>
            UnaHur Anti-Social
          </Link>
          
          {/* Botón Mobile - SOLO en móviles */}
          <button 
            className="navbar-toggler d-lg-none border-0" 
            type="button" 
            onClick={toggleMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menú Desktop - SIEMPRE visible en pantallas grandes */}
          <div className="d-none d-lg-flex navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link to="/" className={`nav-link ${esPaginaActiva("/")}`} onClick={manejarNavegacion}>
                  🏠 Inicio
                </Link>
              </li>
            </ul>
            
            {/* Usuario Logueado - Desktop */}
            {estaLogueado ? (
              <div className="navbar-nav align-items-center">
                <li className="nav-item">
                  <Link to="/nueva-publicacion" className="btn btn-warning btn-sm me-2" onClick={manejarNavegacion}>
                    📝 Crear Post
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle d-flex align-items-center cursor-pointer"
                    onClick={toggleDropdown}
                    style={{cursor: 'pointer'}}
                  >
                    <div className="bg-light rounded-circle me-2 d-flex align-items-center justify-content-center" 
                         style={{width: '32px', height: '32px'}}>
                      <span className="text-dark">👤</span>
                    </div>
                    {usuario?.nickName}
                  </a>
                  <ul className={`dropdown-menu dropdown-menu-end ${dropdownAbierto ? 'show' : ''}`}>
                    <li>
                      <Link 
                        to="/perfil" 
                        className="dropdown-item" 
                        onClick={manejarNavegacion}
                      >
                        👤 Mi Perfil
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        onClick={handleCerrarSesion} 
                        className="dropdown-item text-danger"
                      >
                        🚪 Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </li>
              </div>
            ) : (
              /* Usuario No Logueado - Desktop */
              <div className="navbar-nav">
                <li className="nav-item">
                  <Link to="/login" className={`nav-link ${esPaginaActiva("/login")}`} onClick={manejarNavegacion}>
                    🔑 Ingresar
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/registro" className={`btn btn-outline-light btn-sm ms-2 ${esPaginaActiva("/registro")}`} onClick={manejarNavegacion}>
                    Registrarse
                  </Link>
                </li>
              </div>
            )}
          </div>

          {/* Menú Mobile - SOLO en móviles */}
          <div className={`d-lg-none w-100 bg-primary ${menuAbierto ? 'd-block' : 'd-none'}`}>
            <div className="py-3">
              
              {/* Usuario Logueado - Mobile */}
              {estaLogueado ? (
                <div className="d-flex flex-column gap-2">
                  {/* Info Usuario */}
                  <div className="d-flex align-items-center text-white mb-2 px-3">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{width: '40px', height: '40px'}}>
                      <span className="text-dark">👤</span>
                    </div>
                    <div>
                      <div className="fw-bold">@{usuario?.nickName}</div>
                      <small className="text-light">Bienvenido</small>
                    </div>
                  </div>

                  {/* Navegación Mobile */}
                  <Link to="/" className="btn btn-outline-light w-100 text-start rounded-0 border-0 border-bottom" onClick={manejarNavegacion}>
                    🏠 Inicio
                  </Link>
                  
                  <Link to="/nueva-publicacion" className="btn btn-outline-light w-100 text-start rounded-0 border-0 border-bottom" onClick={manejarNavegacion}>
                    📝 Crear Publicación
                  </Link>
                  
                  <Link to="/perfil" className="btn btn-outline-light w-100 text-start rounded-0 border-0 border-bottom" onClick={manejarNavegacion}>
                    👤 Mi Perfil
                  </Link>

                  <button 
                    onClick={handleCerrarSesion} 
                    className="btn btn-outline-danger w-100 text-start rounded-0 border-0 border-bottom mt-3"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              ) : (
                /* Usuario No Logueado - Mobile */
                <div className="d-flex flex-column gap-2">
                  <Link to="/" className="btn btn-outline-light w-100 text-start rounded-0 border-0 border-bottom" onClick={manejarNavegacion}>
                    🏠 Inicio
                  </Link>
                  
                  <Link to="/login" className="btn btn-outline-light w-100 text-start rounded-0 border-0 border-bottom" onClick={manejarNavegacion}>
                    🔑 Ingresar
                  </Link>
                  
                  <Link to="/registro" className="btn btn-light w-100 text-start rounded-0 border-0 border-bottom" onClick={manejarNavegacion}>
                    📝 Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Banner de Bienvenida (solo en homepage) */}
      {location.pathname === "/" && (
        <div className="bg-gradient-primary text-white py-5 shadow">
          <div className="container text-center">
            <h1 className="display-5 fw-bold mb-3">🚀 Bienvenido a UnaHur Anti-Social</h1>
            <p className="lead mb-4">
              La red social donde lo importante es el contenido, no los likes.
              Comparte tus pensamientos sin distracciones.
            </p>
            {!estaLogueado && (
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/registro" className="btn btn-light btn-lg" onClick={manejarNavegacion}>
                  Comenzar Ahora
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg" onClick={manejarNavegacion}>
                  Ingresar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%);
        }
        .btn.text-start {
          padding: 12px 16px;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .dropdown-menu.show {
          display: block;
        }
      `}</style>
    </>
  );
};

export default Cabecera;