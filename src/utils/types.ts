export type DecoratorType = PropertyDecorator & MethodDecorator;
export type ClassType = Function;

export interface FieldData {
    type: typeof String | typeof Number | typeof Boolean;
    fieldName: string;

    // user defined
    userData: {
        description?: string;
        nullable?: boolean;
        defaultValue?: any;
    };
}
export interface ClassData {
    className: string;
    classType: ClassType;
    fieldMap: Record<string, FieldData>;

    // user defined
    userData: {
        name: string;
        description: string;
    };
}
