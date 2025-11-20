import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function verifyJwt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 1. Buscar o token no Header (Geralmente vem como "Bearer eyJ...")
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "Unauthorized." });
  }

  // 2. Separar o "Bearer" do token real
  const [, token] = authHeader.split(" "); 

  try {
    // 3. Verificar se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string || "ignitenode01");

    // 4. O TS reclamaria aqui se não tivéssemos feito a Tarefa 01
    const { sub } = decoded as { sub: string }; // 'sub' é onde guardamos o ID

    req.user = {
      id: sub,
    };

    // 5. Pode passar!
    next();
  } catch (err) {
    return res.status(401).send({ message: "Unauthorized." });
  }
}