import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import { connectDb } from "../database/mongodb";
import { CinemaHallModel } from "../models/cinema-hall.model";
import { MovieModel } from "../models/movie.model";
import { ShowtimeModel } from "../models/showtime.model";
import { BookingModel } from "../models/booking.model";
import { SeatHoldModel } from "../models/seat-hold.model";
import { UserModel } from "../models/user.model";

describe("Booking integration tests", () => {
  let userToken: string;
  let movieId: string;
  let hallId: string;
  let showtimeId: string;

  beforeAll(async () => {
    await connectDb();
  }, 30000);

  afterAll(async () => {
    await mongoose.disconnect();
  }, 15000);

  beforeEach(async () => {
    await Promise.all([
      CinemaHallModel.deleteMany({}),
      MovieModel.deleteMany({}),
      ShowtimeModel.deleteMany({}),
      BookingModel.deleteMany({}),
      SeatHoldModel.deleteMany({}),
      UserModel.deleteMany({}),
    ]);

    // Seed one movie
    const movie = await MovieModel.create({
      title: "Test Movie",
      description: "A test movie for booking flows",
      language: "English",
      duration: 120,
      rating: 8.5,
      genre: ["Drama"],
    } as any);
    movieId = movie._id.toString();

    // Seed one hall
    const hall = await CinemaHallModel.create({
      name: "Test Hall",
      city: "Kathmandu",
      location: "Test Location",
      isActive: true,
      capacity: 100,
    } as any);
    hallId = hall._id.toString();

    // Seed one showtime today
    const startTime = new Date();
    const st = await ShowtimeModel.create({
      movie: movieId,
      hall: hallId,
      startTime,
      isActive: true,
    } as any);
    showtimeId = st._id.toString();

    // Create & login user
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Booking User",
        email: "booking@example.com",
        password: "password123",
        confirmPassword: "password123",
      })
      .expect(201);

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "booking@example.com",
        password: "password123",
      })
      .expect(200);

    userToken = loginRes.body.token;
  });

  it("GET /api/booking/cities returns supported cities", async () => {
    const res = await request(app).get("/api/booking/cities").expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty("id");
    expect(res.body.data[0]).toHaveProperty("name");
  });

  it("GET /api/booking/halls filters by city", async () => {
    const res = await request(app)
      .get("/api/booking/halls")
      .query({ city: "Kathmandu" })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].name).toBe("Test Hall");
    expect(res.body.data[0].city).toBe("Kathmandu");
  });

  it("GET /api/booking/halls returns empty array for city with no halls", async () => {
    const res = await request(app)
      .get("/api/booking/halls")
      .query({ city: "Pokhara" })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it("GET /api/booking/showtimes filters by movie", async () => {
    const res = await request(app)
      .get("/api/booking/showtimes")
      .query({ movieId, hallId, date: "today" })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    const st = res.body.data[0];
    const movieField = typeof st.movie === "string" ? st.movie : st.movie._id;
    const hallField = typeof st.hall === "string" ? st.hall : st.hall._id;
    expect(movieField.toString()).toBe(movieId);
    expect(hallField.toString()).toBe(hallId);
  });

  it("GET /api/booking/showtimes returns empty for unknown movie", async () => {
    const otherMovieId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .get("/api/booking/showtimes")
      .query({ movieId: otherMovieId, hallId, date: "today" })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });

  it("GET /api/booking/showtimes/:id/seats returns empty seats initially", async () => {
    const res = await request(app)
      .get(`/api/booking/showtimes/${showtimeId}/seats`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data.rows)).toBe(true);
    expect(typeof res.body.data.columns).toBe("number");
    expect(Array.isArray(res.body.data.bookedSeats)).toBe(true);
    expect(Array.isArray(res.body.data.heldSeats)).toBe(true);
  });

  it("POST /api/booking/holds creates hold for seats", async () => {
    const res = await request(app)
      .post("/api/booking/holds")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        showtimeId,
        seats: ["A1", "A2"],
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.seats).toEqual(expect.arrayContaining(["A1", "A2"]));
  });

  it("POST /api/booking/holds rejects conflict seats", async () => {
    // First user holds A1
    await request(app)
      .post("/api/booking/holds")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        showtimeId,
        seats: ["A1"],
      })
      .expect(201);

    // Second user
    await request(app)
      .post("/api/auth/register")
      .send({
        name: "Second User",
        email: "second@example.com",
        password: "password123",
        confirmPassword: "password123",
      })
      .expect(201);

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "second@example.com",
        password: "password123",
      })
      .expect(200);

    const secondToken = loginRes.body.token;

    const res = await request(app)
      .post("/api/booking/holds")
      .set("Authorization", `Bearer ${secondToken}`)
      .send({
        showtimeId,
        seats: ["A1"],
      })
      .expect(409);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/already booked or held/i);
  });

  it("POST /api/booking/confirm creates booking from held seats", async () => {
    await request(app)
      .post("/api/booking/holds")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        showtimeId,
        seats: ["B1", "B2"],
      })
      .expect(201);

    const res = await request(app)
      .post("/api/booking/confirm")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        showtimeId,
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.showtime.toString()).toBe(showtimeId);
    expect(res.body.data.seats.length).toBe(2);

    const booking = await BookingModel.findById(res.body.data._id);
    expect(booking).not.toBeNull();
    expect(booking!.seats).toEqual(expect.arrayContaining(["B1", "B2"]));
  });

  it("POST /api/booking/confirm fails when no valid hold", async () => {
    const res = await request(app)
      .post("/api/booking/confirm")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        showtimeId,
      })
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/no valid held seats/i);
  });

  it("POST /api/booking/holds fails without auth token", async () => {
    const res = await request(app)
      .post("/api/booking/holds")
      .send({
        showtimeId,
        seats: ["C1"],
      })
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/unauthorized|token/i);
  });

  it("POST /api/booking/confirm fails without auth token", async () => {
    const res = await request(app)
      .post("/api/booking/confirm")
      .send({
        showtimeId,
      })
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/unauthorized|token/i);
  });

  it("POST /api/booking/holds validates required fields", async () => {
    const res = await request(app)
      .post("/api/booking/holds")
      .set("Authorization", `Bearer ${userToken}`)
      .send({})
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/showtimeId and seats are required/i);
  });

  it("POST /api/booking/holds validates non-empty seats array", async () => {
    const res = await request(app)
      .post("/api/booking/holds")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        showtimeId,
        seats: [],
      })
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/showtimeId and seats are required/i);
  });
});

