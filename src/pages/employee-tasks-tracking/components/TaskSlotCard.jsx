import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TaskSlotCard = ({
  slot, 
  onUpdate, 
  isDisabled = false, 
  userName = '',
  isLoading = false,
  isNewUpdate = false
}) => {
  const [taskDescription, setTaskDescription] = useState(slot?.description || '');
  const [isEditing, setIsEditing] = useState(isNewUpdate);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Ref to check if text is truncated
  const textRef = React.useRef(null);
  const [needsExpansion, setNeedsExpansion] = useState(false);

  const getSlotConfig = (scheduledTime, status, isNew) => {
    let color, bgColor, borderColor;
    
    // For new update card
    if (isNew) {
      color = 'text-blue-600';
      bgColor = 'bg-blue-50';
      borderColor = 'border-blue-300';
      return {
        title: 'Add New Update',
        icon: 'Plus',
        color,
        bgColor,
        borderColor
      };
    }
    
    // Status colors: submitted=green, warning_sent=yellow, escalated=red
    if (status === 'submitted') {
      color = 'text-green-600';
      bgColor = 'bg-green-50';
      borderColor = 'border-green-300';
    } else if (status === 'warning_sent') {
      color = 'text-yellow-600';
      bgColor = 'bg-yellow-50';
      borderColor = 'border-yellow-300';
    } else if (status === 'escalated') {
      color = 'text-red-600';
      bgColor = 'bg-red-50';
      borderColor = 'border-red-300';
    } else {
      color = 'text-gray-600';
      bgColor = 'bg-gray-50';
      borderColor = 'border-gray-300';
    }
    
    return {
      title: `${scheduledTime} Update`,
      icon: 'Clock',
      color,
      bgColor,
      borderColor
    };
  };

  const config = getSlotConfig(slot?.scheduledTime, slot?.status, isNewUpdate);

  const getStatusBadge = () => {
    if (isNewUpdate) {
      return (
        <div className="flex items-center space-x-1 text-primary text-xs font-medium">
          <Icon name="Edit" size={14} />
          <span>New Update</span>
        </div>
      );
    }
    
    if (slot?.status === 'submitted') {
      return (
        <div className="flex items-center space-x-1 text-success text-xs font-medium">
          <Icon name="CheckCircle" size={14} />
          <span>Submitted</span>
        </div>
      );
    } else if (slot?.status === 'warning_sent') {
      return (
        <div className="flex items-center space-x-1 text-warning text-xs font-medium">
          <Icon name="AlertTriangle" size={14} />
          <span>Warning Sent</span>
        </div>
      );
    } else if (slot?.status === 'escalated') {
      return (
        <div className="flex items-center space-x-1 text-error text-xs font-medium">
          <Icon name="AlertCircle" size={14} />
          <span>Escalated</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-1 text-muted-foreground text-xs font-medium">
        <Icon name="Clock" size={14} />
        <span>Pending</span>
      </div>
    );
  };

  const handleSubmit = async () => {
    if (!taskDescription?.trim()) return;
    
    console.log('Description entered:', taskDescription?.trim());
    
    try {
      if (isNewUpdate) {
        // For new update, pass a special identifier
        await onUpdate('new', taskDescription?.trim());
      } else {
        await onUpdate(slot?.scheduledTime, taskDescription?.trim());
      }
      setIsEditing(isNewUpdate); // Keep new update card in edit mode
      setTaskDescription('');
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleEdit = () => {
    if (slot?.status === 'submitted') {
      return;
    }
    setIsEditing(true);
  };

  const canEdit = () => {
    if (isNewUpdate) return true; // New update card is always editable
    if (slot?.status === 'submitted') return false;
    if (isDisabled) return false;
    return true;
  };

  // Check if text is truncated and needs expand button
  useEffect(() => {
    if (!isEditing && slot?.description && textRef.current) {
      // Reset expansion state when description changes
      setIsExpanded(false);
      
      // Use setTimeout to ensure DOM is updated and styles are applied
      setTimeout(() => {
        const element = textRef.current;
        if (element) {
          // Check if text is actually truncated (scrollHeight > clientHeight)
          // This works when text is collapsed (has line-clamp applied)
          const isTruncated = element.scrollHeight > element.clientHeight;
          setNeedsExpansion(isTruncated);
        }
      }, 100);
    } else {
      setNeedsExpansion(false);
    }
  }, [isEditing, slot?.description]);

  return (
    <div className={`bg-card border-2 ${config?.borderColor} rounded-lg p-6 transition-all duration-200 hover:shadow-md`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${config?.bgColor} rounded-lg flex items-center justify-center`}>
            <Icon name={config?.icon} size={20} className={config?.color} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{config?.title}</h3>
          </div>
        </div>
        {getStatusBadge()}
      </div>
      {/* Task Description */}
      <div className="mb-4">
        {isEditing ? (
          <div className="space-y-3">
            <Input
              type="textarea"
              label="Task Description"
              placeholder="Describe your tasks and progress for this time slot..."
              value={taskDescription}
              onChange={(e) => setTaskDescription(e?.target?.value)}
              rows={3}
              required
            />
            <div className="flex items-center space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleSubmit}
                loading={isLoading}
                disabled={!taskDescription?.trim() || isLoading}
                iconName="Save"
                iconPosition="left"
              >
                Save Update
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (isNewUpdate) {
                    // For new update, just clear the description
                    setTaskDescription('');
                  } else {
                    // For existing updates, exit edit mode
                    setIsEditing(false);
                    setTaskDescription(slot?.description || '');
                  }
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="min-h-[100px] p-4 bg-muted rounded-lg">
              {slot?.description ? (
                <>
                  <p 
                    ref={textRef}
                    className="text-sm text-foreground word-break break-words whitespace-pre-wrap"
                    style={!isExpanded ? {
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      wordBreak: 'break-word'
                    } : {
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {slot?.description}
                  </p>
                  {(needsExpansion || isExpanded) && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="mt-2 text-xs font-medium text-primary hover:text-primary/80 flex items-center space-x-1 transition-colors"
                    >
                      <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} />
                      <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
                    </button>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  {isNewUpdate ? 'Click "Add Update" to enter your task description' : 'No update provided yet'}
                </p>
              )}
            </div>
            {canEdit() && !isNewUpdate && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                iconName="Edit"
                iconPosition="left"
                disabled={isLoading}
              >
                {slot?.description ? 'Edit Update' : 'Add Update'}
              </Button>
            )}
          </div>
        )}
      </div>
      {/* Metadata */}
      {!isNewUpdate && slot?.submittedAt && (
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>Updated: {new Date(slot.submittedAt)?.toLocaleString()}</span>
          </div>
          {userName && (
            <div className="flex items-center space-x-1">
              <Icon name="User" size={12} />
              <span>By: {userName}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskSlotCard;