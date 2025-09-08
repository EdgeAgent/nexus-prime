import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mail, 
  Globe, 
  Clock, 
  Database, 
  FileText, 
  Zap,
  Users,
  ShoppingCart,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

const WorkflowTemplates = ({ onSelectTemplate, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates = [
    {
      id: 'email-notification',
      name: 'Email Notification System',
      description: 'Automatically send email notifications when specific events occur',
      category: 'communication',
      icon: Mail,
      color: '#ef4444',
      complexity: 'Simple',
      estimatedTime: '5 minutes',
      nodes: [
        { type: 'webhook_trigger', name: 'Event Trigger' },
        { type: 'condition', name: 'Check Priority' },
        { type: 'send_email', name: 'Send Notification' },
        { type: 'log_message', name: 'Log Activity' }
      ],
      useCase: 'Perfect for alerting teams about critical system events, new user registrations, or order confirmations.'
    },
    {
      id: 'data-sync',
      name: 'Data Synchronization',
      description: 'Sync data between different systems and databases',
      category: 'integration',
      icon: Database,
      color: '#3b82f6',
      complexity: 'Medium',
      estimatedTime: '15 minutes',
      nodes: [
        { type: 'schedule_trigger', name: 'Daily Schedule' },
        { type: 'http_request', name: 'Fetch Data' },
        { type: 'transform_data', name: 'Transform Format' },
        { type: 'http_request', name: 'Update Database' },
        { type: 'notify_admin', name: 'Report Status' }
      ],
      useCase: 'Ideal for keeping customer data, inventory, or analytics synchronized across multiple platforms.'
    },
    {
      id: 'customer-onboarding',
      name: 'Customer Onboarding Flow',
      description: 'Automated workflow for new customer registration and setup',
      category: 'business',
      icon: Users,
      color: '#10b981',
      complexity: 'Complex',
      estimatedTime: '30 minutes',
      nodes: [
        { type: 'webhook_trigger', name: 'New Registration' },
        { type: 'send_email', name: 'Welcome Email' },
        { type: 'delay', name: 'Wait 1 Hour' },
        { type: 'http_request', name: 'Create Account' },
        { type: 'send_email', name: 'Setup Instructions' },
        { type: 'delay', name: 'Wait 24 Hours' },
        { type: 'send_email', name: 'Follow-up Email' }
      ],
      useCase: 'Streamline customer onboarding with automated welcome sequences and account setup.'
    },
    {
      id: 'order-processing',
      name: 'E-commerce Order Processing',
      description: 'Complete order fulfillment workflow from payment to shipping',
      category: 'ecommerce',
      icon: ShoppingCart,
      color: '#f59e0b',
      complexity: 'Complex',
      estimatedTime: '45 minutes',
      nodes: [
        { type: 'webhook_trigger', name: 'Payment Received' },
        { type: 'http_request', name: 'Verify Payment' },
        { type: 'condition', name: 'Check Inventory' },
        { type: 'http_request', name: 'Reserve Items' },
        { type: 'send_email', name: 'Order Confirmation' },
        { type: 'http_request', name: 'Generate Shipping Label' },
        { type: 'send_email', name: 'Shipping Notification' }
      ],
      useCase: 'Automate the entire order fulfillment process from payment verification to shipping notifications.'
    },
    {
      id: 'monitoring-alerts',
      name: 'System Monitoring & Alerts',
      description: 'Monitor system health and send alerts for issues',
      category: 'monitoring',
      icon: AlertTriangle,
      color: '#ef4444',
      complexity: 'Medium',
      estimatedTime: '20 minutes',
      nodes: [
        { type: 'schedule_trigger', name: 'Every 5 Minutes' },
        { type: 'http_request', name: 'Health Check' },
        { type: 'condition', name: 'Check Status' },
        { type: 'notify_admin', name: 'Alert Admin' },
        { type: 'send_email', name: 'Incident Report' },
        { type: 'log_message', name: 'Log Incident' }
      ],
      useCase: 'Keep your systems running smoothly with automated health checks and instant alerts.'
    },
    {
      id: 'lead-scoring',
      name: 'Lead Scoring & Qualification',
      description: 'Automatically score and qualify sales leads',
      category: 'sales',
      icon: TrendingUp,
      color: '#8b5cf6',
      complexity: 'Medium',
      estimatedTime: '25 minutes',
      nodes: [
        { type: 'webhook_trigger', name: 'New Lead' },
        { type: 'http_request', name: 'Enrich Data' },
        { type: 'transform_data', name: 'Calculate Score' },
        { type: 'condition', name: 'Qualify Lead' },
        { type: 'http_request', name: 'Update CRM' },
        { type: 'notify_admin', name: 'Alert Sales Team' }
      ],
      useCase: 'Automatically score and route qualified leads to your sales team for faster conversion.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: Zap },
    { id: 'communication', name: 'Communication', icon: Mail },
    { id: 'integration', name: 'Integration', icon: Globe },
    { id: 'business', name: 'Business Process', icon: Users },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart },
    { id: 'monitoring', name: 'Monitoring', icon: AlertTriangle },
    { id: 'sales', name: 'Sales & Marketing', icon: TrendingUp }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory);

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Complex': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Workflow Templates</h2>
              <p className="text-gray-600 mt-1">Choose from pre-built templates to get started quickly</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Categories Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-sm">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 p-6">
            <ScrollArea className="h-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                              style={{ backgroundColor: template.color }}
                            >
                              <Icon size={20} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Badge className={getComplexityColor(template.complexity)}>
                            {template.complexity}
                          </Badge>
                          <Badge variant="outline">
                            <Clock size={12} className="mr-1" />
                            {template.estimatedTime}
                          </Badge>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Workflow Steps:</h4>
                          <div className="flex flex-wrap gap-1">
                            {template.nodes.map((node, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {node.name}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-1">Use Case:</h4>
                          <p className="text-xs text-gray-600">{template.useCase}</p>
                        </div>

                        <Button 
                          className="w-full"
                          onClick={() => onSelectTemplate(template)}
                        >
                          Use This Template
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowTemplates;

