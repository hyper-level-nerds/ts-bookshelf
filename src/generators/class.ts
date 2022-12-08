import { getTypeStorage } from "@utils/type-storage";
import { getHeaderGenerator } from "@utils/generate-header";
import { ClassType } from "@utils/types";

import { generateTableFromField } from "@utils/generate-table";

interface DocumentOptions {
    initialHeaderLevel?: number; // = 1
}

export function generateDocsForClass(classType: ClassType, options?: DocumentOptions) {
    const { initialHeaderLevel = 1 } = options || {};
    const header = getHeaderGenerator(initialHeaderLevel);

    const targetClass = getTypeStorage().classes.find(classData => classData.classType === classType);
    if (!targetClass) {
        throw new Error(`Class '${classType.name}' is not registered!`);
    }

    const contents: string[] = [];
    contents.push(`${header(targetClass.userData.name, 1)} (${targetClass.className})\n`);
    contents.push(`${targetClass.userData.description}\n`);
    contents.push(`${header("Fields", 2)}\n`);

    for (const field of Object.values(targetClass.fieldMap)) {
        contents.push(`${header(`\`${field.fieldName}\``, 3)}\n`);
        contents.push(generateTableFromField(field));
        contents.push("\n\n");
    }

    return contents.join("\n");
}
