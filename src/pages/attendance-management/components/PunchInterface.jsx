import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PunchInterface = ({ onPunchAction, currentStatus, gpsStatus, officeDistance }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [biometricStatus, setBiometricStatus] = useState('ready'); // ready, processing, success, failed
  const [geofenceViolation, setGeofenceViolation] = useState(false);
  const [violationReason, setViolationReason] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Mock geofence radius (300m)
  const GEOFENCE_RADIUS = 300;

  useEffect(() => {
    // Check geofence violation
    if (officeDistance > GEOFENCE_RADIUS) {
      setGeofenceViolation(true);
    } else {
      setGeofenceViolation(false);
      setViolationReason('');
    }
  }, [officeDistance]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices?.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        }
      });
      setCameraStream(stream);
      setIsCapturing(true);
    } catch (error) {
      console.error('Camera access denied:', error);
      setBiometricStatus('failed');
    }
  };

  // Attach stream to video element when both stream and video element are available
  useEffect(() => {
    if (cameraStream && isCapturing) {
      // Small delay to ensure video element is rendered
      const timer = setTimeout(() => {
        if (videoRef?.current) {
          videoRef.current.srcObject = cameraStream;
        } else {
          // Retry after a short delay
          setTimeout(() => {
            if (videoRef?.current) {
              videoRef.current.srcObject = cameraStream;
            }
          }, 100);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [cameraStream, isCapturing]);

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream?.getTracks()?.forEach(track => track?.stop());
      setCameraStream(null);
    }
    setIsCapturing(false);
    setCapturedImage(null);
    setBiometricStatus('ready');
  };

  const captureImage = () => {
    if (videoRef?.current && canvasRef?.current) {
      const canvas = canvasRef?.current;
      const video = videoRef?.current;
      const context = canvas?.getContext('2d');

      canvas.width = video?.videoWidth;
      canvas.height = video?.videoHeight;
      context?.drawImage(video, 0, 0);

      const imageData = canvas?.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      setBiometricStatus('processing');

      setTimeout(() => {
        setBiometricStatus('success');
      }, 2000);


      // Mock biometric processing
      /* setTimeout(() => {
        const similarity = Math.random() * 100;
        if (similarity > 75) {
          setBiometricStatus('success');
        } else {
          setBiometricStatus('failed');
        }
      }, 2000); */
    }
  };

  const handlePunch = () => {
    if (geofenceViolation && !violationReason?.trim()) {
      return;
    }
    console.log('currentStatus ---------------> :::: ', currentStatus);
    const punchData = {
      type: currentStatus === 'checked_out' ? 'check_in' : 'check_out',
      timestamp: new Date()?.toISOString(),
      location: {
        latitude: gpsStatus?.latitude, // Mock coordinates for Bhubaneswar
        longitude: gpsStatus?.longitude,
        accuracy: gpsStatus?.accuracy
      },
      distance: officeDistance,
      biometric: {
        verified: biometricStatus === 'success',
        image: capturedImage,
        similarity: biometricStatus === 'success' ? 85 : 45
      },
      geofenceViolation: geofenceViolation,
      violationReason: violationReason
    };

    onPunchAction(punchData);
    stopCamera();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'checked_in': return 'text-success';
      case 'checked_out': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getGpsStatusColor = (status) => {
    switch (status) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Attendance Punch</h2>
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Navigation" size={16} className="text-primary" />
            <span className="text-muted-foreground">{officeDistance} from office</span>
          </div>
        </div>
      </div>
      {/* Current Status */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full border ${currentStatus === 'checked_in' ? 'bg-success/10 border-success/20' : 'bg-error/10 border-error/20'
          }`}>
          <Icon
            name={currentStatus === 'checked_in' ? 'CheckCircle' : 'XCircle'}
            size={16}
            className={getStatusColor(currentStatus)}
          />
          <span className={`font-medium ${getStatusColor(currentStatus)}`}>
            {currentStatus === 'checked_in' ? 'Checked In' : 'Checked Out'}
          </span>
        </div>
      </div>
      {/* Geofence Violation Warning */}
      {geofenceViolation && (
        <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-warning mb-2">Geofence Violation</h3>
              <p className="text-sm text-muted-foreground mb-3">
                You are {officeDistance}m away from the office (limit: {GEOFENCE_RADIUS}m). Please provide a reason for this punch.
              </p>
              <textarea
                value={violationReason}
                onChange={(e) => setViolationReason(e?.target?.value)}
                placeholder="Enter reason for punching outside office premises..."
                className="w-full p-3 border border-border rounded-lg text-sm resize-none"
                rows={3}
                required
              />
            </div>
          </div>
        </div>
      )}
      {/* Biometric Interface */}
      {/* <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground mb-4 text-center">Face Verification</h3>
        {!isCapturing ? (
          <div className="text-center">
            <div className="w-48 h-48 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
              <Icon name="Camera" size={48} className="text-muted-foreground" />
            </div>
            <Button
              onClick={startCamera}
              variant="outline"
              iconName="Camera"
              iconPosition="left"
              className="mb-2"
            >
              Start Face Verification
            </Button>
            <p className="text-xs text-muted-foreground">
              Position your face in the camera frame for verification
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-4 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {biometricStatus === 'processing' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Icon name="RefreshCw" size={24} className="animate-spin mx-auto mb-2" />
                    <p className="text-sm">Processing...</p>
                  </div>
                </div>
              )}
              {biometricStatus === 'success' && (
                <div className="absolute inset-0 bg-success/20 flex items-center justify-center">
                  <Icon name="CheckCircle" size={48} className="text-success" />
                </div>
              )}
              {biometricStatus === 'failed' && (
                <div className="absolute inset-0 bg-error/20 flex items-center justify-center">
                  <Icon name="XCircle" size={48} className="text-error" />
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex justify-center space-x-3 mb-4">
              {biometricStatus === 'ready' && (
                <Button
                  onClick={captureImage}
                  variant="default"
                  iconName="Camera"
                  iconPosition="left"
                >
                  Capture Face
                </Button>
              )}
              {biometricStatus === 'failed' && (
                <Button
                  onClick={() => setBiometricStatus('ready')}
                  variant="outline"
                  iconName="RotateCcw"
                  iconPosition="left"
                >
                  Retry
                </Button>
              )}
              <Button
                onClick={stopCamera}
                variant="ghost"
                iconName="X"
                iconPosition="left"
              >
                Cancel
              </Button>
            </div>

            {biometricStatus === 'success' && (
              <p className="text-sm text-success mb-2">✓ Face verified successfully</p>
            )}
            {biometricStatus === 'failed' && (
              <p className="text-sm text-error mb-2">✗ Face verification failed (45% match)</p>
            )}

            <p className="text-xs text-muted-foreground">
              Look directly at the camera and ensure good lighting
            </p>
          </div>
        )}
      </div> */}   {/* not in current milestone */}
      {/* Punch Button */}
      <div className="text-center">
        <Button
          onClick={handlePunch}
          disabled={
            (geofenceViolation && !violationReason?.trim()) ||
            (isCapturing && biometricStatus !== 'success') ||
            gpsStatus?.accuracy === 'unavailable'
          }
          variant={currentStatus === 'checked_out' ? 'default' : 'destructive'}
          size="lg"
          iconName={currentStatus === 'checked_out' ? 'LogIn' : 'LogOut'}
          iconPosition="left"
          className="w-full h-14 text-lg font-medium"
        >
          {currentStatus === 'checked_out' ? 'Check In' : 'Check Out'}
        </Button>

        {gpsStatus?.accuracy === 'unavailable' && (
          <p className="text-sm text-error mt-2">GPS location required for attendance</p>
        )}
      </div>
    </div>
  );
};

export default PunchInterface;