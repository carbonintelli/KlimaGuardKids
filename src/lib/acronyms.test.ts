import { describe, expect, it } from "vitest";
import {
  ACRONYMS,
  acronymTitle,
  getAcronym,
  listAcronyms,
} from "./acronyms";

describe("acronyms glossary", () => {
  it("defines CHIS and core India score dimensions", () => {
    expect(getAcronym("CHIS")?.expansion).toBe("Child Health Impact Score");
    expect(getAcronym("chvi")?.short).toBe("CHVI");
    expect(getAcronym("CRBS")?.group).toBe("score");
    expect(getAcronym("WDPI")).toBeTruthy();
    expect(getAcronym("VBDP")).toBeTruthy();
    expect(getAcronym("CNSI")).toBeTruthy();
  });

  it("resolves PM2.5 alias", () => {
    expect(getAcronym("PM2.5")?.expansion).toMatch(/Particulate Matter/i);
  });

  it("builds accessible title strings", () => {
    const title = acronymTitle("AQI");
    expect(title).toContain("Air Quality Index");
    expect(title).toContain("AQI");
    expect(title.length).toBeGreaterThan(40);
  });

  it("lists score acronyms first when filtered", () => {
    const scores = listAcronyms(["score"]);
    expect(scores.every((e) => e.group === "score")).toBe(true);
    expect(scores.map((e) => e.short)).toContain("CHIS");
  });

  it("keeps every entry with expansion and explanation", () => {
    for (const entry of Object.values(ACRONYMS)) {
      expect(entry.expansion.length).toBeGreaterThan(3);
      expect(entry.explanation.length).toBeGreaterThan(20);
    }
  });
});
