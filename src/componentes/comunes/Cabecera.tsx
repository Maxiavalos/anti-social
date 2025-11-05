import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ContextoUsuario } from "../../contexto/ContextoUsuario";
import { Person, Pencil, House, BoxArrowRight, PersonCircle } from 'react-bootstrap-icons';
import logo from '../../assets/logo.png';
import banner from '../../assets/banner.png';

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
      <nav className="navbar navbar-expand-lg navbar-light bg-success-subtle shadow-sm border-bottom border-success">
        <div className="container">
          {/* Logo */}
          <Link to="/" className="navbar-brand fw-bold d-flex align-items-center" onClick={manejarNavegacion}>
            <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                style={{width: '32px', height: '32px'}}>
              <img src={logo} alt="Logo de la aplicación" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}/>
            </div>
            UnaHur Anti-Social
          </Link>
          
          {/* Botón Mobile - SOLO en móviles */}
          <button 
            className="navbar-toggler d-lg-none border-0" 
            type="button" 
            onClick={toggleMenu}
            style={{ color: '#198754' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menú Desktop - SIEMPRE visible en pantallas grandes */}
          <div className="d-none d-lg-flex navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link to="/" className={`nav-link ${esPaginaActiva("/")}`} onClick={manejarNavegacion}>
                  <House className="me-1" /> Inicio
                </Link>
              </li>
            </ul>
            
            {/* Usuario Logueado - Desktop */}
            {estaLogueado ? (
              <div className="navbar-nav align-items-center">
                <li className="nav-item">
                  <Link to="/nueva-publicacion" className="btn btn-success btn-sm me-2" onClick={manejarNavegacion}>
                    <Pencil className="me-1" /> Crear Post
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
                      <Person className="text-dark" />
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
                        <PersonCircle className="me-1" /> Mi Perfil
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        onClick={handleCerrarSesion} 
                        className="dropdown-item text-danger"
                      >
                        <BoxArrowRight className="me-1" /> Cerrar Sesión
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
                    <Person className="me-1" /> Ingresar
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/registro" className={`btn btn-success btn-sm ms-2 ${esPaginaActiva("/registro")}`} onClick={manejarNavegacion}>
                    Registrarse
                  </Link>
                </li>
              </div>
            )}
          </div>

          {/* Menú Mobile - SOLO en móviles */}
          <div className={`d-lg-none w-100 bg-success ${menuAbierto ? 'd-block' : 'd-none'}`}>
            <div className="py-3">
              
              {/* Usuario Logueado - Mobile */}
              {estaLogueado ? (
                <div className="d-flex flex-column gap-2">
                  {/* Info Usuario */}
                  <div className="d-flex align-items-center text-white mb-2 px-3">
                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3" 
                        style={{width: '40px', height: '40px'}}>
                      <Person className="text-dark" />
                    </div>
                    <div>
                      <div className="fw-bold">@{usuario?.nickName}</div>
                      <small className="text-light">Bienvenido</small>
                    </div>
                  </div>

                  {/* Navegación Mobile */}
                  <Link to="/" className="btn btn-outline-light w-100 text-start rounded-0 border-0 border-bottom" onClick={manejarNavegacion}>
                    <House className="me-2" /> Inicio
                  </Link>
                  
                  <Link to="/nueva-publicacion" className="btn btn-outline-light w-100 text-start rounded-0 border-0 border-bottom" onClick={manejarNavegacion}>
                    <Pencil className="me-2" /> Crear Publicación
                  </Link>
                  
                  <Link to="/perfil" className="btn btn-outline-light w-100 text-start rounded-0 border-0 border-bottom" onClick={manejarNavegacion}>
                    <PersonCircle className="me-2" /> Mi Perfil
                  </Link>

                  <button 
                    onClick={handleCerrarSesion} 
                    className="btn btn-outline-light w-100 text-start rounded-0 border-0 border-bottom mt-3"
                  >
                    <BoxArrowRight className="me-2" /> Cerrar Sesión
                  </button>
                </div>
              ) : (
                /* Usuario No Logueado - Mobile */
                <div className="d-flex flex-column gap-2">
                  <Link to="/" className="btn btn-outline-light w-100 text-start rounded-0 border-0 border-bottom" onClick={manejarNavegacion}>
                    <House className="me-2" /> Inicio
                  </Link>
                  
                  <Link to="/login" className="btn btn-outline-light w-100 text-start rounded-0 border-0 border-bottom" onClick={manejarNavegacion}>
                    <Person className="me-2" /> Ingresar
                  </Link>
                  
                  <Link to="/registro" className="btn btn-light w-100 text-start rounded-0 border-0 border-bottom" onClick={manejarNavegacion}>
                    <Pencil className="me-2" /> Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Banner de Bienvenida (solo en homepage) */}
      {location.pathname === "/" && (
        <div className="banner-container shadow">
          <img
            src={banner}
            alt="Banner principal"
            className="banner-img"
          />
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
        .banner-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          background-color: #000;
        }
        .banner-img {
          width: 100%;
          max-height: 380px;
          object-position: center 60%;
          object-fit: cover;
          display: block;
        }
        .banner-buttons {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
        }
        .navbar-toggler:focus {
          box-shadow: 0 0 0 0.1rem rgba(25, 135, 84, 0.25);
        }
        @media (max-width: 768px) {
          .banner-img {
            max-height: 250px;
          }
          .banner-buttons .btn {
            font-size: 1rem;
            padding: 0.6rem 1.2rem;
          }
        }
      `}</style>
    </>
  );
};

export default Cabecera;