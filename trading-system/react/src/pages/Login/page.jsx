import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Link, useNavigate } from 'react-router-dom';
import { login as loginAPI } from "@/api/userAPI";
import { useAuthStore } from "@/store/authStore";

const Login = () => {
  // 로그인 입력값 상태 제어 
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // 링크 이동
  const navigate = useNavigate();

  // 로그인 기능 구현
  // state: useAuthStore의 현재 상태값 묶음 (전역상태로 관리)
  const setAuth = useAuthStore((state) => state.login); // authStore에서 login 꺼내옴

  // 로그인 처리
  const handleLogin = async() => {
    try {
      const data = await loginAPI(user_id, password); // 로그인 api 함수에 요청 데이터 넣기

    console.log("data:", data);

      // 전역상태로 관리할 데이터 저장
      setAuth({
        user: data.user, // 계정 정보
        token: data.token, // 토큰 값 저장
      });

      console.log("store 확인:", useAuthStore.getState());

      // localStorage 저장
      console.log("login data:", data);
      console.log("토큰 저장 전:", localStorage.getItem("token"));

      localStorage.setItem("token", data.token);

      console.log("토큰 저장 후:", localStorage.getItem("token"));
      alert("로그인 성공");
      navigate("/dashboard"); // 로그인 성공시 대시보드 페이지로 이동
    } catch(error) {
      alert("로그인 실패", error);
    }
  }

  return (
    <div className="min-h-[calc(100vh-48px)] bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <h1 className="text-2xl font-bold mb-8">로그인</h1>
        <div className="flex flex-col gap-3">
          <Input
            value={user_id}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
          />
          <Button onClick={handleLogin}>로그인</Button>
        </div>
        <Link to="/signup" className="mt-6 text-sm text-gray-500 flex justify-center">회원가입 </Link>
      </div>
    </div>
  );
};

export default Login;