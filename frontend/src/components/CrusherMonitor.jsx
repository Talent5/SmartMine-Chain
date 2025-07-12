import React from 'react';
import { Card, Row, Col, Typography, Tag, Progress, Statistic, Space, Alert } from 'antd';
import { ToolOutlined, ThunderboltOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const CrusherMonitor = ({ crushers }) => {
  if (!crushers || Object.keys(crushers).length === 0) {
    return (
      <Card title="⚙️ Crusher Monitor" className="chart-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="secondary">No crusher data available...</Text>
        </div>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'green';
      case 'idle': return 'orange';
      case 'maintenance': return 'red';
      case 'stopped': return 'gray';
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

  const getTemperatureColor = (temp) => {
    if (temp < 70) return '#52c41a';
    if (temp < 90) return '#faad14';
    return '#ff4d4f';
  };

  const crusherStats = {
    total: Object.keys(crushers).length,
    running: Object.values(crushers).filter(c => c.status === 'running').length,
    idle: Object.values(crushers).filter(c => c.status === 'idle').length,
    maintenance: Object.values(crushers).filter(c => c.status === 'maintenance').length,
    overheating: Object.values(crushers).filter(c => c.temperature > 90).length,
    lowHealth: Object.values(crushers).filter(c => c.health_score < 70).length,
    totalThroughput: Object.values(crushers).reduce((sum, c) => sum + c.current_throughput, 0)
  };

  const getAlerts = (crusher) => {
    const alerts = [];
    if (crusher.temperature > 90) {
      alerts.push({ type: 'error', message: 'High Temperature Warning' });
    }
    if (crusher.health_score < 70) {
      alerts.push({ type: 'warning', message: 'Health Score Below Threshold' });
    }
    if (crusher.vibration_level > 8) {
      alerts.push({ type: 'warning', message: 'Elevated Vibration Levels' });
    }
    if (crusher.power_consumption > 450) {
      alerts.push({ type: 'info', message: 'High Power Consumption' });
    }
    return alerts;
  };

  return (
    <div>
      {/* Crusher Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Total Crushers"
              value={crusherStats.total}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Running"
              value={crusherStats.running}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Idle"
              value={crusherStats.idle}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Maintenance"
              value={crusherStats.maintenance}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Overheating"
              value={crusherStats.overheating}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Total Throughput"
              value={crusherStats.totalThroughput.toFixed(1)}
              suffix="t/h"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Individual Crusher Cards */}
      <Row gutter={[16, 16]}>
        {Object.entries(crushers).map(([crusherId, crusher]) => {
          const alerts = getAlerts(crusher);
          
          return (
            <Col xs={24} lg={8} key={crusherId}>
              <Card 
                className={`crusher-item crusher-${crusher.status}`}
                title={
                  <Space>
                    {getStatusIcon(crusher.status)}
                    {crusherId}
                  </Space>
                }
                extra={
                  <Tag color={getStatusColor(crusher.status)}>
                    {crusher.status.toUpperCase()}
                  </Tag>
                }
              >
                {/* Alerts */}
                {alerts.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    {alerts.map((alert, index) => (
                      <Alert
                        key={index}
                        message={alert.message}
                        type={alert.type}
                        size="small"
                        style={{ marginBottom: 4 }}
                        showIcon
                      />
                    ))}
                  </div>
                )}

                {/* Throughput */}
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Throughput: </Text>
                  <Text>{crusher.current_throughput.toFixed(1)} / {crusher.max_throughput} t/h</Text>
                  <Progress 
                    percent={(crusher.current_throughput / crusher.max_throughput) * 100} 
                    size="small"
                    strokeColor="#1890ff"
                    showInfo={false}
                    style={{ marginTop: 4 }}
                  />
                </div>

                {/* Health Score */}
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Health Score: </Text>
                  <Text style={{ color: getHealthColor(crusher.health_score) }}>
                    {crusher.health_score.toFixed(1)}%
                  </Text>
                  <Progress 
                    percent={crusher.health_score} 
                    size="small"
                    strokeColor={getHealthColor(crusher.health_score)}
                    showInfo={false}
                    style={{ marginTop: 4 }}
                  />
                </div>

                {/* Temperature */}
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Temperature: </Text>
                  <Text style={{ color: getTemperatureColor(crusher.temperature) }}>
                    {crusher.temperature.toFixed(1)}°C
                  </Text>
                  <Progress 
                    percent={(crusher.temperature / 120) * 100} 
                    size="small"
                    strokeColor={getTemperatureColor(crusher.temperature)}
                    showInfo={false}
                    style={{ marginTop: 4 }}
                  />
                </div>

                {/* Power Consumption */}
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Power: </Text>
                  <Text>{crusher.power_consumption.toFixed(1)} kW</Text>
                  <Progress 
                    percent={(crusher.power_consumption / 500) * 100} 
                    size="small"
                    strokeColor="#722ed1"
                    showInfo={false}
                    style={{ marginTop: 4 }}
                  />
                </div>

                {/* Vibration Level */}
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Vibration: </Text>
                  <Text>{crusher.vibration_level.toFixed(1)} mm/s</Text>
                  <Progress 
                    percent={(crusher.vibration_level / 10) * 100} 
                    size="small"
                    strokeColor={crusher.vibration_level > 8 ? '#ff4d4f' : '#52c41a'}
                    showInfo={false}
                    style={{ marginTop: 4 }}
                  />
                </div>

                {/* Feed Size Distribution */}
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Feed Size Distribution:</Text>
                  <div style={{ marginTop: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span>Fine: {crusher.feed_size_distribution.fine.toFixed(1)}%</span>
                      <span>Medium: {crusher.feed_size_distribution.medium.toFixed(1)}%</span>
                      <span>Coarse: {crusher.feed_size_distribution.coarse.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Operating Hours: </Text>
                  <Text>{crusher.operating_hours.toFixed(0)}h</Text>
                </div>

                {/* Last Maintenance */}
                <div>
                  <Text strong>Last Maintenance: </Text>
                  <Text type="secondary">{crusher.last_maintenance}</Text>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default CrusherMonitor;
