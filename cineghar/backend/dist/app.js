"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const auth_route_2 = __importDefault(require("./routes/admin/auth.route"));
const user_route_1 = __importDefault(require("./routes/admin/user.route"));
const movie_route_1 = __importDefault(require("./routes/admin/movie.route"));
const hall_route_1 = __importDefault(require("./routes/admin/hall.route"));
const showtime_route_1 = __importDefault(require("./routes/admin/showtime.route"));
const sales_route_1 = __importDefault(require("./routes/admin/sales.route"));
const loyalty_route_1 = __importDefault(require("./routes/admin/loyalty.route"));
const offer_route_1 = __importDefault(require("./routes/admin/offer.route"));
const reward_route_1 = __importDefault(require("./routes/admin/reward.route"));
const snack_route_1 = __importDefault(require("./routes/admin/snack.route"));
const dashboard_route_1 = __importDefault(require("./routes/admin/dashboard.route"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const offers_route_1 = __importDefault(require("./routes/offers.route"));
const rewards_route_1 = __importDefault(require("./routes/rewards.route"));
const movies_route_1 = __importDefault(require("./routes/movies.route"));
const booking_route_1 = __importDefault(require("./routes/booking.route"));
const loyalty_route_2 = __importDefault(require("./routes/loyalty.route"));
const snack_route_2 = __importDefault(require("./routes/snack.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:5050",
        process.env.FRONTEND_URL || "http://localhost:3000",
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
        process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "",
    ].filter(Boolean),
    credentials: true,
}));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/auth", auth_route_1.default);
app.use("/api/admin/auth", auth_route_2.default);
app.use("/api/admin/users", user_route_1.default);
app.use("/api/admin/movies", movie_route_1.default);
app.use("/api/admin/halls", hall_route_1.default);
app.use("/api/admin/showtimes", showtime_route_1.default);
app.use("/api/admin/sales", sales_route_1.default);
app.use("/api/admin/loyalty", loyalty_route_1.default);
app.use("/api/admin/offers", offer_route_1.default);
app.use("/api/admin/rewards", reward_route_1.default);
app.use("/api/admin/snacks", snack_route_1.default);
app.use("/api/admin/dashboard", dashboard_route_1.default);
app.use("/api/movies", movies_route_1.default);
app.use("/api/booking", booking_route_1.default);
app.use("/api/loyalty", loyalty_route_2.default);
app.use("/api/snacks", snack_route_2.default);
app.use("/api/payment", payment_route_1.default);
app.use("/api/orders", order_route_1.default);
app.use("/api/offers", offers_route_1.default);
app.use("/api/rewards", rewards_route_1.default);
app.get("/", (req, res) => {
    res.send("CineGhar API Server");
});
exports.default = app;
