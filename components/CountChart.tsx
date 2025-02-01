"use client";
import { getStudentCounts, StudentCounts } from "@/action/student";
import Image from "next/image";
import { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const CountChart = () => {
  const [counts, setCounts] = useState<StudentCounts>({
    total: 0,
    boys: 0,
    girls: 0,
    boysPercentage: 0,
    girlsPercentage: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const data = await getStudentCounts();
      setCounts(data);
    };

    fetchCounts();
  }, []);

  const data = [
    {
      name: "Total",
      count: counts.total,
      fill: "white",
    },
    {
      name: "Girls",
      count: counts.girls,
      fill: "#FAE27C",
    },
    {
      name: "Boys",
      count: counts.boys,
      fill: "#C3EBFA",
    },
  ];

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">{counts.boys.toLocaleString()}</h1>
          <h2 className="text-xs text-gray-300">
            Boys ({counts.boysPercentage}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">{counts.girls.toLocaleString()}</h1>
          <h2 className="text-xs text-gray-300">
            Girls ({counts.girlsPercentage}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
