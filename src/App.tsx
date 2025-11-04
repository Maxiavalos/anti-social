import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProveedorUsuario } from './contexto/ProveedorUsuario';
import Cabecera from './componentes/comunes/Cabecera';
import PieDePagina from './componentes/comunes/PieDePagina';
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
        <div className="d-flex flex-column min-vh-100 app-bg">
          <Cabecera />
          <main className="flex-grow-1 py-4">
            <div className="container">
              <Routes>
                <Route path="/" element={<PaginaInicio />} />
                <Route path="/login" element={<PaginaLogin />} />
                <Route path="/registro" element={<PaginaRegistro />} />
                <Route path="/perfil/:usuario?" element={<PaginaPerfil />} />
                <Route path="/nueva-publicacion" element={<PaginaNuevaPublicacion />} />
                <Route path="/publicacion/:id" element={<PaginaDetallePublicacion />} />
              </Routes>
            </div>
          </main>
          <PieDePagina />
        </div>
      </Router>
    </ProveedorUsuario>
  );
}

export default App;