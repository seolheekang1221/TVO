import React, { useState } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

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
  { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729 }
]

const App = () => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')

  const getWeather = async (lat, lon) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat: lat,
          lon: lon,
          appid: process.env.REACT_APP_OPENWEATHER_API_KEY
        }
      })
      setWeather(response.data)
      setError('')
    } catch (error) {
      setError('Weather data not found')
      setWeather(null)
    }
  }
  return (
    <div className="App">
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
    </div>
  )
}

export default App
