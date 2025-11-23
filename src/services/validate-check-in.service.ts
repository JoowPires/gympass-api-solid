import { type CheckIn } from "@prisma/client";
import { type CheckInsRepository } from "../repositories/check-ins-repository";
import dayjs from "dayjs";

interface ValidateCheckInServiceRequest {
  checkInId: string;
}

interface ValidateCheckInServiceResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInServiceRequest): Promise<ValidateCheckInServiceResponse> {
    // 1. Buscar o check-in
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new Error("Resource not found.");
    }

    // 2. Calcular tempo passado (em minutos)
    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.createdAt,
      "minute"
    );

    // 3. Validar regra dos 20 minutos
    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new Error("The check-in can only be validated within 20 minutes of its creation.");
    }

    // 4. Atualizar data de validação para AGORA
    checkIn.validatedAt = new Date();

    // 5. Salvar no banco
    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}