import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BiometricEnrollmentSection = ({ biometricData, onUpdateBiometric }) => {
  const [enrollmentStep, setEnrollmentStep] = useState('idle'); // idle, camera, capturing, processing, complete
  const [capturedImages, setCapturedImages] = useState([]);
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [qualityFeedback, setQualityFeedback] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const requiredAngles = [
    { id: 'front', label: 'Front View', icon: 'User', captured: false },
    { id: 'left', label: 'Left Profile', icon: 'RotateCcw', captured: false },
    { id: 'right', label: 'Right Profile', icon: 'RotateCw', captured: false }
  ];

  const [angleProgress, setAngleProgress] = useState(requiredAngles);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream?.getTracks()?.forEach(track => track?.stop());
      }
    };
  }, [cameraStream]);

  const startCamera = async () => {
    try {
      setCameraError('');
      setEnrollmentStep('camera');
      
      const stream = await navigator.mediaDevices?.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      setCameraStream(stream);
      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setCameraError('Unable to access camera. Please check permissions and try again.');
      setEnrollmentStep('idle');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream?.getTracks()?.forEach(track => track?.stop());
      setCameraStream(null);
    }
    setEnrollmentStep('idle');
  };

  const captureImage = (angleId) => {
    if (!videoRef?.current || !canvasRef?.current) return;

    setEnrollmentStep('capturing');
    
    const canvas = canvasRef?.current;
    const video = videoRef?.current;
    const context = canvas?.getContext('2d');
    
    canvas.width = video?.videoWidth;
    canvas.height = video?.videoHeight;
    context?.drawImage(video, 0, 0);
    
    // Simulate quality check
    setTimeout(() => {
      const imageData = canvas?.toDataURL('image/jpeg', 0.8);
      const newImage = {
        id: angleId,
        data: imageData,
        timestamp: new Date()?.toISOString(),
        quality: Math.floor(Math.random() * 20) + 80 // Mock quality score 80-100
      };
      
      setCapturedImages(prev => [...prev, newImage]);
      
      // Update angle progress
      setAngleProgress(prev => 
        prev?.map(angle => 
          angle?.id === angleId ? { ...angle, captured: true } : angle
        )
      );
      
      setQualityFeedback(`${angleId} view captured successfully! Quality: ${newImage?.quality}%`);
      setEnrollmentStep('camera');
      
      // Check if all angles are captured
      const updatedProgress = angleProgress?.map(angle => 
        angle?.id === angleId ? { ...angle, captured: true } : angle
      );
      
      if (updatedProgress?.every(angle => angle?.captured)) {
        setTimeout(() => {
          processEnrollment();
        }, 1000);
      }
    }, 1500);
  };

  const processEnrollment = () => {
    setEnrollmentStep('processing');
    
    // Simulate biometric template processing
    setTimeout(() => {
      const enrollmentData = {
        templateId: `bio_${Date.now()}`,
        images: capturedImages,
        enrollmentDate: new Date()?.toISOString(),
        quality: Math.min(...capturedImages?.map(img => img?.quality))
      };
      
      onUpdateBiometric(enrollmentData);
      setEnrollmentStep('complete');
      stopCamera();
    }, 3000);
  };

  const resetEnrollment = () => {
    setCapturedImages([]);
    setAngleProgress(requiredAngles?.map(angle => ({ ...angle, captured: false })));
    setQualityFeedback('');
    setEnrollmentStep('idle');
    stopCamera();
  };

  const deleteTemplate = () => {
    onUpdateBiometric(null);
    resetEnrollment();
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 'camera': return 'Camera';
      case 'capturing': return 'Loader';
      case 'processing': return 'Cpu';
      case 'complete': return 'CheckCircle';
      default: return 'Scan';
    }
  };

  const getStepColor = (step) => {
    switch (step) {
      case 'capturing': return 'text-warning';
      case 'processing': return 'text-primary';
      case 'complete': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="Scan" size={24} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Biometric Enrollment</h2>
          <p className="text-sm text-muted-foreground">Set up face recognition for secure authentication</p>
        </div>
      </div>
      {/* Current Status */}
      <div className="mb-6">
        {biometricData?.templateId ? (
          <div className="bg-success/10 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <div>
                  <div className="text-sm font-medium text-success">Biometric Template Active</div>
                  <div className="text-xs text-muted-foreground">
                    Enrolled on {new Date(biometricData.enrollmentDate)?.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={resetEnrollment}>
                  Re-enroll
                </Button>
                <Button variant="destructive" size="sm" onClick={deleteTemplate}>
                  Delete Template
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-warning/10 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm font-medium text-warning">No biometric template found</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Enroll your face template to enable biometric authentication
            </p>
          </div>
        )}
      </div>
      {/* Enrollment Process */}
      {enrollmentStep === 'idle' && !biometricData?.templateId && (
        <div className="text-center py-8">
          <Icon name="Scan" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Start Biometric Enrollment</h3>
          <p className="text-sm text-muted-foreground mb-6">
            We'll capture your face from multiple angles to create a secure template
          </p>
          <Button
            variant="default"
            iconName="Camera"
            iconPosition="left"
            onClick={startCamera}
          >
            Start Enrollment
          </Button>
        </div>
      )}
      {/* Camera Interface */}
      {enrollmentStep !== 'idle' && enrollmentStep !== 'complete' && (
        <div className="space-y-6">
          {/* Camera Preview */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-80 object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Overlay Guide */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-primary rounded-full opacity-50" />
            </div>
            
            {/* Status Overlay */}
            <div className="absolute top-4 left-4 right-4">
              <div className="bg-black/70 text-white p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon 
                    name={getStepIcon(enrollmentStep)} 
                    size={16} 
                    className={`${getStepColor(enrollmentStep)} ${enrollmentStep === 'capturing' || enrollmentStep === 'processing' ? 'animate-spin' : ''}`} 
                  />
                  <span className="text-sm font-medium">
                    {enrollmentStep === 'camera' && 'Position your face in the circle'}
                    {enrollmentStep === 'capturing' && 'Capturing image...'}
                    {enrollmentStep === 'processing' && 'Processing biometric template...'}
                  </span>
                </div>
                {qualityFeedback && (
                  <p className="text-xs text-green-400">{qualityFeedback}</p>
                )}
              </div>
            </div>
          </div>

          {/* Angle Progress */}
          <div className="grid grid-cols-3 gap-4">
            {angleProgress?.map((angle) => (
              <div key={angle?.id} className="text-center">
                <Button
                  variant={angle?.captured ? "default" : "outline"}
                  size="lg"
                  iconName={angle?.captured ? "Check" : angle?.icon}
                  onClick={() => !angle?.captured && captureImage(angle?.id)}
                  disabled={enrollmentStep !== 'camera' || angle?.captured}
                  className="w-full mb-2"
                >
                  {angle?.captured ? 'Captured' : 'Capture'}
                </Button>
                <p className="text-xs text-muted-foreground">{angle?.label}</p>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={stopCamera}>
              Cancel
            </Button>
            {capturedImages?.length > 0 && (
              <Button variant="outline" onClick={resetEnrollment}>
                Start Over
              </Button>
            )}
          </div>
        </div>
      )}
      {/* Completion */}
      {enrollmentStep === 'complete' && (
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Enrollment Complete!</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Your biometric template has been successfully created and is now active
          </p>
          <Button variant="default" onClick={() => setEnrollmentStep('idle')}>
            Done
          </Button>
        </div>
      )}
      {/* Error State */}
      {cameraError && (
        <div className="bg-error/10 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error">Camera Error</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{cameraError}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={startCamera}>
            Try Again
          </Button>
        </div>
      )}
      {/* Instructions */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Enrollment Tips:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Ensure good lighting on your face</li>
          <li>• Remove glasses and face coverings</li>
          <li>• Look directly at the camera for each angle</li>
          <li>• Keep your face within the circle guide</li>
          <li>• Stay still during image capture</li>
        </ul>
      </div>
    </div>
  );
};

export default BiometricEnrollmentSection;