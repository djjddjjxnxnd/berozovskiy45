/* oxlint-disable react/only-export-components -- Every export is an SVG component created by this factory. */
function makeIcon(paths) {
  return function Icon({ width = 24, height = 24, color = 'currentColor', className = '' }) {
    return <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths}</svg>;
  };
}

export const MapPinIcon = makeIcon(<><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>);
export const MapIcon = makeIcon(<><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Z" /><path d="M9 3v16M15 5v16" /></>);
export const MuseumIcon = makeIcon(<><path d="m3 9 9-6 9 6H3ZM4 21h16M6 12v6m6-6v6m6-6v6M3 18h18" /></>);
export const GoldIcon = makeIcon(<><path d="m6 4-4 6 10 11 10-11-4-6H6Z" /><path d="M2 10h20M6 4l6 17 6-17" /></>);
export const PickaxeIcon = makeIcon(<><path d="m4 21 11-11M5 5c6-4 12-2 16 5-6-3-10-3-14-1" /><path d="m14 4 2-2" /></>);
export const MineIcon = makeIcon(<><path d="M3 21h18M5 21V9l7-6 7 6v12M9 21v-8h6v8M5 9h14" /><path d="m9 13 6 8m0-8-6 8" /></>);
export const MonumentIcon = makeIcon(<><path d="M4 21h16M6 18h12M8 18l2-13 2-2 2 2 2 13M10 10h4" /></>);
export const ChurchIcon = makeIcon(<><path d="M12 2v5M10 4h4m-2 3-5 4v10h10V11l-5-4ZM3 21V11l4 3m14 7V11l-4 3M10 21v-5a2 2 0 0 1 4 0v5M2 21h20" /></>);
export const FactoryIcon = makeIcon(<><path d="M3 21V10l6 3V8l6 3V3h4l2 18H3ZM7 17h1m4 0h1m4 0h1" /></>);
export const CompassIcon = makeIcon(<><circle cx="12" cy="12" r="9" /><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z" /></>);
export const NatureIcon = makeIcon(<><path d="M20 3c-9-1-16 3-16 10a7 7 0 0 0 12 5c3-3 4-9 4-15Z" /><path d="m3 21 12-12M8 16v-5m0 5h5" /></>);
export const LeafIcon = NatureIcon;
export const ParkIcon = makeIcon(<><path d="M12 21v-7M8 21h8M7 16a4 4 0 0 1-2-7 5 5 0 0 1 10-3 4 4 0 0 1 3 7 3 3 0 0 1-3 3H7Z" /></>);
export const WaterIcon = makeIcon(<><path d="M2 7c2-3 3 3 5 0s3 3 5 0 3 3 5 0 3 3 5 0M2 12c2-3 3 3 5 0s3 3 5 0 3 3 5 0 3 3 5 0M2 17c2-3 3 3 5 0s3 3 5 0 3 3 5 0 3 3 5 0" /></>);
export const MountainIcon = makeIcon(<><path d="m2 21 8-17 6 11 3-6 4 12H2ZM7 10l3 2 3-2" /></>);
export const SearchIcon = makeIcon(<><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>);
export const BookIcon = makeIcon(<><path d="M12 5C8 2 4 3 2 4v15c3-2 7-2 10 0 3-2 7-2 10 0V4c-3-1-7-2-10 1Zm0 0v14" /></>);
export const ScrollIcon = makeIcon(<><path d="M8 21h11a2 2 0 0 0 2-2v-2h-5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3h5V5M8 5v14a2 2 0 0 0 4 0v-2M11 8h2m-2 4h2" /></>);
export const ShieldIcon = makeIcon(<><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>);
export const CameraIcon = makeIcon(<><path d="m8 5 1-2h6l1 2h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4Z" /><circle cx="12" cy="12" r="4" /></>);
export const StarIcon = makeIcon(<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />);
export const PersonIcon = makeIcon(<><circle cx="12" cy="7" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>);
export const UsersIcon = makeIcon(<><circle cx="9" cy="8" r="3" /><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5" /></>);
export const MedalIcon = makeIcon(<><circle cx="12" cy="15" r="6" /><path d="m5 3 4 7m10-7-4 7M9 3h6m-5 12h4m-2-2v4" /></>);
export const MicroscopeIcon = makeIcon(<><path d="M3 21h18M7 18h7M8 3h5v8H8V3Zm2 8v3m5-7a7 7 0 0 1-1 14" /></>);
export const FootstepsIcon = makeIcon(<><path d="M9 3c2 0 3 3 3 5s-1 5-3 5-3-2-3-4 1-6 3-6Zm0 13c1.5 0 2.5 1 2.5 2.5S10.5 21 9 21s-2.5-1-2.5-2.5S7.5 16 9 16Zm8-10c2 0 3 3 3 5s-1 5-3 5-3-2-3-4 1-6 3-6Zm0 13h0" /></>);
export const ClockIcon = makeIcon(<><circle cx="12" cy="12" r="9" /><path d="M12 6v6l4 2" /></>);
export const CalendarIcon = makeIcon(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 11h18m-14 4h2m4 0h2" /></>);
export const HiddenPlaceIcon = makeIcon(<><path d="M3 8h7l2-3h9v15H3V8Z" /><circle cx="12" cy="14" r="2.5" /><path d="m14 16 2 2" /></>);
export const HammersIcon = makeIcon(<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>);
export const TheaterIcon = makeIcon(<><path d="m3 3 11 2v7a6 6 0 0 1-6 6 6 6 0 0 1-5-6V3Zm12 6 6-1v8a6 6 0 0 1-6 5 5 5 0 0 1-4-2M6 8h1m3 0h1m-5 4c1 2 3 2 4 0m5 3h1m2-1h1" /></>);
export const ArrowRightIcon = makeIcon(<path d="M4 12h16m-6-6 6 6-6 6" />);
export const ArrowUpRightIcon = makeIcon(<path d="M6 18 18 6M6 6h12v12" />);
export const ChevronLeftIcon = makeIcon(<path d="m15 5-7 7 7 7" />);
export const ChevronRightIcon = makeIcon(<path d="m9 5 7 7-7 7" />);
export const CloseIcon = makeIcon(<path d="m6 6 12 12M6 18 18 6" />);
export const MenuIcon = makeIcon(<path d="M4 6h16M4 12h16M4 18h16" />);
export const CheckIcon = makeIcon(<path d="m5 12 5 5L20 7" />);
export const ExpandIcon = makeIcon(<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />);
export const GoldNuggetMark = GoldIcon;
export const MineMark = MineIcon;
export const ArchiveMark = MuseumIcon;
export const CityMark = UsersIcon;
