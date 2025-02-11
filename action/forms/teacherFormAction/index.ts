"use server";

import { TeacherSchema } from "@/lib/formSchema";
import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

type CurrentState = {
  success: boolean;
  error: boolean;
};

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const client = await clerkClient();
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" },
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    return { success: true, error: false };
  } catch (error: any) {
    console.log("Error in createTeacher", error);
    if (error.errors)
      console.log("Clerk Errors:", JSON.stringify(error.errors, null, 2));
    return { success: false, error: true, message: error.message };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  console.log(data)
  if (!data) {
    return { success: false, error: true, message: "No data provided" };
  }
  try {
    const client = await clerkClient();
    await client.users.updateUser(data.id!, {
      username: data.username,
      firstName: data.name,
      lastName: data.surname,
      ...(data.password !== "" && { password: data.password }),
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    return { success: true, error: false };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.error("Duplicate teacher name:", data.name);
        return {
          success: false,
          error: true,
          message: "Teacher already exists!",
        };
      }

      if (error.code === "P2025") {
        console.error("Teacher not found with ID:", data.id);
        return {
          success: false,
          error: true,
          message: "Teacher not found!",
        };
      }
    }
    console.log("Error in updateTeacher", (error as Error).message);
    return { success: false, error: true, message: "Error updating teacher" };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  console.log(data);
  const id = data.get("id") as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Error in deleteTeacher", (error as Error).message);
    return { success: false, error: true, message: "Error deleting teacher" };
  }
};
