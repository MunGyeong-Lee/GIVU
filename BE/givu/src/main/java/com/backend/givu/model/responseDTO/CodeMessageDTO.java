package com.backend.givu.model.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CodeMessageDTO {
    private String code;
    private String messaage;

    public static CodeMessageDTO success(){
        return new CodeMessageDTO("0000", "정상 처리되었습니다.");
    }

    public static CodeMessageDTO fail(String code, String message){
        return new CodeMessageDTO(code, message);
    }
}
