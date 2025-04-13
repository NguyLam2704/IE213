import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Lấy token đúng định dạng "Bearer <token>"
    
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded); // Xem có _id đúng không
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is not valid", error: error.message });
    }
};

export default authMiddleware;
