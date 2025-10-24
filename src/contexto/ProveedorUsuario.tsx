import React, { useState } from 'react';
import { ContextoUsuario, type Usuario } from '../contexto/ContextoUsuario';

interface ProveedorUsuarioProps {
  children: React.ReactNode;
}

export const ProveedorUsuario: React.FC<ProveedorUsuarioProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const iniciarSesion = (usuarioData: Usuario): void => {
    console.log('Iniciando sesión para:', usuarioData);
    setUsuario(usuarioData);
    
    
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
  };

  const cerrarSesion = (): void => {
    console.log('Cerrando sesión');
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  const estaLogueado = !!usuario;

  React.useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuarioData: Usuario = JSON.parse(usuarioGuardado);
        setUsuario(usuarioData);
      } catch (error) {
        console.error('Error al cargar usuario desde localStorage:', error);
      }
    }
  }, []);

  return (
    <ContextoUsuario.Provider value={{
      usuario,
      estaLogueado,
      iniciarSesion,
      cerrarSesion
    }}>
      {children}
    </ContextoUsuario.Provider>
  );
};