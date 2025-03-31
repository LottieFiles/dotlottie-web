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
      ia;
    'undefined' != typeof document && document.currentScript && (q = document.currentScript.src);
    _scriptName && (q = _scriptName);
    q.startsWith('blob:') ? (q = '') : (q = q.substr(0, q.replace(/[?#].*/, '').lastIndexOf('/') + 1));
    ia = (a) =>
      fetch(a, { credentials: 'same-origin' }).then((b) =>
        b.ok ? b.arrayBuffer() : Promise.reject(Error(b.status + ' : ' + b.url)),
      );
    var ja = k.print || console.log.bind(console),
      t = k.printErr || console.error.bind(console);
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
      va = null,
      D = null;
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
      G = (a, b = 0, c = NaN) => {
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
      },
      I = 0;
    class Ha {
      constructor(a) {
        this.Ea = a - 24;
      }
    }
    var Ja = () => {
        var a = [],
          b = I;
        if (!b) return J(0), 0;
        var c = new Ha(b);
        B[(c.Ea + 16) >> 2] = b;
        var d = B[(c.Ea + 4) >> 2];
        if (!d) return J(0), b;
        for (var e of a) {
          if (0 === e || e === d) break;
          if (Ia(e, d, c.Ea + 16)) return J(e), b;
        }
        J(d);
        return b;
      },
      Ka = 0,
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
      La = {},
      Ma = (a) => {
        for (; a.length; ) {
          var b = a.pop();
          a.pop()(b);
        }
      };
    function L(a) {
      return this.fromWireType(B[a >> 2]);
    }
    var M = {},
      N = {},
      Na = {},
      Oa,
      P = (a, b, c) => {
        function d(g) {
          g = c(g);
          if (g.length !== a.length) throw new Oa('Mismatched type converter count');
          for (var l = 0; l < a.length; ++l) O(a[l], g[l]);
        }
        a.forEach((g) => (Na[g] = b));
        var e = Array(b.length),
          f = [],
          h = 0;
        b.forEach((g, l) => {
          N.hasOwnProperty(g)
            ? (e[l] = N[g])
            : (f.push(g),
              M.hasOwnProperty(g) || (M[g] = []),
              M[g].push(() => {
                e[l] = N[g];
                ++h;
                h === f.length && d(e);
              }));
        });
        0 === f.length && d(e);
      },
      Pa,
      Q = (a) => {
        for (var b = ''; x[a]; ) b += Pa[x[a++]];
        return b;
      },
      R;
    function Ra(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new R(`type "${d}" must have a positive integer typeid pointer`);
      if (N.hasOwnProperty(a)) {
        if (c.kb) return;
        throw new R(`Cannot register type '${d}' twice`);
      }
      N[a] = b;
      delete Na[a];
      M.hasOwnProperty(a) && ((b = M[a]), delete M[a], b.forEach((e) => e()));
    }
    function O(a, b, c = {}) {
      return Ra(a, b, c);
    }
    var Sa = (a) => {
        throw new R(a.Da.Ga.Fa.name + ' instance already deleted');
      },
      Ta = !1,
      Ua = () => {},
      Va = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.Ja) return null;
        a = Va(a, b, c.Ja);
        return null === a ? null : c.cb(a);
      },
      Wa = {},
      Xa = {},
      Ya = (a, b) => {
        if (void 0 === b) throw new R('ptr should not be undefined');
        for (; a.Ja; ) (b = a.Ta(b)), (a = a.Ja);
        return Xa[b];
      },
      $a = (a, b) => {
        if (!b.Ga || !b.Ea) throw new Oa('makeClassHandle requires ptr and ptrType');
        if (!!b.Ka !== !!b.Ia) throw new Oa('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return Za(Object.create(a, { Da: { value: b, writable: !0 } }));
      },
      Za = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (Za = (b) => b), a;
        Ta = new FinalizationRegistry((b) => {
          b = b.Da;
          --b.count.value;
          0 === b.count.value && (b.Ia ? b.Ka.Na(b.Ia) : b.Ga.Fa.Na(b.Ea));
        });
        Za = (b) => {
          var c = b.Da;
          c.Ia && Ta.register(b, { Da: c }, b);
          return b;
        };
        Ua = (b) => {
          Ta.unregister(b);
        };
        return Za(a);
      },
      ab = [];
    function bb() {}
    var cb = (a, b) => Object.defineProperty(b, 'name', { value: a }),
      db = (a, b, c) => {
        if (void 0 === a[b].Ha) {
          var d = a[b];
          a[b] = function (...e) {
            if (!a[b].Ha.hasOwnProperty(e.length))
              throw new R(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].Ha})!`,
              );
            return a[b].Ha[e.length].apply(this, e);
          };
          a[b].Ha = [];
          a[b].Ha[d.Qa] = d;
        }
      },
      eb = (a, b, c) => {
        if (k.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== k[a].Ha && void 0 !== k[a].Ha[c]))
            throw new R(`Cannot register public name '${a}' twice`);
          db(k, a, a);
          if (k[a].Ha.hasOwnProperty(c))
            throw new R(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          k[a].Ha[c] = b;
        } else (k[a] = b), (k[a].Qa = c);
      },
      fb = (a) => {
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function gb(a, b, c, d, e, f, h, g) {
      this.name = a;
      this.constructor = b;
      this.Pa = c;
      this.Na = d;
      this.Ja = e;
      this.fb = f;
      this.Ta = h;
      this.cb = g;
      this.mb = [];
    }
    var hb = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.Ta) throw new R(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.Ta(a);
        b = b.Ja;
      }
      return a;
    };
    function ib(a, b) {
      if (null === b) {
        if (this.Wa) throw new R(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Da) throw new R(`Cannot pass "${jb(b)}" as a ${this.name}`);
      if (!b.Da.Ea) throw new R(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return hb(b.Da.Ea, b.Da.Ga.Fa, this.Fa);
    }
    function kb(a, b) {
      if (null === b) {
        if (this.Wa) throw new R(`null is not a valid ${this.name}`);
        if (this.Va) {
          var c = this.Xa();
          null !== a && a.push(this.Na, c);
          return c;
        }
        return 0;
      }
      if (!b || !b.Da) throw new R(`Cannot pass "${jb(b)}" as a ${this.name}`);
      if (!b.Da.Ea) throw new R(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.Ua && b.Da.Ga.Ua)
        throw new R(
          `Cannot convert argument of type ${b.Da.Ka ? b.Da.Ka.name : b.Da.Ga.name} to parameter type ${this.name}`,
        );
      c = hb(b.Da.Ea, b.Da.Ga.Fa, this.Fa);
      if (this.Va) {
        if (void 0 === b.Da.Ia) throw new R('Passing raw pointer to smart pointer is illegal');
        switch (this.rb) {
          case 0:
            if (b.Da.Ka === this) c = b.Da.Ia;
            else
              throw new R(
                `Cannot convert argument of type ${b.Da.Ka ? b.Da.Ka.name : b.Da.Ga.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            c = b.Da.Ia;
            break;
          case 2:
            if (b.Da.Ka === this) c = b.Da.Ia;
            else {
              var d = b.clone();
              c = this.nb(
                c,
                lb(() => d['delete']()),
              );
              null !== a && a.push(this.Na, c);
            }
            break;
          default:
            throw new R('Unsupporting sharing policy');
        }
      }
      return c;
    }
    function mb(a, b) {
      if (null === b) {
        if (this.Wa) throw new R(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Da) throw new R(`Cannot pass "${jb(b)}" as a ${this.name}`);
      if (!b.Da.Ea) throw new R(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.Da.Ga.Ua) throw new R(`Cannot convert argument of type ${b.Da.Ga.name} to parameter type ${this.name}`);
      return hb(b.Da.Ea, b.Da.Ga.Fa, this.Fa);
    }
    function nb(a, b, c, d, e, f, h, g, l, m, n) {
      this.name = a;
      this.Fa = b;
      this.Wa = c;
      this.Ua = d;
      this.Va = e;
      this.lb = f;
      this.rb = h;
      this.ab = g;
      this.Xa = l;
      this.nb = m;
      this.Na = n;
      e || void 0 !== b.Ja ? (this.toWireType = kb) : ((this.toWireType = d ? ib : mb), (this.Ma = null));
    }
    var ob = (a, b, c) => {
        if (!k.hasOwnProperty(a)) throw new Oa('Replacing nonexistent public symbol');
        void 0 !== k[a].Ha && void 0 !== c ? (k[a].Ha[c] = b) : ((k[a] = b), (k[a].Qa = c));
      },
      S,
      pb = (a, b, c = []) => {
        a.includes('j') ? ((a = a.replace(/p/g, 'i')), (b = (0, k['dynCall_' + a])(b, ...c))) : (b = S.get(b)(...c));
        return b;
      },
      qb =
        (a, b) =>
        (...c) =>
          pb(a, b, c),
      T = (a, b) => {
        a = Q(a);
        var c = a.includes('j') ? qb(a, b) : S.get(b);
        if ('function' != typeof c) throw new R(`unknown function pointer with signature ${a}: ${b}`);
        return c;
      },
      rb,
      tb = (a) => {
        a = sb(a);
        var b = Q(a);
        U(a);
        return b;
      },
      ub = (a, b) => {
        function c(f) {
          e[f] || N[f] || (Na[f] ? Na[f].forEach(c) : (d.push(f), (e[f] = !0)));
        }
        var d = [],
          e = {};
        b.forEach(c);
        throw new rb(`${a}: ` + d.map(tb).join([', ']));
      },
      vb = (a, b) => {
        for (var c = [], d = 0; d < a; d++) c.push(B[(b + 4 * d) >> 2]);
        return c;
      };
    function wb(a) {
      for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].Ma) return !0;
      return !1;
    }
    function xb(a, b, c, d, e) {
      var f = b.length;
      if (2 > f) throw new R("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var h = null !== b[1] && null !== c,
        g = wb(b),
        l = 'void' !== b[0].name,
        m = f - 2,
        n = Array(m),
        p = [],
        r = [];
      return cb(a, function (...E) {
        r.length = 0;
        p.length = h ? 2 : 1;
        p[0] = e;
        if (h) {
          var v = b[1].toWireType(r, this);
          p[1] = v;
        }
        for (var w = 0; w < m; ++w) (n[w] = b[w + 2].toWireType(r, E[w])), p.push(n[w]);
        E = d(...p);
        if (g) Ma(r);
        else
          for (w = h ? 1 : 2; w < b.length; w++) {
            var H = 1 === w ? v : n[w - 2];
            null !== b[w].Ma && b[w].Ma(H);
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
      Ab = [],
      V = [],
      Bb = (a) => {
        9 < a && 0 === --V[a + 1] && ((V[a] = void 0), Ab.push(a));
      },
      Cb = (a) => {
        if (!a) throw new R('Cannot use deleted val. handle = ' + a);
        return V[a];
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
            const b = Ab.pop() || V.length;
            V[b] = a;
            V[b + 1] = 1;
            return b;
        }
      },
      Db = {
        name: 'emscripten::val',
        fromWireType: (a) => {
          var b = Cb(a);
          Bb(a);
          return b;
        },
        toWireType: (a, b) => lb(b),
        La: 8,
        readValueFromPointer: L,
        Ma: null,
      },
      Eb = (a, b, c) => {
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
      Fb = (a, b) => {
        var c = N[a];
        if (void 0 === c) throw ((a = `${b} has unknown type ${tb(a)}`), new R(a));
        return c;
      },
      jb = (a) => {
        if (null === a) return 'null';
        var b = typeof a;
        return 'object' === b || 'array' === b || 'function' === b ? a.toString() : '' + a;
      },
      Gb = (a, b) => {
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
      Hb = (a, b, c) => {
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
      Ib = Object.assign({ optional: !0 }, Db),
      Jb = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Kb = (a, b) => {
        var c = a >> 1;
        for (var d = c + b / 2; !(c >= d) && z[c]; ) ++c;
        c <<= 1;
        if (32 < c - a && Jb) return Jb.decode(x.subarray(a, c));
        c = '';
        for (d = 0; !(d >= b / 2); ++d) {
          var e = y[(a + 2 * d) >> 1];
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
        for (var e = 0; e < c; ++e) (y[b >> 1] = a.charCodeAt(e)), (b += 2);
        y[b >> 1] = 0;
        return b - d;
      },
      Mb = (a) => 2 * a.length,
      Nb = (a, b) => {
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
      Ob = (a, b, c) => {
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
      Pb = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          b += 4;
        }
        return b;
      },
      Qb = 0,
      Rb = [],
      Sb = (a) => {
        var b = Rb.length;
        Rb.push(a);
        return b;
      },
      Tb = (a, b) => {
        for (var c = Array(a), d = 0; d < a; ++d) c[d] = Fb(B[(b + 4 * d) >> 2], 'parameter ' + d);
        return c;
      },
      Ub = Reflect.construct,
      Vb = {},
      Wb = (a) => {
        if (!(a instanceof Da || 'unwind' == a)) throw a;
      },
      Xb = (a) => {
        na = a;
        Fa || 0 < Qb || (k.onExit?.(a), (ma = !0));
        throw new Da(a);
      },
      Yb = (a) => {
        if (!ma)
          try {
            if ((a(), !(Fa || 0 < Qb)))
              try {
                (na = a = na), Xb(a);
              } catch (b) {
                Wb(b);
              }
          } catch (b) {
            Wb(b);
          }
      },
      Zb = {},
      ac = () => {
        if (!$b) {
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
          for (b in Zb) void 0 === Zb[b] ? delete a[b] : (a[b] = Zb[b]);
          var c = [];
          for (b in a) c.push(`${b}=${a[b]}`);
          $b = c;
        }
        return $b;
      },
      $b,
      bc = [null, [], []],
      cc = () => {
        if ('object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
          return (a) => crypto.getRandomValues(a);
        wa('initRandomDevice');
      },
      dc = (a) => (dc = cc())(a);
    Oa = k.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    for (var ec = Array(256), fc = 0; 256 > fc; ++fc) ec[fc] = String.fromCharCode(fc);
    Pa = ec;
    R = k.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    Object.assign(bb.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof bb && a instanceof bb)) return !1;
        var b = this.Da.Ga.Fa,
          c = this.Da.Ea;
        a.Da = a.Da;
        var d = a.Da.Ga.Fa;
        for (a = a.Da.Ea; b.Ja; ) (c = b.Ta(c)), (b = b.Ja);
        for (; d.Ja; ) (a = d.Ta(a)), (d = d.Ja);
        return b === d && c === a;
      },
      clone: function () {
        this.Da.Ea || Sa(this);
        if (this.Da.Sa) return (this.Da.count.value += 1), this;
        var a = Za,
          b = Object,
          c = b.create,
          d = Object.getPrototypeOf(this),
          e = this.Da;
        a = a(
          c.call(b, d, {
            Da: { value: { count: e.count, Ra: e.Ra, Sa: e.Sa, Ea: e.Ea, Ga: e.Ga, Ia: e.Ia, Ka: e.Ka } },
          }),
        );
        a.Da.count.value += 1;
        a.Da.Ra = !1;
        return a;
      },
      ['delete']() {
        this.Da.Ea || Sa(this);
        if (this.Da.Ra && !this.Da.Sa) throw new R('Object already scheduled for deletion');
        Ua(this);
        var a = this.Da;
        --a.count.value;
        0 === a.count.value && (a.Ia ? a.Ka.Na(a.Ia) : a.Ga.Fa.Na(a.Ea));
        this.Da.Sa || ((this.Da.Ia = void 0), (this.Da.Ea = void 0));
      },
      isDeleted: function () {
        return !this.Da.Ea;
      },
      deleteLater: function () {
        this.Da.Ea || Sa(this);
        if (this.Da.Ra && !this.Da.Sa) throw new R('Object already scheduled for deletion');
        ab.push(this);
        this.Da.Ra = !0;
        return this;
      },
    });
    Object.assign(nb.prototype, {
      gb(a) {
        this.ab && (a = this.ab(a));
        return a;
      },
      Za(a) {
        this.Na?.(a);
      },
      La: 8,
      readValueFromPointer: L,
      fromWireType: function (a) {
        function b() {
          return this.Va
            ? $a(this.Fa.Pa, { Ga: this.lb, Ea: c, Ka: this, Ia: a })
            : $a(this.Fa.Pa, { Ga: this, Ea: a });
        }
        var c = this.gb(a);
        if (!c) return this.Za(a), null;
        var d = Ya(this.Fa, c);
        if (void 0 !== d) {
          if (0 === d.Da.count.value) return (d.Da.Ea = c), (d.Da.Ia = a), d.clone();
          d = d.clone();
          this.Za(a);
          return d;
        }
        d = this.Fa.fb(c);
        d = Wa[d];
        if (!d) return b.call(this);
        d = this.Ua ? d.bb : d.pointerType;
        var e = Va(c, this.Fa, d.Fa);
        return null === e
          ? b.call(this)
          : this.Va
          ? $a(d.Fa.Pa, { Ga: d, Ea: e, Ka: this, Ia: a })
          : $a(d.Fa.Pa, { Ga: d, Ea: e });
      },
    });
    rb = k.UnboundTypeError = ((a, b) => {
      var c = cb(b, function (d) {
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
    k.count_emval_handles = () => V.length / 2 - 5 - Ab.length;
    var vc = {
        c: (a, b, c, d) =>
          wa(
            `Assertion failed: ${a ? G(x, a) : ''}, at: ` +
              [b ? (b ? G(x, b) : '') : 'unknown filename', c, d ? (d ? G(x, d) : '') : 'unknown function'],
          ),
        d: () => Ja(),
        p: (a, b, c) => {
          var d = new Ha(a);
          B[(d.Ea + 16) >> 2] = 0;
          B[(d.Ea + 4) >> 2] = b;
          B[(d.Ea + 8) >> 2] = c;
          I = a;
          Ka++;
          throw I;
        },
        g: (a) => {
          I ||= a;
          throw I;
        },
        R: () => {},
        O: () => {},
        P: () => {},
        U: function () {},
        Q: () => {},
        W: () => wa(''),
        z: (a) => {
          var b = La[a];
          delete La[a];
          var c = b.Xa,
            d = b.Na,
            e = b.$a,
            f = e.map((h) => h.jb).concat(e.map((h) => h.pb));
          P([a], f, (h) => {
            var g = {};
            e.forEach((l, m) => {
              var n = h[m],
                p = l.hb,
                r = l.ib,
                E = h[m + e.length],
                v = l.ob,
                w = l.qb;
              g[l.eb] = {
                read: (H) => n.fromWireType(p(r, H)),
                write: (H, fa) => {
                  var F = [];
                  v(w, H, E.toWireType(F, fa));
                  Ma(F);
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
                La: 8,
                readValueFromPointer: L,
                Ma: d,
              },
            ];
          });
        },
        H: () => {},
        aa: (a, b, c, d) => {
          b = Q(b);
          O(a, {
            name: b,
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, f) {
              return f ? c : d;
            },
            La: 8,
            readValueFromPointer: function (e) {
              return this.fromWireType(x[e]);
            },
            Ma: null,
          });
        },
        v: (a, b, c, d, e, f, h, g, l, m, n, p, r) => {
          n = Q(n);
          f = T(e, f);
          g &&= T(h, g);
          m &&= T(l, m);
          r = T(p, r);
          var E = fb(n);
          eb(E, function () {
            ub(`Cannot construct ${n} due to unbound types`, [d]);
          });
          P([a, b, c], d ? [d] : [], (v) => {
            v = v[0];
            if (d) {
              var w = v.Fa;
              var H = w.Pa;
            } else H = bb.prototype;
            v = cb(n, function (...Qa) {
              if (Object.getPrototypeOf(this) !== fa) throw new R("Use 'new' to construct " + n);
              if (void 0 === F.Oa) throw new R(n + ' has no accessible constructor');
              var zb = F.Oa[Qa.length];
              if (void 0 === zb)
                throw new R(
                  `Tried to invoke ctor of ${n} with invalid number of parameters (${
                    Qa.length
                  }) - expected (${Object.keys(F.Oa).toString()}) parameters instead!`,
                );
              return zb.apply(this, Qa);
            });
            var fa = Object.create(H, { constructor: { value: v } });
            v.prototype = fa;
            var F = new gb(n, v, fa, r, w, f, g, m);
            if (F.Ja) {
              var ha;
              (ha = F.Ja).Ya ?? (ha.Ya = []);
              F.Ja.Ya.push(F);
            }
            w = new nb(n, F, !0, !1, !1);
            ha = new nb(n + '*', F, !1, !1, !1);
            H = new nb(n + ' const*', F, !1, !0, !1);
            Wa[a] = { pointerType: ha, bb: H };
            ob(E, v);
            return [w, ha, H];
          });
        },
        t: (a, b, c, d, e, f) => {
          var h = vb(b, c);
          e = T(d, e);
          P([], [a], (g) => {
            g = g[0];
            var l = `constructor ${g.name}`;
            void 0 === g.Fa.Oa && (g.Fa.Oa = []);
            if (void 0 !== g.Fa.Oa[b - 1])
              throw new R(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  g.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            g.Fa.Oa[b - 1] = () => {
              ub(`Cannot construct ${g.name} due to unbound types`, h);
            };
            P([], h, (m) => {
              m.splice(1, 0, null);
              g.Fa.Oa[b - 1] = xb(l, m, null, e, f);
              return [];
            });
            return [];
          });
        },
        i: (a, b, c, d, e, f, h, g) => {
          var l = vb(c, d);
          b = Q(b);
          b = yb(b);
          f = T(e, f);
          P([], [a], (m) => {
            function n() {
              ub(`Cannot call ${p} due to unbound types`, l);
            }
            m = m[0];
            var p = `${m.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            g && m.Fa.mb.push(b);
            var r = m.Fa.Pa,
              E = r[b];
            void 0 === E || (void 0 === E.Ha && E.className !== m.name && E.Qa === c - 2)
              ? ((n.Qa = c - 2), (n.className = m.name), (r[b] = n))
              : (db(r, b, p), (r[b].Ha[c - 2] = n));
            P([], l, (v) => {
              v = xb(p, v, m, f, h);
              void 0 === r[b].Ha ? ((v.Qa = c - 2), (r[b] = v)) : (r[b].Ha[c - 2] = v);
              return [];
            });
            return [];
          });
        },
        $: (a) => O(a, Db),
        B: (a, b, c, d) => {
          function e() {}
          b = Q(b);
          e.values = {};
          O(a, {
            name: b,
            constructor: e,
            fromWireType: function (f) {
              return this.constructor.values[f];
            },
            toWireType: (f, h) => h.value,
            La: 8,
            readValueFromPointer: Eb(b, c, d),
            Ma: null,
          });
          eb(b, e);
        },
        n: (a, b, c) => {
          var d = Fb(a, 'enum');
          b = Q(b);
          a = d.constructor;
          d = Object.create(d.constructor.prototype, {
            value: { value: c },
            constructor: { value: cb(`${d.name}_${b}`, function () {}) },
          });
          a.values[c] = d;
          a[b] = d;
        },
        D: (a, b, c) => {
          b = Q(b);
          O(a, {
            name: b,
            fromWireType: (d) => d,
            toWireType: (d, e) => e,
            La: 8,
            readValueFromPointer: Gb(b, c),
            Ma: null,
          });
        },
        y: (a, b, c, d, e, f) => {
          var h = vb(b, c);
          a = Q(a);
          a = yb(a);
          e = T(d, e);
          eb(
            a,
            function () {
              ub(`Cannot call ${a} due to unbound types`, h);
            },
            b - 1,
          );
          P([], h, (g) => {
            ob(a, xb(a, [g[0], null].concat(g.slice(1)), null, e, f), b - 1);
            return [];
          });
        },
        o: (a, b, c, d, e) => {
          b = Q(b);
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
          O(a, { name: b, fromWireType: e, toWireType: h, La: 8, readValueFromPointer: Hb(b, c, 0 !== d), Ma: null });
        },
        k: (a, b, c) => {
          function d(f) {
            return new e(u.buffer, B[(f + 4) >> 2], B[f >> 2]);
          }
          var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][
            b
          ];
          c = Q(c);
          O(a, { name: c, fromWireType: d, La: 8, readValueFromPointer: d }, { kb: !0 });
        },
        x: (a) => {
          O(a, Ib);
        },
        ga: (a, b, c, d, e, f, h, g, l, m, n, p) => {
          c = Q(c);
          f = T(e, f);
          g = T(h, g);
          m = T(l, m);
          p = T(n, p);
          P([a], [b], (r) => {
            r = r[0];
            return [new nb(c, r.Fa, !1, !1, !0, r, d, f, g, m, p)];
          });
        },
        E: (a, b) => {
          b = Q(b);
          var c = 'std::string' === b;
          O(a, {
            name: b,
            fromWireType: function (d) {
              var e = B[d >> 2],
                f = d + 4;
              if (c)
                for (var h = f, g = 0; g <= e; ++g) {
                  var l = f + g;
                  if (g == e || 0 == x[l]) {
                    h = h ? G(x, h, l - h) : '';
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
                throw new R('Cannot pass non-string to std::string');
              if (c && h)
                for (var g = (f = 0); g < e.length; ++g) {
                  var l = e.charCodeAt(g);
                  127 >= l ? f++ : 2047 >= l ? (f += 2) : 55296 <= l && 57343 >= l ? ((f += 4), ++g) : (f += 3);
                }
              else f = e.length;
              g = gc(4 + f + 1);
              l = g + 4;
              B[g >> 2] = f;
              if (c && h) K(e, l, f + 1);
              else if (h)
                for (h = 0; h < f; ++h) {
                  var m = e.charCodeAt(h);
                  if (255 < m) throw (U(l), new R('String has UTF-16 code units that do not fit in 8 bits'));
                  x[l + h] = m;
                }
              else for (h = 0; h < f; ++h) x[l + h] = e[h];
              null !== d && d.push(U, g);
              return g;
            },
            La: 8,
            readValueFromPointer: L,
            Ma(d) {
              U(d);
            },
          });
        },
        w: (a, b, c) => {
          c = Q(c);
          if (2 === b) {
            var d = Kb;
            var e = Lb;
            var f = Mb;
            var h = (g) => z[g >> 1];
          } else 4 === b && ((d = Nb), (e = Ob), (f = Pb), (h = (g) => B[g >> 2]));
          O(a, {
            name: c,
            fromWireType: (g) => {
              for (var l = B[g >> 2], m, n = g + 4, p = 0; p <= l; ++p) {
                var r = g + 4 + p * b;
                if (p == l || 0 == h(r))
                  (n = d(n, r - n)), void 0 === m ? (m = n) : ((m += String.fromCharCode(0)), (m += n)), (n = r + b);
              }
              U(g);
              return m;
            },
            toWireType: (g, l) => {
              if ('string' != typeof l) throw new R(`Cannot pass non-string to C++ string type ${c}`);
              var m = f(l),
                n = gc(4 + m + b);
              B[n >> 2] = m / b;
              e(l, n + 4, m + b);
              null !== g && g.push(U, n);
              return n;
            },
            La: 8,
            readValueFromPointer: L,
            Ma(g) {
              U(g);
            },
          });
        },
        A: (a, b, c, d, e, f) => {
          La[a] = { name: Q(b), Xa: T(c, d), Na: T(e, f), $a: [] };
        },
        m: (a, b, c, d, e, f, h, g, l, m) => {
          La[a].$a.push({ eb: Q(b), jb: c, hb: T(d, e), ib: f, pb: h, ob: T(g, l), qb: m });
        },
        ba: (a, b) => {
          b = Q(b);
          O(a, { sb: !0, name: b, La: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        M: () => {
          Fa = !1;
          Qb = 0;
        },
        I: () => {
          throw Infinity;
        },
        ea: (a, b, c, d) => {
          a = Rb[a];
          b = Cb(b);
          return a(null, b, c, d);
        },
        F: Bb,
        da: (a, b, c) => {
          var d = Tb(a, b),
            e = d.shift();
          a--;
          var f = Array(a);
          b = `methodCaller<(${d.map((h) => h.name).join(', ')}) => ${e.name}>`;
          return Sb(
            cb(b, (h, g, l, m) => {
              for (var n = 0, p = 0; p < a; ++p) (f[p] = d[p].readValueFromPointer(m + n)), (n += d[p].La);
              g = 1 === c ? Ub(g, f) : g.apply(h, f);
              h = [];
              g = e.toWireType(h, g);
              h.length && (B[l >> 2] = lb(h));
              return g;
            }),
          );
        },
        fa: (a) => {
          9 < a && (V[a + 1] += 1);
        },
        ca: (a) => {
          var b = Cb(a);
          Ma(b);
          Bb(a);
        },
        r: (a, b) => {
          a = Fb(a, '_emval_take_value');
          a = a.readValueFromPointer(b);
          return lb(a);
        },
        J: (a, b) => {
          Vb[a] && (clearTimeout(Vb[a].id), delete Vb[a]);
          if (!b) return 0;
          var c = setTimeout(() => {
            delete Vb[a];
            Yb(() => hc(a, performance.now()));
          }, b);
          Vb[a] = { id: c, tb: b };
          return 0;
        },
        K: (a, b, c, d) => {
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
        ha: () => performance.now(),
        L: (a) => {
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
        Y: (a, b) => {
          var c = 0;
          ac().forEach((d, e) => {
            var f = b + c;
            e = B[(a + 4 * e) >> 2] = f;
            for (f = 0; f < d.length; ++f) u[e++] = d.charCodeAt(f);
            u[e] = 0;
            c += d.length + 1;
          });
          return 0;
        },
        Z: (a, b) => {
          var c = ac();
          B[a >> 2] = c.length;
          var d = 0;
          c.forEach((e) => (d += e.length + 1));
          B[b >> 2] = d;
          return 0;
        },
        V: () => 52,
        T: () => 52,
        S: (a, b, c, d) => {
          for (var e = 0, f = 0; f < c; f++) {
            var h = B[b >> 2],
              g = B[(b + 4) >> 2];
            b += 8;
            for (var l = 0; l < g; l++) {
              var m = a,
                n = x[h + l],
                p = bc[m];
              0 === n || 10 === n ? ((1 === m ? ja : t)(G(p)), (p.length = 0)) : p.push(n);
            }
            e += g;
          }
          B[d >> 2] = e;
          return 0;
        },
        j: ic,
        f: jc,
        e: kc,
        _: lc,
        s: mc,
        C: nc,
        q: oc,
        b: pc,
        a: qc,
        h: rc,
        l: sc,
        u: tc,
        G: uc,
        X: Xb,
        N: (a, b) => {
          dc(x.subarray(a, a + b));
          return 0;
        },
      },
      W = (function () {
        function a(c) {
          W = c.exports;
          la = W.ia;
          qa();
          S = W.na;
          sa.unshift(W.ja);
          C--;
          k.monitorRunDependencies?.(C);
          0 == C && (null !== va && (clearInterval(va), (va = null)), D && ((c = D), (D = null), c()));
          return W;
        }
        C++;
        k.monitorRunDependencies?.(C);
        var b = { a: vc };
        if (k.instantiateWasm)
          try {
            return k.instantiateWasm(b, a);
          } catch (c) {
            t(`Module.instantiateWasm callback failed with error: ${c}`), ba(c);
          }
        ya ??= xa('DotLottiePlayer.wasm')
          ? 'DotLottiePlayer.wasm'
          : k.locateFile
          ? k.locateFile('DotLottiePlayer.wasm', q)
          : q + 'DotLottiePlayer.wasm';
        Ca(b, function (c) {
          a(c.instance);
        }).catch(ba);
        return {};
      })(),
      gc = (a) => (gc = W.ka)(a),
      sb = (a) => (sb = W.la)(a),
      U = (a) => (U = W.ma)(a),
      hc = (a, b) => (hc = W.oa)(a, b),
      X = (a, b) => (X = W.pa)(a, b),
      J = (a) => (J = W.qa)(a),
      Y = (a) => (Y = W.ra)(a),
      Z = () => (Z = W.sa)(),
      Ia = (a, b, c) => (Ia = W.ta)(a, b, c);
    k.dynCall_iijj = (a, b, c, d, e, f) => (k.dynCall_iijj = W.ua)(a, b, c, d, e, f);
    k.dynCall_vijj = (a, b, c, d, e, f) => (k.dynCall_vijj = W.va)(a, b, c, d, e, f);
    k.dynCall_jiii = (a, b, c, d) => (k.dynCall_jiii = W.wa)(a, b, c, d);
    var wc = (k.dynCall_vijjjj = (a, b, c, d, e, f, h, g, l, m) =>
      (wc = k.dynCall_vijjjj = W.xa)(a, b, c, d, e, f, h, g, l, m));
    k.dynCall_jii = (a, b, c) => (k.dynCall_jii = W.ya)(a, b, c);
    k.dynCall_viijii = (a, b, c, d, e, f, h) => (k.dynCall_viijii = W.za)(a, b, c, d, e, f, h);
    k.dynCall_iiiiij = (a, b, c, d, e, f, h) => (k.dynCall_iiiiij = W.Aa)(a, b, c, d, e, f, h);
    k.dynCall_iiiiijj = (a, b, c, d, e, f, h, g, l) => (k.dynCall_iiiiijj = W.Ba)(a, b, c, d, e, f, h, g, l);
    k.dynCall_iiiiiijj = (a, b, c, d, e, f, h, g, l, m) => (k.dynCall_iiiiiijj = W.Ca)(a, b, c, d, e, f, h, g, l, m);
    function pc(a, b) {
      var c = Z();
      try {
        S.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function lc(a, b, c, d, e) {
      var f = Z();
      try {
        return S.get(a)(b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function qc(a, b, c) {
      var d = Z();
      try {
        S.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function rc(a, b, c, d) {
      var e = Z();
      try {
        S.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function oc(a) {
      var b = Z();
      try {
        S.get(a)();
      } catch (c) {
        Y(b);
        if (c !== c + 0) throw c;
        X(1, 0);
      }
    }
    function ic(a, b) {
      var c = Z();
      try {
        return S.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function tc(a, b, c, d, e, f) {
      var h = Z();
      try {
        S.get(a)(b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function sc(a, b, c, d, e) {
      var f = Z();
      try {
        S.get(a)(b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function nc(a, b, c, d, e, f, h, g) {
      var l = Z();
      try {
        return S.get(a)(b, c, d, e, f, h, g);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function kc(a, b, c, d) {
      var e = Z();
      try {
        return S.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function jc(a, b, c) {
      var d = Z();
      try {
        return S.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function mc(a, b, c, d, e, f) {
      var h = Z();
      try {
        return S.get(a)(b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function uc(a, b, c, d, e, f, h, g, l, m) {
      var n = Z();
      try {
        wc(a, b, c, d, e, f, h, g, l, m);
      } catch (p) {
        Y(n);
        if (p !== p + 0) throw p;
        X(1, 0);
      }
    }
    var xc;
    D = function yc() {
      xc || zc();
      xc || (D = yc);
    };
    function zc() {
      function a() {
        if (!xc && ((xc = !0), (k.calledRun = !0), !ma)) {
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
      if (!(0 < C)) {
        if (k.preRun) for ('function' == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; ) ua();
        Ea(ra);
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
    zc();
    moduleRtn = ca;

    return moduleRtn;
  };
})();
export default createDotLottiePlayerModule;
