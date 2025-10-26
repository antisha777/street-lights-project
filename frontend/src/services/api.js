const API_BASE = 'http://localhost:8000/api';

export const api = {
  // Улицы
  getStreets: () => fetch(`${API_BASE}/streets`).then(res => res.json()),
  
  getStreet: (streetId) => 
    fetch(`${API_BASE}/streets/${streetId}`).then(res => res.json()),
  
  // Управление фонарями
  controlStreet: (streetId, command) =>
    fetch(`${API_BASE}/streets/${streetId}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(command)
    }).then(res => res.json()),
  
  controlLight: (streetId, lightId, command) =>
    fetch(`${API_BASE}/streets/${streetId}/lights/${lightId}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(command)
    }).then(res => res.json()),
  
  // Расписание
  updateSchedule: (streetId, schedule) =>
    fetch(`${API_BASE}/streets/${streetId}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schedule)
    }).then(res => res.json())
};