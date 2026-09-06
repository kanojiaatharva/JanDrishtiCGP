"use client";

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HotspotsMap() {
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    fetchApi('/hotspots')
      .then(data => setHotspots(data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // If no API key is provided, show a fallback mock map for the hackathon
  if (!apiKey) {
    return (
      <div className="flex flex-col h-full bg-gray-100 p-8">
        <div className="mb-4 flex justify-between items-center">
           <h2 className="text-2xl font-bold text-gray-900">Demand Hotspots</h2>
           <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
             Demo Mode (No Google Maps API Key)
           </span>
        </div>
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex relative">
           {/* Fake map background */}
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100 via-gray-200 to-gray-300 pattern-grid-lg"></div>
           
           <div className="relative z-10 w-full p-8 flex flex-col gap-4">
              {hotspots.map(hs => (
                <div 
                  key={hs.id} 
                  className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500 max-w-sm cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/dashboard/hotspots/${hs.id}`)}
                >
                  <h3 className="font-bold text-lg">{hs.area}</h3>
                  <p className="text-sm text-gray-500 mb-2">Priority Score: {hs.priorityScore}</p>
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-md uppercase tracking-wider">
                    {hs.primaryIssue}
                  </span>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  }

  // Real Google Maps integration
  return (
    <div className="flex flex-col h-full relative">
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Demand Hotspots</h2>
        <p className="text-sm text-gray-500">{hotspots.length} active clusters detected</p>
      </div>

      <div className="w-full h-full">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultZoom={13}
            defaultCenter={{ lat: 23.2599, lng: 77.4126 }} // Bhopal rough coords
            mapId="DEMO_MAP_ID"
            disableDefaultUI={true}
          >
            {hotspots.map((hs) => (
              <AdvancedMarker 
                key={hs.id} 
                position={{ lat: hs.lat, lng: hs.lng }}
                onClick={() => router.push(`/dashboard/hotspots/${hs.id}`)}
              >
                <Pin background={'#ef4444'} borderColor={'#7f1d1d'} glyphColor={'#ffffff'} />
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
