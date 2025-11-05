import React from 'react';
import { Heart } from 'react-bootstrap-icons';

const PieDePagina: React.FC = () => {
  return (
    <footer className="bg-success bg-opacity-10 text-success py-4 mt-5 border-top border-success border-opacity-25">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12 col-md-6 text-center text-md-start mb-2 mb-md-0">
            <p className="mb-0 d-flex align-items-center justify-content-center justify-content-md-start gap-2">
              &copy; 2025 UnaHur Anti-Social Net
            </p>
          </div>
          <div className="col-12 col-md-6 text-center text-md-end">
            <p className="mb-0 d-flex align-items-center justify-content-center justify-content-md-end gap-2">
              <span>Hecho con</span>
              <Heart size={16} className="text-danger" />
              <span>usando React + TypeScript + Bootstrap</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PieDePagina;