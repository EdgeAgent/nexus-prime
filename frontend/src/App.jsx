import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Panel,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause, 
  Square, 
  Save, 
  Plus, 
  Settings, 
  Zap, 
  Globe, 
  Mail, 
  Clock, 
  GitBranch, 
  Shuffle, 
  Bell,
  FileText,
  PauseCircle,
  Webhook,
  Loader2,
  AlertCircle,
   FolderOpen,
  FileText as Template,
  History,
  MoreHorizontal
} from 'lucide-react';

import { workflowAPI, nodeTypeAPI, handleAPIError, checkBackendHealth } from './services/api';
import WorkflowTemplates from './components/WorkflowTemplates';
import ExecutionHistory from './components/ExecutionHistory';
import './App.css';

// Custom Node Components
const CustomNode = ({ data, selected }) => {
  const getNodeIcon = (nodeType) => {
    const iconMap = {
      'start_workflow': Play,
      'webhook_trigger': Webhook,
      'schedule_trigger': Clock,
      'send_email': Mail,
      'http_request': Globe,
      'log_message': FileText,
      'condition': GitBranch,
      'transform_data': Shuffle,
      'delay': PauseCircle,
      'notify_admin': Bell,
    };
    return iconMap[nodeType] || Settings;
  };

  const Icon = getNodeIcon(data.node_type);

  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`} style={{ borderColor: data.color }}>
      {/* Input Handle - Left side */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#555',
          width: '12px',
          height: '12px',
          border: '2px solid #fff',
          borderRadius: '50%',
        }}
      />
      
      <div className="node-header" style={{ backgroundColor: data.color }}>
        <Icon size={16} className="text-white" />
        <span className="node-title">{data.name}</span>
      </div>
      <div className="node-content">
        <p className="node-description">{data.description}</p>
      </div>
      
      {/* Output Handle - Right side */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#555',
          width: '12px',
          height: '12px',
          border: '2px solid #fff',
          borderRadius: '50%',
        }}
      />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

// Node Palette Component
const NodePalette = ({ onAddNode, nodeTypes: availableNodeTypes, loading }) => {
  const categories = {
    trigger: { name: 'Triggers', icon: Zap, color: '#10b981' },
    action: { name: 'Actions', icon: Settings, color: '#3b82f6' },
    condition: { name: 'Conditions', icon: GitBranch, color: '#f59e0b' },
    transform: { name: 'Transform', icon: Shuffle, color: '#8b5cf6' },
  };

  const groupedNodes = availableNodeTypes.reduce((acc, nodeType) => {
    if (!acc[nodeType.category]) {
      acc[nodeType.category] = [];
    }
    acc[nodeType.category].push(nodeType);
    return acc;
  }, {});

  if (loading) {
    return (
      <Card className="node-palette">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Nodes</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="animate-spin" size={16} />
            <span>Loading nodes...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="node-palette">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Nodes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          {Object.entries(categories).map(([category, categoryInfo]) => {
            const nodes = groupedNodes[category] || [];
            if (nodes.length === 0) return null;

            const CategoryIcon = categoryInfo.icon;
            
            return (
              <div key={category} className="mb-4">
                <div className="px-4 py-2 bg-gray-50 border-b">
                  <div className="flex items-center gap-2">
                    <CategoryIcon size={16} style={{ color: categoryInfo.color }} />
                    <span className="font-medium text-sm">{categoryInfo.name}</span>
                  </div>
                </div>
                <div className="p-2">
                  {nodes.map((nodeType) => (
                    <div
                      key={nodeType.id}
                      className="node-palette-item"
                      onClick={() => onAddNode(nodeType)}
                    >
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                          style={{ backgroundColor: nodeType.color }}
                        >
                          {nodeType.icon === 'play' && <Play size={14} />}
                          {nodeType.icon === 'webhook' && <Webhook size={14} />}
                          {nodeType.icon === 'clock' && <Clock size={14} />}
                          {nodeType.icon === 'mail' && <Mail size={14} />}
                          {nodeType.icon === 'globe' && <Globe size={14} />}
                          {nodeType.icon === 'file-text' && <FileText size={14} />}
                          {nodeType.icon === 'git-branch' && <GitBranch size={14} />}
                          {nodeType.icon === 'shuffle' && <Shuffle size={14} />}
                          {nodeType.icon === 'pause' && <PauseCircle size={14} />}
                          {nodeType.icon === 'bell' && <Bell size={14} />}
                          {!['play', 'webhook', 'clock', 'mail', 'globe', 'file-text', 'git-branch', 'shuffle', 'pause', 'bell'].includes(nodeType.icon) && <Settings size={14} />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{nodeType.name}</div>
                          <div className="text-xs text-gray-500 line-clamp-2">{nodeType.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// Properties Panel Component
const PropertiesPanel = ({ selectedNode, onUpdateNode, onDeleteNode }) => {
  const [nodeConfig, setNodeConfig] = useState({});

  useEffect(() => {
    if (selectedNode) {
      setNodeConfig(selectedNode.data.configuration || {});
    }
  }, [selectedNode]);

  const handleConfigChange = (key, value) => {
    const newConfig = { ...nodeConfig, [key]: value };
    setNodeConfig(newConfig);
    if (onUpdateNode) {
      onUpdateNode(selectedNode.id, { configuration: newConfig });
    }
  };

  if (!selectedNode) {
    return (
      <Card className="properties-panel">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">Select a node to view its properties</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="properties-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Properties</CardTitle>
        <Badge variant="secondary" className="w-fit">
          {selectedNode.data.node_type}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="node-name">Label</Label>
          <Input
            id="node-name"
            value={selectedNode.data.name}
            onChange={(e) => onUpdateNode(selectedNode.id, { name: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="node-description">Description</Label>
          <Textarea
            id="node-description"
            value={selectedNode.data.description || ''}
            onChange={(e) => onUpdateNode(selectedNode.id, { description: e.target.value })}
            className="mt-1"
            rows={3}
          />
        </div>

        <Separator />

        <div>
          <Label className="text-sm font-medium">Configuration</Label>
          <div className="mt-2 space-y-3">
            {/* Dynamic configuration fields based on node type */}
            {selectedNode.data.node_type === 'send_email' && (
              <>
                <div>
                  <Label htmlFor="email-to">To Email</Label>
                  <Input
                    id="email-to"
                    type="email"
                    value={nodeConfig.to || ''}
                    onChange={(e) => handleConfigChange('to', e.target.value)}
                    placeholder="recipient@example.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input
                    id="email-subject"
                    value={nodeConfig.subject || ''}
                    onChange={(e) => handleConfigChange('subject', e.target.value)}
                    placeholder="Email subject"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email-body">Body</Label>
                  <Textarea
                    id="email-body"
                    value={nodeConfig.body || ''}
                    onChange={(e) => handleConfigChange('body', e.target.value)}
                    placeholder="Email content..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </>
            )}

            {selectedNode.data.node_type === 'http_request' && (
              <>
                <div>
                  <Label htmlFor="http-method">Method</Label>
                  <select
                    id="http-method"
                    value={nodeConfig.method || 'GET'}
                    onChange={(e) => handleConfigChange('method', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="http-url">URL</Label>
                  <Input
                    id="http-url"
                    type="url"
                    value={nodeConfig.url || ''}
                    onChange={(e) => handleConfigChange('url', e.target.value)}
                    placeholder="https://api.example.com/endpoint"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="http-body">Request Body</Label>
                  <Textarea
                    id="http-body"
                    value={nodeConfig.body || ''}
                    onChange={(e) => handleConfigChange('body', e.target.value)}
                    placeholder="JSON request body..."
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </>
            )}

            {selectedNode.data.node_type === 'schedule_trigger' && (
              <>
                <div>
                  <Label htmlFor="cron-expression">Cron Expression</Label>
                  <Input
                    id="cron-expression"
                    value={nodeConfig.cron || '0 9 * * *'}
                    onChange={(e) => handleConfigChange('cron', e.target.value)}
                    placeholder="0 9 * * *"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Daily at 9:00 AM</p>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={nodeConfig.timezone || 'UTC'}
                    onChange={(e) => handleConfigChange('timezone', e.target.value)}
                    placeholder="UTC"
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {selectedNode.data.node_type === 'condition' && (
              <div>
                <Label htmlFor="condition-expression">Condition Expression</Label>
                <Textarea
                  id="condition-expression"
                  value={nodeConfig.condition || 'input.value > 10'}
                  onChange={(e) => handleConfigChange('condition', e.target.value)}
                  placeholder="input.value > 10"
                  className="mt-1"
                  rows={3}
                />
              </div>
            )}

            {selectedNode.data.node_type === 'delay' && (
              <div>
                <Label htmlFor="delay-duration">Duration (seconds)</Label>
                <Input
                  id="delay-duration"
                  type="number"
                  min="1"
                  value={nodeConfig.duration || 5}
                  onChange={(e) => handleConfigChange('duration', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </div>

        <Separator />

        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDeleteNode(selectedNode.id)}
          className="w-full"
        >
          Delete Node
        </Button>
      </CardContent>
    </Card>
  );
};

// Status indicator component
const StatusIndicator = ({ backendStatus, onRetry }) => {
  if (backendStatus.available) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle size={16} />
        <span className="text-sm">Connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-red-600">
      <AlertCircle size={16} />
      <span className="text-sm">Backend offline</span>
      <Button size="sm" variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
};

// Main App Component
function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [currentWorkflowId, setCurrentWorkflowId] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [availableNodeTypes, setAvailableNodeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState({ available: false });
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Check backend health and load node types
  const initializeApp = useCallback(async () => {
    setLoading(true);
    try {
      const healthCheck = await checkBackendHealth();
      setBackendStatus(healthCheck);
      
      if (healthCheck.available) {
        const nodeTypes = await nodeTypeAPI.getNodeTypes();
        setAvailableNodeTypes(nodeTypes);
      } else {
        // Fallback to hardcoded node types if backend is not available
        const fallbackNodeTypes = [
          {
            id: 'start_workflow',
            name: 'Start Workflow',
            description: 'Manually triggers workflow execution',
            category: 'trigger',
            icon: 'play',
            color: '#10b981'
          },
          {
            id: 'send_email',
            name: 'Send Email',
            description: 'Send an email message',
            category: 'action',
            icon: 'mail',
            color: '#ef4444'
          },
          {
            id: 'http_request',
            name: 'HTTP Request',
            description: 'Make an HTTP request to any URL',
            category: 'action',
            icon: 'globe',
            color: '#8b5cf6'
          }
        ];
        setAvailableNodeTypes(fallbackNodeTypes);
      }
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setBackendStatus({ available: false, error: handleAPIError(error) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onAddNode = useCallback((nodeType) => {
    const newNode = {
      id: `${nodeType.id}-${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: {
        name: nodeType.name,
        description: nodeType.description,
        node_type: nodeType.id,
        color: nodeType.color,
        configuration: {}
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  const onUpdateNode = useCallback((nodeId, updates) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    );
    
    // Update selected node if it's the one being updated
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(prev => ({
        ...prev,
        data: { ...prev.data, ...updates }
      }));
    }
  }, [setNodes, selectedNode]);

  const onDeleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const executeWorkflow = useCallback(async () => {
    if (!backendStatus.available) {
      alert('Backend is not available. Cannot execute workflow.');
      return;
    }

    setIsExecuting(true);
    try {
      if (currentWorkflowId) {
        const execution = await workflowAPI.executeWorkflow(currentWorkflowId);
        alert(`Workflow executed successfully! Execution ID: ${execution.id}`);
      } else {
        // Simulate execution for unsaved workflow
        setTimeout(() => {
          alert('Workflow executed successfully! (Simulated)');
          setIsExecuting(false);
        }, 2000);
        return;
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      alert(`Failed to execute workflow: ${errorInfo.message}`);
    } finally {
      setIsExecuting(false);
    }
  }, [currentWorkflowId, backendStatus.available]);

  const saveWorkflow = useCallback(async () => {
    if (!backendStatus.available) {
      alert('Backend is not available. Cannot save workflow.');
      return;
    }

    setIsSaving(true);
    try {
      const workflowData = {
        name: workflowName,
        description: 'Created with Nexus Prime',
        nodes: nodes.map(node => ({
          id: node.id,
          node_type: node.data.node_type,
          name: node.data.name,
          description: node.data.description,
          position_x: node.position.x,
          position_y: node.position.y,
          configuration: node.data.configuration
        })),
        connections: edges.map(edge => ({
          id: edge.id,
          source_node_id: edge.source,
          target_node_id: edge.target,
          source_handle: edge.sourceHandle || 'output',
          target_handle: edge.targetHandle || 'input'
        }))
      };

      if (currentWorkflowId) {
        // Update existing workflow
        await workflowAPI.saveWorkflow(currentWorkflowId, workflowData);
        alert('Workflow updated successfully!');
      } else {
        // Create new workflow
        const newWorkflow = await workflowAPI.createWorkflow(workflowData);
        setCurrentWorkflowId(newWorkflow.id);
        alert('Workflow saved successfully!');
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      alert(`Failed to save workflow: ${errorInfo.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [workflowName, nodes, edges, currentWorkflowId, backendStatus.available]);

  const loadWorkflow = useCallback(async () => {
    if (!backendStatus.available) {
      alert('Backend is not available. Cannot load workflows.');
      return;
    }

    try {
      const workflows = await workflowAPI.getWorkflows();
      if (workflows.length > 0) {
        const workflow = workflows[0]; // Load first workflow for demo
        setWorkflowName(workflow.name);
        setCurrentWorkflowId(workflow.id);
        
        // Convert backend nodes to React Flow format
        const flowNodes = workflow.nodes.map(node => ({
          id: node.id,
          type: 'custom',
          position: { x: node.position_x, y: node.position_y },
          data: {
            name: node.name,
            description: node.description,
            node_type: node.node_type,
            color: availableNodeTypes.find(nt => nt.id === node.node_type)?.color || '#6b7280',
            configuration: node.configuration
          }
        }));

        // Convert backend connections to React Flow format
        const flowEdges = workflow.connections.map(conn => ({
          id: conn.id,
          source: conn.source_node_id,
          target: conn.target_node_id,
          sourceHandle: conn.source_handle,
          targetHandle: conn.target_handle
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
        alert('Workflow loaded successfully!');
      } else {
        alert('No workflows found.');
      }
    } catch (error) {
      const errorInfo = handleAPIError(error);
      alert(`Failed to load workflow: ${errorInfo.message}`);
    }
  }, [backendStatus.available, availableNodeTypes, setNodes, setEdges]);

  const onSelectTemplate = useCallback((template) => {
    // Clear existing workflow
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setWorkflowName(template.name);
    setCurrentWorkflowId(null);

    // Create nodes from template
    const templateNodes = template.nodes.map((nodeTemplate, index) => {
      const nodeType = availableNodeTypes.find(nt => nt.id === nodeTemplate.type);
      return {
        id: `${nodeTemplate.type}-${Date.now()}-${index}`,
        type: 'custom',
        position: { 
          x: 100 + (index % 3) * 250, 
          y: 100 + Math.floor(index / 3) * 150 
        },
        data: {
          name: nodeTemplate.name,
          description: nodeType?.description || nodeTemplate.name,
          node_type: nodeTemplate.type,
          color: nodeType?.color || '#6b7280',
          configuration: {}
        },
      };
    });

    // Create connections between nodes (simple linear flow for demo)
    const templateEdges = [];
    for (let i = 0; i < templateNodes.length - 1; i++) {
      templateEdges.push({
        id: `edge-${i}`,
        source: templateNodes[i].id,
        target: templateNodes[i + 1].id,
        type: 'default'
      });
    }

    setNodes(templateNodes);
    setEdges(templateEdges);
    setShowTemplates(false);
    
    alert(`Template "${template.name}" loaded successfully!`);
  }, [availableNodeTypes, setNodes, setEdges]);

  return (
    <div className="app">
      <ReactFlowProvider>
        {/* Header */}
        <header className="app-header">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white" size={18} />
              </div>
              <h1 className="text-xl font-bold">Nexus Prime</h1>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="max-w-xs"
              placeholder="Workflow name"
            />
            <StatusIndicator backendStatus={backendStatus} onRetry={initializeApp} />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowTemplates(true)}
              variant="outline"
            >
              <Template size={16} className="mr-2" />
              Templates
            </Button>
            <Button
              onClick={loadWorkflow}
              variant="outline"
              disabled={!backendStatus.available}
            >
              <FolderOpen size={16} className="mr-2" />
              Load
            </Button>
            <Button
              onClick={() => setShowHistory(true)}
              variant="outline"
            >
              <History size={16} className="mr-2" />
              History
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              onClick={executeWorkflow}
              disabled={isExecuting || nodes.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isExecuting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play size={16} className="mr-2" />
                  Execute
                </>
              )}
            </Button>
            <Button 
              onClick={saveWorkflow} 
              variant="outline"
              disabled={isSaving || !backendStatus.available}
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="app-content">
          {/* Node Palette */}
          <aside className="sidebar">
            <NodePalette 
              onAddNode={onAddNode} 
              nodeTypes={availableNodeTypes} 
              loading={loading}
            />
          </aside>

          {/* Canvas */}
          <main className="canvas-container" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              fitView
              className="workflow-canvas"
            >
              <Controls />
              <MiniMap />
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
              
              {nodes.length === 0 && (
                <Panel position="center">
                  <div className="empty-state">
                    <Plus size={48} className="text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Start Building Your Workflow
                    </h3>
                    <p className="text-gray-500 text-center max-w-sm">
                      Drag nodes from the sidebar to create your automation workflow.
                      Connect them together to define the flow of your process.
                    </p>
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </main>

          {/* Properties Panel */}
          <aside className="properties-sidebar">
            <PropertiesPanel
              selectedNode={selectedNode}
              onUpdateNode={onUpdateNode}
              onDeleteNode={onDeleteNode}
            />
          </aside>
        </div>

        {/* Modal Components */}
        {showTemplates && (
          <WorkflowTemplates
            onSelectTemplate={onSelectTemplate}
            onClose={() => setShowTemplates(false)}
          />
        )}

        {showHistory && (
          <ExecutionHistory
            workflowId={currentWorkflowId}
            onClose={() => setShowHistory(false)}
          />
        )}
      </ReactFlowProvider>
    </div>
  );
}

export default App;

