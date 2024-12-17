var createDotLottiePlayerModule = (() => {
  var _scriptDir = typeof document != 'undefined' ? document.currentScript?.src : undefined;

  return function (moduleArg = {}) {
    var k = moduleArg,
      aa,
      ba,
      readyPromise = new Promise((a, b) => {
        aa = a;
        ba = b;
      }),
      ca = Object.assign({}, k),
      da = './this.program',
      ea = (a, b) => {
        throw b;
      },
      t = '';
    'undefined' != typeof document && document.currentScript && (t = document.currentScript.src);
    _scriptDir && (t = _scriptDir);
    t.startsWith('blob:') ? (t = '') : (t = t.substr(0, t.replace(/[?#].*/, '').lastIndexOf('/') + 1));
    var fa = k.print || console.log.bind(console),
      w = k.printErr || console.error.bind(console);
    Object.assign(k, ca);
    ca = null;
    k.thisProgram && (da = k.thisProgram);
    k.quit && (ea = k.quit);
    var x;
    k.wasmBinary && (x = k.wasmBinary);
    var ha,
      ia = !1,
      y,
      A,
      B,
      C,
      E,
      F,
      ja,
      la;
    function ma() {
      var a = ha.buffer;
      k.HEAP8 = y = new Int8Array(a);
      k.HEAP16 = B = new Int16Array(a);
      k.HEAPU8 = A = new Uint8Array(a);
      k.HEAPU16 = C = new Uint16Array(a);
      k.HEAP32 = E = new Int32Array(a);
      k.HEAPU32 = F = new Uint32Array(a);
      k.HEAPF32 = ja = new Float32Array(a);
      k.HEAPF64 = la = new Float64Array(a);
    }
    var na = [],
      oa = [],
      pa = [];
    function qa() {
      var a = k.preRun.shift();
      na.unshift(a);
    }
    var G = 0,
      ra = null,
      sa = null;
    function ta(a) {
      k.onAbort?.(a);
      a = 'Aborted(' + a + ')';
      w(a);
      ia = !0;
      a = new WebAssembly.RuntimeError(a + '. Build with -sASSERTIONS for more info.');
      ba(a);
      throw a;
    }
    var ua = (a) => a.startsWith('data:application/octet-stream;base64,'),
      H;
    H = 'DotLottiePlayer.wasm';
    if (!ua(H)) {
      var va = H;
      H = k.locateFile ? k.locateFile(va, t) : t + va;
    }
    function wa(a) {
      if (a == H && x) return new Uint8Array(x);
      throw 'both async and sync fetching of the wasm failed';
    }
    function xa(a) {
      return x || 'function' != typeof fetch
        ? Promise.resolve().then(() => wa(a))
        : fetch(a, { credentials: 'same-origin' })
            .then((b) => {
              if (!b.ok) throw `failed to load wasm binary file at '${a}'`;
              return b.arrayBuffer();
            })
            .catch(() => wa(a));
    }
    function ya(a, b, c) {
      return xa(a)
        .then((d) => WebAssembly.instantiate(d, b))
        .then(c, (d) => {
          w(`failed to asynchronously prepare wasm: ${d}`);
          ta(d);
        });
    }
    function za(a, b) {
      var c = H;
      return x || 'function' != typeof WebAssembly.instantiateStreaming || ua(c) || 'function' != typeof fetch
        ? ya(c, a, b)
        : fetch(c, { credentials: 'same-origin' }).then((d) =>
            WebAssembly.instantiateStreaming(d, a).then(b, function (e) {
              w(`wasm streaming compile failed: ${e}`);
              w('falling back to ArrayBuffer instantiation');
              return ya(c, a, b);
            }),
          );
    }
    var I, J;
    function Aa(a) {
      this.name = 'ExitStatus';
      this.message = `Program terminated with exit(${a})`;
      this.status = a;
    }
    var Ba = (a) => {
        for (; 0 < a.length; ) a.shift()(k);
      },
      Ca = k.noExitRuntime || !0,
      Da = 'undefined' != typeof TextDecoder ? new TextDecoder('utf8') : void 0,
      K = (a, b, c) => {
        var d = b + c;
        for (c = b; a[c] && !(c >= d); ) ++c;
        if (16 < c - b && a.buffer && Da) return Da.decode(a.subarray(b, c));
        for (d = ''; b < c; ) {
          var e = a[b++];
          if (e & 128) {
            var f = a[b++] & 63;
            if (192 == (e & 224)) d += String.fromCharCode(((e & 31) << 6) | f);
            else {
              var l = a[b++] & 63;
              e =
                224 == (e & 240)
                  ? ((e & 15) << 12) | (f << 6) | l
                  : ((e & 7) << 18) | (f << 12) | (l << 6) | (a[b++] & 63);
              65536 > e
                ? (d += String.fromCharCode(e))
                : ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))));
            }
          } else d += String.fromCharCode(e);
        }
        return d;
      };
    class Ea {
      constructor(a) {
        this.za = a - 24;
      }
    }
    var Fa = 0,
      Ga = 0,
      Ha = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          127 >= d ? b++ : 2047 >= d ? (b += 2) : 55296 <= d && 57343 >= d ? ((b += 4), ++c) : (b += 3);
        }
        return b;
      },
      Ia = (a, b, c, d) => {
        if (0 < d) {
          d = c + d - 1;
          for (var e = 0; e < a.length; ++e) {
            var f = a.charCodeAt(e);
            if (55296 <= f && 57343 >= f) {
              var l = a.charCodeAt(++e);
              f = (65536 + ((f & 1023) << 10)) | (l & 1023);
            }
            if (127 >= f) {
              if (c >= d) break;
              b[c++] = f;
            } else {
              if (2047 >= f) {
                if (c + 1 >= d) break;
                b[c++] = 192 | (f >> 6);
              } else {
                if (65535 >= f) {
                  if (c + 2 >= d) break;
                  b[c++] = 224 | (f >> 12);
                } else {
                  if (c + 3 >= d) break;
                  b[c++] = 240 | (f >> 18);
                  b[c++] = 128 | ((f >> 12) & 63);
                }
                b[c++] = 128 | ((f >> 6) & 63);
              }
              b[c++] = 128 | (f & 63);
            }
          }
          b[c] = 0;
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
      return this.fromWireType(F[a >> 2]);
    }
    var L = {},
      M = {},
      Ma = {},
      Na,
      O = (a, b, c) => {
        function d(h) {
          h = c(h);
          if (h.length !== a.length) throw new Na('Mismatched type converter count');
          for (var n = 0; n < a.length; ++n) N(a[n], h[n]);
        }
        a.forEach(function (h) {
          Ma[h] = b;
        });
        var e = Array(b.length),
          f = [],
          l = 0;
        b.forEach((h, n) => {
          M.hasOwnProperty(h)
            ? (e[n] = M[h])
            : (f.push(h),
              L.hasOwnProperty(h) || (L[h] = []),
              L[h].push(() => {
                e[n] = M[h];
                ++l;
                l === f.length && d(e);
              }));
        });
        0 === f.length && d(e);
      },
      Oa,
      Q = (a) => {
        for (var b = ''; A[a]; ) b += Oa[A[a++]];
        return b;
      },
      R;
    function Pa(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new R(`type "${d}" must have a positive integer typeid pointer`);
      if (M.hasOwnProperty(a)) {
        if (c.jb) return;
        throw new R(`Cannot register type '${d}' twice`);
      }
      M[a] = b;
      delete Ma[a];
      L.hasOwnProperty(a) && ((b = L[a]), delete L[a], b.forEach((e) => e()));
    }
    function N(a, b, c = {}) {
      if (!('argPackAdvance' in b)) throw new TypeError('registerType registeredInstance requires argPackAdvance');
      return Pa(a, b, c);
    }
    var Ra = (a) => {
        throw new R(a.pa.Aa.ya.name + ' instance already deleted');
      },
      Sa = !1,
      Ta = () => {},
      Ua = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.Da) return null;
        a = Ua(a, b, c.Da);
        return null === a ? null : c.bb(a);
      },
      Va = {},
      Wa = [],
      Xa = () => {
        for (; Wa.length; ) {
          var a = Wa.pop();
          a.pa.La = !1;
          a['delete']();
        }
      },
      Ya,
      Za = {},
      $a = (a, b) => {
        if (void 0 === b) throw new R('ptr should not be undefined');
        for (; a.Da; ) (b = a.Oa(b)), (a = a.Da);
        return Za[b];
      },
      bb = (a, b) => {
        if (!b.Aa || !b.za) throw new Na('makeClassHandle requires ptr and ptrType');
        if (!!b.Ea !== !!b.Ba) throw new Na('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return ab(Object.create(a, { pa: { value: b, writable: !0 } }));
      },
      ab = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (ab = (b) => b), a;
        Sa = new FinalizationRegistry((b) => {
          b = b.pa;
          --b.count.value;
          0 === b.count.value && (b.Ba ? b.Ea.Ga(b.Ba) : b.Aa.ya.Ga(b.za));
        });
        ab = (b) => {
          var c = b.pa;
          c.Ba && Sa.register(b, { pa: c }, b);
          return b;
        };
        Ta = (b) => {
          Sa.unregister(b);
        };
        return ab(a);
      };
    function cb() {}
    var db = (a, b) => Object.defineProperty(b, 'name', { value: a }),
      eb = (a, b, c) => {
        if (void 0 === a[b].Ca) {
          var d = a[b];
          a[b] = function (...e) {
            if (!a[b].Ca.hasOwnProperty(e.length))
              throw new R(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].Ca})!`,
              );
            return a[b].Ca[e.length].apply(this, e);
          };
          a[b].Ca = [];
          a[b].Ca[d.Pa] = d;
        }
      },
      fb = (a, b, c) => {
        if (k.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== k[a].Ca && void 0 !== k[a].Ca[c]))
            throw new R(`Cannot register public name '${a}' twice`);
          eb(k, a, a);
          if (k.hasOwnProperty(c))
            throw new R(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          k[a].Ca[c] = b;
        } else (k[a] = b), void 0 !== c && (k[a].wb = c);
      },
      gb = (a) => {
        if (void 0 === a) return '_unknown';
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function hb(a, b, c, d, e, f, l, h) {
      this.name = a;
      this.constructor = b;
      this.Ma = c;
      this.Ga = d;
      this.Da = e;
      this.eb = f;
      this.Oa = l;
      this.bb = h;
      this.lb = [];
    }
    var ib = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.Oa) throw new R(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.Oa(a);
        b = b.Da;
      }
      return a;
    };
    function jb(a, b) {
      if (null === b) {
        if (this.Ua) throw new R(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.pa) throw new R(`Cannot pass "${kb(b)}" as a ${this.name}`);
      if (!b.pa.za) throw new R(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return ib(b.pa.za, b.pa.Aa.ya, this.ya);
    }
    function lb(a, b) {
      if (null === b) {
        if (this.Ua) throw new R(`null is not a valid ${this.name}`);
        if (this.Ra) {
          var c = this.Va();
          null !== a && a.push(this.Ga, c);
          return c;
        }
        return 0;
      }
      if (!b || !b.pa) throw new R(`Cannot pass "${kb(b)}" as a ${this.name}`);
      if (!b.pa.za) throw new R(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.Qa && b.pa.Aa.Qa)
        throw new R(
          `Cannot convert argument of type ${b.pa.Ea ? b.pa.Ea.name : b.pa.Aa.name} to parameter type ${this.name}`,
        );
      c = ib(b.pa.za, b.pa.Aa.ya, this.ya);
      if (this.Ra) {
        if (void 0 === b.pa.Ba) throw new R('Passing raw pointer to smart pointer is illegal');
        switch (this.qb) {
          case 0:
            if (b.pa.Ea === this) c = b.pa.Ba;
            else
              throw new R(
                `Cannot convert argument of type ${b.pa.Ea ? b.pa.Ea.name : b.pa.Aa.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            c = b.pa.Ba;
            break;
          case 2:
            if (b.pa.Ea === this) c = b.pa.Ba;
            else {
              var d = b.clone();
              c = this.mb(
                c,
                mb(() => d['delete']()),
              );
              null !== a && a.push(this.Ga, c);
            }
            break;
          default:
            throw new R('Unsupporting sharing policy');
        }
      }
      return c;
    }
    function nb(a, b) {
      if (null === b) {
        if (this.Ua) throw new R(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.pa) throw new R(`Cannot pass "${kb(b)}" as a ${this.name}`);
      if (!b.pa.za) throw new R(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.pa.Aa.Qa) throw new R(`Cannot convert argument of type ${b.pa.Aa.name} to parameter type ${this.name}`);
      return ib(b.pa.za, b.pa.Aa.ya, this.ya);
    }
    function ob(a, b, c, d, e, f, l, h, n, m, p) {
      this.name = a;
      this.ya = b;
      this.Ua = c;
      this.Qa = d;
      this.Ra = e;
      this.kb = f;
      this.qb = l;
      this.$a = h;
      this.Va = n;
      this.mb = m;
      this.Ga = p;
      e || void 0 !== b.Da ? (this.toWireType = lb) : ((this.toWireType = d ? jb : nb), (this.Fa = null));
    }
    var pb = (a, b, c) => {
        if (!k.hasOwnProperty(a)) throw new Na('Replacing nonexistent public symbol');
        void 0 !== k[a].Ca && void 0 !== c ? (k[a].Ca[c] = b) : ((k[a] = b), (k[a].Pa = c));
      },
      S,
      qb = (a, b, c = []) => {
        a.includes('j') ? ((a = a.replace(/p/g, 'i')), (b = (0, k['dynCall_' + a])(b, ...c))) : (b = S.get(b)(...c));
        return b;
      },
      rb =
        (a, b) =>
        (...c) =>
          qb(a, b, c),
      T = (a, b) => {
        a = Q(a);
        var c = a.includes('j') ? rb(a, b) : S.get(b);
        if ('function' != typeof c) throw new R(`unknown function pointer with signature ${a}: ${b}`);
        return c;
      },
      sb,
      ub = (a) => {
        a = tb(a);
        var b = Q(a);
        U(a);
        return b;
      },
      vb = (a, b) => {
        function c(f) {
          e[f] || M[f] || (Ma[f] ? Ma[f].forEach(c) : (d.push(f), (e[f] = !0)));
        }
        var d = [],
          e = {};
        b.forEach(c);
        throw new sb(`${a}: ` + d.map(ub).join([', ']));
      },
      wb = (a, b) => {
        for (var c = [], d = 0; d < a; d++) c.push(F[(b + 4 * d) >> 2]);
        return c;
      };
    function xb(a) {
      for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].Fa) return !0;
      return !1;
    }
    function yb(a, b, c, d, e) {
      var f = b.length;
      if (2 > f) throw new R("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var l = null !== b[1] && null !== c,
        h = xb(b),
        n = 'void' !== b[0].name,
        m = f - 2,
        p = Array(m),
        u = [],
        v = [];
      return db(a, function (...g) {
        if (g.length !== m) throw new R(`function ${a} called with ${g.length} arguments, expected ${m}`);
        v.length = 0;
        u.length = l ? 2 : 1;
        u[0] = e;
        if (l) {
          var q = b[1].toWireType(v, this);
          u[1] = q;
        }
        for (var r = 0; r < m; ++r) (p[r] = b[r + 2].toWireType(v, g[r])), u.push(p[r]);
        g = d(...u);
        if (h) Ka(v);
        else
          for (r = l ? 1 : 2; r < b.length; r++) {
            var z = 1 === r ? q : p[r - 2];
            null !== b[r].Fa && b[r].Fa(z);
          }
        q = n ? b[0].fromWireType(g) : void 0;
        return q;
      });
    }
    var zb = (a) => {
        a = a.trim();
        const b = a.indexOf('(');
        return -1 !== b ? a.substr(0, b) : a;
      },
      Bb = [],
      V = [],
      Cb = (a) => {
        9 < a && 0 === --V[a + 1] && ((V[a] = void 0), Bb.push(a));
      },
      Db = (a) => {
        if (!a) throw new R('Cannot use deleted val. handle = ' + a);
        return V[a];
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
            const b = Bb.pop() || V.length;
            V[b] = a;
            V[b + 1] = 1;
            return b;
        }
      },
      Eb = {
        name: 'emscripten::val',
        fromWireType: (a) => {
          var b = Db(a);
          Cb(a);
          return b;
        },
        toWireType: (a, b) => mb(b),
        argPackAdvance: 8,
        readValueFromPointer: La,
        Fa: null,
      },
      Fb = (a, b, c) => {
        switch (b) {
          case 1:
            return c
              ? function (d) {
                  return this.fromWireType(y[d]);
                }
              : function (d) {
                  return this.fromWireType(A[d]);
                };
          case 2:
            return c
              ? function (d) {
                  return this.fromWireType(B[d >> 1]);
                }
              : function (d) {
                  return this.fromWireType(C[d >> 1]);
                };
          case 4:
            return c
              ? function (d) {
                  return this.fromWireType(E[d >> 2]);
                }
              : function (d) {
                  return this.fromWireType(F[d >> 2]);
                };
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Gb = (a, b) => {
        var c = M[a];
        if (void 0 === c) throw ((a = `${b} has unknown type ${ub(a)}`), new R(a));
        return c;
      },
      kb = (a) => {
        if (null === a) return 'null';
        var b = typeof a;
        return 'object' === b || 'array' === b || 'function' === b ? a.toString() : '' + a;
      },
      Hb = (a, b) => {
        switch (b) {
          case 4:
            return function (c) {
              return this.fromWireType(ja[c >> 2]);
            };
          case 8:
            return function (c) {
              return this.fromWireType(la[c >> 3]);
            };
          default:
            throw new TypeError(`invalid float width (${b}): ${a}`);
        }
      },
      Ib = (a, b, c) => {
        switch (b) {
          case 1:
            return c ? (d) => y[d] : (d) => A[d];
          case 2:
            return c ? (d) => B[d >> 1] : (d) => C[d >> 1];
          case 4:
            return c ? (d) => E[d >> 2] : (d) => F[d >> 2];
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Jb = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Kb = (a, b) => {
        var c = a >> 1;
        for (var d = c + b / 2; !(c >= d) && C[c]; ) ++c;
        c <<= 1;
        if (32 < c - a && Jb) return Jb.decode(A.subarray(a, c));
        c = '';
        for (d = 0; !(d >= b / 2); ++d) {
          var e = B[(a + 2 * d) >> 1];
          if (0 == e) break;
          c += String.fromCharCode(e);
        }
        return c;
      },
      Lb = (a, b, c) => {
        c ??= 2147483647;
        if (2 > c) return 0;
        c -= 2;
        var d = b;
        c = c < 2 * a.length ? c / 2 : a.length;
        for (var e = 0; e < c; ++e) (B[b >> 1] = a.charCodeAt(e)), (b += 2);
        B[b >> 1] = 0;
        return b - d;
      },
      Mb = (a) => 2 * a.length,
      Nb = (a, b) => {
        for (var c = 0, d = ''; !(c >= b / 4); ) {
          var e = E[(a + 4 * c) >> 2];
          if (0 == e) break;
          ++c;
          65536 <= e
            ? ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))))
            : (d += String.fromCharCode(e));
        }
        return d;
      },
      Ob = (a, b, c) => {
        c ??= 2147483647;
        if (4 > c) return 0;
        var d = b;
        c = d + c - 4;
        for (var e = 0; e < a.length; ++e) {
          var f = a.charCodeAt(e);
          if (55296 <= f && 57343 >= f) {
            var l = a.charCodeAt(++e);
            f = (65536 + ((f & 1023) << 10)) | (l & 1023);
          }
          E[b >> 2] = f;
          b += 4;
          if (b + 4 > c) break;
        }
        E[b >> 2] = 0;
        return b - d;
      },
      Pb = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          b += 4;
        }
        return b;
      },
      Qb = [],
      Rb = (a) => {
        var b = Qb.length;
        Qb.push(a);
        return b;
      },
      Sb = (a, b) => {
        for (var c = Array(a), d = 0; d < a; ++d) c[d] = Gb(F[(b + 4 * d) >> 2], 'parameter ' + d);
        return c;
      },
      Tb = Reflect.construct,
      Ub = {},
      Wb = () => {
        if (!Vb) {
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
              _: da || './this.program',
            },
            b;
          for (b in Ub) void 0 === Ub[b] ? delete a[b] : (a[b] = Ub[b]);
          var c = [];
          for (b in a) c.push(`${b}=${a[b]}`);
          Vb = c;
        }
        return Vb;
      },
      Vb,
      Xb = [null, [], []],
      Yb = () => {
        if ('object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
          return (a) => crypto.getRandomValues(a);
        ta('initRandomDevice');
      },
      Zb = (a) => (Zb = Yb())(a),
      $b = (a) => 0 === a % 4 && (0 !== a % 100 || 0 === a % 400),
      ac = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      bc = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function cc(a) {
      var b = Array(Ha(a) + 1);
      Ia(a, b, 0, b.length);
      return b;
    }
    var dc = (a, b, c, d) => {
      function e(g, q, r) {
        for (g = 'number' == typeof g ? g.toString() : g || ''; g.length < q; ) g = r[0] + g;
        return g;
      }
      function f(g, q) {
        return e(g, q, '0');
      }
      function l(g, q) {
        function r(P) {
          return 0 > P ? -1 : 0 < P ? 1 : 0;
        }
        var z;
        0 === (z = r(g.getFullYear() - q.getFullYear())) &&
          0 === (z = r(g.getMonth() - q.getMonth())) &&
          (z = r(g.getDate() - q.getDate()));
        return z;
      }
      function h(g) {
        switch (g.getDay()) {
          case 0:
            return new Date(g.getFullYear() - 1, 11, 29);
          case 1:
            return g;
          case 2:
            return new Date(g.getFullYear(), 0, 3);
          case 3:
            return new Date(g.getFullYear(), 0, 2);
          case 4:
            return new Date(g.getFullYear(), 0, 1);
          case 5:
            return new Date(g.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(g.getFullYear() - 1, 11, 30);
        }
      }
      function n(g) {
        var q = g.Ja;
        for (g = new Date(new Date(g.Ka + 1900, 0, 1).getTime()); 0 < q; ) {
          var r = g.getMonth(),
            z = ($b(g.getFullYear()) ? ac : bc)[r];
          if (q > z - g.getDate())
            (q -= z - g.getDate() + 1),
              g.setDate(1),
              11 > r ? g.setMonth(r + 1) : (g.setMonth(0), g.setFullYear(g.getFullYear() + 1));
          else {
            g.setDate(g.getDate() + q);
            break;
          }
        }
        r = new Date(g.getFullYear() + 1, 0, 4);
        q = h(new Date(g.getFullYear(), 0, 4));
        r = h(r);
        return 0 >= l(q, g) ? (0 >= l(r, g) ? g.getFullYear() + 1 : g.getFullYear()) : g.getFullYear() - 1;
      }
      var m = F[(d + 40) >> 2];
      d = {
        tb: E[d >> 2],
        sb: E[(d + 4) >> 2],
        Sa: E[(d + 8) >> 2],
        Wa: E[(d + 12) >> 2],
        Ta: E[(d + 16) >> 2],
        Ka: E[(d + 20) >> 2],
        Ha: E[(d + 24) >> 2],
        Ja: E[(d + 28) >> 2],
        xb: E[(d + 32) >> 2],
        rb: E[(d + 36) >> 2],
        ub: m ? (m ? K(A, m) : '') : '',
      };
      c = c ? K(A, c) : '';
      m = {
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
      for (var p in m) c = c.replace(new RegExp(p, 'g'), m[p]);
      var u = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' '),
        v = 'January February March April May June July August September October November December'.split(' ');
      m = {
        '%a': (g) => u[g.Ha].substring(0, 3),
        '%A': (g) => u[g.Ha],
        '%b': (g) => v[g.Ta].substring(0, 3),
        '%B': (g) => v[g.Ta],
        '%C': (g) => f(((g.Ka + 1900) / 100) | 0, 2),
        '%d': (g) => f(g.Wa, 2),
        '%e': (g) => e(g.Wa, 2, ' '),
        '%g': (g) => n(g).toString().substring(2),
        '%G': n,
        '%H': (g) => f(g.Sa, 2),
        '%I': (g) => {
          g = g.Sa;
          0 == g ? (g = 12) : 12 < g && (g -= 12);
          return f(g, 2);
        },
        '%j': (g) => {
          for (var q = 0, r = 0; r <= g.Ta - 1; q += ($b(g.Ka + 1900) ? ac : bc)[r++]);
          return f(g.Wa + q, 3);
        },
        '%m': (g) => f(g.Ta + 1, 2),
        '%M': (g) => f(g.sb, 2),
        '%n': () => '\n',
        '%p': (g) => (0 <= g.Sa && 12 > g.Sa ? 'AM' : 'PM'),
        '%S': (g) => f(g.tb, 2),
        '%t': () => '\t',
        '%u': (g) => g.Ha || 7,
        '%U': (g) => f(Math.floor((g.Ja + 7 - g.Ha) / 7), 2),
        '%V': (g) => {
          var q = Math.floor((g.Ja + 7 - ((g.Ha + 6) % 7)) / 7);
          2 >= (g.Ha + 371 - g.Ja - 2) % 7 && q++;
          if (q) 53 == q && ((r = (g.Ha + 371 - g.Ja) % 7), 4 == r || (3 == r && $b(g.Ka)) || (q = 1));
          else {
            q = 52;
            var r = (g.Ha + 7 - g.Ja - 1) % 7;
            (4 == r || (5 == r && $b((g.Ka % 400) - 1))) && q++;
          }
          return f(q, 2);
        },
        '%w': (g) => g.Ha,
        '%W': (g) => f(Math.floor((g.Ja + 7 - ((g.Ha + 6) % 7)) / 7), 2),
        '%y': (g) => (g.Ka + 1900).toString().substring(2),
        '%Y': (g) => g.Ka + 1900,
        '%z': (g) => {
          g = g.rb;
          var q = 0 <= g;
          g = Math.abs(g) / 60;
          return (q ? '+' : '-') + String('0000' + ((g / 60) * 100 + (g % 60))).slice(-4);
        },
        '%Z': (g) => g.ub,
        '%%': () => '%',
      };
      c = c.replace(/%%/g, '\x00\x00');
      for (p in m) c.includes(p) && (c = c.replace(new RegExp(p, 'g'), m[p](d)));
      c = c.replace(/\0\0/g, '%');
      p = cc(c);
      if (p.length > b) return 0;
      y.set(p, a);
      return p.length - 1;
    };
    Na = k.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    for (var ec = Array(256), fc = 0; 256 > fc; ++fc) ec[fc] = String.fromCharCode(fc);
    Oa = ec;
    R = k.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    Object.assign(cb.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof cb && a instanceof cb)) return !1;
        var b = this.pa.Aa.ya,
          c = this.pa.za;
        a.pa = a.pa;
        var d = a.pa.Aa.ya;
        for (a = a.pa.za; b.Da; ) (c = b.Oa(c)), (b = b.Da);
        for (; d.Da; ) (a = d.Oa(a)), (d = d.Da);
        return b === d && c === a;
      },
      clone: function () {
        this.pa.za || Ra(this);
        if (this.pa.Na) return (this.pa.count.value += 1), this;
        var a = ab,
          b = Object,
          c = b.create,
          d = Object.getPrototypeOf(this),
          e = this.pa;
        a = a(
          c.call(b, d, {
            pa: { value: { count: e.count, La: e.La, Na: e.Na, za: e.za, Aa: e.Aa, Ba: e.Ba, Ea: e.Ea } },
          }),
        );
        a.pa.count.value += 1;
        a.pa.La = !1;
        return a;
      },
      ['delete']() {
        this.pa.za || Ra(this);
        if (this.pa.La && !this.pa.Na) throw new R('Object already scheduled for deletion');
        Ta(this);
        var a = this.pa;
        --a.count.value;
        0 === a.count.value && (a.Ba ? a.Ea.Ga(a.Ba) : a.Aa.ya.Ga(a.za));
        this.pa.Na || ((this.pa.Ba = void 0), (this.pa.za = void 0));
      },
      isDeleted: function () {
        return !this.pa.za;
      },
      deleteLater: function () {
        this.pa.za || Ra(this);
        if (this.pa.La && !this.pa.Na) throw new R('Object already scheduled for deletion');
        Wa.push(this);
        1 === Wa.length && Ya && Ya(Xa);
        this.pa.La = !0;
        return this;
      },
    });
    k.getInheritedInstanceCount = () => Object.keys(Za).length;
    k.getLiveInheritedInstances = () => {
      var a = [],
        b;
      for (b in Za) Za.hasOwnProperty(b) && a.push(Za[b]);
      return a;
    };
    k.flushPendingDeletes = Xa;
    k.setDelayFunction = (a) => {
      Ya = a;
      Wa.length && Ya && Ya(Xa);
    };
    Object.assign(ob.prototype, {
      fb(a) {
        this.$a && (a = this.$a(a));
        return a;
      },
      Ya(a) {
        this.Ga?.(a);
      },
      argPackAdvance: 8,
      readValueFromPointer: La,
      fromWireType: function (a) {
        function b() {
          return this.Ra
            ? bb(this.ya.Ma, { Aa: this.kb, za: c, Ea: this, Ba: a })
            : bb(this.ya.Ma, { Aa: this, za: a });
        }
        var c = this.fb(a);
        if (!c) return this.Ya(a), null;
        var d = $a(this.ya, c);
        if (void 0 !== d) {
          if (0 === d.pa.count.value) return (d.pa.za = c), (d.pa.Ba = a), d.clone();
          d = d.clone();
          this.Ya(a);
          return d;
        }
        d = this.ya.eb(c);
        d = Va[d];
        if (!d) return b.call(this);
        d = this.Qa ? d.ab : d.pointerType;
        var e = Ua(c, this.ya, d.ya);
        return null === e
          ? b.call(this)
          : this.Ra
          ? bb(d.ya.Ma, { Aa: d, za: e, Ea: this, Ba: a })
          : bb(d.ya.Ma, { Aa: d, za: e });
      },
    });
    sb = k.UnboundTypeError = ((a, b) => {
      var c = db(b, function (d) {
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
    k.count_emval_handles = () => V.length / 2 - 5 - Bb.length;
    var qc = {
        c: (a, b, c, d) => {
          ta(
            `Assertion failed: ${a ? K(A, a) : ''}, at: ` +
              [b ? (b ? K(A, b) : '') : 'unknown filename', c, d ? (d ? K(A, d) : '') : 'unknown function'],
          );
        },
        m: (a, b, c) => {
          var d = new Ea(a);
          F[(d.za + 16) >> 2] = 0;
          F[(d.za + 4) >> 2] = b;
          F[(d.za + 8) >> 2] = c;
          Fa = a;
          Ga++;
          throw Fa;
        },
        T: () => {},
        S: () => {},
        n: function () {
          return 0;
        },
        O: () => {},
        L: () => {},
        M: () => {},
        R: function () {},
        K: () => {},
        N: () => {},
        w: (a) => {
          var b = Ja[a];
          delete Ja[a];
          var c = b.Va,
            d = b.Ga,
            e = b.Za,
            f = e.map((l) => l.ib).concat(e.map((l) => l.ob));
          O([a], f, (l) => {
            var h = {};
            e.forEach((n, m) => {
              var p = l[m],
                u = n.gb,
                v = n.hb,
                g = l[m + e.length],
                q = n.nb,
                r = n.pb;
              h[n.cb] = {
                read: (z) => p.fromWireType(u(v, z)),
                write: (z, P) => {
                  var D = [];
                  q(r, z, g.toWireType(D, P));
                  Ka(D);
                },
              };
            });
            return [
              {
                name: b.name,
                fromWireType: (n) => {
                  var m = {},
                    p;
                  for (p in h) m[p] = h[p].read(n);
                  d(n);
                  return m;
                },
                toWireType: (n, m) => {
                  for (var p in h) if (!(p in m)) throw new TypeError(`Missing field: "${p}"`);
                  var u = c();
                  for (p in h) h[p].write(u, m[p]);
                  null !== n && n.push(d, u);
                  return u;
                },
                argPackAdvance: 8,
                readValueFromPointer: La,
                Fa: d,
              },
            ];
          });
        },
        E: () => {},
        _: (a, b, c, d) => {
          b = Q(b);
          N(a, {
            name: b,
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, f) {
              return f ? c : d;
            },
            argPackAdvance: 8,
            readValueFromPointer: function (e) {
              return this.fromWireType(A[e]);
            },
            Fa: null,
          });
        },
        s: (a, b, c, d, e, f, l, h, n, m, p, u, v) => {
          p = Q(p);
          f = T(e, f);
          h &&= T(l, h);
          m &&= T(n, m);
          v = T(u, v);
          var g = gb(p);
          fb(g, function () {
            vb(`Cannot construct ${p} due to unbound types`, [d]);
          });
          O([a, b, c], d ? [d] : [], (q) => {
            q = q[0];
            if (d) {
              var r = q.ya;
              var z = r.Ma;
            } else z = cb.prototype;
            q = db(p, function (...Qa) {
              if (Object.getPrototypeOf(this) !== P) throw new R("Use 'new' to construct " + p);
              if (void 0 === D.Ia) throw new R(p + ' has no accessible constructor');
              var Ab = D.Ia[Qa.length];
              if (void 0 === Ab)
                throw new R(
                  `Tried to invoke ctor of ${p} with invalid number of parameters (${
                    Qa.length
                  }) - expected (${Object.keys(D.Ia).toString()}) parameters instead!`,
                );
              return Ab.apply(this, Qa);
            });
            var P = Object.create(z, { constructor: { value: q } });
            q.prototype = P;
            var D = new hb(p, q, P, v, r, f, h, m);
            if (D.Da) {
              var ka;
              (ka = D.Da).Xa ?? (ka.Xa = []);
              D.Da.Xa.push(D);
            }
            r = new ob(p, D, !0, !1, !1);
            ka = new ob(p + '*', D, !1, !1, !1);
            z = new ob(p + ' const*', D, !1, !0, !1);
            Va[a] = { pointerType: ka, ab: z };
            pb(g, q);
            return [r, ka, z];
          });
        },
        r: (a, b, c, d, e, f) => {
          var l = wb(b, c);
          e = T(d, e);
          O([], [a], (h) => {
            h = h[0];
            var n = `constructor ${h.name}`;
            void 0 === h.ya.Ia && (h.ya.Ia = []);
            if (void 0 !== h.ya.Ia[b - 1])
              throw new R(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  h.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            h.ya.Ia[b - 1] = () => {
              vb(`Cannot construct ${h.name} due to unbound types`, l);
            };
            O([], l, (m) => {
              m.splice(1, 0, null);
              h.ya.Ia[b - 1] = yb(n, m, null, e, f);
              return [];
            });
            return [];
          });
        },
        f: (a, b, c, d, e, f, l, h) => {
          var n = wb(c, d);
          b = Q(b);
          b = zb(b);
          f = T(e, f);
          O([], [a], (m) => {
            function p() {
              vb(`Cannot call ${u} due to unbound types`, n);
            }
            m = m[0];
            var u = `${m.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            h && m.ya.lb.push(b);
            var v = m.ya.Ma,
              g = v[b];
            void 0 === g || (void 0 === g.Ca && g.className !== m.name && g.Pa === c - 2)
              ? ((p.Pa = c - 2), (p.className = m.name), (v[b] = p))
              : (eb(v, b, u), (v[b].Ca[c - 2] = p));
            O([], n, (q) => {
              q = yb(u, q, m, f, l);
              void 0 === v[b].Ca ? ((q.Pa = c - 2), (v[b] = q)) : (v[b].Ca[c - 2] = q);
              return [];
            });
            return [];
          });
        },
        Z: (a) => N(a, Eb),
        y: (a, b, c, d) => {
          function e() {}
          b = Q(b);
          e.values = {};
          N(a, {
            name: b,
            constructor: e,
            fromWireType: function (f) {
              return this.constructor.values[f];
            },
            toWireType: (f, l) => l.value,
            argPackAdvance: 8,
            readValueFromPointer: Fb(b, c, d),
            Fa: null,
          });
          fb(b, e);
        },
        k: (a, b, c) => {
          var d = Gb(a, 'enum');
          b = Q(b);
          a = d.constructor;
          d = Object.create(d.constructor.prototype, {
            value: { value: c },
            constructor: { value: db(`${d.name}_${b}`, function () {}) },
          });
          a.values[c] = d;
          a[b] = d;
        },
        B: (a, b, c) => {
          b = Q(b);
          N(a, {
            name: b,
            fromWireType: (d) => d,
            toWireType: (d, e) => e,
            argPackAdvance: 8,
            readValueFromPointer: Hb(b, c),
            Fa: null,
          });
        },
        v: (a, b, c, d, e, f) => {
          var l = wb(b, c);
          a = Q(a);
          a = zb(a);
          e = T(d, e);
          fb(
            a,
            function () {
              vb(`Cannot call ${a} due to unbound types`, l);
            },
            b - 1,
          );
          O([], l, (h) => {
            pb(a, yb(a, [h[0], null].concat(h.slice(1)), null, e, f), b - 1);
            return [];
          });
        },
        l: (a, b, c, d, e) => {
          b = Q(b);
          -1 === e && (e = 4294967295);
          e = (h) => h;
          if (0 === d) {
            var f = 32 - 8 * c;
            e = (h) => (h << f) >>> f;
          }
          var l = b.includes('unsigned')
            ? function (h, n) {
                return n >>> 0;
              }
            : function (h, n) {
                return n;
              };
          N(a, {
            name: b,
            fromWireType: e,
            toWireType: l,
            argPackAdvance: 8,
            readValueFromPointer: Ib(b, c, 0 !== d),
            Fa: null,
          });
        },
        g: (a, b, c) => {
          function d(f) {
            return new e(y.buffer, F[(f + 4) >> 2], F[f >> 2]);
          }
          var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][
            b
          ];
          c = Q(c);
          N(a, { name: c, fromWireType: d, argPackAdvance: 8, readValueFromPointer: d }, { jb: !0 });
        },
        u: (a) => {
          N(a, Eb);
        },
        ea: (a, b, c, d, e, f, l, h, n, m, p, u) => {
          c = Q(c);
          f = T(e, f);
          h = T(l, h);
          m = T(n, m);
          u = T(p, u);
          O([a], [b], (v) => {
            v = v[0];
            return [new ob(c, v.ya, !1, !1, !0, v, d, f, h, m, u)];
          });
        },
        C: (a, b) => {
          b = Q(b);
          var c = 'std::string' === b;
          N(a, {
            name: b,
            fromWireType: function (d) {
              var e = F[d >> 2],
                f = d + 4;
              if (c)
                for (var l = f, h = 0; h <= e; ++h) {
                  var n = f + h;
                  if (h == e || 0 == A[n]) {
                    l = l ? K(A, l, n - l) : '';
                    if (void 0 === m) var m = l;
                    else (m += String.fromCharCode(0)), (m += l);
                    l = n + 1;
                  }
                }
              else {
                m = Array(e);
                for (h = 0; h < e; ++h) m[h] = String.fromCharCode(A[f + h]);
                m = m.join('');
              }
              U(d);
              return m;
            },
            toWireType: function (d, e) {
              e instanceof ArrayBuffer && (e = new Uint8Array(e));
              var f = 'string' == typeof e;
              if (!(f || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array))
                throw new R('Cannot pass non-string to std::string');
              var l = c && f ? Ha(e) : e.length;
              var h = gc(4 + l + 1),
                n = h + 4;
              F[h >> 2] = l;
              if (c && f) Ia(e, A, n, l + 1);
              else if (f)
                for (f = 0; f < l; ++f) {
                  var m = e.charCodeAt(f);
                  if (255 < m) throw (U(n), new R('String has UTF-16 code units that do not fit in 8 bits'));
                  A[n + f] = m;
                }
              else for (f = 0; f < l; ++f) A[n + f] = e[f];
              null !== d && d.push(U, h);
              return h;
            },
            argPackAdvance: 8,
            readValueFromPointer: La,
            Fa(d) {
              U(d);
            },
          });
        },
        t: (a, b, c) => {
          c = Q(c);
          if (2 === b) {
            var d = Kb;
            var e = Lb;
            var f = Mb;
            var l = (h) => C[h >> 1];
          } else 4 === b && ((d = Nb), (e = Ob), (f = Pb), (l = (h) => F[h >> 2]));
          N(a, {
            name: c,
            fromWireType: (h) => {
              for (var n = F[h >> 2], m, p = h + 4, u = 0; u <= n; ++u) {
                var v = h + 4 + u * b;
                if (u == n || 0 == l(v))
                  (p = d(p, v - p)), void 0 === m ? (m = p) : ((m += String.fromCharCode(0)), (m += p)), (p = v + b);
              }
              U(h);
              return m;
            },
            toWireType: (h, n) => {
              if ('string' != typeof n) throw new R(`Cannot pass non-string to C++ string type ${c}`);
              var m = f(n),
                p = gc(4 + m + b);
              F[p >> 2] = m / b;
              e(n, p + 4, m + b);
              null !== h && h.push(U, p);
              return p;
            },
            argPackAdvance: 8,
            readValueFromPointer: La,
            Fa(h) {
              U(h);
            },
          });
        },
        x: (a, b, c, d, e, f) => {
          Ja[a] = { name: Q(b), Va: T(c, d), Ga: T(e, f), Za: [] };
        },
        j: (a, b, c, d, e, f, l, h, n, m) => {
          Ja[a].Za.push({ cb: Q(b), ib: c, gb: T(d, e), hb: f, ob: l, nb: T(h, n), pb: m });
        },
        $: (a, b) => {
          b = Q(b);
          N(a, { vb: !0, name: b, argPackAdvance: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        F: () => {
          throw Infinity;
        },
        ca: (a, b, c, d) => {
          a = Qb[a];
          b = Db(b);
          return a(null, b, c, d);
        },
        D: Cb,
        ba: (a, b, c) => {
          var d = Sb(a, b),
            e = d.shift();
          a--;
          var f = Array(a);
          b = `methodCaller<(${d.map((l) => l.name).join(', ')}) => ${e.name}>`;
          return Rb(
            db(b, (l, h, n, m) => {
              for (var p = 0, u = 0; u < a; ++u) (f[u] = d[u].readValueFromPointer(m + p)), (p += d[u].argPackAdvance);
              h = 1 === c ? Tb(h, f) : h.apply(l, f);
              l = [];
              h = e.toWireType(l, h);
              l.length && (F[n >> 2] = mb(l));
              return h;
            }),
          );
        },
        da: (a) => {
          9 < a && (V[a + 1] += 1);
        },
        aa: (a) => {
          var b = Db(a);
          Ka(b);
          Cb(a);
        },
        p: (a, b) => {
          a = Gb(a, '_emval_take_value');
          a = a.readValueFromPointer(b);
          return mb(a);
        },
        Y: () => {
          ta('');
        },
        J: () => 2147483648,
        fa: () => performance.now(),
        H: (a) => {
          var b = A.length;
          a >>>= 0;
          if (2147483648 < a) return !1;
          for (var c = 1; 4 >= c; c *= 2) {
            var d = b * (1 + 0.2 / c);
            d = Math.min(d, a + 100663296);
            var e = Math;
            d = Math.max(a, d);
            a: {
              e =
                (e.min.call(e, 2147483648, d + ((65536 - (d % 65536)) % 65536)) - ha.buffer.byteLength + 65535) / 65536;
              try {
                ha.grow(e);
                ma();
                var f = 1;
                break a;
              } catch (l) {}
              f = void 0;
            }
            if (f) return !0;
          }
          return !1;
        },
        V: (a, b) => {
          var c = 0;
          Wb().forEach((d, e) => {
            var f = b + c;
            e = F[(a + 4 * e) >> 2] = f;
            for (f = 0; f < d.length; ++f) y[e++] = d.charCodeAt(f);
            y[e] = 0;
            c += d.length + 1;
          });
          return 0;
        },
        W: (a, b) => {
          var c = Wb();
          F[a >> 2] = c.length;
          var d = 0;
          c.forEach((e) => (d += e.length + 1));
          F[b >> 2] = d;
          return 0;
        },
        A: () => 52,
        I: (a, b) => {
          var c = 0;
          if (0 == a) c = 2;
          else if (1 == a || 2 == a) c = 64;
          y[b] = 2;
          B[(b + 2) >> 1] = 1;
          J = [
            c >>> 0,
            ((I = c),
            1 <= +Math.abs(I)
              ? 0 < I
                ? +Math.floor(I / 4294967296) >>> 0
                : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0
              : 0),
          ];
          E[(b + 8) >> 2] = J[0];
          E[(b + 12) >> 2] = J[1];
          J = [
            0,
            ((I = 0),
            1 <= +Math.abs(I)
              ? 0 < I
                ? +Math.floor(I / 4294967296) >>> 0
                : ~~+Math.ceil((I - +(~~I >>> 0)) / 4294967296) >>> 0
              : 0),
          ];
          E[(b + 16) >> 2] = J[0];
          E[(b + 20) >> 2] = J[1];
          return 0;
        },
        Q: () => 52,
        P: (a, b, c, d) => {
          for (var e = 0, f = 0; f < c; f++) {
            var l = F[b >> 2],
              h = F[(b + 4) >> 2];
            b += 8;
            for (var n = 0; n < h; n++) {
              var m = A[l + n],
                p = Xb[a];
              0 === m || 10 === m ? ((1 === a ? fa : w)(K(p, 0)), (p.length = 0)) : p.push(m);
            }
            e += h;
          }
          F[d >> 2] = e;
          return 0;
        },
        X: (a, b) => {
          Zb(A.subarray(a, a + b));
          return 0;
        },
        i: hc,
        d: ic,
        e: jc,
        q: kc,
        z: lc,
        b: mc,
        a: nc,
        h: oc,
        o: pc,
        U: (a) => {
          Ca || (k.onExit?.(a), (ia = !0));
          ea(a, new Aa(a));
        },
        G: (a, b, c, d) => dc(a, b, c, d),
      },
      W = (function () {
        function a(c) {
          W = c.exports;
          ha = W.ga;
          ma();
          S = W.ka;
          oa.unshift(W.ha);
          G--;
          k.monitorRunDependencies?.(G);
          0 == G && (null !== ra && (clearInterval(ra), (ra = null)), sa && ((c = sa), (sa = null), c()));
          return W;
        }
        var b = { a: qc };
        G++;
        k.monitorRunDependencies?.(G);
        if (k.instantiateWasm)
          try {
            return k.instantiateWasm(b, a);
          } catch (c) {
            w(`Module.instantiateWasm callback failed with error: ${c}`), ba(c);
          }
        za(b, function (c) {
          a(c.instance);
        }).catch(ba);
        return {};
      })(),
      gc = (a) => (gc = W.ia)(a),
      tb = (a) => (tb = W.ja)(a),
      U = (a) => (U = W.la)(a),
      X = (a, b) => (X = W.ma)(a, b),
      Y = (a) => (Y = W.na)(a),
      Z = () => (Z = W.oa)();
    k.dynCall_iijj = (a, b, c, d, e, f) => (k.dynCall_iijj = W.qa)(a, b, c, d, e, f);
    k.dynCall_vijj = (a, b, c, d, e, f) => (k.dynCall_vijj = W.ra)(a, b, c, d, e, f);
    k.dynCall_jiii = (a, b, c, d) => (k.dynCall_jiii = W.sa)(a, b, c, d);
    k.dynCall_jii = (a, b, c) => (k.dynCall_jii = W.ta)(a, b, c);
    k.dynCall_viijii = (a, b, c, d, e, f, l) => (k.dynCall_viijii = W.ua)(a, b, c, d, e, f, l);
    k.dynCall_iiiiij = (a, b, c, d, e, f, l) => (k.dynCall_iiiiij = W.va)(a, b, c, d, e, f, l);
    k.dynCall_iiiiijj = (a, b, c, d, e, f, l, h, n) => (k.dynCall_iiiiijj = W.wa)(a, b, c, d, e, f, l, h, n);
    k.dynCall_iiiiiijj = (a, b, c, d, e, f, l, h, n, m) => (k.dynCall_iiiiiijj = W.xa)(a, b, c, d, e, f, l, h, n, m);
    function nc(a, b, c) {
      var d = Z();
      try {
        S.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function mc(a, b) {
      var c = Z();
      try {
        S.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function jc(a, b, c, d) {
      var e = Z();
      try {
        return S.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function ic(a, b, c) {
      var d = Z();
      try {
        return S.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function hc(a, b) {
      var c = Z();
      try {
        return S.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function kc(a, b, c, d, e, f) {
      var l = Z();
      try {
        return S.get(a)(b, c, d, e, f);
      } catch (h) {
        Y(l);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function pc(a, b, c, d, e) {
      var f = Z();
      try {
        S.get(a)(b, c, d, e);
      } catch (l) {
        Y(f);
        if (l !== l + 0) throw l;
        X(1, 0);
      }
    }
    function oc(a, b, c, d) {
      var e = Z();
      try {
        S.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function lc(a) {
      var b = Z();
      try {
        S.get(a)();
      } catch (c) {
        Y(b);
        if (c !== c + 0) throw c;
        X(1, 0);
      }
    }
    var rc;
    sa = function sc() {
      rc || tc();
      rc || (sa = sc);
    };
    function tc() {
      function a() {
        if (!rc && ((rc = !0), (k.calledRun = !0), !ia)) {
          Ba(oa);
          aa(k);
          if (k.onRuntimeInitialized) k.onRuntimeInitialized();
          if (k.postRun)
            for ('function' == typeof k.postRun && (k.postRun = [k.postRun]); k.postRun.length; ) {
              var b = k.postRun.shift();
              pa.unshift(b);
            }
          Ba(pa);
        }
      }
      if (!(0 < G)) {
        if (k.preRun) for ('function' == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; ) qa();
        Ba(na);
        0 < G ||
          (k.setStatus
            ? (k.setStatus('Running...'),
              setTimeout(function () {
                setTimeout(function () {
                  k.setStatus('');
                }, 1);
                a();
              }, 1))
            : a());
      }
    }
    if (k.preInit)
      for ('function' == typeof k.preInit && (k.preInit = [k.preInit]); 0 < k.preInit.length; ) k.preInit.pop()();
    tc();

    return readyPromise;
  };
})();
export default createDotLottiePlayerModule;
