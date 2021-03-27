# Simple Math for 2D Shapes

This code contains 2D Vector operations and other associated 2D shape math
utilities.

It is not intended to be fast or precise. No Web Assembly, no optimization
tricks, just plain TS code. For real math avoid this lib and use the GPU instead.

- Distributed through [deno.land](https://deno.land/x/simple_shape_math).

**Current version: v1.0.0**

## Example usage

This lib provides the `Map2D`, `Set2D` and `Vector2D` objects.

### Map2D

`Map2D` is a Map of 2D coordinates to some value. It can map pairs of (x,y)
numbers to a value. It is useful for 2D grids, where each cell can have a value.

The API is kept similar to the [JavaScript Map API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

For more information please use `deno doc https://deno.land/x/simple_shape_math@v1.0.0/containers2d.ts` on the command line.

#### Usage

```typescript
import { Map2D } from "https://deno.land/x/simple_shape_math@v1.0.0/containers2d.ts"

// Start by creating a new Map2D()

const grid = new Map2D();

// Add some values to it
grid.set({ x: 123, y: 321 }, { r: 0, g: 192, b: 40 });
// ^ The key is (123, 321) and the value is the object { r: 0, g: 192, b: 40 }.

// Keys can be specified with just their x, y number values by calling `setXY`
grid.setXY(123, 321, { r: 255, g: 255, b: 255 });
// ^ Replaces the previous value set

// Iterate through the Map2D values with the common JS aproaches:
const allValues = [...grid.values()]; // [{ r: 255, g: 255, b: 255 }]

for(const [x,y] of grid.keys()) {
  console.log(x, y);
}

for(const [[x, y], value] of grid.entries()) {
  // Do something with both keys and values
}
```

### Set2D

`Set2D` is a Set of 2D coordinates. It can keep pairs of (x,y) numbers, and
test if a given pair is present. It is useful to test the uniqueness of 2D
values.

The API is kept similar to the [JavaScript Set API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).

For more information please use `deno doc https://deno.land/x/simple_shape_math@v1.0.0/containers2d.ts` on the command line.

#### Usage

```typescript
import { Set2D } from "https://deno.land/x/simple_shape_math@v1.0.0/containers2d.ts"

// Start by creating a new Set2D()

const unique = new Set2D();

// Add some values to it
unique.add({ x: 123, y: 321 });

// Values can be specified with just their x, y numbers values by calling `addXY`
unique.addXY(1337, 7331);

console.log(unique.has({ x: 123, y: 321 })); // prints "true"

// Iterate through the Set2D values with the common JS aproaches:
const allValues = [...unique.values()];
// ^ [{ x: 123, y: 321 }, { x: 1337, y: 7331 }]

for(const [x,y] of unique.keys()) {
  console.log(x, y);
}

for(const [[x, y], value] of unique.entries()) {
  // Do something with both keys and values
  // [[x, y], { x, y }]
}
```

### Vector2D

`Vector2D` represents a 2D point or vector. It is an object with `x` and `y`
number attributes.

The (x,y) attributes are readonly.

For more information please use `deno doc https://deno.land/x/simple_shape_math@v1.0.0/vector.ts` on the command line.

#### Usage

```typescript
import { Vector2D } from "https://deno.land/x/simple_shape_math@v1.0.0/vector.ts"

const v1 = new Vector2D(); // Creates a (0, 0) 2d point
const v2 = new Vector2D(123, 123); // Creates a (123, 123) 2d point

console.log(v1.isEqual(v2)); // prints "false"

const v3 = new Vector2D(100, 100); // Creates a (100, 100) 2d point

// Check if v3 is in the same line as v1 and v2
console.log(Vector2D.isBetween(v1, v2, v3)); // prints "true"
```

## Developer notes

This lib has no main entry point. Each file is intended to be imported as they
are needed.

If you are interested in contributing then the best place to start is by reading
the [`vector.ts`](https://github.com/HugoDaniel/simple_shape_math/blob/master/vector.ts) code.

This is where the `Vector2D` is declared and is a simple class to start reading.

### Make commands

This project uses `make` to do the build automation and developer environment.

The [`Makefile`](https://github.com/HugoDaniel/simple_shape_math/blob/main/Makefile)
has the following main actions:

- `make build` 

Use this command to generate the final production files into the `build/` folder.
Make sure that `make clean` was run previously.

- `make clean` 

Use this command to clean the build folder.

- `make test` 

Use this command to run the tests.

