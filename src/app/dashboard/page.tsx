/**
 * 🏛️ Enhanced NovaSanctum Dashboard Page - SolAscension Integration
 * ================================================================
 *
 * Main dashboard page integrating NovaSanctum's biological research capabilities
 * with SolAscension's solar energy and international technology features.
 *
 * This page serves as the primary interface for the unified research platform,
 * providing access to all integrated capabilities and real-time monitoring.
 */

import EnhancedNovaSanctumDashboard from '../../components/EnhancedNovaSanctumDashboard';

/**
 * Enhanced Dashboard Page Component
 *
 * Provides the main dashboard interface with SolAscension integration,
 * combining biological research and solar energy capabilities in a unified
 * platform for advanced research and international collaboration.
 */
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedNovaSanctumDashboard />
    </div>
  );
}
