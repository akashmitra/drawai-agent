import React, { useState, useEffect, useRef } from 'react';
import { Handle } from 'reactflow';

import { VscPlayCircle, VscStopCircle, VscTools } from "react-icons/vsc";
import { GiRobotAntennas, GiMinions, GiHiveMind } from "react-icons/gi";

const CustomNode = ({ data, id, onNodeLabelChange, onNodeDescriptionChange, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(data.description || '');
  const inputRef = useRef(null);
  const descriptionInputRef = useRef(null);

  // Update local label when data.label changes
  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  // Update local description when data.description changes
  useEffect(() => {
    setDescription(data.description || '');
  }, [data.description]);

  const handleLabelChange = (e) => {
    setLabel(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Propagate change to the main state and store
    if (onNodeLabelChange && label !== data.label) {
      console.log('Label changed:', label);
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

  const startEditing = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    // Use setTimeout to ensure the input is rendered before focusing
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 0);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    if (onNodeDescriptionChange && description !== (data.description || '')) {
      onNodeDescriptionChange(id, description);
    }
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleDescriptionBlur();
    } else if (e.key === 'Escape') {
      setDescription(data.description || ''); // Reset to original value
      setIsEditingDescription(false);
    }
  };

  const startEditingDescription = (e) => {
    e.stopPropagation();
    setIsEditingDescription(true);
    setTimeout(() => {
      if (descriptionInputRef.current) {
        descriptionInputRef.current.focus();
        descriptionInputRef.current.select();
      }
    }, 0);
  };

  const handleNodeClick = (e) => {
    e.stopPropagation();
    // Prevent triggering when editing label
    if (isEditing) return;

    // Toggle accordion
    setIsAccordionOpen(!isAccordionOpen);
  };

  const iconMap = {
    start: <VscPlayCircle />,
    end: <VscStopCircle />,
    team: <GiHiveMind />,
    agent: <GiRobotAntennas />,
    tools: <VscTools />,
    supervisor: <GiMinions />,
  };

  const getNodeType = () => {
    return data.type || data.label?.toLowerCase() || 'agent';
  };

  const nodeType = getNodeType();

  return (
    <div className="custom-node-wrapper">
      <div
        className={`custom-node ${selected ? 'selected-node' : ''} 
          ${nodeType === 'agent' ? 'bg-blue-200' : ''}
          ${nodeType === 'start' ? 'bg-rose-200' : ''}
          ${nodeType === 'end' ? 'bg-stone-200' : ''}
          ${nodeType === 'supervisor' ? 'bg-amber-200' : ''}
          ${nodeType === 'tools' ? 'bg-emerald-200' : ''}
          ${nodeType === 'team' ? 'bg-purple-200' : ''}
          cursor-pointer
          ` }
        onClick={handleNodeClick}
      >

        <div className="node-header">
          {iconMap[nodeType] || null}

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
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span onDoubleClick={startEditing} className="node-label-text text-sm">
                {label}
              </span>
            )}
          </div>
        </div>
        {nodeType !== 'end' && <Handle type="source" position="bottom" />}
        {nodeType !== 'start' && <Handle type="target" position="top" />}
      </div>

      {/* If isAccordionOpen is true, show the accordion content */}
      {isAccordionOpen && (
        <div>
          <div className={`pt-2 accordion-content ${isAccordionOpen ? 'accordion-open' : ''}`}>
            <div className="accordion-inner">
              <div className="accordion-body">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">ID:</span>
                    <span className="text-xs font-medium text-gray-800">{id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Type:</span>
                    <span className="text-xs font-medium text-gray-800">{nodeType}</span>
                  </div>
                  <div className="flex flex-col justify-between">
                    <span className="pb-1 text-xs text-gray-600">Description:</span>
                    <span className="text-xs font-medium text-gray-800">
                      {isEditingDescription ? (
                        <textarea
                          ref={descriptionInputRef}
                          type="text"
                          value={description}
                          onChange={handleDescriptionChange}
                          onBlur={handleDescriptionBlur}
                          onKeyDown={handleDescriptionKeyDown}
                          className="node-label-input"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span onDoubleClick={startEditingDescription} className="node-label-text block w-40 break-words">
                          {description || nodeType}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomNode;