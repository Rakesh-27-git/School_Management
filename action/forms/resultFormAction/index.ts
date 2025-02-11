"use server";

import { ResultSchema } from "@/lib/formSchema";
import { prisma } from "@/lib/prisma";

type CurrentState = {
  success: boolean;
  error: boolean;
};

export const createResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  if (!data) {
    return { success: false, error: true, message: "Something went wrong!" };
  }
  try {
    console.log(data);
    await prisma.result.create({
      data: {
        score: data.score,
        examId: data?.examId || null,
        assignmentId: data?.assignmentId || null,
        studentId: data.studentId,
      },
    });

    return { success: true, error: false };
  } catch (error: any) {
    console.log("Error in createResult", (error as Error).message);
    return { success: false, error: true, message: error.message };
  }
};

export const updateResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  console.log(data);
  if (!data) {
    return { success: false, error: true, message: "No data provided" };
  }
  try {
    await prisma.result.update({
      where: {
        id: data.id,
      },
      data: {
        score: data.score,
        examId: data?.examId || null,
        assignmentId: data?.assignmentId || null,
        studentId: data.studentId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log("Error in updateResult", (error as Error).message);
    return { success: false, error: true, message: "Error updating result " };
  }
};

export const deleteResult = async (
  currentState: CurrentState,
  data: FormData
) => {
  console.log(data);
  const id = parseInt(data.get("id") as string);
  try {
    await prisma.result.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Error in deleteResult", (error as Error).message);
    return { success: false, error: true, message: "Error deleting result" };
  }
};
