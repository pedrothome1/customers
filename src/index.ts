import { createConnection } from "typeorm";
import { Customer } from "./models/Customer";
import { City } from "./models/City";
import app from "./app";

createConnection({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [Customer, City]
}).then(() => {
  app.listen(3333, () => {
    console.log("Listening on http://localhost:3333");
  });
});
