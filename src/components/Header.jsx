import React from 'react';
import { FaSave, FaUpload, FaDownload } from 'react-icons/fa';
const Header = ({ onSave, onLoad, onExport }) => {
  return (
    <header>
      <div className="title">Agent Smith</div>
        <div className="buttons">
          <button onClick={onSave}><FaSave /> Save</button>
          <button onClick={onLoad}><FaUpload /> Load</button>
          <button onClick={onExport}><FaDownload /> Export</button>
        </div>
    </header>
  );
};

export default Header;