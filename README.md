<h1 align="center">
  <br />
  📚
  <br />
  ts-bookshelf
  <sup>
    <br />
    <br />
  </sup>    
</h1>

<div align="center">
    <a href="https://www.npmjs.com/package/ts-bookshelf">
        <img alt="npm (tag)" src="https://img.shields.io/npm/v/ts-bookshelf/next?style=flat-square">
    </a>
    <a href="https://github.com/hyper-level-nerds/ts-bookshelf/blob/main/LICENSE">
        <img src="https://img.shields.io/github/license/hyper-level-nerds/ts-bookshelf.svg?style=flat-square" alt="MIT License" />
    </a>
    <a href="https://app.codecov.io/gh/hyper-level-nerds/ts-bookshelf">
        <img alt="Codecov branch" src="https://img.shields.io/codecov/c/github/hyper-level-nerds/ts-bookshelf/next?style=flat-square&token=S2GKAU1OZ1">    </a>
    <br />
    <sup>generate markdown-based documentation from typescript types</sup>
    <br />
    <br />
</div>

## Introduction

`ts-bookshelf` is a library for generating markdown documentation from typescript types.

## Installation

```bash
$ npm install ts-bookshelf@next

# or

$ yarn add ts-bookshelf@next
```

and you should install and import `reflect-metadata` and configure related things in your project:

```bash
$ npm install reflect-metadata

# or

$ yarn add reflect-metadata
```

```ts
import "reflect-metadata";
```

```json5
// in your tsconfig.json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```


## Usage

```ts
import "reflect-metadata";
import { DocField, DocType, generateDocsForClass } from "ts-bookshelf";
import * as fs from "fs";

@DocType({
    name: "MyType",
    description: "this is a description of my type",
})
class MyType {
    @DocField({
        description: "this is a description",
    })
    public myProperty!: string;
}

// ...

const content = generateDocsForClass(MyType);
fs.writeFileSync("docs-for-MyType.md", content);
```

then `docs-for-MyType.md` will be:

```md
# MyType (MyType)

this is a description of my type

## Fields

### `myProperty`

| Name        | Description           |
| ----------- | --------------------- |
| Type        | String                |
| Nullable    | ❌ No                  |
| Description | this is a description |
```
