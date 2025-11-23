import { type Request, type Response } from "express";
import { z } from "zod";
import { PrismaGymsRepository } from "../repositories/prisma/prisma-gyms-repository";
import { FetchNearbyGymsService } from "../services/fetch-nearby-gyms.service";

export class FetchNearbyGymsController {
  async handle(req: Request, res: Response) {
    const nearbyGymsQuerySchema = z.object({
      latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
      longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
    });

    const { latitude, longitude } = nearbyGymsQuerySchema.parse(req.query);

    const gymsRepository = new PrismaGymsRepository();
    const fetchNearbyGymsService = new FetchNearbyGymsService(gymsRepository);

    const { gyms } = await fetchNearbyGymsService.execute({
      userLatitude: latitude,
      userLongitude: longitude,
    });

    return res.status(200).send({
      gyms,
    });
  }
}