import { type CheckIn } from "@prisma/client";
import { type CheckInsRepository } from "../repositories/check-ins-repository";
import { type GymsRepository } from "../repositories/gyms-repository"; // Importe o GymsRepo
import { getDistanceBetweenCoordinates } from "../utils/get-distance-between-coordinates";

interface CheckInServiceRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInServiceResponse {
  checkIn: CheckIn;
}

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository // <--- Agora precisamos desse repo também
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    // 1. Buscar a academia
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new Error("Resource not found.");
    }

    // 2. Calcular Distância
    // O Prisma retorna Decimal, precisamos converter para Number (.toNumber())
    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(), 
        longitude: gym.longitude.toNumber(),
      }
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1; // 100 metros

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new Error("Max distance reached.");
    }

    // 3. Validar data (Já estava aqui)
    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDate) {
      throw new Error("Max number of check-ins reached.");
    }

    const checkIn = await this.checkInsRepository.create({
      gymId,
      userId,
    });

    return {
      checkIn,
    };
  }
}