import React from 'react';
import { AppTab } from '../types';
import { Database, Users, Shield, Globe } from 'lucide-react';
import { useData } from '../context/DataContext';

interface NavbarProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange }) => {
  const { language, setLanguage, t } = useData();

  const NavItem = ({ tab, icon, labelKey }: { tab: AppTab, icon: React.ReactNode, labelKey: string }) => {
    const isActive = currentTab === tab;
    return (
      <button
        onClick={() => onTabChange(tab)}
        className={`relative flex items-center gap-2 px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full
          ${isActive 
            ? 'text-white bg-blue-600/90 shadow-lg shadow-blue-900/20' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
      >
        {icon}
        <span>{t(labelKey)}</span>
      </button>
    );
  };

  return (
    <nav className="bg-[#0a101f] border-b border-slate-800 text-white px-8 h-20 flex items-center justify-between sticky top-0 z-50 shadow-2xl relative">
      
      {/* Brand */}
      <div className="flex items-center">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/1/10/SAS_logo_horiz.svg" 
          alt="SAS" 
          className="h-8 brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" 
        />
      </div>

      {/* Navigation */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg flex justify-center">
        <div className="flex items-center gap-1 bg-slate-900/50 p-1.5 rounded-full border border-slate-800/60 backdrop-blur-sm">
          <NavItem tab={AppTab.DATA_HUB} icon={<Database size={16} />} labelKey="nav_data_hub" />
          <NavItem tab={AppTab.DIRECTORY} icon={<Users size={16} />} labelKey="nav_directory" />
          {currentTab === AppTab.PERSON_360 && (
             <NavItem tab={AppTab.PERSON_360} icon={<Shield size={16} />} labelKey="nav_person_360" />
          )}
        </div>
      </div>

      {/* Right Side: Language Toggle */}
      <div className="flex items-center gap-4">
        <button 
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
            <Globe size={18} />
            <span>{language === 'en' ? 'Arabic' : 'English'}</span>
        </button>
      </div>
    </nav>
  );
};