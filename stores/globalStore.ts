import { create } from 'zustand'

interface IMarket {
    position: {
      lat: number;
      lng: number;
    };
    title: string;
    icon: string;
    date: Date;
    onClick: () => void
  }

interface IGlobalStore {
    currentLocation: {
      latitude: number;
      longitude: number;
    } | null;
    setCurrentLocation: (location: IGlobalStore["currentLocation"]) => void;
    maxDistance: number;
    setMaxDistance: (distance: number) => void
  }

export const useGlobalStore = create<IGlobalStore>((set) => ({
    currentLocation: null,
    maxDistance: 5000,
    setCurrentLocation: (location: IGlobalStore["currentLocation"]) => set(() => ({ currentLocation: location })),
    setMaxDistance: (distance: number) => set(() => ({ maxDistance: distance }))
}))