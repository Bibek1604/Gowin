import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDetailStore = create(
    persist(
        (set) => ({
        detail: [],
        addDetail: (detail) =>
            set((state) => ({
            detail: [...state.detail, detail],
            })),
        updateDetail: (id, updatedDetail) =>
            set((state) => ({
            detail: state.detail.map((det) =>
                det.id === id ? updatedDetail : det
            ),
            })),
        deleteDetail: (id) =>
            set((state) => ({
            detail: state.detail.filter((det) => det.id !== id),
            })),
        }),
        {
        name: 'detail-storage',
        }
    )
    );

export default useDetailStore;