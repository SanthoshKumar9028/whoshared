import jwt from "jsonwebtoken";

export function blockUnauthorizedUser(req, res, next) {
  console.log(req._user_);
  if (req._user_) return next();

  res.status(401);
  res.json({ username: "unauthorized user" });
}

export default function (req, res, next) {
  const token = req.cookies.jwt;
  req._user_ = null;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedData) => {
      if (!err) req._user_ = decodedData;
      next();
    });
  } else next();
}
