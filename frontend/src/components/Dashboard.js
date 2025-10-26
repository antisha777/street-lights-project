import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StreetCard from './StreetCard';

const Dashboard = () => {
  const [streets, setStreets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStreets();
  }, []);

  const loadStreets = async () => {
    try {
      const streetsData = await api.getStreets();
      setStreets(streetsData);
    } catch (error) {
      console.error('Error loading streets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Расчет общей статистики
  const totalStats = streets.reduce((acc, street) => ({
    totalLights: acc.totalLights + street.total_lights,
    workingLights: acc.workingLights + street.working_lights,
    brokenLights: acc.brokenLights + street.broken_lights
  }), { totalLights: 0, workingLights: 0, brokenLights: 0 });

  const overallEfficiency = totalStats.totalLights > 0 
    ? Math.round((totalStats.workingLights / totalStats.totalLights) * 100)
    : 0;

  if (loading) return <div className="loading">Загрузка улиц...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Система управления уличным освещением</h1>
        
        <div className="overall-stats">
          <div className="stat-card">
            <h3>{totalStats.totalLights}</h3>
            <p>Всего фонарей</p>
          </div>
          <div className="stat-card success">
            <h3>{totalStats.workingLights}</h3>
            <p>Работают</p>
          </div>
          <div className="stat-card danger">
            <h3>{totalStats.brokenLights}</h3>
            <p>Неисправны</p>
          </div>
          <div className="stat-card info">
            <h3>{overallEfficiency}%</h3>
            <p>Эффективность</p>
          </div>
        </div>
      </div>

      <div className="streets-grid">
        {streets.map(street => (
          <StreetCard key={street.id} street={street} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;