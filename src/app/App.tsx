import { useCallback, useMemo, useState, useEffect } from 'react';

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
  initialNodes,
  nodeTypes,
} from '../components/nodes';

import {
  initialEdges,
  edgeTypes,
} from '../edges';

import { Bot, ClipboardList, Save, RefreshCw, Send, CheckCircle2, Zap, MessageSquare, Play, HelpCircle } from 'lucide-react';
import NodeInspector from '../components/nodes/NodeInspector';

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

export default function App() {
  const [flowSource, setFlowSource] = useState<'flowStore' | 'default'>('flowStore');
  const [sidebarTab, setSidebarTab] = useState<'simulator' | 'inspector'>('simulator');

  // Load the flowStore nodes/edges as default
  const [nodes, setNodes, onNodesChange] =
    useNodesState<any>(flowStoreNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(flowStoreEdges);

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

  const onInit = useCallback(
    (instance: ReactFlowInstance) => {
      setReactFlowInstance(instance);
    },
    []
  );

  const onConnect: OnConnect =
    useCallback(
      (connection) =>
        setEdges((eds) =>
          addEdge(connection, eds)
        ),
      [setEdges]
    );

  // Retrieve currently selected node on canvas
  const selectedNode = useMemo(() => {
    return nodes.find((n: any) => n.selected);
  }, [nodes]);

  // Automatically switch tab to node editor when a node is selected
  useEffect(() => {
    if (selectedNode) {
      setSidebarTab('inspector');
    }
  }, [selectedNode]);

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
   * Add a new node of a specified type to the flow
   */
  const addNewNode = useCallback((type: string) => {
    let position = { x: 100 + Math.random() * 100, y: 100 + Math.random() * 100 };
    if (reactFlowInstance) {
      position = reactFlowInstance.screenToFlowPosition({
        x: window.innerWidth * 0.35,
        y: window.innerHeight * 0.4,
      });
    }

    const newId = `node_${Date.now()}`;
    let data: any = { label: `New ${type}` };

    if (type === 'keywordBox') {
      data = {
        label: 'Trigger Node',
        text: 'Add keywords to start chat',
        keywords: ['hello', 'hi'],
        regexCaseSensitive: false,
      };
    } else if (type === 'masterComponent') {
      data = {
        content: [
          {
            id: `msg-${Date.now()}`,
            type: 'message',
            data: {
              text: 'Hello! Welcome to our automated WhatsApp service.',
              buttons: [
                { text: 'Start', id: 1, source_handle_type: 'message_with_button' }
              ]
            }
          }
        ]
      };
    } else if (type === 'startNode') {
      data = {
        label: 'Start Flow',
        surveyTitle: 'Customer Survey',
        question: "Welcome to the survey! Please click 'Next' to begin.",
        description: 'Your feedback helps us improve our products and services.'
      };
    } else if (type === 'questionNode') {
      data = {
        surveyTitle: 'Customer Survey',
        questions: [
          { label: 'What is your name?', variable: 'name' }
        ],
        answers: {}
      };
    } else if (type === 'endNode') {
      data = {
        label: 'End Flow',
        surveyTitle: 'Customer Feedback',
        question: 'Thank you for your response! Feedback saved.',
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
        answers: {}
      };
    }

    const newNode = {
      id: newId,
      type,
      position,
      data,
      selected: true,
    };

    setNodes((nds) => nds.map((n) => ({ ...n, selected: false })).concat(newNode));
  }, [reactFlowInstance, setNodes]);

  /**
   * Node configuration updates trigger flow switch logic
   */
  const handleFlowSourceChange = (source: 'flowStore' | 'default') => {
    setFlowSource(source);
    if (source === 'default') {
      setNodes(initialNodes.map((n: any) => ({
        ...n,
        data: {
          ...n.data,
          answers: n.data?.answers || {},
        }
      })));
      setEdges(initialEdges);
    } else {
      setNodes(flowStoreNodes);
      setEdges(flowStoreEdges);
    }
  };

  /**
   * Update Survey Answers inside React Flow states
   */
  const updateAnswer = useCallback(
    (
      nodeId: string,
      question: string,
      value: string
    ) => {
      setNodes((nds: any[]) =>
        nds.map((node) => {
          if (node.id !== nodeId) {
            return node;
          }

          return {
            ...node,
            data: {
              ...node.data,
              answers: {
                ...(node.data.answers || {}),
                [question]: value,
              },
            },
          };
        })
      );
    },
    [setNodes]
  );

  /**
   * WhatsApp Live Simulation Graph Engine
   */
  const runNodeAction = useCallback((nodeId: string) => {
    const node = nodes.find((n: any) => n.id === nodeId);
    if (!node) return;

    if (node.type === 'masterComponent') {
      const contents = node.data?.content || [];

      contents.forEach((item: any) => {
        if (item.type === 'message') {
          setChatLog((prev) => [...prev, { sender: 'bot', text: item.data?.text || '', type: 'message', options: item.data?.buttons || [] }]);
        } else if (item.type === 'questionMessage') {
          setChatLog((prev) => [...prev, { sender: 'bot', text: item.data?.text || '', type: 'question', attribute: item.data?.attribute }]);
        } else if (item.type === 'listMessage') {
          setChatLog((prev) => [...prev, { sender: 'bot', text: item.data?.body || '', type: 'list', sections: item.data?.sections || [], buttonTitle: item.data?.buttonTitle }]);
        } else if (item.type === 'humanIntervention') {
          setChatLog((prev) => [...prev, { sender: 'system', text: '🔔 Handoff: Conversation transferred to human support HR queue.' }]);
        } else if (item.type === 'setupWebhook') {
          const method = item.data?.requestObject?.method || 'GET';
          const url = item.data?.requestObject?.url || '';

          setChatLog((prev) => [...prev, { sender: 'system', text: `⚙️ API Webhook: Calling [${method}] ${url}...` }]);
          setSimLoading(true);

          setTimeout(() => {
            setSimLoading(false);
            setChatLog((prev) => [...prev, { sender: 'system', text: '✓ Webhook completed: Success' }]);

            // Automatically transition following webhook source handle
            const wEdge = edges.find((e: any) => e.source === nodeId && e.sourceHandle === `setup-webhoook-right-${nodeId}`);
            if (wEdge) {
              setCurrentNodeId(wEdge.target);
              runNodeAction(wEdge.target);
            }
          }, 1000);
        }
      });
    } else if (node.type === 'endNode') {
      setChatLog((prev) => [
        ...prev,
        { sender: 'bot', text: node.data?.question || 'Thank you for your response! Feedback saved.' },
        { sender: 'system', text: '✓ Survey completed successfully.' }
      ]);
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
          onAnswerChange: updateAnswer,
          onPreviewNode: (id: string) => {
            setCurrentNodeId(id);
            setChatLog((prev) => [
              ...prev,
              { sender: 'system', text: `Previewing node: ${id}` }
            ]);
            runNodeAction(id);
            setSidebarTab('simulator');
          },
          onSelectNode: (id: string) => {
            setNodes((nds) =>
              nds.map((n) => ({
                ...n,
                selected: n.id === id,
              }))
            );
            setSidebarTab('inspector');
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
    [nodes, updateAnswer, setNodes, setEdges, runNodeAction, setSidebarTab]
  );

  /**
   * Save current flow config and variables
   */
  const saveFlow = () => {
    if (!reactFlowInstance) return;

    const flow =
      reactFlowInstance.toObject();

    console.clear();
    console.log('========== FLOW ==========');
    console.log(JSON.stringify(flow, null, 2));
    console.log('========== ANSWERS ==========');

    let hasAnswers = false;
    flow.nodes.forEach((node) => {
      if (node.data?.answers && Object.keys(node.data.answers).length > 0) {
        hasAnswers = true;
        console.log(`Node ID: ${node.id} (${node.type})`);
        console.table(node.data.answers);
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

    if (flowSource === 'flowStore') {
      const triggerNode = nodes.find((n: any) => n.type === 'keywordBox');
      if (triggerNode) {
        setCurrentNodeId(triggerNode.id);
        const keywords = triggerNode.data?.keywords || [];
        const kText = keywords.length > 0 ? ` [${keywords.join(', ')}]` : '';
        setChatLog([
          { sender: 'system', text: `Chat session initialized. Type a keyword trigger${kText} or send 'hello' to start.` }
        ]);
      } else {
        setChatLog([{ sender: 'system', text: 'Error: Keyword trigger node not found.' }]);
      }
    } else {
      const startNode = nodes.find((n: any) => n.id === '1');
      if (startNode) {
        setCurrentNodeId(startNode.id);
        setChatLog([
          { sender: 'bot', text: startNode.data?.question || "Welcome to the survey! Click 'Start Survey' to begin." },
          { sender: 'system', text: 'Click "Start Survey" below or type any message to start.' }
        ]);
      }
    }
  }, [nodes, flowSource]);

  // Initialize simulator state on load or flow source change
  useEffect(() => {
    resetSimulator();
  }, [flowSource, nodes.length]);

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

    if (flowSource === 'flowStore') {
      // If we are at the trigger node
      if (currentNodeId === 'keyword') {
        const edge = edges.find((e: any) => e.source === 'keyword');
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

          // Save back into global node state answers
          updateAnswer(currentNodeId!, attr, text);

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
    } else {
      // Default Flow simulation
      if (currentNodeId === '1') {
        const edge = edges.find((e: any) => e.source === '1');
        if (edge) {
          setCurrentNodeId(edge.target);
          runNodeAction(edge.target);
        }
      } else if (currentNodeId === '2') {
        const edge = edges.find((e: any) => e.source === '2');
        if (edge) {
          setCurrentNodeId(edge.target);
          runNodeAction(edge.target);
        }
      } else {
        setChatLog((prev) => [...prev, { sender: 'system', text: 'Flow finished.' }]);
      }
    }
  }, [currentNodeId, inputMessage, edges, chatLog, flowSource, runNodeAction, updateAnswer]);

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

    const edge = edges.find((e: any) => e.source === currentNodeId && e.sourceHandle === row.id);

    if (edge) {
      setCurrentNodeId(edge.target);
      runNodeAction(edge.target);
    } else {
      setChatLog((prev) => [...prev, { sender: 'system', text: 'Path edge connection missing for selected list item.' }]);
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
      <header className="flex flex-col md:flex-row items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm z-50">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-200">
            <Bot size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 m-0 leading-tight">Intigate Flow Builder & Simulator</h1>
            <p className="text-[11px] text-slate-500 m-0 mt-0.5">
              Active Graph: <span className="font-semibold text-slate-700">{flowSource === 'flowStore' ? 'Recruitment/Job Bot API' : 'Default Customer Survey'}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          {/* Flow Segmented Selector */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => handleFlowSourceChange('flowStore')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${flowSource === 'flowStore'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <Bot size={14} />
              WhatsApp Bot
            </button>
            <button
              onClick={() => handleFlowSourceChange('default')}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${flowSource === 'default'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <ClipboardList size={14} />
              Customer Survey
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={saveFlow}
            className="flex items-center gap-1.5 rounded-xl bg-[#075E54] hover:bg-[#054c44] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition cursor-pointer"
          >
            <Save size={14} />
            Save Flow Data
          </button>
        </div>
      </header>

      {/* Main Workspace Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: React Flow Canvas (70% width) */}
        <div className="flex-1 relative border-r border-slate-200">
          <ReactFlow
            nodes={nodesWithHandlers}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} color="#cbd5e1" gap={16} size={1.5} />
            <MiniMap style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }} zoomable pannable />
            <Controls style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          </ReactFlow>

          {/* Floating Add Node Action Bar */}
          <div className="absolute top-4 left-4 z-40 bg-white/95 backdrop-blur border border-slate-200/80 shadow-lg rounded-2xl p-3 flex flex-col md:flex-row items-center gap-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">Add Node:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => addNewNode('keywordBox')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200/60 text-teal-700 rounded-xl text-xs font-semibold shadow-sm transition hover:scale-[1.03] cursor-pointer"
                title="WhatsApp Entry Trigger Keywords"
              >
                <Zap size={13} className="text-teal-600 fill-teal-600/10" />
                Trigger
              </button>
              <button
                onClick={() => addNewNode('masterComponent')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 text-indigo-700 rounded-xl text-xs font-semibold shadow-sm transition hover:scale-[1.03] cursor-pointer"
                title="WhatsApp Messages, Buttons, Lists, Webhooks, Handoff"
              >
                <MessageSquare size={13} className="text-indigo-600" />
                Interactive
              </button>
              <button
                onClick={() => addNewNode('startNode')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 text-emerald-700 rounded-xl text-xs font-semibold shadow-sm transition hover:scale-[1.03] cursor-pointer"
                title="Survey Start Node"
              >
                <Play size={13} className="text-emerald-600 fill-emerald-600/10" />
                Start Flow
              </button>
              <button
                onClick={() => addNewNode('questionNode')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 text-blue-700 rounded-xl text-xs font-semibold shadow-sm transition hover:scale-[1.03] cursor-pointer"
                title="Collection of Profile Questions"
              >
                <HelpCircle size={13} className="text-blue-600" />
                Question
              </button>
              <button
                onClick={() => addNewNode('endNode')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 text-rose-700 rounded-xl text-xs font-semibold shadow-sm transition hover:scale-[1.03] cursor-pointer"
                title="Survey End / Feedback Node"
              >
                <CheckCircle2 size={13} className="text-rose-600" />
                End Flow
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Dual Control Panel Sidebar (30% width) */}
        <div className="w-[450px] bg-slate-50 flex flex-col border-l border-slate-200">
          {/* Tab Selector */}
          <div className="flex border-b border-slate-200 bg-white p-2.5">
            <button
              onClick={() => setSidebarTab('simulator')}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${sidebarTab === 'simulator'
                  ? 'bg-violet-50 text-violet-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              💬 WhatsApp Simulator
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
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center bg-white px-3 py-2.5 rounded-xl border border-slate-250/50 shadow-sm">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Chat Session Live Run</h3>
                    <p className="text-[10px] text-slate-400">Step through and test your flow dynamically.</p>
                  </div>
                  <button
                    onClick={resetSimulator}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-slate-600 shadow-sm hover:bg-slate-50 cursor-pointer"
                    title="Restart Session"
                  >
                    <RefreshCw size={12} />
                  </button>
                </div>

                {/* Smartphone Mock Frame */}
                <div className="mx-auto w-full max-w-[340px] rounded-[36px] border-8 border-slate-800 bg-[#ECE5DD] overflow-hidden shadow-xl relative h-[480px] flex flex-col">
                  {/* WhatsApp Status Bar */}
                  <div className="bg-[#054c44] text-white px-5 py-1 text-[8px] flex justify-between items-center opacity-90">
                    <span>10:32 AM</span>
                    <div className="flex items-center gap-1">
                      <span>LTE</span>
                      <span className="h-2 w-4 border border-white/60 rounded-sm bg-white/80"></span>
                    </div>
                  </div>

                  {/* WhatsApp Phone Header */}
                  <div className="bg-[#075E54] text-white px-3 py-2.5 flex items-center gap-2 shadow-md">
                    <div className="h-7 w-7 rounded-full bg-emerald-700 border border-emerald-600/40 text-center leading-7 text-xs font-bold">
                      {flowSource === 'flowStore' ? '🤖' : '📋'}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[11px] font-bold truncate leading-tight">
                        {flowSource === 'flowStore' ? 'Recruitment Bot' : 'Survey Assistant'}
                      </h4>
                      <span className="text-[8px] text-emerald-300 leading-none">online</span>
                    </div>
                  </div>

                  {/* Chat Timeline Log */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 flex flex-col bg-[#ECE5DD]">
                    {chatLog.map((log, idx) => {
                      if (log.sender === 'system') {
                        return (
                          <div key={idx} className="self-center bg-white/70 border border-slate-200 text-slate-500 rounded-md px-2 py-1 text-[8px] font-medium text-center max-w-[90%] shadow-sm">
                            {log.text}
                          </div>
                        );
                      }

                      const isBot = log.sender === 'bot';
                      return (
                        <div key={idx} className={`space-y-1 ${isBot ? 'self-start' : 'self-end'}`}>
                          <div className={`relative max-w-[240px] px-3 py-2 rounded-xl text-xs shadow-sm ${isBot
                              ? 'bg-white rounded-tl-none text-slate-800'
                              : 'bg-[#DCF8C6] rounded-tr-none text-slate-800'
                            }`}>
                            {/* Speech bubble small triangle */}
                            <div className={`absolute top-0 h-2 w-2 ${isBot ? 'left-[-4px] bg-white' : 'right-[-4px] bg-[#DCF8C6]'}`}
                              style={{ clipPath: isBot ? 'polygon(100% 0, 100% 100%, 0 0)' : 'polygon(0 0, 0 100%, 100% 0)' }}></div>

                            <p className="leading-relaxed whitespace-pre-wrap">{log.text}</p>
                          </div>

                          {/* Render bubble options inside chat log for active options */}
                          {isBot && idx === chatLog.length - 1 && (
                            <div className="mt-1 space-y-1.5">
                              {/* Reply Buttons */}
                              {log.type === 'message' && log.options?.map((btn: any) => (
                                <button
                                  key={btn.id}
                                  onClick={() => handleButtonClick(btn)}
                                  className="block w-[240px] bg-white hover:bg-slate-50 text-[#00A884] text-[11px] font-bold text-center py-2 rounded-xl shadow border border-slate-200 cursor-pointer"
                                >
                                  {btn.text}
                                </button>
                              ))}

                              {/* Selection Lists */}
                              {log.type === 'list' && log.sections?.map((sec: any) => (
                                <div key={sec.id} className="w-[240px] rounded-xl border border-slate-250 bg-white overflow-hidden shadow">
                                  {sec.title && <div className="bg-slate-50 px-2 py-1.5 text-[8px] font-bold text-slate-400 border-b">{sec.title}</div>}
                                  {sec.items?.map((opt: any) => (
                                    <button
                                      key={opt.id}
                                      onClick={() => handleListOptionClick(opt)}
                                      className="block w-full text-left px-3 py-2 text-[10px] text-slate-700 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 cursor-pointer font-medium"
                                    >
                                      {opt.title}
                                      {opt.description && <p className="text-[8px] text-slate-400">{opt.description}</p>}
                                    </button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Loader */}
                    {simLoading && (
                      <div className="self-start bg-white/70 rounded-lg px-3 py-1.5 text-[10px] text-slate-500 shadow-sm flex items-center gap-1 border">
                        <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Message Input Footer */}
                  <div className="bg-[#ECE5DD] p-2 flex items-center gap-1.5 border-t border-slate-250/20">
                    <input
                      type="text"
                      placeholder="Type a message"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-white rounded-full px-4 py-2 text-xs border border-slate-250 shadow-sm outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      className="h-8 w-8 bg-[#00A884] text-white flex items-center justify-center rounded-full hover:bg-[#008f72] shadow-sm cursor-pointer"
                    >
                      <Send size={12} className="ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* State Variables Inspector */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <CheckCircle2 size={13} className="text-violet-600" />
                    Collected Flow Variables
                  </h4>
                  {Object.keys(simVariables).length > 0 ? (
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.entries(simVariables).map(([k, v]) => (
                        <div key={k} className="bg-slate-50 p-2 rounded-lg border border-slate-150 text-[10px]">
                          <span className="font-semibold text-slate-400 block uppercase tracking-wider">{k}</span>
                          <span className="text-slate-800 font-bold mt-0.5 block">{v}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-50/50 p-3 rounded-lg border border-dashed text-center">
                      <p className="text-[10px] text-slate-400 italic">No variables captured yet. Interact with the chat simulator.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <NodeInspector selectedNode={selectedNode} updateNodeData={updateNodeData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}