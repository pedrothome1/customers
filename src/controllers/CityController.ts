import { Request, Response } from "express";
import { City } from "../models/City";

class CityController {
  async getByState(request: Request, response: Response) {
    const state = request.params.state.toUpperCase();
    const cities = await City.find({ state });

    return response.json(cities);
  }

  async getByName(request: Request, response: Response) {
    const name = (request.query.name as string).toUpperCase();
    const city = await City.findOne({ name });

    if (!city) {
      return response.status(404).json({
        message: "City does not exists"
      });
    }

    return response.json(city);
  }

  async store(request: Request, response: Response) {
    const city = new City();
    city.name = request.body.name.toUpperCase();
    city.state = request.body.state.toUpperCase();

    await city.save();

    return response.status(201).json(city);
  }
}

export default new CityController();
