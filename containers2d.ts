// Copyright 2021 Hugo Daniel Henriques Oliveira Gomes. All rights reserved.
// Licensed under the EUPL

import { Vector2D } from "./vector.ts";

/**
 * Represents a Map of 2D numbers keys to a value T.
 *
 * It maps objects with a compatible interface of `{ x: number, y: number }`,
 * (such as Vector2D), to a value T.
 *
 * Insertion order is preserved.
 */
export class Map2D<T> {
  /** A Map of Map's - Maps x numbers to a Map of y numbers and their values */
  private tree: Map<number, Map<number, T>>;
  /** The number of values in this Map */
  private _size: number;

  /**
   * Creates a new Map2D, it optionally can be filled with the keys set in
   * the "vectors" argument, provided there is an equivalent number of
   * elements for each key in the "elements" argument.
   *
   * If you need to create a Map2D from an array of [x, y, value] entries, then
   * use the static `Map2D.revive([x, y, value], (id) => id)` function instead.
   */
  constructor(
    vectors?: (Vector2D | { x: number; y: number } | [number, number])[],
    elements?: T[]
  ) {
    this.tree = new Map();
    if (vectors && vectors.length > 0 && elements) {
      this._size = vectors.length;
      for (let i = 0; i < vectors.length; i++) {
        const v = vectors[i];
        let vx, vy;
        if (v instanceof Array) {
          vx = v[0];
          vy = v[1];
        } else {
          vx = v.x;
          vy = v.y;
        }
        const ys: Map<number, T> = this.tree.get(vx) || new Map();
        ys.set(vy, elements[i]);
        this.tree.set(vx, ys);
      }
    } else {
      this._size = 0;
    }
  }

  /**
   * Transforms the Map2D into a JSON friendly object.
   *
   * This does not serialize into a string. The idea is that the object
   * returned by this function gets used in the `JSON.serialize()` method.
   *
   * A Map2D object is made to be a [x, y, value] array. This saves space in the
   * string representation.
   *
   * @param elemToJSON A function that transforms the value of this Map2D into a JSON friendly object.
   * @returns An array of [ [x, y, value], ... ], useful for `JSON.serialize()`
   */
  public toJSON<E>(elemToJSON: (e: T) => E) {
    const result: Map2DReviver<E> = [];
    this.map((elem, x, y) => {
      if (x !== undefined && y !== undefined) {
        result.push([x, y, elemToJSON(elem)]);
      }
    });
    return result;
  }

  /**
   * Transforms the JSON friendly object (as returned by `toJSON()`) into a
   * Map2D.
   *
   * This function is useful to transform the deserialized JSON object in a
   * Map2D, provided that it was serialized with the result of the `toJSON()`
   * function.
   *
   * @param a The JSON object as returned by the Map2D `.toJSON()` function.
   * @param reviveElem A function to transform an object into a value for the Map2D
   * @returns A Map2D object created from the object supplied in the "a" parameter.
   */
  public static revive<E, T>(
    a: Map2DReviver<E>,
    reviveElem: (e: E) => T
  ): Map2D<T> {
    const result = new Map2D<T>();
    a.map((v) => result.setXY(v[0], v[1], reviveElem(v[2])));
    return result;
  }

  /**
   * Clears this Map2D of all entries.
   *
   * Sets the size to 0.
   */
  public clear() {
    this.tree.clear();
    this._size = 0;
  }

  /**
   * The number of values in this Map2D.
   */
  get size(): number {
    return this._size;
  }

  /**
   * Returns the value of the first entry in this Map2D (insertion order is
   * preserved).
   *
   * @returns The first value inserted in this Map2D
   */
  public firstValue(): T {
    if (this._size === 0) {
      throw new Error("No values in this container");
    }
    return this.tree.values().next().value.values().next().value;
  }
  /**
   * Returns the (x,y) key of the first entry in this Map2D (insertion order is
   * preserved).
   *
   * @returns The first (x, y) key inserted in this Map2D
   */
  public firstKey(): Vector2D {
    if (this.size === 0) {
      throw new Error(
        "Trying to get the firstKey() but there are no keys in this container"
      );
    }
    const [x, ys] = this.tree.entries().next().value;
    return new Vector2D(x, ys.keys().next().value);
  }

  /**
   * Creates a new Map2D with a subset of the values from this Map2D.
   *
   * @param f The filter function
   * @returns A new Map2D with only the results that the "f" function set to true.
   */
  public filter(f: (elem: T, x?: number, y?: number) => boolean): Map2D<T> {
    const result: Map2D<T> = new Map2D();
    for (const [x, yMap] of this.tree.entries()) {
      for (const [y, val] of yMap.entries()) {
        if (f(val, x, y)) {
          result.setXY(x, y, val);
        }
      }
    }
    return result;
  }

  /**
   * Creates a new Map2D with new values made by traversing this Map2D values.
   *
   * @param f A function to transform the value of the original Map2D into another value.
   * @returns A new Map2D with the new values provided from the function "f"
   */
  public map<U>(f: (elem: T, x?: number, y?: number) => U): Map2D<U> {
    const result: Map2D<U> = new Map2D();
    for (const [x, yMap] of this.tree.entries()) {
      for (const [y, val] of yMap.entries()) {
        result.setXY(x, y, f(val, x, y));
      }
    }
    return result;
  }
  /**
   * Returns a new Iterator object that contains an array of
   * [[keyX, keyY], value] for each element in the Map2D object in insertion
   * order.
   */
  public *entries(): IterableIterator<[[number, number], T]> {
    for (const [x, yMap] of this.tree.entries()) {
      for (const [y, val] of yMap.entries()) {
        yield [[x, y], val];
      }
    }
  }
  /**
   * Returns a new Iterator object that contains the values for each element
   * in the Map2D object in insertion order.
   */
  public *values(): IterableIterator<T> {
    for (const yMap of this.tree.values()) {
      for (const value of yMap.values()) {
        yield value;
      }
    }
  }
  /**
   * Returns a new Iterator object that contains the [keyX, keyY] for each
   * element in the Map2D object in insertion order.
   */
  public *keys(): IterableIterator<[number, number]> {
    for (const [x, yMap] of this.tree.entries()) {
      for (const y of yMap.keys()) {
        yield [x, y];
      }
    }
  }
  /**
   * Sets the value for the (x, y) key in the Map2D object.
   * Returns the Map2D object.
   * @param x Map key x value
   * @param y Map key y value
   * @param value The value to set at this 2D (x, y) key
   * @returns The Map2D object
   */
  public setXY(x: number, y: number, value: T): Map2D<T> {
    const ys: Map<number, T> = this.tree.get(x) || new Map();
    if (ys.size === 0 || !ys.has(y)) {
      this._size += 1;
    }
    ys.set(y, value);
    this.tree.set(x, ys);
    return this;
  }
  /**
   * Sets the value for the Vector2D or { x, y } key in the Map2D object.
   * Returns the Map2D object.
   * @param v The object with the { x, y } properties to use as key.
   * @param value The value to set at this 2D key.
   * @returns The Map2D object
   */
  public set(v: Vector2D | { x: number; y: number }, value: T): Map2D<T> {
    return this.setXY(v.x, v.y, value);
  }
  /**
   * Deletes from the Map2D the key and value at this (x, y) coordinate.
   * Returns the Map2D object
   *
   * @param x The Map2D x key value
   * @param y The Map2D y key value
   * @returns The Map2D object
   */
  public deleteXY(x: number, y: number): Map2D<T> {
    const ys: Map<number, T> = this.tree.get(x) || new Map();
    if (ys.size <= 1) {
      this.tree.delete(x);
    } else {
      ys.delete(y);
    }
    this._size -= 1;
    return this;
  }
  /**
   * Removes the value and key for the Vector2D or { x, y } key in the Map2D
   * object.
   * Returns the Map2D object.
   * @param v The object with the `{ x, y }` properties for the key to remove.
   * @returns The Map2D object
   */
  public delete(v: Vector2D | { x: number; y: number }): Map2D<T> {
    return this.deleteXY(v.x, v.y);
  }

  /**
   * Checks if the (x,y) key is set with a value.
   *
   * @param x The key x number
   * @param y The key y number
   * @returns True if there is a value set, false if otherwise
   */
  public hasXY(x: number, y: number): boolean {
    const map = this.tree.get(x);
    if (map) {
      return map.has(y);
    }
    return false;
  }
  /**
   * Checks if the Vector2D or `{x, y}` key is set with a value.
   *
   * @param v The key object to check if it has a value.
   * @returns True if there is a value set, false if otherwise
   */
  public has(v: Vector2D | { x: number; y: number }): boolean {
    return this.hasXY(v.x, v.y);
  }
  /**
   * Retrieves the value set at this key object (Vector2D or object with
   * {x, y} properties).
   *
   * @param v The key to get the value
   * @returns The value set at this key object, or undefined if not found.
   */
  public get(v: Vector2D | { x: number; y: number }): T | undefined {
    return this.getXY(v.x, v.y);
  }
  /**
   * Retrieves the value set at this key x,y numbers.
   *
   * @param x The x key number
   * @param y The y key number
   * @returns The value set at this key, or undefined if not found.
   */
  public getXY(x: number, y: number): T | undefined {
    return this.tree.get(x)?.get(y);
  }
  /**
   * Compares for equality this Map2D keys and values with some other Map2D
   * keys and values.
   *
   * @param set2 The Map2D to compare with
   * @returns true if both Map2D's are equal, false if otherwise
   */
  public equals(set2: Map2D<T>) {
    if (this.size !== set2.size) {
      return false;
    }
    for (const [x, yMap] of this.tree.entries()) {
      for (const [y, val] of yMap.entries()) {
        const value = set2.getXY(x, y);
        if (!value || value !== val) {
          return false;
        }
      }
    }
    return true;
  }
}

/**
 * The JSON friendly object used as an intermediary representation when
 * serializing the Map2D to/from JSON.
 */
export type Map2DReviver<T> = [number, number, T][];

/**
 * This is a Set of 2D values. It holds objects that have "x" and "y" attributes
 * as numbers. This means that anything like `{ x: number, y: number}` is a
 * valid member of this Set, which includes Vector2D values.
 *
 * This container is useful to check for uniqueness and presence of (x,y)
 * coordinates.
 *
 * It is built on top of the Map2D and insertion order is preserved.
 */
export class Set2D {
  /** A Set2D is actually a Map2D where the value is the key itself */
  private tree: Map2D<Vector2D | { x: number; y: number }>;
  /** The number of entries in this Set */
  get size(): number {
    return this.tree.size;
  }

  /**
   * Creates a new Set2D, it optionally can be filled with the keys set in
   * the "vectors" argument.
   *
   * If you need to create a Set2D from an array of [x, y] entries, then
   * use the static `Set2D.revive([x, y])` function instead.
   */
  constructor(vectors?: (Vector2D | { x: number; y: number })[]) {
    if (vectors) {
      this.tree = new Map2D(vectors, vectors);
      return;
    }
    this.tree = new Map2D();
  }
  /**
   * Transforms the Set2D into a JSON friendly object.
   *
   * This does not serialize into a string. The idea is that the object
   * returned by this function gets used in the `JSON.serialize()` method.
   *
   * A Set2D object is made to be a [x, y] array. This saves space in the
   * string representation.
   *
   * @returns An array of [ [x, y], ... ], useful for `JSON.serialize()`
   */
  public toJSON(): [number, number][] {
    return [...this.keys()];
  }

  /**
   * Transforms the JSON friendly object (as returned by `toJSON()`) into a
   * Set2D.
   *
   * This function is useful to transform the deserialized JSON object in a
   * Set2D, provided that it was serialized with the result of the `toJSON()`
   * function.
   *
   * @param a The JSON object as returned by the Set2D `.toJSON()` function.
   * @returns A Set2D object created from the object supplied in the "a" parameter.
   */
  public static revive(a: [number, number][]): Set2D {
    const result = new Set2D();
    a.map((v) => result.addXY(v[0], v[1]));
    return result;
  }
  /**
   * Checks if the Vector2D or `{x, y}` key is in this Set2D.
   *
   * @param v The object to check if it is present.
   * @returns True if it found, false if otherwise
   */
  public has(v: Vector2D | { x: number; y: number }): boolean {
    return this.tree.has(v);
  }

  /**
   * Checks if the pair of (x,y) values is present in this Set2D.
   *
   * @param x The x number of the pair
   * @param y The y number of the pair
   * @returns True if it found, false if otherwise
   */
  public hasXY(x: number, y: number): boolean {
    return this.tree.hasXY(x, y);
  }

  /**
   * Places an object (that has a shape of {x, y}) in this Set2D.
   *
   * @param v The object ({x, y}) to add to this Set2D
   * @returns The Set2D object
   */
  public add(v: Vector2D | { x: number; y: number }): Set2D {
    this.tree.set(v, v);
    return this;
  }

  /**
   * Places a pair of (x,y) values coordinates in this Set2D.
   *
   * @param x The x number of the coordinate to add to this Set2D
   * @param y The y number of the coordinate to add to this Set2D
   * @returns The Set2D object
   */
  public addXY(x: number, y: number): Set2D {
    this.tree.setXY(x, y, new Vector2D(x, y));
    return this;
  }

  /**
   * Removes the x,y coordinates from this Set2D
   *
   * @param v The object that represents the coordinates to remove from the Set2D
   * @returns The Set2D object
   */
  public delete(v: Vector2D | { x: number; y: number }): Set2D {
    this.tree.delete(v);
    return this;
  }

  /**
   * Creates a copy of this Set2D
   *
   * @returns A new Set2D with all the elements from this Set2D.
   **/
  public dup(): Set2D {
    const result = new Set2D();
    return result.append(this);
  }
  /**
   * Inserts all elements from the "set" parameter into this Set2D.
   *
   * @param set The Set2D to copy elements from.
   * @returns This Set2D object.
   */
  public append(set: Set2D): Set2D {
    for (const [[x, y], v] of set.tree.entries()) {
      this.tree.setXY(x, y, v);
    }
    return this;
  }

  /**
   * Returns a new Iterator object that contains the values (objects with
   * { x, y }) for each element in the Set2D object in insertion order.
   */
  public *values() {
    for (const value of this.tree.values()) {
      yield value;
    }
  }
  /**
   * Returns a new Iterator object that contains the keys [x, y] for each element
   * in the Set2D object in insertion order.
   */
  public *keys() {
    for (const key of this.tree.keys()) {
      yield key;
    }
  }
  /**
   * Returns a new Iterator object that contains the keys [x, y] and values
   * (objects with {x, y}) for each element in the Set2D object in
   * insertion order.
   */
  public *entries() {
    for (const entry of this.tree.entries()) {
      yield entry;
    }
  }

  /**
   * Transforms this Set2D into an Array with all its objects (in insertion
   * order)
   * @returns An array with all the objects ({x, y}) of this Set2D, in insertion order.
   */
  public toArray(): (Vector2D | { x: number; y: number })[] {
    return [...this.tree.values()];
  }

  /**
   * The first value inserted in this Set2D
   *
   * @returns A Vector2D with the first value inserted in this Set2D
   */
  public first(): Vector2D | { x: number; y: number } {
    return this.tree.firstKey();
  }

  /**
   * Compares for equality this Set2D values with some other Set2D values.
   *
   * @param set2 The Set2D to compare with
   * @returns true if both Set2D's are equal, false if otherwise
   */
  public equals(set2: Set2D): boolean {
    if (this.tree.size !== set2.tree.size) {
      return false;
    }
    for (const v of this.tree.values()) {
      if (!set2.has(v)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Creates a new Set2D with a subset of the values from this Set2D.
   *
   * @param f The filter function
   * @returns A new Set2D with only the results that the "f" function set to true.
   */
  public filter(
    f: (
      v: Vector2D | { x: number; y: number },
      x?: number,
      y?: number
    ) => boolean
  ): Set2D {
    const result: Set2D = new Set2D();
    for (const [[x, y], v] of this.tree.entries()) {
      if (f(v, x, y)) {
        result.add(v);
      }
    }
    return result;
  }
  /**
   * Creates a new Set2D with new values made by traversing this Set2D values.
   *
   * @param f A function to transform the value of the original Set2D into another value.
   * @returns A new Set2D with the new values provided from the function "f"
   */
  public map(
    f: (
      v: Vector2D | { x: number; y: number },
      x?: number,
      y?: number
    ) => Vector2D | { x: number; y: number }
  ): Set2D {
    const result: Set2D = new Set2D();
    for (const [[x, y], v] of this.tree.entries()) {
      result.add(f(v, x, y));
    }
    return result;
  }
}
