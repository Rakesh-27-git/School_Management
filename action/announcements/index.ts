"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ITEM_PER_PAGE } from "@/constants";

export async function getAnnouncements(searchParams: {
  [key: string]: string | undefined;
}) {
  const { page, ...queryParams } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;

  const query: Prisma.AnnouncementWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  try {
    const [data, count] = await prisma.$transaction([
      prisma.announcement.findMany({
        where: query,
        include: {
          class: true,
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (currentPage - 1),
      }),
      prisma.announcement.count({ where: query }),
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
