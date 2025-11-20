import { type Request, type Response } from "express";
import { z, ZodError } from "zod";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users-repository";
import { AuthenticateService } from "../services/authenticate.service";

export class AuthenticateController {
  async handle(req: Request, res: Response) {
    const authenticateBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    try {
      const { email, password } = authenticateBodySchema.parse(req.body);

      const usersRepository = new PrismaUsersRepository();
      const authenticateService = new AuthenticateService(usersRepository);

      // Recuperamos o token gerado pelo service
      const { token } = await authenticateService.execute({
        email,
        password,
      });

      // Retornamos o token para o usuário
      return res.status(200).send({ token });

    } catch (err) {
       if (err instanceof ZodError) {
        return res.status(400).send({ message: "Validation error.", issues: err.format() });
      }

      // Tratamento de erro Sólido
      // Não dizemos se foi senha ou email errado por segurança.
      if (err instanceof Error && err.message === "Invalid credentials.") {
        return res.status(400).send({ message: err.message });
      }

      return res.status(500).send({ message: "Internal server error." });
    }
  }
}