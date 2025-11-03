import React, { useState, useEffect } from 'react';
import TarjetaPublicacion from './TarjetaPublicacion';
import { comentarioService, publicacionService, imagenService, type PublicacionAPI, type ImagenAPI } from '../../servicios/api';

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
  const [error, setError] = useState('');

  // Función para transformar datos de la API
  const transformarPublicacion = async (publicacionAPI: PublicacionAPI, imagenesUrls: string[]): Promise<Publicacion> => {
    return {
      id: publicacionAPI.id,
      usuario: publicacionAPI.User?.nickName || 'Usuario',
      descripcion: publicacionAPI.description,
      imagenes: imagenesUrls,
      fechaCreacion: new Date(publicacionAPI.createdAt).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      comentariosCount: (await comentarioService.obtenerComentariosPorPublicacion(publicacionAPI.id)).length, // Esto necesitaría una consulta adicional
      meGustaCount: 0, // No hay me gustas en la API actual
      etiquetas: publicacionAPI.Tags ? publicacionAPI.Tags.map((tag: { name: any; }) => tag.name) : []
    };
  };

  useEffect(() => {
    const cargarPublicaciones = async () => {
      try {
        setCargando(true);
        setError('');

        // Obtener publicaciones desde la API
        const publicacionesAPI: PublicacionAPI[] = await publicacionService.obtenerPublicaciones();

        // Transformar datos y obtener imágenes para cada publicación
        const publicacionesTransformadas = await Promise.all(
          publicacionesAPI.map(async (publicacionAPI: PublicacionAPI) => {
            let imagenesUrls: string[] = [];
            try {
              const imagenesData: ImagenAPI[] = await imagenService.obtenerImagenesPorPublicacion(publicacionAPI.id);
              imagenesUrls = imagenesData.map((img: ImagenAPI) => img.url);
            } catch (error) {
              console.error(`Error cargando imágenes para post ${publicacionAPI.id}:`, error);
            }

            return transformarPublicacion(publicacionAPI, imagenesUrls);
          })
        );

        setPublicaciones(publicacionesTransformadas);
        
      } catch (err: any) {
        console.error('Error cargando publicaciones:', err);
        setError('No se pudieron cargar las publicaciones. Verifica que la API esté ejecutándose.');
        setPublicaciones([]);
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

  if (error) {
    return (
      <div className="alert alert-warning text-center">
        <h5>No se pudieron cargar las publicaciones</h5>
        <p className="mb-0">{error}</p>
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