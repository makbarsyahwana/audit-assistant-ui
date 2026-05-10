import { render } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import ChatPage from "./page";

const mockUseChat = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () =>
    ({
      get: (key: string) => (key === "engagement" ? "eng_123" : null),
    }) as URLSearchParams,
}));

vi.mock("@/hooks/useChat", () => ({
  useChat: (...args: unknown[]) => mockUseChat(...args),
}));

vi.mock("@/contexts/ModeContext", () => ({
  useModeContext: () => ({
    mode: "audit",
    config: {
      suggestions: [],
      terminology: {
        counselGreeting: "How can I help?",
      },
    },
  }),
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null }),
}));

describe("ChatPage", () => {
  it("passes engagement query param into useChat", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      loading: false,
      sendMessage: vi.fn(),
      clearMessages: vi.fn(),
    });

    render(createElement(ChatPage));

    expect(mockUseChat).toHaveBeenCalledWith("eng_123");
  });
});
