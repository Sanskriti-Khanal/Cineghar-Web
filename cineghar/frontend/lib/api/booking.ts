import axios from "./axios";
import { API } from "./endpoints";

export interface BookingCity {
  id: string;
  name: string;
}

export interface BookingHall {
  _id: string;
  name: string;
  city: string;
  location?: string;
  rating?: number;
  facilities?: string[];
  isActive?: boolean;
}

export interface Showtime {
  _id: string;
  movie: string;
  hall: BookingHall | string;
  startTime: string;
  isActive: boolean;
}

export interface SeatsResponse {
  success: boolean;
  data: {
    rows: string[];
    columns: number;
    bookedSeats: string[];
    heldSeats: { seatId: string; expiresAt: string }[];
  };
}

export const getBookingCitiesApi = async () => {
  const { data } = await axios.get<{ success: boolean; data: BookingCity[] }>(
    API.BOOKING.CITIES
  );
  return data;
};

export const getBookingHallsApi = async (city?: string) => {
  const { data } = await axios.get<{ success: boolean; data: BookingHall[] }>(
    API.BOOKING.HALLS,
    {
      params: city ? { city } : {},
    }
  );
  return data;
};

export const getShowtimesApi = async (params: {
  movieId: string;
  hallId?: string;
  date?: "today" | "tomorrow";
}) => {
  const { data } = await axios.get<{ success: boolean; data: Showtime[] }>(
    API.BOOKING.SHOWTIMES,
    { params }
  );
  return data;
};

export const getSeatsApi = async (showtimeId: string) => {
  const { data } = await axios.get<SeatsResponse>(API.BOOKING.SEATS(showtimeId));
  return data;
};

