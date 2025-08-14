'use client'
import { useTheme } from '@/app/contexts/ThemeContext'
import { 
  Target, 
  Users, 
  MapPin, 
  Heart, 
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Mail,
  Github,
  Linkedin,
  Globe
} from 'lucide-react'

export default function AboutPage() {
  const { darkMode } = useTheme()

  // Theme configuration
  const theme = {
    light: {
      bg: 'bg-gradient-to-br from-emerald-50 via-white to-green-50',
      cardBg: 'bg-white/90 backdrop-blur-sm',
      border: 'border-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      accent: 'text-emerald-600',
      highlight: 'bg-emerald-50 border-emerald-200'
    },
    dark: {
      bg: 'bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900',
      cardBg: 'bg-slate-800/90 backdrop-blur-sm',
      border: 'border-slate-700',
      text: 'text-white',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      accent: 'text-emerald-400',
      highlight: 'bg-emerald-900/30 border-emerald-700'
    }
  }

  const currentTheme = darkMode ? theme.dark : theme.light

  const howItWorksSteps = [
    {
      icon: MapPin,
      title: 'Spot & Report',
      description: 'Notice a problem in your neighborhood? Use our interactive map to mark the exact location and describe the issue.',
      color: 'text-emerald-500'
    },
    {
      icon: Users,
      title: 'Community Visibility',
      description: 'Your report becomes visible to the community and local authorities, creating transparency and awareness.',
      color: 'text-green-500'
    },
    {
      icon: CheckCircle,
      title: 'Track Progress',
      description: 'Follow your report\'s status from submission to resolution. See the real impact of community participation.',
      color: 'text-teal-500'
    }
  ]

  return (
    <div className={`min-h-screen ${currentTheme.bg} py-8 sm:py-16`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-4xl sm:text-5xl font-bold ${currentTheme.text} mb-6`}>
            About FixMyStreet
          </h1>
          <p className={`text-xl ${currentTheme.textSecondary} max-w-3xl mx-auto leading-relaxed`}>
            Empowering communities to identify, report, and track local issues. 
            Together, we make our neighborhoods cleaner, safer, and better for everyone.
          </p>
        </div>

        {/* Purpose Section */}
        <section className={`${currentTheme.cardBg} rounded-2xl p-6 sm:p-8 shadow-xl ${currentTheme.border} border mb-12`}>
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-emerald-500" />
            <h2 className={`text-2xl sm:text-3xl font-bold ${currentTheme.text}`}>Our Purpose</h2>
          </div>
          
          <div className="space-y-6">
            <p className={`text-lg ${currentTheme.textSecondary} leading-relaxed`}>
              FixMyStreet was born from a simple belief: <span className={`font-semibold ${currentTheme.accent}`}>
              every community member should have a voice in improving their neighborhood</span>. 
              Too often, local issues go unreported or unnoticed until they become major problems.
            </p>
            
            <p className={`text-lg ${currentTheme.textSecondary} leading-relaxed`}>
              Our platform bridges the gap between citizens and local authorities, creating a 
              transparent system where community concerns are heard, documented, and addressed. 
              We believe that when neighbors work together, even small actions can create 
              meaningful change.
            </p>

            <div className={`${currentTheme.highlight} rounded-xl p-6 border`}>
              <div className="flex items-start gap-4">
                <Lightbulb className="w-6 h-6 text-emerald-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className={`font-semibold ${currentTheme.text} mb-2`}>Our Vision</h3>
                  <p className={`${currentTheme.textSecondary}`}>
                    A world where every community is empowered to maintain and improve their 
                    local environment through collaboration, transparency, and civic engagement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className={`${currentTheme.cardBg} rounded-2xl p-6 sm:p-8 shadow-xl ${currentTheme.border} border mb-12`}>
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-6 h-6 text-emerald-500" />
            <h2 className={`text-2xl sm:text-3xl font-bold ${currentTheme.text}`}>How It Works</h2>
          </div>

          <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className={`${currentTheme.highlight} rounded-xl p-6 border h-full`}>
                  <div className={`w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4`}>
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold ${currentTheme.text} mb-3`}>
                    {step.title}
                  </h3>
                  <p className={`${currentTheme.textSecondary} leading-relaxed`}>
                    {step.description}
                  </p>
                </div>
                
                {/* Arrow connector */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-emerald-500" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={`mt-8 p-6 ${currentTheme.highlight} rounded-xl border`}>
            <h3 className={`font-semibold ${currentTheme.text} mb-3`}>Why This Matters</h3>
            <ul className={`space-y-2 ${currentTheme.textSecondary}`}>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Creates accountability for local authorities</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Builds stronger community connections</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Provides data for better urban planning</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Encourages civic participation and pride</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Creator Section */}
        <section className={`${currentTheme.cardBg} rounded-2xl p-6 sm:p-8 shadow-xl ${currentTheme.border} border mb-12`}>
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-6 h-6 text-emerald-500" />
            <h2 className={`text-2xl sm:text-3xl font-bold ${currentTheme.text}`}>Who Created This</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className={`text-xl font-semibold ${currentTheme.text} mb-4`}>
                Built with Community in Mind
              </h3>
              <p className={`${currentTheme.textSecondary} leading-relaxed mb-4`}>
                FixMyStreet was developed by passionate community advocates who believe 
                in the power of technology to solve real-world problems. Our team combines 
                expertise in civic engagement, urban planning, and software development.
              </p>
              <p className={`${currentTheme.textSecondary} leading-relaxed mb-6`}>
                Inspired by similar initiatives worldwide, we adapted the concept to meet 
                the unique needs of our local communities, ensuring accessibility, 
                transparency, and meaningful action.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <a 
                  href="mailto:contact@fixmystreet.com" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  <Mail className="w-4 h-4" />
                  Get in Touch
                </a>
                <a 
                  href="#" 
                  className={`inline-flex items-center gap-2 px-4 py-2 ${currentTheme.cardBg} ${currentTheme.border} border rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200`}
                >
                  <Github className="w-4 h-4" />
                  <span className={currentTheme.text}>View Source</span>
                </a>
              </div>
            </div>

            <div className={`${currentTheme.highlight} rounded-xl p-6 border`}>
              <h4 className={`font-semibold ${currentTheme.text} mb-4`}>Project Values</h4>
              <ul className={`space-y-3 ${currentTheme.textSecondary}`}>
                <li className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Open & Transparent</span>
                    <p className="text-sm opacity-80">All reports are publicly visible to promote accountability</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Community-Driven</span>
                    <p className="text-sm opacity-80">Built by the community, for the community</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Impact-Focused</span>
                    <p className="text-sm opacity-80">Every feature designed to create real change</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <div className={`${currentTheme.cardBg} rounded-2xl p-8 shadow-xl ${currentTheme.border} border`}>
            <h3 className={`text-2xl font-bold ${currentTheme.text} mb-4`}>
              Ready to Make a Difference?
            </h3>
            <p className={`${currentTheme.textSecondary} mb-6 max-w-2xl mx-auto`}>
              Join thousands of community members who are already using FixMyStreet 
              to improve their neighborhoods. Your voice matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/submission" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
              >
                <MapPin className="w-5 h-5" />
                Report Your First Issue
              </a>
              <a 
                href="/reports" 
                className={`inline-flex items-center gap-2 px-6 py-3 ${currentTheme.cardBg} ${currentTheme.border} border rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200`}
              >
                <Users className="w-5 h-5" />
                <span className={currentTheme.text}>Browse Community Reports</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}