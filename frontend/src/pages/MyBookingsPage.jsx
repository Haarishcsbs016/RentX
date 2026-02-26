import { useEffect, useState } from "react";
import api from "../api/client.js";

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/bookings/me");
      setBookings(data);
    } catch {
      setError("Failed to load your bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    setActionLoadingId(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      await loadBookings();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleMarkPaid = async (bookingId) => {
    setActionLoadingId(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/paid`);
      await loadBookings();
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <section>
      <h2 className="page-title">My bookings</h2>
      <p className="page-subtitle">
        Track upcoming trips, download details and manage payments.
      </p>

      {loading && <div className="card muted">Loading your bookings…</div>}
      {error && !loading && <div className="card error">{error}</div>}

      {!loading && !error && bookings.length === 0 && (
        <div className="card muted">
          You have no bookings yet. Pick a vehicle on the home page to get
          started.
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="table-card">
          <div className="table-header">
            <span>Vehicle</span>
            <span>Dates</span>
            <span>Total</span>
            <span>Status</span>
            <span>Payment</span>
            <span />
          </div>
          {bookings.map((booking) => (
            <div key={booking._id} className="table-row">
              <div>
                <div className="table-primary">
                  {booking.vehicle?.name || "Vehicle"}
                </div>
                <div className="muted-small">
                  {booking.vehicle?.brand ?? "Smart Vehicle Rental"}
                </div>
              </div>

              <div className="muted-small">
                {formatDate(booking.startDate)} – {formatDate(booking.endDate)}
              </div>

              <div className="table-primary">₹{booking.totalPrice}</div>

              <div>
                <span
                  className={`badge ${
                    booking.status === "cancelled"
                      ? "badge-danger-soft"
                      : "badge-success-soft"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div>
                <span
                  className={`badge ${
                    booking.paymentStatus === "paid"
                      ? "badge-success-soft"
                      : "badge-warning-soft"
                  }`}
                >
                  {booking.paymentStatus}
                </span>
              </div>

              <div className="table-actions">
                {booking.status !== "cancelled" && (
                  <button
                    className="btn-ghost"
                    type="button"
                    onClick={() => handleCancel(booking._id)}
                    disabled={actionLoadingId === booking._id}
                  >
                    {actionLoadingId === booking._id
                      ? "Updating…"
                      : "Cancel booking"}
                  </button>
                )}
                {booking.paymentStatus !== "paid" &&
                  booking.status !== "cancelled" && (
                    <button
                      className="btn-primary btn-sm"
                      type="button"
                      onClick={() => handleMarkPaid(booking._id)}
                      disabled={actionLoadingId === booking._id}
                    >
                      {actionLoadingId === booking._id
                        ? "Updating…"
                        : "Mark as paid"}
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyBookingsPage;

