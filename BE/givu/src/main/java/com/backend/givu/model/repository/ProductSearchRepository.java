package com.backend.givu.model.repository;

import com.backend.givu.model.Document.ProductDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductSearchRepository extends ElasticsearchRepository<ProductDocument, Integer>, ProductSearchRepositoryCustom {

}
