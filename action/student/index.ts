"use server";

import { prisma } from "@/lib/prisma";
import { Prisma, UserSex } from "@prisma/client";
import { ITEM_PER_PAGE } from "@/constants";

export async function getStudents(
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
) {
  const { page, ...queryParams } = await searchParams;
  const currentPage = page ? parseInt(page as string) : 1;

  const query: Prisma.StudentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.class = {
              lessons: {
                some: {
                  teacherId: value as string,
                },
              },
            };
            break;
          case "search":
            query.name = {
              contains: value as string,
              mode: "insensitive",
            };
        }
      }
    }
  }

  try {
    const [data, count] = await prisma.$transaction([
      prisma.student.findMany({
        where: query,
        include: {
          class: true,
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (currentPage - 1),
      }),
      prisma.student.count({ where: query }),
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

export type StudentCounts = {
  total: number;
  boys: number;
  girls: number;
  boysPercentage: number;
  girlsPercentage: number;
};

export async function getStudentCounts(): Promise<StudentCounts> {
  try {
    const [total, boys, girls] = await prisma.$transaction([
      prisma.student.count(),
      prisma.student.count({
        where: { sex: UserSex.MALE },
      }),
      prisma.student.count({
        where: { sex: UserSex.FEMALE },
      }),
    ]);

    const boysPercentage = Math.round((boys / total) * 100);
    const girlsPercentage = Math.round((girls / total) * 100);

    return {
      total,
      boys,
      girls,
      boysPercentage,
      girlsPercentage,
    };
  } catch (error) {
    console.error("Error fetching student counts:", error);
    return {
      total: 0,
      boys: 0,
      girls: 0,
      boysPercentage: 0,
      girlsPercentage: 0,
    };
  }
}

type DayAttendance = {
  name: string;
  present: number;
  absent: number;
};

export async function getWeeklyAttendance(): Promise<DayAttendance[]> {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  try {
    // Get the start of current week (Monday)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysSinceMonday);
    monday.setHours(0, 0, 0, 0); // Set to start of day

    // Get end of week (Friday)
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    friday.setHours(23, 59, 59, 999); // Set to end of day

    const resData = await prisma.attendance.findMany({
      where: {
        date: {
          gte: monday,
          lte: friday, // Add end date constraint
        },
      },
      select: {
        present: true,
        date: true,
      },
    });

    // Initialize with zero counts
    const attendanceMap = daysOfWeek.reduce(
      (acc, day) => ({
        ...acc,
        [day]: { present: 0, absent: 0 },
      }),
      {} as Record<string, { present: number; absent: number }>
    );

    // Process attendance data
    resData.forEach((item) => {
      const dayName = daysOfWeek[new Date(item.date).getDay() - 1];
      if (dayName) {
        // Check if it's a weekday
        if (item.present) {
          attendanceMap[dayName].present++;
        } else {
          attendanceMap[dayName].absent++;
        }
      }
    });

    // Convert to array format
    const data = daysOfWeek.map((day) => ({
      name: day,
      present: attendanceMap[day].present,
      absent: attendanceMap[day].absent,
    }));

    return data;
  } catch (error) {
    console.error("Error fetching weekly attendance:", error);
    return daysOfWeek.map((day) => ({
      name: day,
      present: 0,
      absent: 0,
    }));
  }
}
