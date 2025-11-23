import { type Gym } from "@prisma/client";
import { type GymsRepository } from "../repositories/gyms-repository";

interface CreateGymServiceRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymServiceResponse {
  gym: Gym;
}

export class CreateGymService {
  // Inversão de Dependência: Recebemos o contrato do repositório
  constructor(private gymsRepository: GymsRepository) {}
async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
    
  }: 
  // Aqui chamamos o método create do repositório.
    // Não precisamos fazer nenhuma mágica com a latitude/longitude.
    // O repositório e o Prisma cuidam da conversão para o banco.
    CreateGymServiceRequest): Promise<CreateGymServiceResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });
    return {
      gym,
    };
  }
}