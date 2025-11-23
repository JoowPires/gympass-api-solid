import { type Request, type Response } from "express";
import { z } from "zod";
import { PrismaCheckInsRepository } from "../repositories/prisma/prisma-check-ins-repository";
import { ValidateCheckInService } from "../services/validate-check-in.service";

export class ValidateCheckInController {
  async handle(req: Request, res: Response) {
    const validateCheckInParamsSchema = z.object({
      checkInId: z.string().uuid(),
    });

    const { checkInId } = validateCheckInParamsSchema.parse(req.params);

    const checkInsRepository = new PrismaCheckInsRepository();
    const validateCheckInService = new ValidateCheckInService(checkInsRepository);

    await validateCheckInService.execute({
      checkInId,
    });

    // 204 No Content: Deu certo, mas não preciso devolver nada.
    return res.status(204).send();
  }
}