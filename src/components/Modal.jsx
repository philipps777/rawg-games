import { useEffect, useRef } from "react";

export function Modal({ onClose, wide = false, children }) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeRef.current();
    };
    const prevOverflow = document.body.style.overflow;

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div
      className="backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modal${wide ? " wide" : ""}`}
        role="dialog"
        aria-modal="true"
      >
        <button className="x" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}