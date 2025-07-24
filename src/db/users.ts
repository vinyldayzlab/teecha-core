import mongoose from "mongoose";

export interface IUser extends Document {
  auth0_id: string;
  teacher_code: string;
}

const userSchema = new mongoose.Schema<IUser>({
  auth0_id: { type: String, required: true },
  teacher_code: { type: String },
});

const usersCollection = "users";
const UserModel = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model("User", userSchema, usersCollection);
export default UserModel;

export const createUser = (values: Record<string, unknown>) => new UserModel(values).save().then((user) => user.toObject());
export const getUserByAuth0Id = (auth0Id: string) => UserModel.findOne({ auth0_id: auth0Id }).lean();
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, add?: Record<string, unknown>, remove?: Record<string, unknown>) => UserModel.findByIdAndUpdate(id, { $set: add }, { $unset: remove }).then((user) => user?.toObject());
export const getUsers = () => UserModel.find();

// no front, tem que ter o "sou aluno" e "sou professor"

// sou professor
// userRegister in auth0 (role: teacher)
// if its ok, then createUser -> adds auth0 info in users collection.
// criar aluno no contrato -> adicionar o student_email e status PENDING

// - login
// -- tem cadastro
// --- tela de login
// -- nao tem
// --- aluno ou professor?
// ---- aluno -> codigo -> cadastro -> auth0 -> segue o jogo
// ---- professor -> tela de cadastro -> auth0 -> segue o jogo

// sou aluno
// você tem cadastro? se não, tela de validação do código do professor, se sim, login
// // se não: validateTeacherCode()
// // // se nao existe, avisar
// // // se existe o código
// // // // perguntar se tem cadastro ou nao tela de cadastro (se nao existir) ou login (se existir) -> pegar infos do aluno
// // // // // se nao tem cadastro, infos do aluno e validateContract(teacherCode, studentEmail)
// // // // // userRegister registra no auth0 (role: student) ou loga
// // // // // // (if User doesn't exist), userRegister registra no auth0 (role: student) e salva o auth0_id
// // // // // // (if user exists) existe um usuário. você deseja entrar como professor ou será um aluno de outro professor?
// se deu certo, login e boa
// se deu errado, tratar

// validateContract(teacherCode, studentEmail) vai estar no /contracts/validate
// // getTeacherIdByCode(teacherCode) -> pega o id do professor
// // validatePendingContract(teacherId, studentEmail)
// // // validate se tem um contrato do professor com um student_email == studentEmail
// // // se sim
// // // // activateContract(teacherId, StudentAuth0_id)
// // // // // atualiza o status do contrato pra ACTIVE, remove o student_email do contrato (já que as informações estarão no auth0)
// / /// // // se nao, retornar erro
// // // se nao, erro
