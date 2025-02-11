"use server";

import { LessonSchema } from "@/lib/formSchema";
import { prisma } from "@/lib/prisma";

type CurrentState = {
  success: boolean;
  error: boolean;
};

export const createLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
  console.log(data);
  try {
    await prisma.lesson.create({
      data: {
        name: data.name,
        day: data.day,
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log("Error in createLesson", (error as Error).message);
    return { success: false, error: true, message: "Error creating lesson" };
  }
};

export const updateLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
  console.log(data);

  try {
    await prisma.lesson.update({
      where: {
        id: data.id,
      },
      data,
    });

    return { success: true, error: false };
  } catch (error) {
    console.log("Error in updateLesson", error);
    return { success: false, error: true, message: "Error updating lesson" };
  }
};

export const deleteLesson = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = parseInt(data.get("id") as string);

    await prisma.lesson.delete({
      where: {
        id,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log("Error in deleteLesson", error);
    return { success: false, error: true, message: "Error deleting lesson" };
  }
};
