package com.backend.givu.model.repository;

import com.backend.givu.model.Document.FundingDocument;

import java.util.List;

public interface FundingSearchRepositoryCustom {
    List<FundingDocument> searchFundingByKeyword(String keyword);
}
