export interface Usuario {
  id: number;
  nickName: string;
  email?: string;
  avatar?: string;
  fechaRegistro?: string;
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
  updatedAt?: string;
}