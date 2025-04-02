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

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LetterService {

    private final FundingRepository fundingRepository;
    private final LetterRepository letterRepository;
    private final S3UploadService s3UploadService;

    /**
     * 펀딩 편지 생성
     */

    public LettersDTO saveLetter(User user, Integer fundingId, LetterCreateDTO lettersDTO) throws AccessDeniedException{
        // 펀딩 있는지
        Funding funding = fundingRepository.findById(fundingId)
                .orElseThrow(() -> new EntityNotFoundException("펀딩을 찾을 수 없습니다."));

        Letter saveLatter = letterRepository.save(Letter.from(user, funding, lettersDTO));
        return Letter.toDTO(saveLatter);
    }

    /**
     *  펀딩 편지 삭제
     */
    public void deleteReview(Long userId, int letterId){
        // 존재하는 편지인지
        Letter letter = letterRepository.findById(letterId)
                .orElseThrow(()-> new EntityNotFoundException("편지를 찾을 수 없습니다."));

        // 본인의 편지인지
        if(!letter.getUser().getId().equals(userId)){
            throw new AccessDeniedException("편지 삭제 권한이 없습니다.");
        }

        // 편지에 등록된 이미지가 있다면 S3에서 이미지 삭제
        if(letter.getImage() != null && !letter.getImage().isEmpty()){
            List<String> imageUrl = new ArrayList<>();
            imageUrl.add(letter.getImage());
            s3UploadService.deleteFile(imageUrl);
        }

        letterRepository.deleteById(letterId);
    }

}
