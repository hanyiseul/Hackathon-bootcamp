# 📈 주식 거래 시뮬레이션 시스템 (Trading System)

간단한 주식 거래 시뮬레이션 서비스입니다.  
사용자는 회원가입 및 로그인 후 **종목 조회 / 매수 / 매도 / 자산 관리 / 거래 내역 확인**을 할 수 있습니다.

---

# 🌐 Demo

로컬 실행 기반 프로젝트

---

# 📷 Screenshots

(추후 추가)

---

# ⚙️ 실행 방법 (How to Run)

## 1. 서버 실행
```bash
cd node-server
npm install
node server.js
```

## 2. 프론트 실행
```bash
cd react
npm install
npm run dev
```

---

# 📌 프로젝트 개요

주식 거래 흐름을 기반으로 한 CRUD + 상태 관리 + DB 연동 프로젝트

## 주요 기능

- 회원가입
- 로그인 (Zustand 상태관리)
- 종목 리스트 조회 (실시간 변동)
- 매수 / 매도 기능
- 보유 자산 조회
- 거래 내역 조회
- 총 자산 / 수익률 계산

---

# 🛠 Tech Stack

## Front-End
- React (Vite)
- Tailwind CSS
- Zustand

## Back-End
- Node.js (Express)

## Database
- MySQL

## Infra
- GCP (예정)

---

# 📂 Project Structure

```
trading-system
├── node-server
│   ├── server.js
│   ├── test.js
├── react
│   ├── src
│   │   ├── api
│   │   ├── pages
│   │   ├── components
│   │   ├── store
├── database.sql
└── README.md
```

---

# 🏗 System Architecture

```
React (Client)
     │
     ▼
Fetch API
     │
     ▼
Node.js (Express)
     │
     ▼
MySQL
     │
     ▼
JSON Response
     │
     ▼
React Rendering
```

---

# 🔄 Data Flow

```
사용자 입력
   │
   ▼
React 이벤트
   │
   ▼
API 요청
   │
   ▼
Node 서버
   │
   ▼
MySQL
   │
   ▼
JSON 응답
   │
   ▼
UI 업데이트
```

---

# 🔌 API Routes

## Auth
- POST /api/signup
- POST /api/login

## Stock
- GET /api/stockList

## Trade
- POST /api/buy
- POST /api/sell
- GET /api/tradeList

## Holdings
- GET /api/holding

## Dashboard
- GET /api/dashboard

---

# 🗄 Database Design

## users
- id (PK)
- user_id
- password
- balance

## stocks
- id (PK)
- stock_id
- name
- price

## holdings
- id (PK)
- user_id
- stock_id
- quantity
- avg_price

## trades
- id (PK)
- user_id
- stock_id
- type
- quantity
- price
- total
- created_at

---

# 🔄 주요 로직

## 매수
1. 현재 가격 조회
2. 잔고 확인
3. 잔고 차감
4. holdings 업데이트
5. 거래 저장

## 매도
1. 보유 수량 확인
2. holdings 감소
3. 잔고 증가
4. 거래 저장

---

# 🔐 상태 관리

Zustand를 사용하여 로그인 상태 및 토큰을 전역으로 관리

---

# 🧠 어려웠던 점

- 백엔드 먼저 개발 → UI 확인 어려움
- Zustand 상태 관리
- 토큰 유지 문제
- Tailwind 가독성 문제
- SQL 계산 로직
- 상태 동기화 문제

---

# 📚 배운 점

- 컴포넌트 분리 구조
- 서버 데이터 가공
- SQL JOIN 활용
- 상태 관리 흐름 이해

---

# 😢 아쉬운 점

- React Query 미사용
- 상태 동기화 구조 부족
- 잔고 처리 미완성

---

# 🚀 개선 방향

- React Query 적용
- WebSocket 실시간 처리
- UX 개선
- 차트 기능 추가

---

# 📄 Page Pipeline

## 로그인
1. 입력
2. 요청
3. 상태 저장
4. 이동

## 대시보드
1. 데이터 로딩
2. 거래 요청
3. 상태 반영

## 회원가입
1. 입력
2. 요청
3. 이동

---

# 🧠 한 줄 요약

주식 거래 흐름을 기반으로 CRUD + 상태관리 + DB 연동을 구현한 풀스택 프로젝트
