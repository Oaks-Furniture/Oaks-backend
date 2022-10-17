import { Express, Request, Response } from "express";

function routes(app: Express) {
  app.get("/ping", (req, res, next) =>
    res.status(200).json({ message: "pong" })
  );
}

export default routes;
