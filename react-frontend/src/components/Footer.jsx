import React from 'react';
import { FaLinkedin } from 'react-icons/fa';

const TEAM_MEMBERS = [
    { name: 'Richa Grover',  linkedin: 'https://www.linkedin.com/in/richa-grover-960b3915/' },
    { name: 'Arpit Raj',     linkedin: 'https://www.linkedin.com/in/arpitrajcse' },
    { name: 'Paras Jain',    linkedin: 'https://www.linkedin.com/in/paras-jain-9b4a4023b/' },
];

export default function Footer() {
    return (
        <footer style={{
            marginTop: 64,
            borderTop: '1px solid var(--border-subtle)',
            padding: '48px 24px',
            backgroundColor: 'var(--bg-deep)',
        }}>
            <div style={{
                maxWidth: 1600, margin: '0 auto',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <img 
                        src="/team_logo.jpg" 
                        alt="Fullstack Ninjas Logo" 
                        style={{ 
                            width: 56, 
                            height: 56, 
                            borderRadius: '50%', 
                            objectFit: 'cover',
                            border: '1px solid var(--border-subtle)',
                            boxShadow: 'var(--shadow-soft)' 
                        }} 
                    />
                    <p style={{
                        margin: 0,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        letterSpacing: '0.05em',
                    }}>
                        FULLSTACK NINJAS
                    </p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
                    {TEAM_MEMBERS.map(({ name, linkedin }) => (
                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{name}</span>
                            <a
                                href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${name} on LinkedIn`}
                                style={{ color: 'var(--text-muted)', display: 'inline-flex', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                                <FaLinkedin size={16} />
                            </a>
                        </div>
                    ))}
                </div>

                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    © {new Date().getFullYear()} Fullstack Ninjas. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
