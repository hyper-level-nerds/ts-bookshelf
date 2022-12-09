import { generateTableFromField } from "./generate-table";
import { Float, Int } from "@utils/primitives";

describe("generateTableFromField() Function", () => {
    it("should be defined", () => expect(generateTableFromField).toBeDefined());
    it("should be a function", () => expect(generateTableFromField).toBeInstanceOf(Function));

    it("should generate a table correctly", () => {
        expect([
            generateTableFromField({
                fieldName: "test",
                type: String,
                isCustom: false,
                userData: {
                    description: "test",
                    nullable: false,
                },
            }),
            generateTableFromField({
                fieldName: "test",
                type: Boolean,
                isCustom: false,
                userData: {
                    description: "test",
                    nullable: true,
                },
            }),
            generateTableFromField({
                fieldName: "test",
                type: Boolean,
                isArray: true,
                isCustom: false,
                userData: {
                    description: "test",
                },
            }),
            generateTableFromField({
                fieldName: "test",
                type: Int,
                isArray: true,
                isCustom: false,
                userData: {},
            }),
            generateTableFromField({
                fieldName: "test",
                type: Float,
                isArray: true,
                isCustom: false,
                userData: {},
            }),
        ]).toMatchSnapshot();
    });
});
