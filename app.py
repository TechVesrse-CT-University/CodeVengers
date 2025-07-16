from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load saved model & preprocessors
model = joblib.load('xgboost_crop_model.pkl')
scaler = joblib.load('scaler.pkl')
state_label_encoder = joblib.load('state_label_encoder.pkl')
label_encoder = joblib.load('label_encoder.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features_dict = data["features"]

    print("Received features:", features_dict)

    # ⚠ use same order & replace 'State' with encoded value
    feature_order = [
        'lat', 'lon', 'temperature', 'humidity', 'pressure', 'wind_speed', 'aqi',
        'State_encoded',
        'Avg_Temperature', 'Avg_Rainfall', 'Avg_Radiation', 'Avg_Humidity', 'Avg_Wind_Speed',
        'pH', 'Organic_Carbon', 'Nitrogen', 'Bulk_Density', 'Cation_Exchange',
        'Sand', 'Silt', 'Clay'
    ]

    # Encode state
    state_value = state_label_encoder.transform([features_dict['State']])[0]

    # Build list in correct order
    features_list = [
        features_dict['lat'],
        features_dict['lon'],
        features_dict['temperature'],
        features_dict['humidity'],
        features_dict['pressure'],
        features_dict['wind_speed'],
        features_dict['aqi'],
        state_value,
        features_dict['Avg_Temperature'],
        features_dict['Avg_Rainfall'],
        features_dict['Avg_Radiation'],
        features_dict['Avg_Humidity'],
        features_dict['Avg_Wind_Speed'],
        features_dict['pH'],
        features_dict['Organic_Carbon'],
        features_dict['Nitrogen'],
        features_dict['Bulk_Density'],
        features_dict['Cation_Exchange'],
        features_dict['Sand'],
        features_dict['Silt'],
        features_dict['Clay']
    ]

    print("Final feature list for model:", features_list)

    scaled = scaler.transform([features_list])
    prediction = model.predict(scaled)
    predicted_label = label_encoder.inverse_transform(prediction)
    print("Predicted label:", predicted_label[0])

    return jsonify({"prediction": predicted_label[0]})

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)



