import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/document.css';

function Document() {
  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);
  const [uploading, setUploading] = useState(false);
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
        alert('Report successfully upload ho gayi! AI Analysis shuru ho rahi hai...');
        fetchDocuments(); 
        
        // Yahan aap AI analysis page par bhej sakte hain with file URL
        // navigate('/ai-analysis', { state: { fileUrl: data.fileUrl } });
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
      processAndUploadFile(selectedFile); // File select hote hi upload & analyze trigger kar sakte hain
    }
  };

  // Direct Camera Capture Handler (Phone se photo khichne ke liye)
  const handleCameraCapture = (e) => {
    const capturedFile = e.target.files[0];
    if (capturedFile) {
      processAndUploadFile(capturedFile);
    }
  };

  const handleAiAnalysis = (docUrl, docName) => {
    alert(`Analyzing "${docName}" with AI... ✨`);
    // navigate('/ai-analysis', { state: { url: docUrl, name: docName } });
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
    </div>
  );
}

export default Document;


// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../css/document.css';

// function Document() {
//   const [file, setFile] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   const [analyzing, setAnalyzing] = useState(false);
  
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const fetchDocuments = async () => {
//     try {
//       const response = await fetch('https://healthtrackb.onrender.com/api/document/getdoc', {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       const data = await response.json();
//       if (data.success) {
//         const formattedReports = data.documents.map(doc => ({
//           name: doc.fileName,
//           url: doc.fileUrl
//         }));
//         setReports(formattedReports);
//       }
//     } catch (err) {
//       console.error('Documents fetch karne me error aaya:', err);
//     }
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   // Upload & Analyze function (Combined Flow)
//   const handleUploadAndAnalyze = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       alert('Pehle file select kar bhai!');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('document', file);

//     try {
//       setUploading(true);
      
//       const response = await fetch('https://healthtrackb.onrender.com/api/document/uploaddoc', {
//         method: 'POST',
//         credentials: 'include',
//         body: formData,
//       });

//       const data = await response.json();

//       if (data.success) {
//         alert('Document successfully upload ho gaya!');
//         fetchDocuments(); 
//         setFile(null);
        
//         // Yahan aap AI analysis page par redirect ya modal trigger kar sakte hain
//         // jaise: navigate('/ai-analysis', { state: { fileUrl: data.fileUrl } });
//       } else {
//         alert('Upload fail ho gaya: ' + data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Server par upload karte waqt error aaya!');
//     } finally {
//       setUploading(false);
//     }
//   };

//   // AI Analysis trigger for existing documents
//   const handleAiAnalysis = (docUrl, docName) => {
//     // Yahan aap AI analysis route par bhej sakte hain
//     // navigate('/ai-analysis', { state: { url: docUrl, name: docName } });
//     alert(`Analyzing "${docName}" with AI... Feature coming soon! ✨`);
//   };

//   const handleDownload = async (fileUrl, fileName) => {
//     try {
//       const response = await fetch(fileUrl);
//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);
      
//       const link = document.createElement('a');
//       link.href = blobUrl;
//       link.download = fileName || 'medical-report';
//       document.body.appendChild(link);
//       link.click();
      
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(blobUrl);
//     } catch (err) {
//       console.error('Download fail ho gaya:', err);
//       window.open(fileUrl, '_blank');
//     }
//   };

//   return (
//     <div className="doc-dashboard">
//       {/* Top Header */}
//       <div className="doc-header-nav" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
//         <button 
//           onClick={() => navigate(-1)} 
//           className="doc-back-btn"
//           style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '15px', display: 'flex', alignItems: 'center' }}
//           title="Go Back"
//         >
//           ⬅️
//         </button>
//         <h2 style={{ margin: 0 }}>🏥 Patient Medical Documents</h2>
//       </div>

//       {/* ✨ AI Health Assistant Banner / Upload Card */}
//       <div className="doc-ai-banner" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%)', padding: '20px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #c7d2fe' }}>
//         <h3 style={{ margin: '0 0 8px 0', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '6px' }}>
//           ✨ AI Health Assistant
//         </h3>
//         <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#4b5563' }}>
//           Upload your lab report or prescription to get instant AI-powered insights & summary.
//         </p>
        
//         <div className="doc-input-group" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
//           <input 
//             type="file" 
//             onChange={handleFileChange} 
//             accept=".pdf, .jpg, .png" 
//             className="doc-file-input"
//           />
//           <button 
//             onClick={handleUploadAndAnalyze} 
//             disabled={uploading} 
//             className="doc-upload-btn"
//             style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
//           >
//             {uploading ? 'Processing AI...' : '✨ Upload & Analyze Report'}
//           </button>
//         </div>
//       </div>
      
//       {/* Uploaded Documents List */}
//       <div className="doc-list-section">
//         <h3>My Uploaded Documents</h3>
//         {reports.length === 0 ? (
//           <p className="doc-empty-text">No reports found</p>
//         ) : (
//           <ul className="doc-list">
//             {reports.map((doc, index) => (
//               <li key={index} className="doc-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#fff', marginBottom: '10px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
//                 <span className="doc-file-name" style={{ fontWeight: '500' }}>📄 {doc.name}</span>
//                 <div className="doc-actions" style={{ display: 'flex', gap: '8px' }}>
//                   {/* AI Analysis Button for individual docs */}
//                   <button 
//                     onClick={() => handleAiAnalysis(doc.url, doc.name)}
//                     className="doc-btn doc-btn-ai"
//                     style={{ background: '#ede9fe', color: '#6d28d9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
//                   >
//                     ✨ AI Analyze
//                   </button>
                  
//                   <a 
//                     href={doc.url} 
//                     target="_blank" 
//                     rel="noopener noreferrer" 
//                     className="doc-btn doc-btn-view"
//                     style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '500' }}
//                   >
//                     View
//                   </a>
                  
//                   <button 
//                     onClick={() => handleDownload(doc.url, doc.name)} 
//                     className="doc-btn doc-btn-download"
//                     style={{ background: '#f3f4f6', color: '#374151', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
//                   >
//                     Download
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Document;










// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // useNavigate import kiya
// import '../css/document.css';

// function Document() {
//   const [file, setFile] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [uploading, setUploading] = useState(false);
//   // const [msg,setMsg]=useState("");
  
//   const navigate = useNavigate(); // Navigation hook initialize kiya

//   // Page load hote hi database se documents fetch karne ke liye
//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const fetchDocuments = async () => {
//     try {
//       const response = await fetch('https://healthtrackb.onrender.com/api/document/getdoc', {
//         method: 'GET',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });

//       const data = await response.json();
//       if (data.success) {
//         const formattedReports = data.documents.map(doc => ({
//           name: doc.fileName,
//           url: doc.fileUrl
//         }));
//         setReports(formattedReports);
//       }
//     } catch (err) {
//       console.error('Documents fetch karne me error aaya:', err);
//     }
//   };

//   // File select karne ka handler
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   // Upload karne ka function
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       alert('Pehle file select kar bhai!');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('document', file);

//     try {
//       setUploading(true);
      
//       const response = await fetch('https://healthtrackb.onrender.com/api/document/uploaddoc', {
//         method: 'POST',
//         credentials: 'include',
//         body: formData,
//       });

//       const data = await response.json();

//       if (data.success) {
//         alert('Document successfully upload ho gaya!');
//         fetchDocuments(); // List ko turant refresh karne ke liye
//         setFile(null);
//       } else {
//         alert('Upload fail ho gaya: ' + data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Server par upload karte waqt error aaya!');
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Modern Direct Download Function
//   const handleDownload = async (fileUrl, fileName) => {
//     try {
//       const response = await fetch(fileUrl);
//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);
      
//       const link = document.createElement('a');
//       link.href = blobUrl;
//       link.download = fileName || 'medical-report';
//       document.body.appendChild(link);
//       link.click();
      
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(blobUrl);
//     } catch (err) {
//       console.error('Download fail ho gaya:', err);
//       window.open(fileUrl, '_blank'); // Fallback agar blob fail ho
//     }
//   };

//   return (
//     <div className="doc-dashboard">
//       {/* Top Header with Back Arrow & Title */}
//       <div className="doc-header-nav" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
//         <button 
//           onClick={() => navigate(-1)} // Ek step peeche jaane ke liye (-1)
//           className="doc-back-btn"
//           style={{ 
//             background: 'none', 
//             border: 'none', 
//             fontSize: '24px', 
//             cursor: 'pointer', 
//             marginRight: '15px',
//             display: 'flex',
//             alignItems: 'center'
//           }}
//           title="Go Back"
//         >
//           ⬅️
//         </button>
//         <h2 style={{ margin: 0 }}>🏥 Patient Medical Documents</h2>
//       </div>
      
//       {/* Upload Box */}
//       <div className="doc-upload-box">
//         <h3>Upload New Medical Report / PDF</h3>
//         <div className="doc-input-group">
//           <input 
//             type="file" 
//             onChange={handleFileChange} 
//             accept=".pdf, .jpg, .png" 
//             className="doc-file-input" 
//           />
//           <button 
//             onClick={handleUpload} 
//             disabled={uploading} 
//             className="doc-upload-btn"
//           >
//             {uploading ? 'Uploading...' : 'Upload Report'}
//           </button>
//         </div>
//       </div>

//       {/* Uploaded Documents List */}
//       <div className="doc-list-section">
//         <h3>My Uploaded Documents</h3>
//         {reports.length === 0 ? (
//           <p className="doc-empty-text">No reports found</p>
//         ) : (
//           <ul className="doc-list">
//             {reports.map((doc, index) => (
//               <li key={index} className="doc-item">
//                 <span className="doc-file-name">📄 {doc.name}</span>
//                 <div className="doc-actions">
//                   {/* View Button */}
//                   <a 
//                     href={doc.url} 
//                     target="_blank" 
//                     rel="noopener noreferrer" 
//                     className="doc-btn doc-btn-view"
//                   >
//                     View
//                   </a>
                  
//                   {/* Modern Download Button */}
//                   <button 
//                     onClick={() => handleDownload(doc.url, doc.name)} 
//                     className="doc-btn doc-btn-download"
//                   >
//                     Download
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Document;






