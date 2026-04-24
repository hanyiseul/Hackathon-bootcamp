// 서버랑 통신만 하는 파일

// 회원가입 api
export const signup = async (user_id, password, balance) => {
  try {
    const respose = await fetch("/api/signup", { // api 요청 전송
      method: "POST", // post 요청 보냄
      headers: {"Content-Type": "application/json"}, // 요청 헤더
      body: JSON.stringify({user_id, password, balance}) // 요청할 데이터 (요청 본문)
    });
    const data = await respose.json(); // 요청 완료된 데이터를 json으로 받음

    if (!data.success) { // 회원가입 실패시 강제 오류
      throw new Error("회원가입 실패");
    }
    return data;
  } catch (error) { // 네트워크 오류 등의 데이터 요청 실패 경우
    console.error("프론트 error:", error);
    alert("회원가입 중 오류가 발생되었습니다. 다시 시도해주세요!");
  }
}

// 로그인 api
export const login = async(user_id, password) => {
  try {
    const response = await fetch("/api/login", { // api 요청 전송
      method: "POST", // post 요청 보냄
      headers: {"Content-Type": "application/json"}, // 요청 헤더
      body: JSON.stringify({user_id, password}) // 로그인 입력 정보 json 형식으로 보냄
    });
    const data = await response.json(); // 요청 완료된 데이터를 json으로 받음

    if(data.success) {
      alert("로그인이 완료되었습니다."); 
    } else {
      alert("로그인이 실패하였어요! 다시 확인해주세요!");
      throw new Error(data.message || "로그인 실패");
    }
    return data; 
  } catch (error) {
    console.error("프론트", error);
    alert("로그인 중 오류가 발생되었습니다. 다시 시도해주세요!");
  }
}