// 설정과 초기 데이터 생성 담당
package com.example.mobilebank.config;

import com.example.mobilebank.domain.*;
import com.example.mobilebank.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

// user: 회원
// accounts : 이용권 번호
// 잔액 : 남은 PT 횟수
@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner init(UserRepository users, AccountRepository accounts, PasswordEncoder encoder) {
        return args -> {
            User admin = users.findByUsername("admin").orElseGet(() -> users.save(new User("admin", encoder.encode("admin123"), "관리자", UserRole.ADMIN)));
            User u1 = users.findByUsername("user1").orElseGet(() -> users.save(new User("user1", encoder.encode("1234"), "김사용", UserRole.USER)));
            User u2 = users.findByUsername("user2").orElseGet(() -> users.save(new User("user2", encoder.encode("1234"), "이수신", UserRole.USER)));
            User u3 = users.findByUsername("user3").orElseGet(() -> users.save(new User("user3", encoder.encode("1234"), "박고객", UserRole.USER)));
            seedAccount(accounts, admin, "PT-0001", "20");
            seedAccount(accounts, u1, "PT-0002", "10");
            seedAccount(accounts, u2, "PT-0003", "3");
            seedAccount(accounts, u3, "PT-0004", "2");
        };
    }
    private void seedAccount(AccountRepository accounts, User user, String number, String amount) {
        accounts.findByAccountNumber(number).orElseGet(() -> accounts.save(new Account(user, number, new BigDecimal(amount))));
    }
}
