package com.backend.givu.util.mapper;

import com.backend.givu.model.Enum.UsersAgeRange;
import com.backend.givu.model.Enum.UsersGender;

public class AgeRangeMapper {

    public static UsersAgeRange fromKakao(String kakaoAgeRange) {
        if (kakaoAgeRange == null) return null;

        return switch (kakaoAgeRange) {
            case "10~19" -> UsersAgeRange.TEENAGER;
            case "20~29" -> UsersAgeRange.YOUNG_ADULT;
            case "30~39" -> UsersAgeRange.ADULT;
            case "40~49" -> UsersAgeRange.MIDDLE_AGED;
            case "50~59", "60~69", "70~79", "80~89", "90~" -> UsersAgeRange.SENIOR;
            default -> null; // 혹시 모를 예외적인 문자열
        };
    }
}

