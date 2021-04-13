import { Router } from "express";
import { celebrate, Segments, Joi as CelebrateJoi } from "celebrate";
import joi from "joi";
import JoiDate from "@joi/date";
import cityController from "./controllers/CityController";
import customerController from "./controllers/CustomerController";

const Joi: joi.Root = CelebrateJoi.extend(JoiDate);

const routes = Router();

routes.get(
  "/city",
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string().required()
    }
  }),
  cityController.getByName
);

routes.post(
  "/city",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      state: Joi.string().length(2).required()
    }
  }),
  cityController.store
);

routes.get(
  "/state/:state/city",
  celebrate({
    [Segments.PARAMS]: {
      state: Joi.string().length(2).required()
    }
  }),
  cityController.getByState
);

routes.get(
  "/customer/:id",
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required()
    }
  }),
  customerController.show
);

routes.get(
  "/customer",
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string().required()
    }
  }),
  customerController.getByName
);

routes.post(
  "/customer",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      gender: Joi.string().required(),
      birthdate: Joi.date().format("YYYY-MM-DD").less("now").required(),
      cityId: Joi.number().required(),
    }
  }),
  customerController.store,
);

routes.patch(
  "/customer/:id",
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required()
    },
    [Segments.BODY]: {
      name: Joi.string().required(),
    }
  }),
  customerController.updateName,
);

routes.delete(
  "/customer/:id",
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.number().required()
    },
  }),
  customerController.destroy
);

export default routes;
