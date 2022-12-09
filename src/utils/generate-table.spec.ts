import { generateTableFromField } from "./generate-table";

describe("generateTableFromField() Function", () => {
    it("should be defined", () => expect(generateTableFromField).toBeDefined());
    it("should be a function", () => expect(generateTableFromField).toBeInstanceOf(Function));

    it("should generate a table correctly", () => {
        expect([
            generateTableFromField({
                fieldName: "test",
                type: String,
                userData: {
                    description: "test",
                    nullable: false,
                },
            }),
            generateTableFromField({
                fieldName: "test",
                type: Boolean,
                userData: {
                    description: "test",
                    nullable: true,
                },
            }),
            generateTableFromField({
                fieldName: "test",
                type: Boolean,
                isArray: true,
                userData: {
                    description: "test",
                },
            }),
        ]).toMatchSnapshot();
    });
});
