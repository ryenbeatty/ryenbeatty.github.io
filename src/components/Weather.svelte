<script>
  import { getWeatherData } from 'services/weather'

  const fetchData = async (city) => {
    return await getWeatherData(city)
  }

  const city = 'berlin'
  // const city='28.564951290067405, -16.33135520241965'
  const data = fetchData(city)

  const getEmojiForWeather = (weatherType) => {
    switch (weatherType) {
      case 'Sunny':
        return '🌞'
      case 'Partly Cloudy':
        return '🌤️'
      case 'Cloudy':
        return '☁️'
      case 'Overcast':
        return '☁️'
      case 'Mist':
        return '😶‍🌫️'
      case 'Patchy rain nearby':
        return '🌧️'
      case 'Patchy snow nearby':
        return '🌨️'
      case 'Patchy sleet nearby':
        return '🌨️'
      case 'Patchy freezing drizzle nearby':
        return '🌨️'
      case 'Thundery outbreaks in nearby':
        return '🌨️'
      case 'Blowing snow':
        return '🌨️'
      case 'Blizzard':
        return '🌨️'
      case 'Fog':
        return '🌫️'
      case 'Freezing fog':
        return '🌫️'
      case 'Patchy light drizzle':
        return '🌧️'
      case 'Light drizzle':
        return '🌧️'
      case 'Freezing drizzle':
        return '🌧️'
      case 'Heavy freezing drizzle':
        return '🌧️'
      case 'Patchy light rain':
        return '🌧️'
      case 'Light rain':
        return '🌧️'
      case 'Moderate rain at times':
        return '🌧️'
      case 'Moderate rain':
        return '🌧️'
      case 'Heavy rain at times':
        return '🌧️'
      case 'Heavy rain':
        return '🌧️'
      case 'Light freezing rain':
        return '🌧️'
      case 'Moderate or heavy freezing rain':
        return '🌧️'
      case 'Light sleet':
        return '🌧️'
      case 'Moderate or heavy sleet':
        return '🌧️'
      case 'Patchy light snow':
        return '🌧️'
      case 'Light snow':
        return '🌧️'
      case 'Patchy moderate snow':
      case 'Moderate snow':
      case 'Patchy heavy snow':
      case 'Heavy snow':
        return '🌨️'
      case 'Ice pellets':
        return '🧊'
      case 'Light rain shower':
        return '☔'
      case 'Moderate or heavy rain shower':
      case 'Torrential rain shower':
        case 'Light sleet showers':
          case 'Moderate or heavy sleet showers':
        return '🌧️'
      case 'Light snow showers':
        return '🌧️'
      case 'Moderate or heavy snow showers':
        return '🌧️'
      case 'Light showers of ice pellets':
        return '🌧️'
      case 'Moderate or heavy showers of ice pellets':
        return '🌧️'
      case 'Patchy light rain in area with thunder':
        return '🌧️'
      case 'Moderate or heavy rain in area with thunder':
        return '🌧️'
      case 'Patchy light snow in area with thunder':
        return '🌧️'
      case 'Moderate or heavy snow in area with thunder':
        return '🌧️'
      default:
        return '🌧️'
    }
  }

</script>

{#await data}
  <p>loading...</p>
{:then weather}
  <p>weather in {city}: {getEmojiForWeather(weather.current.condition.text)}</p>
  <p>temp: {weather.current.temp_c}°</p>
  <p>wind: {weather.current.wind_kph}kph</p>
{:catch someError}
  System error: {someError.message}.
{/await}
