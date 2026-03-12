const express = require("express");
const path = require("path");
const app = express();

/* ============================================================
   1. 정적 파일(이미지, CSS, JS) 설정
   ============================================================ */
app.use("/assets", express.static(path.join(__dirname, "assets")));


/* ============================================================
   2. HTML 라우트
   ============================================================ */

const TEMPLATE_PATH = path.join(__dirname, "html");

// Home
app.get("/", (req, res) => {
  res.sendFile(path.join(TEMPLATE_PATH, "home.html"));
});

// Dashboard
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(TEMPLATE_PATH, "dashboard.html"));
});

// Map
app.get("/map", (req, res) => {
  res.sendFile(path.join(TEMPLATE_PATH, "map.html"));
});


/* ============================================================
   3. 서버 실행
   ============================================================ */
app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
  console.log("HTML location: ./html");
  console.log("assets location: ./assets");
});