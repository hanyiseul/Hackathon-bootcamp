// security : JWT 생성, JWT 해석, 인증 필터, 인증 사용자 정보를 처리
package com.example.mobilebank.security;

public record AppPrincipal(Long userId, String username, String role, String sessionId) {}
