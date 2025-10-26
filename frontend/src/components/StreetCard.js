import React from 'react';
import { useNavigate } from 'react-router-dom';

const StreetCard = ({ street }) => {
  const navigate = useNavigate();
  
  const workingPercentage = Math.round((street.working_lights / street.total_lights) * 100);
  
  return (
    <div className="street-card card" onClick={() => navigate(`/street/${street.id}`)}>
      <div className="card-body">
        <h5 className="card-title">{street.name}</h5>
        
        <div className="street-stats">
          <div className="stat">
            <span className="stat-label">Работают:</span>
            <span className="stat-value working">{street.working_lights}/{street.total_lights}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Неисправны:</span>
            <span className="stat-value broken">{street.broken_lights}</span>
          </div>
        </div>
        
        <div className="progress mb-2">
          <div 
            className="progress-bar" 
            style={{ width: `${workingPercentage}%` }}
          >
            {workingPercentage}%
          </div>
        </div>
        
        <div className="schedule-info">
          <small>
            {street.auto_schedule.enabled ? (
              <>📅 Авто: {street.auto_schedule.on_time} - {street.auto_schedule.off_time}</>
            ) : (
              <>⏰ Ручное управление</>
            )}
          </small>
        </div>
      </div>
    </div>
  );
};

export default StreetCard;