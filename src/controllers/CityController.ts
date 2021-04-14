import { Request, Response } from "express";
import deburr from "lodash/deburr";
import states from "../constants/states";
import { City } from "../models/City";

class CityController {
  async getByState(request: Request, response: Response) {
    const state = request.params.state.trim().toUpperCase();
    const cities = await City.find({ state });

    return response.json(cities);
  }

  async getByName(request: Request, response: Response) {
    const name = deburr((request.query.name as string).trim().toUpperCase());
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
    city.name = deburr(request.body.name.trim().toUpperCase());
    city.state = request.body.state.trim().toUpperCase();

    if (!states[city.state]) {
      return response.status(400).json({
        message: "Invalid state"
      });
    }

    if (await City.findOne({ name: city.name, state: city.state })) {
      return response.status(400).json({
        message: "City already exists"
      });
    }

    await city.save();

    return response.status(201).json(city);
  }
}

export default new CityController();
