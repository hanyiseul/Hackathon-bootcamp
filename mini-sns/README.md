# 📱 MiniSNS Clone Coding

간단한 SNS 서비스를 구현한 프로젝트입니다.
사용자는 회원가입 및 로그인 후 게시글을 작성할 수 있으며, 이미지 업로드와 게시글 조회, 수정, 삭제 기능을 제공합니다.
Spring Security 기반 인증을 사용하여 로그인 상태를 관리하고, BCrypt를 활용한 비밀번호 암호화를 적용하였습니다.
또한 본인이 작성한 게시글만 수정 및 삭제할 수 있도록 작성자 검증 기능을 구현하였습니다.

---

# 🌐 Demo

```text
Local Environment

http://localhost:3100
```

---

# 📷 Screenshots

| 로그인                       | 회원가입                      | 전체 피드                   | 내 피드                       | 게시글 작성                    | 게시글 수정                  |
|---------------------------|---------------------------|-------------------------|----------------------------|---------------------------|-------------------------|
| (./screenshot/create.png) | (./screenshot/signup.png) | (./screenshot/feed.png) | (./screenshot/my-feed.png) | (./screenshot/create.png) | (./screenshot/edit.png) |

---

# ⚙️ 실행 방법 (How to Run)

## 프로젝트 설치

```bash
./gradlew build
```

## 프로젝트 실행

```bash
./gradlew bootRun
```

또는

```bash
Run MiniSnsApplication
```

---

# 📌 프로젝트 개요

Spring Boot 기반 SNS 서비스 구현 프로젝트

### 주요 기능

* 회원가입
* 로그인
* 로그아웃
* 게시글 작성
* 게시글 조회
* 게시글 수정
* 게시글 삭제
* 전체 게시글 조회
* 내 게시글 조회
* 이미지 업로드
* Spring Security 기반 로그인 인증
* BCrypt 비밀번호 암호화
* 작성자 권한 검증

---

# 🛠 Tech Stack

## Front-End

* HTML
* CSS
* Thymeleaf

## Back-End

* Java 21
* Spring Boot 3

## Database

* MySQL

## Security

* Spring Security
* BCrypt Password Encoder

## Build Tool

* Gradle

---

# 📂 Project Structure

```text
src
├── main
│   ├── java
│   │   └── com.example.minisns
│   │       ├── MiniSnsApplication
│   │       │
│   │       ├── config
│   │       │   ├── SecurityConfig
│   │       │   └── WebConfig
│   │       │
│   │       ├── member
│   │       │   ├── controller
│   │       │   │   └── UserController
│   │       │   ├── dto
│   │       │   │   ├── LoginForm
│   │       │   │   └── SignupForm
│   │       │   ├── entity
│   │       │   │   └── User
│   │       │   ├── repository
│   │       │   │   └── UserRepository
│   │       │   ├── security
│   │       │   │   ├── CustomUserDetails
│   │       │   │   └── CustomUserDetailsService
│   │       │   └── service
│   │       │       └── UserService
│   │       │
│   │       └── post
│   │           ├── controller
│   │           │   └── PostController
│   │           ├── dto
│   │           │   └── PostForm
│   │           ├── entity
│   │           │   └── Post
│   │           ├── repository
│   │           │   └── PostRepository
│   │           └── service
│   │               └── PostService
│   │
│   └── resources
│       ├── script
│       │   └── schema.sql
│       │
│       ├── static
│       │   ├── style.css
│       │   └── uploads
│       │
│       ├── templates
│       │   ├── login.html
│       │   ├── signup.html
│       │   ├── feed.html
│       │   ├── create.html
│       │   └── edit.html
│       │
│       └── application.properties
│
└── build.gradle
```

---

# 🏗 System Architecture

```text
Browser
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
MySQL
```

---

# 🔄 Data Flow

```text
User Request
      │
      ▼
Controller
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
Database
      │
      ▼
View(Thymeleaf)
```

---

# 🔌 URL Mapping

## User

| Method | URL     | Description |
| ------ | ------- | ----------- |
| GET    | /signup | 회원가입 페이지    |
| POST   | /signup | 회원가입        |
| GET    | /login  | 로그인 페이지     |
| POST   | /login  | 로그인         |
| POST   | /logout | 로그아웃        |

---

## Post

| Method | URL          | Description |
| ------ | ------------ | ----------- |
| GET    | /            | 전체 피드       |
| GET    | /my-feed     | 내 게시글 조회    |
| GET    | /create      | 게시글 작성 페이지  |
| POST   | /create      | 게시글 등록      |
| GET    | /edit/{id}   | 게시글 수정 페이지  |
| POST   | /edit/{id}   | 게시글 수정      |
| POST   | /delete/{id} | 게시글 삭제      |

---

# 🗄 Database Design

## users

| Column   | Description     |
| -------- | --------------- |
| id       | PK              |
| userId   | 로그인 아이디         |
| password | BCrypt 암호화 비밀번호 |
| name     | 사용자 이름          |

---

## posts

| Column    | Description |
| --------- | ----------- |
| id        | PK          |
| content   | 게시글 내용      |
| imagePath | 이미지 경로      |
| createdAt | 게시글 작성 시간   |
| userId    | 작성자 아이디     |

---
# ☁️ Deployment

## GCP VM

프로젝트를 Google Cloud Platform(GCP) Compute Engine VM에 배포하였다.

### 배포 환경

* Ubuntu 22.04
* Java 21
* MySQL 8
* PM2
* Cloudflare Tunnel

### 배포 과정

#### 1. 프로젝트 빌드

```bash
./gradlew build

--

# 🧠 Troubleshooting

## 1. 이미지 업로드 후 404 오류 발생

### 문제

이미지는 정상적으로 저장되지만 화면에서 이미지가 출력되지 않았다.

### 원인

파일은 uploads 폴더에 저장되었지만 Spring Boot가 해당 경로를 정적 리소스로 인식하지 못했다.

### 해결

WebMvcConfigurer를 활용하여 업로드 경로를 ResourceHandler로 등록하였다.

```java
registry.addResourceHandler("/uploads/**")
        .addResourceLocations("file:src/main/resources/static/uploads/");
```

### 결과

게시글 등록 후 이미지가 정상 출력되었다.

---

## 2. 게시글 수정 페이지 접근 시 500 에러 발생

### 문제

수정 버튼 클릭 시 Internal Server Error 발생

### 원인

Controller에서 조회한 게시글 데이터를 edit.html로 전달하지 않았다.

### 해결

```java
Post post = postService.findById(id, userId);
model.addAttribute("post", post);
```

수정 대상 게시글을 모델에 추가하였다.

### 결과

수정 페이지가 정상적으로 렌더링되었다.

---

## 3. 게시글 수정 SQL 문법 오류

### 문제

게시글 수정 시 SQLSyntaxErrorException 발생

### 원인

UPDATE 쿼리의 SET 절 마지막에 쉼표가 존재하였다.

```sql
SET content = ?,
```

### 해결

불필요한 쉼표 제거

```sql
SET content = ?
```

### 결과

게시글 수정 기능 정상 동작

---

## 4. 로그인 상태인데 내 피드 접근 불가

### 문제

로그인 이후에도 /my-feed 접근 시 로그인 페이지로 이동

### 원인

세션 저장 키와 조회 키가 일치하지 않았다.

### 해결

```java
session.setAttribute("loginUserId", userId);
```

저장 및 조회 모두 loginUserId로 통일하였다.

### 결과

내 게시글 조회 정상 동작

---

## 5. 다른 사용자의 게시글 수정 가능

### 문제

URL만 변경하면 다른 사용자의 게시글 수정 가능

### 원인

게시글 ID만 비교하고 작성자 검증을 하지 않았다.

### 해결

```sql
WHERE id = ?
AND userId = ?
```

조건 추가

### 결과

본인 게시글만 수정 가능

---

## 6. 이미지 없이 게시글 등록 가능

### 문제

이미지를 첨부하지 않아도 게시글 등록 가능

### 원인

MultipartFile 검증 누락

### 해결

```java
if(form.getImage() == null || form.getImage().isEmpty()) {
    throw new IllegalArgumentException("이미지를 올려주세요");
}
```

### 결과

이미지 첨부 필수 기능 구현

---

## 7. Spring Security 적용 후 모든 페이지 접근 차단

### 문제

Security 의존성 추가 후 로그인 페이지조차 접근 불가

### 원인

Spring Security 기본 설정 적용

### 해결

```java
.authorizeHttpRequests(auth ->
    auth.anyRequest().permitAll()
)
```

### 결과

모든 페이지 정상 접근 가능

---

## 8. 이미지 업로드 경로 관리 문제

### 문제

파일 저장 경로와 DB 저장 경로가 혼재되어 유지보수가 어려웠다.

### 해결

실제 저장 경로와 URL 경로를 분리하였다.

```text
실제 저장
src/main/resources/static/uploads

DB 저장
/uploads/파일명.jpg
```

### 결과

유지보수성과 가독성 향상

---

# 🚀 Future Improvements

* 댓글 기능
* 좋아요 기능
* 회원 프로필 기능
* 게시글 검색
* 게시글 페이징
* 무한 스크롤
* 이미지 다중 업로드
* AWS S3 이미지 저장
* Spring Security 로그인 적용

---

# 📚 What I Learned

## 👍 Good

### MVC 패턴 구조 이해

Controller → Service → Repository 구조로 역할을 분리하며 계층형 아키텍처를 경험할 수 있었다.

---

### JdbcTemplate 활용

JPA 없이 SQL을 직접 작성하며 데이터 처리 과정을 명확하게 이해할 수 있었다.

---

### 세션 기반 인증 구현

HttpSession을 활용하여 로그인 상태를 유지하고 사용자별 권한 처리를 구현할 수 있었다.

---

### 파일 업로드 처리

MultipartFile을 이용하여 이미지 업로드 기능을 구현하고 서버 저장 방식을 학습하였다.

---

### Thymeleaf 활용

서버 데이터를 HTML에 렌더링하고 조건문, 반복문을 활용하는 방법을 익혔다.

---
### Spring Security 인증 구조 이해

CustomUserDetails와 CustomUserDetailsService를 구현하며 Spring Security의 인증 과정을 학습하였다.

로그인 성공 후 Principal 객체를 통해 현재 로그인 사용자를 조회하는 방식을 이해할 수 있었다.

---

### GCP 서버 배포 경험

GCP Compute Engine VM에 프로젝트를 배포하고 PM2를 활용하여 프로세스를 관리하였다.

또한 Cloudflare Tunnel을 이용하여 외부 네트워크에서 서비스에 접근할 수 있도록 구성하는 경험을 할 수 있었다.
---

## 😢 Bad

### 처음에는 Controller에 로직 집중

비즈니스 로직까지 Controller에서 처리하려고 하여 유지보수가 어려웠다.

Service 계층으로 역할을 분리하며 개선하였다.

---

### 파일 업로드 구조 이해 부족

저장 경로와 URL 경로의 차이를 이해하지 못해 이미지 출력 문제를 겪었다.

---

### 세션 관리 실수

세션 키 이름이 일관되지 않아 로그인 상태 확인 과정에서 문제가 발생하였다.

---

### 예외 처리 부족

초기에는 입력 검증이 부족하여 예상하지 못한 오류가 자주 발생하였다.

---

## 📚 Learned

### Spring Boot 요청 처리 흐름 이해

```text
Browser
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Database
```

실제 CRUD 기능을 구현하면서 전체 요청 흐름을 이해할 수 있었다.

---

### BCrypt 암호화 이해

비밀번호를 평문으로 저장하지 않고 안전하게 저장하는 방법을 학습하였다.

---

### 사용자 권한 검증 중요성

수정 및 삭제 기능에서는 작성자 검증이 반드시 필요하다는 점을 경험하였다.

---

### 계층 분리의 중요성

프로젝트 규모가 커질수록 Controller, Service, Repository 역할 분리가 유지보수에 큰 영향을 준다는 점을 체감하였다.

---

### 예외 처리 설계

입력값 검증과 로그인 검증 등 예외 상황을 고려하는 습관을 기를 수 있었다.

---

# 📄 Page Pipeline

## signup.html

### 데이터 로딩

회원가입 화면 렌더링

### 데이터 수집

아이디, 비밀번호, 이름 입력

### 데이터 처리

회원가입 요청 → 비밀번호 암호화 → DB 저장

---

## login.html

### 데이터 로딩

로그인 화면 렌더링

### 데이터 수집

아이디, 비밀번호 입력

### 데이터 처리

Spring Security 인증 요청 → CustomUserDetailsService 사용자 조회 → 비밀번호 검증 → Security Session 생성 → 로그인 처리

---

## feed.html

### 데이터 로딩

전체 게시글 조회

### 데이터 수집

게시글 선택

### 데이터 처리

게시글 출력 → Principal을 통한 로그인 사용자 확인 → 수정/삭제 권한 검증

---

## create.html

### 데이터 로딩

게시글 작성 화면 렌더링

### 데이터 수집

이미지 및 게시글 내용 입력

### 데이터 처리

이미지 저장 → 게시글 저장 → 피드 이동

---

## edit.html

### 데이터 로딩

수정 대상 게시글 조회

### 데이터 수집

수정 내용 입력

### 데이터 처리

게시글 수정 → 피드 이동

---
