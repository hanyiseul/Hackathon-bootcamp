/**
 * 파이프라인
 * 1. db에 저장할 값들 캡슐화
 * 2. User 생성자 생성 및 초기화
 * 3. 캡슐화 값을 외부에서 조회 가능하게 처리
 * */

package com.example.minisns.member.entity;

import java.time.LocalDateTime;

public class User {
    // 캡슐화
    private Long id;                    // 회원 고유 번호
    private String userId;              // 회원 아이디
    private String password;            // 회원 비밀번호
    private LocalDateTime createdAt;    // 회원 가입시간

    // 생성자 : 객체를 만들 때 실행되는 메서드
    // User 객체 생성시 모든 필드를 초기화하는 생성자
    public User(Long id, String userId, String password, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.password = password;
        this.createdAt = createdAt;
    }

    // Getter : 객체 안에 있는 값(캡슐화)을 외부에서 조회하기 위한 메서드
    // 회원 번호 조회
    public Long getId () {
        return id;
    }
    // 회원 아이디 조회
    public String getUserId () {
        return userId;
    }
    // 회원 비밀번호 조회
    public String getPassword () {
        return password;
    }
    // 회원 생성시간 조회
    public LocalDateTime getCreatedAt () {
        return createdAt;
    }
}