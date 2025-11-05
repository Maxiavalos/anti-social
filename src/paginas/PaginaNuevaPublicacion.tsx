
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
  const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState<number[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [enviado, setEnviado] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { usuario, estaLogueado } = useContext(ContextoUsuario);
  const navigate = useNavigate();
  const [nuevoNombreEtiqueta, setNuevoNombreEtiqueta] = useState<string>('');
  const [creandoEtiqueta, setCreandoEtiqueta] = useState<boolean>(false);
  const [mensajeBotonEtiqueta, setMensajeBotonEtiqueta] = useState<string>('');

  useEffect(() => {
    if (!estaLogueado) {
      navigate('/login');
    }
  }, [estaLogueado, navigate]);

  // Manejar selección de archivos
  const manejarSeleccionArchivos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const nuevasImagenes: ImagenPreview[] = [];
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        setError(`El archivo ${file.name} no es una imagen válida`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`La imagen ${file.name} es demasiado grande (máximo 5MB)`);
        return;
      }
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
    } catch (err) {
      console.error('Error subiendo imagen:', err);
      throw new Error(`No se pudo subir la imagen: ${imagen.file.name}`);
    }
  };

  // función principal para enviar la publicación (crea tag pendiente si hubiera)
  const manejarEnviar = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setCargando(true);
    setError('');

    try {
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
      const nameNuevo = (nuevoNombreEtiqueta || '').trim();
      if (nameNuevo && etiquetasSeleccionadas.length === 0) {
        setCreandoEtiqueta(true);
        try {
          
          const resTag = await fetch('http://localhost:3001/tags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: nameNuevo })
          });

          if (resTag && resTag.ok) {
            const tagCreado = await resTag.json();
            
            setEtiquetasSeleccionadas([tagCreado.id]);
            console.log('Etiqueta creada automáticamente y seleccionada al enviar:', tagCreado);
          } else {
            const texto = resTag ? await resTag.text().catch(() => '') : '';
            console.warn('No se pudo crear la etiqueta nueva al enviar. Respuesta:', resTag?.status, texto);
            
            setError('Advertencia: No se pudo crear la nueva etiqueta. Continuar sin ella.');
          }
        } catch (err) {
            console.error('Error en fetch POST /tags al enviar:', err);
            setError('Advertencia: Error de red al intentar crear la nueva etiqueta. Continuar sin ella.');
        } finally {
            setCreandoEtiqueta(false);
        }
      }

      
      const payload = {
        description: descripcion.trim(),
        userId: usuario.id,
        
        tagIds: etiquetasSeleccionadas.length > 0 ? etiquetasSeleccionadas : undefined
      };

      const publicacionCreada = await publicacionService.crearPublicacion(payload);
      console.log('Publicación creada:', publicacionCreada);

      
      if (imagenes.length > 0) {
        console.log('Subiendo imágenes...');
        
        
        const promesasImagenes = imagenes.map(async (imagen) => {
          const imageUrl = await subirImagen(imagen);

          await imagenService.crearImagen({
            url: imageUrl,
            postId: publicacionCreada.id
          });

          return imageUrl;
        });

        await Promise.all(promesasImagenes);
        console.log('Todas las imágenes subidas exitosamente');
      }
      setEnviado(true);
      imagenes.forEach(imagen => URL.revokeObjectURL(imagen.previewUrl));

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/perfil');
      }, 2000);

    } catch (err: any) {
      console.error('Error creando publicación:', err);
      setError(err?.message || 'Error al crear la publicación. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

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
                    // Deshabilitar si ya se alcanzó el límite
                    data-bs-toggle={imagenes.length >= 5 ? 'tooltip' : ''}
                    title={imagenes.length >= 5 ? 'Límite de 5 imágenes alcanzado' : ''}>
                    <i className="bi bi-cloud-arrow-up display-4 text-muted mb-3"></i>
                    <h5 className="text-muted">Haz clic o arrastra imágenes aquí</h5>
                    <p className="text-muted mb-0">
                      Formatos: JPEG, PNG, GIF, WebP • Máximo 5MB por imagen • Máximo {5 - imagenes.length} imágenes restantes
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
                    Etiqueta (Opcional)
                  </label>
                  <div className="d-flex gap-2 mb-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Crear una etiqueta (ej: Unahur)"
                      value={nuevoNombreEtiqueta}
                      onChange={(e) => {
                        setNuevoNombreEtiqueta(e.target.value);
                        setMensajeBotonEtiqueta(''); // Limpia el mensaje al escribir
                      }}
                      // Deshabilitar si ya se agregó una o si se está cargando/creando
                      disabled={creandoEtiqueta || cargando || etiquetasSeleccionadas.length > 0} 
                    />
                    <button
                      type="button"
                      // Cambia la clase a btn-success si está agregada
                      className={`btn btn-sm ${mensajeBotonEtiqueta ? 'btn-success' : 'btn-outline-success'} text-nowrap`}
                      onClick={async () => {
                        const name = (nuevoNombreEtiqueta || '').trim();
                        if (!name) return;

                        setCreandoEtiqueta(true);
                        setError(''); 

                        try {
                          
                          const res = await fetch('http://localhost:3001/tags', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name })
                          });

                          if (res && res.ok) {
                            const tag = await res.json();
                            
                            // Seleccionar la nueva etiqueta
                            setEtiquetasSeleccionadas([tag.id]);
                            
                            // Mostrar "Etiqueta agregada"
                            setMensajeBotonEtiqueta('Etiqueta agregada');

                            // Opcional: Limpiar el mensaje después de 3 segundos
                            setTimeout(() => setMensajeBotonEtiqueta(''), 3000);

                            console.log('Etiqueta creada y seleccionada:', tag);
                          } else {
                            const txt = res ? await res.text().catch(() => '') : '';
                            console.warn('POST /tags falló:', res?.status, txt);
                            setError('Error al crear la etiqueta: la solicitud al backend falló.');
                          }

                        } catch (error) {
                          console.error('Error al crear la etiqueta:', error);
                          setError('Error de red al crear la etiqueta.');
                        } finally {
                          setCreandoEtiqueta(false);
                        }
                      }}
                      // Deshabilitar si está cargando, si el input está vacío o si ya se seleccionó una
                      disabled={creandoEtiqueta || cargando || !nuevoNombreEtiqueta.trim() || etiquetasSeleccionadas.length > 0}
                    >
                      {creandoEtiqueta ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                          Creando...
                        </>
                      ) : (
                        mensajeBotonEtiqueta || 'Agregar etiqueta'
                      )}
                    </button>
                  </div>
                  
                  {/* Indicador de etiqueta seleccionada y botón de limpieza */}
                  {etiquetasSeleccionadas.length > 0 && (
                    <div className="alert alert-info alert-sm p-2 d-flex justify-content-between align-items-center">
                        <i className="bi bi-tag-fill me-2"></i>
                        Etiqueta **`{nuevoNombreEtiqueta}`** lista.
                        <button 
                          type="button"
                          className="btn-close"
                          aria-label="Eliminar etiqueta"
                          onClick={() => { 
                            setEtiquetasSeleccionadas([]);
                            setNuevoNombreEtiqueta('');
                            setMensajeBotonEtiqueta('');
                          }}
                        ></button>
                    </div>
                  )}

                  <div className="form-text mt-2">
                    Solo se permite agregar una etiqueta por publicación.
                  </div>
                </div>
                <div className="d-flex gap-3 justify-content-end pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/')}
                    disabled={cargando}>
                    <i className="bi bi-arrow-left me-2"></i>
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={cargando}>
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
