"use client";

import { useMemo, useState } from "react";
import { useAuthStore } from "./store/authStore";
import { useAccount, useLogin, useRegister, useTransactions, useRecentRecipients } from "./hooks/useBankQueries";

function txLabel(type) {
  switch (type) {
    case "DEPOSIT":
      return "이용권 충전";
    case "WITHDRAW":
      return "PT 예약";
    case "TRANSFER":
      return "이용권 양도";
    default:
      return type;
  }
}
function errorOf(...items) {
  return items.find((item) => item?.error)?.error?.message || "";
}

export default function MobileViewPage() {
  const [form, setForm] = useState({ username: "user1", password: "1234", name: "모바일사용자" });
  const [mode, setMode] = useState("login");
  const auth = useAuthStore();
  const login = useLogin();
  const register = useRegister();
  const account = useAccount();
  const tx = useTransactions();
  const recent = useRecentRecipients();
  const transactions = tx.data || [];
  const latest = transactions[0];
  const recentList = useMemo(() => (recent.data || []).slice(0, 4), [recent.data]);

  if (!auth.token) {
    return (
      <main className="phone-bg">
        <section className="phone-card auth-card">
          <div className="status-bar"><span>9:41</span><span>5G 100%</span></div>
          <div className="app-mark">충</div>
          <p className="eyebrow">PT TIME</p>
          <h1>언제 어디서나<br />간편한 PT 예약 관리</h1>
          <p className="lead">예약 조회는 모바일 조회 서버, <br />예약 신청은 예약 서버에서 처리됩니다. <br />로그인 세션은 Redis에 저장됩니다.</p>

          <div className="segmented">
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>로그인</button>
            <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>회원가입</button>
          </div>

          <div className="input-stack">
            <label>아이디</label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            <label>비밀번호</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {mode === "register" && <><label>이름</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></>}
          </div>

          <button className="primary wide" onClick={() => mode === "login" ? login.mutate({ username: form.username, password: form.password }) : register.mutate(form)}>
            {mode === "login" ? "로그인" : "회원가입 후 시작"}
          </button>
          <p className="error-text">{errorOf(login, register)}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="phone-bg">
      <section className="phone-frame">
        <header className="mobile-header">
          <div><p>안녕하세요</p><h1>{auth.profile?.name || auth.profile?.username}님</h1></div>
          <button className="icon-button" onClick={auth.logout}>종료</button>
        </header>

        <section className="balance-card">
          <div className="card-top">
            <span>PT 이용권</span>
            <b>{account.data?.status || "사용 가능"}</b>
          </div>

          <div>
            <p>남은 PT 이용 횟수</p>
            <h2>{account.isLoading ? "조회 중" : `${account.data?.balance ?? 0}회`}</h2>
          </div>

          <p>예약 시 1회 차감됩니다.</p>

          <div className="quick-actions">
            <a href="/action">예약하기</a>
            <a href="/action">이용권 충전</a>
            <a href="/action">이용권 양도</a>
          </div>
        </section>

        <section className="notice-card">
          <div><strong>Redis 세션 공유</strong><p>조회 서버 3002에서 로그인해도 거래 서버 3003에서 같은 인증 상태를 사용합니다.</p></div>
          <span>LIVE</span>
        </section>

        <section className="section-block">
          <div className="section-head">
            <h2>최근 예약 내역</h2>
            <a href="/action">전체보기</a>
          </div>

          <div className="recipient-row">
            {(recentList.length
              ? recentList
              : [
                  "6/26 18:00 김트레이너",
                  "6/22 10:00 이트레이너",
                  "6/18 19:00 박트레이너",
                ]).map((item, idx) => (
              <div className="recipient" key={item + idx}>
                <span>{idx + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="section-head">
            <h2>예약 이용 내역</h2>
            <button onClick={() => { account.refetch(); tx.refetch(); recent.refetch(); }}>새로고침</button>
          </div>
          {latest && <div className="latest-card">
            <span>최근 예약</span>
            <strong>{txLabel(latest.type)}</strong>
            <b>{latest.amount}회</b>
            <p>{latest.memo || "예약 내용이 없습니다."}</p></div>
          }
          <div className="tx-list">
            {transactions.slice(0, 8).map((item) => 
              <div className="tx-item" key={item.id}>
                <div>
                  <strong>{txLabel(item.type)}</strong>
                  <p>{item.memo || item.createdAt}</p>
                </div>
                <b>{item.amount}회</b>
              </div>
            )}
            {!transactions.length && <p className="empty">예약내용이 없습니다.</p>}
          </div>
        </section>

        <nav className="bottom-nav">
          <span className="active">홈</span>
          <a href="/action">예약</a>
          <span>이용 내역</span>
          <span>설정</span>
        </nav>
      </section>
    </main>
  );
}
