import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ContextoUsuario } from '../contexto/ContextoUsuario';

interface FormularioRegistro {
  nickName: string;
  password: string;
  confirmarPassword: string;
}

const PaginaRegistro: React.FC = () => {
  const [formulario, setFormulario] = useState<FormularioRegistro>({
    nickName: '',
    password: '',
    confirmarPassword: ''
  });
  const [error, setError] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);
  
  const { iniciarSesion } = useContext(ContextoUsuario);
  const navigate = useNavigate();

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarRegistro = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      // Validaciones
      if (!formulario.nickName.trim()) {
        setError('El nickname es requerido');
        setCargando(false);
        return;
      }

      if (formulario.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setCargando(false);
        return;
      }

      if (formulario.password !== formulario.confirmarPassword) {
        setError('Las contraseñas no coinciden');
        setCargando(false);
        return;
      }

      // Simulación de registro exitoso
      const usuarioRegistrado = {
        id: Math.floor(Math.random() * 1000) + 1,
        nickName: formulario.nickName.trim()
      };

      // En una app real, aquí harías POST /users a la API
      console.log('Registrando usuario:', usuarioRegistrado);

      // Auto-login después del registro
      iniciarSesion(usuarioRegistrado);
      navigate('/perfil');
      
    } catch (err) {
      setError('Error al registrar usuario');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white text-center py-4">
              <h2 className="mb-0">🚀 Crear Cuenta</h2>
            </div>
            
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={manejarRegistro}>
                <div className="mb-3">
                  <label htmlFor="nickName" className="form-label fw-semibold">
                    <i className="bi bi-person-badge me-2"></i>
                    Elige tu Nickname
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="nickName"
                    name="nickName"
                    value={formulario.nickName}
                    onChange={manejarCambio}
                    placeholder="Ej: developer_2024"
                    required
                    disabled={cargando}
                  />
                  <div className="form-text">
                    Este será tu nombre de usuario en la plataforma
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    <i className="bi bi-shield-lock me-2"></i>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="password"
                    name="password"
                    value={formulario.password}
                    onChange={manejarCambio}
                    placeholder="Mínimo 6 caracteres"
                    required
                    disabled={cargando}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmarPassword" className="form-label fw-semibold">
                    <i className="bi bi-shield-check me-2"></i>
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="confirmarPassword"
                    name="confirmarPassword"
                    value={formulario.confirmarPassword}
                    onChange={manejarCambio}
                    placeholder="Repite tu contraseña"
                    required
                    disabled={cargando}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-success btn-lg w-100 py-3"
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Crear mi cuenta
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted mb-2">¿Ya tienes una cuenta?</p>
                <Link to="/login" className="btn btn-outline-secondary">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Ir al Login
                </Link>
              </div>

              <div className="alert alert-info mt-4" role="alert">
                <h6 className="alert-heading">
                  <i className="bi bi-info-circle me-2"></i>
                  Información importante
                </h6>
                <p className="mb-0 small">
                  Esta es una versión de demostración. Los datos se guardan localmente 
                  y se perderán al recargar la página.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaRegistro;