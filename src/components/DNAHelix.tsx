'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface DNAHelixProps {
  className?: string
  speed?: number
  size?: number
}

export const DNAHelix = ({ className = '', speed = 2, size = 100 }: DNAHelixProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const basePairs = 10
  const spacing = size / basePairs
  const radius = size / 4

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {isVisible && Array.from({ length: basePairs }).map((_, i) => {
        const angle = (i * Math.PI * 2) / basePairs
        const y = i * spacing - size / 2

        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: "easeOut"
            }}
          >
            <motion.div
              className="absolute w-2 h-2 rounded-full bg-emerald-500"
              style={{
                x: Math.cos(angle) * radius,
                y: y,
                filter: 'blur(1px)',
                boxShadow: '0 0 10px #00FF9D'
              }}
              animate={{
                x: [
                  Math.cos(angle) * radius,
                  Math.cos(angle + Math.PI) * radius,
                  Math.cos(angle) * radius
                ],
                y: [y, y + spacing / 2, y],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: speed,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute w-2 h-2 rounded-full bg-cyan-500"
              style={{
                x: Math.cos(angle + Math.PI) * radius,
                y: y,
                filter: 'blur(1px)',
                boxShadow: '0 0 10px #00FFFF'
              }}
              animate={{
                x: [
                  Math.cos(angle + Math.PI) * radius,
                  Math.cos(angle) * radius,
                  Math.cos(angle + Math.PI) * radius
                ],
                y: [y, y + spacing / 2, y],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: speed,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        )
      })}
    </div>
  )
} 