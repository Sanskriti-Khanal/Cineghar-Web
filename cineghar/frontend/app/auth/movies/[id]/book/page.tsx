"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
import Navbar from "@/app/_components/Navbar";
import { getMovieByIdApi, getPosterUrl } from "@/lib/api/publicMovies";
import type { CinegharMovie } from "@/lib/api/publicMovies";
import Image from "next/image";
import SnackCard from "./SnackCard";
import ComboCard from "./ComboCard";
import {
  SNACK_ITEMS,
  SNACK_COMBOS,
  SNACK_CATEGORY_TABS,
  type SnackCategory,
} from "./snack-data";
import { initiateKhaltiPaymentApi } from "@/lib/api/payment";

type City = "Kathmandu" | "Pokhara" | "Chitwan";

interface CinemaHall {
  id: string;
  name: string;
  city: City;
  location: string;
  rating: number;
  facilities: string[];
}

const CITIES: { id: City; label: string; description: string }[] = [
  {
    id: "Kathmandu",
    label: "Kathmandu",
    description: "The heart of CineGhar with premium halls.",
  },
  {
    id: "Pokhara",
    label: "Pokhara",
    description: "Lakeside screens with stunning ambience.",
  },
  {
    id: "Chitwan",
    label: "Chitwan",
    description: "Cozy halls perfect for family outings.",
  },
];

const HALLS: CinemaHall[] = [
  {
    id: "ktm-royal",
    name: "CineGhar Royal",
    city: "Kathmandu",
    location: "Durbar Marg",
    rating: 4.8,
    facilities: ["Dolby Atmos", "Premium Recliners", "Snacks Bar"],
  },
  {
    id: "ktm-city",
    name: "CineGhar City Center",
    city: "Kathmandu",
    location: "Naya Baneshwor",
    rating: 4.5,
    facilities: ["4K Screen", "Comfort Seating"],
  },
  {
    id: "pok-lakeside",
    name: "CineGhar Lakeside",
    city: "Pokhara",
    location: "Lakeside",
    rating: 4.6,
    facilities: ["Lake View Lounge", "Dolby Audio"],
  },
  {
    id: "cht-main",
    name: "CineGhar Chitwan",
    city: "Chitwan",
    location: "Bharatpur",
    rating: 4.4,
    facilities: ["Family Seating", "Snack Combos"],
  },
];

const SHOWTIMES = ["10:00 AM", "1:30 PM", "4:30 PM", "7:30 PM", "10:00 PM"];

const ROWS = ["A", "B", "C", "D", "E", "F", "G"];
const COLUMNS = 12;
const BOOKED_SEATS = new Set<string>([
  "B5",
  "B6",
  "C7",
  "C8",
  "D1",
  "D2",
  "E10",
  "E11",
]);

const SEAT_PRICE = 350;
const HOLD_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

type Step = 1 | 2 | 3 | 4 | 5;

export default function MovieBookingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [movie, setMovie] = useState<CinegharMovie | null>(null);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [movieError, setMovieError] = useState<string | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [city, setCity] = useState<City | null>(null);
  const [hallId, setHallId] = useState<string | null>(null);
  const [selectedDateKey, setSelectedDateKey] = useState<"today" | "tomorrow" | null>(null);
  const [showtime, setShowtime] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [heldSeats, setHeldSeats] = useState<Record<string, number>>({});
  const [bookedSeats, setBookedSeats] = useState<Set<string>>(
    () => new Set(BOOKED_SEATS)
  );
  const [now, setNow] = useState(() => Date.now());
  const [snackCart, setSnackCart] = useState<Record<string, number>>({});
  const [snackTab, setSnackTab] = useState<SnackCategory | "combos">("veg");
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (!id) {
      setMovieError("Invalid movie ID");
      setLoadingMovie(false);
      return;
    }

    const fetchMovie = async () => {
      try {
        setLoadingMovie(true);
        setMovieError(null);
        const res = await getMovieByIdApi(id);
        if (res.success && res.data) {
          setMovie(res.data);
        } else {
          setMovieError(res.message || "Movie not found");
        }
      } catch (err) {
        setMovieError(err instanceof Error ? err.message : "Failed to fetch movie");
      } finally {
        setLoadingMovie(false);
      }
    };

    fetchMovie();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      const nowTs = Date.now();
      setNow(nowTs);
      setHeldSeats((prev) => {
        const next: Record<string, number> = {};
        Object.entries(prev).forEach(([seatId, expiresAt]) => {
          if (expiresAt > nowTs) {
            next[seatId] = expiresAt;
          }
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const today = useMemo(() => new Date(), []);
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }, []);

  const selectedHall: CinemaHall | undefined = useMemo(
    () => HALLS.find((h) => h.id === hallId),
    [hallId]
  );

  const availableHalls = useMemo(
    () => (city ? HALLS.filter((h) => h.city === city) : []),
    [city]
  );

  const heldSeatIds = Object.keys(heldSeats);
  const heldSeatCount = heldSeatIds.length;
  const ticketSubtotal = heldSeatCount * SEAT_PRICE;
  const snacksSubtotal = useMemo(() => {
    let total = 0;
    SNACK_ITEMS.forEach((item) => {
      const qty = snackCart[item.id] ?? 0;
      total += qty * item.price;
    });
    SNACK_COMBOS.forEach((combo) => {
      const qty = snackCart[combo.id] ?? 0;
      total += qty * combo.price;
    });
    return total;
  }, [snackCart]);
  const grandTotal = ticketSubtotal + snacksSubtotal;
  const posterSrc = getPosterUrl(movie?.posterUrl);

  const handleSeatToggle = (seatId: string) => {
    if (bookedSeats.has(seatId) || heldSeats[seatId]) return;
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) {
        next.delete(seatId);
      } else {
        next.add(seatId);
      }
      return next;
    });
  };

  const holdSeats = () => {
    if (!city || !selectedHall || !selectedDateKey || !showtime) {
      alert("Please choose city, cinema hall, date and showtime before holding seats.");
      return;
    }
    if (selectedSeats.size === 0) return;
    const nowTs = Date.now();
    setHeldSeats((prev) => {
      const next: Record<string, number> = { ...prev };
      selectedSeats.forEach((seatId) => {
        if (!bookedSeats.has(seatId)) {
          next[seatId] = nowTs + HOLD_DURATION_MS;
        }
      });
      return next;
    });
    setSelectedSeats(new Set());
  };

  const continueToSnacks = () => {
    if (!city || !selectedHall || !selectedDateKey || !showtime) {
      alert("Please complete city, hall, date and showtime first.");
      return;
    }
    if (heldSeatCount === 0) {
      if (selectedSeats.size === 0) {
        alert("Please select at least one seat before continuing.");
        return;
      }
      const nowTs = Date.now();
      setHeldSeats((prev) => {
        const next: Record<string, number> = { ...prev };
        selectedSeats.forEach((seatId) => {
          if (!bookedSeats.has(seatId)) {
            next[seatId] = nowTs + HOLD_DURATION_MS;
          }
        });
        return next;
      });
      setSelectedSeats(new Set());
    }
    setStep(5);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const skipSnacksAndPay = () => {
    void proceedToPayment({ skipSnacks: true });
  };

  const proceedToPayment = async (options?: { skipSnacks?: boolean }) => {
    if (!city || !selectedHall || !selectedDateKey || !showtime || heldSeatCount === 0) {
      alert("Please complete seat selection first.");
      return;
    }
    const snacksTotal = options?.skipSnacks ? 0 : snacksSubtotal;
    const total = ticketSubtotal + snacksTotal;
    if (total <= 0) {
      alert("Total amount must be greater than zero.");
      return;
    }

    try {
      setIsPaying(true);

      const purchaseOrderId = `BOOK-${id}-${Date.now()}`;
      const purchaseOrderName = `Tickets for ${movie?.title ?? "CineGhar"}`;

      const metadata = {
        city,
        hallId: selectedHall.id,
        hallName: selectedHall.name,
        movieId: id,
        movieTitle: movie?.title,
        dateKey: selectedDateKey,
        showtime,
        seats: heldSeatIds,
        ticketSubtotal,
        snacksSubtotal: snacksTotal,
        total,
      };

      const res = await initiateKhaltiPaymentApi({
        amount: total,
        purchaseOrderId,
        purchaseOrderName,
        metadata,
      });

      if (!res.success || !res.data?.payment_url) {
        throw new Error(res.message || "Failed to start payment with Khalti");
      }

      // Redirect user to Khalti hosted payment page
      window.location.href = res.data.payment_url;
    } catch (error: any) {
      // eslint-disable-next-line no-alert
      alert(
        error?.message || "Something went wrong while starting payment. Please try again."
      );
    } finally {
      setIsPaying(false);
    }
  };

  const addSnackToCart = (id: string) => {
    setSnackCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };
  const incrementSnack = (id: string) => {
    setSnackCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };
  const decrementSnack = (id: string) => {
    setSnackCart((prev) => {
      const current = prev[id] ?? 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const dateDisplay = (key: "today" | "tomorrow") => {
    const d = key === "today" ? today : tomorrow;
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const canGoNextFromStep1 = !!city;
  const canGoNextFromStep2 = !!selectedHall;
  const canGoNextFromStep3 = !!selectedDateKey && !!showtime;

  const formatTimeLeft = (expiresAt: number) => {
    const diff = expiresAt - now;
    if (diff <= 0) return "0m";
    const totalMinutes = Math.floor(diff / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loadingMovie) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#050509] text-white">
          <Navbar />
          <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0000]" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (movieError || !movie) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#050509] text-white">
          <Navbar />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-red-500/10 border border-red-500/40 text-red-200 px-4 py-3 rounded-lg">
              {movieError || "Movie not found"}
            </div>
            <button
              onClick={() => router.back()}
              className="mt-4 px-6 py-2 bg-[#8B0000] text-white rounded-lg hover:bg-[#6B0000] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const selectedDateText =
    selectedDateKey === "today" ? "Today" : selectedDateKey === "tomorrow" ? "Tomorrow" : null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050509] text-white">
        <Navbar />

        <main className="pt-16 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="h-20 w-14 overflow-hidden rounded-md bg-white/5 border border-white/10 relative flex-shrink-0">
                  {posterSrc ? (
                    <Image
                      src={posterSrc}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      No poster
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                    Booking · CineGhar
                  </p>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1">
                    {movie.title}
                  </h1>
                  {movie.language && (
                    <p className="text-xs text-gray-400 mt-1">
                      {movie.language} · {movie.duration} min
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => router.back()}
                className="self-start rounded-full border border-white/20 px-4 py-1.5 text-xs text-gray-300 hover:bg-white/10 transition-colors"
              >
                ← Back
              </button>
            </div>

            {/* Layout */}
            <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8">
              {/* Left: Steps */}
              <div className="space-y-6">
                {/* Step indicator */}
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-400 overflow-x-auto pb-1">
                  {([1, 2, 3, 4, 5] as const).map((s) => (
                    <div key={s} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center border text-[11px] transition-colors ${
                          step === s
                            ? "border-[#8B0000] bg-[#8B0000] text-white"
                            : step > s
                            ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-200"
                            : "border-white/20 bg-white/5 text-gray-300"
                        }`}
                      >
                        {s}
                      </div>
                      {s < 5 && (
                        <div className="w-4 sm:w-6 h-px bg-gradient-to-r from-white/20 to-transparent" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step content */}
                {/* Step 1: City selection */}
                <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/60 via-black/40 to-[#150308]/60 p-4 sm:p-5 shadow-[0_18px_45px_rgba(0,0,0,0.8)]">
                  <header className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-semibold text-white">1. Choose City</h2>
                      <p className="text-xs text-gray-400">
                        Start by selecting where you want to watch.
                      </p>
                    </div>
                  </header>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {CITIES.map((c) => {
                      const isActive = city === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setCity(c.id);
                            setHallId(null);
                            setStep(2);
                          }}
                          className={`group rounded-xl border px-3 py-3 text-left text-xs transition-all ${
                            isActive
                              ? "border-[#8B0000] bg-[#8B0000]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                              : "border-white/10 bg-white/5 hover:border-[#8B0000]/70 hover:bg-white/10"
                          }`}
                        >
                          <p className="font-semibold text-white">{c.label}</p>
                          <p className="mt-1 text-[11px] text-gray-300 line-clamp-2">
                            {c.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Step 2: Hall selection */}
                <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/60 via-black/40 to-[#150308]/60 p-4 sm:p-5 opacity-100">
                  <header className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-semibold text-white">2. Select Cinema Hall</h2>
                      <p className="text-xs text-gray-400">
                        Pick your preferred CineGhar hall in the selected city.
                      </p>
                    </div>
                  </header>
                  {city ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {availableHalls.map((hall) => {
                        const active = hallId === hall.id;
                        return (
                          <button
                            key={hall.id}
                            type="button"
                            onClick={() => {
                              setHallId(hall.id);
                              setStep((prev) => (prev < 3 ? 3 : prev));
                            }}
                            className={`rounded-xl border px-3 py-3 text-left text-xs transition-all ${
                              active
                                ? "border-[#8B0000] bg-[#8B0000]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                                : "border-white/10 bg-white/5 hover:border-[#8B0000]/70 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <p className="font-semibold text-white">{hall.name}</p>
                                <p className="mt-1 text-[11px] text-gray-300">{hall.location}</p>
                              </div>
                              <div className="text-[11px] text-amber-300">
                                ★ {hall.rating.toFixed(1)}
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {hall.facilities.map((f) => (
                                <span
                                  key={f}
                                  className="rounded-full bg-black/40 border border-white/10 px-2 py-0.5 text-[10px] text-gray-300"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Select a city above to see available cinema halls.
                    </p>
                  )}
                </section>

                {/* Step 3: Date & showtime */}
                <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/60 via-black/40 to-[#150308]/60 p-4 sm:p-5">
                  <header className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-sm font-semibold text-white">
                        3. Choose Date & Showtime
                      </h2>
                      <p className="text-xs text-gray-400">
                        You can only book for today or tomorrow.
                      </p>
                    </div>
                  </header>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {(["today", "tomorrow"] as const).map((key) => {
                      const active = selectedDateKey === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setSelectedDateKey(key);
                            setStep((prev) => (prev < 3 ? 3 : prev));
                          }}
                          className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                            active
                              ? "border-[#8B0000] bg-[#8B0000]/30 text-white"
                              : "border-white/20 bg-white/5 text-gray-200 hover:border-[#8B0000]/70 hover:bg-white/10"
                          }`}
                        >
                          <span className="block">
                            {key === "today" ? "Today" : "Tomorrow"}
                          </span>
                          <span className="block text-[10px] text-gray-300 mt-0.5">
                            {dateDisplay(key)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2">
                    <p className="text-[11px] text-gray-400 mb-2">Available showtimes</p>
                    <div className="flex flex-wrap gap-2">
                      {SHOWTIMES.map((time) => {
                        const active = showtime === time;
                        return (
                          <button
                            key={time}
                            type="button"
                            onClick={() => {
                              setShowtime(time);
                              setStep((prev) => (prev < 4 ? 4 : prev));
                            }}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                              active
                                ? "bg-[#8B0000] text-white shadow-[0_10px_30px_rgba(0,0,0,0.9)]"
                                : "bg-white/5 text-gray-200 border border-white/15 hover:bg-white/10"
                            }`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* Step 4: Seats */}
                {step <= 4 && (
                  <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/60 via-black/40 to-[#150308]/60 p-4 sm:p-5">
                  <header className="flex items-center justify-between mb-3">
                    <div>
                      <h2 className="text-sm font-semibold text-white">4. Pick Your Seats</h2>
                      <p className="text-xs text-gray-400">
                        Choose seats from the layout below. Each seat is NPR {SEAT_PRICE}.
                      </p>
                    </div>
                  </header>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-3 text-[11px] text-gray-300 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-sm bg-gray-700 border border-gray-500" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-sm bg-yellow-400 border border-yellow-500" />
                      <span>Held</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-sm bg-red-700 border border-red-800" />
                      <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-3 w-3 rounded-sm bg-black border border-[#8B0000]" />
                      <span>Selected</span>
                    </div>
                  </div>

                  {/* Screen (curved, C facing seats) */}
                  <div className="mb-4 flex flex-col items-center">
                    <div className="relative w-64 h-10 overflow-hidden">
                      <div className="absolute inset-x-4 top-0 h-16 rounded-b-full border-2 border-white/40 border-t-transparent bg-gradient-to-b from-white/10 via-white/5 to-transparent shadow-[0_18px_45px_rgba(0,0,0,0.8)]" />
                    </div>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-gray-400">
                      Screen
                    </p>
                  </div>

                  {/* Seats grid */}
                  <div className="space-y-2 overflow-x-auto pb-1">
                    {ROWS.map((rowIndex, rowIdx) => (
                      <div key={rowIndex} className="flex items-center gap-1 justify-center">
                        <span className="w-4 text-[10px] text-gray-400">
                          {rowIndex}
                        </span>
                        {Array.from({ length: COLUMNS }, (_, i) => i + 1).map((col) => {
                          const seatId = `${rowIndex}${col}`;
                          const isBooked = bookedSeats.has(seatId);
                          const holdExpiry = heldSeats[seatId];
                          const isHeld = !!holdExpiry && holdExpiry > now;
                          const isSelected = selectedSeats.has(seatId);
                          const center = (COLUMNS + 1) / 2;
                          const dist = Math.abs(col - center);
                          // Seats curve slightly toward the screen (small "c")
                          const baseCurve = 0.35;
                          const rowFactor = 1 + rowIdx * 0.08; // back rows a bit flatter
                          const yOffset = -(dist * dist * baseCurve) / rowFactor;
                          const seatImageSrc = isBooked
                            ? "/images/seats/booked.png"
                            : isHeld
                            ? "/images/seats/hold.png"
                            : isSelected
                            ? "/images/seats/selected.png"
                            : "/images/seats/seat.png";
                          return (
                            <button
                              key={seatId}
                              type="button"
                              onClick={() => handleSeatToggle(seatId)}
                              disabled={isBooked || isHeld}
                              title={
                                isHeld && holdExpiry
                                  ? `Held · expires in ${formatTimeLeft(holdExpiry)}`
                                  : undefined
                              }
                              className="h-7 w-7 rounded-full flex items-center justify-center transition-transform"
                              style={{ transform: `translateY(${yOffset}px)` }}
                            >
                              <Image
                                src={seatImageSrc}
                                alt="Seat"
                                width={24}
                                height={24}
                                className="pointer-events-none select-none"
                              />
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <p className="mt-3 text-[11px] text-gray-400 text-center">
                    Tip: Rows closer to the middle give the best viewing experience.
                  </p>
                </section>
                )}

                {/* Step 5: Snacks & Beverages (Optional) */}
                {step >= 5 && (
                  <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/60 via-black/40 to-[#150308]/60 p-4 sm:p-5 shadow-[0_18px_45px_rgba(0,0,0,0.8)] transition-opacity duration-300">
                    <header className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <h2 className="text-sm font-semibold text-white">
                          5. Add Snacks & Beverages <span className="text-gray-400 font-normal">(Optional)</span>
                        </h2>
                        <p className="text-xs text-gray-400">
                          Add treats to your order. One combined payment for tickets + snacks.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={skipSnacksAndPay}
                        className="text-xs font-medium text-gray-400 hover:text-white underline underline-offset-2 transition-colors"
                      >
                        Skip Snacks
                      </button>
                    </header>

                    {/* Category tabs */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {SNACK_CATEGORY_TABS.map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setSnackTab(tab.key)}
                          className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                            snackTab === tab.key
                              ? "bg-[#8B0000] text-white shadow-[0_4px_14px_rgba(139,0,0,0.4)]"
                              : "bg-white/5 text-gray-300 border border-white/15 hover:bg-white/10 hover:border-[#8B0000]/50"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Snack grid */}
                    {snackTab !== "combos" && (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {SNACK_ITEMS.filter((item) => item.category === snackTab).map((item) => (
                          <SnackCard
                            key={item.id}
                            item={item}
                            quantity={snackCart[item.id] ?? 0}
                            onAdd={() => addSnackToCart(item.id)}
                            onIncrement={() => incrementSnack(item.id)}
                            onDecrement={() => decrementSnack(item.id)}
                          />
                        ))}
                      </div>
                    )}

                    {/* Popular Combos - larger cards */}
                    {snackTab === "combos" && (
                      <div className="space-y-4">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider">
                          Best deals
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {SNACK_COMBOS.map((combo) => (
                            <ComboCard
                              key={combo.id}
                              combo={combo}
                              quantity={snackCart[combo.id] ?? 0}
                              onAdd={() => addSnackToCart(combo.id)}
                              onIncrement={() => incrementSnack(combo.id)}
                              onDecrement={() => decrementSnack(combo.id)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}
              </div>

              {/* Right: Summary */}
              <aside className="rounded-2xl border border-white/10 bg-gradient-to-b from-black/70 via-black/60 to-[#150308]/80 p-4 sm:p-5 h-fit shadow-[0_18px_45px_rgba(0,0,0,0.9)] sticky top-20">
                <h2 className="text-sm font-semibold text-white mb-3">Booking Summary</h2>

                <div className="space-y-3 text-xs text-gray-300">
                  <div className="flex gap-2">
                    <span className="w-20 text-gray-400">Movie</span>
                    <span className="font-medium text-white line-clamp-2">{movie.title}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-20 text-gray-400">City</span>
                    <span>{city ?? <span className="text-gray-500">Not selected</span>}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-20 text-gray-400">Hall</span>
                    <span>
                      {selectedHall ? (
                        <>
                          {selectedHall.name}
                          <span className="block text-[11px] text-gray-400">
                            {selectedHall.location}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500">Not selected</span>
                      )}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-20 text-gray-400">Date</span>
                    <span>
                      {selectedDateKey ? (
                        <>
                          {selectedDateText}{" "}
                          <span className="text-gray-400">· {dateDisplay(selectedDateKey)}</span>
                        </>
                      ) : (
                        <span className="text-gray-500">Not selected</span>
                      )}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-20 text-gray-400">Time</span>
                    <span>{showtime ?? <span className="text-gray-500">Not selected</span>}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-20 text-gray-400">Selected</span>
                    <span>
                      {selectedSeats.size > 0 ? (
                        <span className="flex flex-wrap gap-1">
                          {Array.from(selectedSeats).map((seat) => (
                            <span
                              key={seat}
                              className="inline-flex items-center rounded-full bg-black/40 border border-[#8B0000]/70 px-2 py-0.5 text-[11px] text-red-100"
                            >
                              {seat}
                            </span>
                          ))}
                        </span>
                      ) : (
                        <span className="text-gray-500">No seats selected</span>
                      )}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-20 text-gray-400">Held</span>
                    <span>
                      {heldSeatIds.length > 0 ? (
                        <span className="flex flex-col gap-1">
                          {heldSeatIds.map((seat) => (
                            <span
                              key={seat}
                              className="inline-flex items-center justify-between gap-2 rounded-full bg-yellow-400/20 border border-yellow-400/70 px-2 py-0.5 text-[11px] text-yellow-100"
                            >
                              <span>{seat}</span>
                              <span className="text-[10px] text-yellow-200/90">
                                {formatTimeLeft(heldSeats[seat])}
                              </span>
                            </span>
                          ))}
                        </span>
                      ) : (
                        <span className="text-gray-500">No seats held</span>
                      )}
                    </span>
                  </div>
                  {step >= 5 && Object.keys(snackCart).length > 0 && (
                    <div className="flex gap-2">
                      <span className="w-20 text-gray-400">Snacks</span>
                      <span className="flex flex-wrap gap-1">
                        {SNACK_ITEMS.filter((item) => (snackCart[item.id] ?? 0) > 0).map((item) => (
                          <span
                            key={item.id}
                            className="rounded-full bg-[#8B0000]/30 border border-[#8B0000]/60 px-2 py-0.5 text-[11px] text-red-100"
                          >
                            {item.name} × {snackCart[item.id]}
                          </span>
                        ))}
                        {SNACK_COMBOS.filter((combo) => (snackCart[combo.id] ?? 0) > 0).map((combo) => (
                          <span
                            key={combo.id}
                            className="rounded-full bg-[#8B0000]/30 border border-[#8B0000]/60 px-2 py-0.5 text-[11px] text-red-100"
                          >
                            {combo.name} × {snackCart[combo.id]}
                          </span>
                        ))}
                      </span>
                    </div>
                  )}
                </div>

                <div className="my-4 h-px bg-gradient-to-r from-white/10 via-white/30 to-white/10" />

                <div className="space-y-2 text-xs text-gray-200">
                  <div className="flex items-center justify-between">
                    <span>Ticket subtotal</span>
                    <span>
                      {heldSeatCount} × NPR {SEAT_PRICE} = NPR {ticketSubtotal.toLocaleString()}
                    </span>
                  </div>
                  {step >= 5 && (
                    <>
                      <div className="flex items-center justify-between">
                        <span>Snacks subtotal</span>
                        <span>NPR {snacksSubtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span>Convenience fee</span>
                        <span>Included</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center justify-between text-sm font-semibold text-white pt-2">
                    <span>{step >= 5 ? "Grand total" : "Total"}</span>
                    <span>NPR {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  {step < 5 && (
                    <>
                      <button
                        type="button"
                        onClick={holdSeats}
                        className="w-full rounded-full border border-[#8B0000] bg-transparent px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#8B0000]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        disabled={
                          !city ||
                          !selectedHall ||
                          !selectedDateKey ||
                          !showtime ||
                          selectedSeats.size === 0
                        }
                      >
                        Hold Seats
                      </button>
                      <button
                        type="button"
                        onClick={continueToSnacks}
                        className="w-full rounded-full bg-gradient-to-r from-[#8B0000] to-[#A00000] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(0,0,0,0.9)] hover:shadow-[0_18px_50px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        disabled={
                          !city ||
                          !selectedHall ||
                          !selectedDateKey ||
                          !showtime ||
                          (heldSeatCount === 0 && selectedSeats.size === 0)
                        }
                      >
                        Continue
                      </button>
                    </>
                  )}
                  {step >= 5 && (
                    <button
                      type="button"
                      onClick={proceedToPayment}
                      className="w-full rounded-full bg-gradient-to-r from-[#8B0000] to-[#A00000] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(0,0,0,0.9)] hover:shadow-[0_18px_50px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      disabled={
                        !city ||
                        !selectedHall ||
                        !selectedDateKey ||
                        !showtime ||
                        heldSeatCount === 0 ||
                        isPaying
                      }
                    >
                      {isPaying ? "Redirecting to Khalti..." : "Proceed to Payment"}
                    </button>
                  )}
                </div>

                <p className="mt-2 text-[10px] text-gray-500 text-center">
                  {step >= 5
                    ? "One combined payment for tickets and snacks."
                    : "Hold seats, then continue to add snacks (optional) and pay."}
                </p>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

