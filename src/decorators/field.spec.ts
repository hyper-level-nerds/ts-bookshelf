import "reflect-metadata";

import { DocField } from "@decorators/field";
import { getTypeStorage } from "@utils/type-storage";
import { DocType } from "@decorators/class";

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

    it("should collect field data correctly with default values", function () {
        class MockedClass {
            @DocField()
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
            description: "field 'test' with type 'Boolean'.",
            nullable: false,
        });
    });

    it("should collect field with an array type correctly", () => {
        class MockedClass {
            @DocField({
                description: "test",
                nullable: false,
                defaultValue: "test",
                type: () => [String],
            })
            public test!: string[];
        }

        const target = getTypeStorage();
        const stringClass = target.classes.find(c => c.classType === MockedClass);
        if (!stringClass) {
            throw new Error("String class not found!");
        }

        expect(stringClass.fieldMap).toHaveProperty("test");
        expect(Object.keys(stringClass.fieldMap)).toHaveLength(1);
        expect(stringClass.fieldMap["test"].type).toStrictEqual(String);
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
            description: "field 'test' with type 'Boolean'.",
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

    it("should throw an error if the field has unregistered type", function () {
        expect(() => {
            class UnregisteredType {}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({})
                public test!: UnregisteredType;
            }
        }).toThrowError("Type 'UnregisteredType' is not registered.");
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
        }).toThrowError("Symbol keys are not supported yet");
    });

    it("should throw an error if the field has not supported types", () => {
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
        }).toThrowError("Type 'Object' is not supported.");
    });

    it("should throw an error if the field has 'Number' type", () => {
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({
                    type: () => Number,
                })
                public test!: number;
            }
        }).toThrowError("Given type 'Number' is not supported. Use 'Int' or 'Float' instead.");

        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({
                    type: () => Object,
                })
                public test!: number;
            }
        }).toThrowError("You can only use 'Int' or 'Float' for number fields.");
    });

    it("should throw an error if the field has an array type but type function is not provided", () => {
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({
                    description: "test",
                    nullable: false,
                    defaultValue: "test",
                })
                public test!: string[];
            }
        }).toThrowError("Should provide 'type' option for array fields.");
    });

    it("should throw an error if the field has an array type but type function returns 'Number' type", () => {
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({
                    description: "test",
                    nullable: false,
                    defaultValue: "test",
                    type: () => [Number],
                })
                public test!: number[];
            }
        }).toThrowError("You can only use 'Int' or 'Float' for numeric array item.");
    });

    it("should throw an error if the field has an array type but type function returns non-array type", () => {
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({
                    description: "test",
                    nullable: false,
                    defaultValue: "test",
                    type: () => String,
                })
                public test!: string[];
            }
        }).toThrowError("Returned value from 'type' option should be an array when the field is an array.");
    });

    it("should throw an error if the field has an array type but type function returns array of more than 1 type", () => {
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({
                    description: "test",
                    nullable: false,
                    defaultValue: "test",
                    type: () => [String, Number] as any,
                })
                public test!: string[];
            }
        }).toThrowError("Returned value from 'type' option should have only one item when the field is an array.");
    });

    it("should throw an error if the field has an array type but type function returns array of unregistered class", () => {
        expect(() => {
            class UnregisteredClass {}

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({
                    description: "test",
                    nullable: false,
                    defaultValue: "test",
                    type: () => [UnregisteredClass] as any,
                })
                public test!: string[];
            }
        }).toThrowError("Type 'UnregisteredClass' is not registered.");

        expect(() => {
            @DocType({
                name: "RegisteredClass",
                description: "",
            })
            class UnregisteredClass {}

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({
                    description: "test",
                    nullable: false,
                    defaultValue: "test",
                    type: () => [UnregisteredClass] as any,
                })
                public test!: string[];
            }
        }).not.toThrowError("Type 'UnregisteredClass' is not registered.");
    });

    it("should throw an error if the field type is not matched with returned type from type function", () => {
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({
                    description: "test",
                    nullable: false,
                    defaultValue: "test",
                    type: () => Boolean,
                })
                public test!: string;
            }
        }).toThrowError("Type is not matching. (user-defined: Boolean, actual: String)");

        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({
                    description: "test",
                    nullable: false,
                    defaultValue: "test",
                    type: () => [Boolean] as any,
                })
                public test!: string;
            }
        }).toThrowError("Type is not matching. (user-defined: Boolean[], actual: String)");
    });

    it("should throw an error if the field has min or max property but type function returns numeric type", () => {
        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({
                    description: "test",
                    nullable: false,
                    defaultValue: "test",
                    type: () => String,
                    min: 1,
                })
                public test!: string;
            }
        }).toThrowError("Min and max values are only supported for numeric types!");

        expect(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            class MockedClass {
                @DocField({
                    description: "test",
                    nullable: false,
                    defaultValue: "test",
                    type: () => String,
                    max: 1,
                })
                public test!: string;
            }
        }).toThrowError("Min and max values are only supported for numeric types!");
    });
});
