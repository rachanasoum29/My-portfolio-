import React, { useState, useEffect, useMemo } from 'react';
import { 
  STORAGE_KEYS, 
  INITIAL_DATA, 
  getStored, 
  setStored, 
  resetToInitialData, 
  exportAllData, 
  importAllData 
} from '../data/sharedData.js';

export default function AdminPanel({ onNavigateToPortfolio }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => getStored(STORAGE_KEYS.AUTH, false));
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Tab: 'overview' | 'projects' | 'profile' | 'tools' | 'inquiries' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Shared Data State
  const [profile, setProfile] = useState(() => getStored(STORAGE_KEYS.PROFILE, INITIAL_DATA.profile));
  const [projects, setProjects] = useState(() => getStored(STORAGE_KEYS.PROJECTS, INITIAL_DATA.projects));
  const [tools, setTools] = useState(() => getStored(STORAGE_KEYS.TOOLS, INITIAL_DATA.tools));
  const [inquiries, setInquiries] = useState(() => getStored(STORAGE_KEYS.INQUIRIES, []));

  // Notification Toast State
  const [toast, setToast] = useState(null);

  // Modals State
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: '',
    desc: '',
    image: '',
    liveUrl: ''
  });

  // Selected Inquiry Modal
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // New Tool State
  const [newTool, setNewTool] = useState({ name: '', icon: '' });

  // PIN Change State
  const [pinChange, setPinChange] = useState({ oldPin: '', newPin: '', confirmPin: '' });

  // Sync state if changes occur elsewhere
  useEffect(() => {
    const handleStorage = () => {
      setProfile(getStored(STORAGE_KEYS.PROFILE, INITIAL_DATA.profile));
      setProjects(getStored(STORAGE_KEYS.PROJECTS, INITIAL_DATA.projects));
      setTools(getStored(STORAGE_KEYS.TOOLS, INITIAL_DATA.tools));
      setInquiries(getStored(STORAGE_KEYS.INQUIRIES, []));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auth Handlers
  const handleLogin = (e) => {
    e?.preventDefault();
    const storedPin = getStored(STORAGE_KEYS.PIN, '1234');
    if (pinInput === storedPin) {
      setIsAuthenticated(true);
      setStored(STORAGE_KEYS.AUTH, true);
      setPinError('');
      setPinInput('');
      showToast('Authenticated successfully!');
    } else {
      setPinError('Invalid PIN code. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setStored(STORAGE_KEYS.AUTH, false);
    setPinInput('');
  };

  // Profile Save
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setStored(STORAGE_KEYS.PROFILE, profile);
    showToast('Profile updated & synchronized live!');
  };

  // Projects CRUD
  const openNewProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      title: '',
      category: 'Brand Experience',
      desc: '',
      image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=85',
      liveUrl: 'https://'
    });
    setProjectModalOpen(true);
  };

  const openEditProjectModal = (proj) => {
    setEditingProject(proj);
    setProjectForm({ ...proj });
    setProjectModalOpen(true);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;

    let updatedProjects;
    if (editingProject) {
      updatedProjects = projects.map((p) => (p.id === editingProject.id ? { ...p, ...projectForm } : p));
      showToast('Project updated successfully!');
    } else {
      const newProj = {
        id: Date.now().toString(),
        ...projectForm
      };
      updatedProjects = [newProj, ...projects];
      showToast('New project created!');
    }

    setProjects(updatedProjects);
    setStored(STORAGE_KEYS.PROJECTS, updatedProjects);
    setProjectModalOpen(false);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      setStored(STORAGE_KEYS.PROJECTS, updated);
      showToast('Project deleted', 'info');
    }
  };

  // Tools CRUD
  const handleAddTool = (e) => {
    e.preventDefault();
    if (!newTool.name.trim() || !newTool.icon.trim()) return;
    const item = {
      id: Date.now().toString(),
      name: newTool.name.trim(),
      icon: newTool.icon.trim()
    };
    const updated = [...tools, item];
    setTools(updated);
    setStored(STORAGE_KEYS.TOOLS, updated);
    setNewTool({ name: '', icon: '' });
    showToast('New skill tool added!');
  };

  const handleDeleteTool = (id) => {
    const updated = tools.filter((t) => t.id !== id);
    setTools(updated);
    setStored(STORAGE_KEYS.TOOLS, updated);
    showToast('Tool removed', 'info');
  };

  // Inquiries Handlers
  const handleToggleRead = (id) => {
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, read: !inq.read } : inq));
    setInquiries(updated);
    setStored(STORAGE_KEYS.INQUIRIES, updated);
  };

  const handleDeleteInquiry = (id) => {
    if (window.confirm('Delete this inquiry?')) {
      const updated = inquiries.filter((inq) => inq.id !== id);
      setInquiries(updated);
      setStored(STORAGE_KEYS.INQUIRIES, updated);
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      showToast('Inquiry removed');
    }
  };

  const handleClearAllReadInquiries = () => {
    if (window.confirm('Clear all read inquiries?')) {
      const updated = inquiries.filter((inq) => !inq.read);
      setInquiries(updated);
      setStored(STORAGE_KEYS.INQUIRIES, updated);
      showToast('Cleared read inquiries');
    }
  };

  // Settings Handlers
  const handleChangePin = (e) => {
    e.preventDefault();
    const currentPin = getStored(STORAGE_KEYS.PIN, '1234');
    if (pinChange.oldPin !== currentPin) {
      alert('Current PIN is incorrect.');
      return;
    }
    if (pinChange.newPin.length < 4) {
      alert('New PIN must be at least 4 digits.');
      return;
    }
    if (pinChange.newPin !== pinChange.confirmPin) {
      alert('New PIN and Confirm PIN do not match.');
      return;
    }
    setStored(STORAGE_KEYS.PIN, pinChange.newPin);
    setPinChange({ oldPin: '', newPin: '', confirmPin: '' });
    showToast('Admin PIN changed successfully!');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all portfolio data to factory defaults? All custom changes will be replaced.')) {
      resetToInitialData();
      setProfile(INITIAL_DATA.profile);
      setProjects(INITIAL_DATA.projects);
      setTools(INITIAL_DATA.tools);
      setInquiries([]);
      showToast('Portfolio reset to initial demo state!', 'info');
    }
  };

  const handleExportJSON = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Portfolio backup JSON exported!');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        importAllData(json);
        setProfile(getStored(STORAGE_KEYS.PROFILE, INITIAL_DATA.profile));
        setProjects(getStored(STORAGE_KEYS.PROJECTS, INITIAL_DATA.projects));
        setTools(getStored(STORAGE_KEYS.TOOLS, INITIAL_DATA.tools));
        setInquiries(getStored(STORAGE_KEYS.INQUIRIES, []));
        showToast('Portfolio backup imported successfully!');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Inquiries stats
  const unreadCount = useMemo(() => inquiries.filter((inq) => !inq.read).length, [inquiries]);

  // If not authenticated, render PIN Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#140608] text-neutral-100 flex items-center justify-center p-4 selection:bg-[#460C14] selection:text-white font-sans">
        <div className="w-full max-w-md bg-[#1F0A0E] border border-[#460C14] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#60121D]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#460C14]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center relative z-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#460C14] border border-[#60121D] flex items-center justify-center text-2xl shadow-lg mb-4 text-[#F4EFE6]">
              ❖
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#E3DAC9]/60">SaaS Console Gateway</span>
            <h1 className="font-serif font-black text-2xl text-[#F4EFE6] mt-1 uppercase tracking-wide">
              Editorial Studio Admin
            </h1>
            <p className="text-xs text-[#E3DAC9]/70 mt-1">
              Enter your access PIN to unlock the control suite
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4 relative z-10">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#E3DAC9]/80">Admin PIN</label>
                <span className="text-[10px] text-[#E3DAC9]/50">Default PIN: 1234</span>
              </div>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                placeholder="••••"
                className="w-full bg-[#140608] border border-[#60121D] rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] text-[#F4EFE6] placeholder:text-neutral-700 focus:outline-none focus:border-[#E3DAC9] transition-colors"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 text-center font-medium bg-rose-950/40 border border-rose-900/60 rounded-lg py-2">
                {pinError}
              </p>
            )}

            {/* Quick Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '➔'].map((key, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => {
                    if (key === 'C') setPinInput('');
                    else if (key === '➔') handleLogin();
                    else if (pinInput.length < 8) setPinInput((prev) => prev + key);
                  }}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    key === '➔'
                      ? 'bg-[#460C14] hover:bg-[#60121D] text-white border border-[#8E1727]'
                      : key === 'C'
                      ? 'bg-neutral-900/70 hover:bg-neutral-800 text-neutral-400'
                      : 'bg-neutral-900/40 hover:bg-neutral-800/80 text-neutral-200 border border-neutral-800/60'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#460C14] hover:bg-[#60121D] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg transition-colors border border-[#8E1727]"
            >
              Unlock Console
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#460C14]/60 text-center relative z-10">
            <button
              type="button"
              onClick={onNavigateToPortfolio}
              className="text-xs text-[#E3DAC9]/70 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Return to Public Editorial Portfolio</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard Layout
  return (
    <div className="min-h-screen bg-[#0F0406] text-neutral-200 font-sans flex flex-col md:flex-row selection:bg-[#460C14] selection:text-white">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#460C14] text-white border border-[#8E1727] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#18070A] border-r border-[#380A10] flex flex-col justify-between p-4 shrink-0">
        <div>
          {/* Brand Monogram */}
          <div className="flex items-center justify-between pb-5 border-b border-[#380A10] mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#460C14] border border-[#60121D] flex items-center justify-center font-serif font-black text-white text-base shadow">
                {profile.name ? profile.name.charAt(0) : 'D'}
              </div>
              <div>
                <h2 className="font-serif font-bold text-sm text-[#F4EFE6] tracking-wide uppercase leading-none">
                  {profile.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] font-mono text-[#E3DAC9]/70 uppercase tracking-widest">SaaS Console</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
              { id: 'projects', label: 'Works & Projects', icon: '📁', count: projects.length },
              { id: 'profile', label: 'Profile & Bio', icon: '👤' },
              { id: 'tools', label: 'Skills & Tools', icon: '🛠', count: tools.length },
              { id: 'inquiries', label: 'Inquiries Inbox', icon: '✉', badge: unreadCount },
              { id: 'settings', label: 'Settings & Data', icon: '⚙' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-[#460C14] text-[#F4EFE6] font-semibold shadow border border-[#60121D]'
                    : 'text-neutral-300 hover:bg-[#250B0F] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && !item.badge && (
                  <span className="text-[10px] text-neutral-400 font-mono bg-neutral-900/60 px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-4 border-t border-[#380A10] space-y-2">
          <button
            onClick={onNavigateToPortfolio}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-[#2B0E13] hover:bg-[#3D141A] text-[#F4EFE6] border border-[#60121D] transition-colors"
          >
            <span>👁</span>
            <span>View Public Website</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-rose-300 hover:bg-neutral-900/40 transition-colors"
          >
            <span>🔒</span>
            <span>Lock / Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">

        {/* TOP UTILITY HEADER */}
        <header className="h-16 bg-[#140608]/90 backdrop-blur-md border-b border-[#380A10] px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E3DAC9]/60">Studio Admin /</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F4EFE6]">
              {activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Sync Active
            </span>
            {activeTab === 'projects' && (
              <button
                onClick={openNewProjectModal}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#460C14] hover:bg-[#60121D] text-white border border-[#8E1727] transition-colors"
              >
                + New Project
              </button>
            )}
            <button
              onClick={onNavigateToPortfolio}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-[#60121D] text-[#E3DAC9] hover:bg-[#460C14] hover:text-white transition-colors"
            >
              Public View ↗
            </button>
          </div>
        </header>

        {/* TAB WORKSPACE CONTAINER */}
        <main className="p-6 flex-1 max-w-6xl w-full mx-auto">

          {/* ==================================================== */}
          {/* TAB 1: OVERVIEW */}
          {/* ==================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-[#2B0E13] to-[#18070A] border border-[#460C14] rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Editorial Studio v1.0</span>
                  <h2 className="font-serif font-black text-2xl md:text-3xl text-[#F4EFE6] mt-1">
                    Welcome back, {profile.name}
                  </h2>
                  <p className="text-xs text-[#E3DAC9]/75 mt-1 max-w-xl">
                    Manage your portfolio content, preview projects, and review client dispatch inquiries in real-time.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="px-4 py-2 bg-[#460C14] hover:bg-[#60121D] text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-[#8E1727] transition-colors"
                  >
                    Manage Works
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="px-4 py-2 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200 rounded-xl text-xs font-semibold border border-neutral-700/60 transition-colors"
                  >
                    Edit Bio
                  </button>
                </div>
              </div>

              {/* KPI Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#18070A] border border-[#380A10] rounded-2xl p-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Selected Works</span>
                    <span className="text-base">📁</span>
                  </div>
                  <div className="text-2xl font-black text-[#F4EFE6] mt-2 font-serif">{projects.length}</div>
                  <div className="text-[10px] text-neutral-400 mt-1">Bento Grid Items</div>
                </div>

                <div className="bg-[#18070A] border border-[#380A10] rounded-2xl p-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Skills / Tools</span>
                    <span className="text-base">🛠</span>
                  </div>
                  <div className="text-2xl font-black text-[#F4EFE6] mt-2 font-serif">{tools.length}</div>
                  <div className="text-[10px] text-neutral-400 mt-1">Pill Capsule Icons</div>
                </div>

                <div className="bg-[#18070A] border border-[#380A10] rounded-2xl p-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Total Inquiries</span>
                    <span className="text-base">✉</span>
                  </div>
                  <div className="text-2xl font-black text-[#F4EFE6] mt-2 font-serif">{inquiries.length}</div>
                  <div className="text-[10px] text-neutral-400 mt-1">Submissions Saved</div>
                </div>

                <div className={`border rounded-2xl p-4 ${
                  unreadCount > 0 ? 'bg-[#33080E] border-rose-600/60' : 'bg-[#18070A] border-[#380A10]'
                }`}>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-300">Unread Inquiries</span>
                    <span className="text-base">🔔</span>
                  </div>
                  <div className="text-2xl font-black text-rose-400 mt-2 font-serif">{unreadCount}</div>
                  <div className="text-[10px] text-neutral-400 mt-1">Requires Attention</div>
                </div>
              </div>

              {/* Profile Snapshot & Recent Inquiries Split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Bio Preview */}
                <div className="lg:col-span-1 bg-[#18070A] border border-[#380A10] rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#E3DAC9]/60">Public Persona</span>
                    <h3 className="font-serif font-bold text-lg text-[#F4EFE6] mt-1">{profile.name}</h3>
                    <p className="text-xs text-[#E3DAC9]/70 font-mono mt-0.5">{profile.title}</p>
                    
                    <div className="mt-4 flex items-center gap-3">
                      <img
                        src={profile.heroImage}
                        alt="Hero"
                        className="w-16 h-20 object-cover rounded-t-full border border-[#460C14] shadow"
                      />
                      <img
                        src={profile.aboutImage}
                        alt="About"
                        className="w-16 h-20 object-cover rounded-xl border border-white/20 shadow"
                      />
                      <div className="text-[11px] text-neutral-400 space-y-1">
                        <p className="truncate">✈ {profile.telegram}</p>
                        <p className="truncate">📞 {profile.phone}</p>
                        <p className="truncate">✉ {profile.email}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className="w-full mt-4 py-2 rounded-xl text-xs font-semibold bg-[#2B0E13] hover:bg-[#3D141A] text-[#F4EFE6] border border-[#60121D] transition-colors"
                  >
                    Edit Public Persona →
                  </button>
                </div>

                {/* Recent Inquiries List */}
                <div className="lg:col-span-2 bg-[#18070A] border border-[#380A10] rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#E3DAC9]/60">Recent Client Notes</span>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="text-xs text-rose-300 hover:underline"
                    >
                      View All Inbox ({inquiries.length})
                    </button>
                  </div>

                  {inquiries.length === 0 ? (
                    <div className="py-12 text-center text-neutral-500 text-xs">
                      No client inquiries yet. Messages sent via the public contact popup will show up here.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {inquiries.slice(0, 4).map((inq) => (
                        <div
                          key={inq.id}
                          onClick={() => { setSelectedInquiry(inq); setActiveTab('inquiries'); }}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            !inq.read
                              ? 'bg-[#2A0C11] border-rose-900/80 text-white'
                              : 'bg-neutral-900/40 border-neutral-800/60 text-neutral-400 hover:text-neutral-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${!inq.read ? 'bg-rose-500' : 'bg-transparent'}`} />
                            <div>
                              <div className="text-xs font-semibold text-white">{inq.name}</div>
                              <div className="text-[11px] text-neutral-400 truncate max-w-sm">{inq.message || inq.email}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400">{inq.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: PROJECTS MANAGEMENT (CRUD) */}
          {/* ==================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#18070A] border border-[#380A10] p-4 rounded-2xl">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#F4EFE6]">Editorial Projects ({projects.length})</h3>
                  <p className="text-xs text-neutral-400">Manage case studies featured on the public 6-item bento grid.</p>
                </div>
                <button
                  onClick={openNewProjectModal}
                  className="px-4 py-2 bg-[#460C14] hover:bg-[#60121D] text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-[#8E1727] transition-colors"
                >
                  + Add Project
                </button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-[#18070A] border border-[#380A10] rounded-2xl overflow-hidden shadow-lg group hover:border-[#60121D] transition-all"
                  >
                    <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="text-[9px] font-mono uppercase tracking-wider bg-black/70 backdrop-blur-md text-[#E3DAC9] px-2 py-0.5 rounded-full border border-white/10">
                          {proj.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-serif font-bold text-sm text-[#F4EFE6] truncate">{proj.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">{proj.desc}</p>
                      
                      <div className="mt-4 pt-3 border-t border-[#380A10] flex items-center justify-between">
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#E3DAC9] hover:underline flex items-center gap-1"
                        >
                          <span>Live Link</span>
                          <span>↗</span>
                        </a>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditProjectModal(proj)}
                            className="px-2.5 py-1 text-[11px] bg-[#2B0E13] hover:bg-[#460C14] text-white rounded-lg border border-[#60121D] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="px-2.5 py-1 text-[11px] bg-neutral-900 hover:bg-rose-950 text-rose-300 rounded-lg border border-neutral-800 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: PROFILE & BIO CUSTOMIZER */}
          {/* ==================================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-[#18070A] border border-[#380A10] p-4 rounded-2xl">
                <h3 className="font-serif font-bold text-xl text-[#F4EFE6]">Public Identity & Biography</h3>
                <p className="text-xs text-neutral-400">Changes update directly on the luxury editorial portfolio header, hero arch, and footer.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form Inputs (2 Columns) */}
                <div className="lg:col-span-2 bg-[#18070A] border border-[#380A10] rounded-2xl p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#E3DAC9]/80 block mb-1">
                        Full Display Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#E3DAC9]/80 block mb-1">
                        Role Title (e.g. UX/UI WEB DESIGNER)
                      </label>
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                        className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#E3DAC9]/80 block mb-1">
                      Hero Headline / Tagline
                    </label>
                    <input
                      type="text"
                      value={profile.headline}
                      onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                      className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#E3DAC9]/80 block mb-1">
                      About Me Biography (Editorial Card)
                    </label>
                    <textarea
                      rows={4}
                      value={profile.aboutText}
                      onChange={(e) => setProfile({ ...profile, aboutText: e.target.value })}
                      className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D] leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#380A10]">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#E3DAC9]/80 block mb-1">
                        Telegram Handle
                      </label>
                      <input
                        type="text"
                        value={profile.telegram}
                        onChange={(e) => setProfile({ ...profile, telegram: e.target.value })}
                        className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#E3DAC9]/80 block mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#E3DAC9]/80 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#380A10]">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#E3DAC9]/80 block mb-1">
                        Hero Arched Cutout Image URL
                      </label>
                      <input
                        type="url"
                        value={profile.heroImage}
                        onChange={(e) => setProfile({ ...profile, heroImage: e.target.value })}
                        className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#E3DAC9]/80 block mb-1">
                        About Section Portrait URL
                      </label>
                      <input
                        type="url"
                        value={profile.aboutImage}
                        onChange={(e) => setProfile({ ...profile, aboutImage: e.target.value })}
                        className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#460C14] hover:bg-[#60121D] text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow border border-[#8E1727] transition-colors"
                    >
                      Save Profile Changes ➔
                    </button>
                  </div>
                </div>

                {/* Visual Preview Side Card */}
                <div className="lg:col-span-1 bg-[#18070A] border border-[#380A10] rounded-2xl p-5 flex flex-col items-center text-center">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#E3DAC9]/60 mb-3">Live Visual Previews</span>
                  
                  <div className="w-full max-w-[200px] bg-[#F4EFE6] p-3 rounded-2xl shadow-xl text-[#460C14] border border-[#E3DAC9]">
                    <div className="relative">
                      <img
                        src={profile.heroImage}
                        alt="Hero Preview"
                        className="w-full h-36 object-cover rounded-t-full border-2 border-[#F4EFE6] shadow"
                      />
                    </div>
                    <div className="mt-2 font-serif font-black text-xs uppercase truncate">{profile.name}</div>
                    <div className="text-[9px] font-bold text-[#7A6B63] truncate">{profile.title}</div>
                  </div>

                  <div className="mt-4 w-full max-w-[200px] bg-[#460C14] p-3 rounded-2xl shadow-xl text-white border border-[#60121D]">
                    <span className="text-[9px] font-mono text-[#E3DAC9]/80 uppercase block mb-1">About Frame</span>
                    <img
                      src={profile.aboutImage}
                      alt="About Preview"
                      className="w-full h-28 object-cover rounded-xl border border-white/20 shadow"
                    />
                  </div>
                </div>

              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: TOOLS & STACK */}
          {/* ==================================================== */}
          {activeTab === 'tools' && (
            <div className="space-y-6">
              <div className="bg-[#18070A] border border-[#380A10] p-4 rounded-2xl">
                <h3 className="font-serif font-bold text-xl text-[#F4EFE6]">Skills & Tools ({tools.length})</h3>
                <p className="text-xs text-neutral-400">These software icons appear inside the white pill capsule on the About Me card.</p>
              </div>

              {/* Add New Tool Form */}
              <form onSubmit={handleAddTool} className="bg-[#18070A] border border-[#380A10] rounded-2xl p-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E3DAC9]/60 block mb-3">Add New Tool to Capsule</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Tool Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Blender"
                      value={newTool.name}
                      onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                      className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Symbol / Icon (1-3 chars)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ◈ or Bl"
                      value={newTool.icon}
                      onChange={(e) => setNewTool({ ...newTool, icon: e.target.value })}
                      className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D] font-mono text-center"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#460C14] hover:bg-[#60121D] text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-[#8E1727] transition-colors"
                    >
                      + Add Tool
                    </button>
                  </div>
                </div>

                {/* Quick Icon Presets */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-neutral-500 font-mono">Suggested:</span>
                  {[
                    { name: 'Figma', icon: '❖' },
                    { name: 'Photoshop', icon: 'Ps' },
                    { name: 'Illustrator', icon: 'Ai' },
                    { name: 'After Effects', icon: 'Ae' },
                    { name: 'Cinema 4D', icon: '3D' },
                    { name: 'Blender', icon: '◈' },
                    { name: 'Framer', icon: '⨁' },
                    { name: 'Protopie', icon: '◇' }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewTool({ name: p.name, icon: p.icon })}
                      className="text-[10px] font-mono bg-neutral-900 hover:bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-800 transition-colors"
                    >
                      {p.icon} {p.name}
                    </button>
                  ))}
                </div>
              </form>

              {/* Tools List Preview Capsule */}
              <div className="bg-[#18070A] border border-[#380A10] rounded-2xl p-5 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E3DAC9]/60 block">
                  Public Capsule Rendering Preview
                </span>
                
                {/* Visual rendering of white pill */}
                <div className="bg-[#460C14] p-4 rounded-2xl flex items-center justify-center border border-[#60121D]">
                  <div className="bg-white text-[#460C14] px-4 py-2 rounded-full inline-flex items-center gap-3 shadow-md flex-wrap">
                    {tools.map((t) => (
                      <span key={t.id} className="text-xs font-bold tracking-wider flex items-center gap-1.5">
                        <span className="font-mono">{t.icon}</span>
                        <span className="text-[11px] font-semibold">{t.name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Table of Tools */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                  {tools.map((t) => (
                    <div
                      key={t.id}
                      className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#2B0E13] text-[#F4EFE6] flex items-center justify-center text-xs font-mono font-bold">
                          {t.icon}
                        </span>
                        <span className="text-xs font-semibold text-white">{t.name}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteTool(t.id)}
                        className="text-neutral-500 hover:text-rose-400 text-xs px-1.5 py-0.5 rounded transition-colors"
                        title="Remove tool"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: INQUIRIES INBOX */}
          {/* ==================================================== */}
          {activeTab === 'inquiries' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#18070A] border border-[#380A10] p-4 rounded-2xl">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#F4EFE6]">
                    Client Dispatch Inbox ({inquiries.length})
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Messages submitted from the "Get In Touch" popup form on the public site.
                  </p>
                </div>
                {inquiries.some((i) => i.read) && (
                  <button
                    onClick={handleClearAllReadInquiries}
                    className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs font-medium border border-neutral-700 transition-colors"
                  >
                    Clear Read Messages
                  </button>
                )}
              </div>

              {inquiries.length === 0 ? (
                <div className="bg-[#18070A] border border-[#380A10] rounded-2xl p-16 text-center">
                  <div className="text-4xl mb-3">✉</div>
                  <h4 className="font-serif font-bold text-base text-neutral-300">Your Inbox is Clean</h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    When visitors submit the contact form on your portfolio website, messages are automatically saved here in real-time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className={`border rounded-2xl p-4 transition-all ${
                        !inq.read
                          ? 'bg-[#240A0F] border-rose-800/80 shadow-lg'
                          : 'bg-[#18070A] border-[#380A10]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${!inq.read ? 'bg-rose-500 animate-pulse' : 'bg-neutral-600'}`} />
                          <span className="font-bold text-sm text-white">{inq.name}</span>
                          <span className="text-xs text-neutral-400 font-mono">({inq.email})</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#E3DAC9]/60">{inq.date}</span>
                      </div>

                      <p className="text-xs text-neutral-300 bg-black/30 p-3 rounded-xl border border-white/5 whitespace-pre-wrap leading-relaxed">
                        {inq.message || <span className="italic text-neutral-500">No project brief provided.</span>}
                      </p>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <a
                            href={`mailto:${inq.email}?subject=Regarding%20your%20project%20inquiry&body=Hi%20${encodeURIComponent(inq.name)},%0D%0A%0D%0A`}
                            className="px-3 py-1 bg-[#460C14] hover:bg-[#60121D] text-white rounded-lg text-xs font-semibold border border-[#8E1727] transition-colors"
                          >
                            Reply via Email ➔
                          </a>
                          <button
                            onClick={() => handleToggleRead(inq.id)}
                            className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg text-xs font-medium border border-neutral-700 transition-colors"
                          >
                            Mark {inq.read ? 'Unread' : 'Read'}
                          </button>
                        </div>
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="text-xs text-rose-400 hover:underline px-2 py-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 6: SETTINGS & BACKUP */}
          {/* ==================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-[#18070A] border border-[#380A10] p-4 rounded-2xl">
                <h3 className="font-serif font-bold text-xl text-[#F4EFE6]">Console Settings & Data Backups</h3>
                <p className="text-xs text-neutral-400">Configure security PIN, export full portfolio backups, or reset demo data.</p>
              </div>

              {/* PIN Code Management */}
              <div className="bg-[#18070A] border border-[#380A10] rounded-2xl p-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E3DAC9]/60 block mb-2">Security Credentials</span>
                <h4 className="font-serif font-bold text-base text-white mb-4">Change Admin Access PIN</h4>
                
                <form onSubmit={handleChangePin} className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Current PIN</label>
                    <input
                      type="password"
                      required
                      value={pinChange.oldPin}
                      onChange={(e) => setPinChange({ ...pinChange, oldPin: e.target.value })}
                      className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">New PIN</label>
                    <input
                      type="password"
                      required
                      value={pinChange.newPin}
                      onChange={(e) => setPinChange({ ...pinChange, newPin: e.target.value })}
                      className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Confirm New PIN</label>
                    <input
                      type="password"
                      required
                      value={pinChange.confirmPin}
                      onChange={(e) => setPinChange({ ...pinChange, confirmPin: e.target.value })}
                      className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#460C14] hover:bg-[#60121D] text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-[#8E1727] transition-colors"
                    >
                      Update Access PIN
                    </button>
                  </div>
                </form>
              </div>

              {/* Data Import / Export */}
              <div className="bg-[#18070A] border border-[#380A10] rounded-2xl p-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E3DAC9]/60 block mb-2">Data Synchronization</span>
                <h4 className="font-serif font-bold text-base text-white mb-2">Export & Import Portfolio State</h4>
                <p className="text-xs text-neutral-400 mb-4 max-w-xl">
                  Save your entire configuration (profile, projects, tools, inquiries) as a JSON file or restore from a previous backup.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleExportJSON}
                    className="px-4 py-2 bg-[#2B0E13] hover:bg-[#3D141A] text-[#F4EFE6] rounded-xl text-xs font-semibold border border-[#60121D] transition-colors flex items-center gap-2"
                  >
                    <span>📥</span>
                    <span>Download JSON Backup</span>
                  </button>

                  <label className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded-xl text-xs font-semibold border border-neutral-700 cursor-pointer transition-colors flex items-center gap-2">
                    <span>📤</span>
                    <span>Restore From JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Factory Reset */}
              <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 block mb-2">Danger Zone</span>
                <h4 className="font-serif font-bold text-base text-rose-300 mb-1">Reset to Factory Demo State</h4>
                <p className="text-xs text-rose-200/70 mb-4 max-w-xl">
                  This will reset all profile fields, 6 sample projects, tool list, and inquiries to the initial default editorial dataset.
                </p>

                <button
                  onClick={handleResetData}
                  className="px-4 py-2 bg-rose-950 hover:bg-rose-900 text-rose-200 rounded-xl text-xs font-bold uppercase tracking-wider border border-rose-800 transition-colors"
                >
                  Reset All Data to Defaults
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* PROJECT ADD / EDIT MODAL */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18070A] border border-[#460C14] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-fade-in">
            <button
              onClick={() => setProjectModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white font-bold"
            >
              ✕
            </button>
            <h3 className="font-serif font-black text-xl text-[#F4EFE6]">
              {editingProject ? 'Edit Project' : 'New Project Showcase'}
            </h3>
            <p className="text-xs text-neutral-400 mb-4">Fill out the project details for the public bento grid.</p>

            <form onSubmit={handleSaveProject} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-300 block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="e.g. BALENCIAGA COUTURE"
                  className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-300 block mb-1">Category Tag</label>
                <input
                  type="text"
                  required
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                  placeholder="e.g. Brand Experience, Editorial Web"
                  className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-300 block mb-1">Description / Brief</label>
                <textarea
                  rows={2}
                  value={projectForm.desc}
                  onChange={(e) => setProjectForm({ ...projectForm, desc: e.target.value })}
                  placeholder="High-level case study summary..."
                  className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-300 block mb-1">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={projectForm.image}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                />
                {projectForm.image && (
                  <div className="mt-2 h-20 w-32 rounded-lg overflow-hidden border border-[#380A10]">
                    <img src={projectForm.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-300 block mb-1">Live URL / Demo Link</label>
                <input
                  type="url"
                  required
                  value={projectForm.liveUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                  className="w-full bg-[#120507] border border-[#380A10] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60121D]"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="flex-1 py-2 bg-neutral-900 text-neutral-300 rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#460C14] hover:bg-[#60121D] text-white rounded-xl text-xs font-bold uppercase tracking-wider border border-[#8E1727] transition-colors"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
