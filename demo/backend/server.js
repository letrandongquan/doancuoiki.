const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

// Kết nối MongoDB
const MONGO_URI = "mongodb+srv://vuong98751:Aiij0TxtFVJ097ju@cluster1.ffmxp.mongodb.net/mydatabase"; 

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Kết nối MongoDB thành công!"))
  .catch(err => console.error("Lỗi kết nối MongoDB:", err));

// Định nghĩa Schema và Model
const DataSchema = new mongoose.Schema({ message: String });
const DataModel = mongoose.model("Data", DataSchema);

// Cấu hình middleware
app.use(cors());
app.use(bodyParser.json());

// API lấy dữ liệu mới nhất từ MongoDB
app.get("/api/message", async (req, res) => {
  try {
    const latestData = await DataModel.findOne().sort({ _id: -1 });
    res.json({ message: latestData ? latestData.message : "Chưa có dữ liệu nào" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server khi lấy dữ liệu" });
  }
});

// API lấy toàn bộ dữ liệu từ MongoDB
app.get("/api/messages", async (req, res) => {
  try {
    const allData = await DataModel.find().sort({ _id: -1 });
    res.json({ messages: allData });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server khi lấy danh sách dữ liệu" });
  }
});

// API lưu dữ liệu vào MongoDB
app.post("/api/save", async (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: "Dữ liệu không hợp lệ!" });
  }
  try {
    await DataModel.create({ message: data });
    res.json({ success: true, message: "Dữ liệu đã được lưu thành công!" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server khi lưu dữ liệu" });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
