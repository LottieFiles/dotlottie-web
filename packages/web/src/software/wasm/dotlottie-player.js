var createDotLottiePlayerModule = (() => {
  var _scriptName = typeof document != 'undefined' ? document.currentScript?.src : undefined;

  return function (moduleArg = {}) {
    var moduleRtn;

    var g = moduleArg,
      aa,
      ba,
      ca = new Promise((a, b) => {
        aa = a;
        ba = b;
      }),
      da = Object.assign({}, g),
      ea = './this.program',
      n = '',
      ia;
    'undefined' != typeof document && document.currentScript && (n = document.currentScript.src);
    _scriptName && (n = _scriptName);
    n.startsWith('blob:') ? (n = '') : (n = n.substr(0, n.replace(/[?#].*/, '').lastIndexOf('/') + 1));
    ia = (a) =>
      fetch(a, { credentials: 'same-origin' }).then((b) =>
        b.ok ? b.arrayBuffer() : Promise.reject(Error(b.status + ' : ' + b.url)),
      );
    var ja = g.print || console.log.bind(console),
      q = g.printErr || console.error.bind(console);
    Object.assign(g, da);
    da = null;
    g.thisProgram && (ea = g.thisProgram);
    var ka = g.wasmBinary,
      la,
      r = !1,
      ma,
      t,
      v,
      x,
      A,
      B,
      C,
      na,
      oa;
    function pa() {
      var a = la.buffer;
      g.HEAP8 = t = new Int8Array(a);
      g.HEAP16 = x = new Int16Array(a);
      g.HEAPU8 = v = new Uint8Array(a);
      g.HEAPU16 = A = new Uint16Array(a);
      g.HEAP32 = B = new Int32Array(a);
      g.HEAPU32 = C = new Uint32Array(a);
      g.HEAPF32 = na = new Float32Array(a);
      g.HEAPF64 = oa = new Float64Array(a);
    }
    var qa = [],
      ra = [],
      sa = [];
    function ta() {
      var a = g.preRun.shift();
      qa.unshift(a);
    }
    var F = 0,
      ua = null,
      H = null;
    function va(a) {
      g.onAbort?.(a);
      a = 'Aborted(' + a + ')';
      q(a);
      r = !0;
      a = new WebAssembly.RuntimeError(a + '. Build with -sASSERTIONS for more info.');
      ba(a);
      throw a;
    }
    var wa = (a) => a.startsWith('data:application/octet-stream;base64,'),
      xa;
    function ya(a) {
      if (a == xa && ka) return new Uint8Array(ka);
      throw 'both async and sync fetching of the wasm failed';
    }
    function za(a) {
      return ka
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
          q(`failed to asynchronously prepare wasm: ${d}`);
          va(d);
        });
    }
    function Ba(a, b) {
      var c = xa;
      return ka || 'function' != typeof WebAssembly.instantiateStreaming || wa(c) || 'function' != typeof fetch
        ? Aa(c, a, b)
        : fetch(c, { credentials: 'same-origin' }).then((d) =>
            WebAssembly.instantiateStreaming(d, a).then(b, function (e) {
              q(`wasm streaming compile failed: ${e}`);
              q('falling back to ArrayBuffer instantiation');
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
        for (; 0 < a.length; ) a.shift()(g);
      },
      Ea = g.noExitRuntime || !0,
      Fa = 'undefined' != typeof TextDecoder ? new TextDecoder() : void 0,
      I = (a, b = 0, c = NaN) => {
        var d = b + c;
        for (c = b; a[c] && !(c >= d); ) ++c;
        if (16 < c - b && a.buffer && Fa) return Fa.decode(a.subarray(b, c));
        for (d = ''; b < c; ) {
          var e = a[b++];
          if (e & 128) {
            var f = a[b++] & 63;
            if (192 == (e & 224)) d += String.fromCharCode(((e & 31) << 6) | f);
            else {
              var k = a[b++] & 63;
              e =
                224 == (e & 240)
                  ? ((e & 15) << 12) | (f << 6) | k
                  : ((e & 7) << 18) | (f << 12) | (k << 6) | (a[b++] & 63);
              65536 > e
                ? (d += String.fromCharCode(e))
                : ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))));
            }
          } else d += String.fromCharCode(e);
        }
        return d;
      },
      Ga = [],
      Ha = 0,
      J = 0;
    class Ia {
      constructor(a) {
        this.Hc = a;
        this.hc = a - 24;
      }
    }
    var Ka = (a) => {
        var b = J;
        if (!b) return K(0), 0;
        var c = new Ia(b);
        C[(c.hc + 16) >> 2] = b;
        var d = C[(c.hc + 4) >> 2];
        if (!d) return K(0), b;
        for (var e of a) {
          if (0 === e || e === d) break;
          if (Ja(e, d, c.hc + 16)) return K(e), b;
        }
        K(d);
        return b;
      },
      L = (a, b, c) => {
        var d = v;
        if (0 < c) {
          c = b + c - 1;
          for (var e = 0; e < a.length; ++e) {
            var f = a.charCodeAt(e);
            if (55296 <= f && 57343 >= f) {
              var k = a.charCodeAt(++e);
              f = (65536 + ((f & 1023) << 10)) | (k & 1023);
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
    function M(a) {
      return this.fromWireType(C[a >> 2]);
    }
    var N = {},
      O = {},
      Na = {},
      Oa,
      Q = (a, b, c) => {
        function d(h) {
          h = c(h);
          if (h.length !== a.length) throw new Oa('Mismatched type converter count');
          for (var l = 0; l < a.length; ++l) P(a[l], h[l]);
        }
        a.forEach((h) => (Na[h] = b));
        var e = Array(b.length),
          f = [],
          k = 0;
        b.forEach((h, l) => {
          O.hasOwnProperty(h)
            ? (e[l] = O[h])
            : (f.push(h),
              N.hasOwnProperty(h) || (N[h] = []),
              N[h].push(() => {
                e[l] = O[h];
                ++k;
                k === f.length && d(e);
              }));
        });
        0 === f.length && d(e);
      },
      Pa,
      R = (a) => {
        for (var b = ''; v[a]; ) b += Pa[v[a++]];
        return b;
      },
      S;
    function Ra(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new S(`type "${d}" must have a positive integer typeid pointer`);
      if (O.hasOwnProperty(a)) {
        if (c.Oc) return;
        throw new S(`Cannot register type '${d}' twice`);
      }
      O[a] = b;
      delete Na[a];
      N.hasOwnProperty(a) && ((b = N[a]), delete N[a], b.forEach((e) => e()));
    }
    function P(a, b, c = {}) {
      return Ra(a, b, c);
    }
    var Sa = (a) => {
        throw new S(a.Ua.jc.ic.name + ' instance already deleted');
      },
      Ta = !1,
      Ua = () => {},
      Va = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.mc) return null;
        a = Va(a, b, c.mc);
        return null === a ? null : c.Gc(a);
      },
      Wa = {},
      Xa = {},
      Ya = (a, b) => {
        if (void 0 === b) throw new S('ptr should not be undefined');
        for (; a.mc; ) (b = a.wc(b)), (a = a.mc);
        return Xa[b];
      },
      $a = (a, b) => {
        if (!b.jc || !b.hc) throw new Oa('makeClassHandle requires ptr and ptrType');
        if (!!b.nc !== !!b.lc) throw new Oa('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return Za(Object.create(a, { Ua: { value: b, writable: !0 } }));
      },
      Za = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (Za = (b) => b), a;
        Ta = new FinalizationRegistry((b) => {
          b = b.Ua;
          --b.count.value;
          0 === b.count.value && (b.lc ? b.nc.qc(b.lc) : b.jc.ic.qc(b.hc));
        });
        Za = (b) => {
          var c = b.Ua;
          c.lc && Ta.register(b, { Ua: c }, b);
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
        if (void 0 === a[b].kc) {
          var d = a[b];
          a[b] = function (...e) {
            if (!a[b].kc.hasOwnProperty(e.length))
              throw new S(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].kc})!`,
              );
            return a[b].kc[e.length].apply(this, e);
          };
          a[b].kc = [];
          a[b].kc[d.tc] = d;
        }
      },
      eb = (a, b, c) => {
        if (g.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== g[a].kc && void 0 !== g[a].kc[c]))
            throw new S(`Cannot register public name '${a}' twice`);
          db(g, a, a);
          if (g[a].kc.hasOwnProperty(c))
            throw new S(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          g[a].kc[c] = b;
        } else (g[a] = b), (g[a].tc = c);
      },
      fb = (a) => {
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function gb(a, b, c, d, e, f, k, h) {
      this.name = a;
      this.constructor = b;
      this.sc = c;
      this.qc = d;
      this.mc = e;
      this.Jc = f;
      this.wc = k;
      this.Gc = h;
      this.Qc = [];
    }
    var hb = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.wc) throw new S(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.wc(a);
        b = b.mc;
      }
      return a;
    };
    function ib(a, b) {
      if (null === b) {
        if (this.zc) throw new S(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Ua) throw new S(`Cannot pass "${jb(b)}" as a ${this.name}`);
      if (!b.Ua.hc) throw new S(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return hb(b.Ua.hc, b.Ua.jc.ic, this.ic);
    }
    function kb(a, b) {
      if (null === b) {
        if (this.zc) throw new S(`null is not a valid ${this.name}`);
        if (this.yc) {
          var c = this.Ac();
          null !== a && a.push(this.qc, c);
          return c;
        }
        return 0;
      }
      if (!b || !b.Ua) throw new S(`Cannot pass "${jb(b)}" as a ${this.name}`);
      if (!b.Ua.hc) throw new S(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.xc && b.Ua.jc.xc)
        throw new S(
          `Cannot convert argument of type ${b.Ua.nc ? b.Ua.nc.name : b.Ua.jc.name} to parameter type ${this.name}`,
        );
      c = hb(b.Ua.hc, b.Ua.jc.ic, this.ic);
      if (this.yc) {
        if (void 0 === b.Ua.lc) throw new S('Passing raw pointer to smart pointer is illegal');
        switch (this.Vc) {
          case 0:
            if (b.Ua.nc === this) c = b.Ua.lc;
            else
              throw new S(
                `Cannot convert argument of type ${b.Ua.nc ? b.Ua.nc.name : b.Ua.jc.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            c = b.Ua.lc;
            break;
          case 2:
            if (b.Ua.nc === this) c = b.Ua.lc;
            else {
              var d = b.clone();
              c = this.Rc(
                c,
                lb(() => d['delete']()),
              );
              null !== a && a.push(this.qc, c);
            }
            break;
          default:
            throw new S('Unsupporting sharing policy');
        }
      }
      return c;
    }
    function mb(a, b) {
      if (null === b) {
        if (this.zc) throw new S(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Ua) throw new S(`Cannot pass "${jb(b)}" as a ${this.name}`);
      if (!b.Ua.hc) throw new S(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.Ua.jc.xc) throw new S(`Cannot convert argument of type ${b.Ua.jc.name} to parameter type ${this.name}`);
      return hb(b.Ua.hc, b.Ua.jc.ic, this.ic);
    }
    function nb(a, b, c, d, e, f, k, h, l, m, p) {
      this.name = a;
      this.ic = b;
      this.zc = c;
      this.xc = d;
      this.yc = e;
      this.Pc = f;
      this.Vc = k;
      this.Ec = h;
      this.Ac = l;
      this.Rc = m;
      this.qc = p;
      e || void 0 !== b.mc ? (this.toWireType = kb) : ((this.toWireType = d ? ib : mb), (this.pc = null));
    }
    var ob = (a, b, c) => {
        if (!g.hasOwnProperty(a)) throw new Oa('Replacing nonexistent public symbol');
        void 0 !== g[a].kc && void 0 !== c ? (g[a].kc[c] = b) : ((g[a] = b), (g[a].tc = c));
      },
      pb = (a, b, c = []) => {
        a = a.replace(/p/g, 'i');
        return (0, g['dynCall_' + a])(b, ...c);
      },
      qb =
        (a, b) =>
        (...c) =>
          pb(a, b, c),
      T = (a, b) => {
        a = R(a);
        var c = qb(a, b);
        if ('function' != typeof c) throw new S(`unknown function pointer with signature ${a}: ${b}`);
        return c;
      },
      rb,
      tb = (a) => {
        a = sb(a);
        var b = R(a);
        U(a);
        return b;
      },
      ub = (a, b) => {
        function c(f) {
          e[f] || O[f] || (Na[f] ? Na[f].forEach(c) : (d.push(f), (e[f] = !0)));
        }
        var d = [],
          e = {};
        b.forEach(c);
        throw new rb(`${a}: ` + d.map(tb).join([', ']));
      },
      vb = (a, b) => {
        for (var c = [], d = 0; d < a; d++) c.push(C[(b + 4 * d) >> 2]);
        return c;
      };
    function wb(a) {
      for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].pc) return !0;
      return !1;
    }
    var xb = (a) => {
        if (!(a instanceof Ca || 'unwind' == a)) throw a;
      },
      yb = 0,
      zb = (a) => {
        ma = a;
        Ea || 0 < yb || (g.onExit?.(a), (r = !0));
        throw new Ca(a);
      },
      Ab = (a) => {
        if (!r)
          try {
            if ((a(), !(Ea || 0 < yb)))
              try {
                (ma = a = ma), zb(a);
              } catch (b) {
                xb(b);
              }
          } catch (b) {
            xb(b);
          }
      };
    function Bb() {
      var a = V,
        b = {};
      for (let [c, d] of Object.entries(a))
        b[c] =
          'function' == typeof d
            ? (...e) => {
                Cb.push(c);
                try {
                  return d(...e);
                } finally {
                  r || Cb.pop();
                }
              }
            : d;
      return b;
    }
    var Cb = [];
    function Db(a, b, c, d, e) {
      var f = b.length;
      if (2 > f) throw new S("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var k = null !== b[1] && null !== c,
        h = wb(b),
        l = 'void' !== b[0].name,
        m = f - 2,
        p = Array(m),
        u = [],
        w = [];
      return cb(a, function (...D) {
        w.length = 0;
        u.length = k ? 2 : 1;
        u[0] = e;
        if (k) {
          var y = b[1].toWireType(w, this);
          u[1] = y;
        }
        for (var z = 0; z < m; ++z) (p[z] = b[z + 2].toWireType(w, D[z])), u.push(p[z]);
        D = d(...u);
        if (h) Ma(w);
        else
          for (z = k ? 1 : 2; z < b.length; z++) {
            var G = 1 === z ? y : p[z - 2];
            null !== b[z].pc && b[z].pc(G);
          }
        y = l ? b[0].fromWireType(D) : void 0;
        return y;
      });
    }
    var Eb = (a) => {
        a = a.trim();
        const b = a.indexOf('(');
        return -1 !== b ? a.substr(0, b) : a;
      },
      Gb = [],
      W = [],
      Hb = (a) => {
        9 < a && 0 === --W[a + 1] && ((W[a] = void 0), Gb.push(a));
      },
      Ib = (a) => {
        if (!a) throw new S('Cannot use deleted val. handle = ' + a);
        return W[a];
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
            const b = Gb.pop() || W.length;
            W[b] = a;
            W[b + 1] = 1;
            return b;
        }
      },
      Jb = {
        name: 'emscripten::val',
        fromWireType: (a) => {
          var b = Ib(a);
          Hb(a);
          return b;
        },
        toWireType: (a, b) => lb(b),
        oc: 8,
        readValueFromPointer: M,
        pc: null,
      },
      Kb = (a, b, c) => {
        switch (b) {
          case 1:
            return c
              ? function (d) {
                  return this.fromWireType(t[d]);
                }
              : function (d) {
                  return this.fromWireType(v[d]);
                };
          case 2:
            return c
              ? function (d) {
                  return this.fromWireType(x[d >> 1]);
                }
              : function (d) {
                  return this.fromWireType(A[d >> 1]);
                };
          case 4:
            return c
              ? function (d) {
                  return this.fromWireType(B[d >> 2]);
                }
              : function (d) {
                  return this.fromWireType(C[d >> 2]);
                };
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Lb = (a, b) => {
        var c = O[a];
        if (void 0 === c) throw ((a = `${b} has unknown type ${tb(a)}`), new S(a));
        return c;
      },
      jb = (a) => {
        if (null === a) return 'null';
        var b = typeof a;
        return 'object' === b || 'array' === b || 'function' === b ? a.toString() : '' + a;
      },
      Mb = (a, b) => {
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
      Nb = (a, b, c) => {
        switch (b) {
          case 1:
            return c ? (d) => t[d] : (d) => v[d];
          case 2:
            return c ? (d) => x[d >> 1] : (d) => A[d >> 1];
          case 4:
            return c ? (d) => B[d >> 2] : (d) => C[d >> 2];
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Ob = Object.assign({ optional: !0 }, Jb),
      Pb = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Qb = (a, b) => {
        var c = a >> 1;
        for (var d = c + b / 2; !(c >= d) && A[c]; ) ++c;
        c <<= 1;
        if (32 < c - a && Pb) return Pb.decode(v.subarray(a, c));
        c = '';
        for (d = 0; !(d >= b / 2); ++d) {
          var e = x[(a + 2 * d) >> 1];
          if (0 == e) break;
          c += String.fromCharCode(e);
        }
        return c;
      },
      Rb = (a, b, c) => {
        c ??= 2147483647;
        if (2 > c) return 0;
        c -= 2;
        var d = b;
        c = c < 2 * a.length ? c / 2 : a.length;
        for (var e = 0; e < c; ++e) (x[b >> 1] = a.charCodeAt(e)), (b += 2);
        x[b >> 1] = 0;
        return b - d;
      },
      Sb = (a) => 2 * a.length,
      Tb = (a, b) => {
        for (var c = 0, d = ''; !(c >= b / 4); ) {
          var e = B[(a + 4 * c) >> 2];
          if (0 == e) break;
          ++c;
          65536 <= e
            ? ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))))
            : (d += String.fromCharCode(e));
        }
        return d;
      },
      Ub = (a, b, c) => {
        c ??= 2147483647;
        if (4 > c) return 0;
        var d = b;
        c = d + c - 4;
        for (var e = 0; e < a.length; ++e) {
          var f = a.charCodeAt(e);
          if (55296 <= f && 57343 >= f) {
            var k = a.charCodeAt(++e);
            f = (65536 + ((f & 1023) << 10)) | (k & 1023);
          }
          B[b >> 2] = f;
          b += 4;
          if (b + 4 > c) break;
        }
        B[b >> 2] = 0;
        return b - d;
      },
      Vb = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          b += 4;
        }
        return b;
      },
      Wb = [],
      Xb = (a) => {
        var b = Wb.length;
        Wb.push(a);
        return b;
      },
      Yb = (a, b) => {
        for (var c = Array(a), d = 0; d < a; ++d) c[d] = Lb(C[(b + 4 * d) >> 2], 'parameter ' + d);
        return c;
      },
      Zb = Reflect.construct,
      $b = {},
      ac = {},
      cc = () => {
        if (!bc) {
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
          for (b in ac) void 0 === ac[b] ? delete a[b] : (a[b] = ac[b]);
          var c = [];
          for (b in a) c.push(`${b}=${a[b]}`);
          bc = c;
        }
        return bc;
      },
      bc,
      dc = [null, [], []],
      ec = () => {
        if ('object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
          return (a) => crypto.getRandomValues(a);
        va('initRandomDevice');
      },
      fc = (a) => (fc = ec())(a);
    Oa = g.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    for (var gc = Array(256), hc = 0; 256 > hc; ++hc) gc[hc] = String.fromCharCode(hc);
    Pa = gc;
    S = g.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    Object.assign(bb.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof bb && a instanceof bb)) return !1;
        var b = this.Ua.jc.ic,
          c = this.Ua.hc;
        a.Ua = a.Ua;
        var d = a.Ua.jc.ic;
        for (a = a.Ua.hc; b.mc; ) (c = b.wc(c)), (b = b.mc);
        for (; d.mc; ) (a = d.wc(a)), (d = d.mc);
        return b === d && c === a;
      },
      clone: function () {
        this.Ua.hc || Sa(this);
        if (this.Ua.vc) return (this.Ua.count.value += 1), this;
        var a = Za,
          b = Object,
          c = b.create,
          d = Object.getPrototypeOf(this),
          e = this.Ua;
        a = a(
          c.call(b, d, {
            Ua: { value: { count: e.count, uc: e.uc, vc: e.vc, hc: e.hc, jc: e.jc, lc: e.lc, nc: e.nc } },
          }),
        );
        a.Ua.count.value += 1;
        a.Ua.uc = !1;
        return a;
      },
      ['delete']() {
        this.Ua.hc || Sa(this);
        if (this.Ua.uc && !this.Ua.vc) throw new S('Object already scheduled for deletion');
        Ua(this);
        var a = this.Ua;
        --a.count.value;
        0 === a.count.value && (a.lc ? a.nc.qc(a.lc) : a.jc.ic.qc(a.hc));
        this.Ua.vc || ((this.Ua.lc = void 0), (this.Ua.hc = void 0));
      },
      isDeleted: function () {
        return !this.Ua.hc;
      },
      deleteLater: function () {
        this.Ua.hc || Sa(this);
        if (this.Ua.uc && !this.Ua.vc) throw new S('Object already scheduled for deletion');
        ab.push(this);
        this.Ua.uc = !0;
        return this;
      },
    });
    Object.assign(nb.prototype, {
      Kc(a) {
        this.Ec && (a = this.Ec(a));
        return a;
      },
      Cc(a) {
        this.qc?.(a);
      },
      oc: 8,
      readValueFromPointer: M,
      fromWireType: function (a) {
        function b() {
          return this.yc
            ? $a(this.ic.sc, { jc: this.Pc, hc: c, nc: this, lc: a })
            : $a(this.ic.sc, { jc: this, hc: a });
        }
        var c = this.Kc(a);
        if (!c) return this.Cc(a), null;
        var d = Ya(this.ic, c);
        if (void 0 !== d) {
          if (0 === d.Ua.count.value) return (d.Ua.hc = c), (d.Ua.lc = a), d.clone();
          d = d.clone();
          this.Cc(a);
          return d;
        }
        d = this.ic.Jc(c);
        d = Wa[d];
        if (!d) return b.call(this);
        d = this.xc ? d.Fc : d.pointerType;
        var e = Va(c, this.ic, d.ic);
        return null === e
          ? b.call(this)
          : this.yc
          ? $a(d.ic.sc, { jc: d, hc: e, nc: this, lc: a })
          : $a(d.ic.sc, { jc: d, hc: e });
      },
    });
    rb = g.UnboundTypeError = ((a, b) => {
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
    W.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1);
    g.count_emval_handles = () => W.length / 2 - 5 - Gb.length;
    var dd = {
        l: (a, b, c, d) =>
          va(
            `Assertion failed: ${a ? I(v, a) : ''}, at: ` +
              [b ? (b ? I(v, b) : '') : 'unknown filename', c, d ? (d ? I(v, d) : '') : 'unknown function'],
          ),
        Aa: (a) => {
          var b = new Ia(a);
          0 == t[b.hc + 12] && ((t[b.hc + 12] = 1), Ha--);
          t[b.hc + 13] = 0;
          Ga.push(b);
          ic(a);
          return jc(a);
        },
        za: () => {
          X(0, 0);
          var a = Ga.pop();
          kc(a.Hc);
          J = 0;
        },
        b: () => Ka([]),
        n: (a, b) => Ka([a, b]),
        u: (a, b, c) => {
          var d = new Ia(a);
          C[(d.hc + 16) >> 2] = 0;
          C[(d.hc + 4) >> 2] = b;
          C[(d.hc + 8) >> 2] = c;
          J = a;
          Ha++;
          throw J;
        },
        d: (a) => {
          J ||= a;
          throw J;
        },
        qa: () => {},
        na: () => {},
        oa: () => {},
        ta: function () {},
        va: () => va(''),
        J: (a) => {
          var b = La[a];
          delete La[a];
          var c = b.Ac,
            d = b.qc,
            e = b.Dc,
            f = e.map((k) => k.Nc).concat(e.map((k) => k.Tc));
          Q([a], f, (k) => {
            var h = {};
            e.forEach((l, m) => {
              var p = k[m],
                u = l.Lc,
                w = l.Mc,
                D = k[m + e.length],
                y = l.Sc,
                z = l.Uc;
              h[l.Ic] = {
                read: (G) => p.fromWireType(u(w, G)),
                write: (G, fa) => {
                  var E = [];
                  y(z, G, D.toWireType(E, fa));
                  Ma(E);
                },
              };
            });
            return [
              {
                name: b.name,
                fromWireType: (l) => {
                  var m = {},
                    p;
                  for (p in h) m[p] = h[p].read(l);
                  d(l);
                  return m;
                },
                toWireType: (l, m) => {
                  for (var p in h) if (!(p in m)) throw new TypeError(`Missing field: "${p}"`);
                  var u = c();
                  for (p in h) h[p].write(u, m[p]);
                  null !== l && l.push(d, u);
                  return u;
                },
                oc: 8,
                readValueFromPointer: M,
                pc: d,
              },
            ];
          });
        },
        ga: () => {},
        Ha: (a, b, c, d) => {
          b = R(b);
          P(a, {
            name: b,
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, f) {
              return f ? c : d;
            },
            oc: 8,
            readValueFromPointer: function (e) {
              return this.fromWireType(v[e]);
            },
            pc: null,
          });
        },
        E: (a, b, c, d, e, f, k, h, l, m, p, u, w) => {
          p = R(p);
          f = T(e, f);
          h &&= T(k, h);
          m &&= T(l, m);
          w = T(u, w);
          var D = fb(p);
          eb(D, function () {
            ub(`Cannot construct ${p} due to unbound types`, [d]);
          });
          Q([a, b, c], d ? [d] : [], (y) => {
            y = y[0];
            if (d) {
              var z = y.ic;
              var G = z.sc;
            } else G = bb.prototype;
            y = cb(p, function (...Qa) {
              if (Object.getPrototypeOf(this) !== fa) throw new S("Use 'new' to construct " + p);
              if (void 0 === E.rc) throw new S(p + ' has no accessible constructor');
              var Fb = E.rc[Qa.length];
              if (void 0 === Fb)
                throw new S(
                  `Tried to invoke ctor of ${p} with invalid number of parameters (${
                    Qa.length
                  }) - expected (${Object.keys(E.rc).toString()}) parameters instead!`,
                );
              return Fb.apply(this, Qa);
            });
            var fa = Object.create(G, { constructor: { value: y } });
            y.prototype = fa;
            var E = new gb(p, y, fa, w, z, f, h, m);
            if (E.mc) {
              var ha;
              (ha = E.mc).Bc ?? (ha.Bc = []);
              E.mc.Bc.push(E);
            }
            z = new nb(p, E, !0, !1, !1);
            ha = new nb(p + '*', E, !1, !1, !1);
            G = new nb(p + ' const*', E, !1, !0, !1);
            Wa[a] = { pointerType: ha, Fc: G };
            ob(D, y);
            return [z, ha, G];
          });
        },
        D: (a, b, c, d, e, f) => {
          var k = vb(b, c);
          e = T(d, e);
          Q([], [a], (h) => {
            h = h[0];
            var l = `constructor ${h.name}`;
            void 0 === h.ic.rc && (h.ic.rc = []);
            if (void 0 !== h.ic.rc[b - 1])
              throw new S(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  h.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            h.ic.rc[b - 1] = () => {
              ub(`Cannot construct ${h.name} due to unbound types`, k);
            };
            Q([], k, (m) => {
              m.splice(1, 0, null);
              h.ic.rc[b - 1] = Db(l, m, null, e, f);
              return [];
            });
            return [];
          });
        },
        m: (a, b, c, d, e, f, k, h) => {
          var l = vb(c, d);
          b = R(b);
          b = Eb(b);
          f = T(e, f);
          Q([], [a], (m) => {
            function p() {
              ub(`Cannot call ${u} due to unbound types`, l);
            }
            m = m[0];
            var u = `${m.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            h && m.ic.Qc.push(b);
            var w = m.ic.sc,
              D = w[b];
            void 0 === D || (void 0 === D.kc && D.className !== m.name && D.tc === c - 2)
              ? ((p.tc = c - 2), (p.className = m.name), (w[b] = p))
              : (db(w, b, u), (w[b].kc[c - 2] = p));
            Q([], l, (y) => {
              y = Db(u, y, m, f, k);
              void 0 === w[b].kc ? ((y.tc = c - 2), (w[b] = y)) : (w[b].kc[c - 2] = y);
              return [];
            });
            return [];
          });
        },
        Ga: (a) => P(a, Jb),
        F: (a, b, c, d) => {
          function e() {}
          b = R(b);
          e.values = {};
          P(a, {
            name: b,
            constructor: e,
            fromWireType: function (f) {
              return this.constructor.values[f];
            },
            toWireType: (f, k) => k.value,
            oc: 8,
            readValueFromPointer: Kb(b, c, d),
            pc: null,
          });
          eb(b, e);
        },
        s: (a, b, c) => {
          var d = Lb(a, 'enum');
          b = R(b);
          a = d.constructor;
          d = Object.create(d.constructor.prototype, {
            value: { value: c },
            constructor: { value: cb(`${d.name}_${b}`, function () {}) },
          });
          a.values[c] = d;
          a[b] = d;
        },
        P: (a, b, c) => {
          b = R(b);
          P(a, {
            name: b,
            fromWireType: (d) => d,
            toWireType: (d, e) => e,
            oc: 8,
            readValueFromPointer: Mb(b, c),
            pc: null,
          });
        },
        I: (a, b, c, d, e, f) => {
          var k = vb(b, c);
          a = R(a);
          a = Eb(a);
          e = T(d, e);
          eb(
            a,
            function () {
              ub(`Cannot call ${a} due to unbound types`, k);
            },
            b - 1,
          );
          Q([], k, (h) => {
            ob(a, Db(a, [h[0], null].concat(h.slice(1)), null, e, f), b - 1);
            return [];
          });
        },
        w: (a, b, c, d, e) => {
          b = R(b);
          -1 === e && (e = 4294967295);
          e = (h) => h;
          if (0 === d) {
            var f = 32 - 8 * c;
            e = (h) => (h << f) >>> f;
          }
          var k = b.includes('unsigned')
            ? function (h, l) {
                return l >>> 0;
              }
            : function (h, l) {
                return l;
              };
          P(a, { name: b, fromWireType: e, toWireType: k, oc: 8, readValueFromPointer: Nb(b, c, 0 !== d), pc: null });
        },
        q: (a, b, c) => {
          function d(f) {
            return new e(t.buffer, C[(f + 4) >> 2], C[f >> 2]);
          }
          var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][
            b
          ];
          c = R(c);
          P(a, { name: c, fromWireType: d, oc: 8, readValueFromPointer: d }, { Oc: !0 });
        },
        H: (a) => {
          P(a, Ob);
        },
        Na: (a, b, c, d, e, f, k, h, l, m, p, u) => {
          c = R(c);
          f = T(e, f);
          h = T(k, h);
          m = T(l, m);
          u = T(p, u);
          Q([a], [b], (w) => {
            w = w[0];
            return [new nb(c, w.ic, !1, !1, !0, w, d, f, h, m, u)];
          });
        },
        Q: (a, b) => {
          b = R(b);
          var c = 'std::string' === b;
          P(a, {
            name: b,
            fromWireType: function (d) {
              var e = C[d >> 2],
                f = d + 4;
              if (c)
                for (var k = f, h = 0; h <= e; ++h) {
                  var l = f + h;
                  if (h == e || 0 == v[l]) {
                    k = k ? I(v, k, l - k) : '';
                    if (void 0 === m) var m = k;
                    else (m += String.fromCharCode(0)), (m += k);
                    k = l + 1;
                  }
                }
              else {
                m = Array(e);
                for (h = 0; h < e; ++h) m[h] = String.fromCharCode(v[f + h]);
                m = m.join('');
              }
              U(d);
              return m;
            },
            toWireType: function (d, e) {
              e instanceof ArrayBuffer && (e = new Uint8Array(e));
              var f,
                k = 'string' == typeof e;
              if (!(k || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array))
                throw new S('Cannot pass non-string to std::string');
              if (c && k)
                for (var h = (f = 0); h < e.length; ++h) {
                  var l = e.charCodeAt(h);
                  127 >= l ? f++ : 2047 >= l ? (f += 2) : 55296 <= l && 57343 >= l ? ((f += 4), ++h) : (f += 3);
                }
              else f = e.length;
              h = lc(4 + f + 1);
              l = h + 4;
              C[h >> 2] = f;
              if (c && k) L(e, l, f + 1);
              else if (k)
                for (k = 0; k < f; ++k) {
                  var m = e.charCodeAt(k);
                  if (255 < m) throw (U(l), new S('String has UTF-16 code units that do not fit in 8 bits'));
                  v[l + k] = m;
                }
              else for (k = 0; k < f; ++k) v[l + k] = e[k];
              null !== d && d.push(U, h);
              return h;
            },
            oc: 8,
            readValueFromPointer: M,
            pc(d) {
              U(d);
            },
          });
        },
        G: (a, b, c) => {
          c = R(c);
          if (2 === b) {
            var d = Qb;
            var e = Rb;
            var f = Sb;
            var k = (h) => A[h >> 1];
          } else 4 === b && ((d = Tb), (e = Ub), (f = Vb), (k = (h) => C[h >> 2]));
          P(a, {
            name: c,
            fromWireType: (h) => {
              for (var l = C[h >> 2], m, p = h + 4, u = 0; u <= l; ++u) {
                var w = h + 4 + u * b;
                if (u == l || 0 == k(w))
                  (p = d(p, w - p)), void 0 === m ? (m = p) : ((m += String.fromCharCode(0)), (m += p)), (p = w + b);
              }
              U(h);
              return m;
            },
            toWireType: (h, l) => {
              if ('string' != typeof l) throw new S(`Cannot pass non-string to C++ string type ${c}`);
              var m = f(l),
                p = lc(4 + m + b);
              C[p >> 2] = m / b;
              e(l, p + 4, m + b);
              null !== h && h.push(U, p);
              return p;
            },
            oc: 8,
            readValueFromPointer: M,
            pc(h) {
              U(h);
            },
          });
        },
        K: (a, b, c, d, e, f) => {
          La[a] = { name: R(b), Ac: T(c, d), qc: T(e, f), Dc: [] };
        },
        t: (a, b, c, d, e, f, k, h, l, m) => {
          La[a].Dc.push({ Ic: R(b), Nc: c, Lc: T(d, e), Mc: f, Tc: k, Sc: T(h, l), Uc: m });
        },
        Ia: (a, b) => {
          b = R(b);
          P(a, { Wc: !0, name: b, oc: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        la: () => {
          Ea = !1;
          yb = 0;
        },
        ha: () => {
          throw Infinity;
        },
        La: (a, b, c, d) => {
          a = Wb[a];
          b = Ib(b);
          return a(null, b, c, d);
        },
        pa: Hb,
        Ka: (a, b, c) => {
          var d = Yb(a, b),
            e = d.shift();
          a--;
          var f = Array(a);
          b = `methodCaller<(${d.map((k) => k.name).join(', ')}) => ${e.name}>`;
          return Xb(
            cb(b, (k, h, l, m) => {
              for (var p = 0, u = 0; u < a; ++u) (f[u] = d[u].readValueFromPointer(m + p)), (p += d[u].oc);
              h = 1 === c ? Zb(h, f) : h.apply(k, f);
              k = [];
              h = e.toWireType(k, h);
              k.length && (C[l >> 2] = lb(k));
              return h;
            }),
          );
        },
        Ma: (a) => {
          9 < a && (W[a + 1] += 1);
        },
        Ja: (a) => {
          var b = Ib(a);
          Ma(b);
          Hb(a);
        },
        A: (a, b) => {
          a = Lb(a, '_emval_take_value');
          a = a.readValueFromPointer(b);
          return lb(a);
        },
        ia: (a, b) => {
          $b[a] && (clearTimeout($b[a].id), delete $b[a]);
          if (!b) return 0;
          var c = setTimeout(() => {
            delete $b[a];
            Ab(() => mc(a, performance.now()));
          }, b);
          $b[a] = { id: c, Xc: b };
          return 0;
        },
        ja: (a, b, c, d) => {
          var e = new Date().getFullYear(),
            f = new Date(e, 0, 1).getTimezoneOffset();
          e = new Date(e, 6, 1).getTimezoneOffset();
          C[a >> 2] = 60 * Math.max(f, e);
          B[b >> 2] = Number(f != e);
          b = (k) => {
            var h = Math.abs(k);
            return `UTC${0 <= k ? '-' : '+'}${String(Math.floor(h / 60)).padStart(2, '0')}${String(h % 60).padStart(
              2,
              '0',
            )}`;
          };
          a = b(f);
          b = b(e);
          e < f ? (L(a, c, 17), L(b, d, 17)) : (L(a, d, 17), L(b, c, 17));
        },
        Oa: () => performance.now(),
        ka: (a) => {
          var b = v.length;
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
        xa: (a, b) => {
          var c = 0;
          cc().forEach((d, e) => {
            var f = b + c;
            e = C[(a + 4 * e) >> 2] = f;
            for (f = 0; f < d.length; ++f) t[e++] = d.charCodeAt(f);
            t[e] = 0;
            c += d.length + 1;
          });
          return 0;
        },
        ya: (a, b) => {
          var c = cc();
          C[a >> 2] = c.length;
          var d = 0;
          c.forEach((e) => (d += e.length + 1));
          C[b >> 2] = d;
          return 0;
        },
        ua: () => 52,
        sa: () => 52,
        ra: (a, b, c, d) => {
          for (var e = 0, f = 0; f < c; f++) {
            var k = C[b >> 2],
              h = C[(b + 4) >> 2];
            b += 8;
            for (var l = 0; l < h; l++) {
              var m = a,
                p = v[k + l],
                u = dc[m];
              0 === p || 10 === p ? ((1 === m ? ja : q)(I(u)), (u.length = 0)) : u.push(p);
            }
            e += h;
          }
          C[d >> 2] = e;
          return 0;
        },
        Da: nc,
        o: oc,
        Ea: pc,
        g: qc,
        v: rc,
        Fa: sc,
        f: tc,
        i: uc,
        O: vc,
        z: wc,
        k: xc,
        r: yc,
        L: zc,
        Y: Ac,
        S: Bc,
        fa: Cc,
        ea: Dc,
        ca: Ec,
        _: Fc,
        B: Gc,
        a: Hc,
        x: Ic,
        y: Jc,
        c: Kc,
        e: Lc,
        M: Mc,
        Ba: Nc,
        j: Oc,
        Ca: Pc,
        h: Qc,
        C: Rc,
        N: Sc,
        X: Tc,
        U: Uc,
        Z: Vc,
        V: Wc,
        da: Xc,
        T: Yc,
        $: Zc,
        ba: $c,
        aa: ad,
        W: bd,
        R: cd,
        p: (a) => a,
        wa: zb,
        ma: (a, b) => {
          fc(v.subarray(a, a + b));
          return 0;
        },
      },
      V = (function () {
        function a(c) {
          V = c.exports;
          V = Bb();
          la = V.Pa;
          pa();
          ra.unshift(V.Qa);
          F--;
          g.monitorRunDependencies?.(F);
          0 == F && (null !== ua && (clearInterval(ua), (ua = null)), H && ((c = H), (H = null), c()));
          return V;
        }
        F++;
        g.monitorRunDependencies?.(F);
        var b = { a: dd };
        if (g.instantiateWasm)
          try {
            return g.instantiateWasm(b, a);
          } catch (c) {
            q(`Module.instantiateWasm callback failed with error: ${c}`), ba(c);
          }
        xa ??= wa('DotLottiePlayer.wasm')
          ? 'DotLottiePlayer.wasm'
          : g.locateFile
          ? g.locateFile('DotLottiePlayer.wasm', n)
          : n + 'DotLottiePlayer.wasm';
        Ba(b, function (c) {
          a(c.instance);
        }).catch(ba);
        return {};
      })(),
      lc = (a) => (lc = V.Ra)(a),
      sb = (a) => (sb = V.Sa)(a),
      U = (a) => (U = V.Ta)(a),
      mc = (a, b) => (mc = V.Va)(a, b),
      X = (a, b) => (X = V.Wa)(a, b),
      K = (a) => (K = V.Xa)(a),
      Y = (a) => (Y = V.Ya)(a),
      Z = () => (Z = V.Za)(),
      kc = (a) => (kc = V._a)(a),
      ic = (a) => (ic = V.$a)(a),
      Ja = (a, b, c) => (Ja = V.ab)(a, b, c),
      jc = (a) => (jc = V.bb)(a),
      ed = (g.dynCall_viii = (a, b, c, d) => (ed = g.dynCall_viii = V.cb)(a, b, c, d)),
      dynCall_vi = (g.dynCall_vi = (a, b) => (dynCall_vi = g.dynCall_vi = V.db)(a, b)),
      dynCall_vii = (g.dynCall_vii = (a, b, c) => (dynCall_vii = g.dynCall_vii = V.eb)(a, b, c)),
      fd = (g.dynCall_viiii = (a, b, c, d, e) => (fd = g.dynCall_viiii = V.fb)(a, b, c, d, e)),
      dynCall_iii = (g.dynCall_iii = (a, b, c) => (dynCall_iii = g.dynCall_iii = V.gb)(a, b, c)),
      gd = (g.dynCall_ii = (a, b) => (gd = g.dynCall_ii = V.hb)(a, b)),
      hd = (g.dynCall_fi = (a, b) => (hd = g.dynCall_fi = V.ib)(a, b)),
      jd = (g.dynCall_iiiiii = (a, b, c, d, e, f) => (jd = g.dynCall_iiiiii = V.jb)(a, b, c, d, e, f)),
      kd = (g.dynCall_ji = (a, b) => (kd = g.dynCall_ji = V.kb)(a, b)),
      ld = (g.dynCall_iiff = (a, b, c, d) => (ld = g.dynCall_iiff = V.lb)(a, b, c, d)),
      md = (g.dynCall_iif = (a, b, c) => (md = g.dynCall_iif = V.mb)(a, b, c)),
      nd = (g.dynCall_iiii = (a, b, c, d) => (nd = g.dynCall_iiii = V.nb)(a, b, c, d)),
      od = (g.dynCall_viiiii = (a, b, c, d, e, f) => (od = g.dynCall_viiiii = V.ob)(a, b, c, d, e, f)),
      pd = (g.dynCall_iiiii = (a, b, c, d, e) => (pd = g.dynCall_iiiii = V.pb)(a, b, c, d, e)),
      qd = (g.dynCall_iiiif = (a, b, c, d, e) => (qd = g.dynCall_iiiif = V.qb)(a, b, c, d, e)),
      rd = (g.dynCall_jii = (a, b, c) => (rd = g.dynCall_jii = V.rb)(a, b, c)),
      sd = (g.dynCall_fii = (a, b, c) => (sd = g.dynCall_fii = V.sb)(a, b, c));
    g.dynCall_iijj = (a, b, c, d, e, f) => (g.dynCall_iijj = V.tb)(a, b, c, d, e, f);
    g.dynCall_vijj = (a, b, c, d, e, f) => (g.dynCall_vijj = V.ub)(a, b, c, d, e, f);
    var td = (g.dynCall_vidi = (a, b, c, d) => (td = g.dynCall_vidi = V.vb)(a, b, c, d)),
      ud = (g.dynCall_vij = (a, b, c, d) => (ud = g.dynCall_vij = V.wb)(a, b, c, d)),
      vd = (g.dynCall_jjji = (a, b, c, d, e, f) => (vd = g.dynCall_jjji = V.xb)(a, b, c, d, e, f)),
      wd = (g.dynCall_viijj = (a, b, c, d, e, f, k) => (wd = g.dynCall_viijj = V.yb)(a, b, c, d, e, f, k)),
      xd = (g.dynCall_viijji = (a, b, c, d, e, f, k, h) => (xd = g.dynCall_viijji = V.zb)(a, b, c, d, e, f, k, h)),
      yd = (g.dynCall_viij = (a, b, c, d, e) => (yd = g.dynCall_viij = V.Ab)(a, b, c, d, e)),
      zd = (g.dynCall_iiiijj = (a, b, c, d, e, f, k, h) => (zd = g.dynCall_iiiijj = V.Bb)(a, b, c, d, e, f, k, h)),
      Ad = (g.dynCall_viiij = (a, b, c, d, e, f) => (Ad = g.dynCall_viiij = V.Cb)(a, b, c, d, e, f)),
      Bd = (g.dynCall_viiiiii = (a, b, c, d, e, f, k) => (Bd = g.dynCall_viiiiii = V.Db)(a, b, c, d, e, f, k)),
      Cd = (g.dynCall_viijii = (a, b, c, d, e, f, k) => (Cd = g.dynCall_viijii = V.Eb)(a, b, c, d, e, f, k)),
      Dd = (g.dynCall_viiiff = (a, b, c, d, e, f) => (Dd = g.dynCall_viiiff = V.Fb)(a, b, c, d, e, f)),
      Ed = (g.dynCall_vif = (a, b, c) => (Ed = g.dynCall_vif = V.Gb)(a, b, c)),
      Fd = (g.dynCall_vijiji = (a, b, c, d, e, f, k, h) => (Fd = g.dynCall_vijiji = V.Hb)(a, b, c, d, e, f, k, h)),
      Gd = (g.dynCall_ffff = (a, b, c, d) => (Gd = g.dynCall_ffff = V.Ib)(a, b, c, d)),
      Hd = (g.dynCall_viiif = (a, b, c, d, e) => (Hd = g.dynCall_viiif = V.Jb)(a, b, c, d, e)),
      Id = (g.dynCall_iiiiff = (a, b, c, d, e, f) => (Id = g.dynCall_iiiiff = V.Kb)(a, b, c, d, e, f)),
      Jd = (g.dynCall_jiii = (a, b, c, d) => (Jd = g.dynCall_jiii = V.Lb)(a, b, c, d)),
      Kd = (g.dynCall_iiiiiiii = (a, b, c, d, e, f, k, h) => (Kd = g.dynCall_iiiiiiii = V.Mb)(a, b, c, d, e, f, k, h)),
      Ld = (g.dynCall_viiiiiii = (a, b, c, d, e, f, k, h) => (Ld = g.dynCall_viiiiiii = V.Nb)(a, b, c, d, e, f, k, h));
    g.dynCall_viif = (a, b, c, d) => (g.dynCall_viif = V.Ob)(a, b, c, d);
    var Md = (g.dynCall_viiiiff = (a, b, c, d, e, f, k) => (Md = g.dynCall_viiiiff = V.Pb)(a, b, c, d, e, f, k)),
      Nd = (g.dynCall_viiji = (a, b, c, d, e, f) => (Nd = g.dynCall_viiji = V.Qb)(a, b, c, d, e, f)),
      Od = (g.dynCall_viiiji = (a, b, c, d, e, f, k) => (Od = g.dynCall_viiiji = V.Rb)(a, b, c, d, e, f, k)),
      Pd = (g.dynCall_viijiii = (a, b, c, d, e, f, k, h) => (Pd = g.dynCall_viijiii = V.Sb)(a, b, c, d, e, f, k, h)),
      Qd = (g.dynCall_iji = (a, b, c, d) => (Qd = g.dynCall_iji = V.Tb)(a, b, c, d)),
      dynCall_v = (g.dynCall_v = (a) => (dynCall_v = g.dynCall_v = V.Ub)(a)),
      Rd = (g.dynCall_vijjjj = (a, b, c, d, e, f, k, h, l, m) =>
        (Rd = g.dynCall_vijjjj = V.Vb)(a, b, c, d, e, f, k, h, l, m));
    g.dynCall_i = (a) => (g.dynCall_i = V.Wb)(a);
    g.dynCall_iiiiiii = (a, b, c, d, e, f, k) => (g.dynCall_iiiiiii = V.Xb)(a, b, c, d, e, f, k);
    g.dynCall_iiif = (a, b, c, d) => (g.dynCall_iiif = V.Yb)(a, b, c, d);
    g.dynCall_iiiff = (a, b, c, d, e) => (g.dynCall_iiiff = V.Zb)(a, b, c, d, e);
    g.dynCall_iiiiiffiii = (a, b, c, d, e, f, k, h, l, m) =>
      (g.dynCall_iiiiiffiii = V._b)(a, b, c, d, e, f, k, h, l, m);
    g.dynCall_iidiiii = (a, b, c, d, e, f, k) => (g.dynCall_iidiiii = V.$b)(a, b, c, d, e, f, k);
    g.dynCall_iiiiiiiii = (a, b, c, d, e, f, k, h, l) => (g.dynCall_iiiiiiiii = V.ac)(a, b, c, d, e, f, k, h, l);
    g.dynCall_iiiifi = (a, b, c, d, e, f) => (g.dynCall_iiiifi = V.bc)(a, b, c, d, e, f);
    g.dynCall_iiiiij = (a, b, c, d, e, f, k) => (g.dynCall_iiiiij = V.cc)(a, b, c, d, e, f, k);
    g.dynCall_iiiiid = (a, b, c, d, e, f) => (g.dynCall_iiiiid = V.dc)(a, b, c, d, e, f);
    g.dynCall_iiiiijj = (a, b, c, d, e, f, k, h, l) => (g.dynCall_iiiiijj = V.ec)(a, b, c, d, e, f, k, h, l);
    g.dynCall_iiiiiijj = (a, b, c, d, e, f, k, h, l, m) => (g.dynCall_iiiiiijj = V.fc)(a, b, c, d, e, f, k, h, l, m);
    function Kc(a, b, c) {
      var d = Z();
      try {
        dynCall_vii(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function Lc(a, b, c, d) {
      var e = Z();
      try {
        ed(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function Hc(a, b) {
      var c = Z();
      try {
        dynCall_vi(a, b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function Oc(a, b, c, d, e) {
      var f = Z();
      try {
        fd(a, b, c, d, e);
      } catch (k) {
        Y(f);
        if (k !== k + 0) throw k;
        X(1, 0);
      }
    }
    function qc(a, b) {
      var c = Z();
      try {
        return gd(a, b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function rc(a, b, c) {
      var d = Z();
      try {
        return md(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function oc(a, b) {
      var c = Z();
      try {
        return hd(a, b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function sc(a, b, c, d) {
      var e = Z();
      try {
        return ld(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function yc(a, b, c, d, e, f) {
      var k = Z();
      try {
        return jd(a, b, c, d, e, f);
      } catch (h) {
        Y(k);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function uc(a, b, c, d) {
      var e = Z();
      try {
        return nd(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function tc(a, b, c) {
      var d = Z();
      try {
        return dynCall_iii(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function vc(a, b, c, d, e) {
      var f = Z();
      try {
        return qd(a, b, c, d, e);
      } catch (k) {
        Y(f);
        if (k !== k + 0) throw k;
        X(1, 0);
      }
    }
    function Qc(a, b, c, d, e, f) {
      var k = Z();
      try {
        od(a, b, c, d, e, f);
      } catch (h) {
        Y(k);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function xc(a, b, c, d, e) {
      var f = Z();
      try {
        return pd(a, b, c, d, e);
      } catch (k) {
        Y(f);
        if (k !== k + 0) throw k;
        X(1, 0);
      }
    }
    function pc(a, b, c) {
      var d = Z();
      try {
        return sd(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function Rc(a, b, c, d, e, f, k) {
      var h = Z();
      try {
        Bd(a, b, c, d, e, f, k);
      } catch (l) {
        Y(h);
        if (l !== l + 0) throw l;
        X(1, 0);
      }
    }
    function Sc(a, b, c, d, e, f, k, h) {
      var l = Z();
      try {
        Ld(a, b, c, d, e, f, k, h);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function Ic(a, b, c, d) {
      var e = Z();
      try {
        td(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function Jc(a, b, c) {
      var d = Z();
      try {
        Ed(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function nc(a, b, c, d) {
      var e = Z();
      try {
        return Gd(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function Pc(a, b, c, d, e, f, k) {
      var h = Z();
      try {
        Md(a, b, c, d, e, f, k);
      } catch (l) {
        Y(h);
        if (l !== l + 0) throw l;
        X(1, 0);
      }
    }
    function wc(a, b, c, d, e, f) {
      var k = Z();
      try {
        return Id(a, b, c, d, e, f);
      } catch (h) {
        Y(k);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function Mc(a, b, c, d, e) {
      var f = Z();
      try {
        Hd(a, b, c, d, e);
      } catch (k) {
        Y(f);
        if (k !== k + 0) throw k;
        X(1, 0);
      }
    }
    function Nc(a, b, c, d, e, f) {
      var k = Z();
      try {
        Dd(a, b, c, d, e, f);
      } catch (h) {
        Y(k);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function zc(a, b, c, d, e, f, k, h) {
      var l = Z();
      try {
        return Kd(a, b, c, d, e, f, k, h);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function Gc(a) {
      var b = Z();
      try {
        dynCall_v(a);
      } catch (c) {
        Y(b);
        if (c !== c + 0) throw c;
        X(1, 0);
      }
    }
    function Cc(a, b) {
      var c = Z();
      try {
        return kd(a, b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function Dc(a, b, c) {
      var d = Z();
      try {
        return rd(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function Xc(a, b, c, d, e, f, k) {
      var h = Z();
      try {
        Cd(a, b, c, d, e, f, k);
      } catch (l) {
        Y(h);
        if (l !== l + 0) throw l;
        X(1, 0);
      }
    }
    function Ec(a, b, c, d) {
      var e = Z();
      try {
        return Jd(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function $c(a, b, c, d, e, f, k, h) {
      var l = Z();
      try {
        xd(a, b, c, d, e, f, k, h);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function ad(a, b, c, d) {
      var e = Z();
      try {
        ud(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function Zc(a, b, c, d, e, f, k) {
      var h = Z();
      try {
        wd(a, b, c, d, e, f, k);
      } catch (l) {
        Y(h);
        if (l !== l + 0) throw l;
        X(1, 0);
      }
    }
    function Fc(a, b, c, d, e, f) {
      var k = Z();
      try {
        return vd(a, b, c, d, e, f);
      } catch (h) {
        Y(k);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function Vc(a, b, c, d, e) {
      var f = Z();
      try {
        yd(a, b, c, d, e);
      } catch (k) {
        Y(f);
        if (k !== k + 0) throw k;
        X(1, 0);
      }
    }
    function Ac(a, b, c, d, e, f, k, h) {
      var l = Z();
      try {
        return zd(a, b, c, d, e, f, k, h);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function Tc(a, b, c, d, e, f) {
      var k = Z();
      try {
        Ad(a, b, c, d, e, f);
      } catch (h) {
        Y(k);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function bd(a, b, c, d, e, f, k, h) {
      var l = Z();
      try {
        Fd(a, b, c, d, e, f, k, h);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function Wc(a, b, c, d, e, f) {
      var k = Z();
      try {
        Nd(a, b, c, d, e, f);
      } catch (h) {
        Y(k);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function Uc(a, b, c, d, e, f, k) {
      var h = Z();
      try {
        Od(a, b, c, d, e, f, k);
      } catch (l) {
        Y(h);
        if (l !== l + 0) throw l;
        X(1, 0);
      }
    }
    function Yc(a, b, c, d, e, f, k, h) {
      var l = Z();
      try {
        Pd(a, b, c, d, e, f, k, h);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function Bc(a, b, c, d) {
      var e = Z();
      try {
        return Qd(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function cd(a, b, c, d, e, f, k, h, l, m) {
      var p = Z();
      try {
        Rd(a, b, c, d, e, f, k, h, l, m);
      } catch (u) {
        Y(p);
        if (u !== u + 0) throw u;
        X(1, 0);
      }
    }
    var Sd;
    H = function Td() {
      Sd || Ud();
      Sd || (H = Td);
    };
    function Ud() {
      function a() {
        if (!Sd && ((Sd = !0), (g.calledRun = !0), !r)) {
          Da(ra);
          aa(g);
          g.onRuntimeInitialized?.();
          if (g.postRun)
            for ('function' == typeof g.postRun && (g.postRun = [g.postRun]); g.postRun.length; ) {
              var b = g.postRun.shift();
              sa.unshift(b);
            }
          Da(sa);
        }
      }
      if (!(0 < F)) {
        if (g.preRun) for ('function' == typeof g.preRun && (g.preRun = [g.preRun]); g.preRun.length; ) ta();
        Da(qa);
        0 < F ||
          (g.setStatus
            ? (g.setStatus('Running...'),
              setTimeout(() => {
                setTimeout(() => g.setStatus(''), 1);
                a();
              }, 1))
            : a());
      }
    }
    if (g.preInit)
      for ('function' == typeof g.preInit && (g.preInit = [g.preInit]); 0 < g.preInit.length; ) g.preInit.pop()();
    Ud();
    moduleRtn = ca;

    return moduleRtn;
  };
})();
export default createDotLottiePlayerModule;
