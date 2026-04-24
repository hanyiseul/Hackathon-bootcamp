import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "@/api/userAPI";

const Signup = () => {
  // 입력값 상태 변화 제어
  const [user_id, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState("");

  // 링크 이동
  const navigate = useNavigate();

  // api 처리
  const handleSignup = async() => {
    try {
      await signup(user_id, password, balance); // 회원가입 api 함수에 요청 데이터 넣기
      alert("회원가입 성공");
      navigate("/"); // 회원가입 성공시 로그인 페이지로 이동
    } catch (error) {
      alert("회원가입 실패", error);
    }
  }
  // const 
  return (
    <div className="min-h-[calc(100vh-48px)] bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <h1 className="text-2xl font-bold mb-8">회원가입</h1>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="아이디"
            value={user_id}
            onChange={(e) => {
              setUserId(e.target.value);
            }}
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="number"
            placeholder="입금 금액"
            value={balance}
            onChange={(e) => {
              setBalance(e.target.value);
            }}
          />
          <Button onClick={handleSignup}>회원가입</Button>
        </div>
        <div className="mt-6 text-sm text-gray-500 text-center">
          <Link to="/" className="text-gray-900 font-medium">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;