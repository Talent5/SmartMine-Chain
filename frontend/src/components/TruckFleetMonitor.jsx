import React from 'react';
import { Card, Row, Col, Typography, Tag, Progress, Statistic, Space } from 'antd';
import { TruckOutlined, EnvironmentOutlined, ThunderboltOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TruckFleetMonitor = ({ trucks }) => {
  if (!trucks || Object.keys(trucks).length === 0) {
    return (
      <Card title="🚛 Truck Fleet Monitor" className="chart-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="secondary">No truck data available...</Text>
        </div>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'loading': return 'orange';
      case 'hauling': return 'green';
      case 'dumping': return 'purple';
      case 'idle': return 'gray';
      case 'maintenance': return 'red';
      default: return 'blue';
    }
  };

  const getStatusIcon = (status) => {
    return <div className={`status-indicator status-${status}`}></div>;
  };

  const getHealthColor = (score) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const getFuelColor = (level) => {
    if (level >= 50) return '#52c41a';
    if (level >= 20) return '#faad14';
    return '#ff4d4f';
  };

  const truckStats = {
    total: Object.keys(trucks).length,
    active: Object.values(trucks).filter(t => ['loading', 'hauling', 'dumping'].includes(t.status)).length,
    idle: Object.values(trucks).filter(t => t.status === 'idle').length,
    maintenance: Object.values(trucks).filter(t => t.status === 'maintenance').length,
    lowFuel: Object.values(trucks).filter(t => t.fuel_level < 20).length,
    lowHealth: Object.values(trucks).filter(t => t.health_score < 70).length
  };

  return (
    <div>
      {/* Fleet Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Total Fleet"
              value={truckStats.total}
              prefix={<TruckOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Active"
              value={truckStats.active}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Idle"
              value={truckStats.idle}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Maintenance"
              value={truckStats.maintenance}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Low Fuel"
              value={truckStats.lowFuel}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Health Issues"
              value={truckStats.lowHealth}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Individual Truck Cards */}
      <Row gutter={[16, 16]}>
        {Object.entries(trucks).map(([truckId, truck]) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={truckId}>
            <Card 
              className={`truck-item truck-${truck.status}`}
              title={
                <Space>
                  {getStatusIcon(truck.status)}
                  {truckId}
                </Space>
              }
              extra={
                <Tag color={getStatusColor(truck.status)}>
                  {truck.status.toUpperCase()}
                </Tag>
              }
            >
              <div style={{ marginBottom: 12 }}>
                <Text strong>Load: </Text>
                <Text>{truck.current_load.toFixed(1)} / {truck.load_capacity.toFixed(1)} tons</Text>
                <Progress 
                  percent={(truck.current_load / truck.load_capacity) * 100} 
                  size="small"
                  strokeColor="#1890ff"
                  showInfo={false}
                  style={{ marginTop: 4 }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <Text strong>Fuel Level: </Text>
                <Text style={{ color: getFuelColor(truck.fuel_level) }}>
                  {truck.fuel_level.toFixed(1)}%
                </Text>
                <Progress 
                  percent={truck.fuel_level} 
                  size="small"
                  strokeColor={getFuelColor(truck.fuel_level)}
                  showInfo={false}
                  style={{ marginTop: 4 }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <Text strong>Health Score: </Text>
                <Text style={{ color: getHealthColor(truck.health_score) }}>
                  {truck.health_score.toFixed(1)}%
                </Text>
                <Progress 
                  percent={truck.health_score} 
                  size="small"
                  strokeColor={getHealthColor(truck.health_score)}
                  showInfo={false}
                  style={{ marginTop: 4 }}
                />
              </div>

              <div style={{ marginBottom: 8 }}>
                <Text strong>GPS: </Text>
                <div className="gps-coordinate">
                  Lat: {truck.gps_location.lat.toFixed(6)}<br/>
                  Lng: {truck.gps_location.lng.toFixed(6)}<br/>
                  Alt: {truck.gps_location.elevation.toFixed(0)}m
                </div>
              </div>

              {truck.speed > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Speed: </Text>
                  <Text>{truck.speed.toFixed(1)} km/h</Text>
                </div>
              )}

              {truck.destination && (
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Destination: </Text>
                  <Text>{truck.destination}</Text>
                </div>
              )}

              <div>
                <Text strong>Engine Hours: </Text>
                <Text>{truck.engine_hours.toFixed(0)}h</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TruckFleetMonitor;
