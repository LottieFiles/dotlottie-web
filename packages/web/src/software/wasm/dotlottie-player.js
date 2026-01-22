var createDotLottiePlayerModule = (() => {
  var _scriptName = typeof document != 'undefined' ? document.currentScript?.src : undefined;

  return function (moduleArg = {}) {
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
    var l = moduleArg;
    if ('undefined' === typeof globalThis.BigInt64Array) {
      function a(d) {
        return [Number(BigInt(d) & BigInt(4294967295)) | 0, Number(BigInt(d) >> 32n) | 0];
      }
      function b(d) {
        function c(e) {
          'number' === typeof e && (e = new Uint32Array(2 * e));
          if (!ArrayBuffer.isView(e))
            if (e.constructor && 'ArrayBuffer' === e.constructor.name) e = new Uint32Array(e);
            else {
              var f = e;
              e = new Uint32Array(2 * e.length);
            }
          var h = new Proxy(
            {
              slice(g, k) {
                var _k;
                (_k = k) !== null && _k !== void 0 ? _k : (k = e.length);
                g = e.slice(2 * g, 2 * k);
                return c(g);
              },
              subarray(g, k) {
                g = e.subarray(2 * g, 2 * k);
                return c(g);
              },
              [Symbol.iterator]: function* () {
                for (var g = 0; g < e.length / 2; g++) yield d(e[2 * g], e[2 * g + 1]);
              },
              BYTES_PER_ELEMENT: 2 * e.BYTES_PER_ELEMENT,
              buffer: e.buffer,
              byteLength: e.byteLength,
              byteOffset: e.byteOffset,
              length: e.length / 2,
              copyWithin: function (g, k, m) {
                e.copyWithin(2 * g, 2 * k, 2 * m);
                return h;
              },
              set(g, k) {
                var _k2;
                (_k2 = k) !== null && _k2 !== void 0 ? _k2 : (k = 0);
                if (2 * (g.length + k) > e.length) throw new RangeError('offset is out of bounds');
                for (var m = 0; m < g.length; m++) {
                  var n = a(g[m]);
                  e.set(n, 2 * (k + m));
                }
              },
            },
            {
              get(g, k, m) {
                return 'string' === typeof k && /^\d+$/.test(k) ? d(e[2 * k], e[2 * k + 1]) : Reflect.get(g, k, m);
              },
              set(g, k, m, n) {
                if ('string' !== typeof k || !/^\d+$/.test(k)) return Reflect.set(g, k, m, n);
                if ('bigint' !== typeof m) throw new TypeError(`Cannot convert ${m} to a BigInt`);
                g = a(m);
                e.set(g, 2 * k);
                return !0;
              },
            },
          );
          f && h.set(f);
          return h;
        }
        return c;
      }
      globalThis.BigUint64Array = b(function (d, c) {
        return BigInt(d) | (BigInt(c) << 32n);
      });
      globalThis.BigInt64Array = b(function (d, c) {
        return BigInt(d) | (BigInt(c + 2 * (c & 2147483648)) << 32n);
      });
    }
    var aa,
      ba,
      ca = new Promise((a, b) => {
        aa = a;
        ba = b;
      }),
      fa = 'object' == typeof window,
      ha = 'undefined' != typeof WorkerGlobalScope,
      ia = Object.assign({}, l),
      ja = './this.program',
      p = '',
      ka,
      la;
    if (fa || ha)
      ha
        ? (p = self.location.href)
        : 'undefined' != typeof document && document.currentScript && (p = document.currentScript.src),
        _scriptName && (p = _scriptName),
        p.startsWith('blob:') ? (p = '') : (p = p.substr(0, p.replace(/[?#].*/, '').lastIndexOf('/') + 1)),
        ha &&
          (la = (a) => {
            var b = new XMLHttpRequest();
            b.open('GET', a, !1);
            b.responseType = 'arraybuffer';
            b.send(null);
            return new Uint8Array(b.response);
          }),
        (ka = async (a) => {
          a = await fetch(a, { credentials: 'same-origin' });
          if (a.ok) return a.arrayBuffer();
          throw Error(a.status + ' : ' + a.url);
        });
    var t = l.printErr || console.error.bind(console);
    Object.assign(l, ia);
    ia = null;
    l.thisProgram && (ja = l.thisProgram);
    var ma = l.wasmBinary,
      na,
      oa = !1,
      pa,
      w,
      x,
      y,
      B,
      C,
      D,
      qa,
      ra,
      sa,
      ta;
    function ua() {
      var a = na.buffer;
      l.HEAP8 = w = new Int8Array(a);
      l.HEAP16 = y = new Int16Array(a);
      l.HEAPU8 = x = new Uint8Array(a);
      l.HEAPU16 = B = new Uint16Array(a);
      l.HEAP32 = C = new Int32Array(a);
      l.HEAPU32 = D = new Uint32Array(a);
      l.HEAPF32 = qa = new Float32Array(a);
      l.HEAPF64 = ta = new Float64Array(a);
      l.HEAP64 = ra = new BigInt64Array(a);
      l.HEAPU64 = sa = new BigUint64Array(a);
    }
    var va = [],
      wa = [],
      xa = [];
    function ya() {
      var a = l.preRun.shift();
      va.unshift(a);
    }
    var F = 0,
      G = null;
    function za(a) {
      var _l$onAbort;
      (_l$onAbort = l.onAbort) === null || _l$onAbort === void 0 || _l$onAbort.call(l, a);
      a = 'Aborted(' + a + ')';
      t(a);
      oa = !0;
      a = new WebAssembly.RuntimeError(a + '. Build with -sASSERTIONS for more info.');
      ba(a);
      throw a;
    }
    var Aa = (a) => a.startsWith('data:application/octet-stream;base64,'),
      Ba;
    async function Ca(a) {
      if (!ma)
        try {
          var b = await ka(a);
          return new Uint8Array(b);
        } catch {}
      if (a == Ba && ma) a = new Uint8Array(ma);
      else if (la) a = la(a);
      else throw 'both async and sync fetching of the wasm failed';
      return a;
    }
    async function Da(a, b) {
      try {
        var d = await Ca(a);
        return await WebAssembly.instantiate(d, b);
      } catch (c) {
        t(`failed to asynchronously prepare wasm: ${c}`), za(c);
      }
    }
    async function Ea(a) {
      var b = Ba;
      if (!ma && 'function' == typeof WebAssembly.instantiateStreaming && !Aa(b) && 'function' == typeof fetch)
        try {
          var d = fetch(b, { credentials: 'same-origin' });
          return await WebAssembly.instantiateStreaming(d, a);
        } catch (c) {
          t(`wasm streaming compile failed: ${c}`), t('falling back to ArrayBuffer instantiation');
        }
      return Da(b, a);
    }
    class Fa {
      constructor(a) {
        _defineProperty(this, 'name', 'ExitStatus');
        this.message = `Program terminated with exit(${a})`;
        this.status = a;
      }
    }
    var Ga = (a) => {
        for (; 0 < a.length; ) a.shift()(l);
      },
      Ha = l.noExitRuntime || !0,
      Ia = 'undefined' != typeof TextDecoder ? new TextDecoder() : void 0,
      Ja = function () {
        let a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        let b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NaN;
        var d = x,
          c = a + b;
        for (b = a; d[b] && !(b >= c); ) ++b;
        if (16 < b - a && d.buffer && Ia) return Ia.decode(d.subarray(a, b));
        for (c = ''; a < b; ) {
          var e = d[a++];
          if (e & 128) {
            var f = d[a++] & 63;
            if (192 == (e & 224)) c += String.fromCharCode(((e & 31) << 6) | f);
            else {
              var h = d[a++] & 63;
              e =
                224 == (e & 240)
                  ? ((e & 15) << 12) | (f << 6) | h
                  : ((e & 7) << 18) | (f << 12) | (h << 6) | (d[a++] & 63);
              65536 > e
                ? (c += String.fromCharCode(e))
                : ((e -= 65536), (c += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))));
            }
          } else c += String.fromCharCode(e);
        }
        return c;
      };
    class Ka {
      constructor(a) {
        this.pa = a - 24;
      }
    }
    var La = 0,
      Ma = 0,
      H = (a, b, d) => {
        var c = x;
        if (0 < d) {
          d = b + d - 1;
          for (var e = 0; e < a.length; ++e) {
            var f = a.charCodeAt(e);
            if (55296 <= f && 57343 >= f) {
              var h = a.charCodeAt(++e);
              f = (65536 + ((f & 1023) << 10)) | (h & 1023);
            }
            if (127 >= f) {
              if (b >= d) break;
              c[b++] = f;
            } else {
              if (2047 >= f) {
                if (b + 1 >= d) break;
                c[b++] = 192 | (f >> 6);
              } else {
                if (65535 >= f) {
                  if (b + 2 >= d) break;
                  c[b++] = 224 | (f >> 12);
                } else {
                  if (b + 3 >= d) break;
                  c[b++] = 240 | (f >> 18);
                  c[b++] = 128 | ((f >> 12) & 63);
                }
                c[b++] = 128 | ((f >> 6) & 63);
              }
              c[b++] = 128 | (f & 63);
            }
          }
          c[b] = 0;
        }
      },
      Na = {},
      Oa = (a) => {
        for (; a.length; ) {
          var b = a.pop();
          a.pop()(b);
        }
      };
    function I(a) {
      return this.fromWireType(D[a >> 2]);
    }
    var J = {},
      K = {},
      Qa = {},
      L,
      N = (a, b, d) => {
        function c(g) {
          g = d(g);
          if (g.length !== a.length) throw new L('Mismatched type converter count');
          for (var k = 0; k < a.length; ++k) M(a[k], g[k]);
        }
        a.forEach((g) => (Qa[g] = b));
        var e = Array(b.length),
          f = [],
          h = 0;
        b.forEach((g, k) => {
          K.hasOwnProperty(g)
            ? (e[k] = K[g])
            : (f.push(g),
              J.hasOwnProperty(g) || (J[g] = []),
              J[g].push(() => {
                e[k] = K[g];
                ++h;
                h === f.length && c(e);
              }));
        });
        0 === f.length && c(e);
      },
      Ra = (a) => {
        if (null === a) return 'null';
        var b = typeof a;
        return 'object' === b || 'array' === b || 'function' === b ? a.toString() : '' + a;
      },
      Sa,
      O = (a) => {
        for (var b = ''; x[a]; ) b += Sa[x[a++]];
        return b;
      },
      P;
    function Ta(a, b) {
      let d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var c = b.name;
      if (!a) throw new P(`type "${c}" must have a positive integer typeid pointer`);
      if (K.hasOwnProperty(a)) {
        if (d.Ua) return;
        throw new P(`Cannot register type '${c}' twice`);
      }
      K[a] = b;
      delete Qa[a];
      J.hasOwnProperty(a) && ((b = J[a]), delete J[a], b.forEach((e) => e()));
    }
    function M(a, b) {
      let d = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return Ta(a, b, d);
    }
    var Ua = (a, b, d) => {
        switch (b) {
          case 1:
            return d ? (c) => w[c] : (c) => x[c];
          case 2:
            return d ? (c) => y[c >> 1] : (c) => B[c >> 1];
          case 4:
            return d ? (c) => C[c >> 2] : (c) => D[c >> 2];
          case 8:
            return d ? (c) => ra[c >> 3] : (c) => sa[c >> 3];
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Va = (a) => {
        throw new P(a.na.qa.oa.name + ' instance already deleted');
      },
      Wa = !1,
      Xa = () => {},
      Ya = (a, b, d) => {
        if (b === d) return a;
        if (void 0 === d.ta) return null;
        a = Ya(a, b, d.ta);
        return null === a ? null : d.Na(a);
      },
      Za = {},
      $a = {},
      ab = (a, b) => {
        if (void 0 === b) throw new P('ptr should not be undefined');
        for (; a.ta; ) (b = a.Da(b)), (a = a.ta);
        return $a[b];
      },
      bb = (a, b) => {
        if (!b.qa || !b.pa) throw new L('makeClassHandle requires ptr and ptrType');
        if (!!b.wa !== !!b.sa) throw new L('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return Q(Object.create(a, { na: { value: b, writable: !0 } }));
      },
      Q = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (Q = (b) => b), a;
        Wa = new FinalizationRegistry((b) => {
          b = b.na;
          --b.count.value;
          0 === b.count.value && (b.sa ? b.wa.xa(b.sa) : b.qa.oa.xa(b.pa));
        });
        Q = (b) => {
          var d = b.na;
          d.sa && Wa.register(b, { na: d }, b);
          return b;
        };
        Xa = (b) => {
          Wa.unregister(b);
        };
        return Q(a);
      },
      cb = [];
    function db() {}
    var eb = (a, b) => Object.defineProperty(b, 'name', { value: a }),
      fb = (a, b, d) => {
        if (void 0 === a[b].ra) {
          var c = a[b];
          a[b] = function () {
            for (var _len = arguments.length, e = new Array(_len), _key = 0; _key < _len; _key++) {
              e[_key] = arguments[_key];
            }
            if (!a[b].ra.hasOwnProperty(e.length))
              throw new P(
                `Function '${d}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].ra})!`,
              );
            return a[b].ra[e.length].apply(this, e);
          };
          a[b].ra = [];
          a[b].ra[c.Aa] = c;
        }
      },
      gb = (a, b, d) => {
        if (l.hasOwnProperty(a)) {
          if (void 0 === d || (void 0 !== l[a].ra && void 0 !== l[a].ra[d]))
            throw new P(`Cannot register public name '${a}' twice`);
          fb(l, a, a);
          if (l[a].ra.hasOwnProperty(d))
            throw new P(`Cannot register multiple overloads of a function with the same number of arguments (${d})!`);
          l[a].ra[d] = b;
        } else (l[a] = b), (l[a].Aa = d);
      },
      hb = (a) => {
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function ib(a, b, d, c, e, f, h, g) {
      this.name = a;
      this.constructor = b;
      this.za = d;
      this.xa = c;
      this.ta = e;
      this.Pa = f;
      this.Da = h;
      this.Na = g;
      this.Wa = [];
    }
    var jb = (a, b, d) => {
      for (; b !== d; ) {
        if (!b.Da) throw new P(`Expected null or instance of ${d.name}, got an instance of ${b.name}`);
        a = b.Da(a);
        b = b.ta;
      }
      return a;
    };
    function kb(a, b) {
      if (null === b) {
        if (this.Ga) throw new P(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.na) throw new P(`Cannot pass "${Ra(b)}" as a ${this.name}`);
      if (!b.na.pa) throw new P(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return jb(b.na.pa, b.na.qa.oa, this.oa);
    }
    function lb(a, b) {
      if (null === b) {
        if (this.Ga) throw new P(`null is not a valid ${this.name}`);
        if (this.Fa) {
          var d = this.Ha();
          null !== a && a.push(this.xa, d);
          return d;
        }
        return 0;
      }
      if (!b || !b.na) throw new P(`Cannot pass "${Ra(b)}" as a ${this.name}`);
      if (!b.na.pa) throw new P(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.Ea && b.na.qa.Ea)
        throw new P(
          `Cannot convert argument of type ${b.na.wa ? b.na.wa.name : b.na.qa.name} to parameter type ${this.name}`,
        );
      d = jb(b.na.pa, b.na.qa.oa, this.oa);
      if (this.Fa) {
        if (void 0 === b.na.sa) throw new P('Passing raw pointer to smart pointer is illegal');
        switch (this.ab) {
          case 0:
            if (b.na.wa === this) d = b.na.sa;
            else
              throw new P(
                `Cannot convert argument of type ${b.na.wa ? b.na.wa.name : b.na.qa.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            d = b.na.sa;
            break;
          case 2:
            if (b.na.wa === this) d = b.na.sa;
            else {
              var c = b.clone();
              d = this.Xa(
                d,
                mb(() => c['delete']()),
              );
              null !== a && a.push(this.xa, d);
            }
            break;
          default:
            throw new P('Unsupporting sharing policy');
        }
      }
      return d;
    }
    function nb(a, b) {
      if (null === b) {
        if (this.Ga) throw new P(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.na) throw new P(`Cannot pass "${Ra(b)}" as a ${this.name}`);
      if (!b.na.pa) throw new P(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.na.qa.Ea) throw new P(`Cannot convert argument of type ${b.na.qa.name} to parameter type ${this.name}`);
      return jb(b.na.pa, b.na.qa.oa, this.oa);
    }
    function ob(a, b, d, c, e, f, h, g, k, m, n) {
      this.name = a;
      this.oa = b;
      this.Ga = d;
      this.Ea = c;
      this.Fa = e;
      this.Va = f;
      this.ab = h;
      this.La = g;
      this.Ha = k;
      this.Xa = m;
      this.xa = n;
      e || void 0 !== b.ta ? (this.toWireType = lb) : ((this.toWireType = c ? kb : nb), (this.va = null));
    }
    var pb = (a, b, d) => {
        if (!l.hasOwnProperty(a)) throw new L('Replacing nonexistent public symbol');
        void 0 !== l[a].ra && void 0 !== d ? (l[a].ra[d] = b) : ((l[a] = b), (l[a].Aa = d));
      },
      R,
      S = (a, b) => {
        a = O(a);
        var d = R.get(b);
        if ('function' != typeof d) throw new P(`unknown function pointer with signature ${a}: ${b}`);
        return d;
      },
      qb,
      sb = (a) => {
        a = rb(a);
        var b = O(a);
        T(a);
        return b;
      },
      tb = (a, b) => {
        function d(f) {
          e[f] || K[f] || (Qa[f] ? Qa[f].forEach(d) : (c.push(f), (e[f] = !0)));
        }
        var c = [],
          e = {};
        b.forEach(d);
        throw new qb(`${a}: ` + c.map(sb).join([', ']));
      },
      ub = (a, b) => {
        for (var d = [], c = 0; c < a; c++) d.push(D[(b + 4 * c) >> 2]);
        return d;
      };
    function vb(a) {
      for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].va) return !0;
      return !1;
    }
    function wb(a, b, d, c, e) {
      var f = b.length;
      if (2 > f) throw new P("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var h = null !== b[1] && null !== d,
        g = vb(b),
        k = 'void' !== b[0].name,
        m = f - 2,
        n = Array(m),
        q = [],
        r = [];
      return eb(a, function () {
        for (var _len2 = arguments.length, z = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          z[_key2] = arguments[_key2];
        }
        r.length = 0;
        q.length = h ? 2 : 1;
        q[0] = e;
        if (h) {
          var u = b[1].toWireType(r, this);
          q[1] = u;
        }
        for (var v = 0; v < m; ++v) (n[v] = b[v + 2].toWireType(r, z[v])), q.push(n[v]);
        z = c(...q);
        if (g) Oa(r);
        else
          for (v = h ? 1 : 2; v < b.length; v++) {
            var E = 1 === v ? u : n[v - 2];
            null !== b[v].va && b[v].va(E);
          }
        u = k ? b[0].fromWireType(z) : void 0;
        return u;
      });
    }
    var xb = (a) => {
        a = a.trim();
        const b = a.indexOf('(');
        return -1 !== b ? a.substr(0, b) : a;
      },
      yb = [],
      U = [],
      Ab = (a) => {
        9 < a && 0 === --U[a + 1] && ((U[a] = void 0), yb.push(a));
      },
      V = (a) => {
        if (!a) throw new P('Cannot use deleted val. handle = ' + a);
        return U[a];
      },
      mb = (a) => {
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
            const b = yb.pop() || U.length;
            U[b] = a;
            U[b + 1] = 1;
            return b;
        }
      },
      Bb = {
        name: 'emscripten::val',
        fromWireType: (a) => {
          var b = V(a);
          Ab(a);
          return b;
        },
        toWireType: (a, b) => mb(b),
        ua: 8,
        readValueFromPointer: I,
        va: null,
      },
      Cb = (a, b, d) => {
        switch (b) {
          case 1:
            return d
              ? function (c) {
                  return this.fromWireType(w[c]);
                }
              : function (c) {
                  return this.fromWireType(x[c]);
                };
          case 2:
            return d
              ? function (c) {
                  return this.fromWireType(y[c >> 1]);
                }
              : function (c) {
                  return this.fromWireType(B[c >> 1]);
                };
          case 4:
            return d
              ? function (c) {
                  return this.fromWireType(C[c >> 2]);
                }
              : function (c) {
                  return this.fromWireType(D[c >> 2]);
                };
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Db = (a, b) => {
        var d = K[a];
        if (void 0 === d) throw ((a = `${b} has unknown type ${sb(a)}`), new P(a));
        return d;
      },
      Eb = (a, b) => {
        switch (b) {
          case 4:
            return function (d) {
              return this.fromWireType(qa[d >> 2]);
            };
          case 8:
            return function (d) {
              return this.fromWireType(ta[d >> 3]);
            };
          default:
            throw new TypeError(`invalid float width (${b}): ${a}`);
        }
      },
      Fb = Object.assign({ optional: !0 }, Bb),
      Gb = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Hb = (a, b) => {
        var d = a >> 1;
        for (var c = d + b / 2; !(d >= c) && B[d]; ) ++d;
        d <<= 1;
        if (32 < d - a && Gb) return Gb.decode(x.subarray(a, d));
        d = '';
        for (c = 0; !(c >= b / 2); ++c) {
          var e = y[(a + 2 * c) >> 1];
          if (0 == e) break;
          d += String.fromCharCode(e);
        }
        return d;
      },
      Ib = (a, b, d) => {
        var _d;
        (_d = d) !== null && _d !== void 0 ? _d : (d = 2147483647);
        if (2 > d) return 0;
        d -= 2;
        var c = b;
        d = d < 2 * a.length ? d / 2 : a.length;
        for (var e = 0; e < d; ++e) (y[b >> 1] = a.charCodeAt(e)), (b += 2);
        y[b >> 1] = 0;
        return b - c;
      },
      Jb = (a) => 2 * a.length,
      Kb = (a, b) => {
        for (var d = 0, c = ''; !(d >= b / 4); ) {
          var e = C[(a + 4 * d) >> 2];
          if (0 == e) break;
          ++d;
          65536 <= e
            ? ((e -= 65536), (c += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))))
            : (c += String.fromCharCode(e));
        }
        return c;
      },
      Lb = (a, b, d) => {
        var _d2;
        (_d2 = d) !== null && _d2 !== void 0 ? _d2 : (d = 2147483647);
        if (4 > d) return 0;
        var c = b;
        d = c + d - 4;
        for (var e = 0; e < a.length; ++e) {
          var f = a.charCodeAt(e);
          if (55296 <= f && 57343 >= f) {
            var h = a.charCodeAt(++e);
            f = (65536 + ((f & 1023) << 10)) | (h & 1023);
          }
          C[b >> 2] = f;
          b += 4;
          if (b + 4 > d) break;
        }
        C[b >> 2] = 0;
        return b - c;
      },
      Mb = (a) => {
        for (var b = 0, d = 0; d < a.length; ++d) {
          var c = a.charCodeAt(d);
          55296 <= c && 57343 >= c && ++d;
          b += 4;
        }
        return b;
      },
      Nb = 0,
      Ob = (a, b, d) => {
        var c = [];
        a = a.toWireType(c, d);
        c.length && (D[b >> 2] = mb(c));
        return a;
      },
      Pb = [],
      Qb = (a) => {
        var b = Pb.length;
        Pb.push(a);
        return b;
      },
      Rb = (a, b) => {
        for (var d = Array(a), c = 0; c < a; ++c) d[c] = Db(D[(b + 4 * c) >> 2], 'parameter ' + c);
        return d;
      },
      Sb = Reflect.construct,
      Tb = {},
      Ub = (a) => {
        if (!(a instanceof Fa || 'unwind' == a)) throw a;
      },
      Vb = (a) => {
        var _l$onExit;
        pa = a;
        Ha || 0 < Nb || ((_l$onExit = l.onExit) !== null && _l$onExit !== void 0 && _l$onExit.call(l, a), (oa = !0));
        throw new Fa(a);
      },
      Wb = (a) => {
        if (!oa)
          try {
            if ((a(), !(Ha || 0 < Nb)))
              try {
                (pa = a = pa), Vb(a);
              } catch (b) {
                Ub(b);
              }
          } catch (b) {
            Ub(b);
          }
      },
      Xb = {},
      Zb = () => {
        if (!Yb) {
          var a = {
              USER: 'web_user',
              LOGNAME: 'web_user',
              PATH: '/',
              PWD: '/',
              HOME: '/home/web_user',
              LANG:
                (('object' == typeof navigator && navigator.languages && navigator.languages[0]) || 'C').replace(
                  '-',
                  '_',
                ) + '.UTF-8',
              _: ja || './this.program',
            },
            b;
          for (b in Xb) void 0 === Xb[b] ? delete a[b] : (a[b] = Xb[b]);
          var d = [];
          for (b in a) d.push(`${b}=${a[b]}`);
          Yb = d;
        }
        return Yb;
      },
      Yb,
      $b = () => {
        if ('object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
          return (a) => crypto.getRandomValues(a);
        za('initRandomDevice');
      },
      ac = (a) => (ac = $b())(a);
    L = l.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    for (var bc = Array(256), cc = 0; 256 > cc; ++cc) bc[cc] = String.fromCharCode(cc);
    Sa = bc;
    P = l.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    Object.assign(db.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof db && a instanceof db)) return !1;
        var b = this.na.qa.oa,
          d = this.na.pa;
        a.na = a.na;
        var c = a.na.qa.oa;
        for (a = a.na.pa; b.ta; ) (d = b.Da(d)), (b = b.ta);
        for (; c.ta; ) (a = c.Da(a)), (c = c.ta);
        return b === c && d === a;
      },
      clone: function () {
        this.na.pa || Va(this);
        if (this.na.Ca) return (this.na.count.value += 1), this;
        var a = Q,
          b = Object,
          d = b.create,
          c = Object.getPrototypeOf(this),
          e = this.na;
        a = a(
          d.call(b, c, {
            na: { value: { count: e.count, Ba: e.Ba, Ca: e.Ca, pa: e.pa, qa: e.qa, sa: e.sa, wa: e.wa } },
          }),
        );
        a.na.count.value += 1;
        a.na.Ba = !1;
        return a;
      },
      ['delete']() {
        this.na.pa || Va(this);
        if (this.na.Ba && !this.na.Ca) throw new P('Object already scheduled for deletion');
        Xa(this);
        var a = this.na;
        --a.count.value;
        0 === a.count.value && (a.sa ? a.wa.xa(a.sa) : a.qa.oa.xa(a.pa));
        this.na.Ca || ((this.na.sa = void 0), (this.na.pa = void 0));
      },
      isDeleted: function () {
        return !this.na.pa;
      },
      deleteLater: function () {
        this.na.pa || Va(this);
        if (this.na.Ba && !this.na.Ca) throw new P('Object already scheduled for deletion');
        cb.push(this);
        this.na.Ba = !0;
        return this;
      },
    });
    Object.assign(ob.prototype, {
      Qa(a) {
        this.La && (a = this.La(a));
        return a;
      },
      Ja(a) {
        var _this$xa;
        (_this$xa = this.xa) === null || _this$xa === void 0 || _this$xa.call(this, a);
      },
      ua: 8,
      readValueFromPointer: I,
      fromWireType: function (a) {
        function b() {
          return this.Fa
            ? bb(this.oa.za, { qa: this.Va, pa: d, wa: this, sa: a })
            : bb(this.oa.za, { qa: this, pa: a });
        }
        var d = this.Qa(a);
        if (!d) return this.Ja(a), null;
        var c = ab(this.oa, d);
        if (void 0 !== c) {
          if (0 === c.na.count.value) return (c.na.pa = d), (c.na.sa = a), c.clone();
          c = c.clone();
          this.Ja(a);
          return c;
        }
        c = this.oa.Pa(d);
        c = Za[c];
        if (!c) return b.call(this);
        c = this.Ea ? c.Ma : c.pointerType;
        var e = Ya(d, this.oa, c.oa);
        return null === e
          ? b.call(this)
          : this.Fa
          ? bb(c.oa.za, { qa: c, pa: e, wa: this, sa: a })
          : bb(c.oa.za, { qa: c, pa: e });
      },
    });
    qb = l.UnboundTypeError = ((a, b) => {
      var d = eb(b, function (c) {
        this.name = b;
        this.message = c;
        c = Error(c).stack;
        void 0 !== c && (this.stack = this.toString() + '\n' + c.replace(/^Error(:[^\n]*)?\n/, ''));
      });
      d.prototype = Object.create(a.prototype);
      d.prototype.constructor = d;
      d.prototype.toString = function () {
        return void 0 === this.message ? this.name : `${this.name}: ${this.message}`;
      };
      return d;
    })(Error, 'UnboundTypeError');
    U.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1);
    l.count_emval_handles = () => U.length / 2 - 5 - yb.length;
    var oc = {
        c: (a, b, d, c) =>
          za(
            `Assertion failed: ${a ? Ja(a) : ''}, at: ` +
              [b ? (b ? Ja(b) : '') : 'unknown filename', d, c ? (c ? Ja(c) : '') : 'unknown function'],
          ),
        k: (a, b, d) => {
          var c = new Ka(a);
          D[(c.pa + 16) >> 2] = 0;
          D[(c.pa + 4) >> 2] = b;
          D[(c.pa + 8) >> 2] = d;
          La = a;
          Ma++;
          throw La;
        },
        P: () => {},
        M: () => {},
        N: () => {},
        R: function () {},
        O: () => {},
        T: () => za(''),
        w: (a) => {
          var b = Na[a];
          delete Na[a];
          var d = b.Ha,
            c = b.xa,
            e = b.Ka,
            f = e.map((h) => h.Ta).concat(e.map((h) => h.Za));
          N([a], f, (h) => {
            var g = {};
            e.forEach((k, m) => {
              var n = h[m],
                q = k.Ra,
                r = k.Sa,
                z = h[m + e.length],
                u = k.Ya,
                v = k.$a;
              g[k.Oa] = {
                read: (E) => n.fromWireType(q(r, E)),
                write: (E, da) => {
                  var A = [];
                  u(v, E, z.toWireType(A, da));
                  Oa(A);
                },
              };
            });
            return [
              {
                name: b.name,
                fromWireType: (k) => {
                  var m = {},
                    n;
                  for (n in g) m[n] = g[n].read(k);
                  c(k);
                  return m;
                },
                toWireType: (k, m) => {
                  for (var n in g) if (!(n in m)) throw new TypeError(`Missing field: "${n}"`);
                  var q = d();
                  for (n in g) g[n].write(q, m[n]);
                  null !== k && k.push(c, q);
                  return q;
                },
                ua: 8,
                readValueFromPointer: I,
                va: c,
              },
            ];
          });
        },
        C: (a, b, d) => {
          b = O(b);
          M(a, {
            name: b,
            fromWireType: (c) => c,
            toWireType: function (c, e) {
              if ('bigint' != typeof e && 'number' != typeof e)
                throw new TypeError(`Cannot convert "${Ra(e)}" to ${this.name}`);
              'number' == typeof e && (e = BigInt(e));
              return e;
            },
            ua: 8,
            readValueFromPointer: Ua(b, d, -1 == b.indexOf('u')),
            va: null,
          });
        },
        _: (a, b, d, c) => {
          b = O(b);
          M(a, {
            name: b,
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, f) {
              return f ? d : c;
            },
            ua: 8,
            readValueFromPointer: function (e) {
              return this.fromWireType(x[e]);
            },
            va: null,
          });
        },
        l: (a, b, d, c, e, f, h, g, k, m, n, q, r) => {
          n = O(n);
          f = S(e, f);
          g && (g = S(h, g));
          m && (m = S(k, m));
          r = S(q, r);
          var z = hb(n);
          gb(z, function () {
            tb(`Cannot construct ${n} due to unbound types`, [c]);
          });
          N([a, b, d], c ? [c] : [], (u) => {
            u = u[0];
            if (c) {
              var v = u.oa;
              var E = v.za;
            } else E = db.prototype;
            u = eb(n, function () {
              if (Object.getPrototypeOf(this) !== da) throw new P("Use 'new' to construct " + n);
              if (void 0 === A.ya) throw new P(n + ' has no accessible constructor');
              for (var _len3 = arguments.length, Pa = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                Pa[_key3] = arguments[_key3];
              }
              var zb = A.ya[Pa.length];
              if (void 0 === zb)
                throw new P(
                  `Tried to invoke ctor of ${n} with invalid number of parameters (${
                    Pa.length
                  }) - expected (${Object.keys(A.ya).toString()}) parameters instead!`,
                );
              return zb.apply(this, Pa);
            });
            var da = Object.create(E, { constructor: { value: u } });
            u.prototype = da;
            var A = new ib(n, u, da, r, v, f, g, m);
            if (A.ta) {
              var _ea$Ia;
              var ea;
              (_ea$Ia = (ea = A.ta).Ia) !== null && _ea$Ia !== void 0 ? _ea$Ia : (ea.Ia = []);
              A.ta.Ia.push(A);
            }
            v = new ob(n, A, !0, !1, !1);
            ea = new ob(n + '*', A, !1, !1, !1);
            E = new ob(n + ' const*', A, !1, !0, !1);
            Za[a] = { pointerType: ea, Ma: E };
            pb(z, u);
            return [v, ea, E];
          });
        },
        r: (a, b, d, c, e, f) => {
          var h = ub(b, d);
          e = S(c, e);
          N([], [a], (g) => {
            g = g[0];
            var k = `constructor ${g.name}`;
            void 0 === g.oa.ya && (g.oa.ya = []);
            if (void 0 !== g.oa.ya[b - 1])
              throw new P(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  g.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            g.oa.ya[b - 1] = () => {
              tb(`Cannot construct ${g.name} due to unbound types`, h);
            };
            N([], h, (m) => {
              m.splice(1, 0, null);
              g.oa.ya[b - 1] = wb(k, m, null, e, f);
              return [];
            });
            return [];
          });
        },
        d: (a, b, d, c, e, f, h, g) => {
          var k = ub(d, c);
          b = O(b);
          b = xb(b);
          f = S(e, f);
          N([], [a], (m) => {
            function n() {
              tb(`Cannot call ${q} due to unbound types`, k);
            }
            m = m[0];
            var q = `${m.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            g && m.oa.Wa.push(b);
            var r = m.oa.za,
              z = r[b];
            void 0 === z || (void 0 === z.ra && z.className !== m.name && z.Aa === d - 2)
              ? ((n.Aa = d - 2), (n.className = m.name), (r[b] = n))
              : (fb(r, b, q), (r[b].ra[d - 2] = n));
            N([], k, (u) => {
              u = wb(q, u, m, f, h);
              void 0 === r[b].ra ? ((u.Aa = d - 2), (r[b] = u)) : (r[b].ra[d - 2] = u);
              return [];
            });
            return [];
          });
        },
        Y: (a) => M(a, Bb),
        z: (a, b, d, c) => {
          function e() {}
          b = O(b);
          e.values = {};
          M(a, {
            name: b,
            constructor: e,
            fromWireType: function (f) {
              return this.constructor.values[f];
            },
            toWireType: (f, h) => h.value,
            ua: 8,
            readValueFromPointer: Cb(b, d, c),
            va: null,
          });
          gb(b, e);
        },
        i: (a, b, d) => {
          var c = Db(a, 'enum');
          b = O(b);
          a = c.constructor;
          c = Object.create(c.constructor.prototype, {
            value: { value: d },
            constructor: { value: eb(`${c.name}_${b}`, function () {}) },
          });
          a.values[d] = c;
          a[b] = c;
        },
        B: (a, b, d) => {
          b = O(b);
          M(a, {
            name: b,
            fromWireType: (c) => c,
            toWireType: (c, e) => e,
            ua: 8,
            readValueFromPointer: Eb(b, d),
            va: null,
          });
        },
        u: (a, b, d, c, e, f) => {
          var h = ub(b, d);
          a = O(a);
          a = xb(a);
          e = S(c, e);
          gb(
            a,
            function () {
              tb(`Cannot call ${a} due to unbound types`, h);
            },
            b - 1,
          );
          N([], h, (g) => {
            g = [g[0], null].concat(g.slice(1));
            pb(a, wb(a, g, null, e, f), b - 1);
            return [];
          });
        },
        n: (a, b, d, c, e) => {
          b = O(b);
          -1 === e && (e = 4294967295);
          e = (g) => g;
          if (0 === c) {
            var f = 32 - 8 * d;
            e = (g) => (g << f) >>> f;
          }
          var h = b.includes('unsigned')
            ? function (g, k) {
                return k >>> 0;
              }
            : function (g, k) {
                return k;
              };
          M(a, { name: b, fromWireType: e, toWireType: h, ua: 8, readValueFromPointer: Ua(b, d, 0 !== c), va: null });
        },
        g: (a, b, d) => {
          function c(f) {
            return new e(w.buffer, D[(f + 4) >> 2], D[f >> 2]);
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
          d = O(d);
          M(a, { name: d, fromWireType: c, ua: 8, readValueFromPointer: c }, { Ua: !0 });
        },
        o: (a) => {
          M(a, Fb);
        },
        v: (a, b, d, c, e, f, h, g, k, m, n, q) => {
          d = O(d);
          f = S(e, f);
          g = S(h, g);
          m = S(k, m);
          q = S(n, q);
          N([a], [b], (r) => {
            r = r[0];
            return [new ob(d, r.oa, !1, !1, !0, r, c, f, g, m, q)];
          });
        },
        Z: (a, b) => {
          b = O(b);
          M(a, {
            name: b,
            fromWireType: function (d) {
              for (var c = D[d >> 2], e = d + 4, f, h = e, g = 0; g <= c; ++g) {
                var k = e + g;
                if (g == c || 0 == x[k])
                  (h = h ? Ja(h, k - h) : ''),
                    void 0 === f ? (f = h) : ((f += String.fromCharCode(0)), (f += h)),
                    (h = k + 1);
              }
              T(d);
              return f;
            },
            toWireType: function (d, c) {
              c instanceof ArrayBuffer && (c = new Uint8Array(c));
              var e,
                f = 'string' == typeof c;
              if (!(f || c instanceof Uint8Array || c instanceof Uint8ClampedArray || c instanceof Int8Array))
                throw new P('Cannot pass non-string to std::string');
              if (f)
                for (var h = (e = 0); h < c.length; ++h) {
                  var g = c.charCodeAt(h);
                  127 >= g ? e++ : 2047 >= g ? (e += 2) : 55296 <= g && 57343 >= g ? ((e += 4), ++h) : (e += 3);
                }
              else e = c.length;
              h = dc(4 + e + 1);
              g = h + 4;
              D[h >> 2] = e;
              if (f) H(c, g, e + 1);
              else if (f)
                for (f = 0; f < e; ++f) {
                  var k = c.charCodeAt(f);
                  if (255 < k) throw (T(g), new P('String has UTF-16 code units that do not fit in 8 bits'));
                  x[g + f] = k;
                }
              else for (f = 0; f < e; ++f) x[g + f] = c[f];
              null !== d && d.push(T, h);
              return h;
            },
            ua: 8,
            readValueFromPointer: I,
            va(d) {
              T(d);
            },
          });
        },
        y: (a, b, d) => {
          d = O(d);
          if (2 === b) {
            var c = Hb;
            var e = Ib;
            var f = Jb;
            var h = (g) => B[g >> 1];
          } else 4 === b && ((c = Kb), (e = Lb), (f = Mb), (h = (g) => D[g >> 2]));
          M(a, {
            name: d,
            fromWireType: (g) => {
              for (var k = D[g >> 2], m, n = g + 4, q = 0; q <= k; ++q) {
                var r = g + 4 + q * b;
                if (q == k || 0 == h(r))
                  (n = c(n, r - n)), void 0 === m ? (m = n) : ((m += String.fromCharCode(0)), (m += n)), (n = r + b);
              }
              T(g);
              return m;
            },
            toWireType: (g, k) => {
              if ('string' != typeof k) throw new P(`Cannot pass non-string to C++ string type ${d}`);
              var m = f(k),
                n = dc(4 + m + b);
              D[n >> 2] = m / b;
              e(k, n + 4, m + b);
              null !== g && g.push(T, n);
              return n;
            },
            ua: 8,
            readValueFromPointer: I,
            va(g) {
              T(g);
            },
          });
        },
        x: (a, b, d, c, e, f) => {
          Na[a] = { name: O(b), Ha: S(d, c), xa: S(e, f), Ka: [] };
        },
        j: (a, b, d, c, e, f, h, g, k, m) => {
          Na[a].Ka.push({ Oa: O(b), Ta: d, Ra: S(c, e), Sa: f, Za: h, Ya: S(g, k), $a: m });
        },
        $: (a, b) => {
          b = O(b);
          M(a, { bb: !0, name: b, ua: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        K: () => {
          Ha = !1;
          Nb = 0;
        },
        I: () => {
          throw Infinity;
        },
        E: (a, b, d) => {
          a = V(a);
          b = Db(b, 'emval::as');
          return Ob(b, d, a);
        },
        q: (a, b, d, c) => {
          a = Pb[a];
          b = V(b);
          return a(null, b, d, c);
        },
        X: Ab,
        F: (a, b) => {
          a = V(a);
          b = V(b);
          return a == b;
        },
        p: (a, b, d) => {
          var c = Rb(a, b),
            e = c.shift();
          a--;
          var f = Array(a);
          b = `methodCaller<(${c.map((h) => h.name).join(', ')}) => ${e.name}>`;
          return Qb(
            eb(b, (h, g, k, m) => {
              for (var n = 0, q = 0; q < a; ++q) (f[q] = c[q].readValueFromPointer(m + n)), (n += c[q].ua);
              h = 1 === d ? Sb(g, f) : g.apply(h, f);
              return Ob(e, k, h);
            }),
          );
        },
        A: (a) => {
          9 < a && (U[a + 1] += 1);
        },
        ca: (a) => {
          var b = V(a);
          Oa(b);
          Ab(a);
        },
        t: (a, b) => {
          a = Db(a, '_emval_take_value');
          a = a.readValueFromPointer(b);
          return mb(a);
        },
        G: (a, b) => {
          Tb[a] && (clearTimeout(Tb[a].id), delete Tb[a]);
          if (!b) return 0;
          var d = setTimeout(() => {
            delete Tb[a];
            Wb(() => ec(a, performance.now()));
          }, b);
          Tb[a] = { id: d, cb: b };
          return 0;
        },
        H: (a, b, d, c) => {
          var e = new Date().getFullYear(),
            f = new Date(e, 0, 1).getTimezoneOffset();
          e = new Date(e, 6, 1).getTimezoneOffset();
          D[a >> 2] = 60 * Math.max(f, e);
          C[b >> 2] = Number(f != e);
          b = (h) => {
            var g = Math.abs(h);
            return `UTC${0 <= h ? '-' : '+'}${String(Math.floor(g / 60)).padStart(2, '0')}${String(g % 60).padStart(
              2,
              '0',
            )}`;
          };
          a = b(f);
          b = b(e);
          e < f ? (H(a, d, 17), H(b, c, 17)) : (H(a, c, 17), H(b, d, 17));
        },
        ba: () => performance.now(),
        J: (a) => {
          var b = x.length;
          a >>>= 0;
          if (2147483648 < a) return !1;
          for (var d = 1; 4 >= d; d *= 2) {
            var c = b * (1 + 0.2 / d);
            c = Math.min(c, a + 100663296);
            a: {
              c =
                ((Math.min(2147483648, 65536 * Math.ceil(Math.max(a, c) / 65536)) - na.buffer.byteLength + 65535) /
                  65536) |
                0;
              try {
                na.grow(c);
                ua();
                var e = 1;
                break a;
              } catch (f) {}
              e = void 0;
            }
            if (e) return !0;
          }
          return !1;
        },
        V: (a, b) => {
          var d = 0;
          Zb().forEach((c, e) => {
            var f = b + d;
            e = D[(a + 4 * e) >> 2] = f;
            for (f = 0; f < c.length; ++f) w[e++] = c.charCodeAt(f);
            w[e] = 0;
            d += c.length + 1;
          });
          return 0;
        },
        W: (a, b) => {
          var d = Zb();
          D[a >> 2] = d.length;
          var c = 0;
          d.forEach((e) => (c += e.length + 1));
          D[b >> 2] = c;
          return 0;
        },
        S: () => 52,
        Q: () => 52,
        m: fc,
        f: gc,
        e: hc,
        D: ic,
        aa: jc,
        a: kc,
        b: lc,
        h: mc,
        s: nc,
        U: Vb,
        L: (a, b) => {
          ac(x.subarray(a, a + b));
          return 0;
        },
      },
      W;
    (async function (_l$monitorRunDependen2, _Ba) {
      function a(c) {
        var _l$monitorRunDependen;
        W = c.exports;
        na = W.da;
        ua();
        R = W.ga;
        wa.unshift(W.ea);
        F--;
        (_l$monitorRunDependen = l.monitorRunDependencies) === null ||
          _l$monitorRunDependen === void 0 ||
          _l$monitorRunDependen.call(l, F);
        0 == F && G && ((c = G), (G = null), c());
        return W;
      }
      F++;
      (_l$monitorRunDependen2 = l.monitorRunDependencies) === null ||
        _l$monitorRunDependen2 === void 0 ||
        _l$monitorRunDependen2.call(l, F);
      var b = { a: oc };
      if (l.instantiateWasm)
        try {
          return l.instantiateWasm(b, a);
        } catch (c) {
          t(`Module.instantiateWasm callback failed with error: ${c}`), ba(c);
        }
      (_Ba = Ba) !== null && _Ba !== void 0
        ? _Ba
        : (Ba = Aa('DotLottiePlayer.wasm')
            ? 'DotLottiePlayer.wasm'
            : l.locateFile
            ? l.locateFile('DotLottiePlayer.wasm', p)
            : p + 'DotLottiePlayer.wasm');
      try {
        var d = await Ea(b);
        a(d.instance);
        return d;
      } catch (c) {
        ba(c);
      }
    })();
    var dc = (l._malloc = (a) => (dc = l._malloc = W.fa)(a)),
      T = (l._free = (a) => (T = l._free = W.ha)(a)),
      rb = (a) => (rb = W.ia)(a),
      ec = (a, b) => (ec = W.ja)(a, b),
      X = (a, b) => (X = W.ka)(a, b),
      Y = (a) => (Y = W.la)(a),
      Z = () => (Z = W.ma)();
    function fc(a, b) {
      var d = Z();
      try {
        return R.get(a)(b);
      } catch (c) {
        Y(d);
        if (c !== c + 0) throw c;
        X(1, 0);
      }
    }
    function ic(a, b, d, c, e, f) {
      var h = Z();
      try {
        return R.get(a)(b, d, c, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function kc(a, b) {
      var d = Z();
      try {
        R.get(a)(b);
      } catch (c) {
        Y(d);
        if (c !== c + 0) throw c;
        X(1, 0);
      }
    }
    function mc(a, b, d, c) {
      var e = Z();
      try {
        R.get(a)(b, d, c);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function gc(a, b, d) {
      var c = Z();
      try {
        return R.get(a)(b, d);
      } catch (e) {
        Y(c);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function lc(a, b, d) {
      var c = Z();
      try {
        R.get(a)(b, d);
      } catch (e) {
        Y(c);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function jc(a) {
      var b = Z();
      try {
        R.get(a)();
      } catch (d) {
        Y(b);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function hc(a, b, d, c) {
      var e = Z();
      try {
        return R.get(a)(b, d, c);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function nc(a, b, d, c, e) {
      var f = Z();
      try {
        R.get(a)(b, d, c, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    var pc;
    G = function qc() {
      pc || rc();
      pc || (G = qc);
    };
    function rc() {
      function a() {
        if (!pc && ((pc = !0), (l.calledRun = !0), !oa)) {
          var _l$onRuntimeInitializ;
          Ga(wa);
          aa(l);
          (_l$onRuntimeInitializ = l.onRuntimeInitialized) === null ||
            _l$onRuntimeInitializ === void 0 ||
            _l$onRuntimeInitializ.call(l);
          if (l.postRun)
            for ('function' == typeof l.postRun && (l.postRun = [l.postRun]); l.postRun.length; ) {
              var b = l.postRun.shift();
              xa.unshift(b);
            }
          Ga(xa);
        }
      }
      if (!(0 < F)) {
        if (l.preRun) for ('function' == typeof l.preRun && (l.preRun = [l.preRun]); l.preRun.length; ) ya();
        Ga(va);
        0 < F ||
          (l.setStatus
            ? (l.setStatus('Running...'),
              setTimeout(() => {
                setTimeout(() => l.setStatus(''), 1);
                a();
              }, 1))
            : a());
      }
    }
    if (l.preInit)
      for ('function' == typeof l.preInit && (l.preInit = [l.preInit]); 0 < l.preInit.length; ) l.preInit.pop()();
    rc();
    moduleRtn = ca;

    return moduleRtn;
  };
})();
export default createDotLottiePlayerModule;
