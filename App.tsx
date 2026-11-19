import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Copilot } from './components/Copilot';
import { DataHub } from './pages/DataHub';
import { PeopleDirectory } from './pages/PeopleDirectory';
import { Person360 } from './pages/Person360';
import { AppTab } from './types';

const MainContent: React.FC = () => {
  const { setSelectedPersonId, language } = useData();
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DATA_HUB);

  const handlePersonSelect = (id: string) => {
    setSelectedPersonId(id);
    setActiveTab(AppTab.PERSON_360);
  };

  const handleBackToDirectory = () => {
    setSelectedPersonId(null);
    setActiveTab(AppTab.DIRECTORY);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DATA_HUB:
        return <DataHub onComplete={() => setActiveTab(AppTab.DIRECTORY)} />;
      case AppTab.DIRECTORY:
        return <PeopleDirectory onSelectPerson={handlePersonSelect} />;
      case AppTab.PERSON_360:
        return <Person360 onBack={handleBackToDirectory} />;
      default:
        return <DataHub onComplete={() => setActiveTab(AppTab.DIRECTORY)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar currentTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 relative transition-all duration-300">
        {renderContent()}
      </main>

      <Copilot currentTab={activeTab} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <MainContent />
    </DataProvider>
  );
};

export default App;