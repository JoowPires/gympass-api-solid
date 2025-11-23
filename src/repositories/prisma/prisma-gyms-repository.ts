import { type Gym, Prisma } from "@prisma/client";
import { type GymsRepository } from "../gyms-repository";
import { prisma } from "../../lib/prisma";

export class PrismaGymsRepository implements GymsRepository {
  // Método que já existia
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    });

    return gym;
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    // O $queryRawUnsafe permite escrever SQL puro.
    // Estamos buscando academias onde a distância é menor que 10km.
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;

    return gyms;
  }


  // ⬇️⬇️ O MÉTODO QUE ESTAVA FALTANDO ⬇️⬇️
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    });
    return gym;
  }

 
  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query, // Busca academias que CONTÉM o texto
          // mode: 'insensitive', // (Opcional: ignorar maiúsculas/minúsculas, mas só funciona no Postgres Text Search)
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return gyms;
  }
}