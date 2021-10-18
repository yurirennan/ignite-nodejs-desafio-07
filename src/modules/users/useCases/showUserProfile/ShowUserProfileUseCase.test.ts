import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile Tests", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to show a User Profile", async () => {
    const user = await createUserUseCase.execute({
      name: "User test",
      email: "User email test",
      password: "12345",
    });

    const userProfile = await showUserProfileUseCase.execute(user.id);

    expect(userProfile).toHaveProperty("id");
    expect(userProfile).toEqual(user);
  });

  it("Should not be able to show a user profile if the user not exists", async () => {
    expect(async () => {
      const id = "12345";

      await showUserProfileUseCase.execute(id);
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
