'use client';

import { useState } from 'react';
import { FaCog, FaUserSecret, FaLock, FaPalette, FaBell } from 'react-icons/fa';
import { useAuth } from '../../app/context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  
  const tabs = [
    { id: 'account', name: 'Account', icon: <FaUserSecret /> },
    { id: 'security', name: 'Security', icon: <FaLock /> },
    { id: 'appearance', name: 'Appearance', icon: <FaPalette /> },
    { id: 'notifications', name: 'Notifications', icon: <FaBell /> },
  ];
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="font-cinzel text-3xl font-bold mb-10 text-accent">
        <span className="flex items-center">
          <FaCog className="mr-4 text-primary/70" />
          Personal Grimoire
        </span>
      </h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-card border border-border shadow-gothic">
          <nav className="p-4">
            <div className="mb-4 px-2">
              <h3 className="font-cinzel text-xs uppercase tracking-wider text-accent/70 mb-2">Settings</h3>
            </div>
            <ul className="space-y-1">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center w-full py-2 px-4 rounded ${
                      activeTab === tab.id 
                        ? 'bg-muted/30 text-accent font-medium border-l-2 border-primary' 
                        : 'text-foreground hover:bg-muted/20 border-l-2 border-transparent'
                    } transition-colors duration-300`}
                  >
                    <span className={`mr-3 text-sm ${activeTab === tab.id ? 'text-primary' : 'text-muted'}`}>
                      {tab.icon}
                    </span>
                    <span className="font-fell">{tab.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Content */}
        <div className="flex-1 bg-card border border-border shadow-gothic p-6">
          {activeTab === 'account' && (
            <div>
              <h2 className="font-cinzel text-xl text-accent mb-6">Account Settings</h2>
              
              <div className="space-y-6">
                <div className="border-b border-border/30 pb-6">
                  <h3 className="font-cinzel text-accent/80 text-lg mb-4">Profile Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-foreground/70 mb-2">Username</label>
                      <input 
                        type="text" 
                        value={user?.username || ''} 
                        disabled
                        className="w-full bg-background/50 border border-border/50 p-3 text-foreground/90 font-fell focus:outline-none focus:border-primary/70"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-foreground/70 mb-2">Email</label>
                      <input 
                        type="email" 
                        value={user?.email || ''} 
                        disabled
                        className="w-full bg-background/50 border border-border/50 p-3 text-foreground/90 font-fell focus:outline-none focus:border-primary/70"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-cinzel text-accent/80 text-lg mb-4">Personalize</h3>
                  <p className="text-foreground/70 font-fell italic text-center py-4">
                    Personalization options coming soon...
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div>
              <h2 className="font-cinzel text-xl text-accent mb-6">Security Settings</h2>
              <div>
                <h3 className="font-cinzel text-accent/80 text-lg mb-4">Change Password</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-foreground/70 mb-2">Current Password</label>
                    <input 
                      type="password" 
                      className="w-full bg-background/50 border border-border/50 p-3 text-foreground/90 font-fell focus:outline-none focus:border-primary/70"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-foreground/70 mb-2">New Password</label>
                    <input 
                      type="password" 
                      className="w-full bg-background/50 border border-border/50 p-3 text-foreground/90 font-fell focus:outline-none focus:border-primary/70"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-foreground/70 mb-2">Confirm New Password</label>
                    <input 
                      type="password" 
                      className="w-full bg-background/50 border border-border/50 p-3 text-foreground/90 font-fell focus:outline-none focus:border-primary/70"
                    />
                  </div>
                  
                  <div className="mt-6">
                    <button className="px-6 py-3 bg-primary/80 text-accent text-sm border border-border shadow-gothic hover:bg-primary transition-colors duration-300">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'appearance' && (
            <div>
              <h2 className="font-cinzel text-xl text-accent mb-6">Appearance Settings</h2>
              <p className="text-foreground/70 font-fell italic text-center py-8">
                Theme customization options coming soon...
              </p>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div>
              <h2 className="font-cinzel text-xl text-accent mb-6">Notification Settings</h2>
              <p className="text-foreground/70 font-fell italic text-center py-8">
                Notification preferences coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}