var createDotLottiePlayerModule = (() => {
  var _scriptName = typeof document != 'undefined' ? document.currentScript?.src : undefined;

  return function (moduleArg = {}) {
    var moduleRtn;

    var k = moduleArg,
      aa,
      ba,
      ea = new Promise((a, b) => {
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
    var t = k.printErr || console.error.bind(console);
    Object.assign(k, fa);
    fa = null;
    k.thisProgram && (ha = k.thisProgram);
    var ja = k.wasmBinary,
      ka,
      la = !1,
      ma,
      w,
      x,
      y,
      z,
      C,
      D,
      na,
      oa;
    function pa() {
      var a = ka.buffer;
      k.HEAP8 = w = new Int8Array(a);
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
      ua = null,
      G = null;
    function va(a) {
      k.onAbort?.(a);
      a = 'Aborted(' + a + ')';
      t(a);
      la = !0;
      a = new WebAssembly.RuntimeError(a + '. Build with -sASSERTIONS for more info.');
      ba(a);
      throw a;
    }
    var wa = (a) => a.startsWith('data:application/octet-stream;base64,'),
      xa;
    function ya(a) {
      if (a == xa && ja) return new Uint8Array(ja);
      throw 'both async and sync fetching of the wasm failed';
    }
    function za(a) {
      return ja
        ? Promise.resolve().then(() => ya(a))
        : ia(a).then(
            (b) => new Uint8Array(b),
            () => ya(a),
          );
    }
    function Aa(a, b, c) {
      return za(a)
        .then((d) => WebAssembly.instantiate(d, b))
        .then(c, (d) => {
          t(`failed to asynchronously prepare wasm: ${d}`);
          va(d);
        });
    }
    function Ba(a, b) {
      var c = xa;
      return ja || 'function' != typeof WebAssembly.instantiateStreaming || wa(c) || 'function' != typeof fetch
        ? Aa(c, a, b)
        : fetch(c, { credentials: 'same-origin' }).then((d) =>
            WebAssembly.instantiateStreaming(d, a).then(b, function (e) {
              t(`wasm streaming compile failed: ${e}`);
              t('falling back to ArrayBuffer instantiation');
              return Aa(c, a, b);
            }),
          );
    }
    class Ca {
      name = 'ExitStatus';
      constructor(a) {
        this.message = `Program terminated with exit(${a})`;
        this.status = a;
      }
    }
    var Da = (a) => {
        for (; 0 < a.length; ) a.shift()(k);
      },
      Ea = k.noExitRuntime || !0,
      Fa = 'undefined' != typeof TextDecoder ? new TextDecoder() : void 0,
      Ga = (a = 0, b = NaN) => {
        var c = x,
          d = a + b;
        for (b = a; c[b] && !(b >= d); ) ++b;
        if (16 < b - a && c.buffer && Fa) return Fa.decode(c.subarray(a, b));
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
    class Ha {
      constructor(a) {
        this.va = a - 24;
      }
    }
    var Ia = 0,
      Ja = 0,
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
      Ka = {},
      La = (a) => {
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
      Ma = {},
      L,
      N = (a, b, c) => {
        function d(g) {
          g = c(g);
          if (g.length !== a.length) throw new L('Mismatched type converter count');
          for (var l = 0; l < a.length; ++l) M(a[l], g[l]);
        }
        a.forEach((g) => (Ma[g] = b));
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
      Na,
      O = (a) => {
        for (var b = ''; x[a]; ) b += Na[x[a++]];
        return b;
      },
      P;
    function Pa(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new P(`type "${d}" must have a positive integer typeid pointer`);
      if (K.hasOwnProperty(a)) {
        if (c.$a) return;
        throw new P(`Cannot register type '${d}' twice`);
      }
      K[a] = b;
      delete Ma[a];
      J.hasOwnProperty(a) && ((b = J[a]), delete J[a], b.forEach((e) => e()));
    }
    function M(a, b, c = {}) {
      return Pa(a, b, c);
    }
    var Qa = (a) => {
        throw new P(a.ta.wa.ua.name + ' instance already deleted');
      },
      Ra = !1,
      Sa = () => {},
      Ta = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.za) return null;
        a = Ta(a, b, c.za);
        return null === a ? null : c.Ta(a);
      },
      Ua = {},
      Va = {},
      Wa = (a, b) => {
        if (void 0 === b) throw new P('ptr should not be undefined');
        for (; a.za; ) (b = a.Ja(b)), (a = a.za);
        return Va[b];
      },
      Xa = (a, b) => {
        if (!b.wa || !b.va) throw new L('makeClassHandle requires ptr and ptrType');
        if (!!b.Aa !== !!b.ya) throw new L('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return Q(Object.create(a, { ta: { value: b, writable: !0 } }));
      },
      Q = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (Q = (b) => b), a;
        Ra = new FinalizationRegistry((b) => {
          b = b.ta;
          --b.count.value;
          0 === b.count.value && (b.ya ? b.Aa.Da(b.ya) : b.wa.ua.Da(b.va));
        });
        Q = (b) => {
          var c = b.ta;
          c.ya && Ra.register(b, { ta: c }, b);
          return b;
        };
        Sa = (b) => {
          Ra.unregister(b);
        };
        return Q(a);
      },
      Ya = [];
    function Za() {}
    var R = (a, b) => Object.defineProperty(b, 'name', { value: a }),
      $a = (a, b, c) => {
        if (void 0 === a[b].xa) {
          var d = a[b];
          a[b] = function (...e) {
            if (!a[b].xa.hasOwnProperty(e.length))
              throw new P(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].xa})!`,
              );
            return a[b].xa[e.length].apply(this, e);
          };
          a[b].xa = [];
          a[b].xa[d.Ga] = d;
        }
      },
      ab = (a, b, c) => {
        if (k.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== k[a].xa && void 0 !== k[a].xa[c]))
            throw new P(`Cannot register public name '${a}' twice`);
          $a(k, a, a);
          if (k[a].xa.hasOwnProperty(c))
            throw new P(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          k[a].xa[c] = b;
        } else (k[a] = b), (k[a].Ga = c);
      },
      bb = (a) => {
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function cb(a, b, c, d, e, f, h, g) {
      this.name = a;
      this.constructor = b;
      this.Fa = c;
      this.Da = d;
      this.za = e;
      this.Va = f;
      this.Ja = h;
      this.Ta = g;
      this.bb = [];
    }
    var db = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.Ja) throw new P(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.Ja(a);
        b = b.za;
      }
      return a;
    };
    function eb(a, b) {
      if (null === b) {
        if (this.Ma) throw new P(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.ta) throw new P(`Cannot pass "${fb(b)}" as a ${this.name}`);
      if (!b.ta.va) throw new P(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return db(b.ta.va, b.ta.wa.ua, this.ua);
    }
    function gb(a, b) {
      if (null === b) {
        if (this.Ma) throw new P(`null is not a valid ${this.name}`);
        if (this.La) {
          var c = this.Na();
          null !== a && a.push(this.Da, c);
          return c;
        }
        return 0;
      }
      if (!b || !b.ta) throw new P(`Cannot pass "${fb(b)}" as a ${this.name}`);
      if (!b.ta.va) throw new P(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.Ka && b.ta.wa.Ka)
        throw new P(
          `Cannot convert argument of type ${b.ta.Aa ? b.ta.Aa.name : b.ta.wa.name} to parameter type ${this.name}`,
        );
      c = db(b.ta.va, b.ta.wa.ua, this.ua);
      if (this.La) {
        if (void 0 === b.ta.ya) throw new P('Passing raw pointer to smart pointer is illegal');
        switch (this.hb) {
          case 0:
            if (b.ta.Aa === this) c = b.ta.ya;
            else
              throw new P(
                `Cannot convert argument of type ${b.ta.Aa ? b.ta.Aa.name : b.ta.wa.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            c = b.ta.ya;
            break;
          case 2:
            if (b.ta.Aa === this) c = b.ta.ya;
            else {
              var d = b.clone();
              c = this.cb(
                c,
                hb(() => d['delete']()),
              );
              null !== a && a.push(this.Da, c);
            }
            break;
          default:
            throw new P('Unsupporting sharing policy');
        }
      }
      return c;
    }
    function ib(a, b) {
      if (null === b) {
        if (this.Ma) throw new P(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.ta) throw new P(`Cannot pass "${fb(b)}" as a ${this.name}`);
      if (!b.ta.va) throw new P(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.ta.wa.Ka) throw new P(`Cannot convert argument of type ${b.ta.wa.name} to parameter type ${this.name}`);
      return db(b.ta.va, b.ta.wa.ua, this.ua);
    }
    function jb(a, b, c, d, e, f, h, g, l, m, n) {
      this.name = a;
      this.ua = b;
      this.Ma = c;
      this.Ka = d;
      this.La = e;
      this.ab = f;
      this.hb = h;
      this.Ra = g;
      this.Na = l;
      this.cb = m;
      this.Da = n;
      e || void 0 !== b.za ? (this.toWireType = gb) : ((this.toWireType = d ? eb : ib), (this.Ca = null));
    }
    var kb = (a, b, c) => {
        if (!k.hasOwnProperty(a)) throw new L('Replacing nonexistent public symbol');
        void 0 !== k[a].xa && void 0 !== c ? (k[a].xa[c] = b) : ((k[a] = b), (k[a].Ga = c));
      },
      S,
      lb = (a, b, c = []) => {
        a.includes('j') ? ((a = a.replace(/p/g, 'i')), (b = (0, k['dynCall_' + a])(b, ...c))) : (b = S.get(b)(...c));
        return b;
      },
      mb =
        (a, b) =>
        (...c) =>
          lb(a, b, c),
      T = (a, b) => {
        a = O(a);
        var c = a.includes('j') ? mb(a, b) : S.get(b);
        if ('function' != typeof c) throw new P(`unknown function pointer with signature ${a}: ${b}`);
        return c;
      },
      nb,
      pb = (a) => {
        a = ob(a);
        var b = O(a);
        U(a);
        return b;
      },
      qb = (a, b) => {
        function c(f) {
          e[f] || K[f] || (Ma[f] ? Ma[f].forEach(c) : (d.push(f), (e[f] = !0)));
        }
        var d = [],
          e = {};
        b.forEach(c);
        throw new nb(`${a}: ` + d.map(pb).join([', ']));
      },
      rb = (a, b) => {
        for (var c = [], d = 0; d < a; d++) c.push(D[(b + 4 * d) >> 2]);
        return c;
      };
    function sb(a) {
      for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].Ca) return !0;
      return !1;
    }
    function tb(a, b, c, d, e) {
      var f = b.length;
      if (2 > f) throw new P("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var h = null !== b[1] && null !== c,
        g = sb(b),
        l = 'void' !== b[0].name,
        m = f - 2,
        n = Array(m),
        q = [],
        r = [];
      return R(a, function (...A) {
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
            null !== b[v].Ca && b[v].Ca(E);
          }
        u = l ? b[0].fromWireType(A) : void 0;
        return u;
      });
    }
    var ub = (a) => {
        a = a.trim();
        const b = a.indexOf('(');
        return -1 !== b ? a.substr(0, b) : a;
      },
      vb = [],
      V = [],
      xb = (a) => {
        9 < a && 0 === --V[a + 1] && ((V[a] = void 0), vb.push(a));
      },
      yb = (a) => {
        if (!a) throw new P('Cannot use deleted val. handle = ' + a);
        return V[a];
      },
      hb = (a) => {
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
            const b = vb.pop() || V.length;
            V[b] = a;
            V[b + 1] = 1;
            return b;
        }
      },
      zb = {
        name: 'emscripten::val',
        fromWireType: (a) => {
          var b = yb(a);
          xb(a);
          return b;
        },
        toWireType: (a, b) => hb(b),
        Ba: 8,
        readValueFromPointer: I,
        Ca: null,
      },
      Ab = (a, b, c) => {
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
      Bb = (a, b) => {
        var c = K[a];
        if (void 0 === c) throw ((a = `${b} has unknown type ${pb(a)}`), new P(a));
        return c;
      },
      fb = (a) => {
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
            return c ? (d) => w[d] : (d) => x[d];
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
        c ??= 2147483647;
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
      Lb = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          b += 4;
        }
        return b;
      },
      Mb = 0,
      Nb = [],
      Ob = (a) => {
        var b = Nb.length;
        Nb.push(a);
        return b;
      },
      Pb = (a, b) => {
        for (var c = Array(a), d = 0; d < a; ++d) c[d] = Bb(D[(b + 4 * d) >> 2], 'parameter ' + d);
        return c;
      },
      Qb = Reflect.construct,
      Rb = {},
      Sb = (a) => {
        if (!(a instanceof Ca || 'unwind' == a)) throw a;
      },
      Tb = (a) => {
        ma = a;
        Ea || 0 < Mb || (k.onExit?.(a), (la = !0));
        throw new Ca(a);
      },
      Ub = (a) => {
        if (!la)
          try {
            if ((a(), !(Ea || 0 < Mb)))
              try {
                (ma = a = ma), Tb(a);
              } catch (b) {
                Sb(b);
              }
          } catch (b) {
            Sb(b);
          }
      },
      Vb = {},
      Xb = () => {
        if (!Wb) {
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
          for (b in Vb) void 0 === Vb[b] ? delete a[b] : (a[b] = Vb[b]);
          var c = [];
          for (b in a) c.push(`${b}=${a[b]}`);
          Wb = c;
        }
        return Wb;
      },
      Wb,
      Yb = () => {
        if ('object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
          return (a) => crypto.getRandomValues(a);
        va('initRandomDevice');
      },
      Zb = (a) => (Zb = Yb())(a);
    L = k.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    for (var $b = Array(256), ac = 0; 256 > ac; ++ac) $b[ac] = String.fromCharCode(ac);
    Na = $b;
    P = k.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    Object.assign(Za.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof Za && a instanceof Za)) return !1;
        var b = this.ta.wa.ua,
          c = this.ta.va;
        a.ta = a.ta;
        var d = a.ta.wa.ua;
        for (a = a.ta.va; b.za; ) (c = b.Ja(c)), (b = b.za);
        for (; d.za; ) (a = d.Ja(a)), (d = d.za);
        return b === d && c === a;
      },
      clone: function () {
        this.ta.va || Qa(this);
        if (this.ta.Ia) return (this.ta.count.value += 1), this;
        var a = Q,
          b = Object,
          c = b.create,
          d = Object.getPrototypeOf(this),
          e = this.ta;
        a = a(
          c.call(b, d, {
            ta: { value: { count: e.count, Ha: e.Ha, Ia: e.Ia, va: e.va, wa: e.wa, ya: e.ya, Aa: e.Aa } },
          }),
        );
        a.ta.count.value += 1;
        a.ta.Ha = !1;
        return a;
      },
      ['delete']() {
        this.ta.va || Qa(this);
        if (this.ta.Ha && !this.ta.Ia) throw new P('Object already scheduled for deletion');
        Sa(this);
        var a = this.ta;
        --a.count.value;
        0 === a.count.value && (a.ya ? a.Aa.Da(a.ya) : a.wa.ua.Da(a.va));
        this.ta.Ia || ((this.ta.ya = void 0), (this.ta.va = void 0));
      },
      isDeleted: function () {
        return !this.ta.va;
      },
      deleteLater: function () {
        this.ta.va || Qa(this);
        if (this.ta.Ha && !this.ta.Ia) throw new P('Object already scheduled for deletion');
        Ya.push(this);
        this.ta.Ha = !0;
        return this;
      },
    });
    Object.assign(jb.prototype, {
      Wa(a) {
        this.Ra && (a = this.Ra(a));
        return a;
      },
      Pa(a) {
        this.Da?.(a);
      },
      Ba: 8,
      readValueFromPointer: I,
      fromWireType: function (a) {
        function b() {
          return this.La
            ? Xa(this.ua.Fa, { wa: this.ab, va: c, Aa: this, ya: a })
            : Xa(this.ua.Fa, { wa: this, va: a });
        }
        var c = this.Wa(a);
        if (!c) return this.Pa(a), null;
        var d = Wa(this.ua, c);
        if (void 0 !== d) {
          if (0 === d.ta.count.value) return (d.ta.va = c), (d.ta.ya = a), d.clone();
          d = d.clone();
          this.Pa(a);
          return d;
        }
        d = this.ua.Va(c);
        d = Ua[d];
        if (!d) return b.call(this);
        d = this.Ka ? d.Sa : d.pointerType;
        var e = Ta(c, this.ua, d.ua);
        return null === e
          ? b.call(this)
          : this.La
          ? Xa(d.ua.Fa, { wa: d, va: e, Aa: this, ya: a })
          : Xa(d.ua.Fa, { wa: d, va: e });
      },
    });
    nb = k.UnboundTypeError = ((a, b) => {
      var c = R(b, function (d) {
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
    k.count_emval_handles = () => V.length / 2 - 5 - vb.length;
    var mc = {
        c: (a, b, c, d) =>
          va(
            `Assertion failed: ${a ? Ga(a) : ''}, at: ` +
              [b ? (b ? Ga(b) : '') : 'unknown filename', c, d ? (d ? Ga(d) : '') : 'unknown function'],
          ),
        m: (a, b, c) => {
          var d = new Ha(a);
          D[(d.va + 16) >> 2] = 0;
          D[(d.va + 4) >> 2] = b;
          D[(d.va + 8) >> 2] = c;
          Ia = a;
          Ja++;
          throw Ia;
        },
        M: () => {},
        J: () => {},
        K: () => {},
        O: function () {},
        L: () => {},
        Q: () => va(''),
        v: (a) => {
          var b = Ka[a];
          delete Ka[a];
          var c = b.Na,
            d = b.Da,
            e = b.Qa,
            f = e.map((h) => h.Za).concat(e.map((h) => h.fb));
          N([a], f, (h) => {
            var g = {};
            e.forEach((l, m) => {
              var n = h[m],
                q = l.Xa,
                r = l.Ya,
                A = h[m + e.length],
                u = l.eb,
                v = l.gb;
              g[l.Ua] = {
                read: (E) => n.fromWireType(q(r, E)),
                write: (E, ca) => {
                  var B = [];
                  u(v, E, A.toWireType(B, ca));
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
                Ba: 8,
                readValueFromPointer: I,
                Ca: d,
              },
            ];
          });
        },
        C: () => {},
        V: (a, b, c, d) => {
          b = O(b);
          M(a, {
            name: b,
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, f) {
              return f ? c : d;
            },
            Ba: 8,
            readValueFromPointer: function (e) {
              return this.fromWireType(x[e]);
            },
            Ca: null,
          });
        },
        r: (a, b, c, d, e, f, h, g, l, m, n, q, r) => {
          n = O(n);
          f = T(e, f);
          g &&= T(h, g);
          m &&= T(l, m);
          r = T(q, r);
          var A = bb(n);
          ab(A, function () {
            qb(`Cannot construct ${n} due to unbound types`, [d]);
          });
          N([a, b, c], d ? [d] : [], (u) => {
            u = u[0];
            if (d) {
              var v = u.ua;
              var E = v.Fa;
            } else E = Za.prototype;
            u = R(n, function (...Oa) {
              if (Object.getPrototypeOf(this) !== ca) throw new P("Use 'new' to construct " + n);
              if (void 0 === B.Ea) throw new P(n + ' has no accessible constructor');
              var wb = B.Ea[Oa.length];
              if (void 0 === wb)
                throw new P(
                  `Tried to invoke ctor of ${n} with invalid number of parameters (${
                    Oa.length
                  }) - expected (${Object.keys(B.Ea).toString()}) parameters instead!`,
                );
              return wb.apply(this, Oa);
            });
            var ca = Object.create(E, { constructor: { value: u } });
            u.prototype = ca;
            var B = new cb(n, u, ca, r, v, f, g, m);
            if (B.za) {
              var da;
              (da = B.za).Oa ?? (da.Oa = []);
              B.za.Oa.push(B);
            }
            v = new jb(n, B, !0, !1, !1);
            da = new jb(n + '*', B, !1, !1, !1);
            E = new jb(n + ' const*', B, !1, !0, !1);
            Ua[a] = { pointerType: da, Sa: E };
            kb(A, u);
            return [v, da, E];
          });
        },
        q: (a, b, c, d, e, f) => {
          var h = rb(b, c);
          e = T(d, e);
          N([], [a], (g) => {
            g = g[0];
            var l = `constructor ${g.name}`;
            void 0 === g.ua.Ea && (g.ua.Ea = []);
            if (void 0 !== g.ua.Ea[b - 1])
              throw new P(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  g.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            g.ua.Ea[b - 1] = () => {
              qb(`Cannot construct ${g.name} due to unbound types`, h);
            };
            N([], h, (m) => {
              m.splice(1, 0, null);
              g.ua.Ea[b - 1] = tb(l, m, null, e, f);
              return [];
            });
            return [];
          });
        },
        f: (a, b, c, d, e, f, h, g) => {
          var l = rb(c, d);
          b = O(b);
          b = ub(b);
          f = T(e, f);
          N([], [a], (m) => {
            function n() {
              qb(`Cannot call ${q} due to unbound types`, l);
            }
            m = m[0];
            var q = `${m.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            g && m.ua.bb.push(b);
            var r = m.ua.Fa,
              A = r[b];
            void 0 === A || (void 0 === A.xa && A.className !== m.name && A.Ga === c - 2)
              ? ((n.Ga = c - 2), (n.className = m.name), (r[b] = n))
              : ($a(r, b, q), (r[b].xa[c - 2] = n));
            N([], l, (u) => {
              u = tb(q, u, m, f, h);
              void 0 === r[b].xa ? ((u.Ga = c - 2), (r[b] = u)) : (r[b].xa[c - 2] = u);
              return [];
            });
            return [];
          });
        },
        U: (a) => M(a, zb),
        x: (a, b, c, d) => {
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
            Ba: 8,
            readValueFromPointer: Ab(b, c, d),
            Ca: null,
          });
          ab(b, e);
        },
        k: (a, b, c) => {
          var d = Bb(a, 'enum');
          b = O(b);
          a = d.constructor;
          d = Object.create(d.constructor.prototype, {
            value: { value: c },
            constructor: { value: R(`${d.name}_${b}`, function () {}) },
          });
          a.values[c] = d;
          a[b] = d;
        },
        z: (a, b, c) => {
          b = O(b);
          M(a, {
            name: b,
            fromWireType: (d) => d,
            toWireType: (d, e) => e,
            Ba: 8,
            readValueFromPointer: Cb(b, c),
            Ca: null,
          });
        },
        u: (a, b, c, d, e, f) => {
          var h = rb(b, c);
          a = O(a);
          a = ub(a);
          e = T(d, e);
          ab(
            a,
            function () {
              qb(`Cannot call ${a} due to unbound types`, h);
            },
            b - 1,
          );
          N([], h, (g) => {
            kb(a, tb(a, [g[0], null].concat(g.slice(1)), null, e, f), b - 1);
            return [];
          });
        },
        l: (a, b, c, d, e) => {
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
          M(a, { name: b, fromWireType: e, toWireType: h, Ba: 8, readValueFromPointer: Db(b, c, 0 !== d), Ca: null });
        },
        h: (a, b, c) => {
          function d(f) {
            return new e(w.buffer, D[(f + 4) >> 2], D[f >> 2]);
          }
          var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][
            b
          ];
          c = O(c);
          M(a, { name: c, fromWireType: d, Ba: 8, readValueFromPointer: d }, { $a: !0 });
        },
        t: (a) => {
          M(a, Eb);
        },
        $: (a, b, c, d, e, f, h, g, l, m, n, q) => {
          c = O(c);
          f = T(e, f);
          g = T(h, g);
          m = T(l, m);
          q = T(n, q);
          N([a], [b], (r) => {
            r = r[0];
            return [new jb(c, r.ua, !1, !1, !0, r, d, f, g, m, q)];
          });
        },
        A: (a, b) => {
          b = O(b);
          var c = 'std::string' === b;
          M(a, {
            name: b,
            fromWireType: function (d) {
              var e = D[d >> 2],
                f = d + 4;
              if (c)
                for (var h = f, g = 0; g <= e; ++g) {
                  var l = f + g;
                  if (g == e || 0 == x[l]) {
                    h = h ? Ga(h, l - h) : '';
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
                throw new P('Cannot pass non-string to std::string');
              if (c && h)
                for (var g = (f = 0); g < e.length; ++g) {
                  var l = e.charCodeAt(g);
                  127 >= l ? f++ : 2047 >= l ? (f += 2) : 55296 <= l && 57343 >= l ? ((f += 4), ++g) : (f += 3);
                }
              else f = e.length;
              g = bc(4 + f + 1);
              l = g + 4;
              D[g >> 2] = f;
              if (c && h) H(e, l, f + 1);
              else if (h)
                for (h = 0; h < f; ++h) {
                  var m = e.charCodeAt(h);
                  if (255 < m) throw (U(l), new P('String has UTF-16 code units that do not fit in 8 bits'));
                  x[l + h] = m;
                }
              else for (h = 0; h < f; ++h) x[l + h] = e[h];
              null !== d && d.push(U, g);
              return g;
            },
            Ba: 8,
            readValueFromPointer: I,
            Ca(d) {
              U(d);
            },
          });
        },
        s: (a, b, c) => {
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
              for (var l = D[g >> 2], m, n = g + 4, q = 0; q <= l; ++q) {
                var r = g + 4 + q * b;
                if (q == l || 0 == h(r))
                  (n = d(n, r - n)), void 0 === m ? (m = n) : ((m += String.fromCharCode(0)), (m += n)), (n = r + b);
              }
              U(g);
              return m;
            },
            toWireType: (g, l) => {
              if ('string' != typeof l) throw new P(`Cannot pass non-string to C++ string type ${c}`);
              var m = f(l),
                n = bc(4 + m + b);
              D[n >> 2] = m / b;
              e(l, n + 4, m + b);
              null !== g && g.push(U, n);
              return n;
            },
            Ba: 8,
            readValueFromPointer: I,
            Ca(g) {
              U(g);
            },
          });
        },
        w: (a, b, c, d, e, f) => {
          Ka[a] = { name: O(b), Na: T(c, d), Da: T(e, f), Qa: [] };
        },
        j: (a, b, c, d, e, f, h, g, l, m) => {
          Ka[a].Qa.push({ Ua: O(b), Za: c, Xa: T(d, e), Ya: f, fb: h, eb: T(g, l), gb: m });
        },
        W: (a, b) => {
          b = O(b);
          M(a, { ib: !0, name: b, Ba: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        H: () => {
          Ea = !1;
          Mb = 0;
        },
        D: () => {
          throw Infinity;
        },
        Z: (a, b, c, d) => {
          a = Nb[a];
          b = yb(b);
          return a(null, b, c, d);
        },
        B: xb,
        Y: (a, b, c) => {
          var d = Pb(a, b),
            e = d.shift();
          a--;
          var f = Array(a);
          b = `methodCaller<(${d.map((h) => h.name).join(', ')}) => ${e.name}>`;
          return Ob(
            R(b, (h, g, l, m) => {
              for (var n = 0, q = 0; q < a; ++q) (f[q] = d[q].readValueFromPointer(m + n)), (n += d[q].Ba);
              g = 1 === c ? Qb(g, f) : g.apply(h, f);
              h = [];
              g = e.toWireType(h, g);
              h.length && (D[l >> 2] = hb(h));
              return g;
            }),
          );
        },
        _: (a) => {
          9 < a && (V[a + 1] += 1);
        },
        X: (a) => {
          var b = yb(a);
          La(b);
          xb(a);
        },
        o: (a, b) => {
          a = Bb(a, '_emval_take_value');
          a = a.readValueFromPointer(b);
          return hb(a);
        },
        E: (a, b) => {
          Rb[a] && (clearTimeout(Rb[a].id), delete Rb[a]);
          if (!b) return 0;
          var c = setTimeout(() => {
            delete Rb[a];
            Ub(() => cc(a, performance.now()));
          }, b);
          Rb[a] = { id: c, jb: b };
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
          e < f ? (H(a, c, 17), H(b, d, 17)) : (H(a, d, 17), H(b, c, 17));
        },
        aa: () => performance.now(),
        G: (a) => {
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
        S: (a, b) => {
          var c = 0;
          Xb().forEach((d, e) => {
            var f = b + c;
            e = D[(a + 4 * e) >> 2] = f;
            for (f = 0; f < d.length; ++f) w[e++] = d.charCodeAt(f);
            w[e] = 0;
            c += d.length + 1;
          });
          return 0;
        },
        T: (a, b) => {
          var c = Xb();
          D[a >> 2] = c.length;
          var d = 0;
          c.forEach((e) => (d += e.length + 1));
          D[b >> 2] = d;
          return 0;
        },
        P: () => 52,
        N: () => 52,
        i: dc,
        d: ec,
        e: fc,
        p: gc,
        y: hc,
        b: ic,
        a: jc,
        g: kc,
        n: lc,
        R: Tb,
        I: (a, b) => {
          Zb(x.subarray(a, a + b));
          return 0;
        },
      },
      W = (function () {
        function a(c) {
          W = c.exports;
          ka = W.ba;
          pa();
          S = W.fa;
          ra.unshift(W.ca);
          F--;
          k.monitorRunDependencies?.(F);
          0 == F && (null !== ua && (clearInterval(ua), (ua = null)), G && ((c = G), (G = null), c()));
          return W;
        }
        F++;
        k.monitorRunDependencies?.(F);
        var b = { a: mc };
        if (k.instantiateWasm)
          try {
            return k.instantiateWasm(b, a);
          } catch (c) {
            t(`Module.instantiateWasm callback failed with error: ${c}`), ba(c);
          }
        xa ??= wa('DotLottiePlayer.wasm')
          ? 'DotLottiePlayer.wasm'
          : k.locateFile
          ? k.locateFile('DotLottiePlayer.wasm', p)
          : p + 'DotLottiePlayer.wasm';
        Ba(b, function (c) {
          a(c.instance);
        }).catch(ba);
        return {};
      })(),
      bc = (a) => (bc = W.da)(a),
      ob = (a) => (ob = W.ea)(a),
      U = (a) => (U = W.ga)(a),
      cc = (a, b) => (cc = W.ha)(a, b),
      X = (a, b) => (X = W.ia)(a, b),
      Y = (a) => (Y = W.ja)(a),
      Z = () => (Z = W.ka)();
    k.dynCall_iijj = (a, b, c, d, e, f) => (k.dynCall_iijj = W.la)(a, b, c, d, e, f);
    k.dynCall_vijj = (a, b, c, d, e, f) => (k.dynCall_vijj = W.ma)(a, b, c, d, e, f);
    k.dynCall_jiii = (a, b, c, d) => (k.dynCall_jiii = W.na)(a, b, c, d);
    k.dynCall_jii = (a, b, c) => (k.dynCall_jii = W.oa)(a, b, c);
    k.dynCall_viijii = (a, b, c, d, e, f, h) => (k.dynCall_viijii = W.pa)(a, b, c, d, e, f, h);
    k.dynCall_iiiiij = (a, b, c, d, e, f, h) => (k.dynCall_iiiiij = W.qa)(a, b, c, d, e, f, h);
    k.dynCall_iiiiijj = (a, b, c, d, e, f, h, g, l) => (k.dynCall_iiiiijj = W.ra)(a, b, c, d, e, f, h, g, l);
    k.dynCall_iiiiiijj = (a, b, c, d, e, f, h, g, l, m) => (k.dynCall_iiiiiijj = W.sa)(a, b, c, d, e, f, h, g, l, m);
    function jc(a, b, c) {
      var d = Z();
      try {
        S.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function ic(a, b) {
      var c = Z();
      try {
        S.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function fc(a, b, c, d) {
      var e = Z();
      try {
        return S.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function ec(a, b, c) {
      var d = Z();
      try {
        return S.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function dc(a, b) {
      var c = Z();
      try {
        return S.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function gc(a, b, c, d, e, f) {
      var h = Z();
      try {
        return S.get(a)(b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function lc(a, b, c, d, e) {
      var f = Z();
      try {
        S.get(a)(b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function kc(a, b, c, d) {
      var e = Z();
      try {
        S.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function hc(a) {
      var b = Z();
      try {
        S.get(a)();
      } catch (c) {
        Y(b);
        if (c !== c + 0) throw c;
        X(1, 0);
      }
    }
    var nc;
    G = function oc() {
      nc || pc();
      nc || (G = oc);
    };
    function pc() {
      function a() {
        if (!nc && ((nc = !0), (k.calledRun = !0), !la)) {
          Da(ra);
          aa(k);
          k.onRuntimeInitialized?.();
          if (k.postRun)
            for ('function' == typeof k.postRun && (k.postRun = [k.postRun]); k.postRun.length; ) {
              var b = k.postRun.shift();
              sa.unshift(b);
            }
          Da(sa);
        }
      }
      if (!(0 < F)) {
        if (k.preRun) for ('function' == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; ) ta();
        Da(qa);
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
    pc();
    moduleRtn = ea;

    return moduleRtn;
  };
})();
export default createDotLottiePlayerModule;
