import { create } from "zustand";
import type { DatabaseMetadata } from "@/src/services/metadata.service";

interface MetadataState {
  metadata: DatabaseMetadata | null;

  metadataCache: Record<string, DatabaseMetadata>;

  loading: boolean;

  setMetadata: (connectionId: string, metadata: DatabaseMetadata) => void;

  getMetadata: (connectionId: string) => DatabaseMetadata | undefined;

  clearMetadata: () => void;

  setLoading: (loading: boolean) => void;
}

export const useMetadataStore = create<MetadataState>((set, get) => ({
  metadata: null,

  metadataCache: {},

  loading: false,

  setMetadata: (connectionId, metadata) =>
    set((state) => ({
      metadata,
      metadataCache: {
        ...state.metadataCache,
        [connectionId]: metadata
      }
    })),

  getMetadata: (connectionId) => get().metadataCache[connectionId],

  clearMetadata: () =>
    set({
      metadata: null,
      metadataCache: {}
    }),

  setLoading: (loading) =>
    set({
      loading
    })
}));
