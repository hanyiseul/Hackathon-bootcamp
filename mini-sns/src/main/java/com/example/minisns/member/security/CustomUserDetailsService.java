/**
 * 파이프라인
 * 1. 사용자가 입력한 정보 받기
 * 2. 해당 정보 db 조회
 * 3. 인증 정보 시큐리티에 전달
 * */

package com.example.minisns.member.security;

import com.example.minisns.member.entity.User;
import com.example.minisns.member.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
// Spring Security의 로그인 인증 규칙을 구현하는 클래스
public class CustomUserDetailsService implements UserDetailsService {
    // userRepository 호출하여 캡슐화
    private final UserRepository userRepository;

    // 생성자 주입
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 사용자가 로그인 시 입력한 아이디(userId)를 전달받음
    // 사용자가 없으면 UsernameNotFoundException 발생
    @Override
    public UserDetails loadUserByUsername(String userId)  throws UsernameNotFoundException {

        // DB에서 userId로 사용자 조회
        // 조회 결과가 없으면 UsernameNotFoundException 발생
        User user = userRepository.findByUserId(userId).orElseThrow(() ->
            new UsernameNotFoundException(
                "사용자를 찾을 수 없습니다."
            ));

        // 조회한 User 객체를 Spring Security가 사용하는 UserDetails 형태로 변환 후 반환
        return new CustomUserDetails(user);
    }
}