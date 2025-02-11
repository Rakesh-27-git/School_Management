"use server";

import { AssignmentSchema } from "@/lib/formSchema";
import { prisma } from "@/lib/prisma";

type CurrentState = {
  success: boolean;
  error: boolean;
};

export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  console.log(data);
  if (!data) {
    return { success: false, error: true, message: "Something went wrong!" };
  }
  try {
    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (error: any) {
    console.log("Error in createAssigment", (error as Error).message);
    return { success: false, error: true, message: error.message };
  }
};

export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  console.log(data);
  if (!data) {
    return { success: false, error: true, message: "No data provided" };
  }
  try {
    await prisma.assignment.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log("Error in updateAssignment", (error as Error).message);
    return {
      success: false,
      error: true,
      message: "Error updating Assignment",
    };
  }
};

export const deleteAssignment = async (
  currentState: CurrentState,
  data: FormData
) => {
  console.log(data);
  const id = parseInt(data.get("id") as string);
  try {
    await prisma.assignment.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Error in deleteAssignment", (error as Error).message);
    return {
      success: false,
      error: true,
      message: "Error deleting Assignment",
    };
  }
};
