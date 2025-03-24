package com.backend.givu.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class BankTransactionId implements Serializable {
    private static final long serialVersionUID = 4994610560348938087L;
    @Size(max = 255)
    @NotNull
    @Column(name = "transaction_key", nullable = false)
    private String transactionKey;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        BankTransactionId entity = (BankTransactionId) o;
        return Objects.equals(this.transactionKey, entity.transactionKey) &&
                Objects.equals(this.userId, entity.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(transactionKey, userId);
    }

}