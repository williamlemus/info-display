import Image from "next/image"
import { getWeather, WeatherSchema } from "../api/weather";

export async function Weather() {
    const weather = WeatherSchema.parse(await getWeather());
    return (
        <section>
        <Image
          src={`https:${weather.current.condition.icon}`}
          alt="weather icon"
          width={64}
          height={64}
        />
        <div>{weather.current.condition.text}</div>
        <div>{weather.current.temp_c}&deg;</div>
      </section>
    )
}