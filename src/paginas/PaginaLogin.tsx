import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ContextoUsuario } from '../contexto/ContextoUsuario';
import { usuarioService } from '../servicios/api';
import { Person, Lock, InfoCircle, BoxArrowInRight, PersonPlus, ExclamationTriangle } from 'react-bootstrap-icons';

const PaginaLogin: React.FC = () => {
  const [nickName, setNickName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);
  
  const { iniciarSesion } = useContext(ContextoUsuario);
  const navigate = useNavigate();

  const manejarLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      if (!nickName.trim()) {
        setError('El nickname es requerido');
        setCargando(false);
        return;
      }

      if (password !== '123456') {
        setError('Contraseña incorrecta."');
        setCargando(false);
        return;
      }

      const usuarios = await usuarioService.obtenerUsuarios();
      const usuarioEncontrado = usuarios.find((u: any) => 
        u.nickName && u.nickName.toLowerCase() === nickName.toLowerCase().trim()
      );

      if (!usuarioEncontrado) {
        setError(`Usuario "${nickName}" no encontrado. Regístrate primero.`);
        setCargando(false);
        return;
      }

      iniciarSesion(usuarioEncontrado);
      
      setTimeout(() => {
        navigate('/perfil');
      }, 500);
      
    } catch (err: any) {
      console.error('Error en login:', err);
      setError('Error al conectar con el servidor. Verifica que la API esté ejecutándose.');
    } finally {
      setCargando(false);
    }
  };

  const manejarCambioNickName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNickName(e.target.value);
    if (error) setError('');
  };

  const manejarCambioPassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white text-center py-4">
              <h2 className="h3 mb-0 d-flex align-items-center justify-content-center gap-2">
                <Lock size={24} />
                Iniciar Sesión
              </h2>
            </div>
            
            <div className="card-body p-3 p-md-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                  <ExclamationTriangle size={18} />
                  <div className="small">{error}</div>
                </div>
              )}

              <form onSubmit={manejarLogin}>
                <div className="mb-3">
                  <label htmlFor="nickName" className="form-label fw-semibold d-flex align-items-center gap-2">
                    <Person size={18} />
                    Usuario
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nickName"
                    value={nickName}
                    onChange={manejarCambioNickName}
                    placeholder="Ingresa tu usuario"
                    required
                    disabled={cargando}
                    autoComplete="username"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold d-flex align-items-center gap-2">
                    <Lock size={18} />
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={manejarCambioPassword}
                    placeholder="Ingresa tu contraseña"
                    required
                    disabled={cargando}
                    autoComplete="current-password"
                  />
        
                </div>

                <button 
                  type="submit" 
                  className="btn btn-success w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Verificando usuario...</span>
                    </>
                  ) : (
                    <>
                      <BoxArrowInRight size={18} />
                      <span>Ingresar a la plataforma</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted mb-3">¿No tienes una cuenta?</p>
                <Link to="/registro" className="btn btn-outline-success d-flex align-items-center gap-2 mx-auto" style={{width: 'fit-content'}}>
                  <PersonPlus size={16} />
                  Crear cuenta nueva
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaLogin;