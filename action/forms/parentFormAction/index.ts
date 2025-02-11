"use server";

import { ParentSchema } from "@/lib/formSchema";
import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = {
  success: boolean;
  error: boolean;
};

export const createParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  if (!data) {
    return { success: false, error: true, message: "Something went wrong!" };
  }
  try {
    const client = await clerkClient();
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "parent" },
    });

    await prisma.parent.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone || "",
        address: data.address,
        students: {
          connect: { id: data.studentId },
        },
      },
    });

    return { success: true, error: false };
  } catch (error: any) {
    console.log("Error in createParent", (error as Error).message);
    return { success: false, error: true, message: error.message };
  }
};

export const updateParent = async (
  currentState: CurrentState,
  data: ParentSchema
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

    await prisma.parent.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || "",
        address: data.address,
        students: {
          connect: { id: data.studentId },
        },
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.log("Error in updateParent", (error as Error).message);
    return { success: false, error: true, message: "Error updating parent" };
  }
};

export const deleteParent = async (
  currentState: CurrentState,
  data: FormData
) => {
  console.log(data);
  const id = data.get("id") as string;
  try {
    const client = await clerkClient();
    await client.users.deleteUser(id);

    await prisma.parent.delete({
      where: {
        id: id,
      },
    });

    return { success: true, error: false };
  } catch (error) {
    console.error("Error in deleteParent", (error as Error).message);
    return { success: false, error: true, message: "Error deleting parent" };
  }
};
