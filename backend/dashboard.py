import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import json
import asyncio
import websockets
import threading
import time
from datetime import datetime, timedelta
from ml_models import PredictiveMaintenanceModel
import queue
import warnings
warnings.filterwarnings('ignore')

# Configure page
st.set_page_config(
    page_title="Industrial Digital Twin Dashboard",
    page_icon="🏭",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #1f77b4;
    }
    .alert-danger {
        background-color: #ffebee;
        color: #c62828;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #f44336;
    }
    .alert-warning {
        background-color: #fff3e0;
        color: #ef6c00;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #ff9800;
    }
    .alert-success {
        background-color: #e8f5e8;
        color: #2e7d32;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #4caf50;
    }
</style>
""", unsafe_allow_html=True)

class DigitalTwinDashboard:
    def __init__(self):
        self.data_queue = queue.Queue(maxsize=1000)
        self.latest_data = {}
        self.historical_data = []
        self.model = None
        self.is_connected = False
        
        # Initialize ML model
        self.load_model()
        
        # Start WebSocket client in background
        self.start_websocket_client()
    
    def load_model(self):
        """Load pre-trained ML models"""
        try:
            self.model = PredictiveMaintenanceModel()
            self.model.load_models('models/digital_twin')
            st.success("✅ ML Models loaded successfully!")
        except Exception as e:
            st.warning(f"⚠️ Could not load ML models: {e}")
            st.info("Please run ml_models.py first to train the models.")
    
    async def websocket_client(self):
        """Connect to the digital twin simulator WebSocket"""
        uri = "ws://localhost:8765"
        try:
            async with websockets.connect(uri) as websocket:
                self.is_connected = True
                st.info("🔗 Connected to Digital Twin Simulator")
                
                async for message in websocket:
                    try:
                        data = json.loads(message)
                        self.latest_data = data
                        self.historical_data.append(data)
                        
                        # Keep only last 1000 points
                        if len(self.historical_data) > 1000:
                            self.historical_data.pop(0)
                        
                        # Add to queue for real-time updates
                        if not self.data_queue.full():
                            self.data_queue.put(data)
                            
                    except json.JSONDecodeError:
                        continue
                        
        except Exception as e:
            self.is_connected = False
            st.error(f"❌ Connection failed: {e}")
            st.info("Make sure the digital twin simulator is running!")
    
    def start_websocket_client(self):
        """Start WebSocket client in background thread"""
        def run_client():
            try:
                asyncio.run(self.websocket_client())
            except Exception as e:
                st.error(f"WebSocket error: {e}")
        
        thread = threading.Thread(target=run_client, daemon=True)
        thread.start()
    
    def get_machine_status(self, data):
        """Determine machine status based on current data"""
        if not data:
            return "Unknown", "secondary"
        
        state = data.get('state', 'unknown')
        fault_prob = data.get('fault_probability', 0)
        degradation = data.get('degradation_factor', 1)
        
        if state.startswith('fault_'):
            return "FAULT DETECTED", "danger"
        elif state == 'maintenance':
            return "MAINTENANCE", "warning"
        elif fault_prob > 0.7:
            return "HIGH RISK", "danger"
        elif fault_prob > 0.4 or degradation > 1.3:
            return "MEDIUM RISK", "warning"
        else:
            return "NORMAL", "success"
    
    def create_real_time_charts(self):
        """Create real-time monitoring charts"""
        if not self.historical_data:
            st.info("Waiting for real-time data from simulator...")
            return
        
        # Convert to DataFrame
        df = pd.DataFrame(self.historical_data[-100:])  # Last 100 points
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Key Performance Indicators
        col1, col2, col3, col4 = st.columns(4)
        
        latest = self.latest_data
        
        with col1:
            st.metric(
                "Machine Health",
                f"{latest.get('Machine_Health_Index', 0):.1f}%",
                delta=f"{latest.get('degradation_factor', 1)-1:.2f}"
            )
        
        with col2:
            st.metric(
                "Fault Probability",
                f"{latest.get('fault_probability', 0)*100:.1f}%",
                delta=f"{latest.get('Fault_Probability', 0):.2f}"
            )
        
        with col3:
            st.metric(
                "Production Rate",
                f"{latest.get('Production_Rate', 0):.1f}",
                delta=f"{latest.get('Machine_Utilization_Rate', 0):.1f}%"
            )
        
        with col4:
            st.metric(
                "Energy Efficiency",
                f"{latest.get('Production_Rate', 0) / (latest.get('Energy_Consumption', 1) + 1):.2f}",
                delta=f"{100 - latest.get('Machine_Load_Percentage', 0):.1f}%"
            )
        
        # Main monitoring charts
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=('Vibration & Temperature', 'Pressure & Acoustic', 
                          'Production Metrics', 'Health Indicators'),
            specs=[[{"secondary_y": True}, {"secondary_y": True}],
                   [{"secondary_y": True}, {"secondary_y": True}]]
        )
        
        # Chart 1: Vibration & Temperature
        fig.add_trace(
            go.Scatter(x=df['timestamp'], y=df['Vibration_Level'], 
                      name='Vibration', line=dict(color='red')),
            row=1, col=1
        )
        fig.add_trace(
            go.Scatter(x=df['timestamp'], y=df['Temperature_Readings'], 
                      name='Temperature', line=dict(color='orange')),
            row=1, col=1, secondary_y=True
        )
        
        # Chart 2: Pressure & Acoustic
        fig.add_trace(
            go.Scatter(x=df['timestamp'], y=df['Pressure_Data'], 
                      name='Pressure', line=dict(color='blue')),
            row=1, col=2
        )
        fig.add_trace(
            go.Scatter(x=df['timestamp'], y=df['Acoustic_Signals'], 
                      name='Acoustic', line=dict(color='green')),
            row=1, col=2, secondary_y=True
        )
        
        # Chart 3: Production Metrics
        fig.add_trace(
            go.Scatter(x=df['timestamp'], y=df['Production_Rate'], 
                      name='Production Rate', line=dict(color='purple')),
            row=2, col=1
        )
        fig.add_trace(
            go.Scatter(x=df['timestamp'], y=df['Energy_Consumption'], 
                      name='Energy Consumption', line=dict(color='brown')),
            row=2, col=1, secondary_y=True
        )
        
        # Chart 4: Health Indicators
        fig.add_trace(
            go.Scatter(x=df['timestamp'], y=df['Machine_Health_Index'], 
                      name='Health Index', line=dict(color='darkgreen')),
            row=2, col=2
        )
        fig.add_trace(
            go.Scatter(x=df['timestamp'], y=df['Fault_Probability']*100, 
                      name='Fault Probability %', line=dict(color='red')),
            row=2, col=2, secondary_y=True
        )
        
        fig.update_layout(height=600, showlegend=True, 
                         title_text="Real-Time Machine Monitoring")
        
        st.plotly_chart(fig, use_container_width=True)
    
    def create_3d_machine_visualization(self):
        """Create 3D visualization of machine state"""
        if not self.latest_data:
            return
        
        # Create 3D scatter plot representing machine components
        fig = go.Figure(data=[go.Scatter3d(
            x=[1, 2, 3, 1, 2, 3, 1, 2, 3],
            y=[1, 1, 1, 2, 2, 2, 3, 3, 3],
            z=[1, 1, 1, 1, 1, 1, 1, 1, 1],
            mode='markers',
            marker=dict(
                size=[
                    self.latest_data.get('Vibration_Level', 1) * 10,
                    self.latest_data.get('Temperature_Readings', 25),
                    self.latest_data.get('Pressure_Data', 20),
                    self.latest_data.get('Motor_Speed', 50),
                    self.latest_data.get('Torque_Data', 3) * 10,
                    self.latest_data.get('Tool_Wear_Rate', 20),
                    self.latest_data.get('Machine_Health_Index', 85),
                    self.latest_data.get('Production_Rate', 80),
                    self.latest_data.get('Energy_Consumption', 5) * 10
                ],
                color=[
                    self.latest_data.get('Vibration_Level', 0.5),
                    self.latest_data.get('Temperature_Readings', 25),
                    self.latest_data.get('Pressure_Data', 20),
                    self.latest_data.get('Motor_Speed', 50),
                    self.latest_data.get('Torque_Data', 3),
                    self.latest_data.get('Tool_Wear_Rate', 20),
                    self.latest_data.get('Machine_Health_Index', 85),
                    self.latest_data.get('Production_Rate', 80),
                    self.latest_data.get('Energy_Consumption', 5)
                ],
                colorscale='RdYlGn_r',
                showscale=True,
                colorbar=dict(title="Intensity")
            ),
            text=['Vibration', 'Temperature', 'Pressure', 'Motor', 'Torque', 
                  'Tool Wear', 'Health', 'Production', 'Energy'],
            hovertemplate='<b>%{text}</b><br>Value: %{marker.color:.2f}<extra></extra>'
        )])
        
        fig.update_layout(
            title="3D Machine Component Visualization",
            scene=dict(
                xaxis_title="X Position",
                yaxis_title="Y Position", 
                zaxis_title="Z Position"
            ),
            height=400
        )
        
        st.plotly_chart(fig, use_container_width=True)
    
    def predictive_maintenance_analysis(self):
        """Show predictive maintenance analysis"""
        if not self.model or not self.latest_data:
            st.warning("ML model not available or no data")
            return
        
        try:
            # Prepare data for prediction
            prediction_data = {k: v for k, v in self.latest_data.items() 
                              if k in self.model.feature_columns or k in [
                                  'Vibration_Level', 'Temperature_Readings', 'Pressure_Data',
                                  'Acoustic_Signals', 'Humidity_Levels', 'Motor_Speed',
                                  'Torque_Data', 'Energy_Consumption', 'Production_Rate',
                                  'Tool_Wear_Rate', 'Machine_Utilization_Rate', 'Cycle_Time_Per_Operation',
                                  'Idle_Time', 'Machine_Load_Percentage', 'Ambient_Temperature',
                                  'Humidity', 'Air_Quality_Index', 'Machine_Health_Index',
                                  'Predictive_Maintenance_Scores', 'Component_Degradation_Index',
                                  'Real_Time_Performance_Index', 'Anomaly_Scores', 'Fault_Probability'
                              ]}
            
            # Get predictions
            fault_prob, fault_pred = self.model.predict_fault(prediction_data)
            anomaly_score, is_anomaly = self.model.detect_anomaly(prediction_data)
            
            # Display results
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("🔮 Fault Prediction")
                
                prob_value = fault_prob[0] * 100
                if prob_value > 70:
                    st.error(f"HIGH RISK: {prob_value:.1f}% fault probability")
                elif prob_value > 40:
                    st.warning(f"MEDIUM RISK: {prob_value:.1f}% fault probability")
                else:
                    st.success(f"LOW RISK: {prob_value:.1f}% fault probability")
                
                # Fault probability gauge
                fig_gauge = go.Figure(go.Indicator(
                    mode = "gauge+number+delta",
                    value = prob_value,
                    domain = {'x': [0, 1], 'y': [0, 1]},
                    title = {'text': "Fault Probability (%)"},
                    delta = {'reference': 50},
                    gauge = {
                        'axis': {'range': [None, 100]},
                        'bar': {'color': "darkblue"},
                        'steps': [
                            {'range': [0, 40], 'color': "lightgray"},
                            {'range': [40, 70], 'color': "yellow"},
                            {'range': [70, 100], 'color': "red"}
                        ],
                        'threshold': {
                            'line': {'color': "red", 'width': 4},
                            'thickness': 0.75,
                            'value': 70
                        }
                    }
                ))
                fig_gauge.update_layout(height=300)
                st.plotly_chart(fig_gauge, use_container_width=True)
            
            with col2:
                st.subheader("🚨 Anomaly Detection")
                
                if is_anomaly[0]:
                    st.error("ANOMALY DETECTED!")
                    st.write(f"Anomaly Score: {anomaly_score[0]:.3f}")
                else:
                    st.success("Normal Operation")
                    st.write(f"Anomaly Score: {anomaly_score[0]:.3f}")
                
                # Anomaly score over time
                if len(self.historical_data) > 10:
                    recent_data = self.historical_data[-50:]
                    timestamps = [d['timestamp'] for d in recent_data]
                    
                    # Get anomaly scores for recent data
                    anomaly_scores = []
                    for data_point in recent_data:
                        try:
                            score, _ = self.model.detect_anomaly(data_point)
                            anomaly_scores.append(score[0])
                        except:
                            anomaly_scores.append(0)
                    
                    fig_anomaly = go.Figure()
                    fig_anomaly.add_trace(go.Scatter(
                        x=timestamps,
                        y=anomaly_scores,
                        mode='lines+markers',
                        name='Anomaly Score',
                        line=dict(color='red')
                    ))
                    fig_anomaly.update_layout(
                        title="Anomaly Score Trend",
                        xaxis_title="Time",
                        yaxis_title="Anomaly Score",
                        height=300
                    )
                    st.plotly_chart(fig_anomaly, use_container_width=True)
            
        except Exception as e:
            st.error(f"Error in predictive analysis: {e}")
    
    def maintenance_recommendations(self):
        """Provide maintenance recommendations"""
        if not self.latest_data:
            return
        
        st.subheader("🔧 Maintenance Recommendations")
        
        recommendations = []
        
        # Check various conditions
        if self.latest_data.get('Vibration_Level', 0) > 1.5:
            recommendations.append("⚠️ High vibration detected - Check bearing alignment")
        
        if self.latest_data.get('Temperature_Readings', 0) > 40:
            recommendations.append("🌡️ High temperature - Verify cooling system")
        
        if self.latest_data.get('Tool_Wear_Rate', 0) > 30:
            recommendations.append("🔧 High tool wear - Schedule tool replacement")
        
        if self.latest_data.get('Machine_Health_Index', 100) < 70:
            recommendations.append("📉 Low health index - Comprehensive inspection needed")
        
        if self.latest_data.get('degradation_factor', 1) > 1.5:
            recommendations.append("🔄 High degradation - Consider preventive maintenance")
        
        if recommendations:
            for rec in recommendations:
                st.warning(rec)
        else:
            st.success("✅ No immediate maintenance required")
    
    def run_dashboard(self):
        """Main dashboard interface"""
        st.markdown('<h1 class="main-header">🏭 Industrial Digital Twin Dashboard</h1>', 
                   unsafe_allow_html=True)
        
        # Connection status
        if self.is_connected:
            st.success("🔗 Connected to Digital Twin Simulator")
        else:
            st.error("❌ Not connected to simulator. Please start digital_twin_simulator.py")
        
        # Machine status
        if self.latest_data:
            status, status_type = self.get_machine_status(self.latest_data)
            if status_type == "danger":
                st.error(f"🚨 Machine Status: {status}")
            elif status_type == "warning":
                st.warning(f"⚠️ Machine Status: {status}")
            else:
                st.success(f"✅ Machine Status: {status}")
        
        # Tabs for different views
        tab1, tab2, tab3, tab4 = st.tabs(["📊 Real-Time Monitoring", "🔮 Predictive Analysis", 
                                         "🎛️ 3D Visualization", "🔧 Maintenance"])
        
        with tab1:
            st.header("Real-Time Sensor Data")
            self.create_real_time_charts()
        
        with tab2:
            st.header("Predictive Maintenance Analysis")
            self.predictive_maintenance_analysis()
        
        with tab3:
            st.header("3D Machine Visualization")
            self.create_3d_machine_visualization()
        
        with tab4:
            st.header("Maintenance Dashboard")
            self.maintenance_recommendations()
        
        # Auto-refresh
        time.sleep(2)
        st.rerun()

# Run the dashboard
if __name__ == "__main__":
    dashboard = DigitalTwinDashboard()
    dashboard.run_dashboard()
