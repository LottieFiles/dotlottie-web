---
'@lottiefiles/dotlottie-web': minor
---

feat(web): 🎸 Added load state machine data & animation size & state machine context methods

* Integrated dotlottie-rs v0.1.24 WASM bindings.
* Added new methods to `DotLottie`:
  * `loadStateMachineData(stateMachineData: string): boolean`: Loads the state machine data as a json string.
  * `animationSize(): {width: number, height: number}`: Retrieves the original lottie animation size.
  * `setStateMachineBooleanContext(name: string, value: boolean): boolean`: Sets the state machine context with a boolean value.
  * `setStateMachineStringContext(name: string, value: string): boolean`: Sets the state machine context with a string value.
  * `setStateMachineNumericContext(name: string, value: number): boolean`: Sets the state machine context with a numeric value.
