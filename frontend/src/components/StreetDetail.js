import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import LightControl from './LightControl';
import SchedulePanel from './SchedulePanel';

const StreetDetail = () => {
  const { streetId } = useParams();
  const [street, setStreet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreet();
  }, [streetId]);

  const loadStreet = async () => {
    try {
      const streetData = await api.getStreet(streetId);
      setStreet(streetData);
    } catch (error) {
      console.error('Error loading street:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStreetCommand = async (command, value = null) => {
    try {
      await api.controlStreet(streetId, { command, value });
      loadStreet(); // Перезагружаем данные
    } catch (error) {
      console.error('Error sending command:', error);
    }
  };

  const handleLightCommand = async (lightId, command, value = null) => {
    try {
      await api.controlLight(streetId, lightId, { command, value });
      loadStreet(); // Перезагружаем данные
    } catch (error) {
      console.error('Error sending command:', error);
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!street) return <div className="error">Улица не найдена</div>;

  return (
    <div className="street-detail">
      <div className="street-header">
        <h2>{street.name}</h2>
        <div className="street-actions">
          <button 
            className="btn btn-success"
            onClick={() => handleStreetCommand('turn_on')}
          >
            Включить все
          </button>
          <button 
            className="btn btn-danger"
            onClick={() => handleStreetCommand('turn_off')}
          >
            Выключить все
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="lights-section">
            <h4>Управление фонарями</h4>
            <div className="lights-grid">
              {street.lights.map(light => (
                <LightControl 
                  key={light.id}
                  light={light}
                  onCommand={handleLightCommand}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <SchedulePanel 
            schedule={street.auto_schedule}
            streetId={streetId}
            onScheduleUpdate={loadStreet}
          />
          
          <div className="street-stats-card card">
            <div className="card-body">
              <h5>Статистика</h5>
              <div className="stats">
                <div className="stat-item">
                  <span>Всего фонарей:</span>
                  <strong>{street.total_lights}</strong>
                </div>
                <div className="stat-item">
                  <span>Работают:</span>
                  <strong className="text-success">{street.working_lights}</strong>
                </div>
                <div className="stat-item">
                  <span>Неисправны:</span>
                  <strong className="text-danger">{street.broken_lights}</strong>
                </div>
                <div className="stat-item">
                  <span>Эффективность:</span>
                  <strong>
                    {Math.round((street.working_lights / street.total_lights) * 100)}%
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreetDetail;