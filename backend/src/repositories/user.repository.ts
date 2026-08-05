import prisma from "../config/prisma.js";
import type { RegisterDto } from "../types/dto.js";

export const createUser = async (data: RegisterDto) => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};
