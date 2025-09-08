from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.workflow import Workflow, Node, Connection, Execution, NodeExecution, NodeType
import uuid
from datetime import datetime

workflow_bp = Blueprint('workflow', __name__)

# Workflow CRUD operations
@workflow_bp.route('/workflows', methods=['GET'])
def get_workflows():
    """Get all workflows for a user"""
    user_id = request.args.get('user_id', 1)  # Default to user 1 for MVP
    workflows = Workflow.query.filter_by(user_id=user_id).all()
    return jsonify([workflow.to_dict() for workflow in workflows])

@workflow_bp.route('/workflows', methods=['POST'])
def create_workflow():
    """Create a new workflow"""
    data = request.get_json()
    
    workflow = Workflow(
        id=str(uuid.uuid4()),
        name=data.get('name', 'Untitled Workflow'),
        description=data.get('description', ''),
        user_id=data.get('user_id', 1)
    )
    
    db.session.add(workflow)
    db.session.commit()
    
    return jsonify(workflow.to_dict()), 201

@workflow_bp.route('/workflows/<workflow_id>', methods=['GET'])
def get_workflow(workflow_id):
    """Get a specific workflow with all nodes and connections"""
    workflow = Workflow.query.get_or_404(workflow_id)
    return jsonify(workflow.to_dict())

@workflow_bp.route('/workflows/<workflow_id>', methods=['PUT'])
def update_workflow(workflow_id):
    """Update a workflow"""
    workflow = Workflow.query.get_or_404(workflow_id)
    data = request.get_json()
    
    workflow.name = data.get('name', workflow.name)
    workflow.description = data.get('description', workflow.description)
    workflow.is_active = data.get('is_active', workflow.is_active)
    workflow.updated_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify(workflow.to_dict())

@workflow_bp.route('/workflows/<workflow_id>', methods=['DELETE'])
def delete_workflow(workflow_id):
    """Delete a workflow"""
    workflow = Workflow.query.get_or_404(workflow_id)
    db.session.delete(workflow)
    db.session.commit()
    return '', 204

# Node operations
@workflow_bp.route('/workflows/<workflow_id>/nodes', methods=['POST'])
def create_node(workflow_id):
    """Create a new node in a workflow"""
    data = request.get_json()
    
    node = Node(
        id=str(uuid.uuid4()),
        workflow_id=workflow_id,
        node_type=data.get('node_type', 'action'),
        name=data.get('name', 'Untitled Node'),
        description=data.get('description', ''),
        position_x=data.get('position_x', 0),
        position_y=data.get('position_y', 0)
    )
    
    if 'configuration' in data:
        node.set_configuration(data['configuration'])
    
    db.session.add(node)
    db.session.commit()
    
    return jsonify(node.to_dict()), 201

@workflow_bp.route('/nodes/<node_id>', methods=['PUT'])
def update_node(node_id):
    """Update a node"""
    node = Node.query.get_or_404(node_id)
    data = request.get_json()
    
    node.name = data.get('name', node.name)
    node.description = data.get('description', node.description)
    node.position_x = data.get('position_x', node.position_x)
    node.position_y = data.get('position_y', node.position_y)
    
    if 'configuration' in data:
        node.set_configuration(data['configuration'])
    
    db.session.commit()
    return jsonify(node.to_dict())

@workflow_bp.route('/nodes/<node_id>', methods=['DELETE'])
def delete_node(node_id):
    """Delete a node"""
    node = Node.query.get_or_404(node_id)
    db.session.delete(node)
    db.session.commit()
    return '', 204

# Connection operations
@workflow_bp.route('/workflows/<workflow_id>/connections', methods=['POST'])
def create_connection(workflow_id):
    """Create a connection between nodes"""
    data = request.get_json()
    
    connection = Connection(
        id=str(uuid.uuid4()),
        workflow_id=workflow_id,
        source_node_id=data['source_node_id'],
        target_node_id=data['target_node_id'],
        source_handle=data.get('source_handle', 'output'),
        target_handle=data.get('target_handle', 'input')
    )
    
    db.session.add(connection)
    db.session.commit()
    
    return jsonify(connection.to_dict()), 201

@workflow_bp.route('/connections/<connection_id>', methods=['DELETE'])
def delete_connection(connection_id):
    """Delete a connection"""
    connection = Connection.query.get_or_404(connection_id)
    db.session.delete(connection)
    db.session.commit()
    return '', 204

# Execution operations
@workflow_bp.route('/workflows/<workflow_id>/execute', methods=['POST'])
def execute_workflow(workflow_id):
    """Execute a workflow"""
    data = request.get_json()
    
    execution = Execution(
        id=str(uuid.uuid4()),
        workflow_id=workflow_id,
        status='running'
    )
    
    if 'trigger_data' in data:
        execution.set_trigger_data(data['trigger_data'])
    
    db.session.add(execution)
    db.session.commit()
    
    # TODO: Implement actual workflow execution logic
    # For now, just mark as completed
    execution.status = 'completed'
    execution.completed_at = datetime.utcnow()
    execution.set_result_data({'message': 'Workflow executed successfully'})
    
    db.session.commit()
    
    return jsonify(execution.to_dict()), 201

@workflow_bp.route('/workflows/<workflow_id>/executions', methods=['GET'])
def get_executions(workflow_id):
    """Get execution history for a workflow"""
    executions = Execution.query.filter_by(workflow_id=workflow_id).order_by(Execution.started_at.desc()).all()
    return jsonify([execution.to_dict() for execution in executions])

@workflow_bp.route('/executions/<execution_id>', methods=['GET'])
def get_execution(execution_id):
    """Get details of a specific execution"""
    execution = Execution.query.get_or_404(execution_id)
    return jsonify(execution.to_dict())

# Node types
@workflow_bp.route('/node-types', methods=['GET'])
def get_node_types():
    """Get all available node types"""
    node_types = NodeType.query.filter_by(is_active=True).all()
    return jsonify([node_type.to_dict() for node_type in node_types])

@workflow_bp.route('/node-types', methods=['POST'])
def create_node_type():
    """Create a new node type"""
    data = request.get_json()
    
    node_type = NodeType(
        id=data['id'],
        name=data['name'],
        description=data.get('description', ''),
        category=data['category'],
        icon=data.get('icon', 'box'),
        color=data.get('color', '#3b82f6')
    )
    
    if 'schema' in data:
        node_type.set_schema(data['schema'])
    
    db.session.add(node_type)
    db.session.commit()
    
    return jsonify(node_type.to_dict()), 201

# Bulk operations for saving entire workflow
@workflow_bp.route('/workflows/<workflow_id>/save', methods=['POST'])
def save_workflow(workflow_id):
    """Save entire workflow with nodes and connections"""
    data = request.get_json()
    
    workflow = Workflow.query.get_or_404(workflow_id)
    
    # Update workflow properties
    if 'name' in data:
        workflow.name = data['name']
    if 'description' in data:
        workflow.description = data['description']
    
    # Update nodes
    if 'nodes' in data:
        # Delete existing nodes not in the new data
        existing_node_ids = {node.id for node in workflow.nodes}
        new_node_ids = {node['id'] for node in data['nodes']}
        nodes_to_delete = existing_node_ids - new_node_ids
        
        for node_id in nodes_to_delete:
            node = Node.query.get(node_id)
            if node:
                db.session.delete(node)
        
        # Update or create nodes
        for node_data in data['nodes']:
            node = Node.query.get(node_data['id'])
            if node:
                # Update existing node
                node.name = node_data.get('name', node.name)
                node.node_type = node_data.get('node_type', node.node_type)
                node.position_x = node_data.get('position_x', node.position_x)
                node.position_y = node_data.get('position_y', node.position_y)
                if 'configuration' in node_data:
                    node.set_configuration(node_data['configuration'])
            else:
                # Create new node
                node = Node(
                    id=node_data['id'],
                    workflow_id=workflow_id,
                    node_type=node_data.get('node_type', 'action'),
                    name=node_data.get('name', 'Untitled Node'),
                    position_x=node_data.get('position_x', 0),
                    position_y=node_data.get('position_y', 0)
                )
                if 'configuration' in node_data:
                    node.set_configuration(node_data['configuration'])
                db.session.add(node)
    
    # Update connections
    if 'connections' in data:
        # Delete existing connections not in the new data
        existing_connection_ids = {conn.id for conn in workflow.connections}
        new_connection_ids = {conn['id'] for conn in data['connections']}
        connections_to_delete = existing_connection_ids - new_connection_ids
        
        for connection_id in connections_to_delete:
            connection = Connection.query.get(connection_id)
            if connection:
                db.session.delete(connection)
        
        # Create new connections
        for conn_data in data['connections']:
            if conn_data['id'] not in existing_connection_ids:
                connection = Connection(
                    id=conn_data['id'],
                    workflow_id=workflow_id,
                    source_node_id=conn_data['source_node_id'],
                    target_node_id=conn_data['target_node_id'],
                    source_handle=conn_data.get('source_handle', 'output'),
                    target_handle=conn_data.get('target_handle', 'input')
                )
                db.session.add(connection)
    
    workflow.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify(workflow.to_dict())

