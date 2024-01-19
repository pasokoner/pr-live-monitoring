"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";

export default function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedDate = format(currentTime, "MMM. d, yyyy | hh:mm:ss a");

  return (
    <header className="flex items-center justify-center border-b-2 border-[#c86656] py-8 text-5xl font-medium uppercase">
      <span className="t mr-2 text-[#c86656]">DATE:</span>
      <p>{formattedDate}</p>
    </header>
  );
}
