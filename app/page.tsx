import { Weather } from "./components/Weather";
import { TransitAlerts } from "./components/TransitAlerts";
import { format } from "date-fns";

// For alerts beyond weather, there should be a 'plus N other alerts' to indicate more is happening
// and since the screen can only fit so much information
export default async function Home() {

  // Nook simple touch is 800x600
  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold justify-self-start">{format(new Date(), 'eeee, LLLL d, yyyy')}</h1>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* Weather section */}
        <Weather />
        {/* Transit Alerts */}
        <TransitAlerts />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        Last Time Checked: {new Date().toString()}
      </footer>
    </div>
  );
}
