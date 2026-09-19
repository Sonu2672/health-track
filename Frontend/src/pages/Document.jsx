import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate import kiya
import '../css/document.css';

function Document() {
  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [msg,setMsg]=useState("");
  
  const navigate = useNavigate(); // Navigation hook initialize kiya

  // Page load hote hi database se documents fetch karne ke liye
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

  // File select karne ka handler
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload karne ka function
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Pehle file select kar bhai!');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);

    try {
      setUploading(true);
      
      const response = await fetch('https://healthtrackb.onrender.com/api/document/uploaddoc', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Document successfully upload ho gaya!');
        fetchDocuments(); // List ko turant refresh karne ke liye
        setFile(null);
      } else {
        alert('Upload fail ho gaya: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Server par upload karte waqt error aaya!');
    } finally {
      setUploading(false);
    }
  };

  // Modern Direct Download Function
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
      window.open(fileUrl, '_blank'); // Fallback agar blob fail ho
    }
  };

  return (
    <div className="doc-dashboard">
      {/* Top Header with Back Arrow & Title */}
      <div className="doc-header-nav" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate(-1)} // Ek step peeche jaane ke liye (-1)
          className="doc-back-btn"
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: '24px', 
            cursor: 'pointer', 
            marginRight: '15px',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Go Back"
        >
          ⬅️
        </button>
        <h2 style={{ margin: 0 }}>🏥 Patient Medical Documents</h2>
      </div>
      
      {/* Upload Box */}
      <div className="doc-upload-box">
        <h3>Upload New Medical Report / PDF</h3>
        <div className="doc-input-group">
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept=".pdf, .jpg, .png" 
            className="doc-file-input" 
          />
          <button 
            onClick={handleUpload} 
            disabled={uploading} 
            className="doc-upload-btn"
          >
            {uploading ? 'Uploading...' : 'Upload Report'}
          </button>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="doc-list-section">
        <h3>My Uploaded Documents</h3>
        {reports.length === 0 ? (
          <p className="doc-empty-text">{msg}</p>
        ) : (
          <ul className="doc-list">
            {reports.map((doc, index) => (
              <li key={index} className="doc-item">
                <span className="doc-file-name">📄 {doc.name}</span>
                <div className="doc-actions">
                  {/* View Button */}
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="doc-btn doc-btn-view"
                  >
                    View
                  </a>
                  
                  {/* Modern Download Button */}
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
// import '../css/document.css';

// function Document() {
//   const [file, setFile] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [uploading, setUploading] = useState(false);

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
//       <h2>🏥 Patient Medical Dashboard</h2>
      
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
//           <p className="doc-empty-text">Abhi tak koi document upload nahi kiya gaya hai.</p>
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



// import  { useState, useEffect } from 'react';
// import "../css/document.css";


// function Document() {

//   const [file, setFile] = useState(null);
//   const [reports, setReports] = useState([]);
//   const [uploading, setUploading] = useState(false);

// useEffect(() => {
//     fetchDocuments();
//   }, []);

//  const fetchDocuments = async () => {
//     try {
//       const response = await fetch('https://healthtrackb.onrender.com/api/document/getdoc', {
//         method: 'GET',
//         credentials: 'include', // Agar cookie/session auth use ho raha hai
//         headers: {
//           'Content-Type': 'application/json',
//           // Agar token-based auth (Bearer token) hai toh yahan Authorization header bhi aayega:
//           // 'Authorization': `Bearer ${token}`
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

//   // Fetch API ke zariye upload karne ka function
//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       alert('Pehle file select kar bhai!');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('document', file); // Multer ke 'document' field se match hona chahiye

//     try {
//       setUploading(true);
      
//       // Native fetch API (Axios ki jagah)
//       const response = await fetch('https://healthtrackb.onrender.com/api/document/uploaddoc', {
//         method: 'POST',
//         credentials: 'include',
//         body: formData,
//         // Note: Jab FormData bhejte hain, toh 'Content-Type' header khud-b-khud browser set kar deta hai, isliye alag se likhne ki zarurat nahi hai.
//       });

//       const data = await response.json();

//       if (data.success) {
//         alert('Document successfully upload ho gaya!');
//         // Naye file URL ko local state me add kar de taaki list me turant dikhe
//         setReports([...reports, { name: file.name, url: data.fileUrl }]);
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

//   return (
//     // <div style={{ padding: '30px', fontFamily: 'Arial' }}>
//     //   <h2>🏥 Patient Medical Dashboard</h2>
      
//     //   {/* Upload Box */}
//     //   <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
//     //     <h3>Upload New Medical Report / PDF</h3>
//     //     <input type="file" onChange={handleFileChange} accept=".pdf, .jpg, .png" />
//     //     <button onClick={handleUpload} disabled={uploading} style={{ marginLeft: '10px', padding: '8px 15px' }}>
//     //       {uploading ? 'Uploading...' : 'Upload Report'}
//     //     </button>
//     //   </div>

//     //   {/* Uploaded Documents List */}
//     //   <div>
//     //     <h3>My Uploaded Documents</h3>
//     //     {reports.length === 0 ? (
//     //       <p>Abhi tak koi document upload nahi kiya gaya hai.</p>
//     //     ) : (
//     //       <ul style={{ listStyle: 'none', padding: 0 }}>
//     //         {reports.map((doc, index) => (
//     //           <li key={index} style={{ background: '#fff', border: '1px solid #ddd', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '5px' }}>
//     //             <span>📄 {doc.name}</span>
//     //             <div>
//     //               {/* View Button */}
//     //               <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px', textDecoration: 'none', background: '#007bff', color: 'white', padding: '5px 10px', borderRadius: '3px' }}>
//     //                 View
//     //               </a>
//     //               {/* Download Button */}
//     //               <a href={doc.url} download style={{ textDecoration: 'none', background: '#28a745', color: 'white', padding: '5px 10px', borderRadius: '3px' }}>
//     //                 Download
//     //               </a>
//     //             </div>
//     //           </li>
//     //         ))}
//     //       </ul>
//     //     )}
//     //   </div>
//     // // </div>

//     <div className="doc-dashboard">
//       <h2>🏥 Patient Medical Dashboard</h2>
      
//       {/* Upload Box */}
//       <div className="doc-upload-box">
//         <h3>Upload New Medical Report / PDF</h3>
//         <div className="doc-input-group">
//           <input type="file" onChange={handleFileChange} accept=".pdf, .jpg, .png" className="doc-file-input" />
//           <button onClick={handleUpload} disabled={uploading} className="doc-upload-btn">
//             {uploading ? 'Uploading...' : 'Upload Report'}
//           </button>
//         </div>
//       </div>

//       {/* Uploaded Documents List */}
//       <div className="doc-list-section">
//         <h3>My Uploaded Documents</h3>
//         {reports.length === 0 ? (
//           <p className="doc-empty-text">Abhi tak koi document upload nahi kiya gaya hai.</p>
//         ) : (
//           <ul className="doc-list">
//             {reports.map((doc, index) => (
//               <li key={index} className="doc-item">
//                 <span className="doc-file-name">📄 {doc.name}</span>
//                 <div className="doc-actions">
//                   <a href={doc.url} target="_blank" rel="noopener noreferrer" className="doc-btn doc-btn-view">
//                     View
//                   </a>
//                   <a href={doc.url} download className="doc-btn doc-btn-download">
//                     Download
//                   </a>
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
