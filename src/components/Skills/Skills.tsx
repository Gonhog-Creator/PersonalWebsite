'use client';

import { CircularRevealHeading } from "@/components/ui/circular-reveal-heading";

const skills = [
  {
    text: "INNOVATION",
    image: "/img/skills/innovation.svg" // You'll need to add this image
  },
  {
    text: "LEADERSHIP",
    image: "/img/skills/leadership.svg" // You'll need to add this image
  },
  {
    text: "CURIOSITY",
    image: "/img/skills/curiosity.svg" // You'll need to add this image
  },
  {
    text: "PERSEVERANCE",
    image: "/img/skills/perseverance.svg" // You'll need to add this image
  }
];

export function Skills() {
  return (
    <div className="w-full h-full flex items-center justify-center pt-8">
      <div className="w-full h-full max-w-[320px] aspect-square -mt-16">
        <CircularRevealHeading
          items={skills}
          centerText={
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
              JOSE BARBEITO
            </div>
          }
          size="sm"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

export default Skills;
