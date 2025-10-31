/**
 * Guide page for new users
 * Spotlight on each section
 * 
 * TODO:
 * Adjus cfamera translate section size
 * Clean up code (nasty rn)
 */
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

type Step = {
  id: string;
  selector: string; 
  title: string;
  body?: string;
  placement?: "top" | "bottom" | "left" | "right";
  offset?: { x?: number; y?: number };
  radius?: number;
};

function useElementRect(selector: string, deps: any[] = []) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (!el) { setRect(null); return; }

    const measure = () => {
      // read after layout
      requestAnimationFrame(() => setRect(el.getBoundingClientRect()));
    };

    // keep it visible for camera/likes sections lower on the page
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    // listen on capture so inner scrolls also trigger
    const onScroll = () => measure();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", measure);
    };
  }, deps.concat([selector]));

  return rect;
}


function SpotlightOverlay({
  rect,
  radius = 20,
  children,
}: {
  rect: DOMRect | null;
  radius?: number;
  children?: React.ReactNode;
}) {
  const r = rect ?? new DOMRect(24, 120, 280, 90);
  const maskId = "quick-guide-mask";

  return createPortal(
    <div className="fixed inset-0 z-[1000] pointer-events-auto" aria-hidden="true">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id={maskId}>
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={r.x}
              y={r.y}
              rx={radius}
              ry={radius}
              width={r.width}
              height={r.height}
              fill="black"
            />
          </mask>
        </defs>

        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.65)"
          mask={`url(#${maskId})`}
        />

        <rect
          x={r.x - 4}
          y={r.y - 4}
          width={r.width + 8}
          height={r.height + 8}
          rx={(radius ?? 20) + 6}
          ry={(radius ?? 20) + 6}
          fill="none"
          stroke="white"
          strokeOpacity="0.9"
          strokeWidth="2"
        />
      </svg>

      {children}
    </div>,
    document.body
  );
}

function Callout({
  rect,
  title,
  body,
  placement = "bottom",
  offset,
}: {
  rect: DOMRect | null;
  title: string;
  body?: string;
  placement?: "top" | "bottom" | "left" | "right";
  offset?: { x?: number; y?: number };
}) {
  const r = rect ?? new DOMRect(24, 120, 280, 90);
  const GAP = 16;

  let top = r.y;
  let left = r.x;

  if (placement === "bottom") top = r.y + r.height + GAP;
  if (placement === "top") top = r.y - GAP;
  if (placement === "left") left = r.x - GAP;
  if (placement === "right") left = r.x + r.width + GAP;

  top = Math.max(16, top);
  left = Math.max(16, left);
  if (offset?.x) left += offset.x;
  if (offset?.y) top += offset.y;

  return createPortal(
    <div className="fixed z-[1010] max-w-[min(90vw,460px)]" style={{ top, left }}>
      <div className="rounded-2xl bg-white shadow-2xl p-5">
        <div className="text-2xl font-extrabold tracking-tight mb-2">{title}</div>
        {body && <div className="text-gray-600">{body}</div>}
      </div>
    </div>,
    document.body
  );
}

export default function QuickGuide() {
  const navigate = useNavigate();

  const steps: Step[] = useMemo(
    () => [
      {
        id: "welcome",
        selector: "[data-guide='welcome-title']",
        title: "Welcome to FANGO 👋",
        body:
          "This is your home base. We’ll show you the fastest way to start learning and track progress.",
        placement: "bottom",
        radius: 14,
        offset: { y: 8 },
      },
      {
        id: "target-language",
        selector: "[data-guide='target-language']",
        title: "Pick your target language",
        body: "Tap here anytime to change the language you’re learning.",
        placement: "bottom",
        radius: 12,
      },
      {
        id: "daily-quiz",
        selector: "[data-guide='daily-quiz-card']",
        title: "Tap here to take Daily Quiz",
        body: "Short, focused practice. Earn streaks and build your stack.",
        placement: "bottom",
        radius: 24,
      },
      {
        id: "likes-history",
        selector: "[data-guide='likes-history']",
        title: "Your Likes & Search History",
        body: "Revisit saved words and images for quick review.",
        placement: "top",
        radius: 20,
      },
      {
        id: "camera-fab",
        selector: "[data-guide='camera-fab']",
        title: "Camera Translate",
        body: "Point the camera at text to translate instantly.",
        placement: "top",
        radius: 36,
        offset: { y : -100},
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const step = steps[index];
  const rect = useElementRect(step.selector, [index]);
  const [_, setParams] = useSearchParams();

  const finish = () => setParams({}); 

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      if (e.key === "ArrowRight")
        setIndex((i) => Math.min(i + 1, steps.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [steps.length]);

  return (
    <>
      <SpotlightOverlay rect={rect} radius={step.radius ?? 20}>
        <button
          className="absolute inset-0 w-full h-full cursor-default"
          aria-label="Background"
          onClick={() => setIndex((i) => Math.min(i + 1, steps.length - 1))}
          style={{ background: "transparent", border: "none" }}
        />
      </SpotlightOverlay>

      <Callout
        rect={rect}
        title={step.title}
        body={step.body}
        placement={step.placement}
        offset={step.offset}
      />

      {createPortal(
        <div className="fixed z-[1020] inset-x-0 bottom-6 flex items-center justify-center">
          <div className="flex items-center gap-3 rounded-full bg-white shadow-xl px-3 py-2">
            <button
              className="px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-100 disabled:opacity-40"
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              disabled={index === 0}
            >
              Back
            </button>

            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i === index ? "bg-gray-900" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {index < steps.length - 1 ? (
              <>
                <button
                  className="px-3 py-1.5 rounded-full text-sm font-medium hover:bg-gray-100"
                  onClick={finish}
                >
                  Skip
                </button>
                <button
                  className="px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gray-900 hover:opacity-90"
                  onClick={() =>
                    setIndex((i) => Math.min(i + 1, steps.length - 1))
                  }
                >
                  Next
                </button>
              </>
            ) : (
              <button
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gray-900 hover:opacity-90"
                onClick={finish}
              >
                Done
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
