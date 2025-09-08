#!/usr/bin/env python3
"""
Initialize default node types and sample data for Nexus Prime
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.user import db, User
from src.models.workflow import NodeType, Workflow
from src.main import app

def init_node_types():
    """Initialize default node types"""
    node_types = [
        {
            'id': 'start_workflow',
            'name': 'Start Workflow',
            'description': 'Manually triggers workflow execution',
            'category': 'trigger',
            'icon': 'play',
            'color': '#10b981',
            'schema': {
                'type': 'object',
                'properties': {
                    'label': {
                        'type': 'string',
                        'title': 'Label',
                        'default': 'Start Workflow'
                    }
                }
            }
        },
        {
            'id': 'webhook_trigger',
            'name': 'Webhook',
            'description': 'Triggers workflow when webhook is called',
            'category': 'trigger',
            'icon': 'webhook',
            'color': '#3b82f6',
            'schema': {
                'type': 'object',
                'properties': {
                    'method': {
                        'type': 'string',
                        'title': 'HTTP Method',
                        'enum': ['GET', 'POST', 'PUT', 'DELETE'],
                        'default': 'POST'
                    },
                    'path': {
                        'type': 'string',
                        'title': 'Webhook Path',
                        'default': '/webhook'
                    }
                }
            }
        },
        {
            'id': 'schedule_trigger',
            'name': 'Schedule',
            'description': 'Triggers workflow on a schedule',
            'category': 'trigger',
            'icon': 'clock',
            'color': '#f59e0b',
            'schema': {
                'type': 'object',
                'properties': {
                    'cron': {
                        'type': 'string',
                        'title': 'Cron Expression',
                        'default': '0 9 * * *'
                    },
                    'timezone': {
                        'type': 'string',
                        'title': 'Timezone',
                        'default': 'UTC'
                    }
                }
            }
        },
        {
            'id': 'send_email',
            'name': 'Send Email',
            'description': 'Send an email message',
            'category': 'action',
            'icon': 'mail',
            'color': '#ef4444',
            'schema': {
                'type': 'object',
                'properties': {
                    'to': {
                        'type': 'string',
                        'title': 'To Email',
                        'format': 'email'
                    },
                    'subject': {
                        'type': 'string',
                        'title': 'Subject'
                    },
                    'body': {
                        'type': 'string',
                        'title': 'Email Body',
                        'format': 'textarea'
                    }
                },
                'required': ['to', 'subject', 'body']
            }
        },
        {
            'id': 'http_request',
            'name': 'HTTP Request',
            'description': 'Make an HTTP request to any URL',
            'category': 'action',
            'icon': 'globe',
            'color': '#8b5cf6',
            'schema': {
                'type': 'object',
                'properties': {
                    'method': {
                        'type': 'string',
                        'title': 'HTTP Method',
                        'enum': ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                        'default': 'GET'
                    },
                    'url': {
                        'type': 'string',
                        'title': 'URL',
                        'format': 'uri'
                    },
                    'headers': {
                        'type': 'object',
                        'title': 'Headers',
                        'additionalProperties': {'type': 'string'}
                    },
                    'body': {
                        'type': 'string',
                        'title': 'Request Body'
                    }
                },
                'required': ['url']
            }
        },
        {
            'id': 'log_message',
            'name': 'Log Message',
            'description': 'Log a message for debugging',
            'category': 'action',
            'icon': 'file-text',
            'color': '#6b7280',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string',
                        'title': 'Message',
                        'format': 'textarea'
                    },
                    'level': {
                        'type': 'string',
                        'title': 'Log Level',
                        'enum': ['info', 'warning', 'error'],
                        'default': 'info'
                    }
                },
                'required': ['message']
            }
        },
        {
            'id': 'condition',
            'name': 'Condition',
            'description': 'Route workflow based on conditions',
            'category': 'condition',
            'icon': 'git-branch',
            'color': '#f97316',
            'schema': {
                'type': 'object',
                'properties': {
                    'condition': {
                        'type': 'string',
                        'title': 'Condition Expression',
                        'default': 'input.value > 10'
                    }
                },
                'required': ['condition']
            }
        },
        {
            'id': 'transform_data',
            'name': 'Transform Data',
            'description': 'Transform and manipulate data',
            'category': 'transform',
            'icon': 'shuffle',
            'color': '#06b6d4',
            'schema': {
                'type': 'object',
                'properties': {
                    'transformation': {
                        'type': 'string',
                        'title': 'Transformation Script',
                        'format': 'textarea',
                        'default': 'return { ...input, processed: true }'
                    }
                },
                'required': ['transformation']
            }
        },
        {
            'id': 'delay',
            'name': 'Delay',
            'description': 'Add a delay before continuing',
            'category': 'action',
            'icon': 'pause',
            'color': '#84cc16',
            'schema': {
                'type': 'object',
                'properties': {
                    'duration': {
                        'type': 'number',
                        'title': 'Duration (seconds)',
                        'minimum': 1,
                        'default': 5
                    }
                },
                'required': ['duration']
            }
        },
        {
            'id': 'notify_admin',
            'name': 'Notify Admin',
            'description': 'Send notification to admin',
            'category': 'action',
            'icon': 'bell',
            'color': '#ec4899',
            'schema': {
                'type': 'object',
                'properties': {
                    'message': {
                        'type': 'string',
                        'title': 'Notification Message',
                        'format': 'textarea'
                    },
                    'priority': {
                        'type': 'string',
                        'title': 'Priority',
                        'enum': ['low', 'medium', 'high', 'urgent'],
                        'default': 'medium'
                    }
                },
                'required': ['message']
            }
        }
    ]
    
    for node_type_data in node_types:
        existing = NodeType.query.get(node_type_data['id'])
        if not existing:
            node_type = NodeType(
                id=node_type_data['id'],
                name=node_type_data['name'],
                description=node_type_data['description'],
                category=node_type_data['category'],
                icon=node_type_data['icon'],
                color=node_type_data['color']
            )
            node_type.set_schema(node_type_data['schema'])
            db.session.add(node_type)
    
    db.session.commit()
    print(f"Initialized {len(node_types)} node types")

def init_sample_user():
    """Create a sample user"""
    existing_user = User.query.filter_by(username='admin').first()
    if not existing_user:
        user = User(
            username='admin',
            email='admin@nexusprime.com'
        )
        db.session.add(user)
        db.session.commit()
        print("Created sample admin user")
    else:
        print("Sample user already exists")

def main():
    """Initialize all default data"""
    with app.app_context():
        print("Initializing Nexus Prime default data...")
        init_sample_user()
        init_node_types()
        print("Initialization complete!")

if __name__ == '__main__':
    main()

