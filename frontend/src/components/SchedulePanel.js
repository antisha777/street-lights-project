import React, { useState } from 'react';
import { api } from '../services/api';

const SchedulePanel = ({ schedule, streetId, onScheduleUpdate }) => {
  const [formData, setFormData] = useState({
    enabled: schedule.enabled,
    on_time: schedule.on_time,
    off_time: schedule.off_time
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await api.updateSchedule(streetId, formData);
      onScheduleUpdate();
      alert('Расписание обновлено!');
    } catch (error) {
      console.error('Error updating schedule:', error);
      alert('Ошибка при обновлении расписания');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="schedule-panel card">
      <div className="card-body">
        <h5>Автоматическое расписание</h5>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={formData.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              id="scheduleEnabled"
            />
            <label className="form-check-label" htmlFor="scheduleEnabled">
              Включить авторежим
            </label>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Время включения:</label>
            <input
              type="time"
              className="form-control"
              value={formData.on_time}
              onChange={(e) => handleChange('on_time', e.target.value)}
              disabled={!formData.enabled}
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Время выключения:</label>
            <input
              type="time"
              className="form-control"
              value={formData.off_time}
              onChange={(e) => handleChange('off_time', e.target.value)}
              disabled={!formData.enabled}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Сохранение...' : 'Сохранить расписание'}
          </button>
        </form>
        
        {formData.enabled && (
          <div className="schedule-preview mt-3">
            <small className="text-muted">
              Фонари будут включаться в {formData.on_time} и выключаться в {formData.off_time}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePanel;