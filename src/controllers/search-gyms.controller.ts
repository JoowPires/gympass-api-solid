import { type Request, type Response } from "express";
import { z } from "zod";
import { PrismaGymsRepository } from "../repositories/prisma/prisma-gyms-repository";
import { SearchGymsService } from "../services/search-gyms.service";

export class SearchGymsController {
  async handle(req: Request, res: Response) {
    const searchGymsQuerySchema = z.object({
      q: z.string(), // 'q' é o padrão para query de busca
      page: z.coerce.number().min(1).default(1),
    });

    const { q, page } = searchGymsQuerySchema.parse(req.query);

    const gymsRepository = new PrismaGymsRepository();
    const searchGymsService = new SearchGymsService(gymsRepository);

    const { gyms } = await searchGymsService.execute({
      query: q,
      page,
    });

    return res.status(200).send({
      gyms,
    });
  }
}