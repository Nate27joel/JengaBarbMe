import { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { Professional } from '../../types';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface DiscoveryMapProps {
  professionals: Professional[];
  selectedId?: string;
  onSelect: (pro: Professional) => void;
}

const MapContent = ({ professionals, onSelect }: { professionals: Professional[]; onSelect: (pro: Professional) => void }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || professionals.length === 0) return;
    
    const bounds = new google.maps.LatLngBounds();
    professionals.forEach(pro => bounds.extend({ lat: pro.latitude, lng: pro.longitude }));
    map.fitBounds(bounds, 50);
  }, [map, professionals]);

  return (
    <>
      {professionals.map(pro => (
        <AdvancedMarker
          key={pro.id}
          position={{ lat: pro.latitude, lng: pro.longitude }}
          onClick={() => onSelect(pro)}
          title={pro.id}
        >
          <Pin 
            background="#c4a47c" 
            borderColor="#8b7355" 
            glyphColor="#0d0d0d"
            scale={1.2}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export const DiscoveryMap = ({ professionals, onSelect }: DiscoveryMapProps) => {
  if (!hasValidKey) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-bg-deep p-8 text-center rounded-3xl border border-dashed border-border-muted">
        <h2 className="text-xl font-light text-white mb-4 italic font-serif">Google Maps API <span className="text-brand">Key Required</span></h2>
        <p className="text-[#555] mb-6 max-w-sm uppercase tracking-widest text-[10px] font-black">Enable the discovery map by adding your credentials.</p>
        <div className="bg-bg-surface p-6 rounded-2xl shadow-xl text-left text-[10px] space-y-3 border border-border-muted font-black tracking-widest uppercase text-[#888]">
          <p>1. Open <strong className="text-brand">Settings (⚙️)</strong></p>
          <p>2. Select <strong className="text-brand">Secrets</strong></p>
          <p>3. Add <code className="text-white">GOOGLE_MAPS_PLATFORM_KEY</code></p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <div className="h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-border-muted">
        <Map
          defaultCenter={{ lat: 6.5244, lng: 3.3792 }} // Default to Lagos
          defaultZoom={11}
          mapId="DISCOVERY_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          disableDefaultUI={true}
          zoomControl={true}
        >
          <MapContent professionals={professionals} onSelect={onSelect} />
        </Map>
      </div>
    </APIProvider>
  );
};
