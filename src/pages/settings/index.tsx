
import { useSettings } from '@/contexts/SettingsContext';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Moon, Sun, Monitor, VolumeX, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

const Settings = () => {
  const { 
    theme, 
    setTheme, 
    aiPersona,
    setAiPersona,
    aiTraits,
    updateAiTrait,
    useNyptho,
    setUseNyptho,
    notificationSound,
    setNotificationSound,
    resetToDefaults
  } = useSettings();

  const [testAudio, setTestAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setTestAudio(new Audio('/message.mp3'));
  }, []);

  const playTestSound = () => {
    if (testAudio && notificationSound) {
      testAudio.volume = 0.5;
      testAudio.play();
      toast.success("Playing notification sound");
    } else if (!notificationSound) {
      toast.error("Notification sounds are disabled");
    }
  };

  const personaOptions = [
    { id: 'academic', name: 'Academic', description: 'Educational and informative responses' },
    { id: 'creative', name: 'Creative', description: 'Imaginative and expressive communication' },
    { id: 'technical', name: 'Technical', description: 'Precise and detailed explanations' },
    { id: 'supportive', name: 'Supportive', description: 'Encouraging and helpful guidance' },
    { id: 'nyptho', name: 'Nyptho', description: 'Advanced AI with machine learning' },
    { id: 'custom', name: 'Custom', description: 'Personalized settings' },
  ];

  return (
    <div className="min-h-screen bg-[#1A1F2C] font-inter text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="space-y-12">
          {/* Appearance */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Appearance</h2>
            <div className="bg-[#2A2F3C] rounded-lg p-6 space-y-6">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-base font-medium mb-2">Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      onClick={() => setTheme('light')}
                      variant={theme === 'light' ? 'default' : 'outline'}
                      className={theme === 'light' ? 'border-2 border-[#9b87f5]' : ''}
                    >
                      <Sun className="h-5 w-5 mr-2" />
                      Light
                    </Button>
                    <Button
                      onClick={() => setTheme('dark')}
                      variant={theme === 'dark' ? 'default' : 'outline'}
                      className={theme === 'dark' ? 'border-2 border-[#9b87f5]' : ''}
                    >
                      <Moon className="h-5 w-5 mr-2" />
                      Dark
                    </Button>
                    <Button
                      onClick={() => setTheme('system')}
                      variant={theme === 'system' ? 'default' : 'outline'}
                      className={theme === 'system' ? 'border-2 border-[#9b87f5]' : ''}
                    >
                      <Monitor className="h-5 w-5 mr-2" />
                      System
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Settings */}
          <section>
            <h2 className="text-xl font-semibold mb-6">AI Settings</h2>
            <div className="bg-[#2A2F3C] rounded-lg p-6 space-y-8">
              {/* AI Persona */}
              <div>
                <h3 className="text-base font-medium mb-4">AI Persona</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Choose which type of personality your AI assistant uses
                </p>
                <div className="space-y-2">
                  {personaOptions.map((persona) => (
                    <div
                      key={persona.id}
                      className={`p-4 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                        aiPersona === persona.id
                          ? 'bg-[#3C4250] border border-[#9b87f5]/50'
                          : 'bg-[#232936] hover:bg-[#2F3542]'
                      }`}
                      onClick={() => setAiPersona(persona.id as any)}
                    >
                      <div>
                        <h4 className="font-medium">{persona.name}</h4>
                        <p className="text-sm text-gray-400">{persona.description}</p>
                      </div>
                      {aiPersona === persona.id && (
                        <div className="h-6 w-6 rounded-full bg-[#9b87f5] flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom AI Traits */}
              {(aiPersona === 'custom' || aiPersona === 'nyptho') && (
                <div>
                  <h3 className="text-base font-medium mb-4">Custom AI Traits</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Adjust these sliders to customize how your AI assistant behaves
                  </p>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Helpfulness</h4>
                        <span className="text-xs bg-[#3C4250] px-2 py-1 rounded">{aiTraits.helpfulness}%</span>
                      </div>
                      <Slider
                        value={[aiTraits.helpfulness]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(value) => updateAiTrait('helpfulness', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Creativity</h4>
                        <span className="text-xs bg-[#3C4250] px-2 py-1 rounded">{aiTraits.creativity}%</span>
                      </div>
                      <Slider
                        value={[aiTraits.creativity]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(value) => updateAiTrait('creativity', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Precision</h4>
                        <span className="text-xs bg-[#3C4250] px-2 py-1 rounded">{aiTraits.precision}%</span>
                      </div>
                      <Slider
                        value={[aiTraits.precision]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(value) => updateAiTrait('precision', value[0])}
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Friendliness</h4>
                        <span className="text-xs bg-[#3C4250] px-2 py-1 rounded">{aiTraits.friendliness}%</span>
                      </div>
                      <Slider
                        value={[aiTraits.friendliness]}
                        min={0}
                        max={100}
                        step={5}
                        onValueChange={(value) => updateAiTrait('friendliness', value[0])}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Nyptho Settings */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-base font-medium">Use Nyptho AI</h3>
                    <p className="text-sm text-gray-400">Enable advanced meta-learning capabilities</p>
                  </div>
                  <Switch
                    checked={useNyptho}
                    onCheckedChange={setUseNyptho}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
            <div className="bg-[#2A2F3C] rounded-lg p-6 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-base font-medium">Sound Notifications</h3>
                  <p className="text-sm text-gray-400">Play sounds for new messages</p>
                </div>
                <div className="flex items-center">
                  <Switch
                    checked={notificationSound}
                    onCheckedChange={setNotificationSound}
                  />
                </div>
              </div>

              <div className={notificationSound ? 'opacity-100' : 'opacity-50 pointer-events-none'}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={playTestSound}
                  disabled={!notificationSound}
                >
                  Test sound
                </Button>
              </div>
            </div>
          </section>

          {/* Reset Settings */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Reset Settings</h2>
            <div className="bg-[#2A2F3C] rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                Reset all settings to their default values. This cannot be undone.
              </p>
              <Button 
                variant="destructive" 
                onClick={() => {
                  resetToDefaults();
                  toast.success("Settings reset to defaults");
                }}
              >
                Reset All Settings
              </Button>
            </div>
          </section>

          {/* Help & Support Section */}
          <section>
            <h2 className="text-xl font-semibold mb-6">Help & Support</h2>
            <div className="bg-[#2A2F3C] rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                Need help with the ALU Student Companion? Contact support or view documentation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline">
                  Contact Support
                </Button>
                <Button variant="outline">
                  View Documentation
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
