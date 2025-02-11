"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { resultSchema, ResultSchema } from "@/lib/formSchema";
import { createResult, updateResult } from "@/action/forms/resultFormAction";

const ResultForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResultSchema>({
    resolver: zodResolver(resultSchema),
  });

  const [state, formAction] = useActionState(
    type === "create" ? createResult : updateResult,
    {
      success: false,
      error: false,
    }
  );

  const router = useRouter();

  const onSubmit = handleSubmit((data) => {
    startTransition(() => {
      formAction(data);
    });
  });

  useEffect(() => {
    if (state.success) {
      toast(`Result has been ${type === "create" ? "created" : "updated"}`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen, type]);

  const { classes, students, teachers, exams, assignments } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new result" : "Update the result"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Score"
          name="score"
          defaultValue={data?.score}
          register={register}
          error={errors?.score}
        />
        <InputField
          label="Date"
          name="date"
          type="date"
          defaultValue={
            data?.date ? new Date(data.date).toISOString().split("T")[0] : ""
          }
          register={register}
          error={errors?.date}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            {classes?.map((classItem: { id: number; name: string }) => (
              <option value={classItem.id} key={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between flex-wrap gap-4">
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Student</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("studentId")}
            defaultValue={data?.studentId}
          >
            {students?.map(
              (student: { id: number; name: string; surname: string }) => (
                <option value={student.id} key={student.id}>
                  {student.name} {student.surname}
                </option>
              )
            )}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teacherId")}
            defaultValue={data?.teacherId}
          >
            {teachers?.map(
              (teacher: { id: number; name: string; surname: string }) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher.name} {teacher.surname}
                </option>
              )
            )}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Exam</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("examId", {
              setValueAs: (value) =>
                value === "" ? null : Number(value) || null,
            })}
            defaultValue={data?.examId ?? ""}
          >
            <option value="">Select Exam</option> {/* Default option */}
            {exams.map((examItem: { id: number; title: string }) => (
              <option value={examItem.id} key={examItem.id}>
                {examItem.title}
              </option>
            ))}
          </select>
          {errors.examId?.message && (
            <p className="text-xs text-red-400">
              {errors.examId.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Assignment</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("assignmentId", {
              setValueAs: (value) =>
                value === "" ? null : Number(value) || null,
            })}
            defaultValue={data?.assignmentId ?? ""}
          >
            <option value="">Select Assignment</option> {/* Default option */}
            {assignments.map(
              (assignmentItem: { id: number; title: string }) => (
                <option value={assignmentItem.id} key={assignmentItem.id}>
                  {assignmentItem.title}
                </option>
              )
            )}
          </select>
          {errors.assignmentId?.message && (
            <p className="text-xs text-red-400">
              {errors.assignmentId.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResultForm;
