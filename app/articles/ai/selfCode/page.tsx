'use client';

import React from 'react';

export default function SelfCodePage() {
  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '60px 30px',
      color: '#ffffff',
      lineHeight: '1.8',
      fontFamily: 'Inter, sans-serif',
      backgroundColor: 'rgba(60, 60, 60, 0.3)', // تغییر به خاکستری
      borderRadius: '15px',
      marginTop: '20px',
      marginBottom: '40px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      textAlign: 'left'
    }}>
      {/* Header Section */}
      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          marginTop: '1cm',
          marginBottom: '15px',
          color: '#ffffff',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
          lineHeight: '1.2'
        }}>
          SelfCode: Decoding Your Psychological DNA
        </h1>
        
        <div style={{
          width: '100px',
          height: '3px',
          background: 'linear-gradient(90deg, #808080, #a0a0a0)', // تغییر به خاکستری
          margin: '20px auto',
          borderRadius: '2px'
        }}></div>
        
        <p style={{
          fontSize: '1.2rem',
          fontStyle: 'italic',
          color: '#a0a0a0'
        }}>
          <strong>By Nima Saraeian</strong>
        </p>
      </header>

      {/* Introduction Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '20px',
          color: '#a0a0a0', // تغییر به خاکستری
          borderLeft: '4px solid #a0a0a0', // تغییر به خاکستری
          paddingLeft: '15px',
          textAlign: 'left'
        }}>Introduction</h2>
        
        <div style={{
          backgroundColor: 'rgba(96, 96, 96, 0.2)', // تغییر به خاکستری
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid rgba(96, 96, 96, 0.4)', // تغییر به خاکستری
          marginBottom: '25px'
        }}>
          <p style={{ marginBottom: '20px', fontSize: '1.1rem', textAlign: 'left' }}>
            What if you could understand your mind the same way geneticists understand DNA? What if your personality, cognitive patterns, emotional responses, and behavioral tendencies could be mapped, analyzed, and decoded into a comprehensive psychological profile that reveals not just who you are, but why you think and feel the way you do?
          </p>

          <p style={{ marginBottom: '0', fontSize: '1.1rem', textAlign: 'left' }}>
            <strong>SelfCode</strong> is a revolutionary psychological assessment platform that creates your unique "psychological DNA"—a comprehensive, multi-dimensional analysis of your mental architecture. Unlike traditional personality tests that categorize you into types, SelfCode maps the intricate network of cognitive patterns, emotional responses, and behavioral tendencies that make you uniquely you.
          </p>
        </div>
      </section>

      {/* What Is SelfCode Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '20px',
          color: '#a0a0a0', // تغییر به خاکستری
          borderLeft: '4px solid #a0a0a0', // تغییر به خاکستری
          paddingLeft: '15px',
          textAlign: 'left'
        }}>What Is SelfCode?</h2>
        
        <p style={{ marginBottom: '20px', fontSize: '1.1rem', textAlign: 'left' }}>
          SelfCode is an AI-powered psychological profiling system that analyzes multiple dimensions of human psychology to create a comprehensive "psychological fingerprint." This system examines:
        </p>

        <div style={{
          display: 'grid',
          gap: '15px',
          backgroundColor: 'rgba(96, 96, 96, 0.2)', // تغییر به خاکستری
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid rgba(96, 96, 96, 0.4)' // تغییر به خاکستری
        }}>
          {[
            { name: 'Cognitive Architecture', desc: 'How you process information, make decisions, and solve problems' },
            { name: 'Emotional Patterns', desc: 'Your emotional processing style, triggers, and regulation mechanisms' },
            { name: 'Behavioral Tendencies', desc: 'Patterns in how you interact with the world and others' },
            { name: 'Motivational Drivers', desc: 'What energizes, fulfills, and drives your actions' },
            { name: 'Social Dynamics', desc: 'How you connect, communicate, and relate to others' },
            { name: 'Stress & Resilience', desc: 'Your response patterns to pressure and adversity' }
          ].map((dimension, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '15px',
              backgroundColor: 'rgba(128, 128, 128, 0.1)', // تغییر به خاکستری
              borderRadius: '8px',
              borderLeft: '4px solid #888888', // تغییر به خاکستری
              textAlign: 'left'
            }}>
              <div>
                <strong style={{ color: '#b0b0b0', fontSize: '1.1rem' }}>{dimension.name}:</strong> {/* تغییر به خاکستری */}
                <span style={{ marginLeft: '10px' }}>{dimension.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The Science Behind SelfCode Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '20px',
          color: '#a0a0a0', // تغییر به خاکستری
          borderLeft: '4px solid #a0a0a0', // تغییر به خاکستری
          paddingLeft: '15px',
          textAlign: 'left'
        }}>The Science Behind SelfCode</h2>

        <div style={{ display: 'grid', gap: '25px' }}>
          {[
            {
              title: 'Multi-Modal Assessment',
              content: 'Unlike single-dimension personality tests, SelfCode employs multiple assessment modalities including psychometric questionnaires, behavioral analysis, cognitive tasks, scenario-based assessments, and aesthetic preferences.',
              icon: '🧠'
            },
            {
              title: 'AI-Powered Pattern Recognition',
              content: 'Advanced machine learning algorithms analyze the complex interactions between different psychological dimensions, identifying patterns that would be impossible to detect through traditional analysis.',
              icon: '🤖'
            },
            {
              title: 'Dynamic Integration',
              content: 'The system maps dynamic relationships between cognitive and emotional systems, predicting behavioral patterns based on psychological architecture while continuously learning and refining assessment accuracy.',
              icon: '🔄'
            }
          ].map((aspect, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '20px',
              padding: '25px',
              backgroundColor: 'rgba(96, 96, 96, 0.2)', // تغییر به خاکستری
              borderRadius: '10px',
              border: '1px solid rgba(96, 96, 96, 0.4)', // تغییر به خاکستری
              textAlign: 'left'
            }}>
              <div style={{
                fontSize: '2rem',
                minWidth: '60px',
                textAlign: 'center'
              }}>
                {aspect.icon}
              </div>
              <div style={{ textAlign: 'left' }}>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  marginBottom: '10px',
                  color: '#b0b0b0', // تغییر به خاکستری
                  textAlign: 'left'
                }}>{aspect.title}</h3>
                <p style={{ margin: '0', fontSize: '1.1rem', textAlign: 'left' }}>{aspect.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Applications and Benefits Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '20px',
          color: '#a0a0a0', // تغییر به خاکستری
          borderLeft: '4px solid #a0a0a0', // تغییر به خاکستری
          paddingLeft: '15px',
          textAlign: 'left'
        }}>Applications and Benefits</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {[
            {
              title: 'Personal Development',
              content: 'Deep understanding of your psychological patterns, strengths optimization, blind spot identification, and goal alignment that matches your psychological makeup.'
            },
            {
              title: 'Career Optimization',
              content: 'Identify career paths that align with your psychological architecture, work environments where you naturally thrive, and leadership styles that match your personality.'
            },
            {
              title: 'Relationship Enhancement',
              content: 'Understanding psychological compatibility, communication patterns, conflict resolution approaches, and emotional needs for better relationships.'
            },
            {
              title: 'Mental Health & Wellness',
              content: 'Identify stress vulnerabilities, develop coping mechanisms that align with your psychology, and create early warning systems for mental health challenges.'
            }
          ].map((benefit, index) => (
            <div key={index} style={{
              padding: '25px',
              backgroundColor: 'rgba(96, 96, 96, 0.2)', // تغییر به خاکستری
              borderRadius: '10px',
              border: '1px solid rgba(96, 96, 96, 0.4)', // تغییر به خاکستری
              transition: 'transform 0.3s ease',
              textAlign: 'left'
            }}>
              <h3 style={{
                fontSize: '1.4rem',
                fontWeight: '600',
                marginBottom: '15px',
                color: '#b0b0b0', // تغییر به خاکستری
                textAlign: 'left'
              }}>{benefit.title}</h3>
              <p style={{ margin: '0', fontSize: '1rem', textAlign: 'left' }}>{benefit.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Innovation Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '20px',
          color: '#a0a0a0', // تغییر به خاکستری
          borderLeft: '4px solid #a0a0a0', // تغییر به خاکستری
          paddingLeft: '15px',
          textAlign: 'left'
        }}>Technical Innovation</h2>

        <div style={{
          backgroundColor: 'rgba(96, 96, 96, 0.2)', // تغییر به خاکستری
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid rgba(96, 96, 96, 0.4)' // تغییر به خاکستری
        }}>
          {[
            {
              title: 'Advanced Analytics Engine',
              content: 'Machine learning for continuous improvement, natural language processing for written responses, behavioral analytics from interaction data, and predictive modeling for behavioral tendencies.'
            },
            {
              title: 'Dynamic Visualization',
              content: 'Psychological radar charts for multi-dimensional trait mapping, network diagrams showing connections between psychological systems, and interactive dashboards for deep-dive analysis.'
            },
            {
              title: 'Privacy-First Architecture',
              content: 'End-to-end encryption of psychological profiles, consent-based data sharing, complete user control over data ownership, and non-discriminatory design principles.'
            }
          ].map((innovation, index) => (
            <div key={index} style={{
              marginBottom: index < 2 ? '20px' : '0',
              paddingBottom: index < 2 ? '20px' : '0',
              borderBottom: index < 2 ? '1px solid rgba(96, 96, 96, 0.4)' : 'none', // تغییر به خاکستری
              textAlign: 'left'
            }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '10px',
                color: '#b0b0b0', // تغییر به خاکستری
                textAlign: 'left'
              }}>{innovation.title}</h3>
              <p style={{ margin: '0', fontSize: '1rem', textAlign: 'left' }}>{innovation.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Future of Self-Understanding Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '20px',
          color: '#a0a0a0', // تغییر به خاکستری
          borderLeft: '4px solid #a0a0a0', // تغییر به خاکستری
          paddingLeft: '15px',
          textAlign: 'left'
        }}>The Future of Self-Understanding</h2>

        <div style={{
          backgroundColor: 'rgba(96, 96, 96, 0.2)', // تغییر به خاکستری
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid rgba(96, 96, 96, 0.4)' // تغییر به خاکستری
        }}>
          <div style={{ display: 'grid', gap: '20px' }}>
            {[
              {
                title: 'Longitudinal Tracking',
                content: 'Understanding how your psychological profile evolves over time, tracking changes in personality and cognitive patterns as you grow and develop.'
              },
              {
                title: 'Contextual Analysis',
                content: 'Analyzing how different environments affect your psychological functioning, from work settings to personal relationships and social situations.'
              },
              {
                title: 'Predictive Wellness',
                content: 'Early detection of psychological health risks through pattern analysis, combined with AI coaching for personalized recommendations and growth strategies.'
              }
            ].map((future, index) => (
              <div key={index} style={{
                padding: '20px',
                backgroundColor: 'rgba(128, 128, 128, 0.1)', // تغییر به خاکستری
                borderRadius: '8px',
                borderLeft: '4px solid #888888', // تغییر به خاکستری
                textAlign: 'left'
              }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  marginBottom: '10px',
                  color: '#b0b0b0', // تغییر به خاکستری
                  textAlign: 'left'
                }}>{future.title}</h3>
                <p style={{ margin: '0', fontSize: '1rem', textAlign: 'left' }}>{future.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conclusion Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '20px',
          color: '#ffffff',
          borderLeft: '4px solid #ffffff',
          paddingLeft: '15px',
          textAlign: 'left'
        }}>Conclusion</h2>
        
        <div style={{
          backgroundColor: 'rgba(96, 96, 96, 0.2)', // تغییر به خاکستری
          padding: '30px',
          borderRadius: '10px',
          border: '1px solid rgba(96, 96, 96, 0.4)' // تغییر به خاکستری
        }}>
          <p style={{ marginBottom: '20px', fontSize: '1.1rem', textAlign: 'left' }}>
            Your mind is the most complex and fascinating system in the known universe. For too long, we've navigated life without a comprehensive map of our psychological landscape. SelfCode changes that by providing you with detailed, accurate, and actionable insights into your mental and emotional architecture.
          </p>

          <p style={{ marginBottom: '20px', fontSize: '1.1rem', textAlign: 'left' }}>
            Understanding your SelfCode isn't just about self-knowledge—it's about self-mastery. When you understand the intricate patterns of your psychology, you can make better decisions, build stronger relationships, choose more suitable careers, and live a more authentic and fulfilling life.
          </p>

          <p style={{ marginBottom: '0', fontSize: '1.1rem', fontStyle: 'italic', textAlign: 'left' }}>
            Your psychological DNA is unique. Your SelfCode reveals what makes you, you.
          </p>
        </div>
      </section>

      {/* Author Section */}
      <footer style={{
        textAlign: 'left',
        paddingTop: '30px',
        borderTop: '2px solid rgba(128, 128, 128, 0.3)' // تغییر به خاکستری
      }}>
        <p style={{
          fontSize: '1.1rem',
          fontStyle: 'italic',
          color: '#a0a0a0',
          margin: '0',
          textAlign: 'left'
        }}>
          <strong style={{ color: '#ffffff' }}>Created by Nima Saraeian</strong><br />
          Digital Psychology Researcher | Selphlyze Project Author<br />
          Pioneer in Psychological Profiling Technology
        </p>
      </footer>
    </div>
  );
}