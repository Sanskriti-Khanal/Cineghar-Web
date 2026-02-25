import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://sanskritik644_db_user:zoPE5iIc4ywI2zpk@cineghar.uuq7fz8.mongodb.net/cineghar";
const ORDER_USER_ID = "698de32d4515240e99c99fb0";

async function main() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!\n");

  // Find users in the DB
  const db = mongoose.connection.db;
  const users = await db.collection("users").find({}).project({ _id: 1, email: 1, name: 1, role: 1 }).toArray();
  console.log(`Total users in DB: ${users.length}`);
  users.forEach((u) => {
    const match = u._id.toString() === ORDER_USER_ID ? " ✅ (matches order user)" : "";
    console.log(`  - ${u._id} | ${u.email} | ${u.name}${match}`);
  });

  // Count all orders
  const allOrders = await db.collection("orders").find({}).toArray();
  console.log(`\nTotal orders in DB: ${allOrders.length}`);
  allOrders.forEach((o) => {
    console.log(`  - OrderUser: ${o.user} | PurchaseOrderId: ${o.purchaseOrderId}`);
  });

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
