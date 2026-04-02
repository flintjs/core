import { performance } from "node:perf_hooks"

export class Stopwatch {

    digits?: number

    private _start: number
    private _end: number | null

    constructor(digits = 2) {
        this.digits = digits

        this._start = performance.now()
        this._end = null
    }

    get duration(): number {
        return this._end
            ? this._end - this._start
            : performance.now() - this._start
    }

    get running(): boolean {
        return Boolean(!this._end)
    }

    restart(): this {
        this._start = performance.now()
        this._end = null
        return this
    }

    reset(): this {
        this._start = performance.now()
        this._end = this._start
        return this
    }

    start(): this {
        if (!this.running) {
            this._start = performance.now() - this.duration
            this._end = null
        }
        return this
    }

    stop(): this {
        if (this.running) this._end = performance.now()
        return this
    }

    toString(): string {
        const time = this.duration
        if (time >= 1000) return `${(time / 1000).toFixed(this.digits)}s`
        if (time >= 1) return `${time.toFixed(this.digits)}ms`
        return `${(time * 1000).toFixed(this.digits)}μs`
    }

}
