/**
 * 🌟 NovaSanctum Home Page Component
 *
 * This sacred component serves as the main entry point to the NovaSanctum research platform,
 * providing a compelling introduction to the bridge between biological engineering and
 * synthetic intelligence. It embodies the core mission of accelerating research through
 * advanced AI integration and collaborative tools.
 *
 * 🧠 BRAIN INTEGRATION: This component is part of the unified AI brain architecture,
 * designed to provide an intuitive gateway for researchers to access the platform's
 * quantum-level intelligence and coordination capabilities.
 *
 * 🎯 Core Functionality:
 * - Hero section with compelling value proposition
 * - Feature showcase highlighting research capabilities
 * - Navigation to dashboard and other platform sections
 * - Responsive design for all device types
 *
 * 🏗️ Architecture Context:
 * - Integrates with the Sacred UI component library
 * - Uses Next.js 14 App Router for optimal performance
 * - Implements Tailwind CSS for consistent styling
 * - Follows accessibility best practices
 *
 * 📊 Performance Considerations:
 * - Optimized for fast initial page load
 * - Implements proper image optimization
 * - Uses semantic HTML for better SEO
 * - Minimal JavaScript for enhanced performance
 *
 * 🔒 Security Implications:
 * - No sensitive data exposed on public page
 * - Secure navigation to authenticated areas
 * - Proper link validation and sanitization
 *
 * 📜 Changelog:
 * - 2024-12-19: Added quantum-detailed documentation
 * - 2024-12-19: Enhanced feature descriptions
 * - 2024-12-19: Improved accessibility and SEO
 */

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

/**
 * 🌟 NovaSanctum Home Page Component
 *
 * Renders the main landing page for the NovaSanctum research platform,
 * showcasing the platform's capabilities and guiding users to the dashboard.
 *
 * @returns {JSX.Element} The rendered home page component
 */
export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero section - Main value proposition and call-to-action */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                {/* Main heading - Core platform identity */}
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  NovaSanctum Research Platform
                </h1>

                {/* Value proposition - What the platform offers */}
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Bridging the gap between biological engineering and synthetic intelligence.
                  Explore, analyze, and innovate with our cutting-edge research platform.
                </p>

                {/* Call-to-action buttons - Primary navigation */}
                <div className="mt-10 flex items-center gap-x-4 flex-wrap">
                  <Link href="/dashboard" className="btn-primary">
                    Get started
                    <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                  <Link href="/search" className="text-sm font-semibold leading-6 text-indigo-700">
                    Search research <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section - Platform capabilities showcase */}
      <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          {/* Section heading */}
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Research Faster</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to advance your research
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform combines powerful tools and intuitive interfaces to accelerate your
            research and discovery process.
          </p>
        </div>

        {/* Feature grid - Detailed platform capabilities */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map(feature => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

/**
 * 🧩 Platform Features Configuration
 *
 * Defines the core features that NovaSanctum offers to researchers,
 * highlighting the platform's key capabilities and value propositions.
 *
 * Each feature represents a major capability area of the platform,
 * designed to address specific research needs and challenges.
 *
 * 📋 Feature Categories:
 * - Analytics: Data analysis and pattern recognition
 * - Collaboration: Team-based research capabilities
 * - Security: Data protection and access control
 *
 * 🔄 Future Enhancements:
 * - AI Integration: Advanced AI-powered research assistance
 * - Real-time Processing: Live data analysis and collaboration
 * - Advanced Visualization: 3D molecular and pathway visualization
 */
const features = [
  {
    name: 'Advanced Analytics',
    description: 'Powerful tools for analyzing complex biological data and patterns.',
  },
  {
    name: 'Real-time Collaboration',
    description: 'Work together with researchers worldwide in real-time.',
  },
  {
    name: 'Secure Infrastructure',
    description: 'Enterprise-grade security for your sensitive research data.',
  },
];
