import "reflect-metadata";

import { generateForClass } from "@generators/class";
import { DocField } from "@decorators/field";

describe("generateDocsForClass() Function", function () {
    it("should be defined", function () {
        expect(generateForClass).toBeDefined();
    });

    it("should be a function", function () {
        expect(generateForClass).toBeInstanceOf(Function);
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

        const generatedData = generateForClass(MockedClass);

        expect(generatedData).toMatchSnapshot();
    });

    it("should throw an error if the class is not registered", function () {
        expect(() => {
            generateForClass(String);
        }).toThrowError("Class 'String' is not registered!");
    });
});
