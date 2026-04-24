import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const MyData = ({user, total, rate}) => {
  return (
    <>
      <h1 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
        {user?.user_id}님의 대시보드
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-sm text-gray-400 mb-2">잔고</h2>
          <p className="text-2xl sm:text-3xl font-semibold">
            <span className="text-gray-400 text-base sm:text-lg mr-1">₩</span>
            {user?.balance}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-sm text-gray-400 mb-2">내 자산</h2>
          <p className="text-2xl sm:text-3xl font-semibold">
            <span className="text-gray-400 text-base sm:text-lg mr-1">₩</span>
            {total}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-sm text-gray-400 mb-2">수익률</h2>
          <p className="text-2xl sm:text-3xl font-semibold text-green-500">
            {rate > 0 ? "+" + rate : "-" + rate}%
          </p>
        </div>
      </div>
    </>
  );
};

export default MyData;