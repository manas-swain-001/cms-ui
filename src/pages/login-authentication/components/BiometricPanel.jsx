import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BiometricPanel = ({ isActive, onCapture, onCancel, isLoading }) => {
  const [cameraStatus, setCameraStatus] = useState('initializing'); // initializing, active, error
  const [captureStep, setCaptureStep] = useState('position'); // position, capture, processing
  const [livenessCheck, setLivenessCheck] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const livenessPrompts = [
    { id: 1, instruction: "Look straight at the camera", icon: "Eye" },
    { id: 2, instruction: "Blink your eyes slowly", icon: "EyeOff" },
    { id: 3, instruction: "Turn your head slightly left", icon: "ArrowLeft" },
    { id: 4, instruction: "Turn your head slightly right", icon: "ArrowRight" }
  ];

  useEffect(() => {
    if (isActive) {
      initializeCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isActive]);

  const initializeCamera = async () => {
    try {
      setCameraStatus('initializing');
      const stream = await navigator.mediaDevices?.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraStatus('active');
        
        // Start liveness check after camera is ready
        setTimeout(() => {
          if (livenessPrompts?.length > 0) {
            setLivenessCheck(livenessPrompts?.[0]);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Camera initialization failed:', error);
      setCameraStatus('error');
    }
  };

  const stopCamera = () => {
    if (streamRef?.current) {
      streamRef?.current?.getTracks()?.forEach(track => track?.stop());
      streamRef.current = null;
    }
    setCameraStatus('initializing');
    setCaptureStep('position');
    setLivenessCheck(null);
  };

  const handleCapture = async () => {
    if (!videoRef?.current || !canvasRef?.current) return;

    setCaptureStep('processing');

    try {
      const canvas = canvasRef?.current;
      const video = videoRef?.current;
      const context = canvas?.getContext('2d');

      canvas.width = video?.videoWidth;
      canvas.height = video?.videoHeight;
      context?.drawImage(video, 0, 0);

      // Convert to blob for processing
      canvas?.toBlob(async (blob) => {
        if (blob) {
          // Simulate biometric processing
          await new Promise(resolve => setTimeout(resolve, 2000));
          onCapture(blob);
        }
      }, 'image/jpeg', 0.8);
    } catch (error) {
      console.error('Capture failed:', error);
      setCaptureStep('position');
    }
  };

  const nextLivenessStep = () => {
    const currentIndex = livenessPrompts?.findIndex(p => p?.id === livenessCheck?.id);
    if (currentIndex < livenessPrompts?.length - 1) {
      setLivenessCheck(livenessPrompts?.[currentIndex + 1]);
    } else {
      setCaptureStep('capture');
      setLivenessCheck(null);
    }
  };

  if (!isActive) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-fade-in">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <Icon name="Scan" size={24} className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Biometric Authentication</h3>
        <p className="text-sm text-muted-foreground">
          Position your face within the frame and follow the instructions
        </p>
      </div>
      {/* Camera Preview */}
      <div className="relative mb-6">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
          {cameraStatus === 'initializing' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Icon name="Camera" size={48} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Initializing camera...</p>
              </div>
            </div>
          )}

          {cameraStatus === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Icon name="CameraOff" size={48} className="text-error mx-auto mb-2" />
                <p className="text-sm text-error mb-2">Camera access denied</p>
                <Button variant="outline" size="sm" onClick={initializeCamera}>
                  Retry
                </Button>
              </div>
            </div>
          )}

          {cameraStatus === 'active' && (
            <>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Face detection overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-primary rounded-full opacity-50 animate-pulse" />
              </div>

              {/* Processing overlay */}
              {captureStep === 'processing' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Icon name="RefreshCw" size={32} className="animate-spin mx-auto mb-2" />
                    <p className="text-sm">Processing biometric data...</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      {/* Liveness Check Instructions */}
      {livenessCheck && captureStep === 'position' && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
              <Icon name={livenessCheck?.icon} size={16} className="text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{livenessCheck?.instruction}</p>
              <p className="text-xs text-muted-foreground">Follow the instruction and click Next</p>
            </div>
            <Button variant="outline" size="sm" onClick={nextLivenessStep}>
              Next
            </Button>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading || captureStep === 'processing'}
          className="flex-1"
        >
          Cancel
        </Button>
        
        {captureStep === 'capture' && (
          <Button
            variant="default"
            onClick={handleCapture}
            disabled={isLoading || cameraStatus !== 'active'}
            loading={captureStep === 'processing'}
            className="flex-1"
            iconName="Camera"
          >
            Capture Face
          </Button>
        )}
      </div>
      {/* Status Indicators */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-muted-foreground">
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${cameraStatus === 'active' ? 'bg-success' : 'bg-muted'}`} />
          <span>Camera</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${captureStep === 'capture' ? 'bg-success' : 'bg-muted'}`} />
          <span>Ready</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={12} />
          <span>Secure</span>
        </div>
      </div>
    </div>
  );
};

export default BiometricPanel;