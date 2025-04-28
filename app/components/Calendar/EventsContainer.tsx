import { getCalendarEvents } from "@/app/api/calendar";
import EventItem from "./EventItem";

export default async function EventsContainer({
  code,
}: {
  code: string | null;
}) {
  const calendarEventsList = await getCalendarEvents(code);
  console.log(calendarEventsList);
  return (
    <div>
      {/* TODO: show no events and someway to report any errors getting calendar events */}
      {(calendarEventsList || []).map((event) => (
        <EventItem key={event.id} event={event} />
      ))}
    </div>
  );
}
