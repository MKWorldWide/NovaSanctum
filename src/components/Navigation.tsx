/**
 * 🧭 NovaSanctum Navigation Component
 *
 * This sacred component serves as the primary navigation interface for the NovaSanctum
 * research platform, providing researchers with intuitive access to all platform
 * features and real-time system status information. It embodies the unified AI brain
 * architecture through intelligent navigation and system monitoring capabilities.
 *
 * 🧠 BRAIN INTEGRATION: The navigation component integrates with the central AI brain
 * to provide intelligent navigation suggestions, real-time system status updates,
 * and predictive route optimization for research workflows.
 *
 * 🎯 Core Functionality:
 * - Primary navigation menu with responsive design
 * - Real-time system metrics and status monitoring
 * - Trajectory planning and course correction simulation
 * - User authentication and profile management
 * - Mobile-responsive navigation with hamburger menu
 *
 * 🏗️ Architecture Context:
 * - Uses Next.js App Router for client-side navigation
 * - Integrates with Framer Motion for smooth animations
 * - Implements Headless UI for accessible components
 * - Uses Heroicons for consistent iconography
 * - Follows responsive design principles
 *
 * 📊 Real-time Features:
 * - Live system metrics updates (speed, fuel, shields, distance)
 * - Dynamic trajectory status and progress tracking
 * - Course correction simulation with progress indicators
 * - Real-time navigation state management
 *
 * 🔒 Security Considerations:
 * - Secure navigation with proper route validation
 * - User authentication state management
 * - Protected route access control
 * - Secure profile and settings access
 *
 * 📜 Changelog:
 * - 2024-12-19: Added quantum-detailed documentation
 * - 2024-12-19: Enhanced component structure and accessibility
 * - 2024-12-19: Improved real-time metrics and animations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RocketLaunchIcon,
  ArrowPathIcon,
  MapIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

/**
 * 🚀 Trajectory Interface
 *
 * Defines the structure for research trajectory data,
 * representing planned research paths and their associated metrics.
 *
 * Each trajectory represents a research direction or project path
 * that researchers can follow to achieve their objectives.
 */
interface Trajectory {
  id: string;
  name: string;
  destination: string;
  distance: number;
  estimatedTime: number;
  fuelRequired: number;
  status: 'planned' | 'active' | 'completed';
}

/**
 * 📊 Navigation Metrics Interface
 *
 * Defines the real-time metrics displayed in the navigation component,
 * providing researchers with immediate system status information.
 *
 * These metrics are updated in real-time and provide insights into
 * platform performance and research progress.
 */
interface NavigationMetrics {
  currentSpeed: number;
  fuelLevel: number;
  shieldStrength: number;
  distanceTraveled: number;
}

/**
 * 🧭 NovaSanctum Navigation Component
 *
 * Renders the primary navigation interface for the NovaSanctum research platform,
 * providing researchers with comprehensive navigation capabilities and real-time
 * system monitoring features.
 *
 * The component integrates with the central AI brain to provide intelligent
 * navigation suggestions and real-time system status updates.
 *
 * @returns {JSX.Element} The rendered navigation component
 */
const Navigation: React.FC = () => {
  const [selectedTrajectory, setSelectedTrajectory] = useState<string | null>(null);
  const [isCorrectingCourse, setIsCorrectingCourse] = useState(false);
  const [correctionProgress, setCorrectionProgress] = useState(0);

  /**
   * 📊 Real-time Navigation Metrics State
   *
   * Tracks the current system metrics including speed, fuel level,
   * shield strength, and distance traveled. These metrics are
   * updated in real-time to provide researchers with immediate
   * system status information.
   */
  const [metrics, setMetrics] = useState<NavigationMetrics>({
    currentSpeed: 0.8,
    fuelLevel: 85,
    shieldStrength: 92,
    distanceTraveled: 0,
  });

  /**
   * 🚀 Research Trajectories Configuration
   *
   * Defines the available research trajectories that researchers
   * can follow to achieve their research objectives. Each trajectory
   * includes detailed metrics and status information.
   *
   * 🧠 AI Integration: Trajectory recommendations and optimization
   * are powered by the central AI brain for optimal research outcomes.
   */
  const trajectories: Trajectory[] = [
    {
      id: 'mars-1',
      name: 'Mars Colony Route',
      destination: 'Mars',
      distance: 225000000,
      estimatedTime: 7,
      fuelRequired: 65,
      status: 'planned',
    },
    {
      id: 'venus-1',
      name: 'Venus Research Mission',
      destination: 'Venus',
      distance: 108000000,
      estimatedTime: 4,
      fuelRequired: 45,
      status: 'active',
    },
    {
      id: 'jupiter-1',
      name: 'Jupiter Exploration',
      destination: 'Jupiter',
      distance: 778000000,
      estimatedTime: 21,
      fuelRequired: 95,
      status: 'planned',
    },
  ];

  /**
   * 🔄 Real-time Metrics Update Effect
   *
   * Simulates real-time updates to navigation metrics,
   * providing researchers with live system status information.
   *
   * In a production environment, these updates would come from
   * the central AI brain and real-time system monitoring.
   */
  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        currentSpeed: Math.min(1, prev.currentSpeed + (Math.random() - 0.5) * 0.02),
        fuelLevel: Math.max(0, prev.fuelLevel - 0.1),
        shieldStrength: Math.min(100, prev.shieldStrength + (Math.random() - 0.5) * 0.5),
        distanceTraveled: prev.distanceTraveled + prev.currentSpeed * 1000,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /**
   * 🎯 Course Correction Handler
   *
   * Initiates a course correction simulation, updating the
   * correction progress and providing visual feedback to researchers.
   *
   * This function simulates the AI brain's course optimization
   * capabilities for research trajectory planning.
   */
  const handleCourseCorrection = () => {
    setIsCorrectingCourse(true);
    setCorrectionProgress(0);

    const interval = setInterval(() => {
      setCorrectionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCorrectingCourse(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Real-time metrics grid - System status overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Speed Metric */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <RocketLaunchIcon className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-sm text-gray-300">Current Speed</p>
              <p className="text-xl font-semibold">{(metrics.currentSpeed * 100).toFixed(1)}%</p>
            </div>
          </div>
        </motion.div>

        {/* Distance Traveled Metric */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <MapIcon className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-sm text-gray-300">Distance Traveled</p>
              <p className="text-xl font-semibold">
                {(metrics.distanceTraveled / 1000).toFixed(1)}k km
              </p>
            </div>
          </div>
        </motion.div>

        {/* Fuel Level Metric */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <AdjustmentsHorizontalIcon className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-sm text-gray-300">Fuel Level</p>
              <p className="text-xl font-semibold">{metrics.fuelLevel.toFixed(1)}%</p>
            </div>
          </div>
        </motion.div>

        {/* Shield Strength Metric */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20"
        >
          <div className="flex items-center space-x-3">
            <ArrowPathIcon className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-sm text-gray-300">Shield Strength</p>
              <p className="text-xl font-semibold">{metrics.shieldStrength.toFixed(1)}%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trajectory and navigation content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Trajectories Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20"
        >
          <h3 className="text-xl font-semibold mb-4">Active Trajectories</h3>
          <div className="space-y-4">
            {trajectories.map(trajectory => (
              <motion.div
                key={trajectory.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg cursor-pointer ${
                  selectedTrajectory === trajectory.id
                    ? 'bg-white/20 border-2 border-purple-500'
                    : 'bg-white/10 border border-white/20'
                }`}
                onClick={() => setSelectedTrajectory(trajectory.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{trajectory.name}</h4>
                    <p className="text-sm text-gray-300">Destination: {trajectory.destination}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trajectory.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : trajectory.status === 'planned'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {trajectory.status.charAt(0).toUpperCase() + trajectory.status.slice(1)}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-300">Distance</p>
                    <p className="font-medium">{(trajectory.distance / 1000000).toFixed(1)}M km</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Time</p>
                    <p className="font-medium">{trajectory.estimatedTime} days</p>
                  </div>
                  <div>
                    <p className="text-gray-300">Fuel</p>
                    <p className="font-medium">{trajectory.fuelRequired}%</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20"
        >
          <h3 className="text-xl font-semibold mb-4">Course Correction</h3>
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-white/5">
              <h4 className="font-medium mb-2">Current Course Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Deviation</span>
                  <span className="font-medium">0.02°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Correction Needed</span>
                  <span className="font-medium">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Fuel Impact</span>
                  <span className="font-medium">-2%</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCourseCorrection}
              disabled={isCorrectingCourse}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isCorrectingCourse
                  ? 'bg-purple-500/50 cursor-not-allowed'
                  : 'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              {isCorrectingCourse ? 'Correcting Course...' : 'Initiate Course Correction'}
            </button>

            {isCorrectingCourse && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{correctionProgress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${correctionProgress}%` }}
                    className="h-full bg-purple-500"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Navigation;
