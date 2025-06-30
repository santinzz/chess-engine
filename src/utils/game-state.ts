import { Context, Ref } from 'effect'
import { initializeStartingBoard } from '../board'

export class GameState extends Context.Tag('GameState')<
  GameState,
  Ref.Ref<ReturnType<typeof initializeStartingBoard>>
>() {}
