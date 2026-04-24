import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const TradeList = ({trades}) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="font-semibold mb-4">거래 내역</h2>

        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full text-sm table-fixed">
            
            <thead className="text-gray-400 border-b text-left text-xs sm:text-sm">
              <tr>
                <th className="py-3 whitespace-nowrap">종목</th>
                <th className="py-3 whitespace-nowrap">타입</th>
                <th className="py-3 whitespace-nowrap text-right">수량</th>
                <th className="py-3 whitespace-nowrap text-right">가격</th>
                <th className="py-3 whitespace-nowrap text-right">시간</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-400">
                    거래내역이 없습니다
                  </td>
                </tr>
              ) : (
                trades.map((trade) => (
                  <tr key={trade.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 whitespace-nowrap">
                      {trade.name}
                    </td>

                    <td className="py-3 whitespace-nowrap font-medium">
                      {trade.type === "buy" ? "매수" : "매도"}
                    </td>

                    <td className="py-3 whitespace-nowrap text-right">
                      {trade.quantity}
                    </td>

                    <td className="py-3 whitespace-nowrap text-right">
                      ₩ {trade.price.toLocaleString()}
                    </td>

                    <td className="py-3 whitespace-nowrap text-right">
                      {new Date(trade.created_at).toLocaleDateString()}
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

export default TradeList;