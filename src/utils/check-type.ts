import { AvailableTypes, TargetTypes } from "@utils/types";
import { DefinitionError } from "@utils/definition-error";
import { Float, Int } from "@utils/primitives";
import { nameOf } from "@utils/name-of";
import { getTypeStorage } from "@utils/type-storage";

const AVAILABLE_TYPES: AvailableTypes[] = [String, Boolean, Number, Array];
const PRIMITIVE_TYPES: AvailableTypes[] = [String, Boolean, Number];
const ARRAY_ITEM_TYPES: TargetTypes[] = [String, Boolean, Int, Float];
const ALL_TYPES = [String, Boolean, Number, Array, Int, Float, Symbol, Object, Function];

function isRegistered(type: TargetTypes) {
    // should be true when it's a built-in type
    if (ALL_TYPES.includes(type)) {
        return true;
    }

    return getTypeStorage().classes.some(c => c.classType === type);
}

export function checkType(
    staticType: any,
    userType: AvailableTypes | undefined,
    className: string,
    propertyKey: string,
): TargetTypes {
    const staticTypeName = staticType.name;

    if (!AVAILABLE_TYPES.includes(staticType)) {
        throw new DefinitionError(`Type '${staticTypeName}' is not supported.`, className, propertyKey);
    }

    if (PRIMITIVE_TYPES.includes(staticType)) {
        if (staticType === Number) {
            if (!userType || userType === Number) {
                throw new DefinitionError(
                    `Given type 'Number' is not supported. Use 'Int' or 'Float' instead.`,
                    className,
                    propertyKey,
                );
            }

            if (userType !== Int && userType !== Float) {
                throw new DefinitionError(
                    `You can only use 'Int' or 'Float' for number fields.`,
                    className,
                    propertyKey,
                );
            }
        } else if (userType && userType !== staticType) {
            throw new DefinitionError(
                `Type is not matching. (user-defined: ${nameOf(userType)}, actual: ${staticType.name})`,
                className,
                propertyKey,
            );
        }
    }

    if (staticType === Array) {
        if (!userType) {
            throw new DefinitionError(`Should provide 'type' option for array fields.`, className, propertyKey);
        }

        if (!Array.isArray(userType)) {
            throw new DefinitionError(
                `Returned value from 'type' option should be an array when the field is an array.`,
                className,
                propertyKey,
            );
        }

        if (userType.length !== 1) {
            throw new DefinitionError(
                `Returned value from 'type' option should have only one item when the field is an array.`,
                className,
                propertyKey,
            );
        }

        const [arrayOfType] = userType;
        if (arrayOfType === Number) {
            throw new DefinitionError(
                `You can only use 'Int' or 'Float' for numeric array item.`,
                className,
                propertyKey,
            );
        }

        if (!isRegistered(arrayOfType)) {
            throw new DefinitionError(`Type '${nameOf(arrayOfType)}' is not registered.`, className, propertyKey);
        }

        if (!ARRAY_ITEM_TYPES.includes(arrayOfType)) {
            throw new DefinitionError(
                `Array of type '${nameOf(arrayOfType)}' is not supported.`,
                className,
                propertyKey,
            );
        }

        return arrayOfType;
    }

    return userType || staticType;
}
