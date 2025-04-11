'use client';
import React, { useEffect, useState, } from 'react';
import { MapPin, Droplet, CloudRain, Crop, Phone, Leaf, Volume2 } from 'lucide-react';

const stateToLanguage = {
  "Maharashtra": "Marathi",
  "Tamil Nadu": "Tamil",
  "Karnataka": "Kannada",
  "West Bengal": "Bengali",
  "Uttar Pradesh": "Hindi",
  "Kerala": "Malayalam",
  "Gujarat": "Gujarati",
  "Telangana": "Telugu",
  "Punjab": "Punjabi",
  "Rajasthan": "Hindi",
  "Bihar": "Hindi",
  "Delhi": "Hindi",
};

const defaultLabels = {
  name: 'Name',
  state: 'State',
  district: 'District',
  lat: 'Latitude',
  lon: 'Longitude',
  soilType: 'Soil Type',
  soilPH: 'Soil PH',
  farmSize: 'Farm Size (Acres)',
  currentCrop: 'Current Crop',
  preferredCrop: 'Preferred Crop',
  budget: 'Budget (₹)',
  irrigationAvailable: 'Irrigation Available?',
  rainDependent: 'Rain Dependent?',
  language: 'Language',
  contactNumber: 'Contact Number',
  speechInput: 'Voice Input',
  formTitle: 'Farmer Information',
  locationSection: 'Location Details',
  farmSection: 'Farm Characteristics',
  cropSection: 'Crop Information',
  contactSection: 'Contact Information',
  submitButton: 'Get Crop Recommendations'
};

const langCodeMap = {
  Hindi: 'hi',
  Tamil: 'ta',
  Kannada: 'kn',
  Bengali: 'bn',
  Malayalam: 'ml',
  Telugu: 'te',
  Marathi: 'gu',
  Punjabi: 'pa',
  Marathi: 'mr',
  English: 'en'
};

const langCode = {
  Hindi: 'hi-IN',
  Bengali: 'bn-IN',
  Tamil: 'ta-IN',
  Telugu: 'te-IN',
  Marathi: 'mr-IN',
  Marathi: 'gu-IN',
  Kannada: 'kn-IN',
  Malayalam: 'ml-IN',
  Punjabi: 'pa-IN',
  English: 'en-US',
  // Add more as needed
};

const soilTypeOptions = [
  'Alluvial',
  'Black (Regur)',
  'Red & Yellow',
  'Laterite',
  'Arid/Desert',
  'Saline',
  'Peaty/Marshy',
  'Forest',
  'Loamy',
  'Sandy',
  'Clay',
  'Silt'
];

const FarmerForm = () => {
  const [language, setLanguage] = useState('English');
  const [labels, setLabels] = useState(defaultLabels);
  const [form, setForm] = useState({
    name: '',
    state: '',
    district: '',
    lat: '',
    lon: '',
    soilType: '',
    soilPH: '',
    farmSize: '',
    currentCrop: '',
    preferredCrop: '',
    budget: '',
    irrigationAvailable: false,
    rainDependent: false,
    language: '',
    contactNumber: '',
    speechInput: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const translateLabels = async (targetLangCode) => {
    if (targetLangCode === 'en') {
      setLabels(defaultLabels);
      return;
    }

    const textList = Object.values(defaultLabels);
    const translated = {};

    try {
      for (let i = 0; i < textList.length; i++) {
        const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${process.env.Google_Cloud_API}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: textList[i],
            source: "en",
            target: targetLangCode,
            format: "text"
          })
        });

        const data = await res.json();
        const key = Object.keys(defaultLabels)[i];
        translated[key] = data.data?.translations?.[0]?.translatedText || defaultLabels[key];
      }

      setLabels(translated);
    } catch (error) {
      console.error("Translation error:", error);
      setLabels(defaultLabels);
    }
  };

  const speakText = async (text) => {
    const lang = langCode[language] || 'en-US';
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.Google_TTS_API}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: lang,
            ssmlGender: "FEMALE", // or "MALE"
          },
          audioConfig: {
            audioEncoding: "MP3",
          },
        }),
      }
    );
  
    const data = await response.json();
  
    if (data.audioContent) {
      const audio = new Audio("data:audio/mp3;base64," + data.audioContent);
      audio.play();
    } else {
      console.error("TTS failed", data);
    }
  };

  // Field label component with speaker icon
  const FieldLabel = ({ htmlFor, text }) => (
    <div className="flex items-center justify-between mb-2">
      <label className="block text-gray-700 text-sm font-bold" htmlFor={htmlFor}>
        {text}
      </label>
      <button 
        type="button"
        onClick={() => speakText(text)}
        className={`p-1 rounded-full hover:bg-green-100 focus:outline-none transition ${isSpeaking ? 'text-green-600' : 'text-gray-500'}`}
        title="Listen to field name"
        aria-label={`Listen to ${text}`}
      >
        <Volume2 className="h-4 w-4" />
      </button>
    </div>
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setForm(prev => ({ ...prev, lat, lon }));

      try {
        const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${process.env.OpenCage_API}`);
        const data = await res.json();
        const state = data.results?.[0]?.components?.state;
        const district = data.results?.[0]?.components?.state_district;

        if (state) {
          const lang = stateToLanguage[state] || 'English';
          const langCode = langCodeMap[lang] || 'en';
          setForm(prev => ({ ...prev, state, district, language: lang }));
          setLanguage(lang);
          await translateLabels(langCode);
        }
      } catch (error) {
        console.error("Location error:", error);
      } finally {
        setIsLoading(false);
      }
    }, (error) => {
      console.error("Geolocation error:", error);
      setIsLoading(false);
    });

    // Cancel any ongoing speech when component unmounts
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form submission
    console.log("Form submitted:", form);
    // Here you would connect to your ML model for crop prediction
    alert("Form submitted successfully! Processing your crop recommendations...");
  };

  // Speak section title
  const SectionTitle = ({ icon, title }) => (
    <div className="flex items-center mb-4">
      {icon}
      <h2 className="text-xl font-semibold text-gray-800 ml-2">{title}</h2>
      <button 
        type="button"
        onClick={() => speakText(title)}
        className={`ml-2 p-1 rounded-full hover:bg-green-100 focus:outline-none transition ${isSpeaking ? 'text-green-600' : 'text-gray-500'}`}
        title={`Listen to ${title}`}
        aria-label={`Listen to ${title}`}
      >
        <Volume2 className="h-4 w-4" />
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
        <div className="w-16 h-16 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-green-800 font-medium">Detecting your location...</p>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 bg-green-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8" />
              <h1 className="text-2xl font-bold">{labels.formTitle}</h1>
            </div>
            <button
              type="button"
              onClick={() => speakText(labels.formTitle)}
              className={`p-2 rounded-full hover:bg-green-500 focus:outline-none transition ${isSpeaking ? 'bg-green-500' : ''}`}
              title="Listen to title"
              aria-label="Listen to title"
            >
              <Volume2 className="h-5 w-5 text-white" />
            </button>
          </div>
          <p className="mt-2 opacity-90">Fill in your details to get personalized crop recommendations</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Personal Info */}
          <div className="mb-6">
            <FieldLabel htmlFor="name" text={labels.name} />
            <input 
              type="text" 
              id="name"
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 transition" 
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Location Section */}
          <div className="border-t pt-6">
            <SectionTitle 
              icon={<MapPin className="h-5 w-5 text-green-600" />} 
              title={labels.locationSection} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="state" text={labels.state} />
                <input 
                  type="text" 
                  id="state"
                  name="state" 
                  value={form.state} 
                  readOnly 
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 bg-gray-100 leading-tight" 
                />
              </div>
              
              <div>
                <FieldLabel htmlFor="district" text={labels.district} />
                <input 
                  type="text" 
                  id="district"
                  name="district" 
                  value={form.district} 
                  readOnly 
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 bg-gray-100 leading-tight" 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <FieldLabel htmlFor="lat" text={labels.lat} />
                <input 
                  type="text" 
                  id="lat"
                  name="lat" 
                  value={form.lat} 
                  readOnly 
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 bg-gray-100 leading-tight" 
                />
              </div>
              
              <div>
                <FieldLabel htmlFor="lon" text={labels.lon} />
                <input 
                  type="text" 
                  id="lon"
                  name="lon" 
                  value={form.lon} 
                  readOnly 
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 bg-gray-100 leading-tight" 
                />
              </div>
            </div>
          </div>

          {/* Farm Characteristics */}
          <div className="border-t pt-6">
            <SectionTitle 
              icon={<Crop className="h-5 w-5 text-green-600" />} 
              title={labels.farmSection} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="soilType" text={labels.soilType} />
                <select
                  id="soilType"
                  name="soilType"
                  value={form.soilType}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 transition"
                  required
                >
                  <option value="">Select soil type</option>
                  {soilTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <FieldLabel htmlFor="soilPH" text={labels.soilPH} />
                <input 
                  type="number" 
                  id="soilPH"
                  name="soilPH" 
                  min="0"
                  max="14"
                  step="0.1"
                  value={form.soilPH} 
                  onChange={handleChange} 
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 transition" 
                  placeholder="e.g. 6.5"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4">
              <FieldLabel htmlFor="farmSize" text={labels.farmSize} />
              <input 
                type="number" 
                id="farmSize"
                name="farmSize" 
                min="0.1"
                step="0.1"
                value={form.farmSize} 
                onChange={handleChange} 
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 transition" 
                placeholder="Enter farm size in acres"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center p-4 border rounded bg-green-50">
                <input
                  type="checkbox"
                  id="irrigationAvailable"
                  name="irrigationAvailable"
                  checked={form.irrigationAvailable}
                  onChange={handleChange}
                  className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
                />
                <label className="ml-2 text-gray-700 flex-grow" htmlFor="irrigationAvailable">
                  <div className="flex items-center">
                    <Droplet className="h-4 w-4 text-green-600 mr-1" />
                    {labels.irrigationAvailable}
                  </div>
                </label>
                <button 
                  type="button"
                  onClick={() => speakText(labels.irrigationAvailable)}
                  className={`p-1 rounded-full hover:bg-green-100 focus:outline-none transition ${isSpeaking ? 'text-green-600' : 'text-gray-500'}`}
                  title={`Listen to ${labels.irrigationAvailable}`}
                  aria-label={`Listen to ${labels.irrigationAvailable}`}
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center p-4 border rounded bg-green-50">
                <input
                  type="checkbox"
                  id="rainDependent"
                  name="rainDependent"
                  checked={form.rainDependent}
                  onChange={handleChange}
                  className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
                />
                <label className="ml-2 text-gray-700 flex-grow" htmlFor="rainDependent">
                  <div className="flex items-center">
                    <CloudRain className="h-4 w-4 text-green-600 mr-1" />
                    {labels.rainDependent}
                  </div>
                </label>
                <button 
                  type="button"
                  onClick={() => speakText(labels.rainDependent)}
                  className={`p-1 rounded-full hover:bg-green-100 focus:outline-none transition ${isSpeaking ? 'text-green-600' : 'text-gray-500'}`}
                  title={`Listen to ${labels.rainDependent}`}
                  aria-label={`Listen to ${labels.rainDependent}`}
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Crop Information */}
          <div className="border-t pt-6">
            <SectionTitle 
              icon={<Leaf className="h-5 w-5 text-green-600" />} 
              title={labels.cropSection} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="currentCrop" text={labels.currentCrop} />
                <input 
                  type="text" 
                  id="currentCrop"
                  name="currentCrop" 
                  value={form.currentCrop} 
                  onChange={handleChange} 
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 transition" 
                  placeholder="What are you growing now?"
                />
              </div>
              
              <div>
                <FieldLabel htmlFor="preferredCrop" text={labels.preferredCrop} />
                <input 
                  type="text" 
                  id="preferredCrop"
                  name="preferredCrop" 
                  value={form.preferredCrop} 
                  onChange={handleChange} 
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 transition" 
                  placeholder="Any preferred crop? (optional)"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <FieldLabel htmlFor="budget" text={labels.budget} />
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">₹</span>
                </div>
                <input 
                  type="number" 
                  id="budget"
                  name="budget" 
                  min="0"
                  value={form.budget} 
                  onChange={handleChange} 
                  className="shadow appearance-none border rounded w-full py-3 pl-8 pr-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500 transition" 
                  placeholder="Your farming budget"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 flex items-center justify-center"
            >
              <Leaf className="h-5 w-5 mr-2" />
              {labels.submitButton}
            </button>
            <button
              type="button"
              onClick={() => speakText(labels.submitButton)}
              className="mt-2 mx-auto flex items-center text-green-600 hover:text-green-700 focus:outline-none"
            >
              <Volume2 className="h-4 w-4 mr-1" />
              <span className="text-sm">Listen</span>
            </button>
          </div>
        </form>
      </div>

      {/* Accessibility Information */}
      <div className="max-w-3xl mx-auto mt-6 px-4 py-3 bg-blue-50 rounded-lg text-blue-800 text-sm flex items-start">
        <div className="rounded-full bg-blue-100 p-1 mr-2 mt-0.5">
          <Volume2 className="h-4 w-4 text-blue-600" />
        </div>
        <p>Click on the speaker icon next to any field to hear its name spoken aloud. Speech is available in the selected language.</p>
      </div>
    </div>
  );
};

export default FarmerForm;