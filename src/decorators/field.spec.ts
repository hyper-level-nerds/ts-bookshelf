import "reflect-metadata";

import { DocField } from "@decorators/field";
import { getTypeStorage } from "@utils/type-storage";

describe("@DocField() decorator", function () {
    it("should be defined", function () {
        expect(DocField).toBeDefined();
    });

    it("should be a function", function () {
        expect(DocField).toBeInstanceOf(Function);
    });

    it("should collect field data correctly", function () {
        class MockedClass {
            @DocField({
                description: "test",
                nullable: false,
                defaultValue: "test",
            })
            public test!: boolean;
        }

        const target = getTypeStorage();
        const stringClass = target.classes.find(c => c.classType === MockedClass);
        if (!stringClass) {
            throw new Error("String class not found!");
        }

        expect(stringClass.fieldMap).toHaveProperty("test");
        expect(Object.keys(stringClass.fieldMap)).toHaveLength(1);
        expect(stringClass.fieldMap["test"].userData).toStrictEqual({
            description: "test",
            nullable: false,
            defaultValue: "test",
        });
    });

    it("should throw an error if the field is a method", function () {
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({
                    description: "test",
                    nullable: false,
                    defaultValue: "test",
                })
                public test(): void {
                    return;
                }
            }
        }).toThrowError("Field decorator can only be used on properties!");
    });

    it("should throw an error if the field has a symbol as a name", () => {
        expect(() => {
            const symbol = Symbol("test");

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({
                    description: "test",
                    nullable: false,
                    defaultValue: "test",
                })
                public [symbol]!: string;
            }
        }).toThrowError("Symbol keys are not supported yet!");
    });

    it("should throw an error if the field does not have a primitive type", () => {
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({
                    description: "test",
                    nullable: false,
                    defaultValue: "test",
                })
                public test!: object;
            }
        }).toThrowError("Field decorator can only be used on properties of type Number, String or Boolean!");
    });

    it("should collect with default description when its not provided", function () {
        class MockedClass {
            @DocField({
                nullable: false,
                defaultValue: "test",
            })
            public test!: boolean;
        }

        const target = getTypeStorage();
        const stringClass = target.classes.find(c => c.classType === MockedClass);
        if (!stringClass) {
            throw new Error("String class not found!");
        }

        expect(stringClass.fieldMap).toHaveProperty("test");
        expect(Object.keys(stringClass.fieldMap)).toHaveLength(1);
        expect(stringClass.fieldMap["test"].userData).toStrictEqual({
            description: "field 'test'.",
            nullable: false,
            defaultValue: "test",
        });
    });

    it("should collect with default nullable when its not provided", function () {
        class MockedClass {
            @DocField({
                description: "test",
                defaultValue: "test",
            })
            public test!: boolean;
        }

        const target = getTypeStorage();
        const stringClass = target.classes.find(c => c.classType === MockedClass);
        if (!stringClass) {
            throw new Error("String class not found!");
        }

        expect(stringClass.fieldMap).toHaveProperty("test");
        expect(Object.keys(stringClass.fieldMap)).toHaveLength(1);
        expect(stringClass.fieldMap["test"].userData).toStrictEqual({
            description: "test",
            nullable: false,
            defaultValue: "test",
        });
    });
});
