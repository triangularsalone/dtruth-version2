"use client"

import { useEffect, useState } from "react"

const phrases = [
  "Truth that inspires innovation",
  "Innovation that transforms communities",
  "Solutions with Precision",
  "Technology serving humanity",
]

export default function HeroText() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let fadeTimeout: ReturnType<typeof setTimeout>
    const interval = setInterval(() => {
      setVisible(false)
      fadeTimeout = setTimeout(() => {
        setIndex((current) => (current + 1) % phrases.length)
        setVisible(true)
      }, 700)
    }, 12000)

    return () => {
      clearInterval(interval)
      clearTimeout(fadeTimeout)
    }
  }, [])

  return (
    <span
      className={`inline-block text-4xl md:text-6xl font-bold text-white leading-tight transition-opacity duration-700 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {phrases[index]}
    </span>
  )
}
