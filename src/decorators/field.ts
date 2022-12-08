import { DecoratorType, FieldData } from "@utils/types";
import { TypeStorage } from "@root/utils/type-storage";

type DocumentFieldOptions = FieldData["userData"];

export function DocField(fieldData: DocumentFieldOptions): DecoratorType {
    return <T>(target: object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<T>) => {
        if (typeof propertyKey === "symbol") {
            throw new Error("Symbol keys are not supported yet!");
        }

        const isMethod = Boolean(descriptor && descriptor.value);
        if (isMethod) {
            throw new Error("Field decorator can only be used on properties!");
        }

        const type = Reflect.getMetadata("design:type", target, propertyKey);
        if (!type || (type !== Number && type !== String && type !== Boolean)) {
            throw new Error("Field decorator can only be used on properties of type Number, String or Boolean!");
        }

        TypeStorage.instance.collectFieldData({
            type,
            fieldName: propertyKey,
            classType: target.constructor,
            userData: {
                ...fieldData,
                description: fieldData.description || `field '${propertyKey}'.`,
                nullable: fieldData.nullable ?? false,
            },
        });
    };
}
