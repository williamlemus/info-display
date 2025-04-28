import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { calendar_v3 } from "googleapis";

const EventItem = ({ event }: { event: calendar_v3.Schema$Event }) => {
  return (
    <Card className="w-[380px] mb-2">
      <CardHeader>
        {event.start?.dateTime} {event.summary}
      </CardHeader>
      <CardDescription className="px-3 truncate mx-3 my-0">
        {event.description}
      </CardDescription>
      <CardContent>
        <div className="text-sm">
          {event.location}
          {event.hangoutLink}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventItem;
