import React from 'react';

export interface Usuario {
  id: number;
  nickName: string;
  avatar?: string;
  fechaRegistro?: string;
}

interface ContextoUsuarioType {
  usuario: Usuario | null;
  estaLogueado: boolean;
  iniciarSesion: (usuario: Usuario) => void;
  cerrarSesion: () => void;
}

export const ContextoUsuario = React.createContext<ContextoUsuarioType>({
  usuario: null,
  estaLogueado: false,
  iniciarSesion: () => {},
  cerrarSesion: () => {},
});