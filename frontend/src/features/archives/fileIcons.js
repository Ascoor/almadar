import {
  FileText,
  FileArchive,
  FileSpreadsheet,
  FileImage,
  FileAudio2,
  FileVideo2,
  FileCode,
} from "lucide-react";

export function getFileIcon(file = {}) {
  const type = (file?.file_type || "").toLowerCase();

  if (["xls", "xlsx", "csv", "sheet"].some((t) => type.includes(t))) {
    return { icon: FileSpreadsheet, tone: "teal" };
  }
  if (["zip", "rar", "7z", "tar"].some((t) => type.includes(t))) {
    return { icon: FileArchive, tone: "amber" };
  }
  if (["png", "jpg", "jpeg", "gif", "bmp", "svg"].some((t) => type.includes(t))) {
    return { icon: FileImage, tone: "cyan" };
  }
  if (["mp3", "wav", "aac", "flac"].some((t) => type.includes(t))) {
    return { icon: FileAudio2, tone: "purple" };
  }
  if (["mp4", "mov", "avi", "mkv", "webm"].some((t) => type.includes(t))) {
    return { icon: FileVideo2, tone: "indigo" };
  }
  if (["json", "js", "ts", "html", "css", "xml"].some((t) => type.includes(t))) {
    return { icon: FileCode, tone: "blue" };
  }
  if (["pdf", "contract"].some((t) => type.includes(t))) {
    return { icon: FileText, tone: "orange" };
  }

  return { icon: FileText, tone: "slate" };
}

export const toneColors = {
  teal: {
    bg: "bg-teal-500/10",
    ring: "ring-1 ring-teal-500/30",
    text: "text-teal-600",
  },
  amber: {
    bg: "bg-amber-500/10",
    ring: "ring-1 ring-amber-500/30",
    text: "text-amber-600",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    ring: "ring-1 ring-cyan-500/30",
    text: "text-cyan-600",
  },
  purple: {
    bg: "bg-purple-500/10",
    ring: "ring-1 ring-purple-500/30",
    text: "text-purple-600",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    ring: "ring-1 ring-indigo-500/30",
    text: "text-indigo-600",
  },
  blue: {
    bg: "bg-blue-500/10",
    ring: "ring-1 ring-blue-500/30",
    text: "text-blue-600",
  },
  orange: {
    bg: "bg-orange-500/10",
    ring: "ring-1 ring-orange-500/30",
    text: "text-orange-600",
  },
  slate: {
    bg: "bg-slate-500/10",
    ring: "ring-1 ring-slate-400/40",
    text: "text-slate-600",
  },
};
