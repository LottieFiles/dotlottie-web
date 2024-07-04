const createDotLottiePlayerModule = (() => {
  const _scriptDir = typeof document != 'undefined' ? document.currentScript?.src : undefined;

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
      t = '';
    'undefined' != typeof document && document.currentScript && (t = document.currentScript.src);
    _scriptDir && (t = _scriptDir);
    t.startsWith('blob:') ? (t = '') : (t = t.substr(0, t.replace(/[?#].*/, '').lastIndexOf('/') + 1));
    var ea = k.print || console.log.bind(console),
      w = k.printErr || console.error.bind(console);
    Object.assign(k, ca);
    ca = null;
    k.thisProgram && (da = k.thisProgram);
    var x;
    k.wasmBinary && (x = k.wasmBinary);
    var fa,
      ha = !1,
      y,
      A,
      B,
      C,
      E,
      F,
      ja,
      ka;
    function la() {
      var a = fa.buffer;
      k.HEAP8 = y = new Int8Array(a);
      k.HEAP16 = B = new Int16Array(a);
      k.HEAPU8 = A = new Uint8Array(a);
      k.HEAPU16 = C = new Uint16Array(a);
      k.HEAP32 = E = new Int32Array(a);
      k.HEAPU32 = F = new Uint32Array(a);
      k.HEAPF32 = ja = new Float32Array(a);
      k.HEAPF64 = ka = new Float64Array(a);
    }
    var ma = [],
      na = [],
      oa = [];
    function pa() {
      var a = k.preRun.shift();
      ma.unshift(a);
    }
    var G = 0,
      qa = null,
      H = null;
    function ra(a) {
      k.onAbort?.(a);
      a = 'Aborted(' + a + ')';
      w(a);
      ha = !0;
      a = new WebAssembly.RuntimeError(a + '. Build with -sASSERTIONS for more info.');
      ba(a);
      throw a;
    }
    var sa = (a) => a.startsWith('data:application/octet-stream;base64,'),
      I;
    I = 'DotLottiePlayer.wasm';
    if (!sa(I)) {
      var ta = I;
      I = k.locateFile ? k.locateFile(ta, t) : t + ta;
    }
    function ua(a) {
      if (a == I && x) return new Uint8Array(x);
      throw 'both async and sync fetching of the wasm failed';
    }
    function va(a) {
      return x || 'function' != typeof fetch
        ? Promise.resolve().then(() => ua(a))
        : fetch(a, { credentials: 'same-origin' })
            .then((b) => {
              if (!b.ok) throw `failed to load wasm binary file at '${a}'`;
              return b.arrayBuffer();
            })
            .catch(() => ua(a));
    }
    function wa(a, b, c) {
      return va(a)
        .then((d) => WebAssembly.instantiate(d, b))
        .then(c, (d) => {
          w(`failed to asynchronously prepare wasm: ${d}`);
          ra(d);
        });
    }
    function xa(a, b) {
      var c = I;
      return x || 'function' != typeof WebAssembly.instantiateStreaming || sa(c) || 'function' != typeof fetch
        ? wa(c, a, b)
        : fetch(c, { credentials: 'same-origin' }).then((d) =>
            WebAssembly.instantiateStreaming(d, a).then(b, function (e) {
              w(`wasm streaming compile failed: ${e}`);
              w('falling back to ArrayBuffer instantiation');
              return wa(c, a, b);
            }),
          );
    }
    var ya = (a) => {
        for (; 0 < a.length; ) a.shift()(k);
      },
      za = 'undefined' != typeof TextDecoder ? new TextDecoder('utf8') : void 0,
      J = (a, b, c) => {
        var d = b + c;
        for (c = b; a[c] && !(c >= d); ) ++c;
        if (16 < c - b && a.buffer && za) return za.decode(a.subarray(b, c));
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
    class Aa {
      constructor(a) {
        this.ya = a - 24;
      }
    }
    var Ba = 0,
      Ca = 0,
      Da = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          127 >= d ? b++ : 2047 >= d ? (b += 2) : 55296 <= d && 57343 >= d ? ((b += 4), ++c) : (b += 3);
        }
        return b;
      },
      Ea = (a, b, c, d) => {
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
      Fa = {},
      Ga = (a) => {
        for (; a.length; ) {
          var b = a.pop();
          a.pop()(b);
        }
      };
    function K(a) {
      return this.fromWireType(F[a >> 2]);
    }
    var L = {},
      M = {},
      Ha = {},
      Ia,
      P = (a, b, c) => {
        function d(h) {
          h = c(h);
          if (h.length !== a.length) throw new Ia('Mismatched type converter count');
          for (var n = 0; n < a.length; ++n) O(a[n], h[n]);
        }
        a.forEach(function (h) {
          Ha[h] = b;
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
      Ja,
      Q = (a) => {
        for (var b = ''; A[a]; ) b += Ja[A[a++]];
        return b;
      },
      R;
    function Ka(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new R(`type "${d}" must have a positive integer typeid pointer`);
      if (M.hasOwnProperty(a)) {
        if (c.ib) return;
        throw new R(`Cannot register type '${d}' twice`);
      }
      M[a] = b;
      delete Ha[a];
      L.hasOwnProperty(a) && ((b = L[a]), delete L[a], b.forEach((e) => e()));
    }
    function O(a, b, c = {}) {
      if (!('argPackAdvance' in b)) throw new TypeError('registerType registeredInstance requires argPackAdvance');
      return Ka(a, b, c);
    }
    var La = (a) => {
        throw new R(a.ma.za.xa.name + ' instance already deleted');
      },
      Ma = !1,
      Oa = () => {},
      Pa = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.Ca) return null;
        a = Pa(a, b, c.Ca);
        return null === a ? null : c.ab(a);
      },
      Qa = {},
      Ra = [],
      Sa = () => {
        for (; Ra.length; ) {
          var a = Ra.pop();
          a.ma.Ka = !1;
          a['delete']();
        }
      },
      Ta,
      Ua = {},
      Va = (a, b) => {
        if (void 0 === b) throw new R('ptr should not be undefined');
        for (; a.Ca; ) (b = a.Na(b)), (a = a.Ca);
        return Ua[b];
      },
      Xa = (a, b) => {
        if (!b.za || !b.ya) throw new Ia('makeClassHandle requires ptr and ptrType');
        if (!!b.Da !== !!b.Aa) throw new Ia('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return Wa(Object.create(a, { ma: { value: b, writable: !0 } }));
      },
      Wa = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (Wa = (b) => b), a;
        Ma = new FinalizationRegistry((b) => {
          b = b.ma;
          --b.count.value;
          0 === b.count.value && (b.Aa ? b.Da.Fa(b.Aa) : b.za.xa.Fa(b.ya));
        });
        Wa = (b) => {
          var c = b.ma;
          c.Aa && Ma.register(b, { ma: c }, b);
          return b;
        };
        Oa = (b) => {
          Ma.unregister(b);
        };
        return Wa(a);
      };
    function Ya() {}
    var Za = (a, b) => Object.defineProperty(b, 'name', { value: a }),
      $a = (a, b, c) => {
        if (void 0 === a[b].Ba) {
          var d = a[b];
          a[b] = function (...e) {
            if (!a[b].Ba.hasOwnProperty(e.length))
              throw new R(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].Ba})!`,
              );
            return a[b].Ba[e.length].apply(this, e);
          };
          a[b].Ba = [];
          a[b].Ba[d.Oa] = d;
        }
      },
      ab = (a, b, c) => {
        if (k.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== k[a].Ba && void 0 !== k[a].Ba[c]))
            throw new R(`Cannot register public name '${a}' twice`);
          $a(k, a, a);
          if (k.hasOwnProperty(c))
            throw new R(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          k[a].Ba[c] = b;
        } else (k[a] = b), void 0 !== c && (k[a].vb = c);
      },
      bb = (a) => {
        if (void 0 === a) return '_unknown';
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function cb(a, b, c, d, e, f, l, h) {
      this.name = a;
      this.constructor = b;
      this.La = c;
      this.Fa = d;
      this.Ca = e;
      this.cb = f;
      this.Na = l;
      this.ab = h;
      this.kb = [];
    }
    var db = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.Na) throw new R(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.Na(a);
        b = b.Ca;
      }
      M[a] = b;
      delete Ha[a];
      L.hasOwnProperty(a) && ((b = L[a]), delete L[a], b.forEach((e) => e()));
    };
    function O(a, b, c = {}) {
      if (!('argPackAdvance' in b)) throw new TypeError('registerType registeredInstance requires argPackAdvance');
      return Ka(a, b, c);
    }
    var La = (a) => {
        throw new R(a.ma.za.xa.name + ' instance already deleted');
      },
      Ma = !1,
      Oa = () => {},
      Pa = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.Ca) return null;
        a = Pa(a, b, c.Ca);
        return null === a ? null : c.ab(a);
      },
      Qa = {},
      Ra = [],
      Sa = () => {
        for (; Ra.length; ) {
          var a = Ra.pop();
          a.ma.Ka = !1;
          a['delete']();
        }
      },
      Ta,
      Ua = {},
      Va = (a, b) => {
        if (void 0 === b) throw new R('ptr should not be undefined');
        for (; a.Ca; ) (b = a.Na(b)), (a = a.Ca);
        return Ua[b];
      },
      Xa = (a, b) => {
        if (!b.za || !b.ya) throw new Ia('makeClassHandle requires ptr and ptrType');
        if (!!b.Da !== !!b.Aa) throw new Ia('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return Wa(Object.create(a, { ma: { value: b, writable: !0 } }));
      },
      Wa = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (Wa = (b) => b), a;
        Ma = new FinalizationRegistry((b) => {
          b = b.ma;
          --b.count.value;
          0 === b.count.value && (b.Aa ? b.Da.Fa(b.Aa) : b.za.xa.Fa(b.ya));
        });
        Wa = (b) => {
          var c = b.ma;
          c.Aa && Ma.register(b, { ma: c }, b);
          return b;
        };
        Oa = (b) => {
          Ma.unregister(b);
        };
        return Wa(a);
      };
    function Ya() {}
    var Za = (a, b) => Object.defineProperty(b, 'name', { value: a }),
      $a = (a, b, c) => {
        if (void 0 === a[b].Ba) {
          var d = a[b];
          a[b] = function (...e) {
            if (!a[b].Ba.hasOwnProperty(e.length))
              throw new R(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].Ba})!`,
              );
            return a[b].Ba[e.length].apply(this, e);
          };
          a[b].Ba = [];
          a[b].Ba[d.Oa] = d;
        }
      },
      ab = (a, b, c) => {
        if (k.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== k[a].Ba && void 0 !== k[a].Ba[c]))
            throw new R(`Cannot register public name '${a}' twice`);
          $a(k, a, a);
          if (k.hasOwnProperty(c))
            throw new R(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          k[a].Ba[c] = b;
        } else (k[a] = b), void 0 !== c && (k[a].vb = c);
      },
      bb = (a) => {
        if (void 0 === a) return '_unknown';
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function cb(a, b, c, d, e, f, l, h) {
      this.name = a;
      this.constructor = b;
      this.La = c;
      this.Fa = d;
      this.Ca = e;
      this.cb = f;
      this.Na = l;
      this.ab = h;
      this.kb = [];
    }
    var db = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.Na) throw new R(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.Na(a);
        b = b.Ca;
      }

      return a;
    };
    function eb(a, b) {
      if (null === b) {
        if (this.Ta) throw new R(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.ma) throw new R(`Cannot pass "${fb(b)}" as a ${this.name}`);
      if (!b.ma.ya) throw new R(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return db(b.ma.ya, b.ma.za.xa, this.xa);
    }
    function gb(a, b) {
      if (null === b) {
        if (this.Ta) throw new R(`null is not a valid ${this.name}`);
        if (this.Qa) {
          var c = this.Ua();
          null !== a && a.push(this.Fa, c);
          return c;
        }
        return 0;
      }
      if (!b || !b.ma) throw new R(`Cannot pass "${fb(b)}" as a ${this.name}`);
      if (!b.ma.ya) throw new R(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.Pa && b.ma.za.Pa)
        throw new R(
          `Cannot convert argument of type ${b.ma.Da ? b.ma.Da.name : b.ma.za.name} to parameter type ${this.name}`,
        );
      c = db(b.ma.ya, b.ma.za.xa, this.xa);
      if (this.Qa) {
        if (void 0 === b.ma.Aa) throw new R('Passing raw pointer to smart pointer is illegal');
        switch (this.pb) {
          case 0:
            if (b.ma.Da === this) c = b.ma.Aa;
            else
              throw new R(
                `Cannot convert argument of type ${b.ma.Da ? b.ma.Da.name : b.ma.za.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            c = b.ma.Aa;
            break;
          case 2:
            if (b.ma.Da === this) c = b.ma.Aa;
            else {
              var d = b.clone();
              c = this.lb(
                c,
                hb(() => d['delete']()),
              );
              null !== a && a.push(this.Fa, c);
            }
            break;
          default:
            throw new R('Unsupporting sharing policy');
        }
      }
      return c;
    }
    function ib(a, b) {
      if (null === b) {
        if (this.Ta) throw new R(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.ma) throw new R(`Cannot pass "${fb(b)}" as a ${this.name}`);
      if (!b.ma.ya) throw new R(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.ma.za.Pa) throw new R(`Cannot convert argument of type ${b.ma.za.name} to parameter type ${this.name}`);
      return db(b.ma.ya, b.ma.za.xa, this.xa);
    }
    function jb(a, b, c, d, e, f, l, h, n, m, p) {
      this.name = a;
      this.xa = b;
      this.Ta = c;
      this.Pa = d;
      this.Qa = e;
      this.jb = f;
      this.pb = l;
      this.Za = h;
      this.Ua = n;
      this.lb = m;
      this.Fa = p;
      e || void 0 !== b.Ca ? (this.toWireType = gb) : ((this.toWireType = d ? eb : ib), (this.Ea = null));
    }
    var kb = (a, b, c) => {
        if (!k.hasOwnProperty(a)) throw new Ia('Replacing nonexistent public symbol');
        void 0 !== k[a].Ba && void 0 !== c ? (k[a].Ba[c] = b) : ((k[a] = b), (k[a].Oa = c));
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
        a = Q(a);
        var c = a.includes('j') ? mb(a, b) : S.get(b);
        if ('function' != typeof c) throw new R(`unknown function pointer with signature ${a}: ${b}`);
        return c;
      },
      nb,
      pb = (a) => {
        a = ob(a);
        var b = Q(a);
        U(a);
        return b;
      },
      qb = (a, b) => {
        function c(f) {
          e[f] || M[f] || (Ha[f] ? Ha[f].forEach(c) : (d.push(f), (e[f] = !0)));
        }
        var d = [],
          e = {};
        b.forEach(c);
        throw new nb(`${a}: ` + d.map(pb).join([', ']));
      },
      rb = (a, b) => {
        for (var c = [], d = 0; d < a; d++) c.push(F[(b + 4 * d) >> 2]);
        return c;
      };
    function sb(a) {
      for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].Ea) return !0;
      return !1;
    }
    function tb(a, b, c, d, e) {
      var f = b.length;
      if (2 > f) throw new R("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var l = null !== b[1] && null !== c,
        h = sb(b),
        n = 'void' !== b[0].name,
        m = f - 2,
        p = Array(m),
        u = [],
        v = [];
      return Za(a, function (...g) {
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
        if (h) Ga(v);
        else
          for (r = l ? 1 : 2; r < b.length; r++) {
            var z = 1 === r ? q : p[r - 2];
            null !== b[r].Ea && b[r].Ea(z);
          }
        q = n ? b[0].fromWireType(g) : void 0;
        return q;
      });
    }
    var ub = (a) => {
        a = a.trim();
        const b = a.indexOf('(');
        return -1 !== b ? a.substr(0, b) : a;
      },
      vb = [],
      V = [],
      wb = (a) => {
        9 < a && 0 === --V[a + 1] && ((V[a] = void 0), vb.push(a));
      },
      yb = (a) => {
        if (!a) throw new R('Cannot use deleted val. handle = ' + a);
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
          wb(a);
          return b;
        },
        toWireType: (a, b) => hb(b),
        argPackAdvance: 8,
        readValueFromPointer: K,
        Ea: null,
      },
      Ab = (a, b, c) => {
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
      Bb = (a, b) => {
        var c = M[a];
        if (void 0 === c) throw ((a = `${b} has unknown type ${pb(a)}`), new R(a));
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
              return this.fromWireType(ja[c >> 2]);
            };
          case 8:
            return function (c) {
              return this.fromWireType(ka[c >> 3]);
            };
          default:
            throw new TypeError(`invalid float width (${b}): ${a}`);
        }
      },
      Db = (a, b, c) => {
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
      Eb = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Fb = (a, b) => {
        var c = a >> 1;
        for (var d = c + b / 2; !(c >= d) && C[c]; ) ++c;
        c <<= 1;
        if (32 < c - a && Eb) return Eb.decode(A.subarray(a, c));
        c = '';
        for (d = 0; !(d >= b / 2); ++d) {
          var e = B[(a + 2 * d) >> 1];
          if (0 == e) break;
          c += String.fromCharCode(e);
        }
        return c;
      },
      Gb = (a, b, c) => {
        c ??= 2147483647;
        if (2 > c) return 0;
        c -= 2;
        var d = b;
        c = c < 2 * a.length ? c / 2 : a.length;
        for (var e = 0; e < c; ++e) (B[b >> 1] = a.charCodeAt(e)), (b += 2);
        B[b >> 1] = 0;
        return b - d;
      },
      Hb = (a) => 2 * a.length,
      Ib = (a, b) => {
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
      Jb = (a, b, c) => {
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
      Kb = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          b += 4;
        }
        return b;
      },
      Lb = [],
      Mb = (a) => {
        var b = Lb.length;
        Lb.push(a);
        return b;
      },
      Nb = (a, b) => {
        for (var c = Array(a), d = 0; d < a; ++d) c[d] = Bb(F[(b + 4 * d) >> 2], 'parameter ' + d);
        return c;
      },
      Ob = Reflect.construct,
      Pb = {},
      Rb = () => {
        if (!Qb) {
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
          for (b in Pb) void 0 === Pb[b] ? delete a[b] : (a[b] = Pb[b]);
          var c = [];
          for (b in a) c.push(`${b}=${a[b]}`);
          Qb = c;
        }
        return Qb;
      },
      Qb,
      Sb = [null, [], []],
      Tb = () => {
        if ('object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
          return (a) => crypto.getRandomValues(a);
        ra('initRandomDevice');
      },
      Ub = (a) => (Ub = Tb())(a),
      Vb = (a) => 0 === a % 4 && (0 !== a % 100 || 0 === a % 400),
      Wb = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      Xb = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function Yb(a) {
      var b = Array(Da(a) + 1);
      Ea(a, b, 0, b.length);
      return b;
    }
    var Zb = (a, b, c, d) => {
      function e(g, q, r) {
        for (g = 'number' == typeof g ? g.toString() : g || ''; g.length < q; ) g = r[0] + g;
        return g;
      }
      function f(g, q) {
        return e(g, q, '0');
      }
      function l(g, q) {
        function r(N) {
          return 0 > N ? -1 : 0 < N ? 1 : 0;
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
        var q = g.Ia;
        for (g = new Date(new Date(g.Ja + 1900, 0, 1).getTime()); 0 < q; ) {
          var r = g.getMonth(),
            z = (Vb(g.getFullYear()) ? Wb : Xb)[r];
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
        sb: E[d >> 2],
        rb: E[(d + 4) >> 2],
        Ra: E[(d + 8) >> 2],
        Va: E[(d + 12) >> 2],
        Sa: E[(d + 16) >> 2],
        Ja: E[(d + 20) >> 2],
        Ga: E[(d + 24) >> 2],
        Ia: E[(d + 28) >> 2],
        wb: E[(d + 32) >> 2],
        qb: E[(d + 36) >> 2],
        tb: m ? (m ? J(A, m) : '') : '',
      };
      c = c ? J(A, c) : '';
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
        '%a': (g) => u[g.Ga].substring(0, 3),
        '%A': (g) => u[g.Ga],
        '%b': (g) => v[g.Sa].substring(0, 3),
        '%B': (g) => v[g.Sa],
        '%C': (g) => f(((g.Ja + 1900) / 100) | 0, 2),
        '%d': (g) => f(g.Va, 2),
        '%e': (g) => e(g.Va, 2, ' '),
        '%g': (g) => n(g).toString().substring(2),
        '%G': n,
        '%H': (g) => f(g.Ra, 2),
        '%I': (g) => {
          g = g.Ra;
          0 == g ? (g = 12) : 12 < g && (g -= 12);
          return f(g, 2);
        },
        '%j': (g) => {
          for (var q = 0, r = 0; r <= g.Sa - 1; q += (Vb(g.Ja + 1900) ? Wb : Xb)[r++]);
          return f(g.Va + q, 3);
        },
        '%m': (g) => f(g.Sa + 1, 2),
        '%M': (g) => f(g.rb, 2),
        '%n': () => '\n',
        '%p': (g) => (0 <= g.Ra && 12 > g.Ra ? 'AM' : 'PM'),
        '%S': (g) => f(g.sb, 2),
        '%t': () => '\t',
        '%u': (g) => g.Ga || 7,
        '%U': (g) => f(Math.floor((g.Ia + 7 - g.Ga) / 7), 2),
        '%V': (g) => {
          var q = Math.floor((g.Ia + 7 - ((g.Ga + 6) % 7)) / 7);
          2 >= (g.Ga + 371 - g.Ia - 2) % 7 && q++;
          if (q) 53 == q && ((r = (g.Ga + 371 - g.Ia) % 7), 4 == r || (3 == r && Vb(g.Ja)) || (q = 1));
          else {
            q = 52;
            var r = (g.Ga + 7 - g.Ia - 1) % 7;
            (4 == r || (5 == r && Vb((g.Ja % 400) - 1))) && q++;
          }
          return f(q, 2);
        },
        '%w': (g) => g.Ga,
        '%W': (g) => f(Math.floor((g.Ia + 7 - ((g.Ga + 6) % 7)) / 7), 2),
        '%y': (g) => (g.Ja + 1900).toString().substring(2),
        '%Y': (g) => g.Ja + 1900,
        '%z': (g) => {
          g = g.qb;
          var q = 0 <= g;
          g = Math.abs(g) / 60;
          return (q ? '+' : '-') + String('0000' + ((g / 60) * 100 + (g % 60))).slice(-4);
        },
        '%Z': (g) => g.tb,
        '%%': () => '%',
      };
      c = c.replace(/%%/g, '\x00\x00');
      for (p in m) c.includes(p) && (c = c.replace(new RegExp(p, 'g'), m[p](d)));
      c = c.replace(/\0\0/g, '%');
      p = Yb(c);
      if (p.length > b) return 0;
      y.set(p, a);
      return p.length - 1;
    };
    Ia = k.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    for (var $b = Array(256), ac = 0; 256 > ac; ++ac) $b[ac] = String.fromCharCode(ac);
    Ja = $b;
    R = k.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    Object.assign(Ya.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof Ya && a instanceof Ya)) return !1;
        var b = this.ma.za.xa,
          c = this.ma.ya;
        a.ma = a.ma;
        var d = a.ma.za.xa;
        for (a = a.ma.ya; b.Ca; ) (c = b.Na(c)), (b = b.Ca);
        for (; d.Ca; ) (a = d.Na(a)), (d = d.Ca);
        return b === d && c === a;
      },
      clone: function () {
        this.ma.ya || La(this);
        if (this.ma.Ma) return (this.ma.count.value += 1), this;
        var a = Wa,
          b = Object,
          c = b.create,
          d = Object.getPrototypeOf(this),
          e = this.ma;
        a = a(
          c.call(b, d, {
            ma: { value: { count: e.count, Ka: e.Ka, Ma: e.Ma, ya: e.ya, za: e.za, Aa: e.Aa, Da: e.Da } },
          }),
        );
        a.ma.count.value += 1;
        a.ma.Ka = !1;
        return a;
      },
      ['delete']() {
        this.ma.ya || La(this);
        if (this.ma.Ka && !this.ma.Ma) throw new R('Object already scheduled for deletion');
        Oa(this);
        var a = this.ma;
        --a.count.value;
        0 === a.count.value && (a.Aa ? a.Da.Fa(a.Aa) : a.za.xa.Fa(a.ya));
        this.ma.Ma || ((this.ma.Aa = void 0), (this.ma.ya = void 0));
      },
      isDeleted: function () {
        return !this.ma.ya;
      },
      deleteLater: function () {
        this.ma.ya || La(this);
        if (this.ma.Ka && !this.ma.Ma) throw new R('Object already scheduled for deletion');
        Ra.push(this);
        1 === Ra.length && Ta && Ta(Sa);
        this.ma.Ka = !0;
        return this;
      },
    });
    k.getInheritedInstanceCount = () => Object.keys(Ua).length;
    k.getLiveInheritedInstances = () => {
      var a = [],
        b;
      for (b in Ua) Ua.hasOwnProperty(b) && a.push(Ua[b]);
      return a;
    };
    k.flushPendingDeletes = Sa;
    k.setDelayFunction = (a) => {
      Ta = a;
      Ra.length && Ta && Ta(Sa);
    };
    Object.assign(jb.prototype, {
      eb(a) {
        this.Za && (a = this.Za(a));
        return a;
      },
      Xa(a) {
        this.Fa?.(a);
      },
      argPackAdvance: 8,
      readValueFromPointer: K,
      fromWireType: function (a) {
        function b() {
          return this.Qa
            ? Xa(this.xa.La, { za: this.jb, ya: c, Da: this, Aa: a })
            : Xa(this.xa.La, { za: this, ya: a });
        }
        var c = this.eb(a);
        if (!c) return this.Xa(a), null;
        var d = Va(this.xa, c);
        if (void 0 !== d) {
          if (0 === d.ma.count.value) return (d.ma.ya = c), (d.ma.Aa = a), d.clone();
          d = d.clone();
          this.Xa(a);
          return d;
        }
        d = this.xa.cb(c);
        d = Qa[d];
        if (!d) return b.call(this);
        d = this.Pa ? d.$a : d.pointerType;
        var e = Pa(c, this.xa, d.xa);
        return null === e
          ? b.call(this)
          : this.Qa
          ? Xa(d.xa.La, { za: d, ya: e, Da: this, Aa: a })
          : Xa(d.xa.La, { za: d, ya: e });
      },
    });
    nb = k.UnboundTypeError = ((a, b) => {
      var c = Za(b, function (d) {
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
        c: (a, b, c, d) => {
          ra(
            `Assertion failed: ${a ? J(A, a) : ''}, at: ` +
              [b ? (b ? J(A, b) : '') : 'unknown filename', c, d ? (d ? J(A, d) : '') : 'unknown function'],
          );
        },
        m: (a, b, c) => {
          var d = new Aa(a);
          F[(d.ya + 16) >> 2] = 0;
          F[(d.ya + 4) >> 2] = b;
          F[(d.ya + 8) >> 2] = c;
          Ba = a;
          Ca++;
          throw Ba;
        },
        B: function () {
          return 0;
        },
        P: () => {},
        M: () => {},
        R: function () {
          return 0;
        },
        N: () => {},
        A: function () {},
        O: () => {},
        v: (a) => {
          var b = Fa[a];
          delete Fa[a];
          var c = b.Ua,
            d = b.Fa,
            e = b.Ya,
            f = e.map((l) => l.hb).concat(e.map((l) => l.nb));
          P([a], f, (l) => {
            var h = {};
            e.forEach((n, m) => {
              var p = l[m],
                u = n.fb,
                v = n.gb,
                g = l[m + e.length],
                q = n.mb,
                r = n.ob;
              h[n.bb] = {
                read: (z) => p.fromWireType(u(v, z)),
                write: (z, N) => {
                  var D = [];
                  q(r, z, g.toWireType(D, N));
                  Ga(D);
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
                readValueFromPointer: K,
                Ea: d,
              },
            ];
          });
        },
        I: () => {},
        Y: (a, b, c, d) => {
          b = Q(b);
          O(a, {
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
            Ea: null,
          });
        },
        r: (a, b, c, d, e, f, l, h, n, m, p, u, v) => {
          p = Q(p);
          f = T(e, f);
          h &&= T(l, h);
          m &&= T(n, m);
          v = T(u, v);
          var g = bb(p);
          ab(g, function () {
            qb(`Cannot construct ${p} due to unbound types`, [d]);
          });
          P([a, b, c], d ? [d] : [], (q) => {
            q = q[0];
            if (d) {
              var r = q.xa;
              var z = r.La;
            } else z = Ya.prototype;
            q = Za(p, function (...Na) {
              if (Object.getPrototypeOf(this) !== N) throw new R("Use 'new' to construct " + p);
              if (void 0 === D.Ha) throw new R(p + ' has no accessible constructor');
              var xb = D.Ha[Na.length];
              if (void 0 === xb)
                throw new R(
                  `Tried to invoke ctor of ${p} with invalid number of parameters (${
                    Na.length
                  }) - expected (${Object.keys(D.Ha).toString()}) parameters instead!`,
                );
              return xb.apply(this, Na);
            });
            var N = Object.create(z, { constructor: { value: q } });
            q.prototype = N;
            var D = new cb(p, q, N, v, r, f, h, m);
            if (D.Ca) {
              var ia;
              (ia = D.Ca).Wa ?? (ia.Wa = []);
              D.Ca.Wa.push(D);
            }
            r = new jb(p, D, !0, !1, !1);
            ia = new jb(p + '*', D, !1, !1, !1);
            z = new jb(p + ' const*', D, !1, !0, !1);
            Qa[a] = { pointerType: ia, $a: z };
            kb(g, q);
            return [r, ia, z];
          });
        },
        q: (a, b, c, d, e, f) => {
          var l = rb(b, c);
          e = T(d, e);
          P([], [a], (h) => {
            h = h[0];
            var n = `constructor ${h.name}`;
            void 0 === h.xa.Ha && (h.xa.Ha = []);
            if (void 0 !== h.xa.Ha[b - 1])
              throw new R(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  h.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            h.xa.Ha[b - 1] = () => {
              qb(`Cannot construct ${h.name} due to unbound types`, l);
            };
            P([], l, (m) => {
              m.splice(1, 0, null);
              h.xa.Ha[b - 1] = tb(n, m, null, e, f);
              return [];
            });
            return [];
          });
        },
        f: (a, b, c, d, e, f, l, h) => {
          var n = rb(c, d);
          b = Q(b);
          b = ub(b);
          f = T(e, f);
          P([], [a], (m) => {
            function p() {
              qb(`Cannot call ${u} due to unbound types`, n);
            }
            m = m[0];
            var u = `${m.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            h && m.xa.kb.push(b);
            var v = m.xa.La,
              g = v[b];
            void 0 === g || (void 0 === g.Ba && g.className !== m.name && g.Oa === c - 2)
              ? ((p.Oa = c - 2), (p.className = m.name), (v[b] = p))
              : ($a(v, b, u), (v[b].Ba[c - 2] = p));
            P([], n, (q) => {
              q = tb(u, q, m, f, l);
              void 0 === v[b].Ba ? ((q.Oa = c - 2), (v[b] = q)) : (v[b].Ba[c - 2] = q);
              return [];
            });
            return [];
          });
        },
        X: (a) => O(a, zb),
        x: (a, b, c, d) => {
          function e() {}
          b = Q(b);
          e.values = {};
          O(a, {
            name: b,
            constructor: e,
            fromWireType: function (f) {
              return this.constructor.values[f];
            },
            toWireType: (f, l) => l.value,
            argPackAdvance: 8,
            readValueFromPointer: Ab(b, c, d),
            Ea: null,
          });
          ab(b, e);
        },
        k: (a, b, c) => {
          var d = Bb(a, 'enum');
          b = Q(b);
          a = d.constructor;
          d = Object.create(d.constructor.prototype, {
            value: { value: c },
            constructor: { value: Za(`${d.name}_${b}`, function () {}) },
          });
          a.values[c] = d;
          a[b] = d;
        },
        C: (a, b, c) => {
          b = Q(b);
          O(a, {
            name: b,
            fromWireType: (d) => d,
            toWireType: (d, e) => e,
            argPackAdvance: 8,
            readValueFromPointer: Cb(b, c),
            Ea: null,
          });
        },
        E: (a, b, c, d, e, f) => {
          var l = rb(b, c);
          a = Q(a);
          a = ub(a);
          e = T(d, e);
          ab(
            a,
            function () {
              qb(`Cannot call ${a} due to unbound types`, l);
            },
            b - 1,
          );
          P([], l, (h) => {
            kb(a, tb(a, [h[0], null].concat(h.slice(1)), null, e, f), b - 1);
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
          O(a, {
            name: b,
            fromWireType: e,
            toWireType: l,
            argPackAdvance: 8,
            readValueFromPointer: Db(b, c, 0 !== d),
            Ea: null,
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
          O(a, { name: c, fromWireType: d, argPackAdvance: 8, readValueFromPointer: d }, { ib: !0 });
        },
        w: (a) => {
          O(a, zb);
        },
        ca: (a, b, c, d, e, f, l, h, n, m, p, u) => {
          c = Q(c);
          f = T(e, f);
          h = T(l, h);
          m = T(n, m);
          u = T(p, u);
          P([a], [b], (v) => {
            v = v[0];
            return [new jb(c, v.xa, !1, !1, !0, v, d, f, h, m, u)];
          });
        },
        D: (a, b) => {
          b = Q(b);
          var c = 'std::string' === b;
          O(a, {
            name: b,
            fromWireType: function (d) {
              var e = F[d >> 2],
                f = d + 4;
              if (c)
                for (var l = f, h = 0; h <= e; ++h) {
                  var n = f + h;
                  if (h == e || 0 == A[n]) {
                    l = l ? J(A, l, n - l) : '';
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
              var l = c && f ? Da(e) : e.length;
              var h = bc(4 + l + 1),
                n = h + 4;
              F[h >> 2] = l;
              if (c && f) Ea(e, A, n, l + 1);
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
            readValueFromPointer: K,
            Ea(d) {
              U(d);
            },
          });
        },
        u: (a, b, c) => {
          c = Q(c);
          if (2 === b) {
            var d = Fb;
            var e = Gb;
            var f = Hb;
            var l = (h) => C[h >> 1];
          } else 4 === b && ((d = Ib), (e = Jb), (f = Kb), (l = (h) => F[h >> 2]));
          O(a, {
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
                p = bc(4 + m + b);
              F[p >> 2] = m / b;
              e(n, p + 4, m + b);
              null !== h && h.push(U, p);
              return p;
            },
            argPackAdvance: 8,
            readValueFromPointer: K,
            Ea(h) {
              U(h);
            },
          });
        },
        s: (a, b, c, d, e, f) => {
          Fa[a] = { name: Q(b), Ua: T(c, d), Fa: T(e, f), Ya: [] };
        },
        j: (a, b, c, d, e, f, l, h, n, m) => {
          Fa[a].Ya.push({ bb: Q(b), hb: c, fb: T(d, e), gb: f, nb: l, mb: T(h, n), ob: m });
        },
        Z: (a, b) => {
          b = Q(b);
          O(a, { ub: !0, name: b, argPackAdvance: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        J: () => {
          throw Infinity;
        },
        aa: (a, b, c, d) => {
          a = Lb[a];
          b = yb(b);
          return a(null, b, c, d);
        },
        F: wb,
        $: (a, b, c) => {
          var d = Nb(a, b),
            e = d.shift();
          a--;
          var f = Array(a);
          b = `methodCaller<(${d.map((l) => l.name).join(', ')}) => ${e.name}>`;
          return Mb(
            Za(b, (l, h, n, m) => {
              for (var p = 0, u = 0; u < a; ++u) (f[u] = d[u].readValueFromPointer(m + p)), (p += d[u].argPackAdvance);
              h = 1 === c ? Ob(h, f) : h.apply(l, f);
              l = [];
              h = e.toWireType(l, h);
              l.length && (F[n >> 2] = hb(l));
              return h;
            }),
          );
        },
        ba: (a) => {
          9 < a && (V[a + 1] += 1);
        },
        _: (a) => {
          var b = yb(a);
          Ga(b);
          wb(a);
        },
        o: (a, b) => {
          a = Bb(a, '_emval_take_value');
          a = a.readValueFromPointer(b);
          return hb(a);
        },
        W: () => {
          ra('');
        },
        V: () => performance.now(),
        L: (a) => {
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
                (e.min.call(e, 2147483648, d + ((65536 - (d % 65536)) % 65536)) - fa.buffer.byteLength + 65535) / 65536;
              try {
                fa.grow(e);
                la();
                var f = 1;
                break a;
              } catch (l) {}
              f = void 0;
            }
            if (f) return !0;
          }
          return !1;
        },
        S: (a, b) => {
          var c = 0;
          Rb().forEach((d, e) => {
            var f = b + c;
            e = F[(a + 4 * e) >> 2] = f;
            for (f = 0; f < d.length; ++f) y[e++] = d.charCodeAt(f);
            y[e] = 0;
            c += d.length + 1;
          });
          return 0;
        },
        T: (a, b) => {
          var c = Rb();
          F[a >> 2] = c.length;
          var d = 0;
          c.forEach((e) => (d += e.length + 1));
          F[b >> 2] = d;
          return 0;
        },
        t: () => 52,
        z: () => 52,
        H: function () {
          return 70;
        },
        Q: (a, b, c, d) => {
          for (var e = 0, f = 0; f < c; f++) {
            var l = F[b >> 2],
              h = F[(b + 4) >> 2];
            b += 8;
            for (var n = 0; n < h; n++) {
              var m = A[l + n],
                p = Sb[a];
              0 === m || 10 === m ? ((1 === a ? ea : w)(J(p, 0)), (p.length = 0)) : p.push(m);
            }
            e += h;
          }
          F[d >> 2] = e;
          return 0;
        },
        U: (a, b) => {
          Ub(A.subarray(a, a + b));
          return 0;
        },
        i: cc,
        d: dc,
        e: ec,
        p: fc,
        y: gc,
        b: hc,
        a: ic,
        h: jc,
        n: kc,
        G: lc,
        K: (a, b, c, d) => Zb(a, b, c, d),
      },
      W = (function () {
        function a(c) {
          W = c.exports;
          fa = W.da;
          la();
          S = W.ha;
          na.unshift(W.ea);
          G--;
          k.monitorRunDependencies?.(G);
          0 == G && (null !== qa && (clearInterval(qa), (qa = null)), H && ((c = H), (H = null), c()));
          return W;
        }
        var b = { a: mc };
        G++;
        k.monitorRunDependencies?.(G);
        if (k.instantiateWasm)
          try {
            return k.instantiateWasm(b, a);
          } catch (c) {
            w(`Module.instantiateWasm callback failed with error: ${c}`), ba(c);
          }
        xa(b, function (c) {
          a(c.instance);
        }).catch(ba);
        return {};
      })(),
      bc = (a) => (bc = W.fa)(a),
      ob = (a) => (ob = W.ga)(a),
      U = (a) => (U = W.ia)(a),
      X = (a, b) => (X = W.ja)(a, b),
      Y = (a) => (Y = W.ka)(a),
      Z = () => (Z = W.la)();
    k.dynCall_iijj = (a, b, c, d, e, f) => (k.dynCall_iijj = W.na)(a, b, c, d, e, f);
    k.dynCall_vijj = (a, b, c, d, e, f) => (k.dynCall_vijj = W.oa)(a, b, c, d, e, f);
    k.dynCall_jiii = (a, b, c, d) => (k.dynCall_jiii = W.pa)(a, b, c, d);
    k.dynCall_jii = (a, b, c) => (k.dynCall_jii = W.qa)(a, b, c);
    var nc = (k.dynCall_viiij = (a, b, c, d, e, f) => (nc = k.dynCall_viiij = W.ra)(a, b, c, d, e, f));
    k.dynCall_jiji = (a, b, c, d, e) => (k.dynCall_jiji = W.sa)(a, b, c, d, e);
    k.dynCall_viijii = (a, b, c, d, e, f, l) => (k.dynCall_viijii = W.ta)(a, b, c, d, e, f, l);
    k.dynCall_iiiiij = (a, b, c, d, e, f, l) => (k.dynCall_iiiiij = W.ua)(a, b, c, d, e, f, l);
    k.dynCall_iiiiijj = (a, b, c, d, e, f, l, h, n) => (k.dynCall_iiiiijj = W.va)(a, b, c, d, e, f, l, h, n);
    k.dynCall_iiiiiijj = (a, b, c, d, e, f, l, h, n, m) => (k.dynCall_iiiiiijj = W.wa)(a, b, c, d, e, f, l, h, n, m);
    function hc(a, b) {
      var c = Z();
      try {
        S.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function ic(a, b, c) {
      var d = Z();
      try {
        S.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function ec(a, b, c, d) {
      var e = Z();
      try {
        return S.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function dc(a, b, c) {
      var d = Z();
      try {
        return S.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function cc(a, b) {
      var c = Z();
      try {
        return S.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function fc(a, b, c, d, e, f) {
      var l = Z();
      try {
        return S.get(a)(b, c, d, e, f);
      } catch (h) {
        Y(l);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function kc(a, b, c, d, e) {
      var f = Z();
      try {
        S.get(a)(b, c, d, e);
      } catch (l) {
        Y(f);
        if (l !== l + 0) throw l;
        X(1, 0);
      }
    }
    function jc(a, b, c, d) {
      var e = Z();
      try {
        S.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function gc(a) {
      var b = Z();
      try {
        S.get(a)();
      } catch (c) {
        Y(b);
        if (c !== c + 0) throw c;
        X(1, 0);
      }
    }
    function lc(a, b, c, d, e, f) {
      var l = Z();
      try {
        nc(a, b, c, d, e, f);
      } catch (h) {
        Y(l);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    var oc;
    H = function pc() {
      oc || qc();
      oc || (H = pc);
    };
    function qc() {
      function a() {
        if (!oc && ((oc = !0), (k.calledRun = !0), !ha)) {
          ya(na);
          aa(k);
          if (k.onRuntimeInitialized) k.onRuntimeInitialized();
          if (k.postRun)
            for ('function' == typeof k.postRun && (k.postRun = [k.postRun]); k.postRun.length; ) {
              var b = k.postRun.shift();
              oa.unshift(b);
            }
          ya(oa);
        }
      }
      if (!(0 < G)) {
        if (k.preRun) for ('function' == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; ) pa();
        ya(ma);
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
    qc();

    return readyPromise;
  };
})();

export default createDotLottiePlayerModule;
