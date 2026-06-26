"use client";

import { useState } from "react";
import { useAccount, useBankMutation, useLogin, useTransactions } from "./hooks/useBankQueries";
import { useAuthStore } from "./store/authStore";

function errorOf(...items) {
  return items.find((item) => item?.error)?.error?.message || "";
}

function TxType({ type }) {
  const label = {
    DEPOSIT: "이용권 충전",
    WITHDRAW: "PT 예약",
    TRANSFER_OUT: "이용권 양도",
    TRANSFER_IN: "양도받음"
  }[type] || type;
  return <span className="type-pill">{label}</span>;
}

export default function MobileActionPage() {
  const auth = useAuthStore();
  const [loginForm, setLoginForm] = useState({ username: "user1", password: "1234" });
  const [amount, setAmount] = useState(10);
  const [to, setTo] = useState("PT-0001");
  const [memo, setMemo] = useState("이용권 메모");

  const account = useAccount();
  const tx = useTransactions();
  const login = useLogin();
  const deposit = useBankMutation("/bank/deposit");
  const withdraw = useBankMutation("/bank/withdraw");
  const transfer = useBankMutation("/bank/transfer");
  const multi = useBankMutation("/bank/multi-transfer");

  const result = deposit.data || withdraw.data || transfer.data || multi.data;
  const isBusy = deposit.isPending || withdraw.isPending || transfer.isPending || multi.isPending;

  if (!auth.token) {
    return (
      <main className="mobile-shell action-shell">
        <section className="device-card login-card">
          <div className="appbar compact-appbar">
            <a className="back-link" href="/">‹</a>
            <div>
              <p>PT 예약 관리</p>
            </div>
            <span className="server-chip">3003</span>
          </div>

          <section className="signin-hero">
            <div className="google-dot">G</div>
            <p className="eyebrow">MOBILE ACTION SERVER</p>
            <h2>이용권 예약·취소·양도는<br />로그인 후 진행합니다</h2>
            <p>
              조회 서버에서 로그인한 세션과 같은 Redis 저장소를 사용합니다.
              분리된 프론트 서버에서도 인증 상태가 이어지는 구조를 확인합니다.
            </p>
          </section>

          <section className="form-card">
            <label>아이디</label>
            <input value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} />
            <label>비밀번호</label>
            <input type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
            <button className="primary-btn full" onClick={() => login.mutate(loginForm)} disabled={login.isPending}>
              {login.isPending ? "확인 중" : "로그인"}
            </button>
            <a className="subtle-link" href="/">조회 화면으로 이동</a>
            <p className="error-text">{errorOf(login)}</p>
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="mobile-shell action-shell">
      <section className="device-card">
        <div className="appbar">
          <a className="back-link" href="/">‹</a>
          <div>
            <p>PT 예약 관리</p>
            <h1>{auth.profile?.name || auth.profile?.username}님</h1>
          </div>
          <button className="logout-btn" onClick={auth.logout}>종료</button>
        </div>

        <section className="account-card google-blue-card">
          <div className="card-row">
            <span>PT 이용권</span>
            <strong>{account.data?.status || "사용 가능"}</strong>
          </div>

          <h2>
            {account.data ? count(account.data.balance) : "남은 횟수 조회 중"}
          </h2>

          <p>
            이용권 번호 : {account.data?.accountNumber || "조회 중"}
          </p>
        </section>

        <section className="form-card transfer-card">
          <div className="section-title">
            <div>
              <p>예약 신청</p>
              <h2>이용권 사용 및 예약</h2>
            </div>
            <button className="ghost-btn" onClick={() => { account.refetch(); tx.refetch(); }}>새로고침</button>
          </div>

          <label>예약 횟수</label>

          <div className="money-input">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span>회</span>
          </div>

          <div className="preset-grid">
            {[1, 2, 5, 10].map((value) => (
              <button key={value} onClick={() => setAmount(value)}>
                {value}회
              </button>
            ))}
          </div>

          <label>트레이너</label>
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="김트레이너" />

          <label>메모</label>
          <input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="예약 메모" />

          <div className="action-buttons">
            <button className="secondary-btn" disabled={isBusy}
              onClick={() =>
                deposit.mutate({
                  amount: Number(amount),
                  memo: memo || "이용권 충전",
                })
              }
            >
              이용권 충전
            </button>
            <button className="secondary-btn" disabled={isBusy}
              onClick={() =>
                withdraw.mutate({
                  amount: Number(amount),
                  memo: memo || "PT 예약",
                })
              }
            >
              PT 예약
            </button>

            <button className="primary-btn span2" disabled={isBusy}
              onClick={() =>
                transfer.mutate({
                  toAccountNumber: to,
                  amount: Number(amount),
                  memo: memo || "이용권 양도",
                })
              }
            >
              이용권 양도
            </button>

            <button className="dark-btn span2" disabled={isBusy}
              onClick={() =>
                multi.mutate({
                  memo: "단체 예약",
                  targets: [
                    {
                      toAccountNumber: "PT-0002",
                      amount: 1,
                    },
                    {
                      toAccountNumber: "PT-0003",
                      amount: 1,
                    },
                  ],
                })
              }
            >
              단체 예약
            </button>
          </div>

          <p className="error-text">{errorOf(deposit, withdraw, transfer, multi)}</p>
        </section>

        {result && (
          <section className="result-card">
            <span>예약 완료</span>

            <h2>{result.message}</h2>

            <p>
              남은 PT 횟수 {count(result.account?.balance)}
            </p>
          </section>
        )}

        <section className="list-card">
          <div className="section-title">
            <div>
              <p>최근 예약</p>
              <h2>예약 이용 내역</h2>
            </div>

            <span className="server-chip">
              Redis 세션
            </span>
          </div>
          <div className="tx-list">
            {(tx.data || []).slice(0, 6).map((item) => (
              <div className="tx-item" key={item.id}>
                <div>
                  <TxType type={item.type} />
                  <strong>{item.memo || "PT 예약"}</strong>
                  <p>{item.createdAt}</p>
                </div>
                <b>{count(item.amount)}</b>
              </div>
            ))}
            {!(tx.data || []).length && <p className="empty">예약 내역이 없습니다.</p>}
          </div>
        </section>

        <nav className="bottom-nav">
          <a href="/">홈</a>
          <span className="active">예약</span>
          <a href="/">이용내역</a>
          <button onClick={auth.logout}>로그아웃</button>
        </nav>
      </section>
    </main>
  );
}
