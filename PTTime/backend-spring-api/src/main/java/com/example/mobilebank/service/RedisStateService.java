// Service: 실제 업무 로직 처리
// 계좌 잔액 변경, 거래 기록 저장, Redis 상태 관리, 관리자 기능이 이 계층에서 수행

// Redis 접근을 전담
package com.example.mobilebank.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.UUID;
@Service
public class RedisStateService {
    private final StringRedisTemplate redis;

    public RedisStateService(StringRedisTemplate redis) { this.redis = redis; }

    // 이 메서드는 로그인 성공 시 세션 ID를 생성하고 Redis에 저장
    // 사용자 로그인 -> LoginService -> RedisStateService.createSeesion() -> UUID 생성 -> Redis 저장
    public String createSession(Long userId, String username, String role) {
        String sessionId = UUID.randomUUID().toString(); // 랜덤 세션 생성
        String key = "auth:session:" + sessionId; // Redis key 생성
        redis.opsForValue().set(key, userId + ":" + username + ":" + role, Duration.ofHours(1)); // Redis 저장 (1시간 후 자동 삭제)
        redis.opsForList().leftPush("auth:user:" + userId + ":sessions", sessionId); // 사용자의 세션 목록 저장
        redis.expire("auth:user:" + userId + ":sessions", Duration.ofHours(1)); // 세션 TTL은 1시간
        audit("LOGIN_SESSION_CREATED user=" + username + " session=" + sessionId); // 감사 로그 생성
        return sessionId;
    }

    // 로그인 상태 확인
    // 브라우저 -> SessionID -> Redis 조회 -> hasKey() -> true -> 로그인 유지
    public boolean sessionExists(String sessionId) {
        // redis.hasKey : 세션이 존재하면 true / 없으면 false -> JWT 검증 비슷하게 사용 가능
        return sessionId != null && Boolean.TRUE.equals(redis.hasKey("auth:session:" + sessionId));
    }

    // 짧은 시간 동안 자주 발생할 수 있으므로 Redis에 30초 캐시
    //
    public void cacheAccount(Long userId, String json) {
        redis.opsForValue().set("cache:account:" + userId, json, Duration.ofSeconds(30));
    }

    // 사용자 조회 -> Redis -> cache:accout:1 존재 ? -> true -> Redis 데이터 반환 -> db 안감
    // 사용자 조회 -> Redis -> cache:accout:1 존재 ? -> false -> DB 조회 -> JSON 생성 -> cacheAccount() -> Redis 저장 (30초) -> 응답
    public String getCachedAccount(Long userId) { return redis.opsForValue().get("cache:account:" + userId); }
    public void evictAccount(Long userId) { redis.delete("cache:account:" + userId); }

    public void cacheDashboard(String json) { redis.opsForValue().set("cache:admin:dashboard", json, Duration.ofSeconds(20)); }
    public String getCachedDashboard() { return redis.opsForValue().get("cache:admin:dashboard"); }
    public void evictDashboard() { redis.delete("cache:admin:dashboard"); }

    // 최근 송금 대상은 Redis List로 관리 (모바일 뱅킹 앱에서 최근 보낸 사람 목록을 보여주는 구조로 좋음)
    public void addRecentRecipient(Long userId, String accountNumber) {
        String key = "recent:recipients:" + userId;
        redis.opsForList().leftPush(key, accountNumber); // 새 대상은 왼쪽에 추가
        redis.opsForList().trim(key, 0, 9); // 10개까지만 유지
        redis.expire(key, Duration.ofDays(7)); // TTL 7일
    }

    public List<String> recentRecipients(Long userId) {
        return redis.opsForList().range("recent:recipients:" + userId, 0, 9);
    }

    // 감사 로그 코드
    // 입금, 출금, 송금, 다중 송금, 로그인 세션 생성 같은 이벤트를 운영자가 빠르게 확인 가능
    public void audit(String message) {
        redis.opsForList().leftPush("audit:logs", java.time.LocalDateTime.now() + " " + message);
        redis.opsForList().trim("audit:logs", 0, 199); // 최근 200건만 Redis에 유지
    }

    public List<String> auditLogs() { return redis.opsForList().range("audit:logs", 0, 50); }
}
