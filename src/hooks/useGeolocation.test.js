import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useGeolocation } from "./useGeolocation";

beforeEach(() => { // 
  global.navigator.geolocation = { // on simulie l'API geolocation car on ne peut pas l'utiliser directement en test
    watchPosition: vi.fn(), 
    clearWatch: vi.fn(),// on vérifie juste que ces fonctions sont appelées, pas leur fonctionnement interne
  };
});

describe("useGeolocation", () => { // on groupe les tests liés au hook useGeolocation
  it("initialise sans position ni erreur", () => { // on teste l'état initial du hook
    const { result } = renderHook(() => useGeolocation()); // on vérifie que les valeurs initiales sont correctes

    expect(result.current.position).toBe(null); // position initiale doit être null
    expect(result.current.error).toBe(null); // erreur initiale doit être null
    expect(typeof result.current.startWatching).toBe("function"); // on vérifie que startWatching est une fonction
  });
});
