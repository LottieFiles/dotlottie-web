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
    var ha = k.print || console.log.bind(console),
      t = k.printErr || console.error.bind(console);
    Object.assign(k, da);
    da = null;
    k.thisProgram && (ea = k.thisProgram);
    var ia = k.wasmBinary,
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
    var E = 0,
      va = null,
      F = null;
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
      if (a == ya && ia) return new Uint8Array(ia);
      throw 'both async and sync fetching of the wasm failed';
    }
    function Aa(a) {
      return ia
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
      return ia || 'function' != typeof WebAssembly.instantiateStreaming || xa(c) || 'function' != typeof fetch
        ? Ba(c, a, b)
        : fetch(c, { credentials: 'same-origin' }).then((d) =>
            WebAssembly.instantiateStreaming(d, a).then(b, function (e) {
              t(`wasm streaming compile failed: ${e}`);
              t('falling back to ArrayBuffer instantiation');
              return Ba(c, a, b);
            }),
          );
    }
    var H, I;
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
      J = (a, b, c) => {
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
        this.Ha = a - 24;
      }
    }
    var Ia = 0,
      Ja = 0,
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
      Ka = {},
      La = (a) => {
        for (; a.length; ) {
          var b = a.pop();
          a.pop()(b);
        }
      };
    function L(a) {
      return this.fromWireType(D[a >> 2]);
    }
    var M = {},
      N = {},
      Ma = {},
      Na,
      P = (a, b, c) => {
        function d(g) {
          g = c(g);
          if (g.length !== a.length) throw new Na('Mismatched type converter count');
          for (var l = 0; l < a.length; ++l) O(a[l], g[l]);
        }
        a.forEach((g) => (Ma[g] = b));
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
      Oa,
      Q = (a) => {
        for (var b = ''; x[a]; ) b += Oa[x[a++]];
        return b;
      },
      R;
    function Pa(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new R(`type "${d}" must have a positive integer typeid pointer`);
      if (N.hasOwnProperty(a)) {
        if (c.mb) return;
        throw new R(`Cannot register type '${d}' twice`);
      }
      N[a] = b;
      delete Ma[a];
      M.hasOwnProperty(a) && ((b = M[a]), delete M[a], b.forEach((e) => e()));
    }
    function O(a, b, c = {}) {
      return Pa(a, b, c);
    }
    var Qa = (a) => {
        throw new R(a.Fa.Ia.Ga.name + ' instance already deleted');
      },
      Ra = !1,
      Sa = () => {},
      Ta = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.La) return null;
        a = Ta(a, b, c.La);
        return null === a ? null : c.fb(a);
      },
      Va = {},
      Wa = [],
      Xa = () => {
        for (; Wa.length; ) {
          var a = Wa.pop();
          a.Fa.Ra = !1;
          a['delete']();
        }
      },
      Ya,
      Za = {},
      $a = (a, b) => {
        if (void 0 === b) throw new R('ptr should not be undefined');
        for (; a.La; ) (b = a.Ua(b)), (a = a.La);
        return Za[b];
      },
      bb = (a, b) => {
        if (!b.Ia || !b.Ha) throw new Na('makeClassHandle requires ptr and ptrType');
        if (!!b.Ma !== !!b.Ja) throw new Na('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return ab(Object.create(a, { Fa: { value: b, writable: !0 } }));
      },
      ab = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (ab = (b) => b), a;
        Ra = new FinalizationRegistry((b) => {
          b = b.Fa;
          --b.count.value;
          0 === b.count.value && (b.Ja ? b.Ma.Pa(b.Ja) : b.Ia.Ga.Pa(b.Ha));
        });
        ab = (b) => {
          var c = b.Fa;
          c.Ja && Ra.register(b, { Fa: c }, b);
          return b;
        };
        Sa = (b) => {
          Ra.unregister(b);
        };
        return ab(a);
      };
    function cb() {}
    var db = (a, b) => Object.defineProperty(b, 'name', { value: a }),
      eb = (a, b, c) => {
        if (void 0 === a[b].Ka) {
          var d = a[b];
          a[b] = function (...e) {
            if (!a[b].Ka.hasOwnProperty(e.length))
              throw new R(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].Ka})!`,
              );
            return a[b].Ka[e.length].apply(this, e);
          };
          a[b].Ka = [];
          a[b].Ka[d.Va] = d;
        }
      },
      fb = (a, b, c) => {
        if (k.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== k[a].Ka && void 0 !== k[a].Ka[c]))
            throw new R(`Cannot register public name '${a}' twice`);
          eb(k, a, a);
          if (k.hasOwnProperty(c))
            throw new R(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          k[a].Ka[c] = b;
        } else (k[a] = b), void 0 !== c && (k[a].vb = c);
      },
      gb = (a) => {
        if (void 0 === a) return '_unknown';
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function hb(a, b, c, d, e, f, h, g) {
      this.name = a;
      this.constructor = b;
      this.Sa = c;
      this.Pa = d;
      this.La = e;
      this.hb = f;
      this.Ua = h;
      this.fb = g;
      this.ob = [];
    }
    var ib = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.Ua) throw new R(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.Ua(a);
        b = b.La;
      }
      return a;
    };
    function jb(a, b) {
      if (null === b) {
        if (this.Ya) throw new R(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Fa) throw new R(`Cannot pass "${kb(b)}" as a ${this.name}`);
      if (!b.Fa.Ha) throw new R(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return ib(b.Fa.Ha, b.Fa.Ia.Ga, this.Ga);
    }
    function lb(a, b) {
      if (null === b) {
        if (this.Ya) throw new R(`null is not a valid ${this.name}`);
        if (this.Xa) {
          var c = this.Za();
          null !== a && a.push(this.Pa, c);
          return c;
        }
        return 0;
      }
      if (!b || !b.Fa) throw new R(`Cannot pass "${kb(b)}" as a ${this.name}`);
      if (!b.Fa.Ha) throw new R(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.Wa && b.Fa.Ia.Wa)
        throw new R(
          `Cannot convert argument of type ${b.Fa.Ma ? b.Fa.Ma.name : b.Fa.Ia.name} to parameter type ${this.name}`,
        );
      c = ib(b.Fa.Ha, b.Fa.Ia.Ga, this.Ga);
      if (this.Xa) {
        if (void 0 === b.Fa.Ja) throw new R('Passing raw pointer to smart pointer is illegal');
        switch (this.tb) {
          case 0:
            if (b.Fa.Ma === this) c = b.Fa.Ja;
            else
              throw new R(
                `Cannot convert argument of type ${b.Fa.Ma ? b.Fa.Ma.name : b.Fa.Ia.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            c = b.Fa.Ja;
            break;
          case 2:
            if (b.Fa.Ma === this) c = b.Fa.Ja;
            else {
              var d = b.clone();
              c = this.pb(
                c,
                mb(() => d['delete']()),
              );
              null !== a && a.push(this.Pa, c);
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
        if (this.Ya) throw new R(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Fa) throw new R(`Cannot pass "${kb(b)}" as a ${this.name}`);
      if (!b.Fa.Ha) throw new R(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.Fa.Ia.Wa) throw new R(`Cannot convert argument of type ${b.Fa.Ia.name} to parameter type ${this.name}`);
      return ib(b.Fa.Ha, b.Fa.Ia.Ga, this.Ga);
    }
    function ob(a, b, c, d, e, f, h, g, l, m, n) {
      this.name = a;
      this.Ga = b;
      this.Ya = c;
      this.Wa = d;
      this.Xa = e;
      this.nb = f;
      this.tb = h;
      this.cb = g;
      this.Za = l;
      this.pb = m;
      this.Pa = n;
      e || void 0 !== b.La ? (this.toWireType = lb) : ((this.toWireType = d ? jb : nb), (this.Oa = null));
    }
    var pb = (a, b, c) => {
        if (!k.hasOwnProperty(a)) throw new Na('Replacing nonexistent public symbol');
        void 0 !== k[a].Ka && void 0 !== c ? (k[a].Ka[c] = b) : ((k[a] = b), (k[a].Va = c));
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
          e[f] || N[f] || (Ma[f] ? Ma[f].forEach(c) : (d.push(f), (e[f] = !0)));
        }
        var d = [],
          e = {};
        b.forEach(c);
        throw new sb(`${a}: ` + d.map(ub).join([', ']));
      },
      wb = (a, b) => {
        for (var c = [], d = 0; d < a; d++) c.push(D[(b + 4 * d) >> 2]);
        return c;
      };
    function xb(a) {
      for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].Oa) return !0;
      return !1;
    }
    function yb(a, b, c, d, e) {
      var f = b.length;
      if (2 > f) throw new R("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var h = null !== b[1] && null !== c,
        g = xb(b),
        l = 'void' !== b[0].name,
        m = f - 2,
        n = Array(m),
        q = [],
        r = [];
      return db(a, function (...A) {
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
            var G = 1 === w ? v : n[w - 2];
            null !== b[w].Oa && b[w].Oa(G);
          }
        v = l ? b[0].fromWireType(A) : void 0;
        return v;
      });
    }
    var zb = (a) => {
        a = a.trim();
        const b = a.indexOf('(');
        return -1 !== b ? a.substr(0, b) : a;
      },
      Ab = [],
      V = [],
      Bb = (a) => {
        9 < a && 0 === --V[a + 1] && ((V[a] = void 0), Ab.push(a));
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
            const b = Ab.pop() || V.length;
            V[b] = a;
            V[b + 1] = 1;
            return b;
        }
      },
      Eb = {
        name: 'emscripten::val',
        fromWireType: (a) => {
          var b = Db(a);
          Bb(a);
          return b;
        },
        toWireType: (a, b) => mb(b),
        Na: 8,
        readValueFromPointer: L,
        Oa: null,
      },
      Fb = (a, b, c) => {
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
      Gb = (a, b) => {
        var c = N[a];
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
      Ib = (a, b, c) => {
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
      Jb = Object.assign({ optional: !0 }, Eb),
      Kb = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Lb = (a, b) => {
        var c = a >> 1;
        for (var d = c + b / 2; !(c >= d) && z[c]; ) ++c;
        c <<= 1;
        if (32 < c - a && Kb) return Kb.decode(x.subarray(a, c));
        c = '';
        for (d = 0; !(d >= b / 2); ++d) {
          var e = y[(a + 2 * d) >> 1];
          if (0 == e) break;
          c += String.fromCharCode(e);
        }
        return c;
      },
      Mb = (a, b, c) => {
        c ??= 2147483647;
        if (2 > c) return 0;
        c -= 2;
        var d = b;
        c = c < 2 * a.length ? c / 2 : a.length;
        for (var e = 0; e < c; ++e) (y[b >> 1] = a.charCodeAt(e)), (b += 2);
        y[b >> 1] = 0;
        return b - d;
      },
      Nb = (a) => 2 * a.length,
      Ob = (a, b) => {
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
      Pb = (a, b, c) => {
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
      Qb = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          b += 4;
        }
        return b;
      },
      Rb = [],
      Sb = (a) => {
        var b = Rb.length;
        Rb.push(a);
        return b;
      },
      Tb = (a, b) => {
        for (var c = Array(a), d = 0; d < a; ++d) c[d] = Gb(D[(b + 4 * d) >> 2], 'parameter ' + d);
        return c;
      },
      Ub = Reflect.construct,
      Vb = {},
      Wb = (a) => {
        if (!(a instanceof Da || 'unwind' == a)) throw a;
      },
      Xb = 0,
      Yb = (a) => {
        na = a;
        Fa || 0 < Xb || (k.onExit?.(a), (ma = !0));
        throw new Da(a);
      },
      Zb = (a) => {
        if (!ma)
          try {
            if ((a(), !(Fa || 0 < Xb)))
              try {
                (na = a = na), Yb(a);
              } catch (b) {
                Wb(b);
              }
          } catch (b) {
            Wb(b);
          }
      },
      $b = {},
      bc = () => {
        if (!ac) {
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
          for (b in $b) void 0 === $b[b] ? delete a[b] : (a[b] = $b[b]);
          var c = [];
          for (b in a) c.push(`${b}=${a[b]}`);
          ac = c;
        }
        return ac;
      },
      ac,
      cc = [null, [], []],
      dc = () => {
        if ('object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
          return (a) => crypto.getRandomValues(a);
        wa('initRandomDevice');
      },
      ec = (a) => (ec = dc())(a);
    Na = k.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    for (var fc = Array(256), gc = 0; 256 > gc; ++gc) fc[gc] = String.fromCharCode(gc);
    Oa = fc;
    R = k.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    Object.assign(cb.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof cb && a instanceof cb)) return !1;
        var b = this.Fa.Ia.Ga,
          c = this.Fa.Ha;
        a.Fa = a.Fa;
        var d = a.Fa.Ia.Ga;
        for (a = a.Fa.Ha; b.La; ) (c = b.Ua(c)), (b = b.La);
        for (; d.La; ) (a = d.Ua(a)), (d = d.La);
        return b === d && c === a;
      },
      clone: function () {
        this.Fa.Ha || Qa(this);
        if (this.Fa.Ta) return (this.Fa.count.value += 1), this;
        var a = ab,
          b = Object,
          c = b.create,
          d = Object.getPrototypeOf(this),
          e = this.Fa;
        a = a(
          c.call(b, d, {
            Fa: { value: { count: e.count, Ra: e.Ra, Ta: e.Ta, Ha: e.Ha, Ia: e.Ia, Ja: e.Ja, Ma: e.Ma } },
          }),
        );
        a.Fa.count.value += 1;
        a.Fa.Ra = !1;
        return a;
      },
      ['delete']() {
        this.Fa.Ha || Qa(this);
        if (this.Fa.Ra && !this.Fa.Ta) throw new R('Object already scheduled for deletion');
        Sa(this);
        var a = this.Fa;
        --a.count.value;
        0 === a.count.value && (a.Ja ? a.Ma.Pa(a.Ja) : a.Ia.Ga.Pa(a.Ha));
        this.Fa.Ta || ((this.Fa.Ja = void 0), (this.Fa.Ha = void 0));
      },
      isDeleted: function () {
        return !this.Fa.Ha;
      },
      deleteLater: function () {
        this.Fa.Ha || Qa(this);
        if (this.Fa.Ra && !this.Fa.Ta) throw new R('Object already scheduled for deletion');
        Wa.push(this);
        1 === Wa.length && Ya && Ya(Xa);
        this.Fa.Ra = !0;
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
      ib(a) {
        this.cb && (a = this.cb(a));
        return a;
      },
      ab(a) {
        this.Pa?.(a);
      },
      Na: 8,
      readValueFromPointer: L,
      fromWireType: function (a) {
        function b() {
          return this.Xa
            ? bb(this.Ga.Sa, { Ia: this.nb, Ha: c, Ma: this, Ja: a })
            : bb(this.Ga.Sa, { Ia: this, Ha: a });
        }
        var c = this.ib(a);
        if (!c) return this.ab(a), null;
        var d = $a(this.Ga, c);
        if (void 0 !== d) {
          if (0 === d.Fa.count.value) return (d.Fa.Ha = c), (d.Fa.Ja = a), d.clone();
          d = d.clone();
          this.ab(a);
          return d;
        }
        d = this.Ga.hb(c);
        d = Va[d];
        if (!d) return b.call(this);
        d = this.Wa ? d.eb : d.pointerType;
        var e = Ta(c, this.Ga, d.Ga);
        return null === e
          ? b.call(this)
          : this.Xa
          ? bb(d.Ga.Sa, { Ia: d, Ha: e, Ma: this, Ja: a })
          : bb(d.Ga.Sa, { Ia: d, Ha: e });
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
    k.count_emval_handles = () => V.length / 2 - 5 - Ab.length;
    var tc = {
        c: (a, b, c, d) => {
          wa(
            `Assertion failed: ${a ? J(x, a) : ''}, at: ` +
              [b ? (b ? J(x, b) : '') : 'unknown filename', c, d ? (d ? J(x, d) : '') : 'unknown function'],
          );
        },
        n: (a, b, c) => {
          var d = new Ha(a);
          D[(d.Ha + 16) >> 2] = 0;
          D[(d.Ha + 4) >> 2] = b;
          D[(d.Ha + 8) >> 2] = c;
          Ia = a;
          Ja++;
          throw Ia;
        },
        Y: () => {},
        X: () => {},
        l: function () {
          return 0;
        },
        V: () => {},
        S: () => {},
        W: function () {
          return 0;
        },
        T: () => {},
        C: function () {},
        Q: () => {},
        U: () => {},
        Z: () => {
          wa('');
        },
        w: (a) => {
          var b = Ka[a];
          delete Ka[a];
          var c = b.Za,
            d = b.Pa,
            e = b.bb,
            f = e.map((h) => h.lb).concat(e.map((h) => h.rb));
          P([a], f, (h) => {
            var g = {};
            e.forEach((l, m) => {
              var n = h[m],
                q = l.jb,
                r = l.kb,
                A = h[m + e.length],
                v = l.qb,
                w = l.sb;
              g[l.gb] = {
                read: (G) => n.fromWireType(q(r, G)),
                write: (G, ja) => {
                  var B = [];
                  v(w, G, A.toWireType(B, ja));
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
                Na: 8,
                readValueFromPointer: L,
                Oa: d,
              },
            ];
          });
        },
        J: () => {},
        da: (a, b, c, d) => {
          b = Q(b);
          O(a, {
            name: b,
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, f) {
              return f ? c : d;
            },
            Na: 8,
            readValueFromPointer: function (e) {
              return this.fromWireType(x[e]);
            },
            Oa: null,
          });
        },
        t: (a, b, c, d, e, f, h, g, l, m, n, q, r) => {
          n = Q(n);
          f = T(e, f);
          g &&= T(h, g);
          m &&= T(l, m);
          r = T(q, r);
          var A = gb(n);
          fb(A, function () {
            vb(`Cannot construct ${n} due to unbound types`, [d]);
          });
          P([a, b, c], d ? [d] : [], (v) => {
            v = v[0];
            if (d) {
              var w = v.Ga;
              var G = w.Sa;
            } else G = cb.prototype;
            v = db(n, function (...Ua) {
              if (Object.getPrototypeOf(this) !== ja) throw new R("Use 'new' to construct " + n);
              if (void 0 === B.Qa) throw new R(n + ' has no accessible constructor');
              var Cb = B.Qa[Ua.length];
              if (void 0 === Cb)
                throw new R(
                  `Tried to invoke ctor of ${n} with invalid number of parameters (${
                    Ua.length
                  }) - expected (${Object.keys(B.Qa).toString()}) parameters instead!`,
                );
              return Cb.apply(this, Ua);
            });
            var ja = Object.create(G, { constructor: { value: v } });
            v.prototype = ja;
            var B = new hb(n, v, ja, r, w, f, g, m);
            if (B.La) {
              var ka;
              (ka = B.La).$a ?? (ka.$a = []);
              B.La.$a.push(B);
            }
            w = new ob(n, B, !0, !1, !1);
            ka = new ob(n + '*', B, !1, !1, !1);
            G = new ob(n + ' const*', B, !1, !0, !1);
            Va[a] = { pointerType: ka, eb: G };
            pb(A, v);
            return [w, ka, G];
          });
        },
        r: (a, b, c, d, e, f) => {
          var h = wb(b, c);
          e = T(d, e);
          P([], [a], (g) => {
            g = g[0];
            var l = `constructor ${g.name}`;
            void 0 === g.Ga.Qa && (g.Ga.Qa = []);
            if (void 0 !== g.Ga.Qa[b - 1])
              throw new R(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  g.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            g.Ga.Qa[b - 1] = () => {
              vb(`Cannot construct ${g.name} due to unbound types`, h);
            };
            P([], h, (m) => {
              m.splice(1, 0, null);
              g.Ga.Qa[b - 1] = yb(l, m, null, e, f);
              return [];
            });
            return [];
          });
        },
        f: (a, b, c, d, e, f, h, g) => {
          var l = wb(c, d);
          b = Q(b);
          b = zb(b);
          f = T(e, f);
          P([], [a], (m) => {
            function n() {
              vb(`Cannot call ${q} due to unbound types`, l);
            }
            m = m[0];
            var q = `${m.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            g && m.Ga.ob.push(b);
            var r = m.Ga.Sa,
              A = r[b];
            void 0 === A || (void 0 === A.Ka && A.className !== m.name && A.Va === c - 2)
              ? ((n.Va = c - 2), (n.className = m.name), (r[b] = n))
              : (eb(r, b, q), (r[b].Ka[c - 2] = n));
            P([], l, (v) => {
              v = yb(q, v, m, f, h);
              void 0 === r[b].Ka ? ((v.Va = c - 2), (r[b] = v)) : (r[b].Ka[c - 2] = v);
              return [];
            });
            return [];
          });
        },
        ca: (a) => O(a, Eb),
        y: (a, b, c, d) => {
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
            Na: 8,
            readValueFromPointer: Fb(b, c, d),
            Oa: null,
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
        D: (a, b, c) => {
          b = Q(b);
          O(a, {
            name: b,
            fromWireType: (d) => d,
            toWireType: (d, e) => e,
            Na: 8,
            readValueFromPointer: Hb(b, c),
            Oa: null,
          });
        },
        F: (a, b, c, d, e, f) => {
          var h = wb(b, c);
          a = Q(a);
          a = zb(a);
          e = T(d, e);
          fb(
            a,
            function () {
              vb(`Cannot call ${a} due to unbound types`, h);
            },
            b - 1,
          );
          P([], h, (g) => {
            pb(a, yb(a, [g[0], null].concat(g.slice(1)), null, e, f), b - 1);
            return [];
          });
        },
        m: (a, b, c, d, e) => {
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
          O(a, { name: b, fromWireType: e, toWireType: h, Na: 8, readValueFromPointer: Ib(b, c, 0 !== d), Oa: null });
        },
        h: (a, b, c) => {
          function d(f) {
            return new e(u.buffer, D[(f + 4) >> 2], D[f >> 2]);
          }
          var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][
            b
          ];
          c = Q(c);
          O(a, { name: c, fromWireType: d, Na: 8, readValueFromPointer: d }, { mb: !0 });
        },
        v: (a) => {
          O(a, Jb);
        },
        ja: (a, b, c, d, e, f, h, g, l, m, n, q) => {
          c = Q(c);
          f = T(e, f);
          g = T(h, g);
          m = T(l, m);
          q = T(n, q);
          P([a], [b], (r) => {
            r = r[0];
            return [new ob(c, r.Ga, !1, !1, !0, r, d, f, g, m, q)];
          });
        },
        E: (a, b) => {
          b = Q(b);
          var c = 'std::string' === b;
          O(a, {
            name: b,
            fromWireType: function (d) {
              var e = D[d >> 2],
                f = d + 4;
              if (c)
                for (var h = f, g = 0; g <= e; ++g) {
                  var l = f + g;
                  if (g == e || 0 == x[l]) {
                    h = h ? J(x, h, l - h) : '';
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
              g = hc(4 + f + 1);
              l = g + 4;
              D[g >> 2] = f;
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
            Na: 8,
            readValueFromPointer: L,
            Oa(d) {
              U(d);
            },
          });
        },
        u: (a, b, c) => {
          c = Q(c);
          if (2 === b) {
            var d = Lb;
            var e = Mb;
            var f = Nb;
            var h = (g) => z[g >> 1];
          } else 4 === b && ((d = Ob), (e = Pb), (f = Qb), (h = (g) => D[g >> 2]));
          O(a, {
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
              if ('string' != typeof l) throw new R(`Cannot pass non-string to C++ string type ${c}`);
              var m = f(l),
                n = hc(4 + m + b);
              D[n >> 2] = m / b;
              e(l, n + 4, m + b);
              null !== g && g.push(U, n);
              return n;
            },
            Na: 8,
            readValueFromPointer: L,
            Oa(g) {
              U(g);
            },
          });
        },
        x: (a, b, c, d, e, f) => {
          Ka[a] = { name: Q(b), Za: T(c, d), Pa: T(e, f), bb: [] };
        },
        j: (a, b, c, d, e, f, h, g, l, m) => {
          Ka[a].bb.push({ gb: Q(b), lb: c, jb: T(d, e), kb: f, rb: h, qb: T(g, l), sb: m });
        },
        ea: (a, b) => {
          b = Q(b);
          O(a, { ub: !0, name: b, Na: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        P: () => {
          Fa = !1;
          Xb = 0;
        },
        K: () => {
          throw Infinity;
        },
        ha: (a, b, c, d) => {
          a = Rb[a];
          b = Db(b);
          return a(null, b, c, d);
        },
        G: Bb,
        ga: (a, b, c) => {
          var d = Tb(a, b),
            e = d.shift();
          a--;
          var f = Array(a);
          b = `methodCaller<(${d.map((h) => h.name).join(', ')}) => ${e.name}>`;
          return Sb(
            db(b, (h, g, l, m) => {
              for (var n = 0, q = 0; q < a; ++q) (f[q] = d[q].readValueFromPointer(m + n)), (n += d[q].Na);
              g = 1 === c ? Ub(g, f) : g.apply(h, f);
              h = [];
              g = e.toWireType(h, g);
              h.length && (D[l >> 2] = mb(h));
              return g;
            }),
          );
        },
        ia: (a) => {
          9 < a && (V[a + 1] += 1);
        },
        fa: (a) => {
          var b = Db(a);
          La(b);
          Bb(a);
        },
        p: (a, b) => {
          a = Gb(a, '_emval_take_value');
          a = a.readValueFromPointer(b);
          return mb(a);
        },
        L: (a, b) => {
          Vb[a] && (clearTimeout(Vb[a].id), delete Vb[a]);
          if (!b) return 0;
          var c = setTimeout(() => {
            delete Vb[a];
            Zb(() => ic(a, performance.now()));
          }, b);
          Vb[a] = { id: c, wb: b };
          return 0;
        },
        M: (a, b, c, d) => {
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
          e < f ? (K(a, c, 17), K(b, d, 17)) : (K(a, d, 17), K(b, c, 17));
        },
        O: () => 2147483648,
        ka: () => performance.now(),
        N: (a) => {
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
        $: (a, b) => {
          var c = 0;
          bc().forEach((d, e) => {
            var f = b + c;
            e = D[(a + 4 * e) >> 2] = f;
            for (f = 0; f < d.length; ++f) u[e++] = d.charCodeAt(f);
            u[e] = 0;
            c += d.length + 1;
          });
          return 0;
        },
        aa: (a, b) => {
          var c = bc();
          D[a >> 2] = c.length;
          var d = 0;
          c.forEach((e) => (d += e.length + 1));
          D[b >> 2] = d;
          return 0;
        },
        s: () => 52,
        R: (a, b) => {
          var c = 0;
          if (0 == a) c = 2;
          else if (1 == a || 2 == a) c = 64;
          u[b] = 2;
          y[(b + 2) >> 1] = 1;
          I = [
            c >>> 0,
            ((H = c),
            1 <= +Math.abs(H)
              ? 0 < H
                ? +Math.floor(H / 4294967296) >>> 0
                : ~~+Math.ceil((H - +(~~H >>> 0)) / 4294967296) >>> 0
              : 0),
          ];
          C[(b + 8) >> 2] = I[0];
          C[(b + 12) >> 2] = I[1];
          I = [
            0,
            ((H = 0),
            1 <= +Math.abs(H)
              ? 0 < H
                ? +Math.floor(H / 4294967296) >>> 0
                : ~~+Math.ceil((H - +(~~H >>> 0)) / 4294967296) >>> 0
              : 0),
          ];
          C[(b + 16) >> 2] = I[0];
          C[(b + 20) >> 2] = I[1];
          return 0;
        },
        B: () => 52,
        I: function () {
          return 70;
        },
        A: (a, b, c, d) => {
          for (var e = 0, f = 0; f < c; f++) {
            var h = D[b >> 2],
              g = D[(b + 4) >> 2];
            b += 8;
            for (var l = 0; l < g; l++) {
              var m = a,
                n = x[h + l],
                q = cc[m];
              0 === n || 10 === n ? ((1 === m ? ha : t)(J(q, 0)), (q.length = 0)) : q.push(n);
            }
            e += g;
          }
          D[d >> 2] = e;
          return 0;
        },
        ba: (a, b) => {
          ec(x.subarray(a, a + b));
          return 0;
        },
        i: jc,
        d: kc,
        e: lc,
        q: mc,
        z: nc,
        b: oc,
        a: pc,
        g: qc,
        o: rc,
        H: sc,
        _: Yb,
      },
      W = (function () {
        function a(c) {
          W = c.exports;
          la = W.la;
          qa();
          S = W.pa;
          sa.unshift(W.ma);
          E--;
          k.monitorRunDependencies?.(E);
          0 == E && (null !== va && (clearInterval(va), (va = null)), F && ((c = F), (F = null), c()));
          return W;
        }
        var b = { a: tc };
        E++;
        k.monitorRunDependencies?.(E);
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
      hc = (a) => (hc = W.na)(a),
      tb = (a) => (tb = W.oa)(a),
      U = (a) => (U = W.qa)(a),
      ic = (a, b) => (ic = W.ra)(a, b),
      X = (a, b) => (X = W.sa)(a, b),
      Y = (a) => (Y = W.ta)(a),
      Z = () => (Z = W.ua)();
    k.dynCall_iijj = (a, b, c, d, e, f) => (k.dynCall_iijj = W.va)(a, b, c, d, e, f);
    k.dynCall_vijj = (a, b, c, d, e, f) => (k.dynCall_vijj = W.wa)(a, b, c, d, e, f);
    k.dynCall_jiii = (a, b, c, d) => (k.dynCall_jiii = W.xa)(a, b, c, d);
    k.dynCall_jii = (a, b, c) => (k.dynCall_jii = W.ya)(a, b, c);
    var uc = (k.dynCall_vijjj = (a, b, c, d, e, f, h, g) => (uc = k.dynCall_vijjj = W.za)(a, b, c, d, e, f, h, g));
    k.dynCall_jiji = (a, b, c, d, e) => (k.dynCall_jiji = W.Aa)(a, b, c, d, e);
    k.dynCall_viijii = (a, b, c, d, e, f, h) => (k.dynCall_viijii = W.Ba)(a, b, c, d, e, f, h);
    k.dynCall_iiiiij = (a, b, c, d, e, f, h) => (k.dynCall_iiiiij = W.Ca)(a, b, c, d, e, f, h);
    k.dynCall_iiiiijj = (a, b, c, d, e, f, h, g, l) => (k.dynCall_iiiiijj = W.Da)(a, b, c, d, e, f, h, g, l);
    k.dynCall_iiiiiijj = (a, b, c, d, e, f, h, g, l, m) => (k.dynCall_iiiiiijj = W.Ea)(a, b, c, d, e, f, h, g, l, m);
    function oc(a, b) {
      var c = Z();
      try {
        S.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function pc(a, b, c) {
      var d = Z();
      try {
        S.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function lc(a, b, c, d) {
      var e = Z();
      try {
        return S.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function kc(a, b, c) {
      var d = Z();
      try {
        return S.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function jc(a, b) {
      var c = Z();
      try {
        return S.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
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
    function rc(a, b, c, d, e) {
      var f = Z();
      try {
        S.get(a)(b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function qc(a, b, c, d) {
      var e = Z();
      try {
        S.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function nc(a) {
      var b = Z();
      try {
        S.get(a)();
      } catch (c) {
        Y(b);
        if (c !== c + 0) throw c;
        X(1, 0);
      }
    }
    function sc(a, b, c, d, e, f, h, g) {
      var l = Z();
      try {
        uc(a, b, c, d, e, f, h, g);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    var vc;
    F = function wc() {
      vc || xc();
      vc || (F = wc);
    };
    function xc() {
      function a() {
        if (!vc && ((vc = !0), (k.calledRun = !0), !ma)) {
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
      if (!(0 < E)) {
        if (k.preRun) for ('function' == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; ) ua();
        Ea(ra);
        0 < E ||
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
    xc();
    moduleRtn = ca;

    return moduleRtn;
  };
})();
export default createDotLottiePlayerModule;
