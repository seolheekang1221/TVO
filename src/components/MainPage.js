import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
})

const cities = [
  { name: 'Seoul', lat: 37.5665, lon: 126.9780 },
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', lat: 35.6895, lon: 139.6917 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
  { name: 'Moscow', lat: 55.7558, lon: 37.6173 },
  { name: 'Beijing', lat: 39.9042, lon: 116.4074 },
  { name: 'Cairo', lat: 30.0444, lon: 31.2357 },
  { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729 },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
  { name: 'Toronto', lat: 43.651070, lon: -79.347015 },
  { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
  { name: 'Dubai', lat: 25.276987, lon: 55.296249 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Hong Kong', lat: 22.3193, lon: 114.1694 },
  { name: 'Bangkok', lat: 13.7563, lon: 100.5018 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Mexico City', lat: 19.4326, lon: -99.1332 },
  { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816 },
  { name: 'Sao Paulo', lat: -23.5505, lon: -46.6333 },
  { name: 'Jakarta', lat: -6.2088, lon: 106.8456 },
  { name: 'Lagos', lat: 6.5244, lon: 3.3792 },
  { name: 'Istanbul', lat: 41.0082, lon: 28.9784 },
  { name: 'Manila', lat: 14.5995, lon: 120.9842 },
  { name: 'Lima', lat: -12.0464, lon: -77.0428 },
  { name: 'Tehran', lat: 35.6892, lon: 51.3890 },
  { name: 'Bangladesh', lat: 23.6850, lon: 90.3563 },
  { name: 'Baghdad', lat: 33.3152, lon: 44.3661 },
]


const MainPage = ({ user }) => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [city, setCity] = useState('')
  const [searchedWeather, setSearchedWeather] = useState(null)
  const [searchError, setSearchError] = useState('')
  const [searches, setSearches] = useState(user ? user.searches : [])

  useEffect(() => {
    if (user && user.searches) {
      setSearches(user.searches)
    }
  }, [user])

  const getWeather = async (lat, lon) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat: lat,
          lon: lon,
          appid: process.env.REACT_APP_OPENWEATHER_API_KEY,
        },
      })
      const weatherData = response.data
      const temperatureInCelsius = (weatherData.main.temp - 273.15).toFixed(1)
      const timezoneOffset = weatherData.timezone
      const localDate = new Date(Date.now() + timezoneOffset * 1000)
      const localTime = localDate.toLocaleTimeString()
      const localDateString = localDate.toLocaleDateString()
  
      setWeather({ ...weatherData, main: { ...weatherData.main, temp: temperatureInCelsius }, localTime, localDateString })
      setError('')
      if (user) {
        await saveSearch(weatherData.name, temperatureInCelsius, weatherData.weather[0].description, localDateString, localTime)
      }
    } catch (error) {
      setError('Weather data not found')
      setWeather(null)
    }
  }
  

  const handleSearch = async (city) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: city,
          units: 'metric',
          appid: process.env.REACT_APP_OPENWEATHER_API_KEY,
        },
      })
      const weatherData = response.data
      const timezoneOffset = weatherData.timezone
      const localDate = new Date(Date.now() + timezoneOffset * 1000)
      const localTime = localDate.toLocaleTimeString()
      const localDateString = localDate.toLocaleDateString()
  
      setSearchedWeather({ ...weatherData, localTime, localDateString })
      setSearchError('')
      if (user) {
        await saveSearch(weatherData.name, weatherData.main.temp, weatherData.weather[0].description, localDateString, localTime)
      }
    } catch (error) {
      setSearchError('City not found')
      setSearchedWeather(null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city) {
      handleSearch(city)
    }
  }

  const saveSearch = async (city, temperature, description, localDateString, localTime) => {
    try {
      await axios.post('/api/users/search', {
        userId: user._id,
        city,
        temperature,
        description,
        localDateString,
        localTime,
      })
      setSearches((prevSearches) => [
        ...prevSearches,
        { city, temperature, description, localDateString, localTime },
      ])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="main-page">
      <h1>Weather App</h1>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {cities.map((city) => (
          <Marker
            key={city.name}
            position={[city.lat, city.lon]}
            icon={customIcon}
            eventHandlers={{
              click: () => {
                getWeather(city.lat, city.lon)
              },
            }}
          >
            <Popup>{city.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      {error && <p>{error}</p>}
      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>{weather.main.temp} °C</p>
          <p>{weather.weather[0].description}</p>
          <p>Local time: {weather.localTime}</p>
          <p>Local date: {weather.localDateString}</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" />
        <button type="submit">Get Weather</button>
      </form>
      {searchError && <p>{searchError}</p>}
      {searchedWeather && (
        <div>
          <h2>{searchedWeather.name}</h2>
          <p>{searchedWeather.main.temp} °C</p>
          <p>{searchedWeather.weather[0].description}</p>
        </div>
      )}
      {user && searches.length > 0 && (
        <div>
          <h2>Search History</h2>
          {searches.map((search, index) => (
            <div key={index}>
              <p>{search.city}: {search.temperature} °C, {search.description}, {search.localDateString}, {search.localTime}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MainPage
