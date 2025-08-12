'use client'
import Link from 'next/link'
import { useTheme } from '@/app/contexts/ThemeContext'
import { 
  MapPin, 
  Mail, 
  Phone, 
  Github, 
  Twitter, 
  Facebook,
  ExternalLink,
  Heart,
  Shield,
  Users,
  FileText
} from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  const { darkMode } = useTheme()
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/submission', label: 'Report Issue' },
    { href: '/reports', label: 'All Reports' },
    { href: '/about', label: 'About Us' }
  ]

  const legalLinks = [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
    { href: '/accessibility', label: 'Accessibility' }
  ]

  const socialLinks = [
    { href: '#', icon: Twitter, label: 'Twitter' },
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Github, label: 'GitHub' }
  ]

  return (
    <footer className={`${styles.footer} ${darkMode ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.content}>
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.brand}>
              <div className={styles.logoIcon}>
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className={styles.brandName}>FixMyStreet</h3>
            </div>
            <p className={styles.brandDescription}>
              Empowering communities to identify and resolve local issues together. 
              Your voice matters in making our neighborhoods better.
            </p>
            <div className={styles.socialLinks}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className={styles.socialLink}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linkSection}>
            <h4 className={styles.sectionTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div className={styles.linkSection}>
            <h4 className={styles.sectionTitle}>Features</h4>
            <ul className={styles.linkList}>
              <li className={styles.feature}>
                <Shield className="w-4 h-4" />
                Secure Reporting
              </li>
              <li className={styles.feature}>
                <Users className="w-4 h-4" />
                Community Driven
              </li>
              <li className={styles.feature}>
                <MapPin className="w-4 h-4" />
                Location Based
              </li>
              <li className={styles.feature}>
                <FileText className="w-4 h-4" />
                Progress Tracking
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.linkSection}>
            <h4 className={styles.sectionTitle}>Get in Touch</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Mail className="w-4 h-4" />
                <span>support@fixmystreet.com</span>
              </div>
              <div className={styles.contactItem}>
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
            <div className={styles.newsletter}>
              <p className={styles.newsletterText}>Stay updated with community news</p>
              <div className={styles.newsletterForm}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className={styles.newsletterInput}
                />
                <button className={styles.newsletterButton}>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomContent}>
            <div className={styles.copyright}>
              <p>© {currentYear} FixMyStreet. Built with <Heart className="w-4 h-4 inline text-red-500" /> for the community.</p>
            </div>
            <div className={styles.legalLinks}>
              {legalLinks.map((link, index) => (
                <span key={link.href}>
                  <Link href={link.href} className={styles.legalLink}>
                    {link.label}
                  </Link>
                  {index < legalLinks.length - 1 && <span className={styles.separator}>•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}