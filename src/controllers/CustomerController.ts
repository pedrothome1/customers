import { Request, Response } from "express";
import { City } from "../models/City";
import { Customer } from "../models/Customer";

class CustomerController {
  async show(request: Request, response: Response) {
    const id = Number(request.params.id);
    const customer = await Customer.findOne({ id });

    if (!customer) {
      return response.status(404).json({
        message: "Customer does not exists"
      });
    }

    return response.json(customer);
  }

  async getByName(request: Request, response: Response) {
    const customers = await Customer.find({ name: request.query.name as string });
    return response.json(customers);
  }

  async store(request: Request, response: Response) {
    const city = await City.findOne({ id: request.body.cityId });

    if (!city) {
      return response.status(422).json({
        message: "City does not exists"
      });
    }

    const customer = new Customer();
    customer.name = request.body.name;
    customer.gender = request.body.gender;
    customer.birthdate = request.body.birthdate;
    customer.city = city;

    await customer.save();

    return response.status(201).json(customer);
  }

  async updateName(request: Request, response: Response) {
    const id = Number(request.params.id);
    const customer = await Customer.findOne({ id });

    if (!customer) {
      return response.status(404).json({
        message: "Customer does not exists"
      });
    }

    customer.name = request.body.name;

    await customer.save();

    return response.json(customer);
  }

  async destroy(request: Request, response: Response) {
    const id = Number(request.params.id);
    const customer = await Customer.findOne({ id });

    if (!customer) {
      return response.status(404).json({
        message: "Customer does not exists"
      });
    }

    await customer.remove();

    return response.status(204).send();
  }
}

export default new CustomerController();
