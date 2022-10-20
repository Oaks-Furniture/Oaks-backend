import express, { Request, Response } from "express";
import user from "./user.routes";

const router = express.Router();
router.get("/ping", (req, res, next) =>
  res.status(200).json({ message: "pong" })
);
router.use(user);

export default router;
