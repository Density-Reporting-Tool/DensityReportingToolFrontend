import { create } from "zustand";
import { ProctorData } from "@/types/proctors";

interface ProctorState {
  selectedProctor: ProctorData | undefined;
  selectedProctorIndex: number | undefined;
  setSelectedProctor: (proctor: ProctorData, index: number) => void;
  clearSelectedProctor: () => void;
}

export const useProctorStore = create<ProctorState>((set) => ({
  selectedProctor: undefined,
  selectedProctorIndex: undefined,
  setSelectedProctor: (proctor, index) =>
    set({ selectedProctor: proctor, selectedProctorIndex: index }),
  clearSelectedProctor: () =>
    set({ selectedProctor: undefined, selectedProctorIndex: undefined }),
}));
