import React from 'react';
import type { UsuarioAPI } from '../servicios/api';


export interface Usuario extends UsuarioAPI {
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