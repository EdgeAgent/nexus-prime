from src.models.user import db
from datetime import datetime
import json

class Workflow(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    nodes = db.relationship('Node', backref='workflow', lazy=True, cascade='all, delete-orphan')
    connections = db.relationship('Connection', backref='workflow', lazy=True, cascade='all, delete-orphan')
    executions = db.relationship('Execution', backref='workflow', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'user_id': self.user_id,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'nodes': [node.to_dict() for node in self.nodes],
            'connections': [conn.to_dict() for conn in self.connections]
        }

class Node(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    workflow_id = db.Column(db.String(36), db.ForeignKey('workflow.id'), nullable=False)
    node_type = db.Column(db.String(100), nullable=False)  # trigger, action, condition, transform
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    position_x = db.Column(db.Float, default=0)
    position_y = db.Column(db.Float, default=0)
    configuration = db.Column(db.Text)  # JSON string for node-specific config
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def get_configuration(self):
        if self.configuration:
            return json.loads(self.configuration)
        return {}
    
    def set_configuration(self, config):
        self.configuration = json.dumps(config)

    def to_dict(self):
        return {
            'id': self.id,
            'workflow_id': self.workflow_id,
            'node_type': self.node_type,
            'name': self.name,
            'description': self.description,
            'position_x': self.position_x,
            'position_y': self.position_y,
            'configuration': self.get_configuration(),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Connection(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    workflow_id = db.Column(db.String(36), db.ForeignKey('workflow.id'), nullable=False)
    source_node_id = db.Column(db.String(36), db.ForeignKey('node.id'), nullable=False)
    target_node_id = db.Column(db.String(36), db.ForeignKey('node.id'), nullable=False)
    source_handle = db.Column(db.String(100), default='output')
    target_handle = db.Column(db.String(100), default='input')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    source_node = db.relationship('Node', foreign_keys=[source_node_id], backref='outgoing_connections')
    target_node = db.relationship('Node', foreign_keys=[target_node_id], backref='incoming_connections')

    def to_dict(self):
        return {
            'id': self.id,
            'workflow_id': self.workflow_id,
            'source_node_id': self.source_node_id,
            'target_node_id': self.target_node_id,
            'source_handle': self.source_handle,
            'target_handle': self.target_handle,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Execution(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    workflow_id = db.Column(db.String(36), db.ForeignKey('workflow.id'), nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, running, completed, failed
    trigger_data = db.Column(db.Text)  # JSON string for trigger data
    result_data = db.Column(db.Text)  # JSON string for execution results
    error_message = db.Column(db.Text)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    # Relationships
    node_executions = db.relationship('NodeExecution', backref='execution', lazy=True, cascade='all, delete-orphan')

    def get_trigger_data(self):
        if self.trigger_data:
            return json.loads(self.trigger_data)
        return {}
    
    def set_trigger_data(self, data):
        self.trigger_data = json.dumps(data)
        
    def get_result_data(self):
        if self.result_data:
            return json.loads(self.result_data)
        return {}
    
    def set_result_data(self, data):
        self.result_data = json.dumps(data)

    def to_dict(self):
        return {
            'id': self.id,
            'workflow_id': self.workflow_id,
            'status': self.status,
            'trigger_data': self.get_trigger_data(),
            'result_data': self.get_result_data(),
            'error_message': self.error_message,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'node_executions': [ne.to_dict() for ne in self.node_executions]
        }

class NodeExecution(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    execution_id = db.Column(db.String(36), db.ForeignKey('execution.id'), nullable=False)
    node_id = db.Column(db.String(36), db.ForeignKey('node.id'), nullable=False)
    status = db.Column(db.String(50), default='pending')  # pending, running, completed, failed, skipped
    input_data = db.Column(db.Text)  # JSON string for input data
    output_data = db.Column(db.Text)  # JSON string for output data
    error_message = db.Column(db.Text)
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    # Relationships
    node = db.relationship('Node', backref='executions')

    def get_input_data(self):
        if self.input_data:
            return json.loads(self.input_data)
        return {}
    
    def set_input_data(self, data):
        self.input_data = json.dumps(data)
        
    def get_output_data(self):
        if self.output_data:
            return json.loads(self.output_data)
        return {}
    
    def set_output_data(self, data):
        self.output_data = json.dumps(data)

    def to_dict(self):
        return {
            'id': self.id,
            'execution_id': self.execution_id,
            'node_id': self.node_id,
            'status': self.status,
            'input_data': self.get_input_data(),
            'output_data': self.get_output_data(),
            'error_message': self.error_message,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class NodeType(db.Model):
    id = db.Column(db.String(100), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100), nullable=False)  # trigger, action, condition, transform
    icon = db.Column(db.String(100))
    color = db.Column(db.String(7))  # hex color
    schema = db.Column(db.Text)  # JSON schema for configuration
    is_active = db.Column(db.Boolean, default=True)
    
    def get_schema(self):
        if self.schema:
            return json.loads(self.schema)
        return {}
    
    def set_schema(self, schema_data):
        self.schema = json.dumps(schema_data)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'icon': self.icon,
            'color': self.color,
            'schema': self.get_schema(),
            'is_active': self.is_active
        }

