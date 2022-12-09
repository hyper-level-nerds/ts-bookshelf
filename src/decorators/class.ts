import { getTypeStorage } from "@utils/type-storage";
import { ClassData } from "@utils/types";

type DocumentTypeOptions = ClassData["userData"];

export function DocType(options?: DocumentTypeOptions): ClassDecorator {
    return target => {
        getTypeStorage().collectClassData({
            classType: target,
            userData: {
                name: options?.name || target.name,
                description: options?.description || `This is a type '${target.name}'.`,
            },
        });
    };
}
