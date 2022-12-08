import markdownTable from "markdown-table";

import { FieldData } from "@utils/types";

export function getHeaderGenerator(initialLevel = 1) {
    return function header(text: string, level: number) {
        return `${"#".repeat(level + (initialLevel - 1))} ${text}`;
    };
}

export function generateTableFromField(field: FieldData) {
    const rows: string[][] = [];

    rows.push(["Name", "Description"]);
    rows.push(["Type", field.type.name]);
    rows.push(["Nullable", field.userData.nullable ? "✔️ Yes" : "❌ No"]);

    if (field.userData.description) {
        rows.push(["Description", field.userData.description]);
    }

    return markdownTable(rows);
}
