import { type Request, type Response } from "express";
import { z } from "zod";
import { PrismaGymsRepository } from "../repositories/prisma/prisma-gyms-repository";
import { CreateGymService } from "../services/create-gym.service";

export class CreateGymController {
  async handle(req: Request, res: Response) {
    const createGymBodySchema = z.object({
      title: z.string(),
      description: z.string().nullable(),
      phone: z.string().nullable(),
      // Validação personalizada:
      // Math.abs(value) pega o valor absoluto (tira o sinal de negativo).
      // Então -90 vira 90. Se for menor ou igual a 90, tá válido.
      latitude: z.number().refine((value) => {
        return Math.abs(value) <= 90;
      }),
      longitude: z.number().refine((value) => {
        return Math.abs(value) <= 180;
      }),
    });

    // O Zod parseia e valida. Se a lat for 91, ele explode erro aqui.
    const { title, description, phone, latitude, longitude } =
      createGymBodySchema.parse(req.body);

    // Fábrica: Instancia as dependências
    const gymsRepository = new PrismaGymsRepository();
    const createGymService = new CreateGymService(gymsRepository);

    await createGymService.execute({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    // 201 Created = Sucesso na criação
    return res.status(201).send();
  }
}