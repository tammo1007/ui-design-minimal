import { forwardRef, type ComponentType, type SVGProps } from "react";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
  ArrowsUpDownIcon,
  Bars2Icon,
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  HomeIcon,
  InboxIcon,
  InformationCircleIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MinusIcon,
  MoonIcon,
  PlusIcon,
  ShareIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  SunIcon,
  UsersIcon,
  ViewColumnsIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  Squares2X2Icon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";

/**
 * ICONS: Heroicons v2 outline (24 px grid), the only icon set of the system.
 * Stroke: 1.35 at 20/24 px (default), 1.5 at 16 px and below (pass size={16}; it switches automatically).
 * Never emoji, never "AI sparkle" icons, never icons inside coloured blobs.
 * Every icon-only control needs an aria-label; decorative icons are aria-hidden (default here).
 */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  size?: number;
  strokeWidth?: number;
  title?: string;
}

type HeroIcon = ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;

function wrap(Hero: HeroIcon, name: string, filled = false) {
  const C = forwardRef<SVGSVGElement, IconProps>(function Icon({ size = 20, strokeWidth, title, ...rest }, ref) {
    const sw = filled ? undefined : (strokeWidth ?? (size <= 16 ? 1.5 : 1.35));
    return (
      <Hero
        ref={ref}
        width={size}
        height={size}
        strokeWidth={sw}
        aria-hidden={title ? undefined : true}
        title={title}
        {...rest}
 />
    );
  });
  C.displayName = name;
  return C;
}

export const Menu = wrap(Bars2Icon, "Menu");
export const X = wrap(XMarkIcon, "X");
export const Check = wrap(CheckIcon, "Check");
export const Minus = wrap(MinusIcon, "Minus");
export const Plus = wrap(PlusIcon, "Plus");
export const ArrowLeft = wrap(ArrowLeftIcon, "ArrowLeft");
export const ArrowRight = wrap(ArrowRightIcon, "ArrowRight");
export const ArrowUp = wrap(ArrowUpIcon, "ArrowUp");
export const ArrowDown = wrap(ArrowDownIcon, "ArrowDown");
export const ArrowUpRight = wrap(ArrowUpRightIcon, "ArrowUpRight");
export const ArrowsUpDown = wrap(ArrowsUpDownIcon, "ArrowsUpDown");
export const ChevronDown = wrap(ChevronDownIcon, "ChevronDown");
export const ChevronLeft = wrap(ChevronLeftIcon, "ChevronLeft");
export const ChevronRight = wrap(ChevronRightIcon, "ChevronRight");
export const ChevronUpDown = wrap(ChevronUpDownIcon, "ChevronUpDown");
export const Lock = wrap(LockClosedIcon, "Lock");
export const Play = wrap(PlayIcon, "Play", true);
export const Volume2 = wrap(SpeakerWaveIcon, "Volume2");
export const VolumeX = wrap(SpeakerXMarkIcon, "VolumeX");
export const Search = wrap(MagnifyingGlassIcon, "Search");
export const Bell = wrap(BellIcon, "Bell");
export const Home = wrap(HomeIcon, "Home");
export const Inbox = wrap(InboxIcon, "Inbox");
export const Chart = wrap(ChartBarIcon, "Chart");
export const Users = wrap(UsersIcon, "Users");
export const Calendar = wrap(CalendarIcon, "Calendar");
export const Document = wrap(DocumentTextIcon, "Document");
export const Settings = wrap(Cog6ToothIcon, "Settings");
export const More = wrap(EllipsisHorizontalIcon, "More");
export const Filter = wrap(FunnelIcon, "Filter");
export const Share = wrap(ShareIcon, "Share");
export const Download = wrap(ArrowDownTrayIcon, "Download");
export const Sun = wrap(SunIcon, "Sun");
export const Moon = wrap(MoonIcon, "Moon");
export const Columns = wrap(ViewColumnsIcon, "Columns");
export const Grid = wrap(Squares2X2Icon, "Grid");
export const Stack = wrap(RectangleStackIcon, "Stack");
export const Info = wrap(InformationCircleIcon, "Info");
export const Warning = wrap(ExclamationTriangleIcon, "Warning");
export const Success = wrap(CheckCircleIcon, "Success");
export const Error = wrap(XCircleIcon, "Error");
