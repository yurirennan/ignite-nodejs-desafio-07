import { User } from "@modules/users/entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User Tests", () => {
  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new User", async () => {
    const user = await createUserUseCase.execute({
      name: "User test",
      email: "User email test",
      password: "12345"
    });

    expect(user).toBeInstanceOf(User);
    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create a new User if already exists one with the same email", async() => {
    expect( async () => {
      await createUserUseCase.execute({
        name: "User test",
        email: "User email test",
        password: "12345"
      });

      await createUserUseCase.execute({
        name: "User test",
        email: "User email test",
        password: "12345"
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  })
})
