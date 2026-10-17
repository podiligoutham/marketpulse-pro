package com.marketpulse.stocks.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableConfigurationProperties(FinnhubProperties.class)
public class FinnhubConfig {

  @Bean("finnhubWebClient")
  public WebClient finnhubWebClient(
      WebClient.Builder builder,
      FinnhubProperties properties
  ) {

    int timeoutMillis = Math.toIntExact(
        properties.timeout().toMillis()
    );

    HttpClient httpClient = HttpClient.create()
        .option(
            ChannelOption.CONNECT_TIMEOUT_MILLIS,
            timeoutMillis
        )
        .doOnConnected(connection ->
            connection.addHandlerLast(
                new ReadTimeoutHandler(
                    timeoutMillis,
                    TimeUnit.MILLISECONDS
                )
            )
        );

    return builder
        .baseUrl(properties.baseUrl())
        .defaultHeader(
            "X-Finnhub-Token",
            properties.apiKey()
        )
        .clientConnector(
            new ReactorClientHttpConnector(httpClient)
        )
        .build();
  }
}
