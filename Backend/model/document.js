import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Agar user login hai
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true }, // Yeh Cloudinary ka URL hoga
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('document', documentSchema);