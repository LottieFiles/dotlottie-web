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
      p = '',
      fa;
    'undefined' != typeof document && document.currentScript && (p = document.currentScript.src);
    _scriptName && (p = _scriptName);
    p.startsWith('blob:') ? (p = '') : (p = p.substr(0, p.replace(/[?#].*/, '').lastIndexOf('/') + 1));
    fa = (a) =>
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
      C,
      D,
      oa,
      pa;
    function qa() {
      var a = la.buffer;
      k.HEAP8 = u = new Int8Array(a);
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
        : fa(a).then(
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
    function Da(a) {
      this.name = 'ExitStatus';
      this.message = `Program terminated with exit(${a})`;
      this.status = a;
    }
    var Ea = (a) => {
        for (; 0 < a.length; ) a.shift()(k);
      },
      Fa = k.noExitRuntime || !0,
      Ga = 'undefined' != typeof TextDecoder ? new TextDecoder() : void 0,
      H = (a, b, c) => {
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
        this.Ca = a - 24;
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
    function Oa(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new Q(`type "${d}" must have a positive integer typeid pointer`);
      if (L.hasOwnProperty(a)) {
        if (c.hb) return;
        throw new Q(`Cannot register type '${d}' twice`);
      }
      L[a] = b;
      delete Ma[a];
      K.hasOwnProperty(a) && ((b = K[a]), delete K[a], b.forEach((e) => e()));
    }
    function N(a, b, c = {}) {
      return Oa(a, b, c);
    }
    var Pa = (a) => {
        throw new Q(a.Aa.Da.Ba.name + ' instance already deleted');
      },
      Qa = !1,
      Ra = () => {},
      Ta = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.Ga) return null;
        a = Ta(a, b, c.Ga);
        return null === a ? null : c.$a(a);
      },
      Ua = {},
      R = [],
      Va = () => {
        for (; R.length; ) {
          var a = R.pop();
          a.Aa.Ma = !1;
          a['delete']();
        }
      },
      Wa,
      Xa = {},
      Ya = (a, b) => {
        if (void 0 === b) throw new Q('ptr should not be undefined');
        for (; a.Ga; ) (b = a.Pa(b)), (a = a.Ga);
        return Xa[b];
      },
      $a = (a, b) => {
        if (!b.Da || !b.Ca) throw new M('makeClassHandle requires ptr and ptrType');
        if (!!b.Ha !== !!b.Ea) throw new M('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return Za(Object.create(a, { Aa: { value: b, writable: !0 } }));
      },
      Za = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (Za = (b) => b), a;
        Qa = new FinalizationRegistry((b) => {
          b = b.Aa;
          --b.count.value;
          0 === b.count.value && (b.Ea ? b.Ha.Ka(b.Ea) : b.Da.Ba.Ka(b.Ca));
        });
        Za = (b) => {
          var c = b.Aa;
          c.Ea && Qa.register(b, { Aa: c }, b);
          return b;
        };
        Ra = (b) => {
          Qa.unregister(b);
        };
        return Za(a);
      };
    function ab() {}
    var bb = (a, b) => Object.defineProperty(b, 'name', { value: a }),
      cb = (a, b, c) => {
        if (void 0 === a[b].Fa) {
          var d = a[b];
          a[b] = function (...e) {
            if (!a[b].Fa.hasOwnProperty(e.length))
              throw new Q(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].Fa})!`,
              );
            return a[b].Fa[e.length].apply(this, e);
          };
          a[b].Fa = [];
          a[b].Fa[d.Qa] = d;
        }
      },
      db = (a, b, c) => {
        if (k.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== k[a].Fa && void 0 !== k[a].Fa[c]))
            throw new Q(`Cannot register public name '${a}' twice`);
          cb(k, a, a);
          if (k.hasOwnProperty(c))
            throw new Q(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          k[a].Fa[c] = b;
        } else (k[a] = b), void 0 !== c && (k[a].qb = c);
      },
      eb = (a) => {
        if (void 0 === a) return '_unknown';
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function fb(a, b, c, d, e, f, h, g) {
      this.name = a;
      this.constructor = b;
      this.Na = c;
      this.Ka = d;
      this.Ga = e;
      this.bb = f;
      this.Pa = h;
      this.$a = g;
      this.jb = [];
    }
    var gb = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.Pa) throw new Q(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.Pa(a);
        b = b.Ga;
      }
      return a;
    };
    function hb(a, b) {
      if (null === b) {
        if (this.Ta) throw new Q(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Aa) throw new Q(`Cannot pass "${ib(b)}" as a ${this.name}`);
      if (!b.Aa.Ca) throw new Q(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return gb(b.Aa.Ca, b.Aa.Da.Ba, this.Ba);
    }
    function jb(a, b) {
      if (null === b) {
        if (this.Ta) throw new Q(`null is not a valid ${this.name}`);
        if (this.Sa) {
          var c = this.Ua();
          null !== a && a.push(this.Ka, c);
          return c;
        }
        return 0;
      }
      if (!b || !b.Aa) throw new Q(`Cannot pass "${ib(b)}" as a ${this.name}`);
      if (!b.Aa.Ca) throw new Q(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.Ra && b.Aa.Da.Ra)
        throw new Q(
          `Cannot convert argument of type ${b.Aa.Ha ? b.Aa.Ha.name : b.Aa.Da.name} to parameter type ${this.name}`,
        );
      c = gb(b.Aa.Ca, b.Aa.Da.Ba, this.Ba);
      if (this.Sa) {
        if (void 0 === b.Aa.Ea) throw new Q('Passing raw pointer to smart pointer is illegal');
        switch (this.ob) {
          case 0:
            if (b.Aa.Ha === this) c = b.Aa.Ea;
            else
              throw new Q(
                `Cannot convert argument of type ${b.Aa.Ha ? b.Aa.Ha.name : b.Aa.Da.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            c = b.Aa.Ea;
            break;
          case 2:
            if (b.Aa.Ha === this) c = b.Aa.Ea;
            else {
              var d = b.clone();
              c = this.kb(
                c,
                kb(() => d['delete']()),
              );
              null !== a && a.push(this.Ka, c);
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
        if (this.Ta) throw new Q(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Aa) throw new Q(`Cannot pass "${ib(b)}" as a ${this.name}`);
      if (!b.Aa.Ca) throw new Q(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.Aa.Da.Ra) throw new Q(`Cannot convert argument of type ${b.Aa.Da.name} to parameter type ${this.name}`);
      return gb(b.Aa.Ca, b.Aa.Da.Ba, this.Ba);
    }
    function mb(a, b, c, d, e, f, h, g, l, m, n) {
      this.name = a;
      this.Ba = b;
      this.Ta = c;
      this.Ra = d;
      this.Sa = e;
      this.ib = f;
      this.ob = h;
      this.Ya = g;
      this.Ua = l;
      this.kb = m;
      this.Ka = n;
      e || void 0 !== b.Ga ? (this.toWireType = jb) : ((this.toWireType = d ? hb : lb), (this.Ja = null));
    }
    var nb = (a, b, c) => {
        if (!k.hasOwnProperty(a)) throw new M('Replacing nonexistent public symbol');
        void 0 !== k[a].Fa && void 0 !== c ? (k[a].Fa[c] = b) : ((k[a] = b), (k[a].Qa = c));
      },
      S,
      ob = (a, b, c = []) => {
        a.includes('j') ? ((a = a.replace(/p/g, 'i')), (b = (0, k['dynCall_' + a])(b, ...c))) : (b = S.get(b)(...c));
        return b;
      },
      pb =
        (a, b) =>
        (...c) =>
          ob(a, b, c),
      T = (a, b) => {
        a = P(a);
        var c = a.includes('j') ? pb(a, b) : S.get(b);
        if ('function' != typeof c) throw new Q(`unknown function pointer with signature ${a}: ${b}`);
        return c;
      },
      qb,
      sb = (a) => {
        a = rb(a);
        var b = P(a);
        U(a);
        return b;
      },
      tb = (a, b) => {
        function c(f) {
          e[f] || L[f] || (Ma[f] ? Ma[f].forEach(c) : (d.push(f), (e[f] = !0)));
        }
        var d = [],
          e = {};
        b.forEach(c);
        throw new qb(`${a}: ` + d.map(sb).join([', ']));
      },
      ub = (a, b) => {
        for (var c = [], d = 0; d < a; d++) c.push(D[(b + 4 * d) >> 2]);
        return c;
      };
    function vb(a) {
      for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].Ja) return !0;
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
        q = [],
        r = [];
      return bb(a, function (...A) {
        r.length = 0;
        q.length = h ? 2 : 1;
        q[0] = e;
        if (h) {
          var v = b[1].toWireType(r, this);
          q[1] = v;
        }
        for (var w = 0; w < m; ++w) (n[w] = b[w + 2].toWireType(r, A[w])), q.push(n[w]);
        A = d(...q);
        if (g) La(r);
        else
          for (w = h ? 1 : 2; w < b.length; w++) {
            var E = 1 === w ? v : n[w - 2];
            null !== b[w].Ja && b[w].Ja(E);
          }
        v = l ? b[0].fromWireType(A) : void 0;
        return v;
      });
    }
    var xb = (a) => {
        a = a.trim();
        const b = a.indexOf('(');
        return -1 !== b ? a.substr(0, b) : a;
      },
      yb = [],
      V = [],
      zb = (a) => {
        9 < a && 0 === --V[a + 1] && ((V[a] = void 0), yb.push(a));
      },
      Bb = (a) => {
        if (!a) throw new Q('Cannot use deleted val. handle = ' + a);
        return V[a];
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
            const b = yb.pop() || V.length;
            V[b] = a;
            V[b + 1] = 1;
            return b;
        }
      },
      Cb = {
        name: 'emscripten::val',
        fromWireType: (a) => {
          var b = Bb(a);
          zb(a);
          return b;
        },
        toWireType: (a, b) => kb(b),
        Ia: 8,
        readValueFromPointer: J,
        Ja: null,
      },
      Db = (a, b, c) => {
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
      Eb = (a, b) => {
        var c = L[a];
        if (void 0 === c) throw ((a = `${b} has unknown type ${sb(a)}`), new Q(a));
        return c;
      },
      ib = (a) => {
        if (null === a) return 'null';
        var b = typeof a;
        return 'object' === b || 'array' === b || 'function' === b ? a.toString() : '' + a;
      },
      Fb = (a, b) => {
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
      Gb = (a, b, c) => {
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
      Hb = Object.assign({ optional: !0 }, Cb),
      Ib = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Jb = (a, b) => {
        var c = a >> 1;
        for (var d = c + b / 2; !(c >= d) && z[c]; ) ++c;
        c <<= 1;
        if (32 < c - a && Ib) return Ib.decode(x.subarray(a, c));
        c = '';
        for (d = 0; !(d >= b / 2); ++d) {
          var e = y[(a + 2 * d) >> 1];
          if (0 == e) break;
          c += String.fromCharCode(e);
        }
        return c;
      },
      Kb = (a, b, c) => {
        c ??= 2147483647;
        if (2 > c) return 0;
        c -= 2;
        var d = b;
        c = c < 2 * a.length ? c / 2 : a.length;
        for (var e = 0; e < c; ++e) (y[b >> 1] = a.charCodeAt(e)), (b += 2);
        y[b >> 1] = 0;
        return b - d;
      },
      Lb = (a) => 2 * a.length,
      Mb = (a, b) => {
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
      Nb = (a, b, c) => {
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
      Ob = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          b += 4;
        }
        return b;
      },
      Pb = [],
      Qb = (a) => {
        var b = Pb.length;
        Pb.push(a);
        return b;
      },
      Rb = (a, b) => {
        for (var c = Array(a), d = 0; d < a; ++d) c[d] = Eb(D[(b + 4 * d) >> 2], 'parameter ' + d);
        return c;
      },
      Sb = Reflect.construct,
      Tb = {},
      Ub = (a) => {
        if (!(a instanceof Da || 'unwind' == a)) throw a;
      },
      Vb = 0,
      Wb = (a) => {
        na = a;
        Fa || 0 < Vb || (k.onExit?.(a), (ma = !0));
        throw new Da(a);
      },
      Xb = (a) => {
        if (!ma)
          try {
            if ((a(), !(Fa || 0 < Vb)))
              try {
                (na = a = na), Wb(a);
              } catch (b) {
                Ub(b);
              }
          } catch (b) {
            Ub(b);
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
        wa('initRandomDevice');
      },
      cc = (a) => (cc = bc())(a);
    M = k.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    for (var dc = Array(256), ec = 0; 256 > ec; ++ec) dc[ec] = String.fromCharCode(ec);
    Na = dc;
    Q = k.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    Object.assign(ab.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof ab && a instanceof ab)) return !1;
        var b = this.Aa.Da.Ba,
          c = this.Aa.Ca;
        a.Aa = a.Aa;
        var d = a.Aa.Da.Ba;
        for (a = a.Aa.Ca; b.Ga; ) (c = b.Pa(c)), (b = b.Ga);
        for (; d.Ga; ) (a = d.Pa(a)), (d = d.Ga);
        return b === d && c === a;
      },
      clone: function () {
        this.Aa.Ca || Pa(this);
        if (this.Aa.Oa) return (this.Aa.count.value += 1), this;
        var a = Za,
          b = Object,
          c = b.create,
          d = Object.getPrototypeOf(this),
          e = this.Aa;
        a = a(
          c.call(b, d, {
            Aa: { value: { count: e.count, Ma: e.Ma, Oa: e.Oa, Ca: e.Ca, Da: e.Da, Ea: e.Ea, Ha: e.Ha } },
          }),
        );
        a.Aa.count.value += 1;
        a.Aa.Ma = !1;
        return a;
      },
      ['delete']() {
        this.Aa.Ca || Pa(this);
        if (this.Aa.Ma && !this.Aa.Oa) throw new Q('Object already scheduled for deletion');
        Ra(this);
        var a = this.Aa;
        --a.count.value;
        0 === a.count.value && (a.Ea ? a.Ha.Ka(a.Ea) : a.Da.Ba.Ka(a.Ca));
        this.Aa.Oa || ((this.Aa.Ea = void 0), (this.Aa.Ca = void 0));
      },
      isDeleted: function () {
        return !this.Aa.Ca;
      },
      deleteLater: function () {
        this.Aa.Ca || Pa(this);
        if (this.Aa.Ma && !this.Aa.Oa) throw new Q('Object already scheduled for deletion');
        R.push(this);
        1 === R.length && Wa && Wa(Va);
        this.Aa.Ma = !0;
        return this;
      },
    });
    k.getInheritedInstanceCount = () => Object.keys(Xa).length;
    k.getLiveInheritedInstances = () => {
      var a = [],
        b;
      for (b in Xa) Xa.hasOwnProperty(b) && a.push(Xa[b]);
      return a;
    };
    k.flushPendingDeletes = Va;
    k.setDelayFunction = (a) => {
      Wa = a;
      R.length && Wa && Wa(Va);
    };
    Object.assign(mb.prototype, {
      cb(a) {
        this.Ya && (a = this.Ya(a));
        return a;
      },
      Wa(a) {
        this.Ka?.(a);
      },
      Ia: 8,
      readValueFromPointer: J,
      fromWireType: function (a) {
        function b() {
          return this.Sa
            ? $a(this.Ba.Na, { Da: this.ib, Ca: c, Ha: this, Ea: a })
            : $a(this.Ba.Na, { Da: this, Ca: a });
        }
        var c = this.cb(a);
        if (!c) return this.Wa(a), null;
        var d = Ya(this.Ba, c);
        if (void 0 !== d) {
          if (0 === d.Aa.count.value) return (d.Aa.Ca = c), (d.Aa.Ea = a), d.clone();
          d = d.clone();
          this.Wa(a);
          return d;
        }
        d = this.Ba.bb(c);
        d = Ua[d];
        if (!d) return b.call(this);
        d = this.Ra ? d.Za : d.pointerType;
        var e = Ta(c, this.Ba, d.Ba);
        return null === e
          ? b.call(this)
          : this.Sa
          ? $a(d.Ba.Na, { Da: d, Ca: e, Ha: this, Ea: a })
          : $a(d.Ba.Na, { Da: d, Ca: e });
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
    V.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1);
    k.count_emval_handles = () => V.length / 2 - 5 - yb.length;
    var rc = {
        c: (a, b, c, d) => {
          wa(
            `Assertion failed: ${a ? H(x, a) : ''}, at: ` +
              [b ? (b ? H(x, b) : '') : 'unknown filename', c, d ? (d ? H(x, d) : '') : 'unknown function'],
          );
        },
        m: (a, b, c) => {
          var d = new Ha(a);
          D[(d.Ca + 16) >> 2] = 0;
          D[(d.Ca + 4) >> 2] = b;
          D[(d.Ca + 8) >> 2] = c;
          Ia = a;
          Ja++;
          throw Ia;
        },
        B: function () {
          return 0;
        },
        R: () => {},
        O: () => {},
        T: function () {
          return 0;
        },
        P: () => {},
        A: function () {},
        Q: () => {},
        U: () => {
          wa('');
        },
        v: (a) => {
          var b = Ka[a];
          delete Ka[a];
          var c = b.Ua,
            d = b.Ka,
            e = b.Xa,
            f = e.map((h) => h.gb).concat(e.map((h) => h.mb));
          O([a], f, (h) => {
            var g = {};
            e.forEach((l, m) => {
              var n = h[m],
                q = l.eb,
                r = l.fb,
                A = h[m + e.length],
                v = l.lb,
                w = l.nb;
              g[l.ab] = {
                read: (E) => n.fromWireType(q(r, E)),
                write: (E, ha) => {
                  var B = [];
                  v(w, E, A.toWireType(B, ha));
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
                Ia: 8,
                readValueFromPointer: J,
                Ja: d,
              },
            ];
          });
        },
        I: () => {},
        _: (a, b, c, d) => {
          b = P(b);
          N(a, {
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
        r: (a, b, c, d, e, f, h, g, l, m, n, q, r) => {
          n = P(n);
          f = T(e, f);
          g &&= T(h, g);
          m &&= T(l, m);
          r = T(q, r);
          var A = eb(n);
          db(A, function () {
            tb(`Cannot construct ${n} due to unbound types`, [d]);
          });
          O([a, b, c], d ? [d] : [], (v) => {
            v = v[0];
            if (d) {
              var w = v.Ba;
              var E = w.Na;
            } else E = ab.prototype;
            v = bb(n, function (...Sa) {
              if (Object.getPrototypeOf(this) !== ha) throw new Q("Use 'new' to construct " + n);
              if (void 0 === B.La) throw new Q(n + ' has no accessible constructor');
              var Ab = B.La[Sa.length];
              if (void 0 === Ab)
                throw new Q(
                  `Tried to invoke ctor of ${n} with invalid number of parameters (${
                    Sa.length
                  }) - expected (${Object.keys(B.La).toString()}) parameters instead!`,
                );
              return Ab.apply(this, Sa);
            });
            var ha = Object.create(E, { constructor: { value: v } });
            v.prototype = ha;
            var B = new fb(n, v, ha, r, w, f, g, m);
            if (B.Ga) {
              var ia;
              (ia = B.Ga).Va ?? (ia.Va = []);
              B.Ga.Va.push(B);
            }
            w = new mb(n, B, !0, !1, !1);
            ia = new mb(n + '*', B, !1, !1, !1);
            E = new mb(n + ' const*', B, !1, !0, !1);
            Ua[a] = { pointerType: ia, Za: E };
            nb(A, v);
            return [w, ia, E];
          });
        },
        q: (a, b, c, d, e, f) => {
          var h = ub(b, c);
          e = T(d, e);
          O([], [a], (g) => {
            g = g[0];
            var l = `constructor ${g.name}`;
            void 0 === g.Ba.La && (g.Ba.La = []);
            if (void 0 !== g.Ba.La[b - 1])
              throw new Q(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  g.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            g.Ba.La[b - 1] = () => {
              tb(`Cannot construct ${g.name} due to unbound types`, h);
            };
            O([], h, (m) => {
              m.splice(1, 0, null);
              g.Ba.La[b - 1] = wb(l, m, null, e, f);
              return [];
            });
            return [];
          });
        },
        f: (a, b, c, d, e, f, h, g) => {
          var l = ub(c, d);
          b = P(b);
          b = xb(b);
          f = T(e, f);
          O([], [a], (m) => {
            function n() {
              tb(`Cannot call ${q} due to unbound types`, l);
            }
            m = m[0];
            var q = `${m.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            g && m.Ba.jb.push(b);
            var r = m.Ba.Na,
              A = r[b];
            void 0 === A || (void 0 === A.Fa && A.className !== m.name && A.Qa === c - 2)
              ? ((n.Qa = c - 2), (n.className = m.name), (r[b] = n))
              : (cb(r, b, q), (r[b].Fa[c - 2] = n));
            O([], l, (v) => {
              v = wb(q, v, m, f, h);
              void 0 === r[b].Fa ? ((v.Qa = c - 2), (r[b] = v)) : (r[b].Fa[c - 2] = v);
              return [];
            });
            return [];
          });
        },
        Z: (a) => N(a, Cb),
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
            Ia: 8,
            readValueFromPointer: Db(b, c, d),
            Ja: null,
          });
          db(b, e);
        },
        k: (a, b, c) => {
          var d = Eb(a, 'enum');
          b = P(b);
          a = d.constructor;
          d = Object.create(d.constructor.prototype, {
            value: { value: c },
            constructor: { value: bb(`${d.name}_${b}`, function () {}) },
          });
          a.values[c] = d;
          a[b] = d;
        },
        C: (a, b, c) => {
          b = P(b);
          N(a, {
            name: b,
            fromWireType: (d) => d,
            toWireType: (d, e) => e,
            Ia: 8,
            readValueFromPointer: Fb(b, c),
            Ja: null,
          });
        },
        E: (a, b, c, d, e, f) => {
          var h = ub(b, c);
          a = P(a);
          a = xb(a);
          e = T(d, e);
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
          N(a, { name: b, fromWireType: e, toWireType: h, Ia: 8, readValueFromPointer: Gb(b, c, 0 !== d), Ja: null });
        },
        h: (a, b, c) => {
          function d(f) {
            return new e(u.buffer, D[(f + 4) >> 2], D[f >> 2]);
          }
          var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][
            b
          ];
          c = P(c);
          N(a, { name: c, fromWireType: d, Ia: 8, readValueFromPointer: d }, { hb: !0 });
        },
        u: (a) => {
          N(a, Hb);
        },
        ea: (a, b, c, d, e, f, h, g, l, m, n, q) => {
          c = P(c);
          f = T(e, f);
          g = T(h, g);
          m = T(l, m);
          q = T(n, q);
          O([a], [b], (r) => {
            r = r[0];
            return [new mb(c, r.Ba, !1, !1, !0, r, d, f, g, m, q)];
          });
        },
        D: (a, b) => {
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
              g = fc(4 + f + 1);
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
            Ia: 8,
            readValueFromPointer: J,
            Ja(d) {
              U(d);
            },
          });
        },
        t: (a, b, c) => {
          c = P(c);
          if (2 === b) {
            var d = Jb;
            var e = Kb;
            var f = Lb;
            var h = (g) => z[g >> 1];
          } else 4 === b && ((d = Mb), (e = Nb), (f = Ob), (h = (g) => D[g >> 2]));
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
                n = fc(4 + m + b);
              D[n >> 2] = m / b;
              e(l, n + 4, m + b);
              null !== g && g.push(U, n);
              return n;
            },
            Ia: 8,
            readValueFromPointer: J,
            Ja(g) {
              U(g);
            },
          });
        },
        w: (a, b, c, d, e, f) => {
          Ka[a] = { name: P(b), Ua: T(c, d), Ka: T(e, f), Xa: [] };
        },
        j: (a, b, c, d, e, f, h, g, l, m) => {
          Ka[a].Xa.push({ ab: P(b), gb: c, eb: T(d, e), fb: f, mb: h, lb: T(g, l), nb: m });
        },
        $: (a, b) => {
          b = P(b);
          N(a, { pb: !0, name: b, Ia: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        N: () => {
          Fa = !1;
          Vb = 0;
        },
        J: () => {
          throw Infinity;
        },
        ca: (a, b, c, d) => {
          a = Pb[a];
          b = Bb(b);
          return a(null, b, c, d);
        },
        F: zb,
        ba: (a, b, c) => {
          var d = Rb(a, b),
            e = d.shift();
          a--;
          var f = Array(a);
          b = `methodCaller<(${d.map((h) => h.name).join(', ')}) => ${e.name}>`;
          return Qb(
            bb(b, (h, g, l, m) => {
              for (var n = 0, q = 0; q < a; ++q) (f[q] = d[q].readValueFromPointer(m + n)), (n += d[q].Ia);
              g = 1 === c ? Sb(g, f) : g.apply(h, f);
              h = [];
              g = e.toWireType(h, g);
              h.length && (D[l >> 2] = kb(h));
              return g;
            }),
          );
        },
        da: (a) => {
          9 < a && (V[a + 1] += 1);
        },
        aa: (a) => {
          var b = Bb(a);
          La(b);
          zb(a);
        },
        o: (a, b) => {
          a = Eb(a, '_emval_take_value');
          a = a.readValueFromPointer(b);
          return kb(a);
        },
        K: (a, b) => {
          Tb[a] && (clearTimeout(Tb[a].id), delete Tb[a]);
          if (!b) return 0;
          var c = setTimeout(() => {
            delete Tb[a];
            Xb(() => gc(a, performance.now()));
          }, b);
          Tb[a] = { id: c, rb: b };
          return 0;
        },
        L: (a, b, c, d) => {
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
        fa: () => performance.now(),
        M: (a) => {
          var b = x.length;
          a >>>= 0;
          if (2147483648 < a) return !1;
          for (var c = 1; 4 >= c; c *= 2) {
            var d = b * (1 + 0.2 / c);
            d = Math.min(d, a + 100663296);
            a: {
              d =
                (Math.min(2147483648, 65536 * Math.ceil(Math.max(a, d) / 65536)) - la.buffer.byteLength + 65535) /
                65536;
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
        W: (a, b) => {
          var c = 0;
          $b().forEach((d, e) => {
            var f = b + c;
            e = D[(a + 4 * e) >> 2] = f;
            for (f = 0; f < d.length; ++f) u[e++] = d.charCodeAt(f);
            u[e] = 0;
            c += d.length + 1;
          });
          return 0;
        },
        X: (a, b) => {
          var c = $b();
          D[a >> 2] = c.length;
          var d = 0;
          c.forEach((e) => (d += e.length + 1));
          D[b >> 2] = d;
          return 0;
        },
        s: () => 52,
        z: () => 52,
        H: function () {
          return 70;
        },
        S: (a, b, c, d) => {
          for (var e = 0, f = 0; f < c; f++) {
            var h = D[b >> 2],
              g = D[(b + 4) >> 2];
            b += 8;
            for (var l = 0; l < g; l++) {
              var m = a,
                n = x[h + l],
                q = ac[m];
              0 === n || 10 === n ? ((1 === m ? ja : t)(H(q, 0)), (q.length = 0)) : q.push(n);
            }
            e += g;
          }
          D[d >> 2] = e;
          return 0;
        },
        Y: (a, b) => {
          cc(x.subarray(a, a + b));
          return 0;
        },
        i: hc,
        d: ic,
        e: jc,
        p: kc,
        y: lc,
        b: mc,
        a: nc,
        g: oc,
        n: pc,
        G: qc,
        V: Wb,
      },
      W = (function () {
        function a(c) {
          W = c.exports;
          la = W.ga;
          qa();
          S = W.ka;
          sa.unshift(W.ha);
          F--;
          k.monitorRunDependencies?.(F);
          0 == F && (null !== va && (clearInterval(va), (va = null)), G && ((c = G), (G = null), c()));
          return W;
        }
        var b = { a: rc };
        F++;
        k.monitorRunDependencies?.(F);
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
      fc = (a) => (fc = W.ia)(a),
      rb = (a) => (rb = W.ja)(a),
      U = (a) => (U = W.la)(a),
      gc = (a, b) => (gc = W.ma)(a, b),
      X = (a, b) => (X = W.na)(a, b),
      Y = (a) => (Y = W.oa)(a),
      Z = () => (Z = W.pa)();
    k.dynCall_iijj = (a, b, c, d, e, f) => (k.dynCall_iijj = W.qa)(a, b, c, d, e, f);
    k.dynCall_vijj = (a, b, c, d, e, f) => (k.dynCall_vijj = W.ra)(a, b, c, d, e, f);
    k.dynCall_jiii = (a, b, c, d) => (k.dynCall_jiii = W.sa)(a, b, c, d);
    k.dynCall_jii = (a, b, c) => (k.dynCall_jii = W.ta)(a, b, c);
    var sc = (k.dynCall_vijjj = (a, b, c, d, e, f, h, g) => (sc = k.dynCall_vijjj = W.ua)(a, b, c, d, e, f, h, g));
    k.dynCall_jiji = (a, b, c, d, e) => (k.dynCall_jiji = W.va)(a, b, c, d, e);
    k.dynCall_viijii = (a, b, c, d, e, f, h) => (k.dynCall_viijii = W.wa)(a, b, c, d, e, f, h);
    k.dynCall_iiiiij = (a, b, c, d, e, f, h) => (k.dynCall_iiiiij = W.xa)(a, b, c, d, e, f, h);
    k.dynCall_iiiiijj = (a, b, c, d, e, f, h, g, l) => (k.dynCall_iiiiijj = W.ya)(a, b, c, d, e, f, h, g, l);
    k.dynCall_iiiiiijj = (a, b, c, d, e, f, h, g, l, m) => (k.dynCall_iiiiiijj = W.za)(a, b, c, d, e, f, h, g, l, m);
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
      var h = Z();
      try {
        return S.get(a)(b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function pc(a, b, c, d, e) {
      var f = Z();
      try {
        S.get(a)(b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
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
    function qc(a, b, c, d, e, f, h, g) {
      var l = Z();
      try {
        sc(a, b, c, d, e, f, h, g);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    var tc;
    G = function uc() {
      tc || vc();
      tc || (G = uc);
    };
    function vc() {
      function a() {
        if (!tc && ((tc = !0), (k.calledRun = !0), !ma)) {
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
    vc();
    moduleRtn = ca;

    return moduleRtn;
  };
})();
export default createDotLottiePlayerModule;
