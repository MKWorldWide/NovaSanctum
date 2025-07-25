'use client'

import { useCallback } from 'react'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'

export const ParticlesProvider = ({ children }: { children: React.ReactNode }) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  return (
    <div className="relative min-h-screen">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: 'transparent',
            },
          },
          fpsLimit: 120,
          particles: {
            color: {
              value: ['#00FF9D', '#00FFFF', '#1A1A1A'],
            },
            links: {
              color: '#00FF9D',
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
              triangles: {
                enable: true,
                opacity: 0.1
              }
            },
            move: {
              enable: true,
              outModes: {
                default: 'bounce',
                bottom: 'bounce',
                left: 'bounce',
                right: 'bounce',
                top: 'bounce'
              },
              random: true,
              speed: 0.8,
              straight: false,
              attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
              }
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
            },
            opacity: {
              value: 0.3,
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
                sync: false
              }
            },
            shape: {
              type: ['circle', 'triangle'],
            },
            size: {
              value: { min: 1, max: 3 },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.1,
                sync: false
              }
            },
            life: {
              count: 1,
              duration: {
                value: 1
              }
            },
            rotate: {
              value: {
                min: 0,
                max: 360
              },
              direction: 'random',
              animation: {
                enable: true,
                speed: 5
              }
            }
          },
          detectRetina: true,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: 'repulse'
              },
              onClick: {
                enable: true,
                mode: 'push'
              }
            },
            modes: {
              repulse: {
                distance: 100,
                duration: 0.4
              },
              push: {
                quantity: 4
              }
            }
          }
        }}
        className="absolute inset-0 -z-10"
      />
      {children}
    </div>
  )
} 