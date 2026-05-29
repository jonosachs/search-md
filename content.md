updated: 2026-05-21T11:50:37+10:00

# Data Types

## Primitives
- `string` — immutable text; `"hello"`, `'hello'`, `` `template ${literal}` ``
- `number` — IEEE 754 double-precision float; covers integers and decimals; `NaN` and `Infinity` are numbers; no separate int type
- `bigint` — arbitrary-precision integer; suffix `n` (e.g. `42n`); can't mix with `number` in arithmetic
- `boolean` — `true` or `false`
- `undefined` — variable declared but not assigned a value
- `null` — intentional absence of value; `typeof null === "object"` is a historical quirk
- `symbol` — unique, immutable identifier; `Symbol("desc")`; mainly used as object keys to avoid name collisions

## Collections & Objects
- `Object` — unordered key-value pairs; keys are strings or symbols; `let obj = { name: "Alice" }` (avoid `new Object()`)
- `Array` — ordered, zero-indexed list; `let arr = [1, 2, 3]` (avoid `new Array()` — `new Array(3)` makes 3 empty slots, not `[3]`)
- `Map` — key-value pairs where keys can be any type; `let m = new Map()` or `let m = new Map([[k, v], ...])` to pre-populate
- `Set` — collection of unique values; `let s = new Set()` or `let s = new Set([1, 2, 2])` → `{1, 2, 3}`
- `WeakMap` / `WeakSet` — like `Map`/`Set` but keys must be objects and are weakly held (eligible for GC when no other references exist); `let wm = new WeakMap()` / `let ws = new WeakSet()`

## Type checking
- `typeof x` — returns type as string: `"string"`, `"number"`, `"boolean"`, `"undefined"`, `"object"`, `"function"`, `"symbol"`, `"bigint"`; note `typeof null === "object"` (quirk)
- `Array.isArray(x)` — reliable array check; `typeof []` returns `"object"` so `typeof` alone is insufficient
- `x instanceof Foo` — returns `true` if `x` was created by `Foo` (checks the prototype chain); `[] instanceof Array` → `true`

## Type conversion
- `String(n)` — converts any value to a string; prefer over `.toString()` as it safely handles `null`/`undefined` without throwing; `String(42)` → `"42"`, `String(null)` → `"null"`
- `Number(s)` — converts a string (or other value) to a number; `Number("42")` → `42`, `Number("")` → `0`, `Number("abc")` → `NaN`
- `parseInt(s, radix)` — parses a string to an integer; always pass radix `10` to avoid octal surprises; stops at first non-numeric char; `parseInt("42px", 10)` → `42`
- `parseFloat(s)` — parses a string to a floating-point number; `parseFloat("3.14")` → `3.14`

# Operators
- `===` / `!==` — strict equality / inequality; no type coercion; always prefer over `==` / `!=`
- `==` / `!=` — loose equality; coerces types before comparing; avoid
- `<` / `>` / `<=` / `>=` — comparison operators
- `&&` — logical AND; returns the first falsy value, or the last value if all truthy
- `||` — logical OR; returns the first truthy value, or the last value if all falsy
- `!` — logical NOT; flips truthiness
- `??` — nullish coalescing; returns right side only if left is `null` or `undefined`; unlike `||`, does not trigger on `0`, `""`, or `false`
- `?.` — optional chaining; short-circuits to `undefined` if any part of the chain is `null`/`undefined`; `obj?.prop`, `arr?.[i]`, `fn?.()`
- `? :` — ternary; `condition ? valueIfTrue : valueIfFalse`; use for simple inline conditionals
- `**` — exponentiation; `2 ** 3` → `8`; equivalent to `Math.pow(2, 3)`
- `+=` / `-=` / `*=` / `/=` / `%=` — compound assignment; `x += 1` is shorthand for `x = x + 1`
- `&&=` / `||=` / `??=` — logical assignment; only assigns if the condition is met; `x ??= 0` sets `x` to `0` only if `x` is `null`/`undefined`
- `i++` — post-increment; returns current value then increments; `++i` pre-increments first; in a `for` loop the distinction doesn't matter — `i++` is conventional
- `i--` / `--i` — post/pre-decrement; same pattern as increment

# Scope & Closures
- `var` — function-scoped; hoisted and initialised to `undefined`; avoid in modern code
- `let` — block-scoped; hoisted but not initialised (temporal dead zone until the declaration line)
- `const` — block-scoped; must be initialised at declaration; the binding is immutable but object/array contents can still mutate
- `hoisting` — JS moves `var` declarations and `function` declarations to the top of their scope before execution; `let`/`const` are hoisted but not initialised
- `closure` — a function that retains access to its outer scope's variables after the outer function has returned; the inner function "closes over" those variables

# The `this` Keyword
- `this` — refers to the object that is executing the current function; its value depends on *how* the function is called, not where it is defined
- `this` in a method — refers to the object the method is called on; `obj.foo()` → `this` is `obj`
- `this` in a regular function — non-strict: the global object (`window` / `global`); strict mode: `undefined`
- `this` in an arrow function — inherited from the enclosing lexical scope; arrow functions have no own `this`
- `this` in a class — refers to the instance
- `fn.call(obj, ...args)` — calls `fn` with `this` explicitly set to `obj`
- `fn.apply(obj, [args])` — like `.call()` but arguments passed as an array
- `fn.bind(obj)` — returns a new function permanently bound to `obj` as `this`; does not call immediately

# Functions
- `function foo(x) {}` — function declaration; hoisted to the top of its scope
- `const foo = function(x) {}` — function expression; not hoisted
- `const foo = (x) => x * 2` — arrow function; concise syntax; no own `this` binding (inherits from enclosing scope)
- `() => {}` — arrow function with no parameters and a block body; commonly used as a callback, e.g. `btn.addEventListener("click", () => {})`
- `const foo = (x = 0) => x` — default parameter; used when argument is `undefined`
- `function foo(...args) {}` — rest parameter; collects remaining arguments into an array; must be last
- `foo?.()` — optional call; only invokes if `foo` is not `null`/`undefined`

# Classes
- `class Foo {}` — class declaration; syntactic sugar over prototype-based inheritance
- `constructor(args) {}` — called when `new Foo()` is invoked; initialises the instance
- `new Foo()` — creates a new instance and calls the constructor
- `this.prop = val` — set an instance property inside the constructor
- `method() {}` — instance method; defined on the prototype and shared across all instances
- `static method() {}` — class-level method; called on the class itself, not on instances; `Foo.method()`
- `get prop() {}` / `set prop(val) {}` — getter/setter; accessed like a property but backed by a function
- `#field` — private field; only accessible within the class body; declared at the top of the class before the constructor
- `class Bar extends Foo {}` — inherit from a parent class; `Bar` gets all of `Foo`'s methods
- `super()` — call the parent constructor; must be called before accessing `this` in a subclass constructor
- `super.method()` — call a parent class method from a subclass override

# Destructuring & Spread
- `const { a, b } = obj` — object destructuring; extracts named properties into variables
- `const { a: renamed } = obj` — destructure and rename the local variable
- `const { a = 0 } = obj` — destructure with a default value (used when the property is `undefined`)
- `const [x, y] = arr` — array destructuring; assigns by position
- `const [x, , z] = arr` — skip an element with an empty comma
- `const { a, ...rest } = obj` — rest in destructuring; collects remaining properties into a new object
- `const merged = { ...obj1, ...obj2 }` — spread to merge/clone objects; later keys overwrite earlier ones
- `const copy = [...arr]` — spread to shallow-clone an array

# Iteration
- `for (let i = 0; i < n; i++)` — classic C-style loop; use when you need the index or non-standard step
- `for (const val of iterable) {}` — iterates over the *values* of any iterable (arrays, strings, `Map`, `Set`, etc.); preferred for arrays
- `for (const key in obj) {}` — iterates over the *enumerable property keys* of an object; avoid on arrays (can include inherited keys); use `Object.keys()` instead
- `while (cond) {}` — loops while condition is truthy; condition checked before each iteration
- `do {} while (cond)` — like `while` but body always runs at least once; condition checked after
- `break` — exits the nearest enclosing loop or `switch` immediately
- `continue` — skips the rest of the current iteration and moves to the next
- `Array.from({ length: n }, (_, i) => i)` — create and populate an array of length `n` (e.g. `[0,1,2,…n-1]`)
- `iterable` — any object with a `[Symbol.iterator]()` method; arrays, strings, `Map`, `Set`, generators are all iterables
- `generator function` — returns a generator (an iterator); `yield` pauses execution and emits a value; body resumes on each `.next()` call; `function* gen() { yield 1 }`

# Error Handling
- `try {} catch(e) {} finally {}` — `catch` runs on error; `finally` always runs (cleanup, closing resources)
- `throw new Error("msg")` — throw an error; `Error` is the base type; can throw any value but `Error` instances carry a stack trace
- `e.message` — the error message string
- `e.stack` — the stack trace string (engine-specific format)
- `TypeError` / `RangeError` / `SyntaxError` — built-in subtypes of `Error`; thrown by the runtime for type errors, out-of-range values, and parse errors respectively

# Promises & Async/Await
- `Promise` — represents a value available now, later, or never; states: `pending`, `fulfilled`, `rejected`
- `new Promise((resolve, reject) => {})` — create a promise manually; call `resolve(val)` on success, `reject(err)` on failure
- `promise.then(fn)` — runs `fn` with the resolved value; returns a new promise (chainable)
- `promise.catch(fn)` — handles rejection; equivalent to `.then(null, fn)`
- `promise.finally(fn)` — runs `fn` regardless of outcome; good for cleanup; does not receive a value
- `Promise.resolve(val)` — returns a promise resolved with `val`; useful for wrapping a sync value
- `Promise.reject(err)` — returns a promise rejected with `err`
- `Promise.all([p1, p2])` — resolves when all promises resolve; rejects immediately if any reject
- `Promise.allSettled([p1, p2])` — waits for all to settle; returns `[{status, value/reason}]`; never rejects
- `Promise.race([p1, p2])` — resolves or rejects with whichever promise settles first
- `Promise.any([p1, p2])` — resolves with the first fulfilled promise; rejects only if all reject (with `AggregateError`)
- `async function foo() {}` — marks a function as async; always returns a promise
- `await expr` — pauses the async function until `expr` resolves; only valid inside `async` functions
- `try { await fn() } catch(e) {}` — standard pattern for error handling with async/await

# Event Loop
- `event loop` — JS is single-threaded; the event loop picks tasks from queues and pushes them onto the call stack when it is empty
- `call stack` — LIFO stack of currently executing functions; synchronous code runs here
- `microtask queue` — holds Promise callbacks (`.then`, `.catch`) and `queueMicrotask()`; drained completely after each task, before the next macrotask
- `task queue (macrotask)` — holds callbacks from `setTimeout`, `setInterval`, and I/O events; one task processed per loop tick
- `setTimeout(fn, ms)` — schedules `fn` as a macrotask after at least `ms` milliseconds; `ms=0` still defers until after current synchronous code and all microtasks
- `setInterval(fn, ms)` — schedules `fn` repeatedly every `ms` milliseconds; returns an ID
- `clearTimeout(id)` / `clearInterval(id)` — cancel a pending timeout or interval
- `queueMicrotask(fn)` — schedules `fn` as a microtask; runs before the next macrotask

# Numbers
- `n.toFixed(d)` — format with `d` decimal places; returns a string; `(3.14159).toFixed(2)` → `"3.14"`
- `n.toString(radix)` — convert to string in the given base; `(255).toString(16)` → `"ff"`
- `n.toPrecision(p)` — format with `p` significant digits; returns a string; `(123.456).toPrecision(4)` → `"123.5"`
- `Number.isInteger(n)` — `true` if `n` is a finite integer; `Number.isInteger(2)` → `true`, `Number.isInteger(2.5)` → `false`
- `Number.isFinite(n)` — `true` if `n` is a finite number (not `NaN` or `Infinity`); `Number.isFinite(Infinity)` → `false`
- `Number.isNaN(n)` — `true` if `n` is exactly `NaN`; safer than the global `isNaN()` which coerces; `Number.isNaN(NaN)` → `true`
- `Number.MAX_SAFE_INTEGER` — `2^53 - 1`; largest integer JS can represent exactly without precision loss
- `Number.EPSILON` — smallest representable difference between floats; useful for float comparison

# Strings
- `str.length` — number of characters; `"hello".length` → `5`
- `str[i]` — access character by index; same rules as arrays; negative indices not supported; `"hello"[0]` → `"h"`
- `str.at(i)` — access character by index; supports negative indices; `"hello".at(-1)` → `"o"`
- `str.includes(substr)` — `true` if `substr` is found anywhere; case-sensitive; `"hello".includes("ell")` → `true`
- `str.slice(start, end)` — extracts a substring; `end` is exclusive; negative indices count from end; `"hello".slice(1, 3)` → `"el"`, `"hello".slice(-2)` → `"lo"`
- `str.split(sep)` — splits string into an array; `"a,b,c".split(",")` → `["a","b","c"]`; `"abc".split("")` → `["a","b","c"]`
- `str.trim()` — removes leading and trailing whitespace; `trimStart()` / `trimEnd()` for one side only; `"  hi  ".trim()` → `"hi"`
- `str.toUpperCase()` / `str.toLowerCase()` — change case; return a new string; `"Hi".toUpperCase()` → `"HI"`
- `str.replace(search, replacement)` — replaces first match; use a regex with `g` flag to replace all; `"foo bar foo".replace(/foo/g, "x")` → `"x bar x"`
- `str.replaceAll(search, replacement)` — replaces all matches; no regex needed; `"foo bar foo".replaceAll("foo", "x")` → `"x bar x"`
- `str.startsWith(prefix)` / `str.endsWith(suffix)` — `true` if string starts/ends with given value; `"hello".startsWith("he")` → `true`
- `str.indexOf(substr)` — returns index of first match; `-1` if not found; `"hello".indexOf("l")` → `2`
- `str.lastIndexOf(substr)` — returns index of last match; `-1` if not found; `"hello".lastIndexOf("l")` → `3`
- `str.padStart(n, char)` / `str.padEnd(n, char)` — pad to length `n`; `"5".padStart(3, "0")` → `"005"`
- `str.repeat(n)` — returns the string repeated `n` times; `"ab".repeat(3)` → `"ababab"`

# Regular Expressions
- `/pattern/flags` — regex literal; common flags: `g` (find all matches), `i` (case-insensitive), `m` (multiline `^`/`$`)
- `new RegExp(pattern, flags)` — dynamic regex; use when the pattern is stored in a variable
- `regex.test(str)` — returns `true` if the pattern matches anywhere in `str`
- `str.match(regex)` — without `g`: returns first match with capture groups; with `g`: returns array of all matches
- `str.matchAll(regex)` — returns iterator of all matches including capture groups; requires `g` flag
- `str.replace(regex, replacement)` — replaces match(es); replacement can be a function `(match, ...groups) => newStr`
- `str.search(regex)` — returns index of first match; `-1` if not found
- `str.split(regex)` — split on a regex pattern
- `.` — any character except newline; `\d` digit `[0-9]`; `\w` word char `[a-zA-Z0-9_]`; `\s` whitespace; `\b` word boundary
- `^` / `$` — start / end of string (or line with `m` flag)
- `*` / `+` / `?` — zero or more / one or more / zero or one; append `?` to make lazy (e.g. `+?` matches as few as possible)
- `{n}` / `{n,m}` — exactly `n` / between `n` and `m` repetitions
- `[abc]` / `[^abc]` — character class / negated class; `[a-z]` range
- `(group)` — capturing group; captured value available in match results
- `(?:group)` — non-capturing group; groups without capturing the value

# Arrays
- `arr.length` — number of elements; `[1,2,3].length` → `3`
- `arr[i]` — access element by index; zero-based; negative indices not supported (returns `undefined`); `[1,2,3][0]` → `1`
- `arr[i] = value` — assign element by index; mutates in place so works on `const` arrays; assigning past `length` creates a sparse array with holes; `const a = ["x"]; a[2] = "z"` → `["x", <1 empty>, "z"]`, `a.length` → `3`
- `arr.at(i)` — access element by index; supports negative indices; `[1,2,3].at(-1)` → `3`
- `arr.push(val)` — adds one or more elements to the end; returns new length; mutates; `arr.push(4)` appends `4`
- `arr.pop()` — removes and returns the last element; mutates; `[1,2,3].pop()` → `3`
- `arr.unshift(val)` — adds one or more elements to the start; returns new length; mutates; `arr.unshift(0)` prepends `0`
- `arr.shift()` — removes and returns the first element; mutates; `[1,2,3].shift()` → `1`
- `arr.map(fn)` — returns a new array with each element transformed; non-mutating; `[1,2,3].map(n => n * 2)` → `[2,4,6]`
- `arr.filter(fn)` — returns a new array of elements where `fn` returns truthy; non-mutating; `[1,2,3,4].filter(n => n > 2)` → `[3,4]`
- `arr.reduce(fn, init)` — reduces array to a single value; `[1,2,3].reduce((a, b) => a + b, 0)` → `6`
- `arr.find(fn)` — returns the first element where `fn` is truthy; `[1,2,3].find(n => n > 1)` → `2`
- `arr.findIndex(fn)` — returns the index of the first match; `-1` if none; `[1,2,3].findIndex(n => n > 1)` → `1`
- `arr.some(fn)` — returns `true` if at least one element passes `fn`; short-circuits; `[1,2,3].some(n => n > 2)` → `true`
- `arr.every(fn)` — returns `true` if all elements pass `fn`; short-circuits on the first `false`; `[1,2,3].every(n => n > 0)` → `true`; for DOM collections, convert first: `Array.from(parent.children).every(child => child.style.display === "none")`
- `arr.forEach(fn)` — calls `fn` for each element; returns `undefined`; not chainable; `[1,2,3].forEach(n => console.log(n))`
- `arr.flat(depth)` — flattens nested arrays; default depth `1`; use `Infinity` for full flatten; `[1,[2,[3]]].flat(2)` → `[1,2,3]`
- `arr.flatMap(fn)` — maps then flattens one level; `[1,2,3].flatMap(n => [n, n*2])` → `[1,2,2,4,3,6]`
- `arr.includes(val)` — returns `true` if `val` is in the array (uses `===`); `[1,2,3].includes(2)` → `true`
- `arr.indexOf(val)` — returns index of first match (uses `===`); `-1` if not found; `[1,2,3,2].indexOf(2)` → `1`
- `arr.lastIndexOf(val)` — returns index of last match; `-1` if not found; `[1,2,3,2].lastIndexOf(2)` → `3`
- `arr.reverse()` — reverses in place; returns the reversed array; mutates; `[1,2,3].reverse()` → `[3,2,1]`
- `arr.concat(other)` — returns a new array with `other` appended; non-mutating; `[1,2].concat([3,4])` → `[1,2,3,4]`; `[...arr1, ...arr2]` is more idiomatic
- `arr.slice(start, end)` — shallow copy of a portion; `end` is exclusive; negative indices count from end; non-mutating; `[1,2,3].slice(1, 3)` → `[2,3]`, `[1,2,3].slice(-2)` → `[2,3]`, `arr.slice()` clones
- `arr.splice(start, n, ...items)` — removes `n` elements at `start`, optionally inserts `items`; mutates; `[1,2,3,4].splice(1, 2, "x")` mutates to `[1,"x",4]` and returns `[2,3]`
- `arr.sort(fn)` — sorts in place; always provide a comparator `(a, b) => a - b` for numbers (default sort is lexicographic); `[3,1,2].sort((a,b) => a-b)` → `[1,2,3]`
- `arr.join(sep)` — joins elements into a string with `sep` between them; `[1,2,3].join("-")` → `"1-2-3"`

# Objects
- `obj.key` — dot notation; read a known property; `obj.name`
- `obj.key = val` — add or update a property; creates the key if it doesn't exist
- `obj[key]` — bracket notation; read or write using a dynamic or computed key; `obj[varName]`
- `delete obj.key` — remove a property; accessing it afterwards returns `undefined`
- `"key" in obj` — `true` if `key` exists on `obj` or its prototype chain; use `Object.hasOwn(obj, key)` to exclude inherited keys
- `{ name }` — property shorthand; equivalent to `{ name: name }` when key matches the variable name
- `{ [key]: val }` — computed property name; key is evaluated from an expression; `{ ["x" + i]: 1 }`
- `{ method() {} }` — method shorthand; equivalent to `{ method: function() {} }`
- `Object.keys(obj)` — array of own enumerable string keys; `Object.keys({a:1, b:2})` → `["a","b"]`
- `Object.values(obj)` — array of own enumerable values; `Object.values({a:1, b:2})` → `[1,2]`
- `Object.entries(obj)` — array of `[key, value]` pairs; `Object.entries({a:1, b:2})` → `[["a",1],["b",2]]`
- `Object.fromEntries(entries)` — inverse of `Object.entries`; converts `[[k, v], ...]` or a `Map` to a plain object; `Object.fromEntries([["a",1]])` → `{a:1}`
- `Object.assign(target, ...sources)` — shallow merges sources into target; mutates target; `Object.assign({}, obj1, obj2)` clones and merges
- `Object.freeze(obj)` — makes an object shallowly immutable; throws in strict mode on mutation; nested objects are not frozen; `Object.freeze({a:1})`
- `Object.create(proto)` — creates a new object with `proto` as its prototype; `Object.create(null)` gives a "pure" object with no inherited methods
- `Object.hasOwn(obj, key)` — `true` if `key` is the object's own (non-inherited) property; preferred over `obj.hasOwnProperty(key)`; `Object.hasOwn({a:1}, "a")` → `true`
- `Object.getPrototypeOf(obj)` — returns the prototype of `obj`; `Object.getPrototypeOf([]) === Array.prototype` → `true`
- `{ ...obj }` — spread; shallow clone or merge; later keys overwrite earlier ones (see Destructuring & Spread)

# Maps
- `map.set(key, val)` — add or update an entry; returns the Map (chainable)
- `map.get(key)` — retrieve value by key; returns `undefined` if not found; `m.get("a")`
- `map.has(key)` — returns `true` if the key exists; `m.has("a")` → `true`
- `map.delete(key)` — removes the entry; returns `true` if it existed; `m.delete("a")`
- `map.clear()` — removes all entries
- `map.size` — number of entries (property, not a method); `m.size` → `3`
- `map.keys()` — iterator of keys in insertion order; `[...m.keys()]` → `["a","b"]`
- `map.values()` — iterator of values in insertion order; `[...m.values()]` → `[1,2]`
- `map.entries()` — iterator of `[key, value]` pairs; default iterator for `for...of`; `[...m.entries()]` → `[["a",1],["b",2]]`
- `map.forEach((val, key) => {})` — iterate entries; note argument order is `(value, key)`; `m.forEach((v, k) => console.log(k, v))`
- `for (const [k, v] of map) {}` — idiomatic iteration using destructuring

# Sets
- `set.add(val)` — adds a value; no-op if already present; returns the Set (chainable); `s.add(1).add(2)`
- `set.has(val)` — returns `true` if the value exists; O(1) lookup; `s.has(1)` → `true`
- `set.delete(val)` — removes a value; returns `true` if it existed; `s.delete(1)`
- `set.clear()` — removes all values
- `set.size` — number of unique values (property, not a method); `s.size` → `3`
- `set.values()` — iterator of all values in insertion order; `[...s.values()]` → `[1,2,3]`
- `set.forEach(fn)` — iterates values; `s.forEach(v => console.log(v))`
- `for (const val of set) {}` — idiomatic iteration
- `[...new Set(arr)]` — deduplicate an array; `[...new Set([1,1,2,3,3])]` → `[1,2,3]`

# JSON
- `JSON.stringify(val)` — serialises a JS value to a JSON string; `undefined`, functions, and symbols are omitted
- `JSON.stringify(val, null, 2)` — pretty-print with 2-space indentation
- `JSON.parse(str)` — parses a JSON string into a JS value; throws `SyntaxError` if the string is invalid JSON
- `structuredClone(obj)` — deep clones an object natively; handles more types than a JSON round-trip (e.g. `Date`, `Map`, `Set`); available Node 17+ and modern browsers

# Math
- `Math.round(n)` — rounds to nearest integer; `.5` rounds up; `Math.round(2.5)` → `3`
- `Math.floor(n)` — rounds down (towards negative infinity); `Math.floor(2.9)` → `2`
- `Math.ceil(n)` — rounds up (towards positive infinity); `Math.ceil(2.1)` → `3`
- `Math.trunc(n)` — removes the decimal part (towards zero); differs from `floor` for negatives: `Math.trunc(-1.9)` → `-1`
- `Math.abs(n)` — absolute value; `Math.abs(-5)` → `5`
- `Math.max(...nums)` — largest value; use spread for arrays: `Math.max(...[1,2,3])` → `3`
- `Math.min(...nums)` — smallest value; `Math.min(1,2,3)` → `1`
- `Math.sqrt(n)` — square root; `Math.sqrt(16)` → `4`
- `Math.random()` — random float in `[0, 1)`; `Math.floor(Math.random() * n)` for a random integer in `[0, n)`
- `Math.PI` — π (3.14159...)

# DOM
- `element.innerHTML` — gets or replaces an element's HTML contents as a string; parses tags and mutates child nodes, so prefer `textContent` for plain text and avoid assigning untrusted input because it can create XSS bugs
- `element.textContent` — gets or replaces the plain text inside a node; does not parse HTML, so it is safer than `innerHTML` for user-provided text
- `element.innerText` — gets or sets visible rendered text; affected by CSS/layout and usually slower than `textContent`; use mainly when you specifically need what the user would see
- `element.value` — gets or sets the current value of form controls like `input`, `textarea`, and `select`; use after selecting the element, e.g. `document.querySelector("input").value`
- `element.style.display` — gets or sets the element's inline CSS `display` value; common for show/hide toggles, e.g. `el.style.display = "none"` hides it and `el.style.display = "block"` shows it as a block
- `element.outerHTML` — gets or replaces the element itself, including its opening/closing tag and children; assigning to it removes/replaces that node in the DOM
- `element.children` — live HTMLCollection of an element's child elements only, not an actual Array; convert before array methods with `Array.from(element.children)` or `[...element.children]`; excludes text/comment nodes, unlike `childNodes`
- `element.childNodes` — live NodeList of all direct child nodes, including element nodes, text nodes, comments, and whitespace text from formatted HTML
- `element.insertAdjacentHTML(position, html)` — parses and inserts HTML without replacing existing children; positions include `"beforebegin"`, `"afterbegin"`, `"beforeend"`, `"afterend"`; still unsafe with untrusted input
- `document.createElement(tag)` — creates an element node without inserting it into the DOM yet; commonly paired with `textContent` and `appendChild`
- `parent.append(...nodesOrStrings)` — appends one or more nodes/strings to the end of `parent`; strings become text nodes
- `parent.appendChild(child)` — adds an existing or newly-created node as the last child of `parent`; mutates the DOM; `list.appendChild(item)` moves `item` into `list` if it already exists elsewhere
- `parent.removeChild(child)` — removes a direct child node from `parent`; first get a reference to the child with something like `document.getElementById("item")` or `parent.querySelector(".item")`, then call `parent.removeChild(child)`
- `parent.replaceChildren(...nodesOrStrings)` — removes all existing children and inserts the supplied nodes/strings; useful for safely rebuilding a container

# Console
- `console.log(...args)` — print to stdout; accepts multiple args and objects
- `console.warn(...args)` — print to stderr with warning level
- `console.error(...args)` — print to stderr with error level
- `console.debug(...args)` — print debug info; filtered out in some environments
- `console.table(arr)` — print an array of objects as a formatted table
- `console.time(label)` / `console.timeEnd(label)` — measure elapsed time between two points
- `console.group(label)` / `console.groupEnd()` — collapsible group of log messages
- `console.dir(obj)` — print object with all properties; useful for inspecting deeply

# Modules
- `ESM (ECMAScript Modules)` — the modern standard JS module system; uses `import`/`export` syntax; statically analysable at build time (enables tree-shaking); native in browsers and Node 12+; activate in Node via `.mjs` extension or `"type": "module"` in `package.json`
- `import { foo } from './bar.js'` — named import; name must match an exported name in the source file
- `import DefaultExport from './bar.js'` — default import; can be named anything locally
- `import * as ns from './bar.js'` — namespace import; all named exports as properties of `ns`
- `export const foo = ...` / `export function foo() {}` — named export; a module can have many
- `export default value` — default export; one per module; typically the module's main thing
- `import('./foo.js')` — dynamic import; returns a `Promise`; use `await import(...)` to load lazily at runtime (e.g. code-splitting, conditional loading)
- `CommonJS (CJS)` — the older Node module system; `const x = require('./x')` / `module.exports = {...}`; synchronous; still widely used; cannot mix `require` and `import` in the same file
- `"type": "module"` in `package.json` — treat all `.js` files in the project as ESM; use `.cjs` extension for any CommonJS files alongside them
- `tree-shaking` — bundler optimisation that removes unused exports from the final bundle; only possible with ESM because `import`/`export` are static (analysable at build time without running the code); CJS `require()` is dynamic so bundlers can't safely determine what's unused

# Package Management
- `npm` — Node Package Manager; the default package manager for Node.js; used to install, manage, and publish JavaScript packages; stores dependencies in `package.json` and locks versions in `package-lock.json`
- `npm init` — initialises a new Node.js project by interactively creating a `package.json` file in the current directory; use `npm init -y` to accept defaults and skip prompts
- `npm install` — installs all dependencies listed in `package.json`
- `npm install <pkg>` — installs a package and adds it to `dependencies` in `package.json`
- `npm install <pkg> --save-dev` — installs a package and adds it to `devDependencies`; shorthand `-D`; use for tools only needed during development (test runners, linters, bundlers, type checkers); `npm install --omit=dev` (or `NODE_ENV=production`) skips them to keep production installs faster and deployed images smaller, since the built/running app doesn't import them
- `npm run <script>` — runs a script defined in the `scripts` section of `package.json`
- `npm uninstall <pkg>` — removes a package and updates `package.json`
- `npx <cmd>` — executes a CLI tool from `node_modules/.bin` if installed locally, otherwise downloads it temporarily, runs it, then discards; replaces the older `npm install -g` pattern for one-shot scaffolding tools; e.g. `npx create-react-app my-app` runs the scaffolder once without polluting global installs
- `npx serve` — spins up a zero-config static file server in the current directory; defaults to `http://localhost:3000`; useful for previewing static HTML/JS/CSS without setting up a build tool; `npx serve ./dist` to serve a specific folder, `npx serve -p 8080` to set the port
- `pnpm` — "performant npm"; drop-in alternative to `npm` that uses a global content-addressable store (`~/.pnpm-store/`) and symlinks each project's `node_modules` into it, so packages aren't duplicated across projects; faster installs, less disk usage, and a strict `node_modules` layout that blocks phantom dependencies (importing a transitive dep you didn't declare); lockfile is `pnpm-lock.yaml`; install via `brew install pnpm` or `corepack enable`
- `pnpm install` / `pnpm add <pkg>` / `pnpm add -D <pkg>` / `pnpm run <script>` / `pnpm remove <pkg>` — same shape as the `npm` equivalents; `pnpm dlx <cmd>` is the `npx` equivalent (one-shot run without global install); e.g. `pnpm add react`, `pnpm dlx create-vite my-app`
- version range specifiers (`^`, `~`, exact) — see `version range specifier` in compsci.md

# Runtime
- `node` — JavaScript runtime built on Chrome's V8 engine; executes JS outside the browser; provides its own stdlib (`fs`, `http`, `path`, etc.) and module systems (CommonJS, ESM); JS has no standalone compiler — V8 JIT-compiles to native code at runtime
- `node <file.js>` — runs a JavaScript file
- `node` (no args) — opens an interactive REPL
- `node -e "<code>"` — executes a one-liner, e.g. `node -e "console.log(process.version)"`
- `node --watch <file.js>` — re-runs on file changes (Node 18+)
- `node --inspect <file.js>` — starts the V8 debugger; attach via Chrome DevTools or VS Code
- `V8` — Google's open-source JavaScript engine; parses JS and JIT-compiles it to machine code; used by Node and Chrome
- `process.argv` — array of CLI arguments: `[node_path, script_path, ...args]`
- `process.env` — object of environment variables

# Testing
- `assert` — Node.js built-in module for assertions; throws `AssertionError` if condition is false; `import assert from 'assert'`
- `assert(condition, msg)` — throws if condition is falsy
- `assert.strictEqual(a, b)` — throws if `a !== b`
- `assert.deepStrictEqual(a, b)` — throws if objects/arrays are not deeply equal
- `assert.throws(fn)` — throws if `fn` does not throw
- `node --test` — built-in test runner (Node 18+); discovers and runs `*.test.js` files
- `import { test } from 'node:test'` — built-in test framework; `test('name', () => {})` defines a test
- `import { describe, it } from 'node:test'` — BDD-style grouping; `describe('group', () => { it('case', () => {}) })`

# Date & Time

## Native Date
- `new Date()` — current date/time
- `new Date('2024-01-15')` — parse an ISO string
- `Date.now()` — current Unix timestamp in milliseconds
- `date.toISOString()` — format as `"2024-01-15T00:00:00.000Z"`
- `date.getFullYear()` / `getMonth()` / `getDate()` — year / month (0-indexed, add 1) / day; the 0-indexed month is a common gotcha
- `date.getTime()` — Unix timestamp in ms for this date instance

## Day.js (recommended)
- `npm install dayjs` — install; 2kb, immutable, Moment.js-compatible API
- `dayjs()` — current date/time
- `dayjs('2024-01-15')` — parse an ISO string
- `dayjs().format('YYYY-MM-DD HH:mm')` — format using tokens
- `dayjs().add(7, 'day')` — add time; units: `day`, `month`, `year`, `hour`, `minute`, `second`
- `dayjs().subtract(1, 'month')` — subtract time
- `dayjs().diff(other, 'day')` — difference between two Day.js instances in the given unit
- `dayjs().isValid()` — check if the date parsed successfully
- `dayjs().isBefore(other)` / `isAfter(other)` — comparison
- `dayjs().toDate()` — convert back to native `Date`
