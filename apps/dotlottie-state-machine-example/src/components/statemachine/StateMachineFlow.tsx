import { useCallback, useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, Edge, Node, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { StateMachine } from '../types';
import StateNode from './StateNode';

const nodeTypes = {
  stateNode: StateNode,
};

interface StateMachineFlowProps {
  data: StateMachine;
}

export default function StateMachineFlow({ data }: StateMachineFlowProps) {
  const [activeState, setActiveState] = useState<string>(data.descriptor.initial);

  const createNodesAndEdges = useCallback(
    (stateMachine: StateMachine) => {
      const nodes: Node[] = [];
      const edges: Edge[] = [];

      // Calculate positions in a circular layout
      const radius = 200;
      const angleStep = (2 * Math.PI) / stateMachine.states.length;

      stateMachine.states.forEach((state, index) => {
        const angle = index * angleStep;
        const x = radius * Math.cos(angle) + radius;
        const y = radius * Math.sin(angle) + radius;

        nodes.push({
          id: state.name,
          type: 'stateNode',
          position: { x, y },
          data: {
            label: state.name,
            type: state.type,
            autoplay: state.autoplay,
            loop: state.loop,
            isActive: state.name === activeState,
          },
        });

        state.transitions.forEach((transition) => {
          edges.push({
            id: `${state.name}-${transition.toState}`,
            source: state.name,
            target: transition.toState,
            animated: true,
            label: transition.guards.map((g) => `${g.triggerName} ${g.conditionType} ${g.compareTo}`).join(' AND '),
            style: { stroke: '#2563eb' },
          });
        });
      });

      return { nodes, edges };
    },
    [activeState],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update nodes and edges when data changes
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = createNodesAndEdges(data);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [data, createNodesAndEdges, setNodes, setEdges]);

  // Simulate state changes (for demonstration)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const currentState = data.states.find(state => state.name === activeState);
  //     if (currentState?.transitions.length > 0) {
  //       const nextTransition = currentState.transitions[0];
  //       setActiveState(nextTransition.toState);
  //     }
  //   }, 2000); // Change state every 2 seconds

  //   return () => clearInterval(interval);
  // }, [activeState, data.states]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
