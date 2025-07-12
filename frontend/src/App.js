import React from 'react';
import SmartMineDashboard from './SmartMineDashboard.jsx';
import './App.css';

const { Header, Content } = Layout;
const { TabPane } = Tabs;

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentData, setCurrentData] = useState({});
  const [historicalData, setHistoricalData] = useState([]);
  const [machineStatus, setMachineStatus] = useState('Unknown');
  const [faultProbability, setFaultProbability] = useState(0);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);

  useEffect(() => {
    // Initialize WebSocket connection
    const wsService = new WebSocketService('ws://localhost:8765');
    
    wsService.onConnect(() => {
      setIsConnected(true);
      message.success('Connected to Digital Twin Simulator');
    });

    wsService.onDisconnect(() => {
      setIsConnected(false);
      message.error('Disconnected from Digital Twin Simulator');
    });

    wsService.onMessage((data) => {
      setCurrentData(data);
      
      // Update historical data (keep last 1000 points)
      setHistoricalData(prev => {
        const newData = [...prev, { ...data, timestamp: new Date(data.timestamp) }];
        return newData.slice(-1000);
      });

      // Update machine status
      updateMachineStatus(data);
    });

    wsService.onError((error) => {
      console.error('WebSocket error:', error);
      message.error('Connection error occurred');
    });

    // Connect
    wsService.connect();

    // Cleanup on unmount
    return () => {
      wsService.disconnect();
    };
  }, []);

  const updateMachineStatus = (data) => {
    const state = data.state || 'unknown';
    const faultProb = data.fault_probability || 0;
    const degradation = data.degradation_factor || 1;

    setFaultProbability(faultProb);

    if (state.startsWith('fault_')) {
      setMachineStatus('FAULT DETECTED');
    } else if (state === 'maintenance') {
      setMachineStatus('MAINTENANCE');
    } else if (faultProb > 0.7) {
      setMachineStatus('HIGH RISK');
    } else if (faultProb > 0.4 || degradation > 1.3) {
      setMachineStatus('MEDIUM RISK');
    } else {
      setMachineStatus('NORMAL');
    }
  };

  const getStatusType = () => {
    switch (machineStatus) {
      case 'FAULT DETECTED':
      case 'HIGH RISK':
        return 'error';
      case 'MEDIUM RISK':
      case 'MAINTENANCE':
        return 'warning';
      case 'NORMAL':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusIcon = () => {
    switch (machineStatus) {
      case 'FAULT DETECTED':
        return <ExclamationCircleOutlined />;
      case 'HIGH RISK':
        return <WarningOutlined />;
      case 'MEDIUM RISK':
        return <WarningOutlined />;
      case 'MAINTENANCE':
        return <ToolOutlined />;
      case 'NORMAL':
        return <CheckCircleOutlined />;
      default:
        return <DashboardOutlined />;
    }
  };

  const simulatorControls = {
    injectFault: () => {
      // This would typically send a command to the simulator
      message.info('Fault injection command sent to simulator');
    },
    performMaintenance: () => {
      message.info('Maintenance command sent to simulator');
    },
    toggleSimulation: () => {
      setIsSimulationRunning(!isSimulationRunning);
      message.info(`Simulation ${!isSimulationRunning ? 'resumed' : 'paused'}`);
    }
  };

  return (
    <Layout className="dashboard-layout">
      <Header className="dashboard-header">
        <Row justify="space-between" align="middle">
          <Col>
            <h1 className="main-header">
              🏭 Industrial Digital Twin Dashboard
            </h1>
          </Col>
          <Col>
            <Badge 
              status={isConnected ? 'success' : 'error'} 
              text={isConnected ? 'Connected' : 'Disconnected'}
              style={{ marginRight: 20 }}
            />
            <Button 
              type="primary" 
              icon={isSimulationRunning ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={simulatorControls.toggleSimulation}
              style={{ marginRight: 10 }}
            >
              {isSimulationRunning ? 'Pause' : 'Resume'}
            </Button>
            <Button 
              danger
              icon={<BugOutlined />}
              onClick={simulatorControls.injectFault}
              style={{ marginRight: 10 }}
            >
              Inject Fault
            </Button>
            <Button 
              type="default"
              icon={<ToolOutlined />}
              onClick={simulatorControls.performMaintenance}
            >
              Maintenance
            </Button>
          </Col>
        </Row>
      </Header>

      <Content className="dashboard-content">
        {/* Machine Status Alert */}
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col span={24}>
            <Alert
              message={
                <span>
                  {getStatusIcon()} Machine Status: {machineStatus}
                </span>
              }
              type={getStatusType()}
              showIcon
              style={{ fontSize: '16px', fontWeight: 'bold' }}
            />
          </Col>
        </Row>

        {/* Key Metrics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12} md={6}>
            <Card className="metric-card">
              <Statistic
                title="Machine Health"
                value={currentData.Machine_Health_Index || 0}
                precision={1}
                suffix="%"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="metric-card">
              <Statistic
                title="Fault Probability"
                value={faultProbability * 100}
                precision={1}
                suffix="%"
                valueStyle={{ color: faultProbability > 0.5 ? '#cf1322' : '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="metric-card">
              <Statistic
                title="Production Rate"
                value={currentData.Production_Rate || 0}
                precision={1}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="metric-card">
              <Statistic
                title="Energy Efficiency"
                value={
                  currentData.Production_Rate && currentData.Energy_Consumption
                    ? currentData.Production_Rate / (currentData.Energy_Consumption + 1)
                    : 0
                }
                precision={2}
                valueStyle={{ color: '#fa541c' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Dashboard Tabs */}
        <Tabs defaultActiveKey="monitoring" size="large">
          <TabPane 
            tab={
              <span>
                <DashboardOutlined />
                Real-Time Monitoring
              </span>
            } 
            key="monitoring"
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <SensorGrid data={currentData} />
              </Col>
              <Col span={24}>
                <RealTimeCharts 
                  data={historicalData} 
                  currentData={currentData}
                  isConnected={isConnected}
                />
              </Col>
            </Row>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <WarningOutlined />
                Predictive Analysis
              </span>
            } 
            key="predictive"
          >
            <PredictiveAnalysis 
              currentData={currentData}
              historicalData={historicalData}
              faultProbability={faultProbability}
            />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <DashboardOutlined />
                3D Visualization
              </span>
            } 
            key="3d"
          >
            <Machine3D currentData={currentData} />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <ToolOutlined />
                Maintenance
              </span>
            } 
            key="maintenance"
          >
            <MaintenancePanel 
              currentData={currentData}
              machineStatus={machineStatus}
              onMaintenanceAction={simulatorControls.performMaintenance}
            />
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
}

export default App;
