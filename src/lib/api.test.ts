import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetSession = vi.fn();
const mockSignOut = vi.fn();

vi.mock("next-auth/react", () => ({
  getSession: mockGetSession,
  signOut: mockSignOut,
}));

describe("apiClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("attaches Authorization header when session has accessToken", async () => {
    mockGetSession.mockResolvedValue({ accessToken: "token-123" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { apiClient } = await import("./api");
    await apiClient.get("/health");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      Authorization: "Bearer token-123",
    });
  });

  it("omits Authorization header when no session token", async () => {
    mockGetSession.mockResolvedValue(null);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { apiClient } = await import("./api");
    await apiClient.get("/health");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1]?.headers).not.toHaveProperty("Authorization");
  });

  it("triggers signOut on 401 responses", async () => {
    mockGetSession.mockResolvedValue({ accessToken: "expired-token" });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({ message: "Unauthorized", statusCode: 401 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { apiClient } = await import("./api");
    await expect(apiClient.get("/documents")).rejects.toThrow("Unauthorized");
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });
});
