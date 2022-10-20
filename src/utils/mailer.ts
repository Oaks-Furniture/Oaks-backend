import nodemailer, { SendMailOptions } from "nodemailer";
import { string } from "zod";
import logger from "./logger";
import config from "config";

const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>("smtp");

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass },
});

async function sendEmail(payload: SendMailOptions) {
  transporter.sendEmail(payload, (err, info) => {
    if (err) {
      logger.error(err, "error sending email");
      return;
    }
    logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
}

export default sendEmail;
