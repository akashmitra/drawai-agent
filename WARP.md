# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Drawai Agent** is a React-based visual editor for designing agentic AI workflows. It provides a Draw.io-style interface using React Flow to create node-based diagrams representing AI agent workflows. The primary use case is for Agent Architects to design workflows that can be exported as JSON for implementation in frameworks like LangGraph, Autogen, or custom orchestrators.

## Key Technologies

- **React 19** with JSX (ES6 modules)
- **React Flow** (@xyflow/react v12.8.1) - Main diagramming library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling with custom CSS variables
- **Zustand** - State management for nodes
- **Vitest** - Testing framework (though tests need fixing)
- **ShadCN/UI** components configuration

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests (currently has configuration issues)
npm test
```

## Core Architecture

### State Management
The application uses a dual-state approach:
- **React Flow state**: Manages visual representation (`useNodesState`, `useEdgesState`)
- **Zustand store** (`src/utils/store.js`): Manages structured node data for export

### Component Structure
```
src/
├── App.jsx              # Main application with React Flow setup
├── main.jsx             # React root with ReactFlowProvider
├── components/
│   ├── CustomNode.jsx   # Main node component with editing capabilities
│   ├── Header.jsx       # Top toolbar with save/load/export
│   └── Sidebar.jsx      # Draggable node palette
├── utils/
│   └── store.js         # Zustand store for node management
└── styles/
    └── index.css        # Tailwind + custom CSS
```

### Node System
- **Node Types**: Start, End, Agent, Supervisor, Team, Tools
- **Color coding**: Each node type has distinct background colors
- **Interactive features**: Double-click to edit labels/descriptions, click to expand details
- **Unique IDs**: 4-digit random IDs generated for each node
- **State sync**: Visual state syncs to Zustand store for structured export

### Key Features
- **Drag & Drop**: Nodes from sidebar to canvas
- **Copy/Paste**: Ctrl/Cmd+C and Ctrl/Cmd+V for selected nodes
- **Inline editing**: Double-click labels and descriptions
- **JSON Export**: Structured data export via Zustand store
- **Save/Load**: Backend integration (expects server on localhost:3001)

## Development Patterns

### Adding New Node Types
1. Add icon to `iconMap` in both `CustomNode.jsx` and `Sidebar.jsx`
2. Add color styling in `CustomNode.jsx` className logic
3. Add draggable node in `Sidebar.jsx`
4. Update `getNodeType()` logic if needed

### State Management Pattern
- UI changes update React Flow state immediately
- Use callbacks (`onNodeLabelChange`, `onNodeDescriptionChange`) to sync to Zustand
- Zustand store maintains export-ready structure separate from visual state

### Styling Approach
- **Tailwind classes** for layout and colors
- **Custom CSS** (index.css) for React Flow integration and node styling
- **CSS variables** for ShadCN theming system
- **Responsive design** considerations for different node sizes

## Testing & Code Quality

The current test setup has issues with Vitest configuration. Tests should use:
- `@testing-library/react` for component testing
- `@testing-library/user-event` for interaction testing
- Vitest as the test runner

## Backend Integration

The app expects a backend server at `localhost:3001` with endpoints:
- `POST /save` - Save flow data
- `GET /load` - Load flow data

## Common Development Tasks

### Running Single Tests
```bash
# Fix test configuration first, then:
npm test -- --run src/test/App.test.jsx
```

### Building and Testing Production
```bash
npm run build
npm run preview
```

### Debugging React Flow Issues
- Check browser console for ResizeObserver errors (these are suppressed in main.jsx)
- Use React Flow devtools for node/edge state inspection
- Monitor Zustand store state via browser devtools

## Project Structure Notes

- **Path aliases**: `@/` maps to `src/` (configured in jsconfig.json and vite.config.mjs)
- **Import style**: Use ES6 imports throughout
- **File extensions**: `.jsx` for React components, `.js` for utilities
- **Styling**: Tailwind-first approach with custom CSS for React Flow specifics
