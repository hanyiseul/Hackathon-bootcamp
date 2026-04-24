// 회원가입 테스트코드
// (async () => {
//   const res = await fetch("http://localhost:3000/api/signup", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       user_id: "test12345",
//       password: "1234",
//     }),
//   });

//   const data = await res.json();
//   console.log("회원가입", data);
// })();

// 로그인 테스트코드
// (async () => {
//   const res = await fetch("http://localhost:3000/api/login", {
//     method: "post",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       user_id: "test1234",
//       password: "1234",
//     }),
//   });
//   const data = await res.json();
//   console.log("로그인", data);
// })();