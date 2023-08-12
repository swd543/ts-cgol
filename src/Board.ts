interface Dir {
    x: number
    y: number
    add(o: Dir): Dir
    sub(o: Dir): Dir
    mul(o: number | Dir): Dir
    div(o: number | Dir): Dir
    neg(): Dir
    copy(): Dir
}

class Coord implements Dir {
    x: number
    y: number

    constructor(x?: number, y?: number) {
        this.x = x ?? 0
        this.y = y ?? 0
    }

    copy(): Dir {
        return new Coord(this.x, this.y)
    }

    neg(): Dir {
        this.x = -this.x
        this.y = -this.y

        return this
    }

    add(o: Dir): Dir {
        this.x += o.x
        this.y += o.y

        return this
    }

    sub(o: Dir): Dir {
        this.x -= o.x
        this.y -= o.y

        return this
    }

    mul(o: number): Dir {
        this.x *= o
        this.y *= o

        return this
    }

    div(o: Dir): Dir {
        throw new Error("Method not implemented.")
    }

    static N(): Dir {
        return new Coord(1, 0)
    }

    static S(): Dir {
        return new Coord(-1, 0)
    }

    static E(): Dir {
        return new Coord(0, -1)
    }

    static W(): Dir {
        return new Coord(0, 1)
    }

    static NE(): Dir {
        return Coord.N().add(Coord.E())
    }

    static NW(): Dir {
        return Coord.N().add(Coord.W())
    }

    static SW(): Dir {
        return Coord.S().add(Coord.W())
    }

    static SE(): Dir {
        return Coord.S().add(Coord.E())
    }
}

abstract class Board<T> {
    x_size: number
    y_size: number

    constructor(x_size: number, y_size: number) {
        this.x_size = x_size
        this.y_size = y_size
    }

    abstract copy(): Board<T>
    abstract repr(): T[][]
    abstract inBounds(loc: Dir): boolean
    abstract get(loc: Dir): T | undefined
    abstract set(loc: Dir, val: T): void
    abstract step(): void
}

class GolNaive extends Board<boolean>{
    board: boolean[][]
    readonly neighbours: (() => Dir)[]
    readonly wrap

    constructor(x_size: number, y_size: number, initializer?: () => boolean, neighbours = [Coord.E, Coord.W, Coord.N, Coord.S], wrap = false) {
        super(x_size, y_size)
        this.board = []
        this.neighbours = neighbours
        this.wrap = wrap

        for (let i = 0; i < x_size; i++) {
            this.board.push(Array(y_size).fill(false))
        }

        if (initializer !== undefined) {
            for (let i = 0; i < this.board.length; i++) {
                for (let j = 0; j < this.board[0].length; j++) {
                    this.board[i][j] = initializer()
                }
            }
        }
    }

    static readonly aliver: Map<number, (s: boolean) => boolean> = new Map([
        [1, (s) => false],
        [2, (s) => s],
        [3, (s) => true]
    ])

    step(): void {
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[0].length; j++) {
                const c = new Coord(i, j)
                const curr = this.get(c)
                const neighbours = this.countNeighbours(c)

                if (GolNaive.aliver.has(neighbours)) {
                    this.set(c, GolNaive.aliver.get(neighbours)(curr))
                } else{
                    this.set(c, false)
                }
            }
        }
    }

    set(loc: Dir, val: boolean): void {
        this.board[loc.x][loc.y] = val
    }

    copy(): Board<boolean> {
        throw new Error("Method not implemented.")
    }

    repr(): boolean[][] {
        return this.board
    }

    inBounds(loc: Dir): boolean {
        return loc.x < this.x_size && loc.x >= 0 && loc.y < this.y_size && loc.y >= 0
    }

    get(loc: Dir): boolean {
        return this.wrap ?
            this.board[(loc.x + this.x_size) % this.x_size][(loc.y + this.y_size) % this.y_size] :
            this.inBounds(loc) ?? this.board[loc.x][loc.y]
    }

    countNeighbours(loc: Dir): number {
        return this.neighbours.reduce((a, c) => a + (this.get(loc.copy().add(c())) ? 1 : 0), 0)
    }
}

export { Board, Coord, GolNaive }