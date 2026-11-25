function IconBase({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function HeartIcon({ active }) {
  return (
    <IconBase fill={active ? "currentColor" : "none"}>
      <path d="M12 21s-8-5.2-9.6-10.1C1.3 7.6 3.3 4.5 6.5 4.5c2 0 3.5 1.1 5.5 3.2 2-2.1 3.5-3.2 5.5-3.2 3.2 0 5.2 3.1 4.1 6.4C20 15.8 12 21 12 21z" />
    </IconBase>
  );
}

export function SunIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </IconBase>
  );
}

export function MoonIcon() {
  return (
    <IconBase>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </IconBase>
  );
}

export function ArrowUpIcon() {
  return (
    <IconBase>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </IconBase>
  );
}