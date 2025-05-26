const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.send("API OK"));
app.get("/api/events", async (_, res) => {
  const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
  res.json(events);
});
app.post("/api/events", async (req, res) => {
  const { title, date, location } = req.body;
  const evt = await prisma.event.create({ data: { title, date: new Date(date), location } });
  res.status(201).json(evt);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
