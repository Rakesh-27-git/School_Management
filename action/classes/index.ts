"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ITEM_PER_PAGE } from "@/constants";

export async function getClasses(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
) {
  const { page, ...queryParams } = await searchParams;
  const currentPage = page ? parseInt(page as string) : 1;

  const query: Prisma.ClassWhereInput = {};

  console.log(queryParams);

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "supervisorId":
            query.supervisorId = value as string;
            break;
          case "search":
            query.name = {
              contains: value as string,
              mode: "insensitive",
            };
            break;
          default:
            break;
        }
      }
    }
  }

  try {
    const [data, count] = await prisma.$transaction([
      prisma.class.findMany({
        where: query,
        include: {
          supervisor: true,
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (currentPage - 1),
      }),
      prisma.class.count({ where: query }),
    ]);

    return {
      data,
      count,
      currentPage,
    };
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return {
      data: [],
      count: 0,
      currentPage: 1,
    };
  }
}
