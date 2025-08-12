'use client'
import { useEffect, useRef, useState } from 'react'
import { load } from '@2gis/mapgl'
import styles from './page.module.css'
import axios from 'axios'
import { useTheme } from '@/app/contexts/ThemeContext'

interface Report {
  _id: string
  name: string
  email: string
  text: string
  coords: [number, number]
  createdAt: string
}

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const reportMarkersRef = useRef<any[]>([])
  const { darkMode } = useTheme()
  
  const [coords, setCoords] = useState<[number, number] | null>(null)
  const [message, setMessage] = useState('');

  const[name, setName] = useState('');
  const[email, setEmail] = useState('');
  const[text, setText] = useState('');

  const [nameError, setNameError] = useState('');
  const [textError, setTextError] = useState('');
  const [coordsError, setCoordsError] = useState('');

  const [reports, setReports] = useState<Report[]>([]);

  const fetchReports = async () => {
    try {
      const response = await axios.get('/api/data');
      setReports(response.data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  };

  const addReportMarkers = async () => {
    if (!mapRef.current) return;

    // Clear existing report markers
    reportMarkersRef.current.forEach(marker => marker.destroy());
    reportMarkersRef.current = [];

    const mapglAPI = await load();

    reports.forEach(report => {
      const reportMarker = new mapglAPI.Marker(mapRef.current, {
        coordinates: report.coords
      });

      // Create popup content
      const popupContent = `
        <div style="padding: 10px; max-width: 250px; background: white; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
          <h4 style="margin: 0 0 8px 0; color: #333;">${report.name}</h4>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${report.email}</p>
          <p style="margin: 0; color: #444;">${report.text}</p>
          <small style="color: #999; font-size: 11px;">
            ${new Date(report.createdAt).toLocaleDateString()}
          </small>
        </div>
      `;

      // Add popup to marker
      let popup: any = null;
      
      // Show popup on marker click
      reportMarker.on('click', () => {
        // Remove existing popup if any
        if (popup) {
          popup.destroy();
          popup = null;
        } else {
          // Create and show new popup
          popup = new mapglAPI.HtmlMarker(mapRef.current, {
            coordinates: report.coords,
            html: popupContent,
            anchor: [0, -10]
          });
        }
      });

      reportMarkersRef.current.push(reportMarker);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let valid = true;
    setNameError('');
    setTextError('');
    setCoordsError('');

    if (!name.trim()) {
      setNameError('Name is required.');
      valid = false;
    }

    if (!text.trim()) {
      setTextError('Text is required.');
      valid = false;
    }

    if (!coords) {
      setCoordsError('Please select a location on the map.');
      valid = false;
    }

    if (!valid) return;

    try {
      await axios.post('/api/data', { name, email, text, coords });
      setMessage('Form submitted successfully!');
      setName('');
      setEmail('');
      setText('');
      setCoords(null);
      // Refresh reports after successful submission
      fetchReports();
    } catch (err) {
      console.log(err);
      setMessage('Submission failed.');
    }
  };

  // Initialize map once
  useEffect(() => {
    let marker: any;

    const initMap = async () => {
      const mapglAPI = await load();

      if (mapContainerRef.current) {
        mapRef.current = new mapglAPI.Map(mapContainerRef.current, {
          center: [71.449074, 51.169392],
          zoom: 13,
          key: '031463b1-9009-4d29-960e-d8b084fbfb2f',
        });

        // Click handler for placing new marker
        mapRef.current.on('click', (e: any) => {
          const clickedCoords: [number, number] = [e.lngLat[0], e.lngLat[1]];
          setCoords(clickedCoords);

          if (marker) {
            marker.setCoordinates(clickedCoords);
          } else {
            marker = new mapglAPI.Marker(mapRef.current, { 
              coordinates: clickedCoords
            });
          }
        });
      }
    };

    initMap();

    return () => {
      if (mapRef.current) mapRef.current.destroy();
    };
  }, []); // Only run once

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  // Add markers when reports change
  useEffect(() => {
    if (reports.length > 0) {
      addReportMarkers();
    }
  }, [reports]);

  return (
    <div className={styles.container}>
      <div ref={mapContainerRef} className={styles.map} />
      {message && <p className={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit } className={styles.form}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
          {nameError && <p className={styles.error}>{nameError}</p>}
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>

        <div className={styles.formGroup}>
          <label>Text</label>
          <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)}/>
          {textError && <p className={styles.error}>{textError}</p>} 
        </div>

        <div className={styles.formGroup}>
          <label>Location</label>
          <input
            type="text"
            value={coords ? `${coords[0]}, ${coords[1]}` : ''}
            readOnly
          />
          {coordsError && <p className={styles.error}>{coordsError}</p>}
          <small>Click on the map to select location.</small>
        </div>

        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  )
}
