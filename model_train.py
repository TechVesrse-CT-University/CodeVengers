import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder, StandardScaler
from xgboost import XGBClassifier

# Load data
df = pd.read_csv('D:/Documents/crop_dataset.csv')   # adjust path if needed

# Encode 'State'
state_label_encoder = LabelEncoder()
df['State_encoded'] = state_label_encoder.fit_transform(df['State'])

# Encode target label 'Crop'
label_encoder = LabelEncoder()
df['Crop_encoded'] = label_encoder.fit_transform(df['Crop'])

# Define feature list (replace 'State' with encoded column)
feature_cols = [
    'lat', 'lon', 'temperature', 'humidity', 'pressure', 'wind_speed', 'aqi',
    'State_encoded',
    'Avg_Temperature', 'Avg_Rainfall', 'Avg_Radiation', 'Avg_Humidity', 'Avg_Wind_Speed',
    'pH', 'Organic Carbon', 'Nitrogen', 'Bulk Density', 'Cation Exchange',
    'Sand', 'Silt', 'Clay'
]

# Prepare X and y
X = df[feature_cols]
y = df['Crop_encoded']

# Scale X
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train model
model = XGBClassifier()
model.fit(X_scaled, y)

# Save model and preprocessors
joblib.dump(model, 'xgboost_crop_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(state_label_encoder, 'state_label_encoder.pkl')
joblib.dump(label_encoder, 'label_encoder.pkl')


