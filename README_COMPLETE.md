# SmartMine Digital Twin Platform

A comprehensive digital twin solution for smart mining operations featuring real-time monitoring, predictive analytics, maintenance management, and AI-driven insights.

## 🌟 Features

### Core Digital Twin Capabilities
- **Real-time Equipment Monitoring** - Live tracking of trucks, crushers, and stockpiles
- **Interactive Mine Map** - 3D visualization of equipment locations and status
- **Predictive Analytics** - AI-powered forecasting and anomaly detection
- **Maintenance Management** - Comprehensive maintenance scheduling and tracking
- **Data Visualization** - Advanced charts and analytics dashboard

### Key Components

#### 1. Overview Dashboard
- Fleet management with truck status, fuel levels, and health scores
- Crusher operations monitoring with throughput and temperature
- Stockpile management with capacity and material tracking
- Real-time KPI display and alert system

#### 2. Mine Map View 🗺️
- Interactive 2D/3D mine site visualization
- Equipment positioning and movement tracking
- Status-based color coding for quick identification
- Equipment details popup with key metrics

#### 3. Real-Time Analytics 📊
- Production trend analysis with Chart.js integration
- Equipment efficiency monitoring
- Fuel consumption tracking
- Equipment status distribution

#### 4. AI Predictions 🔮
- Predictive maintenance recommendations
- Production forecasting with confidence intervals
- Anomaly detection and alerts
- Optimization suggestions

#### 5. Maintenance Panel 🔧
- Scheduled maintenance calendar
- Pending issues tracking
- Completed work history
- Parts inventory management

## 🚀 Technology Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **Tailwind CSS v3** - Utility-first CSS framework with custom mining theme
- **Chart.js & React-Chart.js-2** - Advanced data visualization
- **Vite 7** - Fast build tool and development server
- **WebSocket** - Real-time data streaming

### Backend
- **Python FastAPI** - High-performance API framework
- **WebSocket Support** - Real-time data streaming
- **RESTful API** - Standard HTTP endpoints for data access
- **Smart Mining Simulator** - Realistic equipment data generation

### Data & Analytics
- **Real-time Data Processing** - Live equipment telemetry
- **Predictive Modeling** - Machine learning for maintenance and production
- **Historical Data Analysis** - Trend analysis and reporting
- **AI Insights** - Automated recommendations and optimization

## 🏗️ Project Structure

```
SmartMine/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # UI components
│   │   │   ├── MineMapView.jsx         # Interactive mine map
│   │   │   ├── RealTimeCharts.jsx      # Chart.js visualizations
│   │   │   ├── PredictiveAnalysis.jsx  # AI predictions panel
│   │   │   └── MaintenancePanel.jsx    # Maintenance management
│   │   ├── services/         # API and WebSocket services
│   │   └── SmartMineDashboard.jsx      # Main dashboard
│   ├── public/               # Static assets
│   └── package.json          # Dependencies and scripts
├── backend/                  # Python API server
│   ├── api/                  # API endpoints
│   ├── models/               # ML models
│   ├── services/             # Business logic
│   └── main.py               # FastAPI application
└── data/                     # Sample data and datasets
```

## 🎯 Digital Twin Capabilities

### Real-Time Monitoring
- **Equipment Status**: Live tracking of all mining equipment
- **Performance Metrics**: Real-time KPIs and efficiency measurements
- **Environmental Data**: Temperature, pressure, and operational conditions
- **Safety Monitoring**: Alert systems for critical conditions

### Predictive Analytics
- **Maintenance Prediction**: AI-powered equipment failure prediction
- **Production Optimization**: Throughput and efficiency optimization
- **Resource Planning**: Material flow and logistics optimization
- **Cost Analysis**: Operational cost prediction and optimization

### 3D Visualization
- **Mine Site Model**: Interactive 3D representation of the mining site
- **Equipment Tracking**: Real-time equipment positioning
- **Material Flow**: Visual representation of material movement
- **Status Indicators**: Color-coded status for immediate understanding

### Maintenance Intelligence
- **Predictive Maintenance**: Schedule maintenance before failures occur
- **Work Order Management**: Complete maintenance workflow
- **Parts Inventory**: Smart inventory management with reorder points
- **Maintenance History**: Complete maintenance record keeping

## 🔧 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn** package manager

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Full System Launch
Use the provided batch files for easy startup:
```bash
# Windows
start_smartmine_system.bat

# Or individual components
start_backend.bat
start_dashboard.bat
```

## 📊 Dashboard Views

### 1. Overview Tab
Complete operational overview with:
- Active truck fleet monitoring
- Crusher operation status
- Stockpile capacity tracking
- Real-time alerts and KPIs

### 2. Mine Map Tab
Interactive site visualization featuring:
- Equipment positioning
- Status-based color coding
- Equipment details on click
- Site overview with terrain

### 3. Analytics Tab
Advanced data visualization with:
- Production trend charts
- Equipment efficiency metrics
- Fuel consumption analysis
- Equipment status distribution

### 4. AI Predictions Tab
Intelligent insights including:
- Maintenance predictions with confidence
- Production forecasts
- Anomaly detection alerts
- Optimization recommendations

### 5. Maintenance Tab
Complete maintenance management:
- Scheduled maintenance calendar
- Pending issues tracking
- Completed work history
- Parts inventory with reorder alerts

## 🎨 UI/UX Features

### Design System
- **Mining-themed Color Palette**: Earth tones and industrial colors
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility**: WCAG compliant with proper contrast ratios
- **Dark/Light Themes**: Automatic theme adaptation

### Interactive Elements
- **Hover Effects**: Smooth transitions and feedback
- **Click Interactions**: Detailed equipment information
- **Real-time Updates**: Live data refresh without page reload
- **Loading States**: Proper loading indicators and error handling

### Data Visualization
- **Chart.js Integration**: Professional charts and graphs
- **Real-time Charts**: Live updating visualizations
- **Interactive Legends**: Click to show/hide data series
- **Export Capabilities**: Save charts and data

## 🔌 API Integration

### WebSocket Endpoints
- **Real-time Data**: Live equipment telemetry
- **Status Updates**: Equipment state changes
- **Alert Notifications**: Critical alerts and warnings

### REST API Endpoints
- **Equipment Data**: GET /api/equipment
- **Historical Data**: GET /api/history
- **Maintenance**: GET/POST /api/maintenance
- **Analytics**: GET /api/analytics

## 🛡️ Security & Performance

### Security Features
- Input validation and sanitization
- CORS configuration for secure cross-origin requests
- Error handling and graceful degradation

### Performance Optimizations
- Component memoization for efficient rendering
- Lazy loading for large datasets
- Optimized WebSocket connections
- Efficient chart rendering with animation controls

## 📈 Future Enhancements

### Planned Features
- **3D Mine Visualization**: Full 3D mine model with WebGL
- **Mobile Application**: React Native mobile companion
- **Advanced ML Models**: Enhanced predictive analytics
- **IoT Integration**: Direct sensor data integration
- **Reporting System**: Automated report generation
- **Multi-site Support**: Multiple mine site management

### Technology Roadmap
- Integration with industrial IoT platforms
- Advanced machine learning pipelines
- Real-time video streaming from equipment
- Augmented reality maintenance guidance
- Blockchain for supply chain tracking

## 🤝 Contributing

This is a complete digital twin demonstration project showcasing modern web technologies for industrial applications. The codebase demonstrates best practices for:

- React component architecture
- Real-time data handling
- Industrial UI/UX design
- Data visualization
- Predictive analytics integration

## 📄 License

This project is a demonstration of digital twin technology for educational and showcase purposes.

---

**SmartMine Digital Twin Platform** - Revolutionizing mining operations through intelligent automation and real-time insights.
