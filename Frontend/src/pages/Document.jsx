
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/document.css';

function Document() {
  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  // AI Analysis States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const fileInputRef = useRef(null); // Hidden camera input ke liye reference
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('https://healthtrackb.onrender.com/api/document/getdoc', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      if (data.success) {
        const formattedReports = data.documents.map(doc => ({
          name: doc.fileName,
          url: doc.fileUrl
        }));
        setReports(formattedReports);
      }
    } catch (err) {
      console.error('Documents fetch karne me error aaya:', err);
    }
  };

  // Common upload & process function (Gallery ya Camera dono ke liye)
  const processAndUploadFile = async (selectedFile) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      setUploading(true);
      
      const response = await fetch('https://healthtrackb.onrender.com/api/document/uploaddoc', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Report successfully upload ho gayi!');
        fetchDocuments(); 
      } else {
        alert('Upload fail ho gaya: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Server par upload karte waqt error aaya!');
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  // Normal File Selector Handler
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      processAndUploadFile(selectedFile);
    }
  };

  // Direct Camera Capture Handler (Phone se photo khichne ke liye)
  const handleCameraCapture = (e) => {
    const capturedFile = e.target.files[0];
    if (capturedFile) {
      processAndUploadFile(capturedFile);
    }
  };

  // Real Gemini AI Analysis Handler
  const handleAiAnalysis = async (docUrl, docName) => {
    try {
      setAiLoading(true);
      setAiResult(null);
      
      const response = await fetch('https://healthtrackb.onrender.com/api/document/analyzeai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ fileUrl: docUrl })
      });

      const data = await response.json();
      
      if (data.success) {
        let parsedData;
        try {
          // AI ke markdown backticks ko clean karke JSON parse karna
          const cleanJson = data.analysis.replace(/```json/g, '').replace(/```/g, '').trim();
          parsedData = JSON.parse(cleanJson);
        } catch (e) {
          parsedData = { 
            summary: data.analysis, 
            keyFindings: [], 
            abnormalValues: [], 
            recommendations: "Disclaimer: This is an AI-generated analysis. Please consult a qualified doctor." 
          };
        }

        setAiResult({ name: docName, data: parsedData });
      } else {
        alert("Analysis failed: " + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error("AI Error:", err);
      alert("AI analysis server se connect nahi ho pa raha!");
    } finally {
      setAiLoading(false);
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || 'medical-report';
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download fail ho gaya:', err);
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div className="doc-dashboard">
      {/* Top Header */}
      <div className="doc-header-nav">
        <button onClick={() => navigate(-1)} className="doc-back-btn" title="Go Back">
          ⬅️
        </button>
        <h2>🏥 Patient Medical Documents</h2>
      </div>

      {/* ✨ AI Health Assistant Banner with Camera & Upload Options */}
      <div className="doc-ai-banner">
        <h3>✨ AI Health Assistant</h3>
        <p>
          Instant AI-powered insights & summary. Take a live photo of your prescription/report or upload a file.
        </p>
        
        <div className="doc-action-buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Option 1: Direct Camera Capture Button (Phone Only) */}
          <label className="doc-action-btn camera-btn" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: 'white', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}>
            📷 {uploading ? 'Processing...' : 'Take Photo & Analyze'}
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" /* Yeh attribute phone ka rear camera direct open karega */
              onChange={handleCameraCapture} 
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>

          {/* Option 2: Browse Existing File / PDF */}
          <label className="doc-action-btn upload-btn" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)' }}>
            📁 {uploading ? 'Uploading...' : 'Upload PDF / File'}
            <input 
              type="file" 
              onChange={handleFileChange} 
              accept=".pdf, .jpg, .png" 
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>

        </div>
      </div>
      
      {/* Uploaded Documents List */}
      <div className="doc-list-section">
        <h3>My Medical Documents</h3>
        {reports.length === 0 ? (
          <p className="doc-empty-text">No reports found</p>
        ) : (
          <ul className="doc-list">
            {reports.map((doc, index) => (
              <li key={index} className="doc-item">
                <span className="doc-file-name">📄 {doc.name}</span>
                <div className="doc-actions">
                  <button 
                    onClick={() => handleAiAnalysis(doc.url, doc.name)}
                    className="doc-btn doc-btn-ai"
                  >
                    ✨ AI Analyze
                  </button>
                  
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="doc-btn doc-btn-view"
                  >
                    View
                  </a>
                  
                  <button 
                    onClick={() => handleDownload(doc.url, doc.name)} 
                    className="doc-btn doc-btn-download"
                  >
                    Download
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* AI Analysis Loading Overlay */}
      {aiLoading && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🤖✨</div>
            <h3 style={{ margin: '0 0 5px 0', color: '#4f46e5' }}>AI is analyzing your report...</h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Please wait while the doctor assistant reads it.</p>
          </div>
        </div>
      )}

      {/* AI Result Popup Modal */}
      {aiResult && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✨ AI Report Insights
              </h3>
              <button onClick={() => setAiResult(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>✕</button>
            </div>

            <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 16px 0' }}>Report: <strong>{aiResult.name}</strong></p>

            {/* Summary */}
            <div style={{ background: '#f5f3ff', padding: '14px', borderRadius: '10px', marginBottom: '14px', borderLeft: '4px solid #7c3aed' }}>
              <h4 style={{ margin: '0 0 6px 0', color: '#6d28d9', fontSize: '14px' }}>📋 Summary</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>{aiResult.data.summary || aiResult.data.reportSummary}</p>
            </div>

            {/* Key Findings */}
            {aiResult.data.keyFindings && aiResult.data.keyFindings.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#1f2937', fontSize: '14px' }}>🔍 Key Findings</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563', fontSize: '14px' }}>
                  {aiResult.data.keyFindings.map((finding, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}>{finding}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {aiResult.data.recommendations && (
              <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '10px', marginBottom: '16px', borderLeft: '4px solid #10b981' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#047857', fontSize: '14px' }}>💡 Recommendations & Disclaimer</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#065f46', lineHeight: '1.5' }}>{aiResult.data.recommendations}</p>
              </div>
            )}

            <button 
              onClick={() => setAiResult(null)} 
              style={{ width: '100%', background: '#4f46e5', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              Close Insights
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Document;





