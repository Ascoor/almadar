import {
  DashboardIcon, ContractsIcon, ConsultationsIcon, LawsuitsIcon,
  ArchiveIcon, CourtHouseIcon, LawBookIcon, LegalBriefcaseIcon
} from "@/components/ui/Icons";
import { UsersRound, UserCheck } from "lucide-react";

export type NavChild = {
  id: string;
  path: string;
  icon?: React.ReactNode;
  labelAr: string;
  labelEn: string;
};

export type NavItem = {
  id: string;
  icon: React.ReactNode;
  path?: string;
  labelAr: string;
  labelEn: string;
  children?: NavChild[];
};

export const NAV: NavItem[] = [
  { id: "home", icon: <DashboardIcon size={20} />, path: "/dashboard", labelAr: "الرئيسية", labelEn: "Home" },
  { id: "contracts", icon: <ContractsIcon size={20} />, path: "/contracts", labelAr: "التعاقدات", labelEn: "Contracts" },
  {
    id: "fatwa", icon: <ConsultationsIcon size={20} />, labelAr: "الرأي والفتوى", labelEn: "Advisory",
    children: [
      { id: "investigations", path: "/legal/investigations", labelAr: "التحقيقات", labelEn: "Investigations", icon: <LawsuitsIcon size={16} /> },
      { id: "legal-advices", path: "/legal/legal-advices", labelAr: "المشورة القانونية", labelEn: "Legal Advices", icon: <LawBookIcon size={16} /> },
      { id: "litigations", path: "/legal/litigations", labelAr: "التقاضي", labelEn: "Litigations", icon: <CourtHouseIcon size={16} /> },
    ]
  },
  {
    id: "management", icon: <LegalBriefcaseIcon size={20} />, labelAr: "إدارة التطبيق", labelEn: "App Management",
    children: [{ id: "lists", path: "/managment-lists", labelAr: "القوائم", labelEn: "Lists", icon: <LegalBriefcaseIcon size={16} /> }]
  },
  {
    id: "users", icon: <UsersRound size={20} />, labelAr: "إدارة المستخدمين", labelEn: "Users Management",
    children: [{ id: "users-list", path: "/users", labelAr: "المستخدمين", labelEn: "Users", icon: <UserCheck size={16} /> }]
  },
  { id: "archive", icon: <ArchiveIcon size={20} />, path: "/archive", labelAr: "الأرشيف", labelEn: "Archive" },
];
