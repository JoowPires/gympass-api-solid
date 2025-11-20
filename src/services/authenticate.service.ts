import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { type UsersRepository } from "../repositories/users-repository";

interface AuthenticateServiceRequest {
  email: string;
  password: string;
}

interface AuthenticateServiceResponse {
  token: string;
}

export class AuthenticateService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateServiceRequest): Promise<AuthenticateServiceResponse> {
    // 1. Buscar o usuário pelo e-mail
    const user = await this.usersRepository.findByEmail(email);

    // 2. Se não existir -> Erro
    if (!user) {
      throw new Error("Invalid credentials.");
    }

    // 3. Comparar a senha enviada com o Hash do banco
    // O .compare faz a mágica de ver se "123456" bate com "$2a$06$..."
    const doesPasswordMatch = await compare(password, user.password);

    if (!doesPasswordMatch) {
      throw new Error("Invalid credentials.");
    }

    // 4. Gerar o Token JWT
    const token = jwt.sign(
      {}, // Payload (dados extras, por enquanto vazio)
      process.env.JWT_SECRET as string || "ignitenode01", // A chave secreta
      {
        subject: user.id, // Quem é o dono do token? O ID do usuário.
        expiresIn: "7d", // O token vale por 7 dias
      }
    );

    return {
      token,
    };
  }
}