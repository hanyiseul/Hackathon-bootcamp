// repository : JPA Repository 계층
// MariaDB 테이블 접근
package com.example.mobilebank.repository;

import com.example.mobilebank.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
