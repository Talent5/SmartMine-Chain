import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Alert, 
  Tabs, 
  Badge, 
  Button, 
  message,
  Table,
  Tag,
  Progress,
  Typography,
  Space,
  Tooltip
} from 'antd';
import { 
  DashboardOutlined, 
  WarningOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ToolOutlined,
  TruckOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  RobotOutlined
} from '@ant-design/icons';
import TruckFleetMonitor from './components/TruckFleetMonitor';
import CrusherMonitor from './components/CrusherMonitor';
import StockpileMonitor from './components/StockpileMonitor';
import MineMapView from './components/MineMapView';
import AIInsights from './components/AIInsights';
import SmartMineWebSocketService from './services/SmartMineWebSocketService';
import SmartMineAPIService from './services/SmartMineAPIService';
import './SmartMineApp.css';

const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

function SmartMineApp() {
  const [isConnected, setIsConnected] = useState(false);
  const [miningData, setMiningData] = useState({});
  const [trucks, setTrucks] = useState({});
  const [crushers, setCrushers] = useState({});
  const [stockpiles, setStockpiles] = useState({});
  const [kpis, setKpis] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [apiStatus, setApiStatus] = useState({ connected: false });
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Test API connection first
    SmartMineAPIService.testConnection().then((result) => {
      setApiStatus(result);
      if (result.connected) {
        console.log('✅ API connection established');
      } else {
        console.log('❌ API connection failed:', result.error);
      }
    });

    // Initialize WebSocket connection to SmartMine simulator
    const wsService = new SmartMineWebSocketService('ws://localhost:8765');
    
    wsService.onConnect(() => {
      setIsConnected(true);
      message.success('Connected to SmartMine Digital Twin - 5s data streaming active');
      console.log('🚀 SmartMine Dashboard connected - receiving data every 5 seconds');
    });

    wsService.onDisconnect(() => {
      setIsConnected(false);
      message.error('Disconnected from SmartMine Digital Twin');
      console.log('❌ SmartMine Dashboard disconnected');
    });

    wsService.onMessage((data) => {
      console.log('📊 Received mining data update:', new Date().toLocaleTimeString());
      setLastUpdate(new Date());
      setMiningData(data);
      setTrucks(data.trucks || {});
      setCrushers(data.crushers || {});
      setStockpiles(data.stockpiles || {});
      setKpis(data.kpis || {});
      setAlerts(data.alerts || []);
      setAiRecommendations(data.ai_recommendations || []);
    });

    wsService.onError((error) => {
      console.error('SmartMine WebSocket error:', error);
      message.error('Connection error occurred');
    });

    // Connect
    wsService.connect();

    // Cleanup on unmount
    return () => {
      wsService.disconnect();
    };
  }, []);

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'urgent':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      default:
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    }
  };

  const getAlertType = (severity) => {
    switch (severity) {
      case 'urgent':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  const alertColumns = [
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity) => (
        <Tag color={severity === 'urgent' ? 'red' : severity === 'warning' ? 'orange' : 'blue'}>
          {severity.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Equipment',
      dataIndex: 'equipment',
      key: 'equipment',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => new Date(timestamp).toLocaleTimeString(),
    },
  ];

  return (
    <Layout className="smartmine-layout">
      <Header className="smartmine-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              ⛏️ SmartMine Chain Digital Twin
            </Title>
          </Col>
          <Col>
            <Space direction="vertical" size="small" align="end">
              <Space>
                <Badge 
                  status={isConnected ? 'success' : 'error'} 
                  text={isConnected ? 'Connected (5s refresh)' : 'Disconnected'}
                  style={{ color: 'white' }}
                />
                <Text style={{ color: 'white' }}>
                  {miningData.shift_info?.current_shift || 'Day'} Shift
                </Text>
              </Space>
              {lastUpdate && (
                <Text style={{ color: '#bfbfbf', fontSize: '12px' }}>
                  Last update: {lastUpdate.toLocaleTimeString()}
                </Text>
              )}
            </Space>
          </Col>
        </Row>
      </Header>

      <Content className="smartmine-content">
        {/* Active Alerts Banner */}
        {alerts.length > 0 && (
          <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
            <Col span={24}>
              <Alert
                message={`${alerts.length} Active Alert${alerts.length > 1 ? 's' : ''}`}
                description={`${alerts.filter(a => a.severity === 'urgent').length} urgent, ${alerts.filter(a => a.severity === 'warning').length} warning`}
                type="warning"
                showIcon
                action={
                  <Button size="small" type="primary">
                    View All
                  </Button>
                }
              />
            </Col>
          </Row>
        )}

        {/* Key Performance Indicators */}
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12} md={6}>
            <Card className="kpi-card">
              <Statistic
                title="Truck Utilization"
                value={kpis.truck_utilization || 0}
                precision={1}
                suffix="%"
                prefix={<TruckOutlined />}
                valueStyle={{ color: kpis.truck_utilization > 80 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="kpi-card">
              <Statistic
                title="Total Throughput"
                value={kpis.total_throughput || 0}
                precision={0}
                suffix="t/h"
                prefix={<ThunderboltOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="kpi-card">
              <Statistic
                title="Crusher Availability"
                value={kpis.crusher_availability || 0}
                precision={1}
                suffix="%"
                prefix={<ToolOutlined />}
                valueStyle={{ color: kpis.crusher_availability > 90 ? '#3f8600' : '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="kpi-card">
              <Statistic
                title="Active Equipment"
                value={`${kpis.active_equipment?.trucks || 0}/${Object.keys(trucks).length}`}
                suffix="trucks"
                prefix={<EnvironmentOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Dashboard Tabs */}
        <Tabs defaultActiveKey="overview" size="large">
          <TabPane 
            tab={
              <span>
                <DashboardOutlined />
                Operations Overview
              </span>
            } 
            key="overview"
          >
            <Row gutter={[16, 16]}>
              {/* Mine Map View */}
              <Col xs={24} lg={12}>
                <MineMapView 
                  trucks={trucks}
                  stockpiles={stockpiles}
                  mineZones={miningData.mine_zones || {}}
                />
              </Col>
              
              {/* Real-time Alerts */}
              <Col xs={24} lg={12}>
                <Card title="🚨 Real-time Alerts" className="alerts-card">
                  <Table
                    dataSource={alerts}
                    columns={alertColumns}
                    pagination={false}
                    size="small"
                    rowKey="id"
                    scroll={{ y: 300 }}
                  />
                </Card>
              </Col>

              {/* Stockpile Status */}
              <Col span={24}>
                <StockpileMonitor stockpiles={stockpiles} />
              </Col>
            </Row>
          </TabPane>

          <TabPane 
            tab={
              <span>
                <TruckOutlined />
                Fleet Management
              </span>
            } 
            key="fleet"
          >
            <TruckFleetMonitor trucks={trucks} />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <ToolOutlined />
                Processing Plants
              </span>
            } 
            key="processing"
          >
            <CrusherMonitor crushers={crushers} />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <RobotOutlined />
                AI Optimization
              </span>
            } 
            key="ai"
          >
            <AIInsights 
              recommendations={aiRecommendations}
              kpis={kpis}
              trucks={trucks}
              crushers={crushers}
              stockpiles={stockpiles}
            />
          </TabPane>

          <TabPane 
            tab={
              <span>
                <BarChartOutlined />
                Analytics Dashboard
              </span>
            } 
            key="analytics"
          >
            <Row gutter={[16, 16]}>
              {/* Production Analytics */}
              <Col xs={24} lg={12}>
                <Card title="📊 Production Analytics" className="chart-container">
                  <div style={{ padding: '20px' }}>
                    <Title level={4}>Daily Production Target</Title>
                    <Progress 
                      percent={75} 
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                      format={(percent) => `${percent}% (15,000t / 20,000t)`}
                    />
                    
                    <div style={{ marginTop: 20 }}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Statistic
                            title="Ore Processed Today"
                            value={15000}
                            suffix="tons"
                            valueStyle={{ color: '#3f8600' }}
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title="Waste Moved"
                            value={45000}
                            suffix="tons"
                            valueStyle={{ color: '#cf1322' }}
                          />
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Card>
              </Col>

              {/* Equipment Efficiency */}
              <Col xs={24} lg={12}>
                <Card title="⚙️ Equipment Efficiency" className="chart-container">
                  <div style={{ padding: '20px' }}>
                    {Object.entries(trucks).slice(0, 5).map(([truckId, truck]) => (
                      <div key={truckId} style={{ marginBottom: 16 }}>
                        <Text strong>{truckId}</Text>
                        <Progress 
                          percent={truck.health_score} 
                          size="small"
                          status={truck.health_score < 70 ? 'exception' : 'active'}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>

              {/* Weather & Environmental */}
              <Col xs={24} lg={12}>
                <Card title="🌤️ Environmental Conditions" className="chart-container">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Temperature"
                        value={miningData.weather?.temperature || 25}
                        suffix="°C"
                        precision={1}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Wind Speed"
                        value={miningData.weather?.wind_speed || 15}
                        suffix="km/h"
                        precision={1}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Humidity"
                        value={miningData.weather?.humidity || 60}
                        suffix="%"
                        precision={1}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Visibility"
                        value={miningData.weather?.visibility || 10}
                        suffix="km"
                        precision={1}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Shift Information */}
              <Col xs={24} lg={12}>
                <Card title="👥 Shift Information" className="chart-container">
                  <Row gutter={16}>
                    <Col span={24}>
                      <Statistic
                        title="Current Shift"
                        value={miningData.shift_info?.current_shift || 'Day'}
                        valueStyle={{ fontSize: '2rem' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Crew Count"
                        value={miningData.shift_info?.crew_count || 35}
                        suffix="personnel"
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Shift Start"
                        value={miningData.shift_info?.shift_start ? 
                          new Date(miningData.shift_info.shift_start).toLocaleTimeString() : '06:00'}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Content>
    </Layout>
  );
}

export default SmartMineApp;
