import { Router } from "express";
import { RegisterController } from "./controllers/register.controller";
import { ProfileController } from "./controllers/profile.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { verifyJwt } from "./middlewares/verify-jwt"; // Importe o middleware
import { CreateGymController } from "./controllers/create-gym.controller";
import { CheckInController } from "./controllers/check-in.controller";
import { FetchUserCheckInsHistoryController } from "./controllers/fetch-user-check-ins-history.controller";
import { GetUserMetricsController } from "./controllers/get-user-metrics.controller";
import { SearchGymsController } from "./controllers/search-gyms.controller";
import { FetchNearbyGymsController } from "./controllers/fetch-nearby-gyms.controller";
import { ValidateCheckInController } from "./controllers/validate-check-in.controller";

export const router = Router();
const createGymController = new CreateGymController();
const registerController = new RegisterController();
const checkInController = new CheckInController();
const profileController = new ProfileController();
const authenticateController = new AuthenticateController();
const fetchUserCheckInsHistoryController = new FetchUserCheckInsHistoryController();
const getUserMetricsController = new GetUserMetricsController();
const searchGymsController = new SearchGymsController();
const fetchNearbyGymsController = new FetchNearbyGymsController();
const validateCheckInController = new ValidateCheckInController();


router.get("/check-ins/history", verifyJwt, fetchUserCheckInsHistoryController.handle.bind(fetchUserCheckInsHistoryController));    
router.get("/check-ins/metrics", verifyJwt, getUserMetricsController.handle.bind(getUserMetricsController));
router.get("/gyms/nearby", verifyJwt, fetchNearbyGymsController.handle.bind(fetchNearbyGymsController)); // <--- AQUI
router.get("/gyms/search", verifyJwt, searchGymsController.handle.bind(searchGymsController));

router.post("/users", registerController.handle.bind(registerController));


// ... rota de users anterior
router.post("/sessions", authenticateController.handle.bind(authenticateController));
// Rota Autenticada
// Olha como o 'verifyJwt' entra no meio
router.get("/me", verifyJwt, profileController.handle.bind(profileController));
router.post("/gyms", verifyJwt, createGymController.handle.bind(createGymController));
// :gymId indica que essa parte da URL muda
router.post("/gyms/:gymId/check-ins", verifyJwt, checkInController.handle.bind(checkInController));

router.patch("/check-ins/:checkInId/validate", verifyJwt, validateCheckInController.handle.bind(validateCheckInController));