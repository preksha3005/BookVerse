import jwt from "jsonwebtoken";

export const verifyuser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
  }

  try {
    const decode = jwt.verify(token, process.env.KEY);
    req.user = { id: decode.id, name: decode.name };
    console.log("Verified user:", req.user);
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res
      .status(403)
      .json({ message: "Access Denied: Invalid or expired token" });
  }
};
