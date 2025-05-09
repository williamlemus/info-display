import { filteredTransitAlerts, getTransitAlerts, TransitAlert, TransitAlertResponseSchema } from "../api/transitAlerts";
// using these to sanitize alert html coming from MTA
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const TRANSIT_ALERTS_MAX = 4;

export async function TransitAlerts() {
    const transitAlerts = TransitAlertResponseSchema.parse(
        filteredTransitAlerts(await getTransitAlerts())
      );
      const alertCount = transitAlerts.entity.length;
      const sanitizeAlert = (alert: TransitAlert) =>
        DOMPurify(new JSDOM("<!DOCTYPE html>").window).sanitize(
          alert.header_text.translation[1].text
        );
    return(
        <section>
          <h3 className="text-2xl font-semibold mb-2">Transit Alerts</h3>
          <ul>
            {transitAlerts.entity
              .slice(0, TRANSIT_ALERTS_MAX)
              .map(({ alert, id }) => {
                return (
                  <li
                    key={id}
                    dangerouslySetInnerHTML={{ __html: sanitizeAlert(alert) }}
                    className="border-2 rounded-sm p-1"
                  ></li>
                );
              })}
          </ul>
          {alertCount > TRANSIT_ALERTS_MAX ? (
            <div className="font-semibold">
              Plus {alertCount - TRANSIT_ALERTS_MAX} more alerts
            </div>
          ) : null}
        </section>
    )
}