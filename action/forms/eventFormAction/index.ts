"use server";

import { EventSchema } from "@/lib/formSchema";
import { prisma } from "@/lib/prisma";

type CurrentState = {
  success: boolean;
  error: boolean;
};

export const createEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  try {
    console.log(data);
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data?.classId || null,
      },
    });
    return { success: true, error: false };
  } catch (error) {
    console.log("Error in createEvent", error);
    return { success: false, error: true, message: "Error creating event" };
  }
};

export const updateEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  console.log(data);

  try {
    await prisma.event.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: data?.classId || null,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log("Error in updateEvent", error);
    return { success: false, error: true, message: "Error updating event" };
  }
};

export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData
) => {
  try {
    const id = parseInt(data.get("id") as string);

    await prisma.event.delete({
      where: {
        id,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log("Error in deleteEvent", error);
    return { success: false, error: true, message: "Error deleting event" };
  }
};
