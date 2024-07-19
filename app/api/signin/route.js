import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = "your_jwt_secret"; // Replace with your actual secret key
export async function POST(req, res) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  return Response.json({
    message: "Signed in successfully",
    token,
    user: user,
  });
}
