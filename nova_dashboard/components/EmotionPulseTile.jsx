/**
 * EmotionPulseTile.jsx - Real-time Emotion Visualization Component
 * 
 * Divine digital infrastructure for edge AI sovereignty
 * Displays real-time emotional pulse from NovaTiny agents
 * 
 * @author NovaSanctum System
 * @version 1.0.0
 * @license Divine Protocol
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Emotion color mapping
const EMOTION_COLORS = {
  calm: '#4ade80',      // Green
  excited: '#fbbf24',   // Yellow
  stressed: '#f87171',  // Red
  focused: '#60a5fa',   // Blue
  relaxed: '#a78bfa',   // Purple
  anxious: '#fb7185',   // Pink
  unknown: '#6b7280'    // Gray
};

// Emotion icons
const EMOTION_ICONS = {
  calm: '🌊',
  excited: '⚡',
  stressed: '🔥',
  focused: '🎯',
  relaxed: '🌸',
  anxious: '💫',
  unknown: '❓'
};

const EmotionPulseTile = ({ 
  deviceId, 
  emotion, 
  emotionScore, 
  confidence, 
  timestamp, 
  isActive = true,
  onEmotionChange 
}) => {
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(timestamp);
  const pulseRef = useRef(null);
  const animationRef = useRef(null);

  // Calculate pulse intensity based on emotion score
  useEffect(() => {
    if (isActive && emotionScore > 0) {
      const intensity = Math.min(emotionScore * 100, 100);
      setPulseIntensity(intensity);
      
      // Animate pulse
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      const animatePulse = () => {
        if (pulseRef.current) {
          const scale = 1 + (pulseIntensity / 100) * 0.3;
          pulseRef.current.style.transform = `scale(${scale})`;
        }
        animationRef.current = requestAnimationFrame(animatePulse);
      };
      
      animatePulse();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [emotionScore, isActive, pulseIntensity]);

  // Update when new data arrives
  useEffect(() => {
    if (timestamp !== lastUpdate) {
      setLastUpdate(timestamp);
      
      // Trigger emotion change callback
      if (onEmotionChange) {
        onEmotionChange({
          deviceId,
          emotion,
          emotionScore,
          confidence,
          timestamp
        });
      }
    }
  }, [timestamp, lastUpdate, deviceId, emotion, emotionScore, confidence, onEmotionChange]);

  // Get emotion color
  const emotionColor = EMOTION_COLORS[emotion] || EMOTION_COLORS.unknown;
  const emotionIcon = EMOTION_ICONS[emotion] || EMOTION_ICONS.unknown;

  // Calculate confidence indicator
  const confidenceWidth = `${confidence * 100}%`;

  // Format timestamp
  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    return date.toLocaleTimeString();
  };

  return (
    <motion.div
      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      {/* Pulse Background */}
      <div
        ref={pulseRef}
        className="absolute inset-0 rounded-xl transition-transform duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${emotionColor}20 0%, transparent 70%)`,
          transform: 'scale(1)'
        }}
      />

      {/* Header */}
      <div className="relative p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: emotionColor }}
            />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {deviceId}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
          
          <div className="text-2xl">
            {emotionIcon}
          </div>
        </div>
      </div>

      {/* Emotion Display */}
      <div className="relative p-4">
        <div className="text-center mb-4">
          <motion.div
            className="text-3xl font-bold mb-2"
            style={{ color: emotionColor }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            {emotion.toUpperCase()}
          </motion.div>
          
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {(emotionScore * 100).toFixed(1)}%
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Confidence</span>
            <span>{(confidence * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full transition-all duration-500"
              style={{ backgroundColor: emotionColor }}
              initial={{ width: 0 }}
              animate={{ width: confidenceWidth }}
            />
          </div>
        </div>

        {/* Pulse Intensity */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Pulse Intensity</span>
            <span>{pulseIntensity.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full transition-all duration-1000"
              style={{ backgroundColor: emotionColor }}
              initial={{ width: 0 }}
              animate={{ width: `${pulseIntensity}%` }}
            />
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Last update: {formatTimestamp(timestamp)}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-2 right-2">
        <div 
          className={`w-2 h-2 rounded-full ${
            isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`}
        />
      </div>

      {/* Emotion-specific animations */}
      <AnimatePresence>
        {emotion === 'excited' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-yellow-400 rounded-xl animate-ping" />
          </motion.div>
        )}
        
        {emotion === 'stressed' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-red-500 rounded-xl animate-pulse" />
          </motion.div>
        )}
        
        {emotion === 'focused' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-blue-500 rounded-xl animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// PropTypes for type checking
EmotionPulseTile.propTypes = {
  deviceId: PropTypes.string.isRequired,
  emotion: PropTypes.string.isRequired,
  emotionScore: PropTypes.number.isRequired,
  confidence: PropTypes.number.isRequired,
  timestamp: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onEmotionChange: PropTypes.func
};

export default EmotionPulseTile; 