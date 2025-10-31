import React from 'react';
import type { UsuarioAPI } from '../servicios/api';

// Usar UsuarioAPI en el contexto para consistencia
export interface Usuario extends UsuarioAPI {
  // Puedes agregar campos adicionales específicos del frontend si es necesario
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