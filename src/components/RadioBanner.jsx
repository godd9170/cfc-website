"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cfm-radio-banner-dismissed";
const SOURCE_URL =
  "https://www.993countyfm.ca/podcast/?source=69473&mp3=podcast.993countyfm.ca:8000/Archive/CountyFM-Archive_2026-05-20_Wed_18.mp3";

export default function RadioBanner() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setMounted(true);
    setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (!mounted || dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="border-b border-[#e2d8ca] bg-[#fff7e8]">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-6 py-2">
        <a
          href={SOURCE_URL}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-2 text-xs text-[#5f5244] hover:text-[#3F3228]"
        >
          <span className="font-medium">As heard on</span>
          <img src="/cfm.svg" alt="County 99.3 FM" className="h-5 w-auto" />
        </a>
        <audio
          controls
          preload="metadata"
          src="/cfm-segment.mp3"
          className="h-8 min-w-0 flex-1"
        >
          Your browser does not support the audio element.
        </audio>
        <a
          href={SOURCE_URL}
          target="_blank"
          rel="noreferrer"
          className="hidden shrink-0 text-xs font-semibold text-brand-primary hover:underline sm:inline"
        >
          Full show ↗
        </a>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss radio banner"
          className="shrink-0 rounded-full p-1 text-[#8a7b69] hover:bg-[#f5efe4] hover:text-[#3F3228]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
