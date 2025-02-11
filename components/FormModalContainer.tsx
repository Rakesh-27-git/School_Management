import { prisma } from "@/lib/prisma";
import FormModal from "./FormModal";
import { getCurrentUser } from "@/lib/utils";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  const { role, currentUserId } = await getCurrentUser();

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;

      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        relatedData = { teachers: classTeachers, grades: classGrades };
        break;

      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects };
        break;

      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        relatedData = { classes: studentClasses, grades: studentGrades };
        break;

      case "exam":
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true, subjectId: true },
        });

        relatedData = { lessons: examLessons };
        break;

      case "lesson":
        const lessonClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        const lessonTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        const lessonSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });

        relatedData = {
          classes: lessonClasses,
          teachers: lessonTeachers,
          subjects: lessonSubjects,
        };
        break;

      case "parent":
        const parentStudents = await prisma.student.findMany({
          select: { id: true, name: true, surname: true },
        });

        relatedData = { students: parentStudents };
        break;

      case "assignment":
        const assignmentLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true, subjectId: true },
        });

        const assignmentClasses = await prisma.class.findMany({
          where: {
            ...(role === "teacher" ? { supervisorId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });

        const assignmentTeachers = await prisma.teacher.findMany({
          where: {
            ...(role === "teacher" ? { id: currentUserId! } : {}),
          },
          select: { id: true, name: true, surname: true },
        });

        relatedData = {
          lessons: assignmentLessons,
          classes: assignmentClasses,
          teachers: assignmentTeachers,
        };

        break;

      case "announcement":
        const announcementClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });

        relatedData = { classes: announcementClasses };
        break;

      case "event":
        const eventClasses = await prisma.class.findMany({
          select: { id: true, name: true },
        });

        relatedData = { classes: eventClasses };
        break;

      case "result":
        const resultsClasses = await prisma.class.findMany({
          where: {
            ...(role === "teacher" ? { supervisorId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });

        const resultsStudents = await prisma.student.findMany({
          where: {
            ...(role === "teacher"
              ? { classId: { in: resultsClasses.map((c) => c.id) } }
              : {}),
          },
          select: { id: true, name: true, surname: true },
        });

        const resultsTeachers = await prisma.teacher.findMany({
          where: {
            ...(role === "teacher" ? { id: currentUserId! } : {}),
          },
          select: { id: true, name: true, surname: true },
        });

        const resultsExams = await prisma.exam.findMany({
          where: {
            ...(role === "teacher"
              ? { lesson: { teacherId: currentUserId! } }
              : {}),
          },
          select: { id: true, title: true },
        });

        const resultsAssignments = await prisma.assignment.findMany({
          where: {
            ...(role === "teacher"
              ? { lesson: { teacherId: currentUserId! } }
              : {}),
          },
          select: { id: true, title: true },
        });

        relatedData = {
          classes: resultsClasses,
          students: resultsStudents,
          teachers: resultsTeachers,
          exams: resultsExams,
          assignments: resultsAssignments,
        };

        break;

      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
