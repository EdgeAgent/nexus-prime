import axios from 'axios';

// API base URL - in production this would come from environment variables
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Workflow API functions
export const workflowAPI = {
  // Get all workflows for a user
  getWorkflows: async (userId = 1) => {
    const response = await api.get(`/workflows?user_id=${userId}`);
    return response.data;
  },

  // Get a specific workflow
  getWorkflow: async (workflowId) => {
    const response = await api.get(`/workflows/${workflowId}`);
    return response.data;
  },

  // Create a new workflow
  createWorkflow: async (workflowData) => {
    const response = await api.post('/workflows', workflowData);
    return response.data;
  },

  // Update a workflow
  updateWorkflow: async (workflowId, workflowData) => {
    const response = await api.put(`/workflows/${workflowId}`, workflowData);
    return response.data;
  },

  // Delete a workflow
  deleteWorkflow: async (workflowId) => {
    await api.delete(`/workflows/${workflowId}`);
  },

  // Save entire workflow with nodes and connections
  saveWorkflow: async (workflowId, workflowData) => {
    const response = await api.post(`/workflows/${workflowId}/save`, workflowData);
    return response.data;
  },

  // Execute a workflow
  executeWorkflow: async (workflowId, triggerData = {}) => {
    const response = await api.post(`/workflows/${workflowId}/execute`, { trigger_data: triggerData });
    return response.data;
  },

  // Get workflow execution history
  getExecutions: async (workflowId) => {
    const response = await api.get(`/workflows/${workflowId}/executions`);
    return response.data;
  },

  // Get specific execution details
  getExecution: async (executionId) => {
    const response = await api.get(`/executions/${executionId}`);
    return response.data;
  },
};

// Node API functions
export const nodeAPI = {
  // Create a new node
  createNode: async (workflowId, nodeData) => {
    const response = await api.post(`/workflows/${workflowId}/nodes`, nodeData);
    return response.data;
  },

  // Update a node
  updateNode: async (nodeId, nodeData) => {
    const response = await api.put(`/nodes/${nodeId}`, nodeData);
    return response.data;
  },

  // Delete a node
  deleteNode: async (nodeId) => {
    await api.delete(`/nodes/${nodeId}`);
  },
};

// Connection API functions
export const connectionAPI = {
  // Create a new connection
  createConnection: async (workflowId, connectionData) => {
    const response = await api.post(`/workflows/${workflowId}/connections`, connectionData);
    return response.data;
  },

  // Delete a connection
  deleteConnection: async (connectionId) => {
    await api.delete(`/connections/${connectionId}`);
  },
};

// Node Types API functions
export const nodeTypeAPI = {
  // Get all available node types
  getNodeTypes: async () => {
    const response = await api.get('/node-types');
    return response.data;
  },

  // Create a new node type
  createNodeType: async (nodeTypeData) => {
    const response = await api.post('/node-types', nodeTypeData);
    return response.data;
  },
};

// Error handling utility
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error status
    console.error('API Error:', error.response.data);
    return {
      message: error.response.data.message || 'An error occurred',
      status: error.response.status,
    };
  } else if (error.request) {
    // Request was made but no response received
    console.error('Network Error:', error.request);
    return {
      message: 'Network error - please check your connection',
      status: 0,
    };
  } else {
    // Something else happened
    console.error('Error:', error.message);
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1,
    };
  }
};

// Utility function to check if backend is available
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/node-types');
    return { available: true, status: response.status };
  } catch (error) {
    return { available: false, error: handleAPIError(error) };
  }
};

export default api;

