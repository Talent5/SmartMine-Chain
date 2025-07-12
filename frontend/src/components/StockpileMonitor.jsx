import React from 'react';
import { Card, Row, Col, Typography, Tag, Progress, Statistic, Space, Alert } from 'antd';
import { DatabaseOutlined, ExclamationCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StockpileMonitor = ({ stockpiles }) => {
  if (!stockpiles || Object.keys(stockpiles).length === 0) {
    return (
      <Card title="📦 Stockpile Monitor" className="chart-container">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="secondary">No stockpile data available...</Text>
        </div>
      </Card>
    );
  }

  const getCapacityColor = (percent) => {
    if (percent < 30) return '#ff4d4f';
    if (percent < 60) return '#faad14';
    if (percent < 90) return '#52c41a';
    return '#ff4d4f'; // Over capacity
  };

  const getCapacityStatus = (percent) => {
    if (percent < 20) return 'critical-low';
    if (percent < 40) return 'low';
    if (percent < 80) return 'normal';
    if (percent < 95) return 'high';
    return 'critical-high';
  };

  const stockpileStats = {
    total: Object.keys(stockpiles).length,
    criticalLow: Object.values(stockpiles).filter(s => (s.current_volume / s.max_capacity) * 100 < 20).length,
    low: Object.values(stockpiles).filter(s => {
      const percent = (s.current_volume / s.max_capacity) * 100;
      return percent >= 20 && percent < 40;
    }).length,
    normal: Object.values(stockpiles).filter(s => {
      const percent = (s.current_volume / s.max_capacity) * 100;
      return percent >= 40 && percent < 80;
    }).length,
    high: Object.values(stockpiles).filter(s => {
      const percent = (s.current_volume / s.max_capacity) * 100;
      return percent >= 80 && percent < 95;
    }).length,
    overCapacity: Object.values(stockpiles).filter(s => (s.current_volume / s.max_capacity) * 100 >= 95).length,
    totalVolume: Object.values(stockpiles).reduce((sum, s) => sum + s.current_volume, 0),
    totalCapacity: Object.values(stockpiles).reduce((sum, s) => sum + s.max_capacity, 0)
  };

  const getAlerts = (stockpile) => {
    const alerts = [];
    const capacityPercent = (stockpile.current_volume / stockpile.max_capacity) * 100;
    
    if (capacityPercent < 20) {
      alerts.push({ type: 'error', message: 'Critical Low Level - Immediate Replenishment Required' });
    } else if (capacityPercent < 40) {
      alerts.push({ type: 'warning', message: 'Low Level - Schedule Replenishment' });
    } else if (capacityPercent >= 95) {
      alerts.push({ type: 'error', message: 'Near Capacity - Risk of Overflow' });
    }
    
    if (stockpile.discharge_rate > stockpile.fill_rate * 1.5) {
      alerts.push({ type: 'warning', message: 'High Discharge Rate - Monitor Closely' });
    }
    
    return alerts;
  };

  const getMaterialIcon = (materialType) => {
    const icons = {
      'iron_ore': '⛏️',
      'coal': '⚫',
      'limestone': '🗿',
      'copper_ore': '🟤',
      'gold_ore': '🟨',
      'waste_rock': '🪨'
    };
    return icons[materialType] || '📦';
  };

  return (
    <div>
      {/* Stockpile Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Total Stockpiles"
              value={stockpileStats.total}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Critical Low"
              value={stockpileStats.criticalLow}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Normal"
              value={stockpileStats.normal}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Near Capacity"
              value={stockpileStats.overCapacity}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Total Volume"
              value={stockpileStats.totalVolume.toFixed(0)}
              suffix="m³"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card className="metric-card">
            <Statistic
              title="Utilization"
              value={((stockpileStats.totalVolume / stockpileStats.totalCapacity) * 100).toFixed(1)}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Individual Stockpile Cards */}
      <Row gutter={[16, 16]}>
        {Object.entries(stockpiles).map(([stockpileId, stockpile]) => {
          const alerts = getAlerts(stockpile);
          const capacityPercent = (stockpile.current_volume / stockpile.max_capacity) * 100;
          const status = getCapacityStatus(capacityPercent);
          
          return (
            <Col xs={24} lg={12} xl={8} key={stockpileId}>
              <Card 
                className={`stockpile-item stockpile-${status}`}
                title={
                  <Space>
                    <span>{getMaterialIcon(stockpile.material_type)}</span>
                    {stockpileId}
                  </Space>
                }
                extra={
                  <Tag color={getCapacityColor(capacityPercent)}>
                    {capacityPercent.toFixed(1)}%
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

                {/* Material Type */}
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Material: </Text>
                  <Tag color="blue">{stockpile.material_type.replace('_', ' ').toUpperCase()}</Tag>
                </div>

                {/* Volume */}
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Volume: </Text>
                  <Text>{stockpile.current_volume.toFixed(0)} / {stockpile.max_capacity.toFixed(0)} m³</Text>
                  <Progress 
                    percent={capacityPercent} 
                    size="small"
                    strokeColor={getCapacityColor(capacityPercent)}
                    showInfo={false}
                    style={{ marginTop: 4 }}
                  />
                </div>

                {/* Fill Rate */}
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Fill Rate: </Text>
                  <Space>
                    <ArrowUpOutlined style={{ color: '#52c41a' }} />
                    <Text>{stockpile.fill_rate.toFixed(1)} m³/h</Text>
                  </Space>
                </div>

                {/* Discharge Rate */}
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Discharge Rate: </Text>
                  <Space>
                    <ArrowDownOutlined style={{ color: '#ff4d4f' }} />
                    <Text>{stockpile.discharge_rate.toFixed(1)} m³/h</Text>
                  </Space>
                </div>

                {/* Net Rate */}
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Net Rate: </Text>
                  <Text style={{ 
                    color: stockpile.fill_rate - stockpile.discharge_rate > 0 ? '#52c41a' : '#ff4d4f' 
                  }}>
                    {(stockpile.fill_rate - stockpile.discharge_rate > 0 ? '+' : '')}
                    {(stockpile.fill_rate - stockpile.discharge_rate).toFixed(1)} m³/h
                  </Text>
                </div>

                {/* Time to Empty/Full */}
                <div style={{ marginBottom: 12 }}>
                  {stockpile.fill_rate > stockpile.discharge_rate ? (
                    <>
                      <Text strong>Time to Full: </Text>
                      <Text>
                        {stockpile.current_volume >= stockpile.max_capacity ? 
                          'Already Full' : 
                          `${((stockpile.max_capacity - stockpile.current_volume) / (stockpile.fill_rate - stockpile.discharge_rate)).toFixed(1)}h`
                        }
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text strong>Time to Empty: </Text>
                      <Text style={{ color: '#ff4d4f' }}>
                        {stockpile.current_volume <= 0 ? 
                          'Already Empty' : 
                          `${(stockpile.current_volume / (stockpile.discharge_rate - stockpile.fill_rate)).toFixed(1)}h`
                        }
                      </Text>
                    </>
                  )}
                </div>

                {/* GPS Location */}
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Location: </Text>
                  <div className="gps-coordinate" style={{ fontSize: '12px' }}>
                    {stockpile.gps_location.lat.toFixed(6)}, {stockpile.gps_location.lng.toFixed(6)}
                  </div>
                </div>

                {/* Last Updated */}
                <div>
                  <Text strong>Last Updated: </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {new Date(stockpile.last_updated).toLocaleTimeString()}
                  </Text>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default StockpileMonitor;
