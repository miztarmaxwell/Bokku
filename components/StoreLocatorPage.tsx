import React, { useState, useEffect, useMemo, useRef } from 'react';
import { storesData } from '../constants';

// Declare Leaflet to TypeScript since it's loaded from a script tag
declare const L: any;

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

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
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

    const mapRef = useRef<any>(null);
    const markersRef = useRef<{ [key: number]: any }>({});
    const userMarkerRef = useRef<any>(null);
    const listRefs = useRef<{ [key: number]: HTMLLIElement | null }>({});


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
                    setLocationError("Could not retrieve your location. Please use the search bar.");
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

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([6.5244, 3.3792], 11); // Default to Lagos
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapRef.current);
        }
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;
    
        // Update user location marker
        if (userLocation) {
            if (!userMarkerRef.current) {
                const userIcon = L.divIcon({
                    html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>`,
                    className: '',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                });
                userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
            } else {
                userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
            }
            map.setView([userLocation.lat, userLocation.lng], 13);
        }
    
        // Clear existing store markers
        Object.values(markersRef.current).forEach(marker => marker.remove());
        markersRef.current = {};
    
        // Add new store markers
        sortedStores.forEach(store => {
            const marker = L.marker([store.lat, store.lng]).addTo(map);
            marker.bindPopup(`<b>${store.name}</b><br>${store.address}`);
            marker.on('click', () => {
                setSelectedStoreId(store.id);
                listRefs.current[store.id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
            markersRef.current[store.id] = marker;
        });
    }, [userLocation, sortedStores]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery) return;
        setIsSearching(true);
        setLocationError(null);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=ng&limit=1`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setUserLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
            } else {
                setLocationError('Could not find location. Please try a different search term.');
            }
        } catch (error) {
            console.error("Search error:", error);
            setLocationError('Failed to fetch location data. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleStoreSelect = (store: typeof sortedStores[0]) => {
        setSelectedStoreId(store.id);
        if (mapRef.current && markersRef.current[store.id]) {
            const marker = markersRef.current[store.id];
            mapRef.current.setView([store.lat, store.lng], 15);
            marker.openPopup();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            <div className="bg-[#0052FF] text-white text-center py-6">
                <h1 className="text-3xl font-bold">Our Stores</h1>
                <p className="text-lg">Locate a bokku! store nearest to you!</p>
            </div>
            <div className="flex flex-grow overflow-hidden">
                {/* Left Panel */}
                <div className="w-full md:w-1/3 p-4 overflow-y-auto bg-white shadow-lg flex flex-col">
                    <form onSubmit={handleSearch} className="relative mb-4">
                        <input 
                            type="text" 
                            placeholder="Enter address or zip code..." 
                            className="w-full pl-4 pr-20 py-2 border rounded-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                         />
                        <button type="submit" disabled={isSearching} className="absolute top-1/2 right-1 transform -translate-y-1/2 bg-[#0052FF] text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-[#002D7A] disabled:bg-gray-400">
                           {isSearching ? '...' : 'Search'}
                        </button>
                    </form>
                    {locationError && <p className="text-red-500 text-sm mb-4 px-1">{locationError}</p>}
                    <ul className="flex-grow overflow-y-auto">
                        {sortedStores.map(store => (
                            <li 
                                key={store.id} 
                                ref={el => { listRefs.current[store.id] = el }}
                                className={`p-4 mb-2 border rounded-lg cursor-pointer transition-all ${selectedStoreId === store.id ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'}`}
                                onClick={() => handleStoreSelect(store)}
                            >
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
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Panel (Map) */}
                <div className="hidden md:block w-2/3 bg-[#f5f3f0]">
                    <div id="map" className="h-full w-full"></div>
                </div>
            </div>
        </div>
    );
};