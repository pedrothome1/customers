import "reflect-metadata";
import express from "express";
import cors from "cors";
import { errors } from "celebrate";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import swaggerFile from "../swagger.json";
import routes from "./routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default app;
