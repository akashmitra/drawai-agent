import React from 'react';
import { FaSave, FaUpload } from 'react-icons/fa';

const Header = ({ onSave, onLoad }) => {
  return (
    <header>
      <div className="title">Agent Flow Architect</div>
      <div className="buttons">
        <button onClick={onSave}><FaSave /> Save</button>
        <button onClick={onLoad}><FaUpload /> Load</button>
      </div>
    </header>
  );
};

export default Header;