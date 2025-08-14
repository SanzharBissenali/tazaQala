'use client'
import { useEffect, useRef, useState } from 'react'
import { load } from '@2gis/mapgl'
import axios from 'axios'
import { useTheme } from '@/app/contexts/ThemeContext'
import { 
  MapPin, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Mail, 
  MessageSquare,
  Navigation,
  Camera,
  X,
  Upload
} from 'lucide-react'

interface Report {
  _id: string
  name: string
  email: string
  text: string
  coords: [number, number]
  createdAt: string
  photo?: string
}

export default function SubmissionPage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const reportMarkersRef = useRef<any[]>([])
  const mapInitializedRef = useRef(false)
  const { darkMode } = useTheme()
  
  const [coords, setCoords] = useState<[number, number] | null>(null)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  const [nameError, setNameError] = useState('')
  const [textError, setTextError] = useState('')
  const [coordsError, setCoordsError] = useState('')
  const [photoError, setPhotoError] = useState('')

  const [reports, setReports] = useState<Report[]>([])

  // Theme configuration
  const theme = {
    light: {
      bg: 'bg-gradient-to-br from-emerald-50 via-white to-green-50',
      cardBg: 'bg-white/90 backdrop-blur-sm',
      border: 'border-gray-200',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      input: 'bg-white border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 text-gray-900',
      button: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
      errorText: 'text-red-600',
      successText: 'text-emerald-600'
    },
    dark: {
      bg: 'bg-gradient-to-br from-slate-900 via-emerald-900/20 to-slate-900',
      cardBg: 'bg-slate-800/90 backdrop-blur-sm',
      border: 'border-slate-700',
      text: 'text-white',
      textSecondary: 'text-slate-300',
      input: 'bg-slate-700 border-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20 text-white',
      button: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
      errorText: 'text-red-400',
      successText: 'text-emerald-400'
    }
  }

  const currentTheme = darkMode ? theme.dark : theme.light

  const fetchReports = async () => {
    try {
      const response = await axios.get('/api/data')
      setReports(response.data)
    } catch (err) {
      console.error('Failed to fetch reports:', err)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setPhotoError('Please select a valid image file')
        return
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError('Image size should be less than 5MB')
        return
      }

      setPhoto(file)
      setPhotoError('')
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhoto(null)
    setPhotoPreview(null)
    setPhotoError('')
    setUploadedImageUrl(null)
  }

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        try {
          console.log('Uploading to Cloudinary...')
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: reader.result,
            }),
          })

          const data = await response.json()
          console.log('Upload response:', data)

          if (!response.ok) {
            throw new Error(data.details || data.error || 'Upload failed')
          }

          resolve(data.url)
        } catch (error) {
          console.error('Upload error:', error)
          reject(error)
        }
      }
      reader.onerror = (error) => {
        console.error('FileReader error:', error)
        reject(error)
      }
    })
  }

  const addReportMarkers = async () => {
    if (!mapRef.current || !mapInitializedRef.current) return

    // Clear existing report markers
    reportMarkersRef.current.forEach(marker => marker.destroy())
    reportMarkersRef.current = []

    const mapglAPI = await load()

    reports.forEach(report => {
      const reportMarker = new mapglAPI.Marker(mapRef.current, {
        coordinates: report.coords
      })

      // Create popup content with theme-aware styling
      const popupContent = `
        <div style="padding: 12px; max-width: 280px; background: ${darkMode ? '#1e293b' : 'white'}; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 1px solid ${darkMode ? '#475569' : '#e5e7eb'};">
          ${report.photo ? `<img src="${report.photo}" alt="Report photo" style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" />` : ''}
          <p style="margin: 0 0 8px 0; color: ${darkMode ? '#cbd5e1' : '#374151'}; font-size: 13px; line-height: 1.4;">${report.text.length > 100 ? report.text.substring(0, 100) + '...' : report.text}</p>
          <small style="color: ${darkMode ? '#64748b' : '#9ca3af'}; font-size: 11px;">
            ${new Date(report.createdAt).toLocaleDateString()}
          </small>
        </div>
      `

      // Add popup to marker
      let popup: any = null
      
      // Show popup on marker click
      reportMarker.on('click', () => {
        // Remove existing popup if any
        if (popup) {
          popup.destroy()
          popup = null
        } else {
          // Create and show new popup
          popup = new mapglAPI.HtmlMarker(mapRef.current, {
            coordinates: report.coords,
            html: popupContent,
            anchor: [0, -10]
          })
        }
      })

      reportMarkersRef.current.push(reportMarker)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let valid = true
    setNameError('')
    setTextError('')
    setCoordsError('')
    setPhotoError('')

    if (!name.trim()) {
      setNameError('Name is required.')
      valid = false
    }

    if (!text.trim()) {
      setTextError('Description is required.')
      valid = false
    }

    if (!coords) {
      setCoordsError('Please select a location on the map.')
      console.log('Validation failed: No coordinates selected')
      valid = false
    } else {
      console.log('Coordinates are valid:', coords)
    }

    if (!photo) {
      setPhotoError('Please upload a photo of the issue.')
      console.log('Validation failed: No photo uploaded')
      valid = false
    } else {
      console.log('Photo is valid:', photo.name)
    }

    console.log('Form validation result:', valid)

    if (!valid) return

    setIsSubmitting(true)

    try {
      // Upload image to Cloudinary first
      let imageUrl = ''
      if (photo) {
        setMessage('Uploading image...')
        imageUrl = await uploadImageToCloudinary(photo)
        setUploadedImageUrl(imageUrl)
        console.log('Image uploaded successfully, URL:', imageUrl)
      }

      // Then save report data with image URL
      setMessage('Saving report...')
      
      const postData = { 
        name, 
        email, 
        text, 
        coords,
        photo: imageUrl
      }
      
      console.log('POST data name:', name)
      console.log('POST data email:', email) 
      console.log('POST data text:', text)
      console.log('POST data coords:', JSON.stringify(coords))
      console.log('POST data photo:', imageUrl)
      
      try {
        console.log('Making API call to /api/data...')
        const response = await axios.post('/api/data', postData)
        console.log('API call successful!')
        console.log('Response:', JSON.stringify(response.data))
      } catch (apiError) {
        console.error('API call failed!')
        console.error('Error:', apiError)
        if (axios.isAxiosError(apiError)) {
          console.error('Status:', apiError.response?.status)
          console.error('Error data:', JSON.stringify(apiError.response?.data))
        }
        throw apiError
      }
      
      setMessage('Report submitted successfully!')
      setName('')
      setEmail('')
      setText('')
      setCoords(null)
      removePhoto()
      // Refresh reports after successful submission
      fetchReports()
    } catch (err) {
      console.error('Full submission error:', err)
      if (err instanceof Error) {
        setMessage(`Submission failed: ${err.message}`)
      } else {
        setMessage('Submission failed. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Initialize map once with proper cleanup
  useEffect(() => {
    if (mapInitializedRef.current) return

    let marker: any

    const initMap = async () => {
      const mapglAPI = await load()

      if (mapContainerRef.current && !mapRef.current) {
        mapRef.current = new mapglAPI.Map(mapContainerRef.current, {
          center: [71.449074, 51.169392],
          zoom: 13,
          key: '031463b1-9009-4d29-960e-d8b084fbfb2f',
        })

        // Click handler for placing new marker
        mapRef.current.on('click', (e: any) => {
          const clickedCoords: [number, number] = [e.lngLat[0], e.lngLat[1]]
          setCoords(clickedCoords)

          if (marker) {
            marker.setCoordinates(clickedCoords)
          } else {
            marker = new mapglAPI.Marker(mapRef.current, { 
              coordinates: clickedCoords
            })
          }
        })

        mapInitializedRef.current = true
      }
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
        mapInitializedRef.current = false
      }
    }
  }, [])

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports()
  }, [])

  // Add markers when reports change
  useEffect(() => {
    if (reports.length > 0 && mapInitializedRef.current) {
      addReportMarkers()
    }
  }, [reports, darkMode])

  return (
    <div className={`min-h-screen ${currentTheme.bg} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl sm:text-4xl font-bold ${currentTheme.text} mb-4`}>
            Report an Issue
          </h1>
          <p className={`text-lg ${currentTheme.textSecondary} max-w-2xl mx-auto`}>
            Help improve your community by reporting problems that need attention. 
            Click on the map to mark the exact location.
          </p>
        </div>

        <div className="space-y-8">
          {/* Map Section - Full width on mobile, better height */}
          <div className={`${currentTheme.cardBg} rounded-2xl p-4 sm:p-6 shadow-xl ${currentTheme.border} border`}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-emerald-500" />
              <h2 className={`text-lg sm:text-xl font-semibold ${currentTheme.text}`}>Select Location</h2>
            </div>
            <div 
              ref={mapContainerRef} 
              className="w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden shadow-inner"
            />
            <p className={`text-xs sm:text-sm ${currentTheme.textSecondary} mt-3 flex items-center gap-2`}>
              <Navigation className="w-4 h-4" />
              Tap anywhere on the map to place a marker
            </p>
          </div>

          {/* Form Section - Full width on mobile */}
          <div className={`${currentTheme.cardBg} rounded-2xl p-4 sm:p-6 shadow-xl ${currentTheme.border} border`}>
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              <h2 className={`text-lg sm:text-xl font-semibold ${currentTheme.text}`}>Report Details</h2>
            </div>

            {/* Success/Error Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl border ${
                message.includes('successfully') 
                  ? `bg-emerald-50 border-emerald-200 ${darkMode ? 'bg-emerald-900/20 border-emerald-800' : ''}`
                  : `bg-red-50 border-red-200 ${darkMode ? 'bg-red-900/20 border-red-800' : ''}`
              }`}>
                <div className="flex items-center gap-2">
                  {message.includes('successfully') ? (
                    <CheckCircle2 className={`w-5 h-5 ${currentTheme.successText}`} />
                  ) : (
                    <AlertCircle className={`w-5 h-5 ${currentTheme.errorText}`} />
                  )}
                  <p className={`font-medium text-sm sm:text-base ${
                    message.includes('successfully') ? currentTheme.successText : currentTheme.errorText
                  }`}>
                    {message}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-2 flex items-center gap-2`}>
                  <User className="w-4 h-4" />
                  Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${currentTheme.input} placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-200 text-base`}
                  placeholder="Your full name"
                />
                {nameError && (
                  <p className={`text-sm ${currentTheme.errorText} mt-1 flex items-center gap-1`}>
                    <AlertCircle className="w-4 h-4" />
                    {nameError}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-2 flex items-center gap-2`}>
                  <Mail className="w-4 h-4" />
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${currentTheme.input} placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-200 text-base`}
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Description Field */}
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-2 flex items-center gap-2`}>
                  <MessageSquare className="w-4 h-4" />
                  Issue Description *
                </label>
                <textarea
                  rows={4}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${currentTheme.input} placeholder-gray-400 focus:ring-2 focus:outline-none transition-all duration-200 resize-none text-base`}
                  placeholder="Describe the issue in detail..."
                />
                {textError && (
                  <p className={`text-sm ${currentTheme.errorText} mt-1 flex items-center gap-1`}>
                    <AlertCircle className="w-4 h-4" />
                    {textError}
                  </p>
                )}
              </div>

              {/* Photo Upload */}
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-2 flex items-center gap-2`}>
                  <Camera className="w-4 h-4" />
                  Photo *
                </label>
                
                {!photoPreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className={`w-full h-32 border-2 border-dashed ${currentTheme.input} rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200`}
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className={`text-sm ${currentTheme.textSecondary}`}>
                        Click to upload photo
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PNG, JPG up to 5MB
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl border border-gray-200 dark:border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {photoError && (
                  <p className={`text-sm ${currentTheme.errorText} mt-1 flex items-center gap-1`}>
                    <AlertCircle className="w-4 h-4" />
                    {photoError}
                  </p>
                )}
              </div>

              {/* Location Display */}
              <div>
                <label className={`block text-sm font-medium ${currentTheme.text} mb-2 flex items-center gap-2`}>
                  <MapPin className="w-4 h-4" />
                  Selected Location *
                </label>
                <input
                  type="text"
                  value={coords ? `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}` : ''}
                  readOnly
                  className={`w-full px-4 py-3 rounded-xl border ${currentTheme.input} bg-gray-50 ${darkMode ? 'bg-slate-600' : ''} cursor-not-allowed text-base`}
                  placeholder="Tap on the map to select location"
                />
                {coordsError && (
                  <p className={`text-sm ${currentTheme.errorText} mt-1 flex items-center gap-1`}>
                    <AlertCircle className="w-4 h-4" />
                    {coordsError}
                  </p>
                )}
              </div>

              {/* Submit Button - Larger for mobile */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${currentTheme.button} text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-base min-h-[3rem]`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Report
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}