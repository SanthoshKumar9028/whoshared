import bcrypt from "bcrypt";

export default async function hashPassword(password) {
  const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS));
  return await bcrypt.hash(password, salt);
}
