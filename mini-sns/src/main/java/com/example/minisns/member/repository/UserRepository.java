/**
 * 파이프라인
 *
 * 회원가입
 * 1. JdbcTemplate 의존성 주입
 * 2. UserRepository 생성자 생성
 * 3. db에 보낼 회원가입 SQL 작성
 * 4. 아이디 존재 여부 체크
 * 5. DB에 회원 정보 저장
 *
 * 로그인
 * 1. 아이디로 회원가입 여부 조회
 * 2. 조회된 한 행(row)을 User(엔티티에서 만든 생성자) 객체로 변환
 * 3. 조회 결과가 있으면 첫 번째 회원 반환, 없으면 Optional.empty() 반환
 * */
package com.example.minisns.member.repository;

import com.example.minisns.member.entity.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository // 이 파일이 repository임을 명시
public class UserRepository {

    // 변경 불가(final)한 캡슐화 (private)
    // JdbcTemplate: DB에 SQL을 보내고 결과를 받아오는 객체 (스프링 내장 객체)
    private final JdbcTemplate jdbcTemplate;

    // 생성자
    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // 회원 정보를 DB에 저장
    public void save(String userId, String password) {
        String sql = """
                INSERT INTO users
                (userId, password, createdAt)
                VALUES (?, ?, NOW())
                """;
        jdbcTemplate.update(sql, userId, password);
    }

    // 아이디 존재 여부 확인
    public boolean existsByUserId(String userId) {
        String sql = "SELECT COUNT(*) FROM users WHERE userId = ?";

        // userId가 몇 명 있는지 COUNT(*) 결과를 Integer 하나로 받아와서 count에 저장
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId);

        // 아이디 조회가 null이 아니거나 1개 이상일 경우 반환
        return count != null && count > 0;
    }

    // 아이디로 회원 조회
    // Optional: 값이 있을 수도 있고 없을 수도 있음 (사용자가 없을 수 있음도 고려)
    public Optional<User> findByUserId(String userId) {
        String sql = """
            SELECT id, userId, password, createdAt
            FROM users
            WHERE userId = ?
            """;

        // 조회된 한 행(row)을 User 객체로 변환
        List<User> users = jdbcTemplate.query(sql, (rs, rowNum) ->
            new User(
                    rs.getLong("id"),
                    rs.getString("userId"),
                    rs.getString("password"),
                    rs.getTimestamp("createdAt").toLocalDateTime()
            ), userId); // userId: ? 자리에 들어갈 값

        // 조회 결과가 있으면 첫 번째 회원 반환
        // 없으면 Optional.empty() 반환
        return users.stream().findFirst();
    }
}