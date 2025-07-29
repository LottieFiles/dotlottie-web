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
      da = Object.assign({}, k),
      ea = './this.program',
      q = '',
      fa;
    'undefined' != typeof document && document.currentScript && (q = document.currentScript.src);
    _scriptName && (q = _scriptName);
    q.startsWith('blob:') ? (q = '') : (q = q.substr(0, q.replace(/[?#].*/, '').lastIndexOf('/') + 1));
    fa = async (a) => {
      a = await fetch(a, { credentials: 'same-origin' });
      if (a.ok) return a.arrayBuffer();
      throw Error(a.status + ' : ' + a.url);
    };
    var ja = k.print || console.log.bind(console),
      r = k.printErr || console.error.bind(console);
    Object.assign(k, da);
    da = null;
    k.thisProgram && (ea = k.thisProgram);
    var ka = k.wasmBinary,
      la,
      ma = !1,
      na,
      u,
      x,
      y,
      z,
      A,
      B,
      oa,
      pa;
    function qa() {
      var a = la.buffer;
      k.HEAP8 = u = new Int8Array(a);
      k.HEAP16 = y = new Int16Array(a);
      k.HEAPU8 = x = new Uint8Array(a);
      k.HEAPU16 = z = new Uint16Array(a);
      k.HEAP32 = A = new Int32Array(a);
      k.HEAPU32 = B = new Uint32Array(a);
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
    var C = 0,
      D = null;
    function va(a) {
      k.onAbort?.(a);
      a = 'Aborted(' + a + ')';
      r(a);
      ma = !0;
      a = new WebAssembly.RuntimeError(a + '. Build with -sASSERTIONS for more info.');
      ba(a);
      throw a;
    }
    var wa = (a) => a.startsWith('data:application/octet-stream;base64,'),
      xa;
    async function ya(a) {
      if (!ka)
        try {
          var b = await fa(a);
          return new Uint8Array(b);
        } catch {}
      if (a == xa && ka) a = new Uint8Array(ka);
      else throw 'both async and sync fetching of the wasm failed';
      return a;
    }
    async function za(a, b) {
      try {
        var c = await ya(a);
        return await WebAssembly.instantiate(c, b);
      } catch (d) {
        r(`failed to asynchronously prepare wasm: ${d}`), va(d);
      }
    }
    async function Aa(a) {
      var b = xa;
      if (!ka && 'function' == typeof WebAssembly.instantiateStreaming && !wa(b) && 'function' == typeof fetch)
        try {
          var c = fetch(b, { credentials: 'same-origin' });
          return await WebAssembly.instantiateStreaming(c, a);
        } catch (d) {
          r(`wasm streaming compile failed: ${d}`), r('falling back to ArrayBuffer instantiation');
        }
      return za(b, a);
    }
    class Ba {
      name = 'ExitStatus';
      constructor(a) {
        this.message = `Program terminated with exit(${a})`;
        this.status = a;
      }
    }
    var Ca = (a) => {
        for (; 0 < a.length; ) a.shift()(k);
      },
      Da = k.noExitRuntime || !0,
      Ea = 'undefined' != typeof TextDecoder ? new TextDecoder() : void 0,
      G = (a, b = 0, c = NaN) => {
        var d = b + c;
        for (c = b; a[c] && !(c >= d); ) ++c;
        if (16 < c - b && a.buffer && Ea) return Ea.decode(a.subarray(b, c));
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
      },
      I = 0;
    class Fa {
      constructor(a) {
        this.Pa = a - 24;
      }
    }
    var Ha = () => {
        var a = [],
          b = I;
        if (!b) return J(0), 0;
        var c = new Fa(b);
        B[(c.Pa + 16) >> 2] = b;
        var d = B[(c.Pa + 4) >> 2];
        if (!d) return J(0), b;
        for (var e of a) {
          if (0 === e || e === d) break;
          if (Ga(e, d, c.Pa + 16)) return J(e), b;
        }
        J(d);
        return b;
      },
      Ia = 0,
      K = (a, b, c) => {
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
      Ja = {},
      Ka = (a) => {
        for (; a.length; ) {
          var b = a.pop();
          a.pop()(b);
        }
      };
    function La(a) {
      return this.fromWireType(B[a >> 2]);
    }
    var L = {},
      M = {},
      Ma = {},
      Na,
      O = (a, b, c) => {
        function d(g) {
          g = c(g);
          if (g.length !== a.length) throw new Na('Mismatched type converter count');
          for (var l = 0; l < a.length; ++l) N(a[l], g[l]);
        }
        a.forEach((g) => (Ma[g] = b));
        var e = Array(b.length),
          f = [],
          h = 0;
        b.forEach((g, l) => {
          M.hasOwnProperty(g)
            ? (e[l] = M[g])
            : (f.push(g),
              L.hasOwnProperty(g) || (L[g] = []),
              L[g].push(() => {
                e[l] = M[g];
                ++h;
                h === f.length && d(e);
              }));
        });
        0 === f.length && d(e);
      },
      Oa,
      P = (a) => {
        for (var b = ''; x[a]; ) b += Oa[x[a++]];
        return b;
      },
      Q;
    function Qa(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new Q(`type "${d}" must have a positive integer typeid pointer`);
      if (M.hasOwnProperty(a)) {
        if (c.vb) return;
        throw new Q(`Cannot register type '${d}' twice`);
      }
      M[a] = b;
      delete Ma[a];
      L.hasOwnProperty(a) && ((b = L[a]), delete L[a], b.forEach((e) => e()));
    }
    function N(a, b, c = {}) {
      return Qa(a, b, c);
    }
    var Ra = (a) => {
        throw new Q(a.Oa.Ra.Qa.name + ' instance already deleted');
      },
      Sa = !1,
      Ta = () => {},
      Ua = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.Ua) return null;
        a = Ua(a, b, c.Ua);
        return null === a ? null : c.ob(a);
      },
      Va = {},
      Wa = {},
      Xa = (a, b) => {
        if (void 0 === b) throw new Q('ptr should not be undefined');
        for (; a.Ua; ) (b = a.eb(b)), (a = a.Ua);
        return Wa[b];
      },
      Za = (a, b) => {
        if (!b.Ra || !b.Pa) throw new Na('makeClassHandle requires ptr and ptrType');
        if (!!b.Va !== !!b.Ta) throw new Na('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return Ya(Object.create(a, { Oa: { value: b, writable: !0 } }));
      },
      Ya = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (Ya = (b) => b), a;
        Sa = new FinalizationRegistry((b) => {
          b = b.Oa;
          --b.count.value;
          0 === b.count.value && (b.Ta ? b.Va.Ya(b.Ta) : b.Ra.Qa.Ya(b.Pa));
        });
        Ya = (b) => {
          var c = b.Oa;
          c.Ta && Sa.register(b, { Oa: c }, b);
          return b;
        };
        Ta = (b) => {
          Sa.unregister(b);
        };
        return Ya(a);
      },
      $a = [];
    function ab() {}
    var bb = (a, b) => Object.defineProperty(b, 'name', { value: a }),
      cb = (a, b, c) => {
        if (void 0 === a[b].Sa) {
          var d = a[b];
          a[b] = function (...e) {
            if (!a[b].Sa.hasOwnProperty(e.length))
              throw new Q(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].Sa})!`,
              );
            return a[b].Sa[e.length].apply(this, e);
          };
          a[b].Sa = [];
          a[b].Sa[d.ab] = d;
        }
      },
      db = (a, b, c) => {
        if (k.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== k[a].Sa && void 0 !== k[a].Sa[c]))
            throw new Q(`Cannot register public name '${a}' twice`);
          cb(k, a, a);
          if (k[a].Sa.hasOwnProperty(c))
            throw new Q(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          k[a].Sa[c] = b;
        } else (k[a] = b), (k[a].ab = c);
      },
      eb = (a) => {
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function fb(a, b, c, d, e, f, h, g) {
      this.name = a;
      this.constructor = b;
      this.$a = c;
      this.Ya = d;
      this.Ua = e;
      this.qb = f;
      this.eb = h;
      this.ob = g;
      this.xb = [];
    }
    var gb = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.eb) throw new Q(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.eb(a);
        b = b.Ua;
      }
      return a;
    };
    function hb(a, b) {
      if (null === b) {
        if (this.hb) throw new Q(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Oa) throw new Q(`Cannot pass "${ib(b)}" as a ${this.name}`);
      if (!b.Oa.Pa) throw new Q(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return gb(b.Oa.Pa, b.Oa.Ra.Qa, this.Qa);
    }
    function jb(a, b) {
      if (null === b) {
        if (this.hb) throw new Q(`null is not a valid ${this.name}`);
        if (this.gb) {
          var c = this.ib();
          null !== a && a.push(this.Ya, c);
          return c;
        }
        return 0;
      }
      if (!b || !b.Oa) throw new Q(`Cannot pass "${ib(b)}" as a ${this.name}`);
      if (!b.Oa.Pa) throw new Q(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.fb && b.Oa.Ra.fb)
        throw new Q(
          `Cannot convert argument of type ${b.Oa.Va ? b.Oa.Va.name : b.Oa.Ra.name} to parameter type ${this.name}`,
        );
      c = gb(b.Oa.Pa, b.Oa.Ra.Qa, this.Qa);
      if (this.gb) {
        if (void 0 === b.Oa.Ta) throw new Q('Passing raw pointer to smart pointer is illegal');
        switch (this.Cb) {
          case 0:
            if (b.Oa.Va === this) c = b.Oa.Ta;
            else
              throw new Q(
                `Cannot convert argument of type ${b.Oa.Va ? b.Oa.Va.name : b.Oa.Ra.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            c = b.Oa.Ta;
            break;
          case 2:
            if (b.Oa.Va === this) c = b.Oa.Ta;
            else {
              var d = b.clone();
              c = this.yb(
                c,
                kb(() => d['delete']()),
              );
              null !== a && a.push(this.Ya, c);
            }
            break;
          default:
            throw new Q('Unsupporting sharing policy');
        }
      }
      return c;
    }
    function lb(a, b) {
      if (null === b) {
        if (this.hb) throw new Q(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Oa) throw new Q(`Cannot pass "${ib(b)}" as a ${this.name}`);
      if (!b.Oa.Pa) throw new Q(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.Oa.Ra.fb) throw new Q(`Cannot convert argument of type ${b.Oa.Ra.name} to parameter type ${this.name}`);
      return gb(b.Oa.Pa, b.Oa.Ra.Qa, this.Qa);
    }
    function mb(a, b, c, d, e, f, h, g, l, m, n) {
      this.name = a;
      this.Qa = b;
      this.hb = c;
      this.fb = d;
      this.gb = e;
      this.wb = f;
      this.Cb = h;
      this.mb = g;
      this.ib = l;
      this.yb = m;
      this.Ya = n;
      e || void 0 !== b.Ua ? (this.toWireType = jb) : ((this.toWireType = d ? hb : lb), (this.Xa = null));
    }
    var nb = (a, b, c) => {
        if (!k.hasOwnProperty(a)) throw new Na('Replacing nonexistent public symbol');
        void 0 !== k[a].Sa && void 0 !== c ? (k[a].Sa[c] = b) : ((k[a] = b), (k[a].ab = c));
      },
      R,
      ob = (a, b, c = []) => {
        a.includes('j') ? ((a = a.replace(/p/g, 'i')), (b = (0, k['dynCall_' + a])(b, ...c))) : (b = R.get(b)(...c));
        return b;
      },
      pb =
        (a, b) =>
        (...c) =>
          ob(a, b, c),
      S = (a, b) => {
        a = P(a);
        var c = a.includes('j') ? pb(a, b) : R.get(b);
        if ('function' != typeof c) throw new Q(`unknown function pointer with signature ${a}: ${b}`);
        return c;
      },
      qb,
      sb = (a) => {
        a = rb(a);
        var b = P(a);
        T(a);
        return b;
      },
      tb = (a, b) => {
        function c(f) {
          e[f] || M[f] || (Ma[f] ? Ma[f].forEach(c) : (d.push(f), (e[f] = !0)));
        }
        var d = [],
          e = {};
        b.forEach(c);
        throw new qb(`${a}: ` + d.map(sb).join([', ']));
      },
      ub = (a, b) => {
        for (var c = [], d = 0; d < a; d++) c.push(B[(b + 4 * d) >> 2]);
        return c;
      };
    function vb(a) {
      for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].Xa) return !0;
      return !1;
    }
    function wb(a, b, c, d, e) {
      var f = b.length;
      if (2 > f) throw new Q("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var h = null !== b[1] && null !== c,
        g = vb(b),
        l = 'void' !== b[0].name,
        m = f - 2,
        n = Array(m),
        p = [],
        t = [];
      return bb(a, function (...E) {
        t.length = 0;
        p.length = h ? 2 : 1;
        p[0] = e;
        if (h) {
          var v = b[1].toWireType(t, this);
          p[1] = v;
        }
        for (var w = 0; w < m; ++w) (n[w] = b[w + 2].toWireType(t, E[w])), p.push(n[w]);
        E = d(...p);
        if (g) Ka(t);
        else
          for (w = h ? 1 : 2; w < b.length; w++) {
            var H = 1 === w ? v : n[w - 2];
            null !== b[w].Xa && b[w].Xa(H);
          }
        v = l ? b[0].fromWireType(E) : void 0;
        return v;
      });
    }
    var yb = (a) => {
        a = a.trim();
        const b = a.indexOf('(');
        return -1 !== b ? a.substr(0, b) : a;
      },
      zb = [],
      U = [],
      Ab = (a) => {
        9 < a && 0 === --U[a + 1] && ((U[a] = void 0), zb.push(a));
      },
      V = (a) => {
        if (!a) throw new Q('Cannot use deleted val. handle = ' + a);
        return U[a];
      },
      kb = (a) => {
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
            const b = zb.pop() || U.length;
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
        toWireType: (a, b) => kb(b),
        Wa: 8,
        readValueFromPointer: La,
        Xa: null,
      },
      Cb = (a, b, c) => {
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
                  return this.fromWireType(A[d >> 2]);
                }
              : function (d) {
                  return this.fromWireType(B[d >> 2]);
                };
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Db = (a, b) => {
        var c = M[a];
        if (void 0 === c) throw ((a = `${b} has unknown type ${sb(a)}`), new Q(a));
        return c;
      },
      ib = (a) => {
        if (null === a) return 'null';
        var b = typeof a;
        return 'object' === b || 'array' === b || 'function' === b ? a.toString() : '' + a;
      },
      Eb = (a, b) => {
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
      Fb = (a, b, c) => {
        switch (b) {
          case 1:
            return c ? (d) => u[d] : (d) => x[d];
          case 2:
            return c ? (d) => y[d >> 1] : (d) => z[d >> 1];
          case 4:
            return c ? (d) => A[d >> 2] : (d) => B[d >> 2];
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Gb = Object.assign({ optional: !0 }, Bb),
      Hb = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Ib = (a, b) => {
        var c = a >> 1;
        for (var d = c + b / 2; !(c >= d) && z[c]; ) ++c;
        c <<= 1;
        if (32 < c - a && Hb) return Hb.decode(x.subarray(a, c));
        c = '';
        for (d = 0; !(d >= b / 2); ++d) {
          var e = y[(a + 2 * d) >> 1];
          if (0 == e) break;
          c += String.fromCharCode(e);
        }
        return c;
      },
      Jb = (a, b, c) => {
        c ??= 2147483647;
        if (2 > c) return 0;
        c -= 2;
        var d = b;
        c = c < 2 * a.length ? c / 2 : a.length;
        for (var e = 0; e < c; ++e) (y[b >> 1] = a.charCodeAt(e)), (b += 2);
        y[b >> 1] = 0;
        return b - d;
      },
      Kb = (a) => 2 * a.length,
      Lb = (a, b) => {
        for (var c = 0, d = ''; !(c >= b / 4); ) {
          var e = A[(a + 4 * c) >> 2];
          if (0 == e) break;
          ++c;
          65536 <= e
            ? ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))))
            : (d += String.fromCharCode(e));
        }
        return d;
      },
      Mb = (a, b, c) => {
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
          A[b >> 2] = f;
          b += 4;
          if (b + 4 > c) break;
        }
        A[b >> 2] = 0;
        return b - d;
      },
      Nb = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          b += 4;
        }
        return b;
      },
      Ob = 0,
      Pb = (a, b, c) => {
        var d = [];
        a = a.toWireType(d, c);
        d.length && (B[b >> 2] = kb(d));
        return a;
      },
      Qb = [],
      Rb = (a) => {
        var b = Qb.length;
        Qb.push(a);
        return b;
      },
      Sb = (a, b) => {
        for (var c = Array(a), d = 0; d < a; ++d) c[d] = Db(B[(b + 4 * d) >> 2], 'parameter ' + d);
        return c;
      },
      Tb = Reflect.construct,
      Ub = {},
      Vb = (a) => {
        if (!(a instanceof Ba || 'unwind' == a)) throw a;
      },
      Wb = (a) => {
        na = a;
        Da || 0 < Ob || (k.onExit?.(a), (ma = !0));
        throw new Ba(a);
      },
      Xb = (a) => {
        if (!ma)
          try {
            if ((a(), !(Da || 0 < Ob)))
              try {
                (na = a = na), Wb(a);
              } catch (b) {
                Vb(b);
              }
          } catch (b) {
            Vb(b);
          }
      },
      Yb = {},
      $b = () => {
        if (!Zb) {
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
              _: ea || './this.program',
            },
            b;
          for (b in Yb) void 0 === Yb[b] ? delete a[b] : (a[b] = Yb[b]);
          var c = [];
          for (b in a) c.push(`${b}=${a[b]}`);
          Zb = c;
        }
        return Zb;
      },
      Zb,
      ac = [null, [], []],
      bc = () => {
        if ('object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
          return (a) => crypto.getRandomValues(a);
        va('initRandomDevice');
      },
      cc = (a) => (cc = bc())(a);
    Na = k.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    for (var dc = Array(256), ec = 0; 256 > ec; ++ec) dc[ec] = String.fromCharCode(ec);
    Oa = dc;
    Q = k.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    Object.assign(ab.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof ab && a instanceof ab)) return !1;
        var b = this.Oa.Ra.Qa,
          c = this.Oa.Pa;
        a.Oa = a.Oa;
        var d = a.Oa.Ra.Qa;
        for (a = a.Oa.Pa; b.Ua; ) (c = b.eb(c)), (b = b.Ua);
        for (; d.Ua; ) (a = d.eb(a)), (d = d.Ua);
        return b === d && c === a;
      },
      clone: function () {
        this.Oa.Pa || Ra(this);
        if (this.Oa.cb) return (this.Oa.count.value += 1), this;
        var a = Ya,
          b = Object,
          c = b.create,
          d = Object.getPrototypeOf(this),
          e = this.Oa;
        a = a(
          c.call(b, d, {
            Oa: { value: { count: e.count, bb: e.bb, cb: e.cb, Pa: e.Pa, Ra: e.Ra, Ta: e.Ta, Va: e.Va } },
          }),
        );
        a.Oa.count.value += 1;
        a.Oa.bb = !1;
        return a;
      },
      ['delete']() {
        this.Oa.Pa || Ra(this);
        if (this.Oa.bb && !this.Oa.cb) throw new Q('Object already scheduled for deletion');
        Ta(this);
        var a = this.Oa;
        --a.count.value;
        0 === a.count.value && (a.Ta ? a.Va.Ya(a.Ta) : a.Ra.Qa.Ya(a.Pa));
        this.Oa.cb || ((this.Oa.Ta = void 0), (this.Oa.Pa = void 0));
      },
      isDeleted: function () {
        return !this.Oa.Pa;
      },
      deleteLater: function () {
        this.Oa.Pa || Ra(this);
        if (this.Oa.bb && !this.Oa.cb) throw new Q('Object already scheduled for deletion');
        $a.push(this);
        this.Oa.bb = !0;
        return this;
      },
    });
    Object.assign(mb.prototype, {
      rb(a) {
        this.mb && (a = this.mb(a));
        return a;
      },
      kb(a) {
        this.Ya?.(a);
      },
      Wa: 8,
      readValueFromPointer: La,
      fromWireType: function (a) {
        function b() {
          return this.gb
            ? Za(this.Qa.$a, { Ra: this.wb, Pa: c, Va: this, Ta: a })
            : Za(this.Qa.$a, { Ra: this, Pa: a });
        }
        var c = this.rb(a);
        if (!c) return this.kb(a), null;
        var d = Xa(this.Qa, c);
        if (void 0 !== d) {
          if (0 === d.Oa.count.value) return (d.Oa.Pa = c), (d.Oa.Ta = a), d.clone();
          d = d.clone();
          this.kb(a);
          return d;
        }
        d = this.Qa.qb(c);
        d = Va[d];
        if (!d) return b.call(this);
        d = this.fb ? d.nb : d.pointerType;
        var e = Ua(c, this.Qa, d.Qa);
        return null === e
          ? b.call(this)
          : this.gb
          ? Za(d.Qa.$a, { Ra: d, Pa: e, Va: this, Ta: a })
          : Za(d.Qa.$a, { Ra: d, Pa: e });
      },
    });
    qb = k.UnboundTypeError = ((a, b) => {
      var c = bb(b, function (d) {
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
    k.count_emval_handles = () => U.length / 2 - 5 - zb.length;
    var wc = {
        c: (a, b, c, d) =>
          va(
            `Assertion failed: ${a ? G(x, a) : ''}, at: ` +
              [b ? (b ? G(x, b) : '') : 'unknown filename', c, d ? (d ? G(x, d) : '') : 'unknown function'],
          ),
        d: () => Ha(),
        l: (a, b, c) => {
          var d = new Fa(a);
          B[(d.Pa + 16) >> 2] = 0;
          B[(d.Pa + 4) >> 2] = b;
          B[(d.Pa + 8) >> 2] = c;
          I = a;
          Ia++;
          throw I;
        },
        f: (a) => {
          I ||= a;
          throw I;
        },
        W: () => {},
        T: () => {},
        U: () => {},
        Y: function () {},
        V: () => {},
        _: () => va(''),
        y: (a) => {
          var b = Ja[a];
          delete Ja[a];
          var c = b.ib,
            d = b.Ya,
            e = b.lb,
            f = e.map((h) => h.ub).concat(e.map((h) => h.Ab));
          O([a], f, (h) => {
            var g = {};
            e.forEach((l, m) => {
              var n = h[m],
                p = l.sb,
                t = l.tb,
                E = h[m + e.length],
                v = l.zb,
                w = l.Bb;
              g[l.pb] = {
                read: (H) => n.fromWireType(p(t, H)),
                write: (H, ha) => {
                  var F = [];
                  v(w, H, E.toWireType(F, ha));
                  Ka(F);
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
                  var p = c();
                  for (n in g) g[n].write(p, m[n]);
                  null !== l && l.push(d, p);
                  return p;
                },
                Wa: 8,
                readValueFromPointer: La,
                Xa: d,
              },
            ];
          });
        },
        M: () => {},
        ja: (a, b, c, d) => {
          b = P(b);
          N(a, {
            name: b,
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, f) {
              return f ? c : d;
            },
            Wa: 8,
            readValueFromPointer: function (e) {
              return this.fromWireType(x[e]);
            },
            Xa: null,
          });
        },
        t: (a, b, c, d, e, f, h, g, l, m, n, p, t) => {
          n = P(n);
          f = S(e, f);
          g &&= S(h, g);
          m &&= S(l, m);
          t = S(p, t);
          var E = eb(n);
          db(E, function () {
            tb(`Cannot construct ${n} due to unbound types`, [d]);
          });
          O([a, b, c], d ? [d] : [], (v) => {
            v = v[0];
            if (d) {
              var w = v.Qa;
              var H = w.$a;
            } else H = ab.prototype;
            v = bb(n, function (...Pa) {
              if (Object.getPrototypeOf(this) !== ha) throw new Q("Use 'new' to construct " + n);
              if (void 0 === F.Za) throw new Q(n + ' has no accessible constructor');
              var xb = F.Za[Pa.length];
              if (void 0 === xb)
                throw new Q(
                  `Tried to invoke ctor of ${n} with invalid number of parameters (${
                    Pa.length
                  }) - expected (${Object.keys(F.Za).toString()}) parameters instead!`,
                );
              return xb.apply(this, Pa);
            });
            var ha = Object.create(H, { constructor: { value: v } });
            v.prototype = ha;
            var F = new fb(n, v, ha, t, w, f, g, m);
            if (F.Ua) {
              var ia;
              (ia = F.Ua).jb ?? (ia.jb = []);
              F.Ua.jb.push(F);
            }
            w = new mb(n, F, !0, !1, !1);
            ia = new mb(n + '*', F, !1, !1, !1);
            H = new mb(n + ' const*', F, !1, !0, !1);
            Va[a] = { pointerType: ia, nb: H };
            nb(E, v);
            return [w, ia, H];
          });
        },
        v: (a, b, c, d, e, f) => {
          var h = ub(b, c);
          e = S(d, e);
          O([], [a], (g) => {
            g = g[0];
            var l = `constructor ${g.name}`;
            void 0 === g.Qa.Za && (g.Qa.Za = []);
            if (void 0 !== g.Qa.Za[b - 1])
              throw new Q(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  g.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            g.Qa.Za[b - 1] = () => {
              tb(`Cannot construct ${g.name} due to unbound types`, h);
            };
            O([], h, (m) => {
              m.splice(1, 0, null);
              g.Qa.Za[b - 1] = wb(l, m, null, e, f);
              return [];
            });
            return [];
          });
        },
        e: (a, b, c, d, e, f, h, g) => {
          var l = ub(c, d);
          b = P(b);
          b = yb(b);
          f = S(e, f);
          O([], [a], (m) => {
            function n() {
              tb(`Cannot call ${p} due to unbound types`, l);
            }
            m = m[0];
            var p = `${m.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            g && m.Qa.xb.push(b);
            var t = m.Qa.$a,
              E = t[b];
            void 0 === E || (void 0 === E.Sa && E.className !== m.name && E.ab === c - 2)
              ? ((n.ab = c - 2), (n.className = m.name), (t[b] = n))
              : (cb(t, b, p), (t[b].Sa[c - 2] = n));
            O([], l, (v) => {
              v = wb(p, v, m, f, h);
              void 0 === t[b].Sa ? ((v.ab = c - 2), (t[b] = v)) : (t[b].Sa[c - 2] = v);
              return [];
            });
            return [];
          });
        },
        ha: (a) => N(a, Bb),
        D: (a, b, c, d) => {
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
            Wa: 8,
            readValueFromPointer: Cb(b, c, d),
            Xa: null,
          });
          db(b, e);
        },
        n: (a, b, c) => {
          var d = Db(a, 'enum');
          b = P(b);
          a = d.constructor;
          d = Object.create(d.constructor.prototype, {
            value: { value: c },
            constructor: { value: bb(`${d.name}_${b}`, function () {}) },
          });
          a.values[c] = d;
          a[b] = d;
        },
        I: (a, b, c) => {
          b = P(b);
          N(a, {
            name: b,
            fromWireType: (d) => d,
            toWireType: (d, e) => e,
            Wa: 8,
            readValueFromPointer: Eb(b, c),
            Xa: null,
          });
        },
        x: (a, b, c, d, e, f) => {
          var h = ub(b, c);
          a = P(a);
          a = yb(a);
          e = S(d, e);
          db(
            a,
            function () {
              tb(`Cannot call ${a} due to unbound types`, h);
            },
            b - 1,
          );
          O([], h, (g) => {
            nb(a, wb(a, [g[0], null].concat(g.slice(1)), null, e, f), b - 1);
            return [];
          });
        },
        p: (a, b, c, d, e) => {
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
          N(a, { name: b, fromWireType: e, toWireType: h, Wa: 8, readValueFromPointer: Fb(b, c, 0 !== d), Xa: null });
        },
        k: (a, b, c) => {
          function d(f) {
            return new e(u.buffer, B[(f + 4) >> 2], B[f >> 2]);
          }
          var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][
            b
          ];
          c = P(c);
          N(a, { name: c, fromWireType: d, Wa: 8, readValueFromPointer: d }, { vb: !0 });
        },
        s: (a) => {
          N(a, Gb);
        },
        C: (a, b, c, d, e, f, h, g, l, m, n, p) => {
          c = P(c);
          f = S(e, f);
          g = S(h, g);
          m = S(l, m);
          p = S(n, p);
          O([a], [b], (t) => {
            t = t[0];
            return [new mb(c, t.Qa, !1, !1, !0, t, d, f, g, m, p)];
          });
        },
        ia: (a, b) => {
          b = P(b);
          N(a, {
            name: b,
            fromWireType: function (c) {
              for (var d = B[c >> 2], e = c + 4, f, h = e, g = 0; g <= d; ++g) {
                var l = e + g;
                if (g == d || 0 == x[l])
                  (h = h ? G(x, h, l - h) : ''),
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
                throw new Q('Cannot pass non-string to std::string');
              if (f)
                for (var h = (e = 0); h < d.length; ++h) {
                  var g = d.charCodeAt(h);
                  127 >= g ? e++ : 2047 >= g ? (e += 2) : 55296 <= g && 57343 >= g ? ((e += 4), ++h) : (e += 3);
                }
              else e = d.length;
              h = fc(4 + e + 1);
              g = h + 4;
              B[h >> 2] = e;
              if (f) K(d, g, e + 1);
              else if (f)
                for (f = 0; f < e; ++f) {
                  var l = d.charCodeAt(f);
                  if (255 < l) throw (T(g), new Q('String has UTF-16 code units that do not fit in 8 bits'));
                  x[g + f] = l;
                }
              else for (f = 0; f < e; ++f) x[g + f] = d[f];
              null !== c && c.push(T, h);
              return h;
            },
            Wa: 8,
            readValueFromPointer: La,
            Xa(c) {
              T(c);
            },
          });
        },
        B: (a, b, c) => {
          c = P(c);
          if (2 === b) {
            var d = Ib;
            var e = Jb;
            var f = Kb;
            var h = (g) => z[g >> 1];
          } else 4 === b && ((d = Lb), (e = Mb), (f = Nb), (h = (g) => B[g >> 2]));
          N(a, {
            name: c,
            fromWireType: (g) => {
              for (var l = B[g >> 2], m, n = g + 4, p = 0; p <= l; ++p) {
                var t = g + 4 + p * b;
                if (p == l || 0 == h(t))
                  (n = d(n, t - n)), void 0 === m ? (m = n) : ((m += String.fromCharCode(0)), (m += n)), (n = t + b);
              }
              T(g);
              return m;
            },
            toWireType: (g, l) => {
              if ('string' != typeof l) throw new Q(`Cannot pass non-string to C++ string type ${c}`);
              var m = f(l),
                n = fc(4 + m + b);
              B[n >> 2] = m / b;
              e(l, n + 4, m + b);
              null !== g && g.push(T, n);
              return n;
            },
            Wa: 8,
            readValueFromPointer: La,
            Xa(g) {
              T(g);
            },
          });
        },
        z: (a, b, c, d, e, f) => {
          Ja[a] = { name: P(b), ib: S(c, d), Ya: S(e, f), lb: [] };
        },
        m: (a, b, c, d, e, f, h, g, l, m) => {
          Ja[a].lb.push({ pb: P(b), ub: c, sb: S(d, e), tb: f, Ab: h, zb: S(g, l), Bb: m });
        },
        ka: (a, b) => {
          b = P(b);
          N(a, { Db: !0, name: b, Wa: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        R: () => {
          Da = !1;
          Ob = 0;
        },
        N: () => {
          throw Infinity;
        },
        J: (a, b, c) => {
          a = V(a);
          b = Db(b, 'emval::as');
          return Pb(b, c, a);
        },
        r: (a, b, c, d) => {
          a = Qb[a];
          b = V(b);
          return a(null, b, c, d);
        },
        ea: Ab,
        K: (a, b) => {
          a = V(a);
          b = V(b);
          return a == b;
        },
        q: (a, b, c) => {
          var d = Sb(a, b),
            e = d.shift();
          a--;
          var f = Array(a);
          b = `methodCaller<(${d.map((h) => h.name).join(', ')}) => ${e.name}>`;
          return Rb(
            bb(b, (h, g, l, m) => {
              for (var n = 0, p = 0; p < a; ++p) (f[p] = d[p].readValueFromPointer(m + n)), (n += d[p].Wa);
              h = 1 === c ? Tb(g, f) : g.apply(h, f);
              return Pb(e, l, h);
            }),
          );
        },
        E: (a) => {
          9 < a && (U[a + 1] += 1);
        },
        la: (a) => {
          var b = V(a);
          Ka(b);
          Ab(a);
        },
        w: (a, b) => {
          a = Db(a, '_emval_take_value');
          a = a.readValueFromPointer(b);
          return kb(a);
        },
        O: (a, b) => {
          Ub[a] && (clearTimeout(Ub[a].id), delete Ub[a]);
          if (!b) return 0;
          var c = setTimeout(() => {
            delete Ub[a];
            Xb(() => gc(a, performance.now()));
          }, b);
          Ub[a] = { id: c, Eb: b };
          return 0;
        },
        P: (a, b, c, d) => {
          var e = new Date().getFullYear(),
            f = new Date(e, 0, 1).getTimezoneOffset();
          e = new Date(e, 6, 1).getTimezoneOffset();
          B[a >> 2] = 60 * Math.max(f, e);
          A[b >> 2] = Number(f != e);
          b = (h) => {
            var g = Math.abs(h);
            return `UTC${0 <= h ? '-' : '+'}${String(Math.floor(g / 60)).padStart(2, '0')}${String(g % 60).padStart(
              2,
              '0',
            )}`;
          };
          a = b(f);
          b = b(e);
          e < f ? (K(a, c, 17), K(b, d, 17)) : (K(a, d, 17), K(b, c, 17));
        },
        ga: () => performance.now(),
        Q: (a) => {
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
        aa: (a, b) => {
          var c = 0;
          $b().forEach((d, e) => {
            var f = b + c;
            e = B[(a + 4 * e) >> 2] = f;
            for (f = 0; f < d.length; ++f) u[e++] = d.charCodeAt(f);
            u[e] = 0;
            c += d.length + 1;
          });
          return 0;
        },
        ba: (a, b) => {
          var c = $b();
          B[a >> 2] = c.length;
          var d = 0;
          c.forEach((e) => (d += e.length + 1));
          B[b >> 2] = d;
          return 0;
        },
        Z: () => 52,
        X: () => 52,
        F: (a, b, c, d) => {
          for (var e = 0, f = 0; f < c; f++) {
            var h = B[b >> 2],
              g = B[(b + 4) >> 2];
            b += 8;
            for (var l = 0; l < g; l++) {
              var m = a,
                n = x[h + l],
                p = ac[m];
              0 === n || 10 === n ? ((1 === m ? ja : r)(G(p)), (p.length = 0)) : p.push(n);
            }
            e += g;
          }
          B[d >> 2] = e;
          return 0;
        },
        da: hc,
        ca: ic,
        j: jc,
        i: kc,
        h: lc,
        fa: mc,
        A: nc,
        G: oc,
        H: pc,
        a: qc,
        b: rc,
        g: sc,
        o: tc,
        u: uc,
        L: vc,
        $: Wb,
        S: (a, b) => {
          cc(x.subarray(a, a + b));
          return 0;
        },
      },
      W;
    (async function () {
      function a(d) {
        W = d.exports;
        la = W.ma;
        qa();
        R = W.ra;
        sa.unshift(W.na);
        C--;
        k.monitorRunDependencies?.(C);
        0 == C && D && ((d = D), (D = null), d());
        return W;
      }
      C++;
      k.monitorRunDependencies?.(C);
      var b = { a: wc };
      if (k.instantiateWasm)
        try {
          return k.instantiateWasm(b, a);
        } catch (d) {
          r(`Module.instantiateWasm callback failed with error: ${d}`), ba(d);
        }
      xa ??= wa('DotLottiePlayer.wasm')
        ? 'DotLottiePlayer.wasm'
        : k.locateFile
        ? k.locateFile('DotLottiePlayer.wasm', q)
        : q + 'DotLottiePlayer.wasm';
      try {
        var c = await Aa(b);
        a(c.instance);
        return c;
      } catch (d) {
        ba(d);
      }
    })();
    var fc = (a) => (fc = W.oa)(a),
      rb = (a) => (rb = W.pa)(a),
      T = (a) => (T = W.qa)(a),
      gc = (a, b) => (gc = W.sa)(a, b),
      X = (a, b) => (X = W.ta)(a, b),
      J = (a) => (J = W.ua)(a),
      Y = (a) => (Y = W.va)(a),
      Z = () => (Z = W.wa)(),
      Ga = (a, b, c) => (Ga = W.xa)(a, b, c);
    k.dynCall_iijj = (a, b, c, d, e, f) => (k.dynCall_iijj = W.ya)(a, b, c, d, e, f);
    k.dynCall_vijj = (a, b, c, d, e, f) => (k.dynCall_vijj = W.za)(a, b, c, d, e, f);
    k.dynCall_jiii = (a, b, c, d) => (k.dynCall_jiii = W.Aa)(a, b, c, d);
    var xc = (k.dynCall_vijjjj = (a, b, c, d, e, f, h, g, l, m) =>
      (xc = k.dynCall_vijjjj = W.Ba)(a, b, c, d, e, f, h, g, l, m));
    k.dynCall_jii = (a, b, c) => (k.dynCall_jii = W.Ca)(a, b, c);
    k.dynCall_vjii = (a, b, c, d, e) => (k.dynCall_vjii = W.Da)(a, b, c, d, e);
    k.dynCall_vjfii = (a, b, c, d, e, f) => (k.dynCall_vjfii = W.Ea)(a, b, c, d, e, f);
    k.dynCall_vjiii = (a, b, c, d, e, f) => (k.dynCall_vjiii = W.Fa)(a, b, c, d, e, f);
    k.dynCall_vj = (a, b, c) => (k.dynCall_vj = W.Ga)(a, b, c);
    k.dynCall_vjiiiii = (a, b, c, d, e, f, h, g) => (k.dynCall_vjiiiii = W.Ha)(a, b, c, d, e, f, h, g);
    k.dynCall_vjiffii = (a, b, c, d, e, f, h, g) => (k.dynCall_vjiffii = W.Ia)(a, b, c, d, e, f, h, g);
    k.dynCall_vjiiii = (a, b, c, d, e, f, h) => (k.dynCall_vjiiii = W.Ja)(a, b, c, d, e, f, h);
    k.dynCall_viijii = (a, b, c, d, e, f, h) => (k.dynCall_viijii = W.Ka)(a, b, c, d, e, f, h);
    k.dynCall_iiiiij = (a, b, c, d, e, f, h) => (k.dynCall_iiiiij = W.La)(a, b, c, d, e, f, h);
    k.dynCall_iiiiijj = (a, b, c, d, e, f, h, g, l) => (k.dynCall_iiiiijj = W.Ma)(a, b, c, d, e, f, h, g, l);
    k.dynCall_iiiiiijj = (a, b, c, d, e, f, h, g, l, m) => (k.dynCall_iiiiiijj = W.Na)(a, b, c, d, e, f, h, g, l, m);
    function qc(a, b) {
      var c = Z();
      try {
        R.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function mc(a, b, c, d, e) {
      var f = Z();
      try {
        return R.get(a)(b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function rc(a, b, c) {
      var d = Z();
      try {
        R.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function sc(a, b, c, d) {
      var e = Z();
      try {
        R.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function jc(a, b) {
      var c = Z();
      try {
        return R.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function uc(a, b, c, d, e, f) {
      var h = Z();
      try {
        R.get(a)(b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function pc(a) {
      var b = Z();
      try {
        R.get(a)();
      } catch (c) {
        Y(b);
        if (c !== c + 0) throw c;
        X(1, 0);
      }
    }
    function tc(a, b, c, d, e) {
      var f = Z();
      try {
        R.get(a)(b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function oc(a, b, c, d, e, f, h, g) {
      var l = Z();
      try {
        return R.get(a)(b, c, d, e, f, h, g);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function lc(a, b, c, d) {
      var e = Z();
      try {
        return R.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function kc(a, b, c) {
      var d = Z();
      try {
        return R.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function nc(a, b, c, d, e, f) {
      var h = Z();
      try {
        return R.get(a)(b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function hc(a, b) {
      var c = Z();
      try {
        return R.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function ic(a, b, c, d) {
      var e = Z();
      try {
        return R.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function vc(a, b, c, d, e, f, h, g, l, m) {
      var n = Z();
      try {
        xc(a, b, c, d, e, f, h, g, l, m);
      } catch (p) {
        Y(n);
        if (p !== p + 0) throw p;
        X(1, 0);
      }
    }
    var yc;
    D = function zc() {
      yc || Ac();
      yc || (D = zc);
    };
    function Ac() {
      function a() {
        if (!yc && ((yc = !0), (k.calledRun = !0), !ma)) {
          Ca(sa);
          aa(k);
          k.onRuntimeInitialized?.();
          if (k.postRun)
            for ('function' == typeof k.postRun && (k.postRun = [k.postRun]); k.postRun.length; ) {
              var b = k.postRun.shift();
              ta.unshift(b);
            }
          Ca(ta);
        }
      }
      if (!(0 < C)) {
        if (k.preRun) for ('function' == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; ) ua();
        Ca(ra);
        0 < C ||
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
    Ac();
    moduleRtn = ca;

    return moduleRtn;
  };
})();
export default createDotLottiePlayerModule;
