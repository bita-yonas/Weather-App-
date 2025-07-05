import React, { useState, useEffect } from "react";
import "./App.css";

const PMA_DESCRIPTION = `Product Manager Accelerator (PMA) is a community and learning platform for aspiring and current product managers. Learn more at our LinkedIn page: https://www.linkedin.com/company/product-manager-accelerator/`;

function App() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  // New state for Tech Assessment 2
  const [activeTab, setActiveTab] = useState("search");
  const [searchHistory, setSearchHistory] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [mapData, setMapData] = useState(null);
  const [editingQuery, setEditingQuery] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Load search history on component mount
  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/queries");
      if (response.ok) {
        const data = await response.json();
        setSearchHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch search history:", err);
    }
  };

  const fetchWeather = async (locObj) => {
    setLoading(true);
    setError("");
    setWeather(null);
    setForecast(null);
    setYoutubeVideos([]);
    setMapData(null);

    try {
      // Fetch weather data
      const weatherResp = await fetch("http://localhost:3001/api/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ ...locObj, dateFrom, dateTo }),
      });

      if (!weatherResp.ok) {
        const errorData = await weatherResp.json();
        throw new Error(errorData.error || "Error fetching weather");
      }

      const weatherData = await weatherResp.json();
      setWeather(weatherData.current);
      setForecast(weatherData.forecast);

      // Fetch YouTube videos and Maps data
      const locationName = weatherData.current.name;
      if (locationName) {
        fetchYouTubeVideos(locationName);
        fetchMapData(locationName);
      }

      // Refresh search history
      fetchSearchHistory();
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError(
        err.message ||
          "Failed to fetch weather data. Please check if the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchYouTubeVideos = async (locationName) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/youtube/${encodeURIComponent(locationName)}`
      );
      if (response.ok) {
        const data = await response.json();
        setYoutubeVideos(data.videos || []);
      }
    } catch (err) {
      console.error("Failed to fetch YouTube videos:", err);
    }
  };

  const fetchMapData = async (locationName) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/maps/${encodeURIComponent(locationName)}`
      );
      if (response.ok) {
        const data = await response.json();
        setMapData(data.map);
      }
    } catch (err) {
      console.error("Failed to fetch map data:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) return setError("Please enter a location.");
    fetchWeather({ location: location.trim() });
  };

  const handleGeo = () => {
    setError("");
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Could not get your location. Please allow location access.");
        setLoading(false);
      }
    );
  };

  const handleEditQuery = (query) => {
    setEditingQuery(query);
    setLocation(query.location);
    setDateFrom(query.date_from || "");
    setDateTo(query.date_to || "");
    setActiveTab("search");
  };

  const handleUpdateQuery = async () => {
    if (!editingQuery) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/queries/${editingQuery.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location, dateFrom, dateTo }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWeather(data.weatherData.current);
        setForecast(data.weatherData.forecast);
        setEditingQuery(null);
        fetchSearchHistory();
        alert("Query updated successfully!");
      }
    } catch (err) {
      console.error("Failed to update query:", err);
      setError("Failed to update query");
    }
  };

  const handleDeleteQuery = async (id) => {
    if (!confirm("Are you sure you want to delete this query?")) return;

    try {
      const response = await fetch(`http://localhost:3001/api/queries/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSearchHistory();
        alert("Query deleted successfully!");
      }
    } catch (err) {
      console.error("Failed to delete query:", err);
      setError("Failed to delete query");
    }
  };

  const handleExport = (format) => {
    window.open(`http://localhost:3001/api/export/${format}`, "_blank");
  };

  return (
    <div className="app-container">
      <header>
        <h1>Weather App</h1>
        <button onClick={() => setShowInfo(true)} className="info-btn">
          i
        </button>
      </header>

      {showInfo && (
        <div className="info-modal">
          <h2>About This App</h2>
          <p>
            <strong>Built by:</strong> Bitania Yonas
          </p>
          <p>{PMA_DESCRIPTION}</p>
          <button onClick={() => setShowInfo(false)}>Close</button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="nav-tabs">
        <button
          className={activeTab === "search" ? "tab active" : "tab"}
          onClick={() => setActiveTab("search")}
        >
          🔍 Weather Search
        </button>
        <button
          className={activeTab === "history" ? "tab active" : "tab"}
          onClick={() => setActiveTab("history")}
        >
          📋 Search History
        </button>
        <button
          className={activeTab === "export" ? "tab active" : "tab"}
          onClick={() => setActiveTab("export")}
        >
          💾 Export Data
        </button>
      </div>

      {/* Weather Search Tab */}
      {activeTab === "search" && (
        <div className="tab-content">
          <form
            onSubmit={editingQuery ? handleUpdateQuery : handleSubmit}
            className="weather-form"
          >
            <input
              type="text"
              placeholder="Enter city, zip code, landmark, etc."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
              style={{ gridColumn: "1 / -1" }}
            />

            <div className="date-section" style={{ gridColumn: "1 / -1" }}>
              <p
                style={{
                  color: "#4a5568",
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                  fontStyle: "italic",
                }}
              >
                📅 Optional: Add date range for historical context
              </p>
              <div className="date-inputs">
                <input
                  type="date"
                  placeholder="From Date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  disabled={loading}
                />
                <input
                  type="date"
                  placeholder="To Date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="button-section" style={{ gridColumn: "1 / -1" }}>
              <button type="submit" disabled={loading}>
                {loading
                  ? "Loading..."
                  : editingQuery
                  ? "Update Query"
                  : "Get Weather"}
              </button>

              {!editingQuery && (
                <button
                  type="button"
                  onClick={handleGeo}
                  disabled={loading}
                  className="location-btn"
                >
                  📍 Use My Location
                </button>
              )}

              {editingQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingQuery(null);
                    setLocation("");
                    setDateFrom("");
                    setDateTo("");
                  }}
                  className="cancel-btn"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          {loading && (
            <div className="loading">🌤️ Fetching weather data...</div>
          )}
          {error && <div className="error">❌ {error}</div>}

          {weather && (
            <div className="weather-result">
              <h2>
                {weather.displayName ||
                  `${weather.name}, ${weather.sys?.country}`}
              </h2>
              {weather.enhancedLocation && (
                <div style={{ marginBottom: "1rem" }}>
                  <p
                    style={{
                      color: "#4a90e2",
                      fontSize: "0.95rem",
                      fontWeight: "500",
                      marginBottom: "0.5rem",
                    }}
                  >
                    🎯 Exact Location: {weather.enhancedLocation.fullName}
                  </p>
                  <p
                    style={{
                      color: "#666",
                      fontSize: "0.85rem",
                      fontStyle: "italic",
                    }}
                  >
                    📍 Coordinates: {weather.enhancedLocation.lat.toFixed(4)},{" "}
                    {weather.enhancedLocation.lon.toFixed(4)}
                  </p>
                </div>
              )}
              {!weather.enhancedLocation && weather.coordinates && (
                <p
                  style={{
                    color: "#666",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                    fontStyle: "italic",
                  }}
                >
                  📍 Coordinates: {weather.coordinates.lat.toFixed(4)},{" "}
                  {weather.coordinates.lon.toFixed(4)}
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
                <div>
                  <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                    {weather.weather[0].main}
                  </p>
                  <p style={{ color: "#666" }}>
                    {weather.weather[0].description}
                  </p>
                </div>
              </div>

              <div className="weather-details">
                <div className="weather-detail">
                  <strong>Temperature</strong>
                  <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {Math.round(weather.main.temp)}°C
                  </span>
                </div>
                <div className="weather-detail">
                  <strong>Feels like</strong>
                  <span>{Math.round(weather.main.feels_like)}°C</span>
                </div>
                <div className="weather-detail">
                  <strong>Humidity</strong>
                  <span>{weather.main.humidity}%</span>
                </div>
                <div className="weather-detail">
                  <strong>Wind Speed</strong>
                  <span>{weather.wind.speed} m/s</span>
                </div>
                {weather.main.pressure && (
                  <div className="weather-detail">
                    <strong>Pressure</strong>
                    <span>{weather.main.pressure} hPa</span>
                  </div>
                )}
                {weather.visibility && (
                  <div className="weather-detail">
                    <strong>Visibility</strong>
                    <span>{(weather.visibility / 1000).toFixed(1)} km</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {forecast && (
            <div className="forecast">
              <h3>📅 5-Day Forecast</h3>
              <div className="forecast-list">
                {forecast.list
                  .filter((_, i) => i % 8 === 0)
                  .slice(0, 5)
                  .map((item, idx) => (
                    <div key={idx} className="forecast-item">
                      <p className="forecast-date">
                        {new Date(item.dt * 1000).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt={item.weather[0].description}
                      />
                      <p>{item.weather[0].main}</p>
                      <p className="forecast-temp">
                        {Math.round(item.main.temp)}°C
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* YouTube Videos */}
          {youtubeVideos.length > 0 && (
            <div className="youtube-section">
              <h3>🎥 Videos about {weather?.name}</h3>
              <div className="video-grid">
                {youtubeVideos.map((video) => (
                  <div key={video.id} className="video-item">
                    <img src={video.thumbnail} alt={video.title} />
                    <h4>{video.title}</h4>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch on YouTube
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Google Maps */}
          {mapData && (
            <div className="map-section">
              <h3>🗺️ Location Map</h3>
              <iframe
                src={mapData.embedUrl}
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          )}
        </div>
      )}

      {/* Search History Tab */}
      {activeTab === "history" && (
        <div className="tab-content">
          <h3>📋 Search History</h3>
          {searchHistory.length === 0 ? (
            <p>
              No search history yet. Search for weather to see your queries
              here!
            </p>
          ) : (
            <div className="history-list">
              {searchHistory.map((query) => (
                <div key={query.id} className="history-item">
                  <div className="history-info">
                    <h4>{query.location}</h4>
                    <p>
                      Temperature:{" "}
                      {Math.round(query.weather_data.current.main.temp)}°C
                    </p>
                    <p>Weather: {query.weather_data.current.weather[0].main}</p>
                    <p>
                      Searched:{" "}
                      {new Date(query.created_at).toLocaleDateString()}
                    </p>
                    {query.date_from && (
                      <p>
                        Date Range: {query.date_from} to {query.date_to}
                      </p>
                    )}
                  </div>
                  <div className="history-actions">
                    <button onClick={() => handleEditQuery(query)}>
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuery(query.id)}
                      className="delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Export Data Tab */}
      {activeTab === "export" && (
        <div className="tab-content">
          <h3>💾 Export Weather Data</h3>
          <p>Download your weather search history in different formats:</p>
          <div className="export-buttons">
            <button onClick={() => handleExport("csv")} className="export-btn">
              📊 Download CSV
            </button>
            <button onClick={() => handleExport("json")} className="export-btn">
              📄 Download JSON
            </button>
          </div>
          <p className="export-info">
            CSV format is great for Excel/Google Sheets. JSON format preserves
            all data structure.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
