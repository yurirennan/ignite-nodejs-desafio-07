import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User Tests", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to authenticate a user", async () => {
    await createUserUseCase.execute({
      name: "User test",
      email: "useremail@test.com",
      password: "12345"
    });

    const response = await authenticateUserUseCase.execute({
      email: "useremail@test.com",
      password: "12345",
    });

    expect(response).toHaveProperty("token")
    expect(response.user).toHaveProperty("id");
    expect(response.user.email).toEqual("useremail@test.com");
    expect(response.user.name).toEqual("User test");
  });

  it("Should not be able to authenticate a user if this user not exists", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "useremail@test.com",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate a user if the password is incorrect", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User test",
        email: "useremail@test.com",
        password: "12345"
      });

      await authenticateUserUseCase.execute({
        email: "useremail@test.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

})
