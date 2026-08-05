import { ApiError } from "../utils/apiError.js";
import { createUser, findUserByEmail } from "../repositories/user.repository.js";
import type { LoginDto, RegisterDto } from "../types/dto.js";

export const registerUser = async (input: RegisterDto) => {
  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await createUser({
    name: input.name,
    email: input.email,
    password: `hashed-${input.password}`,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
};

export const loginUser = async (input: LoginDto) => {
  const user = await findUserByEmail(input.email);

  if (!user || user.password !== `hashed-${input.password}`) {
    throw new ApiError(401, "Invalid credentials");
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessToken: "jwt-token-placeholder",
  };
};
