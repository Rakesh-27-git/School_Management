"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ITEM_PER_PAGE } from "@/constants";

export async function getLessons(searchParams: {
  [key: string]: string | undefined;
}) {
  const { page, ...queryParams } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;

  const query: Prisma.LessonWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.classId = parseInt(value);
            break;
          case "teacherId":
            query.teacherId = value;
            break;
          case "search":
            query.OR = [
              {
                subject: {
                  name: {
                    contains: value,
                    mode: "insensitive",
                  },
                },
              },
              {
                teacher: {
                  name: {
                    contains: value,
                    mode: "insensitive",
                  },
                },
              },
            ];
            break;
          default:
            break;
        }
      }
    }
  }

  try {
    const [data, count] = await prisma.$transaction([
      prisma.lesson.findMany({
        where: query,
        include: {
          teacher: { select: { name: true, surname: true } },
          subject: { select: { name: true } },
          class: { select: { name: true } },
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (currentPage - 1),
      }),
      prisma.lesson.count({ where: query }),
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
