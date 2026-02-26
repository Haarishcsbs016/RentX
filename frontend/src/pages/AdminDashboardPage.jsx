import { useEffect, useState } from "react";
import api from "../api/client.js";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPaidBookings: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalVehicles: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [revenueRes, bookingsRes, usersRes, vehiclesRes] =
          await Promise.all([
            api.get("/admin/revenue"),
            api.get("/admin/bookings"),
            api.get("/admin/users"),
            api.get("/vehicles"),
          ]);

        const revenue = revenueRes.data;
        const allBookings = bookingsRes.data;
        const users = usersRes.data;
        const vehicles = vehiclesRes.data;

        setStats({
          totalRevenue: revenue.totalRevenue || 0,
          totalPaidBookings: revenue.totalBookings || 0,
          totalBookings: allBookings.length,
          totalUsers: users.length,
          totalVehicles: vehicles.length,
        });
        setRecentBookings(allBookings.slice(0, 5));
      } catch {
        setError("Failed to load admin data. Make sure you are an admin user.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section>
      <h2 className="page-title">Admin dashboard</h2>
      <p className="page-subtitle">
        High‑level overview of bookings, revenue and fleet usage.
      </p>

      {loading && <div className="card muted">Loading dashboard data…</div>}
      {error && !loading && <div className="card error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="stats-grid">
            <div className="card stat-card">
              <p className="muted-small">Total revenue</p>
              <p className="stat-value">₹{stats.totalRevenue.toFixed(0)}</p>
            </div>
            <div className="card stat-card">
              <p className="muted-small">Paid bookings</p>
              <p className="stat-value">{stats.totalPaidBookings}</p>
            </div>
            <div className="card stat-card">
              <p className="muted-small">Total bookings</p>
              <p className="stat-value">{stats.totalBookings}</p>
            </div>
            <div className="card stat-card">
              <p className="muted-small">Active users</p>
              <p className="stat-value">{stats.totalUsers}</p>
            </div>
            <div className="card stat-card">
              <p className="muted-small">Vehicles in fleet</p>
              <p className="stat-value">{stats.totalVehicles}</p>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <h3 className="card-title">Recent bookings</h3>
              {recentBookings.length === 0 && (
                <p className="muted-small">No bookings yet.</p>
              )}
              {recentBookings.length > 0 && (
                <div className="table">
                  <div className="table-header compact">
                    <span>Customer</span>
                    <span>Vehicle</span>
                    <span>Dates</span>
                    <span>Status</span>
                  </div>
                  {recentBookings.map((b) => (
                    <div key={b._id} className="table-row compact">
                      <div className="table-primary">
                        {b.user?.name ?? "User"}
                      </div>
                      <div className="muted-small">
                        {b.vehicle?.name ?? "Vehicle"}
                      </div>
                      <div className="muted-small">
                        {new Date(b.startDate).toLocaleDateString()} –{" "}
                        {new Date(b.endDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span
                          className={`badge ${
                            b.paymentStatus === "paid"
                              ? "badge-success-soft"
                              : "badge-warning-soft"
                          }`}
                        >
                          {b.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <h3 className="card-title">Quick insights</h3>
              <ul className="insights-list">
                <li>
                  <span className="dot dot-green" />
                  {stats.totalPaidBookings} completed, paid bookings.
                </li>
                <li>
                  <span className="dot dot-blue" />
                  {stats.totalVehicles} vehicles currently in your fleet.
                </li>
                <li>
                  <span className="dot dot-amber" />
                  {stats.totalUsers} registered customers.
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default AdminDashboardPage;

