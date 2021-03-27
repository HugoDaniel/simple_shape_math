import { assert } from "https://deno.land/std@0.90.0/testing/asserts.ts";
import { Vector2D } from "../vector.ts";

Deno.test("Creates a Vector2D with 0's in each attribute", () => {
  const v = new Vector2D();
  assert(v.x === 0, "Vector2D.x must be 0");
  assert(v.y === 0, "Vector2D.y must be 0");
});

Deno.test("Creates a Vector2D with values from the constructor", () => {
  const v = new Vector2D(123, -321);
  assert(v.x === 123, "Vector2D.x must be 123");
  assert(v.y === -321, "Vector2D.y must be -321");
});

Deno.test("Builds an object that can be serialized to JSON", () => {
  const v = new Vector2D(123, -321);
  const obj = v.toJSON();
  assert(
    JSON.stringify(obj) === "[123,-321]",
    "Object must be serializable to JSON"
  );
});

Deno.test("Can construct a Vector2D from a JSON string", () => {
  const v = new Vector2D(123, -321);
  const obj = v.toJSON();
  const newV = Vector2D.revive(JSON.parse(JSON.stringify(obj)));
  assert(
    newV.x === v.x && newV.y === v.y,
    "New Vector2D must be the same as the old"
  );
});

Deno.test("Can access the first and second attributes", () => {
  const v = new Vector2D(123, -321);
  assert(
    v.fst === 123 && v.snd === -321,
    "fst and snd must match the Vector2D.x and .y"
  );
});

Deno.test("Builds a string representation of the Vector2D", () => {
  const v = new Vector2D(123, -321);
  assert(v.toString() === "(123, -321)", "Incorrect string");
});

Deno.test("Can check if it is equal to another Vector2D", () => {
  const v1 = new Vector2D(123, -321);
  const v2 = new Vector2D(123, -321);
  const v3 = new Vector2D(0, 1);
  assert(v1.isEqual(v2), "v1 must be equal to v2");
  assert(!v1.isEqual(v3), "v1 must not be equal to v3");
  assert(Vector2D.isEqual(v1, v2), "v1 must be equal to v2");
  assert(!Vector2D.isEqual(v1, v3), "v1 must not be equal to v3");
});

Deno.test("Can construct a Vector2D from an object", () => {
  const v = Vector2D.fromObj({ x: 123, y: -321 });
  assert(v instanceof Vector2D, "Must be an instance of Vector2D");
  assert(
    v.x === 123 && v.y === -321,
    "Must have the same values as the object"
  );
});

Deno.test("Can create some utility Vectors", () => {
  const zero = Vector2D.zero();
  assert(
    zero.x === 0 && zero.y === 0,
    "Must be able to create a zero Vector2D"
  );
  const pow7 = Vector2D.pow7();
  assert(pow7.x === 127 && pow7.y === 127, "pow7 must be 127");
});

Deno.test("Can check if a vector is between two others", () => {
  const zero = Vector2D.zero();
  const v10 = new Vector2D(0, 10);
  const v5 = new Vector2D(0, 5);
  assert(
    Vector2D.isBetween(zero, v10, v5),
    "Vector(0,5) must be between (0,0) and (0,10)"
  );
  const v10_10 = new Vector2D(10, 10);
  const v5_5 = new Vector2D(5, 5);
  assert(
    Vector2D.isBetween(zero, v10_10, v5_5),
    "Vector(5,5) must be between (0,0) and (10,10)"
  );

  const vm10_10 = new Vector2D(-10, -10);
  const vm5_5 = new Vector2D(-5, -5);
  assert(
    Vector2D.isBetween(zero, vm10_10, vm5_5),
    "Vector(-5,-5) must be between (0,0) and (-10,-10)"
  );
});

Deno.test("Can return a list of points near the vector", () => {
  const zero = Vector2D.zero();
  const near1 = Vector2D.getNearSet(zero);
  assert(near1.length === 8, "Near set must have 8 entries");
  assert(near1[0].x === -1 && near1[0].y === -1, "Index 0 must be -1,-1");
  assert(near1[1].x === 0 && near1[1].y === -1, "Index 1 must be 0,-1");
  assert(near1[2].x === 1 && near1[2].y === -1, "Index 2 must be 1,-1");
  assert(near1[3].x === -1 && near1[3].y === 0, "Index 3 must be -1, 0");
  assert(near1[4].x === 1 && near1[4].y === 0, "Index 4 must be 1, 0");
  assert(near1[5].x === -1 && near1[5].y === 1, "Index 5 must be -1, 1");
  assert(near1[6].x === 0 && near1[6].y === 1, "Index 6 must be 0, 1");
  assert(near1[7].x === 1 && near1[7].y === 1, "Index 7 must be 1, 1");
});

Deno.test("Can create a Vector2D as an absolute of another", () => {
  const zero = Vector2D.zero();
  const v1 = new Vector2D(-123, 321);
  const v2 = new Vector2D(123, -321);
  const v3 = new Vector2D(-123, -321);
  const t1 = Vector2D.abs(zero);
  const t2 = Vector2D.abs(v1);
  const t3 = Vector2D.abs(v2);
  const t4 = Vector2D.abs(v3);
  assert(t1.x === 0 && t1.y === 0, "Vector.abs of zero must be zero");
  assert(t2.x === 123 && t2.y === 321, "Vector.abs must turn x value positive");
  assert(t3.x === 123 && t3.y === 321, "Vector.abs must turn y value positive");
  assert(
    t4.x === 123 && t4.y === 321,
    "Vector.abs must turn x,y values positive"
  );
});

Deno.test("Can round a Vector2D to the nearest resolution integer", () => {
  const v1 = Vector2D.createRounded(0, -123.9999, 321.1);
  const v2 = Vector2D.createRounded(0, 123.9999, -321.1);
  assert(v1.x === -123 && v1.y === 321, "Must round to quadrant");
  assert(v2.x === 123 && v2.y === -321, "Must round to quadrant");
});

Deno.test("Confirms if a point is inside a triangle", () => {
  const t1 = new Vector2D(0, 0);
  const t2 = new Vector2D(10, 10);
  const t3 = new Vector2D(10, 0);
  assert(Vector2D.insideTriangle(5, 5, t1, t2, t3));
  assert(!Vector2D.insideTriangle(11, 5, t1, t2, t3));
});
