package com.backend.givu.model.service;

import com.backend.givu.model.entity.User;
import com.backend.givu.model.requestDTO.CheckAccountRequestDTO;
import com.backend.givu.model.requestDTO.CreateDepositAccountRequest;
import com.backend.givu.model.requestDTO.DepositRequestDTO;
import com.backend.givu.model.requestDTO.WithdrawalRequestDTO;
import com.backend.givu.model.responseDTO.*;
import com.backend.givu.util.ErrorResponseParser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@RequiredArgsConstructor
public class MyPageService {

    private final WebClient webClient;
    private final ErrorResponseParser errorResponseParser;

    @Transactional
    public ApiResponse<Void> createDepositAccount(User user) {

        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/createDemandDepositAccount";

        CreateDepositAccountRequest requestBody = new CreateDepositAccountRequest();

        DepositAccountResponse body;

        try {
            body = webClient
                    .post()
                    .uri(url)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(DepositAccountResponse.class)
                    .block(); // 동기적으로 응답 받을 때까지 대기
        } catch (WebClientResponseException e) {
            String errbody = e.getResponseBodyAsString();
            String message = errorResponseParser.extractMessage(errbody);
            return ApiResponse.fail("ERROR", message);
        } catch (Exception e) {
            return ApiResponse.fail("ERROR", "외부 API 요청 실패: " + e.getMessage());
        }

        if (body != null && "H0000".equals(body.getHeader().getResponseCode())) {
            user.setAccountNumber(body.getREC().getAccountNo());
            return ApiResponse.success(null);
        } else {
            return ApiResponse.fail(
                    " ERROR",
                    body != null ? body.getHeader().getResponseMessage() : "응답 없음"
            );
        }
    }


    public ApiResponse<UserAccountDTO> checkAccount(String accountNo) {
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositAccountBalance";
        CheckAccountRequestDTO checkAccountRequest = new CheckAccountRequestDTO(accountNo);

        CheckAccountResponseDTO body;

        try {
            body = webClient
                    .post()
                    .uri(url)
                    .bodyValue(checkAccountRequest)
                    .retrieve()
                    .bodyToMono(CheckAccountResponseDTO.class)
                    .block(); // 동기적으로 응답 받을 때까지 대기
        } catch (WebClientResponseException e) {
            String errbody = e.getResponseBodyAsString();
            String message = errorResponseParser.extractMessage(errbody);
            return ApiResponse.fail("ERROR", message);
        } catch (Exception e) {
            return ApiResponse.fail("ERROR", "외부 API 요청 실패: " + e.getMessage());
        }

        if (body != null && body.getHeader().getResponseCode().equals("H0000")) {
            return ApiResponse.success(new UserAccountDTO(body.getREC().getAccountNo(), Integer.parseInt(body.getREC().getAccountBalance())));
        } else {
            return ApiResponse.fail("ERROR", body != null ? body.getHeader().getResponseMessage() : "응답 없음");
        }
    }

    @Transactional
    public ApiResponse<ChargeResultDTO> withdrawalFromAccount(String accountNo, User user, int amount) {
        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/updateDemandDepositAccountWithdrawal";
        WithdrawalRequestDTO withdrawalRequestDTO = new WithdrawalRequestDTO(accountNo, String.valueOf(amount));

        WithdrawalResponseDTO body;

        try {
            body = webClient
                    .post()
                    .uri(url)
                    .bodyValue(withdrawalRequestDTO)
                    .retrieve()
                    .bodyToMono(WithdrawalResponseDTO.class)
                    .block(); // 동기적으로 응답 받을 때까지 대기
        } catch (WebClientResponseException e) {
            String errbody = e.getResponseBodyAsString();
            String message = errorResponseParser.extractMessage(errbody);
            return ApiResponse.fail("ERROR", message);
        } catch (Exception e) {
            return ApiResponse.fail("ERROR", "외부 API 요청 실패: " + e.getMessage());
        }

        if (body != null && body.getHeader().getResponseCode().equals("H0000")) {
            ApiResponse<UserAccountDTO> res = checkAccount(accountNo);
            int accountBalance = res.getData().getBalance();
            user.setBalance(user.getBalance() + amount);
            return ApiResponse.success(new ChargeResultDTO(user.getId(), accountBalance, user.getBalance()));
        } else {
            return ApiResponse.fail("ERROR", body != null ? body.getHeader().getResponseMessage() : "응답 없음");
        }

    }

    @Transactional
    public ApiResponse<ChargeResultDTO> depositToAccount(String accountNo, User user, int amount) {
        if(user.getBalance() < amount){
            return ApiResponse.fail("ERROR", "GIVUPay 잔액이 부족합니다.");
        }

        String url = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/updateDemandDepositAccountDeposit";
        DepositRequestDTO depositRequestDTO = new DepositRequestDTO(accountNo, String.valueOf(amount));

        DepositResponseDTO body;

        try {
            body = webClient
                    .post()
                    .uri(url)
                    .bodyValue(depositRequestDTO)
                    .retrieve()
                    .bodyToMono(DepositResponseDTO.class)
                    .block(); // 동기적으로 응답 받을 때까지 대기
        } catch (WebClientResponseException e) {
            String errbody = e.getResponseBodyAsString();
            String message = errorResponseParser.extractMessage(errbody);
            return ApiResponse.fail("ERROR", message);
        } catch (Exception e) {
            return ApiResponse.fail("ERROR", "외부 API 요청 실패: " + e.getMessage());
        }

        if (body != null && body.getHeader().getResponseCode().equals("H0000")) {
            ApiResponse<UserAccountDTO> res = checkAccount(accountNo);
            int accountBalance = res.getData().getBalance();
            user.setBalance(user.getBalance() - amount);
            return ApiResponse.success(new ChargeResultDTO(user.getId(), accountBalance, user.getBalance()));
        } else {
            return ApiResponse.fail("ERROR", body != null ? body.getHeader().getResponseMessage() : "응답 없음");
        }

    }
}
