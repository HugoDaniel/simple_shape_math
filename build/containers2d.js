class Vector2D {
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
        return new Vector2D(v[0], v[1]);
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
        return new Vector2D(obj.x, obj.y);
    }
    static zero() {
        return new Vector2D();
    }
    static pow7() {
        return new Vector2D(127, 127);
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
            result.push(new Vector2D(xA, yA));
            result.push(new Vector2D(x1, yA));
            result.push(new Vector2D(xB, yA));
            result.push(new Vector2D(xA, y1));
            result.push(new Vector2D(xB, y1));
            result.push(new Vector2D(xA, yB));
            result.push(new Vector2D(x1, yB));
            result.push(new Vector2D(xB, yB));
            epsilon = epsilon - 1;
        }
        return result;
    }
    static abs(p) {
        return new Vector2D(Math.abs(p.x), Math.abs(p.y));
    }
    static createRounded(res, x, y) {
        const halfRes = res / 2;
        let result;
        if (x >= halfRes && y < halfRes) {
            result = new Vector2D(Math.floor(x), Math.ceil(y));
        } else if (x < halfRes && y < halfRes) {
            result = new Vector2D(Math.ceil(x), Math.ceil(y));
        } else if (x < halfRes && y >= halfRes) {
            result = new Vector2D(Math.ceil(x), Math.floor(y));
        } else {
            result = new Vector2D(Math.floor(x), Math.floor(y));
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
class Map2D1 {
    constructor(vectors, elements){
        this.tree = new Map();
        if (vectors && vectors.length > 0 && elements) {
            this._size = vectors.length;
            for(let i = 0; i < vectors.length; i++){
                const v = vectors[i];
                let vx, vy;
                if (v instanceof Array) {
                    vx = v[0];
                    vy = v[1];
                } else {
                    vx = v.x;
                    vy = v.y;
                }
                const ys = this.tree.get(vx) || new Map();
                ys.set(vy, elements[i]);
                this.tree.set(vx, ys);
            }
        } else {
            this._size = 0;
        }
    }
    toJSON(elemToJSON) {
        const result = [];
        this.map((elem, x2, y2)=>{
            if (x2 !== undefined && y2 !== undefined) {
                result.push([
                    x2,
                    y2,
                    elemToJSON(elem)
                ]);
            }
        });
        return result;
    }
    static revive(a, reviveElem) {
        const result = new Map2D1();
        a.map((v)=>result.setXY(v[0], v[1], reviveElem(v[2]))
        );
        return result;
    }
    clear() {
        this.tree.clear();
        this._size = 0;
    }
    get size() {
        return this._size;
    }
    firstValue() {
        if (this._size === 0) {
            throw new Error("No values in this container");
        }
        return this.tree.values().next().value.values().next().value;
    }
    firstKey() {
        if (this.size === 0) {
            throw new Error("Trying to get the firstKey() but there are no keys in this container");
        }
        const [x2, ys] = this.tree.entries().next().value;
        return new Vector2D(x2, ys.keys().next().value);
    }
    filter(f) {
        const result = new Map2D1();
        for (const [x2, yMap] of this.tree.entries()){
            for (const [y2, val] of yMap.entries()){
                if (f(val, x2, y2)) {
                    result.setXY(x2, y2, val);
                }
            }
        }
        return result;
    }
    map(f) {
        const result = new Map2D1();
        for (const [x2, yMap] of this.tree.entries()){
            for (const [y2, val] of yMap.entries()){
                result.setXY(x2, y2, f(val, x2, y2));
            }
        }
        return result;
    }
    *entries() {
        for (const [x2, yMap] of this.tree.entries()){
            for (const [y2, val] of yMap.entries()){
                yield [
                    [
                        x2,
                        y2
                    ],
                    val
                ];
            }
        }
    }
    *values() {
        for (const yMap of this.tree.values()){
            for (const value of yMap.values()){
                yield value;
            }
        }
    }
    *keys() {
        for (const [x2, yMap] of this.tree.entries()){
            for (const y2 of yMap.keys()){
                yield [
                    x2,
                    y2
                ];
            }
        }
    }
    setXY(x, y, value) {
        const ys = this.tree.get(x) || new Map();
        if (ys.size === 0 || !ys.has(y)) {
            this._size += 1;
        }
        ys.set(y, value);
        this.tree.set(x, ys);
        return this;
    }
    set(v, value) {
        return this.setXY(v.x, v.y, value);
    }
    deleteXY(x, y) {
        const ys = this.tree.get(x) || new Map();
        if (ys.size <= 1) {
            this.tree.delete(x);
        } else {
            ys.delete(y);
        }
        this._size -= 1;
        return this;
    }
    delete(v) {
        return this.deleteXY(v.x, v.y);
    }
    hasXY(x, y) {
        const map = this.tree.get(x);
        if (map) {
            return map.has(y);
        }
        return false;
    }
    has(v) {
        return this.hasXY(v.x, v.y);
    }
    get(v) {
        return this.getXY(v.x, v.y);
    }
    getXY(x, y) {
        return this.tree.get(x)?.get(y);
    }
    equals(set2) {
        if (this.size !== set2.size) {
            return false;
        }
        for (const [x2, yMap] of this.tree.entries()){
            for (const [y2, val] of yMap.entries()){
                const value = set2.getXY(x2, y2);
                if (!value || value !== val) {
                    return false;
                }
            }
        }
        return true;
    }
}
class Set2D1 {
    get size() {
        return this.tree.size;
    }
    constructor(vectors1){
        if (vectors1) {
            this.tree = new Map2D1(vectors1, vectors1);
            return;
        }
        this.tree = new Map2D1();
    }
    toJSON() {
        return [
            ...this.keys()
        ];
    }
    static revive(a) {
        const result = new Set2D1();
        a.map((v)=>result.addXY(v[0], v[1])
        );
        return result;
    }
    has(v) {
        return this.tree.has(v);
    }
    hasXY(x, y) {
        return this.tree.hasXY(x, y);
    }
    add(v) {
        this.tree.set(v, v);
        return this;
    }
    addXY(x, y) {
        this.tree.setXY(x, y, new Vector2D(x, y));
        return this;
    }
    delete(v) {
        this.tree.delete(v);
        return this;
    }
    dup() {
        const result = new Set2D1();
        return result.append(this);
    }
    append(set) {
        for (const [[x2, y2], v] of set.tree.entries()){
            this.tree.setXY(x2, y2, v);
        }
        return this;
    }
    *values() {
        for (const value of this.tree.values()){
            yield value;
        }
    }
    *keys() {
        for (const key of this.tree.keys()){
            yield key;
        }
    }
    *entries() {
        for (const entry of this.tree.entries()){
            yield entry;
        }
    }
    toArray() {
        return [
            ...this.tree.values()
        ];
    }
    first() {
        return this.tree.firstKey();
    }
    equals(set2) {
        if (this.tree.size !== set2.tree.size) {
            return false;
        }
        for (const v of this.tree.values()){
            if (!set2.has(v)) {
                return false;
            }
        }
        return true;
    }
    filter(f) {
        const result = new Set2D1();
        for (const [[x2, y2], v] of this.tree.entries()){
            if (f(v, x2, y2)) {
                result.add(v);
            }
        }
        return result;
    }
    map(f) {
        const result = new Set2D1();
        for (const [[x2, y2], v] of this.tree.entries()){
            result.add(f(v, x2, y2));
        }
        return result;
    }
}
export { Map2D1 as Map2D };
export { Set2D1 as Set2D };
