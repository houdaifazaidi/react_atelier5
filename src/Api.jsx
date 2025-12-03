import React, { useState, useEffect } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'


function Api() {


    const [countries, setCountries] = useState([])
    const [page, setPage] = useState(1)
    const [paginated, setPaginated] = useState([])
    const pageSize = 9



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
    }, [])



    useEffect(() => {
        const start = (page - 1) * pageSize;
        const end = page * pageSize;
        setPaginated(countries.slice(start, end));
    }, [page, countries])



    const nextPage = () => {
        if (page * pageSize < countries.length) {
            setPage(prev => prev + 1);
        }
    }


    const prevPage = () => {
        if (page > 1) {
            setPage(prev => prev - 1);
        }
    }


    
    return (
        <div className="container mt-4">
            <h3 className="mb-4">Countries</h3>

            <div className="row">
                {paginated.map((country, index) => (
                    <div className="col-md-4 mb-3" key={index}>
                        <div className="card shadow-sm">
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
                            <div className="card-body">
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

            <div className="d-flex justify-content-between mt-4 mb-5">
                <button
                    className="btn btn-primary"
                    onClick={prevPage}
                    disabled={page === 1}
                >
                    Previous Page
                </button>

                <span className="align-self-center">Page {page}</span>

                <button
                    className="btn btn-primary"
                    onClick={nextPage}
                    disabled={page * pageSize >= countries.length}
                >
                    Next Page
                </button>
            </div>
        </div>
    )
}

export default Api
