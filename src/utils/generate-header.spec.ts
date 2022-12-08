import { getHeaderGenerator, header } from "@utils/generate-header";

describe("getHeadGenerator() Function", () => {
    it("should return a function", () => {
        const generator = getHeaderGenerator();

        expect(generator).toBeInstanceOf(Function);
    });

    it("should return a function that returns a header", () => {
        const generator = getHeaderGenerator();

        expect(generator("Hello", 1)).toBe("# Hello");
    });

    it("should return a function that returns a header with the initial level", () => {
        const generator = getHeaderGenerator(2);

        expect(generator("Hello", 1)).toBe("## Hello");
        expect(generator("Hello", 2)).toBe("### Hello");
    });
});

describe("header() function", function () {
    it("should return a markdown header with corresponding header level", () => {
        expect(header("Hello", 1)).toBe("# Hello");
        expect(header("Hello", 2)).toBe("## Hello");
        expect(header("Hello", 3)).toBe("### Hello");
        expect(header("Hello", 4)).toBe("#### Hello");
        expect(header("Hello", 5)).toBe("##### Hello");
        expect(header("Hello", 6)).toBe("###### Hello");
    });
});
