import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useEngagements } from "./useEngagements";

const mockGet = vi.fn();

vi.mock("@/lib/api", () => ({
  apiClient: {
    get: (...args: unknown[]) => mockGet(...args),
  },
}));

describe("useEngagements", () => {
  it("uses uppercased mode query param", async () => {
    mockGet.mockResolvedValueOnce([]);

    renderHook(() => useEngagements("audit"));

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith("/engagements?mode=AUDIT");
    });
  });
});
