import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ContextoUsuario } from '../contexto/ContextoUsuario';
import { usuarioService } from '../servicios/api';
import { 
  PersonBadge, 
  Envelope, 
  ShieldLock, 
  ShieldCheck, 
  PersonPlus, 
  BoxArrowInRight, 
  ExclamationTriangle,
  CheckCircle,
  Rocket 
} from 'react-bootstrap-icons';

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
      <div className="container py-4 py-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-body text-center p-4 p-md-5">
                <div className="text-success mb-4">
                  <CheckCircle size={64} />
                </div>
                <h2 className="text-success mb-3 h3">¡Registro Exitoso!</h2>
                <p className="lead mb-4">
                  Tu cuenta <strong>@{formulario.nickName}</strong> ha sido creada correctamente.
                </p>
                <div className="spinner-border text-success mb-3" role="status">
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
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-6">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white text-center py-4">
              <h2 className="h3 mb-0 d-flex align-items-center justify-content-center gap-2">
                <Rocket size={24} />
                Crear Cuenta
              </h2>
            </div>
            
            <div className="card-body p-3 p-md-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                  <ExclamationTriangle size={18} />
                  <div className="small">{error}</div>
                </div>
              )}

              <form onSubmit={manejarRegistro}>
                <div className="mb-3">
                  <label htmlFor="nickName" className="form-label fw-semibold d-flex align-items-center gap-2">
                    <PersonBadge size={18} />
                    Usuario
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nickName"
                    name="nickName"
                    value={formulario.nickName}
                    onChange={manejarCambio}
                    placeholder="Ingresa tu nombre de usuario"
                    required
                    disabled={cargando}
                    autoComplete="username"
                    minLength={3}
                  />
                  
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold d-flex align-items-center gap-2">
                    <Envelope size={18} />
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formulario.email}
                    onChange={manejarCambio}
                    placeholder="tu@email.com"
                    required
                    disabled={cargando}
                    autoComplete="email"
                  />
                  
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold d-flex align-items-center gap-2">
                    <ShieldLock size={18} />
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formulario.password}
                    onChange={manejarCambio}
                    placeholder="Ingresa tu contraseña"
                    required
                    disabled={cargando}
                    autoComplete="new-password"
                    minLength={6}
                  />
                  
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmarPassword" className="form-label fw-semibold d-flex align-items-center gap-2">
                    <ShieldCheck size={18} />
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmarPassword"
                    name="confirmarPassword"
                    value={formulario.confirmarPassword}
                    onChange={manejarCambio}
                    placeholder="Repite tu contraseña"
                    required
                    disabled={cargando}
                    autoComplete="new-password"
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
                      <span>Creando cuenta...</span>
                    </>
                  ) : (
                    <>
                      <PersonPlus size={18} />
                      <span>Crear mi cuenta</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted mb-3">¿Ya tienes una cuenta?</p>
                <Link to="/login" className="btn btn-outline-success d-flex align-items-center gap-2 mx-auto" style={{width: 'fit-content'}}>
                  <BoxArrowInRight size={16} />
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