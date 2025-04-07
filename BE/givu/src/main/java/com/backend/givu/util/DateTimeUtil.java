package com.backend.givu.util;

import java.time.*;

public class DateTimeUtil {

    // 기본 타임존 설정 (서울 기준)
    private static final ZoneId DEFAULT_ZONE = ZoneId.of("Asia/Seoul");

    /**
     * LocalDateTime → Instant
     */
    public static Instant toInstant(LocalDateTime localDateTime) {
        if (localDateTime == null) return null;
        return localDateTime.atZone(DEFAULT_ZONE).toInstant();
    }

    /**
     * Instant → LocalDateTime
     */
    public static LocalDateTime toLocalDateTime(Instant instant) {
        if (instant == null) return null;
        return instant.atZone(DEFAULT_ZONE).toLocalDateTime();
    }

    /**
     * LocalDate → Instant (00:00 기준)
     */
    public static Instant toInstant(LocalDate localDate) {
        if (localDate == null) return null;
        return localDate.atStartOfDay(DEFAULT_ZONE).toInstant();
    }

    /**
     * Instant → LocalDate
     */
    public static LocalDate toLocalDate(Instant instant) {
        if (instant == null) return null;
        return instant.atZone(DEFAULT_ZONE).toLocalDate();
    }

    /**
     * 현재 시간 Instant
     */
    public static Instant now() {
        return Instant.now();
    }

    public static LocalDate parseKakaoBirthday(String birthday) {
        if (birthday == null || birthday.length() != 4) return null;

        try {
            int month = Integer.parseInt(birthday.substring(0, 2));
            int day = Integer.parseInt(birthday.substring(2, 4));
            return LocalDate.of(1000, month, day); // 연도는 의미 없는 값 (예: 2000)
        } catch (NumberFormatException | DateTimeException e) {
            return null;
        }
    }

    public static LocalDateTime parseIsoString(String isoDate) {
        return LocalDateTime.ofInstant(
                Instant.parse(isoDate),
                ZoneId.systemDefault()
        );
    }

}
