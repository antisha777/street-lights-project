import React, { useState } from 'react';

const LightControl = ({ light, onCommand }) => {
  const [brightness, setBrightness] = useState(light.brightness);

  const handlePowerToggle = () => {
    const command = light.power ? 'turn_off' : 'turn_on';
    onCommand(light.id, command);
  };

  const handleBrightnessChange = (newBrightness) => {
    setBrightness(newBrightness);
    onCommand(light.id, 'set_brightness', newBrightness);
  };

  return (
    <div className={`light-control card ${light.power ? 'on' : 'off'}`}>
      <div className="card-body">
        <div className="light-header">
          <h6 className="light-title">Фонарь {light.id}</h6>
          <div className={`status-indicator ${light.power ? 'on' : 'off'}`}>
            {light.power ? '🟢' : '🔴'}
          </div>
        </div>
        
        <p className="light-position">{light.position}</p>
        
        <div className="light-controls">
          <button 
            className={`btn btn-sm ${light.power ? 'btn-warning' : 'btn-success'}`}
            onClick={handlePowerToggle}
          >
            {light.power ? 'Выключить' : 'Включить'}
          </button>
        </div>
        
        <div className="brightness-control">
          <label>Яркость: {brightness}%</label>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={brightness}
            onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
            disabled={!light.power}
            className="form-range"
          />
        </div>
        
        <div className="light-info">
          <small>
            Состояние: <strong>{light.power ? 'ВКЛ' : 'ВЫКЛ'}</strong>
          </small>
        </div>
      </div>
    </div>
  );
};

export default LightControl;