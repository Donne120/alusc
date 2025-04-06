
import { useSettings } from '@/contexts/SettingsContext';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Moon, Sun, Monitor, VolumeX, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

const Settings = () => {
  const { 
    theme, 
    setTheme, 
    aiModel, 
    setAiModel, 
    personaName,
    setPersonaName,
    accessibilityMode,
    setAccessibilityMode,
    notificationSounds,
    setNotificationSounds,
    volume,
    setVolume,
    messageToneAudio
  } = useSettings();

  const [testAudio, setTestAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setTestAudio(new Audio(messageToneAudio));
  }, [messageToneAudio]);

  const playTestSound = () => {
    if (testAudio && notificationSounds) {
      testAudio.volume = volume / 100;
      testAudio.play();
      toast.success("Playing notification sound");
    } else if (!notificationSounds) {
      toast.error("Notification sounds are disabled");
    }
  };

  const modelOptions = [
    { id: 'gemini', name: 'Gemini Pro', description: 'Balanced model with strong capabilities' },
    { id: 'llama3', name: 'Llama 3', description: 'Open source model with good performance' },
    { id: 'mistral', name: 'Mistral', description: 'Fast response with good accuracy' },
    { id: 'claude', name: 'Claude', description: 'Advanced reasoning capabilities' },
    { id: 'gpt4', name: 'GPT-4', description: 'High performance but higher latency' },
  ];

  const personaOptions = [
    { id: 'assistant', name: 'Assistant', description: 'Helpful, polite, and professional' },
    { id: 'tutor', name: 'Tutor', description: 'Educational focused with explanations' },
    { id: 'friend', name: 'Friend', description: 'Casual, conversational tone' },
    { id: 'expert', name: 'Expert', description: 'Technical, detailed responses' },
    { id: 'concise', name: 'Concise', description: 'Brief, to-the-point answers' },
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

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-medium">Accessibility Mode</h3>
                    <Switch
                      checked={accessibilityMode}
                      onCheckedChange={setAccessibilityMode}
                    />
                  </div>
                  <p className="text-sm text-gray-400">
                    Enables larger text, increased contrast, and simplified interfaces
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* AI Settings */}
          <section>
            <h2 className="text-xl font-semibold mb-6">AI Settings</h2>
            <div className="bg-[#2A2F3C] rounded-lg p-6 space-y-8">
              {/* AI Models */}
              <div>
                <h3 className="text-base font-medium mb-4">AI Model</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Select which model powers your AI assistant
                </p>
                <div className="space-y-2">
                  {modelOptions.map((model) => (
                    <div
                      key={model.id}
                      className={`p-4 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                        aiModel === model.id
                          ? 'bg-[#3C4250] border border-[#9b87f5]/50'
                          : 'bg-[#232936] hover:bg-[#2F3542]'
                      }`}
                      onClick={() => setAiModel(model.id)}
                    >
                      <div>
                        <h4 className="font-medium">{model.name}</h4>
                        <p className="text-sm text-gray-400">{model.description}</p>
                      </div>
                      {aiModel === model.id && (
                        <div className="h-6 w-6 rounded-full bg-[#9b87f5] flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Persona */}
              <div>
                <h3 className="text-base font-medium mb-4">AI Persona</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Choose how your AI assistant communicates
                </p>
                <div className="space-y-2">
                  {personaOptions.map((persona) => (
                    <div
                      key={persona.id}
                      className={`p-4 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                        personaName === persona.id
                          ? 'bg-[#3C4250] border border-[#9b87f5]/50'
                          : 'bg-[#232936] hover:bg-[#2F3542]'
                      }`}
                      onClick={() => setPersonaName(persona.id)}
                    >
                      <div>
                        <h4 className="font-medium">{persona.name}</h4>
                        <p className="text-sm text-gray-400">{persona.description}</p>
                      </div>
                      {personaName === persona.id && (
                        <div className="h-6 w-6 rounded-full bg-[#9b87f5] flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
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
                    checked={notificationSounds}
                    onCheckedChange={setNotificationSounds}
                  />
                </div>
              </div>

              <div className={notificationSounds ? 'opacity-100' : 'opacity-50 pointer-events-none'}>
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-medium">Sound Volume</h3>
                    <span className="text-sm bg-[#3C4250] px-2 py-1 rounded">{volume}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <VolumeX className="h-5 w-5 text-gray-400" />
                    <Slider
                      className="flex-1"
                      value={[volume]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => setVolume(value[0])}
                    />
                    <Volume2 className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={playTestSound}
                  disabled={!notificationSounds}
                >
                  Test sound
                </Button>
              </div>
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
