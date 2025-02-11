import { prisma } from "@/lib/prisma";
import React from "react";
import BigCalendar from "./BigCalendar";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";

type Props = {
  type: "teacherId" | "classId";
  id: number | string;
};

const BigCalendarContainer = async ({ type, id }: Props) => {
  const dataRes = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classId: id as number }),
    },
  });

  const data = dataRes.map((lesson) => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);
  console.log(schedule);

  return (
    <div className="h-full">
      <BigCalendar data={schedule} />
    </div>
  );
};

export default BigCalendarContainer;
