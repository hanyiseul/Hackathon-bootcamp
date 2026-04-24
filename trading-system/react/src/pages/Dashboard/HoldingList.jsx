import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const HoldingList = ({holdings}) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8 sm:mb-10">
        <h2 className="font-semibold mb-4">보유 종목</h2>

        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full text-sm table-fixed">
            
            <thead className="text-gray-400 border-b text-left text-xs sm:text-sm">
              <tr>
                <th className="py-3 whitespace-nowrap">종목</th>
                <th className="py-3 whitespace-nowrap text-right">수량</th>
                <th className="py-3 whitespace-nowrap text-right">가격</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {holdings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-400">
                    거래내역이 없습니다
                  </td>
                </tr>
              ) : (
                holdings.map((holding) => (
                  <tr key={holding.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 whitespace-nowrap">
                      {holding.name}
                    </td>
                    <td className="py-3 whitespace-nowrap text-right">
                      {holding.quantity}
                    </td>
                    <td className="py-3 whitespace-nowrap text-right">
                      ₩ {holding.price}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HoldingList;