import "reflect-metadata";
import express from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import { Customer } from "./models/Customer";
import { City } from "./models/City";
import routes from "./routes";

createConnection({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123456",
  database: "customers",
  synchronize: true,
  entities: [Customer, City]
}).then(() => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(routes);

  app.listen(3333, () => {
    console.log("Listening on http://localhost:3333");
  });
});
