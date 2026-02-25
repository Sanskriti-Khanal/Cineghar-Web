import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://sanskritik644_db_user:zoPE5iIc4ywI2zpk@cineghar.uuq7fz8.mongodb.net/cineghar";
const USER_ID = "698de32d4515240e99c99fb0"; // from the booking logs

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    purchaseOrderId: { type: String, required: true, unique: true },
    pidx: { type: String, required: true },
    khaltiTransactionId: { type: String },
    amount: { type: Number, required: true },
    seatsCount: { type: Number, required: true },
    seats: { type: [String], default: [] },
    movieTitle: { type: String },
    movieId: { type: String },
    status: { type: String, default: "completed" },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", orderSchema);

const bookings = [
  {
    user: USER_ID,
    purchaseOrderId: "BOOK-69a077dc3b04c909966c0091-1772743647503",
    pidx: "Mc7qP2j72GjEcXyUfGnmYb",
    khaltiTransactionId: "NDDLcVdBg8cmj8rdBuRY3L",
    amount: 900,
    seatsCount: 2,
    seats: ["E7", "F7"],
    movieTitle: "sds",
    movieId: "69a077dc3b04c909966c0091",
    status: "completed",
  },
  {
    user: USER_ID,
    purchaseOrderId: "BOOK-69a077dc3b04c909966c0091-1772743537762",
    pidx: "96YvNqqtaeGDdJfk9YgHW8",
    khaltiTransactionId: "aNpyWSiEj3ADBaiUJrxFJc",
    amount: 350,
    seatsCount: 1,
    seats: ["D4"],
    movieTitle: "sds",
    movieId: "69a077dc3b04c909966c0091",
    status: "completed",
  },
  {
    user: USER_ID,
    purchaseOrderId: "BOOK-69a077de3b04c909966c0094-1772616986841",
    pidx: "jDsVwxS6cqgXx4yL2AQop2",
    khaltiTransactionId: "NqoT7W6Ek7MXZ8FjgSDt9L",
    amount: 900,
    seatsCount: 2,
    seats: ["E3", "E4"],
    movieTitle: "sds",
    movieId: "69a077de3b04c909966c0094",
    status: "completed",
  },
];

async function main() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!\n");

  // Check existing orders for this user
  const existing = await OrderModel.find({ user: USER_ID }).lean();
  console.log(`Existing orders for user ${USER_ID}: ${existing.length}`);
  existing.forEach((o) => {
    console.log(`  - ${o.purchaseOrderId} | seats: ${o.seats?.join(", ")}`);
  });

  // Insert missing ones
  let inserted = 0;
  for (const booking of bookings) {
    const exists = await OrderModel.findOne({ purchaseOrderId: booking.purchaseOrderId }).lean();
    if (exists) {
      console.log(`\nSkipping (already exists): ${booking.purchaseOrderId}`);
    } else {
      await OrderModel.create(booking);
      console.log(`Inserted: ${booking.purchaseOrderId}`);
      inserted++;
    }
  }

  console.log(`\nDone! Inserted ${inserted} new order(s).`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
