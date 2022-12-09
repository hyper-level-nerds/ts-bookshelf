import cloneDeep from "lodash.clonedeep";

import { ClassData, ClassType, FieldData } from "@utils/types";

interface CollectFieldDataOptions {
    field: FieldData;
    classType: ClassType;
}
interface CollectClassDataOptions extends Omit<ClassData, "className" | "fieldMap"> {
    classType: ClassType;
}

class TypeStorage {
    public constructor(private readonly classMap = new Map<ClassType, ClassData>()) {}

    public get classes() {
        return [...this.classMap.values()];
    }

    public collectFieldData({ field, classType }: CollectFieldDataOptions) {
        const classData = this.getClassData(classType);
        const newField = cloneDeep(field);
        newField.userData = {
            ...newField.userData,
            description:
                newField.userData.description || `field '${newField.fieldName}' with type '${newField.type.name}'.`,
            nullable: newField.userData.nullable || false,
        };

        classData.fieldMap[field.fieldName] = newField;
    }
    public collectClassData({ classType, userData }: CollectClassDataOptions) {
        const classData = this.getClassData(classType);
        classData.className = classType.name;
        classData.classType = classType;
        classData.userData = {
            ...userData,
        };
    }

    private getClassData(classType: ClassType) {
        if (!this.classMap.has(classType)) {
            const classData: ClassData = {
                classType,
                className: classType.name,
                fieldMap: {},
                userData: {
                    name: classType.name,
                    description: `type '${classType.name}'.`,
                },
            };
            this.classMap.set(classType, classData);

            return classData;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return this.classMap.get(classType)!;
    }
}

const typeStorage = new TypeStorage();

export function getTypeStorage() {
    return typeStorage;
}
