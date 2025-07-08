import { Layer } from 'effect'
import { HttpRouter, HttpServer, HttpServerResponse } from '@effect/platform'
import { BunHttpServer, BunRuntime } from '@effect/platform-bun'

const router = HttpRouter.empty.pipe(
	HttpRouter.get('/', HttpServerResponse.file('./static/index.html'))
)

const app = router.pipe(HttpServer.serve(), HttpServer.withLogAddress)

const port = 3001

const ServerLive = BunHttpServer.layer({ port })

BunRuntime.runMain(Layer.launch(Layer.provide(app, ServerLive)))
