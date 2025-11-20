import { type Request, type Response } from "express";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users-repository";
import { GetUserProfileService } from "../services/get-user-profile.service";

export class ProfileController {
  async handle(req: Request, res: Response) {
    const usersRepository = new PrismaUsersRepository();
    const getUserProfile = new GetUserProfileService(usersRepository);

    // A MÁGICA: O ID vem do middleware (req.user.id), não do corpo da requisição!
    const { user } = await getUserProfile.execute({
      userId: req.user.id,
    });

    // Hackzinho para tirar a senha do retorno (segurança)
    const userWithoutPassword = {
      ...user,
      password: undefined,
    };

    return res.status(200).send({
      user: userWithoutPassword,
    });
  }
}