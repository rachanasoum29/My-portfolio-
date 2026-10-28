// sharedData.js - Storage keys, initial fallback state, and localStorage helpers.

export const STORAGE_KEYS = {
  PROFILE: 'portfolio_editorial_profile',
  PROJECTS: 'portfolio_editorial_projects',
  TOOLS: 'portfolio_editorial_tools',
  INQUIRIES: 'portfolio_editorial_inquiries',
  PIN: 'portfolio_editorial_admin_pin',
  AUTH: 'portfolio_editorial_admin_auth'
};

export const INITIAL_DATA = {
  profile: {
    name: "DARINA SIDOR",
    title: "UX/UI WEB DESIGNER",
    headline: "Junior+ Digital & Brand Experience Designer",
    aboutText: "Hello! My name is Darina Sidor, a UX/UI and web designer. I create intuitive, visually memorable interfaces, study modern digital design trends, and continuously sharpen my craft across industry-standard design tools. Open for exciting freelance and full-time opportunities.",
    email: "darina.sidor21@gmail.com",
    telegram: "@Darina_Sidor",
    phone: "+1 (981) 010-38-35",
    tildaUrl: "https://darinasidor.tilda.ws",
    heroImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
    aboutImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85"
  },
  tools: [
    { id: '1', name: 'Figma', icon: '❖' },
    { id: '2', name: 'Photoshop', icon: 'Ps' },
    { id: '3', name: 'Illustrator', icon: 'Ai' },
    { id: '4', name: 'After Effects', icon: 'Ae' },
    { id: '5', name: 'Tilda', icon: 'T' },
    { id: '6', name: 'Cinema 4D', icon: '3D' },
    { id: '7', name: 'Protopie', icon: '◇' }
  ],
  projects: [
    {
      id: '1',
      title: 'LOUIS VUITTON 72',
      category: 'Brand Experience',
      desc: 'Exclusive fragrance launch micro-site with 3D product showcase.',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=85',
      liveUrl: 'https://louisvuitton.com'
    },
    {
      id: '2',
      title: 'WHOOSH DRYER',
      category: 'Product Landing Page',
      desc: 'High-velocity ultrasonic hair dryer e-commerce interaction design.',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85',
      liveUrl: 'https://whoosh.design'
    },
    {
      id: '3',
      title: 'UNIQUE BEAUTY',
      category: 'Editorial Web Experience',
      desc: 'Luxury organic skincare direct-to-consumer store with fluid checkout.',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=85',
      liveUrl: 'https://uniquebeauty.demo'
    },
    {
      id: '4',
      title: "X'FLOW GYM",
      category: 'Fitness App & Portal',
      desc: 'High-energy cyberpunk fitness portal with booking schedules.',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=85',
      liveUrl: 'https://xflowgym.fit'
    },
    {
      id: '5',
      title: 'TRUE SOUND PODS',
      category: 'Hardware Micro-Site',
      desc: 'True wireless spatial audio earbuds launch page with soundwaves.',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=85',
      liveUrl: 'https://truesound.audio'
    },
    {
      id: '6',
      title: 'FOREST HONEY PACK',
      category: 'Artisanal Packaging & Web',
      desc: 'Artisanal honey packaging branding, 3D jar labels and landing page.',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=85',
      liveUrl: 'https://foresthoney.market'
    }
  ]
};

// Helpers
export const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Failed reading key "${key}" from localStorage:`, e);
    return fallback;
  }
};

export const setStored = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    // Trigger window event so same-window listeners also update
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error(`Failed writing key "${key}" to localStorage:`, e);
  }
};

// Reset all portfolio data to factory state
export const resetToInitialData = () => {
  setStored(STORAGE_KEYS.PROFILE, INITIAL_DATA.profile);
  setStored(STORAGE_KEYS.PROJECTS, INITIAL_DATA.projects);
  setStored(STORAGE_KEYS.TOOLS, INITIAL_DATA.tools);
  setStored(STORAGE_KEYS.INQUIRIES, []);
  setStored(STORAGE_KEYS.PIN, '1234');
  setStored(STORAGE_KEYS.AUTH, false);
};

// Export full portfolio state for backup
export const exportAllData = () => {
  return {
    profile: getStored(STORAGE_KEYS.PROFILE, INITIAL_DATA.profile),
    projects: getStored(STORAGE_KEYS.PROJECTS, INITIAL_DATA.projects),
    tools: getStored(STORAGE_KEYS.TOOLS, INITIAL_DATA.tools),
    inquiries: getStored(STORAGE_KEYS.INQUIRIES, []),
    exportedAt: new Date().toISOString()
  };
};

// Import and overwrite data from JSON backup
export const importAllData = (data) => {
  if (data?.profile) setStored(STORAGE_KEYS.PROFILE, data.profile);
  if (data?.projects && Array.isArray(data.projects)) setStored(STORAGE_KEYS.PROJECTS, data.projects);
  if (data?.tools && Array.isArray(data.tools)) setStored(STORAGE_KEYS.TOOLS, data.tools);
  if (data?.inquiries && Array.isArray(data.inquiries)) setStored(STORAGE_KEYS.INQUIRIES, data.inquiries);
};
