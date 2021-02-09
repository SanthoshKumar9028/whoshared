import jwt from "jsonwebtoken";

export function blockUnauthorizedUser(req, res, next) {
  // console.log(req._user_);
  if (req._user_) return next();

  res.status(401);
  res.json({ username: "unauthorized user" });
}

export function authenticateUserForWS(request, next = () => {}) {
  let cookie = request.headers.cookie || "";
  let cookies = cookie.split(",").map((c) => c.trim().split("="));
  let jwttoken = cookies.find(([key]) => key === "jwt");
  if (jwttoken) {
    jwt.verify(jwttoken[1], process.env.JWT_SECRET, (err, decodedData) => {
      next(err, decodedData);
    });
  } else next(null);
}

export default function (req, res, next) {
  const cookies = req.cookies;
  req._user_ = null;

  if (cookies && cookies.jwt) {
    jwt.verify(cookies.jwt, process.env.JWT_SECRET, (err, decodedData) => {
      if (!err) req._user_ = decodedData;
      next();
    });
  } else next();
}
