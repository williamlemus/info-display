import { z } from "zod";

// Will only include types I need. Response types are found here:
// https://app.swaggerhub.com/apis-docs/WeatherAPI.com/WeatherAPI/1.0.2#/APIs/realtime-weather
export const WeatherSchema = z.object({
  current: z.object({
    condition: z.object({
      text: z.string(), // TODO: pretty sure we can make this an enum
      icon: z.string(), // TODO: transform here and add https
    }),
    last_updated: z.string(), // it's a date
    temp_c: z.number(),
    wind_kph: z.number(),
    humidity: z.number(),
    cloud: z.number(),
    feelslike_c: z.number(),
    windchill_c: z.number(),
    heatindex_c: z.number(),
    dewpoint_c: z.number(),
  }),
});

export async function getWeather() {
  const url = `https://api.weatherapi.com/v1/current.json?q=10463&key=${process.env.WEATHER_API_KEY}`;
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status} \n ${response.statusText}`);
    }
    return response.json();
  } catch (e: unknown) {
    console.error("Error obtaining weather!");
    throw e;
  }
}

export type Weather = z.infer<typeof WeatherSchema>;
