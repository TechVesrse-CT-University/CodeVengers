from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load model and preprocessors
model = joblib.load(r'xgboost_crop_model.pkl')
scaler = joblib.load(r'scaler.pkl')
label_encoder = joblib.load(r'label_encoder.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = np.array(data["features"]).reshape(1, -1)
    scaled = scaler.transform(features)
    prediction = model.predict(scaled)
    predicted_label = label_encoder.inverse_transform(prediction)
    return jsonify({"prediction": predicted_label[0]})

if __name__ == '__main__':
    app.run(debug=True)
