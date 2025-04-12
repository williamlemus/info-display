// for future reference: https://www.mta.info/developers https://api.mta.info/#/serviceAlerts
// TODO: explore the real time data feeds to show next train leaving, etc: https://api.mta.info/#/landing
import { z } from "zod";

const TransitAlertSchema = z.object({
  informed_entity: z.array(
    z.object({
      agency_id: z.string(), // another enum prob
      route_id: z.string().optional(), // it looks like this may not appear in an informed entity when stop_id exists
    })
  ),
  header_text: z.object({
    translation: z.array(
      z.object({
        text: z.string(),
        language: z.string(),
      })
    ),
  }),
});

export const TransitAlertResponseSchema = z.object({
  entity: z.array(
    z.object({
      id: z.string(),
      alert: TransitAlertSchema,
    })
  ),
});

// list of bus and train routes I care about
const ROUTE_IDS = ["BX10", "BX9", "BX20", "1", "2", "3"];

// all MNR routes until I understand what is the line I actually care about.
// TODO: make a MNR_ROUTE_IDS constant to store those

export async function getTransitAlerts() {
  // It doesn't look like I can filter by particular line, so I will have to do it client side.
  const url =
    "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fall-alerts.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Response status: ${response.status} \n ${response.statusText}`
      );
    }
    return response.json();
  } catch (e: unknown) {
    console.error("Error obtaining transit alerts!");
    throw e;
  }
}

// TODO: will will also have to do a sort since the screen can only hold so many
export function filteredTransitAlerts({ entity }: TransitAlertResponse) {
  return {
    entity: entity.filter(({ alert }) => {
      return (
        alert.informed_entity.some((route) =>
          ROUTE_IDS.includes(route.route_id || "")
        ) || alert.informed_entity.some((route) => route.agency_id === "MNR")
      );
    }),
  };
}

export type TransitAlertResponse = z.infer<typeof TransitAlertResponseSchema>;
export type TransitAlert = z.infer<typeof TransitAlertSchema>;
