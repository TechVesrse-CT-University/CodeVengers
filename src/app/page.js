"use client"
import { useState } from 'react';
import { Sprout, BarChart2, Search, Book, Users } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navigation Bar */}
      <nav className="bg-green-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sprout size={24} />
            <span className="text-xl font-bold">KisaanMitra</span>
          </div>
          
          <div className="hidden md:flex space-x-6">
            <Link href="/FarmerForm" className="hover:text-green-200">Crop Prediction</Link>
            <a href="#" className="hover:text-green-200">Weather Forecast</a>
            <a href="#" className="hover:text-green-200">About</a>
          </div>
          
          <div className="flex space-x-2">
            <button className="px-4 py-2 rounded bg-green-700 hover:bg-green-800">Log in</button>
            <button className="px-4 py-2 rounded bg-white text-green-600 hover:bg-green-100">Sign up</button>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="bg-green-600 py-16 px-4 text-center text-white relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">KisaanMitra Crop Prediction</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Making farming smarter with AI-powered crop recommendations based on soil, weather, and location data
          </p>
        </div>
        
        {/* Background circles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-white rounded-full"></div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto flex justify-center items-center overflow-x-auto">
          {[
            { id: 'home', label: 'Home' },
            { id: 'prediction', label: 'Prediction Tool' },
            { id: 'weather', label: 'Weather Insights' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`px-6 py-4 text-lg font-medium whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'text-green-600 border-b-2 border-green-600' 
                  : 'text-gray-600 hover:text-green-600'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-10">
          Smart Crop Prediction for Indian Farmers
        </h2>
        
        <div className="text-gray-700 mb-6 text-center max-w-4xl mx-auto">
          <p className="text-lg">
            KisaanMitra provides AI-powered crop recommendations based on <span className="font-semibold">soil conditions</span>, 
            <span className="font-semibold"> local weather patterns</span>, and <span className="font-semibold">geographical data</span> 
            to help farmers make informed decisions.
          </p>
        </div>
        
        {/* Quick Start */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-green-600 mb-6">Quick Start</h3>
          
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                <span>1</span>
              </div>
              <div>
                <p className="text-lg">
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Sign up for your free account
                  </button>
                  {' '}or try our{' '}
                  <a href="#" className="text-green-600 hover:underline">demo version</a>.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                <span>2</span>
              </div>
              <div>
                <p className="text-lg">Enter your farm location and soil parameters:</p>
                <div className="mt-3 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Location" className="p-2 border rounded" />
                    <input type="text" placeholder="Soil Type" className="p-2 border rounded" />
                    <input type="text" placeholder="Land Area (acres)" className="p-2 border rounded" />
                  </div>
                  <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Get Crop Recommendations
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-green-700 mb-10">Key Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <BarChart2 size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-2">AI-Powered Predictions</h4>
              <p className="text-gray-600">Get crop recommendations based on soil, weather, and local farming patterns</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <Search size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Detailed Crop Information</h4>
              <p className="text-gray-600">Access comprehensive database of crops, including growing techniques and market demand</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <Book size={32} />
              </div>
              <h4 className="text-xl font-semibold mb-2">Learning Resources</h4>
              <p className="text-gray-600">Educational content and tutorials to help farmers implement modern agricultural practices</p>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-green-700 mb-4">Ready to Revolutionize Your Farming?</h3>
          <p className="text-lg text-gray-600 mb-6">Join thousands of farmers across India who are using KisaanMitra</p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-green-800 text-white mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">KisaanMitra</h4>
              <p>Empowering farmers with technology and data-driven insights for better crop decisions.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Crop Prediction</a></li>
                <li><a href="#" className="hover:underline">Weather Forecast</a></li>
                <li><a href="#" className="hover:underline">Market Insights</a></li>
                <li><a href="#" className="hover:underline">Farming Guides</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">Tutorials</a></li>
                <li><a href="#" className="hover:underline">FAQ</a></li>
                <li><a href="#" className="hover:underline">Community</a></li>
                <li><a href="#" className="hover:underline">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>Email: info@kisaanmitra.com</li>
                <li>Phone: +91 1234567890</li>
                <li className="flex space-x-4 mt-4">
                  <a href="#" className="hover:text-green-300">Facebook</a>
                  <a href="#" className="hover:text-green-300">Twitter</a>
                  <a href="#" className="hover:text-green-300">Instagram</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-green-700 text-center">
              <p>© 2025 KisaanMitra. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
  );
}

