import { createConnection, getConnection } from "typeorm";
import { City } from "../../src/models/City";
import { Customer } from "../../src/models/Customer";

const connection = {
  async create() {
    await createConnection({
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      entities: [Customer, City]
    });
  },

  async close() {
    await getConnection().close();
  },

  async clear() {
    const connection = getConnection();
    await connection.query('PRAGMA foreign_keys=OFF');

    const entities = connection.entityMetadatas;

    entities.forEach(async (entity) => {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });

    await connection.query('PRAGMA foreign_keys=ON');
  },
};

export default connection;
