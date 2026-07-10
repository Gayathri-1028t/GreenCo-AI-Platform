package com.greenco.repository;

import com.greenco.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldSaveAndFindByEmail() {
        // Given
        User user = User.builder()
                .email("test-repo@greenco.org")
                .passwordHash("hashed")
                .firstName("Test")
                .lastName("Repo")
                .status("ACTIVE")
                .build();

        // When
        userRepository.save(user);
        Optional<User> found = userRepository.findByEmail("test-repo@greenco.org");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("Test");
    }

    @Test
    void shouldCheckIfEmailExists() {
        // Given
        User user = User.builder()
                .email("check@greenco.org")
                .passwordHash("hashed")
                .firstName("Check")
                .lastName("User")
                .status("ACTIVE")
                .build();

        // When
        userRepository.save(user);
        boolean exists = userRepository.existsByEmail("check@greenco.org");
        boolean notExists = userRepository.existsByEmail("notfound@greenco.org");

        // Then
        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }
}
