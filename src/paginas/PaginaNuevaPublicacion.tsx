import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextoUsuario } from '../contexto/ContextoUsuario';
import { publicacionService, imagenService, etiquetaService, uploadService, type EtiquetaAPI } from '../servicios/api';

interface ImagenPreview {
  file: File;
  previewUrl: string;
  uploadProgress?: number;
  isUploading?: boolean;
}

const PaginaNuevaPublicacion: React.FC = () => {
  const [descripcion, setDescripcion] = useState<string>('');
  const [imagenes, setImagenes] = useState<ImagenPreview[]>([]);
  const [etiquetasDisponibles, setEtiquetasDisponibles] = useState<EtiquetaAPI[]>([]);
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState<number[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [enviado, setEnviado] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { usuario, estaLogueado } = useContext(ContextoUsuario);
  const navigate = useNavigate();

  // Redirigir si no está logueado
  useEffect(() => {
    if (!estaLogueado) {
      navigate('/login');
    }
  }, [estaLogueado, navigate]);

  // Cargar etiquetas disponibles
  useEffect(() => {
    const cargarEtiquetas = async () => {
      try {
        const tags = await etiquetaService.obtenerEtiquetas();
        setEtiquetasDisponibles(tags);
      } catch (error) {
        console.error('Error cargando etiquetas:', error);
      }
    };
    cargarEtiquetas();
  }, []);

  // Manejar selección de archivos
  const manejarSeleccionArchivos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const nuevasImagenes: ImagenPreview[] = [];
    
    Array.from(files).forEach(file => {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError(`El archivo ${file.name} no es una imagen válida`);
        return;
      }

      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(`La imagen ${file.name} es demasiado grande (máximo 5MB)`);
        return;
      }

      // Crear preview
      const previewUrl = URL.createObjectURL(file);
      nuevasImagenes.push({
        file,
        previewUrl,
        isUploading: false
      });
    });

    // Limitar a 5 imágenes
    const totalImagenes = [...imagenes, ...nuevasImagenes].slice(0, 5);
    setImagenes(totalImagenes);
    
    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Manejar drag and drop
  const manejarDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const manejarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const inputEvent = {
        target: { files }
      } as React.ChangeEvent<HTMLInputElement>;
      manejarSeleccionArchivos(inputEvent);
    }
  };

  // Eliminar imagen
  const manejarEliminarImagen = (index: number) => {
    // Revocar URL del objeto para liberar memoria
    URL.revokeObjectURL(imagenes[index].previewUrl);
    
    const nuevasImagenes = imagenes.filter((_, i) => i !== index);
    setImagenes(nuevasImagenes);
  };

  // Abrir selector de archivos
  const abrirSelectorArchivos = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Subir imagen individual
  const subirImagen = async (imagen: ImagenPreview): Promise<string> => {
    try {
      const resultado = await uploadService.subirImagen(imagen.file);
      return resultado.imageUrl;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      throw new Error(`No se pudo subir la imagen: ${imagen.file.name}`);
    }
  };

  const manejarSeleccionEtiqueta = (etiquetaId: number): void => {
    setEtiquetasSeleccionadas(prev => 
      prev.includes(etiquetaId) 
        ? prev.filter(id => id !== etiquetaId)
        : [...prev, etiquetaId]
    );
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

      console.log('Creando publicación...');

      // 1. Crear la publicación en la API
      const publicacionCreada = await publicacionService.crearPublicacion({
        description: descripcion.trim(),
        userId: usuario.id,
        tagIds: etiquetasSeleccionadas.length > 0 ? etiquetasSeleccionadas : undefined
      });

      console.log('Publicación creada:', publicacionCreada);

      // 2. Subir imágenes y asociarlas a la publicación
      if (imagenes.length > 0) {
        console.log('Subiendo imágenes...');
        
        // Subir todas las imágenes en paralelo
        const promesasImagenes = imagenes.map(async (imagen) => {
          try {
            const imageUrl = await subirImagen(imagen);
            
            // Crear la imagen en la base de datos
            await imagenService.crearImagen({
              url: imageUrl,
              postId: publicacionCreada.id
            });
            
            return imageUrl;
          } catch (error) {
            console.error('Error procesando imagen:', error);
            throw error;
          }
        });

        await Promise.all(promesasImagenes);
        console.log('Todas las imágenes subidas exitosamente');
      }

      // Éxito
      setEnviado(true);
      
      // Limpiar previews de imágenes
      imagenes.forEach(imagen => URL.revokeObjectURL(imagen.previewUrl));
      
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

  // Limpiar previews al desmontar el componente
  useEffect(() => {
    return () => {
      imagenes.forEach(imagen => URL.revokeObjectURL(imagen.previewUrl));
    };
  }, [imagenes]);

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
                  <div>{error}</div>
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
                    Imágenes (Opcional)
                  </label>
                  
                  {/* Área de drag and drop */}
                  <div 
                    className="border border-dashed border-secondary rounded-3 p-5 text-center mb-3 bg-light"
                    onDragOver={manejarDragOver}
                    onDrop={manejarDrop}
                    style={{ cursor: 'pointer' }}
                    onClick={abrirSelectorArchivos}
                  >
                    <i className="bi bi-cloud-arrow-up display-4 text-muted mb-3"></i>
                    <h5 className="text-muted">Haz clic o arrastra imágenes aquí</h5>
                    <p className="text-muted mb-0">
                      Formatos: JPEG, PNG, GIF, WebP • Máximo 5MB por imagen • Máximo 5 imágenes
                    </p>
                  </div>

                  {/* Input oculto para seleccionar archivos */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="d-none"
                    multiple
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={manejarSeleccionArchivos}
                    disabled={cargando || imagenes.length >= 5}
                  />

                  {/* Botón para agregar más imágenes (si hay espacio) */}
                  {imagenes.length > 0 && imagenes.length < 5 && (
                    <div className="text-center mb-3">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={abrirSelectorArchivos}
                        disabled={cargando}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Agregar más imágenes
                      </button>
                    </div>
                  )}

                  {/* Previews de imágenes */}
                  {imagenes.length > 0 && (
                    <div className="row g-3 mb-3">
                      {imagenes.map((imagen, index) => (
                        <div key={index} className="col-6 col-md-4">
                          <div className="card position-relative">
                            <img 
                              src={imagen.previewUrl} 
                              alt={`Preview ${index + 1}`}
                              className="card-img-top"
                              style={{ height: '120px', objectFit: 'cover' }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                manejarEliminarImagen(index);
                              }}
                              disabled={cargando}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                            <div className="card-body p-2">
                              <small className="text-muted d-block text-truncate">
                                {imagen.file.name}
                              </small>
                              <small className="text-muted">
                                {(imagen.file.size / 1024 / 1024).toFixed(2)} MB
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="form-text text-center">
                    {imagenes.length}/5 imágenes seleccionadas
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-tags me-2"></i>
                    Etiquetas (Opcional)
                  </label>
                  
                  {etiquetasDisponibles.length === 0 ? (
                    <p className="text-muted">Cargando etiquetas...</p>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {etiquetasDisponibles.map((etiqueta) => (
                        <button
                          key={etiqueta.id}
                          type="button"
                          className={`btn btn-sm ${
                            etiquetasSeleccionadas.includes(etiqueta.id) 
                              ? 'btn-primary' 
                              : 'btn-outline-primary'
                          }`}
                          onClick={() => manejarSeleccionEtiqueta(etiqueta.id)}
                          disabled={cargando}
                        >
                          #{etiqueta.name}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <div className="form-text mt-2">
                    Selecciona las etiquetas que mejor describan tu publicación
                  </div>
                  
                  {etiquetasSeleccionadas.length > 0 && (
                    <div className="mt-2">
                      <small className="text-muted">Etiquetas seleccionadas: </small>
                      {etiquetasSeleccionadas.map(id => {
                        const etiqueta = etiquetasDisponibles.find(t => t.id === id);
                        return etiqueta ? (
                          <span key={id} className="badge bg-primary me-1">
                            #{etiqueta.name}
                          </span>
                        ) : null;
                      })}
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