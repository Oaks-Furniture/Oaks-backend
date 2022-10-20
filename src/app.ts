import express from "express";
import config from "config";
import { property } from "lodash";
import connect from "./utils/connect";
import logger from "./utils/logger";
import router from "./routes";
import cors from "cors";

const port = config.get<number>("port");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(router);
/** API rules */
app.use((req, res, next) => {
  res.header("Access-COntrol-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, GET, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();
});
