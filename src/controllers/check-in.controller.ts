import { type Request, type Response } from "express";
import { z, ZodError } from "zod"; // Importe o ZodError aqui
import { PrismaCheckInsRepository } from "../repositories/prisma/prisma-check-ins-repository";
import { CheckInService } from "../services/check-in.service";
import { PrismaGymsRepository } from "../repositories/prisma/prisma-gyms-repository";

export class CheckInController {
  async handle(req: Request, res: Response) {
    const checkInParamsSchema = z.object({
      gymId: z.string().uuid(),
    });

    const checkInBodySchema = z.object({
      latitude: z.number().refine((value) => Math.abs(value) <= 90),
      longitude: z.number().refine((value) => Math.abs(value) <= 180),
    });

    try {
      const { gymId } = checkInParamsSchema.parse(req.params);
      const { latitude, longitude } = checkInBodySchema.parse(req.body);

      const checkInsRepository = new PrismaCheckInsRepository();
      const gymsRepository = new PrismaGymsRepository();
      const checkInService = new CheckInService(
      checkInsRepository,
      gymsRepository
    );

      await checkInService.execute({
        gymId,
        userId: req.user.id,
        userLatitude: latitude,
        userLongitude: longitude,
      });

      return res.status(201).send();

    } catch (err) {
        
      // 1. Tratamento de Erro de Validação (Zod)
      if (err instanceof ZodError) {
        return res.status(400).send({ 
            message: "Validation error.", 
            issues: err.format() 
        });
      }

      // ⬇️⬇️ AQUI ESTÁ A PARTE QUE VOCÊ ESTAVA PROCURANDO ⬇️⬇️
      // 2. Tratamento do Erro de Regra de Negócio (Check-in Duplo)
      if (err instanceof Error && err.message === "Max number of check-ins reached.") {
        return res.status(400).send({ message: err.message });

      }

      if (err instanceof Error && err.message === "Max distance reached.") {
        return res.status(400).send({ message: err.message });
        }
      // ⬆️⬆️ FIM DA PARTE NOVA ⬆️⬆️

      // 3. Erro Genérico (Se não for nenhum dos acima)
      console.error(err);
      return res.status(500).send({ message: "Internal server error." });
    }
  }
}