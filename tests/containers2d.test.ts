import {
  assert,
  assertThrows,
  assertArrayIncludes,
} from "https://deno.land/std@0.90.0/testing/asserts.ts";
import { Map2D, Set2D } from "../containers2d.ts";

Deno.test("Creates an empty Map2D by default", () => {
  const m = new Map2D();
  assert(m.size === 0, "Map2D.size must be 0");
});

Deno.test("Creates a Map2D from two arrays", () => {
  const m = new Map2D([{ x: 1, y: 2 }], ["Test"]);
  assert(m.size === 1, "Map2D.size must be 1");
  assert(m.getXY(1, 2) === "Test", "Map2D (1,2) must be 'Test'");
});

Deno.test("Builds an object that can be serialized to JSON", () => {
  const m = new Map2D([{ x: 1, y: 2 }], ["Test"]);
  const obj = m.toJSON((e) => e);
  assert(obj instanceof Array, "Map2D toJSON must be an Array");
  assert(obj.length === 1, "Map2D toJSON Array must have 1 element");
  assert(obj[0][0] === 1, "Map2D toJSON Array x must be 1");
  assert(obj[0][1] === 2, "Map2D toJSON Array y must be 2");
  assert(obj[0][2] === "Test", "Map2D toJSON Array value must be 'Test'");

  const parsed = JSON.parse(JSON.stringify(obj));
  assert(parsed instanceof Array, "Parsed toJSON must be an Array");
  assert(parsed.length === 1, "Parsed toJSON Array must have 1 element");
  assert(parsed[0][0] === 1, "Parsed toJSON Array x must be 1");
  assert(parsed[0][1] === 2, "Parsed toJSON Array y must be 2");
  assert(parsed[0][2] === "Test", "Parsed toJSON Array value must be 'Test'");
});

Deno.test("Can construct a Map2D from a string", () => {
  const m = new Map2D([{ x: 1, y: 2 }], ["Test"]);
  const obj = m.toJSON((id) => id);
  const newM = Map2D.revive(JSON.parse(JSON.stringify(obj)), (e) => e);

  assert(
    newM.size === m.size,
    "Revived Map2D must have the same size as the original Map2D"
  );
  assert(
    newM.getXY(1, 2) === m.getXY(1, 2),
    "Revived Map2D must have the same element as the original Map2D"
  );
});

Deno.test("Clears a Map2D", () => {
  const m = new Map2D([{ x: 1, y: 2 }], ["Test"]);
  m.clear();
  assert(m.size === 0);
});

Deno.test("Can return the first value inserted", () => {
  const m = new Map2D();
  m.setXY(123, 321, "Test1");
  m.setXY(0, 0, "Test2");
  m.setXY(1, 1, "Test3");

  assert(m.firstValue() === "Test1");
});

Deno.test(
  "Throws an Error when trying to get the first value from an empty Map2D",
  () => {
    const m = new Map2D();
    assertThrows(m.firstValue, Error);
  }
);

Deno.test("Can return the first key inserted", () => {
  const m = new Map2D();
  m.setXY(123, 321, "Test1");
  m.setXY(0, 0, "Test2");
  m.setXY(1, 1, "Test3");

  assert(m.firstKey().x === 123);
  assert(m.firstKey().y === 321);
});

Deno.test(
  "Throws an error when trying to the get first key from an empty Map2D",
  () => {
    const m = new Map2D();
    assertThrows(m.firstKey, Error);
  }
);

Deno.test("Filters the Map2D with a boolean function", () => {
  const m = new Map2D();

  assert(
    m.filter(() => true).size === 0,
    "Filtering an empty Map2D must return an empty Map2D"
  );

  m.setXY(0, 0, 0);
  assert(
    m.filter(() => false).size === 0,
    "Filtering with always false must return an empty Map2D"
  );

  assert(
    m.filter(() => true).size === m.size,
    "Filtering with always true must return a Map2D with the same size"
  );

  m.setXY(123, 321, 333);
  assert(
    m.filter((value, x, y) => x === 123 && y === 321).size === 1,
    "Filtering must be passed the x,y parameters"
  );
  assert(
    m.filter((value, x, y) => value === 333).size === 1,
    "Filtering must be passed the value parameter"
  );
});

Deno.test(
  "Can transform the values of the Map2D into some other type through its 'map' method",
  () => {
    const m = Map2D.revive(
      [
        [123, 321, 333],
        [777, 888, 999],
      ],
      (id) => id
    );

    const newM = m.map(String);
    assert(newM.size === m.size);
    assert(newM.getXY(123, 321) === "333");
    assert(newM.getXY(777, 888) === "999");
  }
);

Deno.test("Iterates through the Map2D entries", () => {
  const a: [number, number, number][] = [
    [123, 321, 333],
    [777, 888, 999],
  ];
  const m = Map2D.revive(a, (id) => id);

  assertArrayIncludes(
    [...m.entries()],
    [
      [[123, 321], 333],
      [[777, 888], 999],
    ]
  );
  m.setXY(0, 0, 0);
  assertArrayIncludes(
    [...m.entries()][2],
    [[0, 0], 0],
    "Insertion order is preserved"
  );
});
Deno.test("Iterates through the Map2D values", () => {
  const a: [number, number, number][] = [
    [123, 321, 333],
    [777, 888, 999],
  ];
  const m = Map2D.revive(a, (id) => id);

  assertArrayIncludes([...m.values()], [333, 999]);
  m.setXY(0, 0, 0);
  assert([...m.values()][2] === 0, "Insertion order is preserved");
});

Deno.test("Iterates through the Map2D keys", () => {
  const a: [number, number, number][] = [
    [123, 321, 333],
    [777, 888, 999],
  ];
  const m = Map2D.revive(a, (id) => id);

  assertArrayIncludes(
    [...m.keys()],
    [
      [123, 321],
      [777, 888],
    ]
  );
  m.setXY(0, 0, 0);
  assertArrayIncludes([...m.keys()][2], [0, 0], "Insertion order is preserved");
});

Deno.test("Can set a new Map2D value with setXY", () => {
  const a: [number, number, number][] = [
    [123, 321, 333],
    [777, 888, 999],
  ];
  const m = Map2D.revive(a, (id) => id);
  m.setXY(0, 0, 0);

  assert(m.getXY(0, 0) === 0);
  assert(m.size === 3);
});

Deno.test("Can set a new Map2D value with set", () => {
  const a: [number, number, number][] = [
    [123, 321, 333],
    [777, 888, 999],
  ];
  const m = Map2D.revive(a, (id) => id);
  m.set({ x: 0, y: 0 }, 0);

  assert(m.getXY(0, 0) === 0);
  assert(m.size === 3);
});

Deno.test("Can delete a Map2D value with 'delete()'", () => {
  const a: [number, number, number][] = [
    [123, 321, 333],
    [777, 888, 999],
  ];
  const m = Map2D.revive(a, (id) => id);
  assert(m.getXY(123, 321) === 333);
  m.delete({ x: 123, y: 321 });

  assert(m.getXY(123, 321) === undefined);
  assert(m.size === 1);
});

Deno.test("Can delete a Map2D value with 'deleteXY()'", () => {
  const a: [number, number, number][] = [
    [123, 321, 333],
    [777, 888, 999],
  ];
  const m = Map2D.revive(a, (id) => id);

  assert(m.getXY(123, 321) === 333);
  m.deleteXY(123, 321);

  assert(m.getXY(123, 321) === undefined);
  assert(m.size === 1);
});

Deno.test("Can check if a Map2D key is present with 'hasXY()'", () => {
  const a: [number, number, number][] = [
    [123, 321, 333],
    [777, 888, 999],
  ];
  const m = Map2D.revive(a, (id) => id);

  assert(m.hasXY(123, 321));
  assert(!m.hasXY(0, 0));
});

Deno.test("Can check if a Map2D key is present with 'has()'", () => {
  const a: [number, number, number][] = [
    [123, 321, 333],
    [777, 888, 999],
  ];
  const m = Map2D.revive(a, (id) => id);

  assert(m.has({ x: 123, y: 321 }));
  assert(!m.has({ x: 0, y: 0 }));
});

Deno.test("Can get a Map2D value for a key with 'get()'", () => {
  const a: [number, number, number][] = [
    [123, 321, 333],
    [777, 888, 999],
  ];
  const m = Map2D.revive(a, (id) => id);

  assert(m.get({ x: 123, y: 321 }) === 333);
  assert(m.get({ x: 777, y: 888 }) === 999);
  assert(m.get({ x: 0, y: 0 }) === undefined);
});

Deno.test("Can get a Map2D value for a key with 'getXY()'", () => {
  const a: [number, number, number][] = [
    [123, 321, 333],
    [777, 888, 999],
  ];
  const m = Map2D.revive(a, (id) => id);

  assert(m.getXY(123, 321) === 333);
  assert(m.getXY(777, 888) === 999);
  assert(m.getXY(0, 0) === undefined);
});

Deno.test("Can check if Map2D is equal to another Map2D", () => {
  const a: [number, number, number][] = [
    [123, 321, 333],
    [777, 888, 999],
  ];
  const m1 = Map2D.revive(a, (id) => id);

  const m2 = new Map2D<number>();
  m2.setXY(123, 321, 333);
  m2.setXY(777, 888, 999);

  assert(m1.equals(m2));
  m2.setXY(0, 0, 0);
  assert(!m1.equals(m2));
  m2.deleteXY(0, 0);
  assert(m1.equals(m2));
});

Deno.test("Can create an empty Set2D", () => {
  const s = new Set2D();

  assert(s.size === 0);
});

Deno.test("Can create a Set2D from an array of {x,y} values", () => {
  const s = new Set2D([
    { x: 123, y: 321 },
    { x: 444, y: 555 },
  ]);

  assert(s.size === 2);
  assert(s.hasXY(123, 321), "Must have the (123, 321) value");
  assert(s.hasXY(444, 555), "Must have the (444, 555) value");
});

Deno.test(
  "Transforms the Set2D into a JSON friendly array with 'toJSON'",
  () => {
    const s = new Set2D([
      { x: 123, y: 321 },
      { x: 444, y: 555 },
    ]);

    const obj = s.toJSON();
    assertArrayIncludes(JSON.parse(JSON.stringify(obj)), [
      [123, 321],
      [444, 555],
    ]);
  }
);

Deno.test(
  "Can revive a Set2D from the JSON object produced by 'toJSON'",
  () => {
    const s = new Set2D([
      { x: 123, y: 321 },
      { x: 444, y: 555 },
    ]);
    const obj = s.toJSON();
    const newS = Set2D.revive(obj);

    assert(s.size === newS.size, "Set2D's must have the same size");
    assert(
      s.hasXY(123, 321) === newS.hasXY(123, 321),
      "Set2D's must have (123, 321)"
    );
    assert(
      s.hasXY(444, 555) === newS.hasXY(444, 555),
      "Set2D's must have (444, 555)"
    );
  }
);

Deno.test(
  "Checks if a (x,y) value is present in the Set2D with 'has()'",
  () => {
    const s = new Set2D([
      { x: 123, y: 321 },
      { x: 444, y: 555 },
    ]);

    assert(s.has({ x: 123, y: 321 }));
    assert(s.has({ x: 444, y: 555 }));
    assert(!s.has({ x: 0, y: 555 }));
  }
);

Deno.test(
  "Checks if a (x,y) value is present in the Set2D with 'hasXY()'",
  () => {
    const s = new Set2D([
      { x: 123, y: 321 },
      { x: 444, y: 555 },
    ]);

    assert(s.hasXY(123, 321));
    assert(s.hasXY(444, 555));
    assert(!s.hasXY(0, 555));
  }
);

Deno.test("Can add a value to the Set2D with 'add()'", () => {
  const s = new Set2D([
    { x: 123, y: 321 },
    { x: 444, y: 555 },
  ]);

  assert(!s.hasXY(1337, 7331));
  s.add({ x: 1337, y: 7331 });
  assert(s.hasXY(1337, 7331));
  assert(s.size === 3);
});

Deno.test("Can add a value to the Set2D with 'addXY()'", () => {
  const s = new Set2D([
    { x: 123, y: 321 },
    { x: 444, y: 555 },
  ]);

  assert(!s.hasXY(1337, 7331));
  s.addXY(1337, 7331);
  assert(s.hasXY(1337, 7331));
  assert(s.size === 3);
});

Deno.test("Can delete a value from the Set2D with 'delete()'", () => {
  const s = new Set2D([
    { x: 123, y: 321 },
    { x: 444, y: 555 },
  ]);

  assert(s.hasXY(123, 321));
  s.delete({ x: 123, y: 321 });
  assert(!s.hasXY(123, 321));
  assert(s.size === 1);
});

Deno.test("Creates a copy of the Set2D with 'dup()'", () => {
  const s = new Set2D([
    { x: 123, y: 321 },
    { x: 444, y: 555 },
  ]);

  const newS = s.dup();

  assert(s.size === newS.size, "Set2D's must have the same size");
  assert(
    s.hasXY(123, 321) === newS.hasXY(123, 321),
    "Set2D's must have (123, 321)"
  );
  assert(
    s.hasXY(444, 555) === newS.hasXY(444, 555),
    "Set2D's must have (444, 555)"
  );
  assert(!s.hasXY(0, 0) === !newS.hasXY(0, 0), "Set2D's must not have (0, 0)");
});

Deno.test("Appends a Set2D into another with 'append()'", () => {
  const s1 = new Set2D([
    { x: 123, y: 321 },
    { x: 444, y: 555 },
  ]);
  const s2 = new Set2D([{ x: 777, y: 888 }]);

  const appended1 = s1.append(s2);
  assert(appended1.size === 3);
  assert(appended1.hasXY(123, 321));
  assert(appended1.hasXY(444, 555));
  assert(appended1.hasXY(777, 888));

  s2.addXY(123, 111);
  const appended2 = s1.append(s2);
  assert(appended2.hasXY(123, 111));
});

Deno.test("Iterates through the values of the Set2D", () => {
  const s = new Set2D([
    { x: 123, y: 321 },
    { x: 444, y: 555 },
  ]);
  assertArrayIncludes(
    [...s.values()],
    [
      { x: 123, y: 321 },
      { x: 444, y: 555 },
    ]
  );
  const o = { x: 1337, y: 7331 };
  s.add(o);
  assertArrayIncludes(
    [...s.values()],
    [{ x: 123, y: 321 }, { x: 444, y: 555 }, o],
    "Insertion order is preserved"
  );
});

Deno.test("Iterates through the keys of the Set2D", () => {
  const s = new Set2D([
    { x: 123, y: 321 },
    { x: 444, y: 555 },
  ]);
  assertArrayIncludes(
    [...s.keys()],
    [
      [123, 321],
      [444, 555],
    ]
  );
  const o = [1337, 7331];
  s.addXY(o[0], o[1]);
  assertArrayIncludes(
    [...s.keys()],
    [[123, 321], [444, 555], o],
    "Insertion order is preserved"
  );
});

Deno.test("Iterates through the entries of the Set2D", () => {
  const s = new Set2D([
    { x: 123, y: 321 },
    { x: 444, y: 555 },
  ]);
  assertArrayIncludes(
    [...s.entries()],
    [
      [[123, 321], { x: 123, y: 321 }],
      [[444, 555], { x: 444, y: 555 }],
    ]
  );
  const o = [1337, 7331];
  s.addXY(o[0], o[1]);
  assertArrayIncludes(
    [...s.entries()],
    [
      [[123, 321], { x: 123, y: 321 }],
      [[444, 555], { x: 444, y: 555 }],
      [[1337, 7331], { x: 1337, y: 7331 }],
    ],

    "Insertion order is preserved"
  );
});

Deno.test("Transforms a Set2D into an array", () => {
  const s = new Set2D([
    { x: 123, y: 321 },
    { x: 444, y: 555 },
  ]);
  assert(s.toArray().length === s.size);
  assert(s.toArray()[0].x === 123);
  assert(s.toArray()[0].y === 321);
  assert(s.toArray()[1].x === 444);
  assert(s.toArray()[1].y === 555);

  const empty = new Set2D();
  assert(empty.toArray().length === 0);
});

Deno.test("Returns the first value inserted in a Set2D", () => {
  const s = new Set2D();

  s.addXY(123, 321);
  s.addXY(444, 555);
  assert(s.first().x === 123);
  assert(s.first().y === 321);
});

Deno.test("Can compare if two Set2D's are equal", () => {
  const s1 = new Set2D([
    { x: 123, y: 321 },
    { x: 444, y: 555 },
  ]);
  const s2 = new Set2D([
    { x: 123, y: 321 },
    { x: 444, y: 555 },
  ]);
  assert(s1.equals(s2), "S1 and S2 must be equal");
  s2.addXY(333, 333);
  assert(!s1.equals(s2), "S1 and S2 must not be equal");
  s2.delete({ x: 333, y: 333 });
  assert(s1.equals(s2), "S1 and S2 must be equal after deletion");
});

Deno.test("Can filter a Set2D's values with a filter function", () => {
  const s1 = new Set2D([
    { x: 123, y: 321 },
    { x: 444, y: 555 },
  ]);

  assert(
    s1.filter(() => true).equals(s1),
    "Filtering with always true must return an equal Set2D"
  );
  assert(
    s1.filter(() => false).equals(new Set2D()),
    "Filtering with always false must return an empty Set2D"
  );
  assert(
    s1
      .filter((value, x, y) => x === 123 && y === 321)
      .equals(new Set2D([{ x: 123, y: 321 }])),
    "Filtering function must receive the x,y keys"
  );
});

Deno.test(
  "Can transform the Set2D's values into a new Set2D with the 'map()' method",
  () => {
    const s1 = new Set2D([
      { x: 123, y: 321 },
      { x: 444, y: 555 },
    ]);

    assert(
      s1.map((id) => id).equals(s1),
      "Mapping an identity function must return an equal Set2D"
    );

    const newS = s1.map((v) => ({ x: v.x + 1, y: v.y + 1 }));
    assert(newS.hasXY(124, 322), "Must have (124, 322)");
    assert(newS.hasXY(445, 556), "Must have (445, 556)");
  }
);
