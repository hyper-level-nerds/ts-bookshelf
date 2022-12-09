import { getTypeStorage } from "@utils/type-storage";
import { getHeaderGenerator } from "@utils/generate-header";
import { ClassType } from "@utils/types";

import { generateTableFromField } from "@utils/generate-table";

interface DocumentOptions {
    initialHeaderLevel?: number; // = 1
    withFieldTOC?: boolean; // = true
    combineNestedFields?: boolean; // = false
}

export function generateForClass(classType: ClassType, options?: DocumentOptions) {
    const { initialHeaderLevel = 1, withFieldTOC = true, combineNestedFields = false } = options || {};
    const header = getHeaderGenerator(initialHeaderLevel);

    const targetClass = getTypeStorage().classes.find(classData => classData.classType === classType);
    if (!targetClass) {
        throw new Error(`Class '${classType.name}' is not registered!`);
    }

    const contents: string[] = [];
    contents.push(`${header(`Type \`${targetClass.userData.name}\``, 1)}\n`);
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
        contents.push(generateTableFromField(field, combineNestedFields));
        contents.push("\n\n");
    }

    if (combineNestedFields) {
        const customClasses = fields.filter(f => f.isCustom);
        for (const customClass of customClasses) {
            if (customClass.type === classType) {
                continue;
            }

            contents.push(
                ...generateForClass(customClass.type, {
                    ...options,
                    initialHeaderLevel: Math.min(initialHeaderLevel + 1, 6),
                }).split("\n"),
            );
        }
    }

    return contents.join("\n");
}
