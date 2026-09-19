import cloudinary from 'cloudinary';
import Document from '../model/document.js';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Koi file select nahi ki gayi hai!' });
    }

    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: 'patient_documents', resource_type: 'auto' },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ success: false, error: error.message });
        }

        try {
          const newDocument = await Document.create({
            fileName: req.file.originalname,
            fileUrl: result.secure_url,
            patientId: req.user.id
          });

          return res.status(200).json({
            success: true,
            message: 'Document successfully uploaded!',
            fileUrl: result.secure_url,
            document: newDocument
          });
        } catch (dbError) {
          return res.status(500).json({ success: false, error: dbError.message });
        }
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ patientId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, documents });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const analyzeMedicalReport = async (req, res) => {
  try {
    // Safety check for req.body
    if (!req.body || !req.body.fileUrl) {
      return res.status(400).json({ success: false, message: "File URL nahi mila!" });
    }

    const { fileUrl } = req.body;
    console.log("AI Analysis Request Received for URL:", fileUrl);

    // 1. Cloudinary URL se file fetch karein
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Cloudinary se file fetch nahi ho payi. Status: ${fileResponse.status}`);
    }

    const mimeType = fileResponse.headers.get('content-type') || 'image/jpeg';
    console.log("Detected MIME Type:", mimeType);

    const arrayBuffer = await fileResponse.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    
    console.log("Calling Gemini API...");

    // 2. Gemini Model Call
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        },
        {
          text: `You are an expert medical AI assistant. Analyze this medical report carefully. 
          Provide the output strictly in valid JSON format with these exact keys: 
          "summary", "keyFindings", "abnormalValues", and "recommendations".`
        }
      ]
    });

    console.log("Gemini API Response Received successfully.");

    return res.status(200).json({
      success: true,
      analysis: response.text
    });

  } catch (error) {
    console.error("DETAILED GEMINI ERROR:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Coming Soon...", 
      error: error.message 
    });
  }
};


// import cloudinary from 'cloudinary';
// import Document from '../model/document.js';
// import { GoogleGenAI } from '@google/genai';

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// // Cloudinary Configuration
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// export const uploadDocument = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Koi file select nahi ki gayi hai!' 
//       });
//     }

//     const uploadStream = cloudinary.v2.uploader.upload_stream(
//       { 
//         folder: 'patient_documents', 
//         resource_type: 'auto' 
//       },
//       async (error, result) => {
//         if (error) {
//           return res.status(500).json({ 
//             success: false, 
//             error: error.message 
//           });
//         }

//         try {
//           const newDocument = await Document.create({
//             fileName: req.file.originalname,
//             fileUrl: result.secure_url,
//             patientId: req.user.id
//           });

//           res.status(200).json({
//             success: true,
//             message: 'Document successfully Cloudinary par upload aur MongoDB me save ho gaya!',
//             fileUrl: result.secure_url,
//             publicId: result.public_id,
//             document: newDocument
//           });

//         } catch (dbError) {
//           res.status(500).json({
//             success: false,
//             error: 'Cloudinary par upload ho gaya, lekin Database me save karne me error aaya: ' + dbError.message
//           });
//         }
//       }
//     );

//     uploadStream.end(req.file.buffer);

//   } catch (err) {
//     res.status(500).json({ 
//       success: false, 
//       error: err.message 
//     });
//   }
// };

// export const getDocuments = async (req, res) => {
//   try {
//     const documents = await Document.find({ patientId: req.user.id }).sort({ createdAt: -1 });
//     res.status(200).json({ success: true, documents });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const analyzeMedicalReport = async (req, res) => {
//   try {
//     const { fileUrl } = req.body;
//     console.log("AI Analysis Request Received for URL:", fileUrl);

//     if (!fileUrl) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "File URL nahi mila!" 
//       });
//     }

//     // 1. Cloudinary URL se file fetch karein
//     const fileResponse = await fetch(fileUrl);
//     if (!fileResponse.ok) {
//       throw new Error(`Cloudinary se file fetch nahi ho payi. Status: ${fileResponse.status}`);
//     }

//     const mimeType = fileResponse.headers.get('content-type') || 'image/jpeg';
//     console.log("Detected MIME Type:", mimeType);

//     const arrayBuffer = await fileResponse.arrayBuffer();
//     const base64Data = Buffer.from(arrayBuffer).toString("base64");
    
//     console.log("Calling Gemini API...");

//     // 2. Gemini Model Call
//     const response = await ai.models.generateContent({
//       model: 'gemini-1.5-flash',
//       contents: [
//         {
//           inlineData: {
//             data: base64Data,
//             mimeType: mimeType
//           }
//         },
//         {
//           text: `You are an expert medical AI assistant. Analyze this medical report carefully. 
//           Provide the output strictly in valid JSON format with these exact keys: 
//           "summary", "keyFindings", "abnormalValues", and "recommendations".`
//         }
//       ]
//     });

//     console.log("Gemini API Response Received successfully.");

//     return res.status(200).json({
//       success: true,
//       analysis: response.text
//     });

//   } catch (error) {
//     console.error("DETAILED GEMINI ERROR:", error);
//     console.error("ERROR MESSAGE:", error.message);
//     console.error("ERROR STACK:", error.stack);
    
//     return res.status(500).json({ 
//       success: false, 
//       message: "AI analysis failed!", 
//       error: error.message,
//       details: error.toString()
//     });
//   }
// };




