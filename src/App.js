import './App.css';

const App = () => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')

  const getWeather = async () => {
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
    </div>
  )
}

export default App
