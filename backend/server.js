import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import connectDB from './src/config/db.js';
const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`SpendWise API running on ${PORT}`))).catch(err => { console.error(err); process.exit(1); });