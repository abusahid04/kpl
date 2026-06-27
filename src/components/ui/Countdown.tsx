"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let newTimeLeft: TimeLeft | null = null;

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="text-center font-heading font-bold text-2xl text-primary animate-pulse">
        TOURNAMENT IN PROGRESS!
      </div>
    );
  }

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-4 md:gap-6 justify-center items-center">
      {timeUnits.map((unit, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="font-heading font-black text-2xl md:text-4xl text-primary">
              {String(unit.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground mt-2 font-semibold">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
