package com.backend.givu.model.service;

import com.backend.givu.config.RestTemplateConfig;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.requestDTO.CreateDepositAccountRequest;
import com.backend.givu.model.responseDTO.CodeMessageDTO;
import com.backend.givu.model.responseDTO.DepositAccountResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MyPageService {

    private final RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    @Transactional
    public CodeMessageDTO createDepositAccount(User user){

        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/createDemandDepositAccount";

        CreateDepositAccountRequest requestBody = new CreateDepositAccountRequest();

        try {
            String json = objectMapper.writeValueAsString(requestBody);
            System.out.println(json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        ResponseEntity<DepositAccountResponse> response = restTemplate.postForEntity(
                url,
                requestBody,
                DepositAccountResponse.class
        );

        DepositAccountResponse body = response.getBody();

        if (body.getHeader().getResponseCode().equals("H0000")) {
            System.out.println(body.getREC().getAccountNo());
            user.setAccountNumber(body.getREC().getAccountNo());
            return CodeMessageDTO.success();
        } else {
            return CodeMessageDTO.fail(
                    body.getHeader().getResponseCode(),
                    body.getHeader().getResponseMessage()
            );
        }
    }
}
