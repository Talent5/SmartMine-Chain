import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score
import joblib
import warnings
warnings.filterwarnings('ignore')

class PredictiveMaintenanceModel:
    def __init__(self):
        self.fault_classifier = None
        self.anomaly_detector = None
        self.scaler = StandardScaler()
        self.feature_columns = None
        
    def prepare_features(self, df):
        """Prepare features for machine learning models"""
        # Select relevant numerical features
        feature_cols = [
            'Vibration_Level', 'Temperature_Readings', 'Pressure_Data',
            'Acoustic_Signals', 'Humidity_Levels', 'Motor_Speed',
            'Torque_Data', 'Energy_Consumption', 'Production_Rate',
            'Tool_Wear_Rate', 'Machine_Utilization_Rate', 'Cycle_Time_Per_Operation',
            'Idle_Time', 'Machine_Load_Percentage', 'Ambient_Temperature',
            'Humidity', 'Air_Quality_Index', 'Machine_Health_Index',
            'Predictive_Maintenance_Scores', 'Component_Degradation_Index',
            'Real_Time_Performance_Index', 'Anomaly_Scores', 'Fault_Probability'
        ]
        
        # Create additional engineered features
        df_features = df[feature_cols].copy()
        
        # Performance efficiency features
        df_features['Efficiency_Ratio'] = df['Production_Rate'] / (df['Energy_Consumption'] + 1)
        df_features['Temp_Pressure_Interaction'] = df['Temperature_Readings'] * df['Pressure_Data']
        df_features['Vibration_Acoustic_Ratio'] = df['Vibration_Level'] / (df['Acoustic_Signals'] + 1)
        
        # Health indicators
        df_features['Overall_Health_Score'] = (
            df['Machine_Health_Index'] * 0.4 +
            df['Real_Time_Performance_Index'] * 0.3 +
            (100 - df['Component_Degradation_Index']) * 0.3
        )
        
        # Operational stress indicators
        df_features['Operational_Stress'] = (
            df['Machine_Load_Percentage'] * df['Tool_Wear_Rate'] / 100
        )
        
        return df_features
    
    def train_models(self, df):
        """Train both fault prediction and anomaly detection models"""
        print("Preparing features...")
        X = self.prepare_features(df)
        y = df['Fault_Diagnosis']
        
        # Store feature columns for later use
        self.feature_columns = X.columns.tolist()
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train fault classifier
        print("Training fault classifier...")
        self.fault_classifier = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            class_weight='balanced'
        )
        self.fault_classifier.fit(X_train_scaled, y_train)
        
        # Evaluate fault classifier
        y_pred = self.fault_classifier.predict(X_test_scaled)
        print(f"Fault Classifier Accuracy: {accuracy_score(y_test, y_pred):.3f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        # Train anomaly detector on normal data only
        print("Training anomaly detector...")
        normal_data = X_train_scaled[y_train == 0]  # Assuming 0 = normal
        self.anomaly_detector = IsolationForest(
            contamination=0.1,
            random_state=42
        )
        self.anomaly_detector.fit(normal_data)
        
        # Feature importance
        feature_importance = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.fault_classifier.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nTop 10 Most Important Features:")
        print(feature_importance.head(10))
        
        return feature_importance
    
    def predict_fault(self, data):
        """Predict fault probability for new data"""
        if isinstance(data, dict):
            # Convert single prediction to DataFrame
            data = pd.DataFrame([data])
        
        # Ensure we have all required features
        X = self.prepare_features(data)
        X = X.reindex(columns=self.feature_columns, fill_value=0)
        
        # Scale and predict
        X_scaled = self.scaler.transform(X)
        fault_prob = self.fault_classifier.predict_proba(X_scaled)[:, 1]
        fault_pred = self.fault_classifier.predict(X_scaled)
        
        return fault_prob, fault_pred
    
    def detect_anomaly(self, data):
        """Detect anomalies in new data"""
        if isinstance(data, dict):
            data = pd.DataFrame([data])
        
        X = self.prepare_features(data)
        X = X.reindex(columns=self.feature_columns, fill_value=0)
        X_scaled = self.scaler.transform(X)
        
        anomaly_score = self.anomaly_detector.decision_function(X_scaled)
        is_anomaly = self.anomaly_detector.predict(X_scaled) == -1
        
        return anomaly_score, is_anomaly
    
    def save_models(self, path_prefix='models/digital_twin'):
        """Save trained models"""
        joblib.dump(self.fault_classifier, f'{path_prefix}_fault_classifier.pkl')
        joblib.dump(self.anomaly_detector, f'{path_prefix}_anomaly_detector.pkl')
        joblib.dump(self.scaler, f'{path_prefix}_scaler.pkl')
        joblib.dump(self.feature_columns, f'{path_prefix}_features.pkl')
        print(f"Models saved to {path_prefix}_*.pkl")
    
    def load_models(self, path_prefix='models/digital_twin'):
        """Load pre-trained models"""
        self.fault_classifier = joblib.load(f'{path_prefix}_fault_classifier.pkl')
        self.anomaly_detector = joblib.load(f'{path_prefix}_anomaly_detector.pkl')
        self.scaler = joblib.load(f'{path_prefix}_scaler.pkl')
        self.feature_columns = joblib.load(f'{path_prefix}_features.pkl')
        print("Models loaded successfully!")

if __name__ == "__main__":
    # Load and train models
    print("Loading dataset...")
    df = pd.read_csv('data/dataset.csv')
    
    # Convert datetime
    df['Datetime'] = pd.to_datetime(df['Datetime'])
    
    print(f"Dataset shape: {df.shape}")
    print(f"Fault distribution:\n{df['Fault_Diagnosis'].value_counts()}")
    
    # Initialize and train model
    model = PredictiveMaintenanceModel()
    feature_importance = model.train_models(df)
    
    # Save models
    import os
    os.makedirs('models', exist_ok=True)
    model.save_models()
    
    print("\nModel training completed successfully!")
