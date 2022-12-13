import type { Float, Int } from "@utils/primitives";

export type Fn<Args, Return> = Args extends void
    ? () => Return
    : Args extends any[]
    ? (...args: Args) => Return
    : (args: Args) => Return;

export type DecoratorType = PropertyDecorator & MethodDecorator;
export type ClassType = Function;

type TypeOrArray<T> = T | [T];
export type TargetTypes = typeof String | typeof Boolean | typeof Int | typeof Float;
export type AvailableTypes = TypeOrArray<TargetTypes>;
export type TypeFn = () => AvailableTypes;

export interface FieldUserData {
    description?: string;
    nullable?: boolean;
    defaultValue?: any;
    min?: number;
    max?: number;
}

export interface BaseFieldData {
    fieldName: string;
    userData: FieldUserData;
}
export interface FieldData extends BaseFieldData {
    type: TargetTypes;
    isArray?: boolean;
    isCustom: boolean;
}

export interface ClassData {
    className: string;
    classType: ClassType;
    fieldMap: Record<string, FieldData>;

    // user defined
    userData: {
        name?: string;
        description?: string;
    };
}
