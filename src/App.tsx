import { useState } from "react"
import { BiCircle, BiX } from "react-icons/bi"

const TicTacMap = {
  X: 1,
  O: 0,
} as const

type TicTacMap = (typeof TicTacMap)[keyof typeof TicTacMap]

const App = () => {
  const [grid, setGrid] = useState<(TicTacMap | null)[]>(Array(9).fill(null))
  const [winner, setWinner] = useState<TicTacMap | null | undefined>(null)

  const winLines = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [2, 4, 6],
    [2, 5, 8],
    [1, 4, 7],
    [3, 4, 5],
    [6, 7, 8],
  ]

  const restart = () => {
    setGrid(Array(9).fill(null))
    setWinner(null)
  }

  const renderIcon = (value: TicTacMap | null) => {
    switch (value) {
      case TicTacMap.X:
        return <BiX />
      case TicTacMap.O:
        return <BiCircle />
      default:
        return null
    }
  }

  const getWinner = (...values: (TicTacMap | null)[]) => {
    if (values.every((v) => v === TicTacMap.X)) return TicTacMap.X
    if (values.every((v) => v === TicTacMap.O)) return TicTacMap.O

    return null
  }

  const renderWinner = () => {
    switch (winner) {
      case TicTacMap.X:
        return "Вы победили!"
      case TicTacMap.O:
        return "Компьютер победил!"
      case undefined:
        return "Ничья"
      default:
        return null
    }
  }

  const clickHandler = (currValue: TicTacMap | null, idx: number) => {
    if (currValue !== null) return

    setGrid((state) => {
      let newState = state.map((value, i) => {
        if (i === idx) {
          return TicTacMap.X
        }

        return value
      })

      for (const pos of winLines) {
        const winner = getWinner(
          newState[pos[0]],
          newState[pos[1]],
          newState[pos[2]]
        )

        if (winner !== null) {
          setWinner(winner)
          return newState
        }
      }

      if (newState.every((value) => value !== null)) {
        setWinner(undefined)

        return newState
      }

      let computerStepIdx = Math.floor(Math.random() * newState.length)

      while (newState[computerStepIdx] !== null) {
        computerStepIdx = Math.floor(Math.random() * newState.length)
      }

      newState = newState.map((value, i) => {
        if (i === computerStepIdx) return TicTacMap.O

        return value
      })

      for (const pos of winLines) {
        const winner = getWinner(
          newState[pos[0]],
          newState[pos[1]],
          newState[pos[2]]
        )

        if (winner !== null) {
          setWinner(winner)
          return newState
        }
      }

      return newState
    })
  }

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col items-center justify-center gap-7">
      <h1 className="text-3xl text-center">Игра: Крестики-нолики</h1>
      <div className="grid grid-cols-3 grid-rows-3 gap-5">
        {grid.map((value, idx) => (
          <button
            key={idx}
            onClick={() => clickHandler(value, idx)}
            className="w-[8rem] h-[8rem] border-2 border-slate-100 border-solid rounded-xl flex items-center justify-center text-5xl"
            disabled={winner !== null || winner === undefined}
          >
            {renderIcon(value)}
          </button>
        ))}
      </div>
      <footer className="flex flex-col items-center justify-center gap-6">
        {winner !== null ? (
          <p className="text-3xl text-center">{renderWinner()}</p>
        ) : null}
        <button
          className="bg-slate-100 hover:bg-slate-300 disabled:cursor-not-allowed disabled:bg-slate-300 text-slate-900 rounded-md p-3"
          disabled={grid.every((v) => v === null)}
          onClick={restart}
        >
          Начать заново
        </button>
      </footer>
    </div>
  )
}

export default App
