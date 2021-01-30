import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const token = req.cookies.jwt;
  req._user_ = null;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedData) => {
      if (!err) req._user_ = decodedData;
      next();
    });
  }
  next();
}
