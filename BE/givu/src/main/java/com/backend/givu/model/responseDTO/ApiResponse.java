package com.backend.givu.model.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private String code;
    private String message;
    private T data;

    public static<T> ApiResponse<T> success(T data){
        return new ApiResponse<>("SUCCESS", "정상 처리되었습니다.", data);
    }

    public static<T> ApiResponse<T> fail(String code, String message){
        return new ApiResponse<>(code, message,null);
    }
}
