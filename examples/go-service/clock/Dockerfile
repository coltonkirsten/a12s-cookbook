# Build the clock, then copy it and its manifest into a small image. Run `go mod tidy` first: it writes go.sum.
FROM golang:1.26 AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -o /out/clock .

FROM alpine:3
COPY --from=build /out/clock /usr/local/bin/clock
COPY service.json /a12s/service.json
USER 1000:1000
CMD ["/usr/local/bin/clock"]
