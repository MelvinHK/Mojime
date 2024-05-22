import useIsMobile from "../utils/hooks/useIsMobile";

export default function Home() {

  return (
    <>
      <p id="greeting">
        {homeKaomojis[Math.floor(Math.random() * homeKaomojis.length)]}
      </p>
    </>
  )
}

const homeKaomojis: string[] = [
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