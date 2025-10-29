import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextoUsuario } from '../contexto/ContextoUsuario';
import { publicacionService, imagenService } from '../servicios/api';

const PaginaNuevaPublicacion: React.FC = () => {
  const [descripcion, setDescripcion] = useState<string>('');
  const [imagenes, setImagenes] = useState<string[]>(['']);
  const [etiquetasInput, setEtiquetasInput] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [enviado, setEnviado] = useState<boolean>(false);

  const { usuario, estaLogueado } = useContext(ContextoUsuario);
  const navigate = useNavigate();

  // Redirigir si no está logueado
  useEffect(() => {
    if (!estaLogueado) {
      navigate('/login');
    }
  }, [estaLogueado, navigate]);

  const manejarAgregarImagen = (): void => {
    setImagenes(prev => [...prev, '']);
  };

  const manejarCambioImagen = (index: number, url: string): void => {
    const nuevasImagenes = [...imagenes];
    nuevasImagenes[index] = url;
    setImagenes(nuevasImagenes);
  };

  const manejarEliminarImagen = (index: number): void => {
    if (imagenes.length > 1) {
      const nuevasImagenes = imagenes.filter((_, i) => i !== index);
      setImagenes(nuevasImagenes);
    }
  };

  // Convertir texto de etiquetas a array
  const obtenerEtiquetasArray = (): string[] => {
    return etiquetasInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag.substring(1) : tag);
  };

  const manejarEnviar = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
      // Validaciones
      if (!descripcion.trim()) {
        setError('La descripción es obligatoria');
        setCargando(false);
        return;
      }

      if (descripcion.trim().length < 10) {
        setError('La descripción debe tener al menos 10 caracteres');
        setCargando(false);
        return;
      }

      if (!usuario) {
        setError('Debes estar logueado para crear una publicación');
        setCargando(false);
        return;
      }

      // Filtrar URLs de imágenes vacías y etiquetas
      const urlsImagenes = imagenes.filter(url => url.trim() !== '');
      const etiquetas = obtenerEtiquetasArray();

      console.log('Creando publicación en la API...');

      // 1. Crear la publicación en la API
      const publicacionCreada = await publicacionService.crearPublicacion({
        description: descripcion.trim(),
        userId: usuario.id,
        tags: etiquetas
      });

      console.log('Publicación creada:', publicacionCreada);

      // 2. Si hay imágenes, crearlas asociadas a la publicación
      if (urlsImagenes.length > 0) {
        console.log('Creando imágenes...');
        const promesasImagenes = urlsImagenes.map(url => 
          imagenService.crearImagen({
            url: url.trim(),
            postId: publicacionCreada.id
          })
        );
        
        await Promise.all(promesasImagenes);
        console.log('Imágenes creadas exitosamente');
      }

      // Éxito
      setEnviado(true);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/perfil');
      }, 2000);

    } catch (err: any) {
      console.error('Error creando publicación:', err);
      setError(err.message || 'Error al crear la publicación. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  if (!estaLogueado) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h4>Debes iniciar sesión para crear publicaciones</h4>
          <p>Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  if (enviado) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="alert alert-success text-center">
              <i className="bi bi-check-circle display-4 text-success mb-3"></i>
              <h3>¡Publicación creada exitosamente!</h3>
              <p className="mb-0">Redirigiendo a tu perfil...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="h2 mb-3">📝 Crear Nueva Publicación</h1>
            <p className="text-muted">
              Comparte tus pensamientos, ideas o proyectos con la comunidad
            </p>
          </div>

          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white py-3">
              <h3 className="h5 mb-0">
                <i className="bi bi-pencil-square me-2"></i>
                Nueva Publicación
              </h3>
            </div>
            
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={manejarEnviar}>
                <div className="mb-4">
                  <label htmlFor="descripcion" className="form-label fw-semibold">
                    <i className="bi bi-chat-text me-2"></i>
                    Descripción <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control form-control-lg"
                    id="descripcion"
                    rows={5}
                    value={descripcion}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescripcion(e.target.value)}
                    placeholder="¿Qué quieres compartir con la comunidad?"
                    required
                    disabled={cargando}
                  />
                  <div className="form-text">
                    Mínimo 10 caracteres. Actual: {descripcion.length}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-image me-2"></i>
                    URLs de Imágenes (Opcional)
                  </label>
                  
                  {imagenes.map((url, index) => (
                    <div key={index} className="input-group mb-2">
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={url}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          manejarCambioImagen(index, e.target.value)
                        }
                        disabled={cargando}
                      />
                      {imagenes.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => manejarEliminarImagen(index)}
                          disabled={cargando}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={manejarAgregarImagen}
                    disabled={cargando || imagenes.length >= 5}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Agregar otra imagen
                  </button>
                  <div className="form-text">
                    Máximo 5 imágenes. Puedes agregar URLs de imágenes.
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="etiquetas" className="form-label fw-semibold">
                    <i className="bi bi-tags me-2"></i>
                    Etiquetas (Opcional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etiquetas"
                    value={etiquetasInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEtiquetasInput(e.target.value)}
                    placeholder="react, typescript, bootstrap (separadas por comas)"
                    disabled={cargando}
                  />
                  <div className="form-text">
                    Separa las etiquetas con comas. Ejemplo: "react, typescript, unahur"
                  </div>
                  {etiquetasInput && (
                    <div className="mt-2">
                      <small className="text-muted">Etiquetas detectadas: </small>
                      {obtenerEtiquetasArray().map((tag, index) => (
                        <span key={index} className="badge bg-secondary me-1">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="d-flex gap-3 justify-content-end pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/')}
                    disabled={cargando}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Cancelar
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={cargando}
                  >
                    {cargando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creando publicación...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Publicar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaNuevaPublicacion;