updated: 2026-05-21T11:50:37+10:00

# Naming Conventions
- Types / classes / interfaces / enums — `PascalCase`; e.g. `Message`, `SearchResult`, `UserAccount`
- Properties / variables / functions — `camelCase`; e.g. `fromAddress`, `createdAt`, `isActive`
- Constants — `SCREAMING_SNAKE_CASE`; e.g. `MAX_RETRIES`, `API_BASE_URL`

# Type Annotations

## Primitives
- `let x: string` / `number` / `boolean` / `null` / `undefined` / `bigint` / `symbol` — primitive type annotations

## Arrays (two equivalent forms)
- `const arr: string[] = ["a", "b"]` — shorthand; preferred for simple types
- `const arr: Array<string> = ["a", "b"]` — generic syntax; clearer for complex element types (e.g. `Array<Map<string, number>>`)

## Collections
- `const m: Map<string, number> = new Map()` — typed Map
- `const s: Set<string> = new Set()` — typed Set
- `const r: Record<string, number> = { a: 1 }` — object with typed keys and values; equivalent to `{ [key: string]: number }`

## Special types
- `any` — opt out of type checking; avoid — defeats the purpose of TypeScript
- `unknown` — like `any` but type-safe; must narrow the type before using it (e.g. with `typeof` or `instanceof`)
- `never` — a value that never occurs (e.g. exhaustive switch default, function that always throws)
- `void` — absence of a return value; used as function return type

## Readonly
- `readonly name: string` — property cannot be reassigned after initialisation; used on interfaces and class properties
- `Readonly<T>` — utility type; makes all properties of `T` readonly
- `readonly string[]` / `ReadonlyArray<string>` — array that cannot be mutated (no `push`, `pop`, etc.)
- `as const` — infers the narrowest literal type and makes all properties deeply readonly; e.g. `const config = { env: "prod" } as const`

## Other
- `[string, number]` — tuple; fixed-length array with typed positions
- `string | number` — union type; value can be either
- `string & { brand: true }` — intersection type; value must satisfy both
- `param?: string` — optional property on a type or interface; equivalent to `string | undefined`

# Interfaces
- `interface User { name: string; age: number }` — defines an object shape; open (can be extended and merged)
- `interface Admin extends User { role: string }` — interface inheritance; can extend multiple with commas
- `interface User { email: string }` — declaration merging; a second `interface User` block merges with the first; useful for augmenting library types
- `age?: number` — optional property
- `readonly id: number` — property cannot be reassigned after initialisation
- `(x: number): string` — call signature; interface describes a callable

# Type Aliases
- `type User = { name: string; age: number }` — define a named type; closed (unlike interfaces, cannot be re-opened with declaration merging)
- `type ID = string | number` — union type alias
- `type Point = { x: number } & { y: number }` — intersection type alias
- `interface` vs `type` — prefer `interface` for object shapes (extendable, declaration-mergeable); use `type` for unions, intersections, primitives, tuples, or mapped/conditional types

# Enums
- `enum Direction { Up, Down, Left, Right }` — numeric enum; values auto-increment from `0`
- `enum Direction { Up = "UP", Down = "DOWN" }` — string enum; explicit values; preferred (more readable in logs and debugging)
- `Direction.Up` — access a member
- `const enum Direction {}` — inlined by the compiler; no runtime object generated; marginally faster but cannot be iterated

# Generics
- `function identity<T>(arg: T): T { return arg }` — generic function; `T` inferred at call site
- `interface Box<T> { value: T }` — generic interface
- `class Stack<T> { items: T[] = [] }` — generic class
- `<T extends string>` — constrained type parameter; `T` must be assignable to `string`
- `<T = string>` — default type parameter; used when no type arg is provided

# Utility Types
- `Partial<T>` — makes all properties of `T` optional; `Partial<{a: string; b: number}>` → `{a?: string; b?: number}`
- `Required<T>` — makes all properties of `T` required (removes `?`); `Required<{a?: string}>` → `{a: string}`
- `Readonly<T>` — makes all properties of `T` readonly; `Readonly<{a: string}>` → `{readonly a: string}`
- `Pick<T, K>` — type with only the properties `K` from `T`; `Pick<User, "name" | "email">`
- `Omit<T, K>` — type without the properties `K` from `T`; `Omit<User, "password">`
- `Record<K, V>` — object type with keys `K` and values `V`; `Record<string, number>` → `{[k: string]: number}`
- `Exclude<T, U>` — removes from `T` any types assignable to `U`; `Exclude<"a" | "b" | "c", "a">` → `"b" | "c"`
- `Extract<T, U>` — keeps only types from `T` assignable to `U`; `Extract<"a" | "b" | 1, string>` → `"a" | "b"`
- `NonNullable<T>` — removes `null` and `undefined` from `T`; `NonNullable<string | null>` → `string`
- `ReturnType<T>` — extracts the return type of a function type; `ReturnType<() => string>` → `string`
- `Parameters<T>` — extracts the parameter types of a function type as a tuple; `Parameters<(a: string, b: number) => void>` → `[string, number]`

# Type Narrowing
- `typeof x === "string"` — narrow to `string` inside the if-block; works for primitives
- `x instanceof Foo` — narrow to `Foo` inside the if-block; works for classes
- `if (x !== null)` — narrow out `null` or `undefined`
- `"name" in obj` — narrows to types that have a `name` property
- `discriminated union` — objects sharing a common literal property (e.g. `kind: "circle"` vs `kind: "square"`); switch/if on the common property to narrow the type
- `type guard` — custom predicate that narrows the type at the call site; `function isString(x: unknown): x is string { return typeof x === "string" }`

# Operators
- `value as Type` — type assertion; tells TypeScript to treat `value` as `Type` without runtime conversion; use when you know more than the compiler
- `value!` — non-null assertion; tells TypeScript the value is not `null` or `undefined`; use sparingly
- `a ?? b` — nullish coalescing; returns `b` if `a` is `null` or `undefined`, otherwise `a`
- `a || b` — logical OR; returns `b` if `a` is any falsy value; use `??` when `0` or `""` are valid values

# Functions
- `function greet(name: string): string { ... }` — named declaration; hoisted; preferred for top-level and exported functions
- `const greet = (name: string): string => ...` — arrow function; not hoisted; inherits `this` from surrounding scope
- `(param: string) => void` — inline function type annotation; used when typing callbacks or variables
- `type Greet = (name: string) => string` — named function type alias
- `param?: string` — optional parameter; type is `string | undefined` inside the function
- `name: string = "World"` — default parameter; used when argument is omitted or `undefined`
- `...args: number[]` — rest parameter; collects remaining arguments into a typed array
- `async function fetch(id: number): Promise<User> { ... }` — async function; always returns a `Promise`
- `function identity<T>(arg: T): T { return arg }` — generic function
- `const func2 = func1((param) => { ... })` — higher-order function; `func1` takes a function, wraps it, returns `func2`

# Classes
- `class Foo { constructor(private name: string) {} }` — parameter property shorthand; access modifier in the constructor auto-declares and assigns `this.name`
- `public` / `private` / `protected` — access modifiers; enforced at compile time (not at runtime)
- `readonly` — property cannot be reassigned after construction
- `class Bar extends Foo implements Baz {}` — extend a class and implement one or more interfaces
- `abstract class Foo { abstract method(): void }` — cannot be instantiated; subclasses must implement abstract methods
- `override method() {}` — explicit override; compile error if the parent doesn't have the method (TS 4.3+)
- `static prop = value` — class-level property; shared across all instances; accessed as `Foo.prop`

# Destructuring
- `const { name, age } = obj` — extract named properties as local variables
- `const { name: userName } = obj` — extract and rename; `userName` holds `obj.name`
- `const { name, age = 0 } = obj` — with default; `age` falls back to `0` if `undefined`
- `const [first, second] = arr` — array destructuring; extracts by position
- `const [first, ...rest] = arr` — extract first element; `rest` captures the remainder
- `const { a, ...remainder } = obj` — object rest; `remainder` contains all properties except `a`

# Error Handling
- `try {} catch(e) {} finally {}` — `finally` always runs; `catch` receives `e: unknown` in strict mode
- `e instanceof Error` — narrow before accessing `.message` or `.stack`; always check before assuming error type
- `throw new Error("msg")` — throw an error
- `class AppError extends Error { constructor(msg: string) { super(msg); this.name = "AppError" } }` — custom typed error

# Iteration
- `for (const item of arr)` — iterate over array values; works on any iterable (array, Map, Set, string)
- `for (const [key, value] of Object.entries(obj))` — iterate over an object's own key-value pairs
- `for (const key of Object.keys(obj))` — iterate over an object's own keys
- `for (const [key, value] of map)` — iterate over a `Map`
- `for (const item of set)` — iterate over a `Set`
- `for...in` — avoid; iterates over keys as strings and includes inherited prototype properties

# Strings
- `` `Hello ${name}` `` — template literal; interpolates expressions; supports multi-line
- `str.length` — number of characters; `"hello".length` → `5`
- `str.toUpperCase()` / `toLowerCase()` — case conversion; `"Hi".toUpperCase()` → `"HI"`
- `str.trim()` — remove leading and trailing whitespace; `trimStart()` / `trimEnd()` for one side; `"  hi  ".trim()` → `"hi"`
- `str.split(sep)` — split into array; `"a,b".split(",")` → `["a", "b"]`
- `str.includes(sub)` — `true` if substring exists; `"hello".includes("ell")` → `true`
- `str.startsWith(sub)` / `endsWith(sub)` — prefix / suffix check; `"hello".endsWith("lo")` → `true`
- `str.indexOf(sub)` — index of first match, or `-1`; `"hello".indexOf("l")` → `2`
- `str.slice(start, end)` — extract substring; `end` exclusive; negative indices count from end; `"hello".slice(1, 3)` → `"el"`
- `str.replace(pattern, replacement)` — replace first match; `"foo bar".replace("foo", "baz")` → `"baz bar"`
- `str.replaceAll(pattern, replacement)` — replace all matches; `"a a".replaceAll("a", "b")` → `"b b"`
- `str.match(regex)` — returns match array or `null`; `"hello".match(/l+/)` → `["ll", ...]`
- `str.padStart(n, char)` / `padEnd(n, char)` — pad to length `n`; `"5".padStart(3, "0")` → `"005"`
- `str.repeat(n)` — repeat string `n` times; `"ab".repeat(3)` → `"ababab"`

# Arrays
- `arr.push(item)` / `arr.pop()` — append / remove last (mutates); `[1,2].push(3)` → length `3`
- `arr.unshift(item)` / `arr.shift()` — prepend / remove first (mutates); `[1,2,3].shift()` → `1`
- `arr.splice(index, deleteCount, ...items)` — insert/remove at a position (mutates); `arr.splice(1, 1, "x")`
- `arr.slice(start, end)` — extract sub-array without mutating; `end` is exclusive; `[1,2,3,4].slice(1,3)` → `[2,3]`
- `arr.concat(other)` — merge two arrays without mutating; `[1,2].concat([3,4])` → `[1,2,3,4]`
- `arr.includes(item)` — `true` if item exists; `[1,2,3].includes(2)` → `true`
- `arr.indexOf(item)` — index of first match, or `-1`; `[1,2,3].indexOf(2)` → `1`
- `arr.find(fn)` / `arr.findIndex(fn)` — first matching item / index; `[1,2,3].find(n => n > 1)` → `2`
- `arr.filter(fn)` — returns new array of items where `fn` returns true; `[1,2,3,4].filter(n => n > 2)` → `[3,4]`
- `arr.map(fn)` — returns new array with each item transformed; `[1,2,3].map(n => n * 2)` → `[2,4,6]`
- `arr.reduce(fn, initial)` — reduces to a single value; `[1,2,3].reduce((a, b) => a + b, 0)` → `6`
- `arr.forEach(fn)` — iterate; returns `void`; `[1,2,3].forEach(n => console.log(n))`
- `arr.some(fn)` / `arr.every(fn)` — any / all items pass `fn`; `[1,2,3].some(n => n > 2)` → `true`
- `arr.sort(fn)` — sort in place; use `(a, b) => a - b` for numbers; `[3,1,2].sort((a,b) => a-b)` → `[1,2,3]`
- `arr.reverse()` — reverse in place; `[1,2,3].reverse()` → `[3,2,1]`
- `arr.flat(depth)` / `arr.flatMap(fn)` — flatten / map then flatten; `[1,[2,[3]]].flat(2)` → `[1,2,3]`
- `arr.join(sep)` — join all items into a string; `[1,2,3].join("-")` → `"1-2-3"`
- `arr.length` — number of items; `[1,2,3].length` → `3`

# Modules
- `ESM (ECMAScript Modules)` — the standard JavaScript module system using `import` / `export`; preferred for modern TS/JS projects; in Node, enabled by `"type": "module"` in `package.json` or `.mjs` output; contrasts with CommonJS (`require`, `module.exports`)
- `static import` — top-level `import ... from "module"`; resolved before the module runs; best default because it is type-checkable, tree-shakeable, and easy for bundlers to optimise
- `dynamic import()` — runtime `await import("module")`; loads a module only when that code runs; useful for lazy loading, code splitting, optional dependencies, and conditional environment-specific imports
- `import type { Foo } from './module'` — type-only import; erased from output JS; use when the name is only used as a type annotation
- `export const foo = ...` / `export function foo() {}` / `export class Foo {}` — named export
- `export default value` — default export; one per file
- `export interface Foo {}` / `export type Foo = ...` — export a type; erased from output JS
- `export type { Foo }` — type-only export; avoids circular import issues
- `export { Foo, Bar }` — batch export of already-declared names
- `export * from './module'` — re-export everything from another module
- `export { Foo as Bar } from './module'` — re-export with rename

# Setup
- `npm install --save-dev typescript @types/node` — install TypeScript and Node.js type definitions as dev dependencies
- `@types/<pkg>` — community-maintained type declaration packages for libraries that don't ship their own types; `devDependencies` only

# Compiler
- `tsc` — the TypeScript compiler; type-checks `.ts` files and transpiles to `.js`
- `tsc <file.ts>` — compile a single file to JavaScript in the same directory
- `tsc` (no args) — compile the whole project using `tsconfig.json`
- `tsc --init` — generate a default `tsconfig.json`
- `tsc --watch` / `tsc -w` — re-compile automatically on file changes
- `tsc --noEmit` — type-check only; no `.js` output (useful in CI or pre-commit hooks)
- `tsconfig.json` — controls target JS version, module system, strictness, output directory, included files, etc.

# JSDoc
- `/** ... */` — JSDoc comment block; placed above a function, class, or variable; picked up by editors for hover docs
- `@param name description` — documents a parameter
- `@returns description` — documents the return value
- `@deprecated message` — marks a symbol as deprecated; editors show a strikethrough on usage
- `@example` — inline usage example shown in hover docs
- `@throws {ErrorType} description` — documents exceptions the function may throw
- `@template T` — documents a generic type parameter (mainly useful in `.js` files)
- `@type {type}` — annotate a variable's type in plain `.js` files; redundant in `.ts`

# Logging
- `console.log(msg)` — print to stdout; accepts multiple args and objects
- `console.warn(msg)` — print to stderr with warning level
- `console.error(msg)` — print to stderr with error level
- `console.debug(msg)` — print debug info; filtered in some environments
- `console.table(arr)` — print an array of objects as a formatted table
- `console.time(label)` / `console.timeEnd(label)` — measure elapsed time
- `pino` / `winston` — production logging libraries; structured JSON output, log levels, file/remote transports

# better-sqlite3
- `npm install better-sqlite3` + `npm install --save-dev @types/better-sqlite3` — install library and TypeScript types
- `const db = new Database('file.db')` — open (or create) a SQLite database file; `import Database from 'better-sqlite3'`
- `db.exec(sql)` — run raw SQL with no parameters and no return value; use for schema creation / migrations
- `const stmt = db.prepare(sql)` — compile a SQL statement for reuse; use `?` or `@name` for parameters
- `stmt.run(...params)` — execute INSERT / UPDATE / DELETE; returns `{ changes: number, lastInsertRowid: number }`
- `stmt.get(...params)` — execute SELECT and return the first row as an object, or `undefined`
- `stmt.all(...params)` — execute SELECT and return all rows as an array of objects
- `stmt.iterate(...params)` — execute SELECT and return a lazy iterator; memory-efficient for large result sets
- `db.transaction(fn)` — wrap a function in a transaction; auto-commits on return, rolls back on throw
- `db.pragma('journal_mode = WAL')` — run a PRAGMA; WAL mode recommended for concurrent reads
- `db.close()` — close the database connection

# Project Scaffolding
- `npm create @quick-start/electron@latest` — scaffold a new Electron project with guided setup
- `npx create-electron-app@latest my-app --template=vite-typescript` — scaffold Electron + Vite + TypeScript with hot-reload and packaging scripts
- `npm start` — start the app in dev mode with hot reload
- `npm run package` — bundle into a platform executable
- `npm run make` — bundle + wrap in a platform installer (`.dmg`, `.exe`, etc.)
- `npm run publish` — build and publish to a configured distribution target
