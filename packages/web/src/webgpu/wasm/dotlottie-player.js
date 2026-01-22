async function createDotLottiePlayerModule(moduleArg = {}) {
  var moduleRtn;
  function _defineProperty(e, r, t) {
    return (
      (r = _toPropertyKey(r)) in e
        ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 })
        : (e[r] = t),
      e
    );
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, 'string');
    return 'symbol' == typeof i ? i : i + '';
  }
  function _toPrimitive(t, r) {
    if ('object' != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || 'default');
      if ('object' != typeof i) return i;
      throw new TypeError('@@toPrimitive must return a primitive value.');
    }
    return ('string' === r ? String : Number)(t);
  }
  var f = moduleArg;
  if ('undefined' === typeof globalThis.BigInt64Array) {
    function b(c) {
      return [Number(BigInt(c) & BigInt(4294967295)) | 0, Number(BigInt(c) >> 32n) | 0];
    }
    function a(c) {
      function d(e) {
        var _e$constructor;
        'number' === typeof e && (e = new Uint32Array(2 * e));
        if (!ArrayBuffer.isView(e))
          if (
            'ArrayBuffer' ===
            ((_e$constructor = e.constructor) === null || _e$constructor === void 0 ? void 0 : _e$constructor.name)
          )
            e = new Uint32Array(e);
          else {
            var g = e;
            e = new Uint32Array(2 * e.length);
          }
        var k = new Proxy(
          {
            slice(h, l) {
              l !== null && l !== void 0 ? l : (l = e.length);
              h = e.slice(2 * h, 2 * l);
              return d(h);
            },
            subarray(h, l) {
              h = e.subarray(2 * h, 2 * l);
              return d(h);
            },
            [Symbol.iterator]: function* () {
              for (var h = 0; h < e.length / 2; h++) yield c(e[2 * h], e[2 * h + 1]);
            },
            BYTES_PER_ELEMENT: 2 * e.BYTES_PER_ELEMENT,
            buffer: e.buffer,
            byteLength: e.byteLength,
            byteOffset: e.byteOffset,
            length: e.length / 2,
            copyWithin: function (h, l, n) {
              e.copyWithin(2 * h, 2 * l, 2 * n);
              return k;
            },
            set(h, l) {
              l !== null && l !== void 0 ? l : (l = 0);
              if (2 * (h.length + l) > e.length) throw new RangeError('offset is out of bounds');
              for (var n = 0; n < h.length; n++) {
                var p = b(h[n]);
                e.set(p, 2 * (l + n));
              }
            },
          },
          {
            get(h, l, n) {
              return 'string' === typeof l && /^\d+$/.test(l) ? c(e[2 * l], e[2 * l + 1]) : Reflect.get(h, l, n);
            },
            set(h, l, n, p) {
              if ('string' !== typeof l || !/^\d+$/.test(l)) return Reflect.set(h, l, n, p);
              if ('bigint' !== typeof n) throw new TypeError(`Cannot convert ${n} to a BigInt`);
              h = b(n);
              e.set(h, 2 * l);
              return !0;
            },
          },
        );
        g && k.set(g);
        return k;
      }
      return d;
    }
    globalThis.BigUint64Array = a(function (c, d) {
      return BigInt(c) | (BigInt(d) << 32n);
    });
    globalThis.BigInt64Array = a(function (c, d) {
      return BigInt(c) | (BigInt(d + 2 * (d & 2147483648)) << 32n);
    });
  }
  var aa = 'undefined' != typeof WorkerGlobalScope,
    ba = './this.program',
    ca = import.meta.url,
    da = '',
    ea,
    fa;
  if ('object' == typeof window || aa) {
    try {
      da = new URL('.', ca).href;
    } catch {}
    aa &&
      (fa = (b) => {
        var a = new XMLHttpRequest();
        a.open('GET', b, !1);
        a.responseType = 'arraybuffer';
        a.send(null);
        return new Uint8Array(a.response);
      });
    ea = async (b) => {
      b = await fetch(b, { credentials: 'same-origin' });
      if (b.ok) return b.arrayBuffer();
      throw Error(b.status + ' : ' + b.url);
    };
  }
  var ha = console.log.bind(console),
    r = console.error.bind(console),
    ia,
    ja = !1,
    ka,
    la,
    ma,
    na,
    oa,
    u,
    pa,
    w,
    y,
    z,
    A,
    C,
    qa,
    ra,
    sa = !1;
  function ta() {
    var b = na.buffer;
    f.HEAP8 = oa = new Int8Array(b);
    f.HEAP16 = pa = new Int16Array(b);
    f.HEAPU8 = u = new Uint8Array(b);
    f.HEAPU16 = w = new Uint16Array(b);
    f.HEAP32 = y = new Int32Array(b);
    f.HEAPU32 = z = new Uint32Array(b);
    f.HEAPF32 = A = new Float32Array(b);
    f.HEAPF64 = C = new Float64Array(b);
    f.HEAP64 = qa = new BigInt64Array(b);
    f.HEAPU64 = ra = new BigUint64Array(b);
  }
  function ua(b) {
    var _f$onAbort, _ma;
    (_f$onAbort = f.onAbort) === null || _f$onAbort === void 0 || _f$onAbort.call(f, b);
    b = 'Aborted(' + b + ')';
    r(b);
    ja = !0;
    b = new WebAssembly.RuntimeError(b + '. Build with -sASSERTIONS for more info.');
    (_ma = ma) === null || _ma === void 0 || _ma(b);
    throw b;
  }
  var va;
  async function wa(b) {
    if (!ia)
      try {
        var a = await ea(b);
        return new Uint8Array(a);
      } catch {}
    if (b == va && ia) b = new Uint8Array(ia);
    else if (fa) b = fa(b);
    else throw 'both async and sync fetching of the wasm failed';
    return b;
  }
  async function xa(b, a) {
    try {
      var c = await wa(b);
      return await WebAssembly.instantiate(c, a);
    } catch (d) {
      r(`failed to asynchronously prepare wasm: ${d}`), ua(d);
    }
  }
  async function ya(b) {
    var a = va;
    if (!ia && WebAssembly.instantiateStreaming)
      try {
        var c = fetch(a, { credentials: 'same-origin' });
        return await WebAssembly.instantiateStreaming(c, b);
      } catch (d) {
        r(`wasm streaming compile failed: ${d}`), r('falling back to ArrayBuffer instantiation');
      }
    return xa(a, b);
  }
  class za {
    constructor(b) {
      _defineProperty(this, 'name', 'ExitStatus');
      this.message = `Program terminated with exit(${b})`;
      this.status = b;
    }
  }
  var Aa = (b) => {
      for (; 0 < b.length; ) b.shift()(f);
    },
    Ba = [],
    Ca = [],
    Da = () => {
      var b = f.preRun.shift();
      Ca.push(b);
    },
    Ea = !0,
    Fa = new TextDecoder(),
    Ga = (b, a, c, d) => {
      c = a + c;
      if (d) return c;
      for (; b[a] && !(a >= c); ) ++a;
      return a;
    },
    D = (b, a, c) => (b ? Fa.decode(u.subarray(b, Ga(u, b, a, c))) : '');
  class Ha {
    constructor(b) {
      this.bb = b - 24;
    }
  }
  var Ia = 0,
    Ja = 0,
    Ka = {},
    La = (b) => {
      for (; b.length; ) {
        var a = b.pop();
        b.pop()(a);
      }
    };
  function Ma(b) {
    return this.cb(z[b >> 2]);
  }
  var Na = {},
    E = {},
    Oa = {},
    Pa = class extends Error {
      constructor(b) {
        super(b);
        this.name = 'InternalError';
      }
    },
    G = (b, a, c) => {
      function d(h) {
        h = c(h);
        if (h.length !== b.length) throw new Pa('Mismatched type converter count');
        for (var l = 0; l < b.length; ++l) F(b[l], h[l]);
      }
      b.forEach((h) => (Oa[h] = a));
      var e = Array(a.length),
        g = [],
        k = 0;
      a.forEach((h, l) => {
        E.hasOwnProperty(h)
          ? (e[l] = E[h])
          : (g.push(h),
            Na.hasOwnProperty(h) || (Na[h] = []),
            Na[h].push(() => {
              e[l] = E[h];
              ++k;
              k === g.length && d(e);
            }));
      });
      0 === g.length && d(e);
    },
    I = (b) => {
      for (var a = ''; ; ) {
        var c = u[b++];
        if (!c) return a;
        a += String.fromCharCode(c);
      }
    },
    J = class extends Error {
      constructor(b) {
        super(b);
        this.name = 'BindingError';
      }
    };
  function Qa(b, a) {
    let c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var d = a.name;
    if (!b) throw new J(`type "${d}" must have a positive integer typeid pointer`);
    if (E.hasOwnProperty(b)) {
      if (c.$b) return;
      throw new J(`Cannot register type '${d}' twice`);
    }
    E[b] = a;
    delete Oa[b];
    Na.hasOwnProperty(b) && ((a = Na[b]), delete Na[b], a.forEach((e) => e()));
  }
  function F(b, a) {
    let c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return Qa(b, a, c);
  }
  var Ra = (b, a, c) => {
      switch (a) {
        case 1:
          return c ? (d) => oa[d] : (d) => u[d];
        case 2:
          return c ? (d) => pa[d >> 1] : (d) => w[d >> 1];
        case 4:
          return c ? (d) => y[d >> 2] : (d) => z[d >> 2];
        case 8:
          return c ? (d) => qa[d >> 3] : (d) => ra[d >> 3];
        default:
          throw new TypeError(`invalid integer width (${a}): ${b}`);
      }
    },
    Sa = (b) => {
      throw new J(b.Za.jb.ab.name + ' instance already deleted');
    },
    Ta = !1,
    Ua = () => {},
    Va = (b) => {
      if ('undefined' === typeof FinalizationRegistry) return (Va = (a) => a), b;
      Ta = new FinalizationRegistry((a) => {
        a = a.Za;
        --a.count.value;
        0 === a.count.value && (a.nb ? a.Bb.Db(a.nb) : a.jb.ab.Db(a.bb));
      });
      Va = (a) => {
        var c = a.Za;
        c.nb && Ta.register(a, { Za: c }, a);
        return a;
      };
      Ua = (a) => {
        Ta.unregister(a);
      };
      return Va(b);
    },
    Wa = [];
  function Xa() {}
  var Ya = (b, a) => Object.defineProperty(a, 'name', { value: b }),
    Za = {},
    $a = (b, a, c) => {
      if (void 0 === b[a].kb) {
        var d = b[a];
        b[a] = function () {
          for (var _len = arguments.length, e = new Array(_len), _key = 0; _key < _len; _key++) {
            e[_key] = arguments[_key];
          }
          if (!b[a].kb.hasOwnProperty(e.length))
            throw new J(
              `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${b[a].kb})!`,
            );
          return b[a].kb[e.length].apply(this, e);
        };
        b[a].kb = [];
        b[a].kb[d.Gb] = d;
      }
    },
    ab = (b, a, c) => {
      if (f.hasOwnProperty(b)) {
        if (void 0 === c || (void 0 !== f[b].kb && void 0 !== f[b].kb[c]))
          throw new J(`Cannot register public name '${b}' twice`);
        $a(f, b, b);
        if (f[b].kb.hasOwnProperty(c))
          throw new J(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
        f[b].kb[c] = a;
      } else (f[b] = a), (f[b].Gb = c);
    },
    bb = (b) => {
      b = b.replace(/[^a-zA-Z0-9_]/g, '$');
      var a = b.charCodeAt(0);
      return 48 <= a && 57 >= a ? `_${b}` : b;
    };
  function cb(b, a, c, d, e, g, k, h) {
    this.name = b;
    this.constructor = a;
    this.Fb = c;
    this.Db = d;
    this.zb = e;
    this.Vb = g;
    this.Jb = k;
    this.Tb = h;
    this.cc = [];
  }
  var db = (b, a, c) => {
      for (; a !== c; ) {
        if (!a.Jb) throw new J(`Expected null or instance of ${c.name}, got an instance of ${a.name}`);
        b = a.Jb(b);
        a = a.zb;
      }
      return b;
    },
    eb = (b) => {
      if (null === b) return 'null';
      var a = typeof b;
      return 'object' === a || 'array' === a || 'function' === a ? b.toString() : '' + b;
    };
  function gb(b, a) {
    if (null === a) {
      if (this.Mb) throw new J(`null is not a valid ${this.name}`);
      return 0;
    }
    if (!a.Za) throw new J(`Cannot pass "${eb(a)}" as a ${this.name}`);
    if (!a.Za.bb) throw new J(`Cannot pass deleted object as a pointer of type ${this.name}`);
    return db(a.Za.bb, a.Za.jb.ab, this.ab);
  }
  function hb(b, a) {
    if (null === a) {
      if (this.Mb) throw new J(`null is not a valid ${this.name}`);
      if (this.Lb) {
        var c = this.Nb();
        null !== b && b.push(this.Db, c);
        return c;
      }
      return 0;
    }
    if (!a || !a.Za) throw new J(`Cannot pass "${eb(a)}" as a ${this.name}`);
    if (!a.Za.bb) throw new J(`Cannot pass deleted object as a pointer of type ${this.name}`);
    if (!this.Kb && a.Za.jb.Kb)
      throw new J(
        `Cannot convert argument of type ${a.Za.Bb ? a.Za.Bb.name : a.Za.jb.name} to parameter type ${this.name}`,
      );
    c = db(a.Za.bb, a.Za.jb.ab, this.ab);
    if (this.Lb) {
      if (void 0 === a.Za.nb) throw new J('Passing raw pointer to smart pointer is illegal');
      switch (this.ic) {
        case 0:
          if (a.Za.Bb === this) c = a.Za.nb;
          else
            throw new J(
              `Cannot convert argument of type ${a.Za.Bb ? a.Za.Bb.name : a.Za.jb.name} to parameter type ${this.name}`,
            );
          break;
        case 1:
          c = a.Za.nb;
          break;
        case 2:
          if (a.Za.Bb === this) c = a.Za.nb;
          else {
            var d = a.clone();
            c = this.dc(
              c,
              ib(() => d['delete']()),
            );
            null !== b && b.push(this.Db, c);
          }
          break;
        default:
          throw new J('Unsupporting sharing policy');
      }
    }
    return c;
  }
  function jb(b, a) {
    if (null === a) {
      if (this.Mb) throw new J(`null is not a valid ${this.name}`);
      return 0;
    }
    if (!a.Za) throw new J(`Cannot pass "${eb(a)}" as a ${this.name}`);
    if (!a.Za.bb) throw new J(`Cannot pass deleted object as a pointer of type ${this.name}`);
    if (a.Za.jb.Kb) throw new J(`Cannot convert argument of type ${a.Za.jb.name} to parameter type ${this.name}`);
    return db(a.Za.bb, a.Za.jb.ab, this.ab);
  }
  var kb = (b, a, c) => {
      if (a === c) return b;
      if (void 0 === c.zb) return null;
      b = kb(b, a, c.zb);
      return null === b ? null : c.Tb(b);
    },
    lb = {},
    mb = (b, a) => {
      if (void 0 === a) throw new J('ptr should not be undefined');
      for (; b.zb; ) (a = b.Jb(a)), (b = b.zb);
      return lb[a];
    },
    nb = (b, a) => {
      if (!a.jb || !a.bb) throw new Pa('makeClassHandle requires ptr and ptrType');
      if (!!a.Bb !== !!a.nb) throw new Pa('Both smartPtrType and smartPtr must be specified');
      a.count = { value: 1 };
      return Va(Object.create(b, { Za: { value: a, writable: !0 } }));
    };
  function ob(b, a, c, d, e, g, k, h, l, n, p) {
    this.name = b;
    this.ab = a;
    this.Mb = c;
    this.Kb = d;
    this.Lb = e;
    this.bc = g;
    this.ic = k;
    this.Rb = h;
    this.Nb = l;
    this.dc = n;
    this.Db = p;
    e || void 0 !== a.zb ? (this.yb = hb) : ((this.yb = d ? gb : jb), (this.Ab = null));
  }
  var pb = (b, a, c) => {
      if (!f.hasOwnProperty(b)) throw new Pa('Replacing nonexistent public symbol');
      void 0 !== f[b].kb && void 0 !== c ? (f[b].kb[c] = a) : ((f[b] = a), (f[b].Gb = c));
    },
    L,
    N = (b, a) => {
      b = I(b);
      var c = L.get(a);
      if ('function' != typeof c) throw new J(`unknown function pointer with signature ${b}: ${a}`);
      return c;
    };
  class qb extends Error {}
  var sb = (b) => {
      b = rb(b);
      var a = I(b);
      O(b);
      return a;
    },
    tb = (b, a) => {
      function c(g) {
        e[g] || E[g] || (Oa[g] ? Oa[g].forEach(c) : (d.push(g), (e[g] = !0)));
      }
      var d = [],
        e = {};
      a.forEach(c);
      throw new qb(`${b}: ` + d.map(sb).join([', ']));
    },
    ub = (b, a) => {
      for (var c = [], d = 0; d < b; d++) c.push(z[(a + 4 * d) >> 2]);
      return c;
    };
  function vb(b) {
    for (var a = 1; a < b.length; ++a) if (null !== b[a] && void 0 === b[a].Ab) return !0;
    return !1;
  }
  function wb(b, a, c, d, e) {
    var g = a.length;
    if (2 > g) throw new J("argTypes array size mismatch! Must at least get return value and 'this' types!");
    var k = null !== a[1] && null !== c,
      h = vb(a),
      l = !a[0].ac,
      n = g - 2,
      p = Array(n),
      m = [],
      q = [];
    return Ya(b, function () {
      for (var _len2 = arguments.length, v = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        v[_key2] = arguments[_key2];
      }
      q.length = 0;
      m.length = k ? 2 : 1;
      m[0] = e;
      if (k) {
        var t = a[1].yb(q, this);
        m[1] = t;
      }
      for (var x = 0; x < n; ++x) (p[x] = a[x + 2].yb(q, v[x])), m.push(p[x]);
      v = d(...m);
      if (h) La(q);
      else
        for (x = k ? 1 : 2; x < a.length; x++) {
          var H = 1 === x ? t : p[x - 2];
          null !== a[x].Ab && a[x].Ab(H);
        }
      t = l ? a[0].cb(v) : void 0;
      return t;
    });
  }
  var xb = (b) => {
      b = b.trim();
      const a = b.indexOf('(');
      return -1 === a ? b : b.slice(0, a);
    },
    yb = [],
    P = [0, 1, , 1, null, 1, !0, 1, !1, 1],
    zb = (b) => {
      9 < b && 0 === --P[b + 1] && ((P[b] = void 0), yb.push(b));
    },
    Q = (b) => {
      if (!b) throw new J(`Cannot use deleted val. handle = ${b}`);
      return P[b];
    },
    ib = (b) => {
      switch (b) {
        case void 0:
          return 2;
        case null:
          return 4;
        case !0:
          return 6;
        case !1:
          return 8;
        default:
          const a = yb.pop() || P.length;
          P[a] = b;
          P[a + 1] = 1;
          return a;
      }
    },
    Ab = {
      name: 'emscripten::val',
      cb: (b) => {
        var a = Q(b);
        zb(b);
        return a;
      },
      yb: (b, a) => ib(a),
      Cb: Ma,
      Ab: null,
    },
    Bb = (b, a, c) => {
      switch (a) {
        case 1:
          return c
            ? function (d) {
                return this.cb(oa[d]);
              }
            : function (d) {
                return this.cb(u[d]);
              };
        case 2:
          return c
            ? function (d) {
                return this.cb(pa[d >> 1]);
              }
            : function (d) {
                return this.cb(w[d >> 1]);
              };
        case 4:
          return c
            ? function (d) {
                return this.cb(y[d >> 2]);
              }
            : function (d) {
                return this.cb(z[d >> 2]);
              };
        default:
          throw new TypeError(`invalid integer width (${a}): ${b}`);
      }
    },
    Cb = (b, a) => {
      var c = E[b];
      if (void 0 === c) throw ((b = `${a} has unknown type ${sb(b)}`), new J(b));
      return c;
    },
    Db = (b, a) => {
      switch (a) {
        case 4:
          return function (c) {
            return this.cb(A[c >> 2]);
          };
        case 8:
          return function (c) {
            return this.cb(C[c >> 3]);
          };
        default:
          throw new TypeError(`invalid float width (${a}): ${b}`);
      }
    },
    Eb = Object.assign({ optional: !0 }, Ab),
    R = (b, a, c) => {
      var d = u;
      if (!(0 < c)) return 0;
      var e = a;
      c = a + c - 1;
      for (var g = 0; g < b.length; ++g) {
        var k = b.codePointAt(g);
        if (127 >= k) {
          if (a >= c) break;
          d[a++] = k;
        } else if (2047 >= k) {
          if (a + 1 >= c) break;
          d[a++] = 192 | (k >> 6);
          d[a++] = 128 | (k & 63);
        } else if (65535 >= k) {
          if (a + 2 >= c) break;
          d[a++] = 224 | (k >> 12);
          d[a++] = 128 | ((k >> 6) & 63);
          d[a++] = 128 | (k & 63);
        } else {
          if (a + 3 >= c) break;
          d[a++] = 240 | (k >> 18);
          d[a++] = 128 | ((k >> 12) & 63);
          d[a++] = 128 | ((k >> 6) & 63);
          d[a++] = 128 | (k & 63);
          g++;
        }
      }
      d[a] = 0;
      return a - e;
    },
    Fb = (b) => {
      for (var a = 0, c = 0; c < b.length; ++c) {
        var d = b.charCodeAt(c);
        127 >= d ? a++ : 2047 >= d ? (a += 2) : 55296 <= d && 57343 >= d ? ((a += 4), ++c) : (a += 3);
      }
      return a;
    },
    Gb = new TextDecoder('utf-16le'),
    Hb = (b, a, c) => {
      b >>= 1;
      return Gb.decode(w.subarray(b, Ga(w, b, a / 2, c)));
    },
    Ib = (b, a, c) => {
      c !== null && c !== void 0 ? c : (c = 2147483647);
      if (2 > c) return 0;
      c -= 2;
      var d = a;
      c = c < 2 * b.length ? c / 2 : b.length;
      for (var e = 0; e < c; ++e) (pa[a >> 1] = b.charCodeAt(e)), (a += 2);
      pa[a >> 1] = 0;
      return a - d;
    },
    Jb = (b) => 2 * b.length,
    Kb = (b, a, c) => {
      var d = '';
      b >>= 2;
      for (var e = 0; !(e >= a / 4); e++) {
        var g = z[b + e];
        if (!g && !c) break;
        d += String.fromCodePoint(g);
      }
      return d;
    },
    Lb = (b, a, c) => {
      c !== null && c !== void 0 ? c : (c = 2147483647);
      if (4 > c) return 0;
      var d = a;
      c = d + c - 4;
      for (var e = 0; e < b.length; ++e) {
        var g = b.codePointAt(e);
        65535 < g && e++;
        y[a >> 2] = g;
        a += 4;
        if (a + 4 > c) break;
      }
      y[a >> 2] = 0;
      return a - d;
    },
    Mb = (b) => {
      for (var a = 0, c = 0; c < b.length; ++c) 65535 < b.codePointAt(c) && c++, (a += 4);
      return a;
    },
    Nb = 0,
    Ob = [],
    Pb = (b) => {
      var a = Ob.length;
      Ob.push(b);
      return a;
    },
    Qb = (b, a) => {
      for (var c = Array(b), d = 0; d < b; ++d) c[d] = Cb(z[(a + 4 * d) >> 2], `parameter ${d}`);
      return c;
    },
    Rb = {},
    Sb = {},
    Tb = (b) => {
      if (!(b instanceof za || 'unwind' == b)) throw b;
    },
    Ub = (b) => {
      var _f$onExit;
      ka = b;
      Ea || 0 < Nb || ((_f$onExit = f.onExit) !== null && _f$onExit !== void 0 && _f$onExit.call(f, b), (ja = !0));
      throw new za(b);
    },
    Vb = (b) => {
      if (!ja)
        try {
          if ((b(), !(Ea || 0 < Nb)))
            try {
              (ka = b = ka), Ub(b);
            } catch (a) {
              Tb(a);
            }
        } catch (a) {
          Tb(a);
        }
    },
    Xb = (b) => {
      var a = Fb(b) + 1,
        c = Wb(a);
      R(b, c, a);
      return c;
    },
    Yb = [],
    S = (b, a) => {
      Yb[(b >>>= 0)] = a;
    },
    Zb = [],
    T = (b) => {
      if (b) return Yb[b >>> 0];
    },
    $b = (b) => D(z[b >> 2], z[(b + 4) >> 2]),
    U = (b) => {
      var a = z[b >> 2];
      b = z[(b + 4) >> 2];
      if (a) return D(a, b);
      if (0 === b) return '';
    },
    ac = (b) => ({ width: z[b >> 2], height: z[(b + 4) >> 2], depthOrArrayLayers: z[(b + 8) >> 2] }),
    cc = (b) => {
      var a = b + 8;
      return {
        texture: T(z[b >> 2]),
        mipLevel: z[(b + 4) >> 2],
        origin: { x: z[a >> 2], y: z[(a + 4) >> 2], z: z[(a + 8) >> 2] },
        aspect: bc[z[(b + 20) >> 2]],
      };
    },
    dc = (b, a) => {
      if (b) {
        for (var c = {}, d = 0; d < b; ++d) {
          var e = a + 24 * d,
            g = $b(e + 4);
          c[g] = C[(e + 16) >> 3];
        }
        return c;
      }
    },
    ec = (b) => (b ? T(b) : 'auto'),
    qc = (b) => {
      function a(d) {
        if (d) return { operation: fc[z[d >> 2]], srcFactor: hc[z[(d + 4) >> 2]], dstFactor: hc[z[(d + 8) >> 2]] };
      }
      function c(d) {
        return {
          compare: ic[z[d >> 2]],
          failOp: jc[z[(d + 4) >> 2]],
          depthFailOp: jc[z[(d + 8) >> 2]],
          passOp: jc[z[(d + 12) >> 2]],
        };
      }
      return {
        label: U(b + 4),
        layout: ec(z[(b + 12) >> 2]),
        vertex: (function (d) {
          if (d) {
            var e = T(z[(d + 4) >> 2]),
              g = dc(z[(d + 16) >> 2], z[(d + 20) >> 2]);
            var k = z[(d + 24) >> 2];
            var h = z[(d + 28) >> 2];
            if (k) {
              for (var l = [], n = 0; n < k; ++n) {
                var p = l,
                  m = p.push;
                var q = h + 24 * n;
                if (q) {
                  var v = z[(q + 4) >> 2],
                    t = z[(q + 16) >> 2];
                  if (0 === v && 0 === t) var x = null;
                  else {
                    x = 4294967296 * z[(q + 4 + 8) >> 2] + z[(q + 8) >> 2];
                    v = kc[v];
                    q = z[(q + 20) >> 2];
                    for (var H = [], M = 0; M < t; ++M) {
                      var B = H,
                        K = q + 24 * M;
                      B.push.call(B, {
                        format: lc[z[(K + 4) >> 2]],
                        offset: 4294967296 * z[(K + 4 + 8) >> 2] + z[(K + 8) >> 2],
                        shaderLocation: z[(K + 16) >> 2],
                      });
                    }
                    x = { arrayStride: x, stepMode: v, attributes: H };
                  }
                } else x = void 0;
                m.call(p, x);
              }
              k = l;
            } else k = void 0;
            return { module: e, constants: g, buffers: k, entryPoint: U(d + 8) };
          }
        })(b + 16),
        primitive: (function (d) {
          if (d)
            return {
              topology: mc[z[(d + 4) >> 2]],
              stripIndexFormat: nc[z[(d + 8) >> 2]],
              frontFace: oc[z[(d + 12) >> 2]],
              cullMode: pc[z[(d + 16) >> 2]],
              unclippedDepth: !!z[(d + 20) >> 2],
            };
        })(b + 48),
        depthStencil: (function (d) {
          if (d)
            return {
              format: V[z[(d + 4) >> 2]],
              depthWriteEnabled: !!z[(d + 8) >> 2],
              depthCompare: ic[z[(d + 12) >> 2]],
              stencilFront: c(d + 16),
              stencilBack: c(d + 32),
              stencilReadMask: z[(d + 48) >> 2],
              stencilWriteMask: z[(d + 52) >> 2],
              depthBias: y[(d + 56) >> 2],
              depthBiasSlopeScale: A[(d + 60) >> 2],
              depthBiasClamp: A[(d + 64) >> 2],
            };
        })(z[(b + 72) >> 2]),
        multisample: (function (d) {
          if (d) return { count: z[(d + 4) >> 2], mask: z[(d + 8) >> 2], alphaToCoverageEnabled: !!z[(d + 12) >> 2] };
        })(b + 76),
        fragment: (function (d) {
          if (d) {
            for (
              var e = T(z[(d + 4) >> 2]),
                g = dc(z[(d + 16) >> 2], z[(d + 20) >> 2]),
                k = z[(d + 24) >> 2],
                h = z[(d + 28) >> 2],
                l = [],
                n = 0;
              n < k;
              ++n
            ) {
              var p = l,
                m = p.push,
                q = h + 24 * n,
                v = z[(q + 4) >> 2];
              if (0 === v) q = void 0;
              else {
                v = V[v];
                var t = (t = z[(q + 8) >> 2]) ? { alpha: a(t + 12), color: a(t + 0) } : void 0;
                q = { format: v, blend: t, writeMask: z[(q + 16) >> 2] };
              }
              m.call(p, q);
            }
            return { module: e, constants: g, targets: l, entryPoint: U(d + 8) };
          }
        })(z[(b + 92) >> 2]),
      };
    },
    rc = [, 'clamp-to-edge', 'repeat', 'mirror-repeat'],
    hc = [
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
      'src1',
      'one-minus-src1',
      'src1alpha',
      'one-minus-src1alpha',
    ],
    fc = [, 'add', 'subtract', 'reverse-subtract', 'min', 'max'],
    sc = ['binding-not-used', , 'uniform', 'storage', 'read-only-storage'],
    ic = [, 'never', 'less', 'equal', 'less-equal', 'greater', 'not-equal', 'greater-equal', 'always'],
    tc = [, 'opaque', 'premultiplied', 'unpremultiplied', 'inherit'],
    pc = [, 'none', 'front', 'back'],
    uc = [, 'compatibility', 'core'],
    vc = {
      1: 'core-features-and-limits',
      2: 'depth-clip-control',
      3: 'depth32float-stencil8',
      4: 'texture-compression-bc',
      5: 'texture-compression-bc-sliced-3d',
      6: 'texture-compression-etc2',
      7: 'texture-compression-astc',
      8: 'texture-compression-astc-sliced-3d',
      9: 'timestamp-query',
      10: 'indirect-first-instance',
      11: 'shader-f16',
      12: 'rg11b10ufloat-renderable',
      13: 'bgra8unorm-storage',
      14: 'float32-filterable',
      15: 'float32-blendable',
      16: 'clip-distances',
      17: 'dual-source-blending',
      18: 'subgroups',
      19: 'texture-formats-tier1',
      20: 'texture-formats-tier2',
      327692: 'chromium-experimental-unorm16-texture-formats',
      327693: 'chromium-experimental-snorm16-texture-formats',
      327732: 'chromium-experimental-multi-draw-indirect',
    },
    wc = [, 'nearest', 'linear'],
    oc = [, 'ccw', 'cw'],
    nc = [, 'uint16', 'uint32'],
    xc = [, 'load', 'clear'],
    yc = [, 'nearest', 'linear'],
    zc = [, 'low-power', 'high-performance'],
    Ac = [, 'srgb', 'display-p3'],
    mc = [, 'point-list', 'line-list', 'line-strip', 'triangle-list', 'triangle-strip'],
    Bc = ['binding-not-used', , 'filtering', 'non-filtering', 'comparison'],
    jc = [
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
    Cc = ['binding-not-used', , 'write-only', 'read-only', 'read-write'],
    Dc = [, 'store', 'discard'],
    bc = [, 'all', 'stencil-only', 'depth-only'],
    Ec = [, '1d', '2d', '3d'],
    V = [
      ,
      'r8unorm',
      'r8snorm',
      'r8uint',
      'r8sint',
      'r16unorm',
      'r16snorm',
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
      'rg16unorm',
      'rg16snorm',
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
      'rgba16unorm',
      'rgba16snorm',
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
    Fc = ['binding-not-used', , 'float', 'unfilterable-float', 'depth', 'sint', 'uint'],
    Gc = [, '1d', '2d', '2d-array', 'cube', 'cube-array', '3d'],
    Hc = [, 'standard', 'extended'],
    lc = [
      ,
      'uint8',
      'uint8x2',
      'uint8x4',
      'sint8',
      'sint8x2',
      'sint8x4',
      'unorm8',
      'unorm8x2',
      'unorm8x4',
      'snorm8',
      'snorm8x2',
      'snorm8x4',
      'uint16',
      'uint16x2',
      'uint16x4',
      'sint16',
      'sint16x2',
      'sint16x4',
      'unorm16',
      'unorm16x2',
      'unorm16x4',
      'snorm16',
      'snorm16x2',
      'snorm16x4',
      'float16',
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
      'unorm8x4-bgra',
    ],
    kc = [, 'vertex', 'instance'],
    Ic,
    Jc = { undefined: 1, unknown: 1, destroyed: 2 },
    Kc = {},
    Mc = () => {
      if (!Lc) {
        var b = {
            USER: 'web_user',
            LOGNAME: 'web_user',
            PATH: '/',
            PWD: '/',
            HOME: '/home/web_user',
            LANG: (('object' == typeof navigator && navigator.language) || 'C').replace('-', '_') + '.UTF-8',
            _: ba || './this.program',
          },
          a;
        for (a in Kc) void 0 === Kc[a] ? delete b[a] : (b[a] = Kc[a]);
        var c = [];
        for (a in b) c.push(`${a}=${b[a]}`);
        Lc = c;
      }
      return Lc;
    },
    Lc,
    Nc = [null, [], []],
    Oc = () => (b) => crypto.getRandomValues(b),
    Pc = (b) => {
      (Pc = Oc())(b);
    },
    Qc = [0, 'undefined' != typeof document ? document : 0, 'undefined' != typeof window ? window : 0];
  (() => {
    let b = Xa.prototype;
    Object.assign(b, {
      isAliasOf: function (c) {
        if (!(this instanceof Xa && c instanceof Xa)) return !1;
        var d = this.Za.jb.ab,
          e = this.Za.bb;
        c.Za = c.Za;
        var g = c.Za.jb.ab;
        for (c = c.Za.bb; d.zb; ) (e = d.Jb(e)), (d = d.zb);
        for (; g.zb; ) (c = g.Jb(c)), (g = g.zb);
        return d === g && e === c;
      },
      clone: function () {
        this.Za.bb || Sa(this);
        if (this.Za.Ib) return (this.Za.count.value += 1), this;
        var c = Va,
          d = Object,
          e = d.create,
          g = Object.getPrototypeOf(this),
          k = this.Za;
        c = c(
          e.call(d, g, {
            Za: { value: { count: k.count, Hb: k.Hb, Ib: k.Ib, bb: k.bb, jb: k.jb, nb: k.nb, Bb: k.Bb } },
          }),
        );
        c.Za.count.value += 1;
        c.Za.Hb = !1;
        return c;
      },
      ['delete']() {
        this.Za.bb || Sa(this);
        if (this.Za.Hb && !this.Za.Ib) throw new J('Object already scheduled for deletion');
        Ua(this);
        var c = this.Za;
        --c.count.value;
        0 === c.count.value && (c.nb ? c.Bb.Db(c.nb) : c.jb.ab.Db(c.bb));
        this.Za.Ib || ((this.Za.nb = void 0), (this.Za.bb = void 0));
      },
      isDeleted: function () {
        return !this.Za.bb;
      },
      deleteLater: function () {
        this.Za.bb || Sa(this);
        if (this.Za.Hb && !this.Za.Ib) throw new J('Object already scheduled for deletion');
        Wa.push(this);
        this.Za.Hb = !0;
        return this;
      },
    });
    const a = Symbol.dispose;
    a && (b[a] = b['delete']);
  })();
  Object.assign(ob.prototype, {
    Wb(b) {
      this.Rb && (b = this.Rb(b));
      return b;
    },
    Pb(b) {
      var _this$Db;
      (_this$Db = this.Db) === null || _this$Db === void 0 || _this$Db.call(this, b);
    },
    Cb: Ma,
    cb: function (b) {
      function a() {
        return this.Lb ? nb(this.ab.Fb, { jb: this.bc, bb: c, Bb: this, nb: b }) : nb(this.ab.Fb, { jb: this, bb: b });
      }
      var c = this.Wb(b);
      if (!c) return this.Pb(b), null;
      var d = mb(this.ab, c);
      if (void 0 !== d) {
        if (0 === d.Za.count.value) return (d.Za.bb = c), (d.Za.nb = b), d.clone();
        d = d.clone();
        this.Pb(b);
        return d;
      }
      d = this.ab.Vb(c);
      d = Za[d];
      if (!d) return a.call(this);
      d = this.Kb ? d.Sb : d.pointerType;
      var e = kb(c, this.ab, d.ab);
      return null === e
        ? a.call(this)
        : this.Lb
        ? nb(d.ab.Fb, { jb: d, bb: e, Bb: this, nb: b })
        : nb(d.ab.Fb, { jb: d, bb: e });
    },
  });
  f.noExitRuntime && (Ea = f.noExitRuntime);
  f.print && (ha = f.print);
  f.printErr && (r = f.printErr);
  f.wasmBinary && (ia = f.wasmBinary);
  f.thisProgram && (ba = f.thisProgram);
  if (f.preInit)
    for ('function' == typeof f.preInit && (f.preInit = [f.preInit]); 0 < f.preInit.length; ) f.preInit.shift()();
  var Rc,
    O,
    rb,
    Sc,
    Tc,
    Uc,
    Vc,
    Wc,
    Xc,
    Yc,
    Zc,
    $c,
    ad,
    bd,
    cd,
    dd,
    ed,
    fd,
    gd,
    hd,
    jd,
    kd,
    W,
    X,
    Wb,
    Y,
    ud = {
      a: (b, a, c, d) =>
        ua(`Assertion failed: ${D(b)}, at: ` + [a ? D(a) : 'unknown filename', c, d ? D(d) : 'unknown function']),
      r: (b, a, c) => {
        var d = new Ha(b);
        z[(d.bb + 16) >> 2] = 0;
        z[(d.bb + 4) >> 2] = a;
        z[(d.bb + 8) >> 2] = c;
        Ia = b;
        Ja++;
        throw Ia;
      },
      ga: () => {},
      ea: () => {},
      fa: () => {},
      ia: function () {},
      ja: () => ua(''),
      F: (b) => {
        var a = Ka[b];
        delete Ka[b];
        var c = a.Nb,
          d = a.Db,
          e = a.Qb,
          g = e.map((k) => k.Zb).concat(e.map((k) => k.fc));
        G([b], g, (k) => {
          var h = {};
          e.forEach((l, n) => {
            var p = k[n],
              m = l.Xb,
              q = l.Yb,
              v = k[n + e.length],
              t = l.ec,
              x = l.hc;
            h[l.Ub] = {
              read: (H) => p.cb(m(q, H)),
              write: (H, M) => {
                var B = [];
                t(x, H, v.yb(B, M));
                La(B);
              },
              optional: k[n].optional,
            };
          });
          return [
            {
              name: a.name,
              cb: (l) => {
                var n = {},
                  p;
                for (p in h) n[p] = h[p].read(l);
                d(l);
                return n;
              },
              yb: (l, n) => {
                for (var p in h) if (!(p in n || h[p].optional)) throw new TypeError(`Missing field: "${p}"`);
                var m = c();
                for (p in h) h[p].write(m, n[p]);
                null !== l && l.push(d, m);
                return m;
              },
              Cb: Ma,
              Ab: d,
            },
          ];
        });
      },
      Q: (b, a, c, d, e) => {
        a = I(a);
        d = 0n === d;
        let g = (k) => k;
        if (d) {
          const k = 8 * c;
          g = (h) => BigInt.asUintN(k, h);
          e = g(e);
        }
        F(b, {
          name: a,
          cb: g,
          yb: (k, h) => {
            'number' == typeof h && (h = BigInt(h));
            return h;
          },
          Cb: Ra(a, c, !d),
          Ab: null,
        });
      },
      wa: (b, a, c, d) => {
        a = I(a);
        F(b, {
          name: a,
          cb: function (e) {
            return !!e;
          },
          yb: function (e, g) {
            return g ? c : d;
          },
          Cb: function (e) {
            return this.cb(u[e]);
          },
          Ab: null,
        });
      },
      t: (b, a, c, d, e, g, k, h, l, n, p, m, q) => {
        p = I(p);
        g = N(e, g);
        h && (h = N(k, h));
        n && (n = N(l, n));
        q = N(m, q);
        var v = bb(p);
        ab(v, function () {
          tb(`Cannot construct ${p} due to unbound types`, [d]);
        });
        G([b, a, c], d ? [d] : [], (t) => {
          t = t[0];
          if (d) {
            var x = t.ab;
            var H = x.Fb;
          } else H = Xa.prototype;
          t = Ya(p, function () {
            if (Object.getPrototypeOf(this) !== M) throw new J(`Use 'new' to construct ${p}`);
            if (void 0 === B.Eb) throw new J(`${p} has no accessible constructor`);
            for (var _len3 = arguments.length, fb = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              fb[_key3] = arguments[_key3];
            }
            var gc = B.Eb[fb.length];
            if (void 0 === gc)
              throw new J(
                `Tried to invoke ctor of ${p} with invalid number of parameters (${
                  fb.length
                }) - expected (${Object.keys(B.Eb).toString()}) parameters instead!`,
              );
            return gc.apply(this, fb);
          });
          var M = Object.create(H, { constructor: { value: t } });
          t.prototype = M;
          var B = new cb(p, t, M, q, x, g, h, n);
          if (B.zb) {
            var _K$Ob;
            var K;
            (_K$Ob = (K = B.zb).Ob) !== null && _K$Ob !== void 0 ? _K$Ob : (K.Ob = []);
            B.zb.Ob.push(B);
          }
          x = new ob(p, B, !0, !1, !1);
          K = new ob(p + '*', B, !1, !1, !1);
          H = new ob(p + ' const*', B, !1, !0, !1);
          Za[b] = { pointerType: K, Sb: H };
          pb(v, t);
          return [x, K, H];
        });
      },
      z: (b, a, c, d, e, g) => {
        var k = ub(a, c);
        e = N(d, e);
        G([], [b], (h) => {
          h = h[0];
          var l = `constructor ${h.name}`;
          void 0 === h.ab.Eb && (h.ab.Eb = []);
          if (void 0 !== h.ab.Eb[a - 1])
            throw new J(
              `Cannot register multiple constructors with identical number of parameters (${a - 1}) for class '${
                h.name
              }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
            );
          h.ab.Eb[a - 1] = () => {
            tb(`Cannot construct ${h.name} due to unbound types`, k);
          };
          G([], k, (n) => {
            n.splice(1, 0, null);
            h.ab.Eb[a - 1] = wb(l, n, null, e, g);
            return [];
          });
          return [];
        });
      },
      e: (b, a, c, d, e, g, k, h) => {
        var l = ub(c, d);
        a = I(a);
        a = xb(a);
        g = N(e, g);
        G([], [b], (n) => {
          function p() {
            tb(`Cannot call ${m} due to unbound types`, l);
          }
          n = n[0];
          var m = `${n.name}.${a}`;
          a.startsWith('@@') && (a = Symbol[a.substring(2)]);
          h && n.ab.cc.push(a);
          var q = n.ab.Fb,
            v = q[a];
          void 0 === v || (void 0 === v.kb && v.className !== n.name && v.Gb === c - 2)
            ? ((p.Gb = c - 2), (p.className = n.name), (q[a] = p))
            : ($a(q, a, m), (q[a].kb[c - 2] = p));
          G([], l, (t) => {
            t = wb(m, t, n, g, k);
            void 0 === q[a].kb ? ((t.Gb = c - 2), (q[a] = t)) : (q[a].kb[c - 2] = t);
            return [];
          });
          return [];
        });
      },
      ua: (b) => F(b, Ab),
      L: (b, a, c, d) => {
        function e() {}
        a = I(a);
        e.values = {};
        F(b, {
          name: a,
          constructor: e,
          cb: function (g) {
            return this.constructor.values[g];
          },
          yb: (g, k) => k.value,
          Cb: Bb(a, c, d),
          Ab: null,
        });
        ab(a, e);
      },
      p: (b, a, c) => {
        var d = Cb(b, 'enum');
        a = I(a);
        b = d.constructor;
        d = Object.create(d.constructor.prototype, {
          value: { value: c },
          constructor: { value: Ya(`${d.name}_${a}`, function () {}) },
        });
        b.values[c] = d;
        b[a] = d;
      },
      P: (b, a, c) => {
        a = I(a);
        F(b, { name: a, cb: (d) => d, yb: (d, e) => e, Cb: Db(a, c), Ab: null });
      },
      w: (b, a, c, d, e, g) => {
        var k = ub(a, c);
        b = I(b);
        b = xb(b);
        e = N(d, e);
        ab(
          b,
          function () {
            tb(`Cannot call ${b} due to unbound types`, k);
          },
          a - 1,
        );
        G([], k, (h) => {
          h = [h[0], null].concat(h.slice(1));
          pb(b, wb(b, h, null, e, g), a - 1);
          return [];
        });
      },
      x: (b, a, c, d, e) => {
        a = I(a);
        let g = (h) => h;
        if (0 === d) {
          var k = 32 - 8 * c;
          g = (h) => (h << k) >>> k;
          e = g(e);
        }
        F(b, { name: a, cb: g, yb: (h, l) => l, Cb: Ra(a, c, 0 !== d), Ab: null });
      },
      m: (b, a, c) => {
        function d(g) {
          return new e(oa.buffer, z[(g + 4) >> 2], z[g >> 2]);
        }
        var e = [
          Int8Array,
          Uint8Array,
          Int16Array,
          Uint16Array,
          Int32Array,
          Uint32Array,
          Float32Array,
          Float64Array,
          BigInt64Array,
          BigUint64Array,
        ][a];
        c = I(c);
        F(b, { name: c, cb: d, Cb: d }, { $b: !0 });
      },
      y: (b) => {
        F(b, Eb);
      },
      E: (b, a, c, d, e, g, k, h, l, n, p, m) => {
        c = I(c);
        g = N(e, g);
        h = N(k, h);
        n = N(l, n);
        m = N(p, m);
        G([b], [a], (q) => {
          q = q[0];
          return [new ob(c, q.ab, !1, !1, !0, q, d, g, h, n, m)];
        });
      },
      va: (b, a) => {
        a = I(a);
        F(b, {
          name: a,
          cb(c) {
            var d = D(c + 4, z[c >> 2], !0);
            O(c);
            return d;
          },
          yb(c, d) {
            d instanceof ArrayBuffer && (d = new Uint8Array(d));
            var e = 'string' == typeof d;
            if (!(e || (ArrayBuffer.isView(d) && 1 == d.BYTES_PER_ELEMENT)))
              throw new J('Cannot pass non-string to std::string');
            var g = e ? Fb(d) : d.length;
            var k = Rc(4 + g + 1),
              h = k + 4;
            z[k >> 2] = g;
            e ? R(d, h, g + 1) : u.set(d, h);
            null !== c && c.push(O, k);
            return k;
          },
          Cb: Ma,
          Ab(c) {
            O(c);
          },
        });
      },
      H: (b, a, c) => {
        c = I(c);
        if (2 === a) {
          var d = Hb;
          var e = Ib;
          var g = Jb;
        } else (d = Kb), (e = Lb), (g = Mb);
        F(b, {
          name: c,
          cb: (k) => {
            var h = d(k + 4, z[k >> 2] * a, !0);
            O(k);
            return h;
          },
          yb: (k, h) => {
            if ('string' != typeof h) throw new J(`Cannot pass non-string to C++ string type ${c}`);
            var l = g(h),
              n = Rc(4 + l + a);
            z[n >> 2] = l / a;
            e(h, n + 4, l + a);
            null !== k && k.push(O, n);
            return n;
          },
          Cb: Ma,
          Ab(k) {
            O(k);
          },
        });
      },
      G: (b, a, c, d, e, g) => {
        Ka[b] = { name: I(a), Nb: N(c, d), Db: N(e, g), Qb: [] };
      },
      s: (b, a, c, d, e, g, k, h, l, n) => {
        Ka[b].Qb.push({ Ub: I(a), Zb: c, Xb: N(d, e), Yb: g, fc: k, ec: N(h, l), hc: n });
      },
      xa: (b, a) => {
        a = I(a);
        F(b, { ac: !0, name: a, cb: () => {}, yb: () => {} });
      },
      ba: () => {
        Ea = !1;
        Nb = 0;
      },
      $: () => {
        throw Infinity;
      },
      o: (b, a, c) => {
        var [d, ...e] = Qb(b, a),
          g = d.yb.bind(d),
          k = e.map((l) => l.Cb.bind(l));
        b--;
        var h = Array(b);
        a = `methodCaller<(${e.map((l) => l.name)}) => ${d.name}>`;
        return Pb(
          Ya(a, (l, n, p, m) => {
            for (var q = 0, v = 0; v < b; ++v) (h[v] = k[v](m + q)), (q += 8);
            switch (c) {
              case 0:
                var t = Q(l).apply(null, h);
                break;
              case 2:
                t = Reflect.construct(Q(l), h);
                break;
              case 3:
                t = h[0];
                break;
              case 1:
                t = x;
                m = Rb[n];
                n = t[void 0 === m ? I(n) : m];
                var x;
                Q(l);
                t = n.call(t, ...h);
            }
            l = [];
            n = g(l, t);
            l.length && (z[p >> 2] = ib(l));
            return n;
          }),
        );
      },
      ya: zb,
      ka: (b, a) => {
        b = Q(b);
        a = Q(a);
        return b == a;
      },
      O: (b) => {
        9 < b && (P[b + 1] += 1);
      },
      q: (b, a, c, d, e) => Ob[b](a, c, d, e),
      Ma: (b) => {
        var a = Q(b);
        La(a);
        zb(b);
      },
      Z: (b, a) => {
        Sb[b] && (clearTimeout(Sb[b].id), delete Sb[b]);
        if (!a) return 0;
        var c = setTimeout(() => {
          delete Sb[b];
          Vb(() => kd(b, performance.now()));
        }, a);
        Sb[b] = { id: c, kc: a };
        return 0;
      },
      _: (b, a, c, d) => {
        var e = new Date().getFullYear(),
          g = new Date(e, 0, 1).getTimezoneOffset();
        e = new Date(e, 6, 1).getTimezoneOffset();
        z[b >> 2] = 60 * Math.max(g, e);
        y[a >> 2] = Number(g != e);
        a = (k) => {
          var h = Math.abs(k);
          return `UTC${0 <= k ? '-' : '+'}${String(Math.floor(h / 60)).padStart(2, '0')}${String(h % 60).padStart(
            2,
            '0',
          )}`;
        };
        b = a(g);
        a = a(e);
        e < g ? (R(b, c, 17), R(a, d, 17)) : (R(b, d, 17), R(a, c, 17));
      },
      La: () => performance.now(),
      aa: (b) => {
        var a = u.length;
        b >>>= 0;
        if (2147483648 < b) return !1;
        for (var c = 1; 4 >= c; c *= 2) {
          var d = a * (1 + 0.2 / c);
          d = Math.min(d, b + 100663296);
          a: {
            d =
              ((Math.min(2147483648, 65536 * Math.ceil(Math.max(b, d) / 65536)) - na.buffer.byteLength + 65535) /
                65536) |
              0;
            try {
              na.grow(d);
              ta();
              var e = 1;
              break a;
            } catch (g) {}
            e = void 0;
          }
          if (e) return !0;
        }
        return !1;
      },
      Oa: () => {
        if (void 0 === Ic) {
          var b = f.preinitializedWebGPUDevice,
            a = dd(0),
            c = cd(0, a);
          S(a, b.queue);
          S(c, b);
          Ic = c;
          jd(Ic);
        }
        jd(Ic);
        return Ic;
      },
      ra: function (b, a, c, d, e, g) {
        a = -9007199254740992 > a || 9007199254740992 < a ? NaN : Number(a);
        c = -9007199254740992 > c || 9007199254740992 < c ? NaN : Number(c);
        b = T(b);
        var k = {};
        if (g) {
          var h = z[(g + 12) >> 2];
          if (h) {
            var l = z[(g + 16) >> 2];
            k.requiredFeatures = Array.from(z.subarray(l >> 2, (l + 4 * h) >> 2), (m) => vc[m]);
          }
          var n = z[(g + 20) >> 2];
          if (n) {
            var p = {};
            function m(v, t) {
              let x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !1;
              t = z[(n + t) >> 2];
              4294967295 == t || (x && 0 == t) || (p[v] = t);
            }
            function q(v, t) {
              t = n + t;
              var x = z[(t + 4) >> 2];
              if (4294967295 != z[t >> 2] || 4294967295 != x) p[v] = 4294967296 * z[(t + 4) >> 2] + z[t >> 2];
            }
            m('maxTextureDimension1D', 4);
            m('maxTextureDimension2D', 8);
            m('maxTextureDimension3D', 12);
            m('maxTextureArrayLayers', 16);
            m('maxBindGroups', 20);
            m('maxBindGroupsPlusVertexBuffers', 24);
            m('maxDynamicUniformBuffersPerPipelineLayout', 32);
            m('maxDynamicStorageBuffersPerPipelineLayout', 36);
            m('maxSampledTexturesPerShaderStage', 40);
            m('maxSamplersPerShaderStage', 44);
            m('maxStorageBuffersPerShaderStage', 48);
            m('maxStorageTexturesPerShaderStage', 52);
            m('maxUniformBuffersPerShaderStage', 56);
            m('minUniformBufferOffsetAlignment', 80);
            m('minStorageBufferOffsetAlignment', 84);
            q('maxUniformBufferBindingSize', 64);
            q('maxStorageBufferBindingSize', 72);
            m('maxVertexBuffers', 88);
            q('maxBufferSize', 96);
            m('maxVertexAttributes', 104);
            m('maxVertexBufferArrayStride', 108);
            m('maxInterStageShaderVariables', 112);
            m('maxColorAttachments', 116);
            m('maxColorAttachmentBytesPerSample', 120);
            m('maxComputeWorkgroupStorageSize', 124);
            m('maxComputeInvocationsPerWorkgroup', 128);
            m('maxComputeWorkgroupSizeX', 132);
            m('maxComputeWorkgroupSizeY', 136);
            m('maxComputeWorkgroupSizeZ', 140);
            m('maxComputeWorkgroupsPerDimension', 144);
            m('maxImmediateSize', 148, !0);
            k.requiredLimits = p;
          }
          if ((h = z[(g + 24) >> 2])) (h = { label: U(h + 4) }), (k.defaultQueue = h);
          k.label = U(g + 4);
        }
        b.requestDevice(k).then(
          (m) => {
            S(e, m.queue);
            S(d, m);
            c &&
              m.lost.then((q) => {
                m.onuncapturederror = () => {};
                var v = Y(),
                  t = Xb(q.message);
                ed(c, Jc[q.reason], t);
                X(v);
              });
            m.onuncapturederror = (q) => {
              var v = 5;
              q.error instanceof GPUValidationError
                ? (v = 2)
                : q.error instanceof GPUOutOfMemoryError
                ? (v = 3)
                : q.error instanceof GPUInternalError && (v = 4);
              var t = Y();
              q = Xb(q.error.message);
              hd(d, v, q);
              X(t);
            };
            gd(a, 1, d, 0);
          },
          (m) => {
            var q = Y();
            m = Xb(m.message);
            gd(a, 3, d, m);
            c && ed(c, 4, m);
            X(q);
          },
        );
      },
      ta: (b) => {
        var a = T(b),
          c = Zb[b];
        if (c) {
          for (var d = 0; d < c.length; ++d) c[d]();
          delete Zb[b];
        }
        a.destroy();
      },
      i: (b) => {
        delete Yb[b];
      },
      qa: (b, a, c) => {
        var d = !!z[(a + 32) >> 2];
        a = {
          label: U(a + 4),
          usage: z[(a + 16) >> 2],
          size: 4294967296 * z[(a + 4 + 24) >> 2] + z[(a + 24) >> 2],
          mappedAtCreation: d,
        };
        b = T(b);
        try {
          var e = b.createBuffer(a);
        } catch (g) {
          return !1;
        }
        S(c, e);
        d && (Zb[c] = []);
        return !0;
      },
      pa: (b, a, c) => {
        var d = z[a >> 2],
          e = z[(d + 4) >> 2];
        a = { label: U(a + 4), code: '' };
        switch (e) {
          case 2:
            a.code = $b(d + 8);
        }
        S(c, T(b).createShaderModule(a));
      },
      sa: (b) => {
        b = T(b);
        b.onuncapturederror = null;
        b.destroy();
      },
      oa: function (b, a, c, d) {
        a = -9007199254740992 > a || 9007199254740992 < a ? NaN : Number(a);
        if (c) {
          var e = {
            featureLevel: uc[z[(c + 4) >> 2]],
            powerPreference: zc[z[(c + 8) >> 2]],
            forceFallbackAdapter: !!z[(c + 12) >> 2],
          };
          b = z[c >> 2];
          0 !== b && (e.mc = !!z[(b + 8) >> 2]);
        }
        'gpu' in navigator
          ? navigator.gpu.requestAdapter(e).then(
              (g) => {
                if (g) S(d, g), fd(a, 1, d, 0);
                else {
                  g = Y();
                  var k = Xb('WebGPU not available on this browser (requestAdapter returned null)');
                  fd(a, 3, d, k);
                  X(g);
                }
              },
              (g) => {
                var k = Y();
                g = Xb(g.message);
                fd(a, 4, d, g);
                X(k);
              },
            )
          : ((e = Y()),
            (b = Xb('WebGPU not available on this browser (navigator.gpu is not available)')),
            fd(a, 3, d, b),
            X(e));
      },
      ma: (b, a) => {
        var c = 0,
          d = 0,
          e;
        for (e of Mc()) {
          var g = a + c;
          z[(b + d) >> 2] = g;
          c += R(e, g, Infinity) + 1;
          d += 4;
        }
        return 0;
      },
      na: (b, a) => {
        var c = Mc();
        z[b >> 2] = c.length;
        b = 0;
        for (var d of c) b += Fb(d) + 1;
        z[a >> 2] = b;
        return 0;
      },
      N: () => 52,
      ha: () => 52,
      ca: function () {
        return 70;
      },
      M: (b, a, c, d) => {
        for (var e = 0, g = 0; g < c; g++) {
          var k = z[a >> 2],
            h = z[(a + 4) >> 2];
          a += 8;
          for (var l = 0; l < h; l++) {
            var n = b,
              p = u[k + l],
              m = Nc[n];
            if (0 === p || 10 === p) {
              n = 1 === n ? ha : r;
              p = m;
              var q = Ga(p, 0);
              p = Fa.decode(p.buffer ? p.subarray(0, q) : new Uint8Array(p.slice(0, q)));
              n(p);
              m.length = 0;
            } else m.push(p);
          }
          e += h;
        }
        z[d >> 2] = e;
        return 0;
      },
      u: ld,
      j: md,
      g: nd,
      R: od,
      za: pd,
      b: qd,
      d: rd,
      n: sd,
      A: td,
      la: Ub,
      da: (b, a) => {
        Pc(u.subarray(b, b + a));
        return 0;
      },
      D: function (b) {
        return BigInt(T(b).size);
      },
      J: (b, a) => {
        var c = z[a >> 2],
          d = void 0;
        0 !== c && (d = 4294967296 * z[(c + 12) >> 2] + z[(c + 8) >> 2]);
        c = U(a + 4);
        for (var e = z[(a + 12) >> 2], g = z[(a + 16) >> 2], k = [], h = 0; h < e; ++h) {
          var l = k,
            n = l.push;
          var p = g + 56 * h;
          var m = z[(p + 4) >> 2];
          if (0 !== m) {
            var q = y[(p + 8) >> 2];
            -1 == q && (q = void 0);
            var v = p + 24;
            p = {
              view: T(m),
              depthSlice: q,
              resolveTarget: T(z[(p + 12) >> 2]),
              clearValue: { r: C[v >> 3], g: C[(v + 8) >> 3], b: C[(v + 16) >> 3], a: C[(v + 24) >> 3] },
              loadOp: xc[z[(p + 16) >> 2]],
              storeOp: Dc[z[(p + 20) >> 2]],
            };
          } else p = void 0;
          n.call(l, p);
        }
        e = z[(a + 20) >> 2];
        e =
          0 !== e
            ? {
                view: T(z[(e + 4) >> 2]),
                depthClearValue: A[(e + 16) >> 2],
                depthLoadOp: xc[z[(e + 8) >> 2]],
                depthStoreOp: Dc[z[(e + 12) >> 2]],
                depthReadOnly: !!z[(e + 20) >> 2],
                stencilClearValue: z[(e + 32) >> 2],
                stencilLoadOp: xc[z[(e + 24) >> 2]],
                stencilStoreOp: Dc[z[(e + 28) >> 2]],
                stencilReadOnly: !!z[(e + 36) >> 2],
              }
            : void 0;
        g = z[(a + 28) >> 2];
        g =
          0 !== g
            ? {
                querySet: T(z[(g + 4) >> 2]),
                beginningOfPassWriteIndex: z[(g + 8) >> 2],
                endOfPassWriteIndex: z[(g + 12) >> 2],
              }
            : void 0;
        a = {
          label: c,
          colorAttachments: k,
          depthStencilAttachment: e,
          occlusionQuerySet: T(z[(a + 24) >> 2]),
          timestampWrites: g,
          maxDrawCount: d,
        };
        b = T(b);
        d = Xc(0);
        S(d, b.beginRenderPass(a));
        return d;
      },
      Ba: (b, a, c, d) => {
        T(b).copyTextureToTexture(cc(a), cc(c), ac(d));
      },
      Fa: (b) => {
        b = T(b);
        var a = Uc(0);
        S(a, b.finish());
        return a;
      },
      C: (b, a) => {
        var c = U(a + 4),
          d = T(z[(a + 12) >> 2]),
          e = z[(a + 16) >> 2];
        a = z[(a + 20) >> 2];
        for (var g = [], k = 0; k < e; ++k) {
          var h = g,
            l = h.push;
          var n = a + 40 * k;
          var p = z[(n + 8) >> 2],
            m = z[(n + 32) >> 2],
            q = z[(n + 36) >> 2],
            v = z[(n + 4) >> 2];
          p
            ? ((m = n + 24),
              (m = z[m >> 2] + 4294967296 * y[(m + 4) >> 2]),
              -1 == m && (m = void 0),
              (n = {
                binding: v,
                resource: { buffer: T(p), offset: 4294967296 * z[(n + 4 + 16) >> 2] + z[(n + 16) >> 2], size: m },
              }))
            : (n = m ? { binding: v, resource: T(m) } : { binding: v, resource: T(q) });
          l.call(h, n);
        }
        c = { label: c, layout: d, entries: g };
        b = T(b);
        d = Sc(0);
        S(d, b.createBindGroup(c));
        return d;
      },
      v: (b, a) => {
        var c = U(a + 4),
          d = z[(a + 12) >> 2];
        a = z[(a + 16) >> 2];
        for (var e = [], g = 0; g < d; ++g) {
          var k = e,
            h = k.push,
            l = a + 88 * g,
            n = z[(l + 4) >> 2],
            p = z[(l + 8) >> 2];
          var m = l + 24;
          var q = z[(m + 4) >> 2];
          m = q
            ? {
                type: sc[q],
                hasDynamicOffset: !!z[(m + 8) >> 2],
                minBindingSize: 4294967296 * z[(m + 4 + 16) >> 2] + z[(m + 16) >> 2],
              }
            : void 0;
          q = (q = z[(l + 48 + 4) >> 2]) ? { type: Bc[q] } : void 0;
          var v = l + 56;
          var t = z[(v + 4) >> 2];
          v = t ? { sampleType: Fc[t], viewDimension: Gc[z[(v + 8) >> 2]], multisampled: !!z[(v + 12) >> 2] } : void 0;
          l += 72;
          l = (t = z[(l + 4) >> 2])
            ? { access: Cc[t], format: V[z[(l + 8) >> 2]], viewDimension: Gc[z[(l + 12) >> 2]] }
            : void 0;
          h.call(k, { binding: n, visibility: p, buffer: m, sampler: q, texture: v, storageTexture: l });
        }
        c = { label: c, entries: e };
        b = T(b);
        d = Tc(0);
        S(d, b.createBindGroupLayout(c));
        return d;
      },
      Ga: (b, a) => {
        var c;
        a && (c = { label: U(a + 4) });
        b = T(b);
        a = Vc(0);
        S(a, b.createCommandEncoder(c));
        return a;
      },
      Aa: (b, a) => {
        for (var c = z[(a + 12) >> 2], d = z[(a + 16) >> 2], e = [], g = 0; g < c; ++g) e.push(T(z[(d + 4 * g) >> 2]));
        a = { label: U(a + 4), bindGroupLayouts: e };
        b = T(b);
        c = Wc(0);
        S(c, b.createPipelineLayout(a));
        return c;
      },
      k: (b, a) => {
        a = qc(a);
        b = T(b);
        var c = Yc(0);
        S(c, b.createRenderPipeline(a));
        return c;
      },
      Ka: (b, a) => {
        var c;
        a &&
          (c = {
            label: U(a + 4),
            addressModeU: rc[z[(a + 12) >> 2]],
            addressModeV: rc[z[(a + 16) >> 2]],
            addressModeW: rc[z[(a + 20) >> 2]],
            magFilter: wc[z[(a + 24) >> 2]],
            minFilter: wc[z[(a + 28) >> 2]],
            mipmapFilter: yc[z[(a + 32) >> 2]],
            lodMinClamp: A[(a + 36) >> 2],
            lodMaxClamp: A[(a + 40) >> 2],
            compare: ic[z[(a + 44) >> 2]],
            maxAnisotropy: w[(a + 48) >> 1],
          });
        b = T(b);
        a = Zc(0);
        S(a, b.createSampler(c));
        return a;
      },
      K: (b, a) => {
        var c = {
            label: U(a + 4),
            size: ac(a + 28),
            mipLevelCount: z[(a + 44) >> 2],
            sampleCount: z[(a + 48) >> 2],
            dimension: Ec[z[(a + 24) >> 2]],
            format: V[z[(a + 40) >> 2]],
            usage: z[(a + 16) >> 2],
          },
          d = z[(a + 52) >> 2];
        d && ((a = z[(a + 56) >> 2]), (c.viewFormats = Array.from(y.subarray(a >> 2, (a + 4 * d) >> 2), (e) => V[e])));
        b = T(b);
        d = ad(0);
        S(d, b.createTexture(c));
        return d;
      },
      Na: (b, a) => {
        b = z[(z[a >> 2] + 8) >> 2];
        b = 2 < b ? D(b) : b;
        b = (Qc[b] || ('undefined' != typeof document ? document.querySelector(b) : null)).getContext('webgpu');
        if (!b) return 0;
        b.jc = U(a + 4);
        a = $c(0);
        S(a, b);
        return a;
      },
      V: (b, a, c) => {
        b = T(b);
        a = Array.from(y.subarray(c >> 2, (c + 4 * a) >> 2), (d) => T(d));
        b.submit(a);
      },
      B: function (b, a, c, d, e) {
        c = -9007199254740992 > c || 9007199254740992 < c ? NaN : Number(c);
        b = T(b);
        a = T(a);
        d = u.subarray(d, d + e);
        b.writeBuffer(a, c, d, 0, e);
      },
      W: (b, a, c, d, e, g) => {
        b = T(b);
        a = cc(a);
        var k = z[(e + 8) >> 2],
          h = z[(e + 12) >> 2];
        e = {
          offset: 4294967296 * z[(e + 4) >> 2] + z[e >> 2],
          bytesPerRow: 4294967295 === k ? void 0 : k,
          rowsPerImage: 4294967295 === h ? void 0 : h,
        };
        g = ac(g);
        c = u.subarray(c, c + d);
        b.writeTexture(a, c, e, g);
      },
      S: (b, a, c, d, e, g) => {
        T(b).drawIndexed(a, c, d >>> 0, e, g >>> 0);
      },
      U: (b) => {
        T(b).end();
      },
      c: (b, a, c, d, e) => {
        b = T(b);
        c = T(c);
        0 == d ? b.setBindGroup(a, c) : b.setBindGroup(a, c, z, e >> 2, d);
      },
      T: function (b, a, c, d, e) {
        d = -9007199254740992 > d || 9007199254740992 < d ? NaN : Number(d);
        e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
        b = T(b);
        a = T(a);
        -1 == e && (e = void 0);
        b.setIndexBuffer(a, nc[c], d, e);
      },
      f: (b, a) => {
        T(b).setPipeline(T(a));
      },
      l: (b, a, c, d, e) => {
        T(b).setScissorRect(a, c, d, e);
      },
      h: (b, a) => {
        T(b).setStencilReference(a >>> 0);
      },
      I: function (b, a, c, d, e) {
        d = -9007199254740992 > d || 9007199254740992 < d ? NaN : Number(d);
        e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
        b = T(b);
        c = T(c);
        -1 == e && (e = void 0);
        b.setVertexBuffer(a, c, d, e);
      },
      Da: (b, a) => {
        var c = z[(a + 4) >> 2];
        b = T(b);
        var d = [z[(a + 24) >> 2], z[(a + 28) >> 2]];
        0 !== d[0] && (b.canvas.width = d[0]);
        0 !== d[1] && (b.canvas.height = d[1]);
        c = { device: T(c), format: V[z[(a + 8) >> 2]], usage: z[(a + 16) >> 2], alphaMode: tc[z[(a + 40) >> 2]] };
        if ((d = z[(a + 32) >> 2])) {
          var e = z[(a + 36) >> 2];
          c.viewFormats = Array.from(y.subarray(e >> 2, (e + 4 * d) >> 2), (g) => V[g]);
        }
        a = z[a >> 2];
        0 !== a && ((c.colorSpace = Ac[z[(a + 8) >> 2]]), (c.lc = { mode: Hc[z[(a + 12) >> 2]] }));
        b.configure(c);
      },
      Ca: (b, a) => {
        b = T(b);
        try {
          var c = ad(0);
          S(c, b.getCurrentTexture());
          z[(a + 4) >> 2] = c;
          y[(a + 8) >> 2] = 1;
        } catch (d) {
          (z[(a + 4) >> 2] = 0), (y[(a + 8) >> 2] = 6);
        }
      },
      Ea: (b) => {
        T(b).unconfigure();
      },
      Ha: (b, a) => {
        if (a) {
          var c = z[(a + 24) >> 2];
          var d = z[(a + 32) >> 2];
          c = {
            label: U(a + 4),
            format: V[z[(a + 12) >> 2]],
            dimension: Gc[z[(a + 16) >> 2]],
            baseMipLevel: z[(a + 20) >> 2],
            mipLevelCount: 4294967295 === c ? void 0 : c,
            baseArrayLayer: z[(a + 28) >> 2],
            arrayLayerCount: 4294967295 === d ? void 0 : d,
            aspect: bc[z[(a + 36) >> 2]],
          };
        }
        b = T(b);
        a = bd(0);
        S(a, b.createView(c));
        return a;
      },
      Ja: (b) => {
        T(b).destroy();
      },
      Ia: (b) => V.indexOf(T(b).format),
      X: (b) => T(b).height,
      Y: (b) => T(b).width,
    };
  function ld(b, a) {
    var c = Y();
    try {
      return L.get(b)(a);
    } catch (d) {
      X(c);
      if (d !== d + 0) throw d;
      W(1, 0);
    }
  }
  function od(b, a, c, d, e, g) {
    var k = Y();
    try {
      return L.get(b)(a, c, d, e, g);
    } catch (h) {
      X(k);
      if (h !== h + 0) throw h;
      W(1, 0);
    }
  }
  function qd(b, a) {
    var c = Y();
    try {
      L.get(b)(a);
    } catch (d) {
      X(c);
      if (d !== d + 0) throw d;
      W(1, 0);
    }
  }
  function sd(b, a, c, d) {
    var e = Y();
    try {
      L.get(b)(a, c, d);
    } catch (g) {
      X(e);
      if (g !== g + 0) throw g;
      W(1, 0);
    }
  }
  function md(b, a, c) {
    var d = Y();
    try {
      return L.get(b)(a, c);
    } catch (e) {
      X(d);
      if (e !== e + 0) throw e;
      W(1, 0);
    }
  }
  function rd(b, a, c) {
    var d = Y();
    try {
      L.get(b)(a, c);
    } catch (e) {
      X(d);
      if (e !== e + 0) throw e;
      W(1, 0);
    }
  }
  function pd(b) {
    var a = Y();
    try {
      L.get(b)();
    } catch (c) {
      X(a);
      if (c !== c + 0) throw c;
      W(1, 0);
    }
  }
  function nd(b, a, c, d) {
    var e = Y();
    try {
      return L.get(b)(a, c, d);
    } catch (g) {
      X(e);
      if (g !== g + 0) throw g;
      W(1, 0);
    }
  }
  function td(b, a, c, d, e) {
    var g = Y();
    try {
      L.get(b)(a, c, d, e);
    } catch (k) {
      X(g);
      if (k !== k + 0) throw k;
      W(1, 0);
    }
  }
  var Z;
  Z = await (async function () {
    function b(c) {
      Z = c.exports;
      na = Z.Pa;
      ta();
      L = Z.Sa;
      c = Z;
      f._malloc = Rc = c.Ra;
      f._free = O = c.Ta;
      rb = c.Ua;
      Sc = c.Va;
      Tc = c.Wa;
      Uc = c.Xa;
      Vc = c.Ya;
      Wc = c.$a;
      Xc = c.db;
      Yc = c.eb;
      Zc = c.fb;
      $c = c.gb;
      ad = c.hb;
      bd = c.ib;
      cd = c.lb;
      dd = c.mb;
      ed = c.ob;
      fd = c.pb;
      gd = c.qb;
      hd = c.rb;
      jd = c.sb;
      kd = c.tb;
      W = c.ub;
      X = c.vb;
      Wb = c.wb;
      Y = c.xb;
      return Z;
    }
    var a = { a: ud };
    if (f.instantiateWasm)
      return new Promise((c) => {
        f.instantiateWasm(a, (d, e) => {
          c(b(d, e));
        });
      });
    va !== null && va !== void 0
      ? va
      : (va = f.locateFile
          ? f.locateFile
            ? f.locateFile('DotLottiePlayer.wasm', da)
            : da + 'DotLottiePlayer.wasm'
          : new URL('DotLottiePlayer.wasm', import.meta.url).href);
    return b((await ya(a)).instance);
  })();
  (function () {
    function b() {
      f.calledRun = !0;
      if (!ja) {
        var _la, _f$onRuntimeInitializ;
        sa = !0;
        Z.Qa();
        (_la = la) === null || _la === void 0 || _la(f);
        (_f$onRuntimeInitializ = f.onRuntimeInitialized) === null ||
          _f$onRuntimeInitializ === void 0 ||
          _f$onRuntimeInitializ.call(f);
        if (f.postRun)
          for ('function' == typeof f.postRun && (f.postRun = [f.postRun]); f.postRun.length; ) {
            var a = f.postRun.shift();
            Ba.push(a);
          }
        Aa(Ba);
      }
    }
    if (f.preRun) for ('function' == typeof f.preRun && (f.preRun = [f.preRun]); f.preRun.length; ) Da();
    Aa(Ca);
    f.setStatus
      ? (f.setStatus('Running...'),
        setTimeout(() => {
          setTimeout(() => f.setStatus(''), 1);
          b();
        }, 1))
      : b();
  })();
  sa
    ? (moduleRtn = f)
    : (moduleRtn = new Promise((b, a) => {
        la = b;
        ma = a;
      }));
  return moduleRtn;
}
export default createDotLottiePlayerModule;
