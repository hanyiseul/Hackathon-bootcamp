/**
 * 파이프라인
 * 1. UserDetails 인터페이스 구현
 * 2. 로그인한 사용자 정보를 저장할 User 객체 생성
 * 3. 생성자를 통해 User 객체 초기화
 * 4. Spring Security가 사용할 사용자 아이디 반환
 * 5. Spring Security가 사용할 비밀번호 반환
 * 6. 사용자 권한 정보 반환
 * 7. 인증된 사용자 정보를 Security Context에 전달
 * */

package com.example.minisns.member.security;

import com.example.minisns.member.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {
    // User의 user 객체 캡슐화 (변경 불가능)
    private final User user;

    // 생성자 생성
    public CustomUserDetails(User user) {
        this.user = user;
    }

    // 로그인 아이디 반환
    public String getUserId() {
        return user.getUserId();
    }

    @Override
    public String getUsername() {
        return user.getUserId();
    }

    // 암호화된 비밀번호 반환
    @Override
    public String getPassword() {
        return user.getPassword();
    }

    // getAuthorities()
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { // Spring Security가 정해놓은 규칙
        return List.of(); //  필요한 경우 권한 추가 가능
    }
}