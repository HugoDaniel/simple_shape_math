// Copyright 2021 Hugo Daniel Henriques Oliveira Gomes. All rights reserved.
// Licensed under the EUPL

/**
 * Represents a 2D vector, made of x,y number values.
 *
 * The x and y properties are readonly and default to 0.
 *
 * Example usage:
 * ```
 * const vector = new Vector2D(123, 321);
 * console.log(vector.x); // prints the number 123;
 * ```
 */
export class Vector2D {
  /** The x number value for this vector */
  public readonly x: number;
  /** The y number value for this vector */
  public readonly y: number;
  /**
   * To construct a new Vector2D use: `new Vector2D();`.
   * @param x number
   * @param y number
   */
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Transforms the vector into a JSON friendly object.
   *
   * This does not serialize into a string. The idea is that the object
   * returned by this function gets used in the `JSON.serialize()` method.
   *
   * A Vector2D object is made to be a [x, y] array. This saves space in the
   * string representation.
   */
  public toJSON() {
    return [this.x, this.y];
  }
  /**
   * Transforms the JSON friendly object (as returned by `toJSON()`) into a
   * Vector2D.
   *
   * This function is useful to transform the deserialized JSON object in a
   * Vector2D, provided that it was serialized with the result of the `toJSON()`
   * function.
   *
   * @param v The JSON object as returned by the vector `.toJSON()` function.
   * @returns A Vector2D object from the JSON object.
   */
  public static revive(v: [number, number]): Vector2D {
    return new Vector2D(v[0], v[1]);
  }
  /**
   * Getter that returns the 'x' value of the Vector2D.
   * Useful when a Vector2D is being used as a tuple.
   */
  get fst(): number {
    return this.x;
  }
  /**
   * Getter that returns the 'y' value of the Vector2D.
   * Useful when a Vector2D is being used as a tuple.
   */
  get snd(): number {
    return this.y;
  }
  /**
   * Transforms this Vector2D in a string.
   *
   * @returns A string representation of the Vector2D like "(x, y)"
   */
  public toString(): string {
    return `(${this.x}, ${this.y})`;
  }
  /**
   * Compares this Vector2D to the Vector2D supplied in the argument.
   *
   * @param v The Vector2D to compare against this one.
   * @returns True if the vectors have equal values, false otherwise.
   */
  public isEqual(v: Vector2D): boolean {
    return this.x === v.x && this.y === v.y;
  }
  /**
   * Compares two vectors. This is a static function, useful to compare
   * two vectors without using an instance of one of them.
   *
   * @param v1 Vector to compare
   * @param v2 Vector to compare
   * @returns True if the vectors have equal values, false otherwise.
   */
  public static isEqual(v1: Vector2D, v2: Vector2D): boolean {
    return v1.x === v2.x && v1.y === v2.y;
  }
  /**
   * Transforms an object that has "x", and "y" attributes into a Vector2D.
   *
   * @param obj The object to turn into a Vector2D
   * @returns A Vector2D created from the object supplied as argument
   */
  public static fromObj(obj: { x: number; y: number }): Vector2D {
    return new Vector2D(obj.x, obj.y);
  }
  /**
   * Creates a new Vector2D with 0 values in x and y.
   *
   * @returns A Vector2D with 0 value in both x and y attributes.
   */
  public static zero(): Vector2D {
    return new Vector2D();
  }
  /**
   * Creates a new Vector2D with the 127 value in x and in y.
   *
   * @returns A Vector2D with the value 127 in both x and y attributes.
   */
  public static pow7(): Vector2D {
    return new Vector2D(127, 127);
  }

  /**
   * Checks if the Vector2D "c" is in line and between the two points defined
   * by the Vector2D's a and b.
   *
   * @param a Vector2D that represents a point in a line
   * @param b Vector2D that represents another point in the line
   * @param c The Vector2D that represents the point to check if it is in the line
   * @returns
   */
  public static isBetween(a: Vector2D, b: Vector2D, c: Vector2D): boolean {
    const epsilon = 0.1;
    const crossProduct = (c.y - a.y) * (b.x - a.x) - (c.x - a.x) * (b.y - a.y);
    if (Math.abs(crossProduct) > epsilon) {
      return false;
    }
    const dotProduct = (c.x - a.x) * (b.x - a.x) + (c.y - a.y) * (b.y - a.y);
    if (dotProduct < 0) {
      return false;
    }
    const squaredLengthBA =
      (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
    if (dotProduct > squaredLengthBA) {
      return false;
    }
    return true;
  }
  /**
   * Creates a square set of values that have the point "pt" in the center.
   * These values are set apart from the root by the "_epsilon" amount.
   *
   * @param pt The Vector2D to use as the root for the near set
   * @param _epsilon The interval amount to use in each set square.
   * @returns An array representing the square of 2D values around point "pt"
   */
  public static getNearSet(pt: Vector2D, _epsilon = 1): Vector2D[] {
    const result = [];
    let epsilon = Math.abs(Math.round(_epsilon));
    const x = pt.x;
    const y = pt.y;
    while (epsilon > 0) {
      const xA = x - epsilon;
      const xB = x + epsilon;
      const yA = y - epsilon;
      const yB = y + epsilon;
      result.push(new Vector2D(xA, yA));
      result.push(new Vector2D(x, yA));
      result.push(new Vector2D(xB, yA));
      result.push(new Vector2D(xA, y));
      result.push(new Vector2D(xB, y));
      result.push(new Vector2D(xA, yB));
      result.push(new Vector2D(x, yB));
      result.push(new Vector2D(xB, yB));
      epsilon = epsilon - 1;
    }
    return result;
  }
  /**
   * Creates a new Vector2D with positive values in both x, and y.
   *
   * @param p The original Vector2D to return with positive values.
   * @returns A new Vector2D with positive values.
   */
  public static abs(p: Vector2D): Vector2D {
    return new Vector2D(Math.abs(p.x), Math.abs(p.y));
  }

  /**
   * Creates a Vector2D rounded by a decimal resolution passed in the argument
   * "res".
   *
   * It adjusts the Vector2D to the nearest integer
   * (similar to Math.round for Vector2D).
   *
   * @param res The resolution to use when rounding the Vector2D
   * @param x The base x value for the new Vector2D
   * @param y The base y value for the new Vector2D
   * @returns A rounded Vector2D.
   */
  public static createRounded(res: number, x: number, y: number): Vector2D {
    const halfRes = res / 2;
    let result;
    if (x >= halfRes && y < halfRes) {
      // 1st quadrant
      result = new Vector2D(Math.floor(x), Math.ceil(y));
    } else if (x < halfRes && y < halfRes) {
      // 2nd quadrant
      result = new Vector2D(Math.ceil(x), Math.ceil(y));
    } else if (x < halfRes && y >= halfRes) {
      // 3rd quadrant
      result = new Vector2D(Math.ceil(x), Math.floor(y));
    } else {
      // 4th quadrant
      result = new Vector2D(Math.floor(x), Math.floor(y));
    }
    return result;
  }
  /**
   * Checks if the x,y position is inside the triangle defined by the three
   * Vector2D's.
   *
   * @param x The x coordinate value of the point to check if it is inside the triangle
   * @param y The y coordinate value of the point to check if it is inside the triangle
   * @param p0 Triangle point 1
   * @param p1 Triangle point 2
   * @param p2 Triangle point 3
   * @returns True if the point (x,y) is inside the triangle defined by the Vector2D's
   */
  public static insideTriangle(
    x: number,
    y: number,
    p0: Vector2D,
    p1: Vector2D,
    p2: Vector2D
  ): boolean {
    const area =
      0.5 *
      (-p1.y * p2.x +
        p0.y * (-p1.x + p2.x) +
        p0.x * (p1.y - p2.y) +
        p1.x * p2.y);
    const s =
      (1 / (2 * area)) *
      (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * x + (p0.x - p2.x) * y);
    const t =
      (1 / (2 * area)) *
      (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * x + (p1.x - p0.x) * y);
    return s >= -0.1 && t >= -0.1 && 1 - s - t >= 0;
  }
}
