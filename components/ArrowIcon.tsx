export function ArrowIcon({ direction = "right" }: { direction?: "right" | "down" | "up-right" }) {
  const rotate = direction === "down" ? "rotate(90 12 12)" : direction === "up-right" ? "rotate(-45 12 12)" : undefined;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <g transform={rotate}>
        <path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </g>
    </svg>
  );
}
