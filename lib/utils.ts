import { auth } from "@clerk/nextjs/server";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const { userId, sessionClaims } = await auth();
export const role = (sessionClaims?.metadata as { role?: string })?.role;
export const currentUserId = userId;
