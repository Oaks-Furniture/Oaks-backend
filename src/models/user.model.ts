import {
  getModelForClass,
  prop,
  modelOptions,
  Severity,
  pre,
} from "@typegoose/typegoose";
import argon2 from "argon2";
import { nanoid } from "nanoid";

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const hash = await argon2.hash(this.password);
  this.password = hash;
  return;
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowedMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  @prop({ required: true })
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (e) {
      log.error(e, "Could not verify password");
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;

// import mongoose from "mongoose";
// import bcrypt from "bcrypt";
// import config from "config";

// export interface UserDocument extends mongoose.Document {
//   email: string;
//   name: string;
//   password: string;
//   createdAt: Date;
//   updatedAt: Date;
//   comparepassword(candidatePasswword: string): Promise<Boolean>;
// }

// const userSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, unique: true },
//     name: { type: String, required: true },
//     password: { type: String, required: true },
//   },
//   {
//     timestamps: true,
//   }
// );

// userSChema.pre("save", async function (next) {
//   let user = this as UserDocument;
//   if (!user.isModified("password")) {
//     return next();
//   }

//   const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

//   const hash = await bcrypt.hashSync(user.password, salt);

//   user.password = hash;

//   return next();
// });

// userSchema.methods.comparePassword = async function (
//   candidatePasswword: string
// ): Promise<boolean> {
//   const user = this as UserDocument;

//   return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
// };
// const UserModel = mongoose.model("User", userSchema);

// export default UserModel;
