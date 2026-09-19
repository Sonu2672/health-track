import cloudinary from 'cloudinary';
import Document from '../model/document.js'; // Model import kiya
const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini (Yeh automatically .env se GEMINI_API_KEY utha lega)
const ai = new GoogleGenAI();

// Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadDocument = async (req, res) => {
  try {
    // Check karo file aayi hai ya nahi
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Koi file select nahi ki gayi hai!' 
      });
    }

    // Cloudinary stream upload
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { 
        folder: 'patient_documents', 
        resource_type: 'auto' 
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ 
            success: false, 
            error: error.message 
          });
        }

        try {
          // MongoDB database me record save karna
          const newDocument = await Document.create({
            fileName: req.file.originalname,
            fileUrl: result.secure_url,
            patientId: req.user.id
          });

          // Success response with file URL & DB data
          res.status(200).json({
            success: true,
            message: 'Document successfully Cloudinary par upload aur MongoDB me save ho gaya!',
            fileUrl: result.secure_url,
            publicId: result.public_id,
            document: newDocument
          });

        } catch (dbError) {
          res.status(500).json({
            success: false,
            error: 'Cloudinary par upload ho gaya, lekin Database me save karne me error aaya: ' + dbError.message
          });
        }
      }
    );

    // Buffer end karke stream ko push kar do
    uploadStream.end(req.file.buffer);

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ patientId: req.user.id }).sort({ createdAt: -1 }); // Naye documents sabse upar
    res.status(200).json({ success: true, documents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};











const analyzeMedicalReport = async (req, res) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ 
        success: false, 
        message: "File URL nahi mila!" 
      });
    }

    // 1. Cloudinary URL se file fetch karke Base64 mein convert karein
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error("Cloudinary se file fetch karne mein fail ho gaya");
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    
    // 2. Check karein ki file PDF hai ya image
    const mimeType = fileUrl.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg';

    // 3. Gemini AI Model ko call karein
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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

    const aiTextOutput = response.text;

    // 4. Frontend ko JSON response bhej dein
    return res.status(200).json({
      success: true,
      analysis: aiTextOutput
    });

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "AI analysis fail ho gaya!", 
      error: error.message 
    });
  }
};









// import cloudinary from 'cloudinary';
// import Document from '../model/document.js'; // Model import kiya

// // Cloudinary Configuration
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// export const uploadDocument = async (req, res) => {
//   try {
//     // Check karo file aayi hai ya nahi
//     if (!req.file) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Koi file select nahi ki gayi hai!' 
//       });
//     }

//     // Cloudinary stream upload
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
//           // 👉 Yeh naya part hai: MongoDB database me record save karna
//           const newDocument = await Document.create({
//             fileName: req.file.originalname,
//             fileUrl: result.secure_url,
//             // publicId: result.public_id
//             patientId: req.user.id
//           });

//           // Success response with file URL & DB data
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

//     // Buffer end karke stream ko push kar do
//     uploadStream.end(req.file.buffer);

//   } catch (err) {
//     res.status(500).json({ 
//       success: false, 
//       error: err.message 
//     });
//   }










//   export const getDocuments = async (req, res) => {
//   try {
//     const documents = await Document.find({patientId:req.user.id}).sort({ createdAt: -1 }); // Naye documents sabse upar
//     res.status(200).json({ success: true, documents });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
// };



