type PreviewIconName =
  | "check"
  | "minus"
  | "flag"
  | "steps"
  | "chart"
  | "price"
  | "building"
  | "home"
  | "map"
  | "trend"
  | "shield"
  | "conclusion";

const size = 16;

export function PreviewIcon({ name }: { name: PreviewIconName }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "check":
      return (
        <svg {...common}>
          <path d="M9 12.5 11 14.5 15.5 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      );
    case "minus":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
          <path d="M8 12h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "flag":
      return (
        <svg {...common}>
          <path d="M5 21V5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M5 5h11l-2 4 2 4H5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      );
    case "steps":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
          <path d="M9.5 9.5a2.5 2.5 0 0 1 4.3 1.8c0 1.7-2.8 1.8-2.8 3.7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="12" cy="17" r=".75" fill="currentColor" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M8 15V11M12 15V8M16 15v-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "price":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
          <path d="M9 10.5c0-1.1.9-2 2.2-2 1.2 0 2.3.7 2.3 1.9 0 2.4-4.5 1.2-4.5 4.1 0 1.2 1 2 2.4 2 1.4 0 2.6-.8 2.6-2.1" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M12 6.5v11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case "building":
      return (
        <svg {...common}>
          <path d="M4 20V8l8-4 8 4v12" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" stroke="currentColor" strokeWidth="1.75" />
          <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      );
    case "trend":
      return (
        <svg {...common}>
          <path d="M4 18h16M7 14l3-3 3 2 5-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 5 6v6c0 4.5 3.2 7.4 7 9 3.8-1.6 7-4.5 7-9V6l-7-3Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        </svg>
      );
    case "conclusion":
      return (
        <svg {...common}>
          <path d="M6 4h12v12H6z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
          <path d="M9 8h6M9 12h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
  }
}

export const CATEGORY_ICONS: Record<string, PreviewIconName> = {
  price: "price",
  association: "building",
  condition: "home",
  location: "map",
  liquidity: "trend",
  risk: "shield",
};
