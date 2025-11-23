import { type CheckIn, Prisma } from "@prisma/client";
import { type CheckInsRepository } from "../check-ins-repository";
import { prisma } from "../../lib/prisma";
import dayjs from "dayjs"; // Importe o dayjs

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    });
    return checkIn;
  }
  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        userId,
      },
    });

    return count;
  }

  // Implementação da busca por data
  async findByUserIdOnDate(userId: string, date: Date) {
    // 1. Pegar o começo do dia (00:00)
    const startOfTheDay = dayjs(date).startOf("date").toDate();
    // 2. Pegar o fim do dia (23:59)
    const endOfTheDay = dayjs(date).endOf("date").toDate();

    
    const checkIn = await prisma.checkIn.findFirst({
    where: {
        userId: userId,      // ✅ Certo (igual ao schema.prisma)
        createdAt: {         // ✅ Certo (igual ao schema.prisma)
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    });
    

    return checkIn;
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        userId,
      },
      take: 20, // Traz no máximo 20 itens
      skip: (page - 1) * 20, // Pula os itens das páginas anteriores
    });

    return checkIns;
  }
  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });
    return checkIn;
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data, // O Prisma é esperto: ele atualiza tudo que mudou no objeto
    });

    return checkIn;
  }
}
