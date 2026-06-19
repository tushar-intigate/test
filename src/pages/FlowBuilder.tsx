import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { PanelRightClose, PanelRight } from 'lucide-react';

import {
  ReactFlow,
  ReactFlowInstance,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { flowData } from '../store/flowStore.ts';

import {
  nodeTypes,
} from '../components/nodes';

import {
  edgeTypes,
} from '../edges';

import NodeInspector from '../components/nodes/NodeInspector';
import Header from '../components/layouts/Header';
import BuilderSidebar from '../components/layouts/BuilderSidebar';
import AddNodeFloatingBar from '../components/layouts/AddNodeFloatingBar';
import WhatsAppSimulator from '../components/simulator/WhatsAppSimulator';

// Extract the custom flow data nodes and edges from flowStore.ts
const flowStoreNodesRaw = flowData.fetchedFlow[0]?.flow?.nodes || [];
const flowStoreEdgesRaw = flowData.fetchedFlow[0]?.flow?.edges || [];

// Prepare parsed nodes with answers initialized
const flowStoreNodes = flowStoreNodesRaw.map((node: any) => ({
  ...node,
  data: {
    ...node.data,
    answers: node.data?.answers || {},
  },
}));

// Prepare parsed edges with generated unique IDs (since raw data lacks them)
const flowStoreEdges = flowStoreEdgesRaw.map((edge: any, index: number) => ({
  id: edge.id || `edge-${edge.source}-${edge.sourceHandle || ''}-${edge.target}-${index}`,
  ...edge,
}));

export default function FlowBuilder() {
  const { flowId } = useParams<{ flowId: string }>();

  const initialNodes = flowId === 'new' ? [{
    id: 'trigger-1',
    type: 'keywordBox',
    position: { x: 250, y: 150 },
    data: {
      label: 'Trigger Node',
      text: 'Add keywords to start chat',
      keywords: ['hello', 'hi'],
      regexCaseSensitive: false,
    },
  }] : flowStoreNodes;

  const initialEdges = flowId === 'new' ? [] : flowStoreEdges;

  const [sidebarTab, setSidebarTab] = useState<'simulator' | 'inspector'>('simulator');
  const [openBuilder, setOpenBuilder] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  const [nodes, setNodes, onNodesChange] =
    useNodesState<any>(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const [
    reactFlowInstance,
    setReactFlowInstance,
  ] = useState<ReactFlowInstance | null>(
    null
  );

  // WhatsApp Simulation States
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [chatLog, setChatLog] = useState<any[]>([]);
  const [simVariables, setSimVariables] = useState<Record<string, string>>({});
  const [inputMessage, setInputMessage] = useState('');
  const [simLoading, setSimLoading] = useState(false);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const payloadString = event.dataTransfer.getData('application/reactflow');
      if (!payloadString) return;
      
      const payload = JSON.parse(payloadString);
      const type = payload.type;
      const subType = payload.subType;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: {
          id: `node_${Date.now()}`,
          isDrag: true,
          ...(type === 'masterComponent' && subType ? {
            content: [{
              id: `node_${Date.now()}-${subType}`,
              type: subType,
              data: subType === 'message' ? { text: '', buttons: [{ text: 'Button', id: Date.now(), source_handle_type: 'message_with_button' }] } 
                  : subType === 'listMessage' ? { header: '', body: '', footer: '', buttonTitle: 'Select', sectionsCount: 1, itemsCount: 1, sections: [{ title: 'Section 1', id: `list_message-right-${Date.now()}-0`, items: [{ title: 'Item 1', description: '', id: `list_message-right-${Date.now()}-0-item`, source_handle_type: 'list_message' }] }] }
                  : {}
            }]
          } : {})
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onInit = useCallback(
    (instance: ReactFlowInstance) => {
      setReactFlowInstance(instance);
      // Ensure all nodes fit perfectly on screen after the flex layout settles
      setTimeout(() => {
        instance.fitView({ padding: 0.15, duration: 600 });
      }, 100);
    },
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((eds) => {
        // Remove any existing edge that starts from the exact same source and handle
        const filteredEdges = eds.filter(
          (e) => !(e.source === connection.source && e.sourceHandle === connection.sourceHandle)
        );

        return addEdge(
          {
            ...connection,
            type: 'buttonedge',
            animated: true,
            style: { strokeWidth: 1, stroke: '#008069' },
            markerEnd: {
              type: 'arrowclosed',
              width: 20,
              height: 20,
              color: '#008069',
            },
          },
          filteredEdges
        );
      }),
    [setEdges]
  );

  // Retrieve currently selected node on canvas
  const selectedNode = useMemo(() => {
    return nodes.find((n: any) => n.selected);
  }, [nodes]);


  /**
   * Deep update of node data configuration fields
   */
  const updateNodeData = useCallback((nodeId: string, path: (string | number)[], value: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id !== nodeId) return node;

        const updatedData = { ...node.data };
        let current = updatedData;
        for (let i = 0; i < path.length - 1; i++) {
          current[path[i]] = Array.isArray(current[path[i]])
            ? [...current[path[i]]]
            : typeof current[path[i]] === 'object' && current[path[i]] !== null
              ? { ...current[path[i]] }
              : {};
          current = current[path[i]];
        }
        current[path[path.length - 1]] = value;

        return { ...node, data: updatedData };
      })
    );
  }, [setNodes]);


  /**
   * WhatsApp Live Simulation Graph Engine
   */
  const runNodeAction = useCallback((nodeId: string) => {
    const node = nodes.find((n: any) => n.id === nodeId);
    if (!node) return;

    if (node.type === 'masterComponent') {
      const contents = node.data?.content || [];
      let isInteractive = false;
      let hasWebhook = false;

      contents.forEach((item: any) => {
        if (item.type === 'message') {
          const buttons = item.data?.buttons || [];
          if (buttons.length > 0) isInteractive = true;
          setChatLog((prev) => [...prev, { sender: 'bot', text: item.data?.text || '', type: 'message', options: buttons }]);
        } else if (item.type === 'questionMessage') {
          isInteractive = true;
          setChatLog((prev) => [...prev, { sender: 'bot', text: item.data?.text || '', type: 'question', attribute: item.data?.attribute }]);
        } else if (item.type === 'listMessage') {
          isInteractive = true;
          setChatLog((prev) => [...prev, { sender: 'bot', text: item.data?.body || '', type: 'list', sections: item.data?.sections || [], buttonTitle: item.data?.buttonTitle }]);
        } else if (item.type === 'humanIntervention') {
          setChatLog((prev) => [...prev, { sender: 'system', text: '🔔 Handoff: Conversation transferred to human support HR queue.' }]);
        } else if (item.type === 'setupWebhook') {
          hasWebhook = true;
          const method = item.data?.requestObject?.method || 'GET';
          const url = item.data?.requestObject?.url || '';

          setChatLog((prev) => [...prev, { sender: 'system', text: `⚙️ API Webhook: Calling [${method}] ${url}...` }]);
          setSimLoading(true);

          setTimeout(() => {
            setSimLoading(false);
            setChatLog((prev) => [...prev, { sender: 'system', text: '✓ Webhook completed: Success' }]);

            // Automatically transition following webhook source handle OR fallback to default next handle
            let wEdge = edges.find((e: any) => e.source === nodeId && e.sourceHandle === `setup-webhoook-right-${nodeId}`);
            if (!wEdge) {
              wEdge = edges.find((e: any) => e.source === nodeId && e.sourceHandle === `master-component-next-${nodeId}`);
            }
            if (wEdge) {
              setCurrentNodeId(wEdge.target);
              runNodeAction(wEdge.target);
            }
          }, 1000);
        }
      });

      // If node is not interactive and has no async webhook, automatically proceed to next connected node
      if (!hasWebhook && !isInteractive) {
        setTimeout(() => {
          const nextEdge = edges.find((e: any) => e.source === nodeId && e.sourceHandle === `master-component-next-${nodeId}`);
          if (nextEdge) {
            setCurrentNodeId(nextEdge.target);
            runNodeAction(nextEdge.target);
          }
        }, 500); // 500ms delay to simulate bot reading/typing delay
      }
    }
  }, [nodes, edges]);

  /**
   * Inject handlers for interactive canvas inputs
   */
  const nodesWithHandlers = useMemo(
    () =>
      nodes.map((node: any) => ({
        ...node,
        data: {
          ...node.data,
          updateNodeData,
          onAnswerChange: undefined,
          onPreviewNode: (id: string) => {
            setCurrentNodeId(id);
            setChatLog([]);
            runNodeAction(id);
            setSidebarTab('simulator');
            setShowRightPanel(true);
          },
          onSelectNode: (id: string) => {
            setNodes((nds) =>
              nds.map((n) => ({
                ...n,
                selected: n.id === id,
              }))
            );
            resetSimulator();
            setSidebarTab('simulator');
            setShowRightPanel(true);
          },
          onCopyNode: (id: string) => {
            setNodes((nds) => {
              const nodeToCopy = nds.find((n) => n.id === id);
              if (!nodeToCopy) return nds;

              const newId = `node_${Date.now()}`;
              const cleanData = JSON.parse(JSON.stringify(nodeToCopy.data));
              if (cleanData.answers) {
                cleanData.answers = {};
              }

              const copiedNode = {
                ...nodeToCopy,
                id: newId,
                selected: true,
                position: {
                  x: nodeToCopy.position.x + 40,
                  y: nodeToCopy.position.y + 40,
                },
                data: cleanData,
              };

              return nds.map((n) => ({ ...n, selected: false })).concat(copiedNode);
            });
          },
          onDeleteNode: (id: string) => {
            setNodes((nds) => nds.filter((n) => n.id !== id));
            setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
          },
        },
      })),
    [nodes, setNodes, setEdges, runNodeAction, setSidebarTab]
  );

  /**
   * Save current flow config and variables
   */
  const saveFlow = () => {
    if (!reactFlowInstance) return;

    const flow =
      reactFlowInstance.toObject();
    console.log(JSON.stringify(flow, null, 2));

    let hasAnswers = false;
    flow.nodes.forEach((node) => {
      if (node.data?.answers && Object.keys(node.data.answers).length > 0) {
        hasAnswers = true;
      }
    });

    if (!hasAnswers) {
      console.log('No answers collected yet.');
    }
  };

  /**
   * Reset Chat Simulation
   */
  const resetSimulator = useCallback(() => {
    setSimVariables({});
    setInputMessage('');
    setSimLoading(false);

    const triggerNode = nodes.find((n: any) => n.type === 'keywordBox');
    if (triggerNode) {
      // Find the first node connected from the trigger
      const firstEdge = edges.find((e: any) => e.source === triggerNode.id);
      if (firstEdge) {
        // Auto-start: jump straight to the first connected node
        setCurrentNodeId(firstEdge.target);
        setChatLog([{ sender: 'system', text: '▶ Flow started' }]);
        // Delay slightly so state settles before running node
        setTimeout(() => runNodeAction(firstEdge.target), 50);
      } else {
        setCurrentNodeId(triggerNode.id);
        const keywords = triggerNode.data?.keywords || [];
        const kText = keywords.length > 0 ? ` [${keywords.join(', ')}]` : '';
        setChatLog([
          { sender: 'system', text: `No connected nodes found. Add a connection from the trigger node${kText}.` }
        ]);
      }
    } else {
      setChatLog([{ sender: 'system', text: 'No trigger node found. Add a Keyword Trigger node to start.' }]);
    }
  }, [nodes, edges, runNodeAction]);

  // Initialize simulator state on load or flow source change
  useEffect(() => {
    resetSimulator();
  }, [nodes.length]);

  /**
   * Send text response in WhatsApp Simulator
   */
  const handleSendMessage = useCallback((textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputMessage).trim();
    if (!text) return;
    if (textToSend === undefined) {
      setInputMessage('');
    }

    setChatLog((prev) => [...prev, { sender: 'user', text }]);

    // If we are at the trigger node
    const triggerNode = nodes.find((n: any) => n.type === 'keywordBox');
    if (triggerNode && currentNodeId === triggerNode.id) {
      const edge = edges.find((e: any) => e.source === triggerNode.id);
      if (edge) {
        setCurrentNodeId(edge.target);
        runNodeAction(edge.target);
      } else {
        setChatLog((prev) => [...prev, { sender: 'system', text: 'Error: No edges originating from trigger node.' }]);
      }
    } else {
      // If we are waiting for a text question answer
      const currentMessage = [...chatLog].reverse().find((m) => m.sender === 'bot');
      if (currentMessage?.type === 'question' && currentMessage?.attribute) {
        const attr = currentMessage.attribute;
        setSimVariables((prev) => ({ ...prev, [attr]: text }));

        // Save answer into node state
        setNodes((nds: any[]) =>
          nds.map((node) =>
            node.id !== currentNodeId ? node : {
              ...node,
              data: { ...node.data, answers: { ...(node.data.answers || {}), [attr]: text } }
            }
          )
        );

        // Transition through question handle
        const edge = edges.find((e: any) => e.source === currentNodeId && e.sourceHandle === `question-right-${currentNodeId}`);
        if (edge) {
          setCurrentNodeId(edge.target);
          runNodeAction(edge.target);
        } else {
          setChatLog((prev) => [...prev, { sender: 'system', text: 'End of connected flow path.' }]);
        }
      } else {
        setChatLog((prev) => [...prev, { sender: 'system', text: 'Please choose an option from the options panel.' }]);
      }
    }
  }, [currentNodeId, inputMessage, edges, chatLog, runNodeAction, setNodes]);

  /**
   * Click WhatsApp interactive CTA buttons
   */
  const handleButtonClick = useCallback((btn: any) => {
    setChatLog((prev) => [...prev, { sender: 'user', text: btn.text }]);

    const edge = edges.find(
      (e: any) => e.source === currentNodeId && e.sourceHandle === `message_with_button-right-${currentNodeId}-${btn.id}`
    );

    if (edge) {
      setCurrentNodeId(edge.target);
      runNodeAction(edge.target);
    } else {
      setChatLog((prev) => [...prev, { sender: 'system', text: `Path edge connection missing for button id: ${btn.id}` }]);
    }
  }, [currentNodeId, edges, runNodeAction]);

  /**
   * Click WhatsApp interactive list selections
   */
  const handleListOptionClick = useCallback((row: any) => {
    setChatLog((prev) => [...prev, { sender: 'user', text: row.title }]);

    // Try to find edge by row.id first, then by row.source_handle_type
    const edge = edges.find(
      (e: any) => e.source === currentNodeId && 
      (e.sourceHandle === row.id || e.sourceHandle === row.source_handle_type)
    );

    if (edge) {
      setCurrentNodeId(edge.target);
      runNodeAction(edge.target);
    } else {
      setChatLog((prev) => [...prev, { sender: 'system', text: `No connection found for list item: "${row.title}"` }]);
    }
  }, [currentNodeId, edges, runNodeAction]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, sans-serif',
        background: '#f8fafc',
      }}
    >
      {/* Top Header Selector Control Bar */}
      <Header onSave={saveFlow} />

      {/* Main Workspace Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: React Flow Canvas & Sidebar */}
        <div className="flex-1 flex relative border-r border-slate-200">
          {/* Builder Sidebar */}
          {openBuilder && (
            <BuilderSidebar />
          )}

          {/* Canvas Wrapper */}
          <div className="flex-1 relative h-full overflow-hidden" ref={reactFlowWrapper}>
            <ReactFlow
            nodes={nodesWithHandlers}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} color="#cbd5e1" gap={16} size={1.5} />
            <MiniMap style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }} zoomable pannable />
            <Controls style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          </ReactFlow>

          {/* Floating Add Node Action Bar */}
          <AddNodeFloatingBar openBuilder={openBuilder} setOpenBuilder={setOpenBuilder} />

          {/* Right Panel Toggle Button */}
          <button
            onClick={() => setShowRightPanel(!showRightPanel)}
            className="absolute top-4 right-4 z-40 bg-white/95 backdrop-blur border border-slate-200/80 shadow-lg rounded-xl p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title={showRightPanel ? "Hide Control Panel" : "Show Control Panel"}
          >
            {showRightPanel ? <PanelRightClose size={18} /> : <PanelRight size={18} />}
          </button>
          </div>
        </div>

        {/* Right Side: Dual Control Panel Sidebar (30% width) */}
        {showRightPanel && (
          <div className="w-[450px] bg-slate-50 flex flex-col border-l border-slate-200 shrink-0">
          {/* Tab Selector */}
          <div className="flex border-b border-slate-200 bg-white p-2 gap-1">
            <button
              onClick={() => setSidebarTab('simulator')}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${sidebarTab === 'simulator'
                ? 'bg-violet-50 text-violet-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              💬 Simulator
            </button>
            <button
              onClick={() => setSidebarTab('inspector')}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${sidebarTab === 'inspector'
                ? 'bg-violet-50 text-violet-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              ⚙️ Node Editor
            </button>
          </div>

          {/* Sidebar Body */}
          <div className="flex-1 overflow-y-auto">
            {sidebarTab === 'simulator' ? (
              <WhatsAppSimulator
                chatLog={chatLog}
                simLoading={simLoading}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                onSendMessage={handleSendMessage}
                onButtonClick={handleButtonClick}
                onListOptionClick={handleListOptionClick}
                simVariables={simVariables}
                onReset={resetSimulator}
                simMode="full"
                onSimModeChange={() => {}}
              />
            ) : (
              <NodeInspector selectedNode={selectedNode} updateNodeData={updateNodeData} />
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
