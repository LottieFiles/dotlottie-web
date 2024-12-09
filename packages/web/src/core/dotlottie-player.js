var createDotLottiePlayerModule = (() => {
  var _scriptName = typeof document != 'undefined' ? document.currentScript?.src : undefined;

  return function (moduleArg = {}) {
    var moduleRtn;

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
    ia = (a) =>
      fetch(a, { credentials: 'same-origin' }).then((b) =>
        b.ok ? b.arrayBuffer() : Promise.reject(Error(b.status + ' : ' + b.url)),
      );
    var ja = k.print || console.log.bind(console),
      t = k.printErr || console.error.bind(console);
    Object.assign(k, fa);
    fa = null;
    k.thisProgram && (ha = k.thisProgram);
    var ka = k.wasmBinary,
      la,
      ma = !1,
      na,
      w,
      x,
      y,
      z,
      C,
      D,
      oa,
      pa;
    function qa() {
      var a = la.buffer;
      k.HEAP8 = w = new Int8Array(a);
      k.HEAP16 = y = new Int16Array(a);
      k.HEAPU8 = x = new Uint8Array(a);
      k.HEAPU16 = z = new Uint16Array(a);
      k.HEAP32 = C = new Int32Array(a);
      k.HEAPU32 = D = new Uint32Array(a);
      k.HEAPF32 = oa = new Float32Array(a);
      k.HEAPF64 = pa = new Float64Array(a);
    }
    var ra = [],
      sa = [],
      ta = [];
    function ua() {
      var a = k.preRun.shift();
      ra.unshift(a);
    }
    var F = 0,
      va = null,
      G = null;
    function wa(a) {
      k.onAbort?.(a);
      a = 'Aborted(' + a + ')';
      t(a);
      ma = !0;
      a = new WebAssembly.RuntimeError(a + '. Build with -sASSERTIONS for more info.');
      ba(a);
      throw a;
    }
    var xa = (a) => a.startsWith('data:application/octet-stream;base64,'),
      ya;
    function za(a) {
      if (a == ya && ka) return new Uint8Array(ka);
      throw 'both async and sync fetching of the wasm failed';
    }
    function Aa(a) {
      return ka
        ? Promise.resolve().then(() => za(a))
        : ia(a).then(
            (b) => new Uint8Array(b),
            () => za(a),
          );
    }
    function Ba(a, b, c) {
      return Aa(a)
        .then((d) => WebAssembly.instantiate(d, b))
        .then(c, (d) => {
          t(`failed to asynchronously prepare wasm: ${d}`);
          wa(d);
        });
    }
    function Ca(a, b) {
      var c = ya;
      return ka || 'function' != typeof WebAssembly.instantiateStreaming || xa(c) || 'function' != typeof fetch
        ? Ba(c, a, b)
        : fetch(c, { credentials: 'same-origin' }).then((d) =>
            WebAssembly.instantiateStreaming(d, a).then(b, function (e) {
              t(`wasm streaming compile failed: ${e}`);
              t('falling back to ArrayBuffer instantiation');
              return Ba(c, a, b);
            }),
          );
    }
    class Da {
      name = 'ExitStatus';
      constructor(a) {
        this.message = `Program terminated with exit(${a})`;
        this.status = a;
      }
    }
    var Ea = (a) => {
        for (; 0 < a.length; ) a.shift()(k);
      },
      Fa = k.noExitRuntime || !0,
      Ga = 'undefined' != typeof TextDecoder ? new TextDecoder() : void 0,
      H = (a, b = 0, c = NaN) => {
        var d = b + c;
        for (c = b; a[c] && !(c >= d); ) ++c;
        if (16 < c - b && a.buffer && Ga) return Ga.decode(a.subarray(b, c));
        for (d = ''; b < c; ) {
          var e = a[b++];
          if (e & 128) {
            var f = a[b++] & 63;
            if (192 == (e & 224)) d += String.fromCharCode(((e & 31) << 6) | f);
            else {
              var h = a[b++] & 63;
              e =
                224 == (e & 240)
                  ? ((e & 15) << 12) | (f << 6) | h
                  : ((e & 7) << 18) | (f << 12) | (h << 6) | (a[b++] & 63);
              65536 > e
                ? (d += String.fromCharCode(e))
                : ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))));
            }
          } else d += String.fromCharCode(e);
        }
        return d;
      };
    class Ha {
      constructor(a) {
        this.wa = a - 24;
      }
    }
    var Ia = 0,
      Ja = 0,
      I = (a, b, c) => {
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
      Ka = {},
      La = (a) => {
        for (; a.length; ) {
          var b = a.pop();
          a.pop()(b);
        }
      };
    function J(a) {
      return this.fromWireType(D[a >> 2]);
    }
    var K = {},
      L = {},
      Ma = {},
      M,
      O = (a, b, c) => {
        function d(g) {
          g = c(g);
          if (g.length !== a.length) throw new M('Mismatched type converter count');
          for (var l = 0; l < a.length; ++l) N(a[l], g[l]);
        }
        a.forEach((g) => (Ma[g] = b));
        var e = Array(b.length),
          f = [],
          h = 0;
        b.forEach((g, l) => {
          L.hasOwnProperty(g)
            ? (e[l] = L[g])
            : (f.push(g),
              K.hasOwnProperty(g) || (K[g] = []),
              K[g].push(() => {
                e[l] = L[g];
                ++h;
                h === f.length && d(e);
              }));
        });
        0 === f.length && d(e);
      },
      Na,
      P = (a) => {
        for (var b = ''; x[a]; ) b += Na[x[a++]];
        return b;
      },
      Q;
    function Pa(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new Q(`type "${d}" must have a positive integer typeid pointer`);
      if (L.hasOwnProperty(a)) {
        if (c.ab) return;
        throw new Q(`Cannot register type '${d}' twice`);
      }
      L[a] = b;
      delete Ma[a];
      K.hasOwnProperty(a) && ((b = K[a]), delete K[a], b.forEach((e) => e()));
    }
    function N(a, b, c = {}) {
      return Pa(a, b, c);
    }
    var Qa = (a) => {
        throw new Q(a.ua.xa.va.name + ' instance already deleted');
      },
      Ra = !1,
      Sa = () => {},
      Ta = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.Aa) return null;
        a = Ta(a, b, c.Aa);
        return null === a ? null : c.Ua(a);
      },
      Ua = {},
      Va = {},
      Wa = (a, b) => {
        if (void 0 === b) throw new Q('ptr should not be undefined');
        for (; a.Aa; ) (b = a.Ka(b)), (a = a.Aa);
        return Va[b];
      },
      Xa = (a, b) => {
        if (!b.xa || !b.wa) throw new M('makeClassHandle requires ptr and ptrType');
        if (!!b.Ba !== !!b.za) throw new M('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return R(Object.create(a, { ua: { value: b, writable: !0 } }));
      },
      R = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (R = (b) => b), a;
        Ra = new FinalizationRegistry((b) => {
          b = b.ua;
          --b.count.value;
          0 === b.count.value && (b.za ? b.Ba.Ea(b.za) : b.xa.va.Ea(b.wa));
        });
        R = (b) => {
          var c = b.ua;
          c.za && Ra.register(b, { ua: c }, b);
          return b;
        };
        Sa = (b) => {
          Ra.unregister(b);
        };
        return R(a);
      },
      Ya = [];
    function Za() {}
    var $a = (a, b) => Object.defineProperty(b, 'name', { value: a }),
      ab = (a, b, c) => {
        if (void 0 === a[b].ya) {
          var d = a[b];
          a[b] = function (...e) {
            if (!a[b].ya.hasOwnProperty(e.length))
              throw new Q(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].ya})!`,
              );
            return a[b].ya[e.length].apply(this, e);
          };
          a[b].ya = [];
          a[b].ya[d.Ha] = d;
        }
      },
      bb = (a, b, c) => {
        if (k.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== k[a].ya && void 0 !== k[a].ya[c]))
            throw new Q(`Cannot register public name '${a}' twice`);
          ab(k, a, a);
          if (k[a].ya.hasOwnProperty(c))
            throw new Q(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          k[a].ya[c] = b;
        } else (k[a] = b), (k[a].Ha = c);
      },
      cb = (a) => {
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function db(a, b, c, d, e, f, h, g) {
      this.name = a;
      this.constructor = b;
      this.Ga = c;
      this.Ea = d;
      this.Aa = e;
      this.Wa = f;
      this.Ka = h;
      this.Ua = g;
      this.cb = [];
    }
    var eb = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.Ka) throw new Q(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.Ka(a);
        b = b.Aa;
      }
      return a;
    };
    function fb(a, b) {
      if (null === b) {
        if (this.Na) throw new Q(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.ua) throw new Q(`Cannot pass "${gb(b)}" as a ${this.name}`);
      if (!b.ua.wa) throw new Q(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return eb(b.ua.wa, b.ua.xa.va, this.va);
    }
    function hb(a, b) {
      if (null === b) {
        if (this.Na) throw new Q(`null is not a valid ${this.name}`);
        if (this.Ma) {
          var c = this.Oa();
          null !== a && a.push(this.Ea, c);
          return c;
        }
        return 0;
      }
      if (!b || !b.ua) throw new Q(`Cannot pass "${gb(b)}" as a ${this.name}`);
      if (!b.ua.wa) throw new Q(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.La && b.ua.xa.La)
        throw new Q(
          `Cannot convert argument of type ${b.ua.Ba ? b.ua.Ba.name : b.ua.xa.name} to parameter type ${this.name}`,
        );
      c = eb(b.ua.wa, b.ua.xa.va, this.va);
      if (this.Ma) {
        if (void 0 === b.ua.za) throw new Q('Passing raw pointer to smart pointer is illegal');
        switch (this.ib) {
          case 0:
            if (b.ua.Ba === this) c = b.ua.za;
            else
              throw new Q(
                `Cannot convert argument of type ${b.ua.Ba ? b.ua.Ba.name : b.ua.xa.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            c = b.ua.za;
            break;
          case 2:
            if (b.ua.Ba === this) c = b.ua.za;
            else {
              var d = b.clone();
              c = this.eb(
                c,
                ib(() => d['delete']()),
              );
              null !== a && a.push(this.Ea, c);
            }
            break;
          default:
            throw new Q('Unsupporting sharing policy');
        }
      }
      return c;
    }
    function jb(a, b) {
      if (null === b) {
        if (this.Na) throw new Q(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.ua) throw new Q(`Cannot pass "${gb(b)}" as a ${this.name}`);
      if (!b.ua.wa) throw new Q(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.ua.xa.La) throw new Q(`Cannot convert argument of type ${b.ua.xa.name} to parameter type ${this.name}`);
      return eb(b.ua.wa, b.ua.xa.va, this.va);
    }
    function kb(a, b, c, d, e, f, h, g, l, m, n) {
      this.name = a;
      this.va = b;
      this.Na = c;
      this.La = d;
      this.Ma = e;
      this.bb = f;
      this.ib = h;
      this.Sa = g;
      this.Oa = l;
      this.eb = m;
      this.Ea = n;
      e || void 0 !== b.Aa ? (this.toWireType = hb) : ((this.toWireType = d ? fb : jb), (this.Da = null));
    }
    var lb = (a, b, c) => {
        if (!k.hasOwnProperty(a)) throw new M('Replacing nonexistent public symbol');
        void 0 !== k[a].ya && void 0 !== c ? (k[a].ya[c] = b) : ((k[a] = b), (k[a].Ha = c));
      },
      S,
      mb = (a, b, c = []) => {
        a.includes('j') ? ((a = a.replace(/p/g, 'i')), (b = (0, k['dynCall_' + a])(b, ...c))) : (b = S.get(b)(...c));
        return b;
      },
      nb =
        (a, b) =>
        (...c) =>
          mb(a, b, c),
      T = (a, b) => {
        a = P(a);
        var c = a.includes('j') ? nb(a, b) : S.get(b);
        if ('function' != typeof c) throw new Q(`unknown function pointer with signature ${a}: ${b}`);
        return c;
      },
      ob,
      qb = (a) => {
        a = pb(a);
        var b = P(a);
        U(a);
        return b;
      },
      rb = (a, b) => {
        function c(f) {
          e[f] || L[f] || (Ma[f] ? Ma[f].forEach(c) : (d.push(f), (e[f] = !0)));
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
      for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].Da) return !0;
      return !1;
    }
    function ub(a, b, c, d, e) {
      var f = b.length;
      if (2 > f) throw new Q("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var h = null !== b[1] && null !== c,
        g = tb(b),
        l = 'void' !== b[0].name,
        m = f - 2,
        n = Array(m),
        q = [],
        r = [];
      return $a(a, function (...A) {
        r.length = 0;
        q.length = h ? 2 : 1;
        q[0] = e;
        if (h) {
          var u = b[1].toWireType(r, this);
          q[1] = u;
        }
        for (var v = 0; v < m; ++v) (n[v] = b[v + 2].toWireType(r, A[v])), q.push(n[v]);
        A = d(...q);
        if (g) La(r);
        else
          for (v = h ? 1 : 2; v < b.length; v++) {
            var E = 1 === v ? u : n[v - 2];
            null !== b[v].Da && b[v].Da(E);
          }
        u = l ? b[0].fromWireType(A) : void 0;
        return u;
      });
    }
    var vb = (a) => {
        a = a.trim();
        const b = a.indexOf('(');
        return -1 !== b ? a.substr(0, b) : a;
      },
      xb = [],
      V = [],
      yb = (a) => {
        9 < a && 0 === --V[a + 1] && ((V[a] = void 0), xb.push(a));
      },
      zb = (a) => {
        if (!a) throw new Q('Cannot use deleted val. handle = ' + a);
        return V[a];
      },
      ib = (a) => {
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
            const b = xb.pop() || V.length;
            V[b] = a;
            V[b + 1] = 1;
            return b;
        }
      },
      Ab = {
        name: 'emscripten::val',
        fromWireType: (a) => {
          var b = zb(a);
          yb(a);
          return b;
        },
        toWireType: (a, b) => ib(b),
        Ca: 8,
        readValueFromPointer: J,
        Da: null,
      },
      Bb = (a, b, c) => {
        switch (b) {
          case 1:
            return c
              ? function (d) {
                  return this.fromWireType(w[d]);
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
      Cb = (a, b) => {
        var c = L[a];
        if (void 0 === c) throw ((a = `${b} has unknown type ${qb(a)}`), new Q(a));
        return c;
      },
      gb = (a) => {
        if (null === a) return 'null';
        var b = typeof a;
        return 'object' === b || 'array' === b || 'function' === b ? a.toString() : '' + a;
      },
      Db = (a, b) => {
        switch (b) {
          case 4:
            return function (c) {
              return this.fromWireType(oa[c >> 2]);
            };
          case 8:
            return function (c) {
              return this.fromWireType(pa[c >> 3]);
            };
          default:
            throw new TypeError(`invalid float width (${b}): ${a}`);
        }
      },
      Eb = (a, b, c) => {
        switch (b) {
          case 1:
            return c ? (d) => w[d] : (d) => x[d];
          case 2:
            return c ? (d) => y[d >> 1] : (d) => z[d >> 1];
          case 4:
            return c ? (d) => C[d >> 2] : (d) => D[d >> 2];
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Fb = Object.assign({ optional: !0 }, Ab),
      Gb = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Hb = (a, b) => {
        var c = a >> 1;
        for (var d = c + b / 2; !(c >= d) && z[c]; ) ++c;
        c <<= 1;
        if (32 < c - a && Gb) return Gb.decode(x.subarray(a, c));
        c = '';
        for (d = 0; !(d >= b / 2); ++d) {
          var e = y[(a + 2 * d) >> 1];
          if (0 == e) break;
          c += String.fromCharCode(e);
        }
        return c;
      },
      Ib = (a, b, c) => {
        c ??= 2147483647;
        if (2 > c) return 0;
        c -= 2;
        var d = b;
        c = c < 2 * a.length ? c / 2 : a.length;
        for (var e = 0; e < c; ++e) (y[b >> 1] = a.charCodeAt(e)), (b += 2);
        y[b >> 1] = 0;
        return b - d;
      },
      Jb = (a) => 2 * a.length,
      Kb = (a, b) => {
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
      Lb = (a, b, c) => {
        c ??= 2147483647;
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
      Mb = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          b += 4;
        }
        return b;
      },
      Nb = 0,
      Ob = [],
      Pb = (a) => {
        var b = Ob.length;
        Ob.push(a);
        return b;
      },
      Qb = (a, b) => {
        for (var c = Array(a), d = 0; d < a; ++d) c[d] = Cb(D[(b + 4 * d) >> 2], 'parameter ' + d);
        return c;
      },
      Rb = Reflect.construct,
      Sb = {},
      Tb = (a) => {
        if (!(a instanceof Da || 'unwind' == a)) throw a;
      },
      Ub = (a) => {
        na = a;
        Fa || 0 < Nb || (k.onExit?.(a), (ma = !0));
        throw new Da(a);
      },
      Vb = (a) => {
        if (!ma)
          try {
            if ((a(), !(Fa || 0 < Nb)))
              try {
                (na = a = na), Ub(a);
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
      Zb = [null, [], []],
      $b = () => {
        if ('object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
          return (a) => crypto.getRandomValues(a);
        wa('initRandomDevice');
      },
      ac = (a) => (ac = $b())(a);
    M = k.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    for (var bc = Array(256), cc = 0; 256 > cc; ++cc) bc[cc] = String.fromCharCode(cc);
    Na = bc;
    Q = k.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    Object.assign(Za.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof Za && a instanceof Za)) return !1;
        var b = this.ua.xa.va,
          c = this.ua.wa;
        a.ua = a.ua;
        var d = a.ua.xa.va;
        for (a = a.ua.wa; b.Aa; ) (c = b.Ka(c)), (b = b.Aa);
        for (; d.Aa; ) (a = d.Ka(a)), (d = d.Aa);
        return b === d && c === a;
      },
      clone: function () {
        this.ua.wa || Qa(this);
        if (this.ua.Ja) return (this.ua.count.value += 1), this;
        var a = R,
          b = Object,
          c = b.create,
          d = Object.getPrototypeOf(this),
          e = this.ua;
        a = a(
          c.call(b, d, {
            ua: { value: { count: e.count, Ia: e.Ia, Ja: e.Ja, wa: e.wa, xa: e.xa, za: e.za, Ba: e.Ba } },
          }),
        );
        a.ua.count.value += 1;
        a.ua.Ia = !1;
        return a;
      },
      ['delete']() {
        this.ua.wa || Qa(this);
        if (this.ua.Ia && !this.ua.Ja) throw new Q('Object already scheduled for deletion');
        Sa(this);
        var a = this.ua;
        --a.count.value;
        0 === a.count.value && (a.za ? a.Ba.Ea(a.za) : a.xa.va.Ea(a.wa));
        this.ua.Ja || ((this.ua.za = void 0), (this.ua.wa = void 0));
      },
      isDeleted: function () {
        return !this.ua.wa;
      },
      deleteLater: function () {
        this.ua.wa || Qa(this);
        if (this.ua.Ia && !this.ua.Ja) throw new Q('Object already scheduled for deletion');
        Ya.push(this);
        this.ua.Ia = !0;
        return this;
      },
    });
    Object.assign(kb.prototype, {
      Xa(a) {
        this.Sa && (a = this.Sa(a));
        return a;
      },
      Qa(a) {
        this.Ea?.(a);
      },
      Ca: 8,
      readValueFromPointer: J,
      fromWireType: function (a) {
        function b() {
          return this.Ma
            ? Xa(this.va.Ga, { xa: this.bb, wa: c, Ba: this, za: a })
            : Xa(this.va.Ga, { xa: this, wa: a });
        }
        var c = this.Xa(a);
        if (!c) return this.Qa(a), null;
        var d = Wa(this.va, c);
        if (void 0 !== d) {
          if (0 === d.ua.count.value) return (d.ua.wa = c), (d.ua.za = a), d.clone();
          d = d.clone();
          this.Qa(a);
          return d;
        }
        d = this.va.Wa(c);
        d = Ua[d];
        if (!d) return b.call(this);
        d = this.La ? d.Ta : d.pointerType;
        var e = Ta(c, this.va, d.va);
        return null === e
          ? b.call(this)
          : this.Ma
          ? Xa(d.va.Ga, { xa: d, wa: e, Ba: this, za: a })
          : Xa(d.va.Ga, { xa: d, wa: e });
      },
    });
    ob = k.UnboundTypeError = ((a, b) => {
      var c = $a(b, function (d) {
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
    V.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1);
    k.count_emval_handles = () => V.length / 2 - 5 - xb.length;
    var oc = {
        c: (a, b, c, d) =>
          wa(
            `Assertion failed: ${a ? H(x, a) : ''}, at: ` +
              [b ? (b ? H(x, b) : '') : 'unknown filename', c, d ? (d ? H(x, d) : '') : 'unknown function'],
          ),
        m: (a, b, c) => {
          var d = new Ha(a);
          D[(d.wa + 16) >> 2] = 0;
          D[(d.wa + 4) >> 2] = b;
          D[(d.wa + 8) >> 2] = c;
          Ia = a;
          Ja++;
          throw Ia;
        },
        M: () => {},
        J: () => {},
        K: () => {},
        P: function () {},
        L: () => {},
        R: () => wa(''),
        v: (a) => {
          var b = Ka[a];
          delete Ka[a];
          var c = b.Oa,
            d = b.Ea,
            e = b.Ra,
            f = e.map((h) => h.$a).concat(e.map((h) => h.gb));
          O([a], f, (h) => {
            var g = {};
            e.forEach((l, m) => {
              var n = h[m],
                q = l.Ya,
                r = l.Za,
                A = h[m + e.length],
                u = l.fb,
                v = l.hb;
              g[l.Va] = {
                read: (E) => n.fromWireType(q(r, E)),
                write: (E, da) => {
                  var B = [];
                  u(v, E, A.toWireType(B, da));
                  La(B);
                },
              };
            });
            return [
              {
                name: b.name,
                fromWireType: (l) => {
                  var m = {},
                    n;
                  for (n in g) m[n] = g[n].read(l);
                  d(l);
                  return m;
                },
                toWireType: (l, m) => {
                  for (var n in g) if (!(n in m)) throw new TypeError(`Missing field: "${n}"`);
                  var q = c();
                  for (n in g) g[n].write(q, m[n]);
                  null !== l && l.push(d, q);
                  return q;
                },
                Ca: 8,
                readValueFromPointer: J,
                Da: d,
              },
            ];
          });
        },
        C: () => {},
        W: (a, b, c, d) => {
          b = P(b);
          N(a, {
            name: b,
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, f) {
              return f ? c : d;
            },
            Ca: 8,
            readValueFromPointer: function (e) {
              return this.fromWireType(x[e]);
            },
            Da: null,
          });
        },
        r: (a, b, c, d, e, f, h, g, l, m, n, q, r) => {
          n = P(n);
          f = T(e, f);
          g &&= T(h, g);
          m &&= T(l, m);
          r = T(q, r);
          var A = cb(n);
          bb(A, function () {
            rb(`Cannot construct ${n} due to unbound types`, [d]);
          });
          O([a, b, c], d ? [d] : [], (u) => {
            u = u[0];
            if (d) {
              var v = u.va;
              var E = v.Ga;
            } else E = Za.prototype;
            u = $a(n, function (...Oa) {
              if (Object.getPrototypeOf(this) !== da) throw new Q("Use 'new' to construct " + n);
              if (void 0 === B.Fa) throw new Q(n + ' has no accessible constructor');
              var wb = B.Fa[Oa.length];
              if (void 0 === wb)
                throw new Q(
                  `Tried to invoke ctor of ${n} with invalid number of parameters (${
                    Oa.length
                  }) - expected (${Object.keys(B.Fa).toString()}) parameters instead!`,
                );
              return wb.apply(this, Oa);
            });
            var da = Object.create(E, { constructor: { value: u } });
            u.prototype = da;
            var B = new db(n, u, da, r, v, f, g, m);
            if (B.Aa) {
              var ea;
              (ea = B.Aa).Pa ?? (ea.Pa = []);
              B.Aa.Pa.push(B);
            }
            v = new kb(n, B, !0, !1, !1);
            ea = new kb(n + '*', B, !1, !1, !1);
            E = new kb(n + ' const*', B, !1, !0, !1);
            Ua[a] = { pointerType: ea, Ta: E };
            lb(A, u);
            return [v, ea, E];
          });
        },
        q: (a, b, c, d, e, f) => {
          var h = sb(b, c);
          e = T(d, e);
          O([], [a], (g) => {
            g = g[0];
            var l = `constructor ${g.name}`;
            void 0 === g.va.Fa && (g.va.Fa = []);
            if (void 0 !== g.va.Fa[b - 1])
              throw new Q(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  g.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            g.va.Fa[b - 1] = () => {
              rb(`Cannot construct ${g.name} due to unbound types`, h);
            };
            O([], h, (m) => {
              m.splice(1, 0, null);
              g.va.Fa[b - 1] = ub(l, m, null, e, f);
              return [];
            });
            return [];
          });
        },
        f: (a, b, c, d, e, f, h, g) => {
          var l = sb(c, d);
          b = P(b);
          b = vb(b);
          f = T(e, f);
          O([], [a], (m) => {
            function n() {
              rb(`Cannot call ${q} due to unbound types`, l);
            }
            m = m[0];
            var q = `${m.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            g && m.va.cb.push(b);
            var r = m.va.Ga,
              A = r[b];
            void 0 === A || (void 0 === A.ya && A.className !== m.name && A.Ha === c - 2)
              ? ((n.Ha = c - 2), (n.className = m.name), (r[b] = n))
              : (ab(r, b, q), (r[b].ya[c - 2] = n));
            O([], l, (u) => {
              u = ub(q, u, m, f, h);
              void 0 === r[b].ya ? ((u.Ha = c - 2), (r[b] = u)) : (r[b].ya[c - 2] = u);
              return [];
            });
            return [];
          });
        },
        V: (a) => N(a, Ab),
        x: (a, b, c, d) => {
          function e() {}
          b = P(b);
          e.values = {};
          N(a, {
            name: b,
            constructor: e,
            fromWireType: function (f) {
              return this.constructor.values[f];
            },
            toWireType: (f, h) => h.value,
            Ca: 8,
            readValueFromPointer: Bb(b, c, d),
            Da: null,
          });
          bb(b, e);
        },
        k: (a, b, c) => {
          var d = Cb(a, 'enum');
          b = P(b);
          a = d.constructor;
          d = Object.create(d.constructor.prototype, {
            value: { value: c },
            constructor: { value: $a(`${d.name}_${b}`, function () {}) },
          });
          a.values[c] = d;
          a[b] = d;
        },
        z: (a, b, c) => {
          b = P(b);
          N(a, {
            name: b,
            fromWireType: (d) => d,
            toWireType: (d, e) => e,
            Ca: 8,
            readValueFromPointer: Db(b, c),
            Da: null,
          });
        },
        u: (a, b, c, d, e, f) => {
          var h = sb(b, c);
          a = P(a);
          a = vb(a);
          e = T(d, e);
          bb(
            a,
            function () {
              rb(`Cannot call ${a} due to unbound types`, h);
            },
            b - 1,
          );
          O([], h, (g) => {
            lb(a, ub(a, [g[0], null].concat(g.slice(1)), null, e, f), b - 1);
            return [];
          });
        },
        l: (a, b, c, d, e) => {
          b = P(b);
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
          N(a, { name: b, fromWireType: e, toWireType: h, Ca: 8, readValueFromPointer: Eb(b, c, 0 !== d), Da: null });
        },
        h: (a, b, c) => {
          function d(f) {
            return new e(w.buffer, D[(f + 4) >> 2], D[f >> 2]);
          }
          var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][
            b
          ];
          c = P(c);
          N(a, { name: c, fromWireType: d, Ca: 8, readValueFromPointer: d }, { ab: !0 });
        },
        t: (a) => {
          N(a, Fb);
        },
        aa: (a, b, c, d, e, f, h, g, l, m, n, q) => {
          c = P(c);
          f = T(e, f);
          g = T(h, g);
          m = T(l, m);
          q = T(n, q);
          O([a], [b], (r) => {
            r = r[0];
            return [new kb(c, r.va, !1, !1, !0, r, d, f, g, m, q)];
          });
        },
        A: (a, b) => {
          b = P(b);
          var c = 'std::string' === b;
          N(a, {
            name: b,
            fromWireType: function (d) {
              var e = D[d >> 2],
                f = d + 4;
              if (c)
                for (var h = f, g = 0; g <= e; ++g) {
                  var l = f + g;
                  if (g == e || 0 == x[l]) {
                    h = h ? H(x, h, l - h) : '';
                    if (void 0 === m) var m = h;
                    else (m += String.fromCharCode(0)), (m += h);
                    h = l + 1;
                  }
                }
              else {
                m = Array(e);
                for (g = 0; g < e; ++g) m[g] = String.fromCharCode(x[f + g]);
                m = m.join('');
              }
              U(d);
              return m;
            },
            toWireType: function (d, e) {
              e instanceof ArrayBuffer && (e = new Uint8Array(e));
              var f,
                h = 'string' == typeof e;
              if (!(h || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array))
                throw new Q('Cannot pass non-string to std::string');
              if (c && h)
                for (var g = (f = 0); g < e.length; ++g) {
                  var l = e.charCodeAt(g);
                  127 >= l ? f++ : 2047 >= l ? (f += 2) : 55296 <= l && 57343 >= l ? ((f += 4), ++g) : (f += 3);
                }
              else f = e.length;
              g = dc(4 + f + 1);
              l = g + 4;
              D[g >> 2] = f;
              if (c && h) I(e, l, f + 1);
              else if (h)
                for (h = 0; h < f; ++h) {
                  var m = e.charCodeAt(h);
                  if (255 < m) throw (U(l), new Q('String has UTF-16 code units that do not fit in 8 bits'));
                  x[l + h] = m;
                }
              else for (h = 0; h < f; ++h) x[l + h] = e[h];
              null !== d && d.push(U, g);
              return g;
            },
            Ca: 8,
            readValueFromPointer: J,
            Da(d) {
              U(d);
            },
          });
        },
        s: (a, b, c) => {
          c = P(c);
          if (2 === b) {
            var d = Hb;
            var e = Ib;
            var f = Jb;
            var h = (g) => z[g >> 1];
          } else 4 === b && ((d = Kb), (e = Lb), (f = Mb), (h = (g) => D[g >> 2]));
          N(a, {
            name: c,
            fromWireType: (g) => {
              for (var l = D[g >> 2], m, n = g + 4, q = 0; q <= l; ++q) {
                var r = g + 4 + q * b;
                if (q == l || 0 == h(r))
                  (n = d(n, r - n)), void 0 === m ? (m = n) : ((m += String.fromCharCode(0)), (m += n)), (n = r + b);
              }
              U(g);
              return m;
            },
            toWireType: (g, l) => {
              if ('string' != typeof l) throw new Q(`Cannot pass non-string to C++ string type ${c}`);
              var m = f(l),
                n = dc(4 + m + b);
              D[n >> 2] = m / b;
              e(l, n + 4, m + b);
              null !== g && g.push(U, n);
              return n;
            },
            Ca: 8,
            readValueFromPointer: J,
            Da(g) {
              U(g);
            },
          });
        },
        w: (a, b, c, d, e, f) => {
          Ka[a] = { name: P(b), Oa: T(c, d), Ea: T(e, f), Ra: [] };
        },
        j: (a, b, c, d, e, f, h, g, l, m) => {
          Ka[a].Ra.push({ Va: P(b), $a: c, Ya: T(d, e), Za: f, gb: h, fb: T(g, l), hb: m });
        },
        X: (a, b) => {
          b = P(b);
          N(a, { jb: !0, name: b, Ca: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        H: () => {
          Fa = !1;
          Nb = 0;
        },
        D: () => {
          throw Infinity;
        },
        _: (a, b, c, d) => {
          a = Ob[a];
          b = zb(b);
          return a(null, b, c, d);
        },
        B: yb,
        Z: (a, b, c) => {
          var d = Qb(a, b),
            e = d.shift();
          a--;
          var f = Array(a);
          b = `methodCaller<(${d.map((h) => h.name).join(', ')}) => ${e.name}>`;
          return Pb(
            $a(b, (h, g, l, m) => {
              for (var n = 0, q = 0; q < a; ++q) (f[q] = d[q].readValueFromPointer(m + n)), (n += d[q].Ca);
              g = 1 === c ? Rb(g, f) : g.apply(h, f);
              h = [];
              g = e.toWireType(h, g);
              h.length && (D[l >> 2] = ib(h));
              return g;
            }),
          );
        },
        $: (a) => {
          9 < a && (V[a + 1] += 1);
        },
        Y: (a) => {
          var b = zb(a);
          La(b);
          yb(a);
        },
        o: (a, b) => {
          a = Cb(a, '_emval_take_value');
          a = a.readValueFromPointer(b);
          return ib(a);
        },
        E: (a, b) => {
          Sb[a] && (clearTimeout(Sb[a].id), delete Sb[a]);
          if (!b) return 0;
          var c = setTimeout(() => {
            delete Sb[a];
            Vb(() => ec(a, performance.now()));
          }, b);
          Sb[a] = { id: c, kb: b };
          return 0;
        },
        F: (a, b, c, d) => {
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
          e < f ? (I(a, c, 17), I(b, d, 17)) : (I(a, d, 17), I(b, c, 17));
        },
        ba: () => performance.now(),
        G: (a) => {
          var b = x.length;
          a >>>= 0;
          if (2147483648 < a) return !1;
          for (var c = 1; 4 >= c; c *= 2) {
            var d = b * (1 + 0.2 / c);
            d = Math.min(d, a + 100663296);
            a: {
              d =
                ((Math.min(2147483648, 65536 * Math.ceil(Math.max(a, d) / 65536)) - la.buffer.byteLength + 65535) /
                  65536) |
                0;
              try {
                la.grow(d);
                qa();
                var e = 1;
                break a;
              } catch (f) {}
              e = void 0;
            }
            if (e) return !0;
          }
          return !1;
        },
        T: (a, b) => {
          var c = 0;
          Yb().forEach((d, e) => {
            var f = b + c;
            e = D[(a + 4 * e) >> 2] = f;
            for (f = 0; f < d.length; ++f) w[e++] = d.charCodeAt(f);
            w[e] = 0;
            c += d.length + 1;
          });
          return 0;
        },
        U: (a, b) => {
          var c = Yb();
          D[a >> 2] = c.length;
          var d = 0;
          c.forEach((e) => (d += e.length + 1));
          D[b >> 2] = d;
          return 0;
        },
        Q: () => 52,
        O: () => 52,
        N: (a, b, c, d) => {
          for (var e = 0, f = 0; f < c; f++) {
            var h = D[b >> 2],
              g = D[(b + 4) >> 2];
            b += 8;
            for (var l = 0; l < g; l++) {
              var m = a,
                n = x[h + l],
                q = Zb[m];
              0 === n || 10 === n ? ((1 === m ? ja : t)(H(q)), (q.length = 0)) : q.push(n);
            }
            e += g;
          }
          D[d >> 2] = e;
          return 0;
        },
        i: fc,
        d: gc,
        e: hc,
        p: ic,
        y: jc,
        b: kc,
        a: lc,
        g: mc,
        n: nc,
        S: Ub,
        I: (a, b) => {
          ac(x.subarray(a, a + b));
          return 0;
        },
      },
      W = (function () {
        function a(c) {
          W = c.exports;
          la = W.ca;
          qa();
          S = W.ga;
          sa.unshift(W.da);
          F--;
          k.monitorRunDependencies?.(F);
          0 == F && (null !== va && (clearInterval(va), (va = null)), G && ((c = G), (G = null), c()));
          return W;
        }
        F++;
        k.monitorRunDependencies?.(F);
        var b = { a: oc };
        if (k.instantiateWasm)
          try {
            return k.instantiateWasm(b, a);
          } catch (c) {
            t(`Module.instantiateWasm callback failed with error: ${c}`), ba(c);
          }
        ya ??= xa('DotLottiePlayer.wasm')
          ? 'DotLottiePlayer.wasm'
          : k.locateFile
          ? k.locateFile('DotLottiePlayer.wasm', p)
          : p + 'DotLottiePlayer.wasm';
        Ca(b, function (c) {
          a(c.instance);
        }).catch(ba);
        return {};
      })(),
      dc = (a) => (dc = W.ea)(a),
      pb = (a) => (pb = W.fa)(a),
      U = (a) => (U = W.ha)(a),
      ec = (a, b) => (ec = W.ia)(a, b),
      X = (a, b) => (X = W.ja)(a, b),
      Y = (a) => (Y = W.ka)(a),
      Z = () => (Z = W.la)();
    k.dynCall_iijj = (a, b, c, d, e, f) => (k.dynCall_iijj = W.ma)(a, b, c, d, e, f);
    k.dynCall_vijj = (a, b, c, d, e, f) => (k.dynCall_vijj = W.na)(a, b, c, d, e, f);
    k.dynCall_jiii = (a, b, c, d) => (k.dynCall_jiii = W.oa)(a, b, c, d);
    k.dynCall_jii = (a, b, c) => (k.dynCall_jii = W.pa)(a, b, c);
    k.dynCall_viijii = (a, b, c, d, e, f, h) => (k.dynCall_viijii = W.qa)(a, b, c, d, e, f, h);
    k.dynCall_iiiiij = (a, b, c, d, e, f, h) => (k.dynCall_iiiiij = W.ra)(a, b, c, d, e, f, h);
    k.dynCall_iiiiijj = (a, b, c, d, e, f, h, g, l) => (k.dynCall_iiiiijj = W.sa)(a, b, c, d, e, f, h, g, l);
    k.dynCall_iiiiiijj = (a, b, c, d, e, f, h, g, l, m) => (k.dynCall_iiiiiijj = W.ta)(a, b, c, d, e, f, h, g, l, m);
    function lc(a, b, c) {
      var d = Z();
      try {
        S.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function kc(a, b) {
      var c = Z();
      try {
        S.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function hc(a, b, c, d) {
      var e = Z();
      try {
        return S.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function gc(a, b, c) {
      var d = Z();
      try {
        return S.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function fc(a, b) {
      var c = Z();
      try {
        return S.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function ic(a, b, c, d, e, f) {
      var h = Z();
      try {
        return S.get(a)(b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function nc(a, b, c, d, e) {
      var f = Z();
      try {
        S.get(a)(b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function mc(a, b, c, d) {
      var e = Z();
      try {
        S.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function jc(a) {
      var b = Z();
      try {
        S.get(a)();
      } catch (c) {
        Y(b);
        if (c !== c + 0) throw c;
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
        if (!pc && ((pc = !0), (k.calledRun = !0), !ma)) {
          Ea(sa);
          aa(k);
          k.onRuntimeInitialized?.();
          if (k.postRun)
            for ('function' == typeof k.postRun && (k.postRun = [k.postRun]); k.postRun.length; ) {
              var b = k.postRun.shift();
              ta.unshift(b);
            }
          Ea(ta);
        }
      }
      if (!(0 < F)) {
        if (k.preRun) for ('function' == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; ) ua();
        Ea(ra);
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
    rc();
    moduleRtn = ca;

    return moduleRtn;
  };
})();
export default createDotLottiePlayerModule;
