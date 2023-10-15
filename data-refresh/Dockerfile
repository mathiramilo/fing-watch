FROM rust as builder 

WORKDIR /app

COPY . .

RUN cargo build --release

FROM debian:latest

WORKDIR /app

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y libssl-dev \
    && apt-get install -y ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY /schema ./schema
COPY --from=builder /app/target/release/data-refresh ./data-refresh

CMD ["./data-refresh"]
