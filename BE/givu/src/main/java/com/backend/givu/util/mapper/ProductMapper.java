package com.backend.givu.util.mapper;

import com.backend.givu.model.Document.ProductDocument;
import com.backend.givu.model.entity.Product;
import com.backend.givu.util.DateTimeUtil;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class ProductMapper {

    public static ProductDocument toDocument(Product product) {
        DateTimeFormatter formatter = DateTimeFormatter.ISO_INSTANT;

        String isoDate = product.getCreatedAt()
                .atZone(ZoneId.systemDefault()) // Instant → ZonedDateTime
                .toInstant()                    // → Instant
                .toString();                    // ISO-8601 형식 문자열

        return new ProductDocument(
                product.getId(),
                product.getProductName(),
                product.getPrice(),
                product.getImage(),
                product.getFavorite(),
                product.getStar(),
                product.getDescription(),
                isoDate,                        // 👈 ISO 형식 문자열
                product.getCategory()
        );
    }

}
