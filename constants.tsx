import React from 'react';
import { TaskType, Frequency, TaskDefinition, BLOCKS } from './types';
import { 
  Trash2, 
  Wind, 
  Droplets, 
  CarFront, 
  Sparkles, 
  GalleryVerticalEnd 
} from 'lucide-react';

export const TASK_DEFINITIONS: TaskDefinition[] = [];

// Generate Tasks dynamically based on society rules

// 1. Daily Brooming - All Blocks (Lobbies)
BLOCKS.forEach(block => {
  TASK_DEFINITIONS.push({
    id: `broom-b${block}`,
    title: `Block ${block} Lobby Brooming`,
    type: TaskType.BROOMING,
    frequency: Frequency.DAILY,
    area: `Block ${block} Lobby`,
    block: block
  });
});

// 2. Weekly Mopping - All Blocks (Resident Floors)
BLOCKS.forEach(block => {
  TASK_DEFINITIONS.push({
    id: `mop-b${block}`,
    title: `Block ${block} Floor Mopping`,
    type: TaskType.MOPPING,
    frequency: Frequency.WEEKLY,
    area: `Block ${block} Residential Floors`,
    block: block
  });
});

// 3. Garbage Collection - All Blocks Daily
BLOCKS.forEach(block => {
  TASK_DEFINITIONS.push({
    id: `garbage-b${block}`,
    title: `Block ${block} Door-to-Door Garbage`,
    type: TaskType.GARBAGE_COLLECTION,
    frequency: Frequency.DAILY,
    area: `Block ${block} All Flats`,
    block: block
  });
});

// 4. Driveway
TASK_DEFINITIONS.push({
  id: `driveway-broom`,
  title: `Main Driveway Brooming`,
  type: TaskType.DRIVEWAY,
  frequency: Frequency.WEEKLY,
  area: `Society Driveway`
});

// 5. Entrance/Glass
TASK_DEFINITIONS.push({
  id: `glass-entrance`,
  title: `Entrance & Glass Cleaning`,
  type: TaskType.GLASS_CLEANING,
  frequency: Frequency.DAILY,
  area: `Main Entrance`
});


export const getTaskIcon = (type: TaskType) => {
  switch (type) {
    case TaskType.GARBAGE_COLLECTION: return <Trash2 className="w-5 h-5 text-red-500" />;
    case TaskType.BROOMING: return <Wind className="w-5 h-5 text-orange-500" />;
    case TaskType.MOPPING: return <Droplets className="w-5 h-5 text-blue-500" />;
    case TaskType.DRIVEWAY: return <CarFront className="w-5 h-5 text-slate-600" />;
    case TaskType.GLASS_CLEANING: return <Sparkles className="w-5 h-5 text-cyan-500" />;
    case TaskType.STAIRCASE: return <GalleryVerticalEnd className="w-5 h-5 text-purple-500" />;
    default: return <Sparkles className="w-5 h-5 text-gray-500" />;
  }
};
