package com.backend.givu.model.responseDTO;

import com.backend.givu.model.Enum.HttpStatusCode;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor(staticName = "of")
public class ResultDTO<D> {
    private final int code ;
    private final String message;
    private final D data;

    //DTO의 정적 팩토리 메서드
    public static <D> ResultDTO<D> of(HttpStatusCode httpStatusCode, String message, D data){
        return new ResultDTO<>(httpStatusCode.getCode(), message, data);
    }
}
