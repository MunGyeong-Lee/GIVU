package com.backend.givu.model.dto;

import com.backend.givu.model.Enum.UsersAgeRange;
import com.backend.givu.model.Enum.UsersGender;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class UsersDTO {
    private long userId;
    private long kakaoId;
    private String nickName;
    private String email;
    private LocalDateTime birth;
    private String profileImage;
    private String address;
    private UsersGender gender;
    private UsersAgeRange ageRange;
    private int balance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
