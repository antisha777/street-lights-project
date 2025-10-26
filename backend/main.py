from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, time
import json

app = FastAPI(title="Street Light Control System")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock данные
streets_data = {
    "lenina": {
        "id": "lenina",
        "name": "ул. Ленина",
        "lights": [
            {"id": "lenina_1", "position": "начало улицы", "brightness": 100, "power": True},
            {"id": "lenina_2", "position": "около магазина", "brightness": 80, "power": True},
            {"id": "lenina_3", "position": "возле парка", "brightness": 60, "power": False},
        ],
        "auto_schedule": {
            "enabled": True,
            "on_time": "18:00",
            "off_time": "06:00"
        },
        "total_lights": 15,
        "working_lights": 12,
        "broken_lights": 3
    },
    "gagarina": {
        "id": "gagarina",
        "name": "ул. Гагарина",
        "lights": [
            {"id": "gagarina_1", "position": "начало", "brightness": 100, "power": True},
            {"id": "gagarina_2", "position": "центр", "brightness": 0, "power": False},
        ],
        "auto_schedule": {
            "enabled": False,
            "on_time": "19:00",
            "off_time": "07:00"
        },
        "total_lights": 8,
        "working_lights": 7,
        "broken_lights": 1
    }
}

# Модели данных
class LightCommand(BaseModel):
    command: str  # "turn_on", "turn_off", "set_brightness"
    value: Optional[int] = None

class ScheduleCommand(BaseModel):
    enabled: bool
    on_time: str
    off_time: str

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Street Light Control System"}

@app.get("/api/streets")
async def get_streets():
    """Получить список всех улиц"""
    return list(streets_data.values())

@app.get("/api/streets/{street_id}")
async def get_street(street_id: str):
    """Получить информацию по конкретной улице"""
    if street_id not in streets_data:
        raise HTTPException(status_code=404, detail="Street not found")
    return streets_data[street_id]

@app.post("/api/streets/{street_id}/lights/{light_id}/command")
async def control_light(street_id: str, light_id: str, command: LightCommand):
    """Управление конкретным фонарем"""
    if street_id not in streets_data:
        raise HTTPException(status_code=404, detail="Street not found")
    
    street = streets_data[street_id]
    light = next((l for l in street["lights"] if l["id"] == light_id), None)
    
    if not light:
        raise HTTPException(status_code=404, detail="Light not found")
    
    # Обработка команд
    if command.command == "turn_on":
        light["power"] = True
        light["brightness"] = light["brightness"] or 100
    elif command.command == "turn_off":
        light["power"] = False
        light["brightness"] = 0
    elif command.command == "set_brightness" and command.value is not None:
        light["brightness"] = max(0, min(100, command.value))
        light["power"] = light["brightness"] > 0
    
    # Обновляем статистику
    update_street_stats(street_id)
    
    return {"status": "success", "light": light}

@app.post("/api/streets/{street_id}/command")
async def control_street_lights(street_id: str, command: LightCommand):
    """Управление всеми фонарями на улице"""
    if street_id not in streets_data:
        raise HTTPException(status_code=404, detail="Street not found")
    
    street = streets_data[street_id]
    
    for light in street["lights"]:
        if command.command == "turn_on":
            light["power"] = True
            light["brightness"] = light["brightness"] or 100
        elif command.command == "turn_off":
            light["power"] = False
            light["brightness"] = 0
        elif command.command == "set_brightness" and command.value is not None:
            light["brightness"] = max(0, min(100, command.value))
            light["power"] = light["brightness"] > 0
    
    update_street_stats(street_id)
    
    return {"status": "success"}

@app.post("/api/streets/{street_id}/schedule")
async def update_schedule(street_id: str, schedule: ScheduleCommand):
    """Обновить расписание для улицы"""
    if street_id not in streets_data:
        raise HTTPException(status_code=404, detail="Street not found")
    
    streets_data[street_id]["auto_schedule"] = schedule.dict()
    return {"status": "success", "schedule": schedule}

# Вспомогательные функции
def update_street_stats(street_id: str):
    """Обновление статистики по улице"""
    street = streets_data[street_id]
    working_lights = sum(1 for light in street["lights"] if light["power"])
    total_lights = len(street["lights"])
    
    street["working_lights"] = working_lights
    street["total_lights"] = total_lights
    street["broken_lights"] = total_lights - working_lights

# Добавляем еще улиц при старте
def initialize_streets():
    additional_streets = {
        "sovetskaya": {
            "id": "sovetskaya",
            "name": "ул. Советская",
            "lights": [
                {"id": "sovetskaya_1", "position": "начало", "brightness": 100, "power": True},
                {"id": "sovetskaya_2", "position": "школа", "brightness": 70, "power": True},
            ],
            "auto_schedule": {"enabled": True, "on_time": "17:30", "off_time": "06:30"},
            "total_lights": 10,
            "working_lights": 8,
            "broken_lights": 2
        },
        "pushkina": {
            "id": "pushkina",
            "name": "ул. Пушкина",
            "lights": [
                {"id": "pushkina_1", "position": "начало", "brightness": 0, "power": False},
                {"id": "pushkina_2", "position": "библиотека", "brightness": 0, "power": False},
            ],
            "auto_schedule": {"enabled": False, "on_time": "18:30", "off_time": "07:00"},
            "total_lights": 6,
            "working_lights": 0,
            "broken_lights": 6
        }
    }
    streets_data.update(additional_streets)

# Инициализируем данные при старте
initialize_streets()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)