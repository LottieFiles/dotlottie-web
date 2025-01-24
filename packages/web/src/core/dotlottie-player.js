var createDotLottiePlayerModule = (() => {
  var _scriptName = typeof document != 'undefined' ? document.currentScript?.src : undefined;

  return function (moduleArg = {}) {
    var moduleRtn;

    var Module = moduleArg;
    var readyPromiseResolve, readyPromiseReject;
    var readyPromise = new Promise((resolve, reject) => {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });
    var ENVIRONMENT_IS_WEB = typeof window == 'object';
    var ENVIRONMENT_IS_WORKER = typeof WorkerGlobalScope != 'undefined';
    var ENVIRONMENT_IS_NODE =
      typeof process == 'object' &&
      typeof process.versions == 'object' &&
      typeof process.versions.node == 'string' &&
      process.type != 'renderer';
    var moduleOverrides = Object.assign({}, Module);
    var arguments_ = [];
    var thisProgram = './this.program';
    var quit_ = (status, toThrow) => {
      throw toThrow;
    };
    var scriptDirectory = '';
    function locateFile(path) {
      if (Module['locateFile']) {
        return Module['locateFile'](path, scriptDirectory);
      }
      return scriptDirectory + path;
    }
    var readAsync, readBinary;
    if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
      } else if (typeof document != 'undefined' && document.currentScript) {
        scriptDirectory = document.currentScript.src;
      }
      if (_scriptName) {
        scriptDirectory = _scriptName;
      }
      if (scriptDirectory.startsWith('blob:')) {
        scriptDirectory = '';
      } else {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, '').lastIndexOf('/') + 1);
      }
      {
        if (ENVIRONMENT_IS_WORKER) {
          readBinary = (url) => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.responseType = 'arraybuffer';
            xhr.send(null);
            return new Uint8Array(xhr.response);
          };
        }
        readAsync = (url) =>
          fetch(url, { credentials: 'same-origin' }).then((response) => {
            if (response.ok) {
              return response.arrayBuffer();
            }
            return Promise.reject(new Error(response.status + ' : ' + response.url));
          });
      }
    } else {
    }
    var out = Module['print'] || console.log.bind(console);
    var err = Module['printErr'] || console.error.bind(console);
    Object.assign(Module, moduleOverrides);
    moduleOverrides = null;
    if (Module['arguments']) arguments_ = Module['arguments'];
    if (Module['thisProgram']) thisProgram = Module['thisProgram'];
    var wasmBinary = Module['wasmBinary'];
    var wasmMemory;
    var ABORT = false;
    var EXITSTATUS;
    var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
    function updateMemoryViews() {
      var b = wasmMemory.buffer;
      Module['HEAP8'] = HEAP8 = new Int8Array(b);
      Module['HEAP16'] = HEAP16 = new Int16Array(b);
      Module['HEAPU8'] = HEAPU8 = new Uint8Array(b);
      Module['HEAPU16'] = HEAPU16 = new Uint16Array(b);
      Module['HEAP32'] = HEAP32 = new Int32Array(b);
      Module['HEAPU32'] = HEAPU32 = new Uint32Array(b);
      Module['HEAPF32'] = HEAPF32 = new Float32Array(b);
      Module['HEAPF64'] = HEAPF64 = new Float64Array(b);
    }
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATPOSTRUN__ = [];
    var runtimeInitialized = false;
    function preRun() {
      if (Module['preRun']) {
        if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
        while (Module['preRun'].length) {
          addOnPreRun(Module['preRun'].shift());
        }
      }
      callRuntimeCallbacks(__ATPRERUN__);
    }
    function initRuntime() {
      runtimeInitialized = true;
      callRuntimeCallbacks(__ATINIT__);
    }
    function postRun() {
      if (Module['postRun']) {
        if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
        while (Module['postRun'].length) {
          addOnPostRun(Module['postRun'].shift());
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
    var runDependencies = 0;
    var runDependencyWatcher = null;
    var dependenciesFulfilled = null;
    function addRunDependency(id) {
      runDependencies++;
      Module['monitorRunDependencies']?.(runDependencies);
    }
    function removeRunDependency(id) {
      runDependencies--;
      Module['monitorRunDependencies']?.(runDependencies);
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }
    function abort(what) {
      Module['onAbort']?.(what);
      what = 'Aborted(' + what + ')';
      err(what);
      ABORT = true;
      what += '. Build with -sASSERTIONS for more info.';
      var e = new WebAssembly.RuntimeError(what);
      readyPromiseReject(e);
      throw e;
    }
    var dataURIPrefix = 'data:application/octet-stream;base64,';
    var isDataURI = (filename) => filename.startsWith(dataURIPrefix);
    function findWasmBinary() {
      var f = 'DotLottiePlayer.wasm';
      if (!isDataURI(f)) {
        return locateFile(f);
      }
      return f;
    }
    var wasmBinaryFile;
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
      if (!wasmBinary) {
        return readAsync(binaryFile).then(
          (response) => new Uint8Array(response),
          () => getBinarySync(binaryFile),
        );
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
        return fetch(binaryFile, { credentials: 'same-origin' }).then((response) => {
          var result = WebAssembly.instantiateStreaming(response, imports);
          return result.then(callback, function (reason) {
            err(`wasm streaming compile failed: ${reason}`);
            err('falling back to ArrayBuffer instantiation');
            return instantiateArrayBuffer(binaryFile, imports, callback);
          });
        });
      }
      return instantiateArrayBuffer(binaryFile, imports, callback);
    }
    function getWasmImports() {
      return { a: wasmImports };
    }
    function createWasm() {
      function receiveInstance(instance, module) {
        wasmExports = instance.exports;
        wasmExports = Asyncify.instrumentWasmExports(wasmExports);
        wasmMemory = wasmExports['pc'];
        updateMemoryViews();
        wasmTable = wasmExports['tc'];
        addOnInit(wasmExports['qc']);
        removeRunDependency('wasm-instantiate');
        return wasmExports;
      }
      addRunDependency('wasm-instantiate');
      function receiveInstantiationResult(result) {
        receiveInstance(result['instance']);
      }
      var info = getWasmImports();
      if (Module['instantiateWasm']) {
        try {
          return Module['instantiateWasm'](info, receiveInstance);
        } catch (e) {
          err(`Module.instantiateWasm callback failed with error: ${e}`);
          readyPromiseReject(e);
        }
      }
      wasmBinaryFile ??= findWasmBinary();
      instantiateAsync(wasmBinary, wasmBinaryFile, info, receiveInstantiationResult).catch(readyPromiseReject);
      return {};
    }
    var tempDouble;
    var tempI64;
    class ExitStatus {
      name = 'ExitStatus';
      constructor(status) {
        this.message = `Program terminated with exit(${status})`;
        this.status = status;
      }
    }
    var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        callbacks.shift()(Module);
      }
    };
    var noExitRuntime = Module['noExitRuntime'] || true;
    var stackRestore = (val) => __emscripten_stack_restore(val);
    var stackSave = () => _emscripten_stack_get_current();
    var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder() : undefined;
    var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead = NaN) => {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';
      while (idx < endPtr) {
        var u0 = heapOrArray[idx++];
        if (!(u0 & 128)) {
          str += String.fromCharCode(u0);
          continue;
        }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 224) == 192) {
          str += String.fromCharCode(((u0 & 31) << 6) | u1);
          continue;
        }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 240) == 224) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
        if (u0 < 65536) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 65536;
          str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
        }
      }
      return str;
    };
    var UTF8ToString = (ptr, maxBytesToRead) => (ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '');
    var ___assert_fail = (condition, filename, line, func) =>
      abort(
        `Assertion failed: ${UTF8ToString(condition)}, at: ` +
          [
            filename ? UTF8ToString(filename) : 'unknown filename',
            line,
            func ? UTF8ToString(func) : 'unknown function',
          ],
      );
    class ExceptionInfo {
      constructor(excPtr) {
        this.excPtr = excPtr;
        this.ptr = excPtr - 24;
      }
      set_type(type) {
        HEAPU32[(this.ptr + 4) >> 2] = type;
      }
      get_type() {
        return HEAPU32[(this.ptr + 4) >> 2];
      }
      set_destructor(destructor) {
        HEAPU32[(this.ptr + 8) >> 2] = destructor;
      }
      get_destructor() {
        return HEAPU32[(this.ptr + 8) >> 2];
      }
      set_caught(caught) {
        caught = caught ? 1 : 0;
        HEAP8[this.ptr + 12] = caught;
      }
      get_caught() {
        return HEAP8[this.ptr + 12] != 0;
      }
      set_rethrown(rethrown) {
        rethrown = rethrown ? 1 : 0;
        HEAP8[this.ptr + 13] = rethrown;
      }
      get_rethrown() {
        return HEAP8[this.ptr + 13] != 0;
      }
      init(type, destructor) {
        this.set_adjusted_ptr(0);
        this.set_type(type);
        this.set_destructor(destructor);
      }
      set_adjusted_ptr(adjustedPtr) {
        HEAPU32[(this.ptr + 16) >> 2] = adjustedPtr;
      }
      get_adjusted_ptr() {
        return HEAPU32[(this.ptr + 16) >> 2];
      }
    }
    var exceptionLast = 0;
    var uncaughtExceptionCount = 0;
    var ___cxa_throw = (ptr, type, destructor) => {
      var info = new ExceptionInfo(ptr);
      info.init(type, destructor);
      exceptionLast = ptr;
      uncaughtExceptionCount++;
      throw exceptionLast;
    };
    var ___syscall_fstat64 = (fd, buf) => {};
    var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var c = str.charCodeAt(i);
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
    var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      if (!(maxBytesToWrite > 0)) return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i);
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
    var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    var ___syscall_getcwd = (buf, size) => {};
    var ___syscall_newfstatat = (dirfd, path, buf, flags) => {};
    var SYSCALLS = {
      varargs: undefined,
      getStr(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
    };
    function ___syscall_openat(dirfd, path, flags, varargs) {
      SYSCALLS.varargs = varargs;
    }
    var ___syscall_stat64 = (path, buf) => {};
    var __abort_js = () => abort('');
    var structRegistrations = {};
    var runDestructors = (destructors) => {
      while (destructors.length) {
        var ptr = destructors.pop();
        var del = destructors.pop();
        del(ptr);
      }
    };
    function readPointer(pointer) {
      return this['fromWireType'](HEAPU32[pointer >> 2]);
    }
    var awaitingDependencies = {};
    var registeredTypes = {};
    var typeDependencies = {};
    var InternalError;
    var throwInternalError = (message) => {
      throw new InternalError(message);
    };
    var whenDependentTypesAreResolved = (myTypes, dependentTypes, getTypeConverters) => {
      myTypes.forEach((type) => (typeDependencies[type] = dependentTypes));
      function onComplete(typeConverters) {
        var myTypeConverters = getTypeConverters(typeConverters);
        if (myTypeConverters.length !== myTypes.length) {
          throwInternalError('Mismatched type converter count');
        }
        for (var i = 0; i < myTypes.length; ++i) {
          registerType(myTypes[i], myTypeConverters[i]);
        }
      }
      var typeConverters = new Array(dependentTypes.length);
      var unregisteredTypes = [];
      var registered = 0;
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
      if (0 === unregisteredTypes.length) {
        onComplete(typeConverters);
      }
    };
    var __embind_finalize_value_object = (structType) => {
      var reg = structRegistrations[structType];
      delete structRegistrations[structType];
      var rawConstructor = reg.rawConstructor;
      var rawDestructor = reg.rawDestructor;
      var fieldRecords = reg.fields;
      var fieldTypes = fieldRecords
        .map((field) => field.getterReturnType)
        .concat(fieldRecords.map((field) => field.setterArgumentType));
      whenDependentTypesAreResolved([structType], fieldTypes, (fieldTypes) => {
        var fields = {};
        fieldRecords.forEach((field, i) => {
          var fieldName = field.fieldName;
          var getterReturnType = fieldTypes[i];
          var getter = field.getter;
          var getterContext = field.getterContext;
          var setterArgumentType = fieldTypes[i + fieldRecords.length];
          var setter = field.setter;
          var setterContext = field.setterContext;
          fields[fieldName] = {
            read: (ptr) => getterReturnType['fromWireType'](getter(getterContext, ptr)),
            write: (ptr, o) => {
              var destructors = [];
              setter(setterContext, ptr, setterArgumentType['toWireType'](destructors, o));
              runDestructors(destructors);
            },
          };
        });
        return [
          {
            name: reg.name,
            fromWireType: (ptr) => {
              var rv = {};
              for (var i in fields) {
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
              var ptr = rawConstructor();
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
    var __embind_register_bigint = (primitiveType, name, size, minRange, maxRange) => {};
    var embind_init_charCodes = () => {
      var codes = new Array(256);
      for (var i = 0; i < 256; ++i) {
        codes[i] = String.fromCharCode(i);
      }
      embind_charCodes = codes;
    };
    var embind_charCodes;
    var readLatin1String = (ptr) => {
      var ret = '';
      var c = ptr;
      while (HEAPU8[c]) {
        ret += embind_charCodes[HEAPU8[c++]];
      }
      return ret;
    };
    var BindingError;
    var throwBindingError = (message) => {
      throw new BindingError(message);
    };
    function sharedRegisterType(rawType, registeredInstance, options = {}) {
      var name = registeredInstance.name;
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
        var callbacks = awaitingDependencies[rawType];
        delete awaitingDependencies[rawType];
        callbacks.forEach((cb) => cb());
      }
    }
    function registerType(rawType, registeredInstance, options = {}) {
      return sharedRegisterType(rawType, registeredInstance, options);
    }
    var GenericWireTypeSize = 8;
    var __embind_register_bool = (rawType, name, trueValue, falseValue) => {
      name = readLatin1String(name);
      registerType(rawType, {
        name,
        fromWireType: function (wt) {
          return !!wt;
        },
        toWireType: function (destructors, o) {
          return o ? trueValue : falseValue;
        },
        argPackAdvance: GenericWireTypeSize,
        readValueFromPointer: function (pointer) {
          return this['fromWireType'](HEAPU8[pointer]);
        },
        destructorFunction: null,
      });
    };
    var shallowCopyInternalPointer = (o) => ({
      count: o.count,
      deleteScheduled: o.deleteScheduled,
      preservePointerOnDelete: o.preservePointerOnDelete,
      ptr: o.ptr,
      ptrType: o.ptrType,
      smartPtr: o.smartPtr,
      smartPtrType: o.smartPtrType,
    });
    var throwInstanceAlreadyDeleted = (obj) => {
      function getInstanceTypeName(handle) {
        return handle.$$.ptrType.registeredClass.name;
      }
      throwBindingError(getInstanceTypeName(obj) + ' instance already deleted');
    };
    var finalizationRegistry = false;
    var detachFinalizer = (handle) => {};
    var runDestructor = ($$) => {
      if ($$.smartPtr) {
        $$.smartPtrType.rawDestructor($$.smartPtr);
      } else {
        $$.ptrType.registeredClass.rawDestructor($$.ptr);
      }
    };
    var releaseClassHandle = ($$) => {
      $$.count.value -= 1;
      var toDelete = 0 === $$.count.value;
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
      var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
      if (rv === null) {
        return null;
      }
      return desiredClass.downcast(rv);
    };
    var registeredPointers = {};
    var registeredInstances = {};
    var getBasestPointer = (class_, ptr) => {
      if (ptr === undefined) {
        throwBindingError('ptr should not be undefined');
      }
      while (class_.baseClass) {
        ptr = class_.upcast(ptr);
        class_ = class_.baseClass;
      }
      return ptr;
    };
    var getInheritedInstance = (class_, ptr) => {
      ptr = getBasestPointer(class_, ptr);
      return registeredInstances[ptr];
    };
    var makeClassHandle = (prototype, record) => {
      if (!record.ptrType || !record.ptr) {
        throwInternalError('makeClassHandle requires ptr and ptrType');
      }
      var hasSmartPtrType = !!record.smartPtrType;
      var hasSmartPtr = !!record.smartPtr;
      if (hasSmartPtrType !== hasSmartPtr) {
        throwInternalError('Both smartPtrType and smartPtr must be specified');
      }
      record.count = { value: 1 };
      return attachFinalizer(Object.create(prototype, { $$: { value: record, writable: true } }));
    };
    function RegisteredPointer_fromWireType(ptr) {
      var rawPointer = this.getPointee(ptr);
      if (!rawPointer) {
        this.destructor(ptr);
        return null;
      }
      var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
      if (undefined !== registeredInstance) {
        if (0 === registeredInstance.$$.count.value) {
          registeredInstance.$$.ptr = rawPointer;
          registeredInstance.$$.smartPtr = ptr;
          return registeredInstance['clone']();
        } else {
          var rv = registeredInstance['clone']();
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
          return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this, ptr });
        }
      }
      var actualType = this.registeredClass.getActualType(rawPointer);
      var registeredPointerRecord = registeredPointers[actualType];
      if (!registeredPointerRecord) {
        return makeDefaultHandle.call(this);
      }
      var toType;
      if (this.isConst) {
        toType = registeredPointerRecord.constPointerType;
      } else {
        toType = registeredPointerRecord.pointerType;
      }
      var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
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
        return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp });
      }
    }
    var attachFinalizer = (handle) => {
      if ('undefined' === typeof FinalizationRegistry) {
        attachFinalizer = (handle) => handle;
        return handle;
      }
      finalizationRegistry = new FinalizationRegistry((info) => {
        releaseClassHandle(info.$$);
      });
      attachFinalizer = (handle) => {
        var $$ = handle.$$;
        var hasSmartPtr = !!$$.smartPtr;
        if (hasSmartPtr) {
          var info = { $$ };
          finalizationRegistry.register(handle, info, handle);
        }
        return handle;
      };
      detachFinalizer = (handle) => finalizationRegistry.unregister(handle);
      return attachFinalizer(handle);
    };
    var deletionQueue = [];
    var flushPendingDeletes = () => {
      while (deletionQueue.length) {
        var obj = deletionQueue.pop();
        obj.$$.deleteScheduled = false;
        obj['delete']();
      }
    };
    var delayFunction;
    var init_ClassHandle = () => {
      Object.assign(ClassHandle.prototype, {
        isAliasOf(other) {
          if (!(this instanceof ClassHandle)) {
            return false;
          }
          if (!(other instanceof ClassHandle)) {
            return false;
          }
          var leftClass = this.$$.ptrType.registeredClass;
          var left = this.$$.ptr;
          other.$$ = other.$$;
          var rightClass = other.$$.ptrType.registeredClass;
          var right = other.$$.ptr;
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
            var clone = attachFinalizer(
              Object.create(Object.getPrototypeOf(this), { $$: { value: shallowCopyInternalPointer(this.$$) } }),
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
    function ClassHandle() {}
    var createNamedFunction = (name, body) => Object.defineProperty(body, 'name', { value: name });
    var ensureOverloadTable = (proto, methodName, humanName) => {
      if (undefined === proto[methodName].overloadTable) {
        var prevFunc = proto[methodName];
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
    var exposePublicSymbol = (name, value, numArguments) => {
      if (Module.hasOwnProperty(name)) {
        if (
          undefined === numArguments ||
          (undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments])
        ) {
          throwBindingError(`Cannot register public name '${name}' twice`);
        }
        ensureOverloadTable(Module, name, name);
        if (Module[name].overloadTable.hasOwnProperty(numArguments)) {
          throwBindingError(
            `Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`,
          );
        }
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        Module[name].argCount = numArguments;
      }
    };
    var char_0 = 48;
    var char_9 = 57;
    var makeLegalFunctionName = (name) => {
      name = name.replace(/[^a-zA-Z0-9_]/g, '$');
      var f = name.charCodeAt(0);
      if (f >= char_0 && f <= char_9) {
        return `_${name}`;
      }
      return name;
    };
    function RegisteredClass(
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
    var upcastPointer = (ptr, ptrClass, desiredClass) => {
      while (ptrClass !== desiredClass) {
        if (!ptrClass.upcast) {
          throwBindingError(`Expected null or instance of ${desiredClass.name}, got an instance of ${ptrClass.name}`);
        }
        ptr = ptrClass.upcast(ptr);
        ptrClass = ptrClass.baseClass;
      }
      return ptr;
    };
    function constNoSmartPtrRawPointerToWireType(destructors, handle) {
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
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
    function genericPointerToWireType(destructors, handle) {
      var ptr;
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
      var handleClass = handle.$$.ptrType.registeredClass;
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
              var clonedHandle = handle['clone']();
              ptr = this.rawShare(
                ptr,
                Emval.toHandle(() => clonedHandle['delete']()),
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
    function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
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
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
    var init_RegisteredPointer = () => {
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
    function RegisteredPointer(
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
          this['toWireType'] = constNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        } else {
          this['toWireType'] = nonConstNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        }
      } else {
        this['toWireType'] = genericPointerToWireType;
      }
    }
    var replacePublicSymbol = (name, value, numArguments) => {
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
    var dynCallLegacy = (sig, ptr, args) => {
      sig = sig.replace(/p/g, 'i');
      var f = Module['dynCall_' + sig];
      return f(ptr, ...args);
    };
    var wasmTable;
    var dynCall = (sig, ptr, args = []) => {
      var rtn = dynCallLegacy(sig, ptr, args);
      return rtn;
    };
    var getDynCaller =
      (sig, ptr) =>
      (...args) =>
        dynCall(sig, ptr, args);
    var embind__requireFunction = (signature, rawFunction) => {
      signature = readLatin1String(signature);
      function makeDynCaller() {
        return getDynCaller(signature, rawFunction);
      }
      var fp = makeDynCaller();
      if (typeof fp != 'function') {
        throwBindingError(`unknown function pointer with signature ${signature}: ${rawFunction}`);
      }
      return fp;
    };
    var extendError = (baseErrorType, errorName) => {
      var errorClass = createNamedFunction(errorName, function (message) {
        this.name = errorName;
        this.message = message;
        var stack = new Error(message).stack;
        if (stack !== undefined) {
          this.stack = this.toString() + '\n' + stack.replace(/^Error(:[^\n]*)?\n/, '');
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
    var UnboundTypeError;
    var getTypeName = (type) => {
      var ptr = ___getTypeName(type);
      var rv = readLatin1String(ptr);
      _free(ptr);
      return rv;
    };
    var throwUnboundTypeError = (message, types) => {
      var unboundTypes = [];
      var seen = {};
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
      throw new UnboundTypeError(`${message}: ` + unboundTypes.map(getTypeName).join([', ']));
    };
    var __embind_register_class = (
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
      var legalFunctionName = makeLegalFunctionName(name);
      exposePublicSymbol(legalFunctionName, function () {
        throwUnboundTypeError(`Cannot construct ${name} due to unbound types`, [baseClassRawType]);
      });
      whenDependentTypesAreResolved(
        [rawType, rawPointerType, rawConstPointerType],
        baseClassRawType ? [baseClassRawType] : [],
        (base) => {
          base = base[0];
          var baseClass;
          var basePrototype;
          if (baseClassRawType) {
            baseClass = base.registeredClass;
            basePrototype = baseClass.instancePrototype;
          } else {
            basePrototype = ClassHandle.prototype;
          }
          var constructor = createNamedFunction(name, function (...args) {
            if (Object.getPrototypeOf(this) !== instancePrototype) {
              throw new BindingError("Use 'new' to construct " + name);
            }
            if (undefined === registeredClass.constructor_body) {
              throw new BindingError(name + ' has no accessible constructor');
            }
            var body = registeredClass.constructor_body[args.length];
            if (undefined === body) {
              throw new BindingError(
                `Tried to invoke ctor of ${name} with invalid number of parameters (${
                  args.length
                }) - expected (${Object.keys(registeredClass.constructor_body).toString()}) parameters instead!`,
              );
            }
            return body.apply(this, args);
          });
          var instancePrototype = Object.create(basePrototype, { constructor: { value: constructor } });
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
          var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
          var pointerConverter = new RegisteredPointer(name + '*', registeredClass, false, false, false);
          var constPointerConverter = new RegisteredPointer(name + ' const*', registeredClass, false, true, false);
          registeredPointers[rawType] = { pointerType: pointerConverter, constPointerType: constPointerConverter };
          replacePublicSymbol(legalFunctionName, constructor);
          return [referenceConverter, pointerConverter, constPointerConverter];
        },
      );
    };
    var heap32VectorToArray = (count, firstElement) => {
      var array = [];
      for (var i = 0; i < count; i++) {
        array.push(HEAPU32[(firstElement + i * 4) >> 2]);
      }
      return array;
    };
    function usesDestructorStack(argTypes) {
      for (var i = 1; i < argTypes.length; ++i) {
        if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
          return true;
        }
      }
      return false;
    }
    var runAndAbortIfError = (func) => {
      try {
        return func();
      } catch (e) {
        abort(e);
      }
    };
    var handleException = (e) => {
      if (e instanceof ExitStatus || e == 'unwind') {
        return EXITSTATUS;
      }
      quit_(1, e);
    };
    var runtimeKeepaliveCounter = 0;
    var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
    var _proc_exit = (code) => {
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        Module['onExit']?.(code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    };
    var exitJS = (status, implicit) => {
      EXITSTATUS = status;
      _proc_exit(status);
    };
    var _exit = exitJS;
    var maybeExit = () => {
      if (!keepRuntimeAlive()) {
        try {
          _exit(EXITSTATUS);
        } catch (e) {
          handleException(e);
        }
      }
    };
    var callUserCallback = (func) => {
      if (ABORT) {
        return;
      }
      try {
        func();
        maybeExit();
      } catch (e) {
        handleException(e);
      }
    };
    var Asyncify = {
      instrumentWasmImports(imports) {
        var importPattern = /^(invoke_.*|__asyncjs__.*)$/;
        for (let [x, original] of Object.entries(imports)) {
          if (typeof original == 'function') {
            let isAsyncifyImport = original.isAsync || importPattern.test(x);
          }
        }
      },
      instrumentWasmExports(exports) {
        var ret = {};
        for (let [x, original] of Object.entries(exports)) {
          if (typeof original == 'function') {
            ret[x] = (...args) => {
              Asyncify.exportCallStack.push(x);
              try {
                return original(...args);
              } finally {
                if (!ABORT) {
                  var y = Asyncify.exportCallStack.pop();
                  Asyncify.maybeStopUnwind();
                }
              }
            };
          } else {
            ret[x] = original;
          }
        }
        return ret;
      },
      State: { Normal: 0, Unwinding: 1, Rewinding: 2, Disabled: 3 },
      state: 0,
      StackSize: 4096,
      currData: null,
      handleSleepReturnValue: 0,
      exportCallStack: [],
      callStackNameToId: {},
      callStackIdToName: {},
      callStackId: 0,
      asyncPromiseHandlers: null,
      sleepCallbacks: [],
      getCallStackId(funcName) {
        var id = Asyncify.callStackNameToId[funcName];
        if (id === undefined) {
          id = Asyncify.callStackId++;
          Asyncify.callStackNameToId[funcName] = id;
          Asyncify.callStackIdToName[id] = funcName;
        }
        return id;
      },
      maybeStopUnwind() {
        if (Asyncify.currData && Asyncify.state === Asyncify.State.Unwinding && Asyncify.exportCallStack.length === 0) {
          Asyncify.state = Asyncify.State.Normal;
          runAndAbortIfError(_asyncify_stop_unwind);
          if (typeof Fibers != 'undefined') {
            Fibers.trampoline();
          }
        }
      },
      whenDone() {
        return new Promise((resolve, reject) => {
          Asyncify.asyncPromiseHandlers = { resolve, reject };
        });
      },
      allocateData() {
        var ptr = _malloc(12 + Asyncify.StackSize);
        Asyncify.setDataHeader(ptr, ptr + 12, Asyncify.StackSize);
        Asyncify.setDataRewindFunc(ptr);
        return ptr;
      },
      setDataHeader(ptr, stack, stackSize) {
        HEAPU32[ptr >> 2] = stack;
        HEAPU32[(ptr + 4) >> 2] = stack + stackSize;
      },
      setDataRewindFunc(ptr) {
        var bottomOfCallStack = Asyncify.exportCallStack[0];
        var rewindId = Asyncify.getCallStackId(bottomOfCallStack);
        HEAP32[(ptr + 8) >> 2] = rewindId;
      },
      getDataRewindFuncName(ptr) {
        var id = HEAP32[(ptr + 8) >> 2];
        var name = Asyncify.callStackIdToName[id];
        return name;
      },
      getDataRewindFunc(name) {
        var func = wasmExports[name];
        return func;
      },
      doRewind(ptr) {
        var name = Asyncify.getDataRewindFuncName(ptr);
        var func = Asyncify.getDataRewindFunc(name);
        return func();
      },
      handleSleep(startAsync) {
        if (ABORT) return;
        if (Asyncify.state === Asyncify.State.Normal) {
          var reachedCallback = false;
          var reachedAfterCallback = false;
          startAsync((handleSleepReturnValue = 0) => {
            if (ABORT) return;
            Asyncify.handleSleepReturnValue = handleSleepReturnValue;
            reachedCallback = true;
            if (!reachedAfterCallback) {
              return;
            }
            Asyncify.state = Asyncify.State.Rewinding;
            runAndAbortIfError(() => _asyncify_start_rewind(Asyncify.currData));
            if (typeof MainLoop != 'undefined' && MainLoop.func) {
              MainLoop.resume();
            }
            var asyncWasmReturnValue,
              isError = false;
            try {
              asyncWasmReturnValue = Asyncify.doRewind(Asyncify.currData);
            } catch (err) {
              asyncWasmReturnValue = err;
              isError = true;
            }
            var handled = false;
            if (!Asyncify.currData) {
              var asyncPromiseHandlers = Asyncify.asyncPromiseHandlers;
              if (asyncPromiseHandlers) {
                Asyncify.asyncPromiseHandlers = null;
                (isError ? asyncPromiseHandlers.reject : asyncPromiseHandlers.resolve)(asyncWasmReturnValue);
                handled = true;
              }
            }
            if (isError && !handled) {
              throw asyncWasmReturnValue;
            }
          });
          reachedAfterCallback = true;
          if (!reachedCallback) {
            Asyncify.state = Asyncify.State.Unwinding;
            Asyncify.currData = Asyncify.allocateData();
            if (typeof MainLoop != 'undefined' && MainLoop.func) {
              MainLoop.pause();
            }
            runAndAbortIfError(() => _asyncify_start_unwind(Asyncify.currData));
          }
        } else if (Asyncify.state === Asyncify.State.Rewinding) {
          Asyncify.state = Asyncify.State.Normal;
          runAndAbortIfError(_asyncify_stop_rewind);
          _free(Asyncify.currData);
          Asyncify.currData = null;
          Asyncify.sleepCallbacks.forEach(callUserCallback);
        } else {
          abort(`invalid state: ${Asyncify.state}`);
        }
        return Asyncify.handleSleepReturnValue;
      },
      handleAsync(startAsync) {
        return Asyncify.handleSleep((wakeUp) => {
          startAsync().then(wakeUp);
        });
      },
    };
    function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc, isAsync) {
      var argCount = argTypes.length;
      if (argCount < 2) {
        throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
      }
      var isClassMethodFunc = argTypes[1] !== null && classType !== null;
      var needsDestructorStack = usesDestructorStack(argTypes);
      var returns = argTypes[0].name !== 'void';
      var expectedArgCount = argCount - 2;
      var argsWired = new Array(expectedArgCount);
      var invokerFuncArgs = [];
      var destructors = [];
      var invokerFn = function (...args) {
        destructors.length = 0;
        var thisWired;
        invokerFuncArgs.length = isClassMethodFunc ? 2 : 1;
        invokerFuncArgs[0] = cppTargetFunc;
        if (isClassMethodFunc) {
          thisWired = argTypes[1]['toWireType'](destructors, this);
          invokerFuncArgs[1] = thisWired;
        }
        for (var i = 0; i < expectedArgCount; ++i) {
          argsWired[i] = argTypes[i + 2]['toWireType'](destructors, args[i]);
          invokerFuncArgs.push(argsWired[i]);
        }
        var rv = cppInvokerFunc(...invokerFuncArgs);
        function onDone(rv) {
          if (needsDestructorStack) {
            runDestructors(destructors);
          } else {
            for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; i++) {
              var param = i === 1 ? thisWired : argsWired[i - 2];
              if (argTypes[i].destructorFunction !== null) {
                argTypes[i].destructorFunction(param);
              }
            }
          }
          if (returns) {
            return argTypes[0]['fromWireType'](rv);
          }
        }
        if (Asyncify.currData) {
          return Asyncify.whenDone().then(onDone);
        }
        return onDone(rv);
      };
      return createNamedFunction(humanName, invokerFn);
    }
    var __embind_register_class_constructor = (
      rawClassType,
      argCount,
      rawArgTypesAddr,
      invokerSignature,
      invoker,
      rawConstructor,
    ) => {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      invoker = embind__requireFunction(invokerSignature, invoker);
      whenDependentTypesAreResolved([], [rawClassType], (classType) => {
        classType = classType[0];
        var humanName = `constructor ${classType.name}`;
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
    var getFunctionName = (signature) => {
      signature = signature.trim();
      const argsIndex = signature.indexOf('(');
      if (argsIndex !== -1) {
        return signature.substr(0, argsIndex);
      } else {
        return signature;
      }
    };
    var __embind_register_class_function = (
      rawClassType,
      methodName,
      argCount,
      rawArgTypesAddr,
      invokerSignature,
      rawInvoker,
      context,
      isPureVirtual,
      isAsync,
      isNonnullReturn,
    ) => {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      methodName = readLatin1String(methodName);
      methodName = getFunctionName(methodName);
      rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
      whenDependentTypesAreResolved([], [rawClassType], (classType) => {
        classType = classType[0];
        var humanName = `${classType.name}.${methodName}`;
        if (methodName.startsWith('@@')) {
          methodName = Symbol[methodName.substring(2)];
        }
        if (isPureVirtual) {
          classType.registeredClass.pureVirtualFunctions.push(methodName);
        }
        function unboundTypesHandler() {
          throwUnboundTypeError(`Cannot call ${humanName} due to unbound types`, rawArgTypes);
        }
        var proto = classType.registeredClass.instancePrototype;
        var method = proto[methodName];
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
          var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context, isAsync);
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
    var emval_freelist = [];
    var emval_handles = [];
    var __emval_decref = (handle) => {
      if (handle > 9 && 0 === --emval_handles[handle + 1]) {
        emval_handles[handle] = undefined;
        emval_freelist.push(handle);
      }
    };
    var count_emval_handles = () => emval_handles.length / 2 - 5 - emval_freelist.length;
    var init_emval = () => {
      emval_handles.push(0, 1, undefined, 1, null, 1, true, 1, false, 1);
      Module['count_emval_handles'] = count_emval_handles;
    };
    var Emval = {
      toValue: (handle) => {
        if (!handle) {
          throwBindingError('Cannot use deleted val. handle = ' + handle);
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
    var EmValType = {
      name: 'emscripten::val',
      fromWireType: (handle) => {
        var rv = Emval.toValue(handle);
        __emval_decref(handle);
        return rv;
      },
      toWireType: (destructors, value) => Emval.toHandle(value),
      argPackAdvance: GenericWireTypeSize,
      readValueFromPointer: readPointer,
      destructorFunction: null,
    };
    var __embind_register_emval = (rawType) => registerType(rawType, EmValType);
    var enumReadValueFromPointer = (name, width, signed) => {
      switch (width) {
        case 1:
          return signed
            ? function (pointer) {
                return this['fromWireType'](HEAP8[pointer]);
              }
            : function (pointer) {
                return this['fromWireType'](HEAPU8[pointer]);
              };
        case 2:
          return signed
            ? function (pointer) {
                return this['fromWireType'](HEAP16[pointer >> 1]);
              }
            : function (pointer) {
                return this['fromWireType'](HEAPU16[pointer >> 1]);
              };
        case 4:
          return signed
            ? function (pointer) {
                return this['fromWireType'](HEAP32[pointer >> 2]);
              }
            : function (pointer) {
                return this['fromWireType'](HEAPU32[pointer >> 2]);
              };
        default:
          throw new TypeError(`invalid integer width (${width}): ${name}`);
      }
    };
    var __embind_register_enum = (rawType, name, size, isSigned) => {
      name = readLatin1String(name);
      function ctor() {}
      ctor.values = {};
      registerType(rawType, {
        name,
        constructor: ctor,
        fromWireType: function (c) {
          return this.constructor.values[c];
        },
        toWireType: (destructors, c) => c.value,
        argPackAdvance: GenericWireTypeSize,
        readValueFromPointer: enumReadValueFromPointer(name, size, isSigned),
        destructorFunction: null,
      });
      exposePublicSymbol(name, ctor);
    };
    var requireRegisteredType = (rawType, humanName) => {
      var impl = registeredTypes[rawType];
      if (undefined === impl) {
        throwBindingError(`${humanName} has unknown type ${getTypeName(rawType)}`);
      }
      return impl;
    };
    var __embind_register_enum_value = (rawEnumType, name, enumValue) => {
      var enumType = requireRegisteredType(rawEnumType, 'enum');
      name = readLatin1String(name);
      var Enum = enumType.constructor;
      var Value = Object.create(enumType.constructor.prototype, {
        value: { value: enumValue },
        constructor: { value: createNamedFunction(`${enumType.name}_${name}`, function () {}) },
      });
      Enum.values[enumValue] = Value;
      Enum[name] = Value;
    };
    var embindRepr = (v) => {
      if (v === null) {
        return 'null';
      }
      var t = typeof v;
      if (t === 'object' || t === 'array' || t === 'function') {
        return v.toString();
      } else {
        return '' + v;
      }
    };
    var floatReadValueFromPointer = (name, width) => {
      switch (width) {
        case 4:
          return function (pointer) {
            return this['fromWireType'](HEAPF32[pointer >> 2]);
          };
        case 8:
          return function (pointer) {
            return this['fromWireType'](HEAPF64[pointer >> 3]);
          };
        default:
          throw new TypeError(`invalid float width (${width}): ${name}`);
      }
    };
    var __embind_register_float = (rawType, name, size) => {
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
    var __embind_register_function = (
      name,
      argCount,
      rawArgTypesAddr,
      signature,
      rawInvoker,
      fn,
      isAsync,
      isNonnullReturn,
    ) => {
      var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
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
        var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
        replacePublicSymbol(
          name,
          craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn, isAsync),
          argCount - 1,
        );
        return [];
      });
    };
    var integerReadValueFromPointer = (name, width, signed) => {
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
    var __embind_register_integer = (primitiveType, name, size, minRange, maxRange) => {
      name = readLatin1String(name);
      if (maxRange === -1) {
        maxRange = 4294967295;
      }
      var fromWireType = (value) => value;
      if (minRange === 0) {
        var bitshift = 32 - 8 * size;
        fromWireType = (value) => (value << bitshift) >>> bitshift;
      }
      var isUnsignedType = name.includes('unsigned');
      var checkAssertions = (value, toTypeName) => {};
      var toWireType;
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
    var __embind_register_memory_view = (rawType, dataTypeIndex, name) => {
      var typeMapping = [
        Int8Array,
        Uint8Array,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array,
      ];
      var TA = typeMapping[dataTypeIndex];
      function decodeMemoryView(handle) {
        var size = HEAPU32[handle >> 2];
        var data = HEAPU32[(handle + 4) >> 2];
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
        { ignoreDuplicateRegistrations: true },
      );
    };
    var EmValOptionalType = Object.assign({ optional: true }, EmValType);
    var __embind_register_optional = (rawOptionalType, rawType) => {
      registerType(rawOptionalType, EmValOptionalType);
    };
    var __embind_register_smart_ptr = (
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
        var registeredPointer = new RegisteredPointer(
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
    var __embind_register_std_string = (rawType, name) => {
      name = readLatin1String(name);
      var stdStringIsUTF8 = name === 'std::string';
      registerType(rawType, {
        name,
        fromWireType(value) {
          var length = HEAPU32[value >> 2];
          var payload = value + 4;
          var str;
          if (stdStringIsUTF8) {
            var decodeStartPtr = payload;
            for (var i = 0; i <= length; ++i) {
              var currentBytePtr = payload + i;
              if (i == length || HEAPU8[currentBytePtr] == 0) {
                var maxRead = currentBytePtr - decodeStartPtr;
                var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
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
            var a = new Array(length);
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
          var length;
          var valueIsOfTypeString = typeof value == 'string';
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
          var base = _malloc(4 + length + 1);
          var ptr = base + 4;
          HEAPU32[base >> 2] = length;
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            stringToUTF8(value, ptr, length + 1);
          } else {
            if (valueIsOfTypeString) {
              for (var i = 0; i < length; ++i) {
                var charCode = value.charCodeAt(i);
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
    var UTF16Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf-16le') : undefined;
    var UTF16ToString = (ptr, maxBytesToRead) => {
      var endPtr = ptr;
      var idx = endPtr >> 1;
      var maxIdx = idx + maxBytesToRead / 2;
      while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
      endPtr = idx << 1;
      if (endPtr - ptr > 32 && UTF16Decoder) return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
      var str = '';
      for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
        var codeUnit = HEAP16[(ptr + i * 2) >> 1];
        if (codeUnit == 0) break;
        str += String.fromCharCode(codeUnit);
      }
      return str;
    };
    var stringToUTF16 = (str, outPtr, maxBytesToWrite) => {
      maxBytesToWrite ??= 2147483647;
      if (maxBytesToWrite < 2) return 0;
      maxBytesToWrite -= 2;
      var startPtr = outPtr;
      var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
      for (var i = 0; i < numCharsToWrite; ++i) {
        var codeUnit = str.charCodeAt(i);
        HEAP16[outPtr >> 1] = codeUnit;
        outPtr += 2;
      }
      HEAP16[outPtr >> 1] = 0;
      return outPtr - startPtr;
    };
    var lengthBytesUTF16 = (str) => str.length * 2;
    var UTF32ToString = (ptr, maxBytesToRead) => {
      var i = 0;
      var str = '';
      while (!(i >= maxBytesToRead / 4)) {
        var utf32 = HEAP32[(ptr + i * 4) >> 2];
        if (utf32 == 0) break;
        ++i;
        if (utf32 >= 65536) {
          var ch = utf32 - 65536;
          str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
        } else {
          str += String.fromCharCode(utf32);
        }
      }
      return str;
    };
    var stringToUTF32 = (str, outPtr, maxBytesToWrite) => {
      maxBytesToWrite ??= 2147483647;
      if (maxBytesToWrite < 4) return 0;
      var startPtr = outPtr;
      var endPtr = startPtr + maxBytesToWrite - 4;
      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343) {
          var trailSurrogate = str.charCodeAt(++i);
          codeUnit = (65536 + ((codeUnit & 1023) << 10)) | (trailSurrogate & 1023);
        }
        HEAP32[outPtr >> 2] = codeUnit;
        outPtr += 4;
        if (outPtr + 4 > endPtr) break;
      }
      HEAP32[outPtr >> 2] = 0;
      return outPtr - startPtr;
    };
    var lengthBytesUTF32 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
        len += 4;
      }
      return len;
    };
    var __embind_register_std_wstring = (rawType, charSize, name) => {
      name = readLatin1String(name);
      var decodeString, encodeString, readCharAt, lengthBytesUTF;
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
          var length = HEAPU32[value >> 2];
          var str;
          var decodeStartPtr = value + 4;
          for (var i = 0; i <= length; ++i) {
            var currentBytePtr = value + 4 + i * charSize;
            if (i == length || readCharAt(currentBytePtr) == 0) {
              var maxReadBytes = currentBytePtr - decodeStartPtr;
              var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
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
          var length = lengthBytesUTF(value);
          var ptr = _malloc(4 + length + charSize);
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
    var __embind_register_value_object = (
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
    var __embind_register_value_object_field = (
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
    var __embind_register_void = (rawType, name) => {
      name = readLatin1String(name);
      registerType(rawType, {
        isVoid: true,
        name,
        argPackAdvance: 0,
        fromWireType: () => undefined,
        toWireType: (destructors, o) => undefined,
      });
    };
    var __emscripten_memcpy_js = (dest, src, num) => HEAPU8.copyWithin(dest, src, src + num);
    var __emscripten_runtime_keepalive_clear = () => {
      noExitRuntime = false;
      runtimeKeepaliveCounter = 0;
    };
    var __emscripten_throw_longjmp = () => {
      throw Infinity;
    };
    var emval_methodCallers = [];
    var __emval_call = (caller, handle, destructorsRef, args) => {
      caller = emval_methodCallers[caller];
      handle = Emval.toValue(handle);
      return caller(null, handle, destructorsRef, args);
    };
    var emval_addMethodCaller = (caller) => {
      var id = emval_methodCallers.length;
      emval_methodCallers.push(caller);
      return id;
    };
    var emval_lookupTypes = (argCount, argTypes) => {
      var a = new Array(argCount);
      for (var i = 0; i < argCount; ++i) {
        a[i] = requireRegisteredType(HEAPU32[(argTypes + i * 4) >> 2], 'parameter ' + i);
      }
      return a;
    };
    var reflectConstruct = Reflect.construct;
    var emval_returnValue = (returnType, destructorsRef, handle) => {
      var destructors = [];
      var result = returnType['toWireType'](destructors, handle);
      if (destructors.length) {
        HEAPU32[destructorsRef >> 2] = Emval.toHandle(destructors);
      }
      return result;
    };
    var __emval_get_method_caller = (argCount, argTypes, kind) => {
      var types = emval_lookupTypes(argCount, argTypes);
      var retType = types.shift();
      argCount--;
      var argN = new Array(argCount);
      var invokerFunction = (obj, func, destructorsRef, args) => {
        var offset = 0;
        for (var i = 0; i < argCount; ++i) {
          argN[i] = types[i]['readValueFromPointer'](args + offset);
          offset += types[i].argPackAdvance;
        }
        var rv = kind === 1 ? reflectConstruct(func, argN) : func.apply(obj, argN);
        return emval_returnValue(retType, destructorsRef, rv);
      };
      var functionName = `methodCaller<(${types.map((t) => t.name).join(', ')}) => ${retType.name}>`;
      return emval_addMethodCaller(createNamedFunction(functionName, invokerFunction));
    };
    var __emval_incref = (handle) => {
      if (handle > 9) {
        emval_handles[handle + 1] += 1;
      }
    };
    var __emval_run_destructors = (handle) => {
      var destructors = Emval.toValue(handle);
      runDestructors(destructors);
      __emval_decref(handle);
    };
    var __emval_take_value = (type, arg) => {
      type = requireRegisteredType(type, '_emval_take_value');
      var v = type['readValueFromPointer'](arg);
      return Emval.toHandle(v);
    };
    var timers = {};
    var _emscripten_get_now = () => performance.now();
    var __setitimer_js = (which, timeout_ms) => {
      if (timers[which]) {
        clearTimeout(timers[which].id);
        delete timers[which];
      }
      if (!timeout_ms) return 0;
      var id = setTimeout(() => {
        delete timers[which];
        callUserCallback(() => __emscripten_timeout(which, _emscripten_get_now()));
      }, timeout_ms);
      timers[which] = { id, timeout_ms };
      return 0;
    };
    var __tzset_js = (timezone, daylight, std_name, dst_name) => {
      var currentYear = new Date().getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      var winterOffset = winter.getTimezoneOffset();
      var summerOffset = summer.getTimezoneOffset();
      var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
      HEAPU32[timezone >> 2] = stdTimezoneOffset * 60;
      HEAP32[daylight >> 2] = Number(winterOffset != summerOffset);
      var extractZone = (timezoneOffset) => {
        var sign = timezoneOffset >= 0 ? '-' : '+';
        var absOffset = Math.abs(timezoneOffset);
        var hours = String(Math.floor(absOffset / 60)).padStart(2, '0');
        var minutes = String(absOffset % 60).padStart(2, '0');
        return `UTC${sign}${hours}${minutes}`;
      };
      var winterName = extractZone(winterOffset);
      var summerName = extractZone(summerOffset);
      if (summerOffset < winterOffset) {
        stringToUTF8(winterName, std_name, 17);
        stringToUTF8(summerName, dst_name, 17);
      } else {
        stringToUTF8(winterName, dst_name, 17);
        stringToUTF8(summerName, std_name, 17);
      }
    };
    var getHeapMax = () => 2147483648;
    var alignMemory = (size, alignment) => Math.ceil(size / alignment) * alignment;
    var growMemory = (size) => {
      var b = wasmMemory.buffer;
      var pages = ((size - b.byteLength + 65535) / 65536) | 0;
      try {
        wasmMemory.grow(pages);
        updateMemoryViews();
        return 1;
      } catch (e) {}
    };
    var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      requestedSize >>>= 0;
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        return false;
      }
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
        var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
        var replacement = growMemory(newSize);
        if (replacement) {
          return true;
        }
      }
      return false;
    };
    var GLctx;
    var webgl_enable_ANGLE_instanced_arrays = (ctx) => {
      var ext = ctx.getExtension('ANGLE_instanced_arrays');
      if (ext) {
        ctx['vertexAttribDivisor'] = (index, divisor) => ext['vertexAttribDivisorANGLE'](index, divisor);
        ctx['drawArraysInstanced'] = (mode, first, count, primcount) =>
          ext['drawArraysInstancedANGLE'](mode, first, count, primcount);
        ctx['drawElementsInstanced'] = (mode, count, type, indices, primcount) =>
          ext['drawElementsInstancedANGLE'](mode, count, type, indices, primcount);
        return 1;
      }
    };
    var webgl_enable_OES_vertex_array_object = (ctx) => {
      var ext = ctx.getExtension('OES_vertex_array_object');
      if (ext) {
        ctx['createVertexArray'] = () => ext['createVertexArrayOES']();
        ctx['deleteVertexArray'] = (vao) => ext['deleteVertexArrayOES'](vao);
        ctx['bindVertexArray'] = (vao) => ext['bindVertexArrayOES'](vao);
        ctx['isVertexArray'] = (vao) => ext['isVertexArrayOES'](vao);
        return 1;
      }
    };
    var webgl_enable_WEBGL_draw_buffers = (ctx) => {
      var ext = ctx.getExtension('WEBGL_draw_buffers');
      if (ext) {
        ctx['drawBuffers'] = (n, bufs) => ext['drawBuffersWEBGL'](n, bufs);
        return 1;
      }
    };
    var webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance = (ctx) =>
      !!(ctx.dibvbi = ctx.getExtension('WEBGL_draw_instanced_base_vertex_base_instance'));
    var webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance = (ctx) =>
      !!(ctx.mdibvbi = ctx.getExtension('WEBGL_multi_draw_instanced_base_vertex_base_instance'));
    var webgl_enable_EXT_polygon_offset_clamp = (ctx) =>
      !!(ctx.extPolygonOffsetClamp = ctx.getExtension('EXT_polygon_offset_clamp'));
    var webgl_enable_EXT_clip_control = (ctx) => !!(ctx.extClipControl = ctx.getExtension('EXT_clip_control'));
    var webgl_enable_WEBGL_polygon_mode = (ctx) => !!(ctx.webglPolygonMode = ctx.getExtension('WEBGL_polygon_mode'));
    var webgl_enable_WEBGL_multi_draw = (ctx) => !!(ctx.multiDrawWebgl = ctx.getExtension('WEBGL_multi_draw'));
    var getEmscriptenSupportedExtensions = (ctx) => {
      var supportedExtensions = [
        'ANGLE_instanced_arrays',
        'EXT_blend_minmax',
        'EXT_disjoint_timer_query',
        'EXT_frag_depth',
        'EXT_shader_texture_lod',
        'EXT_sRGB',
        'OES_element_index_uint',
        'OES_fbo_render_mipmap',
        'OES_standard_derivatives',
        'OES_texture_float',
        'OES_texture_half_float',
        'OES_texture_half_float_linear',
        'OES_vertex_array_object',
        'WEBGL_color_buffer_float',
        'WEBGL_depth_texture',
        'WEBGL_draw_buffers',
        'EXT_color_buffer_float',
        'EXT_conservative_depth',
        'EXT_disjoint_timer_query_webgl2',
        'EXT_texture_norm16',
        'NV_shader_noperspective_interpolation',
        'WEBGL_clip_cull_distance',
        'EXT_clip_control',
        'EXT_color_buffer_half_float',
        'EXT_depth_clamp',
        'EXT_float_blend',
        'EXT_polygon_offset_clamp',
        'EXT_texture_compression_bptc',
        'EXT_texture_compression_rgtc',
        'EXT_texture_filter_anisotropic',
        'KHR_parallel_shader_compile',
        'OES_texture_float_linear',
        'WEBGL_blend_func_extended',
        'WEBGL_compressed_texture_astc',
        'WEBGL_compressed_texture_etc',
        'WEBGL_compressed_texture_etc1',
        'WEBGL_compressed_texture_s3tc',
        'WEBGL_compressed_texture_s3tc_srgb',
        'WEBGL_debug_renderer_info',
        'WEBGL_debug_shaders',
        'WEBGL_lose_context',
        'WEBGL_multi_draw',
        'WEBGL_polygon_mode',
      ];
      return (ctx.getSupportedExtensions() || []).filter((ext) => supportedExtensions.includes(ext));
    };
    var registerPreMainLoop = (f) => {
      typeof MainLoop != 'undefined' && MainLoop.preMainLoop.push(f);
    };
    var GL = {
      counter: 1,
      buffers: [],
      mappedBuffers: {},
      programs: [],
      framebuffers: [],
      renderbuffers: [],
      textures: [],
      shaders: [],
      vaos: [],
      contexts: [],
      offscreenCanvases: {},
      queries: [],
      samplers: [],
      transformFeedbacks: [],
      syncs: [],
      byteSizeByTypeRoot: 5120,
      byteSizeByType: [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
      stringCache: {},
      stringiCache: {},
      unpackAlignment: 4,
      unpackRowLength: 0,
      recordError: (errorCode) => {
        if (!GL.lastError) {
          GL.lastError = errorCode;
        }
      },
      getNewId: (table) => {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
          table[i] = null;
        }
        return ret;
      },
      genObject: (n, buffers, createFunction, objectTable) => {
        for (var i = 0; i < n; i++) {
          var buffer = GLctx[createFunction]();
          var id = buffer && GL.getNewId(objectTable);
          if (buffer) {
            buffer.name = id;
            objectTable[id] = buffer;
          } else {
            GL.recordError(1282);
          }
          HEAP32[(buffers + i * 4) >> 2] = id;
        }
      },
      MAX_TEMP_BUFFER_SIZE: 2097152,
      numTempVertexBuffersPerSize: 64,
      log2ceilLookup: (i) => 32 - Math.clz32(i === 0 ? 0 : i - 1),
      generateTempBuffers: (quads, context) => {
        var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
        context.tempVertexBufferCounters1 = [];
        context.tempVertexBufferCounters2 = [];
        context.tempVertexBufferCounters1.length = context.tempVertexBufferCounters2.length = largestIndex + 1;
        context.tempVertexBuffers1 = [];
        context.tempVertexBuffers2 = [];
        context.tempVertexBuffers1.length = context.tempVertexBuffers2.length = largestIndex + 1;
        context.tempIndexBuffers = [];
        context.tempIndexBuffers.length = largestIndex + 1;
        for (var i = 0; i <= largestIndex; ++i) {
          context.tempIndexBuffers[i] = null;
          context.tempVertexBufferCounters1[i] = context.tempVertexBufferCounters2[i] = 0;
          var ringbufferLength = GL.numTempVertexBuffersPerSize;
          context.tempVertexBuffers1[i] = [];
          context.tempVertexBuffers2[i] = [];
          var ringbuffer1 = context.tempVertexBuffers1[i];
          var ringbuffer2 = context.tempVertexBuffers2[i];
          ringbuffer1.length = ringbuffer2.length = ringbufferLength;
          for (var j = 0; j < ringbufferLength; ++j) {
            ringbuffer1[j] = ringbuffer2[j] = null;
          }
        }
        if (quads) {
          context.tempQuadIndexBuffer = GLctx.createBuffer();
          context.GLctx.bindBuffer(34963, context.tempQuadIndexBuffer);
          var numIndexes = GL.MAX_TEMP_BUFFER_SIZE >> 1;
          var quadIndexes = new Uint16Array(numIndexes);
          var i = 0,
            v = 0;
          while (1) {
            quadIndexes[i++] = v;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v + 1;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v + 2;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v + 2;
            if (i >= numIndexes) break;
            quadIndexes[i++] = v + 3;
            if (i >= numIndexes) break;
            v += 4;
          }
          context.GLctx.bufferData(34963, quadIndexes, 35044);
          context.GLctx.bindBuffer(34963, null);
        }
      },
      getTempVertexBuffer: (sizeBytes) => {
        var idx = GL.log2ceilLookup(sizeBytes);
        var ringbuffer = GL.currentContext.tempVertexBuffers1[idx];
        var nextFreeBufferIndex = GL.currentContext.tempVertexBufferCounters1[idx];
        GL.currentContext.tempVertexBufferCounters1[idx] =
          (GL.currentContext.tempVertexBufferCounters1[idx] + 1) & (GL.numTempVertexBuffersPerSize - 1);
        var vbo = ringbuffer[nextFreeBufferIndex];
        if (vbo) {
          return vbo;
        }
        var prevVBO = GLctx.getParameter(34964);
        ringbuffer[nextFreeBufferIndex] = GLctx.createBuffer();
        GLctx.bindBuffer(34962, ringbuffer[nextFreeBufferIndex]);
        GLctx.bufferData(34962, 1 << idx, 35048);
        GLctx.bindBuffer(34962, prevVBO);
        return ringbuffer[nextFreeBufferIndex];
      },
      getTempIndexBuffer: (sizeBytes) => {
        var idx = GL.log2ceilLookup(sizeBytes);
        var ibo = GL.currentContext.tempIndexBuffers[idx];
        if (ibo) {
          return ibo;
        }
        var prevIBO = GLctx.getParameter(34965);
        GL.currentContext.tempIndexBuffers[idx] = GLctx.createBuffer();
        GLctx.bindBuffer(34963, GL.currentContext.tempIndexBuffers[idx]);
        GLctx.bufferData(34963, 1 << idx, 35048);
        GLctx.bindBuffer(34963, prevIBO);
        return GL.currentContext.tempIndexBuffers[idx];
      },
      newRenderingFrameStarted: () => {
        if (!GL.currentContext) {
          return;
        }
        var vb = GL.currentContext.tempVertexBuffers1;
        GL.currentContext.tempVertexBuffers1 = GL.currentContext.tempVertexBuffers2;
        GL.currentContext.tempVertexBuffers2 = vb;
        vb = GL.currentContext.tempVertexBufferCounters1;
        GL.currentContext.tempVertexBufferCounters1 = GL.currentContext.tempVertexBufferCounters2;
        GL.currentContext.tempVertexBufferCounters2 = vb;
        var largestIndex = GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);
        for (var i = 0; i <= largestIndex; ++i) {
          GL.currentContext.tempVertexBufferCounters1[i] = 0;
        }
      },
      getSource: (shader, count, string, length) => {
        var source = '';
        for (var i = 0; i < count; ++i) {
          var len = length ? HEAPU32[(length + i * 4) >> 2] : undefined;
          source += UTF8ToString(HEAPU32[(string + i * 4) >> 2], len);
        }
        return source;
      },
      calcBufLength: (size, type, stride, count) => {
        if (stride > 0) {
          return count * stride;
        }
        var typeSize = GL.byteSizeByType[type - GL.byteSizeByTypeRoot];
        return size * typeSize * count;
      },
      usedTempBuffers: [],
      preDrawHandleClientVertexAttribBindings: (count) => {
        GL.resetBufferBinding = false;
        for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
          var cb = GL.currentContext.clientBuffers[i];
          if (!cb.clientside || !cb.enabled) continue;
          GL.resetBufferBinding = true;
          var size = GL.calcBufLength(cb.size, cb.type, cb.stride, count);
          var buf = GL.getTempVertexBuffer(size);
          GLctx.bindBuffer(34962, buf);
          GLctx.bufferSubData(34962, 0, HEAPU8.subarray(cb.ptr, cb.ptr + size));
          cb.vertexAttribPointerAdaptor.call(GLctx, i, cb.size, cb.type, cb.normalized, cb.stride, 0);
        }
      },
      postDrawHandleClientVertexAttribBindings: () => {
        if (GL.resetBufferBinding) {
          GLctx.bindBuffer(34962, GL.buffers[GLctx.currentArrayBufferBinding]);
        }
      },
      createContext: (canvas, webGLContextAttributes) => {
        if (!canvas.getContextSafariWebGL2Fixed) {
          canvas.getContextSafariWebGL2Fixed = canvas.getContext;
          function fixedGetContext(ver, attrs) {
            var gl = canvas.getContextSafariWebGL2Fixed(ver, attrs);
            return (ver == 'webgl') == gl instanceof WebGLRenderingContext ? gl : null;
          }
          canvas.getContext = fixedGetContext;
        }
        var ctx =
          webGLContextAttributes.majorVersion > 1
            ? canvas.getContext('webgl2', webGLContextAttributes)
            : canvas.getContext('webgl', webGLContextAttributes);
        if (!ctx) return 0;
        var handle = GL.registerContext(ctx, webGLContextAttributes);
        return handle;
      },
      registerContext: (ctx, webGLContextAttributes) => {
        var handle = GL.getNewId(GL.contexts);
        var context = {
          handle,
          attributes: webGLContextAttributes,
          version: webGLContextAttributes.majorVersion,
          GLctx: ctx,
        };
        if (ctx.canvas) ctx.canvas.GLctxObject = context;
        GL.contexts[handle] = context;
        if (
          typeof webGLContextAttributes.enableExtensionsByDefault == 'undefined' ||
          webGLContextAttributes.enableExtensionsByDefault
        ) {
          GL.initExtensions(context);
        }
        context.maxVertexAttribs = context.GLctx.getParameter(34921);
        context.clientBuffers = [];
        for (var i = 0; i < context.maxVertexAttribs; i++) {
          context.clientBuffers[i] = {
            enabled: false,
            clientside: false,
            size: 0,
            type: 0,
            normalized: 0,
            stride: 0,
            ptr: 0,
            vertexAttribPointerAdaptor: null,
          };
        }
        GL.generateTempBuffers(false, context);
        return handle;
      },
      makeContextCurrent: (contextHandle) => {
        GL.currentContext = GL.contexts[contextHandle];
        Module['ctx'] = GLctx = GL.currentContext?.GLctx;
        return !(contextHandle && !GLctx);
      },
      getContext: (contextHandle) => GL.contexts[contextHandle],
      deleteContext: (contextHandle) => {
        if (GL.currentContext === GL.contexts[contextHandle]) {
          GL.currentContext = null;
        }
        if (typeof JSEvents == 'object') {
          JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
        }
        if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) {
          GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
        }
        GL.contexts[contextHandle] = null;
      },
      initExtensions: (context) => {
        context ||= GL.currentContext;
        if (context.initExtensionsDone) return;
        context.initExtensionsDone = true;
        var GLctx = context.GLctx;
        webgl_enable_WEBGL_multi_draw(GLctx);
        webgl_enable_EXT_polygon_offset_clamp(GLctx);
        webgl_enable_EXT_clip_control(GLctx);
        webgl_enable_WEBGL_polygon_mode(GLctx);
        webgl_enable_ANGLE_instanced_arrays(GLctx);
        webgl_enable_OES_vertex_array_object(GLctx);
        webgl_enable_WEBGL_draw_buffers(GLctx);
        webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);
        webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);
        if (context.version >= 2) {
          GLctx.disjointTimerQueryExt = GLctx.getExtension('EXT_disjoint_timer_query_webgl2');
        }
        if (context.version < 2 || !GLctx.disjointTimerQueryExt) {
          GLctx.disjointTimerQueryExt = GLctx.getExtension('EXT_disjoint_timer_query');
        }
        getEmscriptenSupportedExtensions(GLctx).forEach((ext) => {
          if (!ext.includes('lose_context') && !ext.includes('debug')) {
            GLctx.getExtension(ext);
          }
        });
      },
    };
    var JSEvents = {
      memcpy(target, src, size) {
        HEAP8.set(HEAP8.subarray(src, src + size), target);
      },
      removeAllEventListeners() {
        while (JSEvents.eventHandlers.length) {
          JSEvents._removeHandler(JSEvents.eventHandlers.length - 1);
        }
        JSEvents.deferredCalls = [];
      },
      inEventHandler: 0,
      deferredCalls: [],
      deferCall(targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
          if (arrA.length != arrB.length) return false;
          for (var i in arrA) {
            if (arrA[i] != arrB[i]) return false;
          }
          return true;
        }
        for (var call of JSEvents.deferredCalls) {
          if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
            return;
          }
        }
        JSEvents.deferredCalls.push({ targetFunction, precedence, argsList });
        JSEvents.deferredCalls.sort((x, y) => x.precedence < y.precedence);
      },
      removeDeferredCalls(targetFunction) {
        JSEvents.deferredCalls = JSEvents.deferredCalls.filter((call) => call.targetFunction != targetFunction);
      },
      canPerformEventHandlerRequests() {
        if (navigator.userActivation) {
          return navigator.userActivation.isActive;
        }
        return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
      },
      runDeferredCalls() {
        if (!JSEvents.canPerformEventHandlerRequests()) {
          return;
        }
        var deferredCalls = JSEvents.deferredCalls;
        JSEvents.deferredCalls = [];
        for (var call of deferredCalls) {
          call.targetFunction(...call.argsList);
        }
      },
      eventHandlers: [],
      removeAllHandlersOnTarget: (target, eventTypeString) => {
        for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
          if (
            JSEvents.eventHandlers[i].target == target &&
            (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)
          ) {
            JSEvents._removeHandler(i--);
          }
        }
      },
      _removeHandler(i) {
        var h = JSEvents.eventHandlers[i];
        h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
        JSEvents.eventHandlers.splice(i, 1);
      },
      registerOrRemoveHandler(eventHandler) {
        if (!eventHandler.target) {
          return -4;
        }
        if (eventHandler.callbackfunc) {
          eventHandler.eventListenerFunc = function (event) {
            ++JSEvents.inEventHandler;
            JSEvents.currentEventHandler = eventHandler;
            JSEvents.runDeferredCalls();
            eventHandler.handlerFunc(event);
            JSEvents.runDeferredCalls();
            --JSEvents.inEventHandler;
          };
          eventHandler.target.addEventListener(
            eventHandler.eventTypeString,
            eventHandler.eventListenerFunc,
            eventHandler.useCapture,
          );
          JSEvents.eventHandlers.push(eventHandler);
        } else {
          for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (
              JSEvents.eventHandlers[i].target == eventHandler.target &&
              JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString
            ) {
              JSEvents._removeHandler(i--);
            }
          }
        }
        return 0;
      },
      getNodeNameForTarget(target) {
        if (!target) return '';
        if (target == window) return '#window';
        if (target == screen) return '#screen';
        return target?.nodeName || '';
      },
      fullscreenEnabled() {
        return document.fullscreenEnabled || document.webkitFullscreenEnabled;
      },
    };
    var webglPowerPreferences = ['default', 'low-power', 'high-performance'];
    var maybeCStringToJsString = (cString) => (cString > 2 ? UTF8ToString(cString) : cString);
    var specialHTMLTargets = [
      0,
      typeof document != 'undefined' ? document : 0,
      typeof window != 'undefined' ? window : 0,
    ];
    var findEventTarget = (target) => {
      target = maybeCStringToJsString(target);
      var domElement =
        specialHTMLTargets[target] || (typeof document != 'undefined' ? document.querySelector(target) : null);
      return domElement;
    };
    var findCanvasEventTarget = findEventTarget;
    var _emscripten_webgl_do_create_context = (target, attributes) => {
      var attr32 = attributes >> 2;
      var powerPreference = HEAP32[attr32 + (8 >> 2)];
      var contextAttributes = {
        alpha: !!HEAP8[attributes + 0],
        depth: !!HEAP8[attributes + 1],
        stencil: !!HEAP8[attributes + 2],
        antialias: !!HEAP8[attributes + 3],
        premultipliedAlpha: !!HEAP8[attributes + 4],
        preserveDrawingBuffer: !!HEAP8[attributes + 5],
        powerPreference: webglPowerPreferences[powerPreference],
        failIfMajorPerformanceCaveat: !!HEAP8[attributes + 12],
        majorVersion: HEAP32[attr32 + (16 >> 2)],
        minorVersion: HEAP32[attr32 + (20 >> 2)],
        enableExtensionsByDefault: HEAP8[attributes + 24],
        explicitSwapControl: HEAP8[attributes + 25],
        proxyContextToMainThread: HEAP32[attr32 + (28 >> 2)],
        renderViaOffscreenBackBuffer: HEAP8[attributes + 32],
      };
      var canvas = findCanvasEventTarget(target);
      if (!canvas) {
        return 0;
      }
      if (contextAttributes.explicitSwapControl) {
        return 0;
      }
      var contextHandle = GL.createContext(canvas, contextAttributes);
      return contextHandle;
    };
    var _emscripten_webgl_create_context = _emscripten_webgl_do_create_context;
    var _emscripten_webgl_destroy_context = (contextHandle) => {
      if (GL.currentContext == contextHandle) GL.currentContext = 0;
      GL.deleteContext(contextHandle);
    };
    var _emscripten_webgl_do_get_current_context = () => (GL.currentContext ? GL.currentContext.handle : 0);
    var _emscripten_webgl_get_current_context = _emscripten_webgl_do_get_current_context;
    var _emscripten_webgl_make_context_current = (contextHandle) => {
      var success = GL.makeContextCurrent(contextHandle);
      return success ? 0 : -5;
    };
    var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
    var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8(str, ret, size);
      return ret;
    };
    var WebGPU = {
      errorCallback: (callback, type, message, userdata) => {
        var sp = stackSave();
        var messagePtr = stringToUTF8OnStack(message);
        ((a1, a2, a3) => dynCall_viii(callback, a1, a2, a3))(type, messagePtr, userdata);
        stackRestore(sp);
      },
      initManagers: () => {
        function Manager() {
          this.objects = {};
          this.nextId = 1;
          this.create = function (object, wrapper = {}) {
            var id = this.nextId++;
            wrapper.refcount = 1;
            wrapper.object = object;
            this.objects[id] = wrapper;
            return id;
          };
          this.get = function (id) {
            if (!id) return undefined;
            var o = this.objects[id];
            return o.object;
          };
          this.reference = function (id) {
            var o = this.objects[id];
            o.refcount++;
          };
          this.release = function (id) {
            var o = this.objects[id];
            o.refcount--;
            if (o.refcount <= 0) {
              delete this.objects[id];
            }
          };
        }
        WebGPU.mgrSurface = new Manager();
        WebGPU.mgrSwapChain = new Manager();
        WebGPU.mgrAdapter = new Manager();
        WebGPU.mgrDevice = new Manager();
        WebGPU.mgrQueue = new Manager();
        WebGPU.mgrCommandBuffer = new Manager();
        WebGPU.mgrCommandEncoder = new Manager();
        WebGPU.mgrRenderPassEncoder = new Manager();
        WebGPU.mgrComputePassEncoder = new Manager();
        WebGPU.mgrBindGroup = new Manager();
        WebGPU.mgrBuffer = new Manager();
        WebGPU.mgrSampler = new Manager();
        WebGPU.mgrTexture = new Manager();
        WebGPU.mgrTextureView = new Manager();
        WebGPU.mgrQuerySet = new Manager();
        WebGPU.mgrBindGroupLayout = new Manager();
        WebGPU.mgrPipelineLayout = new Manager();
        WebGPU.mgrRenderPipeline = new Manager();
        WebGPU.mgrComputePipeline = new Manager();
        WebGPU.mgrShaderModule = new Manager();
        WebGPU.mgrRenderBundleEncoder = new Manager();
        WebGPU.mgrRenderBundle = new Manager();
      },
      makeColor: (ptr) => ({
        r: HEAPF64[ptr >> 3],
        g: HEAPF64[(ptr + 8) >> 3],
        b: HEAPF64[(ptr + 16) >> 3],
        a: HEAPF64[(ptr + 24) >> 3],
      }),
      makeExtent3D: (ptr) => ({
        width: HEAPU32[ptr >> 2],
        height: HEAPU32[(ptr + 4) >> 2],
        depthOrArrayLayers: HEAPU32[(ptr + 8) >> 2],
      }),
      makeOrigin3D: (ptr) => ({ x: HEAPU32[ptr >> 2], y: HEAPU32[(ptr + 4) >> 2], z: HEAPU32[(ptr + 8) >> 2] }),
      makeImageCopyTexture: (ptr) => ({
        texture: WebGPU.mgrTexture.get(HEAPU32[(ptr + 4) >> 2]),
        mipLevel: HEAPU32[(ptr + 8) >> 2],
        origin: WebGPU.makeOrigin3D(ptr + 12),
        aspect: WebGPU.TextureAspect[HEAPU32[(ptr + 24) >> 2]],
      }),
      makeTextureDataLayout: (ptr) => {
        var bytesPerRow = HEAPU32[(ptr + 16) >> 2];
        var rowsPerImage = HEAPU32[(ptr + 20) >> 2];
        return {
          offset: HEAPU32[(ptr + 4 + 8) >> 2] * 4294967296 + HEAPU32[(ptr + 8) >> 2],
          bytesPerRow: bytesPerRow === 4294967295 ? undefined : bytesPerRow,
          rowsPerImage: rowsPerImage === 4294967295 ? undefined : rowsPerImage,
        };
      },
      makeImageCopyBuffer: (ptr) => {
        var layoutPtr = ptr + 8;
        var bufferCopyView = WebGPU.makeTextureDataLayout(layoutPtr);
        bufferCopyView['buffer'] = WebGPU.mgrBuffer.get(HEAPU32[(ptr + 32) >> 2]);
        return bufferCopyView;
      },
      makePipelineConstants: (constantCount, constantsPtr) => {
        if (!constantCount) return;
        var constants = {};
        for (var i = 0; i < constantCount; ++i) {
          var entryPtr = constantsPtr + 16 * i;
          var key = UTF8ToString(HEAPU32[(entryPtr + 4) >> 2]);
          constants[key] = HEAPF64[(entryPtr + 8) >> 3];
        }
        return constants;
      },
      makePipelineLayout: (layoutPtr) => {
        if (!layoutPtr) return 'auto';
        return WebGPU.mgrPipelineLayout.get(layoutPtr);
      },
      makeProgrammableStageDescriptor: (ptr) => {
        if (!ptr) return undefined;
        var desc = {
          module: WebGPU.mgrShaderModule.get(HEAPU32[(ptr + 4) >> 2]),
          constants: WebGPU.makePipelineConstants(HEAPU32[(ptr + 12) >> 2], HEAPU32[(ptr + 16) >> 2]),
        };
        var entryPointPtr = HEAPU32[(ptr + 8) >> 2];
        if (entryPointPtr) desc['entryPoint'] = UTF8ToString(entryPointPtr);
        return desc;
      },
      fillLimitStruct: (limits, supportedLimitsOutPtr) => {
        var limitsOutPtr = supportedLimitsOutPtr + 8;
        function setLimitValueU32(name, limitOffset) {
          var limitValue = limits[name];
          HEAP32[(limitsOutPtr + limitOffset) >> 2] = limitValue;
        }
        function setLimitValueU64(name, limitOffset) {
          var limitValue = limits[name];
          (tempI64 = [
            limitValue >>> 0,
            ((tempDouble = limitValue),
            +Math.abs(tempDouble) >= 1
              ? tempDouble > 0
                ? +Math.floor(tempDouble / 4294967296) >>> 0
                : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
              : 0),
          ]),
            (HEAP32[(limitsOutPtr + limitOffset) >> 2] = tempI64[0]),
            (HEAP32[(limitsOutPtr + (limitOffset + 4)) >> 2] = tempI64[1]);
        }
        setLimitValueU32('maxTextureDimension1D', 0);
        setLimitValueU32('maxTextureDimension2D', 4);
        setLimitValueU32('maxTextureDimension3D', 8);
        setLimitValueU32('maxTextureArrayLayers', 12);
        setLimitValueU32('maxBindGroups', 16);
        setLimitValueU32('maxBindGroupsPlusVertexBuffers', 20);
        setLimitValueU32('maxBindingsPerBindGroup', 24);
        setLimitValueU32('maxDynamicUniformBuffersPerPipelineLayout', 28);
        setLimitValueU32('maxDynamicStorageBuffersPerPipelineLayout', 32);
        setLimitValueU32('maxSampledTexturesPerShaderStage', 36);
        setLimitValueU32('maxSamplersPerShaderStage', 40);
        setLimitValueU32('maxStorageBuffersPerShaderStage', 44);
        setLimitValueU32('maxStorageTexturesPerShaderStage', 48);
        setLimitValueU32('maxUniformBuffersPerShaderStage', 52);
        setLimitValueU32('minUniformBufferOffsetAlignment', 72);
        setLimitValueU32('minStorageBufferOffsetAlignment', 76);
        setLimitValueU64('maxUniformBufferBindingSize', 56);
        setLimitValueU64('maxStorageBufferBindingSize', 64);
        setLimitValueU32('maxVertexBuffers', 80);
        setLimitValueU64('maxBufferSize', 88);
        setLimitValueU32('maxVertexAttributes', 96);
        setLimitValueU32('maxVertexBufferArrayStride', 100);
        setLimitValueU32('maxInterStageShaderComponents', 104);
        setLimitValueU32('maxInterStageShaderVariables', 108);
        setLimitValueU32('maxColorAttachments', 112);
        setLimitValueU32('maxColorAttachmentBytesPerSample', 116);
        setLimitValueU32('maxComputeWorkgroupStorageSize', 120);
        setLimitValueU32('maxComputeInvocationsPerWorkgroup', 124);
        setLimitValueU32('maxComputeWorkgroupSizeX', 128);
        setLimitValueU32('maxComputeWorkgroupSizeY', 132);
        setLimitValueU32('maxComputeWorkgroupSizeZ', 136);
        setLimitValueU32('maxComputeWorkgroupsPerDimension', 140);
      },
      Int_BufferMapState: { unmapped: 1, pending: 2, mapped: 3 },
      Int_CompilationMessageType: { error: 1, warning: 2, info: 3 },
      Int_DeviceLostReason: { undefined: 1, unknown: 1, destroyed: 2 },
      Int_PreferredFormat: { rgba8unorm: 18, bgra8unorm: 23 },
      WGSLFeatureName: [
        ,
        'readonly_and_readwrite_storage_textures',
        'packed_4x8_integer_dot_product',
        'unrestricted_pointer_parameters',
        'pointer_composite_access',
      ],
      AddressMode: [, 'clamp-to-edge', 'repeat', 'mirror-repeat'],
      AlphaMode: [, 'opaque', 'premultiplied'],
      BlendFactor: [
        ,
        'zero',
        'one',
        'src',
        'one-minus-src',
        'src-alpha',
        'one-minus-src-alpha',
        'dst',
        'one-minus-dst',
        'dst-alpha',
        'one-minus-dst-alpha',
        'src-alpha-saturated',
        'constant',
        'one-minus-constant',
      ],
      BlendOperation: [, 'add', 'subtract', 'reverse-subtract', 'min', 'max'],
      BufferBindingType: [, 'uniform', 'storage', 'read-only-storage'],
      BufferMapState: { 1: 'unmapped', 2: 'pending', 3: 'mapped' },
      CompareFunction: [, 'never', 'less', 'equal', 'less-equal', 'greater', 'not-equal', 'greater-equal', 'always'],
      CompilationInfoRequestStatus: ['success', 'error', 'device-lost', 'unknown'],
      CullMode: [, 'none', 'front', 'back'],
      ErrorFilter: { 1: 'validation', 2: 'out-of-memory', 3: 'internal' },
      FeatureName: [
        ,
        'depth-clip-control',
        'depth32float-stencil8',
        'timestamp-query',
        'texture-compression-bc',
        'texture-compression-etc2',
        'texture-compression-astc',
        'indirect-first-instance',
        'shader-f16',
        'rg11b10ufloat-renderable',
        'bgra8unorm-storage',
        'float32-filterable',
      ],
      FilterMode: [, 'nearest', 'linear'],
      FrontFace: [, 'ccw', 'cw'],
      IndexFormat: [, 'uint16', 'uint32'],
      LoadOp: [, 'clear', 'load'],
      MipmapFilterMode: [, 'nearest', 'linear'],
      PowerPreference: [, 'low-power', 'high-performance'],
      PrimitiveTopology: [, 'point-list', 'line-list', 'line-strip', 'triangle-list', 'triangle-strip'],
      QueryType: { 1: 'occlusion', 2: 'timestamp' },
      SamplerBindingType: [, 'filtering', 'non-filtering', 'comparison'],
      StencilOperation: [
        ,
        'keep',
        'zero',
        'replace',
        'invert',
        'increment-clamp',
        'decrement-clamp',
        'increment-wrap',
        'decrement-wrap',
      ],
      StorageTextureAccess: [, 'write-only', 'read-only', 'read-write'],
      StoreOp: [, 'store', 'discard'],
      TextureAspect: [, 'all', 'stencil-only', 'depth-only'],
      TextureDimension: [, '1d', '2d', '3d'],
      TextureFormat: [
        ,
        'r8unorm',
        'r8snorm',
        'r8uint',
        'r8sint',
        'r16uint',
        'r16sint',
        'r16float',
        'rg8unorm',
        'rg8snorm',
        'rg8uint',
        'rg8sint',
        'r32float',
        'r32uint',
        'r32sint',
        'rg16uint',
        'rg16sint',
        'rg16float',
        'rgba8unorm',
        'rgba8unorm-srgb',
        'rgba8snorm',
        'rgba8uint',
        'rgba8sint',
        'bgra8unorm',
        'bgra8unorm-srgb',
        'rgb10a2uint',
        'rgb10a2unorm',
        'rg11b10ufloat',
        'rgb9e5ufloat',
        'rg32float',
        'rg32uint',
        'rg32sint',
        'rgba16uint',
        'rgba16sint',
        'rgba16float',
        'rgba32float',
        'rgba32uint',
        'rgba32sint',
        'stencil8',
        'depth16unorm',
        'depth24plus',
        'depth24plus-stencil8',
        'depth32float',
        'depth32float-stencil8',
        'bc1-rgba-unorm',
        'bc1-rgba-unorm-srgb',
        'bc2-rgba-unorm',
        'bc2-rgba-unorm-srgb',
        'bc3-rgba-unorm',
        'bc3-rgba-unorm-srgb',
        'bc4-r-unorm',
        'bc4-r-snorm',
        'bc5-rg-unorm',
        'bc5-rg-snorm',
        'bc6h-rgb-ufloat',
        'bc6h-rgb-float',
        'bc7-rgba-unorm',
        'bc7-rgba-unorm-srgb',
        'etc2-rgb8unorm',
        'etc2-rgb8unorm-srgb',
        'etc2-rgb8a1unorm',
        'etc2-rgb8a1unorm-srgb',
        'etc2-rgba8unorm',
        'etc2-rgba8unorm-srgb',
        'eac-r11unorm',
        'eac-r11snorm',
        'eac-rg11unorm',
        'eac-rg11snorm',
        'astc-4x4-unorm',
        'astc-4x4-unorm-srgb',
        'astc-5x4-unorm',
        'astc-5x4-unorm-srgb',
        'astc-5x5-unorm',
        'astc-5x5-unorm-srgb',
        'astc-6x5-unorm',
        'astc-6x5-unorm-srgb',
        'astc-6x6-unorm',
        'astc-6x6-unorm-srgb',
        'astc-8x5-unorm',
        'astc-8x5-unorm-srgb',
        'astc-8x6-unorm',
        'astc-8x6-unorm-srgb',
        'astc-8x8-unorm',
        'astc-8x8-unorm-srgb',
        'astc-10x5-unorm',
        'astc-10x5-unorm-srgb',
        'astc-10x6-unorm',
        'astc-10x6-unorm-srgb',
        'astc-10x8-unorm',
        'astc-10x8-unorm-srgb',
        'astc-10x10-unorm',
        'astc-10x10-unorm-srgb',
        'astc-12x10-unorm',
        'astc-12x10-unorm-srgb',
        'astc-12x12-unorm',
        'astc-12x12-unorm-srgb',
      ],
      TextureSampleType: [, 'float', 'unfilterable-float', 'depth', 'sint', 'uint'],
      TextureViewDimension: [, '1d', '2d', '2d-array', 'cube', 'cube-array', '3d'],
      VertexFormat: [
        ,
        'uint8x2',
        'uint8x4',
        'sint8x2',
        'sint8x4',
        'unorm8x2',
        'unorm8x4',
        'snorm8x2',
        'snorm8x4',
        'uint16x2',
        'uint16x4',
        'sint16x2',
        'sint16x4',
        'unorm16x2',
        'unorm16x4',
        'snorm16x2',
        'snorm16x4',
        'float16x2',
        'float16x4',
        'float32',
        'float32x2',
        'float32x3',
        'float32x4',
        'uint32',
        'uint32x2',
        'uint32x3',
        'uint32x4',
        'sint32',
        'sint32x2',
        'sint32x3',
        'sint32x4',
        'unorm10-10-10-2',
      ],
      VertexStepMode: [, 'vertex-buffer-not-used', 'vertex', 'instance'],
      FeatureNameString2Enum: {
        undefined: '0',
        'depth-clip-control': '1',
        'depth32float-stencil8': '2',
        'timestamp-query': '3',
        'texture-compression-bc': '4',
        'texture-compression-etc2': '5',
        'texture-compression-astc': '6',
        'indirect-first-instance': '7',
        'shader-f16': '8',
        'rg11b10ufloat-renderable': '9',
        'bgra8unorm-storage': '10',
        'float32-filterable': '11',
      },
    };
    var _emscripten_webgpu_get_device = () => {
      if (WebGPU.preinitializedDeviceId === undefined) {
        var device = Module['preinitializedWebGPUDevice'];
        var deviceWrapper = { queueId: WebGPU.mgrQueue.create(device['queue']) };
        WebGPU.preinitializedDeviceId = WebGPU.mgrDevice.create(device, deviceWrapper);
      }
      WebGPU.mgrDevice.reference(WebGPU.preinitializedDeviceId);
      return WebGPU.preinitializedDeviceId;
    };
    var ENV = {};
    var getExecutableName = () => thisProgram || './this.program';
    var getEnvStrings = () => {
      if (!getEnvStrings.strings) {
        var lang =
          ((typeof navigator == 'object' && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') +
          '.UTF-8';
        var env = {
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
        var strings = [];
        for (var x in env) {
          strings.push(`${x}=${env[x]}`);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    };
    var stringToAscii = (str, buffer) => {
      for (var i = 0; i < str.length; ++i) {
        HEAP8[buffer++] = str.charCodeAt(i);
      }
      HEAP8[buffer] = 0;
    };
    var _environ_get = (__environ, environ_buf) => {
      var bufSize = 0;
      getEnvStrings().forEach((string, i) => {
        var ptr = environ_buf + bufSize;
        HEAPU32[(__environ + i * 4) >> 2] = ptr;
        stringToAscii(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    };
    var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
      var strings = getEnvStrings();
      HEAPU32[penviron_count >> 2] = strings.length;
      var bufSize = 0;
      strings.forEach((string) => (bufSize += string.length + 1));
      HEAPU32[penviron_buf_size >> 2] = bufSize;
      return 0;
    };
    var _fd_close = (fd) => 52;
    var _fd_read = (fd, iov, iovcnt, pnum) => 52;
    var printCharBuffers = [null, [], []];
    var printChar = (stream, curr) => {
      var buffer = printCharBuffers[stream];
      if (curr === 0 || curr === 10) {
        (stream === 1 ? out : err)(UTF8ArrayToString(buffer));
        buffer.length = 0;
      } else {
        buffer.push(curr);
      }
    };
    var _fd_write = (fd, iov, iovcnt, pnum) => {
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2];
        var len = HEAPU32[(iov + 4) >> 2];
        iov += 8;
        for (var j = 0; j < len; j++) {
          printChar(fd, HEAPU8[ptr + j]);
        }
        num += len;
      }
      HEAPU32[pnum >> 2] = num;
      return 0;
    };
    var _glActiveTexture = (x0) => GLctx.activeTexture(x0);
    var _glAttachShader = (program, shader) => {
      GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
    };
    var _glBindBuffer = (target, buffer) => {
      if (target == 34962) {
        GLctx.currentArrayBufferBinding = buffer;
      } else if (target == 34963) {
        GLctx.currentElementArrayBufferBinding = buffer;
      }
      if (target == 35051) {
        GLctx.currentPixelPackBufferBinding = buffer;
      } else if (target == 35052) {
        GLctx.currentPixelUnpackBufferBinding = buffer;
      }
      GLctx.bindBuffer(target, GL.buffers[buffer]);
    };
    var _glBindBufferRange = (target, index, buffer, offset, ptrsize) => {
      GLctx.bindBufferRange(target, index, GL.buffers[buffer], offset, ptrsize);
    };
    var _glBindFramebuffer = (target, framebuffer) => {
      GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
    };
    var _glBindRenderbuffer = (target, renderbuffer) => {
      GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
    };
    var _glBindTexture = (target, texture) => {
      GLctx.bindTexture(target, GL.textures[texture]);
    };
    var _glBindVertexArray = (vao) => {
      GLctx.bindVertexArray(GL.vaos[vao]);
      var ibo = GLctx.getParameter(34965);
      GLctx.currentElementArrayBufferBinding = ibo ? ibo.name | 0 : 0;
    };
    var _glBlendEquation = (x0) => GLctx.blendEquation(x0);
    var _glBlendFunc = (x0, x1) => GLctx.blendFunc(x0, x1);
    var _glBlitFramebuffer = (x0, x1, x2, x3, x4, x5, x6, x7, x8, x9) =>
      GLctx.blitFramebuffer(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);
    var _glBufferData = (target, size, data, usage) => {
      if (GL.currentContext.version >= 2) {
        if (data && size) {
          GLctx.bufferData(target, HEAPU8, usage, data, size);
        } else {
          GLctx.bufferData(target, size, usage);
        }
        return;
      }
      GLctx.bufferData(target, data ? HEAPU8.subarray(data, data + size) : size, usage);
    };
    var _glClear = (x0) => GLctx.clear(x0);
    var _glClearColor = (x0, x1, x2, x3) => GLctx.clearColor(x0, x1, x2, x3);
    var _glClearDepthf = (x0) => GLctx.clearDepth(x0);
    var _glClearStencil = (x0) => GLctx.clearStencil(x0);
    var _glColorMask = (red, green, blue, alpha) => {
      GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
    };
    var _glCompileShader = (shader) => {
      GLctx.compileShader(GL.shaders[shader]);
    };
    var _glCreateProgram = () => {
      var id = GL.getNewId(GL.programs);
      var program = GLctx.createProgram();
      program.name = id;
      program.maxUniformLength = program.maxAttributeLength = program.maxUniformBlockNameLength = 0;
      program.uniformIdCounter = 1;
      GL.programs[id] = program;
      return id;
    };
    var _glCreateShader = (shaderType) => {
      var id = GL.getNewId(GL.shaders);
      GL.shaders[id] = GLctx.createShader(shaderType);
      return id;
    };
    var _glCullFace = (x0) => GLctx.cullFace(x0);
    var _glDeleteBuffers = (n, buffers) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(buffers + i * 4) >> 2];
        var buffer = GL.buffers[id];
        if (!buffer) continue;
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
        if (id == GLctx.currentArrayBufferBinding) GLctx.currentArrayBufferBinding = 0;
        if (id == GLctx.currentElementArrayBufferBinding) GLctx.currentElementArrayBufferBinding = 0;
        if (id == GLctx.currentPixelPackBufferBinding) GLctx.currentPixelPackBufferBinding = 0;
        if (id == GLctx.currentPixelUnpackBufferBinding) GLctx.currentPixelUnpackBufferBinding = 0;
      }
    };
    var _glDeleteFramebuffers = (n, framebuffers) => {
      for (var i = 0; i < n; ++i) {
        var id = HEAP32[(framebuffers + i * 4) >> 2];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer) continue;
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null;
      }
    };
    var _glDeleteProgram = (id) => {
      if (!id) return;
      var program = GL.programs[id];
      if (!program) {
        GL.recordError(1281);
        return;
      }
      GLctx.deleteProgram(program);
      program.name = 0;
      GL.programs[id] = null;
    };
    var _glDeleteRenderbuffers = (n, renderbuffers) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(renderbuffers + i * 4) >> 2];
        var renderbuffer = GL.renderbuffers[id];
        if (!renderbuffer) continue;
        GLctx.deleteRenderbuffer(renderbuffer);
        renderbuffer.name = 0;
        GL.renderbuffers[id] = null;
      }
    };
    var _glDeleteShader = (id) => {
      if (!id) return;
      var shader = GL.shaders[id];
      if (!shader) {
        GL.recordError(1281);
        return;
      }
      GLctx.deleteShader(shader);
      GL.shaders[id] = null;
    };
    var _glDeleteTextures = (n, textures) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(textures + i * 4) >> 2];
        var texture = GL.textures[id];
        if (!texture) continue;
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null;
      }
    };
    var _glDeleteVertexArrays = (n, vaos) => {
      for (var i = 0; i < n; i++) {
        var id = HEAP32[(vaos + i * 4) >> 2];
        GLctx.deleteVertexArray(GL.vaos[id]);
        GL.vaos[id] = null;
      }
    };
    var _glDepthFunc = (x0) => GLctx.depthFunc(x0);
    var _glDepthMask = (flag) => {
      GLctx.depthMask(!!flag);
    };
    var _glDisable = (x0) => GLctx.disable(x0);
    var _glDisableVertexAttribArray = (index) => {
      var cb = GL.currentContext.clientBuffers[index];
      cb.enabled = false;
      GLctx.disableVertexAttribArray(index);
    };
    var _glDrawElements = (mode, count, type, indices) => {
      var buf;
      var vertexes = 0;
      if (!GLctx.currentElementArrayBufferBinding) {
        var size = GL.calcBufLength(1, type, 0, count);
        buf = GL.getTempIndexBuffer(size);
        GLctx.bindBuffer(34963, buf);
        GLctx.bufferSubData(34963, 0, HEAPU8.subarray(indices, indices + size));
        if (count > 0) {
          for (var i = 0; i < GL.currentContext.maxVertexAttribs; ++i) {
            var cb = GL.currentContext.clientBuffers[i];
            if (cb.clientside && cb.enabled) {
              let arrayClass;
              switch (type) {
                case 5121:
                  arrayClass = Uint8Array;
                  break;
                case 5123:
                  arrayClass = Uint16Array;
                  break;
                case 5125:
                  arrayClass = Uint32Array;
                  break;
                default:
                  GL.recordError(1282);
                  return;
              }
              vertexes =
                new arrayClass(HEAPU8.buffer, indices, count).reduce((max, current) => Math.max(max, current)) + 1;
              break;
            }
          }
        }
        indices = 0;
      }
      GL.preDrawHandleClientVertexAttribBindings(vertexes);
      GLctx.drawElements(mode, count, type, indices);
      GL.postDrawHandleClientVertexAttribBindings(count);
      if (!GLctx.currentElementArrayBufferBinding) {
        GLctx.bindBuffer(34963, null);
      }
    };
    var _glEnable = (x0) => GLctx.enable(x0);
    var _glEnableVertexAttribArray = (index) => {
      var cb = GL.currentContext.clientBuffers[index];
      cb.enabled = true;
      GLctx.enableVertexAttribArray(index);
    };
    var _glFramebufferRenderbuffer = (target, attachment, renderbuffertarget, renderbuffer) => {
      GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer]);
    };
    var _glFramebufferTexture2D = (target, attachment, textarget, texture, level) => {
      GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level);
    };
    var _glFrontFace = (x0) => GLctx.frontFace(x0);
    var _glGenBuffers = (n, buffers) => {
      GL.genObject(n, buffers, 'createBuffer', GL.buffers);
    };
    var _glGenFramebuffers = (n, ids) => {
      GL.genObject(n, ids, 'createFramebuffer', GL.framebuffers);
    };
    var _glGenRenderbuffers = (n, renderbuffers) => {
      GL.genObject(n, renderbuffers, 'createRenderbuffer', GL.renderbuffers);
    };
    var _glGenTextures = (n, textures) => {
      GL.genObject(n, textures, 'createTexture', GL.textures);
    };
    var _glGenVertexArrays = (n, arrays) => {
      GL.genObject(n, arrays, 'createVertexArray', GL.vaos);
    };
    var writeI53ToI64 = (ptr, num) => {
      HEAPU32[ptr >> 2] = num;
      var lower = HEAPU32[ptr >> 2];
      HEAPU32[(ptr + 4) >> 2] = (num - lower) / 4294967296;
    };
    var webglGetExtensions = () => {
      var exts = getEmscriptenSupportedExtensions(GLctx);
      exts = exts.concat(exts.map((e) => 'GL_' + e));
      return exts;
    };
    var emscriptenWebGLGet = (name_, p, type) => {
      if (!p) {
        GL.recordError(1281);
        return;
      }
      var ret = undefined;
      switch (name_) {
        case 36346:
          ret = 1;
          break;
        case 36344:
          if (type != 0 && type != 1) {
            GL.recordError(1280);
          }
          return;
        case 34814:
        case 36345:
          ret = 0;
          break;
        case 34466:
          var formats = GLctx.getParameter(34467);
          ret = formats ? formats.length : 0;
          break;
        case 33309:
          if (GL.currentContext.version < 2) {
            GL.recordError(1282);
            return;
          }
          ret = webglGetExtensions().length;
          break;
        case 33307:
        case 33308:
          if (GL.currentContext.version < 2) {
            GL.recordError(1280);
            return;
          }
          ret = name_ == 33307 ? 3 : 0;
          break;
      }
      if (ret === undefined) {
        var result = GLctx.getParameter(name_);
        switch (typeof result) {
          case 'number':
            ret = result;
            break;
          case 'boolean':
            ret = result ? 1 : 0;
            break;
          case 'string':
            GL.recordError(1280);
            return;
          case 'object':
            if (result === null) {
              switch (name_) {
                case 34964:
                case 35725:
                case 34965:
                case 36006:
                case 36007:
                case 32873:
                case 34229:
                case 36662:
                case 36663:
                case 35053:
                case 35055:
                case 36010:
                case 35097:
                case 35869:
                case 32874:
                case 36389:
                case 35983:
                case 35368:
                case 34068: {
                  ret = 0;
                  break;
                }
                default: {
                  GL.recordError(1280);
                  return;
                }
              }
            } else if (
              result instanceof Float32Array ||
              result instanceof Uint32Array ||
              result instanceof Int32Array ||
              result instanceof Array
            ) {
              for (var i = 0; i < result.length; ++i) {
                switch (type) {
                  case 0:
                    HEAP32[(p + i * 4) >> 2] = result[i];
                    break;
                  case 2:
                    HEAPF32[(p + i * 4) >> 2] = result[i];
                    break;
                  case 4:
                    HEAP8[p + i] = result[i] ? 1 : 0;
                    break;
                }
              }
              return;
            } else {
              try {
                ret = result.name | 0;
              } catch (e) {
                GL.recordError(1280);
                err(
                  `GL_INVALID_ENUM in glGet${type}v: Unknown object returned from WebGL getParameter(${name_})! (error: ${e})`,
                );
                return;
              }
            }
            break;
          default:
            GL.recordError(1280);
            err(
              `GL_INVALID_ENUM in glGet${type}v: Native code calling glGet${type}v(${name_}) and it returns ${result} of type ${typeof result}!`,
            );
            return;
        }
      }
      switch (type) {
        case 1:
          writeI53ToI64(p, ret);
          break;
        case 0:
          HEAP32[p >> 2] = ret;
          break;
        case 2:
          HEAPF32[p >> 2] = ret;
          break;
        case 4:
          HEAP8[p] = ret ? 1 : 0;
          break;
      }
    };
    var _glGetIntegerv = (name_, p) => emscriptenWebGLGet(name_, p, 0);
    var _glGetProgramInfoLog = (program, maxLength, length, infoLog) => {
      var log = GLctx.getProgramInfoLog(GL.programs[program]);
      if (log === null) log = '(unknown error)';
      var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
    };
    var _glGetProgramiv = (program, pname, p) => {
      if (!p) {
        GL.recordError(1281);
        return;
      }
      if (program >= GL.counter) {
        GL.recordError(1281);
        return;
      }
      program = GL.programs[program];
      if (pname == 35716) {
        var log = GLctx.getProgramInfoLog(program);
        if (log === null) log = '(unknown error)';
        HEAP32[p >> 2] = log.length + 1;
      } else if (pname == 35719) {
        if (!program.maxUniformLength) {
          var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
          for (var i = 0; i < numActiveUniforms; ++i) {
            program.maxUniformLength = Math.max(
              program.maxUniformLength,
              GLctx.getActiveUniform(program, i).name.length + 1,
            );
          }
        }
        HEAP32[p >> 2] = program.maxUniformLength;
      } else if (pname == 35722) {
        if (!program.maxAttributeLength) {
          var numActiveAttributes = GLctx.getProgramParameter(program, 35721);
          for (var i = 0; i < numActiveAttributes; ++i) {
            program.maxAttributeLength = Math.max(
              program.maxAttributeLength,
              GLctx.getActiveAttrib(program, i).name.length + 1,
            );
          }
        }
        HEAP32[p >> 2] = program.maxAttributeLength;
      } else if (pname == 35381) {
        if (!program.maxUniformBlockNameLength) {
          var numActiveUniformBlocks = GLctx.getProgramParameter(program, 35382);
          for (var i = 0; i < numActiveUniformBlocks; ++i) {
            program.maxUniformBlockNameLength = Math.max(
              program.maxUniformBlockNameLength,
              GLctx.getActiveUniformBlockName(program, i).length + 1,
            );
          }
        }
        HEAP32[p >> 2] = program.maxUniformBlockNameLength;
      } else {
        HEAP32[p >> 2] = GLctx.getProgramParameter(program, pname);
      }
    };
    var _glGetShaderInfoLog = (shader, maxLength, length, infoLog) => {
      var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
      if (log === null) log = '(unknown error)';
      var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
      if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
    };
    var _glGetShaderiv = (shader, pname, p) => {
      if (!p) {
        GL.recordError(1281);
        return;
      }
      if (pname == 35716) {
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = '(unknown error)';
        var logLength = log ? log.length + 1 : 0;
        HEAP32[p >> 2] = logLength;
      } else if (pname == 35720) {
        var source = GLctx.getShaderSource(GL.shaders[shader]);
        var sourceLength = source ? source.length + 1 : 0;
        HEAP32[p >> 2] = sourceLength;
      } else {
        HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname);
      }
    };
    var _glGetUniformBlockIndex = (program, uniformBlockName) =>
      GLctx.getUniformBlockIndex(GL.programs[program], UTF8ToString(uniformBlockName));
    var jstoi_q = (str) => parseInt(str);
    var webglGetLeftBracePos = (name) => name.slice(-1) == ']' && name.lastIndexOf('[');
    var webglPrepareUniformLocationsBeforeFirstUse = (program) => {
      var uniformLocsById = program.uniformLocsById,
        uniformSizeAndIdsByName = program.uniformSizeAndIdsByName,
        i,
        j;
      if (!uniformLocsById) {
        program.uniformLocsById = uniformLocsById = {};
        program.uniformArrayNamesById = {};
        var numActiveUniforms = GLctx.getProgramParameter(program, 35718);
        for (i = 0; i < numActiveUniforms; ++i) {
          var u = GLctx.getActiveUniform(program, i);
          var nm = u.name;
          var sz = u.size;
          var lb = webglGetLeftBracePos(nm);
          var arrayName = lb > 0 ? nm.slice(0, lb) : nm;
          var id = program.uniformIdCounter;
          program.uniformIdCounter += sz;
          uniformSizeAndIdsByName[arrayName] = [sz, id];
          for (j = 0; j < sz; ++j) {
            uniformLocsById[id] = j;
            program.uniformArrayNamesById[id++] = arrayName;
          }
        }
      }
    };
    var _glGetUniformLocation = (program, name) => {
      name = UTF8ToString(name);
      if ((program = GL.programs[program])) {
        webglPrepareUniformLocationsBeforeFirstUse(program);
        var uniformLocsById = program.uniformLocsById;
        var arrayIndex = 0;
        var uniformBaseName = name;
        var leftBrace = webglGetLeftBracePos(name);
        if (leftBrace > 0) {
          arrayIndex = jstoi_q(name.slice(leftBrace + 1)) >>> 0;
          uniformBaseName = name.slice(0, leftBrace);
        }
        var sizeAndId = program.uniformSizeAndIdsByName[uniformBaseName];
        if (sizeAndId && arrayIndex < sizeAndId[0]) {
          arrayIndex += sizeAndId[1];
          if ((uniformLocsById[arrayIndex] = uniformLocsById[arrayIndex] || GLctx.getUniformLocation(program, name))) {
            return arrayIndex;
          }
        }
      } else {
        GL.recordError(1281);
      }
      return -1;
    };
    var tempFixedLengthArray = [];
    var _glInvalidateFramebuffer = (target, numAttachments, attachments) => {
      var list = tempFixedLengthArray[numAttachments];
      for (var i = 0; i < numAttachments; i++) {
        list[i] = HEAP32[(attachments + i * 4) >> 2];
      }
      GLctx.invalidateFramebuffer(target, list);
    };
    var _glLinkProgram = (program) => {
      program = GL.programs[program];
      GLctx.linkProgram(program);
      program.uniformLocsById = 0;
      program.uniformSizeAndIdsByName = {};
    };
    var _glRenderbufferStorageMultisample = (x0, x1, x2, x3, x4) =>
      GLctx.renderbufferStorageMultisample(x0, x1, x2, x3, x4);
    var _glScissor = (x0, x1, x2, x3) => GLctx.scissor(x0, x1, x2, x3);
    var _glShaderSource = (shader, count, string, length) => {
      var source = GL.getSource(shader, count, string, length);
      GLctx.shaderSource(GL.shaders[shader], source);
    };
    var _glStencilFunc = (x0, x1, x2) => GLctx.stencilFunc(x0, x1, x2);
    var _glStencilFuncSeparate = (x0, x1, x2, x3) => GLctx.stencilFuncSeparate(x0, x1, x2, x3);
    var _glStencilOp = (x0, x1, x2) => GLctx.stencilOp(x0, x1, x2);
    var _glStencilOpSeparate = (x0, x1, x2, x3) => GLctx.stencilOpSeparate(x0, x1, x2, x3);
    var computeUnpackAlignedImageSize = (width, height, sizePerPixel) => {
      function roundedToNextMultipleOf(x, y) {
        return (x + y - 1) & -y;
      }
      var plainRowSize = (GL.unpackRowLength || width) * sizePerPixel;
      var alignedRowSize = roundedToNextMultipleOf(plainRowSize, GL.unpackAlignment);
      return height * alignedRowSize;
    };
    var colorChannelsInGlTextureFormat = (format) => {
      var colorChannels = { 5: 3, 6: 4, 8: 2, 29502: 3, 29504: 4, 26917: 2, 26918: 2, 29846: 3, 29847: 4 };
      return colorChannels[format - 6402] || 1;
    };
    var heapObjectForWebGLType = (type) => {
      type -= 5120;
      if (type == 0) return HEAP8;
      if (type == 1) return HEAPU8;
      if (type == 2) return HEAP16;
      if (type == 4) return HEAP32;
      if (type == 6) return HEAPF32;
      if (type == 5 || type == 28922 || type == 28520 || type == 30779 || type == 30782) return HEAPU32;
      return HEAPU16;
    };
    var toTypedArrayIndex = (pointer, heap) => pointer >>> (31 - Math.clz32(heap.BYTES_PER_ELEMENT));
    var emscriptenWebGLGetTexPixelData = (type, format, width, height, pixels, internalFormat) => {
      var heap = heapObjectForWebGLType(type);
      var sizePerPixel = colorChannelsInGlTextureFormat(format) * heap.BYTES_PER_ELEMENT;
      var bytes = computeUnpackAlignedImageSize(width, height, sizePerPixel);
      return heap.subarray(toTypedArrayIndex(pixels, heap), toTypedArrayIndex(pixels + bytes, heap));
    };
    var _glTexImage2D = (target, level, internalFormat, width, height, border, format, type, pixels) => {
      if (GL.currentContext.version >= 2) {
        if (GLctx.currentPixelUnpackBufferBinding) {
          GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels);
          return;
        }
        if (pixels) {
          var heap = heapObjectForWebGLType(type);
          var index = toTypedArrayIndex(pixels, heap);
          GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, heap, index);
          return;
        }
      }
      var pixelData = pixels
        ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat)
        : null;
      GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixelData);
    };
    var _glTexParameteri = (x0, x1, x2) => GLctx.texParameteri(x0, x1, x2);
    var webglGetUniformLocation = (location) => {
      var p = GLctx.currentProgram;
      if (p) {
        var webglLoc = p.uniformLocsById[location];
        if (typeof webglLoc == 'number') {
          p.uniformLocsById[location] = webglLoc = GLctx.getUniformLocation(
            p,
            p.uniformArrayNamesById[location] + (webglLoc > 0 ? `[${webglLoc}]` : ''),
          );
        }
        return webglLoc;
      } else {
        GL.recordError(1282);
      }
    };
    var _glUniform1f = (location, v0) => {
      GLctx.uniform1f(webglGetUniformLocation(location), v0);
    };
    var miniTempWebGLIntBuffers = [];
    var _glUniform1iv = (location, count, value) => {
      if (GL.currentContext.version >= 2) {
        count && GLctx.uniform1iv(webglGetUniformLocation(location), HEAP32, value >> 2, count);
        return;
      }
      if (count <= 288) {
        var view = miniTempWebGLIntBuffers[count];
        for (var i = 0; i < count; ++i) {
          view[i] = HEAP32[(value + 4 * i) >> 2];
        }
      } else {
        var view = HEAP32.subarray(value >> 2, (value + count * 4) >> 2);
      }
      GLctx.uniform1iv(webglGetUniformLocation(location), view);
    };
    var _glUniformBlockBinding = (program, uniformBlockIndex, uniformBlockBinding) => {
      program = GL.programs[program];
      GLctx.uniformBlockBinding(program, uniformBlockIndex, uniformBlockBinding);
    };
    var _glUseProgram = (program) => {
      program = GL.programs[program];
      GLctx.useProgram(program);
      GLctx.currentProgram = program;
    };
    var _glVertexAttribPointer = (index, size, type, normalized, stride, ptr) => {
      var cb = GL.currentContext.clientBuffers[index];
      if (!GLctx.currentArrayBufferBinding) {
        cb.size = size;
        cb.type = type;
        cb.normalized = normalized;
        cb.stride = stride;
        cb.ptr = ptr;
        cb.clientside = true;
        cb.vertexAttribPointerAdaptor = function (index, size, type, normalized, stride, ptr) {
          this.vertexAttribPointer(index, size, type, normalized, stride, ptr);
        };
        return;
      }
      cb.clientside = false;
      GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
    };
    var _glViewport = (x0, x1, x2, x3) => GLctx.viewport(x0, x1, x2, x3);
    var initRandomFill = () => {
      if (typeof crypto == 'object' && typeof crypto['getRandomValues'] == 'function') {
        return (view) => crypto.getRandomValues(view);
      } else abort('initRandomDevice');
    };
    var randomFill = (view) => (randomFill = initRandomFill())(view);
    var _random_get = (buffer, size) => {
      randomFill(HEAPU8.subarray(buffer, buffer + size));
      return 0;
    };
    var _wgpuBindGroupLayoutRelease = (id) => WebGPU.mgrBindGroupLayout.release(id);
    var _wgpuBindGroupRelease = (id) => WebGPU.mgrBindGroup.release(id);
    var _wgpuBufferDestroy = (bufferId) => {
      var bufferWrapper = WebGPU.mgrBuffer.objects[bufferId];
      if (bufferWrapper.onUnmap) {
        for (var i = 0; i < bufferWrapper.onUnmap.length; ++i) {
          bufferWrapper.onUnmap[i]();
        }
        bufferWrapper.onUnmap = undefined;
      }
      WebGPU.mgrBuffer.get(bufferId).destroy();
    };
    var setTempRet0 = (val) => __emscripten_tempret_set(val);
    var convertI32PairToI53Checked = (lo, hi) =>
      (hi + 2097152) >>> 0 < 4194305 - !!lo ? (lo >>> 0) + hi * 4294967296 : NaN;
    var _wgpuBufferGetSize = function (bufferId) {
      var ret = (() => {
        var buffer = WebGPU.mgrBuffer.get(bufferId);
        return buffer.size;
      })();
      return (
        setTempRet0(
          ((tempDouble = ret),
          +Math.abs(tempDouble) >= 1
            ? tempDouble > 0
              ? +Math.floor(tempDouble / 4294967296) >>> 0
              : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0
            : 0),
        ),
        ret >>> 0
      );
    };
    var _wgpuBufferRelease = (id) => WebGPU.mgrBuffer.release(id);
    var _wgpuCommandBufferRelease = (id) => WebGPU.mgrCommandBuffer.release(id);
    var _wgpuCommandEncoderBeginRenderPass = (encoderId, descriptor) => {
      function makeColorAttachment(caPtr) {
        var viewPtr = HEAPU32[(caPtr + 4) >> 2];
        if (viewPtr === 0) {
          return undefined;
        }
        var depthSlice = HEAP32[(caPtr + 8) >> 2];
        if (depthSlice == -1) depthSlice = undefined;
        var loadOpInt = HEAPU32[(caPtr + 16) >> 2];
        var storeOpInt = HEAPU32[(caPtr + 20) >> 2];
        var clearValue = WebGPU.makeColor(caPtr + 24);
        return {
          view: WebGPU.mgrTextureView.get(viewPtr),
          depthSlice,
          resolveTarget: WebGPU.mgrTextureView.get(HEAPU32[(caPtr + 12) >> 2]),
          clearValue,
          loadOp: WebGPU.LoadOp[loadOpInt],
          storeOp: WebGPU.StoreOp[storeOpInt],
        };
      }
      function makeColorAttachments(count, caPtr) {
        var attachments = [];
        for (var i = 0; i < count; ++i) {
          attachments.push(makeColorAttachment(caPtr + 56 * i));
        }
        return attachments;
      }
      function makeDepthStencilAttachment(dsaPtr) {
        if (dsaPtr === 0) return undefined;
        return {
          view: WebGPU.mgrTextureView.get(HEAPU32[dsaPtr >> 2]),
          depthClearValue: HEAPF32[(dsaPtr + 12) >> 2],
          depthLoadOp: WebGPU.LoadOp[HEAPU32[(dsaPtr + 4) >> 2]],
          depthStoreOp: WebGPU.StoreOp[HEAPU32[(dsaPtr + 8) >> 2]],
          depthReadOnly: !!HEAPU32[(dsaPtr + 16) >> 2],
          stencilClearValue: HEAPU32[(dsaPtr + 28) >> 2],
          stencilLoadOp: WebGPU.LoadOp[HEAPU32[(dsaPtr + 20) >> 2]],
          stencilStoreOp: WebGPU.StoreOp[HEAPU32[(dsaPtr + 24) >> 2]],
          stencilReadOnly: !!HEAPU32[(dsaPtr + 32) >> 2],
        };
      }
      function makeRenderPassTimestampWrites(twPtr) {
        if (twPtr === 0) return undefined;
        return {
          querySet: WebGPU.mgrQuerySet.get(HEAPU32[twPtr >> 2]),
          beginningOfPassWriteIndex: HEAPU32[(twPtr + 4) >> 2],
          endOfPassWriteIndex: HEAPU32[(twPtr + 8) >> 2],
        };
      }
      function makeRenderPassDescriptor(descriptor) {
        var nextInChainPtr = HEAPU32[descriptor >> 2];
        var maxDrawCount = undefined;
        if (nextInChainPtr !== 0) {
          var sType = HEAPU32[(nextInChainPtr + 4) >> 2];
          var renderPassDescriptorMaxDrawCount = nextInChainPtr;
          maxDrawCount =
            HEAPU32[(renderPassDescriptorMaxDrawCount + 4 + 8) >> 2] * 4294967296 +
            HEAPU32[(renderPassDescriptorMaxDrawCount + 8) >> 2];
        }
        var desc = {
          label: undefined,
          colorAttachments: makeColorAttachments(HEAPU32[(descriptor + 8) >> 2], HEAPU32[(descriptor + 12) >> 2]),
          depthStencilAttachment: makeDepthStencilAttachment(HEAPU32[(descriptor + 16) >> 2]),
          occlusionQuerySet: WebGPU.mgrQuerySet.get(HEAPU32[(descriptor + 20) >> 2]),
          timestampWrites: makeRenderPassTimestampWrites(HEAPU32[(descriptor + 24) >> 2]),
          maxDrawCount,
        };
        var labelPtr = HEAPU32[(descriptor + 4) >> 2];
        if (labelPtr) desc['label'] = UTF8ToString(labelPtr);
        return desc;
      }
      var desc = makeRenderPassDescriptor(descriptor);
      var commandEncoder = WebGPU.mgrCommandEncoder.get(encoderId);
      return WebGPU.mgrRenderPassEncoder.create(commandEncoder.beginRenderPass(desc));
    };
    var _wgpuCommandEncoderCopyTextureToTexture = (encoderId, srcPtr, dstPtr, copySizePtr) => {
      var commandEncoder = WebGPU.mgrCommandEncoder.get(encoderId);
      var copySize = WebGPU.makeExtent3D(copySizePtr);
      commandEncoder.copyTextureToTexture(
        WebGPU.makeImageCopyTexture(srcPtr),
        WebGPU.makeImageCopyTexture(dstPtr),
        copySize,
      );
    };
    var _wgpuCommandEncoderFinish = (encoderId, descriptor) => {
      var commandEncoder = WebGPU.mgrCommandEncoder.get(encoderId);
      return WebGPU.mgrCommandBuffer.create(commandEncoder.finish());
    };
    var _wgpuCommandEncoderRelease = (id) => WebGPU.mgrCommandEncoder.release(id);
    var readI53FromI64 = (ptr) => HEAPU32[ptr >> 2] + HEAP32[(ptr + 4) >> 2] * 4294967296;
    var _wgpuDeviceCreateBindGroup = (deviceId, descriptor) => {
      function makeEntry(entryPtr) {
        var bufferId = HEAPU32[(entryPtr + 8) >> 2];
        var samplerId = HEAPU32[(entryPtr + 32) >> 2];
        var textureViewId = HEAPU32[(entryPtr + 36) >> 2];
        var binding = HEAPU32[(entryPtr + 4) >> 2];
        if (bufferId) {
          var size = readI53FromI64(entryPtr + 24);
          if (size == -1) size = undefined;
          return {
            binding,
            resource: {
              buffer: WebGPU.mgrBuffer.get(bufferId),
              offset: HEAPU32[(entryPtr + 4 + 16) >> 2] * 4294967296 + HEAPU32[(entryPtr + 16) >> 2],
              size,
            },
          };
        } else if (samplerId) {
          return { binding, resource: WebGPU.mgrSampler.get(samplerId) };
        } else {
          return { binding, resource: WebGPU.mgrTextureView.get(textureViewId) };
        }
      }
      function makeEntries(count, entriesPtrs) {
        var entries = [];
        for (var i = 0; i < count; ++i) {
          entries.push(makeEntry(entriesPtrs + 40 * i));
        }
        return entries;
      }
      var desc = {
        label: undefined,
        layout: WebGPU.mgrBindGroupLayout.get(HEAPU32[(descriptor + 8) >> 2]),
        entries: makeEntries(HEAPU32[(descriptor + 12) >> 2], HEAPU32[(descriptor + 16) >> 2]),
      };
      var labelPtr = HEAPU32[(descriptor + 4) >> 2];
      if (labelPtr) desc['label'] = UTF8ToString(labelPtr);
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrBindGroup.create(device.createBindGroup(desc));
    };
    var _wgpuDeviceCreateBindGroupLayout = (deviceId, descriptor) => {
      function makeBufferEntry(entryPtr) {
        var typeInt = HEAPU32[(entryPtr + 4) >> 2];
        if (!typeInt) return undefined;
        return {
          type: WebGPU.BufferBindingType[typeInt],
          hasDynamicOffset: !!HEAPU32[(entryPtr + 8) >> 2],
          minBindingSize: HEAPU32[(entryPtr + 4 + 16) >> 2] * 4294967296 + HEAPU32[(entryPtr + 16) >> 2],
        };
      }
      function makeSamplerEntry(entryPtr) {
        var typeInt = HEAPU32[(entryPtr + 4) >> 2];
        if (!typeInt) return undefined;
        return { type: WebGPU.SamplerBindingType[typeInt] };
      }
      function makeTextureEntry(entryPtr) {
        var sampleTypeInt = HEAPU32[(entryPtr + 4) >> 2];
        if (!sampleTypeInt) return undefined;
        return {
          sampleType: WebGPU.TextureSampleType[sampleTypeInt],
          viewDimension: WebGPU.TextureViewDimension[HEAPU32[(entryPtr + 8) >> 2]],
          multisampled: !!HEAPU32[(entryPtr + 12) >> 2],
        };
      }
      function makeStorageTextureEntry(entryPtr) {
        var accessInt = HEAPU32[(entryPtr + 4) >> 2];
        if (!accessInt) return undefined;
        return {
          access: WebGPU.StorageTextureAccess[accessInt],
          format: WebGPU.TextureFormat[HEAPU32[(entryPtr + 8) >> 2]],
          viewDimension: WebGPU.TextureViewDimension[HEAPU32[(entryPtr + 12) >> 2]],
        };
      }
      function makeEntry(entryPtr) {
        return {
          binding: HEAPU32[(entryPtr + 4) >> 2],
          visibility: HEAPU32[(entryPtr + 8) >> 2],
          buffer: makeBufferEntry(entryPtr + 16),
          sampler: makeSamplerEntry(entryPtr + 40),
          texture: makeTextureEntry(entryPtr + 48),
          storageTexture: makeStorageTextureEntry(entryPtr + 64),
        };
      }
      function makeEntries(count, entriesPtrs) {
        var entries = [];
        for (var i = 0; i < count; ++i) {
          entries.push(makeEntry(entriesPtrs + 80 * i));
        }
        return entries;
      }
      var desc = { entries: makeEntries(HEAPU32[(descriptor + 8) >> 2], HEAPU32[(descriptor + 12) >> 2]) };
      var labelPtr = HEAPU32[(descriptor + 4) >> 2];
      if (labelPtr) desc['label'] = UTF8ToString(labelPtr);
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrBindGroupLayout.create(device.createBindGroupLayout(desc));
    };
    var _wgpuDeviceCreateBuffer = (deviceId, descriptor) => {
      var mappedAtCreation = !!HEAPU32[(descriptor + 24) >> 2];
      var desc = {
        label: undefined,
        usage: HEAPU32[(descriptor + 8) >> 2],
        size: HEAPU32[(descriptor + 4 + 16) >> 2] * 4294967296 + HEAPU32[(descriptor + 16) >> 2],
        mappedAtCreation,
      };
      var labelPtr = HEAPU32[(descriptor + 4) >> 2];
      if (labelPtr) desc['label'] = UTF8ToString(labelPtr);
      var device = WebGPU.mgrDevice.get(deviceId);
      var bufferWrapper = {};
      var id = WebGPU.mgrBuffer.create(device.createBuffer(desc), bufferWrapper);
      if (mappedAtCreation) {
        bufferWrapper.mapMode = 2;
        bufferWrapper.onUnmap = [];
      }
      return id;
    };
    var _wgpuDeviceCreateCommandEncoder = (deviceId, descriptor) => {
      var desc;
      if (descriptor) {
        desc = { label: undefined };
        var labelPtr = HEAPU32[(descriptor + 4) >> 2];
        if (labelPtr) desc['label'] = UTF8ToString(labelPtr);
      }
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrCommandEncoder.create(device.createCommandEncoder(desc));
    };
    var _wgpuDeviceCreatePipelineLayout = (deviceId, descriptor) => {
      var bglCount = HEAPU32[(descriptor + 8) >> 2];
      var bglPtr = HEAPU32[(descriptor + 12) >> 2];
      var bgls = [];
      for (var i = 0; i < bglCount; ++i) {
        bgls.push(WebGPU.mgrBindGroupLayout.get(HEAPU32[(bglPtr + 4 * i) >> 2]));
      }
      var desc = { label: undefined, bindGroupLayouts: bgls };
      var labelPtr = HEAPU32[(descriptor + 4) >> 2];
      if (labelPtr) desc['label'] = UTF8ToString(labelPtr);
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrPipelineLayout.create(device.createPipelineLayout(desc));
    };
    var generateRenderPipelineDesc = (descriptor) => {
      function makePrimitiveState(rsPtr) {
        if (!rsPtr) return undefined;
        var nextInChainPtr = HEAPU32[rsPtr >> 2];
        var sType = nextInChainPtr ? HEAPU32[(nextInChainPtr + 4) >> 2] : 0;
        return {
          topology: WebGPU.PrimitiveTopology[HEAPU32[(rsPtr + 4) >> 2]],
          stripIndexFormat: WebGPU.IndexFormat[HEAPU32[(rsPtr + 8) >> 2]],
          frontFace: WebGPU.FrontFace[HEAPU32[(rsPtr + 12) >> 2]],
          cullMode: WebGPU.CullMode[HEAPU32[(rsPtr + 16) >> 2]],
          unclippedDepth: sType === 7 && !!HEAPU32[(nextInChainPtr + 8) >> 2],
        };
      }
      function makeBlendComponent(bdPtr) {
        if (!bdPtr) return undefined;
        return {
          operation: WebGPU.BlendOperation[HEAPU32[bdPtr >> 2]],
          srcFactor: WebGPU.BlendFactor[HEAPU32[(bdPtr + 4) >> 2]],
          dstFactor: WebGPU.BlendFactor[HEAPU32[(bdPtr + 8) >> 2]],
        };
      }
      function makeBlendState(bsPtr) {
        if (!bsPtr) return undefined;
        return { alpha: makeBlendComponent(bsPtr + 12), color: makeBlendComponent(bsPtr + 0) };
      }
      function makeColorState(csPtr) {
        var formatInt = HEAPU32[(csPtr + 4) >> 2];
        return formatInt === 0
          ? undefined
          : {
              format: WebGPU.TextureFormat[formatInt],
              blend: makeBlendState(HEAPU32[(csPtr + 8) >> 2]),
              writeMask: HEAPU32[(csPtr + 12) >> 2],
            };
      }
      function makeColorStates(count, csArrayPtr) {
        var states = [];
        for (var i = 0; i < count; ++i) {
          states.push(makeColorState(csArrayPtr + 16 * i));
        }
        return states;
      }
      function makeStencilStateFace(ssfPtr) {
        return {
          compare: WebGPU.CompareFunction[HEAPU32[ssfPtr >> 2]],
          failOp: WebGPU.StencilOperation[HEAPU32[(ssfPtr + 4) >> 2]],
          depthFailOp: WebGPU.StencilOperation[HEAPU32[(ssfPtr + 8) >> 2]],
          passOp: WebGPU.StencilOperation[HEAPU32[(ssfPtr + 12) >> 2]],
        };
      }
      function makeDepthStencilState(dssPtr) {
        if (!dssPtr) return undefined;
        return {
          format: WebGPU.TextureFormat[HEAPU32[(dssPtr + 4) >> 2]],
          depthWriteEnabled: !!HEAPU32[(dssPtr + 8) >> 2],
          depthCompare: WebGPU.CompareFunction[HEAPU32[(dssPtr + 12) >> 2]],
          stencilFront: makeStencilStateFace(dssPtr + 16),
          stencilBack: makeStencilStateFace(dssPtr + 32),
          stencilReadMask: HEAPU32[(dssPtr + 48) >> 2],
          stencilWriteMask: HEAPU32[(dssPtr + 52) >> 2],
          depthBias: HEAP32[(dssPtr + 56) >> 2],
          depthBiasSlopeScale: HEAPF32[(dssPtr + 60) >> 2],
          depthBiasClamp: HEAPF32[(dssPtr + 64) >> 2],
        };
      }
      function makeVertexAttribute(vaPtr) {
        return {
          format: WebGPU.VertexFormat[HEAPU32[vaPtr >> 2]],
          offset: HEAPU32[(vaPtr + 4 + 8) >> 2] * 4294967296 + HEAPU32[(vaPtr + 8) >> 2],
          shaderLocation: HEAPU32[(vaPtr + 16) >> 2],
        };
      }
      function makeVertexAttributes(count, vaArrayPtr) {
        var vas = [];
        for (var i = 0; i < count; ++i) {
          vas.push(makeVertexAttribute(vaArrayPtr + i * 24));
        }
        return vas;
      }
      function makeVertexBuffer(vbPtr) {
        if (!vbPtr) return undefined;
        var stepModeInt = HEAPU32[(vbPtr + 8) >> 2];
        return stepModeInt === 1
          ? null
          : {
              arrayStride: HEAPU32[(vbPtr + 4) >> 2] * 4294967296 + HEAPU32[vbPtr >> 2],
              stepMode: WebGPU.VertexStepMode[stepModeInt],
              attributes: makeVertexAttributes(HEAPU32[(vbPtr + 12) >> 2], HEAPU32[(vbPtr + 16) >> 2]),
            };
      }
      function makeVertexBuffers(count, vbArrayPtr) {
        if (!count) return undefined;
        var vbs = [];
        for (var i = 0; i < count; ++i) {
          vbs.push(makeVertexBuffer(vbArrayPtr + i * 24));
        }
        return vbs;
      }
      function makeVertexState(viPtr) {
        if (!viPtr) return undefined;
        var desc = {
          module: WebGPU.mgrShaderModule.get(HEAPU32[(viPtr + 4) >> 2]),
          constants: WebGPU.makePipelineConstants(HEAPU32[(viPtr + 12) >> 2], HEAPU32[(viPtr + 16) >> 2]),
          buffers: makeVertexBuffers(HEAPU32[(viPtr + 20) >> 2], HEAPU32[(viPtr + 24) >> 2]),
        };
        var entryPointPtr = HEAPU32[(viPtr + 8) >> 2];
        if (entryPointPtr) desc['entryPoint'] = UTF8ToString(entryPointPtr);
        return desc;
      }
      function makeMultisampleState(msPtr) {
        if (!msPtr) return undefined;
        return {
          count: HEAPU32[(msPtr + 4) >> 2],
          mask: HEAPU32[(msPtr + 8) >> 2],
          alphaToCoverageEnabled: !!HEAPU32[(msPtr + 12) >> 2],
        };
      }
      function makeFragmentState(fsPtr) {
        if (!fsPtr) return undefined;
        var desc = {
          module: WebGPU.mgrShaderModule.get(HEAPU32[(fsPtr + 4) >> 2]),
          constants: WebGPU.makePipelineConstants(HEAPU32[(fsPtr + 12) >> 2], HEAPU32[(fsPtr + 16) >> 2]),
          targets: makeColorStates(HEAPU32[(fsPtr + 20) >> 2], HEAPU32[(fsPtr + 24) >> 2]),
        };
        var entryPointPtr = HEAPU32[(fsPtr + 8) >> 2];
        if (entryPointPtr) desc['entryPoint'] = UTF8ToString(entryPointPtr);
        return desc;
      }
      var desc = {
        label: undefined,
        layout: WebGPU.makePipelineLayout(HEAPU32[(descriptor + 8) >> 2]),
        vertex: makeVertexState(descriptor + 12),
        primitive: makePrimitiveState(descriptor + 40),
        depthStencil: makeDepthStencilState(HEAPU32[(descriptor + 60) >> 2]),
        multisample: makeMultisampleState(descriptor + 64),
        fragment: makeFragmentState(HEAPU32[(descriptor + 80) >> 2]),
      };
      var labelPtr = HEAPU32[(descriptor + 4) >> 2];
      if (labelPtr) desc['label'] = UTF8ToString(labelPtr);
      return desc;
    };
    var _wgpuDeviceCreateRenderPipeline = (deviceId, descriptor) => {
      var desc = generateRenderPipelineDesc(descriptor);
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrRenderPipeline.create(device.createRenderPipeline(desc));
    };
    var _wgpuDeviceCreateSampler = (deviceId, descriptor) => {
      var desc;
      if (descriptor) {
        desc = {
          label: undefined,
          addressModeU: WebGPU.AddressMode[HEAPU32[(descriptor + 8) >> 2]],
          addressModeV: WebGPU.AddressMode[HEAPU32[(descriptor + 12) >> 2]],
          addressModeW: WebGPU.AddressMode[HEAPU32[(descriptor + 16) >> 2]],
          magFilter: WebGPU.FilterMode[HEAPU32[(descriptor + 20) >> 2]],
          minFilter: WebGPU.FilterMode[HEAPU32[(descriptor + 24) >> 2]],
          mipmapFilter: WebGPU.MipmapFilterMode[HEAPU32[(descriptor + 28) >> 2]],
          lodMinClamp: HEAPF32[(descriptor + 32) >> 2],
          lodMaxClamp: HEAPF32[(descriptor + 36) >> 2],
          compare: WebGPU.CompareFunction[HEAPU32[(descriptor + 40) >> 2]],
        };
        var labelPtr = HEAPU32[(descriptor + 4) >> 2];
        if (labelPtr) desc['label'] = UTF8ToString(labelPtr);
      }
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrSampler.create(device.createSampler(desc));
    };
    var _wgpuDeviceCreateShaderModule = (deviceId, descriptor) => {
      var nextInChainPtr = HEAPU32[descriptor >> 2];
      var sType = HEAPU32[(nextInChainPtr + 4) >> 2];
      var desc = { label: undefined, code: '' };
      var labelPtr = HEAPU32[(descriptor + 4) >> 2];
      if (labelPtr) desc['label'] = UTF8ToString(labelPtr);
      switch (sType) {
        case 5: {
          var count = HEAPU32[(nextInChainPtr + 8) >> 2];
          var start = HEAPU32[(nextInChainPtr + 12) >> 2];
          var offset = start >> 2;
          desc['code'] = HEAPU32.subarray(offset, offset + count);
          break;
        }
        case 6: {
          var sourcePtr = HEAPU32[(nextInChainPtr + 8) >> 2];
          if (sourcePtr) {
            desc['code'] = UTF8ToString(sourcePtr);
          }
          break;
        }
      }
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrShaderModule.create(device.createShaderModule(desc));
    };
    var _wgpuDeviceCreateTexture = (deviceId, descriptor) => {
      var desc = {
        label: undefined,
        size: WebGPU.makeExtent3D(descriptor + 16),
        mipLevelCount: HEAPU32[(descriptor + 32) >> 2],
        sampleCount: HEAPU32[(descriptor + 36) >> 2],
        dimension: WebGPU.TextureDimension[HEAPU32[(descriptor + 12) >> 2]],
        format: WebGPU.TextureFormat[HEAPU32[(descriptor + 28) >> 2]],
        usage: HEAPU32[(descriptor + 8) >> 2],
      };
      var labelPtr = HEAPU32[(descriptor + 4) >> 2];
      if (labelPtr) desc['label'] = UTF8ToString(labelPtr);
      var viewFormatCount = HEAPU32[(descriptor + 40) >> 2];
      if (viewFormatCount) {
        var viewFormatsPtr = HEAPU32[(descriptor + 44) >> 2];
        desc['viewFormats'] = Array.from(
          HEAP32.subarray(viewFormatsPtr >> 2, (viewFormatsPtr + viewFormatCount * 4) >> 2),
          (format) => WebGPU.TextureFormat[format],
        );
      }
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrTexture.create(device.createTexture(desc));
    };
    var _wgpuDeviceGetQueue = (deviceId) => {
      var queueId = WebGPU.mgrDevice.objects[deviceId].queueId;
      WebGPU.mgrQueue.reference(queueId);
      return queueId;
    };
    var _wgpuInstanceCreateSurface = (instanceId, descriptor) => {
      var nextInChainPtr = HEAPU32[descriptor >> 2];
      var descriptorFromCanvasHTMLSelector = nextInChainPtr;
      var selectorPtr = HEAPU32[(descriptorFromCanvasHTMLSelector + 8) >> 2];
      var canvas = findCanvasEventTarget(selectorPtr);
      var context = canvas.getContext('webgpu');
      if (!context) return 0;
      var labelPtr = HEAPU32[(descriptor + 4) >> 2];
      if (labelPtr) context.surfaceLabelWebGPU = UTF8ToString(labelPtr);
      return WebGPU.mgrSurface.create(context);
    };
    var _wgpuPipelineLayoutRelease = (id) => WebGPU.mgrPipelineLayout.release(id);
    var _wgpuQueueRelease = (id) => WebGPU.mgrQueue.release(id);
    var _wgpuQueueSubmit = (queueId, commandCount, commands) => {
      var queue = WebGPU.mgrQueue.get(queueId);
      var cmds = Array.from(HEAP32.subarray(commands >> 2, (commands + commandCount * 4) >> 2), (id) =>
        WebGPU.mgrCommandBuffer.get(id),
      );
      queue.submit(cmds);
    };
    function _wgpuQueueWriteBuffer(queueId, bufferId, bufferOffset_low, bufferOffset_high, data, size) {
      var bufferOffset = convertI32PairToI53Checked(bufferOffset_low, bufferOffset_high);
      var queue = WebGPU.mgrQueue.get(queueId);
      var buffer = WebGPU.mgrBuffer.get(bufferId);
      var subarray = HEAPU8.subarray(data, data + size);
      queue.writeBuffer(buffer, bufferOffset, subarray, 0, size);
    }
    var _wgpuQueueWriteTexture = (queueId, destinationPtr, data, dataSize, dataLayoutPtr, writeSizePtr) => {
      var queue = WebGPU.mgrQueue.get(queueId);
      var destination = WebGPU.makeImageCopyTexture(destinationPtr);
      var dataLayout = WebGPU.makeTextureDataLayout(dataLayoutPtr);
      var writeSize = WebGPU.makeExtent3D(writeSizePtr);
      var subarray = HEAPU8.subarray(data, data + dataSize);
      queue.writeTexture(destination, subarray, dataLayout, writeSize);
    };
    var _wgpuRenderPassEncoderDrawIndexed = (
      passId,
      indexCount,
      instanceCount,
      firstIndex,
      baseVertex,
      firstInstance,
    ) => {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      pass.drawIndexed(indexCount, instanceCount, firstIndex, baseVertex, firstInstance);
    };
    var _wgpuRenderPassEncoderEnd = (encoderId) => {
      var encoder = WebGPU.mgrRenderPassEncoder.get(encoderId);
      encoder.end();
    };
    var _wgpuRenderPassEncoderRelease = (id) => WebGPU.mgrRenderPassEncoder.release(id);
    var _wgpuRenderPassEncoderSetBindGroup = (passId, groupIndex, groupId, dynamicOffsetCount, dynamicOffsetsPtr) => {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      var group = WebGPU.mgrBindGroup.get(groupId);
      if (dynamicOffsetCount == 0) {
        pass.setBindGroup(groupIndex, group);
      } else {
        var offsets = [];
        for (var i = 0; i < dynamicOffsetCount; i++, dynamicOffsetsPtr += 4) {
          offsets.push(HEAPU32[dynamicOffsetsPtr >> 2]);
        }
        pass.setBindGroup(groupIndex, group, offsets);
      }
    };
    function _wgpuRenderPassEncoderSetIndexBuffer(
      passId,
      bufferId,
      format,
      offset_low,
      offset_high,
      size_low,
      size_high,
    ) {
      var offset = convertI32PairToI53Checked(offset_low, offset_high);
      var size = convertI32PairToI53Checked(size_low, size_high);
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      var buffer = WebGPU.mgrBuffer.get(bufferId);
      if (size == -1) size = undefined;
      pass.setIndexBuffer(buffer, WebGPU.IndexFormat[format], offset, size);
    }
    var _wgpuRenderPassEncoderSetPipeline = (passId, pipelineId) => {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      var pipeline = WebGPU.mgrRenderPipeline.get(pipelineId);
      pass.setPipeline(pipeline);
    };
    var _wgpuRenderPassEncoderSetScissorRect = (passId, x, y, w, h) => {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      pass.setScissorRect(x, y, w, h);
    };
    var _wgpuRenderPassEncoderSetStencilReference = (passId, reference) => {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      pass.setStencilReference(reference);
    };
    function _wgpuRenderPassEncoderSetVertexBuffer(
      passId,
      slot,
      bufferId,
      offset_low,
      offset_high,
      size_low,
      size_high,
    ) {
      var offset = convertI32PairToI53Checked(offset_low, offset_high);
      var size = convertI32PairToI53Checked(size_low, size_high);
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      var buffer = WebGPU.mgrBuffer.get(bufferId);
      if (size == -1) size = undefined;
      pass.setVertexBuffer(slot, buffer, offset, size);
    }
    var _wgpuRenderPipelineRelease = (id) => WebGPU.mgrRenderPipeline.release(id);
    var _wgpuSamplerRelease = (id) => WebGPU.mgrSampler.release(id);
    var _wgpuShaderModuleRelease = (id) => WebGPU.mgrShaderModule.release(id);
    var _wgpuSurfaceConfigure = (surfaceId, config) => {
      var deviceId = HEAPU32[(config + 4) >> 2];
      var context = WebGPU.mgrSurface.get(surfaceId);
      var canvasSize = [HEAPU32[(config + 28) >> 2], HEAPU32[(config + 32) >> 2]];
      if (canvasSize[0] !== 0) {
        context['canvas']['width'] = canvasSize[0];
      }
      if (canvasSize[1] !== 0) {
        context['canvas']['height'] = canvasSize[1];
      }
      var configuration = {
        device: WebGPU.mgrDevice.get(deviceId),
        format: WebGPU.TextureFormat[HEAPU32[(config + 8) >> 2]],
        usage: HEAPU32[(config + 12) >> 2],
        alphaMode: WebGPU.AlphaMode[HEAPU32[(config + 24) >> 2]],
      };
      var viewFormatCount = HEAPU32[(config + 16) >> 2];
      if (viewFormatCount) {
        var viewFormats = HEAPU32[(config + 20) >> 2];
        configuration['viewFormats'] = Array.from(
          HEAP32.subarray(viewFormats >> 2, (viewFormats + viewFormatCount * 4) >> 2),
          (format) => WebGPU.TextureFormat[format],
        );
      }
      context.configure(configuration);
    };
    var _wgpuSurfaceGetCurrentTexture = (surfaceId, surfaceTexturePtr) => {
      var context = WebGPU.mgrSurface.get(surfaceId);
      try {
        var texture = WebGPU.mgrTexture.create(context.getCurrentTexture());
        HEAPU32[surfaceTexturePtr >> 2] = texture;
        HEAP32[(surfaceTexturePtr + 4) >> 2] = 0;
        HEAP32[(surfaceTexturePtr + 8) >> 2] = 0;
      } catch (ex) {
        HEAPU32[surfaceTexturePtr >> 2] = 0;
        HEAP32[(surfaceTexturePtr + 4) >> 2] = 0;
        HEAP32[(surfaceTexturePtr + 8) >> 2] = 5;
      }
    };
    var _wgpuSurfaceRelease = (id) => WebGPU.mgrSurface.release(id);
    var _wgpuSurfaceUnconfigure = (surfaceId) => {
      var context = WebGPU.mgrSurface.get(surfaceId);
      context.unconfigure();
    };
    var _wgpuTextureCreateView = (textureId, descriptor) => {
      var desc;
      if (descriptor) {
        var mipLevelCount = HEAPU32[(descriptor + 20) >> 2];
        var arrayLayerCount = HEAPU32[(descriptor + 28) >> 2];
        desc = {
          format: WebGPU.TextureFormat[HEAPU32[(descriptor + 8) >> 2]],
          dimension: WebGPU.TextureViewDimension[HEAPU32[(descriptor + 12) >> 2]],
          baseMipLevel: HEAPU32[(descriptor + 16) >> 2],
          mipLevelCount: mipLevelCount === 4294967295 ? undefined : mipLevelCount,
          baseArrayLayer: HEAPU32[(descriptor + 24) >> 2],
          arrayLayerCount: arrayLayerCount === 4294967295 ? undefined : arrayLayerCount,
          aspect: WebGPU.TextureAspect[HEAPU32[(descriptor + 32) >> 2]],
        };
        var labelPtr = HEAPU32[(descriptor + 4) >> 2];
        if (labelPtr) desc['label'] = UTF8ToString(labelPtr);
      }
      var texture = WebGPU.mgrTexture.get(textureId);
      return WebGPU.mgrTextureView.create(texture.createView(desc));
    };
    var _wgpuTextureDestroy = (textureId) => WebGPU.mgrTexture.get(textureId).destroy();
    var _wgpuTextureGetFormat = (textureId) => {
      var texture = WebGPU.mgrTexture.get(textureId);
      return WebGPU.TextureFormat.indexOf(texture.format);
    };
    var _wgpuTextureGetHeight = (textureId) => {
      var texture = WebGPU.mgrTexture.get(textureId);
      return texture.height;
    };
    var _wgpuTextureGetWidth = (textureId) => {
      var texture = WebGPU.mgrTexture.get(textureId);
      return texture.width;
    };
    var _wgpuTextureRelease = (id) => WebGPU.mgrTexture.release(id);
    var _wgpuTextureViewRelease = (id) => WebGPU.mgrTextureView.release(id);
    InternalError = Module['InternalError'] = class InternalError extends Error {
      constructor(message) {
        super(message);
        this.name = 'InternalError';
      }
    };
    embind_init_charCodes();
    BindingError = Module['BindingError'] = class BindingError extends Error {
      constructor(message) {
        super(message);
        this.name = 'BindingError';
      }
    };
    init_ClassHandle();
    init_RegisteredPointer();
    UnboundTypeError = Module['UnboundTypeError'] = extendError(Error, 'UnboundTypeError');
    init_emval();
    registerPreMainLoop(() => GL.newRenderingFrameStarted());
    WebGPU.initManagers();
    for (var i = 0; i < 32; ++i) tempFixedLengthArray.push(new Array(i));
    var miniTempWebGLIntBuffersStorage = new Int32Array(288);
    for (var i = 0; i <= 288; ++i) {
      miniTempWebGLIntBuffers[i] = miniTempWebGLIntBuffersStorage.subarray(0, i);
    }
    var wasmImports = {
      b: ___assert_fail,
      B: ___cxa_throw,
      Pb: ___syscall_fstat64,
      Mb: ___syscall_getcwd,
      Nb: ___syscall_newfstatat,
      Sb: ___syscall_openat,
      Ob: ___syscall_stat64,
      Wb: __abort_js,
      oa: __embind_finalize_value_object,
      Db: __embind_register_bigint,
      wb: __embind_register_bool,
      _: __embind_register_class,
      Z: __embind_register_class_constructor,
      e: __embind_register_class_function,
      vb: __embind_register_emval,
      ha: __embind_register_enum,
      r: __embind_register_enum_value,
      Ia: __embind_register_float,
      na: __embind_register_function,
      D: __embind_register_integer,
      m: __embind_register_memory_view,
      ma: __embind_register_optional,
      dc: __embind_register_smart_ptr,
      Ja: __embind_register_std_string,
      la: __embind_register_std_wstring,
      qa: __embind_register_value_object,
      x: __embind_register_value_object_field,
      xb: __embind_register_void,
      Tb: __emscripten_memcpy_js,
      Kb: __emscripten_runtime_keepalive_clear,
      Fb: __emscripten_throw_longjmp,
      Jb: __emval_call,
      P: __emval_decref,
      Eb: __emval_get_method_caller,
      Ub: __emval_incref,
      yb: __emval_run_destructors,
      Q: __emval_take_value,
      Gb: __setitimer_js,
      Hb: __tzset_js,
      oc: _emscripten_get_now,
      Ib: _emscripten_resize_heap,
      ac: _emscripten_webgl_create_context,
      cc: _emscripten_webgl_destroy_context,
      R: _emscripten_webgl_get_current_context,
      M: _emscripten_webgl_make_context_current,
      $b: _emscripten_webgpu_get_device,
      Yb: _environ_get,
      Zb: _environ_sizes_get,
      Vb: _fd_close,
      Rb: _fd_read,
      Qb: _fd_write,
      bb: _glActiveTexture,
      wa: _glAttachShader,
      y: _glBindBuffer,
      $a: _glBindBufferRange,
      u: _glBindFramebuffer,
      ka: _glBindRenderbuffer,
      S: _glBindTexture,
      ya: _glBindVertexArray,
      ga: _glBlendEquation,
      C: _glBlendFunc,
      ra: _glBlitFramebuffer,
      Aa: _glBufferData,
      sa: _glClear,
      ta: _glClearColor,
      Ya: _glClearDepthf,
      Za: _glClearStencil,
      J: _glColorMask,
      mb: _glCompileShader,
      kb: _glCreateProgram,
      ob: _glCreateShader,
      Wa: _glCullFace,
      za: _glDeleteBuffers,
      ub: _glDeleteFramebuffers,
      ua: _glDeleteProgram,
      tb: _glDeleteRenderbuffers,
      ia: _glDeleteShader,
      Ha: _glDeleteTextures,
      pb: _glDeleteVertexArrays,
      Ua: _glDepthFunc,
      V: _glDepthMask,
      N: _glDisable,
      fb: _glDisableVertexAttribArray,
      _a: _glDrawElements,
      I: _glEnable,
      db: _glEnableVertexAttribArray,
      Da: _glFramebufferRenderbuffer,
      sb: _glFramebufferTexture2D,
      Va: _glFrontFace,
      rb: _glGenBuffers,
      Ga: _glGenFramebuffers,
      Fa: _glGenRenderbuffers,
      Ca: _glGenTextures,
      qb: _glGenVertexArrays,
      ja: _glGetIntegerv,
      ib: _glGetProgramInfoLog,
      va: _glGetProgramiv,
      lb: _glGetShaderInfoLog,
      xa: _glGetShaderiv,
      s: _glGetUniformBlockIndex,
      F: _glGetUniformLocation,
      Xa: _glInvalidateFramebuffer,
      jb: _glLinkProgram,
      Ea: _glRenderbufferStorageMultisample,
      O: _glScissor,
      nb: _glShaderSource,
      Y: _glStencilFunc,
      L: _glStencilFuncSeparate,
      X: _glStencilOp,
      K: _glStencilOpSeparate,
      Ba: _glTexImage2D,
      G: _glTexParameteri,
      eb: _glUniform1f,
      gb: _glUniform1iv,
      ab: _glUniformBlockBinding,
      hb: _glUseProgram,
      cb: _glVertexAttribPointer,
      W: _glViewport,
      n: invoke_ii,
      i: invoke_iii,
      g: invoke_iiii,
      $: invoke_iiiiii,
      a: invoke_vi,
      c: invoke_vii,
      h: invoke_viii,
      T: invoke_viiii,
      Xb: _proc_exit,
      Lb: _random_get,
      A: _wgpuBindGroupLayoutRelease,
      t: _wgpuBindGroupRelease,
      ic: _wgpuBufferDestroy,
      Ab: _wgpuBufferGetSize,
      hc: _wgpuBufferRelease,
      Ma: _wgpuCommandBufferRelease,
      Ra: _wgpuCommandEncoderBeginRenderPass,
      aa: _wgpuCommandEncoderCopyTextureToTexture,
      Na: _wgpuCommandEncoderFinish,
      La: _wgpuCommandEncoderRelease,
      H: _wgpuDeviceCreateBindGroup,
      z: _wgpuDeviceCreateBindGroupLayout,
      ba: _wgpuDeviceCreateBuffer,
      Oa: _wgpuDeviceCreateCommandEncoder,
      w: _wgpuDeviceCreatePipelineLayout,
      l: _wgpuDeviceCreateRenderPipeline,
      ea: _wgpuDeviceCreateSampler,
      q: _wgpuDeviceCreateShaderModule,
      U: _wgpuDeviceCreateTexture,
      Ta: _wgpuDeviceGetQueue,
      _b: _wgpuInstanceCreateSurface,
      v: _wgpuPipelineLayoutRelease,
      gc: _wgpuQueueRelease,
      da: _wgpuQueueSubmit,
      zb: _wgpuQueueWriteBuffer,
      Sa: _wgpuQueueWriteTexture,
      fa: _wgpuRenderPassEncoderDrawIndexed,
      Qa: _wgpuRenderPassEncoderEnd,
      Pa: _wgpuRenderPassEncoderRelease,
      d: _wgpuRenderPassEncoderSetBindGroup,
      Bb: _wgpuRenderPassEncoderSetIndexBuffer,
      f: _wgpuRenderPassEncoderSetPipeline,
      o: _wgpuRenderPassEncoderSetScissorRect,
      j: _wgpuRenderPassEncoderSetStencilReference,
      Cb: _wgpuRenderPassEncoderSetVertexBuffer,
      k: _wgpuRenderPipelineRelease,
      ca: _wgpuSamplerRelease,
      p: _wgpuShaderModuleRelease,
      Ka: _wgpuSurfaceConfigure,
      fc: _wgpuSurfaceGetCurrentTexture,
      bc: _wgpuSurfaceRelease,
      ec: _wgpuSurfaceUnconfigure,
      kc: _wgpuTextureCreateView,
      jc: _wgpuTextureDestroy,
      lc: _wgpuTextureGetFormat,
      mc: _wgpuTextureGetHeight,
      nc: _wgpuTextureGetWidth,
      pa: _wgpuTextureRelease,
      E: _wgpuTextureViewRelease,
    };
    var wasmExports = createWasm();
    var ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports['qc'])();
    var _malloc = (a0) => (_malloc = wasmExports['rc'])(a0);
    var ___getTypeName = (a0) => (___getTypeName = wasmExports['sc'])(a0);
    var _free = (a0) => (_free = wasmExports['uc'])(a0);
    var __emscripten_timeout = (a0, a1) => (__emscripten_timeout = wasmExports['vc'])(a0, a1);
    var _setThrew = (a0, a1) => (_setThrew = wasmExports['wc'])(a0, a1);
    var __emscripten_tempret_set = (a0) => (__emscripten_tempret_set = wasmExports['xc'])(a0);
    var __emscripten_stack_restore = (a0) => (__emscripten_stack_restore = wasmExports['yc'])(a0);
    var __emscripten_stack_alloc = (a0) => (__emscripten_stack_alloc = wasmExports['zc'])(a0);
    var _emscripten_stack_get_current = () => (_emscripten_stack_get_current = wasmExports['Ac'])();
    var dynCall_iii = (Module['dynCall_iii'] = (a0, a1, a2) =>
      (dynCall_iii = Module['dynCall_iii'] = wasmExports['Bc'])(a0, a1, a2));
    var dynCall_vi = (Module['dynCall_vi'] = (a0, a1) =>
      (dynCall_vi = Module['dynCall_vi'] = wasmExports['Cc'])(a0, a1));
    var dynCall_vii = (Module['dynCall_vii'] = (a0, a1, a2) =>
      (dynCall_vii = Module['dynCall_vii'] = wasmExports['Dc'])(a0, a1, a2));
    var dynCall_viii = (Module['dynCall_viii'] = (a0, a1, a2, a3) =>
      (dynCall_viii = Module['dynCall_viii'] = wasmExports['Ec'])(a0, a1, a2, a3));
    var dynCall_iijj = (Module['dynCall_iijj'] = (a0, a1, a2, a3, a4, a5) =>
      (dynCall_iijj = Module['dynCall_iijj'] = wasmExports['Fc'])(a0, a1, a2, a3, a4, a5));
    var dynCall_vijj = (Module['dynCall_vijj'] = (a0, a1, a2, a3, a4, a5) =>
      (dynCall_vijj = Module['dynCall_vijj'] = wasmExports['Gc'])(a0, a1, a2, a3, a4, a5));
    var dynCall_iiii = (Module['dynCall_iiii'] = (a0, a1, a2, a3) =>
      (dynCall_iiii = Module['dynCall_iiii'] = wasmExports['Hc'])(a0, a1, a2, a3));
    var dynCall_ii = (Module['dynCall_ii'] = (a0, a1) =>
      (dynCall_ii = Module['dynCall_ii'] = wasmExports['Ic'])(a0, a1));
    var dynCall_viiii = (Module['dynCall_viiii'] = (a0, a1, a2, a3, a4) =>
      (dynCall_viiii = Module['dynCall_viiii'] = wasmExports['Jc'])(a0, a1, a2, a3, a4));
    var dynCall_jiii = (Module['dynCall_jiii'] = (a0, a1, a2, a3) =>
      (dynCall_jiii = Module['dynCall_jiii'] = wasmExports['Kc'])(a0, a1, a2, a3));
    var dynCall_iiiiiiii = (Module['dynCall_iiiiiiii'] = (a0, a1, a2, a3, a4, a5, a6, a7) =>
      (dynCall_iiiiiiii = Module['dynCall_iiiiiiii'] = wasmExports['Lc'])(a0, a1, a2, a3, a4, a5, a6, a7));
    var dynCall_viiiiiii = (Module['dynCall_viiiiiii'] = (a0, a1, a2, a3, a4, a5, a6, a7) =>
      (dynCall_viiiiiii = Module['dynCall_viiiiiii'] = wasmExports['Mc'])(a0, a1, a2, a3, a4, a5, a6, a7));
    var dynCall_fi = (Module['dynCall_fi'] = (a0, a1) =>
      (dynCall_fi = Module['dynCall_fi'] = wasmExports['Nc'])(a0, a1));
    var dynCall_viiiiii = (Module['dynCall_viiiiii'] = (a0, a1, a2, a3, a4, a5, a6) =>
      (dynCall_viiiiii = Module['dynCall_viiiiii'] = wasmExports['Oc'])(a0, a1, a2, a3, a4, a5, a6));
    var dynCall_viif = (Module['dynCall_viif'] = (a0, a1, a2, a3) =>
      (dynCall_viif = Module['dynCall_viif'] = wasmExports['Pc'])(a0, a1, a2, a3));
    var dynCall_viiiiff = (Module['dynCall_viiiiff'] = (a0, a1, a2, a3, a4, a5, a6) =>
      (dynCall_viiiiff = Module['dynCall_viiiiff'] = wasmExports['Qc'])(a0, a1, a2, a3, a4, a5, a6));
    var dynCall_v = (Module['dynCall_v'] = (a0) => (dynCall_v = Module['dynCall_v'] = wasmExports['Rc'])(a0));
    var dynCall_i = (Module['dynCall_i'] = (a0) => (dynCall_i = Module['dynCall_i'] = wasmExports['Sc'])(a0));
    var dynCall_viiif = (Module['dynCall_viiif'] = (a0, a1, a2, a3, a4) =>
      (dynCall_viiif = Module['dynCall_viiif'] = wasmExports['Tc'])(a0, a1, a2, a3, a4));
    var dynCall_iiiif = (Module['dynCall_iiiif'] = (a0, a1, a2, a3, a4) =>
      (dynCall_iiiif = Module['dynCall_iiiif'] = wasmExports['Uc'])(a0, a1, a2, a3, a4));
    var dynCall_iiiii = (Module['dynCall_iiiii'] = (a0, a1, a2, a3, a4) =>
      (dynCall_iiiii = Module['dynCall_iiiii'] = wasmExports['Vc'])(a0, a1, a2, a3, a4));
    var dynCall_fii = (Module['dynCall_fii'] = (a0, a1, a2) =>
      (dynCall_fii = Module['dynCall_fii'] = wasmExports['Wc'])(a0, a1, a2));
    var dynCall_iiiiii = (Module['dynCall_iiiiii'] = (a0, a1, a2, a3, a4, a5) =>
      (dynCall_iiiiii = Module['dynCall_iiiiii'] = wasmExports['Xc'])(a0, a1, a2, a3, a4, a5));
    var dynCall_viiiii = (Module['dynCall_viiiii'] = (a0, a1, a2, a3, a4, a5) =>
      (dynCall_viiiii = Module['dynCall_viiiii'] = wasmExports['Yc'])(a0, a1, a2, a3, a4, a5));
    var dynCall_iif = (Module['dynCall_iif'] = (a0, a1, a2) =>
      (dynCall_iif = Module['dynCall_iif'] = wasmExports['Zc'])(a0, a1, a2));
    var dynCall_iiif = (Module['dynCall_iiif'] = (a0, a1, a2, a3) =>
      (dynCall_iiif = Module['dynCall_iiif'] = wasmExports['_c'])(a0, a1, a2, a3));
    var dynCall_iiiiiii = (Module['dynCall_iiiiiii'] = (a0, a1, a2, a3, a4, a5, a6) =>
      (dynCall_iiiiiii = Module['dynCall_iiiiiii'] = wasmExports['$c'])(a0, a1, a2, a3, a4, a5, a6));
    var dynCall_iiff = (Module['dynCall_iiff'] = (a0, a1, a2, a3) =>
      (dynCall_iiff = Module['dynCall_iiff'] = wasmExports['ad'])(a0, a1, a2, a3));
    var dynCall_iiiff = (Module['dynCall_iiiff'] = (a0, a1, a2, a3, a4) =>
      (dynCall_iiiff = Module['dynCall_iiiff'] = wasmExports['bd'])(a0, a1, a2, a3, a4));
    var dynCall_iiiiiffiii = (Module['dynCall_iiiiiffiii'] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) =>
      (dynCall_iiiiiffiii = Module['dynCall_iiiiiffiii'] = wasmExports['cd'])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9));
    var dynCall_iidiiii = (Module['dynCall_iidiiii'] = (a0, a1, a2, a3, a4, a5, a6) =>
      (dynCall_iidiiii = Module['dynCall_iidiiii'] = wasmExports['dd'])(a0, a1, a2, a3, a4, a5, a6));
    var dynCall_viijii = (Module['dynCall_viijii'] = (a0, a1, a2, a3, a4, a5, a6) =>
      (dynCall_viijii = Module['dynCall_viijii'] = wasmExports['ed'])(a0, a1, a2, a3, a4, a5, a6));
    var dynCall_iiiiiiiii = (Module['dynCall_iiiiiiiii'] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) =>
      (dynCall_iiiiiiiii = Module['dynCall_iiiiiiiii'] = wasmExports['fd'])(a0, a1, a2, a3, a4, a5, a6, a7, a8));
    var dynCall_iiiiij = (Module['dynCall_iiiiij'] = (a0, a1, a2, a3, a4, a5, a6) =>
      (dynCall_iiiiij = Module['dynCall_iiiiij'] = wasmExports['gd'])(a0, a1, a2, a3, a4, a5, a6));
    var dynCall_iiiiid = (Module['dynCall_iiiiid'] = (a0, a1, a2, a3, a4, a5) =>
      (dynCall_iiiiid = Module['dynCall_iiiiid'] = wasmExports['hd'])(a0, a1, a2, a3, a4, a5));
    var dynCall_iiiiijj = (Module['dynCall_iiiiijj'] = (a0, a1, a2, a3, a4, a5, a6, a7, a8) =>
      (dynCall_iiiiijj = Module['dynCall_iiiiijj'] = wasmExports['id'])(a0, a1, a2, a3, a4, a5, a6, a7, a8));
    var dynCall_iiiiiijj = (Module['dynCall_iiiiiijj'] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) =>
      (dynCall_iiiiiijj = Module['dynCall_iiiiiijj'] = wasmExports['jd'])(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9));
    var _asyncify_start_unwind = (a0) => (_asyncify_start_unwind = wasmExports['kd'])(a0);
    var _asyncify_stop_unwind = () => (_asyncify_stop_unwind = wasmExports['ld'])();
    var _asyncify_start_rewind = (a0) => (_asyncify_start_rewind = wasmExports['md'])(a0);
    var _asyncify_stop_rewind = () => (_asyncify_stop_rewind = wasmExports['nd'])();
    function invoke_vi(index, a1) {
      var sp = stackSave();
      try {
        dynCall_vi(index, a1);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_vii(index, a1, a2) {
      var sp = stackSave();
      try {
        dynCall_vii(index, a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_ii(index, a1) {
      var sp = stackSave();
      try {
        return dynCall_ii(index, a1);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiii(index, a1, a2, a3) {
      var sp = stackSave();
      try {
        return dynCall_iiii(index, a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
      var sp = stackSave();
      try {
        return dynCall_iiiiii(index, a1, a2, a3, a4, a5);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viiii(index, a1, a2, a3, a4) {
      var sp = stackSave();
      try {
        dynCall_viiii(index, a1, a2, a3, a4);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_iii(index, a1, a2) {
      var sp = stackSave();
      try {
        return dynCall_iii(index, a1, a2);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    function invoke_viii(index, a1, a2, a3) {
      var sp = stackSave();
      try {
        dynCall_viii(index, a1, a2, a3);
      } catch (e) {
        stackRestore(sp);
        if (e !== e + 0) throw e;
        _setThrew(1, 0);
      }
    }
    var calledRun;
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
        Module['calledRun'] = true;
        if (ABORT) return;
        initRuntime();
        readyPromiseResolve(Module);
        Module['onRuntimeInitialized']?.();
        postRun();
      }
      if (Module['setStatus']) {
        Module['setStatus']('Running...');
        setTimeout(() => {
          setTimeout(() => Module['setStatus'](''), 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }
    if (Module['preInit']) {
      if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
      while (Module['preInit'].length > 0) {
        Module['preInit'].pop()();
      }
    }
    run();
    moduleRtn = readyPromise;

    return moduleRtn;
  };
})();
export default createDotLottiePlayerModule;
