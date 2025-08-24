
import { useEffect, useState } from 'react';
import { AlertTriangle, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FullscreenEnforcer = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [warningCount, setWarningCount] = useState(0);

  useEffect(() => {
    // Force fullscreen on mount
    const enterFullscreen = async () => {
      try {
        await document.documentElement.requestFullscreen();
      } catch (error) {
        console.log('Fullscreen request failed:', error);
      }
    };

    enterFullscreen();

    // Fullscreen change listener
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen) {
        setShowWarning(true);
        setWarningCount(prev => prev + 1);
      }
    };

    // Visibility change listener (tab switching)
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabVisible(isVisible);
      
      if (!isVisible) {
        setShowWarning(true);
        setWarningCount(prev => prev + 1);
      }
    };

    // Prevent right-click and F12
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleReturnToFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setShowWarning(false);
    } catch (error) {
      console.log('Fullscreen request failed:', error);
    }
  };

  const dismissWarning = () => {
    setShowWarning(false);
  };

  return (
    <div className="fullscreen-container relative">
      {/* Warning Overlay */}
      {showWarning && (
        <div className="warning-overlay">
          <div className="warning-card pulse-border">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-alert-bg" />
              <h2 className="text-xl font-bold text-alert-text">Security Warning</h2>
            </div>
            
            <div className="space-y-3 mb-6">
              <p className="text-secure-text">
                {!isFullscreen && "You have exited fullscreen mode."}
                {!isTabVisible && "You have switched tabs or minimized the window."}
              </p>
              <p className="text-sm text-secure-muted">
                This action has been logged. Warning count: {warningCount}
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleReturnToFullscreen}
                className="bg-alert-bg hover:bg-alert-bg/80 text-alert-text font-medium"
              >
                Return to Fullscreen
              </Button>
              <Button 
                variant="outline" 
                onClick={dismissWarning}
                className="border-secure-border text-secure-text hover:bg-secure-card"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="security-badge mb-4">
              <Shield className="h-3 w-3 mr-1" />
              Secure Session Active
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-secure-text to-secure-muted bg-clip-text text-transparent">
              Fullscreen Security Mode
            </h1>
            
            <p className="text-xl text-secure-muted max-w-2xl mx-auto mb-6">
              This page enforces fullscreen mode for enhanced security and focus. 
              Any attempts to exit fullscreen or switch tabs will be detected and logged.
            </p>
            
            {!isFullscreen && (
              <Button 
                onClick={handleReturnToFullscreen}
                className="bg-alert-bg hover:bg-alert-bg/80 text-alert-text font-medium"
              >
                Enter Fullscreen Mode
              </Button>
            )}
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-secure-card border border-secure-border rounded-lg p-6">
              <div className="flex items-center justify-center mb-3">
                <div className={`p-2 rounded-full ${isFullscreen ? 'bg-green-500/20' : 'bg-alert-bg/20'}`}>
                  <Shield className={`h-5 w-5 ${isFullscreen ? 'text-green-400' : 'text-alert-bg'}`} />
                </div>
              </div>
              <h3 className="font-semibold mb-1">Fullscreen Status</h3>
              <p className={`text-sm ${isFullscreen ? 'text-green-400' : 'text-alert-bg'}`}>
                {isFullscreen ? 'Active' : 'Inactive'}
              </p>
            </div>

            <div className="bg-secure-card border border-secure-border rounded-lg p-6">
              <div className="flex items-center justify-center mb-3">
                <div className={`p-2 rounded-full ${isTabVisible ? 'bg-green-500/20' : 'bg-alert-bg/20'}`}>
                  {isTabVisible ? (
                    <Eye className={`h-5 w-5 ${isTabVisible ? 'text-green-400' : 'text-alert-bg'}`} />
                  ) : (
                    <EyeOff className={`h-5 w-5 ${isTabVisible ? 'text-green-400' : 'text-alert-bg'}`} />
                  )}
                </div>
              </div>
              <h3 className="font-semibold mb-1">Tab Visibility</h3>
              <p className={`text-sm ${isTabVisible ? 'text-green-400' : 'text-alert-bg'}`}>
                {isTabVisible ? 'Focused' : 'Hidden'}
              </p>
            </div>

            <div className="bg-secure-card border border-secure-border rounded-lg p-6">
              <div className="flex items-center justify-center mb-3">
                <div className={`p-2 rounded-full ${warningCount === 0 ? 'bg-green-500/20' : 'bg-warning/20'}`}>
                  <AlertTriangle className={`h-5 w-5 ${warningCount === 0 ? 'text-green-400' : 'text-warning'}`} />
                </div>
              </div>
              <h3 className="font-semibold mb-1">Warnings</h3>
              <p className={`text-sm ${warningCount === 0 ? 'text-green-400' : 'text-warning'}`}>
                {warningCount} violations
              </p>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-secure-card border border-secure-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Secure Content Area</h2>
            <p className="text-secure-muted mb-6">
              This is your protected workspace. The system continuously monitors for:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-alert-bg rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Fullscreen Exit</h4>
                  <p className="text-sm text-secure-muted">Detects when user exits fullscreen mode</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-alert-bg rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Tab Switching</h4>
                  <p className="text-sm text-secure-muted">Monitors tab visibility and focus</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-alert-bg rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Developer Tools</h4>
                  <p className="text-sm text-secure-muted">Blocks F12 and context menu access</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-alert-bg rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium">Violation Logging</h4>
                  <p className="text-sm text-secure-muted">Tracks and counts security violations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenEnforcer;
