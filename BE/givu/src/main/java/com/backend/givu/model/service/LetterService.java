package com.backend.givu.model.service;

import com.backend.givu.model.entity.Funding;
import com.backend.givu.model.entity.Letter;
import com.backend.givu.model.entity.User;
import com.backend.givu.model.repository.FundingRepository;
import com.backend.givu.model.repository.LetterRepository;
import com.backend.givu.model.requestDTO.LetterCreateDTO;
import com.backend.givu.model.responseDTO.LettersDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LetterService {

    private final FundingRepository fundingRepository;
    private final LetterRepository letterRepository;

    public LettersDTO saveLetter(User user, Integer fundingId, LetterCreateDTO lettersDTO) throws AccessDeniedException{
        // 펀딩 있는지
        Funding funding = fundingRepository.findById(fundingId)
                .orElseThrow(() -> new EntityNotFoundException("펀딩을 찾을 수 없습니다."));

        Letter saveLatter = letterRepository.save(Letter.from(user, funding, lettersDTO));
        return Letter.toDTO(saveLatter);
    }

}
