import { type Request, type Response } from "express";
import { z } from "zod";
import { PrismaCheckInsRepository } from "../repositories/prisma/prisma-check-ins-repository";
import { FetchUserCheckInsHistoryService } from "../services/fetch-user-check-ins-history.service";

export class FetchUserCheckInsHistoryController {
  async handle(req: Request, res: Response) {
    const checkInsHistoryQuerySchema = z.object({
      // Se não mandar página, assume que é a 1.
      // O Zod transforma string "1" em number 1 (coerce).
      page: z.coerce.number().min(1).default(1), 
    });

    const { page } = checkInsHistoryQuerySchema.parse(req.query);

    const checkInsRepository = new PrismaCheckInsRepository();
    const fetchUserCheckInsHistoryService = new FetchUserCheckInsHistoryService(
      checkInsRepository
    );

    const { checkIns } = await fetchUserCheckInsHistoryService.execute({
      userId: req.user.id,
      page,
    });

    return res.status(200).send({
      checkIns,
    });
  }
}