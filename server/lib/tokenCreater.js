import jwt from "jsonwebtoken";

export const maxAge = 60 * 60 * 24 * 3;

export function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: maxAge });
}
