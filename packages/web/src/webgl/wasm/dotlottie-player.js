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
  var k = moduleArg;
  if ('undefined' === typeof globalThis.BigInt64Array) {
    function a(c) {
      return [Number(BigInt(c) & BigInt(4294967295)) | 0, Number(BigInt(c) >> 32n) | 0];
    }
    function b(c) {
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
            var f = e;
            e = new Uint32Array(2 * e.length);
          }
        var h = new Proxy(
          {
            slice(g, l) {
              l !== null && l !== void 0 ? l : (l = e.length);
              g = e.slice(2 * g, 2 * l);
              return d(g);
            },
            subarray(g, l) {
              g = e.subarray(2 * g, 2 * l);
              return d(g);
            },
            [Symbol.iterator]: function* () {
              for (var g = 0; g < e.length / 2; g++) yield c(e[2 * g], e[2 * g + 1]);
            },
            BYTES_PER_ELEMENT: 2 * e.BYTES_PER_ELEMENT,
            buffer: e.buffer,
            byteLength: e.byteLength,
            byteOffset: e.byteOffset,
            length: e.length / 2,
            copyWithin: function (g, l, m) {
              e.copyWithin(2 * g, 2 * l, 2 * m);
              return h;
            },
            set(g, l) {
              l !== null && l !== void 0 ? l : (l = 0);
              if (2 * (g.length + l) > e.length) throw new RangeError('offset is out of bounds');
              for (var m = 0; m < g.length; m++) {
                var p = a(g[m]);
                e.set(p, 2 * (l + m));
              }
            },
          },
          {
            get(g, l, m) {
              return 'string' === typeof l && /^\d+$/.test(l) ? c(e[2 * l], e[2 * l + 1]) : Reflect.get(g, l, m);
            },
            set(g, l, m, p) {
              if ('string' !== typeof l || !/^\d+$/.test(l)) return Reflect.set(g, l, m, p);
              if ('bigint' !== typeof m) throw new TypeError(`Cannot convert ${m} to a BigInt`);
              g = a(m);
              e.set(g, 2 * l);
              return !0;
            },
          },
        );
        f && h.set(f);
        return h;
      }
      return d;
    }
    globalThis.BigUint64Array = b(function (c, d) {
      return BigInt(c) | (BigInt(d) << 32n);
    });
    globalThis.BigInt64Array = b(function (c, d) {
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
      (fa = (a) => {
        var b = new XMLHttpRequest();
        b.open('GET', a, !1);
        b.responseType = 'arraybuffer';
        b.send(null);
        return new Uint8Array(b.response);
      });
    ea = async (a) => {
      a = await fetch(a, { credentials: 'same-origin' });
      if (a.ok) return a.arrayBuffer();
      throw Error(a.status + ' : ' + a.url);
    };
  }
  var ha = console.log.bind(console),
    n = console.error.bind(console),
    ia,
    ja = !1,
    ka,
    na,
    oa,
    pa,
    q,
    r,
    t,
    qa,
    x,
    z,
    ra,
    sa,
    ta,
    ua,
    va = !1;
  function wa() {
    var a = pa.buffer;
    k.HEAP8 = q = new Int8Array(a);
    k.HEAP16 = t = new Int16Array(a);
    k.HEAPU8 = r = new Uint8Array(a);
    k.HEAPU16 = qa = new Uint16Array(a);
    k.HEAP32 = x = new Int32Array(a);
    k.HEAPU32 = z = new Uint32Array(a);
    k.HEAPF32 = ra = new Float32Array(a);
    k.HEAPF64 = sa = new Float64Array(a);
    k.HEAP64 = ta = new BigInt64Array(a);
    k.HEAPU64 = ua = new BigUint64Array(a);
  }
  function xa(a) {
    var _k$onAbort, _oa;
    (_k$onAbort = k.onAbort) === null || _k$onAbort === void 0 || _k$onAbort.call(k, a);
    a = 'Aborted(' + a + ')';
    n(a);
    ja = !0;
    a = new WebAssembly.RuntimeError(a + '. Build with -sASSERTIONS for more info.');
    (_oa = oa) === null || _oa === void 0 || _oa(a);
    throw a;
  }
  var ya;
  async function za(a) {
    if (!ia)
      try {
        var b = await ea(a);
        return new Uint8Array(b);
      } catch {}
    if (a == ya && ia) a = new Uint8Array(ia);
    else if (fa) a = fa(a);
    else throw 'both async and sync fetching of the wasm failed';
    return a;
  }
  async function Aa(a, b) {
    try {
      var c = await za(a);
      return await WebAssembly.instantiate(c, b);
    } catch (d) {
      n(`failed to asynchronously prepare wasm: ${d}`), xa(d);
    }
  }
  async function Ba(a) {
    var b = ya;
    if (!ia && WebAssembly.instantiateStreaming)
      try {
        var c = fetch(b, { credentials: 'same-origin' });
        return await WebAssembly.instantiateStreaming(c, a);
      } catch (d) {
        n(`wasm streaming compile failed: ${d}`), n('falling back to ArrayBuffer instantiation');
      }
    return Aa(b, a);
  }
  class Ca {
    constructor(a) {
      _defineProperty(this, 'name', 'ExitStatus');
      this.message = `Program terminated with exit(${a})`;
      this.status = a;
    }
  }
  var Da = (a) => {
      for (; 0 < a.length; ) a.shift()(k);
    },
    Ea = [],
    Fa = [],
    Ga = () => {
      var a = k.preRun.shift();
      Fa.push(a);
    },
    Ha = !0,
    Ia = new TextDecoder(),
    Ja = (a, b, c, d) => {
      c = b + c;
      if (d) return c;
      for (; a[b] && !(b >= c); ) ++b;
      return b;
    },
    A = (a, b, c) => (a ? Ia.decode(r.subarray(a, Ja(r, a, b, c))) : '');
  class Ka {
    constructor(a) {
      this.Fb = a - 24;
    }
  }
  var La = 0,
    Ma = 0,
    Na = {},
    Oa = (a) => {
      for (; a.length; ) {
        var b = a.pop();
        a.pop()(b);
      }
    };
  function Pa(a) {
    return this.Hb(z[a >> 2]);
  }
  var Qa = {},
    C = {},
    Ra = {},
    Sa = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    },
    E = (a, b, c) => {
      function d(g) {
        g = c(g);
        if (g.length !== a.length) throw new Sa('Mismatched type converter count');
        for (var l = 0; l < a.length; ++l) D(a[l], g[l]);
      }
      a.forEach((g) => (Ra[g] = b));
      var e = Array(b.length),
        f = [],
        h = 0;
      b.forEach((g, l) => {
        C.hasOwnProperty(g)
          ? (e[l] = C[g])
          : (f.push(g),
            Qa.hasOwnProperty(g) || (Qa[g] = []),
            Qa[g].push(() => {
              e[l] = C[g];
              ++h;
              h === f.length && d(e);
            }));
      });
      0 === f.length && d(e);
    },
    G = (a) => {
      for (var b = ''; ; ) {
        var c = r[a++];
        if (!c) return b;
        b += String.fromCharCode(c);
      }
    },
    H = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
  function Ta(a, b) {
    let c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var d = b.name;
    if (!a) throw new H(`type "${d}" must have a positive integer typeid pointer`);
    if (C.hasOwnProperty(a)) {
      if (c.Qc) return;
      throw new H(`Cannot register type '${d}' twice`);
    }
    C[a] = b;
    delete Ra[a];
    Qa.hasOwnProperty(a) && ((b = Qa[a]), delete Qa[a], b.forEach((e) => e()));
  }
  function D(a, b) {
    let c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return Ta(a, b, c);
  }
  var Ua = (a, b, c) => {
      switch (b) {
        case 1:
          return c ? (d) => q[d] : (d) => r[d];
        case 2:
          return c ? (d) => t[d >> 1] : (d) => qa[d >> 1];
        case 4:
          return c ? (d) => x[d >> 2] : (d) => z[d >> 2];
        case 8:
          return c ? (d) => ta[d >> 3] : (d) => ua[d >> 3];
        default:
          throw new TypeError(`invalid integer width (${b}): ${a}`);
      }
    },
    Va = (a) => {
      throw new H(a.Eb.Ib.Gb.name + ' instance already deleted');
    },
    Wa = !1,
    Xa = () => {},
    Ya = (a) => {
      if ('undefined' === typeof FinalizationRegistry) return (Ya = (b) => b), a;
      Wa = new FinalizationRegistry((b) => {
        b = b.Eb;
        --b.count.value;
        0 === b.count.value && (b.Kb ? b.Ob.Qb(b.Kb) : b.Ib.Gb.Qb(b.Fb));
      });
      Ya = (b) => {
        var c = b.Eb;
        c.Kb && Wa.register(b, { Eb: c }, b);
        return b;
      };
      Xa = (b) => {
        Wa.unregister(b);
      };
      return Ya(a);
    },
    Za = [];
  function ab() {}
  var bb = (a, b) => Object.defineProperty(b, 'name', { value: a }),
    cb = {},
    db = (a, b, c) => {
      if (void 0 === a[b].Jb) {
        var d = a[b];
        a[b] = function () {
          for (var _len = arguments.length, e = new Array(_len), _key = 0; _key < _len; _key++) {
            e[_key] = arguments[_key];
          }
          if (!a[b].Jb.hasOwnProperty(e.length))
            throw new H(
              `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].Jb})!`,
            );
          return a[b].Jb[e.length].apply(this, e);
        };
        a[b].Jb = [];
        a[b].Jb[d.Yb] = d;
      }
    },
    eb = (a, b, c) => {
      if (k.hasOwnProperty(a)) {
        if (void 0 === c || (void 0 !== k[a].Jb && void 0 !== k[a].Jb[c]))
          throw new H(`Cannot register public name '${a}' twice`);
        db(k, a, a);
        if (k[a].Jb.hasOwnProperty(c))
          throw new H(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
        k[a].Jb[c] = b;
      } else (k[a] = b), (k[a].Yb = c);
    },
    fb = (a) => {
      a = a.replace(/[^a-zA-Z0-9_]/g, '$');
      var b = a.charCodeAt(0);
      return 48 <= b && 57 >= b ? `_${a}` : a;
    };
  function gb(a, b, c, d, e, f, h, g) {
    this.name = a;
    this.constructor = b;
    this.Vb = c;
    this.Qb = d;
    this.Mb = e;
    this.Lc = f;
    this.dc = h;
    this.Ic = g;
    this.Uc = [];
  }
  var hb = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.dc) throw new H(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.dc(a);
        b = b.Mb;
      }
      return a;
    },
    ib = (a) => {
      if (null === a) return 'null';
      var b = typeof a;
      return 'object' === b || 'array' === b || 'function' === b ? a.toString() : '' + a;
    };
  function jb(a, b) {
    if (null === b) {
      if (this.oc) throw new H(`null is not a valid ${this.name}`);
      return 0;
    }
    if (!b.Eb) throw new H(`Cannot pass "${ib(b)}" as a ${this.name}`);
    if (!b.Eb.Fb) throw new H(`Cannot pass deleted object as a pointer of type ${this.name}`);
    return hb(b.Eb.Fb, b.Eb.Ib.Gb, this.Gb);
  }
  function kb(a, b) {
    if (null === b) {
      if (this.oc) throw new H(`null is not a valid ${this.name}`);
      if (this.ic) {
        var c = this.qc();
        null !== a && a.push(this.Qb, c);
        return c;
      }
      return 0;
    }
    if (!b || !b.Eb) throw new H(`Cannot pass "${ib(b)}" as a ${this.name}`);
    if (!b.Eb.Fb) throw new H(`Cannot pass deleted object as a pointer of type ${this.name}`);
    if (!this.hc && b.Eb.Ib.hc)
      throw new H(
        `Cannot convert argument of type ${b.Eb.Ob ? b.Eb.Ob.name : b.Eb.Ib.name} to parameter type ${this.name}`,
      );
    c = hb(b.Eb.Fb, b.Eb.Ib.Gb, this.Gb);
    if (this.ic) {
      if (void 0 === b.Eb.Kb) throw new H('Passing raw pointer to smart pointer is illegal');
      switch (this.Zc) {
        case 0:
          if (b.Eb.Ob === this) c = b.Eb.Kb;
          else
            throw new H(
              `Cannot convert argument of type ${b.Eb.Ob ? b.Eb.Ob.name : b.Eb.Ib.name} to parameter type ${this.name}`,
            );
          break;
        case 1:
          c = b.Eb.Kb;
          break;
        case 2:
          if (b.Eb.Ob === this) c = b.Eb.Kb;
          else {
            var d = b.clone();
            c = this.Vc(
              c,
              lb(() => d['delete']()),
            );
            null !== a && a.push(this.Qb, c);
          }
          break;
        default:
          throw new H('Unsupporting sharing policy');
      }
    }
    return c;
  }
  function mb(a, b) {
    if (null === b) {
      if (this.oc) throw new H(`null is not a valid ${this.name}`);
      return 0;
    }
    if (!b.Eb) throw new H(`Cannot pass "${ib(b)}" as a ${this.name}`);
    if (!b.Eb.Fb) throw new H(`Cannot pass deleted object as a pointer of type ${this.name}`);
    if (b.Eb.Ib.hc) throw new H(`Cannot convert argument of type ${b.Eb.Ib.name} to parameter type ${this.name}`);
    return hb(b.Eb.Fb, b.Eb.Ib.Gb, this.Gb);
  }
  var nb = (a, b, c) => {
      if (b === c) return a;
      if (void 0 === c.Mb) return null;
      a = nb(a, b, c.Mb);
      return null === a ? null : c.Ic(a);
    },
    ob = {},
    pb = (a, b) => {
      if (void 0 === b) throw new H('ptr should not be undefined');
      for (; a.Mb; ) (b = a.dc(b)), (a = a.Mb);
      return ob[b];
    },
    qb = (a, b) => {
      if (!b.Ib || !b.Fb) throw new Sa('makeClassHandle requires ptr and ptrType');
      if (!!b.Ob !== !!b.Kb) throw new Sa('Both smartPtrType and smartPtr must be specified');
      b.count = { value: 1 };
      return Ya(Object.create(a, { Eb: { value: b, writable: !0 } }));
    };
  function rb(a, b, c, d, e, f, h, g, l, m, p) {
    this.name = a;
    this.Gb = b;
    this.oc = c;
    this.hc = d;
    this.ic = e;
    this.Tc = f;
    this.Zc = h;
    this.Bc = g;
    this.qc = l;
    this.Vc = m;
    this.Qb = p;
    e || void 0 !== b.Mb ? (this.Lb = kb) : ((this.Lb = d ? jb : mb), (this.Nb = null));
  }
  var sb = (a, b, c) => {
      if (!k.hasOwnProperty(a)) throw new Sa('Replacing nonexistent public symbol');
      void 0 !== k[a].Jb && void 0 !== c ? (k[a].Jb[c] = b) : ((k[a] = b), (k[a].Yb = c));
    },
    I,
    K = (a, b) => {
      a = G(a);
      var c = I.get(b);
      if ('function' != typeof c) throw new H(`unknown function pointer with signature ${a}: ${b}`);
      return c;
    };
  class tb extends Error {}
  var vb = (a) => {
      a = ub(a);
      var b = G(a);
      L(a);
      return b;
    },
    wb = (a, b) => {
      function c(f) {
        e[f] || C[f] || (Ra[f] ? Ra[f].forEach(c) : (d.push(f), (e[f] = !0)));
      }
      var d = [],
        e = {};
      b.forEach(c);
      throw new tb(`${a}: ` + d.map(vb).join([', ']));
    },
    xb = (a, b) => {
      for (var c = [], d = 0; d < a; d++) c.push(z[(b + 4 * d) >> 2]);
      return c;
    };
  function yb(a) {
    for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].Nb) return !0;
    return !1;
  }
  function zb(a, b, c, d, e) {
    var f = b.length;
    if (2 > f) throw new H("argTypes array size mismatch! Must at least get return value and 'this' types!");
    var h = null !== b[1] && null !== c,
      g = yb(b),
      l = !b[0].Sc,
      m = f - 2,
      p = Array(m),
      u = [],
      v = [];
    return bb(a, function () {
      for (var _len2 = arguments.length, B = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        B[_key2] = arguments[_key2];
      }
      v.length = 0;
      u.length = h ? 2 : 1;
      u[0] = e;
      if (h) {
        var w = b[1].Lb(v, this);
        u[1] = w;
      }
      for (var y = 0; y < m; ++y) (p[y] = b[y + 2].Lb(v, B[y])), u.push(p[y]);
      B = d(...u);
      if (g) Oa(v);
      else
        for (y = h ? 1 : 2; y < b.length; y++) {
          var J = 1 === y ? w : p[y - 2];
          null !== b[y].Nb && b[y].Nb(J);
        }
      w = l ? b[0].Hb(B) : void 0;
      return w;
    });
  }
  var Ab = (a) => {
      a = a.trim();
      const b = a.indexOf('(');
      return -1 === b ? a : a.slice(0, b);
    },
    Bb = [],
    M = [0, 1, , 1, null, 1, !0, 1, !1, 1],
    Cb = (a) => {
      9 < a && 0 === --M[a + 1] && ((M[a] = void 0), Bb.push(a));
    },
    N = (a) => {
      if (!a) throw new H(`Cannot use deleted val. handle = ${a}`);
      return M[a];
    },
    lb = (a) => {
      switch (a) {
        case void 0:
          return 2;
        case null:
          return 4;
        case !0:
          return 6;
        case !1:
          return 8;
        default:
          const b = Bb.pop() || M.length;
          M[b] = a;
          M[b + 1] = 1;
          return b;
      }
    },
    Db = {
      name: 'emscripten::val',
      Hb: (a) => {
        var b = N(a);
        Cb(a);
        return b;
      },
      Lb: (a, b) => lb(b),
      Pb: Pa,
      Nb: null,
    },
    Eb = (a, b, c) => {
      switch (b) {
        case 1:
          return c
            ? function (d) {
                return this.Hb(q[d]);
              }
            : function (d) {
                return this.Hb(r[d]);
              };
        case 2:
          return c
            ? function (d) {
                return this.Hb(t[d >> 1]);
              }
            : function (d) {
                return this.Hb(qa[d >> 1]);
              };
        case 4:
          return c
            ? function (d) {
                return this.Hb(x[d >> 2]);
              }
            : function (d) {
                return this.Hb(z[d >> 2]);
              };
        default:
          throw new TypeError(`invalid integer width (${b}): ${a}`);
      }
    },
    Fb = (a, b) => {
      var c = C[a];
      if (void 0 === c) throw ((a = `${b} has unknown type ${vb(a)}`), new H(a));
      return c;
    },
    Gb = (a, b) => {
      switch (b) {
        case 4:
          return function (c) {
            return this.Hb(ra[c >> 2]);
          };
        case 8:
          return function (c) {
            return this.Hb(sa[c >> 3]);
          };
        default:
          throw new TypeError(`invalid float width (${b}): ${a}`);
      }
    },
    Hb = Object.assign({ optional: !0 }, Db),
    O = (a, b, c) => {
      var d = r;
      if (!(0 < c)) return 0;
      var e = b;
      c = b + c - 1;
      for (var f = 0; f < a.length; ++f) {
        var h = a.codePointAt(f);
        if (127 >= h) {
          if (b >= c) break;
          d[b++] = h;
        } else if (2047 >= h) {
          if (b + 1 >= c) break;
          d[b++] = 192 | (h >> 6);
          d[b++] = 128 | (h & 63);
        } else if (65535 >= h) {
          if (b + 2 >= c) break;
          d[b++] = 224 | (h >> 12);
          d[b++] = 128 | ((h >> 6) & 63);
          d[b++] = 128 | (h & 63);
        } else {
          if (b + 3 >= c) break;
          d[b++] = 240 | (h >> 18);
          d[b++] = 128 | ((h >> 12) & 63);
          d[b++] = 128 | ((h >> 6) & 63);
          d[b++] = 128 | (h & 63);
          f++;
        }
      }
      d[b] = 0;
      return b - e;
    },
    Ib = (a) => {
      for (var b = 0, c = 0; c < a.length; ++c) {
        var d = a.charCodeAt(c);
        127 >= d ? b++ : 2047 >= d ? (b += 2) : 55296 <= d && 57343 >= d ? ((b += 4), ++c) : (b += 3);
      }
      return b;
    },
    Jb = new TextDecoder('utf-16le'),
    Kb = (a, b, c) => {
      a >>= 1;
      return Jb.decode(qa.subarray(a, Ja(qa, a, b / 2, c)));
    },
    Lb = (a, b, c) => {
      c !== null && c !== void 0 ? c : (c = 2147483647);
      if (2 > c) return 0;
      c -= 2;
      var d = b;
      c = c < 2 * a.length ? c / 2 : a.length;
      for (var e = 0; e < c; ++e) (t[b >> 1] = a.charCodeAt(e)), (b += 2);
      t[b >> 1] = 0;
      return b - d;
    },
    Mb = (a) => 2 * a.length,
    Nb = (a, b, c) => {
      var d = '';
      a >>= 2;
      for (var e = 0; !(e >= b / 4); e++) {
        var f = z[a + e];
        if (!f && !c) break;
        d += String.fromCodePoint(f);
      }
      return d;
    },
    Ob = (a, b, c) => {
      c !== null && c !== void 0 ? c : (c = 2147483647);
      if (4 > c) return 0;
      var d = b;
      c = d + c - 4;
      for (var e = 0; e < a.length; ++e) {
        var f = a.codePointAt(e);
        65535 < f && e++;
        x[b >> 2] = f;
        b += 4;
        if (b + 4 > c) break;
      }
      x[b >> 2] = 0;
      return b - d;
    },
    Qb = (a) => {
      for (var b = 0, c = 0; c < a.length; ++c) 65535 < a.codePointAt(c) && c++, (b += 4);
      return b;
    },
    Rb = 0,
    Sb = [],
    Tb = (a) => {
      var b = Sb.length;
      Sb.push(a);
      return b;
    },
    Ub = (a, b) => {
      for (var c = Array(a), d = 0; d < a; ++d) c[d] = Fb(z[(b + 4 * d) >> 2], `parameter ${d}`);
      return c;
    },
    Vb = {},
    Wb = {},
    Xb = (a) => {
      if (!(a instanceof Ca || 'unwind' == a)) throw a;
    },
    Yb = (a) => {
      var _k$onExit;
      ka = a;
      Ha || 0 < Rb || ((_k$onExit = k.onExit) !== null && _k$onExit !== void 0 && _k$onExit.call(k, a), (ja = !0));
      throw new Ca(a);
    },
    Zb = (a) => {
      if (!ja)
        try {
          if ((a(), !(Ha || 0 < Rb)))
            try {
              (ka = a = ka), Yb(a);
            } catch (b) {
              Xb(b);
            }
        } catch (b) {
          Xb(b);
        }
    },
    P,
    $b = (a) => {
      var b = a.getExtension('ANGLE_instanced_arrays');
      b &&
        ((a.vertexAttribDivisor = (c, d) => b.vertexAttribDivisorANGLE(c, d)),
        (a.drawArraysInstanced = (c, d, e, f) => b.drawArraysInstancedANGLE(c, d, e, f)),
        (a.drawElementsInstanced = (c, d, e, f, h) => b.drawElementsInstancedANGLE(c, d, e, f, h)));
    },
    ac = (a) => {
      var b = a.getExtension('OES_vertex_array_object');
      b &&
        ((a.createVertexArray = () => b.createVertexArrayOES()),
        (a.deleteVertexArray = (c) => b.deleteVertexArrayOES(c)),
        (a.bindVertexArray = (c) => b.bindVertexArrayOES(c)),
        (a.isVertexArray = (c) => b.isVertexArrayOES(c)));
    },
    bc = (a) => {
      var b = a.getExtension('WEBGL_draw_buffers');
      b && (a.drawBuffers = (c, d) => b.drawBuffersWEBGL(c, d));
    },
    cc = (a) => {
      var b =
        'ANGLE_instanced_arrays EXT_blend_minmax EXT_disjoint_timer_query EXT_frag_depth EXT_shader_texture_lod EXT_sRGB OES_element_index_uint OES_fbo_render_mipmap OES_standard_derivatives OES_texture_float OES_texture_half_float OES_texture_half_float_linear OES_vertex_array_object WEBGL_color_buffer_float WEBGL_depth_texture WEBGL_draw_buffers EXT_color_buffer_float EXT_conservative_depth EXT_disjoint_timer_query_webgl2 EXT_texture_norm16 NV_shader_noperspective_interpolation WEBGL_clip_cull_distance EXT_clip_control EXT_color_buffer_half_float EXT_depth_clamp EXT_float_blend EXT_polygon_offset_clamp EXT_texture_compression_bptc EXT_texture_compression_rgtc EXT_texture_filter_anisotropic KHR_parallel_shader_compile OES_texture_float_linear WEBGL_blend_func_extended WEBGL_compressed_texture_astc WEBGL_compressed_texture_etc WEBGL_compressed_texture_etc1 WEBGL_compressed_texture_s3tc WEBGL_compressed_texture_s3tc_srgb WEBGL_debug_renderer_info WEBGL_debug_shaders WEBGL_lose_context WEBGL_multi_draw WEBGL_polygon_mode'.split(
          ' ',
        );
      return (a.getSupportedExtensions() || []).filter((c) => b.includes(c));
    },
    dc = 1,
    Q = [],
    R = [],
    ec = [],
    fc = [],
    gc = [],
    S = [],
    hc = [],
    T = [],
    ic = [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
    jc = (a) => {
      for (var b = dc++, c = a.length; c < b; c++) a[c] = null;
      for (; a[b]; ) b = dc++;
      return b;
    },
    kc = (a, b, c, d) => {
      for (var e = 0; e < a; e++) {
        var f = P[c](),
          h = f && jc(d);
        f ? ((f.name = h), (d[h] = f)) : U || (U = 1282);
        x[(b + 4 * e) >> 2] = h;
      }
    },
    lc = (a) => {
      a = 32 - Math.clz32(0 === a ? 0 : a - 1);
      var b = V.Wb[a];
      if (b) return b;
      b = P.getParameter(34965);
      V.Wb[a] = P.createBuffer();
      P.bindBuffer(34963, V.Wb[a]);
      P.bufferData(34963, 1 << a, 35048);
      P.bindBuffer(34963, b);
      return V.Wb[a];
    },
    nc = (a) => {
      mc = !1;
      for (var b = 0; b < V.pc; ++b) {
        var c = V.Ub[b];
        if (c.ec && c.enabled) {
          mc = !0;
          var d = c.size;
          var e = c.type,
            f = c.stride;
          d = 0 < f ? a * f : d * ic[e - 5120] * a;
          e = 32 - Math.clz32(0 === d ? 0 : d - 1);
          f = V.Xb[e];
          var h = V.Rb[e];
          V.Rb[e] = (V.Rb[e] + 1) & 63;
          var g = f[h];
          g
            ? (e = g)
            : ((g = P.getParameter(34964)),
              (f[h] = P.createBuffer()),
              P.bindBuffer(34962, f[h]),
              P.bufferData(34962, 1 << e, 35048),
              P.bindBuffer(34962, g),
              (e = f[h]));
          P.bindBuffer(34962, e);
          P.bufferSubData(34962, 0, r.subarray(c.Fb, c.Fb + d));
          c.Ec.call(P, b, c.size, c.type, c.Ac, c.stride, 0);
        }
      }
    },
    pc = (a, b) => {
      a.sc ||
        ((a.sc = a.getContext),
        (a.getContext = function (d, e) {
          e = a.sc(d, e);
          return ('webgl' == d) == e instanceof WebGLRenderingContext ? e : null;
        }));
      var c = 1 < b.zc ? a.getContext('webgl2', b) : a.getContext('webgl', b);
      return c ? oc(c, b) : 0;
    },
    oc = (a, b) => {
      var c = jc(T),
        d = { handle: c, attributes: b, version: b.zc, Sb: a };
      a.canvas && (a.canvas.Fc = d);
      T[c] = d;
      ('undefined' == typeof b.xc || b.xc) && qc(d);
      d.pc = d.Sb.getParameter(34921);
      d.Ub = [];
      for (a = 0; a < d.pc; a++) d.Ub[a] = { enabled: !1, ec: !1, size: 0, type: 0, Ac: 0, stride: 0, Fb: 0, Ec: null };
      d.Rb = [];
      d.mc = [];
      d.Rb.length = d.mc.length = 22;
      d.Xb = [];
      d.bc = [];
      d.Xb.length = d.bc.length = 22;
      d.Wb = [];
      d.Wb.length = 22;
      for (a = 0; 21 >= a; ++a) {
        d.Wb[a] = null;
        d.Rb[a] = d.mc[a] = 0;
        d.Xb[a] = [];
        d.bc[a] = [];
        b = d.Xb[a];
        var e = d.bc[a];
        b.length = e.length = 64;
        for (var f = 0; 64 > f; ++f) b[f] = e[f] = null;
      }
      return c;
    },
    qc = (a) => {
      a || (a = V);
      if (!a.Rc) {
        a.Rc = !0;
        var b = a.Sb;
        b.ed = b.getExtension('WEBGL_multi_draw');
        b.bd = b.getExtension('EXT_polygon_offset_clamp');
        b.ad = b.getExtension('EXT_clip_control');
        b.ld = b.getExtension('WEBGL_polygon_mode');
        $b(b);
        ac(b);
        bc(b);
        b.$c = b.getExtension('WEBGL_draw_instanced_base_vertex_base_instance');
        b.cd = b.getExtension('WEBGL_multi_draw_instanced_base_vertex_base_instance');
        2 <= a.version && (b.wc = b.getExtension('EXT_disjoint_timer_query_webgl2'));
        if (2 > a.version || !b.wc) b.wc = b.getExtension('EXT_disjoint_timer_query');
        cc(b).forEach((c) => {
          c.includes('lose_context') || c.includes('debug') || b.getExtension(c);
        });
      }
    },
    U,
    V,
    mc,
    rc = ['default', 'low-power', 'high-performance'],
    sc = [0, 'undefined' != typeof document ? document : 0, 'undefined' != typeof window ? window : 0],
    tc = {},
    vc = () => {
      if (!uc) {
        var a = {
            USER: 'web_user',
            LOGNAME: 'web_user',
            PATH: '/',
            PWD: '/',
            HOME: '/home/web_user',
            LANG: (('object' == typeof navigator && navigator.language) || 'C').replace('-', '_') + '.UTF-8',
            _: ba || './this.program',
          },
          b;
        for (b in tc) void 0 === tc[b] ? delete a[b] : (a[b] = tc[b]);
        var c = [];
        for (b in a) c.push(`${b}=${a[b]}`);
        uc = c;
      }
      return uc;
    },
    uc,
    wc = [null, [], []],
    xc = () => {
      var a = cc(P);
      return (a = a.concat(a.map((b) => 'GL_' + b)));
    },
    yc = (a, b) => {
      if (b) {
        var c = void 0;
        switch (a) {
          case 36346:
            c = 1;
            break;
          case 36344:
            return;
          case 34814:
          case 36345:
            c = 0;
            break;
          case 34466:
            var d = P.getParameter(34467);
            c = d ? d.length : 0;
            break;
          case 33309:
            if (2 > V.version) {
              U || (U = 1282);
              return;
            }
            c = xc().length;
            break;
          case 33307:
          case 33308:
            if (2 > V.version) {
              U || (U = 1280);
              return;
            }
            c = 33307 == a ? 3 : 0;
        }
        if (void 0 === c)
          switch (((d = P.getParameter(a)), typeof d)) {
            case 'number':
              c = d;
              break;
            case 'boolean':
              c = d ? 1 : 0;
              break;
            case 'string':
              U || (U = 1280);
              return;
            case 'object':
              if (null === d)
                switch (a) {
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
                  case 34068:
                    c = 0;
                    break;
                  default:
                    U || (U = 1280);
                    return;
                }
              else {
                if (
                  d instanceof Float32Array ||
                  d instanceof Uint32Array ||
                  d instanceof Int32Array ||
                  d instanceof Array
                ) {
                  for (a = 0; a < d.length; ++a) x[(b + 4 * a) >> 2] = d[a];
                  return;
                }
                try {
                  c = d.name | 0;
                } catch (e) {
                  U || (U = 1280);
                  n(
                    `GL_INVALID_ENUM in glGet${0}v: Unknown object returned from WebGL getParameter(${a})! (error: ${e})`,
                  );
                  return;
                }
              }
              break;
            default:
              U || (U = 1280);
              n(
                `GL_INVALID_ENUM in glGet${0}v: Native code calling glGet${0}v(${a}) and it returns ${d} of type ${typeof d}!`,
              );
              return;
          }
        x[b >> 2] = c;
      } else U || (U = 1281);
    },
    zc = (a) => ']' == a.slice(-1) && a.lastIndexOf('['),
    Ac = [],
    Bc = (a) => {
      a -= 5120;
      return 0 == a
        ? q
        : 1 == a
        ? r
        : 2 == a
        ? t
        : 4 == a
        ? x
        : 6 == a
        ? ra
        : 5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a
        ? z
        : qa;
    },
    Cc = (a) => {
      var b = P.Hc;
      if (b) {
        var c = b.cc[a];
        'number' == typeof c && (b.cc[a] = c = P.getUniformLocation(b, b.Cc[a] + (0 < c ? `[${c}]` : '')));
        return c;
      }
      U || (U = 1282);
    },
    Dc = [],
    Ec = () => (a) => crypto.getRandomValues(a),
    Fc = (a) => {
      (Fc = Ec())(a);
    };
  (() => {
    let a = ab.prototype;
    Object.assign(a, {
      isAliasOf: function (c) {
        if (!(this instanceof ab && c instanceof ab)) return !1;
        var d = this.Eb.Ib.Gb,
          e = this.Eb.Fb;
        c.Eb = c.Eb;
        var f = c.Eb.Ib.Gb;
        for (c = c.Eb.Fb; d.Mb; ) (e = d.dc(e)), (d = d.Mb);
        for (; f.Mb; ) (c = f.dc(c)), (f = f.Mb);
        return d === f && e === c;
      },
      clone: function () {
        this.Eb.Fb || Va(this);
        if (this.Eb.ac) return (this.Eb.count.value += 1), this;
        var c = Ya,
          d = Object,
          e = d.create,
          f = Object.getPrototypeOf(this),
          h = this.Eb;
        c = c(
          e.call(d, f, {
            Eb: { value: { count: h.count, $b: h.$b, ac: h.ac, Fb: h.Fb, Ib: h.Ib, Kb: h.Kb, Ob: h.Ob } },
          }),
        );
        c.Eb.count.value += 1;
        c.Eb.$b = !1;
        return c;
      },
      ['delete']() {
        this.Eb.Fb || Va(this);
        if (this.Eb.$b && !this.Eb.ac) throw new H('Object already scheduled for deletion');
        Xa(this);
        var c = this.Eb;
        --c.count.value;
        0 === c.count.value && (c.Kb ? c.Ob.Qb(c.Kb) : c.Ib.Gb.Qb(c.Fb));
        this.Eb.ac || ((this.Eb.Kb = void 0), (this.Eb.Fb = void 0));
      },
      isDeleted: function () {
        return !this.Eb.Fb;
      },
      deleteLater: function () {
        this.Eb.Fb || Va(this);
        if (this.Eb.$b && !this.Eb.ac) throw new H('Object already scheduled for deletion');
        Za.push(this);
        this.Eb.$b = !0;
        return this;
      },
    });
    const b = Symbol.dispose;
    b && (a[b] = a['delete']);
  })();
  Object.assign(rb.prototype, {
    Mc(a) {
      this.Bc && (a = this.Bc(a));
      return a;
    },
    vc(a) {
      var _this$Qb;
      (_this$Qb = this.Qb) === null || _this$Qb === void 0 || _this$Qb.call(this, a);
    },
    Pb: Pa,
    Hb: function (a) {
      function b() {
        return this.ic ? qb(this.Gb.Vb, { Ib: this.Tc, Fb: c, Ob: this, Kb: a }) : qb(this.Gb.Vb, { Ib: this, Fb: a });
      }
      var c = this.Mc(a);
      if (!c) return this.vc(a), null;
      var d = pb(this.Gb, c);
      if (void 0 !== d) {
        if (0 === d.Eb.count.value) return (d.Eb.Fb = c), (d.Eb.Kb = a), d.clone();
        d = d.clone();
        this.vc(a);
        return d;
      }
      d = this.Gb.Lc(c);
      d = cb[d];
      if (!d) return b.call(this);
      d = this.hc ? d.Gc : d.pointerType;
      var e = nb(c, this.Gb, d.Gb);
      return null === e
        ? b.call(this)
        : this.ic
        ? qb(d.Gb.Vb, { Ib: d, Fb: e, Ob: this, Kb: a })
        : qb(d.Gb.Vb, { Ib: d, Fb: e });
    },
  });
  var Gc = () => {
    if (V) {
      var a = V.Xb;
      V.Xb = V.bc;
      V.bc = a;
      a = V.Rb;
      V.Rb = V.mc;
      V.mc = a;
      for (a = 0; 21 >= a; ++a) V.Rb[a] = 0;
    }
  };
  'undefined' != typeof MainLoop && MainLoop.fd.push(Gc);
  for (let a = 0; 32 > a; ++a) Ac.push(Array(a));
  for (var Hc = new Int32Array(288), Ic = 0; 288 >= Ic; ++Ic) Dc[Ic] = Hc.subarray(0, Ic);
  k.noExitRuntime && (Ha = k.noExitRuntime);
  k.print && (ha = k.print);
  k.printErr && (n = k.printErr);
  k.wasmBinary && (ia = k.wasmBinary);
  k.thisProgram && (ba = k.thisProgram);
  if (k.preInit)
    for ('function' == typeof k.preInit && (k.preInit = [k.preInit]); 0 < k.preInit.length; ) k.preInit.shift()();
  var Jc,
    L,
    ub,
    Kc,
    W,
    X,
    Y,
    Uc = {
      c: (a, b, c, d) =>
        xa(`Assertion failed: ${A(a)}, at: ` + [b ? A(b) : 'unknown filename', c, d ? A(d) : 'unknown function']),
      m: (a, b, c) => {
        var d = new Ka(a);
        z[(d.Fb + 16) >> 2] = 0;
        z[(d.Fb + 4) >> 2] = b;
        z[(d.Fb + 8) >> 2] = c;
        La = a;
        Ma++;
        throw La;
      },
      hb: () => {},
      fb: () => {},
      gb: () => {},
      jb: function () {},
      kb: () => xa(''),
      L: (a) => {
        var b = Na[a];
        delete Na[a];
        var c = b.qc,
          d = b.Qb,
          e = b.yc,
          f = e.map((h) => h.Pc).concat(e.map((h) => h.Xc));
        E([a], f, (h) => {
          var g = {};
          e.forEach((l, m) => {
            var p = h[m],
              u = l.Nc,
              v = l.Oc,
              B = h[m + e.length],
              w = l.Wc,
              y = l.Yc;
            g[l.Kc] = {
              read: (J) => p.Hb(u(v, J)),
              write: (J, la) => {
                var F = [];
                w(y, J, B.Lb(F, la));
                Oa(F);
              },
              optional: h[m].optional,
            };
          });
          return [
            {
              name: b.name,
              Hb: (l) => {
                var m = {},
                  p;
                for (p in g) m[p] = g[p].read(l);
                d(l);
                return m;
              },
              Lb: (l, m) => {
                for (var p in g) if (!(p in m || g[p].optional)) throw new TypeError(`Missing field: "${p}"`);
                var u = c();
                for (p in g) g[p].write(u, m[p]);
                null !== l && l.push(d, u);
                return u;
              },
              Pb: Pa,
              Nb: d,
            },
          ];
        });
      },
      ma: (a, b, c, d, e) => {
        b = G(b);
        d = 0n === d;
        let f = (h) => h;
        if (d) {
          const h = 8 * c;
          f = (g) => BigInt.asUintN(h, g);
          e = f(e);
        }
        D(a, {
          name: b,
          Hb: f,
          Lb: (h, g) => {
            'number' == typeof g && (g = BigInt(g));
            return g;
          },
          Pb: Ua(b, c, !d),
          Nb: null,
        });
      },
      qb: (a, b, c, d) => {
        b = G(b);
        D(a, {
          name: b,
          Hb: function (e) {
            return !!e;
          },
          Lb: function (e, f) {
            return f ? c : d;
          },
          Pb: function (e) {
            return this.Hb(r[e]);
          },
          Nb: null,
        });
      },
      q: (a, b, c, d, e, f, h, g, l, m, p, u, v) => {
        p = G(p);
        f = K(e, f);
        g && (g = K(h, g));
        m && (m = K(l, m));
        v = K(u, v);
        var B = fb(p);
        eb(B, function () {
          wb(`Cannot construct ${p} due to unbound types`, [d]);
        });
        E([a, b, c], d ? [d] : [], (w) => {
          w = w[0];
          if (d) {
            var y = w.Gb;
            var J = y.Vb;
          } else J = ab.prototype;
          w = bb(p, function () {
            if (Object.getPrototypeOf(this) !== la) throw new H(`Use 'new' to construct ${p}`);
            if (void 0 === F.Tb) throw new H(`${p} has no accessible constructor`);
            for (var _len3 = arguments.length, $a = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              $a[_key3] = arguments[_key3];
            }
            var Pb = F.Tb[$a.length];
            if (void 0 === Pb)
              throw new H(
                `Tried to invoke ctor of ${p} with invalid number of parameters (${
                  $a.length
                }) - expected (${Object.keys(F.Tb).toString()}) parameters instead!`,
              );
            return Pb.apply(this, $a);
          });
          var la = Object.create(J, { constructor: { value: w } });
          w.prototype = la;
          var F = new gb(p, w, la, v, y, f, g, m);
          if (F.Mb) {
            var _ma$tc;
            var ma;
            (_ma$tc = (ma = F.Mb).tc) !== null && _ma$tc !== void 0 ? _ma$tc : (ma.tc = []);
            F.Mb.tc.push(F);
          }
          y = new rb(p, F, !0, !1, !1);
          ma = new rb(p + '*', F, !1, !1, !1);
          J = new rb(p + ' const*', F, !1, !0, !1);
          cb[a] = { pointerType: ma, Gc: J };
          sb(B, w);
          return [y, ma, J];
        });
      },
      z: (a, b, c, d, e, f) => {
        var h = xb(b, c);
        e = K(d, e);
        E([], [a], (g) => {
          g = g[0];
          var l = `constructor ${g.name}`;
          void 0 === g.Gb.Tb && (g.Gb.Tb = []);
          if (void 0 !== g.Gb.Tb[b - 1])
            throw new H(
              `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                g.name
              }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
            );
          g.Gb.Tb[b - 1] = () => {
            wb(`Cannot construct ${g.name} due to unbound types`, h);
          };
          E([], h, (m) => {
            m.splice(1, 0, null);
            g.Gb.Tb[b - 1] = zb(l, m, null, e, f);
            return [];
          });
          return [];
        });
      },
      d: (a, b, c, d, e, f, h, g) => {
        var l = xb(c, d);
        b = G(b);
        b = Ab(b);
        f = K(e, f);
        E([], [a], (m) => {
          function p() {
            wb(`Cannot call ${u} due to unbound types`, l);
          }
          m = m[0];
          var u = `${m.name}.${b}`;
          b.startsWith('@@') && (b = Symbol[b.substring(2)]);
          g && m.Gb.Uc.push(b);
          var v = m.Gb.Vb,
            B = v[b];
          void 0 === B || (void 0 === B.Jb && B.className !== m.name && B.Yb === c - 2)
            ? ((p.Yb = c - 2), (p.className = m.name), (v[b] = p))
            : (db(v, b, u), (v[b].Jb[c - 2] = p));
          E([], l, (w) => {
            w = zb(u, w, m, f, h);
            void 0 === v[b].Jb ? ((w.Yb = c - 2), (v[b] = w)) : (v[b].Jb[c - 2] = w);
            return [];
          });
          return [];
        });
      },
      ob: (a) => D(a, Db),
      Q: (a, b, c, d) => {
        function e() {}
        b = G(b);
        e.values = {};
        D(a, {
          name: b,
          constructor: e,
          Hb: function (f) {
            return this.constructor.values[f];
          },
          Lb: (f, h) => h.value,
          Pb: Eb(b, c, d),
          Nb: null,
        });
        eb(b, e);
      },
      j: (a, b, c) => {
        var d = Fb(a, 'enum');
        b = G(b);
        a = d.constructor;
        d = Object.create(d.constructor.prototype, {
          value: { value: c },
          constructor: { value: bb(`${d.name}_${b}`, function () {}) },
        });
        a.values[c] = d;
        a[b] = d;
      },
      la: (a, b, c) => {
        b = G(b);
        D(a, { name: b, Hb: (d) => d, Lb: (d, e) => e, Pb: Gb(b, c), Nb: null });
      },
      w: (a, b, c, d, e, f) => {
        var h = xb(b, c);
        a = G(a);
        a = Ab(a);
        e = K(d, e);
        eb(
          a,
          function () {
            wb(`Cannot call ${a} due to unbound types`, h);
          },
          b - 1,
        );
        E([], h, (g) => {
          g = [g[0], null].concat(g.slice(1));
          sb(a, zb(a, g, null, e, f), b - 1);
          return [];
        });
      },
      y: (a, b, c, d, e) => {
        b = G(b);
        let f = (g) => g;
        if (0 === d) {
          var h = 32 - 8 * c;
          f = (g) => (g << h) >>> h;
          e = f(e);
        }
        D(a, { name: b, Hb: f, Lb: (g, l) => l, Pb: Ua(b, c, 0 !== d), Nb: null });
      },
      h: (a, b, c) => {
        function d(f) {
          return new e(q.buffer, z[(f + 4) >> 2], z[f >> 2]);
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
        ][b];
        c = G(c);
        D(a, { name: c, Hb: d, Pb: d }, { Qc: !0 });
      },
      x: (a) => {
        D(a, Hb);
      },
      K: (a, b, c, d, e, f, h, g, l, m, p, u) => {
        c = G(c);
        f = K(e, f);
        g = K(h, g);
        m = K(l, m);
        u = K(p, u);
        E([a], [b], (v) => {
          v = v[0];
          return [new rb(c, v.Gb, !1, !1, !0, v, d, f, g, m, u)];
        });
      },
      pb: (a, b) => {
        b = G(b);
        D(a, {
          name: b,
          Hb(c) {
            var d = A(c + 4, z[c >> 2], !0);
            L(c);
            return d;
          },
          Lb(c, d) {
            d instanceof ArrayBuffer && (d = new Uint8Array(d));
            var e = 'string' == typeof d;
            if (!(e || (ArrayBuffer.isView(d) && 1 == d.BYTES_PER_ELEMENT)))
              throw new H('Cannot pass non-string to std::string');
            var f = e ? Ib(d) : d.length;
            var h = Jc(4 + f + 1),
              g = h + 4;
            z[h >> 2] = f;
            e ? O(d, g, f + 1) : r.set(d, g);
            null !== c && c.push(L, h);
            return h;
          },
          Pb: Pa,
          Nb(c) {
            L(c);
          },
        });
      },
      R: (a, b, c) => {
        c = G(c);
        if (2 === b) {
          var d = Kb;
          var e = Lb;
          var f = Mb;
        } else (d = Nb), (e = Ob), (f = Qb);
        D(a, {
          name: c,
          Hb: (h) => {
            var g = d(h + 4, z[h >> 2] * b, !0);
            L(h);
            return g;
          },
          Lb: (h, g) => {
            if ('string' != typeof g) throw new H(`Cannot pass non-string to C++ string type ${c}`);
            var l = f(g),
              m = Jc(4 + l + b);
            z[m >> 2] = l / b;
            e(g, m + 4, l + b);
            null !== h && h.push(L, m);
            return m;
          },
          Pb: Pa,
          Nb(h) {
            L(h);
          },
        });
      },
      M: (a, b, c, d, e, f) => {
        Na[a] = { name: G(b), qc: K(c, d), Qb: K(e, f), yc: [] };
      },
      n: (a, b, c, d, e, f, h, g, l, m) => {
        Na[a].yc.push({ Kc: G(b), Pc: c, Nc: K(d, e), Oc: f, Xc: h, Wc: K(g, l), Yc: m });
      },
      rb: (a, b) => {
        b = G(b);
        D(a, { Sc: !0, name: b, Hb: () => {}, Lb: () => {} });
      },
      cb: () => {
        Ha = !1;
        Rb = 0;
      },
      ab: () => {
        throw Infinity;
      },
      l: (a, b, c) => {
        var [d, ...e] = Ub(a, b),
          f = d.Lb.bind(d),
          h = e.map((l) => l.Pb.bind(l));
        a--;
        var g = Array(a);
        b = `methodCaller<(${e.map((l) => l.name)}) => ${d.name}>`;
        return Tb(
          bb(b, (l, m, p, u) => {
            for (var v = 0, B = 0; B < a; ++B) (g[B] = h[B](u + v)), (v += 8);
            switch (c) {
              case 0:
                var w = N(l).apply(null, g);
                break;
              case 2:
                w = Reflect.construct(N(l), g);
                break;
              case 3:
                w = g[0];
                break;
              case 1:
                w = y;
                u = Vb[m];
                m = w[void 0 === u ? G(m) : u];
                var y;
                N(l);
                w = m.call(w, ...g);
            }
            l = [];
            m = f(l, w);
            l.length && (z[p >> 2] = lb(l));
            return m;
          }),
        );
      },
      sa: Cb,
      sb: (a, b) => {
        a = N(a);
        b = N(b);
        return a == b;
      },
      T: (a) => {
        9 < a && (M[a + 1] += 1);
      },
      k: (a, b, c, d, e) => Sb[a](b, c, d, e),
      Za: (a) => {
        var b = N(a);
        Oa(b);
        Cb(a);
      },
      _a: (a, b) => {
        Wb[a] && (clearTimeout(Wb[a].id), delete Wb[a]);
        if (!b) return 0;
        var c = setTimeout(() => {
          delete Wb[a];
          Zb(() => Kc(a, performance.now()));
        }, b);
        Wb[a] = { id: c, kd: b };
        return 0;
      },
      $a: (a, b, c, d) => {
        var e = new Date().getFullYear(),
          f = new Date(e, 0, 1).getTimezoneOffset();
        e = new Date(e, 6, 1).getTimezoneOffset();
        z[a >> 2] = 60 * Math.max(f, e);
        x[b >> 2] = Number(f != e);
        b = (h) => {
          var g = Math.abs(h);
          return `UTC${0 <= h ? '-' : '+'}${String(Math.floor(g / 60)).padStart(2, '0')}${String(g % 60).padStart(
            2,
            '0',
          )}`;
        };
        a = b(f);
        b = b(e);
        e < f ? (O(a, c, 17), O(b, d, 17)) : (O(a, d, 17), O(b, c, 17));
      },
      Xa: () => performance.now(),
      Ya: (a) => !T[a] || T[a].Sb.isContextLost(),
      bb: (a) => {
        var b = r.length;
        a >>>= 0;
        if (2147483648 < a) return !1;
        for (var c = 1; 4 >= c; c *= 2) {
          var d = b * (1 + 0.2 / c);
          d = Math.min(d, a + 100663296);
          a: {
            d =
              ((Math.min(2147483648, 65536 * Math.ceil(Math.max(a, d) / 65536)) - pa.buffer.byteLength + 65535) /
                65536) |
              0;
            try {
              pa.grow(d);
              wa();
              var e = 1;
              break a;
            } catch (f) {}
            e = void 0;
          }
          if (e) return !0;
        }
        return !1;
      },
      tb: (a, b) => {
        var c = b >> 2;
        b = {
          alpha: !!q[b + 0],
          depth: !!q[b + 1],
          stencil: !!q[b + 2],
          antialias: !!q[b + 3],
          premultipliedAlpha: !!q[b + 4],
          preserveDrawingBuffer: !!q[b + 5],
          powerPreference: rc[x[c + 2]],
          failIfMajorPerformanceCaveat: !!q[b + 12],
          zc: x[c + 4],
          dd: x[c + 5],
          xc: q[b + 24],
          Jc: q[b + 25],
          gd: x[c + 7],
          jd: q[b + 32],
        };
        a = 2 < a ? A(a) : a;
        a = sc[a] || ('undefined' != typeof document ? document.querySelector(a) : null);
        return !a || b.Jc ? 0 : pc(a, b);
      },
      Wa: (a) => {
        var _T$a;
        V == a && (V = 0);
        V === T[a] && (V = null);
        'object' == typeof JSEvents && JSEvents.hd(T[a].Sb.canvas);
        ((_T$a = T[a]) === null || _T$a === void 0 ? void 0 : _T$a.Sb.canvas) && (T[a].Sb.canvas.Fc = void 0);
        T[a] = null;
      },
      Ua: () => (V ? V.handle : 0),
      na: (a) => {
        var _V;
        V = T[a];
        k.ctx = P = (_V = V) === null || _V === void 0 ? void 0 : _V.Sb;
        return !a || P ? 0 : -5;
      },
      mb: (a, b) => {
        var c = 0,
          d = 0,
          e;
        for (e of vc()) {
          var f = b + c;
          z[(a + d) >> 2] = f;
          c += O(e, f, Infinity) + 1;
          d += 4;
        }
        return 0;
      },
      nb: (a, b) => {
        var c = vc();
        z[a >> 2] = c.length;
        a = 0;
        for (var d of c) a += Ib(d) + 1;
        z[b >> 2] = a;
        return 0;
      },
      ka: () => 52,
      ib: () => 52,
      db: function () {
        return 70;
      },
      ja: (a, b, c, d) => {
        for (var e = 0, f = 0; f < c; f++) {
          var h = z[b >> 2],
            g = z[(b + 4) >> 2];
          b += 8;
          for (var l = 0; l < g; l++) {
            var m = a,
              p = r[h + l],
              u = wc[m];
            if (0 === p || 10 === p) {
              m = 1 === m ? ha : n;
              p = u;
              var v = Ja(p, 0);
              p = Ia.decode(p.buffer ? p.subarray(0, v) : new Uint8Array(p.slice(0, v)));
              m(p);
              u.length = 0;
            } else u.push(p);
          }
          e += g;
        }
        z[d >> 2] = e;
        return 0;
      },
      xa: (a) => P.activeTexture(a),
      Y: (a, b) => {
        P.attachShader(R[a], S[b]);
      },
      E: (a, b) => {
        if (b && !Q[b]) {
          var c = P.createBuffer();
          c.name = b;
          Q[b] = c;
        }
        34962 == a ? (P.fc = b) : 34963 == a && (P.Zb = b);
        35051 == a ? (P.uc = b) : 35052 == a && (P.nc = b);
        P.bindBuffer(a, Q[b]);
      },
      va: (a, b, c, d, e) => {
        P.bindBufferRange(a, b, Q[c], d, e);
      },
      f: (a, b) => {
        P.bindFramebuffer(a, ec[b]);
      },
      P: (a, b) => {
        P.bindRenderbuffer(a, fc[b]);
      },
      G: (a, b) => {
        P.bindTexture(a, gc[b]);
      },
      _: (a) => {
        P.bindVertexArray(hc[a]);
        a = P.getParameter(34965);
        P.Zb = a ? a.name | 0 : 0;
      },
      N: (a) => P.blendEquation(a),
      s: (a, b) => P.blendFunc(a, b),
      u: (a, b, c, d, e, f, h, g, l, m) => P.blitFramebuffer(a, b, c, d, e, f, h, g, l, m),
      $: (a, b, c, d) => {
        2 <= V.version
          ? c && b
            ? P.bufferData(a, r, d, c, b)
            : P.bufferData(a, b, d)
          : P.bufferData(a, c ? r.subarray(c, c + b) : b, d);
      },
      U: (a) => P.clear(a),
      V: (a, b, c, d) => P.clearColor(a, b, c, d),
      qa: (a) => P.clearDepth(a),
      ra: (a) => P.clearStencil(a),
      B: (a, b, c, d) => {
        P.colorMask(!!a, !!b, !!c, !!d);
      },
      Ja: (a) => {
        P.compileShader(S[a]);
      },
      Ha: () => {
        var a = jc(R),
          b = P.createProgram();
        b.name = a;
        b.lc = b.jc = b.kc = 0;
        b.rc = 1;
        R[a] = b;
        return a;
      },
      La: (a) => {
        var b = jc(S);
        S[b] = P.createShader(a);
        return b;
      },
      Ta: (a) => P.cullFace(a),
      Pa: (a, b) => {
        for (var c = 0; c < a; c++) {
          var d = x[(b + 4 * c) >> 2],
            e = Q[d];
          e &&
            (P.deleteBuffer(e),
            (e.name = 0),
            (Q[d] = null),
            d == P.fc && (P.fc = 0),
            d == P.Zb && (P.Zb = 0),
            d == P.uc && (P.uc = 0),
            d == P.nc && (P.nc = 0));
        }
      },
      ha: (a, b) => {
        for (var c = 0; c < a; ++c) {
          var d = x[(b + 4 * c) >> 2],
            e = ec[d];
          e && (P.deleteFramebuffer(e), (e.name = 0), (ec[d] = null));
        }
      },
      W: (a) => {
        if (a) {
          var b = R[a];
          b ? (P.deleteProgram(b), (b.name = 0), (R[a] = null)) : U || (U = 1281);
        }
      },
      ga: (a, b) => {
        for (var c = 0; c < a; c++) {
          var d = x[(b + 4 * c) >> 2],
            e = fc[d];
          e && (P.deleteRenderbuffer(e), (e.name = 0), (fc[d] = null));
        }
      },
      O: (a) => {
        if (a) {
          var b = S[a];
          b ? (P.deleteShader(b), (S[a] = null)) : U || (U = 1281);
        }
      },
      ia: (a, b) => {
        for (var c = 0; c < a; c++) {
          var d = x[(b + 4 * c) >> 2],
            e = gc[d];
          e && (P.deleteTexture(e), (e.name = 0), (gc[d] = null));
        }
      },
      Na: (a, b) => {
        for (var c = 0; c < a; c++) {
          var d = x[(b + 4 * c) >> 2];
          P.deleteVertexArray(hc[d]);
          hc[d] = null;
        }
      },
      Ra: (a) => P.depthFunc(a),
      H: (a) => {
        P.depthMask(!!a);
      },
      v: (a) => P.disable(a),
      ya: (a) => {
        V.Ub[a].enabled = !1;
        P.disableVertexAttribArray(a);
      },
      za: (a, b, c, d) => {
        var e = 0;
        if (!P.Zb) {
          var f = 1 * ic[c - 5120] * b;
          var h = lc(f);
          P.bindBuffer(34963, h);
          P.bufferSubData(34963, 0, r.subarray(d, d + f));
          if (0 < b)
            for (h = 0; h < V.pc; ++h)
              if (((f = V.Ub[h]), f.ec && f.enabled)) {
                switch (c) {
                  case 5121:
                    e = Uint8Array;
                    break;
                  case 5123:
                    e = Uint16Array;
                    break;
                  case 5125:
                    e = Uint32Array;
                    break;
                  default:
                    U || (U = 1282);
                    return;
                }
                e = new e(r.buffer, d, b).reduce((g, l) => Math.max(g, l)) + 1;
                break;
              }
          d = 0;
        }
        nc(e);
        P.drawElements(a, b, c, d);
        mc && P.bindBuffer(34962, Q[P.fc]);
        P.Zb || P.bindBuffer(34963, null);
      },
      r: (a) => P.enable(a),
      ua: (a) => {
        V.Ub[a].enabled = !0;
        P.enableVertexAttribArray(a);
      },
      ca: (a, b, c, d) => {
        P.framebufferRenderbuffer(a, b, c, fc[d]);
      },
      Va: (a, b, c, d, e) => {
        P.framebufferTexture2D(a, b, c, gc[d], e);
      },
      Sa: (a) => P.frontFace(a),
      Qa: (a, b) => {
        kc(a, b, 'createBuffer', Q);
      },
      fa: (a, b) => {
        kc(a, b, 'createFramebuffer', ec);
      },
      ea: (a, b) => {
        kc(a, b, 'createRenderbuffer', fc);
      },
      ba: (a, b) => {
        kc(a, b, 'createTexture', gc);
      },
      Oa: (a, b) => {
        kc(a, b, 'createVertexArray', hc);
      },
      Ma: (a, b) => yc(a, b),
      Fa: (a, b, c, d) => {
        a = P.getProgramInfoLog(R[a]);
        null === a && (a = '(unknown error)');
        b = 0 < b && d ? O(a, d, b) : 0;
        c && (x[c >> 2] = b);
      },
      X: (a, b, c) => {
        if (c) {
          if (a >= dc) U || (U = 1281);
          else if (((a = R[a]), 35716 == b))
            (a = P.getProgramInfoLog(a)), null === a && (a = '(unknown error)'), (x[c >> 2] = a.length + 1);
          else if (35719 == b) {
            if (!a.lc) {
              var d = P.getProgramParameter(a, 35718);
              for (b = 0; b < d; ++b) a.lc = Math.max(a.lc, P.getActiveUniform(a, b).name.length + 1);
            }
            x[c >> 2] = a.lc;
          } else if (35722 == b) {
            if (!a.jc)
              for (d = P.getProgramParameter(a, 35721), b = 0; b < d; ++b)
                a.jc = Math.max(a.jc, P.getActiveAttrib(a, b).name.length + 1);
            x[c >> 2] = a.jc;
          } else if (35381 == b) {
            if (!a.kc)
              for (d = P.getProgramParameter(a, 35382), b = 0; b < d; ++b)
                a.kc = Math.max(a.kc, P.getActiveUniformBlockName(a, b).length + 1);
            x[c >> 2] = a.kc;
          } else x[c >> 2] = P.getProgramParameter(a, b);
        } else U || (U = 1281);
      },
      Ia: (a, b, c, d) => {
        a = P.getShaderInfoLog(S[a]);
        null === a && (a = '(unknown error)');
        b = 0 < b && d ? O(a, d, b) : 0;
        c && (x[c >> 2] = b);
      },
      Z: (a, b, c) => {
        c
          ? 35716 == b
            ? ((a = P.getShaderInfoLog(S[a])),
              null === a && (a = '(unknown error)'),
              (x[c >> 2] = a ? a.length + 1 : 0))
            : 35720 == b
            ? ((a = P.getShaderSource(S[a])), (x[c >> 2] = a ? a.length + 1 : 0))
            : (x[c >> 2] = P.getShaderParameter(S[a], b))
          : U || (U = 1281);
      },
      Ca: (a, b) => P.getUniformBlockIndex(R[a], A(b)),
      Da: (a, b) => {
        b = A(b);
        if ((a = R[a])) {
          var c = a,
            d = c.cc,
            e = c.Dc,
            f;
          if (!d) {
            c.cc = d = {};
            c.Cc = {};
            var h = P.getProgramParameter(c, 35718);
            for (f = 0; f < h; ++f) {
              var g = P.getActiveUniform(c, f);
              var l = g.name;
              g = g.size;
              var m = zc(l);
              m = 0 < m ? l.slice(0, m) : l;
              var p = c.rc;
              c.rc += g;
              e[m] = [g, p];
              for (l = 0; l < g; ++l) (d[p] = l), (c.Cc[p++] = m);
            }
          }
          c = a.cc;
          d = 0;
          e = b;
          f = zc(b);
          0 < f && ((d = parseInt(b.slice(f + 1)) >>> 0), (e = b.slice(0, f)));
          if ((e = a.Dc[e]) && d < e[0] && ((d += e[1]), (c[d] = c[d] || P.getUniformLocation(a, b)))) return d;
        } else U || (U = 1281);
        return -1;
      },
      pa: (a, b, c) => {
        for (var d = Ac[b], e = 0; e < b; e++) d[e] = x[(c + 4 * e) >> 2];
        P.invalidateFramebuffer(a, d);
      },
      Ga: (a) => {
        a = R[a];
        P.linkProgram(a);
        a.cc = 0;
        a.Dc = {};
      },
      da: (a, b, c, d, e) => P.renderbufferStorageMultisample(a, b, c, d, e),
      o: (a, b, c, d) => P.scissor(a, b, c, d),
      Ka: (a, b, c, d) => {
        for (var e = '', f = 0; f < b; ++f) e += A(z[(c + 4 * f) >> 2], d ? z[(d + 4 * f) >> 2] : void 0);
        P.shaderSource(S[a], e);
      },
      J: (a, b, c) => P.stencilFunc(a, b, c),
      D: (a, b, c, d) => P.stencilFuncSeparate(a, b, c, d),
      I: (a, b, c) => P.stencilOp(a, b, c),
      C: (a, b, c, d) => P.stencilOpSeparate(a, b, c, d),
      aa: (a, b, c, d, e, f, h, g, l) => {
        if (2 <= V.version) {
          if (P.nc) {
            P.texImage2D(a, b, c, d, e, f, h, g, l);
            return;
          }
          if (l) {
            var m = Bc(g);
            l >>>= 31 - Math.clz32(m.BYTES_PER_ELEMENT);
            P.texImage2D(a, b, c, d, e, f, h, g, m, l);
            return;
          }
        }
        if (l) {
          m = Bc(g);
          var p =
            e *
            ((d *
              ({ 5: 3, 6: 4, 8: 2, 29502: 3, 29504: 4, 26917: 2, 26918: 2, 29846: 3, 29847: 4 }[h - 6402] || 1) *
              m.BYTES_PER_ELEMENT +
              4 -
              1) &
              -4);
          l = m.subarray(
            l >>> (31 - Math.clz32(m.BYTES_PER_ELEMENT)),
            (l + p) >>> (31 - Math.clz32(m.BYTES_PER_ELEMENT)),
          );
        } else l = null;
        P.texImage2D(a, b, c, d, e, f, h, g, l);
      },
      A: (a, b, c) => P.texParameteri(a, b, c),
      Aa: (a, b) => {
        P.uniform1f(Cc(a), b);
      },
      Ba: (a, b, c) => {
        if (2 <= V.version) b && P.uniform1iv(Cc(a), x, c >> 2, b);
        else {
          if (288 >= b) for (var d = Dc[b], e = 0; e < b; ++e) d[e] = x[(c + 4 * e) >> 2];
          else d = x.subarray(c >> 2, (c + 4 * b) >> 2);
          P.uniform1iv(Cc(a), d);
        }
      },
      wa: (a, b, c) => {
        a = R[a];
        P.uniformBlockBinding(a, b, c);
      },
      Ea: (a) => {
        a = R[a];
        P.useProgram(a);
        P.Hc = a;
      },
      ta: (a, b, c, d, e, f) => {
        var h = V.Ub[a];
        P.fc
          ? ((h.ec = !1), P.vertexAttribPointer(a, b, c, !!d, e, f))
          : ((h.size = b),
            (h.type = c),
            (h.Ac = d),
            (h.stride = e),
            (h.Fb = f),
            (h.ec = !0),
            (h.Ec = function (g, l, m, p, u, v) {
              this.vertexAttribPointer(g, l, m, p, u, v);
            }));
      },
      p: (a, b, c, d) => P.viewport(a, b, c, d),
      t: Lc,
      g: Mc,
      e: Nc,
      S: Oc,
      oa: Pc,
      a: Qc,
      b: Rc,
      i: Sc,
      F: Tc,
      lb: Yb,
      eb: (a, b) => {
        Fc(r.subarray(a, a + b));
        return 0;
      },
    };
  function Lc(a, b) {
    var c = Y();
    try {
      return I.get(a)(b);
    } catch (d) {
      X(c);
      if (d !== d + 0) throw d;
      W(1, 0);
    }
  }
  function Oc(a, b, c, d, e, f) {
    var h = Y();
    try {
      return I.get(a)(b, c, d, e, f);
    } catch (g) {
      X(h);
      if (g !== g + 0) throw g;
      W(1, 0);
    }
  }
  function Qc(a, b) {
    var c = Y();
    try {
      I.get(a)(b);
    } catch (d) {
      X(c);
      if (d !== d + 0) throw d;
      W(1, 0);
    }
  }
  function Sc(a, b, c, d) {
    var e = Y();
    try {
      I.get(a)(b, c, d);
    } catch (f) {
      X(e);
      if (f !== f + 0) throw f;
      W(1, 0);
    }
  }
  function Mc(a, b, c) {
    var d = Y();
    try {
      return I.get(a)(b, c);
    } catch (e) {
      X(d);
      if (e !== e + 0) throw e;
      W(1, 0);
    }
  }
  function Rc(a, b, c) {
    var d = Y();
    try {
      I.get(a)(b, c);
    } catch (e) {
      X(d);
      if (e !== e + 0) throw e;
      W(1, 0);
    }
  }
  function Pc(a) {
    var b = Y();
    try {
      I.get(a)();
    } catch (c) {
      X(b);
      if (c !== c + 0) throw c;
      W(1, 0);
    }
  }
  function Nc(a, b, c, d) {
    var e = Y();
    try {
      return I.get(a)(b, c, d);
    } catch (f) {
      X(e);
      if (f !== f + 0) throw f;
      W(1, 0);
    }
  }
  function Tc(a, b, c, d, e) {
    var f = Y();
    try {
      I.get(a)(b, c, d, e);
    } catch (h) {
      X(f);
      if (h !== h + 0) throw h;
      W(1, 0);
    }
  }
  var Z;
  Z = await (async function () {
    function a(c) {
      Z = c.exports;
      pa = Z.ub;
      wa();
      I = Z.xb;
      c = Z;
      k._malloc = Jc = c.wb;
      k._free = L = c.yb;
      ub = c.zb;
      Kc = c.Ab;
      W = c.Bb;
      X = c.Cb;
      Y = c.Db;
      return Z;
    }
    var b = { a: Uc };
    if (k.instantiateWasm)
      return new Promise((c) => {
        k.instantiateWasm(b, (d, e) => {
          c(a(d, e));
        });
      });
    ya !== null && ya !== void 0
      ? ya
      : (ya = k.locateFile
          ? k.locateFile
            ? k.locateFile('DotLottiePlayer.wasm', da)
            : da + 'DotLottiePlayer.wasm'
          : new URL('DotLottiePlayer.wasm', import.meta.url).href);
    return a((await Ba(b)).instance);
  })();
  (function () {
    function a() {
      k.calledRun = !0;
      if (!ja) {
        var _na, _k$onRuntimeInitializ;
        va = !0;
        Z.vb();
        (_na = na) === null || _na === void 0 || _na(k);
        (_k$onRuntimeInitializ = k.onRuntimeInitialized) === null ||
          _k$onRuntimeInitializ === void 0 ||
          _k$onRuntimeInitializ.call(k);
        if (k.postRun)
          for ('function' == typeof k.postRun && (k.postRun = [k.postRun]); k.postRun.length; ) {
            var b = k.postRun.shift();
            Ea.push(b);
          }
        Da(Ea);
      }
    }
    if (k.preRun) for ('function' == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; ) Ga();
    Da(Fa);
    k.setStatus
      ? (k.setStatus('Running...'),
        setTimeout(() => {
          setTimeout(() => k.setStatus(''), 1);
          a();
        }, 1))
      : a();
  })();
  va
    ? (moduleRtn = k)
    : (moduleRtn = new Promise((a, b) => {
        na = a;
        oa = b;
      }));
  return moduleRtn;
}
export default createDotLottiePlayerModule;
