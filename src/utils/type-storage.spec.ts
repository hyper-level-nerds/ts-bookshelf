import { getTypeStorage } from "@utils/type-storage";

describe("TypeStorage class", () => {
    let target: ReturnType<typeof getTypeStorage>;

    beforeEach(() => {
        target = getTypeStorage();
    });

    it("should be defined", () => {
        expect(target).toBeDefined();
    });

    it("should have a 'classes' property", () => {
        expect(target.classes).toBeDefined();
    });

    it("should collect field data correctly", () => {
        target.collectFieldData({
            classType: String,
            fieldName: "test",
            type: String,
            userData: {
                description: "test",
                nullable: false,
            },
        });

        expect(target.classes).toHaveLength(1);
        expect(target.classes[0].fieldMap).toHaveProperty("test");
        expect(Object.keys(target.classes[0].fieldMap)).toHaveLength(1);
        expect(target.classes[0].fieldMap["test"].userData).toStrictEqual({
            description: "test",
            nullable: false,
        });
    });

    it("should not collect field data twice", () => {
        const mockedFieldData = {
            classType: String,
            fieldName: "test",
            type: String,
            userData: {
                description: "test",
                nullable: false,
            },
        };

        target.collectFieldData(mockedFieldData);
        target.collectFieldData(mockedFieldData);

        expect(target.classes).toHaveLength(1);
        expect(target.classes[0].fieldMap).toHaveProperty("test");
        expect(Object.keys(target.classes[0].fieldMap)).toHaveLength(1);
    });

    it("should collect class data correctly", () => {
        target.collectClassData({
            classType: String,
            userData: {
                description: "test",
                name: "test",
            },
        });

        expect(target.classes).toHaveLength(1);
        expect(target.classes[0].className).toBe("String");
        expect(target.classes[0].userData).toStrictEqual({
            description: "test",
            name: "test",
        });
    });
});
