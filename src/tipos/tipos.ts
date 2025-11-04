export interface Usuario {
  id: number;
  nickName: string;
  email?: string;
  avatar?: string;
  fechaRegistro?: string;
  createdAt?: string; 
}

export interface UsuarioAPI {
  id: number;
  nickName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Etiqueta {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Publicacion {
  id: number;
  description: string;
  UserId: number;
  createdAt: string;
  updatedAt?: string;
  User?: Usuario;
  Tags?: Etiqueta[];
}

export interface Comentario {
  id: number;
  content: string;
  UserId: number;
  PostId: number;
  createdAt: string;
  updatedAt?: string;
  User?: Usuario;
}

export interface Imagen {
  id: number;
  url: string;
  PostId: number;
  createdAt?: string;
  updatedAt?: string;
}


export interface Like {
  id: number;
  userId: number; 
  postId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LikeResponse {
  liked: boolean;
}

export interface LikeCountResponse {
  likeCount: number;
}

export interface LikeCheckResponse {
  liked: boolean;
}