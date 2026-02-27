"use client";

export default function AdminDashboardPage() {
  // Static placeholders for now – wire to API later
  const summaryCards = [
    {
      label: "Total Movies",
      value: "—",
      helper: "All movies in catalogue",
    },
    {
      label: "Today’s Bookings",
      value: "—",
      helper: "Tickets booked today",
    },
    {
      label: "Active Shows Today",
      value: "—",
      helper: "Shows running across all halls",
    },
    {
      label: "Today’s Revenue",
      value: "—",
      helper: "Gross box office + snacks",
    },
  ];

  const recentBookings = [
    // examples – replace with real data
  ];

  const todaysShows = [
    // examples – replace with real data
  ];

  const revenueSparkline = [40, 55, 30, 65, 50, 80, 60];

  const alerts: { type: "info" | "warning" | "critical"; message: string }[] = [];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Admin Control Center</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor CineGhar’s shows, bookings, and performance at a glance.
          </p>
        </div>
      </header>

      {/* Top summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8B0000] via-[#8B0000]/70 to-transparent" />
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{card.value}</p>
            <p className="mt-1 text-xs text-gray-500">{card.helper}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent bookings */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Recent bookings</h2>
                <p className="text-xs text-gray-500">Last 5 bookings across all shows</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Booking
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Movie
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Show time
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                      Seats
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-xs text-gray-500"
                      >
                        No bookings to display yet. Bookings will appear here in real time.
                      </td>
                    </tr>
                  ) : (
                    recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        {/* placeholder typing only – replace when wiring data */}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Today’s shows */}
          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Today’s shows</h2>
                <p className="text-xs text-gray-500">
                  Track occupancy % and spot low-performing or sold-out shows.
                </p>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {todaysShows.length === 0 ? (
                <div className="px-4 py-6 text-xs text-gray-500">
                  No shows to display for today yet. Once shows are scheduled, they will
                  appear here with occupancy.
                </div>
              ) : (
                todaysShows.map((show) => (
                  <div
                    key={show.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                  >
                    {/* placeholder typing only – replace when wiring data */}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          {/* Revenue chart (sparkline style) */}
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Revenue – last 7 days
                </h2>
                <p className="text-xs text-gray-500">Visual trend – connect to API later</p>
              </div>
            </div>
            <div className="mt-4 flex h-24 items-end gap-1 rounded-lg bg-gray-50 px-3 py-2">
              {revenueSparkline.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-sm bg-[#8B0000]/80"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
            <p className="mt-2 text-[11px] text-gray-500">
              Each bar represents one day. Replace placeholder values with real revenue
              data.
            </p>
          </section>

          {/* Most watched movie */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-900">Most watched movie</h2>
              <p className="text-xs text-gray-500">
                Highlight the current top performer.
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="flex h-14 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gray-200 text-[10px] font-medium text-gray-600">
                Poster
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">No data yet</p>
                <p className="text-xs text-gray-500">
                  Once analytics are connected, the top movie, shows, and occupancy will
                  show here.
                </p>
              </div>
            </div>
          </section>

          {/* Alerts panel */}
          <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Alerts</h2>
                <p className="text-xs text-gray-500">
                  Low bookings, sold-out shows, or system notices.
                </p>
              </div>
            </div>
            {alerts.length === 0 ? (
              <p className="text-xs text-gray-500">
                No alerts right now. When connected to live data, items like low occupancy
                shows or sold-out screenings will appear here.
              </p>
            ) : (
              <ul className="space-y-2 text-xs">
                {alerts.map((alert, idx) => (
                  <li
                    key={idx}
                    className={`flex items-start gap-2 rounded-md px-2 py-2 ${
                      alert.type === "critical"
                        ? "bg-red-50 text-red-800"
                        : alert.type === "warning"
                        ? "bg-yellow-50 text-yellow-800"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#8B0000]" />
                    <span>{alert.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
