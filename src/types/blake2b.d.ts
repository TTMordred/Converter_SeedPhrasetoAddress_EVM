declare module 'blake2b' {
  function blake2b(length: number): {
    update(input: Buffer): void;
    digest(): Buffer;
  };
  export = blake2b;
}