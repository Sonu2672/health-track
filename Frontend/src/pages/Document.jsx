import  { useState, useEffect } from 'react';
// import "../css/document.css";


function Document() {

  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);
  const [uploading, setUploading] = useState(false);

  // File select karne ka handler
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Fetch API ke zariye upload karne ka function
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Pehle file select kar bhai!');
      return;
    }

    const formData = new FormData();
    formData.append('document', file); // Multer ke 'document' field se match hona chahiye

    try {
      setUploading(true);
      
      // Native fetch API (Axios ki jagah)
      const response = await fetch('https://healthtrackb.onrender.com/api/upload/uploaddoc', {
        method: 'POST',
        credentials: 'include',
        body: formData,
        // Note: Jab FormData bhejte hain, toh 'Content-Type' header khud-b-khud browser set kar deta hai, isliye alag se likhne ki zarurat nahi hai.
      });

      const data = await response.json();

      if (data.success) {
        alert('Document successfully upload ho gaya!');
        // Naye file URL ko local state me add kar de taaki list me turant dikhe
        setReports([...reports, { name: file.name, url: data.fileUrl }]);
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

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h2>🏥 Patient Medical Dashboard</h2>
      
      {/* Upload Box */}
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Upload New Medical Report / PDF</h3>
        <input type="file" onChange={handleFileChange} accept=".pdf, .jpg, .png" />
        <button onClick={handleUpload} disabled={uploading} style={{ marginLeft: '10px', padding: '8px 15px' }}>
          {uploading ? 'Uploading...' : 'Upload Report'}
        </button>
      </div>

      {/* Uploaded Documents List */}
      <div>
        <h3>My Uploaded Documents</h3>
        {reports.length === 0 ? (
          <p>Abhi tak koi document upload nahi kiya gaya hai.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {reports.map((doc, index) => (
              <li key={index} style={{ background: '#fff', border: '1px solid #ddd', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '5px' }}>
                <span>📄 {doc.name}</span>
                <div>
                  {/* View Button */}
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ marginRight: '10px', textDecoration: 'none', background: '#007bff', color: 'white', padding: '5px 10px', borderRadius: '3px' }}>
                    View
                  </a>
                  {/* Download Button */}
                  <a href={doc.url} download style={{ textDecoration: 'none', background: '#28a745', color: 'white', padding: '5px 10px', borderRadius: '3px' }}>
                    Download
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    // </div>


  );
}




export default Document;
