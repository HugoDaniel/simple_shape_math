# Simple Math for 2D Shapes

This code contains 2D Vector operations and other associated 2D shape math
utilities.

It is not intended to be fast or precise. No Web Assembly, no optimization
tricks, just plain TS code. For real math avoid this lib and use the GPU instead.

- Distributed through [deno.land](https://deno.land/x/simple_shape_math).

**Current version: (unreleased yet)**

## Developer notes

The main file and code flow entry point is [`simple_shape_math.ts`](https://github.com/HugoDaniel/simple_shape_math/blob/main/simple_shape_math.ts).

If you are interested in contributing this is a cool place to start reading the code.

### Make commands

This project uses `make` to do the build automation and developer environment.

The [`Makefile`](https://github.com/HugoDaniel/simple_shape_math/blob/main/Makefile)
has the following main actions:

- `make build/simple_shape_math.min.js` 

Use this command to generate the final production file at `build/simple_shape_math.min.js`.

- `make tests` 

Use this command to run the tests.

