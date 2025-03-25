package com.backend.givu.model.responseDTO;

import com.backend.givu.model.Enum.UsersAgeRange;
import com.backend.givu.model.Enum.UsersGender;
import lombok.*;

import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserInfoDTO {
    private long kakaoId;
    private String nickName;
    private String email;
    private LocalDate birth;
    private String profileImage;
    private String address;
    private int balance;
    private UsersGender gender;
    private UsersAgeRange ageRange;
}
