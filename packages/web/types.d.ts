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

declare var __PACKAGE_NAME__: string;
declare var __PACKAGE_VERSION__: string;
