import React from 'react';
import { FaArrowCircleRight, FaArrowCircleLeft, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  const onDragStart = (event, nodeType, data) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/json', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">Drag nodes to the canvas</div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, 'CustomNode', { label: 'Input', icon: 'FaArrowCircleRight' })}
        draggable
      >
        <FaArrowCircleRight /> Input
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, 'CustomNode', { label: 'Process', icon: 'FaCog' })}
        draggable
      >
        <FaCog /> Process
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, 'CustomNode', { label: 'Output', icon: 'FaArrowCircleLeft' })}
        draggable
      >
        <FaArrowCircleLeft /> Output
      </div>
    </aside>
  );
};

export default Sidebar;