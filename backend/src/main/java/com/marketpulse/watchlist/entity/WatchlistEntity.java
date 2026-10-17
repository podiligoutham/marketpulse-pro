package com.marketpulse.watchlist.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table("watchlist_stocks")
public class WatchlistEntity {

    @Id
    private Long id;

    @Column("symbol")
    private String symbol;

    @Column("company_name")
    private String companyName;

    @Column("created_at")
    private OffsetDateTime createdAt;
}