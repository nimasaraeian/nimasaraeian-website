'use client';

import React from 'react';

export default function AboutPage() {
  return (
    <div style={{
      backgroundColor: '#000000',
      minHeight: '100vh',
      paddingTop: '120px',
      paddingBottom: '60px'
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '40px 20px',
        color: '#ffffff',
        lineHeight: '1.8',
        fontFamily: 'Times New Roman, serif',
        textAlign: 'center'
      }}>
        
        {/* Hero Section with Photo */}
        <section style={{ marginBottom: '60px' }}>
          <div style={{
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '0 auto 30px auto',
            border: '6px solid rgba(160, 160, 160, 0.3)',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)'
          }}>
            <img 
              src="/image/nima-bw.jpg" 
              alt="Nima Saraeian"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(100%) contrast(1.1)'
              }}
            />
          </div>
          
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#ffffff',
            fontFamily: 'Times New Roman, serif'
          }}>
            Nima Saraeian
          </h1>
          
          <div style={{
            width: '80px',
            height: '3px',
            background: 'linear-gradient(90deg, #808080, #a0a0a0)',
            margin: '15px auto',
            borderRadius: '2px'
          }}></div>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#b0b0b0',
            fontStyle: 'italic',
            marginBottom: '30px',
            fontFamily: 'Times New Roman, serif'
          }}>
            Digital Psychology Researcher<br />
            AI & Consumer Behavior Specialist
          </p>
        </section>

        {/* About Me Section */}
        <section style={{ marginBottom: '60px', textAlign: 'left' }}>
          <h2 style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            marginBottom: '30px',
            color: '#ffffff',
            textAlign: 'center',
            fontFamily: 'Times New Roman, serif'
          }}>
            About Me
          </h2>
          
          <p style={{
            fontSize: '1.2rem',
            lineHeight: '1.7',
            color: '#e0e0e0',
            marginBottom: '25px',
            fontFamily: 'Times New Roman, serif'
          }}>
            Welcome! I'm a multidisciplinary thinker at the intersection of <strong style={{ color: '#ffffff' }}>digital psychology</strong>, <strong style={{ color: '#ffffff' }}>AI-powered consumer behavior</strong>, and <strong style={{ color: '#ffffff' }}>data-driven marketing</strong>. With over 12 years of experience in executive roles and academic research, I've devoted my career to understanding how technology, human behavior, and innovation shape the digital experience.
          </p>
          
          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.7',
            color: '#cccccc',
            marginBottom: '25px',
            fontFamily: 'Times New Roman, serif'
          }}>
            My academic background includes a <strong style={{ color: '#b0b0b0' }}>Master's in E-Commerce</strong> and a current deep focus on AI-enhanced psychometrics, consumer decision-making, and UX behavior analytics. I'm the creator of <strong style={{ color: '#ffffff' }}>Selflyzer</strong>, an AI-powered platform designed to decode psychological patterns, predict user behavior, and empower both individuals and organizations through data-informed insights.
          </p>
        </section>

        {/* Frameworks Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: '30px',
            color: '#ffffff',
            textAlign: 'center',
            fontFamily: 'Times New Roman, serif'
          }}>
            Innovative Frameworks
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginTop: '30px'
          }}>
            <div style={{
              padding: '30px 25px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
              backgroundColor: '#1a1a1a'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🧬</div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#ffffff',
                fontFamily: 'Times New Roman, serif'
              }}>
                Selflyzer Code
              </h3>
              <p style={{
                fontSize: '0.95rem',
                margin: '0',
                color: '#c0c0c0',
                lineHeight: '1.5',
                fontFamily: 'Times New Roman, serif'
              }}>
                A dynamic psychological blueprint powered by AI
              </p>
            </div>
            
            <div style={{
              padding: '30px 25px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
              backgroundColor: '#1a1a1a'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔍</div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#ffffff',
                fontFamily: 'Times New Roman, serif'
              }}>
                ShadowTrace
              </h3>
              <p style={{
                fontSize: '0.95rem',
                margin: '0',
                color: '#c0c0c0',
                lineHeight: '1.5',
                fontFamily: 'Times New Roman, serif'
              }}>
                A model for uncovering unconscious emotional drivers
              </p>
            </div>
            
            <div style={{
              padding: '30px 25px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center',
              backgroundColor: '#1a1a1a'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>💝</div>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#ffffff',
                fontFamily: 'Times New Roman, serif'
              }}>
                EmoConnect
              </h3>
              <p style={{
                fontSize: '0.95rem',
                margin: '0',
                color: '#c0c0c0',
                lineHeight: '1.5',
                fontFamily: 'Times New Roman, serif'
              }}>
                A relationship AI module enhancing emotional communication
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            marginBottom: '30px',
            color: '#ffffff',
            fontFamily: 'Times New Roman, serif'
          }}>
            Mission & Philosophy
          </h2>
          
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '25px',
            maxWidth: '800px',
            margin: '0 auto 25px auto',
            fontFamily: 'Times New Roman, serif',
            color: '#e0e0e0'
          }}>
            My mission is to bring science, empathy, and AI together to shape smarter digital environments — whether it's improving product recommendation systems, tailoring UX for mental well-being, or helping people make better career and relationship choices through self-knowledge.
          </p>

          <div style={{
            padding: '25px',
            borderRadius: '15px',
            borderLeft: '5px solid #a0a0a0',
            backgroundColor: '#1a1a1a',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <p style={{
              fontSize: '1.4rem',
              fontStyle: 'italic',
              fontWeight: '600',
              margin: '0',
              color: '#ffffff',
              fontFamily: 'Times New Roman, serif'
            }}>
              "I believe that technology should serve the soul, not just the market."
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section style={{ textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            marginBottom: '30px',
            color: '#ffffff',
            fontFamily: 'Times New Roman, serif'
          }}>
            Let's Connect
          </h2>
          
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '30px',
            color: '#cccccc',
            fontFamily: 'Times New Roman, serif'
          }}>
            If you're interested in the future of AI, mental health, psychographic data, and ethical technology, you're in the right place.
          </p>

          <a 
            href="/contact" 
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              backgroundColor: '#333333',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '25px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              fontFamily: 'Times New Roman, serif',
              transition: 'background-color 0.3s'
            }}
          >
            Get In Touch →
          </a>
        </section>
        
      </div>
    </div>
  );
}