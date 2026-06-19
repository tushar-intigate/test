import { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { PanelRightClose, PanelRight, MessageCircle, Settings2 } from 'lucide-react';

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
import { useSimulationEngine } from '../hooks/useSimulationEngine';

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

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Layout & Panel State
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'simulator' | 'inspector'>('inspector');
  const [openBuilder, setOpenBuilder] = useState(true);

  const [nodes, setNodes, onNodesChange] =
    useNodesState<any>(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  // Simulator State & Logic Hook
  const {
    simMode,
    setSimMode,
    setCurrentNodeId,
    chatLog,
    setChatLog,
    simVariables,
    inputMessage,
    setInputMessage,
    simLoading,
    runNodeAction,
    resetSimulator,
    handleSendMessage,
    handleButtonClick,
    handleListOptionClick,
  } = useSimulationEngine(nodes, edges, setNodes);

  const [
    reactFlowInstance,
    setReactFlowInstance,
  ] = useState<ReactFlowInstance | null>(
    null
  );

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
        // Remove any existing edge that starts from the exact same source/handle or ends at the same target/handle
        const filteredEdges = eds.filter(
          (e) => !(
            (e.source === connection.source && e.sourceHandle === connection.sourceHandle) ||
            (e.target === connection.target && e.targetHandle === connection.targetHandle)
          )
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
            setSimMode('single');
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
            setSidebarTab('inspector');
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

  const handleSave = () => {
    // Generate flowMessages in the original database schema format
    const flowMessages = nodes.map((node: any) => {
      if (node.type === 'keywordBox') {
        const edge = edges.find((e: any) => e.source === node.id);
        return {
          messageId: node.id === 'trigger-1' ? 'keyword' : node.id,
          keywords: node.data?.keywords || [],
          templates: node.data?.templates || [],
          qrCampaigns: node.data?.qrCampaigns || [],
          ad: node.data?.ad || null,
          ads: node.data?.ads || null,
          iceBreakers: node.data?.iceBreakers || [],
          regexCaseSensitive: node.data?.regexCaseSensitive || false,
          triggerMessageId: edge ? edge.target : '',
          isOrderEnabled: node.data?.isOrderEnabled || false
        };
      }

      if (node.type === 'masterComponent') {
        const contents = node.data?.content || [];
        const content = contents.map((item: any) => {
          if (item.type === 'humanIntervention') {
            return {
              type: 'HUMANINTERVENTION',
              isRequesting: item.data?.isRequesting ?? true
            };
          }
          if (item.type === 'message') {
            return {
              type: 'INTERACTIVE',
              interactive: {
                type: 'button',
                header: item.data?.mediaType && item.data.mediaType !== 'none' ? {
                  type: item.data.mediaType,
                  [item.data.mediaType]: {
                    link: item.data.mediaUrl,
                    filename: item.data.mediaName
                  }
                } : undefined,
                body: {
                  text: item.data?.text || ''
                },
                action: {
                  buttons: (item.data?.buttons || []).map((btn: any) => {
                    const edge = edges.find(
                      (e: any) => e.source === node.id && e.sourceHandle === `message_with_button-right-${node.id}-${btn.id}`
                    );
                    return {
                      type: 'reply',
                      reply: {
                        id: btn.id,
                        title: btn.text
                      },
                      triggerMessageId: edge ? edge.target : ''
                    };
                  })
                }
              }
            };
          }
          if (item.type === 'listMessage') {
            return {
              type: 'INTERACTIVE',
              interactive: {
                type: 'list',
                header: {
                  type: 'text',
                  text: item.data?.header || ''
                },
                body: {
                  text: item.data?.body || ''
                },
                footer: {
                  text: item.data?.footer || ''
                },
                action: {
                  button: item.data?.buttonTitle || 'Select',
                  sections: (item.data?.sections || []).map((sec: any) => ({
                    id: sec.id,
                    title: sec.title,
                    rows: (sec.items || []).map((row: any) => {
                      const edge = edges.find(
                        (e: any) => e.source === node.id && (e.sourceHandle === row.id || e.sourceHandle === row.source_handle_type)
                      );
                      return {
                        id: row.id,
                        title: row.title,
                        description: row.description || '',
                        triggerMessageId: edge ? edge.target : ''
                      };
                    })
                  }))
                }
              }
            };
          }
          if (item.type === 'questionMessage') {
            const edge = edges.find((e: any) => e.source === node.id && e.sourceHandle === `question-right-${node.id}`);
            return {
              type: 'QUESTION',
              text: item.data?.text || '',
              attribute: item.data?.attribute || '',
              triggerMessageId: edge ? edge.target : '',
              attributeNumberOfAttempt: item.data?.attributeNumberOfAttempt || '1',
              attributeFormatValue: item.data?.attributeFormatValue || { min: '', max: '', regex: '' },
              attributeFormatValidationErrorMessage: item.data?.attributeFormatValidationErrorMessage || '',
              attributeFormat: item.data?.attributeFormat || 'Any',
              mediaType: item.data?.mediaType || '',
              delay: item.data?.delay || '0'
            };
          }
          if (item.type === 'setupWebhook') {
            let edge = edges.find((e: any) => e.source === node.id && e.sourceHandle === `setup-webhoook-right-${node.id}`);
            if (!edge) {
              edge = edges.find((e: any) => e.source === node.id && e.sourceHandle === `master-component-next-${node.id}`);
            }
            return {
              type: 'SETUPWEBHOOK',
              requestObject: item.data?.requestObject || {
                url: '',
                method: 'GET',
                params: [],
                headers: [],
                error: null,
                isTestPass: false,
                isLoading: false
              },
              attribute: item.data?.attribute || '',
              responseKey: item.data?.responseKey || '',
              statusCodes: item.data?.statusCodes || [],
              triggerMessageId: edge ? edge.target : '',
              capturingAttributes: item.data?.capturingAttributes || [{ attribute: '', responseKey: '' }]
            };
          }
          if (item.type === 'catalogue') {
            const edge = edges.find((e: any) => e.source === node.id && e.sourceHandle === `master-component-next-${node.id}`);
            return {
              type: 'CATALOGUE',
              text: item.data?.text || '',
              catalogues: item.data?.catalogues || [],
              footer: item.data?.footer || '',
              triggerMessageId: edge ? edge.target : ''
            };
          }
          return item;
        });

        return {
          messageId: node.id,
          content
        };
      }
      return null;
    }).filter(Boolean);

    // Clean nodes to avoid saving temporary runtime states like active selections, answers, and callback functions
    const cleanedNodes = nodes.map((node: any) => {
      const { selected, data, ...rest } = node;
      const { answers, updateNodeData, onAnswerChange, onPreviewNode, onSelectNode, onCopyNode, onDeleteNode, ...restData } = data || {};
      return {
        ...rest,
        data: restData
      };
    });

    const fullFlowPayload = {
      assistantId: flowData.fetchedFlow[0]?.assistantId || "6a3115d2e5b8680f107218f3",
      flowObject: {
        _id: flowData.fetchedFlow[0]?._id || "6a312671e5b8680f107773f0",
        keywords: flowData.fetchedFlow[0]?.keywords || [],
        flowMessages,
        status: flowData.fetchedFlow[0]?.status ?? false,
        isDeleted: flowData.fetchedFlow[0]?.isDeleted ?? false,
        type: flowData.fetchedFlow[0]?.type || "USER",
        hasAiKeyword: flowData.fetchedFlow[0]?.hasAiKeyword ?? false,
        assistantId: flowData.fetchedFlow[0]?.assistantId || "6a3115d2e5b8680f107218f3",
        clientId: flowData.fetchedFlow[0]?.clientId || "6a3115d2e5b8680f107218ee",
        flowName: flowData.fetchedFlow[0]?.flowName || "Recruitment/Job Bot API",
        flow: {
          nodes: cleanedNodes,
          edges: edges
        }
      }
    };

    console.log("Saved Flow Data (Original Format): ", fullFlowPayload);
  };

  const handleTestFullFlow = () => {
    const triggerNode = nodes.find((n: any) => n.type === 'keywordBox') || nodes[0];
    if (triggerNode) {
      setCurrentNodeId(triggerNode.id);
      setChatLog([]);
      setSimMode('full');
      runNodeAction(triggerNode.id);
      setSidebarTab('simulator');
      setShowRightPanel(true);
    } else {
    }
  };



  // Initialize simulator state on load or flow source change
  useEffect(() => {
    resetSimulator();
  }, [nodes.length]);



  return (
    <div className="flex h-screen w-full flex-col bg-[#f8fafc] font-sans">
      {/* Top Header Selector Control Bar */}
      <Header onSave={handleSave} onTestFlow={handleTestFullFlow} />

      {/* Main Workspace Split Layout */}
      <div className="flex flex-1 overflow-hidden relative">
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
              <Background color="#cbd5e1" variant={BackgroundVariant.Cross} gap={24} size={2} />
              <MiniMap style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }} zoomable pannable />
              <Controls style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            </ReactFlow>

            {/* Floating Add Node Action Bar */}
            <AddNodeFloatingBar openBuilder={openBuilder} setOpenBuilder={setOpenBuilder} />

            {/* Right Panel Toggle Button */}
            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className="absolute top-4 right-4 z-40 bg-white/80 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-xl p-2.5 text-slate-500 hover:text-violet-600 hover:bg-white hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              title={showRightPanel ? "Hide Control Panel" : "Show Control Panel"}
            >
              {showRightPanel ? <PanelRightClose size={20} /> : <PanelRight size={20} />}
            </button>
          </div>
        </div>

        {/* Right Side: Dual Control Panel Sidebar (30% width) */}
        {showRightPanel && (
          <div className="w-[450px] bg-slate-50 flex flex-col border-l border-slate-200 shrink-0">
            {/* Tab Selector */}
            <div className="bg-slate-50/90 backdrop-blur-sm p-3 border-b border-slate-200 z-10">
              <div className="flex bg-slate-200/60 p-1 rounded-xl shadow-inner">
                <button
                  onClick={() => setSidebarTab('simulator')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold rounded-lg transition-all duration-300 cursor-pointer ${sidebarTab === 'simulator'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                >
                  <MessageCircle size={14} className={sidebarTab === 'simulator' ? 'text-violet-500' : ''} /> Simulator
                </button>
                <button
                  onClick={() => setSidebarTab('inspector')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold rounded-lg transition-all duration-300 cursor-pointer ${sidebarTab === 'inspector'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                >
                  <Settings2 size={14} className={sidebarTab === 'inspector' ? 'text-violet-500' : ''} /> Node Editor
                </button>
              </div>
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
                  onCloseSimulator={() => setShowRightPanel(false)}
                  simMode={simMode}
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
