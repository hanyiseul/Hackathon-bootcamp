-- database 생성 
CREATE DATABASE tradingDb CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- 생성한 database 사용
USE tradingDb;

-- 접속할 계정 생성 
CREATE USER 'testuser'@'localhost' IDENTIFIED BY '1234';

-- 해당 계정에 권한 부여
GRANT ALL PRIVILEGES ON tradingDb.* TO 'testuser'@'localhost';

-- 즉시 적용
FLUSH PRIVILEGES;

-- users 테이블
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY, -- id(튜플 구분값) 자동 증가 pk 
  user_id VARCHAR(50) NOT NULL UNIQUE, -- 아이디 유일값
  password VARCHAR(255) NOT NULL, -- 비밀번호 해시처리하여 저장
  balance INT DEFAULT 0, --  잔액
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 생성일자 
);

-- 종목 테이블 
CREATE TABLE stocks (
  id INT AUTO_INCREMENT PRIMARY KEY, -- id(튜플 구분값) 자동 증가 pk 
  stock_id INT NOT NULL UNIQUE, -- 종목 구분 아이디 유일값 
  name VARCHAR(50) NOT NULL, -- 종목 이름 
  price INT NOT NULL -- 종목 가격 
);

-- 보유 자산 테이블
CREATE TABLE holdings (
  id INT AUTO_INCREMENT PRIMARY KEY, -- id(튜플 구분값) 자동 증가 pk 
  user_id VARCHAR(50) NOT NULL, -- 아이디
  stock_id INT NOT NULL, -- 종목 구분 아이디
  quantity INT DEFAULT 0, -- 보유 수량 
  avg_price INT DEFAULT 0, -- 평균 매수가 

  FOREIGN KEY (user_id) REFERENCES users(user_id), -- 외래키 설정 
  FOREIGN KEY (stock_id) REFERENCES stocks(id), -- 외래키 설정 

  UNIQUE KEY unique_user_stock (user_id, stock_id) -- 유니크값 설정
); 

CREATE TABLE trades (
  id INT AUTO_INCREMENT PRIMARY KEY, -- id(튜플 구분값) 자동 증가 pk 
  user_id VARCHAR(50) NOT NULL, -- 아이디 유일값
  stock_id INT NOT NULL, -- 종목 구분 아이디 유일값 
  type VARCHAR(10) NOT NULL, -- 거래 종류 (매수/매도)
  quantity INT NOT NULL, -- 보유 수량 
  price INT NOT NULL, -- 거래 당시 가격
  total INT NOT NULL, -- quantity * price
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 거래 내역 자동 생성 

  FOREIGN KEY (user_id) REFERENCES users(user_id), -- 외래키 설정
  FOREIGN KEY (stock_id) REFERENCES stocks(id), -- 외래키 설정

  INDEX idx_user (user_id), -- 인덱스 검색 (속도 향상) 
  INDEX idx_stock (stock_id) -- 인덱스 검색 (속도 향상)
);

-- 종목 더미 데이터
INSERT INTO stocks (stock_id, name, price) VALUES
(1001, '삼성전자', 70000),
(1002, '카카오', 50000),
(1003, '네이버', 200000),
(1004, '현대차', 180000),
(1005, 'SK하이닉스', 120000),
(1006, 'LG에너지솔루션', 450000),
(1007, '카카오뱅크', 25000),
(1008, 'POSCO홀딩스', 380000),
(1009, '삼성바이오로직스', 820000),
(1010, '셀트리온', 150000);

-- 보유 종목 더미 데이터
INSERT INTO holdings (user_id, stock_id, quantity, avg_price) VALUES
('test', 1, 10, 68000),
('test', 2, 5, 52000),
('test', 3, 2, 190000);

-- 거래 내역 더미 데이터
INSERT INTO trades (user_id, stock_id, type, quantity, price, total, created_at) VALUES
('test', 1, 'buy', 10, 68000, 680000, NOW() - INTERVAL 3 DAY),
('test', 2, 'buy', 5, 52000, 260000, NOW() - INTERVAL 2 DAY),
('test', 3, 'buy', 2, 190000, 380000, NOW() - INTERVAL 1 DAY),
('test', 1, 'sell', 3, 70000, 210000, NOW());