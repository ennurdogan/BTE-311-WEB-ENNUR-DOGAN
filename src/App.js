import React, { useState, useEffect } from 'react';
import './App.css';

// API Anahtarı ve URL Yapılandırması
// NOT: Kendi OpenWeatherMap API anahtarını buraya yapıştırmalısın.
const API_KEY = "408e2a571b253f1e27807f3ed66b54c5"; 
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// 1. Header Bileşeni [cite: 13]
const Header = () => {
  return (
    <header>
      <h1>Hava Durumu Uygulaması</h1>
      <p>Ennur Doğan</p> {}
    </header>
  );
};

// 2. Footer Bileşeni [cite: 15]
const Footer = () => {
  return (
    <footer>
      <p>BÖTE Final Ödevi</p>
    </footer>
  );
};

// 3. Content (Ana İçerik) Bileşeni [cite: 14]
const Content = ({ weatherData, loading, error, fetchWeather }) => {
  const [inputCity, setInputCity] = useState("");

  const handleSearch = () => {
    if (inputCity.trim() !== "") {
      fetchWeather(inputCity);
    }
  };

  return (
    <main>
      {/* Google Tarzı Arama Çubuğu */}
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Şehir ara..." 
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Ara</button>
      </div>

      {/* Yükleniyor Mesajı [cite: 24] */}
      {loading && <div className="loading">Yükleniyor...</div>}

      {/* Hata Mesajı [cite: 25] */}
      {error && <div className="error-msg">{error}</div>}

      {/* Hava Durumu Gösterimi (Liste/Kart)  */}
      {weatherData && !loading && !error && (
        <div className="weather-card">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <h1>{Math.round(weatherData.main.temp)}°C</h1>
          <p>{weatherData.weather[0].description.toUpperCase()}</p>
          <p>Nem: %{weatherData.main.humidity}</p>
        </div>
      )}
    </main>
  );
};

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [bgClass, setBgClass] = useState("default"); // Arka plan kontrolü
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API'den Veri Çekme Fonksiyonu [cite: 6, 17]
  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=tr`);
      
      if (!response.ok) {
        throw new Error("Şehir bulunamadı, lütfen tekrar deneyin.");
      }

     const data = await response.json();
      setWeatherData(data);
      
      // Arka planı duruma göre değiştir
      const mainWeather = data.weather[0].main.toLowerCase();

      if (mainWeather.includes("clear")) {
        setBgClass("sunny");
      } else if (mainWeather.includes("rain") || mainWeather.includes("drizzle")) {
        setBgClass("rainy");
      } else if (mainWeather.includes("snow")) {
        setBgClass("snowy");
      } else if (mainWeather.includes("cloud")) {
        setBgClass("clouds"); // CSS'deki .clouds sınıfını çalıştırır
      } else {
        setBgClass("default"); // Diğer tüm durumlar (Mist, Fog, Dust vb.)
      }

      
    } catch (err) {
      setError(err.message); // Hata durumunda mesajı set et
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // useEffect ile sayfa ilk açıldığında varsayılan bir şehir getir (Opsiyonel ama Hook kullanımı için iyi) 
  useEffect(() => {
    fetchWeather("Ankara");
  }, []);

  return (
    <div className={`app-container ${bgClass}`}>
      <Header />
      <Content 
        weatherData={weatherData} 
        loading={loading} 
        error={error} 
        fetchWeather={fetchWeather} 
      />
      <Footer />
    </div>
  );
}

export default App;