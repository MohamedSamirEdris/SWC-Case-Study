const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;
const apiKey = import.meta.env.VITE_WEATHER_KEY;

const makeIconURL = (iconId: string) =>
  `https://openweathermap.org/img/wn/${iconId}@2x.png`;

export const getFormattedWeatherData = async (
  location: string,
  units = 'metric'
) => {
  const requestURL = `${baseUrl}/data/2.5/weather?q=${location}&appid=${apiKey}&units=${units}`;

  const data = await fetch(requestURL)
    .then((res) => res.json())
    .then((data) => data);

  const {
    weather,
    main: { feels_like, temp, humidity, temp_max, temp_min, pressure },
    wind: { deg, speed },
    sys: { country },
    name,
  } = data;

  const { description, icon } = weather[0];

  return {
    description,
    iconURL: makeIconURL(icon),
    temp,
    feels_like,
    temp_min,
    temp_max,
    pressure,
    deg,
    humidity,
    speed,
    country,
    name,
  };
};
