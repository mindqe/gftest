type Flatten<T> = {
  [K in keyof T]: T[K] extends object ? ${K & string}.${keyof T[K]} : K;
}[keyof T];

type FlattenedKeys = Flatten<Nested>;