import express from "express";
import { router } from "./routes"; // Garanta que existe o arquivo routes.ts na mesma pasta src

const app = express();

app.use(express.json());
app.use(router);

app.listen(3333, () => {
  console.log("🚀 Server rodando em http://localhost:3333");
});