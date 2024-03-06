export const getData = async (location: string) =>
  fetch(
    `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.PUBLIC_WEATHER_API_KEY}&q=${location}&aqi=no`,
  )
    .then(async (response) => {
      if (response.ok) {
        const res = await response.json()

        return res
      }

      throw new Error('error')
    })
    .catch(console.error)
