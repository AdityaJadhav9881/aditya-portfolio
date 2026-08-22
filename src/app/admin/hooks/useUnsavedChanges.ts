"use client";

import { useEffect, useRef } from "react";

export function useUnsavedChanges(hasChanges: boolean) {
  const message = "You have unsaved changes. Are you sure you want to leave?";

  useEffect(() => {
    if (!hasChanges) return;

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = message;
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  useEffect(() => {
    if (!hasChanges) return;

    function handlePopState() {
      if (!window.confirm(message)) {
        window.history.pushState(null, "", window.location.href);
      }
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [hasChanges]);
}
