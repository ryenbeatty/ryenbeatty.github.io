<script>
  import { onMount } from 'svelte'
  import { getData } from 'services/weather'

  const fetchData = async (x) => {
    return await getData(x)
  }

  const city = 'ericeira'
  let data = fetchData(city)

  // onMount(() => {
  //   const interval = setInterval(async () => {
  //     data = await fetchData(city)
  //   }, 60000)

  //   return () => clearInterval(interval)
  // })
</script>

{#await data}
  Loading weather for {city}...
{:then weather}
  <p>weather in {city}</p>
  <p>temp: {weather.current.temp_c}°</p>
  <p>wind: {weather.current.wind_kph}kph</p>
{:catch someError}
  System error: {someError.message}.
{/await}
