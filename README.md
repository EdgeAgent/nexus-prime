<div align="center">

# ⚡ Nexus Prime - Enterprise Automation Platform
### *Visual Workflow Builder & Enterprise Node Automation*

[![GitHub stars](https://img.shields.io/github/stars/EdgeAgent/nexus-prime?style=for-the-badge&logo=github&color=blue)](https://github.com/EdgeAgent/nexus-prime/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)]()

</div>

---

# Nexus Prime - Enterprise Automation Platform

![Nexus Prime Logo](https://img.shields.io/badge/Nexus-Prime-blue?style=for-the-badge&logo=lightning)

A powerful, enterprise-grade automation platform designed to streamline workflows and connect applications with an intuitive visual workflow builder.

## 🚀 Live Demo

**Frontend:** [https://xlhyimcdyo9p.manus.space](https://xlhyimcdyo9p.manus.space)
**Backend API:** [https://xlhyimcdyo9p.manus.space](https://xlhyimcdyo9p.manus.space)

## ✨ Features

- **🎨 Visual Workflow Builder** - Modern drag-and-drop interface for creating automation workflows
- **🔧 Advanced Node System** - Rich set of nodes for triggers, actions, conditions, and data transformation
- **🏢 Enterprise Integrations** - Connect with email, HTTP APIs, databases, and more
- **📋 Workflow Templates** - Pre-built templates for common automation scenarios
- **📊 Execution History** - Real-time monitoring and execution history
- **💎 Professional UI/UX** - Clean, modern, responsive design
- **🔗 Visible Connection Handles** - Easy-to-use connection dots for linking nodes

## 🏗️ Architecture

```
nexus-prime/
├── frontend/          # React.js frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── services/      # API integration services
│   │   └── App.jsx        # Main application component
│   └── dist/             # Production build
└── backend/           # Flask backend API
    ├── src/
    │   ├── models/        # Database models
    │   ├── routes/        # API endpoints
    │   └── main.py        # Flask application
    └── requirements.txt   # Python dependencies
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI framework
- **React Flow** - Visual workflow canvas
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - High-quality component library
- **Lucide Icons** - Beautiful icon set
- **Vite** - Fast build tool

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - Database ORM
- **Flask-CORS** - Cross-origin resource sharing
- **SQLite** - Lightweight database

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and pnpm
- Python 3.11+
- Git

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python src/init_data.py  # Initialize database
python src/main.py
```

The backend API will be available at `http://localhost:5000`

## 📖 Usage Guide

### Creating Your First Workflow

1. **Access the Platform** - Open the live demo or local development server
2. **Add Nodes** - Drag nodes from the left sidebar to the canvas
3. **Connect Nodes** - Click and drag from the right dot (output) of one node to the left dot (input) of another
4. **Configure Nodes** - Click on a node to open the properties panel and configure settings
5. **Save & Execute** - Use the Save and Execute buttons in the header

### Available Node Types

#### Triggers
- **Start Workflow** - Manual workflow execution
- **Webhook Trigger** - HTTP webhook endpoint
- **Schedule Trigger** - Time-based automation

#### Actions
- **Send Email** - Email notifications
- **HTTP Request** - API calls and integrations
- **Log Message** - Debug and monitoring

#### Logic
- **Condition** - Conditional branching
- **Transform Data** - Data manipulation
- **Delay** - Workflow pauses

## 🎯 Key Improvements Over N8N

- **Modern UI/UX** - Professional, responsive design with better visual hierarchy
- **Visible Connection Handles** - Clear, clickable dots for easy node connections
- **Advanced Templates** - Rich library of pre-built workflow templates
- **Real-time Monitoring** - Live execution status and comprehensive history
- **Enterprise-Ready** - Scalable architecture with professional deployment options

## 🔧 API Documentation

### Workflow Endpoints
- `GET /api/workflows` - List all workflows
- `POST /api/workflows` - Create new workflow
- `PUT /api/workflows/{id}` - Update workflow
- `DELETE /api/workflows/{id}` - Delete workflow
- `POST /api/workflows/{id}/execute` - Execute workflow

### Node Type Endpoints
- `GET /api/node-types` - List available node types
- `GET /api/node-types/{id}` - Get node type details

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
pnpm run build
# Deploy the dist/ folder to your static hosting service
```

### Backend Deployment
```bash
cd backend
# Configure your production environment
# Deploy using your preferred Python hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Flow team for the excellent workflow canvas library
- Shadcn/UI for the beautiful component system
- The open-source community for inspiration and tools

---

**Built with ❤️ for enterprise automation**

