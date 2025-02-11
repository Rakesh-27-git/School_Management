"use server";

import { AnnouncementSchema } from "@/lib/formSchema";
import { prisma } from "@/lib/prisma";

type CurrentState = {
  success: boolean;
  error: boolean;
};

export const createAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
  console.log(data);
  if (!data) {
    return { success: false, error: true, message: "Something went wrong!" };
  }
  try {
    await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data?.classId || null,
      },
    });

    return { success: true, error: false };
  } catch (error: any) {
    console.log("Error in createAnnouncement", (error as Error).message);
    return { success: false, error: true, message: error.message };
  }
};

export const updateAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
  console.log(data);
  if (!data) {
    return { success: false, error: true, message: "No data provided" };
  }
  try {
    await prisma.announcement.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: data?.classId || null,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log("Error in updateAnnouncement", (error as Error).message);
    return {
      success: false,
      error: true,
      message: "Error updating Announcement",
    };
  }
};

export const deleteAnnouncement = async (
  currentState: CurrentState,
  data: FormData
) => {
  console.log(data);
  const id = parseInt(data.get("id") as string);
  try {
    await prisma.announcement.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Error in deleteAnnouncement", (error as Error).message);
    return {
      success: false,
      error: true,
      message: "Error deleting Announcement",
    };
  }
};
