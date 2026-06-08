/**
 * 파이프라인
 * 1. jdbcTemplate 의존성 주입
 * 2. PostRepository 생성자 생성
 *
 * 게시글 등록
 * 1. 게시글 등록 sql 작성
 *
 * 게시글 조회
 * 1. 전체 게시글 조회 sql 작성
 * 2. 로그인한 id값 가져와서 내 게시글 조회 sql 작성
 * 2. DB 조회
 *
 * 게시글 삭제
 * 1. 내가 작성한 게시글 삭제 sql 삭제 (선택한 게시글 고유 번호(id))
 * 2. DB 업데이트
 *
 * 게시글 수정
 * 1. 작성한 게시글 정보 조회
 * 2. 게시글 수정 SQL 작성
 * 3. DB 업데이트
 * */

package com.example.minisns.post.repository;

import com.example.minisns.post.entity.Post;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository // 이 파일이 repository임을 명시
public class PostRepository {

    // 변경 불가(final)한 캡슐화 (private)
    private final JdbcTemplate jdbcTemplate;

    // 생성자
    public PostRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // 게시글 등록
    public void save(String content,String imagePath, String userId) {
        String sql = """
                INSERT INTO posts
                (content, imagePath, createdAt, userId)
                VALUES (?, ?, NOW(), ?)
                """;
        // jdbcTemplate.update() : 데이터 등록, 변경
        jdbcTemplate.update(sql, content, imagePath, userId);
    }

    // 전체 게시글 조회
    public List<Post> findAll() {
        String sql = """
            Select id, content, imagePath, createdAt, userId
            FROM posts
            ORDER BY createdAt DESC
            """;
        // jdbcTemplate.query() : 데이터 조회
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Post(
                    rs.getLong("id"),
                    rs.getString("content"),
                    rs.getString("imagePath"),
                    rs.getTimestamp("createdAt").toLocalDateTime(),
                    rs.getString("userId")
            )
        );
    }

    // 내 게시글 조회
    public List<Post> findByUserId(String userId) {
        String sql = """
            SELECT id, content, imagePath, createdAt, userId
            FROM posts
            WHERE userId = ?
            ORDER BY createdAt DESC
            """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
            new Post(
                rs.getLong("id"),
                rs.getString("content"),
                rs.getString("imagePath"),
                rs.getTimestamp("createdAt").toLocalDateTime(),
                rs.getString("userId")
            ),
        userId);
    }

    // 게시글 삭제
    public void delete(Long postId, String userId) {
        String sql = """
                DELETE FROM posts
                WHERE id = ?
                AND userId = ?
                """;
        // jdbcTemplate.update() : 데이터 등록, 변경
        jdbcTemplate.update(sql, postId, userId);
    }

    // 게시글 수정
    // 수정할 게시글 내용 조회
    public Post findById(Long id, String userId) {
        String sql = """
                SELECT id, content, imagePath, createdAt, userId
                FROM posts
                WHERE id = ?
                AND userId = ?
                """;
        // jdbcTemplate.update() : 데이터 등록, 변경
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) ->
            new Post(
                rs.getLong("id"),
                rs.getString("content"),
                rs.getString("imagePath"),
                rs.getTimestamp("createdAt").toLocalDateTime(),
                rs.getString("userId")
            ),
        id, userId);
    }

    // 게시글 수정
    public void edit(String content, Long id, String userId) {
        String sql = """
               UPDATE posts
               SET content = ?
               WHERE id = ?
               AND userId = ?
                """;
        // jdbcTemplate.update() : 데이터 등록, 변경
        jdbcTemplate.update(sql, content, id, userId);
    }
}
