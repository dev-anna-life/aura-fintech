import React, { useState, useEffect, useRef } from 'react'

export default function AnimatedCounter({ value = 0, duration = 1100 }) {
  const [displayValue, setDisplayValue] = useState(0)
  const prevValueRef = useRef(0)

  useEffect(() => {
    const startValue = prevValueRef.current
    const targetValue = Number(value) || 0
    prevValueRef.current = targetValue

    let startTime = null
    let animationFrameId

    function animate(currentTime) {
      if (!startTime) startTime = currentTime
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (targetValue - startValue) * easeOut

      setDisplayValue(current)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        setDisplayValue(targetValue)
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [value, duration])

  return (
    <span>
      ${displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  )
}
