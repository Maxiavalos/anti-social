import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContextoUsuario } from '../contexto/ContextoUsuario';
import { publicacionService, imagenService, etiquetaService, uploadService, type EtiquetaAPI } from '../servicios/api';
import { Pencil, Image, Tag, CloudArrowUp, X, PlusCircle, Send, ArrowLeft, CheckCircle, ExclamationTriangle, ChatText } from 'react-bootstrap-icons';

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
              <CheckCircle size={48} className="text-success mb-3" />
              <h3>¡Publicación creada exitosamente!</h3>
              <p className="mb-0">Redirigiendo a tu perfil...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-3 py-md-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="text-center mb-4 mb-md-5">
            <h1 className="h3 h2-md mb-3 d-flex align-items-center justify-content-center gap-2">
              <Pencil size={28} />
              Crear Nueva Publicación
            </h1>
            <p className="text-muted">
              Comparte tus pensamientos, ideas o proyectos con la comunidad
            </p>
          </div>

          <div className="card shadow-lg border-0">
            <div className="card-header bg-success text-white py-3">
              <h3 className="h5 mb-0 d-flex align-items-center gap-2">
                <Pencil size={20} />
                Nueva Publicación
              </h3>
            </div>
            
            <div className="card-body p-3 p-md-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                  <ExclamationTriangle size={20} />
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={manejarEnviar}>
                <div className="mb-4">
                  <label htmlFor="descripcion" className="form-label fw-semibold d-flex align-items-center gap-2">
                    <ChatText size={18} />
                    Descripción <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
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
                  <label className="form-label fw-semibold d-flex align-items-center gap-2">
                    <Image size={18} />
                    Imágenes (Opcional)
                  </label>
                  
                  
                  <div 
                    className="border border-dashed border-secondary rounded-3 p-4 p-md-5 text-center mb-3 bg-light"
                    onDragOver={manejarDragOver}
                    onDrop={manejarDrop}
                    style={{ cursor: imagenes.length >= 5 ? 'not-allowed' : 'pointer' }}
                    onClick={imagenes.length >= 5 ? undefined : abrirSelectorArchivos}
                    title={imagenes.length >= 5 ? 'Límite de 5 imágenes alcanzado' : ''}>
                    <CloudArrowUp size={48} className="text-muted mb-3" />
                    <h5 className="text-muted">Haz clic o arrastra imágenes aquí</h5>
                    <p className="text-muted mb-0 small">
                      Formatos: JPEG, PNG, GIF, WebP • Máximo 5MB por imagen • Máximo {5 - imagenes.length} imágenes restantes
                    </p>
                  </div>

                  {/* Input para seleccionar archivos */}
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
                        className="btn btn-outline-success d-flex align-items-center gap-2 mx-auto"
                        onClick={abrirSelectorArchivos}
                        disabled={cargando}
                      >
                        <PlusCircle size={16} />
                        Agregar más imágenes
                      </button>
                    </div>
                  )}

                  {/* Previews de imágenes */}
                  {imagenes.length > 0 && (
                    <div className="row g-2 g-md-3 mb-3">
                      {imagenes.map((imagen, index) => (
                        <div key={index} className="col-6 col-sm-4 col-md-3">
                          <div className="card position-relative border-0 shadow-sm">
                            <img 
                              src={imagen.previewUrl} 
                              alt={`Preview ${index + 1}`}
                              className="card-img-top w-100"
                              style={{ height: '100px', objectFit: 'cover' }}
                            />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle"
                              style={{ width: '30px', height: '30px', padding: 0 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                manejarEliminarImagen(index);
                              }}
                              disabled={cargando}
                            >
                              <X size={14} />
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
                  <label className="form-label fw-semibold d-flex align-items-center gap-2">
                    <Tag size={18} />
                    Etiqueta (Opcional)
                  </label>
                  <div className="d-flex flex-column flex-sm-row gap-2 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Crear una etiqueta (ej: Unahur)"
                      value={nuevoNombreEtiqueta}
                      onChange={(e) => {
                        setNuevoNombreEtiqueta(e.target.value);
                        setMensajeBotonEtiqueta('');
                      }}
                      disabled={creandoEtiqueta || cargando || etiquetasSeleccionadas.length > 0}
                    />
                    <button
                      type="button"
                      className={`btn ${mensajeBotonEtiqueta ? 'btn-success' : 'btn-outline-success'} text-nowrap flex-shrink-0`}
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
                            setEtiquetasSeleccionadas([tag.id]);
                            setMensajeBotonEtiqueta('Etiqueta agregada');
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
                  
                  {/* Indicador de etiqueta seleccionada */}
                  {etiquetasSeleccionadas.length > 0 && (
                    <div className="alert alert-success alert-sm p-2 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <Tag size={16} />
                        Etiqueta <strong>"{nuevoNombreEtiqueta}"</strong> lista.
                      </div>
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

                <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3 justify-content-end pt-3 border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary d-flex align-items-center gap-2 order-2 order-sm-1"
                    onClick={() => navigate('/')}
                    disabled={cargando}>
                    <ArrowLeft size={16} />
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success px-4 d-flex align-items-center gap-2 order-1 order-sm-2"
                    disabled={cargando}>
                    {cargando ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        Creando publicación...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
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