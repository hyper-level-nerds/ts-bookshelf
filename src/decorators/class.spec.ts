import { DocType } from "@decorators/class";
import { getTypeStorage } from "@utils/type-storage";

describe("@DocType() Decorator", function () {
    it("should be defined", function () {
        expect(DocType).toBeDefined();
    });

    it("should be a function", function () {
        expect(DocType).toBeInstanceOf(Function);
    });

    it("should collect class data correctly", function () {
        DocType({
            name: "test",
            description: "test",
        })(String);

        const target = getTypeStorage();

        expect(target.classes).toHaveLength(1);
        expect(target.classes[0].userData).toStrictEqual({
            name: "test",
            description: "test",
        });
    });
});
