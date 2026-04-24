import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const StockList = ({stocks, prevStocks, onBuy, onSell}) => {
  const getColor = (stock) => { // 변동값 컬러 바꾸기
    const prev = prevStocks.find(s => s.stock_id === stock.stock_id); // 종목별 이전값 찾기

    if (!prev) return "text-gray-500"; // 초기값은 회색으로
    if (stock.price > prev.price) return "text-red-500"; // 상승 클래스
    if (stock.price < prev.price) return "text-blue-500"; // 하락 클래스

    return "text-gray-500"; // 변동 없음
  }; 
  
  const getQty = (stockId) => { // 수량 가져오는 함수
    const el = document.getElementById(`quantity-${stockId}`);
    return el ? Number(el.value) : 0;
  };
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8 sm:mb-10">
        <h2 className="font-semibold mb-4">종목 리스트</h2>

        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full text-sm table-fixed">
            <thead className="text-gray-400 border-b text-left text-xs sm:text-sm">
              <tr>
                <th className="py-3 w-1/4 whitespace-nowrap text-center">종목명</th>
                <th className="py-3 w-1/4 whitespace-nowrap text-center">현재가</th>
                <th className="py-3 w-1/3 whitespace-nowrap text-center">거래</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {stocks.map((stock) => (
                <tr className="border-b hover:bg-gray-50" key={stock.stock_id}>
                  <td className="py-3 whitespace-nowrap font-medium">{stock.name}</td>
                  <td className={`py-3 text-center ${getColor(stock)}`}>
                    ₩ {stock.price}
                  </td>
                  <td className="py-3 whitespace-nowrap text-center">
                    <div className="inline-flex items-center gap-1 sm:gap-2">
                      <input
                        type="number"
                        placeholder="수량"
                        className="w-14 sm:w-20 border rounded-md px-2 py-1 text-right text-xs sm:text-sm"
                        id={`quantity-${stock.id}`}
                      />

                      <button
                        className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={() => {
                          const qty = getQty(stock.id); // 클릭시 변수에 해당 주식 아이디값 담아서
                          onBuy(stock.id, qty); // 매수 함수 실행
                        }}
                      >
                        매수
                      </button>

                      <button
                        className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={() => {
                          const qty = getQty(stock.id);
                          onSell(stock.id, qty);
                        }}
                      >
                        매도
                      </button>
                                          </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StockList;