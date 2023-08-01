import hotBg from './assets/images/hot.jpg';
import { useEffect, useState } from 'react';
import coldBg from './assets/images/cold.jpg';
import Description from './component/description /Description';
import { getFormattedWeatherData } from './services/weather.service';

export interface WeatherData {
  description: string;
  iconURL: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  deg: string;
  humidity: string;
  speed: number;
  country: string;
  name: string;
}

function App() {
  const [location, setLocation] = useState('cairo');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [units, setUnits] = useState('metric');
  const [bg, setBg] = useState(hotBg);
  const [error, setError] = useState<string | null>(null);

  const handleUnitsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelsius = currentUnit === 'C';
    button.innerText = isCelsius ? '°F' : '°C';
    setUnits(isCelsius ? 'metric' : 'imperial');
  };
  const enterKeyPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      const inputElement = e.currentTarget as HTMLInputElement;
      setLocation(inputElement.value);
    }
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getFormattedWeatherData(location, units);
        setWeather(data);

        const threshold = units === 'metric' ? 20 : 60;
        if (data.temp <= threshold) setBg(coldBg);
        else setBg(hotBg);

        setError(null);
      } catch (error) {
        setError(
          'Error fetching weather data. Please check the city name and try again.'
        );
      }
    };

    fetchWeatherData();
  }, [units, location]);
  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section section__inputs">
              <input
                onKeyDown={enterKeyPressed}
                type="text"
                name="location" 
                placeholder="Enter City or Zip Code or coordinates..." 
              />
              <button onClick={(e) => handleUnitsClick(e)}>°F</button>
            </div>
            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather?.name}, ${weather?.country}`}</h3>
                <img src={weather?.iconURL} alt="weatherIcon" />
                <h3>{weather?.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${
                  units === 'metric' ? 'C' : 'F'
                }`}</h1>
              </div>
              {error && <div className="error">{error}</div>}
            </div>

            {/* bottom description */}
            <Description weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
