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
    var k = moduleArg,
      aa,
      ba,
      ca = new Promise((a, b) => {
        aa = a;
        ba = b;
      }),
      fa = Object.assign({}, k),
      ha = './this.program',
      p = '',
      ia;
    'undefined' != typeof document && document.currentScript && (p = document.currentScript.src);
    _scriptName && (p = _scriptName);
    p.startsWith('blob:') ? (p = '') : (p = p.substr(0, p.replace(/[?#].*/, '').lastIndexOf('/') + 1));
    ia = async (a) => {
      a = await fetch(a, { credentials: 'same-origin' });
      if (a.ok) return a.arrayBuffer();
      throw Error(a.status + ' : ' + a.url);
    };
    var t = k.printErr || console.error.bind(console);
    Object.assign(k, fa);
    fa = null;
    k.thisProgram && (ha = k.thisProgram);
    var ja = k.wasmBinary,
      ka,
      la = !1,
      ma,
      u,
      x,
      y,
      z,
      C,
      D,
      na,
      oa;
    function pa() {
      var a = ka.buffer;
      k.HEAP8 = u = new Int8Array(a);
      k.HEAP16 = y = new Int16Array(a);
      k.HEAPU8 = x = new Uint8Array(a);
      k.HEAPU16 = z = new Uint16Array(a);
      k.HEAP32 = C = new Int32Array(a);
      k.HEAPU32 = D = new Uint32Array(a);
      k.HEAPF32 = na = new Float32Array(a);
      k.HEAPF64 = oa = new Float64Array(a);
    }
    var qa = [],
      ra = [],
      sa = [];
    function ta() {
      var a = k.preRun.shift();
      qa.unshift(a);
    }
    var F = 0,
      G = null;
    function ua(a) {
      var _k$onAbort;
      (_k$onAbort = k.onAbort) === null || _k$onAbort === void 0 || _k$onAbort.call(k, a);
      a = 'Aborted(' + a + ')';
      t(a);
      la = !0;
      a = new WebAssembly.RuntimeError(a + '. Build with -sASSERTIONS for more info.');
      ba(a);
      throw a;
    }
    var va = (a) => a.startsWith('data:application/octet-stream;base64,'),
      wa;
    async function xa(a) {
      if (!ja)
        try {
          var b = await ia(a);
          return new Uint8Array(b);
        } catch {}
      if (a == wa && ja) a = new Uint8Array(ja);
      else throw 'both async and sync fetching of the wasm failed';
      return a;
    }
    async function ya(a, b) {
      try {
        var c = await xa(a);
        return await WebAssembly.instantiate(c, b);
      } catch (d) {
        t(`failed to asynchronously prepare wasm: ${d}`), ua(d);
      }
    }
    async function za(a) {
      var b = wa;
      if (!ja && 'function' == typeof WebAssembly.instantiateStreaming && !va(b) && 'function' == typeof fetch)
        try {
          var c = fetch(b, { credentials: 'same-origin' });
          return await WebAssembly.instantiateStreaming(c, a);
        } catch (d) {
          t(`wasm streaming compile failed: ${d}`), t('falling back to ArrayBuffer instantiation');
        }
      return ya(b, a);
    }
    class Aa {
      constructor(a) {
        _defineProperty(this, 'name', 'ExitStatus');
        this.message = `Program terminated with exit(${a})`;
        this.status = a;
      }
    }
    var Ba = (a) => {
        for (; 0 < a.length; ) a.shift()(k);
      },
      Ca = k.noExitRuntime || !0,
      Da = 'undefined' != typeof TextDecoder ? new TextDecoder() : void 0,
      Ea = function () {
        let a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        let b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NaN;
        var c = x,
          d = a + b;
        for (b = a; c[b] && !(b >= d); ) ++b;
        if (16 < b - a && c.buffer && Da) return Da.decode(c.subarray(a, b));
        for (d = ''; a < b; ) {
          var e = c[a++];
          if (e & 128) {
            var f = c[a++] & 63;
            if (192 == (e & 224)) d += String.fromCharCode(((e & 31) << 6) | f);
            else {
              var h = c[a++] & 63;
              e =
                224 == (e & 240)
                  ? ((e & 15) << 12) | (f << 6) | h
                  : ((e & 7) << 18) | (f << 12) | (h << 6) | (c[a++] & 63);
              65536 > e
                ? (d += String.fromCharCode(e))
                : ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))));
            }
          } else d += String.fromCharCode(e);
        }
        return d;
      };
    class Fa {
      constructor(a) {
        this.Ca = a - 24;
      }
    }
    var Ga = 0,
      Ha = 0,
      H = (a, b, c) => {
        var d = x;
        if (0 < c) {
          c = b + c - 1;
          for (var e = 0; e < a.length; ++e) {
            var f = a.charCodeAt(e);
            if (55296 <= f && 57343 >= f) {
              var h = a.charCodeAt(++e);
              f = (65536 + ((f & 1023) << 10)) | (h & 1023);
            }
            if (127 >= f) {
              if (b >= c) break;
              d[b++] = f;
            } else {
              if (2047 >= f) {
                if (b + 1 >= c) break;
                d[b++] = 192 | (f >> 6);
              } else {
                if (65535 >= f) {
                  if (b + 2 >= c) break;
                  d[b++] = 224 | (f >> 12);
                } else {
                  if (b + 3 >= c) break;
                  d[b++] = 240 | (f >> 18);
                  d[b++] = 128 | ((f >> 12) & 63);
                }
                d[b++] = 128 | ((f >> 6) & 63);
              }
              d[b++] = 128 | (f & 63);
            }
          }
          d[b] = 0;
        }
      },
      Ia = {},
      Ja = (a) => {
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
      Ka = {},
      L,
      N = (a, b, c) => {
        function d(g) {
          g = c(g);
          if (g.length !== a.length) throw new L('Mismatched type converter count');
          for (var l = 0; l < a.length; ++l) M(a[l], g[l]);
        }
        a.forEach((g) => (Ka[g] = b));
        var e = Array(b.length),
          f = [],
          h = 0;
        b.forEach((g, l) => {
          K.hasOwnProperty(g)
            ? (e[l] = K[g])
            : (f.push(g),
              J.hasOwnProperty(g) || (J[g] = []),
              J[g].push(() => {
                e[l] = K[g];
                ++h;
                h === f.length && d(e);
              }));
        });
        0 === f.length && d(e);
      },
      La,
      O = (a) => {
        for (var b = ''; x[a]; ) b += La[x[a++]];
        return b;
      },
      P;
    function Ma(a, b) {
      let c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var d = b.name;
      if (!a) throw new P(`type "${d}" must have a positive integer typeid pointer`);
      if (K.hasOwnProperty(a)) {
        if (c.hb) return;
        throw new P(`Cannot register type '${d}' twice`);
      }
      K[a] = b;
      delete Ka[a];
      J.hasOwnProperty(a) && ((b = J[a]), delete J[a], b.forEach((e) => e()));
    }
    function M(a, b) {
      let c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return Ma(a, b, c);
    }
    var Na = (a) => {
        throw new P(a.Aa.Da.Ba.name + ' instance already deleted');
      },
      Pa = !1,
      Qa = () => {},
      Ra = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.Ga) return null;
        a = Ra(a, b, c.Ga);
        return null === a ? null : c.$a(a);
      },
      Sa = {},
      Ta = {},
      Ua = (a, b) => {
        if (void 0 === b) throw new P('ptr should not be undefined');
        for (; a.Ga; ) (b = a.Qa(b)), (a = a.Ga);
        return Ta[b];
      },
      Va = (a, b) => {
        if (!b.Da || !b.Ca) throw new L('makeClassHandle requires ptr and ptrType');
        if (!!b.Ha !== !!b.Fa) throw new L('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return Q(Object.create(a, { Aa: { value: b, writable: !0 } }));
      },
      Q = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (Q = (b) => b), a;
        Pa = new FinalizationRegistry((b) => {
          b = b.Aa;
          --b.count.value;
          0 === b.count.value && (b.Fa ? b.Ha.Ka(b.Fa) : b.Da.Ba.Ka(b.Ca));
        });
        Q = (b) => {
          var c = b.Aa;
          c.Fa && Pa.register(b, { Aa: c }, b);
          return b;
        };
        Qa = (b) => {
          Pa.unregister(b);
        };
        return Q(a);
      },
      Wa = [];
    function Xa() {}
    var Ya = (a, b) => Object.defineProperty(b, 'name', { value: a }),
      Za = (a, b, c) => {
        if (void 0 === a[b].Ea) {
          var d = a[b];
          a[b] = function () {
            for (var _len = arguments.length, e = new Array(_len), _key = 0; _key < _len; _key++) {
              e[_key] = arguments[_key];
            }
            if (!a[b].Ea.hasOwnProperty(e.length))
              throw new P(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].Ea})!`,
              );
            return a[b].Ea[e.length].apply(this, e);
          };
          a[b].Ea = [];
          a[b].Ea[d.Na] = d;
        }
      },
      $a = (a, b, c) => {
        if (k.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== k[a].Ea && void 0 !== k[a].Ea[c]))
            throw new P(`Cannot register public name '${a}' twice`);
          Za(k, a, a);
          if (k[a].Ea.hasOwnProperty(c))
            throw new P(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          k[a].Ea[c] = b;
        } else (k[a] = b), (k[a].Na = c);
      },
      ab = (a) => {
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function bb(a, b, c, d, e, f, h, g) {
      this.name = a;
      this.constructor = b;
      this.Ma = c;
      this.Ka = d;
      this.Ga = e;
      this.bb = f;
      this.Qa = h;
      this.$a = g;
      this.jb = [];
    }
    var cb = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.Qa) throw new P(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.Qa(a);
        b = b.Ga;
      }
      return a;
    };
    function db(a, b) {
      if (null === b) {
        if (this.Ta) throw new P(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Aa) throw new P(`Cannot pass "${eb(b)}" as a ${this.name}`);
      if (!b.Aa.Ca) throw new P(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return cb(b.Aa.Ca, b.Aa.Da.Ba, this.Ba);
    }
    function fb(a, b) {
      if (null === b) {
        if (this.Ta) throw new P(`null is not a valid ${this.name}`);
        if (this.Sa) {
          var c = this.Ua();
          null !== a && a.push(this.Ka, c);
          return c;
        }
        return 0;
      }
      if (!b || !b.Aa) throw new P(`Cannot pass "${eb(b)}" as a ${this.name}`);
      if (!b.Aa.Ca) throw new P(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.Ra && b.Aa.Da.Ra)
        throw new P(
          `Cannot convert argument of type ${b.Aa.Ha ? b.Aa.Ha.name : b.Aa.Da.name} to parameter type ${this.name}`,
        );
      c = cb(b.Aa.Ca, b.Aa.Da.Ba, this.Ba);
      if (this.Sa) {
        if (void 0 === b.Aa.Fa) throw new P('Passing raw pointer to smart pointer is illegal');
        switch (this.ob) {
          case 0:
            if (b.Aa.Ha === this) c = b.Aa.Fa;
            else
              throw new P(
                `Cannot convert argument of type ${b.Aa.Ha ? b.Aa.Ha.name : b.Aa.Da.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            c = b.Aa.Fa;
            break;
          case 2:
            if (b.Aa.Ha === this) c = b.Aa.Fa;
            else {
              var d = b.clone();
              c = this.kb(
                c,
                gb(() => d['delete']()),
              );
              null !== a && a.push(this.Ka, c);
            }
            break;
          default:
            throw new P('Unsupporting sharing policy');
        }
      }
      return c;
    }
    function hb(a, b) {
      if (null === b) {
        if (this.Ta) throw new P(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Aa) throw new P(`Cannot pass "${eb(b)}" as a ${this.name}`);
      if (!b.Aa.Ca) throw new P(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.Aa.Da.Ra) throw new P(`Cannot convert argument of type ${b.Aa.Da.name} to parameter type ${this.name}`);
      return cb(b.Aa.Ca, b.Aa.Da.Ba, this.Ba);
    }
    function ib(a, b, c, d, e, f, h, g, l, n, m) {
      this.name = a;
      this.Ba = b;
      this.Ta = c;
      this.Ra = d;
      this.Sa = e;
      this.ib = f;
      this.ob = h;
      this.Ya = g;
      this.Ua = l;
      this.kb = n;
      this.Ka = m;
      e || void 0 !== b.Ga ? (this.toWireType = fb) : ((this.toWireType = d ? db : hb), (this.Ja = null));
    }
    var jb = (a, b, c) => {
        if (!k.hasOwnProperty(a)) throw new L('Replacing nonexistent public symbol');
        void 0 !== k[a].Ea && void 0 !== c ? (k[a].Ea[c] = b) : ((k[a] = b), (k[a].Na = c));
      },
      kb = [],
      lb,
      R = (a) => {
        var b = kb[a];
        b || (a >= kb.length && (kb.length = a + 1), (kb[a] = b = lb.get(a)));
        return b;
      },
      mb = function (a, b) {
        let c = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
        a.includes('j') ? ((a = a.replace(/p/g, 'i')), (b = (0, k['dynCall_' + a])(b, ...c))) : (b = R(b)(...c));
        return b;
      },
      nb = (a, b) =>
        function () {
          for (var _len2 = arguments.length, c = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            c[_key2] = arguments[_key2];
          }
          return mb(a, b, c);
        },
      S = (a, b) => {
        a = O(a);
        var c = a.includes('j') ? nb(a, b) : R(b);
        if ('function' != typeof c) throw new P(`unknown function pointer with signature ${a}: ${b}`);
        return c;
      },
      ob,
      qb = (a) => {
        a = pb(a);
        var b = O(a);
        T(a);
        return b;
      },
      rb = (a, b) => {
        function c(f) {
          e[f] || K[f] || (Ka[f] ? Ka[f].forEach(c) : (d.push(f), (e[f] = !0)));
        }
        var d = [],
          e = {};
        b.forEach(c);
        throw new ob(`${a}: ` + d.map(qb).join([', ']));
      },
      sb = (a, b) => {
        for (var c = [], d = 0; d < a; d++) c.push(D[(b + 4 * d) >> 2]);
        return c;
      };
    function tb(a) {
      for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].Ja) return !0;
      return !1;
    }
    function ub(a, b, c, d, e) {
      var f = b.length;
      if (2 > f) throw new P("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var h = null !== b[1] && null !== c,
        g = tb(b),
        l = 'void' !== b[0].name,
        n = f - 2,
        m = Array(n),
        q = [],
        r = [];
      return Ya(a, function () {
        for (var _len3 = arguments.length, A = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          A[_key3] = arguments[_key3];
        }
        r.length = 0;
        q.length = h ? 2 : 1;
        q[0] = e;
        if (h) {
          var v = b[1].toWireType(r, this);
          q[1] = v;
        }
        for (var w = 0; w < n; ++w) (m[w] = b[w + 2].toWireType(r, A[w])), q.push(m[w]);
        A = d(...q);
        if (g) Ja(r);
        else
          for (w = h ? 1 : 2; w < b.length; w++) {
            var E = 1 === w ? v : m[w - 2];
            null !== b[w].Ja && b[w].Ja(E);
          }
        v = l ? b[0].fromWireType(A) : void 0;
        return v;
      });
    }
    var vb = (a) => {
        a = a.trim();
        const b = a.indexOf('(');
        return -1 !== b ? a.substr(0, b) : a;
      },
      xb = [],
      U = [],
      yb = (a) => {
        9 < a && 0 === --U[a + 1] && ((U[a] = void 0), xb.push(a));
      },
      V = (a) => {
        if (!a) throw new P('Cannot use deleted val. handle = ' + a);
        return U[a];
      },
      gb = (a) => {
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
            const b = xb.pop() || U.length;
            U[b] = a;
            U[b + 1] = 1;
            return b;
        }
      },
      zb = {
        name: 'emscripten::val',
        fromWireType: (a) => {
          var b = V(a);
          yb(a);
          return b;
        },
        toWireType: (a, b) => gb(b),
        Ia: 8,
        readValueFromPointer: I,
        Ja: null,
      },
      Ab = (a, b, c) => {
        switch (b) {
          case 1:
            return c
              ? function (d) {
                  return this.fromWireType(u[d]);
                }
              : function (d) {
                  return this.fromWireType(x[d]);
                };
          case 2:
            return c
              ? function (d) {
                  return this.fromWireType(y[d >> 1]);
                }
              : function (d) {
                  return this.fromWireType(z[d >> 1]);
                };
          case 4:
            return c
              ? function (d) {
                  return this.fromWireType(C[d >> 2]);
                }
              : function (d) {
                  return this.fromWireType(D[d >> 2]);
                };
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Bb = (a, b) => {
        var c = K[a];
        if (void 0 === c) throw ((a = `${b} has unknown type ${qb(a)}`), new P(a));
        return c;
      },
      eb = (a) => {
        if (null === a) return 'null';
        var b = typeof a;
        return 'object' === b || 'array' === b || 'function' === b ? a.toString() : '' + a;
      },
      Cb = (a, b) => {
        switch (b) {
          case 4:
            return function (c) {
              return this.fromWireType(na[c >> 2]);
            };
          case 8:
            return function (c) {
              return this.fromWireType(oa[c >> 3]);
            };
          default:
            throw new TypeError(`invalid float width (${b}): ${a}`);
        }
      },
      Db = (a, b, c) => {
        switch (b) {
          case 1:
            return c ? (d) => u[d] : (d) => x[d];
          case 2:
            return c ? (d) => y[d >> 1] : (d) => z[d >> 1];
          case 4:
            return c ? (d) => C[d >> 2] : (d) => D[d >> 2];
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Eb = Object.assign({ optional: !0 }, zb),
      Fb = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Gb = (a, b) => {
        var c = a >> 1;
        for (var d = c + b / 2; !(c >= d) && z[c]; ) ++c;
        c <<= 1;
        if (32 < c - a && Fb) return Fb.decode(x.subarray(a, c));
        c = '';
        for (d = 0; !(d >= b / 2); ++d) {
          var e = y[(a + 2 * d) >> 1];
          if (0 == e) break;
          c += String.fromCharCode(e);
        }
        return c;
      },
      Hb = (a, b, c) => {
        var _c;
        (_c = c) !== null && _c !== void 0 ? _c : (c = 2147483647);
        if (2 > c) return 0;
        c -= 2;
        var d = b;
        c = c < 2 * a.length ? c / 2 : a.length;
        for (var e = 0; e < c; ++e) (y[b >> 1] = a.charCodeAt(e)), (b += 2);
        y[b >> 1] = 0;
        return b - d;
      },
      Ib = (a) => 2 * a.length,
      Jb = (a, b) => {
        for (var c = 0, d = ''; !(c >= b / 4); ) {
          var e = C[(a + 4 * c) >> 2];
          if (0 == e) break;
          ++c;
          65536 <= e
            ? ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))))
            : (d += String.fromCharCode(e));
        }
        return d;
      },
      Kb = (a, b, c) => {
        var _c2;
        (_c2 = c) !== null && _c2 !== void 0 ? _c2 : (c = 2147483647);
        if (4 > c) return 0;
        var d = b;
        c = d + c - 4;
        for (var e = 0; e < a.length; ++e) {
          var f = a.charCodeAt(e);
          if (55296 <= f && 57343 >= f) {
            var h = a.charCodeAt(++e);
            f = (65536 + ((f & 1023) << 10)) | (h & 1023);
          }
          C[b >> 2] = f;
          b += 4;
          if (b + 4 > c) break;
        }
        C[b >> 2] = 0;
        return b - d;
      },
      Lb = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          b += 4;
        }
        return b;
      },
      Mb = 0,
      Nb = (a, b, c) => {
        var d = [];
        a = a.toWireType(d, c);
        d.length && (D[b >> 2] = gb(d));
        return a;
      },
      Ob = [],
      Pb = (a) => {
        var b = Ob.length;
        Ob.push(a);
        return b;
      },
      Qb = (a, b) => {
        for (var c = Array(a), d = 0; d < a; ++d) c[d] = Bb(D[(b + 4 * d) >> 2], 'parameter ' + d);
        return c;
      },
      Rb = Reflect.construct,
      Sb = {},
      Tb = (a) => {
        if (!(a instanceof Aa || 'unwind' == a)) throw a;
      },
      Ub = (a) => {
        var _k$onExit;
        ma = a;
        Ca || 0 < Mb || ((_k$onExit = k.onExit) !== null && _k$onExit !== void 0 && _k$onExit.call(k, a), (la = !0));
        throw new Aa(a);
      },
      Vb = (a) => {
        if (!la)
          try {
            if ((a(), !(Ca || 0 < Mb)))
              try {
                (ma = a = ma), Ub(a);
              } catch (b) {
                Tb(b);
              }
          } catch (b) {
            Tb(b);
          }
      },
      Wb = {},
      Yb = () => {
        if (!Xb) {
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
              _: ha || './this.program',
            },
            b;
          for (b in Wb) void 0 === Wb[b] ? delete a[b] : (a[b] = Wb[b]);
          var c = [];
          for (b in a) c.push(`${b}=${a[b]}`);
          Xb = c;
        }
        return Xb;
      },
      Xb,
      Zb = () => {
        if ('object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
          return (a) => crypto.getRandomValues(a);
        ua('initRandomDevice');
      },
      $b = (a) => ($b = Zb())(a);
    L = k.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    for (var ac = Array(256), bc = 0; 256 > bc; ++bc) ac[bc] = String.fromCharCode(bc);
    La = ac;
    P = k.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    Object.assign(Xa.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof Xa && a instanceof Xa)) return !1;
        var b = this.Aa.Da.Ba,
          c = this.Aa.Ca;
        a.Aa = a.Aa;
        var d = a.Aa.Da.Ba;
        for (a = a.Aa.Ca; b.Ga; ) (c = b.Qa(c)), (b = b.Ga);
        for (; d.Ga; ) (a = d.Qa(a)), (d = d.Ga);
        return b === d && c === a;
      },
      clone: function () {
        this.Aa.Ca || Na(this);
        if (this.Aa.Pa) return (this.Aa.count.value += 1), this;
        var a = Q,
          b = Object,
          c = b.create,
          d = Object.getPrototypeOf(this),
          e = this.Aa;
        a = a(
          c.call(b, d, {
            Aa: { value: { count: e.count, Oa: e.Oa, Pa: e.Pa, Ca: e.Ca, Da: e.Da, Fa: e.Fa, Ha: e.Ha } },
          }),
        );
        a.Aa.count.value += 1;
        a.Aa.Oa = !1;
        return a;
      },
      ['delete']() {
        this.Aa.Ca || Na(this);
        if (this.Aa.Oa && !this.Aa.Pa) throw new P('Object already scheduled for deletion');
        Qa(this);
        var a = this.Aa;
        --a.count.value;
        0 === a.count.value && (a.Fa ? a.Ha.Ka(a.Fa) : a.Da.Ba.Ka(a.Ca));
        this.Aa.Pa || ((this.Aa.Fa = void 0), (this.Aa.Ca = void 0));
      },
      isDeleted: function () {
        return !this.Aa.Ca;
      },
      deleteLater: function () {
        this.Aa.Ca || Na(this);
        if (this.Aa.Oa && !this.Aa.Pa) throw new P('Object already scheduled for deletion');
        Wa.push(this);
        this.Aa.Oa = !0;
        return this;
      },
    });
    Object.assign(ib.prototype, {
      cb(a) {
        this.Ya && (a = this.Ya(a));
        return a;
      },
      Wa(a) {
        var _this$Ka;
        (_this$Ka = this.Ka) === null || _this$Ka === void 0 || _this$Ka.call(this, a);
      },
      Ia: 8,
      readValueFromPointer: I,
      fromWireType: function (a) {
        function b() {
          return this.Sa
            ? Va(this.Ba.Ma, { Da: this.ib, Ca: c, Ha: this, Fa: a })
            : Va(this.Ba.Ma, { Da: this, Ca: a });
        }
        var c = this.cb(a);
        if (!c) return this.Wa(a), null;
        var d = Ua(this.Ba, c);
        if (void 0 !== d) {
          if (0 === d.Aa.count.value) return (d.Aa.Ca = c), (d.Aa.Fa = a), d.clone();
          d = d.clone();
          this.Wa(a);
          return d;
        }
        d = this.Ba.bb(c);
        d = Sa[d];
        if (!d) return b.call(this);
        d = this.Ra ? d.Za : d.pointerType;
        var e = Ra(c, this.Ba, d.Ba);
        return null === e
          ? b.call(this)
          : this.Sa
          ? Va(d.Ba.Ma, { Da: d, Ca: e, Ha: this, Fa: a })
          : Va(d.Ba.Ma, { Da: d, Ca: e });
      },
    });
    ob = k.UnboundTypeError = ((a, b) => {
      var c = Ya(b, function (d) {
        this.name = b;
        this.message = d;
        d = Error(d).stack;
        void 0 !== d && (this.stack = this.toString() + '\n' + d.replace(/^Error(:[^\n]*)?\n/, ''));
      });
      c.prototype = Object.create(a.prototype);
      c.prototype.constructor = c;
      c.prototype.toString = function () {
        return void 0 === this.message ? this.name : `${this.name}: ${this.message}`;
      };
      return c;
    })(Error, 'UnboundTypeError');
    U.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1);
    k.count_emval_handles = () => U.length / 2 - 5 - xb.length;
    var nc = {
        d: (a, b, c, d) =>
          ua(
            `Assertion failed: ${a ? Ea(a) : ''}, at: ` +
              [b ? (b ? Ea(b) : '') : 'unknown filename', c, d ? (d ? Ea(d) : '') : 'unknown function'],
          ),
        p: (a, b, c) => {
          var d = new Fa(a);
          D[(d.Ca + 16) >> 2] = 0;
          D[(d.Ca + 4) >> 2] = b;
          D[(d.Ca + 8) >> 2] = c;
          Ga = a;
          Ha++;
          throw Ga;
        },
        S: () => {},
        P: () => {},
        Q: () => {},
        U: function () {},
        R: () => {},
        X: () => ua(''),
        C: (a) => {
          var b = Ia[a];
          delete Ia[a];
          var c = b.Ua,
            d = b.Ka,
            e = b.Xa,
            f = e.map((h) => h.gb).concat(e.map((h) => h.mb));
          N([a], f, (h) => {
            var g = {};
            e.forEach((l, n) => {
              var m = h[n],
                q = l.eb,
                r = l.fb,
                A = h[n + e.length],
                v = l.lb,
                w = l.nb;
              g[l.ab] = {
                read: (E) => m.fromWireType(q(r, E)),
                write: (E, da) => {
                  var B = [];
                  v(w, E, A.toWireType(B, da));
                  Ja(B);
                },
              };
            });
            return [
              {
                name: b.name,
                fromWireType: (l) => {
                  var n = {},
                    m;
                  for (m in g) n[m] = g[m].read(l);
                  d(l);
                  return n;
                },
                toWireType: (l, n) => {
                  for (var m in g) if (!(m in n)) throw new TypeError(`Missing field: "${m}"`);
                  var q = c();
                  for (m in g) g[m].write(q, n[m]);
                  null !== l && l.push(d, q);
                  return q;
                },
                Ia: 8,
                readValueFromPointer: I,
                Ja: d,
              },
            ];
          });
        },
        I: () => {},
        ba: (a, b, c, d) => {
          b = O(b);
          M(a, {
            name: b,
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, f) {
              return f ? c : d;
            },
            Ia: 8,
            readValueFromPointer: function (e) {
              return this.fromWireType(x[e]);
            },
            Ja: null,
          });
        },
        o: (a, b, c, d, e, f, h, g, l, n, m, q, r) => {
          m = O(m);
          f = S(e, f);
          g && (g = S(h, g));
          n && (n = S(l, n));
          r = S(q, r);
          var A = ab(m);
          $a(A, function () {
            rb(`Cannot construct ${m} due to unbound types`, [d]);
          });
          N([a, b, c], d ? [d] : [], (v) => {
            v = v[0];
            if (d) {
              var w = v.Ba;
              var E = w.Ma;
            } else E = Xa.prototype;
            v = Ya(m, function () {
              if (Object.getPrototypeOf(this) !== da) throw new P("Use 'new' to construct " + m);
              if (void 0 === B.La) throw new P(m + ' has no accessible constructor');
              for (var _len4 = arguments.length, Oa = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                Oa[_key4] = arguments[_key4];
              }
              var wb = B.La[Oa.length];
              if (void 0 === wb)
                throw new P(
                  `Tried to invoke ctor of ${m} with invalid number of parameters (${
                    Oa.length
                  }) - expected (${Object.keys(B.La).toString()}) parameters instead!`,
                );
              return wb.apply(this, Oa);
            });
            var da = Object.create(E, { constructor: { value: v } });
            v.prototype = da;
            var B = new bb(m, v, da, r, w, f, g, n);
            if (B.Ga) {
              var _ea$Va;
              var ea;
              (_ea$Va = (ea = B.Ga).Va) !== null && _ea$Va !== void 0 ? _ea$Va : (ea.Va = []);
              B.Ga.Va.push(B);
            }
            w = new ib(m, B, !0, !1, !1);
            ea = new ib(m + '*', B, !1, !1, !1);
            E = new ib(m + ' const*', B, !1, !0, !1);
            Sa[a] = { pointerType: ea, Za: E };
            jb(A, v);
            return [w, ea, E];
          });
        },
        w: (a, b, c, d, e, f) => {
          var h = sb(b, c);
          e = S(d, e);
          N([], [a], (g) => {
            g = g[0];
            var l = `constructor ${g.name}`;
            void 0 === g.Ba.La && (g.Ba.La = []);
            if (void 0 !== g.Ba.La[b - 1])
              throw new P(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  g.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            g.Ba.La[b - 1] = () => {
              rb(`Cannot construct ${g.name} due to unbound types`, h);
            };
            N([], h, (n) => {
              n.splice(1, 0, null);
              g.Ba.La[b - 1] = ub(l, n, null, e, f);
              return [];
            });
            return [];
          });
        },
        a: (a, b, c, d, e, f, h, g) => {
          var l = sb(c, d);
          b = O(b);
          b = vb(b);
          f = S(e, f);
          N([], [a], (n) => {
            function m() {
              rb(`Cannot call ${q} due to unbound types`, l);
            }
            n = n[0];
            var q = `${n.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            g && n.Ba.jb.push(b);
            var r = n.Ba.Ma,
              A = r[b];
            void 0 === A || (void 0 === A.Ea && A.className !== n.name && A.Na === c - 2)
              ? ((m.Na = c - 2), (m.className = n.name), (r[b] = m))
              : (Za(r, b, q), (r[b].Ea[c - 2] = m));
            N([], l, (v) => {
              v = ub(q, v, n, f, h);
              void 0 === r[b].Ea ? ((v.Na = c - 2), (r[b] = v)) : (r[b].Ea[c - 2] = v);
              return [];
            });
            return [];
          });
        },
        $: (a) => M(a, zb),
        H: (a, b, c, d) => {
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
            Ia: 8,
            readValueFromPointer: Ab(b, c, d),
            Ja: null,
          });
          $a(b, e);
        },
        s: (a, b, c) => {
          var d = Bb(a, 'enum');
          b = O(b);
          a = d.constructor;
          d = Object.create(d.constructor.prototype, {
            value: { value: c },
            constructor: { value: Ya(`${d.name}_${b}`, function () {}) },
          });
          a.values[c] = d;
          a[b] = d;
        },
        F: (a, b, c) => {
          b = O(b);
          M(a, {
            name: b,
            fromWireType: (d) => d,
            toWireType: (d, e) => e,
            Ia: 8,
            readValueFromPointer: Cb(b, c),
            Ja: null,
          });
        },
        z: (a, b, c, d, e, f) => {
          var h = sb(b, c);
          a = O(a);
          a = vb(a);
          e = S(d, e);
          $a(
            a,
            function () {
              rb(`Cannot call ${a} due to unbound types`, h);
            },
            b - 1,
          );
          N([], h, (g) => {
            jb(a, ub(a, [g[0], null].concat(g.slice(1)), null, e, f), b - 1);
            return [];
          });
        },
        v: (a, b, c, d, e) => {
          b = O(b);
          -1 === e && (e = 4294967295);
          e = (g) => g;
          if (0 === d) {
            var f = 32 - 8 * c;
            e = (g) => (g << f) >>> f;
          }
          var h = b.includes('unsigned')
            ? function (g, l) {
                return l >>> 0;
              }
            : function (g, l) {
                return l;
              };
          M(a, { name: b, fromWireType: e, toWireType: h, Ia: 8, readValueFromPointer: Db(b, c, 0 !== d), Ja: null });
        },
        l: (a, b, c) => {
          function d(f) {
            return new e(u.buffer, D[(f + 4) >> 2], D[f >> 2]);
          }
          var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][
            b
          ];
          c = O(c);
          M(a, { name: c, fromWireType: d, Ia: 8, readValueFromPointer: d }, { hb: !0 });
        },
        q: (a) => {
          M(a, Eb);
        },
        B: (a, b, c, d, e, f, h, g, l, n, m, q) => {
          c = O(c);
          f = S(e, f);
          g = S(h, g);
          n = S(l, n);
          q = S(m, q);
          N([a], [b], (r) => {
            r = r[0];
            return [new ib(c, r.Ba, !1, !1, !0, r, d, f, g, n, q)];
          });
        },
        aa: (a, b) => {
          b = O(b);
          M(a, {
            name: b,
            fromWireType: function (c) {
              for (var d = D[c >> 2], e = c + 4, f, h = e, g = 0; g <= d; ++g) {
                var l = e + g;
                if (g == d || 0 == x[l])
                  (h = h ? Ea(h, l - h) : ''),
                    void 0 === f ? (f = h) : ((f += String.fromCharCode(0)), (f += h)),
                    (h = l + 1);
              }
              T(c);
              return f;
            },
            toWireType: function (c, d) {
              d instanceof ArrayBuffer && (d = new Uint8Array(d));
              var e,
                f = 'string' == typeof d;
              if (!(f || d instanceof Uint8Array || d instanceof Uint8ClampedArray || d instanceof Int8Array))
                throw new P('Cannot pass non-string to std::string');
              if (f)
                for (var h = (e = 0); h < d.length; ++h) {
                  var g = d.charCodeAt(h);
                  127 >= g ? e++ : 2047 >= g ? (e += 2) : 55296 <= g && 57343 >= g ? ((e += 4), ++h) : (e += 3);
                }
              else e = d.length;
              h = cc(4 + e + 1);
              g = h + 4;
              D[h >> 2] = e;
              if (f) H(d, g, e + 1);
              else if (f)
                for (f = 0; f < e; ++f) {
                  var l = d.charCodeAt(f);
                  if (255 < l) throw (T(g), new P('String has UTF-16 code units that do not fit in 8 bits'));
                  x[g + f] = l;
                }
              else for (f = 0; f < e; ++f) x[g + f] = d[f];
              null !== c && c.push(T, h);
              return h;
            },
            Ia: 8,
            readValueFromPointer: I,
            Ja(c) {
              T(c);
            },
          });
        },
        E: (a, b, c) => {
          c = O(c);
          if (2 === b) {
            var d = Gb;
            var e = Hb;
            var f = Ib;
            var h = (g) => z[g >> 1];
          } else 4 === b && ((d = Jb), (e = Kb), (f = Lb), (h = (g) => D[g >> 2]));
          M(a, {
            name: c,
            fromWireType: (g) => {
              for (var l = D[g >> 2], n, m = g + 4, q = 0; q <= l; ++q) {
                var r = g + 4 + q * b;
                if (q == l || 0 == h(r))
                  (m = d(m, r - m)), void 0 === n ? (n = m) : ((n += String.fromCharCode(0)), (n += m)), (m = r + b);
              }
              T(g);
              return n;
            },
            toWireType: (g, l) => {
              if ('string' != typeof l) throw new P(`Cannot pass non-string to C++ string type ${c}`);
              var n = f(l),
                m = cc(4 + n + b);
              D[m >> 2] = n / b;
              e(l, m + 4, n + b);
              null !== g && g.push(T, m);
              return m;
            },
            Ia: 8,
            readValueFromPointer: I,
            Ja(g) {
              T(g);
            },
          });
        },
        D: (a, b, c, d, e, f) => {
          Ia[a] = { name: O(b), Ua: S(c, d), Ka: S(e, f), Xa: [] };
        },
        k: (a, b, c, d, e, f, h, g, l, n) => {
          Ia[a].Xa.push({ ab: O(b), gb: c, eb: S(d, e), fb: f, mb: h, lb: S(g, l), nb: n });
        },
        ca: (a, b) => {
          b = O(b);
          M(a, { pb: !0, name: b, Ia: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        V: (a, b, c) => x.copyWithin(a, b, b + c),
        N: () => {
          Ca = !1;
          Mb = 0;
        },
        L: () => {
          throw Infinity;
        },
        A: (a, b, c) => {
          a = V(a);
          b = Bb(b, 'emval::as');
          return Nb(b, c, a);
        },
        u: (a, b, c, d) => {
          a = Ob[a];
          b = V(b);
          return a(null, b, c, d);
        },
        e: yb,
        x: (a, b) => {
          a = V(a);
          b = V(b);
          return a == b;
        },
        t: (a, b, c) => {
          var d = Qb(a, b),
            e = d.shift();
          a--;
          var f = Array(a);
          b = `methodCaller<(${d.map((h) => h.name).join(', ')}) => ${e.name}>`;
          return Pb(
            Ya(b, (h, g, l, n) => {
              for (var m = 0, q = 0; q < a; ++q) (f[q] = d[q].readValueFromPointer(n + m)), (m += d[q].Ia);
              h = 1 === c ? Rb(g, f) : g.apply(h, f);
              return Nb(e, l, h);
            }),
          );
        },
        f: (a) => {
          9 < a && (U[a + 1] += 1);
        },
        n: (a) => {
          var b = V(a);
          Ja(b);
          yb(a);
        },
        i: (a, b) => {
          a = Bb(a, '_emval_take_value');
          a = a.readValueFromPointer(b);
          return gb(a);
        },
        J: (a, b) => {
          Sb[a] && (clearTimeout(Sb[a].id), delete Sb[a]);
          if (!b) return 0;
          var c = setTimeout(() => {
            delete Sb[a];
            Vb(() => dc(a, performance.now()));
          }, b);
          Sb[a] = { id: c, qb: b };
          return 0;
        },
        K: (a, b, c, d) => {
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
          e < f ? (H(a, c, 17), H(b, d, 17)) : (H(a, d, 17), H(b, c, 17));
        },
        m: () => performance.now(),
        M: (a) => {
          var b = x.length;
          a >>>= 0;
          if (2147483648 < a) return !1;
          for (var c = 1; 4 >= c; c *= 2) {
            var d = b * (1 + 0.2 / c);
            d = Math.min(d, a + 100663296);
            a: {
              d =
                ((Math.min(2147483648, 65536 * Math.ceil(Math.max(a, d) / 65536)) - ka.buffer.byteLength + 65535) /
                  65536) |
                0;
              try {
                ka.grow(d);
                pa();
                var e = 1;
                break a;
              } catch (f) {}
              e = void 0;
            }
            if (e) return !0;
          }
          return !1;
        },
        Z: (a, b) => {
          var c = 0;
          Yb().forEach((d, e) => {
            var f = b + c;
            e = D[(a + 4 * e) >> 2] = f;
            for (f = 0; f < d.length; ++f) u[e++] = d.charCodeAt(f);
            u[e] = 0;
            c += d.length + 1;
          });
          return 0;
        },
        _: (a, b) => {
          var c = Yb();
          D[a >> 2] = c.length;
          var d = 0;
          c.forEach((e) => (d += e.length + 1));
          D[b >> 2] = d;
          return 0;
        },
        W: () => 52,
        T: () => 52,
        r: ec,
        j: fc,
        g: gc,
        G: hc,
        da: ic,
        b: jc,
        c: kc,
        h: lc,
        y: mc,
        Y: Ub,
        O: (a, b) => {
          $b(x.subarray(a, a + b));
          return 0;
        },
      },
      W;
    (async function (_k$monitorRunDependen2, _wa) {
      function a(d) {
        var _k$monitorRunDependen;
        W = d.exports;
        ka = W.ea;
        pa();
        lb = W.ha;
        ra.unshift(W.fa);
        F--;
        (_k$monitorRunDependen = k.monitorRunDependencies) === null ||
          _k$monitorRunDependen === void 0 ||
          _k$monitorRunDependen.call(k, F);
        0 == F && G && ((d = G), (G = null), d());
        return W;
      }
      F++;
      (_k$monitorRunDependen2 = k.monitorRunDependencies) === null ||
        _k$monitorRunDependen2 === void 0 ||
        _k$monitorRunDependen2.call(k, F);
      var b = { a: nc };
      if (k.instantiateWasm)
        try {
          return k.instantiateWasm(b, a);
        } catch (d) {
          t(`Module.instantiateWasm callback failed with error: ${d}`), ba(d);
        }
      (_wa = wa) !== null && _wa !== void 0
        ? _wa
        : (wa = va('DotLottiePlayer.wasm')
            ? 'DotLottiePlayer.wasm'
            : k.locateFile
            ? k.locateFile('DotLottiePlayer.wasm', p)
            : p + 'DotLottiePlayer.wasm');
      try {
        var c = await za(b);
        a(c.instance);
        return c;
      } catch (d) {
        ba(d);
      }
    })();
    var cc = (a) => (cc = W.ga)(a),
      T = (a) => (T = W.ia)(a),
      pb = (a) => (pb = W.ja)(a),
      dc = (a, b) => (dc = W.ka)(a, b),
      X = (a, b) => (X = W.la)(a, b),
      Y = (a) => (Y = W.ma)(a),
      Z = () => (Z = W.na)();
    k.dynCall_jiii = (a, b, c, d) => (k.dynCall_jiii = W.oa)(a, b, c, d);
    k.dynCall_vjii = (a, b, c, d, e) => (k.dynCall_vjii = W.pa)(a, b, c, d, e);
    k.dynCall_vjfii = (a, b, c, d, e, f) => (k.dynCall_vjfii = W.qa)(a, b, c, d, e, f);
    k.dynCall_vjiii = (a, b, c, d, e, f) => (k.dynCall_vjiii = W.ra)(a, b, c, d, e, f);
    k.dynCall_vj = (a, b, c) => (k.dynCall_vj = W.sa)(a, b, c);
    k.dynCall_vjiiiii = (a, b, c, d, e, f, h, g) => (k.dynCall_vjiiiii = W.ta)(a, b, c, d, e, f, h, g);
    k.dynCall_vjiffii = (a, b, c, d, e, f, h, g) => (k.dynCall_vjiffii = W.ua)(a, b, c, d, e, f, h, g);
    k.dynCall_vjiiii = (a, b, c, d, e, f, h) => (k.dynCall_vjiiii = W.va)(a, b, c, d, e, f, h);
    k.dynCall_viijii = (a, b, c, d, e, f, h) => (k.dynCall_viijii = W.wa)(a, b, c, d, e, f, h);
    k.dynCall_iiiiij = (a, b, c, d, e, f, h) => (k.dynCall_iiiiij = W.xa)(a, b, c, d, e, f, h);
    k.dynCall_iiiiijj = (a, b, c, d, e, f, h, g, l) => (k.dynCall_iiiiijj = W.ya)(a, b, c, d, e, f, h, g, l);
    k.dynCall_iiiiiijj = (a, b, c, d, e, f, h, g, l, n) => (k.dynCall_iiiiiijj = W.za)(a, b, c, d, e, f, h, g, l, n);
    function ec(a, b) {
      var c = Z();
      try {
        return R(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function hc(a, b, c, d, e, f) {
      var h = Z();
      try {
        return R(a)(b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function jc(a, b) {
      var c = Z();
      try {
        R(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function lc(a, b, c, d) {
      var e = Z();
      try {
        R(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function fc(a, b, c) {
      var d = Z();
      try {
        return R(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function kc(a, b, c) {
      var d = Z();
      try {
        R(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function ic(a) {
      var b = Z();
      try {
        R(a)();
      } catch (c) {
        Y(b);
        if (c !== c + 0) throw c;
        X(1, 0);
      }
    }
    function gc(a, b, c, d) {
      var e = Z();
      try {
        return R(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function mc(a, b, c, d, e) {
      var f = Z();
      try {
        R(a)(b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    var oc;
    G = function pc() {
      oc || qc();
      oc || (G = pc);
    };
    function qc() {
      function a() {
        if (!oc && ((oc = !0), (k.calledRun = !0), !la)) {
          var _k$onRuntimeInitializ;
          Ba(ra);
          aa(k);
          (_k$onRuntimeInitializ = k.onRuntimeInitialized) === null ||
            _k$onRuntimeInitializ === void 0 ||
            _k$onRuntimeInitializ.call(k);
          if (k.postRun)
            for ('function' == typeof k.postRun && (k.postRun = [k.postRun]); k.postRun.length; ) {
              var b = k.postRun.shift();
              sa.unshift(b);
            }
          Ba(sa);
        }
      }
      if (!(0 < F)) {
        if (k.preRun) for ('function' == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; ) ta();
        Ba(qa);
        0 < F ||
          (k.setStatus
            ? (k.setStatus('Running...'),
              setTimeout(() => {
                setTimeout(() => k.setStatus(''), 1);
                a();
              }, 1))
            : a());
      }
    }
    if (k.preInit)
      for ('function' == typeof k.preInit && (k.preInit = [k.preInit]); 0 < k.preInit.length; ) k.preInit.pop()();
    qc();
    moduleRtn = ca;

    return moduleRtn;
  };
})();
export default createDotLottiePlayerModule;
