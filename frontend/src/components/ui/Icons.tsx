import React from 'react';

// Base icon props interface
interface IconProps {
  className?: string;
  size?: number;
}

// Contracts Icon - Professional document with seal
export const ContractsIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 6h8M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="17" cy="17" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 17l1 1 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Legal Consultations Icon - Wise owl with legal scales
export const ConsultationsIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3c3 0 5 2 5 5 0 2-1 3-2 4v2c0 1-1 2-2 2h-2c-1 0-2-1-2-2v-2c-1-1-2-2-2-4 0-3 2-5 5-5z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="8" r="1" fill="currentColor"/>
    <circle cx="14" cy="8" r="1" fill="currentColor"/>
    <path d="M7 18h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 21l2-3M18 21l-2-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="19" r="1" fill="currentColor"/>
  </svg>
);

// Lawsuits Icon - Gavel with justice scales
export const LawsuitsIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M14 8l-2 2-2-2 2-2 2 2z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <rect x="9" y="16" width="6" height="2" rx="1" fill="currentColor"/>
    <path d="M6 4l2 2M18 4l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="5" cy="6" r="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
    <circle cx="19" cy="6" r="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
    <path d="M3 6h4M17 6h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

// Dashboard Icon - Modern analytics grid
export const DashboardIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="13" y="3" width="8" height="5" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="13" y="10" width="8" height="11" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="7" cy="7" r="1.5" fill="currentColor"/>
    <circle cx="17" cy="5.5" r="1" fill="currentColor"/>
    <path d="M5 17l4-2 2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Archive Icon - Professional filing cabinet
export const ArchiveIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="4" width="18" height="16" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 10h18" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 16h18" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="8" y="6" width="8" height="2" rx="1" fill="currentColor" fillOpacity="0.3"/>
    <rect x="8" y="12" width="8" height="2" rx="1" fill="currentColor" fillOpacity="0.3"/>
    <circle cx="10" cy="7" r="0.5" fill="currentColor"/>
    <circle cx="10" cy="13" r="0.5" fill="currentColor"/>
  </svg>
);

// PDF Viewer Icon - Document with preview
export const PDFViewerIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 8v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h8l6 6z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="15" r="3" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11 15l1 1 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 11h2M8 13h1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

// Justice Scale Icon - Professional legal scales
export const JusticeScalesIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 8l6-2 6 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="5" cy="12" r="3" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="19" cy="12" r="3" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 15h4M17 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="9" y="21" width="6" height="2" rx="1" fill="currentColor"/>
  </svg>
);

// Legal Briefcase Icon - Professional legal briefcase
export const LegalBriefcaseIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="8" width="16" height="12" rx="2" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 8V6a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 13h16" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="16" r="1" fill="currentColor"/>
    <path d="M10 11h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

// Law Book Icon - Professional legal books
export const LawBookIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 7h8M8 11h6M8 15h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <path d="M3 4v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="17" cy="8" r="1" fill="currentColor"/>
  </svg>
);

// Court House Icon - Professional courthouse
export const CourtHouseIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 21h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 21V9l7-6 7 6v12" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 21V13h6v8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="6" y="11" width="2" height="6" fill="currentColor" fillOpacity="0.3"/>
    <rect x="16" y="11" width="2" height="6" fill="currentColor" fillOpacity="0.3"/>
  </svg>
);

// International Contracts Icon - Globe with document
export const InternationalIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="8" y="8" width="8" height="6" rx="1" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
    <path d="M10 10h4M10 12h3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
  </svg>
);

// Local Contracts Icon - Building with document
export const LocalIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 21h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 21V7l7-4 7 4v14" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 9h6v8H9z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1"/>
    <path d="M11 11h2M11 13h2M11 15h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    <rect x="6" y="8" width="2" height="2" fill="currentColor" fillOpacity="0.3"/>
    <rect x="16" y="8" width="2" height="2" fill="currentColor" fillOpacity="0.3"/>
  </svg>
);

// Legal Hub Logo Icon - Professional law symbol
export const LegalHubIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

// Company Cases Icon - Shield with legal symbol
export const CompanyCasesIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2l8 3v7c0 5-8 10-8 10s-8-5-8-10V5l8-3z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 11l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="7" r="1" fill="currentColor"/>
  </svg>
);

// Export all icons as a collection
export const CustomIcons = {
  Contracts: ContractsIcon,
  Consultations: ConsultationsIcon,
  Lawsuits: LawsuitsIcon,
  Dashboard: DashboardIcon,
  Archive: ArchiveIcon,
  PDFViewer: PDFViewerIcon,
  International: InternationalIcon,
  Local: LocalIcon,
  LegalHub: LegalHubIcon,
  CompanyCases: CompanyCasesIcon,
  JusticeScales: JusticeScalesIcon,
  LegalBriefcase: LegalBriefcaseIcon,
  LawBook: LawBookIcon,
  CourtHouse: CourtHouseIcon,
};

export default CustomIcons;
