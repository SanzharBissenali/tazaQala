'use client'
import { useEffect, useRef, useState } from 'react'
import { load } from '@2gis/mapgl'
import { useTheme } from '@/app/contexts/ThemeContext'
import { 
  Calendar, 
  MapPin, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Search,
  Filter,
  Image as ImageIcon,
  X
} from 'lucide-react'

interface Report {
  _id: string
  name: string
  email: string
  text: string
  coords: [number, number]
  createdAt: string
  status: 'pending' | 'in-progress' | 'resolved'
  photo?: string
}

export default function ReportsPage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const highlightMarkerRef = useRef<any>(null)
  const mapInitializedRef = useRef(false)
  const { darkMode } = useTheme()

  const [reports, setReports] = useState<Report[]>([])
  const [hoveredReport, setHoveredReport] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Theme configuration
  const theme = {
    light: {
      bg: 'bg-gradient-to-br from-emerald-50 via-white to-green-50',
      cardBg: 'bg-white/90 backdrop-blur-sm',
      border: 'border-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      hover: 'hover:shadow-lg hover:shadow-emerald-100',
      input: 'bg-white border-gray-300 focus:border-emerald-500',
      highlight: 'ring-2 ring-emerald-500 ring-opacity-50'
    },
    dark: {
      bg: 'bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900',
      cardBg: 'bg-slate-800/90 backdrop-blur-sm',
      border: 'border-slate-700',
      text: 'text-white',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      hover: 'hover:shadow-lg hover:shadow-emerald-900/50',
      input: 'bg-slate-700 border-slate-600 focus:border-emerald-500',
      highlight: 'ring-2 ring-emerald-400 ring-opacity-50'
    }
  }

  const currentTheme = darkMode ? theme.dark : theme.light

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/data')
      const data = await response.json()
      console.log('Reports page received data:', data)
      console.log('First report photo:', data[0]?.photo)
      setReports(data)
    } catch (err) {
      console.error('Failed to fetch reports:', err)
    } finally {
      setLoading(false)
    }
  }

  const initializeMap = async () => {
    if (mapInitializedRef.current) return

    const mapglAPI = await load()

    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapglAPI.Map(mapContainerRef.current, {
        center: [71.449074, 51.169392],
        zoom: 12,
        key: '031463b1-9009-4d29-960e-d8b084fbfb2f',
      })

      mapInitializedRef.current = true
    }
  }

  const addMapMarkers = async () => {
    if (!mapRef.current || !mapInitializedRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.destroy())
    markersRef.current = []

    const mapglAPI = await load()

    reports.forEach(report => {
      const marker = new mapglAPI.Marker(mapRef.current, {
        coordinates: report.coords
      })
      markersRef.current.push(marker)
    })
  }

  const highlightReportOnMap = async (report: Report) => {
    if (!mapRef.current || !mapInitializedRef.current) return

    // Remove existing highlight marker
    if (highlightMarkerRef.current) {
      highlightMarkerRef.current.destroy()
      highlightMarkerRef.current = null
    }

    const mapglAPI = await load()

    // Create highlight marker (larger, different color)
    highlightMarkerRef.current = new mapglAPI.Marker(mapRef.current, {
      coordinates: report.coords
    })

    // Center map on the highlighted report
    mapRef.current.setCenter(report.coords)
    mapRef.current.setZoom(15)
  }

  const removeHighlight = () => {
    if (highlightMarkerRef.current) {
      highlightMarkerRef.current.destroy()
      highlightMarkerRef.current = null
    }
    // Reset map view
    if (mapRef.current) {
      mapRef.current.setCenter([71.449074, 51.169392])
      mapRef.current.setZoom(12)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      resolved: 'bg-green-100 text-green-800 border-green-200',
      'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      pending: 'bg-red-100 text-red-800 border-red-200'
    }
    
    if (darkMode) {
      const darkBadges = {
        resolved: 'bg-green-900/30 text-green-400 border-green-800',
        'in-progress': 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
        pending: 'bg-red-900/30 text-red-400 border-red-800'
      }
      return darkBadges[status as keyof typeof darkBadges] || darkBadges.pending
    }
    
    return badges[status as keyof typeof badges] || badges.pending
  }

  // Filter reports based on search and status
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    return matchesSearch && matchesStatus
  })

  useEffect(() => {
    initializeMap()
    fetchReports()

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
        mapInitializedRef.current = false
      }
    }
  }, [])

  useEffect(() => {
    if (reports.length > 0 && mapInitializedRef.current) {
      addMapMarkers()
    }
  }, [reports])

  return (
    <div className={`min-h-screen ${currentTheme.bg} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl sm:text-4xl font-bold ${currentTheme.text} mb-4`}>
            Community Reports
          </h1>
          <p className={`text-lg ${currentTheme.textSecondary} max-w-2xl mx-auto`}>
            View all submitted reports and their current status. Tap any report to see its location on the map.
          </p>
        </div>

        {/* Filters */}
        <div className={`${currentTheme.cardBg} rounded-2xl p-4 sm:p-6 shadow-xl ${currentTheme.border} border mb-8`}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${currentTheme.input} focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200`}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border ${currentTheme.input} focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200 appearance-none cursor-pointer`}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-5">
            <div className={`${currentTheme.cardBg} rounded-2xl p-4 sm:p-6 shadow-xl ${currentTheme.border} border sticky top-8`}>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <h2 className={`text-lg sm:text-xl font-semibold ${currentTheme.text}`}>Location Map</h2>
              </div>
              <div 
                ref={mapContainerRef} 
                className="w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden shadow-inner"
              />
              <p className={`text-xs sm:text-sm ${currentTheme.textSecondary} mt-3 flex items-center gap-2`}>
                <Eye className="w-4 h-4" />
                Tap reports to highlight locations
              </p>
            </div>
          </div>

          {/* Reports Section */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-emerald-500" />
              <h2 className={`text-lg sm:text-xl font-semibold ${currentTheme.text}`}>
                Reports ({filteredReports.length})
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div
                    key={report._id}
                    className={`${currentTheme.cardBg} rounded-2xl p-4 sm:p-6 shadow-lg ${currentTheme.border} border transition-all duration-300 cursor-pointer ${currentTheme.hover} ${
                      hoveredReport === report._id ? currentTheme.highlight : ''
                    }`}
                    onMouseEnter={() => {
                      setHoveredReport(report._id)
                      highlightReportOnMap(report)
                    }}
                    onMouseLeave={() => {
                      setHoveredReport(null)
                      removeHighlight()
                    }}
                    onTouchStart={() => {
                      setHoveredReport(report._id)
                      highlightReportOnMap(report)
                    }}
                    onTouchEnd={() => {
                      setTimeout(() => {
                        setHoveredReport(null)
                        removeHighlight()
                      }, 3000)
                    }}
                  >
                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Photo Section */}
                      <div className="md:col-span-1">
                        {report.photo ? (
                          <img 
                            src={report.photo} 
                            alt="Report" 
                            className="w-full h-48 md:h-32 object-cover rounded-xl cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => setSelectedImage(report.photo!)}
                            onError={(e) => {
                              console.error('Image failed to load:', report.photo)
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className={`w-full h-48 md:h-32 ${currentTheme.border} border-2 border-dashed rounded-xl flex items-center justify-center`}>
                            <div className="text-center">
                              <ImageIcon className={`w-8 h-8 ${currentTheme.textMuted} mx-auto mb-2`} />
                              <p className={`text-xs ${currentTheme.textMuted}`}>No image</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="md:col-span-2 space-y-3">
                        {/* Header with Status */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(report.status)}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(report.status)}`}>
                              {report.status.replace('-', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(report.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <p className={`${currentTheme.text} leading-relaxed`}>
                            {report.text.length > 200 ? `${report.text.substring(0, 200)}...` : report.text}
                          </p>
                        </div>

                        {/* Footer with Location */}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-slate-700">
                          <MapPin className="w-4 h-4 text-emerald-500" />
                          <span className={`text-sm ${currentTheme.textSecondary}`}>
                            {report.coords[0].toFixed(4)}, {report.coords[1].toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredReports.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className={`w-12 h-12 ${currentTheme.textMuted} mx-auto mb-4`} />
                    <p className={`${currentTheme.textMuted}`}>
                      {searchTerm || statusFilter !== 'all' ? 'No reports match your filters' : 'No reports found'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <img 
              src={selectedImage} 
              alt="Report full size" 
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}