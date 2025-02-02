"use client";

import { deleteSubject } from "@/action/forms/subjectForm";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useState,
  JSX,
  SetStateAction,
  Dispatch,
  useEffect,
  useActionState,
} from "react";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormModalContainer";

const deleteActionMap: {
  [key: string]: (
    currentState: any,
    data: any
  ) => Promise<{ success: boolean; error: boolean }>;
} = {
  subject: deleteSubject,
  // class: deleteClass,
  // teacher: deleteTeacher,
  // student: deleteStudent,
  // exam: deleteExam,
  // TODO: OTHER DELETE ACTIONS
  // parent: deleteSubject,
  // lesson: deleteSubject,
  // assignment: deleteSubject,
  // result: deleteSubject,
  // attendance: deleteSubject,
  // event: deleteSubject,
  // announcement: deleteSubject,
};

// const StudentForm = dynamic(() => import("./forms/StudentForm"), {
//   loading: () => <h1>Loading...</h1>,
// });
// const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
//   loading: () => <h1>Loading...</h1>,
// });
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  // student: (setOpen, type, data, relatedData) => (
  //   <StudentForm
  //     type={type}
  //     data={data}
  //     setOpen={setOpen}
  //     relatedData={relatedData}
  //   />
  // ),
  // teacher: (setOpen, type, data, relatedData) => (
  //   <TeacherForm
  //     type={type}
  //     data={data}
  //     setOpen={setOpen}
  //     relatedData={relatedData}
  //   />
  // ),
  subject: (setOpen, type, data, relatedData) => (
    <SubjectForm
      type={type}
      data={data}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction, pending] = useActionState(
      deleteActionMap[table],
      {
        success: false,
        error: false,
      }
    );

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`Subject has been Deleted`);
        setOpen(false);
        router.refresh();
      }
    }, [state, router]);

    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input readOnly type="text | number" name="id" value={id} hidden />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}?
        </span>
        <button
          disabled={pending}
          className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
        >
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](setOpen, type, data, relatedData)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        type="button"
        title="open"
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
