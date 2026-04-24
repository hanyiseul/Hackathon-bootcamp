// 서버랑 통신만 하는 파일

// 내 자산 목록 api
export const getMydata = async(user_id) => {
  const response = await fetch(`/api/mydata?user_id=${user_id}`); // api 요청
  const data = await response.json(); // 응답받은 결과를 변수에 저장
  return data
}

// 거래 가능 주식 목록 api
export const getStocks = async() => {
  const response = await fetch("/api/stockList"); // api 요청
  const data = await response.json(); // 응답받은 결과를 변수에 저장
  return data
}

// 내 보유종목
export const getHolding = async (user_id) => {
  const response = await fetch(`/api/holdingList?user_id=${user_id}`); // user_id에 해당하는 데이터 요청
  const data = await response.json();
  return data;
};

// 내 거래내역
export const getTrades = async (user_id) => {
  const response = await fetch(`/api/tradeList?user_id=${user_id}`); // user_id에 해당하는 데이터 요청
  const data = await response.json();
  return data;
};

// 매수 api
export const buyStock = async (user_id, stock_id, quantity) => { // user_id, stock_id, quantity에 해당하는 데이터 요청
  const res = await fetch("/api/buy", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ user_id, stock_id, quantity })
  });
  return await res.json();
};

// 매도 api
export const sellStock = async (user_id, stock_id, quantity) => { // user_id, stock_id, quantity에 해당하는 데이터 요청
  const res = await fetch("/api/sell", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ user_id, stock_id, quantity })
  });
  return await res.json();
};