import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "./sidebar";

const mockUseSession = vi.fn();

vi.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

vi.mock("@/contexts/ModeContext", () => ({
  useModeContext: () => ({
    config: {
      terminology: {
        topLevelEntityPlural: "Engagements",
      },
    },
  }),
}));

describe("Sidebar", () => {
  it("hides Admin section for non-admin users", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: "Auditor User",
          role: "AUDITOR",
        },
      },
    });

    render(createElement(Sidebar));
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });
});
