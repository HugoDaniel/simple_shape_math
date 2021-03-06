class Vector2D1 {
    constructor(x1 = 0, y1 = 0){
        this.x = x1;
        this.y = y1;
    }
    toJSON() {
        return [
            this.x,
            this.y
        ];
    }
    static revive(v) {
        return new Vector2D1(v[0], v[1]);
    }
    get fst() {
        return this.x;
    }
    get snd() {
        return this.y;
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
    isEqual(v) {
        return this.x === v.x && this.y === v.y;
    }
    static isEqual(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y;
    }
    static fromObj(obj) {
        return new Vector2D1(obj.x, obj.y);
    }
    static zero() {
        return new Vector2D1();
    }
    static pow7() {
        return new Vector2D1(127, 127);
    }
    static isBetween(a, b, c) {
        const epsilon = 0.1;
        const crossProduct = (c.y - a.y) * (b.x - a.x) - (c.x - a.x) * (b.y - a.y);
        if (Math.abs(crossProduct) > 0.1) {
            return false;
        }
        const dotProduct = (c.x - a.x) * (b.x - a.x) + (c.y - a.y) * (b.y - a.y);
        if (dotProduct < 0) {
            return false;
        }
        const squaredLengthBA = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
        if (dotProduct > squaredLengthBA) {
            return false;
        }
        return true;
    }
    static getNearSet(pt, _epsilon = 1) {
        const result = [];
        let epsilon = Math.abs(Math.round(_epsilon));
        const x1 = pt.x;
        const y1 = pt.y;
        while(epsilon > 0){
            const xA = x1 - epsilon;
            const xB = x1 + epsilon;
            const yA = y1 - epsilon;
            const yB = y1 + epsilon;
            result.push(new Vector2D1(xA, yA));
            result.push(new Vector2D1(x1, yA));
            result.push(new Vector2D1(xB, yA));
            result.push(new Vector2D1(xA, y1));
            result.push(new Vector2D1(xB, y1));
            result.push(new Vector2D1(xA, yB));
            result.push(new Vector2D1(x1, yB));
            result.push(new Vector2D1(xB, yB));
            epsilon = epsilon - 1;
        }
        return result;
    }
    static abs(p) {
        return new Vector2D1(Math.abs(p.x), Math.abs(p.y));
    }
    static createRounded(res, x, y) {
        const halfRes = res / 2;
        let result;
        if (x >= halfRes && y < halfRes) {
            result = new Vector2D1(Math.floor(x), Math.ceil(y));
        } else if (x < halfRes && y < halfRes) {
            result = new Vector2D1(Math.ceil(x), Math.ceil(y));
        } else if (x < halfRes && y >= halfRes) {
            result = new Vector2D1(Math.ceil(x), Math.floor(y));
        } else {
            result = new Vector2D1(Math.floor(x), Math.floor(y));
        }
        return result;
    }
    static insideTriangle(x, y, p0, p1, p2) {
        const area = 0.5 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
        const s = 1 / (2 * area) * (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * x + (p0.x - p2.x) * y);
        const t = 1 / (2 * area) * (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * x + (p1.x - p0.x) * y);
        return s >= -0.1 && t >= -0.1 && 1 - s - t >= 0;
    }
}
export { Vector2D1 as Vector2D };
