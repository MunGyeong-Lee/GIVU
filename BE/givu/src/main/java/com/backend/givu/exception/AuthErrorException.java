package com.backend.givu.exception;


import com.backend.givu.model.Enum.AuthErrorStatus;
import com.backend.givu.model.Enum.HttpStatusCode;
import lombok.Getter;

@Getter
public class AuthErrorException extends RuntimeException{
    private final HttpStatusCode code;
    private final String errorMsg;
    private final AuthErrorStatus errorStatus;

    public AuthErrorException(AuthErrorStatus authStatus){
        super(authStatus.getMsg());
        this.code = authStatus.getStatusCode(); // 401
        this.errorMsg = authStatus.getMsg();    // "토큰이 만료되었습니다."
        this.errorStatus = authStatus;          // AuthErrorStatus.EXPIRED_TOKEN
    }


}
