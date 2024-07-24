declare module '*.lottie?url' {
  const value: string;
  export default value;
}

declare module '*.json?url' {
  const value: string;
  export default value;
}

declare module '*.wasm?url' {
  const value: string;
  export default value;
}

declare module '*?worker&inline' {
  class InlineWorker extends Worker {
    public constructor();
  }
  export default InlineWorker;
}
