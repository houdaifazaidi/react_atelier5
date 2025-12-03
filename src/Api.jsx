import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Api() {
  const [countries, setCountries] = useState([]);
  const [paginated, setPaginated] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 9;

  // Fetch countries
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all?fields=name,flags,capital,population,region,area")
      .then(response =>
        setCountries(
          response.data.filter(
            country => country.name.common.toLowerCase() !== "israel"
          )
        )
      )
      .catch(error => console.log(error));
  }, []);

  // Update paginated countries whenever page, searchTerm, or countries change
  useEffect(() => {
    const filtered = countries.filter(country => {
      const term = searchTerm.toLowerCase();
      return (
        country.name.common.toLowerCase().includes(term) ||
        country.capital?.[0]?.toLowerCase().includes(term) ||
        country.region?.toLowerCase().includes(term)
      );
    });

    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    setPaginated(filtered.slice(start, end));
  }, [page, countries, searchTerm]);

  const filteredLength = countries.filter(country => {
    const term = searchTerm.toLowerCase();
    return (
      country.name.common.toLowerCase().includes(term) ||
      country.capital?.[0]?.toLowerCase().includes(term) ||
      country.region?.toLowerCase().includes(term)
    );
  }).length;

  const totalPages = Math.ceil(filteredLength / pageSize);

  const nextPage = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Countries</h3>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, capital, or region..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Countries grid using CSS Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", // 3 cards per row
          gap: "1rem",
        }}
      >
        {paginated.map((country, index) => (
          <div key={index} style={{ display: "flex" }}>
            <div className="card shadow-sm flex-fill">
              <img
                src={country.flags.png}
                alt={country.flags.alt || country.name.common}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  objectPosition: "center",
                  borderBottom: "1px solid #eee",
                }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{country.name.common}</h5>
                <p className="card-text mb-1">
                  <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
                </p>
                <p className="card-text mb-1">
                  <strong>Region:</strong> {country.region}
                </p>
                <p className="card-text mb-1">
                  <strong>Population:</strong> {country.population.toLocaleString()}
                </p>
                <p className="card-text mb-1">
                  <strong>Area:</strong> {country.area.toLocaleString()} km²
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between mt-4 mb-5">
        <button
          className="btn btn-primary"
          onClick={prevPage}
          disabled={page === 1}
        >
          Previous Page
        </button>

        <span className="align-self-center">
          Page {page} of {totalPages}
        </span>

        <button
          className="btn btn-primary"
          onClick={nextPage}
          disabled={page >= totalPages}
        >
          Next Page
        </button>
      </div>

      {/* Responsive adjustments */}
      <style>{`
        @media (max-width: 992px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 576px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Api;
