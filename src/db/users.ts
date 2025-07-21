import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  auth0_id: { type: String, required: true },
});

const usersCollection = "users";
export const UserModel = mongoose.model("User", userSchema, usersCollection);
console.log(`Using collection: ${UserModel.collection.name}`);
console.log(`Namespace: ${UserModel.collection.namespace}`);

export const createUser = (values: Record<string, unknown>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const getUserByAuth0Id = (auth0Id: string) =>
  UserModel.findOne({ auth0_id: auth0Id });
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const getUsers = () => UserModel.find();
