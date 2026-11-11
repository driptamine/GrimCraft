# GrimCraft

```sh
npm install
npm run dev
```

Multiplayer uses the adjacent `../grimcraft-go` server. In a second terminal:

```sh
cd ../grimcraft-go
go run ./cmd/server
```

Open Multiplayer at `http://localhost:3000`, create a game and choose a map.
Share `/server/<id>` with another browser or incognito window, or add Computer
slots before starting. The UI discovers the local WebTransport endpoint and
certificate automatically.

The backend runs entirely in Go, including its authoritative simulation.
Node.js is used for frontend development and builds only.
Go manages map state, movement, ranged and melee combat, construction,
production, research, resources and reinforcement.

Settings and the in-game lighting controls switch Classic/DE lighting and
model-shaped shadows without restarting the match. Infantry model switches
select the classic or new Guardsman and Space Marine assets. The loader repairs
transparency and Guardsman animation timing in older hosted copies.

```sh
npm run build
npm test
npm run test:ts
```
