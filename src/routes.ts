import { Router } from "express";
import { RegisterController } from "./controllers/register.controller";
import { ProfileController } from "./controllers/profile.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { verifyJwt } from "./middlewares/verify-jwt"; // Importe o middleware



export const router = Router();

const registerController = new RegisterController();

router.post("/users", registerController.handle.bind(registerController));


const authenticateController = new AuthenticateController();

// ... rota de users anterior
router.post("/sessions", authenticateController.handle.bind(authenticateController));

const profileController = new ProfileController();

// Rota Autenticada
// Olha como o 'verifyJwt' entra no meio
router.get("/me", verifyJwt, profileController.handle.bind(profileController));