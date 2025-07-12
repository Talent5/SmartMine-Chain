import React, { useState } from 'react';
import { Card, Row, Col, Typography, Tag, Alert, Statistic, Space, Input, Button, List, Timeline, Progress } from 'antd';
import { 
  RobotOutlined, 
  BulbOutlined, 
  TruckOutlined, 
  ToolOutlined,
  DatabaseOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const AIInsights = ({ aiRecommendations, kpis }) => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: 'Hello! I\'m your SmartMine AI assistant. I can help you analyze mining operations, provide insights, and answer questions about fleet management, crusher operations, and stockpile optimization.',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const handleQuerySubmit = () => {
    if (!query.trim()) return;

    // Add user message
    const newUserMessage = {
      type: 'user',
      message: query.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    // Generate AI response based on query and current data
    const aiResponse = generateAIResponse(query.trim(), aiRecommendations, kpis);
    const newAIMessage = {
      type: 'ai',
      message: aiResponse,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory(prev => [...prev, newUserMessage, newAIMessage]);
    setQuery('');
  };

  const generateAIResponse = (userQuery, recommendations, kpis) => {
    const lowerQuery = userQuery.toLowerCase();
    
    if (lowerQuery.includes('truck') || lowerQuery.includes('fleet')) {
      return `Based on current fleet analysis:\n\n• Fleet utilization is at ${kpis?.fleet_utilization?.toFixed(1) || 'N/A'}%\n• Average truck health score: ${kpis?.average_health?.toFixed(1) || 'N/A'}%\n• ${recommendations?.filter(r => r.category === 'fleet').length || 0} fleet optimization recommendations available\n\nI recommend focusing on trucks with health scores below 70% for preventive maintenance scheduling.`;
    }
    
    if (lowerQuery.includes('crusher') || lowerQuery.includes('processing')) {
      return `Crusher operations overview:\n\n• Total throughput: ${kpis?.total_throughput?.toFixed(1) || 'N/A'} t/h\n• Average crusher efficiency: ${kpis?.crusher_efficiency?.toFixed(1) || 'N/A'}%\n• ${recommendations?.filter(r => r.category === 'crusher').length || 0} crusher optimization recommendations\n\nCurrent bottlenecks appear to be in crusher capacity. Consider load balancing between units.`;
    }
    
    if (lowerQuery.includes('stockpile') || lowerQuery.includes('inventory')) {
      return `Stockpile management insights:\n\n• Overall capacity utilization: ${kpis?.stockpile_utilization?.toFixed(1) || 'N/A'}%\n• ${recommendations?.filter(r => r.category === 'stockpile').length || 0} stockpile alerts require attention\n\nMonitor iron ore stockpiles closely - they're showing rapid depletion rates that may impact production schedules.`;
    }
    
    if (lowerQuery.includes('efficiency') || lowerQuery.includes('optimization')) {
      return `Operational efficiency analysis:\n\n• Overall efficiency: ${kpis?.overall_efficiency?.toFixed(1) || 'N/A'}%\n• Energy consumption: ${kpis?.energy_consumption?.toFixed(1) || 'N/A'} kWh\n• Cost per ton: $${kpis?.cost_per_ton?.toFixed(2) || 'N/A'}\n\nKey opportunities: Truck dispatch optimization could improve efficiency by 12-15% based on current traffic patterns.`;
    }
    
    if (lowerQuery.includes('predict') || lowerQuery.includes('forecast')) {
      return `Predictive analytics summary:\n\n• Equipment failure probability: ${recommendations?.filter(r => r.priority === 'high').length || 0} high-risk items identified\n• Production forecast: Trending ${Math.random() > 0.5 ? 'upward' : 'stable'} for next 24 hours\n• Maintenance scheduling: ${Math.floor(Math.random() * 5) + 1} units due for service this week\n\nMachine learning models indicate optimal dispatch strategy should prioritize Zone A and Zone C for maximum yield.`;
    }
    
    if (lowerQuery.includes('cost') || lowerQuery.includes('budget')) {
      return `Cost optimization insights:\n\n• Current operational cost: $${(Math.random() * 50000 + 100000).toFixed(0)}/day\n• Fuel consumption: ${(Math.random() * 2000 + 5000).toFixed(0)} L/day\n• Maintenance costs: ${(Math.random() * 20 + 10).toFixed(1)}% of operational budget\n\nRecommendation: Implementing adaptive truck dispatch could reduce fuel costs by 8-12% while maintaining production targets.`;
    }
    
    // Default response
    return `I understand you're asking about "${userQuery}". Based on current mining operations data:\n\n• ${recommendations?.length || 0} total AI recommendations are available\n• Overall system efficiency: ${kpis?.overall_efficiency?.toFixed(1) || 'N/A'}%\n• Active monitoring of ${Object.keys(kpis || {}).length} key performance indicators\n\nWould you like me to provide more specific insights about truck fleet, crusher operations, or stockpile management?`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'fleet': return <TruckOutlined />;
      case 'crusher': return <ToolOutlined />;
      case 'stockpile': return <DatabaseOutlined />;
      default: return <BulbOutlined />;
    }
  };

  const getImplementationStatus = (_recommendation) => {
    // Simulate implementation status
    const statuses = ['pending', 'in-progress', 'completed'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  return (
    <div>
      {/* AI Chat Interface */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="🤖 GenAI Assistant" className="chart-container">
            <div style={{ height: '400px', overflowY: 'auto', marginBottom: 16, padding: 8, border: '1px solid #f0f0f0', borderRadius: 6 }}>
              {chatHistory.map((message, index) => (
                <div key={index} style={{ marginBottom: 12 }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                    marginBottom: 4
                  }}>
                    <div style={{
                      maxWidth: '80%',
                      padding: '8px 12px',
                      borderRadius: '12px',
                      backgroundColor: message.type === 'user' ? '#1890ff' : '#f6f6f6',
                      color: message.type === 'user' ? 'white' : 'black'
                    }}>
                      <div style={{ fontSize: '14px', whiteSpace: 'pre-line' }}>
                        {message.message}
                      </div>
                      <div style={{ 
                        fontSize: '10px', 
                        opacity: 0.7, 
                        marginTop: 4,
                        textAlign: 'right'
                      }}>
                        {message.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Space.Compact style={{ width: '100%' }}>
              <TextArea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about fleet efficiency, crusher status, stockpile levels, or optimization recommendations..."
                autoSize={{ minRows: 2, maxRows: 4 }}
                onPressEnter={(e) => {
                  if (e.shiftKey) return;
                  e.preventDefault();
                  handleQuerySubmit();
                }}
              />
              <Button 
                type="primary" 
                icon={<SearchOutlined />}
                onClick={handleQuerySubmit}
                disabled={!query.trim()}
              >
                Ask AI
              </Button>
            </Space.Compact>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="📊 AI Performance Metrics" className="chart-container">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Statistic
                  title="Prediction Accuracy"
                  value={94.7}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Statistic
                  title="Recommendations Generated"
                  value={aiRecommendations?.length || 0}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<BulbOutlined />}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Statistic
                  title="Response Time"
                  value={1.2}
                  suffix="s"
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Statistic
                  title="Cost Savings"
                  value={15.3}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<TruckOutlined />}
                />
              </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
              <Text strong>Model Performance:</Text>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text>Fleet Optimization Model</Text>
                  <Text>96%</Text>
                </div>
                <Progress percent={96} size="small" strokeColor="#52c41a" />
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text>Predictive Maintenance</Text>
                  <Text>92%</Text>
                </div>
                <Progress percent={92} size="small" strokeColor="#1890ff" />
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text>Stockpile Optimization</Text>
                  <Text>89%</Text>
                </div>
                <Progress percent={89} size="small" strokeColor="#722ed1" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* AI Recommendations */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="💡 AI Recommendations" className="chart-container">
            {!aiRecommendations || aiRecommendations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Text type="secondary">No AI recommendations available...</Text>
              </div>
            ) : (
              <List
                dataSource={aiRecommendations}
                renderItem={(recommendation) => {
                  const status = getImplementationStatus(recommendation);
                  return (
                    <List.Item>
                      <Card 
                        size="small" 
                        style={{ width: '100%' }}
                        title={
                          <Space>
                            {getCategoryIcon(recommendation.category)}
                            <Text strong>{recommendation.title}</Text>
                            <Tag color={getPriorityColor(recommendation.priority)}>
                              {recommendation.priority.toUpperCase()}
                            </Tag>
                            <Tag color={status === 'completed' ? 'green' : status === 'in-progress' ? 'blue' : 'orange'}>
                              {status.replace('-', ' ').toUpperCase()}
                            </Tag>
                          </Space>
                        }
                      >
                        <Paragraph style={{ marginBottom: 12 }}>
                          {recommendation.description}
                        </Paragraph>
                        
                        <Row gutter={[16, 8]}>
                          <Col xs={24} sm={8}>
                            <Text strong>Expected Impact: </Text>
                            <Text style={{ color: '#52c41a' }}>
                              {recommendation.expected_impact}
                            </Text>
                          </Col>
                          <Col xs={24} sm={8}>
                            <Text strong>Implementation: </Text>
                            <Text style={{ color: '#1890ff' }}>
                              {recommendation.implementation_time}
                            </Text>
                          </Col>
                          <Col xs={24} sm={8}>
                            <Text strong>Confidence: </Text>
                            <Text style={{ color: '#722ed1' }}>
                              {recommendation.confidence_score.toFixed(1)}%
                            </Text>
                          </Col>
                        </Row>

                        {recommendation.action_items && (
                          <div style={{ marginTop: 12 }}>
                            <Text strong>Action Items:</Text>
                            <ul style={{ marginTop: 4, marginBottom: 0 }}>
                              {recommendation.action_items.map((item, idx) => (
                                <li key={idx} style={{ fontSize: '12px' }}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Card>
                    </List.Item>
                  );
                }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="⚡ Smart Alerts" className="chart-container" style={{ marginBottom: 16 }}>
            <Timeline
              items={[
                {
                  color: 'red',
                  children: (
                    <div>
                      <Text strong>High Priority Alert</Text>
                      <br />
                      <Text type="secondary">Truck T-007 requires immediate maintenance</Text>
                      <br />
                      <Text style={{ fontSize: '12px', color: '#999' }}>2 minutes ago</Text>
                    </div>
                  ),
                },
                {
                  color: 'orange',
                  children: (
                    <div>
                      <Text strong>Stockpile Warning</Text>
                      <br />
                      <Text type="secondary">Iron ore stockpile below 30% capacity</Text>
                      <br />
                      <Text style={{ fontSize: '12px', color: '#999' }}>15 minutes ago</Text>
                    </div>
                  ),
                },
                {
                  color: 'blue',
                  children: (
                    <div>
                      <Text strong>Optimization Opportunity</Text>
                      <br />
                      <Text type="secondary">Crusher load balancing recommended</Text>
                      <br />
                      <Text style={{ fontSize: '12px', color: '#999' }}>1 hour ago</Text>
                    </div>
                  ),
                },
                {
                  color: 'green',
                  children: (
                    <div>
                      <Text strong>Success</Text>
                      <br />
                      <Text type="secondary">Fleet efficiency improved by 8%</Text>
                      <br />
                      <Text style={{ fontSize: '12px', color: '#999' }}>2 hours ago</Text>
                    </div>
                  ),
                },
              ]}
            />
          </Card>

          <Card title="🎯 Quick Actions" className="chart-container">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" block icon={<TruckOutlined />}>
                Optimize Fleet Dispatch
              </Button>
              <Button block icon={<ToolOutlined />}>
                Schedule Crusher Maintenance
              </Button>
              <Button block icon={<DatabaseOutlined />}>
                Rebalance Stockpiles
              </Button>
              <Button block icon={<RobotOutlined />}>
                Generate Weekly Report
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AIInsights;
