import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ContextoUsuario } from '../contexto/ContextoUsuario';

const PaginaLogin: React.FC = () => {
  const [nickName, setNickName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);
  
  const contexto = useContext(ContextoUsuario);
  const navigate = useNavigate();

  // Verificar que el contexto esté disponible
  if (!contexto) {
    return (
      <div className="alert alert-danger">
        Error: Contexto de usuario no disponible
      </div>
    );
  }

  const { iniciarSesion } = contexto;

  const manejarLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      // Validación simple - contraseña fija "123456"
      if (password !== '123456') {
        setError('Contraseña incorrecta. Usa "123456"');
        setCargando(false);
        return;
      }

      if (!nickName.trim()) {
        setError('El nickname es requerido');
        setCargando(false);
        return;
      }

      // Simulación de login exitoso
      const usuarioSimulado = {
        id: Math.floor(Math.random() * 1000) + 1,
        nickName: nickName.trim()
      };

      console.log('Intentando iniciar sesión con:', usuarioSimulado);
      
      // Llamar a la función del contexto
      iniciarSesion(usuarioSimulado);
      
      // Navegar después de un pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        navigate('/perfil');
      }, 100);
      
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al iniciar sesión');
      setCargando(false);
    }
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
                  {error}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickName(e.target.value)}
                    placeholder="Ingresa tu nickname"
                    required
                    disabled={cargando}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="Usa 123456 para prueba"
                    required
                    disabled={cargando}
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
                      Iniciando sesión...
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