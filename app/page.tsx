import { Weather } from "./components/Weather";
import { TransitAlerts } from "./components/TransitAlerts";
import { format } from "date-fns";
import Calendar from "./components/Calendar";

// For alerts beyond weather, there should be a 'plus N other alerts' to indicate more is happening
// and since the screen can only fit so much information
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ code: string }>;
}) {
  // Nook simple touch is 800x600
  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center gap-10 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold flex justify-self-stretch justify-between h-[64px]">
        <span>{format(new Date(), "eeee, LLLL d, yyyy")}</span> <Weather />
      </h1>
      <main className="flex gap-[22px] row-start-2 items-center sm:items-start">
        {/* Transit Alerts */}
        <TransitAlerts />
        {/* Calendar Events */}
        {/* TODO: display message when api errored. Also display 'and N more events' if there are more than can fit on screen */}
        <Calendar code={(await searchParams).code} />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        Last Time Checked: {new Date().toString()}
      </footer>
    </div>
  );
}
