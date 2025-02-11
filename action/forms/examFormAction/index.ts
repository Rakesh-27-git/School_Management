"use server";

import { ExamSchema } from "@/lib/formSchema";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/utils";

type CurrentState = {
  success: boolean;
  error: boolean;
};

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  const { role, currentUserId } = await getCurrentUser();

  try {
    if (role === "teacher") {
      const teacherLessons = await prisma.lesson.findFirst({
        where: { teacherId: currentUserId!, id: data.lessonId },
      });

      if (!teacherLessons) {
        return {
          success: false,
          error: true,
          message: "You can only create exams for your own lessons",
        };
      }
    }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log("Error in createExam", error);
    return { success: false, error: true, message: "Error creating exam" };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  console.log(data);
  const { currentUserId } = await getCurrentUser();

  try {
    const teacherLessons = await prisma.lesson.findFirst({
      where: { teacherId: currentUserId!, id: data.lessonId },
    });

    if (!teacherLessons) {
      return {
        success: false,
        error: true,
        message: "You can only update exams for your own lessons",
      };
    }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log("Error in updateExam", error);
    return { success: false, error: true, message: "Error updating exam" };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = parseInt(data.get("id") as string);

    await prisma.exam.delete({
      where: {
        id,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log("Error in deleteExam", error);
    return { success: false, error: true, message: "Error deleting exam" };
  }
};
