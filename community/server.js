// node.js 서버 구축 세팅
require('dotenv').config(); // .env를 사용하기 위해 설정
const express = require("express"); // express 모듈
const path =require("path"); // 경로 모듈
const fs = require("fs"); // 파일 읽는 모듈
const mysql = require("mysql2/promise"); // mysql2 사용 -> (이유) mysql2는 promise 가능
const jwt = require('jsonwebtoken'); // jwt 토큰 인증
const bcrypt = require('bcrypt'); // 비밀번호 암호화
const JWT_SECRET = process.env.JWT_SECRET; // .env 파일에서 시크릿키 가져옴
const PORT = 5000; // 서버 실행 포트 설정

// express 설정
const app = express(); // express 객체 생성
app.use(express.json()); // json 파일 사용


// 파일 경로 설정 (__dirname: 현재 실행하는 파일의 절대 경로)

// 파비콘 무시
app.get('/favicon.ico', (_, res) => res.status(204)); // 파비콘 무시 - 204(요청성공) 응답을 보내 파비콘이 없어도 클라이언트는 요청 성공 한걸로 인식

// static 파일 접근
app.use(express.static(path.join(__dirname, "public", "static"))); // 정적 파일 경로 설정

// html 파일 접근
const htmlPath = path.join(__dirname, "public", "templates"); // html 파일 경로 설정
const router = express.Router({ mergeParams: true }); // mergeParams: true - 상위 라우터의 URL 파라미터를 이 라우터에서도 사용할 수 있게 하는 옵션
router.get("/:page", (req, res) => res.sendFile(path.join(htmlPath, `${req.params.page}.html`))); // (:page - URL 파라미터(동적 값)) -> htmlPath 변수의 경로를 따라서 이동
router.get("/", (_, res) => res.sendFile(path.join(htmlPath, "login.html"))); // 기본값 설정

// db 설정
const pool = mysql.createPool({ // createPool: db 연결을 여러개 만들어 미리 관리
    host: 'localhost', // db 서버 주소
    user: 'testuser', // db 로그인 계정
    password: '1234', // db 로그인 비밀번호
    database: 'testdb', // 연결할 데이터 베이스 이름
    waitForConnections: true, // db 연결 한계 걸리면 대기
    connectionLimit: 10, // db 연결은 10개까지만
});

// db 연결 테스트 함수
const testDB = async () => {
  try {
    const conn = await pool.getConnection(); // db 연결
    console.log("DB 연결 성공!");
    conn.release(); // 테스트 끝난 db 반환
  } catch (error) {
    console.log("DB 연결 실패!", error);
  }
}
testDB();


// 회원가입
app.post("/api/signup", async (req,res) => { // 프론트단에서 요청받은 api 주소
  try {
    const { name, user_id, user_pwd, company } = req.body; // 프론드단에서 요청 본문에 실어보낸 아이들
    const hashed = await bcrypt.hash(user_pwd, 10) // 입력한 비밀번호를 10번 돌려서 암호화 비밀번호 생성
    await pool.execute('insert into members (name, user_id, user_pwd, company) values (?, ?, ?, ?)', [name, user_id, hashed, company]); // values의 ???? 에 [name, user_id, user_pwd, company]가 들어감 (비밀번호는 암호화한 hashed로!)
    res.json({success: true}); // 요청이 성공하면 성공메시지를 true로 올림
  } catch (error) {
    console.error("server.js 에러: ", error);
    res.json({success: false}); // 실패시 성공메시지를 false로 전달
  }
});


// 로그인
app.post("/api/login", async (req,res) => { // 프론트단에서 요청받은 api 주소
  try {
    const { user_id, user_pwd } = req.body; // 프론드단에서 요청 본문에 실어보낸 아이들

    // 로그인할 계정 조회 쿼리문
    const [rows] = await pool.execute('select * from members where user_id = ?', [user_id]); // user_id 기준으로 조회 (unique 키 설정으로 아이디 중복 가입이 안되기 때문에 무조건 하나만 뜰거임) - 배열로 조회되기 때문

    if (rows.length === 0) {
      return res.json({ success:false });
    }

    const user = rows[0]; // 조회한 계정이 첫번째 객체

    // 로그인할 계정이 존재할 경우 입력한 비밀번호와 암호화된 비밀번호 대조 확인
    if (user && await bcrypt.compare(user_pwd, user.user_pwd)) { // 일치할 경우
      // jwt 토큰 생성 : playload에 보낼 정보 (서명 보낼 정보, 서명용 비밀키, 유효기간)
      const token = jwt.sign({ userId: user.user_id, name: user.name, company: user.company }, JWT_SECRET, { expiresIn: '1h' });
      res.json({success: true, token}); // 요청이 성공하면 성공메시지(true)와 토큰 보냄
    }
    if(!(await bcrypt.compare(user_pwd, user.user_pwd))) { // 비밀 번호가 틀렸다면
      res.json({success: false});
    }
    if(!user) { // 아이디가 없을 경우 (아이디를 비교했기 때문에)
      res.json({success: false});
    }
  } catch (error) {
    console.error("server.js 에러: ", error);
    res.json({success: false}); // 실패시 성공메시지를 false로 전달
  }
});

// verify 검증
app.get("/api/verify", (req, res) => { // 로그인 검증 요청 api
    const authHeader = req.headers['authorization'];  // 요청 헤더의 검증 변수에 저증
    const token = authHeader && authHeader.split(' ')[1]; // Bearer 문자열 떼어내기

    if (!token) return res.json({ success: false }); // 만약 토큰이 없다면 처리 종료

    jwt.verify(token, JWT_SECRET, (err, decoded) => { // jwt 토큰 검증
        if (err) return res.json({ success: false }); // 만약 에러가 난다면 종료
        res.json({ success: true, user: decoded }); // 유효하면 해독된 유저 정보 응답
    });
});


// 게시판
// 전체 게시판 조회
app.get("/api/list", async (_, res) => { // 전체 목록 api 처리
  try {
    const sql = `
      select *, date_format(date, '%Y-%m-%d') as date
      from board 
      where type not in ('company')
    ` // 날짜는 년-월-일로
    const [data] = await pool.query(sql);

    res.json({success: true, data});
  } catch (error) {
    console.error(error);
    res.json({success: false});
  }
});

// 상세 내용 조회
app.get("/api/detail/:id", async (req, res) => { // id값에 해당하는 상세 내용 조회
  const detailId = req.params.id;
  try {
    const sql = `
      select *, date_format(date, '%Y-%m-%d') as date
      from board 
      where id = ?
    ` // 날짜는 년-월-일로 선택한 게시글 아이디 조회
    const [data] = await pool.query(sql, [detailId]);

    res.json({success: true, data});
  } catch (error) {
    console.error(error);
    res.json({success: false});
  }
});

// 게시글 삭제
app.delete("/api/delete/:id", async (req, res) => { // id값에 해당하는 상세 내용 삭제
  const detailId = req.params.id;
  try {
    const sql = `delete from board where id=?` // id 값에 해당하는 컬럼 삭제
    const [data] = await pool.query(sql, [detailId]);

    res.json({success: true, data});
  } catch (error) {
    console.error(error);
    res.json({success: false});
  }
});

// 게시글 수정 내역 조회
app.get("/api/edit/:id", async (req, res) => { // id값에 해당하는 상세 내용 조회
  const detailId = req.params.id;
  try {
    const sql = `
      select *
      from board 
      where id = ?
    ` // 선택한 게시글 아이디 조회
    const [data] = await pool.query(sql, [detailId]);

    res.json({success: true, data});
  } catch (error) {
    console.error(error);
    res.json({success: false});
  }
});

// 게시글 등록
app.post("/api/write", async (req,res) => { // 프론트단에서 요청받은 api 주소
  try {
    const id = req.params.id; // 해당 아이디값 파라미터에서 가져오기
    const { user_id, name, title, date, content, company } = req.body; // 프론드단에서 요청 본문에 실어보낸 아이들
    const sql = `
      insert into board (user_id, name, title, date, content, type)
      values (?, ?, ?, ?, ?, ?)
    ` // 내가 작성한 글 등록 (insert)
    const [data] = await pool.query(sql, [user_id, name, title, date, content, company]);
    res.json({success: true, data}); // 요청이 성공하면 성공메시지를 true로 올림
  } catch (error) {
    console.error("server.js 에러: ", error);
    res.json({success: false}); // 실패시 성공메시지를 false로 전달
  }
});


// 게시글 수정
app.put("/api/edit/:id", async (req,res) => { // 프론트단에서 요청받은 api 주소
  try {
    const id = req.params.id; // 해당 아이디값 파라미터에서 가져오기
    const { name, title, date, content, company } = req.body; // 프론드단에서 요청 본문에 실어보낸 아이들
    const sql = `
      update board
      set 
        name = ?,
        title = ?,
        date = ?,
        content = ?,
        type = ?
      where id = ?;
    ` // id에 해당하는 게시글 수정 (update)
    const [data] = await pool.query(sql, [name, title, date, content, company, id]);
    res.json({success: true, data}); // 요청이 성공하면 성공메시지를 true로 올림
  } catch (error) {
    console.error("server.js 에러: ", error);
    res.json({success: false}); // 실패시 성공메시지를 false로 전달
  }
});

// 내가 작성한 글만 조회
app.get('/api/data/:userId', async (req, res) => {
  const userId = req.params.userId; // 요청 정보에서 user id값 가져오기
  try {
    const sql = `
      select *, date_format(date, '%Y-%m-%d') as date
      from board 
      where user_id = ?
    ` // 날짜는 년-월-일로 요청 보낸 user_id를 기준으로 board에서 쿼리 조회
    const [data] = await pool.query(sql, [userId]);

    res.json({success: true, data});
  } catch (error) {
    console.error(error);
    res.json({success: false});
  }
});

// 내회사 글 조회
app.get("/api/company/:company", async (req, res) => { // 회사글(비밀글) 조회
  const company = req.params.company; // 요청 정보에서 user id값 가져오기
  try {
    const sql = `
      SELECT b.*, date_format(date, '%Y-%m-%d') as date
      FROM board b
      JOIN members m ON b.user_id = m.user_id
      WHERE b.type='company'
      AND m.company = ?
    ` // board user_id 와 members user_id를 기준으로 board 테이블과 memtable을 연결
    // 조건은 board의 타입이 "company" 이며서 로그인 계정의 company와 일치하는 글들을 조회
    const [data] = await pool.query(sql, [company]);

    res.json({success: true, data});
  } catch (error) {
    console.error(error);
    res.json({success: false});
  }
});

app.use(router); // 설정한 라우터 실행
// 서버 실행 
app.listen(PORT, () => {
  console.log("=========================================");
  console.log(` 서버가 포트 ${PORT}에서 작동 중입니다.`);
  console.log("=========================================");
});
