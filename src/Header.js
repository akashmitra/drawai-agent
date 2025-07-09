import React from 'react';
import { FaSave, FaUpload, FaDownload } from 'react-icons/fa';
import { Button } from './components/ui/button';
const Header = ({ onSave, onLoad, onExport }) => {
  return (
    <header>
      <div className="title">Agent Flow Architect</div>
        <div className="buttons">
          <button onClick={onSave}><FaSave /> Save</button>
          <button onClick={onLoad}><FaUpload /> Load</button>
          <button onClick={onExport}><FaDownload /> Export</button>
          <Button className="ml-2">Shadcn</Button>
        </div>
    </header>
  );
};
export default Header;