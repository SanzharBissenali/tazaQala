'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/app/contexts/ThemeContext'
import { 
  MapPin, 
  Menu, 
  X, 
  Home, 
  FileText, 
  Database,
  Info,
  Moon,
  Sun
} from 'lucide-react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { darkMode, toggleDarkMode } = useTheme()

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/submission', label: 'Report Issue', icon: MapPin },
    { href: '/reports', label: 'All Reports', icon: Database },
    { href: '/about', label: 'About', icon: Info }
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className={`${styles.navbar} ${darkMode ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <MapPin className="w-6 h-6" />
          </div>
          <span className={styles.logoText}>FixMyStreet</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={styles.themeToggle}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* CTA Button */}
          <Link href="/submission" className={styles.ctaButton}>
            <MapPin className="w-4 h-4" />
            Report Issue
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={styles.menuButton}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${styles.mobileNav} ${isMenuOpen ? styles.open : ''}`}>
        <ul className={styles.mobileNavList}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className={`${styles.mobileNavLink} ${isActive(item.href) ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  )
}