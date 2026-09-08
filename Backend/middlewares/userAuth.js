
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    console.log("🔥 TOKEN:", token);

    if (!token) {
      return res.status(401).json({
        message: "No token found"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("🔥 DECODED:", decoded);

    req.user = decoded;

    next();

  } catch (err) {
    console.error("❌ AUTH ERROR:", err);

    return res.status(401).json({
      message: "Invalid or expired token",
      error: err.message
    });
  }
}