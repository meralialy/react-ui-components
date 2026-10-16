import { createIcon } from './create-icon'

// All icons share a 24×24 grid, 1.75px rounded strokes, and currentColor. Each is its own
// export, and the @__PURE__ annotations tell bundlers an unused icon can be dropped, so apps
// only bundle the icons they import.

// People & communication
export const UserIcon = /* @__PURE__ */ createIcon(
  'UserIcon',
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20.5c0-3.6 3.6-6 8-6s8 2.4 8 6" />
  </>,
)
export const MailIcon = /* @__PURE__ */ createIcon(
  'MailIcon',
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
  </>,
)
export const PhoneIcon = /* @__PURE__ */ createIcon(
  'PhoneIcon',
  <path d="M5.5 3.5h3l2 5-2.5 1.5a11 11 0 0 0 6 6l1.5-2.5 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3.5 5.5a2 2 0 0 1 2-2Z" />,
)
export const BellIcon = /* @__PURE__ */ createIcon(
  'BellIcon',
  <>
    <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z" />
    <path d="M10 20.5a2 2 0 0 0 4 0" />
  </>,
)

// Security
export const LockIcon = /* @__PURE__ */ createIcon(
  'LockIcon',
  <>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </>,
)
export const UnlockIcon = /* @__PURE__ */ createIcon(
  'UnlockIcon',
  <>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 7.8-1.3" />
  </>,
)
export const EyeIcon = /* @__PURE__ */ createIcon(
  'EyeIcon',
  <>
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </>,
)
export const EyeOffIcon = /* @__PURE__ */ createIcon(
  'EyeOffIcon',
  <>
    <path d="M10.6 5.1A10.5 10.5 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-2.7 3.6" />
    <path d="M6.6 6.6A17.4 17.4 0 0 0 2 12s3.6 7 10 7a9.8 9.8 0 0 0 5.4-1.6" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="m3 3 18 18" />
  </>,
)
export const LogoutIcon = /* @__PURE__ */ createIcon(
  'LogoutIcon',
  <>
    <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
    <path d="m16 16 4-4-4-4" />
    <path d="M20 12H10" />
  </>,
)

// Actions
export const SearchIcon = /* @__PURE__ */ createIcon(
  'SearchIcon',
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </>,
)
export const PlusIcon = /* @__PURE__ */ createIcon('PlusIcon', <path d="M12 5v14M5 12h14" />)
export const MinusIcon = /* @__PURE__ */ createIcon('MinusIcon', <path d="M5 12h14" />)
export const CloseIcon = /* @__PURE__ */ createIcon('CloseIcon', <path d="M6 6l12 12M18 6 6 18" />)
export const CheckIcon = /* @__PURE__ */ createIcon('CheckIcon', <path d="m5 12.5 4.5 4.5L19 7" />)
export const EditIcon = /* @__PURE__ */ createIcon(
  'EditIcon',
  <>
    <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
    <path d="m13.5 6.5 4 4" />
  </>,
)
export const TrashIcon = /* @__PURE__ */ createIcon(
  'TrashIcon',
  <>
    <path d="M4 7h16" />
    <path d="M9 7V4.5h6V7" />
    <path d="m6 7 1 13h10l1-13" />
    <path d="M10 11v5.5M14 11v5.5" />
  </>,
)
export const CopyIcon = /* @__PURE__ */ createIcon(
  'CopyIcon',
  <>
    <rect x="8" y="8" width="13" height="13" rx="2" />
    <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
  </>,
)
export const DownloadIcon = /* @__PURE__ */ createIcon(
  'DownloadIcon',
  <>
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M4 20h16" />
  </>,
)
export const UploadIcon = /* @__PURE__ */ createIcon(
  'UploadIcon',
  <>
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M4 20h16" />
  </>,
)
export const FilterIcon = /* @__PURE__ */ createIcon(
  'FilterIcon',
  <path d="M3 5h18l-7 8.5V19l-4 2v-7.5L3 5Z" />,
)
export const RefreshIcon = /* @__PURE__ */ createIcon(
  'RefreshIcon',
  <>
    <path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" />
    <path d="M4 4v4h4" />
    <path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" />
    <path d="M20 20v-4h-4" />
  </>,
)
export const ExternalLinkIcon = /* @__PURE__ */ createIcon(
  'ExternalLinkIcon',
  <>
    <path d="M14 4h6v6" />
    <path d="M20 4l-9 9" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </>,
)

// Navigation
export const ChevronUpIcon = /* @__PURE__ */ createIcon('ChevronUpIcon', <path d="m6 15 6-6 6 6" />)
export const ChevronDownIcon = /* @__PURE__ */ createIcon(
  'ChevronDownIcon',
  <path d="m6 9 6 6 6-6" />,
)
export const ChevronLeftIcon = /* @__PURE__ */ createIcon(
  'ChevronLeftIcon',
  <path d="m15 6-6 6 6 6" />,
)
export const ChevronRightIcon = /* @__PURE__ */ createIcon(
  'ChevronRightIcon',
  <path d="m9 6 6 6-6 6" />,
)
export const ArrowLeftIcon = /* @__PURE__ */ createIcon(
  'ArrowLeftIcon',
  <>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </>,
)
export const ArrowRightIcon = /* @__PURE__ */ createIcon(
  'ArrowRightIcon',
  <>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </>,
)
export const MenuIcon = /* @__PURE__ */ createIcon('MenuIcon', <path d="M4 6h16M4 12h16M4 18h16" />)
export const MoreHorizontalIcon = /* @__PURE__ */ createIcon(
  'MoreHorizontalIcon',
  <>
    <circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1.1" fill="currentColor" stroke="none" />
  </>,
)
export const HomeIcon = /* @__PURE__ */ createIcon(
  'HomeIcon',
  <>
    <path d="M3 11 12 4l9 7" />
    <path d="M5.5 9.5V20h4.5v-6h4v6h4.5V9.5" />
  </>,
)

// Status
export const InfoIcon = /* @__PURE__ */ createIcon(
  'InfoIcon',
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5" />
    <circle cx="12" cy="7.75" r="1.1" fill="currentColor" stroke="none" />
  </>,
)
export const SuccessIcon = /* @__PURE__ */ createIcon(
  'SuccessIcon',
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.3 2.8 2.8L16 9.5" />
  </>,
)
export const WarningIcon = /* @__PURE__ */ createIcon(
  'WarningIcon',
  <>
    <path d="M10.3 4a2 2 0 0 1 3.4 0l8 13.8A2 2 0 0 1 20 20.8H4a2 2 0 0 1-1.7-3L10.3 4Z" />
    <path d="M12 9.5v4" />
    <circle cx="12" cy="16.75" r="1.1" fill="currentColor" stroke="none" />
  </>,
)
export const ErrorIcon = /* @__PURE__ */ createIcon(
  'ErrorIcon',
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5.5" />
    <circle cx="12" cy="16.25" r="1.1" fill="currentColor" stroke="none" />
  </>,
)

// Other
export const SettingsIcon = /* @__PURE__ */ createIcon(
  'SettingsIcon',
  <>
    <path d="M9.87 5.02 L10.35 2.64 L13.65 2.64 L14.13 5.02 L15.43 5.55 L17.45 4.22 L19.78 6.55 L18.45 8.57 L18.98 9.87 L21.36 10.35 L21.36 13.65 L18.98 14.13 L18.45 15.43 L19.78 17.45 L17.45 19.78 L15.43 18.45 L14.13 18.98 L13.65 21.36 L10.35 21.36 L9.87 18.98 L8.57 18.45 L6.55 19.78 L4.22 17.45 L5.55 15.43 L5.02 14.13 L2.64 13.65 L2.64 10.35 L5.02 9.87 L5.55 8.57 L4.22 6.55 L6.55 4.22 L8.57 5.55Z" />
    <circle cx="12" cy="12" r="3" />
  </>,
)
export const CalendarIcon = /* @__PURE__ */ createIcon(
  'CalendarIcon',
  <>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </>,
)
export const ClockIcon = /* @__PURE__ */ createIcon(
  'ClockIcon',
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
)
export const ImageIcon = /* @__PURE__ */ createIcon(
  'ImageIcon',
  <>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.5" />
    <path d="m21 15.5-5-5L6.5 20" />
  </>,
)
export const HeartIcon = /* @__PURE__ */ createIcon(
  'HeartIcon',
  <path d="M12 20s-8-4.6-8-10.2A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 2.8C20 15.4 12 20 12 20Z" />,
)
export const StarIcon = /* @__PURE__ */ createIcon(
  'StarIcon',
  <path d="M12.00 3.10 L14.41 9.28 L21.04 9.66 L15.90 13.87 L17.58 20.29 L12.00 16.70 L6.42 20.29 L8.10 13.87 L2.96 9.66 L9.59 9.28Z" />,
)
export const SunIcon = /* @__PURE__ */ createIcon(
  'SunIcon',
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
  </>,
)
export const MoonIcon = /* @__PURE__ */ createIcon(
  'MoonIcon',
  <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
)
export const ListIcon = /* @__PURE__ */ createIcon(
  'ListIcon',
  <>
    <path d="M9 6h11M9 12h11M9 18h11" />
    <circle cx="4.5" cy="6" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="4.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="4.5" cy="18" r="1.1" fill="currentColor" stroke="none" />
  </>,
)
export const GridIcon = /* @__PURE__ */ createIcon(
  'GridIcon',
  <>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
  </>,
)
