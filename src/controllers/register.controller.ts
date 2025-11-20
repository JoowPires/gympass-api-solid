import { type Request, type Response } from "express";
import { z, ZodError } from "zod"; // <--- Importe o ZodError
import { RegisterService } from "../services/register.service";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users-repository";

export class RegisterController {
  async handle(req: Request, res: Response) {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    });

    try {
      // MUDANÇA: A validação agora está DENTRO do try
      const { name, email, password } = registerBodySchema.parse(req.body);

      const usersRepository = new PrismaUsersRepository();
      const registerService = new RegisterService(usersRepository);

      await registerService.execute({
        name,
        email,
        password,
      });
    } catch (err) {
      // 1. Tratamento de Erro de Validação (Zod)
      if (err instanceof ZodError) {
        return res.status(400).send({
          message: "Validation error.",
          issues: err.format(), // Isso mostra exatamente qual campo está errado
        });
      }

      // 2. Tratamento de Erro de Negócio (Email duplicado)
      if (err instanceof Error && err.message === "User already exists.") {
        return res.status(409).send({ message: err.message });
      }

      // 3. Erro genérico
      console.error(err); // Loga no terminal para você ver o que houve
      return res.status(500).send({ message: "Internal server error." });
    }

    return res.status(201).send();
  }
}