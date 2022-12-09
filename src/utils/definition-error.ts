export class DefinitionError extends Error {
    public constructor(message: string, relatedClass: string, relatedField: string) {
        super(`${message} (${relatedClass}.${relatedField})`);
    }
}
