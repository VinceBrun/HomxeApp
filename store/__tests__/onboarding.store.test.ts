import { act, renderHook } from "@testing-library/react-hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOnboardingStore } from "../onboarding.store";

describe("useOnboardingStore", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useOnboardingStore.setState({ onboarded: false });
  });

  afterAll(async () => {
    await AsyncStorage.clear();
  });

  it("should initialize with default onboarded state as false", async () => {
    const { result } = renderHook(() => useOnboardingStore());
    expect(result.current.onboarded).toBe(false);
  });

  it("should update onboarded state", async () => {
    const { result } = renderHook(() => useOnboardingStore());
    act(() => {
      result.current.setOnboarded(true);
    });
    expect(result.current.onboarded).toBe(true);
  });

  it("should persist onboarded state changes", async () => {
    const { result } = renderHook(() => useOnboardingStore());
    act(() => {
      result.current.setOnboarded(true);
    });
    const { result: reloadedResult } = renderHook(() => useOnboardingStore());
    expect(reloadedResult.current.onboarded).toBe(true);
  });
});
