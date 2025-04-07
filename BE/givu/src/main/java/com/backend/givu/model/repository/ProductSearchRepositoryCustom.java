package com.backend.givu.model.repository;

import com.backend.givu.model.Document.ProductDocument;

import java.util.List;

public interface ProductSearchRepositoryCustom {
    List<ProductDocument> searchProductByKeyword(String keyword);

}
