import jwt from "jsonwebtoken";
export const auth = (req, res, next) => 
{
const token = req.cookies.token;
console.log("token => ",token)

if (!token) {
  return res.status(401).json({
    message: "No token found"
  });
}


const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log("decoded" ,decoded);
 req.user = decoded;
 console.log("req.user",req.user);
  next();
};