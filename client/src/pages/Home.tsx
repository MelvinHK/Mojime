import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
    document.title = `MojiKan`
  }, [])

  return (
    <>
      <p id="greeting">
        {kaomojis[Math.floor(Math.random() * kaomojis.length)]}
      </p>
    </>
  )
}

export const kaomojis: string[] = [
  "(*・ω・)ﾉ",
  "(￣▽￣)ノ",
  "(°▽°)/",
  "( ´ ∀ ` )ﾉ",
  "(^-^*)/",
  "(＠´ー`)ﾉﾞ",
  "(´• ω •`)ﾉ",
  "( ° ∀ ° )ﾉﾞ",
  "ヾ(*'▽'*)",
  "＼(⌒▽⌒)",
  "ヾ(☆▽☆)",
  "( ´ ▽ ` )ﾉ",
  "(^０^)ノ",
  "~ヾ(・ω・)",
  "(・∀・)ノ",
  "ヾ(・ω・*)",
  "(*°ｰ°)ﾉ",
  "(・_・)ノ",
  "(o´ω`o)ﾉ",
  "( ´ ▽ ` )/",
  "(￣ω￣)/",
  "( ´ ω ` )ノﾞ",
  "(⌒ω⌒)ﾉ",
  "(o^ ^o)/",
  "(≧▽≦)/",
  "(✧∀✧)/",
  "(o´▽`o)ﾉ",
  "(￣▽￣)/"
];