import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProveedorUsuario } from './contexto/ProveedorUsuario';
import Cabecera from './componentes/comunes/Cabecera';
import PaginaInicio from './paginas/PaginaInicio';
import PaginaLogin from './paginas/PaginaLogin';
import PaginaRegistro from './paginas/PaginaRegistro';
import PaginaPerfil from './paginas/PaginaPerfil';
import PaginaNuevaPublicacion from './paginas/PaginaNuevaPublicacion';
import PaginaDetallePublicacion from './paginas/PaginaDetallePublicacion';

function App() {
  return (
    <ProveedorUsuario>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
          <Cabecera />
          <main style={{ padding: '2rem' }}>
            <Routes>
              <Route path="/" element={<PaginaInicio />} />
              <Route path="/login" element={<PaginaLogin />} />
              <Route path="/registro" element={<PaginaRegistro />} />
              <Route path="/perfil" element={<PaginaPerfil />} />
              <Route path="/nueva-publicacion" element={<PaginaNuevaPublicacion />} />
              <Route path="/publicacion/:id" element={<PaginaDetallePublicacion />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ProveedorUsuario>
  );
}

export default App;