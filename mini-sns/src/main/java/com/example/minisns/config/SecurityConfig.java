package com.example.minisns.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration // 스프링 설정 클래스임을 명시
public class SecurityConfig {

    @Bean // PasswordEncoder 객체를 스프링 컨테이너에 Bean으로 등록
    public PasswordEncoder passwordEncoder() {
        // BCrypt 방식의 비밀번호 암호화 객체 생성
        return new BCryptPasswordEncoder();
    }

    // Spring Security 보안 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
        throws Exception {
            http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers(
                        "/login",
                        "/signup",
                        "/style.css",
                        "/uploads/**"
                    ).permitAll()
                    .anyRequest().authenticated()
                )

                .formLogin(form -> form
                    .loginPage("/login")
                    .loginProcessingUrl("/login")
                    .usernameParameter("userId")
                    .passwordParameter("password")
                    .defaultSuccessUrl("/", true)
                    .permitAll()
                )

                .logout(logout -> logout
                    .logoutUrl("/logout")
                    .logoutSuccessUrl("/login")
                );
        // 설정 적용 후 반환
        return http.build();
    }
}
