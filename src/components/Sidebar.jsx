import React from 'react';

import { VscPlayCircle, VscStopCircle, VscTools } from "react-icons/vsc";
import { GiRobotAntennas, GiMinions, GiHiveMind } from "react-icons/gi";

const Sidebar = () => {
  const onDragStart = (event, nodeType, data) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/json', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="flex flex-col justify-between h-full">
      <div className="description">Drag nodes to the canvas</div>
      <div
        className="smithnode  bg-rose-200"
        onDragStart={(event) => onDragStart(event, 'CustomNode', { label: 'Start' })}
        draggable
      >
        <VscPlayCircle /> Start
      </div>
      <div
        className="smithnode  bg-stone-200"
        onDragStart={(event) => onDragStart(event, 'CustomNode', { label: 'End' })}
        draggable
      >
        <VscStopCircle /> End
      </div>
      <div
        className="smithnode bg-blue-200"
        onDragStart={(event) => onDragStart(event, 'CustomNode', { label: 'Agent' })}
        draggable
      >
        <GiRobotAntennas /> Agent
      </div>
      <div
        className="smithnode bg-amber-200"
        onDragStart={(event) => onDragStart(event, 'CustomNode', { label: 'Supervisor' })}
        draggable
      >
        <GiMinions /> Supervisor
      </div>
      <div
        className="smithnode bg-purple-200"
        onDragStart={(event) => onDragStart(event, 'CustomNode', { label: 'Team' })}
        draggable
      >
        <GiHiveMind /> Team
      </div>
      <div
        className="smithnode bg-emerald-200"
        onDragStart={(event) => onDragStart(event, 'CustomNode', { label: 'Tools' })}
        draggable
      >
        <VscTools /> Tools
      </div>

      {/* Spacer to push footer down */}
      <div className="flex-grow" />

      {/* Footer */}
      <div className="mt-auto text-xs text-center text-gray-500 pt-4">
        Created by Ony Mitra
      </div>

    </aside>
  );
};
export default Sidebar;