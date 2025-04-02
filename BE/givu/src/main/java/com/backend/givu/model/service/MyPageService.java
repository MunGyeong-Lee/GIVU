package com.backend.givu.model.service;

import com.backend.givu.config.RestTemplateConfig;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.requestDTO.CheckAccountRequest;
import com.backend.givu.model.requestDTO.CreateDepositAccountRequest;
import com.backend.givu.model.responseDTO.ApiResponse;
import com.backend.givu.model.responseDTO.CheckAccountResponse;
import com.backend.givu.model.responseDTO.DepositAccountResponse;
import com.backend.givu.model.responseDTO.UserAccountDTO;
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
    public ApiResponse createDepositAccount(User user){

        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/createDemandDepositAccount";

        CreateDepositAccountRequest requestBody = new CreateDepositAccountRequest();

        ResponseEntity<DepositAccountResponse> response = restTemplate.postForEntity(
                url,
                requestBody,
                DepositAccountResponse.class
        );

        DepositAccountResponse body = response.getBody();

        if (body.getHeader().getResponseCode().equals("H0000")) {
            user.setAccountNumber(body.getREC().getAccountNo());
            return ApiResponse.success(null);
        } else {
            return ApiResponse.fail(
                    body.getHeader().getResponseCode(),
                    body.getHeader().getResponseMessage()
            );
        }
    }

    public ApiResponse<UserAccountDTO> checkAccount(String accountNo){
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositAccountBalance";
        CheckAccountRequest checkAccountRequest = new CheckAccountRequest(accountNo);

        ResponseEntity<CheckAccountResponse> response = restTemplate.postForEntity(
                url,
                checkAccountRequest,
                CheckAccountResponse.class
        );

        CheckAccountResponse body = response.getBody();


    }
}
