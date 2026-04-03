import React from 'react';
import { FaLinkedin } from 'react-icons/fa';

const TEAM_MEMBERS = [
    {
        name: 'Richa Grover',
        linkedin: 'https://www.linkedin.com/in/richa-grover-960b3915/',
    },
    {
        name: 'Arpit Raj',
        linkedin: 'https://www.linkedin.com/in/arpitrajcse',
    },
    {
        name: 'Paras Jain',
        linkedin: 'https://www.linkedin.com/in/paras-jain-9b4a4023b/',
    },
];

export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-800 mt-12 bg-[#0a0d14]">
            <div className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col items-center gap-5">

                {/* Brand Logo and name */}
                <div className="flex flex-col items-center gap-2 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        <img 
                            src="/team_logo.jpg" 
                            alt="Fullstack Ninjas Logo" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="text-xl font-bold text-white mt-1">Fullstack Ninjas</p>
                </div>

                {/* Team members */}
                <div className="flex flex-wrap justify-center gap-6">
                    {TEAM_MEMBERS.map(({ name, linkedin }) => (
                        <div key={name} className="flex items-center gap-2">
                            <span className="text-sm text-gray-300 font-medium">{name}</span>
                            <a
                                href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${name} on LinkedIn`}
                                className="text-gray-500 hover:text-blue-400 transition-all duration-200 hover:scale-125 inline-flex"
                            >
                                <FaLinkedin size={18} />
                            </a>
                        </div>
                    ))}
                </div>

                {/* Copyright */}
                <p className="text-xs text-gray-600">
                    © 2026 Fullstack Ninjas · Supply Chain Fraud Intelligence
                </p>
            </div>
        </footer>
    );
}
