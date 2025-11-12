import React, { useState, useEffect, useMemo } from 'react';
import { storesData } from '../constants';
import type { Store } from '../types';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-600"><path fillRule="evenodd" d="M11.54 22.35a.75.75 0 01-1.08 0l-6.75-6.75a.75.75 0 01.02-1.06l.12-.12a.75.75 0 011.06 0l6.22 6.22 8.47-8.47a.75.75 0 111.06 1.06l-9 9z" clipRule="evenodd" transform="translate(-1.5, -4.5) scale(1.2)" /><path fillRule="evenodd" d="M12 2.25c-5.122 0-9.25 4.128-9.25 9.25 0 2.875 1.32 5.463 3.4 7.21l.34.28.32.26a.75.75 0 00.97-.03l.03-.03.01-.01c.42-.42.91-.77 1.4-1.06a8.89 8.89 0 011.08-3.08 9.219 9.219 0 013.5-3.58c.28-.2.58-.38.88-.55a.75.75 0 00.21-1.4c-.2-.1-.4-.2-.6-.28a1.5 1.5 0 00-.33-.09 9.25 9.25 0 00-9.25-9.25zM12 7a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 0112 7z" clipRule="evenodd" transform="translate(0, 0) scale(1)" /></svg>;

// Haversine formula to calculate distance between two lat/lng points
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        0.5 - Math.cos(dLat)/2 + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        (1 - Math.cos(dLon))/2;
    return R * 2 * Math.asin(Math.sqrt(a));
};

export const StoreLocatorPage: React.FC = () => {
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setLocationError(null);
                },
                (error) => {
                    console.error("Error getting location", error);
                    setLocationError("Could not retrieve your location. Showing all stores.");
                }
            );
        } else {
            setLocationError("Geolocation is not supported by this browser.");
        }
    }, []);

    const sortedStores = useMemo(() => {
        if (userLocation) {
            return [...storesData]
                .map(store => ({
                    ...store,
                    distance: getDistance(userLocation.lat, userLocation.lng, store.lat, store.lng)
                }))
                .sort((a, b) => a.distance - b.distance);
        }
        return storesData.map(store => ({ ...store, distance: undefined }));
    }, [userLocation]);


    const mapBounds = { minLat: 6.40, maxLat: 6.70, minLng: 3.25, maxLng: 3.50 };

    const getPositionOnMap = (lat: number, lng: number) => {
        const top = 100 - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
        const left = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
        return { top: `${top}%`, left: `${left}%` };
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            <div className="bg-[#0052FF] text-white text-center py-6">
                <h1 className="text-3xl font-bold">Our Stores</h1>
                <p className="text-lg">Locate bokku! Store nearest to you!</p>
            </div>
            <div className="flex flex-grow overflow-hidden">
                {/* Left Panel */}
                <div className="w-full md:w-1/3 p-4 overflow-y-auto bg-white shadow-lg flex flex-col">
                    <div className="relative mb-4">
                        <input type="text" placeholder="Enter address or zip code..." className="w-full pl-10 pr-4 py-2 border rounded-md" />
                        <div className="absolute top-1/2 left-3 transform -translate-y-1/2"><SearchIcon /></div>
                    </div>
                    {locationError && <p className="text-red-500 text-sm mb-4">{locationError}</p>}
                    <div className="flex-grow overflow-y-auto">
                        {sortedStores.map(store => (
                            <div key={store.id} className="p-4 mb-2 border rounded-lg hover:bg-gray-50">
                                <h2 className="font-bold text-lg text-slate-800">{store.name}</h2>
                                <div className="flex items-center mt-1">
                                    <span className={`h-2 w-2 rounded-full mr-2 ${store.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                    <span className={`text-sm font-semibold ${store.isOpen ? 'text-green-600' : 'text-red-600'}`}>{store.isOpen ? 'Open Now' : 'Closed'}</span>
                                    {store.distance !== undefined && (
                                        <span className="ml-auto text-sm text-slate-500">{store.distance.toFixed(1)} km away</span>
                                    )}
                                </div>
                                <p className="text-slate-600 mt-2">{store.address}</p>
                                <p className="text-slate-500 text-sm mt-1">Today: {store.hours}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel (Map) */}
                <div className="hidden md:block w-2/3 bg-[#f5f3f0] relative">
                    {sortedStores.map(store => {
                        const { top, left } = getPositionOnMap(store.lat, store.lng);
                        return (
                             <div key={store.id} style={{ top, left }} className="absolute transform -translate-x-1/2 -translate-y-1/2" title={store.name}>
                                <PinIcon />
                            </div>
                        )
                    })}

                    <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/70 px-2 py-1 rounded">
                        &copy; Mapbox | &copy; OpenStreetMap
                    </div>

                    <div className="absolute top-4 right-4 flex flex-col space-y-1 bg-white p-1 rounded-md shadow">
                        <button className="w-8 h-8 flex items-center justify-center border rounded text-lg font-bold">+</button>
                        <button className="w-8 h-8 flex items-center justify-center border rounded text-lg font-bold">-</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
