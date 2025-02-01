import { auth } from "@clerk/nextjs/server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getCurrentUser() {
  try {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    return {
      currentUserId: userId,
      role,
    };
  } catch (error) {
    console.error("Auth error:", error);
    return {
      userId: null,
      role: null,
    };
  }
}
