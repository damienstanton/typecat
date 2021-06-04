/// Returns the same `T` as provided
export const id = <T>(t: T): T => t;

/// Type alias to assist with taking a given `A` => `C`
export type FnA<A, B> = (_: A) => B;
export type FnB<B, C> = (_: B) => C;
export type FnC<A, C> = (_: A) => C;

/// Composes a given set of generic functions, returning a composed function `G after F`
export const compose = <A, B, C>(f: FnA<A, B>, g: FnB<B, C>): FnC<A, C> => (x: any) => g(f(x));

/// Memoize a given function, caching repeated calls to its arguments
export class Memoize<In, Out> {
  cache: Map<In, Out>;
  f: (x: In) => Out;

  constructor(f: (x: In) => Out) {
    this.cache = new Map<In, Out>();
    this.f = f;
  }

  apply(x: In): Out | undefined {
    if (this.cache.has(x)) {
      return this.cache.get(x);
    } else {
      const val = this.f(x);
      this.cache.set(x, val);
      return val;
    }
  }
}

let test = () => {
  let range = (n: number): any[] => Array(n).fill(undefined);
  let tests = {
    "respects_identity": () => {
      const f = (a: string): number => parseInt(a);
      const g = (b: number): number => b * 2;

      let x = "42";
      let res = compose(f, g);
      console.assert(res(x) == 84);
      console.assert(id(res(x)) == 84);
    },
    "memoizes": () => {
      let x = (n: number) => String(n);
      let f = new Memoize(x);
      console.time("un-memoized");
      f.apply(1);
      f.apply(2);
      f.apply(3);
      console.timeEnd("un-memoized");
      
      console.time("memoized");
      for (let _ in range(3)) {
        f.apply(3);
      }
      console.timeEnd("memoized");
    }
  }

  tests.respects_identity();
  tests.memoizes();
  console.log("OK");
};
test();
