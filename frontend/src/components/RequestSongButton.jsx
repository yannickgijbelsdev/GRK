import React from 'react';
import { Link } from 'react-router-dom';
import { Music2 } from 'lucide-react';

const RequestSongButton = ({ className = '' }) => (
  <Link
    to="/plaat"
    data-testid="request-song-btn"
    className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 ${className}`}
    style={{ background: 'linear-gradient(135deg,#2a5d99,#4b8fcc)' }}
  >
    <Music2 size={18} />
    Vraag je plaat aan
  </Link>
);

export default RequestSongButton;
