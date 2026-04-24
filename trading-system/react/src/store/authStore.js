// 로그인 상태를 전역으로 저장하는 공간

import { create } from "zustand";

export const useAuthStore = create((set) => {
  return {
    user: null, // 로그인한 유저 정보
    token: null, // JWT 토큰
    isLoggedIn: false, // 로그인 여부 체크

    login: ({ user, token }) => 
      set({ user, token, isLoggedIn: true }),
    logout: () => {
      localStorage.removeItem("token");
      set({ user: null, token: null, isLoggedIn: false });
    }
  }
})