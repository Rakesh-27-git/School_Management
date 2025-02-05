"use server";

import { SubjectSchema } from "@/lib/formSchema";
import { prisma } from "@/lib/prisma";

type CurrentState = {
  success: boolean;
  error: boolean;
};

import { Prisma } from "@prisma/client";

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    return { success: true, error: false };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 is the error code for unique constraint violation
      if (error.code === "P2002") {
        console.error("Duplicate subject name:", data.name);
        return {
          success: false,
          error: true,
          message: "Subject already exists!",
        };
      }
    }
    console.log("Error in createSubject", error);
    return { success: false, error: true, message: "Error creating subject" };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    return { success: true, error: false };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 is the error code for unique constraint violation
      if (error.code === "P2002") {
        console.error("Duplicate subject name:", data.name);
        return {
          success: false,
          error: true,
          message: "Subject already exists!",
        };
      }
      // P2025 means the record was not found (invalid ID)
      if (error.code === "P2025") {
        console.error("Subject not found with ID:", data.id);
        return {
          success: false,
          error: true,
          message: "Subject not found!",
        };
      }
    }
    console.log("Error in updateSubject", error);
    return { success: false, error: true, message: "Error updating subject" };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = parseInt(data.get("id") as string);

    await prisma.subject.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Error in deleteSubject", error);
    return { success: false, error: true, message: "Error deleting subject" };
  }
};
