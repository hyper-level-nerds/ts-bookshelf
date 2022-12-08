import "reflect-metadata";

import { generateDocsForClass } from "@generators/class";
import { DocField } from "@decorators/field";

describe("generateDocsForClass() Function", function () {
    it("should be defined", function () {
        expect(generateDocsForClass).toBeDefined();
    });

    it("should be a function", function () {
        expect(generateDocsForClass).toBeInstanceOf(Function);
    });

    it("should generate documentation correctly", function () {
        class MockedClass {
            @DocField({
                description: "test",
                nullable: false,
            })
            public test!: boolean;

            @DocField({
                description: "test",
                nullable: true,
            })
            public test2!: boolean;
        }

        const generatedData = generateDocsForClass(MockedClass);

        expect(generatedData).toMatchSnapshot();
    });

    it("should throw an error if the class is not registered", function () {
        expect(() => {
            generateDocsForClass(String);
        }).toThrowError("Class 'String' is not registered!");
    });
});
