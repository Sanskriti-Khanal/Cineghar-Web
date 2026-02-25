import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cineghar";
console.log("Connecting to:", uri);

mongoose.connect(uri)
  .then(async () => {
    const showtimes = await mongoose.connection.db.collection('showtimes').find({}).toArray();
    console.log("Total showtimes found:", showtimes.length);
    for (const st of showtimes) {
      console.log(`- ID: ${st._id}, Movie: ${st.movie}, Hall: ${st.hall}, StartTime: ${new Date(st.startTime).toISOString()}, isActive: ${st.isActive}`);
    }
    
    let base = new Date();
    let start = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0, 0);
    let end = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 23, 59, 59, 999);
    console.log("\nToday window:", start.toISOString(), end.toISOString());

    base = new Date();
    base.setDate(base.getDate() + 1);
    let startT = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 0, 0, 0, 0);
    let endT = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 23, 59, 59, 999);
    console.log("Tomorrow window:", startT.toISOString(), endT.toISOString());
    
    process.exit(0);
  })
  .catch(console.error);
