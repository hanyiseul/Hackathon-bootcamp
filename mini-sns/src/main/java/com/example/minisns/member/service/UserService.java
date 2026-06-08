/**
 * 파이프라인
 *
 * 회원가입
 * 1. Repository와 PasswordEncoder를 주입받아 사용
 * 2. 생성자를 통해 의존성 초기화
 * 3. 요청받은 value값 체크
 * 4. 입력 여부 체크
 * 5. 비밀번호 해시 처리
 * 6. userRepository의 save 클래스를 통해 db 저장
 *
 * 로그인
 * 1. 로그인 요청
 * 2. Spring Security가 인증 처리
 * 3. CustomUserDetailsService에서 사용자 조회
 * 4. PasswordEncoder로 비밀번호 검증
 * 5. 인증 성공 시 Security Session 생성
 *
 */
package com.example.minisns.member.service;

import com.example.minisns.member.dto.LoginForm;
import com.example.minisns.member.dto.SignupForm;
import com.example.minisns.member.entity.User;
import com.example.minisns.member.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service // 이 파일이 service 임을 명시
public class UserService {
    // UserRepository 호출하여 캡슐화(변경 불가능)
    private final UserRepository userRepository;
    // passwordEncoder 호출하여 캡슐화(변경 불가능) - Security config
    private final PasswordEncoder passwordEncoder;

    // 생성자 생성 및 초기화
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // value 체크
    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty(); // value값이 null이거나 빈값인지 확인
    }

    // 회원가입
    public void signup(SignupForm form) {
        //  입력 여부 체크
        // IllegalArgumentException : 잘못된 값 예외 처리
        if (isBlank(form.getUserId())) { // 아이디 입력여부 확인
            throw new IllegalArgumentException("아이디를 입력하세요");
        }
        if (isBlank(form.getPassword())) { // 비밀번호 입력여부 확인
            throw new IllegalArgumentException("비밀번호를 입력하세요.");
        }
        if (userRepository.existsByUserId(form.getUserId())) { // 아이디 중복 여부 확인
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        // 비밀번호 해시 처리
        String passwordHash = passwordEncoder.encode(form.getPassword());

        userRepository.save(form.getUserId(), passwordHash); // 아이디와 암호화된 비밀번호 저장
    }
}
