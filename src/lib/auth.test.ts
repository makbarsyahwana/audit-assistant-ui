import { beforeEach, describe, expect, it, vi } from "vitest";

describe("authOptions", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    process.env.AUTH_API_URL = "http://localhost:8000";
    process.env.NEXTAUTH_SECRET = "test-secret";
  });

  it("authorize posts to /auth/login and returns mapped user", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        accessToken: "access-abc",
        user: {
          id: "usr_1",
          email: "admin@example.com",
          name: "Admin",
          role: "ADMIN",
        },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { authOptions } = await import("./auth");
    const credentialsProvider = authOptions.providers?.[0];
    const authorize = (credentialsProvider as { options: { authorize: Function } }).options.authorize;

    const result = await authorize({ email: "admin@example.com", password: "secret" });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/auth/login",
      expect.objectContaining({
        method: "POST",
      })
    );
    expect(result).toMatchObject({
      id: "usr_1",
      email: "admin@example.com",
      role: "ADMIN",
      accessToken: "access-abc",
    });
  });

  it("throws when NEXTAUTH_SECRET is missing", async () => {
    delete process.env.NEXTAUTH_SECRET;
    await expect(import("./auth")).rejects.toThrow("Missing NEXTAUTH_SECRET");
  });
});
