'use client'
import { useEffect, useRef, useState } from 'react'
import { load } from '@2gis/mapgl'
import Link from 'next/link'
import { useTheme } from '@/app/contexts/ThemeContext'
import { 
  MapPin, 
  Send, 
  Eye, 
  CheckCircle,
  ArrowRight,
  Users,
  Shield,
  Zap
} from 'lucide-react'

interface Report {
  _id: string
  name: string
  email: string
  text: string
  coords: [number, number]
  createdAt: string
}

export default function LandingPage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const [reports, setReports] = useState<Report[]>([])
  const { darkMode } = useTheme()

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/data')
      const data = await response.json()
      setReports(data.slice(0, 10)) // Only show first 10 for preview
    } catch (err) {
      console.error('Failed to fetch reports:', err)
    }
  }

  // Initialize preview map
  useEffect(() => {
    const initPreviewMap = async () => {
      const mapglAPI = await load()

      if (mapContainerRef.current) {
        mapRef.current = new mapglAPI.Map(mapContainerRef.current, {
          center: [71.449074, 51.169392],
          zoom: 12,
          key: '031463b1-9009-4d29-960e-d8b084fbfb2f',
        })

        // Disable interactions for preview
        // mapRef.current.setZoomControl(false)
        // mapRef.current.setRotateControl(false)
      }
    }

    initPreviewMap()
    fetchReports()

    return () => {
      if (mapRef.current) mapRef.current.destroy()
    }
  }, [])

  // Add markers when reports load
  useEffect(() => {
    const addPreviewMarkers = async () => {
      if (!mapRef.current || reports.length === 0) return

      const mapglAPI = await load()

      reports.forEach(report => {
        new mapglAPI.Marker(mapRef.current, {
          coordinates: report.coords
        })
      })
    }

    addPreviewMarkers()
  }, [reports])

  const theme = {
    light: {
      bg: 'bg-gradient-to-br from-emerald-50 via-white to-green-50',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      heroOverlay: 'bg-gradient-to-r from-emerald-600/10 to-green-600/10',
      heroTitle: 'bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-800 bg-clip-text text-transparent',
      cardBg: 'bg-white/80 backdrop-blur-sm border-gray-200/50',
      cardHover: 'hover:bg-white/90 hover:border-gray-300/50',
      sectionBg: 'bg-gradient-to-b from-gray-50/80 to-white/80',
      statsBg: 'bg-gradient-to-r from-emerald-100/50 to-green-100/50',
      footerBg: 'bg-gray-100/80 border-gray-200/50',
      footerText: 'text-gray-500',
      button: 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/25 hover:shadow-emerald-500/40',
      buttonSecondary: 'bg-white/90 backdrop-blur-sm text-gray-700 border-gray-200/50 hover:bg-white',
      trustBadge: 'bg-white/80 backdrop-blur-sm border-gray-200/30',
      mapOverlay: 'bg-white/90 backdrop-blur-sm border-gray-200/30'
    },
    dark: {
      bg: 'bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900',
      text: 'text-white',
      textSecondary: 'text-slate-300',
      heroOverlay: 'bg-gradient-to-r from-emerald-600/20 to-green-600/20',
      heroTitle: 'bg-gradient-to-r from-white via-emerald-100 to-green-200 bg-clip-text text-transparent',
      cardBg: 'bg-white/10 backdrop-blur-sm border-white/10',
      cardHover: 'hover:bg-white/20 hover:border-white/20',
      sectionBg: 'bg-gradient-to-b from-slate-900/50 to-slate-800/50',
      statsBg: 'bg-gradient-to-r from-emerald-600/20 to-green-600/20',
      footerBg: 'bg-slate-900/80 border-white/10',
      footerText: 'text-slate-500',
      button: 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/25 hover:shadow-emerald-500/40',
      buttonSecondary: 'bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20',
      trustBadge: 'bg-white/10 backdrop-blur-sm border-white/20',
      mapOverlay: 'bg-white/20 backdrop-blur-sm border-white/30'
    }
  }

  const currentTheme = darkMode ? theme.dark : theme.light

  return (
    <div className={`min-h-screen ${currentTheme.bg}`}>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 ${currentTheme.heroOverlay}`}></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${currentTheme.trustBadge} mb-8`}>
              <Shield className="w-4 h-4 mr-2 text-emerald-500" />
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>Trusted by your community</span>
            </div>
            
            <h1 className={`text-5xl sm:text-7xl font-bold ${currentTheme.heroTitle} leading-tight mb-6`}>
              Report Local Issues
            </h1>
            
            <p className={`text-xl sm:text-2xl ${currentTheme.textSecondary} max-w-3xl mx-auto mb-12 leading-relaxed`}>
              Help keep your community clean and safe. Spot a problem, mark it on the map, and track progress together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/submission" 
                className={`group relative inline-flex items-center px-8 py-4 ${currentTheme.button} text-white font-semibold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300`}
              >
                <MapPin className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Report an Issue
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link 
                href="/reports" 
                className={`inline-flex items-center px-8 py-4 ${currentTheme.buttonSecondary} font-semibold rounded-2xl border transition-all duration-300`}
              >
                <Eye className="w-5 h-5 mr-2" />
                View All Reports
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-24 ${currentTheme.sectionBg} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${currentTheme.text} mb-4`}>How It Works</h2>
            <p className={`text-xl ${currentTheme.textSecondary}`}>Simple steps to make a difference</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Eye, title: 'Spot a Problem', desc: 'Notice something that needs fixing in your neighborhood' },
              { icon: MapPin, title: 'Mark on Map', desc: 'Click the exact location on our interactive map' },
              { icon: Send, title: 'Submit Report', desc: 'Add details and submit your report instantly' },
              { icon: CheckCircle, title: 'Track Progress', desc: 'Follow updates and see your impact' }
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className={`${currentTheme.cardBg} ${currentTheme.cardHover} rounded-3xl p-8 border transition-all duration-300 hover:transform hover:scale-105`}>
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold ${currentTheme.text} mb-3`}>{step.title}</h3>
                  <p className={`${currentTheme.textSecondary} leading-relaxed`}>{step.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-green-600 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Map Preview */}
      <section className={`py-24 ${currentTheme.sectionBg}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold ${currentTheme.text} mb-4`}>Live Community Reports</h2>
            <p className={`text-xl ${currentTheme.textSecondary}`}>See what's happening in your area right now</p>
          </div>
          
          <div className="relative">
            <div className={`${currentTheme.cardBg} rounded-3xl p-2 border`}>
              <div 
                ref={mapContainerRef} 
                className="h-96 rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => window.open('/submission', '_blank')}
              >
                <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-black/50' : 'from-gray-900/30'} to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl`}>
                  <div className={`${currentTheme.mapOverlay} px-6 py-3 rounded-xl border`}>
                    <span className={`${darkMode ? 'text-white' : 'text-gray-700'} font-semibold`}>Click to Report Issues</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link 
                href="/reports" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <Users className="w-5 h-5 mr-2" />
                See All {reports.length}+ Reports
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 ${currentTheme.statsBg} backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { number: reports.length.toString(), label: 'Reports Submitted', icon: MapPin },
              { number: '24h', label: 'Average Response', icon: Zap },
              { number: '95%', label: 'Issues Resolved', icon: CheckCircle }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl mb-4 group-hover:rotate-6 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className={`text-4xl font-bold ${currentTheme.text} mb-2`}>{stat.number}</div>
                <div className={currentTheme.textSecondary}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-16 ${currentTheme.footerBg} backdrop-blur-sm border-t`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className={`${currentTheme.textSecondary} text-lg mb-6 leading-relaxed`}>
            FixMyStreet helps communities work together to identify and resolve local issues. 
            Join thousands of neighbors making a difference, one report at a time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/about" 
              className="text-emerald-500 hover:text-emerald-400 font-semibold transition-colors duration-300"
            >
              Learn More About Us
            </Link>
            <span className={`hidden sm:inline ${currentTheme.footerText}`}>•</span>
            <Link 
              href="/reports" 
              className="text-green-500 hover:text-green-400 font-semibold transition-colors duration-300"
            >
              Browse All Reports
            </Link>
          </div>
          
          <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <p className={currentTheme.footerText}>© 2025 FixMyStreet. Built for the community, by the community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}