package com.backend.givu.util.mapper;

import com.backend.givu.model.Enum.UsersGender;

public class GenderMapper {

    public static UsersGender fromKakao(String kakaoGender) {
        if (kakaoGender == null) return null;

        return switch (kakaoGender.toLowerCase()) {
            case "male" -> UsersGender.MALE;
            case "female" -> UsersGender.FEMALE;
            default -> null;
        };
    }
}
