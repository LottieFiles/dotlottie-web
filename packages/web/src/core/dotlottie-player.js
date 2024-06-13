const createDotLottiePlayerModule = (() => {
  const _scriptDir = typeof document != 'undefined' ? document.currentScript?.src : undefined;

  return function (moduleArg = {}) {
    const Module = moduleArg;

    let readyPromiseResolve;
    let readyPromiseReject;

    const readyPromise = new Promise((resolve, reject) => {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });

    let moduleOverrides = { ...Module };

    let arguments_ = [];

    let thisProgram = './this.program';

    let quit_ = (status, toThrow) => {
      throw toThrow;
    };

    const ENVIRONMENT_IS_WEB = true;

    const ENVIRONMENT_IS_WORKER = false;

    let scriptDirectory = '';

    function locateFile(path) {
      if (Module.locateFile) {
        return Module.locateFile(path, scriptDirectory);
      }

      return scriptDirectory + path;
    }

    let read_;
    let readAsync;
    let readBinary;

    if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
      } else if (typeof document != 'undefined' && document.currentScript) {
        scriptDirectory = document.currentScript.src;
      }
      if (_scriptDir) {
        scriptDirectory = _scriptDir;
      }
      if (scriptDirectory.startsWith('blob:')) {
        scriptDirectory = '';
      } else {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[#?].*/, '').lastIndexOf('/') + 1);
      }
      {
        read_ = (url) => {
          const xhr = new XMLHttpRequest();

          xhr.open('GET', url, false);
          xhr.send(null);

          return xhr.responseText;
        };
        if (ENVIRONMENT_IS_WORKER) {
          readBinary = (url) => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', url, false);
            xhr.responseType = 'arraybuffer';
            xhr.send(null);

            return new Uint8Array(/** @type{!ArrayBuffer} */ (xhr.response));
          };
        }
        readAsync = (url, onload, onerror) => {
          const xhr = new XMLHttpRequest();

          xhr.open('GET', url, true);
          xhr.responseType = 'arraybuffer';
          xhr.onload = () => {
            if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
              onload(xhr.response);

              return;
            }
            onerror();
          };
          xhr.onerror = onerror;
          xhr.send(null);
        };
      }
    } else {
    }

    const out = Module.print || console.log.bind(console);

    const err = Module.printErr || console.error.bind(console);

    Object.assign(Module, moduleOverrides);

    moduleOverrides = null;

    if (Module.arguments) arguments_ = Module.arguments;

    if (Module.thisProgram) thisProgram = Module.thisProgram;

    if (Module.quit) quit_ = Module.quit;

    let wasmBinary;

    if (Module.wasmBinary) wasmBinary = Module.wasmBinary;

    let wasmMemory;

    let ABORT = false;

    let EXITSTATUS;

    let /** @type {!Int8Array} */ HEAP8;
    /** @type {!Uint8Array} */ let HEAPU8;
    /** @type {!Int16Array} */ let HEAP16;
    /** @type {!Uint16Array} */ let HEAPU16;
    /** @type {!Int32Array} */ let HEAP32;
    /** @type {!Uint32Array} */ let HEAPU32;
    /** @type {!Float32Array} */ let HEAPF32;
    /** @type {!Float64Array} */ let HEAPF64;

    function updateMemoryViews() {
      const b = wasmMemory.buffer;

      Module.HEAP8 = HEAP8 = new Int8Array(b);
      Module.HEAP16 = HEAP16 = new Int16Array(b);
      Module.HEAPU8 = HEAPU8 = new Uint8Array(b);
      Module.HEAPU16 = HEAPU16 = new Uint16Array(b);
      Module.HEAP32 = HEAP32 = new Int32Array(b);
      Module.HEAPU32 = HEAPU32 = new Uint32Array(b);
      Module.HEAPF32 = HEAPF32 = new Float32Array(b);
      Module.HEAPF64 = HEAPF64 = new Float64Array(b);
    }

    const __ATPRERUN__ = [];

    const __ATINIT__ = [];

    const __ATPOSTRUN__ = [];

    let runtimeInitialized = false;

    function preRun() {
      if (Module.preRun) {
        if (typeof Module.preRun == 'function') Module.preRun = [Module.preRun];
        while (Module.preRun.length) {
          addOnPreRun(Module.preRun.shift());
        }
      }
      callRuntimeCallbacks(__ATPRERUN__);
    }

    function initRuntime() {
      runtimeInitialized = true;
      callRuntimeCallbacks(__ATINIT__);
    }

    function postRun() {
      if (Module.postRun) {
        if (typeof Module.postRun == 'function') Module.postRun = [Module.postRun];
        while (Module.postRun.length) {
          addOnPostRun(Module.postRun.shift());
        }
      }
      callRuntimeCallbacks(__ATPOSTRUN__);
    }

    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }

    function addOnInit(cb) {
      __ATINIT__.unshift(cb);
    }

    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }

    let runDependencies = 0;

    let runDependencyWatcher = null;

    let dependenciesFulfilled = null;

    function addRunDependency(id) {
      runDependencies++;
      Module.monitorRunDependencies?.(runDependencies);
    }

    function removeRunDependency(id) {
      runDependencies--;
      Module.monitorRunDependencies?.(runDependencies);
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
          const callback = dependenciesFulfilled;

          dependenciesFulfilled = null;
          callback();
        }
      }
    }

    /** @param {string|number=} what */ function abort(what) {
      Module.onAbort?.(what);
      what = `Aborted(${what})`;
      err(what);
      ABORT = true;
      EXITSTATUS = 1;
      what += '. Build with -sASSERTIONS for more info.';
      /** @suppress {checkTypes} */ const e = new WebAssembly.RuntimeError(what);

      readyPromiseReject(e);
      throw e;
    }

    const dataURIPrefix = 'data:application/octet-stream;base64,';

    /**
     * Indicates whether filename is a base64 data URI.
     * @noinline
     */ const isDataURI = (filename) => filename.startsWith(dataURIPrefix);

    let wasmBinaryFile;

    wasmBinaryFile = 'DotLottiePlayer.wasm';

    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = locateFile(wasmBinaryFile);
    }

    function getBinarySync(file) {
      if (file == wasmBinaryFile && wasmBinary) {
        return new Uint8Array(wasmBinary);
      }
      if (readBinary) {
        return readBinary(file);
      }
      throw 'both async and sync fetching of the wasm failed';
    }

    function getBinaryPromise(binaryFile) {
      if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
        if (typeof fetch == 'function') {
          return fetch(binaryFile, {
            credentials: 'same-origin',
          })
            .then((response) => {
              if (!response.ok) {
                throw `failed to load wasm binary file at '${binaryFile}'`;
              }

              return response.arrayBuffer();
            })
            .catch(() => getBinarySync(binaryFile));
        }
      }

      return Promise.resolve().then(() => getBinarySync(binaryFile));
    }

    function instantiateArrayBuffer(binaryFile, imports, receiver) {
      return getBinaryPromise(binaryFile)
        .then((binary) => WebAssembly.instantiate(binary, imports))
        .then(receiver, (reason) => {
          err(`failed to asynchronously prepare wasm: ${reason}`);
          abort(reason);
        });
    }

    function instantiateAsync(binary, binaryFile, imports, callback) {
      if (
        !binary &&
        typeof WebAssembly.instantiateStreaming == 'function' &&
        !isDataURI(binaryFile) &&
        typeof fetch == 'function'
      ) {
        return fetch(binaryFile, {
          credentials: 'same-origin',
        }).then((response) => {
          /** @suppress {checkTypes} */ const result = WebAssembly.instantiateStreaming(response, imports);

          return result.then(callback, function (reason) {
            err(`wasm streaming compile failed: ${reason}`);
            err('falling back to ArrayBuffer instantiation');

            return instantiateArrayBuffer(binaryFile, imports, callback);
          });
        });
      }

      return instantiateArrayBuffer(binaryFile, imports, callback);
    }

    function createWasm() {
      const info = {
        a: wasmImports,
      };

      /** @param {WebAssembly.Module=} module*/ function receiveInstance(instance, module) {
        wasmExports = instance.exports;
        wasmMemory = wasmExports.la;
        updateMemoryViews();
        wasmTable = wasmExports.pa;
        addOnInit(wasmExports.ma);
        removeRunDependency('wasm-instantiate');

        return wasmExports;
      }
      addRunDependency('wasm-instantiate');
      function receiveInstantiationResult(result) {
        receiveInstance(result.instance);
      }
      if (Module.instantiateWasm) {
        try {
          return Module.instantiateWasm(info, receiveInstance);
        } catch (e) {
          err(`Module.instantiateWasm callback failed with error: ${e}`);
          readyPromiseReject(e);
        }
      }
      instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);

      return {};
    }

    var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        callbacks.shift()(Module);
      }
    };

    const noExitRuntime = Module.noExitRuntime || true;

    const stackRestore = (val) => __emscripten_stack_restore(val);

    const stackSave = () => _emscripten_stack_get_current();

    const UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined;

    /**
     * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
     * array that contains uint8 values, returns a copy of that string as a
     * Javascript String object.
     * heapOrArray is either a regular array, or a JavaScript typed array view.
     * @param {number} idx
     * @param {number=} maxBytesToRead
     * @return {string}
     */ const UTF8ArrayToString = (heapOrArray, idx, maxBytesToRead) => {
      const endIdx = idx + maxBytesToRead;
      let endPtr = idx;

      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      let str = '';

      while (idx < endPtr) {
        let u0 = heapOrArray[idx++];

        if (!(u0 & 128)) {
          str += String.fromCharCode(u0);
          continue;
        }
        const u1 = heapOrArray[idx++] & 63;

        if ((u0 & 224) == 192) {
          str += String.fromCharCode(((u0 & 31) << 6) | u1);
          continue;
        }
        const u2 = heapOrArray[idx++] & 63;

        if ((u0 & 240) == 224) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
        if (u0 < 65536) {
          str += String.fromCharCode(u0);
        } else {
          const ch = u0 - 65536;

          str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
        }
      }

      return str;
    };

    /**
     * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
     * emscripten HEAP, returns a copy of that string as a Javascript String object.
     *
     * @param {number} ptr
     * @param {number=} maxBytesToRead - An optional length that specifies the
     *   maximum number of bytes to read. You can omit this parameter to scan the
     *   string until the first 0 byte. If maxBytesToRead is passed, and the string
     *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
     *   string will cut short at that byte index (i.e. maxBytesToRead will not
     *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
     *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
     *   JS JIT optimizations off, so it is worth to consider consistently using one
     * @return {string}
     */ const UTF8ToString = (ptr, maxBytesToRead) => (ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '');

    const ___assert_fail = (condition, filename, line, func) => {
      abort(
        `Assertion failed: ${UTF8ToString(condition)}, at: ${[
          filename ? UTF8ToString(filename) : 'unknown filename',
          line,
          func ? UTF8ToString(func) : 'unknown function',
        ]}`,
      );
    };

    let exceptionLast = 0;

    class ExceptionInfo {
      constructor(excPtr) {
        this.excPtr = excPtr;
        this.ptr = excPtr - 24;
      }

      get_adjusted_ptr() {
        return HEAPU32[(this.ptr + 16) >> 2];
      }

      get_caught() {
        return HEAP8[this.ptr + 12] != 0;
      }

      get_destructor() {
        return HEAPU32[(this.ptr + 8) >> 2];
      }

      get_exception_ptr() {
        const isPointer = ___cxa_is_pointer_type(this.get_type());

        if (isPointer) {
          return HEAPU32[this.excPtr >> 2];
        }
        const adjusted = this.get_adjusted_ptr();

        if (adjusted !== 0) return adjusted;

        return this.excPtr;
      }

      get_rethrown() {
        return HEAP8[this.ptr + 13] != 0;
      }

      get_type() {
        return HEAPU32[(this.ptr + 4) >> 2];
      }

      set_adjusted_ptr(adjustedPtr) {
        HEAPU32[(this.ptr + 16) >> 2] = adjustedPtr;
      }

      set_caught(caught) {
        caught = caught ? 1 : 0;
        HEAP8[this.ptr + 12] = caught;
      }

      set_destructor(destructor) {
        HEAPU32[(this.ptr + 8) >> 2] = destructor;
      }

      set_rethrown(rethrown) {
        rethrown = rethrown ? 1 : 0;
        HEAP8[this.ptr + 13] = rethrown;
      }

      set_type(type) {
        HEAPU32[(this.ptr + 4) >> 2] = type;
      }

      init(type, destructor) {
        this.set_adjusted_ptr(0);
        this.set_type(type);
        this.set_destructor(destructor);
      }
    }

    const ___resumeException = (ptr) => {
      if (!exceptionLast) {
        exceptionLast = ptr;
      }
      throw exceptionLast;
    };

    const setTempRet0 = (val) => __emscripten_tempret_set(val);

    const findMatchingCatch = (args) => {
      const thrown = exceptionLast;

      if (!thrown) {
        setTempRet0(0);

        return 0;
      }
      const info = new ExceptionInfo(thrown);

      info.set_adjusted_ptr(thrown);
      const thrownType = info.get_type();

      if (!thrownType) {
        setTempRet0(0);

        return thrown;
      }
      for (const arg in args) {
        const caughtType = args[arg];

        if (caughtType === 0 || caughtType === thrownType) {
          break;
        }
        const adjusted_ptr_addr = info.ptr + 16;

        if (___cxa_can_catch(caughtType, thrownType, adjusted_ptr_addr)) {
          setTempRet0(caughtType);

          return thrown;
        }
      }
      setTempRet0(thrownType);

      return thrown;
    };

    const ___cxa_find_matching_catch_2 = () => findMatchingCatch([]);

    let uncaughtExceptionCount = 0;

    const ___cxa_throw = (ptr, type, destructor) => {
      const info = new ExceptionInfo(ptr);

      info.init(type, destructor);
      exceptionLast = ptr;
      uncaughtExceptionCount++;
      throw exceptionLast;
    };

    const SYSCALLS = {
      varargs: undefined,
      getStr(ptr) {
        const ret = UTF8ToString(ptr);

        return ret;
      },
    };

    function ___syscall_fcntl64(fd, cmd, varargs) {
      SYSCALLS.varargs = varargs;

      return 0;
    }

    const ___syscall_fstat64 = (fd, buf) => {};

    const lengthBytesUTF8 = (str) => {
      let len = 0;

      for (let i = 0; i < str.length; ++i) {
        const c = str.charCodeAt(i);

        if (c <= 127) {
          len++;
        } else if (c <= 2047) {
          len += 2;
        } else if (c >= 55296 && c <= 57343) {
          len += 4;
          ++i;
        } else {
          len += 3;
        }
      }

      return len;
    };

    const stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      if (!(maxBytesToWrite > 0)) return 0;
      const startIdx = outIdx;
      const endIdx = outIdx + maxBytesToWrite - 1;

      for (let i = 0; i < str.length; ++i) {
        let u = str.charCodeAt(i);

        if (u >= 55296 && u <= 57343) {
          const u1 = str.charCodeAt(++i);

          u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
        }
        if (u <= 127) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 192 | (u >> 6);
          heap[outIdx++] = 128 | (u & 63);
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 224 | (u >> 12);
          heap[outIdx++] = 128 | ((u >> 6) & 63);
          heap[outIdx++] = 128 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          heap[outIdx++] = 240 | (u >> 18);
          heap[outIdx++] = 128 | ((u >> 12) & 63);
          heap[outIdx++] = 128 | ((u >> 6) & 63);
          heap[outIdx++] = 128 | (u & 63);
        }
      }
      heap[outIdx] = 0;

      return outIdx - startIdx;
    };

    const stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);

    const ___syscall_getcwd = (buf, size) => {};

    function ___syscall_ioctl(fd, op, varargs) {
      SYSCALLS.varargs = varargs;

      return 0;
    }

    const ___syscall_newfstatat = (dirfd, path, buf, flags) => {};

    function ___syscall_openat(dirfd, path, flags, varargs) {
      SYSCALLS.varargs = varargs;
    }

    const ___syscall_stat64 = (path, buf) => {};

    const structRegistrations = {};

    const runDestructors = (destructors) => {
      while (destructors.length) {
        const ptr = destructors.pop();
        const del = destructors.pop();

        del(ptr);
      }
    };

    /** @suppress {globalThis} */ function readPointer(pointer) {
      return this.fromWireType(HEAPU32[pointer >> 2]);
    }

    const awaitingDependencies = {};

    const registeredTypes = {};

    const typeDependencies = {};

    let InternalError;

    const throwInternalError = (message) => {
      throw new InternalError(message);
    };

    const whenDependentTypesAreResolved = (myTypes, dependentTypes, getTypeConverters) => {
      myTypes.forEach(function (type) {
        typeDependencies[type] = dependentTypes;
      });
      function onComplete(typeConverters) {
        const myTypeConverters = getTypeConverters(typeConverters);

        if (myTypeConverters.length !== myTypes.length) {
          throwInternalError('Mismatched type converter count');
        }
        for (let i = 0; i < myTypes.length; ++i) {
          registerType(myTypes[i], myTypeConverters[i]);
        }
      }
      const typeConverters = new Array(dependentTypes.length);
      const unregisteredTypes = [];
      let registered = 0;

      dependentTypes.forEach((dt, i) => {
        if (registeredTypes.hasOwnProperty(dt)) {
          typeConverters[i] = registeredTypes[dt];
        } else {
          unregisteredTypes.push(dt);
          if (!awaitingDependencies.hasOwnProperty(dt)) {
            awaitingDependencies[dt] = [];
          }
          awaitingDependencies[dt].push(() => {
            typeConverters[i] = registeredTypes[dt];
            ++registered;
            if (registered === unregisteredTypes.length) {
              onComplete(typeConverters);
            }
          });
        }
      });
      if (unregisteredTypes.length === 0) {
        onComplete(typeConverters);
      }
    };

    const __embind_finalize_value_object = (structType) => {
      const reg = structRegistrations[structType];

      delete structRegistrations[structType];
      const rawConstructor = reg.rawConstructor;
      const rawDestructor = reg.rawDestructor;
      const fieldRecords = reg.fields;
      const fieldTypes = fieldRecords
        .map((field) => field.getterReturnType)
        .concat(fieldRecords.map((field) => field.setterArgumentType));

      whenDependentTypesAreResolved([structType], fieldTypes, (fieldTypes) => {
        const fields = {};

        fieldRecords.forEach((field, i) => {
          const fieldName = field.fieldName;
          const getterReturnType = fieldTypes[i];
          const getter = field.getter;
          const getterContext = field.getterContext;
          const setterArgumentType = fieldTypes[i + fieldRecords.length];
          const setter = field.setter;
          const setterContext = field.setterContext;

          fields[fieldName] = {
            read: (ptr) => getterReturnType.fromWireType(getter(getterContext, ptr)),
            write: (ptr, o) => {
              const destructors = [];

              setter(setterContext, ptr, setterArgumentType.toWireType(destructors, o));
              runDestructors(destructors);
            },
          };
        });

        return [
          {
            name: reg.name,
            fromWireType: (ptr) => {
              const rv = {};

              for (const i in fields) {
                rv[i] = fields[i].read(ptr);
              }
              rawDestructor(ptr);

              return rv;
            },
            toWireType: (destructors, o) => {
              for (var fieldName in fields) {
                if (!(fieldName in o)) {
                  throw new TypeError(`Missing field: "${fieldName}"`);
                }
              }
              const ptr = rawConstructor();

              for (fieldName in fields) {
                fields[fieldName].write(ptr, o[fieldName]);
              }
              if (destructors !== null) {
                destructors.push(rawDestructor, ptr);
              }

              return ptr;
            },
            argPackAdvance: GenericWireTypeSize,
            readValueFromPointer: readPointer,
            destructorFunction: rawDestructor,
          },
        ];
      });
    };

    const __embind_register_bigint = (primitiveType, name, size, minRange, maxRange) => {};

    const embind_init_charCodes = () => {
      const codes = new Array(256);

      for (let i = 0; i < 256; ++i) {
        codes[i] = String.fromCharCode(i);
      }
      embind_charCodes = codes;
    };

    let embind_charCodes;

    const readLatin1String = (ptr) => {
      let ret = '';
      let c = ptr;

      while (HEAPU8[c]) {
        ret += embind_charCodes[HEAPU8[c++]];
      }

      return ret;
    };

    let BindingError;

    const throwBindingError = (message) => {
      throw new BindingError(message);
    };

    /** @param {Object=} options */ function sharedRegisterType(rawType, registeredInstance, options = {}) {
      const name = registeredInstance.name;

      if (!rawType) {
        throwBindingError(`type "${name}" must have a positive integer typeid pointer`);
      }
      if (registeredTypes.hasOwnProperty(rawType)) {
        if (options.ignoreDuplicateRegistrations) {
          return;
        } else {
          throwBindingError(`Cannot register type '${name}' twice`);
        }
      }
      registeredTypes[rawType] = registeredInstance;
      delete typeDependencies[rawType];
      if (awaitingDependencies.hasOwnProperty(rawType)) {
        const callbacks = awaitingDependencies[rawType];

        delete awaitingDependencies[rawType];
        callbacks.forEach((cb) => cb());
      }
    }

    /** @param {Object=} options */ function registerType(rawType, registeredInstance, options = {}) {
      if (!('argPackAdvance' in registeredInstance)) {
        throw new TypeError('registerType registeredInstance requires argPackAdvance');
      }

      return sharedRegisterType(rawType, registeredInstance, options);
    }

    var GenericWireTypeSize = 8;

    /** @suppress {globalThis} */ const __embind_register_bool = (rawType, name, trueValue, falseValue) => {
      name = readLatin1String(name);
      registerType(rawType, {
        name,
        fromWireType(wt) {
          return Boolean(wt);
        },
        toWireType(destructors, o) {
          return o ? trueValue : falseValue;
        },
        argPackAdvance: GenericWireTypeSize,
        readValueFromPointer(pointer) {
          return this.fromWireType(HEAPU8[pointer]);
        },
        destructorFunction: null,
      });
    };

    const shallowCopyInternalPointer = (o) => ({
      count: o.count,
      deleteScheduled: o.deleteScheduled,
      preservePointerOnDelete: o.preservePointerOnDelete,
      ptr: o.ptr,
      ptrType: o.ptrType,
      smartPtr: o.smartPtr,
      smartPtrType: o.smartPtrType,
    });

    const throwInstanceAlreadyDeleted = (obj) => {
      function getInstanceTypeName(handle) {
        return handle.$$.ptrType.registeredClass.name;
      }
      throwBindingError(`${getInstanceTypeName(obj)} instance already deleted`);
    };

    let finalizationRegistry = false;

    let detachFinalizer = (handle) => {};

    const runDestructor = ($$) => {
      if ($$.smartPtr) {
        $$.smartPtrType.rawDestructor($$.smartPtr);
      } else {
        $$.ptrType.registeredClass.rawDestructor($$.ptr);
      }
    };

    const releaseClassHandle = ($$) => {
      $$.count.value -= 1;
      const toDelete = $$.count.value === 0;

      if (toDelete) {
        runDestructor($$);
      }
    };

    var downcastPointer = (ptr, ptrClass, desiredClass) => {
      if (ptrClass === desiredClass) {
        return ptr;
      }
      if (undefined === desiredClass.baseClass) {
        return null;
      }
      const rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);

      if (rv === null) {
        return null;
      }

      return desiredClass.downcast(rv);
    };

    const registeredPointers = {};

    const getInheritedInstanceCount = () => Object.keys(registeredInstances).length;

    const getLiveInheritedInstances = () => {
      const rv = [];

      for (const k in registeredInstances) {
        if (registeredInstances.hasOwnProperty(k)) {
          rv.push(registeredInstances[k]);
        }
      }

      return rv;
    };

    const deletionQueue = [];

    const flushPendingDeletes = () => {
      while (deletionQueue.length) {
        const obj = deletionQueue.pop();

        obj.$$.deleteScheduled = false;
        obj.delete();
      }
    };

    let delayFunction;

    const setDelayFunction = (fn) => {
      delayFunction = fn;
      if (deletionQueue.length && delayFunction) {
        delayFunction(flushPendingDeletes);
      }
    };

    const init_embind = () => {
      Module.getInheritedInstanceCount = getInheritedInstanceCount;
      Module.getLiveInheritedInstances = getLiveInheritedInstances;
      Module.flushPendingDeletes = flushPendingDeletes;
      Module.setDelayFunction = setDelayFunction;
    };

    var registeredInstances = {};

    const getBasestPointer = (class_, ptr) => {
      if (ptr === undefined) {
        throwBindingError('ptr should not be undefined');
      }
      while (class_.baseClass) {
        ptr = class_.upcast(ptr);
        class_ = class_.baseClass;
      }

      return ptr;
    };

    const getInheritedInstance = (class_, ptr) => {
      ptr = getBasestPointer(class_, ptr);

      return registeredInstances[ptr];
    };

    const makeClassHandle = (prototype, record) => {
      if (!record.ptrType || !record.ptr) {
        throwInternalError('makeClassHandle requires ptr and ptrType');
      }
      const hasSmartPtrType = Boolean(record.smartPtrType);
      const hasSmartPtr = Boolean(record.smartPtr);

      if (hasSmartPtrType !== hasSmartPtr) {
        throwInternalError('Both smartPtrType and smartPtr must be specified');
      }
      record.count = {
        value: 1,
      };

      return attachFinalizer(
        Object.create(prototype, {
          $$: {
            value: record,
            writable: true,
          },
        }),
      );
    };

    /** @suppress {globalThis} */ function RegisteredPointer_fromWireType(ptr) {
      const rawPointer = this.getPointee(ptr);

      if (!rawPointer) {
        this.destructor(ptr);

        return null;
      }
      const registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);

      if (undefined !== registeredInstance) {
        if (registeredInstance.$$.count.value === 0) {
          registeredInstance.$$.ptr = rawPointer;
          registeredInstance.$$.smartPtr = ptr;

          return registeredInstance.clone();
        } else {
          const rv = registeredInstance.clone();

          this.destructor(ptr);

          return rv;
        }
      }
      function makeDefaultHandle() {
        if (this.isSmartPointer) {
          return makeClassHandle(this.registeredClass.instancePrototype, {
            ptrType: this.pointeeType,
            ptr: rawPointer,
            smartPtrType: this,
            smartPtr: ptr,
          });
        } else {
          return makeClassHandle(this.registeredClass.instancePrototype, {
            ptrType: this,
            ptr,
          });
        }
      }
      const actualType = this.registeredClass.getActualType(rawPointer);
      const registeredPointerRecord = registeredPointers[actualType];

      if (!registeredPointerRecord) {
        return makeDefaultHandle.call(this);
      }
      let toType;

      if (this.isConst) {
        toType = registeredPointerRecord.constPointerType;
      } else {
        toType = registeredPointerRecord.pointerType;
      }
      const dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);

      if (dp === null) {
        return makeDefaultHandle.call(this);
      }
      if (this.isSmartPointer) {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
          ptrType: toType,
          ptr: dp,
          smartPtrType: this,
          smartPtr: ptr,
        });
      } else {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
          ptrType: toType,
          ptr: dp,
        });
      }
    }

    var attachFinalizer = (handle) => {
      if (typeof FinalizationRegistry === 'undefined') {
        attachFinalizer = (handle) => handle;

        return handle;
      }
      finalizationRegistry = new FinalizationRegistry((info) => {
        releaseClassHandle(info.$$);
      });
      attachFinalizer = (handle) => {
        const $$ = handle.$$;
        const hasSmartPtr = Boolean($$.smartPtr);

        if (hasSmartPtr) {
          const info = {
            $$,
          };

          finalizationRegistry.register(handle, info, handle);
        }

        return handle;
      };
      detachFinalizer = (handle) => finalizationRegistry.unregister(handle);

      return attachFinalizer(handle);
    };

    const init_ClassHandle = () => {
      Object.assign(ClassHandle.prototype, {
        isAliasOf(other) {
          if (!(this instanceof ClassHandle)) {
            return false;
          }
          if (!(other instanceof ClassHandle)) {
            return false;
          }
          let leftClass = this.$$.ptrType.registeredClass;
          let left = this.$$.ptr;

          other.$$ = /** @type {Object} */ (other.$$);
          let rightClass = other.$$.ptrType.registeredClass;
          let right = other.$$.ptr;

          while (leftClass.baseClass) {
            left = leftClass.upcast(left);
            leftClass = leftClass.baseClass;
          }
          while (rightClass.baseClass) {
            right = rightClass.upcast(right);
            rightClass = rightClass.baseClass;
          }

          return leftClass === rightClass && left === right;
        },
        clone() {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this);
          }
          if (this.$$.preservePointerOnDelete) {
            this.$$.count.value += 1;

            return this;
          } else {
            const clone = attachFinalizer(
              Object.create(Object.getPrototypeOf(this), {
                $$: {
                  value: shallowCopyInternalPointer(this.$$),
                },
              }),
            );

            clone.$$.count.value += 1;
            clone.$$.deleteScheduled = false;

            return clone;
          }
        },
        delete() {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this);
          }
          if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
            throwBindingError('Object already scheduled for deletion');
          }
          detachFinalizer(this);
          releaseClassHandle(this.$$);
          if (!this.$$.preservePointerOnDelete) {
            this.$$.smartPtr = undefined;
            this.$$.ptr = undefined;
          }
        },
        isDeleted() {
          return !this.$$.ptr;
        },
        deleteLater() {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this);
          }
          if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
            throwBindingError('Object already scheduled for deletion');
          }
          deletionQueue.push(this);
          if (deletionQueue.length === 1 && delayFunction) {
            delayFunction(flushPendingDeletes);
          }
          this.$$.deleteScheduled = true;

          return this;
        },
      });
    };

    /** @constructor */ function ClassHandle() {}

    const createNamedFunction = (name, body) =>
      Object.defineProperty(body, 'name', {
        value: name,
      });

    const ensureOverloadTable = (proto, methodName, humanName) => {
      if (undefined === proto[methodName].overloadTable) {
        const prevFunc = proto[methodName];

        proto[methodName] = function (...args) {
          if (!proto[methodName].overloadTable.hasOwnProperty(args.length)) {
            throwBindingError(
              `Function '${humanName}' called with an invalid number of arguments (${args.length}) - expects one of (${proto[methodName].overloadTable})!`,
            );
          }

          return proto[methodName].overloadTable[args.length].apply(this, args);
        };
        proto[methodName].overloadTable = [];
        proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
      }
    };

    /** @param {number=} numArguments */ const exposePublicSymbol = (name, value, numArguments) => {
      if (Module.hasOwnProperty(name)) {
        if (
          undefined === numArguments ||
          (undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments])
        ) {
          throwBindingError(`Cannot register public name '${name}' twice`);
        }
        ensureOverloadTable(Module, name, name);
        if (Module.hasOwnProperty(numArguments)) {
          throwBindingError(
            `Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`,
          );
        }
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        if (undefined !== numArguments) {
          Module[name].numArguments = numArguments;
        }
      }
    };

    const char_0 = 48;

    const char_9 = 57;

    const makeLegalFunctionName = (name) => {
      if (undefined === name) {
        return '_unknown';
      }
      name = name.replace(/\W/g, '$');
      const f = name.charCodeAt(0);

      if (f >= char_0 && f <= char_9) {
        return `_${name}`;
      }

      return name;
    };

    /** @constructor */ function RegisteredClass(
      name,
      constructor,
      instancePrototype,
      rawDestructor,
      baseClass,
      getActualType,
      upcast,
      downcast,
    ) {
      this.name = name;
      this.constructor = constructor;
      this.instancePrototype = instancePrototype;
      this.rawDestructor = rawDestructor;
      this.baseClass = baseClass;
      this.getActualType = getActualType;
      this.upcast = upcast;
      this.downcast = downcast;
      this.pureVirtualFunctions = [];
    }

    const upcastPointer = (ptr, ptrClass, desiredClass) => {
      while (ptrClass !== desiredClass) {
        if (!ptrClass.upcast) {
          throwBindingError(`Expected null or instance of ${desiredClass.name}, got an instance of ${ptrClass.name}`);
        }
        ptr = ptrClass.upcast(ptr);
        ptrClass = ptrClass.baseClass;
      }

      return ptr;
    };

    /** @suppress {globalThis} */ function constNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError(`null is not a valid ${this.name}`);
        }

        return 0;
      }
      if (!handle.$$) {
        throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
      }
      if (!handle.$$.ptr) {
        throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
      }
      const handleClass = handle.$$.ptrType.registeredClass;
      const ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);

      return ptr;
    }

    /** @suppress {globalThis} */ function genericPointerToWireType(destructors, handle) {
      let ptr;

      if (handle === null) {
        if (this.isReference) {
          throwBindingError(`null is not a valid ${this.name}`);
        }
        if (this.isSmartPointer) {
          ptr = this.rawConstructor();
          if (destructors !== null) {
            destructors.push(this.rawDestructor, ptr);
          }

          return ptr;
        } else {
          return 0;
        }
      }
      if (!handle || !handle.$$) {
        throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
      }
      if (!handle.$$.ptr) {
        throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
      }
      if (!this.isConst && handle.$$.ptrType.isConst) {
        throwBindingError(
          `Cannot convert argument of type ${
            handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name
          } to parameter type ${this.name}`,
        );
      }
      const handleClass = handle.$$.ptrType.registeredClass;

      ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      if (this.isSmartPointer) {
        if (undefined === handle.$$.smartPtr) {
          throwBindingError('Passing raw pointer to smart pointer is illegal');
        }
        switch (this.sharingPolicy) {
          case 0:
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              throwBindingError(
                `Cannot convert argument of type ${
                  handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name
                } to parameter type ${this.name}`,
              );
            }
            break;

          case 1:
            ptr = handle.$$.smartPtr;
            break;

          case 2:
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              const clonedHandle = handle.clone();

              ptr = this.rawShare(
                ptr,
                Emval.toHandle(() => clonedHandle.delete()),
              );
              if (destructors !== null) {
                destructors.push(this.rawDestructor, ptr);
              }
            }
            break;

          default:
            throwBindingError('Unsupporting sharing policy');
        }
      }

      return ptr;
    }

    /** @suppress {globalThis} */ function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError(`null is not a valid ${this.name}`);
        }

        return 0;
      }
      if (!handle.$$) {
        throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
      }
      if (!handle.$$.ptr) {
        throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
      }
      if (handle.$$.ptrType.isConst) {
        throwBindingError(`Cannot convert argument of type ${handle.$$.ptrType.name} to parameter type ${this.name}`);
      }
      const handleClass = handle.$$.ptrType.registeredClass;
      const ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);

      return ptr;
    }

    const init_RegisteredPointer = () => {
      Object.assign(RegisteredPointer.prototype, {
        getPointee(ptr) {
          if (this.rawGetPointee) {
            ptr = this.rawGetPointee(ptr);
          }

          return ptr;
        },
        destructor(ptr) {
          this.rawDestructor?.(ptr);
        },
        argPackAdvance: GenericWireTypeSize,
        readValueFromPointer: readPointer,
        fromWireType: RegisteredPointer_fromWireType,
      });
    };

    /** @constructor
      @param {*=} pointeeType,
      @param {*=} sharingPolicy,
      @param {*=} rawGetPointee,
      @param {*=} rawConstructor,
      @param {*=} rawShare,
      @param {*=} rawDestructor,
       */ function RegisteredPointer(
      name,
      registeredClass,
      isReference,
      isConst,
      isSmartPointer,
      pointeeType,
      sharingPolicy,
      rawGetPointee,
      rawConstructor,
      rawShare,
      rawDestructor,
    ) {
      this.name = name;
      this.registeredClass = registeredClass;
      this.isReference = isReference;
      this.isConst = isConst;
      this.isSmartPointer = isSmartPointer;
      this.pointeeType = pointeeType;
      this.sharingPolicy = sharingPolicy;
      this.rawGetPointee = rawGetPointee;
      this.rawConstructor = rawConstructor;
      this.rawShare = rawShare;
      this.rawDestructor = rawDestructor;
      if (!isSmartPointer && registeredClass.baseClass === undefined) {
        if (isConst) {
          this.toWireType = constNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        } else {
          this.toWireType = nonConstNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        }
      } else {
        this.toWireType = genericPointerToWireType;
      }
    }

    /** @param {number=} numArguments */ const replacePublicSymbol = (name, value, numArguments) => {
      if (!Module.hasOwnProperty(name)) {
        throwInternalError('Replacing nonexistent public symbol');
      }
      if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        Module[name].argCount = numArguments;
      }
    };

    const dynCallLegacy = (sig, ptr, args) => {
      sig = sig.replace(/p/g, 'i');
      const f = Module[`dynCall_${sig}`];

      return f(ptr, ...args);
    };

    let wasmTable;

    const getWasmTableEntry = (funcPtr) => wasmTable.get(funcPtr);

    const dynCall = (sig, ptr, args = []) => {
      if (sig.includes('j')) {
        return dynCallLegacy(sig, ptr, args);
      }
      const rtn = getWasmTableEntry(ptr)(...args);

      return rtn;
    };

    const getDynCaller =
      (sig, ptr) =>
      (...args) =>
        dynCall(sig, ptr, args);

    const embind__requireFunction = (signature, rawFunction) => {
      signature = readLatin1String(signature);
      function makeDynCaller() {
        if (signature.includes('j')) {
          return getDynCaller(signature, rawFunction);
        }

        return getWasmTableEntry(rawFunction);
      }
      const fp = makeDynCaller();

      if (typeof fp != 'function') {
        throwBindingError(`unknown function pointer with signature ${signature}: ${rawFunction}`);
      }

      return fp;
    };

    const extendError = (baseErrorType, errorName) => {
      const errorClass = createNamedFunction(errorName, function (message) {
        this.name = errorName;
        this.message = message;
        const stack = new Error(message).stack;

        if (stack !== undefined) {
          this.stack = `${this.toString()}\n${stack.replace(/^Error(:[^\n]*)?\n/, '')}`;
        }
      });

      errorClass.prototype = Object.create(baseErrorType.prototype);
      errorClass.prototype.constructor = errorClass;
      errorClass.prototype.toString = function () {
        if (this.message === undefined) {
          return this.name;
        } else {
          return `${this.name}: ${this.message}`;
        }
      };

      return errorClass;
    };

    let UnboundTypeError;

    const getTypeName = (type) => {
      const ptr = ___getTypeName(type);
      const rv = readLatin1String(ptr);

      _free(ptr);

      return rv;
    };

    const throwUnboundTypeError = (message, types) => {
      const unboundTypes = [];
      const seen = {};

      function visit(type) {
        if (seen[type]) {
          return;
        }
        if (registeredTypes[type]) {
          return;
        }
        if (typeDependencies[type]) {
          typeDependencies[type].forEach(visit);

          return;
        }
        unboundTypes.push(type);
        seen[type] = true;
      }
      types.forEach(visit);
      throw new UnboundTypeError(`${message}: ${unboundTypes.map(getTypeName).join([', '])}`);
    };

    const __embind_register_class = (
      rawType,
      rawPointerType,
      rawConstPointerType,
      baseClassRawType,
      getActualTypeSignature,
      getActualType,
      upcastSignature,
      upcast,
      downcastSignature,
      downcast,
      name,
      destructorSignature,
      rawDestructor,
    ) => {
      name = readLatin1String(name);
      getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
      upcast &&= embind__requireFunction(upcastSignature, upcast);
      downcast &&= embind__requireFunction(downcastSignature, downcast);
      rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
      const legalFunctionName = makeLegalFunctionName(name);

      exposePublicSymbol(legalFunctionName, function () {
        throwUnboundTypeError(`Cannot construct ${name} due to unbound types`, [baseClassRawType]);
      });
      whenDependentTypesAreResolved(
        [rawType, rawPointerType, rawConstPointerType],
        baseClassRawType ? [baseClassRawType] : [],
        (base) => {
          base = base[0];
          let baseClass;
          let basePrototype;

          if (baseClassRawType) {
            baseClass = base.registeredClass;
            basePrototype = baseClass.instancePrototype;
          } else {
            basePrototype = ClassHandle.prototype;
          }
          const constructor = createNamedFunction(name, function (...args) {
            if (Object.getPrototypeOf(this) !== instancePrototype) {
              throw new BindingError(`Use 'new' to construct ${name}`);
            }
            if (undefined === registeredClass.constructor_body) {
              throw new BindingError(`${name} has no accessible constructor`);
            }
            const body = registeredClass.constructor_body[args.length];

            if (undefined === body) {
              throw new BindingError(
                `Tried to invoke ctor of ${name} with invalid number of parameters (${
                  args.length
                }) - expected (${Object.keys(registeredClass.constructor_body).toString()}) parameters instead!`,
              );
            }

            return body.apply(this, args);
          });
          var instancePrototype = Object.create(basePrototype, {
            constructor: {
              value: constructor,
            },
          });

          constructor.prototype = instancePrototype;
          var registeredClass = new RegisteredClass(
            name,
            constructor,
            instancePrototype,
            rawDestructor,
            baseClass,
            getActualType,
            upcast,
            downcast,
          );

          if (registeredClass.baseClass) {
            registeredClass.baseClass.__derivedClasses ??= [];
            registeredClass.baseClass.__derivedClasses.push(registeredClass);
          }
          const referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
          const pointerConverter = new RegisteredPointer(`${name}*`, registeredClass, false, false, false);
          const constPointerConverter = new RegisteredPointer(`${name} const*`, registeredClass, false, true, false);

          registeredPointers[rawType] = {
            pointerType: pointerConverter,
            constPointerType: constPointerConverter,
          };
          replacePublicSymbol(legalFunctionName, constructor);

          return [referenceConverter, pointerConverter, constPointerConverter];
        },
      );
    };

    const heap32VectorToArray = (count, firstElement) => {
      const array = [];

      for (let i = 0; i < count; i++) {
        array.push(HEAPU32[(firstElement + i * 4) >> 2]);
      }

      return array;
    };

    function usesDestructorStack(argTypes) {
      for (let i = 1; i < argTypes.length; ++i) {
        if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
          return true;
        }
      }

      return false;
    }

    function craftInvokerFunction(
      humanName,
      argTypes,
      classType,
      cppInvokerFunc,
      cppTargetFunc,
      /** boolean= */ isAsync,
    ) {
      const argCount = argTypes.length;

      if (argCount < 2) {
        throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
      }
      const isClassMethodFunc = argTypes[1] !== null && classType !== null;
      const needsDestructorStack = usesDestructorStack(argTypes);
      const returns = argTypes[0].name !== 'void';
      const expectedArgCount = argCount - 2;
      const argsWired = new Array(expectedArgCount);
      const invokerFuncArgs = [];
      const destructors = [];
      const invokerFn = function (...args) {
        if (args.length !== expectedArgCount) {
          throwBindingError(`function ${humanName} called with ${args.length} arguments, expected ${expectedArgCount}`);
        }
        destructors.length = 0;
        let thisWired;

        invokerFuncArgs.length = isClassMethodFunc ? 2 : 1;
        invokerFuncArgs[0] = cppTargetFunc;
        if (isClassMethodFunc) {
          thisWired = argTypes[1].toWireType(destructors, this);
          invokerFuncArgs[1] = thisWired;
        }
        for (let i = 0; i < expectedArgCount; ++i) {
          argsWired[i] = argTypes[i + 2].toWireType(destructors, args[i]);
          invokerFuncArgs.push(argsWired[i]);
        }
        const rv = cppInvokerFunc(...invokerFuncArgs);

        function onDone(rv) {
          if (needsDestructorStack) {
            runDestructors(destructors);
          } else {
            for (let i = isClassMethodFunc ? 1 : 2; i < argTypes.length; i++) {
              const param = i === 1 ? thisWired : argsWired[i - 2];

              if (argTypes[i].destructorFunction !== null) {
                argTypes[i].destructorFunction(param);
              }
            }
          }
          if (returns) {
            return argTypes[0].fromWireType(rv);
          }
        }

        return onDone(rv);
      };

      return createNamedFunction(humanName, invokerFn);
    }

    const __embind_register_class_constructor = (
      rawClassType,
      argCount,
      rawArgTypesAddr,
      invokerSignature,
      invoker,
      rawConstructor,
    ) => {
      const rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);

      invoker = embind__requireFunction(invokerSignature, invoker);
      whenDependentTypesAreResolved([], [rawClassType], (classType) => {
        classType = classType[0];
        const humanName = `constructor ${classType.name}`;

        if (undefined === classType.registeredClass.constructor_body) {
          classType.registeredClass.constructor_body = [];
        }
        if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) {
          throw new BindingError(
            `Cannot register multiple constructors with identical number of parameters (${argCount - 1}) for class '${
              classType.name
            }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
          );
        }
        classType.registeredClass.constructor_body[argCount - 1] = () => {
          throwUnboundTypeError(`Cannot construct ${classType.name} due to unbound types`, rawArgTypes);
        };
        whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
          argTypes.splice(1, 0, null);
          classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(
            humanName,
            argTypes,
            null,
            invoker,
            rawConstructor,
          );

          return [];
        });

        return [];
      });
    };

    const getFunctionName = (signature) => {
      signature = signature.trim();
      const argsIndex = signature.indexOf('(');

      if (argsIndex !== -1) {
        return signature.substr(0, argsIndex);
      } else {
        return signature;
      }
    };

    const __embind_register_class_function = (
      rawClassType,
      methodName,
      argCount,
      rawArgTypesAddr,
      invokerSignature,
      rawInvoker,
      context,
      isPureVirtual,
      isAsync,
    ) => {
      const rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);

      methodName = readLatin1String(methodName);
      methodName = getFunctionName(methodName);
      rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
      whenDependentTypesAreResolved([], [rawClassType], (classType) => {
        classType = classType[0];
        const humanName = `${classType.name}.${methodName}`;

        if (methodName.startsWith('@@')) {
          methodName = Symbol[methodName.substring(2)];
        }
        if (isPureVirtual) {
          classType.registeredClass.pureVirtualFunctions.push(methodName);
        }
        function unboundTypesHandler() {
          throwUnboundTypeError(`Cannot call ${humanName} due to unbound types`, rawArgTypes);
        }
        const proto = classType.registeredClass.instancePrototype;
        const method = proto[methodName];

        if (
          undefined === method ||
          (undefined === method.overloadTable &&
            method.className !== classType.name &&
            method.argCount === argCount - 2)
        ) {
          unboundTypesHandler.argCount = argCount - 2;
          unboundTypesHandler.className = classType.name;
          proto[methodName] = unboundTypesHandler;
        } else {
          ensureOverloadTable(proto, methodName, humanName);
          proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
        }
        whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
          const memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context, isAsync);

          if (undefined === proto[methodName].overloadTable) {
            memberFunction.argCount = argCount - 2;
            proto[methodName] = memberFunction;
          } else {
            proto[methodName].overloadTable[argCount - 2] = memberFunction;
          }

          return [];
        });

        return [];
      });
    };

    const emval_freelist = [];

    const emval_handles = [];

    const __emval_decref = (handle) => {
      if (handle > 9 && --emval_handles[handle + 1] === 0) {
        emval_handles[handle] = undefined;
        emval_freelist.push(handle);
      }
    };

    const count_emval_handles = () => emval_handles.length / 2 - 5 - emval_freelist.length;

    const init_emval = () => {
      emval_handles.push(0, 1, undefined, 1, null, 1, true, 1, false, 1);
      Module.count_emval_handles = count_emval_handles;
    };

    var Emval = {
      toValue: (handle) => {
        if (!handle) {
          throwBindingError(`Cannot use deleted val. handle = ${handle}`);
        }

        return emval_handles[handle];
      },
      toHandle: (value) => {
        switch (value) {
          case undefined:
            return 2;

          case null:
            return 4;

          case true:
            return 6;

          case false:
            return 8;

          default: {
            const handle = emval_freelist.pop() || emval_handles.length;

            emval_handles[handle] = value;
            emval_handles[handle + 1] = 1;

            return handle;
          }
        }
      },
    };

    const EmValType = {
      name: 'emscripten::val',
      fromWireType: (handle) => {
        const rv = Emval.toValue(handle);

        __emval_decref(handle);

        return rv;
      },
      toWireType: (destructors, value) => Emval.toHandle(value),
      argPackAdvance: GenericWireTypeSize,
      readValueFromPointer: readPointer,
      destructorFunction: null,
    };

    const __embind_register_emval = (rawType) => registerType(rawType, EmValType);

    const enumReadValueFromPointer = (name, width, signed) => {
      switch (width) {
        case 1:
          return signed
            ? function (pointer) {
                return this.fromWireType(HEAP8[pointer]);
              }
            : function (pointer) {
                return this.fromWireType(HEAPU8[pointer]);
              };

        case 2:
          return signed
            ? function (pointer) {
                return this.fromWireType(HEAP16[pointer >> 1]);
              }
            : function (pointer) {
                return this.fromWireType(HEAPU16[pointer >> 1]);
              };

        case 4:
          return signed
            ? function (pointer) {
                return this.fromWireType(HEAP32[pointer >> 2]);
              }
            : function (pointer) {
                return this.fromWireType(HEAPU32[pointer >> 2]);
              };

        default:
          throw new TypeError(`invalid integer width (${width}): ${name}`);
      }
    };

    /** @suppress {globalThis} */ const __embind_register_enum = (rawType, name, size, isSigned) => {
      name = readLatin1String(name);
      function ctor() {}
      ctor.values = {};
      registerType(rawType, {
        name,
        constructor: ctor,
        fromWireType(c) {
          return this.constructor.values[c];
        },
        toWireType: (destructors, c) => c.value,
        argPackAdvance: GenericWireTypeSize,
        readValueFromPointer: enumReadValueFromPointer(name, size, isSigned),
        destructorFunction: null,
      });
      exposePublicSymbol(name, ctor);
    };

    const requireRegisteredType = (rawType, humanName) => {
      const impl = registeredTypes[rawType];

      if (undefined === impl) {
        throwBindingError(`${humanName} has unknown type ${getTypeName(rawType)}`);
      }

      return impl;
    };

    const __embind_register_enum_value = (rawEnumType, name, enumValue) => {
      const enumType = requireRegisteredType(rawEnumType, 'enum');

      name = readLatin1String(name);
      const Enum = enumType.constructor;
      const Value = Object.create(enumType.constructor.prototype, {
        value: {
          value: enumValue,
        },
        constructor: {
          value: createNamedFunction(`${enumType.name}_${name}`, function () {}),
        },
      });

      Enum.values[enumValue] = Value;
      Enum[name] = Value;
    };

    var embindRepr = (v) => {
      if (v === null) {
        return 'null';
      }
      const t = typeof v;

      if (t === 'object' || t === 'array' || t === 'function') {
        return v.toString();
      } else {
        return `${v}`;
      }
    };

    const floatReadValueFromPointer = (name, width) => {
      switch (width) {
        case 4:
          return function (pointer) {
            return this.fromWireType(HEAPF32[pointer >> 2]);
          };

        case 8:
          return function (pointer) {
            return this.fromWireType(HEAPF64[pointer >> 3]);
          };

        default:
          throw new TypeError(`invalid float width (${width}): ${name}`);
      }
    };

    const __embind_register_float = (rawType, name, size) => {
      name = readLatin1String(name);
      registerType(rawType, {
        name,
        fromWireType: (value) => value,
        toWireType: (destructors, value) => value,
        argPackAdvance: GenericWireTypeSize,
        readValueFromPointer: floatReadValueFromPointer(name, size),
        destructorFunction: null,
      });
    };

    const __embind_register_function = (name, argCount, rawArgTypesAddr, signature, rawInvoker, fn, isAsync) => {
      const argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);

      name = readLatin1String(name);
      name = getFunctionName(name);
      rawInvoker = embind__requireFunction(signature, rawInvoker);
      exposePublicSymbol(
        name,
        function () {
          throwUnboundTypeError(`Cannot call ${name} due to unbound types`, argTypes);
        },
        argCount - 1,
      );
      whenDependentTypesAreResolved([], argTypes, (argTypes) => {
        const invokerArgsArray = [argTypes[0], /* return value */ null].concat(/* no class 'this'*/ argTypes.slice(1));

        /* actual params */ replacePublicSymbol(
          name,
          craftInvokerFunction(name, invokerArgsArray, null, /* no class 'this'*/ rawInvoker, fn, isAsync),
          argCount - 1,
        );

        return [];
      });
    };

    const integerReadValueFromPointer = (name, width, signed) => {
      switch (width) {
        case 1:
          return signed ? (pointer) => HEAP8[pointer] : (pointer) => HEAPU8[pointer];

        case 2:
          return signed ? (pointer) => HEAP16[pointer >> 1] : (pointer) => HEAPU16[pointer >> 1];

        case 4:
          return signed ? (pointer) => HEAP32[pointer >> 2] : (pointer) => HEAPU32[pointer >> 2];

        default:
          throw new TypeError(`invalid integer width (${width}): ${name}`);
      }
    };

    /** @suppress {globalThis} */ const __embind_register_integer = (primitiveType, name, size, minRange, maxRange) => {
      name = readLatin1String(name);
      if (maxRange === -1) {
        maxRange = 4294967295;
      }
      let fromWireType = (value) => value;

      if (minRange === 0) {
        const bitshift = 32 - 8 * size;

        fromWireType = (value) => (value << bitshift) >>> bitshift;
      }
      const isUnsignedType = name.includes('unsigned');
      const checkAssertions = (value, toTypeName) => {};
      let toWireType;

      if (isUnsignedType) {
        toWireType = function (destructors, value) {
          checkAssertions(value, this.name);

          return value >>> 0;
        };
      } else {
        toWireType = function (destructors, value) {
          checkAssertions(value, this.name);

          return value;
        };
      }
      registerType(primitiveType, {
        name,
        fromWireType,
        toWireType,
        argPackAdvance: GenericWireTypeSize,
        readValueFromPointer: integerReadValueFromPointer(name, size, minRange !== 0),
        destructorFunction: null,
      });
    };

    const __embind_register_memory_view = (rawType, dataTypeIndex, name) => {
      const typeMapping = [
        Int8Array,
        Uint8Array,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array,
      ];
      const TA = typeMapping[dataTypeIndex];

      function decodeMemoryView(handle) {
        const size = HEAPU32[handle >> 2];
        const data = HEAPU32[(handle + 4) >> 2];

        return new TA(HEAP8.buffer, data, size);
      }
      name = readLatin1String(name);
      registerType(
        rawType,
        {
          name,
          fromWireType: decodeMemoryView,
          argPackAdvance: GenericWireTypeSize,
          readValueFromPointer: decodeMemoryView,
        },
        {
          ignoreDuplicateRegistrations: true,
        },
      );
    };

    const __embind_register_optional = (rawOptionalType, rawType) => {
      __embind_register_emval(rawOptionalType);
    };

    const __embind_register_smart_ptr = (
      rawType,
      rawPointeeType,
      name,
      sharingPolicy,
      getPointeeSignature,
      rawGetPointee,
      constructorSignature,
      rawConstructor,
      shareSignature,
      rawShare,
      destructorSignature,
      rawDestructor,
    ) => {
      name = readLatin1String(name);
      rawGetPointee = embind__requireFunction(getPointeeSignature, rawGetPointee);
      rawConstructor = embind__requireFunction(constructorSignature, rawConstructor);
      rawShare = embind__requireFunction(shareSignature, rawShare);
      rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
      whenDependentTypesAreResolved([rawType], [rawPointeeType], (pointeeType) => {
        pointeeType = pointeeType[0];
        const registeredPointer = new RegisteredPointer(
          name,
          pointeeType.registeredClass,
          false,
          false,
          true,
          pointeeType,
          sharingPolicy,
          rawGetPointee,
          rawConstructor,
          rawShare,
          rawDestructor,
        );

        return [registeredPointer];
      });
    };

    const __embind_register_std_string = (rawType, name) => {
      name = readLatin1String(name);
      const stdStringIsUTF8 = name === 'std::string';

      registerType(rawType, {
        name,
        fromWireType(value) {
          const length = HEAPU32[value >> 2];
          const payload = value + 4;
          let str;

          if (stdStringIsUTF8) {
            let decodeStartPtr = payload;

            for (var i = 0; i <= length; ++i) {
              const currentBytePtr = payload + i;

              if (i == length || HEAPU8[currentBytePtr] == 0) {
                const maxRead = currentBytePtr - decodeStartPtr;
                const stringSegment = UTF8ToString(decodeStartPtr, maxRead);

                if (str === undefined) {
                  str = stringSegment;
                } else {
                  str += String.fromCharCode(0);
                  str += stringSegment;
                }
                decodeStartPtr = currentBytePtr + 1;
              }
            }
          } else {
            const a = new Array(length);

            for (var i = 0; i < length; ++i) {
              a[i] = String.fromCharCode(HEAPU8[payload + i]);
            }
            str = a.join('');
          }
          _free(value);

          return str;
        },
        toWireType(destructors, value) {
          if (value instanceof ArrayBuffer) {
            value = new Uint8Array(value);
          }
          let length;
          const valueIsOfTypeString = typeof value == 'string';

          if (
            !(
              valueIsOfTypeString ||
              value instanceof Uint8Array ||
              value instanceof Uint8ClampedArray ||
              value instanceof Int8Array
            )
          ) {
            throwBindingError('Cannot pass non-string to std::string');
          }
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            length = lengthBytesUTF8(value);
          } else {
            length = value.length;
          }
          const base = _malloc(4 + length + 1);
          const ptr = base + 4;

          HEAPU32[base >> 2] = length;
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            stringToUTF8(value, ptr, length + 1);
          } else if (valueIsOfTypeString) {
            for (var i = 0; i < length; ++i) {
              const charCode = value.charCodeAt(i);

              if (charCode > 255) {
                _free(ptr);
                throwBindingError('String has UTF-16 code units that do not fit in 8 bits');
              }
              HEAPU8[ptr + i] = charCode;
            }
          } else {
            for (var i = 0; i < length; ++i) {
              HEAPU8[ptr + i] = value[i];
            }
          }
          if (destructors !== null) {
            destructors.push(_free, base);
          }

          return base;
        },
        argPackAdvance: GenericWireTypeSize,
        readValueFromPointer: readPointer,
        destructorFunction(ptr) {
          _free(ptr);
        },
      });
    };

    const UTF16Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf-16le') : undefined;

    const UTF16ToString = (ptr, maxBytesToRead) => {
      let endPtr = ptr;
      let idx = endPtr >> 1;
      const maxIdx = idx + maxBytesToRead / 2;

      while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
      endPtr = idx << 1;
      if (endPtr - ptr > 32 && UTF16Decoder) return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
      let str = '';

      for (let i = 0; !(i >= maxBytesToRead / 2); ++i) {
        const codeUnit = HEAP16[(ptr + i * 2) >> 1];

        if (codeUnit == 0) break;
        str += String.fromCharCode(codeUnit);
      }

      return str;
    };

    const stringToUTF16 = (str, outPtr, maxBytesToWrite) => {
      maxBytesToWrite ??= 2147483647;
      if (maxBytesToWrite < 2) return 0;
      maxBytesToWrite -= 2;
      const startPtr = outPtr;
      const numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;

      for (let i = 0; i < numCharsToWrite; ++i) {
        const codeUnit = str.charCodeAt(i);

        HEAP16[outPtr >> 1] = codeUnit;
        outPtr += 2;
      }
      HEAP16[outPtr >> 1] = 0;

      return outPtr - startPtr;
    };

    const lengthBytesUTF16 = (str) => str.length * 2;

    const UTF32ToString = (ptr, maxBytesToRead) => {
      let i = 0;
      let str = '';

      while (!(i >= maxBytesToRead / 4)) {
        const utf32 = HEAP32[(ptr + i * 4) >> 2];

        if (utf32 == 0) break;
        ++i;
        if (utf32 >= 65536) {
          const ch = utf32 - 65536;

          str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
        } else {
          str += String.fromCharCode(utf32);
        }
      }

      return str;
    };

    const stringToUTF32 = (str, outPtr, maxBytesToWrite) => {
      maxBytesToWrite ??= 2147483647;
      if (maxBytesToWrite < 4) return 0;
      const startPtr = outPtr;
      const endPtr = startPtr + maxBytesToWrite - 4;

      for (let i = 0; i < str.length; ++i) {
        let codeUnit = str.charCodeAt(i);

        if (codeUnit >= 55296 && codeUnit <= 57343) {
          const trailSurrogate = str.charCodeAt(++i);

          codeUnit = (65536 + ((codeUnit & 1023) << 10)) | (trailSurrogate & 1023);
        }
        HEAP32[outPtr >> 2] = codeUnit;
        outPtr += 4;
        if (outPtr + 4 > endPtr) break;
      }
      HEAP32[outPtr >> 2] = 0;

      return outPtr - startPtr;
    };

    const lengthBytesUTF32 = (str) => {
      let len = 0;

      for (let i = 0; i < str.length; ++i) {
        const codeUnit = str.charCodeAt(i);

        if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
        len += 4;
      }

      return len;
    };

    const __embind_register_std_wstring = (rawType, charSize, name) => {
      name = readLatin1String(name);
      let decodeString;
      let encodeString;
      let readCharAt;
      let lengthBytesUTF;

      if (charSize === 2) {
        decodeString = UTF16ToString;
        encodeString = stringToUTF16;
        lengthBytesUTF = lengthBytesUTF16;
        readCharAt = (pointer) => HEAPU16[pointer >> 1];
      } else if (charSize === 4) {
        decodeString = UTF32ToString;
        encodeString = stringToUTF32;
        lengthBytesUTF = lengthBytesUTF32;
        readCharAt = (pointer) => HEAPU32[pointer >> 2];
      }
      registerType(rawType, {
        name,
        fromWireType: (value) => {
          const length = HEAPU32[value >> 2];
          let str;
          let decodeStartPtr = value + 4;

          for (let i = 0; i <= length; ++i) {
            const currentBytePtr = value + 4 + i * charSize;

            if (i == length || readCharAt(currentBytePtr) == 0) {
              const maxReadBytes = currentBytePtr - decodeStartPtr;
              const stringSegment = decodeString(decodeStartPtr, maxReadBytes);

              if (str === undefined) {
                str = stringSegment;
              } else {
                str += String.fromCharCode(0);
                str += stringSegment;
              }
              decodeStartPtr = currentBytePtr + charSize;
            }
          }
          _free(value);

          return str;
        },
        toWireType: (destructors, value) => {
          if (!(typeof value == 'string')) {
            throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
          }
          const length = lengthBytesUTF(value);
          const ptr = _malloc(4 + length + charSize);

          HEAPU32[ptr >> 2] = length / charSize;
          encodeString(value, ptr + 4, length + charSize);
          if (destructors !== null) {
            destructors.push(_free, ptr);
          }

          return ptr;
        },
        argPackAdvance: GenericWireTypeSize,
        readValueFromPointer: readPointer,
        destructorFunction(ptr) {
          _free(ptr);
        },
      });
    };

    const __embind_register_value_object = (
      rawType,
      name,
      constructorSignature,
      rawConstructor,
      destructorSignature,
      rawDestructor,
    ) => {
      structRegistrations[rawType] = {
        name: readLatin1String(name),
        rawConstructor: embind__requireFunction(constructorSignature, rawConstructor),
        rawDestructor: embind__requireFunction(destructorSignature, rawDestructor),
        fields: [],
      };
    };

    const __embind_register_value_object_field = (
      structType,
      fieldName,
      getterReturnType,
      getterSignature,
      getter,
      getterContext,
      setterArgumentType,
      setterSignature,
      setter,
      setterContext,
    ) => {
      structRegistrations[structType].fields.push({
        fieldName: readLatin1String(fieldName),
        getterReturnType,
        getter: embind__requireFunction(getterSignature, getter),
        getterContext,
        setterArgumentType,
        setter: embind__requireFunction(setterSignature, setter),
        setterContext,
      });
    };

    const __embind_register_void = (rawType, name) => {
      name = readLatin1String(name);
      registerType(rawType, {
        isVoid: true,
        name,
        argPackAdvance: 0,
        fromWireType: () => undefined,
        toWireType: (destructors, o) => undefined,
      });
    };

    const __emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);

    const __emscripten_throw_longjmp = () => {
      throw Infinity;
    };

    const emval_methodCallers = [];

    const __emval_call = (caller, handle, destructorsRef, args) => {
      caller = emval_methodCallers[caller];
      handle = Emval.toValue(handle);

      return caller(null, handle, destructorsRef, args);
    };

    const emval_addMethodCaller = (caller) => {
      const id = emval_methodCallers.length;

      emval_methodCallers.push(caller);

      return id;
    };

    const emval_lookupTypes = (argCount, argTypes) => {
      const a = new Array(argCount);

      for (let i = 0; i < argCount; ++i) {
        a[i] = requireRegisteredType(HEAPU32[(argTypes + i * 4) >> 2], `parameter ${i}`);
      }

      return a;
    };

    const reflectConstruct = Reflect.construct;

    const emval_returnValue = (returnType, destructorsRef, handle) => {
      const destructors = [];
      const result = returnType.toWireType(destructors, handle);

      if (destructors.length) {
        HEAPU32[destructorsRef >> 2] = Emval.toHandle(destructors);
      }

      return result;
    };

    const __emval_get_method_caller = (argCount, argTypes, kind) => {
      const types = emval_lookupTypes(argCount, argTypes);
      const retType = types.shift();

      argCount--;
      const argN = new Array(argCount);
      const invokerFunction = (obj, func, destructorsRef, args) => {
        let offset = 0;

        for (let i = 0; i < argCount; ++i) {
          argN[i] = types[i].readValueFromPointer(args + offset);
          offset += types[i].argPackAdvance;
        }
        const rv = kind === /* CONSTRUCTOR */ 1 ? reflectConstruct(func, argN) : func.apply(obj, argN);

        return emval_returnValue(retType, destructorsRef, rv);
      };
      const functionName = `methodCaller<(${types.map((t) => t.name).join(', ')}) => ${retType.name}>`;

      return emval_addMethodCaller(createNamedFunction(functionName, invokerFunction));
    };

    const __emval_incref = (handle) => {
      if (handle > 9) {
        emval_handles[handle + 1] += 1;
      }
    };

    const __emval_run_destructors = (handle) => {
      const destructors = Emval.toValue(handle);

      runDestructors(destructors);
      __emval_decref(handle);
    };

    const __emval_take_value = (type, arg) => {
      type = requireRegisteredType(type, '_emval_take_value');
      const v = type.readValueFromPointer(arg);

      return Emval.toHandle(v);
    };

    const _abort = () => {
      abort('');
    };

    let _emscripten_get_now;

    _emscripten_get_now = () => performance.now();

    const getHeapMax = () => 2147483648;

    const growMemory = (size) => {
      const b = wasmMemory.buffer;
      const pages = (size - b.byteLength + 65535) / 65536;

      try {
        wasmMemory.grow(pages);
        updateMemoryViews();

        return 1;
      } /* success*/ catch (e) {}
    };

    const _emscripten_resize_heap = (requestedSize) => {
      const oldSize = HEAPU8.length;

      requestedSize >>>= 0;
      const maxHeapSize = getHeapMax();

      if (requestedSize > maxHeapSize) {
        return false;
      }
      const alignUp = (x, multiple) => x + ((multiple - (x % multiple)) % multiple);

      for (let cutDown = 1; cutDown <= 4; cutDown *= 2) {
        let overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);

        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
        const newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
        const replacement = growMemory(newSize);

        if (replacement) {
          return true;
        }
      }

      return false;
    };

    const ENV = {};

    const getExecutableName = () => thisProgram || './this.program';

    var getEnvStrings = () => {
      if (!getEnvStrings.strings) {
        const lang = `${(
          (typeof navigator == 'object' && navigator.languages && navigator.languages[0]) ||
          'C'
        ).replace('-', '_')}.UTF-8`;
        const env = {
          USER: 'web_user',
          LOGNAME: 'web_user',
          PATH: '/',
          PWD: '/',
          HOME: '/home/web_user',
          LANG: lang,
          _: getExecutableName(),
        };

        for (var x in ENV) {
          if (ENV[x] === undefined) delete env[x];
          else env[x] = ENV[x];
        }
        const strings = [];

        for (var x in env) {
          strings.push(`${x}=${env[x]}`);
        }
        getEnvStrings.strings = strings;
      }

      return getEnvStrings.strings;
    };

    const stringToAscii = (str, buffer) => {
      for (let i = 0; i < str.length; ++i) {
        HEAP8[buffer++] = str.charCodeAt(i);
      }
      HEAP8[buffer] = 0;
    };

    const _environ_get = (__environ, environ_buf) => {
      let bufSize = 0;

      getEnvStrings().forEach((string, i) => {
        const ptr = environ_buf + bufSize;

        HEAPU32[(__environ + i * 4) >> 2] = ptr;
        stringToAscii(string, ptr);
        bufSize += string.length + 1;
      });

      return 0;
    };

    const _environ_sizes_get = (penviron_count, penviron_buf_size) => {
      const strings = getEnvStrings();

      HEAPU32[penviron_count >> 2] = strings.length;
      let bufSize = 0;

      strings.forEach((string) => (bufSize += string.length + 1));
      HEAPU32[penviron_buf_size >> 2] = bufSize;

      return 0;
    };

    const _fd_close = (fd) => 52;

    const _fd_read = (fd, iov, iovcnt, pnum) => 52;

    const convertI32PairToI53Checked = (lo, hi) =>
      (hi + 2097152) >>> 0 < 4194305 - Boolean(lo) ? (lo >>> 0) + hi * 4294967296 : NaN;

    function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
      const offset = convertI32PairToI53Checked(offset_low, offset_high);

      return 70;
    }

    const printCharBuffers = [null, [], []];

    const printChar = (stream, curr) => {
      const buffer = printCharBuffers[stream];

      if (curr === 0 || curr === 10) {
        (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
        buffer.length = 0;
      } else {
        buffer.push(curr);
      }
    };

    const _fd_write = (fd, iov, iovcnt, pnum) => {
      let num = 0;

      for (let i = 0; i < iovcnt; i++) {
        const ptr = HEAPU32[iov >> 2];
        const len = HEAPU32[(iov + 4) >> 2];

        iov += 8;
        for (let j = 0; j < len; j++) {
          printChar(fd, HEAPU8[ptr + j]);
        }
        num += len;
      }
      HEAPU32[pnum >> 2] = num;

      return 0;
    };

    const initRandomFill = () => {
      if (typeof crypto == 'object' && typeof crypto.getRandomValues == 'function') {
        return (view) => crypto.getRandomValues(view);
      } else abort('initRandomDevice');
    };

    var randomFill = (view) => (randomFill = initRandomFill())(view);

    const _getentropy = (buffer, size) => {
      randomFill(HEAPU8.subarray(buffer, buffer + size));

      return 0;
    };

    const isLeapYear = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

    const arraySum = (array, index) => {
      let sum = 0;

      for (let i = 0; i <= index; sum += array[i++]) {}

      return sum;
    };

    const MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const addDays = (date, days) => {
      const newDate = new Date(date.getTime());

      while (days > 0) {
        const leap = isLeapYear(newDate.getFullYear());
        const currentMonth = newDate.getMonth();
        const daysInCurrentMonth = (leap ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[currentMonth];

        if (days > daysInCurrentMonth - newDate.getDate()) {
          days -= daysInCurrentMonth - newDate.getDate() + 1;
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth + 1);
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear() + 1);
          }
        } else {
          newDate.setDate(newDate.getDate() + days);

          return newDate;
        }
      }

      return newDate;
    };

    /** @type {function(string, boolean=, number=)} */ function intArrayFromString(stringy, dontAddNull, length) {
      const len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
      const u8array = new Array(len);
      const numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);

      if (dontAddNull) u8array.length = numBytesWritten;

      return u8array;
    }

    const writeArrayToMemory = (array, buffer) => {
      HEAP8.set(array, buffer);
    };

    const _strftime = (s, maxsize, format, tm) => {
      const tm_zone = HEAPU32[(tm + 40) >> 2];
      const date = {
        tm_sec: HEAP32[tm >> 2],
        tm_min: HEAP32[(tm + 4) >> 2],
        tm_hour: HEAP32[(tm + 8) >> 2],
        tm_mday: HEAP32[(tm + 12) >> 2],
        tm_mon: HEAP32[(tm + 16) >> 2],
        tm_year: HEAP32[(tm + 20) >> 2],
        tm_wday: HEAP32[(tm + 24) >> 2],
        tm_yday: HEAP32[(tm + 28) >> 2],
        tm_isdst: HEAP32[(tm + 32) >> 2],
        tm_gmtoff: HEAP32[(tm + 36) >> 2],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : '',
      };
      let pattern = UTF8ToString(format);
      const EXPANSION_RULES_1 = {
        '%c': '%a %b %d %H:%M:%S %Y',
        '%D': '%m/%d/%y',
        '%F': '%Y-%m-%d',
        '%h': '%b',
        '%r': '%I:%M:%S %p',
        '%R': '%H:%M',
        '%T': '%H:%M:%S',
        '%x': '%m/%d/%y',
        '%X': '%H:%M:%S',
        '%Ec': '%c',
        '%EC': '%C',
        '%Ex': '%m/%d/%y',
        '%EX': '%H:%M:%S',
        '%Ey': '%y',
        '%EY': '%Y',
        '%Od': '%d',
        '%Oe': '%e',
        '%OH': '%H',
        '%OI': '%I',
        '%Om': '%m',
        '%OM': '%M',
        '%OS': '%S',
        '%Ou': '%u',
        '%OU': '%U',
        '%OV': '%V',
        '%Ow': '%w',
        '%OW': '%W',
        '%Oy': '%y',
      };

      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_1[rule]);
      }
      const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      function leadingSomething(value, digits, character) {
        let str = typeof value == 'number' ? value.toString() : value || '';

        while (str.length < digits) {
          str = character[0] + str;
        }

        return str;
      }
      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, '0');
      }
      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : value > 0 ? 1 : 0;
        }
        let compare;

        if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
            compare = sgn(date1.getDate() - date2.getDate());
          }
        }

        return compare;
      }
      function getFirstWeekStartDate(janFourth) {
        switch (janFourth.getDay()) {
          case 0:
            return new Date(janFourth.getFullYear() - 1, 11, 29);

          case 1:
            return janFourth;

          case 2:
            return new Date(janFourth.getFullYear(), 0, 3);

          case 3:
            return new Date(janFourth.getFullYear(), 0, 2);

          case 4:
            return new Date(janFourth.getFullYear(), 0, 1);

          case 5:
            return new Date(janFourth.getFullYear() - 1, 11, 31);

          case 6:
            return new Date(janFourth.getFullYear() - 1, 11, 30);
        }
      }
      function getWeekBasedYear(date) {
        const thisDate = addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
        const janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
        const janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
        const firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
        const firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);

        if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
          if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
            return thisDate.getFullYear() + 1;
          }

          return thisDate.getFullYear();
        }

        return thisDate.getFullYear() - 1;
      }
      const EXPANSION_RULES_2 = {
        '%a': (date) => WEEKDAYS[date.tm_wday].substring(0, 3),
        '%A': (date) => WEEKDAYS[date.tm_wday],
        '%b': (date) => MONTHS[date.tm_mon].substring(0, 3),
        '%B': (date) => MONTHS[date.tm_mon],
        '%C': (date) => {
          const year = date.tm_year + 1900;

          return leadingNulls((year / 100) | 0, 2);
        },
        '%d': (date) => leadingNulls(date.tm_mday, 2),
        '%e': (date) => leadingSomething(date.tm_mday, 2, ' '),
        '%g': (date) => getWeekBasedYear(date).toString().substring(2),
        '%G': getWeekBasedYear,
        '%H': (date) => leadingNulls(date.tm_hour, 2),
        '%I': (date) => {
          let twelveHour = date.tm_hour;

          if (twelveHour == 0) twelveHour = 12;
          else if (twelveHour > 12) twelveHour -= 12;

          return leadingNulls(twelveHour, 2);
        },
        '%j': (date) =>
          leadingNulls(
            date.tm_mday +
              arraySum(isLeapYear(date.tm_year + 1900) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, date.tm_mon - 1),
            3,
          ),
        '%m': (date) => leadingNulls(date.tm_mon + 1, 2),
        '%M': (date) => leadingNulls(date.tm_min, 2),
        '%n': () => '\n',
        '%p': (date) => {
          if (date.tm_hour >= 0 && date.tm_hour < 12) {
            return 'AM';
          }

          return 'PM';
        },
        '%S': (date) => leadingNulls(date.tm_sec, 2),
        '%t': () => '\t',
        '%u': (date) => date.tm_wday || 7,
        '%U': (date) => {
          const days = date.tm_yday + 7 - date.tm_wday;

          return leadingNulls(Math.floor(days / 7), 2);
        },
        '%V': (date) => {
          let val = Math.floor((date.tm_yday + 7 - ((date.tm_wday + 6) % 7)) / 7);

          if ((date.tm_wday + 371 - date.tm_yday - 2) % 7 <= 2) {
            val++;
          }
          if (!val) {
            val = 52;
            const dec31 = (date.tm_wday + 7 - date.tm_yday - 1) % 7;

            if (dec31 == 4 || (dec31 == 5 && isLeapYear((date.tm_year % 400) - 1))) {
              val++;
            }
          } else if (val == 53) {
            const jan1 = (date.tm_wday + 371 - date.tm_yday) % 7;

            if (jan1 != 4 && (jan1 != 3 || !isLeapYear(date.tm_year))) val = 1;
          }

          return leadingNulls(val, 2);
        },
        '%w': (date) => date.tm_wday,
        '%W': (date) => {
          const days = date.tm_yday + 7 - ((date.tm_wday + 6) % 7);

          return leadingNulls(Math.floor(days / 7), 2);
        },
        '%y': (date) => (date.tm_year + 1900).toString().substring(2),
        '%Y': (date) => date.tm_year + 1900,
        '%z': (date) => {
          let off = date.tm_gmtoff;
          const ahead = off >= 0;

          off = Math.abs(off) / 60;
          off = (off / 60) * 100 + (off % 60);

          return (ahead ? '+' : '-') + String(`0000${off}`).slice(-4);
        },
        '%Z': (date) => date.tm_zone,
        '%%': () => '%',
      };

      pattern = pattern.replace(/%%/g, '\0\0');
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.includes(rule)) {
          pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_2[rule](date));
        }
      }
      pattern = pattern.replace(/\0\0/g, '%');
      const bytes = intArrayFromString(pattern, false);

      if (bytes.length > maxsize) {
        return 0;
      }
      writeArrayToMemory(bytes, s);

      return bytes.length - 1;
    };

    const _strftime_l = (s, maxsize, format, tm, loc) => _strftime(s, maxsize, format, tm);

    InternalError = Module.InternalError = class InternalError extends Error {
      constructor(message) {
        super(message);
        this.name = 'InternalError';
      }
    };

    embind_init_charCodes();

    BindingError = Module.BindingError = class BindingError extends Error {
      constructor(message) {
        super(message);
        this.name = 'BindingError';
      }
    };

    init_ClassHandle();

    init_embind();

    init_RegisteredPointer();

    UnboundTypeError = Module.UnboundTypeError = extendError(Error, 'UnboundTypeError');

    init_emval();

    var wasmImports = {
      /** @export */ c: ___assert_fail,
      /** @export */ d: ___cxa_find_matching_catch_2,
      /** @export */ q: ___cxa_throw,
      /** @export */ h: ___resumeException,
      /** @export */ E: ___syscall_fcntl64,
      /** @export */ W: ___syscall_fstat64,
      /** @export */ T: ___syscall_getcwd,
      /** @export */ X: ___syscall_ioctl,
      /** @export */ U: ___syscall_newfstatat,
      /** @export */ D: ___syscall_openat,
      /** @export */ V: ___syscall_stat64,
      /** @export */ A: __embind_finalize_value_object,
      /** @export */ O: __embind_register_bigint,
      /** @export */ ea: __embind_register_bool,
      /** @export */ z: __embind_register_class,
      /** @export */ x: __embind_register_class_constructor,
      /** @export */ i: __embind_register_class_function,
      /** @export */ da: __embind_register_emval,
      /** @export */ B: __embind_register_enum,
      /** @export */ n: __embind_register_enum_value,
      /** @export */ I: __embind_register_float,
      /** @export */ K: __embind_register_function,
      /** @export */ p: __embind_register_integer,
      /** @export */ k: __embind_register_memory_view,
      /** @export */ L: __embind_register_optional,
      /** @export */ ka: __embind_register_smart_ptr,
      /** @export */ J: __embind_register_std_string,
      /** @export */ y: __embind_register_std_wstring,
      /** @export */ u: __embind_register_value_object,
      /** @export */ m: __embind_register_value_object_field,
      /** @export */ fa: __embind_register_void,
      /** @export */ Y: __emscripten_memcpy_js,
      /** @export */ P: __emscripten_throw_longjmp,
      /** @export */ ia: __emval_call,
      /** @export */ R: __emval_decref,
      /** @export */ ha: __emval_get_method_caller,
      /** @export */ ja: __emval_incref,
      /** @export */ ga: __emval_run_destructors,
      /** @export */ t: __emval_take_value,
      /** @export */ ca: _abort,
      /** @export */ l: _emscripten_get_now,
      /** @export */ S: _emscripten_resize_heap,
      /** @export */ Z: _environ_get,
      /** @export */ _: _environ_sizes_get,
      /** @export */ w: _fd_close,
      /** @export */ C: _fd_read,
      /** @export */ N: _fd_seek,
      /** @export */ v: _fd_write,
      /** @export */ $: _getentropy,
      /** @export */ F: invoke_i,
      /** @export */ j: invoke_ii,
      /** @export */ g: invoke_iii,
      /** @export */ e: invoke_iiii,
      /** @export */ ba: invoke_iiiii,
      /** @export */ s: invoke_iiiiii,
      /** @export */ G: invoke_iiiiiiii,
      /** @export */ r: invoke_v,
      /** @export */ b: invoke_vi,
      /** @export */ a: invoke_vii,
      /** @export */ f: invoke_viii,
      /** @export */ o: invoke_viiii,
      /** @export */ H: invoke_viiiii,
      /** @export */ aa: invoke_viiiiii,
      /** @export */ M: invoke_viiij,
      /** @export */ Q: _strftime_l,
    };

    var wasmExports = createWasm();

    var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports.ma)();

    var _malloc = (a0) => (_malloc = wasmExports.na)(a0);

    var ___getTypeName = (a0) => (___getTypeName = wasmExports.oa)(a0);

    var _free = (a0) => (_free = wasmExports.qa)(a0);

    var _htonl = (a0) => (_htonl = wasmExports.htonl)(a0);

    var _htons = (a0) => (_htons = wasmExports.htons)(a0);

    var _ntohs = (a0) => (_ntohs = wasmExports.ntohs)(a0);

    var _setThrew = (a0, a1) => (_setThrew = wasmExports.ra)(a0, a1);

    var __emscripten_tempret_set = (a0) => (__emscripten_tempret_set = wasmExports.sa)(a0);

    var __emscripten_stack_restore = (a0) => (__emscripten_stack_restore = wasmExports.ta)(a0);

    var __emscripten_stack_alloc = (a0) => (__emscripten_stack_alloc = wasmExports._emscripten_stack_alloc)(a0);

    var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports.ua)();

    var ___cxa_increment_exception_refcount = (a0) =>
      (___cxa_increment_exception_refcount = wasmExports.__cxa_increment_exception_refcount)(a0);

    var ___cxa_can_catch = (a0, a1, a2) => (___cxa_can_catch = wasmExports.va)(a0, a1, a2);

    var ___cxa_is_pointer_type = (a0) => (___cxa_is_pointer_type = wasmExports.wa)(a0);

    var dynCall_iijj = (Module.dynCall_iijj = (a0, a1, a2, a3, a4, a5) =>
      (dynCall_iijj = Module.dynCall_iijj = wasmExports.xa)(a0, a1, a2, a3, a4, a5));

    var dynCall_vijj = (Module.dynCall_vijj = (a0, a1, a2, a3, a4, a5) =>
      (dynCall_vijj = Module.dynCall_vijj = wasmExports.ya)(a0, a1, a2, a3, a4, a5));

    var dynCall_jiii = (Module.dynCall_jiii = (a0, a1, a2, a3) =>
      (dynCall_jiii = Module.dynCall_jiii = wasmExports.za)(a0, a1, a2, a3));

    var dynCall_jii = (Module.dynCall_jii = (a0, a1, a2) =>
      (dynCall_jii = Module.dynCall_jii = wasmExports.Aa)(a0, a1, a2));

    var dynCall_viiij = (Module.dynCall_viiij = (a0, a1, a2, a3, a4, a5) =>
      (dynCall_viiij = Module.dynCall_viiij = wasmExports.Ba)(a0, a1, a2, a3, a4, a5));

    var dynCall_jiji = (Module.dynCall_jiji = (a0, a1, a2, a3, a4) =>
      (dynCall_jiji = Module.dynCall_jiji = wasmExports.Ca)(a0, a1, a2, a3, a4));

    var dynCall_viijii = (Module.dynCall_viijii = (a0, a1, a2, a3, a4, a5, a6) =>
      (dynCall_viijii = Module.dynCall_viijii = wasmExports.Da)(a0, a1, a2, a3, a4, a5, a6));

    var dynCall_iiiiij = (Module.dynCall_iiiiij = (a0, a1, a2, a3, a4, a5, a6) =>
      (dynCall_iiiiij = Module.dynCall_iiiiij = wasmExports.Ea)(a0, a1, a2, a3, a4, a5, a6));

    var dynCall_iiiiijj = (Module.dynCall_iiiiijj = (a0, a1, a2, a3, a4, a5, a6, a7, a8) =>
      (dynCall_iiiiijj = Module.dynCall_iiiiijj = wasmExports.Fa)(a0, a1, a2, a3, a4, a5, a6, a7, a8));

    var dynCall_iiiiiijj = (Module.dynCall_iiiiiijj = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) =>
      (dynCall_iiiiiijj = Module.dynCall_iiiiiijj = wasmExports.Ga)(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9));

    function invoke_vi(index, a1) {
      const sp = stackSave();

      try {
        getWasmTableEntry(index)(a1);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    function invoke_iiiii(index, a1, a2, a3, a4) {
      const sp = stackSave();

      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    function invoke_vii(index, a1, a2) {
      const sp = stackSave();

      try {
        getWasmTableEntry(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    function invoke_viii(index, a1, a2, a3) {
      const sp = stackSave();

      try {
        getWasmTableEntry(index)(a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    function invoke_iii(index, a1, a2) {
      const sp = stackSave();

      try {
        return getWasmTableEntry(index)(a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    function invoke_ii(index, a1) {
      const sp = stackSave();

      try {
        return getWasmTableEntry(index)(a1);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    function invoke_viiiii(index, a1, a2, a3, a4, a5) {
      const sp = stackSave();

      try {
        getWasmTableEntry(index)(a1, a2, a3, a4, a5);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    function invoke_v(index) {
      const sp = stackSave();

      try {
        getWasmTableEntry(index)();
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    function invoke_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
      const sp = stackSave();

      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6, a7);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    function invoke_viiii(index, a1, a2, a3, a4) {
      const sp = stackSave();

      try {
        getWasmTableEntry(index)(a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
      const sp = stackSave();

      try {
        return getWasmTableEntry(index)(a1, a2, a3, a4, a5);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    function invoke_iiii(index, a1, a2, a3) {
      const sp = stackSave();

      try {
        return getWasmTableEntry(index)(a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    function invoke_i(index) {
      const sp = stackSave();

      try {
        return getWasmTableEntry(index)();
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
      const sp = stackSave();

      try {
        getWasmTableEntry(index)(a1, a2, a3, a4, a5, a6);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    function invoke_viiij(index, a1, a2, a3, a4, a5) {
      const sp = stackSave();

      try {
        dynCall_viiij(index, a1, a2, a3, a4, a5);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }

    let calledRun;

    dependenciesFulfilled = function runCaller() {
      if (!calledRun) run();
      if (!calledRun) dependenciesFulfilled = runCaller;
    };

    function run() {
      if (runDependencies > 0) {
        return;
      }
      preRun();
      if (runDependencies > 0) {
        return;
      }
      function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module.calledRun = true;
        if (ABORT) return;
        initRuntime();
        readyPromiseResolve(Module);
        if (Module.onRuntimeInitialized) Module.onRuntimeInitialized();
        postRun();
      }
      if (Module.setStatus) {
        Module.setStatus('Running...');
        setTimeout(function () {
          setTimeout(function () {
            Module.setStatus('');
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }

    if (Module.preInit) {
      if (typeof Module.preInit == 'function') Module.preInit = [Module.preInit];
      while (Module.preInit.length > 0) {
        Module.preInit.pop()();
      }
    }

    run();

    return readyPromise;
  };
})();

export default createDotLottiePlayerModule;
