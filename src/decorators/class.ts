import { TypeStorage } from "@root/utils/type-storage";
import { ClassData } from "@utils/types";

type DocumentTypeOptions = ClassData["userData"];

export function DocType(options: DocumentTypeOptions): ClassDecorator {
    return target => {
        TypeStorage.instance.collectClassData({
            classType: target,
            userData: {
                ...options,
            },
        });
    };
}
