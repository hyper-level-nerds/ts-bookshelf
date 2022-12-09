import { AvailableTypes } from "@utils/types";

export function nameOf(type: AvailableTypes) {
    if (Array.isArray(type)) {
        return `${nameOf(type[0])}[]`;
    }

    return type.name;
}
