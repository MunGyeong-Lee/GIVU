package com.backend.givu.model.service;

import com.backend.givu.model.responseDTO.ApiResponse;
import com.backend.givu.model.responseDTO.UserSimpleInfoDTO;
import com.backend.givu.model.responseDTO.UsersDTO;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.aspectj.apache.bcel.classfile.Code;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

import static com.backend.givu.util.DateTimeUtil.toInstant;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 사용자 저장
    public User saveUser(UsersDTO dto) {
        User user = User.builder()
                .kakaoId(dto.getKakaoId())
                .nickname(dto.getNickName())
                .email(dto.getEmail())
                .birth(dto.getBirth())
                .profileImage(dto.getProfileImage())
                .address(dto.getAddress())
                .gender(dto.getGender())
                .ageRange(dto.getAgeRange())
                .balance(0)
                .createdAt(toInstant(LocalDateTime.now()))
                .updatedAt(toInstant(LocalDateTime.now()))
                .build();

        return userRepository.save(user);
    }

    // 사용자 조회
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다."));
    }

    public UserSimpleInfoDTO getUserSimpleInfoById(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다."));
        return new UserSimpleInfoDTO(user);
    }

    public Optional<User> getUserByKakaoId(Long kakaoId){
        return userRepository.findByKakaoId(kakaoId);
    }

    @Transactional
    public ApiResponse<Void> setUserPaymentPassword(long userId , String password){
        User user = userRepository.findById(userId).orElseThrow(()->new EntityNotFoundException("해당 사용자가 존재하지 않습니다."));
        user.setPaymentPassword(password);
        return ApiResponse.success(null);
    }

    public ApiResponse<Void> checkPaymentPassword(User user, String password){
        if(user.getPaymentPassword().equals(password)){
            return ApiResponse.success(null);
        }else{
            return ApiResponse.fail("ERROR", "비밀번호가 일치하지 않습니다.");
        }
    }

}
