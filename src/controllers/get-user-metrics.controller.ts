import { type Request, type Response } from "express";
import { PrismaCheckInsRepository } from "../repositories/prisma/prisma-check-ins-repository";
import { GetUserMetricsService } from "../services/get-user-metrics.service";

export class GetUserMetricsController {
  async handle(req: Request, res: Response) {
    const checkInsRepository = new PrismaCheckInsRepository();
    const getUserMetricsService = new GetUserMetricsService(checkInsRepository);

    const { checkInsCount } = await getUserMetricsService.execute({
      userId: req.user.id,
    });

    return res.status(200).send({
      checkInsCount,
    });
  }
}