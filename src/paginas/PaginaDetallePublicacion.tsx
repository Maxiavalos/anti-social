import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TarjetaPublicacion from '../componentes/publicaciones/TarjetaPublicacion';

interface Publicacion {
  id: number;
  usuario: string;
  descripcion: string;
  imagenes?: string[];
  fechaCreacion: string;
  comentariosCount: number;
  meGustaCount: number;
  etiquetas?: string[];
}

interface Comentario {
  id: number;
  usuario: string;
  contenido: string;
  fechaCreacion: string;
  meGustaCount: number;
}

const PaginaDetallePublicacion: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [cargando, setCargando] = useState(true);

  // Simular datos de la publicación
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Datos de ejemplo
        const publicacionesEjemplo: Publicacion[] = [
          {
            id: 1,
            usuario: 'maria_dev',
            descripcion: 'Acabo de terminar mi primer proyecto en React con TypeScript. ¡Qué satisfacción ver todo funcionando! ¿Alguien más está aprendiendo desarrollo frontend? Esta aplicación está quedando increíble con todos los componentes que estamos creando. Me encanta cómo React permite crear interfaces tan dinámicas y responsivas.\n\n¿Qué librerías de UI recomiendan para proyectos académicos?',
            imagenes: [
              'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500',
              'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500'
            ],
            fechaCreacion: 'Hace 2 horas',
            comentariosCount: 8,
            meGustaCount: 15,
            etiquetas: ['React', 'TypeScript', 'Desarrollo', 'Frontend']
          },
          {
            id: 2,
            usuario: 'coder_ana',
            descripcion: '¿Recomiendan algún curso bueno de Bootstrap 5? Quiero mejorar mis habilidades de diseño responsive para que mis aplicaciones se vean bien en todos los dispositivos.',
            fechaCreacion: 'Hace 5 horas',
            comentariosCount: 12,
            meGustaCount: 23,
            etiquetas: ['Bootstrap', 'CSS', 'Frontend', 'Responsive']
          },
          {
            id: 3,
            usuario: 'tech_lover',
            descripcion: 'Compartiendo mi setup de desarrollo actual: VS Code + React + Bootstrap + TypeScript. ¡Productividad al máximo! Los atajos de teclado y los snippets me están salvando la vida en este proyecto.',
            imagenes: [
              'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500'
            ],
            fechaCreacion: 'Hace 1 día',
            comentariosCount: 5,
            meGustaCount: 31,
            etiquetas: ['Setup', 'Productividad', 'Tools', 'VS Code']
          }
        ];

        const comentariosEjemplo: Comentario[] = [
          {
            id: 1,
            usuario: 'dev_experto',
            contenido: '¡Felicidades! React + TypeScript es una combinación excelente. Te recomiendo explorar React Query para el manejo de estado del servidor.',
            fechaCreacion: 'Hace 1 hora',
            meGustaCount: 3
          },
          {
            id: 2,
            usuario: 'frontend_master',
            contenido: 'Muy buen trabajo. Para librerías de UI, te recomiendo Material-UI o Chakra UI, son muy completas.',
            fechaCreacion: 'Hace 45 minutos',
            meGustaCount: 2
          },
          {
            id: 3,
            usuario: 'code_newbie',
            contenido: 'Estoy empezando también con React. ¿Algún consejo para alguien que recién comienza?',
            fechaCreacion: 'Hace 30 minutos',
            meGustaCount: 1
          }
        ];

        const pubEncontrada = publicacionesEjemplo.find(p => p.id === parseInt(id || '0'));
        setPublicacion(pubEncontrada || null);
        setComentarios(comentariosEjemplo);
        
      } catch (error) {
        console.error('Error cargando publicación:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  const manejarMeGusta = (publicacionId: number) => {
    if (publicacion) {
      setPublicacion({
        ...publicacion,
        meGustaCount: publicacion.meGustaCount + 1
      });
    }
  };

  const manejarNoMeGusta = (publicacionId: number) => {
    if (publicacion) {
      setPublicacion({
        ...publicacion,
        meGustaCount: Math.max(0, publicacion.meGustaCount - 1)
      });
    }
  };

  const manejarMeGustaComentario = (comentarioId: number) => {
    setComentarios(prev => prev.map(com => 
      com.id === comentarioId ? { ...com, meGustaCount: com.meGustaCount + 1 } : com
    ));
  };

  const manejarEnviarComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    const nuevoCom: Comentario = {
      id: Date.now(),
      usuario: 'yo', // En una app real sería el usuario logueado
      contenido: nuevoComentario.trim(),
      fechaCreacion: 'Ahora mismo',
      meGustaCount: 0
    };

    setComentarios(prev => [nuevoCom, ...prev]);
    setNuevoComentario('');
    
    // Actualizar contador de comentarios en la publicación
    if (publicacion) {
      setPublicacion({
        ...publicacion,
        comentariosCount: publicacion.comentariosCount + 1
      });
    }
  };

  if (cargando) {
    return (
      <div className="container py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Cargando publicación...</p>
        </div>
      </div>
    );
  }

  if (!publicacion) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger text-center">
          <h4>Publicación no encontrada</h4>
          <p>La publicación que buscas no existe o ha sido eliminada.</p>
          <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Botón volver */}
      <div className="mb-4">
        <button 
          onClick={() => navigate(-1)}
          className="btn btn-outline-secondary"
        >
          ← Volver
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Publicación principal */}
          <TarjetaPublicacion
            publicacion={publicacion}
            onMeGusta={manejarMeGusta}
            onNoMeGusta={manejarNoMeGusta}
            esDetalle={true}
          />

          {/* Sección de comentarios */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-light">
              <h5 className="mb-0">💬 Comentarios ({comentarios.length})</h5>
            </div>
            
            {/* Formulario de nuevo comentario */}
            <div className="card-body border-bottom">
              <form onSubmit={manejarEnviarComentario}>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Escribe tu comentario..."
                    value={nuevoComentario}
                    onChange={(e) => setNuevoComentario(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={!nuevoComentario.trim()}
                  >
                    Comentar
                  </button>
                </div>
              </form>
            </div>

            {/* Lista de comentarios */}
            <div className="card-body">
              {comentarios.length === 0 ? (
                <p className="text-muted text-center py-3">No hay comentarios aún. ¡Sé el primero en comentar!</p>
              ) : (
                <div className="space-y-3">
                  {comentarios.map((comentario) => (
                    <div key={comentario.id} className="border-bottom pb-3 mb-3">
                      <div className="d-flex align-items-start mb-2">
                        <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style={{width: '35px', height: '35px', fontSize: '14px'}}>
                          {comentario.usuario.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-0 fw-bold">@{comentario.usuario}</h6>
                              <small className="text-muted">{comentario.fechaCreacion}</small>
                            </div>
                            <button 
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => manejarMeGustaComentario(comentario.id)}
                            >
                              👍 {comentario.meGustaCount}
                            </button>
                          </div>
                          <p className="mt-2 mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                            {comentario.contenido}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaDetallePublicacion;