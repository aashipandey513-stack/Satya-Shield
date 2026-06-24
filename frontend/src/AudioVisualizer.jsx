import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AudioVisualizer = ({ visuals }) => {
  // If the backend hasn't sent visual data yet, don't render anything
  if (!visuals || !visuals.mfcc || !visuals.chroma) return null;

  // 1. Format MFCC Data (13 Coefficients)
  const mfccData = visuals.mfcc.map((val, index) => ({
    name: `C${index + 1}`,
    value: parseFloat(val.toFixed(2))
  }));

  // 2. Format Chroma Data (12 Pitch Classes)
  const pitchClasses = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const chromaData = visuals.chroma.map((val, index) => ({
    note: pitchClasses[index],
    intensity: parseFloat(val.toFixed(3))
  }));

  return (
    <div className="w-full mt-8 space-y-8 animate-fade-in">
      
      {/* MFCC Chart Section */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-emerald-400 mb-1">Acoustic Fingerprint (MFCC)</h3>
        <p className="text-sm text-gray-400 mb-6">Visualizes the simulated vocal tract shape. Deepfakes often struggle to replicate natural micro-variations here.</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mfccData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" tick={{fontSize: 12}} />
              <YAxis stroke="#9CA3AF" tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#10B981' }}
              />
              <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chroma Chart Section */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-400 mb-1">Tonal Pitch Map (Chroma)</h3>
        <p className="text-sm text-gray-400 mb-6">Maps energy distribution across standard pitch classes to detect unnatural robotic frequencies.</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chromaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis dataKey="note" stroke="#9CA3AF" tick={{fontSize: 12}} />
              <YAxis stroke="#9CA3AF" tick={{fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                itemStyle={{ color: '#3B82F6' }}
              />
              <Area type="monotone" dataKey="intensity" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default AudioVisualizer;