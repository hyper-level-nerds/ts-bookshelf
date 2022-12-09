import { getTypeStorage } from "@utils/type-storage";
import { getHeaderGenerator } from "@utils/generate-header";
import { ClassType } from "@utils/types";

import { generateTableFromField } from "@utils/generate-table";

interface DocumentOptions {
    initialHeaderLevel?: number; // = 1
    withFieldTOC?: boolean; // = true
}

export function generateForClass(classType: ClassType, options?: DocumentOptions) {
    const { initialHeaderLevel = 1, withFieldTOC = true } = options || {};
    const header = getHeaderGenerator(initialHeaderLevel);

    const targetClass = getTypeStorage().classes.find(classData => classData.classType === classType);
    if (!targetClass) {
        throw new Error(`Class '${classType.name}' is not registered!`);
    }

    const contents: string[] = [];
    contents.push(`${header(targetClass.userData.name, 1)} (${targetClass.className})\n`);
    contents.push(`${targetClass.userData.description}\n`);
    contents.push(`${header("Fields", 2)}\n`);

    const fields = Object.values(targetClass.fieldMap);
    if (withFieldTOC) {
        for (const field of fields) {
            contents.push(`- [${field.fieldName}](#${field.fieldName.toLowerCase()})`);
        }

        contents.push("\n");
    }

    for (const field of fields) {
        contents.push(`${header(`\`${field.fieldName}\``, 3)}\n`);
        contents.push(generateTableFromField(field));
        contents.push("\n\n");
    }

    return contents.join("\n");
}
