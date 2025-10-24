export interface Publicacion {
  id: number;
  descripcion: string;
  usuarioId: number;
  fechaCreacion: string;
  etiquetas: Etiqueta[];
  imagenes: Imagen[];
}

export interface Comentario {
  id: number;
  contenido: string;
  usuarioId: number;
  publicacionId: number;
  fechaCreacion: string;
}

export interface Etiqueta {
  id: number;
  nombre: string;
}

export interface Imagen {
  id: number;
  url: string;
  publicacionId: number;
}