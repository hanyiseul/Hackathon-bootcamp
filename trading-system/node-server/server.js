// server 기능 구현 (백엔드)

// 모듈 호출
require('dotenv').config(); // .env를 사용하기 위해 설정
const express = require("express"); // express 모듈 호출
const path = require("path"); // 경로 모듈
const fs = require("fs"); // 파일 읽는 모듈
const mysql = require("mysql2/promise"); // mysql2 모듈
const jwt = require("jsonwebtoken"); // jwt 토큰 인증 모듈
const bcrypt = require("bcrypt"); // 비밀번호 해시
const JWT_SECRET = process.env.JWT_SECRET; // .env 파일에서 시크릿키 가져옴
const port = 3000; // 서버 실행 포트

// express 설정
const app = express(); // express 객체 설정
app.use(express.json()); // json 파일 사용

// 파일 경로 설정
app.get("/favicon.ico", (_, res) => res.status(204)); // 파비콘 무시
app.use(express.static(path.join(__dirname, "static"))); // static 파일 접근 설정


// db 설정
const pool = mysql.createPool({ // db 연결을 여러개 만들어 미리 관리
  host: "localhost", // db 서버 주소
  user: "testuser", // db 로그인 계정
  password: "1234", // db 로그인 비밀번호
  database: "tradingDb", // 연결할 데이터 베이스 이름
  waitForConnections: true, // db 연결 한계 걸리면 대기
  connectionLimit: 10 // db 연결은 10개까지만
});

// 회원가입
app.post("/api/signup", async(req, res) => { // 회원가입 api
  try {
    const {user_id, password, balance} = req.body; // 처리 요청 데이터
    const hashed = await bcrypt.hash(password, 10); // 비밀번호 암호화
    const sql = `
      insert into users (user_id, password, balance) values (?,?,?)
    `; // 회원가입 쿼리 (요청받은 데이터 db에 insert)
    await pool.execute(sql, [user_id, hashed, balance]); // 비밀번호는 hash 값으로 전달
    res.json({success: true}); // 요청 성공시 true값 전달 
  } catch(error) {
    console.error(error);
    res.json({success: false}); // 요청 실패시 false 값 전달
  }
});

// 로그인
app.post("/api/login", async(req, res) => {
  try {
    const {user_id, password} = req.body; // 처리 요청 데이터
    // id 조회
    const sql = `
      select * from users where user_id = ?
    `;
    const [rows] = await pool.query(sql, [user_id]);
    if(rows.length === 0) { // 조회 결과 없을시
      return res.json({success: false}); // 로그인 실패
    }
    const user = rows[0]; // user_id는 유일값이라 어차피 하나만 조회

    const isMatch = await bcrypt.compare(password, user.password);
    // user값이 있을 때 입력 비밀번호와 저장된 암호화 비밀번호 대조가 일치할 경우
    if (!isMatch) {
      return res.json({ success: false, message: "비밀번호 틀림" });
    }

    if(user && isMatch) { // 유저 정보가 있고 비밀번호 일치할 때
      const token = jwt.sign({user_id: user.user_id, balance: user.balance}, JWT_SECRET, {expiresIn: '12h'}); // jwt 토큰 생성 (id값이랑 잔고 보내기, 유효시간 12시간)
      return res.json({
        success: true, 
        user: {
          user_id: user.user_id,
          balance: user.balance
        },
        token}); // 로그인 성공
    }
  } catch (error) {
    console.error(error);
    res.json({success: false}); // 로그인 실패
  }
});

// verify 검증
app.get("/api/verify", (req, res) => {
  const authHeader = req.headers["authorization"]; // 요청에 담긴 토큰 꺼내기
  const token = authHeader && authHeader.split(' ')[1]; // Bearer 문자열 떼어내기

  if(!token) return res.json({success: false}); // 토큰 없으면 검증 종료

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if(err) return res.json({success: false}); // 에러시 검증 종료
    res.json({success: true, user: decoded}); // 토큰 유효시 해독된 유저 정보 전달
  }); // 요청 받은 jwt 토큰 검증
});

// 대시보드
// 내자산
app.get("/api/mydata", async (req, res) => {
  try {
    const { user_id } = req.query;
    // 유저 정보를 기준으로 보유 종목과 거래 내역을 조인하여 총 자산과 수익률 계산
    const sql = `
      SELECT 
        u.balance, -- 현재 잔금 잔고
        (u.balance + IFNULL(SUM(h.quantity * s.price), 0)) AS total, -- 현재 잔고 + 보유 종목의 총 가치
        IFNULL(SUM(t.quantity * t.price), 0) AS total_invest, -- 총 투자금 (매수 금액 합계)
        CASE -- 투자금이 0이면 수익률 0 / 아니면 (현재자산 - 투자금) / 투자금 * 100
          WHEN IFNULL(SUM(t.quantity * t.price), 0) = 0 THEN 0 
          ELSE (
            (u.balance + IFNULL(SUM(h.quantity * s.price), 0) - IFNULL(SUM(t.quantity * t.price), 0))
            / IFNULL(SUM(t.quantity * t.price), 0)
          ) * 100
        END AS rate
      FROM users u
      LEFT JOIN holdings h ON u.user_id = h.user_id  -- holdings 테이블에서 user_id로 보유 종목 정보 가져오기
      LEFT JOIN stocks s ON h.stock_id = s.id -- stocks 테이블에서 stock_id로 주식 가격 정보 가져오기
      LEFT JOIN trades t ON u.user_id = t.user_id AND t.type = 'buy' -- trades 테이블에서 user_id로 매수 거래 정보 가져오기
      WHERE u.user_id = ?
      GROUP BY u.user_id; 
    `;

    const [rows] = await pool.query(sql, [user_id]);

    return res.json({
      success: true,
      total: rows[0]?.total ?? 0,
      rate: rows[0]?.rate ?? 0,
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 거래 중인 주식 목록
app.get("/api/stockList", async(req, res) => {
  try {
    const sql = `select * from stocks`; // 주식 목록 전체 조회
    const [rows] = await pool.query(sql); // 쿼리값 가져오기

    const updateStock = rows.map(stock => {
      const change = Math.floor(Math.random() * 2000 - 1000); // 랜덤값 만들기
      return {...stock, price: stock.price + change} // 기존값 + 랜던값 (주식 가격 임의 변동)
    })
    res.json({
      success: true,
      stocks: updateStock
    })
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// 보유 종목
app.get("/api/holdingList", async(req, res) => {
  try {
    const { user_id } = req.query;
    const sql = `
      SELECT 
        h.*,
        s.name
      FROM holdings h
      JOIN stocks s ON h.stock_id = s.id
      WHERE h.user_id = ?;
    `;
    const [rows] = await pool.query(sql, [user_id]);

    res.json({
      success: true,
      holdings: rows  
    })
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// 거래 내역
app.get("/api/tradeList", async(req, res) => {
  try {
    const { user_id } = req.query;
    const sql = `
      SELECT 
        t.*,
        s.name
      FROM trades t
      JOIN stocks s ON t.stock_id = s.id
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC;
    `;
    const [rows] = await pool.query(sql, [user_id]);

    res.json({
      success: true,
      trades: rows  
    })
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// 매수
app.post("/api/buy", async (req, res) => {
  try {
    const { user_id, stock_id, quantity } = req.body;

    // 1. 현재 주식 가격 조회
    const [[stock]] = await pool.query(
      "SELECT price FROM stocks WHERE id = ?",
      [stock_id]
    );

    if (!stock) return res.json({ success: false, message: "종목 없음" });

    const total = stock.price * quantity;

    // 2. 유저 잔고 확인
    const [[user]] = await pool.query(
      "SELECT balance FROM users WHERE user_id = ?",
      [user_id]
    );

    if (user.balance < total) {
      return res.json({ success: false, message: "잔고 부족" });
    }

    // 3. 잔고 차감
    await pool.query(
      "UPDATE users SET balance = balance - ? WHERE user_id = ?",
      [total, user_id]
    );

    // 4. holdings 확인
    const [[holding]] = await pool.query(
      "SELECT * FROM holdings WHERE user_id = ? AND stock_id = ?",
      [user_id, stock_id]
    );

    if (holding) {
      // 평균 단가 계산
      const newQty = holding.quantity + quantity;
      const newAvg =
        (holding.avg_price * holding.quantity + total) / newQty;

      await pool.query(
        "UPDATE holdings SET quantity = ?, avg_price = ? WHERE id = ?",
        [newQty, Math.floor(newAvg), holding.id]
      );
    } else {
      await pool.query(
        "INSERT INTO holdings (user_id, stock_id, quantity, avg_price) VALUES (?, ?, ?, ?)",
        [user_id, stock_id, quantity, stock.price]
      );
    }

    // 5. 거래 기록
    await pool.query(
      "INSERT INTO trades (user_id, stock_id, type, quantity, price, total) VALUES (?, ?, 'buy', ?, ?, ?)",
      [user_id, stock_id, quantity, stock.price, total]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 매도
app.post("/api/sell", async (req, res) => {
  try {
    const { user_id, stock_id, quantity } = req.body;

    // 1. 보유 확인
    const [[holding]] = await pool.query(
      "SELECT * FROM holdings WHERE user_id = ? AND stock_id = ?",
      [user_id, stock_id]
    );

    if (!holding || holding.quantity < quantity) {
      return res.json({ success: false, message: "수량 부족" });
    }

    // 2. 현재 가격
    const [[stock]] = await pool.query(
      "SELECT price FROM stocks WHERE id = ?",
      [stock_id]
    );

    const total = stock.price * quantity;

    // 3. holdings 감소
    const remain = holding.quantity - quantity;

    if (remain === 0) {
      await pool.query("DELETE FROM holdings WHERE id = ?", [holding.id]);
    } else {
      await pool.query(
        "UPDATE holdings SET quantity = ? WHERE id = ?",
        [remain, holding.id]
      );
    }

    // 4. 잔고 증가
    await pool.query(
      "UPDATE users SET balance = balance + ? WHERE user_id = ?",
      [total, user_id]
    );

    // 5. 거래 기록
    await pool.query(
      "INSERT INTO trades (user_id, stock_id, type, quantity, price, total) VALUES (?, ?, 'sell', ?, ?, ?)",
      [user_id, stock_id, quantity, stock.price, total]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "static", "index.html"));
});

// port 실행
app.listen(port, () => {
  console.log(`서버 실행: http://localhost:${port}`);
});