import request from "supertest";
import connection from "./util/connection";
import app from "../src/app";

describe("CityController", () => {
  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
  });

  it("should store a city", async () => {
    const response = await request(app)
      .post("/city")
      .send({ name: "Santo Ângelo", state: "RS" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining({
      name: "SANTO ANGELO",
      state: "RS"
    }));
  });

  it("should not store a duplicate city", async () => {
    await request(app)
      .post("/city")
      .send({ name: "Ijuí", state: "RS" });

    const response = await request(app)
      .post("/city")
      .send({ name: "Ijuí", state: "RS" });

    expect(response.status).toBe(400);
  });

  it("should validate the city data on creation", async () => {
    let response = await request(app)
      .post("/city")
      .send({ name: "", state: "RS" });

    expect(response.status).toBe(400);

    response = await request(app)
      .post("/city")
      .send({ name: "Ciríaco", state: "" });

    expect(response.status).toBe(400);

    response = await request(app)
      .post("/city")
      .send({ name: "", state: "" });

    expect(response.status).toBe(400);
  });

  it("should return a city by name", async () => {
    await request(app)
      .post("/city")
      .send({ name: "Santo Ângelo", state: "RS" });

    const response = await request(app).get("/city?name=Santo Ângelo");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      name: "SANTO ANGELO",
      state: "RS"
    }));
  });

  it("should return not found when the city does not exists", async () => {
    const response = await request(app).get("/city?name=Santo Ângelo");
    expect(response.status).toBe(404);
  });

  it("should return the cities of a given state", async () => {
    await request(app)
      .post("/city")
      .send({ name: "Porto Alegre", state: "RS" });

    await request(app)
      .post("/city")
      .send({ name: "Passo Fundo", state: "RS" });

    const response = await request(app).get("/state/RS/city");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "PORTO ALEGRE", state: "RS" }),
      expect.objectContaining({ name: "PASSO FUNDO", state: "RS" }),
    ]));
  });
});
