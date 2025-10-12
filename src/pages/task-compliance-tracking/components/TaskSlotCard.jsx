import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TaskSlotCard = ({ 
  slot, 
  onUpdate, 
  isDisabled = false, 
  timeRemaining = null,
  userRole = 'developer' 
}) => {
  const [taskDescription, setTaskDescription] = useState(slot?.description || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getSlotConfig = (slotType) => {
    switch (slotType) {
      case 'morning':
        return {
          title: 'Morning Update',
          timeWindow: '09:00 - 12:00',
          icon: 'Sunrise',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200'
        };
      case 'afternoon':
        return {
          title: 'Afternoon Update',
          timeWindow: '12:00 - 17:00',
          icon: 'Sun',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      case 'evening':
        return {
          title: 'Evening Update',
          timeWindow: '17:00 - 20:00',
          icon: 'Sunset',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };
      default:
        return {
          title: 'Task Update',
          timeWindow: '',
          icon: 'Clock',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getSlotConfig(slot?.type);

  const getStatusBadge = () => {
    if (slot?.status === 'completed') {
      return (
        <div className="flex items-center space-x-1 text-success text-xs font-medium">
          <Icon name="CheckCircle" size={14} />
          <span>Completed</span>
        </div>
      );
    }
    
    if (slot?.status === 'overdue') {
      return (
        <div className="flex items-center space-x-1 text-error text-xs font-medium">
          <Icon name="AlertCircle" size={14} />
          <span>Overdue</span>
        </div>
      );
    }
    
    if (timeRemaining && timeRemaining > 0) {
      const hours = Math.floor(timeRemaining / 60);
      const minutes = timeRemaining % 60;
      return (
        <div className="flex items-center space-x-1 text-warning text-xs font-medium">
          <Icon name="Timer" size={14} />
          <span>{hours}h {minutes}m left</span>
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
    
    setIsSubmitting(true);
    try {
      await onUpdate(slot?.type, taskDescription?.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    if (slot?.status === 'completed' && userRole !== 'manager' && userRole !== 'admin') {
      return;
    }
    setIsEditing(true);
  };

  const canEdit = () => {
    if (userRole === 'manager' || userRole === 'admin') return true;
    if (slot?.status === 'completed') return false;
    if (isDisabled) return false;
    return true;
  };

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
            <p className="text-sm text-muted-foreground">{config?.timeWindow}</p>
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
              rows={4}
              required
              className="resize-none"
            />
            <div className="flex items-center space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={!taskDescription?.trim()}
                iconName="Save"
                iconPosition="left"
              >
                Save Update
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setTaskDescription(slot?.description || '');
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="min-h-[100px] p-4 bg-muted rounded-lg">
              {slot?.description ? (
                <p className="text-sm text-foreground whitespace-pre-wrap">{slot?.description}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No update provided yet</p>
              )}
            </div>
            {canEdit() && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                iconName="Edit"
                iconPosition="left"
              >
                {slot?.description ? 'Edit Update' : 'Add Update'}
              </Button>
            )}
          </div>
        )}
      </div>
      {/* Metadata */}
      {slot?.updatedAt && (
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
          <div className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>Updated: {new Date(slot.updatedAt)?.toLocaleString()}</span>
          </div>
          {slot?.updatedBy && (
            <div className="flex items-center space-x-1">
              <Icon name="User" size={12} />
              <span>By: {slot?.updatedBy}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskSlotCard;