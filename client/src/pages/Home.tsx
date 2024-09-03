import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

export default function Home() {

  useEffect(() => {
    document.title = `Mojime`
  }, [])

  const kaomoji = useMemo(() =>
    kaomojis[Math.floor(Math.random() * kaomojis.length)], []
  );

  return (
    <>
      <p id="greeting">
        {kaomoji}
      </p>
      <div className="flex gap">
        <a href="https://github.com/MelvinHK/Mojime/" target="_blank">GitHub</a>
        <Link to="/privacy">Privacy</Link>
      </div>
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