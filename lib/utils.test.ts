import { cn } from "./utils";

describe("cn", () => {
  it("merges conflicting Tailwind classes", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });

  it("discards falsy values", () => {
    expect(cn("text-sm", false && "hidden", undefined, null, "")).toBe("text-sm");
  });

  it("handles class name record", () => {
    expect(cn({ "text-lg": true, hidden: false })).toBe("text-lg");
  });

  it("handles mixed input types", () => {
    expect(cn("base", ["flex", "py-2"], { "font-bold": true })).toBe("base flex py-2 font-bold");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });

  it("merges tailwind utility conflicts across mixed inputs", () => {
    expect(cn("p-4", ["m-2"], { "p-2": true })).toBe("m-2 p-2");
  });

  it("keeps typography tokens separate from text color", () => {
    expect(cn("text-nav-md", "text-primary")).toBe("text-nav-md text-primary");
    expect(cn("text-sm", "text-body-md")).toBe("text-body-md");
  });

  it("keeps gradient separate from background color", () => {
    expect(cn("bg-primary", "bg-gradient-primary")).toBe("bg-primary bg-gradient-primary");
    expect(cn("bg-gradient-primary", "bg-none")).toBe("bg-none");
  });
});
