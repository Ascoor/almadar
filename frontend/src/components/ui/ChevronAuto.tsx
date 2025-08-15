import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useDir } from "@/context/DirContext";
export default function ChevronAuto(props: { className?: string }) {
  const { dir } = useDir();
  const Icon = dir === "rtl" ? ChevronLeft : ChevronRight;
  return <Icon className={props.className} />;
}
