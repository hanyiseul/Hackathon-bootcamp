// Controller : 외부 API 요청을 받음
// 직접 업무 로직을 처리하지 않고 Serivce를 호출
package com.example.mobilebank.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> illegalArgument(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("timestamp", LocalDateTime.now().toString(), "message", e.getMessage()));
    }
}
