-- database 생성 (인코딩방식, 대소문자 구별 안함 설정)
create database testdb character set utf8mb4 collate utf8mb4_general_ci;

-- 생성한 database 사용
use testdb;

-- user 생성 (user 계정, 비밀번호)
create user 'testuser'@'localhost' identified by '1234';

-- testdb에 모든 권한 부여
grant all privileges on testdb.* to 'testuser'@'localhost';

-- 즉시 적용
flush privileges;

-- 회원 테이블 생성 
create table members(
	id int auto_increment primary key, -- 레코드 id값 설정, 숫자, 자동증가, 기본키
    name varchar(50) not null, -- 이름, 문자(최대 50문자) 비워짐 안됨 (null 금지)
    user_id varchar(200) not null unique, -- user id, 문자(최대 200문자 빈값 금지 (null 금지), unique(중복 금지)
    user_pwd varchar(200) not null, -- user pwd, 문자(최대 200문자) 빈값 금지 (null 금지)
    company varchar(200) not null -- 회사 선택,  문자(최대 200문자) 빈값 금지 (null 금지)
);

-- 생성한 테이블 컬럼 확인 
desc members; 

-- 게시판 테이블 생성
create table board(
	id int auto_increment primary key, -- 레코드 id값 설정, 숫자, 자동증가, 기본키
    user_id VARCHAR(50) not null, -- 작성자 아이디, 문자(최대 50문자) 빈값 금지 (null 금지)
    name varchar(50) not null, -- 이름, 문자(최대 50문자) 빈값 금지 (null 금지)
    title varchar(200) not null, -- 제목, 문자(최대 200문자) 빈값 금지 (null 금지)
    content text, -- 내용 텍스트
    type varchar(20) not null, -- 게시글 타입 설정
    created_at  datetime default current_timestamp, -- 작성일, 기본값 값을 넣지 않으면 현재 시간을 자동으로 넣어줌
	foreign key (user_id) references members(user_id) -- 작성자 아이디는 member(user_id 참조)
);

-- 생성한 테이블 확인
desc board;

-- 예시 쿼리
INSERT INTO board (user_id, name, title, content, date, type) VALUES
('hk', '한경', '한경 회사글1', '한국경제신문 회사 글1', NOW(), 'company'),
('hk', '한경', '한경 회사글2', '한국경제신문 회사 글2', NOW(), 'company'),
('hk', '한경', '한경 전체글1', '전체게시판 글1', NOW(), 'public'),
('hk', '한경', '한경 전체글2', '전체게시판 글2', NOW(), 'public'),
('toss', '김토스', '토스 회사글1', '토스뱅크 내부 글1', NOW(), 'company'),
('toss', '김토스', '토스 회사글2', '토스뱅크 내부 글2', NOW(), 'company'),
('toss', '김토스', '토스 회사글3', '토스뱅크 내부 글3', NOW(), 'company'),
('toss', '김토스', '토스 전체글1', '전체 게시판 글1', NOW(), 'public'),
('toss', '김토스', '토스 전체글2', '전체 게시판 글2', NOW(), 'public'),
('toss', '김토스', '토스 전체글3', '전체 게시판 글3', NOW(), 'public'),
('hk2','한경2','한경2 회사글1','한국경제신문 회사글1',NOW(),'company'),
('hk2','한경2','한경2 회사글2','한국경제신문 회사글2',NOW(),'company'),
('hk2','한경2','한경2 전체글1','전체 게시판 글1',NOW(),'public'),
('toss2','한토스','토스2 회사글1','토스뱅크 내부글1',NOW(),'company'),
('toss2','한토스','토스2 회사글2','토스뱅크 내부글2',NOW(),'company'),
('toss2','한토스','토스2 전체글1','전체 게시판 글1',NOW(),'public');