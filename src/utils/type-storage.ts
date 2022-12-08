import { ClassData, ClassType, FieldData } from "@utils/types";

interface CollectFieldDataOptions extends FieldData {
    classType: ClassType;
}

interface CollectClassDataOptions extends Omit<ClassData, "className" | "fields"> {
    classType: ClassType;
}

export class TypeStorage {
    public static readonly instance = new TypeStorage();

    private constructor(private readonly classMap = new Map<ClassType, ClassData>()) {}

    public get classes() {
        return [...this.classMap.values()];
    }

    public collectFieldData(fieldData: CollectFieldDataOptions) {
        const classData = this.getClassData(fieldData.classType);

        classData.fields.push({
            type: fieldData.type,
            fieldName: fieldData.fieldName,
            userData: {
                ...fieldData.userData,
            },
        });
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
                fields: [],
                userData: {
                    name: classType.name,
                    description: `type '${classType.name}'.`,
                },
            };
            this.classMap.set(classType, classData);

            return classData;
        }

        const classData = this.classMap.get(classType);
        if (!classData) {
            throw new Error("Class data is undefined!");
        }

        return classData;
    }
}
