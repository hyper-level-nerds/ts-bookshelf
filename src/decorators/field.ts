import { DecoratorType, FieldUserData, TypeFn } from "@utils/types";
import { getTypeStorage } from "@utils/type-storage";
import { DefinitionError } from "@utils/definition-error";

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
        let targetType = type;
        if (type === Array) {
            const arrayOf = fieldData.type?.();
            if (!arrayOf) {
                throw new DefinitionError("Should provide `type` option for array fields.", className, propertyKey);
            }

            if (!Array.isArray(arrayOf)) {
                throw new DefinitionError(
                    "Returned value from `type` option should be an array when the field is an array.",
                    className,
                    propertyKey,
                );
            }

            if (arrayOf.length !== 1) {
                throw new DefinitionError(
                    "Returned value from `type` option should have only one item when the field is an array.",
                    className,
                    propertyKey,
                );
            }

            const [arrayOfType] = arrayOf;
            targetType = arrayOfType;
        } else {
            const desiredType = fieldData.type?.();
            if (desiredType && desiredType !== type) {
                const expectedName = Array.isArray(desiredType) ? desiredType.constructor.name : desiredType.name;

                throw new DefinitionError(
                    "Type is not matching. (expected: " + expectedName + ", actual: " + type.name + ")",
                    className,
                    propertyKey,
                );
            }
        }

        if (targetType !== String && targetType !== Boolean) {
            throw new Error("Only String and Boolean types are supported.");
        }

        getTypeStorage().collectFieldData({
            classType: target.constructor,
            field: {
                type: targetType,
                fieldName: propertyKey,
                isArray: type === Array,
                userData: {
                    ...fieldData,
                },
            },
        });
    };
}
