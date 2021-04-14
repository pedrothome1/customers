import { Request, Response } from "express";
import deburr from "lodash/deburr";
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
    const customers = await Customer.find({
      name: deburr((request.query.name as string).trim().toUpperCase())
    });

    return response.json(customers);
  }

  async store(request: Request, response: Response) {
    const city = await City.findOne({ id: Number(request.body.cityId) });

    if (!city) {
      return response.status(400).json({
        message: "City does not exists"
      });
    }

    const customer = new Customer();
    customer.name = deburr(request.body.name.trim().toUpperCase());
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

    customer.name = deburr(request.body.name.trim().toUpperCase());

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
