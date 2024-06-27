import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import './MainPage.css'
import cities from '../assets/cities.json'
import ReactPaginate from 'react-paginate'

const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
})

const MainPage = ({ user }) => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [city, setCity] = useState('')
  const [searchedWeather, setSearchedWeather] = useState(null)
  const [searchError, setSearchError] = useState('')
  const [searches, setSearches] = useState(user ? user.searches : [])
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5

  useEffect(() => {
    if (user && user.searches) {
      setSearches(user.searches.reverse())
    }
  }, [user])

  const getWeather = async (lat, lon) => {
    try {
      const geocodeResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/reverse`, {
        params: {
          lat: lat,
          lon: lon,
          limit: 1,
          appid: process.env.REACT_APP_OPENWEATHER_API_KEY,
        },
      })
      const cityNameInEnglish = geocodeResponse.data[0].name
  
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
      const localTime = localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const localDateString = `${localDate.toLocaleDateString([], { month: 'long', day: 'numeric' })} (${localDate.toLocaleDateString([], { weekday: 'short' })})`
  
      setWeather({ ...weatherData, name: cityNameInEnglish, main: { ...weatherData.main, temp: temperatureInCelsius }, localTime, localDateString })
      setError('')
      setSearchedWeather(null)
      if (user) {
        await saveSearch(cityNameInEnglish, temperatureInCelsius, weatherData.weather[0].description, localDateString, localTime)
      }
    } catch (error) {
      setError('Weather data not found')
      setWeather(null)
    }
  }
  

  const handleSearch = async (city) => {
    try {
      const geocodeResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
        params: {
          q: city,
          limit: 1,
          appid: process.env.REACT_APP_OPENWEATHER_API_KEY,
        },
      })
      const cityNameInEnglish = geocodeResponse.data[0].name
      const { lat, lon } = geocodeResponse.data[0]
  
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat: lat,
          lon: lon,
          units: 'metric',
          appid: process.env.REACT_APP_OPENWEATHER_API_KEY,
        },
      })
      const weatherData = response.data
      const timezoneOffset = weatherData.timezone
      const localDate = new Date(Date.now() + timezoneOffset * 1000)
      const localTime = localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      const localDateString = `${localDate.toLocaleDateString([], { month: 'long', day: 'numeric' })} (${localDate.toLocaleDateString([], { weekday: 'short' })})`
  
      setSearchedWeather({ ...weatherData, name: cityNameInEnglish, localTime, localDateString })
      setSearchError('')
      setWeather(null)
      if (user) {
        await saveSearch(cityNameInEnglish, weatherData.main.temp, weatherData.weather[0].description, localDateString, localTime)
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
        { city, temperature, description, localDateString, localTime },
        ...prevSearches,
      ])
    } catch (err) {
      console.error(err)
    }
  }

  const handlePageClick = (data) => {
    setCurrentPage(data.selected)
  }

  const offset = currentPage * itemsPerPage
  const currentSearches = searches.slice(offset, offset + itemsPerPage)
  const pageCount = Math.ceil(searches.length / itemsPerPage)

  return (
    <div className="main-page" style={{ display: 'flex', color: 'black' }}>
      <div className="sidebar">
        <div className="mainpage-form-container">
          <form onSubmit={handleSubmit}>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" />
            <button type="submit">Get Weather</button>
          </form>
        </div>
        {error && <p>{error}</p>}
        {weather && (
          <div className="weather-container">
            <h2>{weather.name} Weather</h2>
            <p className="temp">{weather.main.temp} °C</p>
            <p className="description">{weather.weather[0].description}</p>
            <p>Local date: {weather.localDateString}</p>
            <p>Local time: {weather.localTime}</p>
          </div>
        )}
        {searchError && <p>{searchError}</p>}
        {searchedWeather && (
          <div className="weather-container">
            <h2>{searchedWeather.name} Weather</h2>
            <p className="temp">{searchedWeather.main.temp} °C</p>
            <p className="description">{searchedWeather.weather[0].description}</p>
            <p>Local date: {searchedWeather.localDateString}</p>
            <p>Local time: {searchedWeather.localTime}</p>
          </div>
        )}
        {user && searches.length > 0 && (
          <div className="search-history">
            <h2>Search History</h2>
            {currentSearches.map((search, index) => (
              <div key={index} className="search-item">
                <div>
                  <p>{offset + index + 1}. {search.city} : {search.temperature} °C, {search.description}</p>
                  <p>{search.localDateString}, {search.localTime}</p>
                </div>
              </div>
            ))}
            <ReactPaginate
              previousLabel={'«'}
              nextLabel={'»'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={pageCount}
              marginPagesDisplayed={0}
              pageRangeDisplayed={5}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              subContainerClassName={'pages pagination'}
              activeClassName={'active'}
            />
          </div>
        )}
      </div>
      <MapContainer className="map-container" center={[20, 0]} zoom={3}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
    </div>
  )
}

export default MainPage

