"use client";

import { authorizeApi } from "@/app/api/calendar";
import { useState } from "react";

export default function AuthorizeCalendar() {
  const [loginLink, setLoginLink] = useState<string | null>(null);
  const handleClick = () => {
    const res = async () => {
      const url = await authorizeApi();
      setLoginLink(url);
    };
    res();
  };
  return (
    <>
      {loginLink ? (
        <a href={loginLink}>Login!</a>
      ) : (
        <button onClick={() => handleClick()}>Login to view calendar</button>
      )}
    </>
  );
}
