import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_url);

        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
});

mongoose.connection.on("connected", () => {
    console.log("connected from MongoDB");
});

mongoose.connection.on("reconnected", () => {
    console.log("Reconnected to MongoDB");
});

mongoose.connection.on("error", (error) => {
    console.error("MongoDB error:", error.message);
});
// Optional: Close the Mongoose connection on application termination
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection disconnected through app termination");
    process.exit(0);
});

export { connectDB, mongoose };

