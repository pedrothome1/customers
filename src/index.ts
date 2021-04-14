import { createConnection } from "typeorm";
import { Customer } from "./models/Customer";
import { City } from "./models/City";
import app from "./app";

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
  app.listen(3333, () => {
    console.log("Listening on http://localhost:3333");
  });
});
