import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ContextoUsuario } from '../contexto/ContextoUsuario';
import { usuarioService } from '../servicios/api';

interface FormularioRegistro {
  nickName: string;
  email: string;
  password: string;
  confirmarPassword: string;
}

const PaginaRegistro: React.FC = () => {
  const [formulario, setFormulario] = useState<FormularioRegistro>({
    nickName: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });
  const [error, setError] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);
  const [registroExitoso, setRegistroExitoso] = useState<boolean>(false);
  
  const { iniciarSesion } = useContext(ContextoUsuario);
  const navigate = useNavigate();

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const manejarRegistro = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      console.log('Iniciando registro...', formulario);

      // Validaciones
      if (!formulario.nickName.trim()) {
        setError('El nickname es requerido');
        setCargando(false);
        return;
      }

      if (formulario.nickName.trim().length < 3) {
        setError('El nickname debe tener al menos 3 caracteres');
        setCargando(false);
        return;
      }

      if (!formulario.email.trim()) {
        setError('El email es requerido');
        setCargando(false);
        return;
      }

      if (!/\S+@\S+\.\S+/.test(formulario.email)) {
        setError('El email no tiene un formato válido');
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

      console.log('Buscando usuarios existentes...');

      // Verificar si el usuario ya existe
      const usuariosExistentes = await usuarioService.obtenerUsuarios();
      console.log('Usuarios existentes:', usuariosExistentes);

      const usuarioExistente = usuariosExistentes.find((u: any) => 
        u.nickName && u.nickName.toLowerCase() === formulario.nickName.toLowerCase().trim()
      );

      if (usuarioExistente) {
        setError(`El nickname "${formulario.nickName}" ya está en uso. Elige otro.`);
        setCargando(false);
        return;
      }

      console.log('Creando usuario en la API...', formulario.nickName);

      // Crear usuario en la API
      const usuarioCreado = await usuarioService.crearUsuario({
        nickName: formulario.nickName.trim(),
        email: formulario.email.trim()
      });

      console.log('Usuario creado exitosamente:', usuarioCreado);
      setRegistroExitoso(true);

      // Auto-login después del registro
      setTimeout(() => {
        iniciarSesion(usuarioCreado);
        navigate('/perfil');
      }, 2000);
      
    } catch (err: any) {
      console.error('Error en registro:', err);
      setError(err.message || 'Error al registrar usuario. Verifica que la API esté ejecutándose.');
    } finally {
      setCargando(false);
    }
  };

  if (registroExitoso) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg border-0">
              <div className="card-body text-center p-5">
                <div className="text-success mb-4">
                  <i className="bi bi-check-circle-fill display-1"></i>
                </div>
                <h2 className="text-success mb-3">¡Registro Exitoso!</h2>
                <p className="lead mb-4">
                  Tu cuenta <strong>@{formulario.nickName}</strong> ha sido creada correctamente.
                </p>
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Redirigiendo...</span>
                </div>
                <p className="text-muted">Redirigiendo a tu perfil...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  <div>{error}</div>
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
                    autoComplete="username"
                    minLength={3}
                  />
                  <div className="form-text">
                    Este será tu nombre de usuario en la plataforma (mínimo 3 caracteres)
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    <i className="bi bi-envelope me-2"></i>
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="email"
                    name="email"
                    value={formulario.email}
                    onChange={manejarCambio}
                    placeholder="tu@email.com"
                    required
                    disabled={cargando}
                    autoComplete="email"
                  />
                  <div className="form-text">
                    Usaremos este email para notificaciones importantes
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
                    autoComplete="new-password"
                    minLength={6}
                  />
                  <div className="form-text">
                    La contraseña debe tener al menos 6 caracteres
                  </div>
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
                    autoComplete="new-password"
                  />
                  <div className="form-text">
                    Debe coincidir con la contraseña anterior
                  </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaRegistro;