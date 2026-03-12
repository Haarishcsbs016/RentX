import mongoose from "mongoose";
import dotenv from "dotenv";
import Vehicle from "./models/Vehicle.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/vehicle_rental";

mongoose.connect(MONGO_URI).then(async () => {
    console.log("Connected to MongoDB for fixing images...");

    // Hyundai Creta (Red Alfa Romeo -> actual SUV/Hyundai if possible, let's use a nice SUV)
    await Vehicle.updateOne(
        { name: "Hyundai Creta SX" },
        { image: "https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=1200" } // A nice SUV
    );

    // Tesla Model 3
    await Vehicle.updateOne(
        { name: "Tesla Model 3 Performance" },
        { image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1200" } // Tesla
    );

    // Royal Enfield
    await Vehicle.updateOne(
        { name: "Royal Enfield Classic 350" },
        { image: "https://images.pexels.com/photos/2607554/pexels-photo-2607554.jpeg?auto=compress&cs=tinysrgb&w=1200" } // Motorcycle
    );

    // Honda Activa
    await Vehicle.updateOne(
        { name: "Honda Activa 6G" },
        { image: "https://images.pexels.com/photos/8198089/pexels-photo-8198089.jpeg?auto=compress&cs=tinysrgb&w=1200" } // Scooter
    );

    console.log("Images fixed!");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
