import server from "./index.js";
import dbConnect from "./config/db.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await dbConnect();
    server.listen(PORT, () => {
      console.log(`✅ Server running on ${PORT} port`);
    });
  } catch (error) {
    console.log("❌ Error starting server", error);
    process.exit(1);
  }
}

startServer();
