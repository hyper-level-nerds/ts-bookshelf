import markdownTable from "markdown-table";

import { FieldData } from "@utils/types";

export function generateTableFromField(field: FieldData, shouldLink = false) {
    const rows: string[][] = [];

    let typeName = field.type.name;
    if (shouldLink && field.isCustom) {
        typeName = `[${typeName}](#type-${typeName.toLowerCase()})`;
    }

    rows.push(["Name", "Description"]);
    rows.push(["Type", `${typeName}${field.isArray ? "[]" : ""}`]);
    rows.push(["Nullable", field.userData.nullable ? "✔️ Yes" : "❌ No"]);

    if (field.userData.description) {
        rows.push(["Description", field.userData.description]);
    }

    return markdownTable(rows);
}
