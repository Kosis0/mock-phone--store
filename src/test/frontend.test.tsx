import React, { Suspense } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { existsSync } from "node:fs";
import { join } from "node:path";
import Home from "@/app/page";
import ComparePage from "@/app/compare/page";
import DevicePage from "@/app/iphone/[slug]/page";
import CompareDock from "@/components/CompareDock";
import Navbar from "@/components/Navbar";
import { CompareProvider, useCompare } from "@/context/CompareContext";
import { MOCK_IPHONES } from "@/data/mockIphones";

function AppWithCompare({ children }: { children: React.ReactNode }) {
  return <CompareProvider><Navbar />{children}<CompareDock /></CompareProvider>;
}

function CompareHarness() {
  const { slugs, toggle, setSlugs } = useCompare();
  return (
    <>
      <output data-testid="selected-slugs">{slugs.join(",")}</output>
      {MOCK_IPHONES.map((phone) => (
        <button key={phone.slug} onClick={() => toggle(phone.slug)}>{phone.slug}</button>
      ))}
      <button onClick={() => setSlugs(["invalid", ...MOCK_IPHONES.map((phone) => phone.slug)])}>set invalid list</button>
    </>
  );
}

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});

afterEach(() => cleanup());

describe("catalog and search interactions", () => {
  it("filters by connector and reset restores the complete catalog", () => {
    render(<AppWithCompare><Home /></AppWithCompare>);
    expect(screen.getAllByRole("article")).toHaveLength(MOCK_IPHONES.length);

    fireEvent.change(screen.getByDisplayValue("Any port"), { target: { value: "Lightning" } });
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "iPhone SE (3rd gen)" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "RESET" }));
    expect(screen.getAllByRole("article")).toHaveLength(MOCK_IPHONES.length);
  });

  it("finds model identifiers, opens specs, and links to comparison", () => {
    render(<AppWithCompare><Home /></AppWithCompare>);
    fireEvent.change(screen.getByPlaceholderText(/search iphone/i), { target: { value: "A3101" } });

    const result = document.querySelector(".search-result");
    expect(result).not.toBeNull();
    expect(within(result as HTMLElement).getByRole("link", { name: /iPhone 17 Pro/ })).toHaveAttribute("href", "/iphone/iphone-17-pro");
    expect(within(result as HTMLElement).getByRole("link", { name: /Compare/ })).toHaveAttribute("href", "/compare?models=iphone-17-pro");
  });

  it("updates the active finish image and adds a device to the compare dock", async () => {
    render(<AppWithCompare><Home /></AppWithCompare>);
    expect(document.querySelector(".hero-spin-ring")).toBeInTheDocument();
    const card = screen.getAllByRole("article")[0];
    expect(card).not.toBeNull();
    const image = card?.querySelector(".phone-image");
    expect(image).not.toBeNull();
    expect(image).toHaveAttribute("src", "/phones/iphone-17-pro-cosmic-orange.png");

    fireEvent.click(within(card as HTMLElement).getByRole("button", { name: "Deep Blue" }));
    expect(card?.querySelector(".phone-image")).toHaveAttribute("src", "/phones/iphone-17-pro-deep-blue.png");

    fireEvent.click(within(card as HTMLElement).getByRole("button", { name: "+ Compare" }));
    expect(await screen.findByText("Compare devices")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Compare now/ })).toHaveAttribute("href", "/compare?models=iphone-17-pro");
  });

  it("routes every catalog device card to its matching specification sheet", () => {
    render(<AppWithCompare><Home /></AppWithCompare>);
    const cardLinks = [...document.querySelectorAll(".product-card .card-art")];
    expect(cardLinks.map((link) => link.getAttribute("href"))).toEqual(MOCK_IPHONES.map((phone) => `/iphone/${phone.slug}`));
  });
});

describe("compare selection and matrix", () => {
  it("hydrates cleanly, caps selections at four, removes selections, and persists", async () => {
    render(<AppWithCompare><CompareHarness /></AppWithCompare>);
    await waitFor(() => expect(screen.getByTestId("selected-slugs")).toHaveTextContent(""));
    for (const phone of MOCK_IPHONES.slice(0, 5)) fireEvent.click(screen.getByRole("button", { name: phone.slug }));
    const selected = MOCK_IPHONES.slice(0, 4).map((phone) => phone.slug).join(",");
    expect(screen.getByTestId("selected-slugs")).toHaveTextContent(selected);
    expect(JSON.parse(localStorage.getItem("iphone-compare") || "[]")).toEqual(MOCK_IPHONES.slice(0, 4).map((phone) => phone.slug));

    fireEvent.click(screen.getByRole("button", { name: "Remove iPhone 17 Pro from comparison" }));
    expect(screen.getByTestId("selected-slugs")).not.toHaveTextContent("iphone-17-pro");
  });

  it("sanitizes saved selections and survives rapid repeated toggles", async () => {
    localStorage.setItem("iphone-compare", JSON.stringify(["not-a-phone", "iphone-15", "iphone-15", null]));
    render(<AppWithCompare><CompareHarness /></AppWithCompare>);
    await waitFor(() => expect(screen.getByTestId("selected-slugs")).toHaveTextContent("iphone-15"));

    const toggle = screen.getByRole("button", { name: "iphone-16" });
    for (let i = 0; i < 30; i++) fireEvent.click(toggle);
    expect(screen.getByTestId("selected-slugs")).toHaveTextContent("iphone-15");
    expect(JSON.parse(localStorage.getItem("iphone-compare") || "[]")).toEqual(["iphone-15"]);
  });

  it("reads URL models once, exposes a third-device slot, syncs changes, and hides equal rows", async () => {
    window.history.replaceState(null, "", "/compare?models=iphone-16-pro,iphone-16");
    render(<AppWithCompare><ComparePage /></AppWithCompare>);
    await screen.findByText("2 SELECTED");
    expect(screen.getByText("Ingress protection")).toBeInTheDocument();
    expect(document.querySelectorAll(".device-column")).toHaveLength(3);

    const addColumn = document.querySelector(".empty-device select");
    expect(addColumn).not.toBeNull();
    fireEvent.change(addColumn as HTMLSelectElement, { target: { value: "iphone-15-pro" } });
    await waitFor(() => expect(new URLSearchParams(window.location.search).get("models")).toBe("iphone-16-pro,iphone-16,iphone-15-pro"));
    expect(screen.getByText("3 SELECTED")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox", { name: /highlight differences/i }));
    await waitFor(() => expect(screen.queryByText("Ingress protection")).not.toBeInTheDocument());
  });

  it("removes model selections and keeps a minimum of two selectable columns", async () => {
    window.history.replaceState(null, "", "/compare?models=iphone-17,iphone-16-pro");
    render(<AppWithCompare><ComparePage /></AppWithCompare>);
    await screen.findByText("2 SELECTED");
    fireEvent.click(document.querySelector(".compare-page .remove-device") as HTMLButtonElement);
    await waitFor(() => expect(new URLSearchParams(window.location.search).get("models")).toBe("iphone-16-pro"));
    expect(document.querySelectorAll(".device-column")).toHaveLength(2);
  });
});

describe("specification sheet and image fallback", () => {
  it("renders details, switches finish, and adds the current phone to comparison", async () => {
    const params = Promise.resolve({ slug: "iphone-16-pro" });
    await act(async () => {
      render(<AppWithCompare><Suspense fallback={<p>Loading…</p>}><DevicePage params={params} /></Suspense></AppWithCompare>);
      await params;
    });
    expect(await screen.findByRole("heading", { name: "iPhone 16 Pro" })).toBeInTheDocument();
    expect(screen.getByText("04 / Platform & performance")).toBeInTheDocument();
    expect(screen.getByText(/Regional models & identifiers/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Black Titanium" }));
    expect(screen.getByRole("img", { name: /Black Titanium iPhone/ })).toBeInTheDocument();
    expect(document.querySelector(".phone-model-face-front .phone-model-image")).toHaveAttribute("src", "/phones/iphone-16-pro-black-titanium-front.png");
    const viewer = screen.getByRole("group", { name: /Black Titanium interactive iPhone viewer/ });
    const product = document.querySelector(".viewer-phone") as HTMLElement;
    fireEvent.pointerDown(viewer, { pointerId: 1, button: 0, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(viewer, { pointerId: 1, clientX: 150, clientY: 80 });
    expect(product.style.transform).toContain("rotateY(45deg)");
    fireEvent.pointerUp(viewer, { pointerId: 1, button: 0, clientX: 150, clientY: 80 });
    expect(product.style.transform).toContain("rotateY(45deg)");
    fireEvent.click(screen.getByRole("button", { name: "Rotate view right" }));
    expect(product.style.transform).toContain("rotateY(90deg)");
    fireEvent.click(screen.getByRole("button", { name: /Compare this iPhone/ }));
    expect(await screen.findByText("Compare devices")).toBeInTheDocument();
  });

  it("keeps a chassis fallback if a product image fails", async () => {
    render(<AppWithCompare><Home /></AppWithCompare>);
    fireEvent.error(document.querySelector("img.phone-image") as HTMLImageElement);
    await waitFor(() => expect(document.querySelector(".phone-shell")).toBeInTheDocument());
  });

  it("has a local product image for every model finish", () => {
    for (const phone of MOCK_IPHONES) {
      for (const finish of phone.finishes) {
        expect(existsSync(join(process.cwd(), "public", finish.imageUrl.replace(/^\//, "")))).toBe(true);
        expect(existsSync(join(process.cwd(), "public", finish.imageUrl.replace(/\.png$/, "-front.png").replace(/^\//, "")))).toBe(true);
        expect(existsSync(join(process.cwd(), "public", finish.imageUrl.replace(/\.png$/, "-back.png").replace(/^\//, "")))).toBe(true);
      }
    }
  });
});
