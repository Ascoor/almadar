import type { ReactNode } from "react";
import {
  ContractsIcon,
  ConsultationsIcon,
  LawsuitsIcon,
  DashboardIcon,
  ArchiveIcon,
  CourtHouseIcon,
  LawBookIcon,
  LegalBriefcaseIcon,
} from "@/components/ui/Icons";
import { UsersRound, UserCheck } from "lucide-react";

export type NavChild = {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
};

export type NavItem = {
  id: string;
  label: string;
  path?: string;
  icon: ReactNode;
  children?: NavChild[];
  permission?: string;
};

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "الرئيسية", path: "/", icon: <DashboardIcon size={20} /> },
  { id: "contracts", label: "التعاقدات", path: "/contracts", icon: <ContractsIcon size={20} /> },
  {
    id: "fatwa",
    label: "الرأي والفتوى",
    icon: <ConsultationsIcon size={20} />,
    children: [
      { id: "investigations", label: "التحقيقات", path: "/legal/investigations", icon: <LawsuitsIcon size={16} /> },
      { id: "legal-advices", label: "المشورة القانونية", path: "/legal/legal-advices", icon: <LawBookIcon size={16} /> },
      { id: "litigations", label: "التقاضي", path: "/legal/litigations", icon: <CourtHouseIcon size={16} /> },
    ],
  },
  {
    id: "management",
    label: "إدارة التطبيق",
    icon: <LegalBriefcaseIcon size={20} />,
    children: [{ id: "lists", label: "القوائم", path: "/managment-lists", icon: <LegalBriefcaseIcon size={16} /> }],
  },
  {
    id: "users",
    label: "إدارة المستخدمين",
    icon: <UsersRound size={20} />,
    children: [{ id: "users-list", label: "المستخدمين", path: "/users", icon: <UserCheck size={16} /> }],
  },
  { id: "archive", label: "الأرشيف", path: "/archive", icon: <ArchiveIcon size={20} /> },
];

