import React, { useState, useEffect, useRef } from 'react';
import { Handle } from 'reactflow';

import { VscPlayCircle, VscStopCircle, VscTools } from "react-icons/vsc";
import { GiRobotAntennas, GiMinions, GiHiveMind } from "react-icons/gi";

const CustomNode = ({ data, id, onNodeLabelChange, selected }) => {
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

  const iconMap = {
    Start: <VscPlayCircle />,
    End: <VscStopCircle />,
    Team: <GiHiveMind />,
    Agent: <GiRobotAntennas />,
    Tools: <VscTools />,
    Supervisor: <GiMinions />,
  };

  return (
    <div className={`custom-node ${selected ? 'selected-node' : ''} 
      ${label === 'Agent' ? 'bg-blue-200' : ''}
      ${label === 'Start' ? 'bg-rose-200' : ''}
      ${label === 'End' ? 'bg-stone-200' : ''}
      ${label === 'Supervisor' ? 'bg-amber-200' : ''}
      ${label === 'Tools' ? 'bg-emerald-200' : ''}
      ${label === 'Team' ? 'bg-purple-200' : ''}
      ` }>

      <div className="node-header">
        {iconMap[label] || null}

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
            <span onDoubleClick={startEditing} className="node-label-text">
              {label}
            </span>
          )}
        </div>
      </div>
      {data.label !== 'End' && <Handle type="source" position="bottom" />}
      {data.label !== 'Start' && <Handle type="target" position="top" />}
    </div>
  );
};

export default CustomNode;