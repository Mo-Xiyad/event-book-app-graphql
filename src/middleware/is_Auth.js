import jwt from "jsonwebtoken";

const checkAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuthenticated = false;
    return next();
    // throw new Error("You are not authenticated!");
  }

  const token = authHeader.split(" ")[1]; // Authorization: Bearer token
  //   console.log(authHeader);
  if (!token || token === "") {
    req.isAuthenticated = false;
    return next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_SECRET_KEY);
  } catch (error) {
    req.isAuthenticated = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuthenticated = false;
    return next();
  }
  req.isAuthenticated = true;
  req.userId = decodedToken.userId;
  next();
};
export default checkAuth;
