import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS, INITIAL_DATA, getStored, setStored } from '../data/sharedData.js';

export default function PortfolioWebsite({ onNavigateToAdmin }) {
  const [profile, setProfile] = useState(() => getStored(STORAGE_KEYS.PROFILE, INITIAL_DATA.profile));
  const [tools, setTools] = useState(() => getStored(STORAGE_KEYS.TOOLS, INITIAL_DATA.tools));
  const [projects, setProjects] = useState(() => getStored(STORAGE_KEYS.PROJECTS, INITIAL_DATA.projects));

  // Modal states
  const [selectedProject, setSelectedProject] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Sync state if admin updates in another tab or locally
  useEffect(() => {
    const handleStorage = () => {
      setProfile(getStored(STORAGE_KEYS.PROFILE, INITIAL_DATA.profile));
      setTools(getStored(STORAGE_KEYS.TOOLS, INITIAL_DATA.tools));
      setProjects(getStored(STORAGE_KEYS.PROJECTS, INITIAL_DATA.projects));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleSendInquiry = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    const currentInquiries = getStored(STORAGE_KEYS.INQUIRIES, []);
    const newInquiry = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      read: false
    };

    setStored(STORAGE_KEYS.INQUIRIES, [newInquiry, ...currentInquiries]);
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setContactOpen(false);
      setFormData({ name: '', email: '', message: '' });
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#1A1A1A] font-sans selection:bg-[#460C14] selection:text-white pb-16">
      
      {/* Top Floating Utility Bar */}
      <header className="sticky top-0 z-40 bg-[#F4EFE6]/95 backdrop-blur-md border-b border-[#E3DAC9] px-6 py-3.5 transition-all">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#460C14] text-[#F4EFE6] flex items-center justify-center font-serif font-black text-sm shadow-sm">
              {profile.name ? profile.name.charAt(0) : 'D'}
            </span>
            <span className="font-serif font-black tracking-widest text-[#460C14] text-base md:text-lg uppercase">
              {profile.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setContactOpen(true)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#460C14] text-white hover:bg-[#60121D] shadow-sm hover:shadow transition-all duration-200 active:scale-95"
            >
              Get In Touch
            </button>
            <button
              onClick={onNavigateToAdmin}
              title="Open SaaS Management Console"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[#460C14] text-[#460C14] hover:bg-[#460C14] hover:text-white transition-all duration-200 flex items-center gap-1.5 active:scale-95"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6">

        {/* 1. HERO SECTION */}
        <section className="relative pt-6 pb-6">
          <div className="text-center">
            <h1 className="font-serif font-black text-6xl md:text-8xl tracking-tight text-[#460C14] leading-none uppercase drop-shadow-sm">
              PORTFOLIO
            </h1>
            <p className="font-serif italic text-2xl md:text-3xl text-[#460C14] tracking-widest mt-1">
              {profile.name}
            </p>
          </div>

          <div className="relative mt-6 flex justify-between items-end gap-4">
            <div className="w-1/3 text-left pb-4">
              <h2 className="font-bold text-sm tracking-widest uppercase text-[#460C14] leading-tight">
                {profile.title ? profile.title.split(' ').map((word, i) => (
                  <span key={i} className="block">{word}</span>
                )) : <span>UX/UI WEB DESIGNER</span>}
              </h2>
              <p className="text-[11px] text-[#7A6B63] mt-2.5 tracking-wide font-medium leading-relaxed">
                {profile.headline}
              </p>
            </div>

            {/* Overlapping Hero Cutout with arched crown */}
            <div className="w-2/3 max-w-[320px] ml-auto">
              <div className="relative group">
                <img
                  src={profile.heroImage}
                  alt={profile.name}
                  className="w-full h-80 object-cover rounded-t-full shadow-2xl border-4 border-[#F4EFE6] transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#460C14]/40 via-transparent to-transparent pointer-events-none rounded-t-full" />
                <div className="absolute -bottom-2 -right-2 bg-[#460C14] text-[#F4EFE6] text-[10px] font-mono tracking-widest uppercase py-1 px-2.5 rounded-full shadow border border-[#F4EFE6]/30">
                  EST. 2024
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. ABOUT ME SECTION */}
        <section className="bg-[#460C14] text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl my-6 border border-[#60121D]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Bio Column */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#E3DAC9]/80 animate-ping"></span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E3DAC9]">Editorial Bio</span>
              </div>
              <h3 className="font-serif font-bold text-2xl md:text-3xl tracking-wider uppercase mb-4 text-[#F4EFE6]">
                ABOUT ME
              </h3>
              <p className="text-xs md:text-sm text-[#F4EFE6]/85 leading-relaxed font-light mb-6">
                {profile.aboutText}
              </p>

              {/* Skills / Tools Capsule from Reference */}
              <div className="mt-4">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#F4EFE6]/60 block mb-2">
                  Skills & Tools
                </span>
                <div className="bg-white text-[#460C14] px-4 py-2 rounded-full inline-flex items-center gap-3 shadow-md flex-wrap">
                  {tools.map((t) => (
                    <span key={t.id} className="text-xs font-bold tracking-wider flex items-center gap-1.5" title={t.name}>
                      <span className="font-mono">{t.icon}</span>
                      <span className="hidden sm:inline text-[11px] font-semibold">{t.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mosaic & Portrait Column */}
            <div className="relative flex justify-center py-2">
              {/* Geometric 5x5 Checkerboard Mosaic Grid Graphic */}
              <div className="absolute -inset-2 grid grid-cols-5 gap-1.5 opacity-20 pointer-events-none">
                {Array.from({ length: 25 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-8 w-8 rounded-sm transition-opacity duration-300 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>

              <div className="relative z-10 group">
                <img
                  src={profile.aboutImage}
                  alt="Portrait"
                  className="w-48 h-60 object-cover rounded-2xl shadow-2xl border-2 border-white/20 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. MY WORKS SECTION */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-serif font-black text-2xl md:text-3xl tracking-wider uppercase text-[#460C14]">
                MY WORKS
              </h3>
              <p className="text-[11px] text-[#7A6B63] font-light">Curated interactive & digital design showcases</p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#7A6B63] bg-[#E3DAC9]/60 px-3 py-1 rounded-full border border-[#E3DAC9]">
              Selected Cases ({projects.length})
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="group relative cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#E3DAC9]"
              >
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#460C14]/0 group-hover:bg-[#460C14]/40 transition-colors flex items-center justify-center">
                    <span className="text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity bg-[#460C14]/90 px-3.5 py-1.5 rounded-full shadow-lg border border-white/20">
                      View Case
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white">
                  <h4 className="font-serif font-bold text-xs tracking-wide text-[#460C14] truncate">
                    {proj.title}
                  </h4>
                  <p className="text-[10px] text-[#7A6B63] truncate mt-0.5">
                    {proj.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. CONTACTS FOOTER BANNER */}
        <footer className="bg-[#460C14] text-white rounded-2xl p-6 mt-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-[#60121D]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300">Available For Hire</span>
            </div>
            <h4 className="font-serif font-bold text-xl uppercase tracking-wider text-[#F4EFE6] mt-1">
              CONTACTS
            </h4>
            <p className="text-xs text-[#F4EFE6]/70 mt-0.5">Available for worldwide collaborations & contracts.</p>
          </div>

          <div className="text-xs space-y-1.5 text-center md:text-right font-light text-[#F4EFE6]/90">
            <p>
              ✈ Telegram:{' '}
              <a
                href={profile.telegram.startsWith('http') ? profile.telegram : `https://t.me/${profile.telegram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline hover:text-white transition-colors"
              >
                {profile.telegram}
              </a>
            </p>
            <p>
              📞 Phone:{' '}
              <a href={`tel:${profile.phone}`} className="font-medium hover:text-white transition-colors">
                {profile.phone}
              </a>
            </p>
            <p>
              ✉ Email:{' '}
              <a href={`mailto:${profile.email}`} className="font-medium underline hover:text-white transition-colors">
                {profile.email}
              </a>
            </p>
          </div>
        </footer>

      </main>

      {/* Case Study Modal Popup */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F4EFE6] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#460C14]/20 animate-fade-in">
            <div className="relative aspect-video">
              <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-3 right-3 bg-[#460C14] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md hover:bg-[#60121D] transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A6B63] bg-[#E3DAC9] px-2.5 py-1 rounded-full">
                {selectedProject.category}
              </span>
              <h3 className="font-serif font-black text-2xl text-[#460C14] mt-2 mb-2">
                {selectedProject.title}
              </h3>
              <p className="text-xs text-[#554A43] leading-relaxed mb-6 font-light">
                {selectedProject.desc}
              </p>
              <div className="flex gap-3">
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-center py-2.5 bg-[#460C14] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#60121D] shadow transition-colors"
                >
                  Live Preview ↗
                </a>
                <button
                  onClick={() => { setSelectedProject(null); setContactOpen(true); }}
                  className="px-4 py-2.5 border border-[#460C14] text-[#460C14] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#460C14]/10 transition-colors"
                >
                  Inquire
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Inquiry Modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F4EFE6] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#460C14]/30 relative animate-fade-in">
            <button
              onClick={() => setContactOpen(false)}
              className="absolute top-4 right-4 text-[#460C14] hover:opacity-70 font-bold w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#E3DAC9]/50 transition-colors"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#460C14]"></span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A6B63]">Client Dispatch</span>
            </div>
            <h3 className="font-serif font-black text-2xl text-[#460C14] uppercase">Send Message</h3>
            <p className="text-xs text-[#7A6B63] mb-4">Your note routes straight into the private Admin Inbox.</p>

            {formSent ? (
              <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-center text-xs font-semibold animate-fade-in">
                ✓ Message received! Sent to the Admin Panel.
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#460C14]">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border border-[#E3DAC9] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#460C14] transition-colors"
                    placeholder="e.g. Elena Rostova"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#460C14]">Your Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-[#E3DAC9] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#460C14] transition-colors"
                    placeholder="elena@example.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#460C14]">Project Brief / Message</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-[#E3DAC9] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#460C14] transition-colors"
                    placeholder="Tell me about your project, timeline, and goals..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#460C14] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#60121D] shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Send Inquiry</span>
                  <span>➔</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
