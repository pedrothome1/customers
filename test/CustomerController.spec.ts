import request from "supertest";
import moment from "moment";
import connection from "./util/connection";
import app from "../src/app";

describe("CustomerController", () => {
  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
  });

  it("should store a customer", async () => {
    const { body: city } = await request(app)
      .post("/city")
      .send({ name: "Santo Ângelo", state: "RS" });

    const response = await request(app)
      .post("/customer")
      .send({ name: "Pedro", gender: "M", birthdate: "1999-11-10", cityId: city.id });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining({
      name: "Pedro",
      gender: "M",
      birthdate: expect.stringContaining("1999-11-10"),
      age: moment().diff(moment([1999, 11, 10]), "years")
    }));
  });

  it("should validate customer data on creation", async () => {
    let response = await request(app)
      .post("/customer")
      .send({ name: "Pedro", gender: "M", birthdate: "1999-11-10", cityId: null });

    expect(response.status).toBe(400);

    response = await request(app)
      .post("/customer")
      .send({ name: "", gender: "M", birthdate: "1999-11-10", cityId: null });

    expect(response.status).toBe(400);

    response = await request(app)
      .post("/customer")
      .send({ name: "Pedro", gender: "", birthdate: "1999-11-10", cityId: null });

    expect(response.status).toBe(400);

    expect(response.status).toBe(400);

    response = await request(app)
      .post("/customer")
      .send({ name: "Pedro", gender: "M", birthdate: "", cityId: null });

    expect(response.status).toBe(400);
  });

  it("should update the name of the customer", async () => {
    const { body: city } = await request(app)
      .post("/city")
      .send({ name: "Santo Ângelo", state: "RS" });

    const { body: customer } = await request(app)
      .post("/customer")
      .send({ name: "Pedro", gender: "M", birthdate: "1999-11-10", cityId: city.id });

    let response = await request(app)
      .patch(`/customer/${customer.id}`)
      .send({ name: "Henrique" });

    expect(response.status).toBe(200);

    response = await request(app).get(`/customer/${customer.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      name: "Henrique"
    }));
  });

  it("should validate the customer name on update", async () => {
    const { body: city } = await request(app)
      .post("/city")
      .send({ name: "Santo Ângelo", state: "RS" });

    const { body: customer } = await request(app)
      .post("/customer")
      .send({ name: "Pedro", gender: "M", birthdate: "1999-11-10", cityId: city.id });

    const response = await request(app)
      .patch(`/customer/${customer.id}`)
      .send({ name: "" });

    expect(response.status).toBe(400);
  });

  it("should delete the given customer", async () => {
    const { body: city } = await request(app)
      .post("/city")
      .send({ name: "Santo Ângelo", state: "RS" });

    const { body: customer } = await request(app)
      .post("/customer")
      .send({ name: "Pedro", gender: "M", birthdate: "1999-11-10", cityId: city.id });

    let response = await request(app).delete(`/customer/${customer.id}`);

    expect(response.status).toBe(204);

    response = await request(app).get(`/customer?name=${customer.name}`);

    expect(response.body).toEqual([]);
  });

  it("should return a customer by id", async () => {
    const { body: city } = await request(app)
      .post("/city")
      .send({ name: "Santo Ângelo", state: "RS" });

    const { body: customer } = await request(app)
      .post("/customer")
      .send({ name: "Pedro", gender: "M", birthdate: "1999-11-10", cityId: city.id });

    const response = await request(app).get(`/customer/${customer.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({
      name: "Pedro",
      gender: "M",
      birthdate: expect.stringContaining("1999-11-10"),
      age: moment().diff(moment([1999, 11, 10]), "years")
    }));
  });

  it("should return the customers with the given name", async () => {
    const { body: city } = await request(app)
      .post("/city")
      .send({ name: "Santo Ângelo", state: "RS" });

    await request(app)
      .post("/customer")
      .send({ name: "Pedro", gender: "M", birthdate: "1999-11-10", cityId: city.id });

    await request(app)
      .post("/customer")
      .send({ name: "Pedro", gender: "M", birthdate: "1976-08-27", cityId: city.id });

    const response = await request(app).get("/customer?name=Pedro");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: "Pedro",
        gender: "M",
        birthdate: expect.stringContaining("1999-11-10"),
        age: moment().diff(moment([1999, 11, 10]), "years")
      }),
      expect.objectContaining({
        name: "Pedro",
        gender: "M",
        birthdate: expect.stringContaining("1976-08-27"),
        age: moment().diff(moment([1976, 8, 27]), "years")
      }),
    ]));
  });
});
