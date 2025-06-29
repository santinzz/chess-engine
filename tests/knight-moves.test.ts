import { BunContext, BunRuntime } from "@effect/platform-bun";
import { Effect } from "effect";
import { test, expect } from 'bun:test'

const program = Effect.gen(function* () {
  yield* Effect.sync(() => {
    test('Knight Moves', () => {
      
    })
  })
})

BunRuntime.runMain(program.pipe(Effect.provide(BunContext.layer)));