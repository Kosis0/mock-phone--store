import React, { Suspense } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { existsSync } from "node:fs";
import { join } from "node:path";
import Home from "@/app/page";
import ComparePage from "@/app/compare/page";
import DevicePage from "@/app/iphone/[slug]/page";
import TimelinePage from "@/app/timeline/page";
import CompareDock from "@/components/CompareDock";
import Navbar from "@/components/Navbar";
import { CompareProvider, useCompare } from "@/context/CompareContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { MOCK_IPHONES } from "@/data/mockIphones";

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CompareProvider>
        <Navbar />
        {children}
        <CompareDock />
      </CompareProvider>
    </ThemeProvider>
  );
}

function CompareHarness() {
  const { slugs, toggle, setSlugs } = useCompare();
  return (
    <>
      <output data-testid="selected-slugs">{slugs.join(",")}</output>
      {MOCK_IPHONES.slice(0, 8).map((phone) => (
        <button key={phone.slug} onClick={() => toggle(phone.slug)}>
          {phone.slug}
        </button>
      ))}
      <button
        onClick={() =>
          setSlugs(["invalid", ...MOCK_IPHONES.map((phone) => phone.slug)])
        }
      >
        set invalid list
      </button>
    </>
  );
}

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  window.history.replaceState(null, "", "/");
});

afterEach(() => cleanup());

describe("catalog, theme toggle, and search interactions", () => {
  it("renders all 34 iPhones, filters by connector and active lineup, and resets cleanly", () => {
    render(
      <AppShell>
        <Home />
      </AppShell>
    );
    expect(screen.getAllByRole("article")).toHaveLength(MOCK_IPHONES.length);
    expect(MOCK_IPHONES.length).toBeGreaterThanOrEqual(34);
    expect(document.querySelector(".nav-status")).toBeNull();

    const lightningCount = MOCK_IPHONES.filter(
      (p) => p.portType === "Lightning"
    ).length;
    fireEvent.change(screen.getByDisplayValue("Any port"), {
      target: { value: "Lightning" },
    });
    expect(screen.getAllByRole("article")).toHaveLength(lightningCount);

    fireEvent.click(screen.getByRole("button", { name: "RESET" }));
    expect(screen.getAllByRole("article")).toHaveLength(MOCK_IPHONES.length);

    const activeCount = MOCK_IPHONES.filter((p) => p.currentLineup).length;
    fireEvent.click(
      screen.getByRole("button", { name: new RegExp(`2026 Active \\(${activeCount}\\)`) })
    );
    expect(screen.getAllByRole("article")).toHaveLength(activeCount);
  });

  it("toggles between light and dark themes and persists the selection", () => {
    render(
      <AppShell>
        <Home />
      </AppShell>
    );

    const toggleBtn = screen.getByRole("button", {
      name: /switch to dark mode/i,
    });
    fireEvent.click(toggleBtn);
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(localStorage.getItem("specwise-theme")).toBe("dark");

    const lightBtn = screen.getByRole("button", {
      name: /switch to light mode/i,
    });
    fireEvent.click(lightBtn);
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("specwise-theme")).toBe("light");
  });

  it("finds model identifiers in navbar search, opens specs, and links to comparison", () => {
    render(
      <AppShell>
        <Home />
      </AppShell>
    );
    fireEvent.change(screen.getByPlaceholderText(/search iphone/i), {
      target: { value: "A3447" },
    });

    const result = document.querySelector(".search-result");
    expect(result).not.toBeNull();
    expect(
      within(result as HTMLElement).getByRole("link", { name: /iPhone Duo/ })
    ).toHaveAttribute("href", "/iphone/iphone-duo");
    expect(
      within(result as HTMLElement).getByRole("link", { name: /Compare/ })
    ).toHaveAttribute("href", "/compare?models=iphone-duo");
  });

  it("updates the active finish image on a photographic card and adds a device to the compare dock", async () => {
    render(
      <AppShell>
        <Home />
      </AppShell>
    );
    expect(document.querySelector(".hero-stage-card")).toBeInTheDocument();

    const card = screen
      .getAllByRole("article")
      .find((el) => within(el).queryByRole("heading", { name: "iPhone 17 Pro" }));
    expect(card).toBeDefined();
    expect(card?.querySelector(".phone-image")).toHaveAttribute(
      "src",
      "/phones/iphone-17-pro-cosmic-orange.png"
    );

    fireEvent.click(
      within(card as HTMLElement).getByRole("button", { name: "Deep Blue" })
    );
    expect(card?.querySelector(".phone-image")).toHaveAttribute(
      "src",
      "/phones/iphone-17-pro-deep-blue.png"
    );

    fireEvent.click(
      within(card as HTMLElement).getByRole("button", { name: "+ Compare" })
    );
    expect(await screen.findByText("Compare devices")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Compare now/ })).toHaveAttribute(
      "href",
      "/compare?models=iphone-17-pro"
    );
  });

  it("routes every catalog device card to its matching specification sheet", () => {
    render(
      <AppShell>
        <Home />
      </AppShell>
    );
    const cardLinks = [...document.querySelectorAll(".product-card .card-art")];
    expect(cardLinks.map((link) => link.getAttribute("href"))).toEqual(
      MOCK_IPHONES.map((phone) => `/iphone/${phone.slug}`)
    );
  });
});

describe("compare selection and matrix", () => {
  it("hydrates cleanly, caps selections at four, removes selections, and persists", async () => {
    render(
      <AppShell>
        <CompareHarness />
      </AppShell>
    );
    await waitFor(() =>
      expect(screen.getByTestId("selected-slugs")).toHaveTextContent("")
    );
    for (const phone of MOCK_IPHONES.slice(0, 5)) {
      fireEvent.click(screen.getByRole("button", { name: phone.slug }));
    }
    const selected = MOCK_IPHONES.slice(0, 4)
      .map((phone) => phone.slug)
      .join(",");
    expect(screen.getByTestId("selected-slugs")).toHaveTextContent(selected);
    expect(JSON.parse(localStorage.getItem("iphone-compare") || "[]")).toEqual(
      MOCK_IPHONES.slice(0, 4).map((phone) => phone.slug)
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: `Remove ${MOCK_IPHONES[0].name} from comparison`,
      })
    );
    expect(screen.getByTestId("selected-slugs")).not.toHaveTextContent(
      MOCK_IPHONES[0].slug
    );
  });

  it("sanitizes saved selections and survives rapid repeated toggles", async () => {
    localStorage.setItem(
      "iphone-compare",
      JSON.stringify(["not-a-phone", "iphone-15", "iphone-15", null])
    );
    render(
      <AppShell>
        <CompareHarness />
      </AppShell>
    );
    await waitFor(() =>
      expect(screen.getByTestId("selected-slugs")).toHaveTextContent("iphone-15")
    );

    const toggle = screen.getByRole("button", { name: "iphone-17" });
    for (let i = 0; i < 30; i++) fireEvent.click(toggle);
    expect(screen.getByTestId("selected-slugs")).toHaveTextContent("iphone-15");
    expect(JSON.parse(localStorage.getItem("iphone-compare") || "[]")).toEqual([
      "iphone-15",
    ]);
  });

  it("reads URL models once, exposes a third-device slot, syncs changes, and hides equal rows", async () => {
    window.history.replaceState(
      null,
      "",
      "/compare?models=iphone-16-pro,iphone-16"
    );
    render(
      <AppShell>
        <ComparePage />
      </AppShell>
    );
    await screen.findByText("2 SELECTED");
    expect(screen.getByText("Ingress protection")).toBeInTheDocument();
    expect(document.querySelectorAll(".device-column")).toHaveLength(3);

    const addColumn = document.querySelector(".empty-device select");
    expect(addColumn).not.toBeNull();
    fireEvent.change(addColumn as HTMLSelectElement, {
      target: { value: "iphone-15-pro" },
    });
    await waitFor(() =>
      expect(new URLSearchParams(window.location.search).get("models")).toBe(
        "iphone-16-pro,iphone-16,iphone-15-pro"
      )
    );
    expect(screen.getByText("3 SELECTED")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("checkbox", { name: /highlight differences/i })
    );
    await waitFor(() =>
      expect(screen.queryByText("Ingress protection")).not.toBeInTheDocument()
    );
  });

  it("removes model selections and keeps a minimum of two selectable columns", async () => {
    window.history.replaceState(
      null,
      "",
      "/compare?models=iphone-17,iphone-16-pro"
    );
    render(
      <AppShell>
        <ComparePage />
      </AppShell>
    );
    await screen.findByText("2 SELECTED");
    fireEvent.click(
      document.querySelector(".compare-page .remove-device") as HTMLButtonElement
    );
    await waitFor(() =>
      expect(new URLSearchParams(window.location.search).get("models")).toBe(
        "iphone-16-pro"
      )
    );
    expect(document.querySelectorAll(".device-column")).toHaveLength(2);
  });
});

describe("specification sheet, studio gallery, and timeline", () => {
  it("renders details, switches finish and studio/front/back gallery angles, toggles zoom, and adds to comparison", async () => {
    const params = Promise.resolve({ slug: "iphone-16-pro" });
    await act(async () => {
      render(
        <AppShell>
          <Suspense fallback={<p>Loading…</p>}>
            <DevicePage params={params} />
          </Suspense>
        </AppShell>
      );
      await params;
    });

    expect(
      await screen.findByRole("heading", { name: "iPhone 16 Pro" })
    ).toBeInTheDocument();
    expect(
      screen.getAllByText("04 / Platform & performance").length
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(/Regional models & identifiers/)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Black Titanium" }));
    expect(document.querySelector(".gallery-photo")).toHaveAttribute(
      "src",
      "/phones/iphone-16-pro-black-titanium.png"
    );

    fireEvent.click(screen.getByRole("tab", { name: "Front" }));
    expect(document.querySelector(".gallery-photo")).toHaveAttribute(
      "src",
      "/phones/iphone-16-pro-black-titanium-front.png"
    );

    fireEvent.click(screen.getByRole("tab", { name: "Back" }));
    expect(document.querySelector(".gallery-photo")).toHaveAttribute(
      "src",
      "/phones/iphone-16-pro-black-titanium-back.png"
    );

    const zoomBtn = screen.getByRole("button", { name: /zoom in on device/i });
    fireEvent.click(zoomBtn);
    expect(document.querySelector(".studio-gallery")).toHaveClass("is-zoomed");

    fireEvent.click(
      screen.getByRole("button", { name: /Compare this iPhone/ })
    );
    expect(await screen.findByText("Compare devices")).toBeInTheDocument();
  });

  it("renders the 8-year generations timeline cleanly", () => {
    render(
      <AppShell>
        <TimelinePage />
      </AppShell>
    );
    expect(
      screen.getByRole("heading", { name: /eight years of/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "2026" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "2019" })).toBeInTheDocument();
  });

  it("keeps a chassis fallback if a product image fails", async () => {
    render(
      <AppShell>
        <Home />
      </AppShell>
    );
    const img = document.querySelector("img.phone-image") as HTMLImageElement;
    expect(img).not.toBeNull();
    fireEvent.error(img);
    await waitFor(() =>
      expect(document.querySelector(".phone-shell")).toBeInTheDocument()
    );
  });

  it("has local studio, front, and back images for every finish that declares an imageUrl", () => {
    for (const phone of MOCK_IPHONES) {
      for (const finish of phone.finishes) {
        if (!finish.imageUrl) continue;
        expect(
          existsSync(join(process.cwd(), "public", finish.imageUrl.replace(/^\//, "")))
        ).toBe(true);
        expect(
          existsSync(
            join(
              process.cwd(),
              "public",
              finish.imageUrl.replace(/\.png$/, "-front.png").replace(/^\//, "")
            )
          )
        ).toBe(true);
        expect(
          existsSync(
            join(
              process.cwd(),
              "public",
              finish.imageUrl.replace(/\.png$/, "-back.png").replace(/^\//, "")
            )
          )
        ).toBe(true);
      }
    }
  });
});
