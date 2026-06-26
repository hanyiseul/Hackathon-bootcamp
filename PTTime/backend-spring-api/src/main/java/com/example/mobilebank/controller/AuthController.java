// Controller : 외부 API 요청을 받음
// 직접 업무 로직을 처리하지 않고 Serivce를 호출
package com.example.mobilebank.controller;

import com.example.mobilebank.dto.AuthDtos.*;
import com.example.mobilebank.security.AppPrincipal;
import com.example.mobilebank.service.AuthService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }

    @GetMapping("/health")
    public Map<String, Object> health() { return Map.of("status", "OK", "service", "mobile-bank-api"); }

    @PostMapping("/auth/register")
    public AuthResponse register(@RequestBody RegisterRequest request) { return authService.register(request); }

    @PostMapping("/auth/login")
    public AuthResponse login(@RequestBody LoginRequest request) { return authService.login(request); }

    @GetMapping("/me")
    public AppPrincipal me(@AuthenticationPrincipal AppPrincipal principal) { return principal; }
}
