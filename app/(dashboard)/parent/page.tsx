import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/utils";

const ParentPage = async () => {
  const { currentUserId } = await getCurrentUser();

  const students = await prisma.student.findMany({
    where: { parentId: currentUserId! },
  });

  return (
    <div className="p-4 flex gap-4 flex-col xl:flex-row">
      <div>
        {students.map((student) => (
          <div className="w-full xl:w-2/3" key={student.id}>
            <div className="h-full bg-white p-4 rounded-md">
              <h1 className="text-xl font-semibold">
                Schedule ({student.name}){" "}
              </h1>
              <BigCalendarContainer type="classId" id={student.id!} />
            </div>
          </div>
        ))}
      </div>

      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
