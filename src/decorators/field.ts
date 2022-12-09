import { DecoratorType, FieldUserData, TypeFn } from "@utils/types";
import { getTypeStorage } from "@utils/type-storage";
import { DefinitionError } from "@utils/definition-error";
import { checkType } from "@utils/check-type";

interface DocumentFieldOptions extends FieldUserData {
    type?: TypeFn;
}

export function DocField(fieldData: DocumentFieldOptions): DecoratorType {
    return <T>(target: object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<T>) => {
        if (typeof propertyKey === "symbol") {
            throw new Error("Symbol keys are not supported yet!");
        }

        const className = target.constructor.name;
        const isMethod = Boolean(descriptor && descriptor.value);
        if (isMethod) {
            throw new DefinitionError("Field decorator can only be used on properties!", className, propertyKey);
        }

        const type = Reflect.getMetadata("design:type", target, propertyKey);
        const desiredType = fieldData.type?.();
        const [targetType, isArray, isCustom] = checkType(type, desiredType, className, propertyKey);

        getTypeStorage().collectFieldData({
            classType: target.constructor,
            field: {
                type: targetType,
                fieldName: propertyKey,
                isArray,
                isCustom,
                userData: {
                    ...fieldData,
                },
            },
        });
    };
}
