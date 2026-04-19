"use client";

import { useEffect, useState } from "react";

const COOKIE_KEY = "bw_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6">
      <div className="max-w-[640px] mx-auto bg-[#3E4F56] text-[#EAE2D2] rounded-lg shadow-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-[13px] leading-[22px] flex-1">
          We use essential cookies to make the booking form work. We don&rsquo;t track you or share your data.{" "}
          <a href="/privacy" className="underline underline-offset-2 opacity-75 hover:opacity-100">
            Privacy policy
          </a>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-[11px] tracking-[0.12em] uppercase text-[#EAE2D2]/60 hover:text-[#EAE2D2] transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 bg-[#B28B5D] text-[#EAE2D2] text-[11px] tracking-[0.12em] uppercase rounded-md hover:opacity-90 transition-opacity"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
