import { useState, useCallback } from 'react';

export function useSimulationEngine(nodes: any[], edges: any[], setNodes: any) {
  const [chatLog, setChatLog] = useState<any[]>([]);
  const [simVariables, setSimVariables] = useState<Record<string, string>>({});
  const [simLoading, setSimLoading] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [simMode, setSimMode] = useState<'single' | 'full'>('full');
  const [inputMessage, setInputMessage] = useState('');

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

          if (item.data?.mediaType && item.data.mediaType !== 'none' && item.data.mediaUrl) {
            setChatLog((prev) => [
              ...prev,
              {
                sender: 'bot',
                type: `media_${item.data.mediaType}`,
                url: item.data.mediaUrl,
                name: item.data.mediaName || 'Media File',
              },
            ]);
          }

          setChatLog((prev) => [...prev, { sender: 'bot', text: item.data?.text || '', type: 'message', options: buttons }]);
        } else if (item.type === 'questionMessage') {
          isInteractive = true;
          setChatLog((prev) => [...prev, { sender: 'bot', text: item.data?.text || '', type: 'question', attribute: item.data?.attribute }]);
        } else if (item.type === 'listMessage') {
          isInteractive = true;
          setChatLog((prev) => [...prev, { sender: 'bot', text: item.data?.body || '', type: 'list', sections: item.data?.sections || [], buttonTitle: item.data?.buttonTitle }]);
        } else if (item.type === 'humanIntervention') {
          isInteractive = true; // Handoff stops the automated bot flow
          const isReq = item.data?.isRequesting;
          setChatLog((prev) => [...prev, { 
            sender: 'system', 
            text: isReq 
              ? '🔔 Handoff: Conversation transferred to human support HR queue.' 
              : 'ℹ️ Handoff: Node reached, but it is currently set to Inactive.' 
          }]);
        } else if (item.type === 'catalogue') {
          isInteractive = true;
          setChatLog((prev) => [...prev, { 
            sender: 'bot', 
            text: item.data?.text || '', 
            type: 'catalogue', 
            catalogues: item.data?.catalogues || [], 
            footer: item.data?.footer || '' 
          }]);
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

  const resetSimulator = useCallback(() => {
    setSimVariables({});
    setInputMessage('');
    setSimLoading(false);

    const triggerNode = nodes.find((n: any) => n.type === 'keywordBox');
    if (triggerNode) {
      const firstEdge = edges.find((e: any) => e.source === triggerNode.id);
      if (firstEdge) {
        setCurrentNodeId(firstEdge.target);
        setChatLog([{ sender: 'system', text: '▶ Flow started' }]);
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

  const handleSendMessage = useCallback((textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputMessage).trim();
    if (!text) return;
    if (textToSend === undefined) {
      setInputMessage('');
    }

    setChatLog((prev) => [...prev, { sender: 'user', text }]);

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
      const currentMessage = [...chatLog].reverse().find((m) => m.sender === 'bot');
      if (currentMessage?.type === 'question' && currentMessage?.attribute) {
        const attr = currentMessage.attribute;
        setSimVariables((prev) => ({ ...prev, [attr]: text }));

        setNodes((nds: any[]) =>
          nds.map((node) =>
            node.id !== currentNodeId ? node : {
              ...node,
              data: { ...node.data, answers: { ...(node.data.answers || {}), [attr]: text } }
            }
          )
        );

        const edge = edges.find((e: any) => e.source === currentNodeId && e.sourceHandle === `question-right-${currentNodeId}`);
        if (edge) {
          setCurrentNodeId(edge.target);
          runNodeAction(edge.target);
        } else {
          setChatLog((prev) => [...prev, { sender: 'system', text: 'End of connected flow path.' }]);
        }
      } else {
        if (currentMessage?.type === 'message' && currentMessage?.options?.length > 0) {
          const matchedBtn = currentMessage.options.find((b: any) => b.text.toLowerCase() === text.toLowerCase());
          if (matchedBtn) {
            handleButtonClick(matchedBtn);
            return;
          }
        }

        if (currentMessage?.type === 'list' && currentMessage?.sections?.length > 0) {
          let matchedRow: any = null;
          for (const sec of currentMessage.sections) {
            for (const item of (sec.items || [])) {
              if (item.title.toLowerCase() === text.toLowerCase()) {
                matchedRow = item;
                break;
              }
            }
          }
          if (matchedRow) {
            handleListOptionClick(matchedRow);
            return;
          }
        }

        const nextEdge = edges.find((e: any) => e.source === currentNodeId && e.sourceHandle === `master-component-next-${currentNodeId}`);
        if (nextEdge) {
          setCurrentNodeId(nextEdge.target);
          runNodeAction(nextEdge.target);
        } else {
          setChatLog((prev) => [...prev, { sender: 'system', text: currentMessage?.options?.length > 0 ? 'Please choose a valid option.' : 'Message received. No further steps connected.' }]);
        }
      }
    }
  }, [currentNodeId, inputMessage, edges, chatLog, runNodeAction, setNodes, nodes]);

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

  const handleListOptionClick = useCallback((row: any) => {
    setChatLog((prev) => [...prev, { sender: 'user', text: row.title }]);

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

  return {
    chatLog, setChatLog,
    simVariables, setSimVariables,
    simLoading, setSimLoading,
    currentNodeId, setCurrentNodeId,
    simMode, setSimMode,
    inputMessage, setInputMessage,
    runNodeAction,
    resetSimulator,
    handleSendMessage,
    handleButtonClick,
    handleListOptionClick
  };
}
