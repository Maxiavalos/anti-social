import React, { useState, useEffect } from 'react';
import TarjetaPublicacion from './TarjetaPublicacion';

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

const ListaPublicaciones: React.FC = () => {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPublicaciones = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const datosEjemplo: Publicacion[] = [
          {
            id: 1,
            usuario: 'maria_dev',
            descripcion: 'Acabo de terminar mi primer proyecto en React con TypeScript. ¡Qué satisfacción ver todo funcionando! ¿Alguien más está aprendiendo desarrollo frontend? Esta aplicación está quedando increíble con todos los componentes que estamos creando.',
            imagenes: [
              'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
              'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400'
            ],
            fechaCreacion: 'Hace 2 horas',
            comentariosCount: 8,
            meGustaCount: 15,
            etiquetas: ['React', 'TypeScript', 'Desarrollo']
          },
          {
            id: 2,
            usuario: 'coder_ana',
            descripcion: '¿Recomiendan algún curso bueno de Bootstrap 5? Quiero mejorar mis habilidades de diseño responsive para que mis aplicaciones se vean bien en todos los dispositivos.',
            fechaCreacion: 'Hace 5 horas',
            comentariosCount: 12,
            meGustaCount: 23,
            etiquetas: ['Bootstrap', 'CSS', 'Frontend']
          }
        ];
        
        setPublicaciones(datosEjemplo);
      } catch (error) {
        console.error('Error cargando publicaciones:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarPublicaciones();
  }, []);

  const manejarMeGusta = (id: number) => {
    setPublicaciones(prev => prev.map(pub => 
      pub.id === id ? { ...pub, meGustaCount: pub.meGustaCount + 1 } : pub
    ));
  };

  const manejarNoMeGusta = (id: number) => {
    setPublicaciones(prev => prev.map(pub => 
      pub.id === id ? { ...pub, meGustaCount: Math.max(0, pub.meGustaCount - 1) } : pub
    ));
  };

  if (cargando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-muted">Cargando publicaciones...</p>
      </div>
    );
  }

  return (
    <div className="row">
      {publicaciones.map((publicacion) => (
        <div key={publicacion.id} className="col-12">
          <TarjetaPublicacion
            publicacion={publicacion}
            onMeGusta={manejarMeGusta}
            onNoMeGusta={manejarNoMeGusta}
          />
        </div>
      ))}
    </div>
  );
};

export default ListaPublicaciones;