import "reflect-metadata";

import { generateForClass } from "@generators/class";
import { DocField } from "@decorators/field";
import { DocType } from "@root/decorators";

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

    it("should generate documentation correctly with nested fields", function () {
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

        class MockedClass2 {
            @DocField({
                description: "test",
                nullable: false,
            })
            public test!: MockedClass;
        }

        const generatedData = generateForClass(MockedClass2, {
            combineNestedFields: true,
        });

        expect(generatedData).toMatchSnapshot();
    });

    it("should not generate documentation for circular references", function () {
        @DocType({
            description: "test",
        })
        class ChildClass {
            @DocField({
                description: "This is a child field.",
            })
            public childField!: string;

            @DocField({
                description: "test",
                nullable: false,
            })
            public field!: ChildClass;
        }

        @DocType({
            description: "test",
        })
        class MockedClass {
            @DocField({
                description: "test",
                nullable: false,
            })
            public test!: ChildClass;
        }

        const generatedData = generateForClass(MockedClass, {
            combineNestedFields: true,
        });

        expect(generatedData).toMatchSnapshot();
    });

    it("should throw an error if the class is not registered", function () {
        expect(() => {
            generateForClass(String);
        }).toThrowError("Class 'String' is not registered");
    });
});
