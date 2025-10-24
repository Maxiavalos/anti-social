import React from 'react';
import { ContextoUsuario, type Usuario } from './ContextoUsuario';

interface ProveedorUsuarioProps {
  children: React.ReactNode;
}

export const ProveedorUsuario: React.FC<ProveedorUsuarioProps> = ({ children }) => {
  
  const usuario: Usuario | null = null;
  const estaLogueado = false;

  return (
    <ContextoUsuario.Provider value={{
      usuario,
      estaLogueado
    }}>
      {children}
    </ContextoUsuario.Provider>
  );
};