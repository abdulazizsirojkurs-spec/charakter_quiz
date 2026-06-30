import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Build, Platform, CPUProduct, MotherboardProduct, RAMProduct,
  GPUProduct, SSDProduct, PSUProduct, CoolerProduct, CaseProduct, MonitorProduct } from '@/types';

interface BuildStore {
  build: Build;
  setPlatform: (p: Platform) => void;
  setCpu: (p: CPUProduct) => void;
  setMotherboard: (p: MotherboardProduct) => void;
  setRam: (p: RAMProduct) => void;
  setGpu: (p: GPUProduct) => void;
  setSsd: (p: SSDProduct) => void;
  setPsu: (p: PSUProduct) => void;
  setCooler: (p: CoolerProduct) => void;
  setCase: (p: CaseProduct) => void;
  setMonitor: (p: MonitorProduct) => void;
  reset: () => void;
}

export const useBuildStore = create<BuildStore>()(
  persist(
    (set) => ({
      build: {},
      setPlatform: (platform) => set((s) => ({ build: { ...s.build, platform } })),
      setCpu: (cpu) => set((s) => ({ build: { ...s.build, cpu } })),
      setMotherboard: (motherboard) => set((s) => ({ build: { ...s.build, motherboard } })),
      setRam: (ram) => set((s) => ({ build: { ...s.build, ram } })),
      setGpu: (gpu) => set((s) => ({ build: { ...s.build, gpu } })),
      setSsd: (ssd) => set((s) => ({ build: { ...s.build, ssd } })),
      setPsu: (psu) => set((s) => ({ build: { ...s.build, psu } })),
      setCooler: (cooler) => set((s) => ({ build: { ...s.build, cooler } })),
      setCase: (caseItem) => set((s) => ({ build: { ...s.build, case: caseItem } })),
      setMonitor: (monitor) => set((s) => ({ build: { ...s.build, monitor } })),
      reset: () => set({ build: {} }),
    }),
    { name: 'tx-build' }
  )
);
