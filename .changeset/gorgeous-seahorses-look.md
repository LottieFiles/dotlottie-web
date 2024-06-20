---
'@lottiefiles/dotlottie-web': minor
---

# feat(web): 🎸 dotLottie State Machines Integration #254

We are excited to introduce the dotLottie state machine support in dotlottie-web, bringing a new level of interactivity and control to your animations!

#### What's New

* **Upgraded `dotlottie-rs` to v0.1.23**: WASM bindings.

#### New Features

1. **State Machine Integration**🎸
   * DotLottie **`loadStateMachine` Method**: Load a state machine directly from a .lottie file.
   * DotLottie **`startStateMachine` Method**: Start the loaded state machine.
   * DotLottie **`stopStateMachine`. Method**: Cleanly end the started state machine.
   * DotLottie **`postStateMachineEvent` Method**: Send events to the state machine to drive animation behavior.

##### Available Events

```js
const dotLottie = new DotLottie(...);

const smLoaded = dotLottie.loadStateMachine("some_state_machine_id"); // Load a state machine from the .lottie file
const smStarted = dotLottie.startStateMachine();                // Start the loaded state machine

dotLottie.postStateMachineEvent("Bool: true");         // Post a boolean event
dotLottie.postStateMachineEvent("Bool: false");        // Post a boolean event
dotLottie.postStateMachineEvent("String: ...");        // Post a string event
dotLottie.postStateMachineEvent("Numeric: 0.0");       // Post a numeric event
dotLottie.postStateMachineEvent("OnPointerDown: 0.0 0.0"); // Post a pointer down event
dotLottie.postStateMachineEvent("OnPointerUp: 0.0 0.0");   // Post a pointer up event
dotLottie.postStateMachineEvent("OnPointerMove: 0.0 0.0"); // Post a pointer move event
dotLottie.postStateMachineEvent("OnPointerEnter: 0.0 0.0"); // Post a pointer enter event
dotLottie.postStateMachineEvent("OnPointerExit: 0.0 0.0");  // Post a pointer exit event
dotLottie.postStateMachineEvent("OnComplete");             // Post a complete event

 const smStopped = dotLottie.stopStateMachine(); // End the started state machine
```

> `DotLottie` will automatically set up and clean up the pointer events on the provided canvas and other animation playback events for you when you call `startStateMachine` and `stopStateMachine`.

More details can be found in the [LottieFiles developers postal](https://developers.lottiefiles.com/docs/dotlottie-player/)
