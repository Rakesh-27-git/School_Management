"use server";

import { ClassSchema } from "@/lib/formSchema";
import { prisma } from "@/lib/prisma";

type CurrentState = {
  success: boolean;
  error: boolean;
};

import { Prisma } from "@prisma/client";

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.create({
      data,
    });

    return { success: true, error: false };
  } catch (error) {
    console.log("Error in createClass", error);
    return { success: false, error: true, message: "Error creating class" };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  console.log(data);
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    return { success: true, error: false };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.error("Duplicate class name:", data.name);
        return {
          success: false,
          error: true,
          message: "Class already exists!",
        };
      }

      if (error.code === "P2025") {
        console.error("Class not found with ID:", data.id);
        return {
          success: false,
          error: true,
          message: "Class not found!",
        };
      }
    }
    console.log("Error in updateClass", error);
    return { success: false, error: true, message: "Error updating class" };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = parseInt(data.get("id") as string);

    await prisma.class.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Error in deleteClass", error);
    return { success: false, error: true, message: "Error deleting class" };
  }
};
