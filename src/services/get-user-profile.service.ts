import { type UsersRepository } from "../repositories/users-repository";
import { type User } from "@prisma/client";

interface GetUserProfileServiceRequest {
  userId: string;
}

interface GetUserProfileServiceResponse {
  user: User;
}

export class GetUserProfileService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    // Como nosso repositório atual só busca por email, vamos ter que 
    // ADICIONAR um método novo no repositório depois.
    // Por enquanto, vamos assumir que vamos criar o 'findById'.
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new Error("Resource not found.");
    }

    return {
      user,
    };
  }
}