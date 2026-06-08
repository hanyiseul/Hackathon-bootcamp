/**
 * 파이프라인
 * 1. db에 저장할 값들 캡슐화
 * 2. Post 생성자 생성 및 초기화
 * 3. 캡슐화 값을 외부에서 조회 가능하게 처리
 * */

package com.example.minisns.post.entity;

import java.time.LocalDateTime;

public class Post {
    // 캡슐화
    private Long id;                  // 게시글 번호
    private String content;           // 게시글 내용
    private String imagePath;         // 이미지 경로
    private LocalDateTime createdAt;  // 작성 시간
    private String userId;            // 작성자

    // Post 객체 생성시 모든 필드 초기화
    public Post(Long id, String content, String imagePath, LocalDateTime createdAt, String userId) {
        this.id = id;
        this.content = content;
        this.imagePath = imagePath;
        this.createdAt = createdAt;
        this.userId = userId;
    }

    // 캡슐화 조회
    // 게시글 번호 조회
    public Long getId () {
        return id;
    }
    // 게시글 내용 조회
    public String getContent () {
        return content;
    }
    // 게시글 이미지 경로 조회
    public String getImagePath  () {
        return imagePath;
    }
    // 게시글 등록 시간 조회
    public LocalDateTime getCreatedAt  () {
        return createdAt;
    }
    // 작성자 조회
    public String getUserId () {
        return userId;
    }

}
