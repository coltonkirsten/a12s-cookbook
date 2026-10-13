// clock sends an agent computer a tick on a schedule. Its config (fleet.yaml, services.clock.config) says to whom and
// how often.
package main

import (
	"log"
	"net/http"
	"time"

	"github.com/coltonkirsten/a12s/services/svckit"
)

type config struct {
	To    string `json:"to"`
	Every string `json:"every"`
}

func main() {
	var cfg config
	if err := svckit.LoadConfig(&cfg); err != nil { // reads /run/a12s/config/config.json
		log.Fatal(err)
	}
	every, err := svckit.ParseDuration(cfg.Every) // 90s, 15m, 1h, 7d
	if err != nil {
		log.Fatal(err)
	}
	if every <= 0 {
		log.Fatalf("every is %q: it must be more than 0", cfg.Every)
	}
	c, err := svckit.NewClient() // mTLS client from A12S_API and /run/a12s/tls
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	svckit.Health(mux) // GET /healthz, the health check in service.json
	go func() { log.Fatal(http.ListenAndServe(":8080", mux)) }()

	for range time.Tick(every) {
		// ReplaceKey: a tick still waiting in the inbox is replaced by the new one, so ticks don't pile up.
		msg, status, err := c.Send(cfg.To, svckit.Enqueue{Body: "tick: run date and say hello", Sender: "clock", ReplaceKey: "tick"})
		if err != nil {
			log.Printf("send: %d %v", status, err) // a 403 no_grant names the grant that is missing
			continue
		}
		log.Printf("sent %s (%s)", msg.ID, msg.State)
	}
}
