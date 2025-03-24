package com.backend.givu.model.service;

import com.backend.givu.model.dto.UsersDTO;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 사용자 저장
    public User saveUser(UsersDTO dto) {
        User user = User.builder()
                .kakaoId(dto.getKakaoId())
                .nickName(dto.getNickName())
                .email(dto.getEmail())
                .birth(dto.getBirth().toLocalDate())
                .profileImage(dto.getProfileImage())
                .address(dto.getAddress())
                .gender(dto.getGender())
                .ageRange(dto.getAgeRange())
                .balance(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }

    // 사용자 조회
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다."));
    }

    // 기타 로직들 (수정, 삭제 등등) 추가 가능
}
