import { HiOutlineMail } from "react-icons/hi";
import { FaLinkedin, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="main" style={{ 
      maxWidth: '48rem', 
      margin: '0 auto', 
      padding: '2rem',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#18181b',
        borderRadius: '0.75rem',
        padding: '3rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <h1 style={{ 
          fontSize: '2.25rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem', 
          textAlign: 'center',
          color: '#ffffff'
        }}>
          Contact Me
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#9ca3af', 
          marginBottom: '2.5rem',
          fontSize: '1.125rem'
        }}>
          I'd love to hear from you. Whether it's a project, question, or just to say hi.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#000000',
            borderRadius: '0.5rem'
          }}>
            <HiOutlineMail style={{ fontSize: '1.25rem', color: '#3b82f6' }} />
            <a 
              href="mailto:nimasaraeian65@gmail.com" 
              style={{ color: '#3b82f6', textDecoration: 'underline' }}
            >
              nimasaraeian65@gmail.com
            </a>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#000000',
            borderRadius: '0.5rem'
          }}>
            <FaPhoneAlt style={{ fontSize: '1.25rem', color: '#10b981' }} />
            <p style={{ color: '#ffffff' }}>+90 536 291 4170</p>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#000000',
            borderRadius: '0.5rem'
          }}>
            <FaMapMarkerAlt style={{ fontSize: '1.25rem', color: '#ef4444' }} />
            <p style={{ color: '#ffffff' }}>Istanbul, Turkey</p>
          </div>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#000000',
            borderRadius: '0.5rem'
          }}>
            <FaLinkedin style={{ fontSize: '1.25rem', color: '#1d4ed8' }} />
            <a
              href="https://www.linkedin.com/in/nima.saraeian"
              style={{ color: '#1d4ed8', textDecoration: 'underline' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin.com/in/nima.saraeian
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
