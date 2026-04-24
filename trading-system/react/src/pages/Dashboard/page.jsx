import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { getMydata, getStocks, getTrades, getHolding } from "@/api/tradeAPI";
import { buyStock, sellStock } from "@/api/tradeAPI";
import StockList from "./StockList";
import MyData from "./MyData";
import TradeList from "./TradeList";
import HoldingList from "./holdingList";

const Dashboard = () => {
  // 전역상태 호출
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // 데이터 상태 변경 관리
  const [total, setTotal] = useState(0); // 총 자산 관리 변수
  const [rate, setRate] = useState(0); // 수익률 변수
  const [stocks, setStocks] = useState([]); // 종목 변동값 받을 변수
  const [prevStocks, setPrevStocks] = useState([]); // 종목 이전값 받을 변수
  const [holdings, setHoldings] = useState([]); // 보유종목 변수
  const [trades, setTrades] = useState([]); // 거래내역 변수

  if (!token) { // 토큰 없으면 로그인으로 이동
    return <Navigate to="/" />;
  }

  const fetchMydata = async () => { // 내 자산 조회
    const data = await getMydata(user.user_id);
    setTotal(data?.total ?? 0);
    setRate(data?.rate ?? 0);
  };

  const fetchStocks = async () => { // 종목 리스트 조회
    const data = await getStocks();
    setStocks(prev => {
      setPrevStocks(prev);
      return data?.stocks ?? [];
    });
  };

  const fetchHoldings = async () => { // 보유종목 조회
    const data = await getHolding(user.user_id);
    setHoldings(data?.holdings ?? []);
  };

  const fetchTrades = async () => { // 거래내역 조회
    const data = await getTrades(user.user_id);
    setTrades(data?.trades ?? []);
  };

  useEffect(() => { // 내 자산 lifecycle
    if (!user?.user_id) return;

    fetchMydata(); // 초기값 세팅
    
    const interval = setInterval(fetchMydata, 3000); // 5초마다 값 호출
    return () => clearInterval(interval); // cleanup : 페이지 이동시 해당 이벤트 삭제
  }, [user?.user_id]); // user_id 값 받아오고 실행

  useEffect(() => { // 종목 리스트 lifecycle
    fetchStocks(); // 초기값 세팅
    
    const interval = setInterval(fetchStocks, 3000); // 5초마다 값 호출
    return () => clearInterval(interval); // cleanup : 페이지 이동시 해당 이벤트 삭제
  }, []); // 컴포넌트 호출시 한번만 실행

  useEffect(() => { // 보유종목 리스트 lifecycle
    if (!user?.user_id) return;

    fetchHoldings(); // 초기값 세팅

    const interval = setInterval(fetchHoldings, 3000);
    return () => clearInterval(interval);
  }, [user?.user_id]);

  useEffect(() => { // 거래내역 리스트 lifecycle
    if (!user?.user_id) return;

    fetchTrades(); // 초기값 세팅

    const interval = setInterval(fetchTrades, 3000);
    return () => clearInterval(interval);
  }, [user?.user_id]);

  
  const handleBuy = async (stock_id, quantity) => { // 매수 처리 함수
    if (!quantity) return;

    const res = await buyStock(user.user_id, stock_id, Number(quantity)); // 🔥 buy로 수정

    if (!res.success) {
      alert(res.message || "매수 실패");
      return;
    }

    fetchTrades();
    fetchHoldings();
    fetchMydata();
  };

  const handleSell = async (stock_id, quantity) => { // 매도 처리 함수
    if (!quantity) return;

    const res = await sellStock(user.user_id, stock_id, Number(quantity));

    if (!res.success) {
      alert(res.message || "매도 실패");
      return;
    }

    fetchTrades();
    fetchHoldings();
    fetchMydata();
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 mt-14 bg-gray-50 min-h-screen">
      <MyData user={user} total={total} rate={rate}/>
      <StockList stocks={stocks} prevStocks={prevStocks} onBuy={handleBuy} onSell={handleSell}/>
      <HoldingList holdings={holdings}/>
      <TradeList trades={trades}/>
    </div>
  );
};

export default Dashboard;