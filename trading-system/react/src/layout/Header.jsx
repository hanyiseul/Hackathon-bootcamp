import Button from "@/components/Button";
import { useAuthStore } from "@/store/authStore";
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  // 전역상태관리
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn); // 로그인 상태
  const user = useAuthStore((state) => state.user); // 유저 정보
  const logout = useAuthStore((state) => state.logout); // 로그아웃

  // 링크 이동
  const navigate = useNavigate();
  
  // 로그아웃 처리
  const handleLogout = () => {
    logout(); // 전역상태로 관리되는 로그아웃 처리
    navigate("/"); 
    console.log("store 확인:", useAuthStore.getState()); // 로그인 여부 확인
  }
  return (
    <header className="fixed top-0 left-0 w-full h-14 px-6 flex items-center justify-between border-b bg-white z-50">
      <h1 className="font-bold text-lg">trading-system</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">
          {isLoggedIn ? user.user_id : ""} 
        </span>
        <Button variant="outline" className="w-auto px-3 py-1" onClick={handleLogout}>로그아웃</Button>
      </div>
    </header>
  );
};

export default Header;