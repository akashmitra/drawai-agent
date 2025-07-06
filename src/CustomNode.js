import React, { useState, useEffect, useRef } from 'react';
import { Handle } from 'reactflow';
import { FaEdit } from 'react-icons/fa';

const CustomNode = ({ data, id, onNodeLabelChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const inputRef = useRef(null);

  // Update local label when data.label changes
  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Propagate change to the main state
    if (onNodeLabelChange && label !== data.label) {
      onNodeLabelChange(id, label);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setLabel(data.label); // Reset to original value
      setIsEditing(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    // Use setTimeout to ensure the input is rendered before focusing
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 0);
  };

  return (
    <div className="custom-node">
      <div className="node-header">
        {data.icon}
        <div className="label-container">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={label}
              onChange={handleLabelChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="node-label-input"
            />
          ) : (
            <span onDoubleClick={startEditing} className="node-label-text">{label}</span>
          )}
        </div>
        <FaEdit onClick={startEditing} className="edit-icon" />
      </div>
      {data.label !== 'Output' && <Handle type="source" position="bottom" />}
      {data.label !== 'Input' && <Handle type="target" position="top" />}
    </div>
  );
};

export default CustomNode;