// hooks/useLottieJson.ts
"use client";

import { useEffect, useState } from "react";

export function useLottieJson(path: string) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(path)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [path]);

  return data;
}
