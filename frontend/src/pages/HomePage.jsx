import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";

const typeOptions = ["All", "Car", "Bike", "Scooter"];

const HomePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    type: "All",
    minPrice: "",
    maxPrice: "",
  });

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.type !== "All") params.type = filters.type;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const { data } = await api.get("/vehicles", { params });
      setVehicles(data);
    } catch (err) {
      setError("Failed to load vehicles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchVehicles();
  };

  return (
    <section>
      <div className="hero">
        <div>
          <h1 className="hero-title">Rent the right vehicle, fast.</h1>
          <p className="hero-subtitle">
            Compare real‑time availability and pricing, then book your ride in a
            few clicks.
          </p>
        </div>
        <div className="hero-pill">
          <span className="pill-dot" />
          <span>Trusted by urban commuters and fleet teams</span>
        </div>
      </div>

      <form className="filters" onSubmit={handleApplyFilters}>
        <div className="filters-row">
          <div className="form-field">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              name="search"
              placeholder="Search by name or brand"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field form-field-inline">
            <label htmlFor="minPrice">Price / day</label>
            <div className="price-inputs">
              <input
                id="minPrice"
                name="minPrice"
                type="number"
                min={0}
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <span>–</span>
              <input
                id="maxPrice"
                name="maxPrice"
                type="number"
                min={0}
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary btn-lg">
          Apply filters
        </button>
      </form>

      <div className="section-header">
        <h2 className="section-title">Available cars & bikes</h2>
        <p className="section-subtitle">
          Browse curated vehicles with real‑time pricing, fuel type and owner
          info.
        </p>
      </div>

      {loading && <div className="card muted">Loading vehicles…</div>}
      {error && !loading && <div className="card error">{error}</div>}

      {!loading && !error && vehicles.length === 0 && (
        <div className="card muted">No vehicles match your filters.</div>
      )}

      <div className="card-grid">
        {vehicles.map((vehicle) => (
          <article key={vehicle._id} className="card vehicle-card">
            <div className="vehicle-card-media">
              <img
                src={vehicle.image || "/placeholder-vehicle.jpg"}
                alt={vehicle.name}
                className="vehicle-image"
              />
              <span className="badge badge-soft media-badge">
                {vehicle.type || "Vehicle"}
              </span>
            </div>

            <div className="vehicle-card-header">
              <div>
                <h3>{vehicle.name}</h3>
                <p className="muted">{vehicle.brand}</p>
              </div>
              <p className="price">
                ₹{vehicle.pricePerDay}
                <span>/day</span>
              </p>
            </div>

            <div className="vehicle-card-body">
              <div className="vehicle-meta-row">
                <span className="meta-label">
                  {vehicle.fuelType || "Petrol"}
                </span>
                <span className="meta-label">
                  {vehicle.mileageKmPerLitre
                    ? `${vehicle.mileageKmPerLitre} km/L`
                    : "Mileage N/A"}
                </span>
                <span className="meta-label">
                  {vehicle.location || "Pickup location"}
                </span>
              </div>
              <p className="muted-small owner-line">
                Owner • {vehicle.ownerName || "Smart Rentals Fleet"}
              </p>
              <p className="muted-small">
                {vehicle.availability
                  ? "Available for your selected dates."
                  : "Currently unavailable for booking."}
              </p>
            </div>

            <div className="vehicle-card-footer">
              <Link
                to={`/vehicles/${vehicle._id}`}
                className="btn-primary btn-full"
              >
                Select &amp; book
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HomePage;

