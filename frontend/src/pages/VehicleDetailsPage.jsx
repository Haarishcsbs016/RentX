import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const loadVehicle = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/vehicles/${id}`);
        setVehicle(data);
      } catch {
        setError("Failed to load vehicle. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setBookingError(null);
    setBookingSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!form.startDate || !form.endDate) {
      setBookingError("Please select both start and end dates.");
      return;
    }

    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      const { data } = await api.post("/bookings", {
        vehicleId: id,
        startDate: form.startDate,
        endDate: form.endDate,
      });

      setBookingSuccess(
        `Booking confirmed. Total price: ₹${data.totalPrice}. You can see it under My bookings.`
      );
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        "Failed to create booking. Please try again.";
      setBookingError(message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <section>
        <div className="card muted">Loading vehicle details…</div>
      </section>
    );
  }

  if (error || !vehicle) {
    return (
      <section>
        <div className="card error">{error || "Vehicle not found."}</div>
      </section>
    );
  }

  return (
    <section className="vehicle-layout">
      <div className="card vehicle-summary">
        <div className="vehicle-photo">
          <img src={vehicle.image} alt={vehicle.name} />
          <span className="badge badge-soft vehicle-photo-badge">
            {vehicle.type}
          </span>
        </div>
        <div className="vehicle-summary-header">
          <div>
            <h2 className="page-title">{vehicle.name}</h2>
            <p className="page-subtitle">{vehicle.brand}</p>
          </div>
          <p className="price-large">
            ₹{vehicle.pricePerDay}
            <span>/day</span>
          </p>
        </div>

        <div className="vehicle-summary-body">
          <div className="vehicle-meta-row">
            <span className="meta-label">
              {vehicle.fuelType || "Petrol"}
            </span>
            {typeof vehicle.mileageKmPerLitre === "number" && (
              <span className="meta-label">
                {vehicle.mileageKmPerLitre} km/L
              </span>
            )}
            <span className="meta-label">
              {vehicle.location || "Pickup location"}
            </span>
          </div>
          <p className="muted-small owner-line">
            Owner • {vehicle.ownerName || "Smart Rentals Fleet"}
          </p>
          <p className="muted-small">
            {vehicle.availability
              ? "Usually available for same‑day pickup."
              : "Currently unavailable. Try different dates or another vehicle."}
          </p>
        </div>
      </div>

      <div className="card booking-card">
        <h3 className="card-title">Book this vehicle</h3>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="startDate">Start date</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                required
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label htmlFor="endDate">End date</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                required
                value={form.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {bookingError && <div className="form-error">{bookingError}</div>}
          {bookingSuccess && (
            <div className="form-success">{bookingSuccess}</div>
          )}

          <button
            className="btn-primary btn-full"
            type="submit"
            disabled={bookingLoading}
          >
            {bookingLoading ? "Creating booking…" : "Confirm booking"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default VehicleDetailsPage;

