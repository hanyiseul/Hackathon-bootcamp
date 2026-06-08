/**
 * 파이프라인
 * 1. 입력받을 값 캡슐화
 * 2. 기본 생성자 생성
 * 3. 캡슐화값 외부에서 조회 가능하게 getter 처리
 * 4. 캡슐화값 변경 가능하게 setter 처리
 * */
package com.example.minisns.member.dto;

public class SignupForm {
    // 캡슐화
    private String userId;    // 회원 아이디
    private String password;  // 회원 비밀번호

    // 기본 생성자
    public SignupForm() {
    }

    // getter
    public String getUserId() {
        return userId;
    }
    public String getPassword() {
        return password;
    }

    // setter
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
