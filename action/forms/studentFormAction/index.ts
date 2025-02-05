"use server";

import { StudentSchema } from "@/lib/formSchema";
import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

type CurrentState = {
  success: boolean;
  error: boolean;
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log(data);
  if (!data) {
    return { success: false, error: true, message: "Something went wrong!" };
  }
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true, message: "Class is full" };
    }

    const client = await clerkClient();
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    return { success: true, error: false };
  } catch (error: any) {
    console.log("Error in createStudent", (error as Error).message);
    return { success: false, error: true, message: error.message };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log(data);
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

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.error("Duplicate student name:", data.name);
        return {
          success: false,
          error: true,
          message: "Student already exists!",
        };
      }
    }
    console.log("Error in updateStudent", error);
    return { success: false, error: true, message: "Error updating student" };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  console.log(data);
  const id = data.get("id") as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Error in deleteStudent", (error as Error).message);
    return { success: false, error: true, message: "Error deleting student" };
  }
};
