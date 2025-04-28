import { hasToken, setToken } from "@/app/api/calendar";
import AuthorizeCalendar from "./Authorize";
import EventsContainer from "./EventsContainer";

export default async function Calendar({ code }: { code: string | null }) {
  const canShowEvents = await hasToken();
  if (code) await setToken(code);
  return (
    <div>
      {canShowEvents ? <EventsContainer code={code} /> : <AuthorizeCalendar />}
    </div>
  );
}
