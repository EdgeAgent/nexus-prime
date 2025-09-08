import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Play,
  Eye,
  RefreshCw,
  Calendar,
  Timer,
  Activity
} from 'lucide-react';
import { workflowAPI, handleAPIError } from '../services/api';

const ExecutionHistory = ({ workflowId, onClose }) => {
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExecution, setSelectedExecution] = useState(null);

  useEffect(() => {
    loadExecutions();
  }, [workflowId]);

  const loadExecutions = async () => {
    if (!workflowId) {
      // Mock data for demo when no workflow ID
      const mockExecutions = [
        {
          id: 'exec-1',
          status: 'completed',
          started_at: new Date(Date.now() - 3600000).toISOString(),
          completed_at: new Date(Date.now() - 3500000).toISOString(),
          trigger_data: { source: 'manual' },
          result_data: { message: 'Email sent successfully' },
          node_executions: [
            { node_id: 'start-1', status: 'completed', started_at: new Date(Date.now() - 3600000).toISOString() },
            { node_id: 'email-1', status: 'completed', started_at: new Date(Date.now() - 3580000).toISOString() }
          ]
        },
        {
          id: 'exec-2',
          status: 'failed',
          started_at: new Date(Date.now() - 7200000).toISOString(),
          completed_at: new Date(Date.now() - 7100000).toISOString(),
          trigger_data: { source: 'webhook' },
          error_message: 'Invalid email address',
          node_executions: [
            { node_id: 'start-1', status: 'completed', started_at: new Date(Date.now() - 7200000).toISOString() },
            { node_id: 'email-1', status: 'failed', started_at: new Date(Date.now() - 7180000).toISOString() }
          ]
        },
        {
          id: 'exec-3',
          status: 'running',
          started_at: new Date(Date.now() - 300000).toISOString(),
          trigger_data: { source: 'schedule' },
          node_executions: [
            { node_id: 'start-1', status: 'completed', started_at: new Date(Date.now() - 300000).toISOString() },
            { node_id: 'email-1', status: 'running', started_at: new Date(Date.now() - 280000).toISOString() }
          ]
        }
      ];
      setExecutions(mockExecutions);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const executionData = await workflowAPI.getExecutions(workflowId);
      setExecutions(executionData);
    } catch (error) {
      console.error('Failed to load executions:', handleAPIError(error));
      setExecutions([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'failed':
        return <XCircle className="text-red-600" size={16} />;
      case 'running':
        return <Loader2 className="text-blue-600 animate-spin" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      running: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={variants[status] || variants.pending}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const duration = Math.round((end - start) / 1000);
    
    if (duration < 60) return `${duration}s`;
    if (duration < 3600) return `${Math.round(duration / 60)}m`;
    return `${Math.round(duration / 3600)}h`;
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin" size={20} />
            <span>Loading execution history...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity size={24} className="text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold">Execution History</h2>
                <p className="text-gray-600 mt-1">View past workflow executions and their results</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={loadExecutions}>
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Executions List */}
          <div className="w-1/2 border-r">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold">Recent Executions</h3>
              <p className="text-sm text-gray-600">{executions.length} total executions</p>
            </div>
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {executions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No executions found</p>
                    <p className="text-sm">Run your workflow to see execution history</p>
                  </div>
                ) : (
                  executions.map((execution) => (
                    <Card 
                      key={execution.id}
                      className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedExecution?.id === execution.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedExecution(execution)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(execution.status)}
                            <span className="font-medium text-sm">
                              Execution {execution.id.slice(-8)}
                            </span>
                          </div>
                          {getStatusBadge(execution.status)}
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={12} />
                            <span>{formatTime(execution.started_at)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Timer size={12} />
                            <span>
                              Duration: {formatDuration(execution.started_at, execution.completed_at)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Play size={12} />
                            <span>
                              Trigger: {execution.trigger_data?.source || 'Unknown'}
                            </span>
                          </div>
                        </div>

                        {execution.error_message && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                            {execution.error_message}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Execution Details */}
          <div className="w-1/2">
            {selectedExecution ? (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(selectedExecution.status)}
                    <h3 className="font-semibold">
                      Execution {selectedExecution.id.slice(-8)}
                    </h3>
                    {getStatusBadge(selectedExecution.status)}
                  </div>
                  <p className="text-sm text-gray-600">
                    Started: {formatTime(selectedExecution.started_at)}
                  </p>
                  {selectedExecution.completed_at && (
                    <p className="text-sm text-gray-600">
                      Completed: {formatTime(selectedExecution.completed_at)}
                    </p>
                  )}
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {/* Trigger Data */}
                    <div>
                      <h4 className="font-medium mb-2">Trigger Data</h4>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(selectedExecution.trigger_data, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Node Executions */}
                    <div>
                      <h4 className="font-medium mb-2">Node Executions</h4>
                      <div className="space-y-2">
                        {selectedExecution.node_executions?.map((nodeExec, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(nodeExec.status)}
                              <span className="text-sm font-medium">
                                Node {nodeExec.node_id?.slice(-8) || index + 1}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">
                              {nodeExec.started_at && formatTime(nodeExec.started_at)}
                            </div>
                          </div>
                        )) || (
                          <p className="text-sm text-gray-500">No node execution details available</p>
                        )}
                      </div>
                    </div>

                    {/* Result Data */}
                    {selectedExecution.result_data && (
                      <div>
                        <h4 className="font-medium mb-2">Result Data</h4>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(selectedExecution.result_data, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Error Details */}
                    {selectedExecution.error_message && (
                      <div>
                        <h4 className="font-medium mb-2 text-red-700">Error Details</h4>
                        <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700">
                          {selectedExecution.error_message}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Eye size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select an execution to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionHistory;

