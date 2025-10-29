import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ContextoUsuario } from '../contexto/ContextoUsuario';
import { usuarioService } from '../servicios/api';

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
      // Validar campos requeridos
      if (!nickName.trim()) {
        setError('El nickname es requerido');
        setCargando(false);
        return;
      }

      // Validar contraseña fija "123456" según el TP
      if (password !== '123456') {
        setError('Contraseña incorrecta. Usa "123456"');
        setCargando(false);
        return;
      }

      // Buscar usuario en la API
      const usuarios = await usuarioService.obtenerUsuarios();
      const usuarioEncontrado = usuarios.find((u: any) => 
        u.nickName && u.nickName.toLowerCase() === nickName.toLowerCase().trim()
      );

      if (!usuarioEncontrado) {
        setError(`Usuario "${nickName}" no encontrado. Regístrate primero.`);
        setCargando(false);
        return;
      }

      // Iniciar sesión con el usuario encontrado
      iniciarSesion(usuarioEncontrado);
      
      // Navegar al perfil
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center py-4">
              <h2 className="mb-0">🔑 Iniciar Sesión</h2>
            </div>
            
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={manejarLogin}>
                <div className="mb-3">
                  <label htmlFor="nickName" className="form-label fw-semibold">
                    <i className="bi bi-person me-2"></i>
                    Nickname
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="nickName"
                    value={nickName}
                    onChange={manejarCambioNickName}
                    placeholder="Ingresa tu nickname"
                    required
                    disabled={cargando}
                    autoComplete="username"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">
                    <i className="bi bi-lock me-2"></i>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="password"
                    value={password}
                    onChange={manejarCambioPassword}
                    placeholder="Usa 123456 para prueba"
                    required
                    disabled={cargando}
                    autoComplete="current-password"
                  />
                  <div className="form-text text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Contraseña de prueba: <strong>123456</strong>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg w-100 py-3"
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Verificando usuario...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Ingresar a la plataforma
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted mb-2">¿No tienes una cuenta?</p>
                <Link to="/registro" className="btn btn-outline-primary">
                  <i className="bi bi-person-plus me-2"></i>
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