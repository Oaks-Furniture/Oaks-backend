import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

const validate = (schema) => (req: Request, res: Response, NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
  } catch (e: any) {
    return res.status(400).send(e.errors);
  }
};

export default validate;
