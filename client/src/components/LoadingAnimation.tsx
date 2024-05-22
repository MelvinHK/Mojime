import { useEffect, useState } from "react";

export default function LoadingAnimation() {
  const frames = [
    "∙∙∙",
    "●∙∙",
    "∙●∙",
    "∙∙●",
    "∙∙∙"
  ]

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(index === frames.length - 1 ? 0 : index + 1);
    }, 100);

    return () => clearInterval(interval);
  }, [index]);


  return (
    <p className="loading">
      {frames[index]}
    </p>
  );
}