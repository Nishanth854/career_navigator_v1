import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

const ResumeUpload = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please upload a valid image file (JPG or PNG).");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Note: Using /api prefix because of the proxy in vite.config.js
      const response = await axios.post('/api/v1/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Pass the results back to the parent component (App.jsx)
      onAnalysisComplete(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Error uploading resume. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Student Valuation AI</h2>
        <p className="text-gray-500">Upload your resume to find matching internships</p>
      </div>

      <div 
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept="image/*"
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          {file ? (
            <CheckCircle className="w-12 h-12 text-green-500" />
          ) : (
            <Upload className="w-12 h-12 text-blue-500" />
          )}
          <p className="text-sm font-medium text-gray-600">
            {file ? file.name : "Drag and drop or click to upload resume image"}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
          !file || loading 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            AI is analyzing your profile...
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            Start Valuation
          </>
        )}
      </button>
    </div>
  );
};

export default ResumeUpload;