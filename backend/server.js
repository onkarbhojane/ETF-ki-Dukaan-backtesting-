import server from "./src/app.js"
import connectDB from "./src/config/database.js";
import config from "./src/config/config.js";

server.listen(config.PORT, () => {
    connectDB();
    console.log(`Server is running on port ${config.PORT}`);
})