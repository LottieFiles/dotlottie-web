var createDotLottiePlayerModule = (() => {
  var _scriptName = typeof document != 'undefined' ? document.currentScript?.src : undefined;

  return function (moduleArg = {}) {
    var moduleRtn;

    var h = moduleArg,
      aa,
      ba,
      ca = new Promise((a, b) => {
        aa = a;
        ba = b;
      }),
      da = Object.assign({}, h),
      ea = './this.program',
      l = '',
      fa;
    'undefined' != typeof document && document.currentScript && (l = document.currentScript.src);
    _scriptName && (l = _scriptName);
    l.startsWith('blob:') ? (l = '') : (l = l.substr(0, l.replace(/[?#].*/, '').lastIndexOf('/') + 1));
    fa = (a) =>
      fetch(a, { credentials: 'same-origin' }).then((b) =>
        b.ok ? b.arrayBuffer() : Promise.reject(Error(b.status + ' : ' + b.url)),
      );
    var ha = h.print || console.log.bind(console),
      ia = h.printErr || console.error.bind(console);
    Object.assign(h, da);
    da = null;
    h.thisProgram && (ea = h.thisProgram);
    var ja = h.wasmBinary,
      ka,
      la = !1,
      ma,
      p,
      t,
      na,
      oa,
      u,
      v,
      y,
      A;
    function pa() {
      var a = ka.buffer;
      h.HEAP8 = p = new Int8Array(a);
      h.HEAP16 = na = new Int16Array(a);
      h.HEAPU8 = t = new Uint8Array(a);
      h.HEAPU16 = oa = new Uint16Array(a);
      h.HEAP32 = u = new Int32Array(a);
      h.HEAPU32 = v = new Uint32Array(a);
      h.HEAPF32 = y = new Float32Array(a);
      h.HEAPF64 = A = new Float64Array(a);
    }
    var qa = [],
      ra = [],
      sa = [];
    function ta() {
      var a = h.preRun.shift();
      qa.unshift(a);
    }
    var C = 0,
      ua = null,
      va = null;
    function wa(a) {
      h.onAbort?.(a);
      a = 'Aborted(' + a + ')';
      ia(a);
      la = !0;
      a = new WebAssembly.RuntimeError(a + '. Build with -sASSERTIONS for more info.');
      ba(a);
      throw a;
    }
    var xa = (a) => a.startsWith('data:application/octet-stream;base64,'),
      ya;
    function za(a) {
      if (a == ya && ja) return new Uint8Array(ja);
      throw 'both async and sync fetching of the wasm failed';
    }
    function Ba(a) {
      return ja
        ? Promise.resolve().then(() => za(a))
        : fa(a).then(
            (b) => new Uint8Array(b),
            () => za(a),
          );
    }
    function Ca(a, b, c) {
      return Ba(a)
        .then((d) => WebAssembly.instantiate(d, b))
        .then(c, (d) => {
          ia(`failed to asynchronously prepare wasm: ${d}`);
          wa(d);
        });
    }
    function Da(a, b) {
      var c = ya;
      return ja || 'function' != typeof WebAssembly.instantiateStreaming || xa(c) || 'function' != typeof fetch
        ? Ca(c, a, b)
        : fetch(c, { credentials: 'same-origin' }).then((d) =>
            WebAssembly.instantiateStreaming(d, a).then(b, function (e) {
              ia(`wasm streaming compile failed: ${e}`);
              ia('falling back to ArrayBuffer instantiation');
              return Ca(c, a, b);
            }),
          );
    }
    var Ea;
    class Fa {
      name = 'ExitStatus';
      constructor(a) {
        this.message = `Program terminated with exit(${a})`;
        this.status = a;
      }
    }
    var Ga = (a) => {
        for (; 0 < a.length; ) a.shift()(h);
      },
      Ha = h.noExitRuntime || !0,
      Ia = 'undefined' != typeof TextDecoder ? new TextDecoder() : void 0,
      D = (a, b = 0, c = NaN) => {
        var d = b + c;
        for (c = b; a[c] && !(c >= d); ) ++c;
        if (16 < c - b && a.buffer && Ia) return Ia.decode(a.subarray(b, c));
        for (d = ''; b < c; ) {
          var e = a[b++];
          if (e & 128) {
            var f = a[b++] & 63;
            if (192 == (e & 224)) d += String.fromCharCode(((e & 31) << 6) | f);
            else {
              var g = a[b++] & 63;
              e =
                224 == (e & 240)
                  ? ((e & 15) << 12) | (f << 6) | g
                  : ((e & 7) << 18) | (f << 12) | (g << 6) | (a[b++] & 63);
              65536 > e
                ? (d += String.fromCharCode(e))
                : ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))));
            }
          } else d += String.fromCharCode(e);
        }
        return d;
      },
      Ja = [],
      Ka = 0,
      La = 0;
    class Ma {
      constructor(a) {
        this.Od = a;
        this.bc = a - 24;
      }
    }
    var Pa = (a) => {
        var b = La;
        if (!b) return Na(0), 0;
        var c = new Ma(b);
        v[(c.bc + 16) >> 2] = b;
        var d = v[(c.bc + 4) >> 2];
        if (!d) return Na(0), b;
        for (var e of a) {
          if (0 === e || e === d) break;
          if (Oa(e, d, c.bc + 16)) return Na(e), b;
        }
        Na(d);
        return b;
      },
      Qa = (a, b, c) => {
        var d = t;
        if (0 < c) {
          c = b + c - 1;
          for (var e = 0; e < a.length; ++e) {
            var f = a.charCodeAt(e);
            if (55296 <= f && 57343 >= f) {
              var g = a.charCodeAt(++e);
              f = (65536 + ((f & 1023) << 10)) | (g & 1023);
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
      Ra = {},
      Sa = (a) => {
        for (; a.length; ) {
          var b = a.pop();
          a.pop()(b);
        }
      };
    function Ta(a) {
      return this.fromWireType(v[a >> 2]);
    }
    var Ua = {},
      E = {},
      Va = {},
      Wa,
      H = (a, b, c) => {
        function d(k) {
          k = c(k);
          if (k.length !== a.length) throw new Wa('Mismatched type converter count');
          for (var m = 0; m < a.length; ++m) G(a[m], k[m]);
        }
        a.forEach((k) => (Va[k] = b));
        var e = Array(b.length),
          f = [],
          g = 0;
        b.forEach((k, m) => {
          E.hasOwnProperty(k)
            ? (e[m] = E[k])
            : (f.push(k),
              Ua.hasOwnProperty(k) || (Ua[k] = []),
              Ua[k].push(() => {
                e[m] = E[k];
                ++g;
                g === f.length && d(e);
              }));
        });
        0 === f.length && d(e);
      },
      Xa,
      J = (a) => {
        for (var b = ''; t[a]; ) b += Xa[t[a++]];
        return b;
      },
      K;
    function Ya(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new K(`type "${d}" must have a positive integer typeid pointer`);
      if (E.hasOwnProperty(a)) {
        if (c.Vd) return;
        throw new K(`Cannot register type '${d}' twice`);
      }
      E[a] = b;
      delete Va[a];
      Ua.hasOwnProperty(a) && ((b = Ua[a]), delete Ua[a], b.forEach((e) => e()));
    }
    function G(a, b, c = {}) {
      return Ya(a, b, c);
    }
    var Za = (a) => {
        throw new K(a.Yb.ld.kd.name + ' instance already deleted');
      },
      $a = !1,
      ab = () => {},
      bb = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.od) return null;
        a = bb(a, b, c.od);
        return null === a ? null : c.Nd(a);
      },
      cb = {},
      db = {},
      eb = (a, b) => {
        if (void 0 === b) throw new K('ptr should not be undefined');
        for (; a.od; ) (b = a.zd(b)), (a = a.od);
        return db[b];
      },
      gb = (a, b) => {
        if (!b.ld || !b.bc) throw new Wa('makeClassHandle requires ptr and ptrType');
        if (!!b.pd !== !!b.nd) throw new Wa('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return fb(Object.create(a, { Yb: { value: b, writable: !0 } }));
      },
      fb = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (fb = (b) => b), a;
        $a = new FinalizationRegistry((b) => {
          b = b.Yb;
          --b.count.value;
          0 === b.count.value && (b.nd ? b.pd.sd(b.nd) : b.ld.kd.sd(b.bc));
        });
        fb = (b) => {
          var c = b.Yb;
          c.nd && $a.register(b, { Yb: c }, b);
          return b;
        };
        ab = (b) => {
          $a.unregister(b);
        };
        return fb(a);
      },
      hb = [];
    function ib() {}
    var jb = (a, b) => Object.defineProperty(b, 'name', { value: a }),
      kb = (a, b, c) => {
        if (void 0 === a[b].md) {
          var d = a[b];
          a[b] = function (...e) {
            if (!a[b].md.hasOwnProperty(e.length))
              throw new K(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].md})!`,
              );
            return a[b].md[e.length].apply(this, e);
          };
          a[b].md = [];
          a[b].md[d.wd] = d;
        }
      },
      lb = (a, b, c) => {
        if (h.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== h[a].md && void 0 !== h[a].md[c]))
            throw new K(`Cannot register public name '${a}' twice`);
          kb(h, a, a);
          if (h[a].md.hasOwnProperty(c))
            throw new K(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          h[a].md[c] = b;
        } else (h[a] = b), (h[a].wd = c);
      },
      mb = (a) => {
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function nb(a, b, c, d, e, f, g, k) {
      this.name = a;
      this.constructor = b;
      this.vd = c;
      this.sd = d;
      this.od = e;
      this.Qd = f;
      this.zd = g;
      this.Nd = k;
      this.Xd = [];
    }
    var ob = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.zd) throw new K(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.zd(a);
        b = b.od;
      }
      return a;
    };
    function pb(a, b) {
      if (null === b) {
        if (this.Dd) throw new K(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Yb) throw new K(`Cannot pass "${qb(b)}" as a ${this.name}`);
      if (!b.Yb.bc) throw new K(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return ob(b.Yb.bc, b.Yb.ld.kd, this.kd);
    }
    function rb(a, b) {
      if (null === b) {
        if (this.Dd) throw new K(`null is not a valid ${this.name}`);
        if (this.Bd) {
          var c = this.Ed();
          null !== a && a.push(this.sd, c);
          return c;
        }
        return 0;
      }
      if (!b || !b.Yb) throw new K(`Cannot pass "${qb(b)}" as a ${this.name}`);
      if (!b.Yb.bc) throw new K(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.Ad && b.Yb.ld.Ad)
        throw new K(
          `Cannot convert argument of type ${b.Yb.pd ? b.Yb.pd.name : b.Yb.ld.name} to parameter type ${this.name}`,
        );
      c = ob(b.Yb.bc, b.Yb.ld.kd, this.kd);
      if (this.Bd) {
        if (void 0 === b.Yb.nd) throw new K('Passing raw pointer to smart pointer is illegal');
        switch (this.ce) {
          case 0:
            if (b.Yb.pd === this) c = b.Yb.nd;
            else
              throw new K(
                `Cannot convert argument of type ${b.Yb.pd ? b.Yb.pd.name : b.Yb.ld.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            c = b.Yb.nd;
            break;
          case 2:
            if (b.Yb.pd === this) c = b.Yb.nd;
            else {
              var d = b.clone();
              c = this.Zd(
                c,
                sb(() => d['delete']()),
              );
              null !== a && a.push(this.sd, c);
            }
            break;
          default:
            throw new K('Unsupporting sharing policy');
        }
      }
      return c;
    }
    function tb(a, b) {
      if (null === b) {
        if (this.Dd) throw new K(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Yb) throw new K(`Cannot pass "${qb(b)}" as a ${this.name}`);
      if (!b.Yb.bc) throw new K(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.Yb.ld.Ad) throw new K(`Cannot convert argument of type ${b.Yb.ld.name} to parameter type ${this.name}`);
      return ob(b.Yb.bc, b.Yb.ld.kd, this.kd);
    }
    function ub(a, b, c, d, e, f, g, k, m, n, q) {
      this.name = a;
      this.kd = b;
      this.Dd = c;
      this.Ad = d;
      this.Bd = e;
      this.Wd = f;
      this.ce = g;
      this.Jd = k;
      this.Ed = m;
      this.Zd = n;
      this.sd = q;
      e || void 0 !== b.od ? (this.toWireType = rb) : ((this.toWireType = d ? pb : tb), (this.rd = null));
    }
    var vb = (a, b, c) => {
        if (!h.hasOwnProperty(a)) throw new Wa('Replacing nonexistent public symbol');
        void 0 !== h[a].md && void 0 !== c ? (h[a].md[c] = b) : ((h[a] = b), (h[a].wd = c));
      },
      wb = (a, b, c = []) => {
        a = a.replace(/p/g, 'i');
        return (0, h['dynCall_' + a])(b, ...c);
      },
      xb =
        (a, b) =>
        (...c) =>
          wb(a, b, c),
      L = (a, b) => {
        a = J(a);
        var c = xb(a, b);
        if ('function' != typeof c) throw new K(`unknown function pointer with signature ${a}: ${b}`);
        return c;
      },
      yb,
      Ab = (a) => {
        a = zb(a);
        var b = J(a);
        M(a);
        return b;
      },
      Bb = (a, b) => {
        function c(f) {
          e[f] || E[f] || (Va[f] ? Va[f].forEach(c) : (d.push(f), (e[f] = !0)));
        }
        var d = [],
          e = {};
        b.forEach(c);
        throw new yb(`${a}: ` + d.map(Ab).join([', ']));
      },
      Cb = (a, b) => {
        for (var c = [], d = 0; d < a; d++) c.push(v[(b + 4 * d) >> 2]);
        return c;
      };
    function Db(a) {
      for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].rd) return !0;
      return !1;
    }
    var Eb = (a) => {
        if (!(a instanceof Fa || 'unwind' == a)) throw a;
      },
      Fb = 0,
      Gb = (a) => {
        ma = a;
        Ha || 0 < Fb || (h.onExit?.(a), (la = !0));
        throw new Fa(a);
      },
      Hb = (a) => {
        if (!la)
          try {
            if ((a(), !(Ha || 0 < Fb)))
              try {
                (ma = a = ma), Gb(a);
              } catch (b) {
                Eb(b);
              }
          } catch (b) {
            Eb(b);
          }
      };
    function Ib() {
      var a = N,
        b = {};
      for (let [c, d] of Object.entries(a))
        b[c] =
          'function' == typeof d
            ? (...e) => {
                Jb.push(c);
                try {
                  return d(...e);
                } finally {
                  la || Jb.pop();
                }
              }
            : d;
      return b;
    }
    var Jb = [];
    function Kb(a, b, c, d, e) {
      var f = b.length;
      if (2 > f) throw new K("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var g = null !== b[1] && null !== c,
        k = Db(b),
        m = 'void' !== b[0].name,
        n = f - 2,
        q = Array(n),
        r = [],
        x = [];
      return jb(a, function (...z) {
        x.length = 0;
        r.length = g ? 2 : 1;
        r[0] = e;
        if (g) {
          var w = b[1].toWireType(x, this);
          r[1] = w;
        }
        for (var B = 0; B < n; ++B) (q[B] = b[B + 2].toWireType(x, z[B])), r.push(q[B]);
        z = d(...r);
        if (k) Sa(x);
        else
          for (B = g ? 1 : 2; B < b.length; B++) {
            var I = 1 === B ? w : q[B - 2];
            null !== b[B].rd && b[B].rd(I);
          }
        w = m ? b[0].fromWireType(z) : void 0;
        return w;
      });
    }
    var Lb = (a) => {
        a = a.trim();
        const b = a.indexOf('(');
        return -1 !== b ? a.substr(0, b) : a;
      },
      Mb = [],
      O = [],
      Nb = (a) => {
        9 < a && 0 === --O[a + 1] && ((O[a] = void 0), Mb.push(a));
      },
      Ob = (a) => {
        if (!a) throw new K('Cannot use deleted val. handle = ' + a);
        return O[a];
      },
      sb = (a) => {
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
            const b = Mb.pop() || O.length;
            O[b] = a;
            O[b + 1] = 1;
            return b;
        }
      },
      Pb = {
        name: 'emscripten::val',
        fromWireType: (a) => {
          var b = Ob(a);
          Nb(a);
          return b;
        },
        toWireType: (a, b) => sb(b),
        qd: 8,
        readValueFromPointer: Ta,
        rd: null,
      },
      Qb = (a, b, c) => {
        switch (b) {
          case 1:
            return c
              ? function (d) {
                  return this.fromWireType(p[d]);
                }
              : function (d) {
                  return this.fromWireType(t[d]);
                };
          case 2:
            return c
              ? function (d) {
                  return this.fromWireType(na[d >> 1]);
                }
              : function (d) {
                  return this.fromWireType(oa[d >> 1]);
                };
          case 4:
            return c
              ? function (d) {
                  return this.fromWireType(u[d >> 2]);
                }
              : function (d) {
                  return this.fromWireType(v[d >> 2]);
                };
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Rb = (a, b) => {
        var c = E[a];
        if (void 0 === c) throw ((a = `${b} has unknown type ${Ab(a)}`), new K(a));
        return c;
      },
      qb = (a) => {
        if (null === a) return 'null';
        var b = typeof a;
        return 'object' === b || 'array' === b || 'function' === b ? a.toString() : '' + a;
      },
      Sb = (a, b) => {
        switch (b) {
          case 4:
            return function (c) {
              return this.fromWireType(y[c >> 2]);
            };
          case 8:
            return function (c) {
              return this.fromWireType(A[c >> 3]);
            };
          default:
            throw new TypeError(`invalid float width (${b}): ${a}`);
        }
      },
      Tb = (a, b, c) => {
        switch (b) {
          case 1:
            return c ? (d) => p[d] : (d) => t[d];
          case 2:
            return c ? (d) => na[d >> 1] : (d) => oa[d >> 1];
          case 4:
            return c ? (d) => u[d >> 2] : (d) => v[d >> 2];
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Ub = Object.assign({ optional: !0 }, Pb),
      Vb = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Wb = (a, b) => {
        var c = a >> 1;
        for (var d = c + b / 2; !(c >= d) && oa[c]; ) ++c;
        c <<= 1;
        if (32 < c - a && Vb) return Vb.decode(t.subarray(a, c));
        c = '';
        for (d = 0; !(d >= b / 2); ++d) {
          var e = na[(a + 2 * d) >> 1];
          if (0 == e) break;
          c += String.fromCharCode(e);
        }
        return c;
      },
      Xb = (a, b, c) => {
        c ??= 2147483647;
        if (2 > c) return 0;
        c -= 2;
        var d = b;
        c = c < 2 * a.length ? c / 2 : a.length;
        for (var e = 0; e < c; ++e) (na[b >> 1] = a.charCodeAt(e)), (b += 2);
        na[b >> 1] = 0;
        return b - d;
      },
      Yb = (a) => 2 * a.length,
      Zb = (a, b) => {
        for (var c = 0, d = ''; !(c >= b / 4); ) {
          var e = u[(a + 4 * c) >> 2];
          if (0 == e) break;
          ++c;
          65536 <= e
            ? ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))))
            : (d += String.fromCharCode(e));
        }
        return d;
      },
      $b = (a, b, c) => {
        c ??= 2147483647;
        if (4 > c) return 0;
        var d = b;
        c = d + c - 4;
        for (var e = 0; e < a.length; ++e) {
          var f = a.charCodeAt(e);
          if (55296 <= f && 57343 >= f) {
            var g = a.charCodeAt(++e);
            f = (65536 + ((f & 1023) << 10)) | (g & 1023);
          }
          u[b >> 2] = f;
          b += 4;
          if (b + 4 > c) break;
        }
        u[b >> 2] = 0;
        return b - d;
      },
      ac = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          b += 4;
        }
        return b;
      },
      bc = [],
      cc = (a) => {
        var b = bc.length;
        bc.push(a);
        return b;
      },
      dc = (a, b) => {
        for (var c = Array(a), d = 0; d < a; ++d) c[d] = Rb(v[(b + 4 * d) >> 2], 'parameter ' + d);
        return c;
      },
      ec = Reflect.construct,
      fc = {},
      gc = (a) => ({ width: v[a >> 2], height: v[(a + 4) >> 2], depthOrArrayLayers: v[(a + 8) >> 2] }),
      ic = (a) => {
        var b = P.get(v[(a + 4) >> 2]),
          c = a + 12;
        return {
          texture: b,
          mipLevel: v[(a + 8) >> 2],
          origin: { x: v[c >> 2], y: v[(c + 4) >> 2], z: v[(c + 8) >> 2] },
          aspect: hc[v[(a + 24) >> 2]],
        };
      },
      jc = (a, b) => {
        if (a) {
          for (var c = {}, d = 0; d < a; ++d) {
            var e = b + 16 * d;
            var f = (f = v[(e + 4) >> 2]) ? D(t, f) : '';
            c[f] = A[(e + 8) >> 3];
          }
          return c;
        }
      },
      lc = (a) => (a ? kc.get(a) : 'auto'),
      mc = [, 'clamp-to-edge', 'repeat', 'mirror-repeat'],
      nc = [, 'opaque', 'premultiplied'],
      oc = [
        ,
        'zero',
        'one',
        'src',
        'one-minus-src',
        'src-alpha',
        'one-minus-src-alpha',
        'dst',
        'one-minus-dst',
        'dst-alpha',
        'one-minus-dst-alpha',
        'src-alpha-saturated',
        'constant',
        'one-minus-constant',
      ],
      pc = [, 'add', 'subtract', 'reverse-subtract', 'min', 'max'],
      qc = [, 'uniform', 'storage', 'read-only-storage'],
      rc = [, 'never', 'less', 'equal', 'less-equal', 'greater', 'not-equal', 'greater-equal', 'always'],
      sc = [, 'none', 'front', 'back'],
      tc = [, 'nearest', 'linear'],
      uc = [, 'ccw', 'cw'],
      vc = [, 'uint16', 'uint32'],
      wc = [, 'clear', 'load'],
      xc = [, 'nearest', 'linear'],
      yc = [, 'point-list', 'line-list', 'line-strip', 'triangle-list', 'triangle-strip'],
      zc = [, 'filtering', 'non-filtering', 'comparison'],
      Ac = [
        ,
        'keep',
        'zero',
        'replace',
        'invert',
        'increment-clamp',
        'decrement-clamp',
        'increment-wrap',
        'decrement-wrap',
      ],
      Bc = [, 'write-only', 'read-only', 'read-write'],
      Cc = [, 'store', 'discard'],
      hc = [, 'all', 'stencil-only', 'depth-only'],
      Dc = [, '1d', '2d', '3d'],
      Q = [
        ,
        'r8unorm',
        'r8snorm',
        'r8uint',
        'r8sint',
        'r16uint',
        'r16sint',
        'r16float',
        'rg8unorm',
        'rg8snorm',
        'rg8uint',
        'rg8sint',
        'r32float',
        'r32uint',
        'r32sint',
        'rg16uint',
        'rg16sint',
        'rg16float',
        'rgba8unorm',
        'rgba8unorm-srgb',
        'rgba8snorm',
        'rgba8uint',
        'rgba8sint',
        'bgra8unorm',
        'bgra8unorm-srgb',
        'rgb10a2uint',
        'rgb10a2unorm',
        'rg11b10ufloat',
        'rgb9e5ufloat',
        'rg32float',
        'rg32uint',
        'rg32sint',
        'rgba16uint',
        'rgba16sint',
        'rgba16float',
        'rgba32float',
        'rgba32uint',
        'rgba32sint',
        'stencil8',
        'depth16unorm',
        'depth24plus',
        'depth24plus-stencil8',
        'depth32float',
        'depth32float-stencil8',
        'bc1-rgba-unorm',
        'bc1-rgba-unorm-srgb',
        'bc2-rgba-unorm',
        'bc2-rgba-unorm-srgb',
        'bc3-rgba-unorm',
        'bc3-rgba-unorm-srgb',
        'bc4-r-unorm',
        'bc4-r-snorm',
        'bc5-rg-unorm',
        'bc5-rg-snorm',
        'bc6h-rgb-ufloat',
        'bc6h-rgb-float',
        'bc7-rgba-unorm',
        'bc7-rgba-unorm-srgb',
        'etc2-rgb8unorm',
        'etc2-rgb8unorm-srgb',
        'etc2-rgb8a1unorm',
        'etc2-rgb8a1unorm-srgb',
        'etc2-rgba8unorm',
        'etc2-rgba8unorm-srgb',
        'eac-r11unorm',
        'eac-r11snorm',
        'eac-rg11unorm',
        'eac-rg11snorm',
        'astc-4x4-unorm',
        'astc-4x4-unorm-srgb',
        'astc-5x4-unorm',
        'astc-5x4-unorm-srgb',
        'astc-5x5-unorm',
        'astc-5x5-unorm-srgb',
        'astc-6x5-unorm',
        'astc-6x5-unorm-srgb',
        'astc-6x6-unorm',
        'astc-6x6-unorm-srgb',
        'astc-8x5-unorm',
        'astc-8x5-unorm-srgb',
        'astc-8x6-unorm',
        'astc-8x6-unorm-srgb',
        'astc-8x8-unorm',
        'astc-8x8-unorm-srgb',
        'astc-10x5-unorm',
        'astc-10x5-unorm-srgb',
        'astc-10x6-unorm',
        'astc-10x6-unorm-srgb',
        'astc-10x8-unorm',
        'astc-10x8-unorm-srgb',
        'astc-10x10-unorm',
        'astc-10x10-unorm-srgb',
        'astc-12x10-unorm',
        'astc-12x10-unorm-srgb',
        'astc-12x12-unorm',
        'astc-12x12-unorm-srgb',
      ],
      Ec = [, 'float', 'unfilterable-float', 'depth', 'sint', 'uint'],
      Fc = [, '1d', '2d', '2d-array', 'cube', 'cube-array', '3d'],
      Gc = [
        ,
        'uint8x2',
        'uint8x4',
        'sint8x2',
        'sint8x4',
        'unorm8x2',
        'unorm8x4',
        'snorm8x2',
        'snorm8x4',
        'uint16x2',
        'uint16x4',
        'sint16x2',
        'sint16x4',
        'unorm16x2',
        'unorm16x4',
        'snorm16x2',
        'snorm16x4',
        'float16x2',
        'float16x4',
        'float32',
        'float32x2',
        'float32x3',
        'float32x4',
        'uint32',
        'uint32x2',
        'uint32x3',
        'uint32x4',
        'sint32',
        'sint32x2',
        'sint32x3',
        'sint32x4',
        'unorm10-10-10-2',
      ],
      Hc = [, 'vertex-buffer-not-used', 'vertex', 'instance'],
      Ic,
      R,
      Jc,
      Kc,
      Lc,
      T,
      Mc,
      Nc,
      W,
      Oc,
      P,
      Pc,
      Qc,
      Rc,
      kc,
      Sc,
      Tc,
      Uc,
      Vc,
      Wc = {},
      Yc = () => {
        if (!Xc) {
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
          for (b in Wc) void 0 === Wc[b] ? delete a[b] : (a[b] = Wc[b]);
          var c = [];
          for (b in a) c.push(`${b}=${a[b]}`);
          Xc = c;
        }
        return Xc;
      },
      Xc,
      Zc = [null, [], []],
      $c = () => {
        if ('object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
          return (a) => crypto.getRandomValues(a);
        wa('initRandomDevice');
      },
      ad = (a) => (ad = $c())(a),
      bd = (a, b) => ((b + 2097152) >>> 0 < 4194305 - !!a ? (a >>> 0) + 4294967296 * b : NaN),
      cd = (a) => {
        function b(e) {
          if (e) return { operation: pc[v[e >> 2]], srcFactor: oc[v[(e + 4) >> 2]], dstFactor: oc[v[(e + 8) >> 2]] };
        }
        function c(e) {
          return {
            compare: rc[v[e >> 2]],
            failOp: Ac[v[(e + 4) >> 2]],
            depthFailOp: Ac[v[(e + 8) >> 2]],
            passOp: Ac[v[(e + 12) >> 2]],
          };
        }
        var d = {
          label: void 0,
          layout: lc(v[(a + 8) >> 2]),
          vertex: (function (e) {
            if (e) {
              var f = Uc.get(v[(e + 4) >> 2]),
                g = jc(v[(e + 12) >> 2], v[(e + 16) >> 2]);
              var k = v[(e + 20) >> 2];
              var m = v[(e + 24) >> 2];
              if (k) {
                for (var n = [], q = 0; q < k; ++q) {
                  var r = n,
                    x = r.push;
                  var z = m + 24 * q;
                  if (z) {
                    var w = v[(z + 8) >> 2];
                    if (1 === w) var B = null;
                    else {
                      B = 4294967296 * v[(z + 4) >> 2] + v[z >> 2];
                      w = Hc[w];
                      var I = v[(z + 12) >> 2];
                      z = v[(z + 16) >> 2];
                      for (var U = [], F = 0; F < I; ++F) {
                        var V = U,
                          Aa = V.push;
                        var S = z + 24 * F;
                        S = {
                          format: Gc[v[S >> 2]],
                          offset: 4294967296 * v[(S + 4 + 8) >> 2] + v[(S + 8) >> 2],
                          shaderLocation: v[(S + 16) >> 2],
                        };
                        Aa.call(V, S);
                      }
                      B = { arrayStride: B, stepMode: w, attributes: U };
                    }
                  } else B = void 0;
                  x.call(r, B);
                }
                k = n;
              } else k = void 0;
              f = { module: f, constants: g, buffers: k };
              (e = v[(e + 8) >> 2]) && (f.entryPoint = e ? D(t, e) : '');
              return f;
            }
          })(a + 12),
          primitive: (function (e) {
            if (e) {
              var f = v[e >> 2];
              return {
                topology: yc[v[(e + 4) >> 2]],
                stripIndexFormat: vc[v[(e + 8) >> 2]],
                frontFace: uc[v[(e + 12) >> 2]],
                cullMode: sc[v[(e + 16) >> 2]],
                unclippedDepth: 7 === (f ? v[(f + 4) >> 2] : 0) && !!v[(f + 8) >> 2],
              };
            }
          })(a + 40),
          depthStencil: (function (e) {
            if (e)
              return {
                format: Q[v[(e + 4) >> 2]],
                depthWriteEnabled: !!v[(e + 8) >> 2],
                depthCompare: rc[v[(e + 12) >> 2]],
                stencilFront: c(e + 16),
                stencilBack: c(e + 32),
                stencilReadMask: v[(e + 48) >> 2],
                stencilWriteMask: v[(e + 52) >> 2],
                depthBias: u[(e + 56) >> 2],
                depthBiasSlopeScale: y[(e + 60) >> 2],
                depthBiasClamp: y[(e + 64) >> 2],
              };
          })(v[(a + 60) >> 2]),
          multisample: (function (e) {
            if (e) return { count: v[(e + 4) >> 2], mask: v[(e + 8) >> 2], alphaToCoverageEnabled: !!v[(e + 12) >> 2] };
          })(a + 64),
          fragment: (function (e) {
            if (e) {
              for (
                var f = Uc.get(v[(e + 4) >> 2]),
                  g = jc(v[(e + 12) >> 2], v[(e + 16) >> 2]),
                  k = v[(e + 20) >> 2],
                  m = v[(e + 24) >> 2],
                  n = [],
                  q = 0;
                q < k;
                ++q
              ) {
                var r = n,
                  x = r.push,
                  z = m + 16 * q,
                  w = v[(z + 4) >> 2];
                if (0 === w) z = void 0;
                else {
                  w = Q[w];
                  var B = (B = v[(z + 8) >> 2]) ? { alpha: b(B + 12), color: b(B + 0) } : void 0;
                  z = { format: w, blend: B, writeMask: v[(z + 12) >> 2] };
                }
                x.call(r, z);
              }
              f = { module: f, constants: g, targets: n };
              (e = v[(e + 8) >> 2]) && (f.entryPoint = e ? D(t, e) : '');
              return f;
            }
          })(v[(a + 80) >> 2]),
        };
        (a = v[(a + 4) >> 2]) && (d.label = a ? D(t, a) : '');
        return d;
      },
      dd = [0, document, window];
    Wa = h.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    for (var ed = Array(256), fd = 0; 256 > fd; ++fd) ed[fd] = String.fromCharCode(fd);
    Xa = ed;
    K = h.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    Object.assign(ib.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof ib && a instanceof ib)) return !1;
        var b = this.Yb.ld.kd,
          c = this.Yb.bc;
        a.Yb = a.Yb;
        var d = a.Yb.ld.kd;
        for (a = a.Yb.bc; b.od; ) (c = b.zd(c)), (b = b.od);
        for (; d.od; ) (a = d.zd(a)), (d = d.od);
        return b === d && c === a;
      },
      clone: function () {
        this.Yb.bc || Za(this);
        if (this.Yb.yd) return (this.Yb.count.value += 1), this;
        var a = fb,
          b = Object,
          c = b.create,
          d = Object.getPrototypeOf(this),
          e = this.Yb;
        a = a(
          c.call(b, d, {
            Yb: { value: { count: e.count, xd: e.xd, yd: e.yd, bc: e.bc, ld: e.ld, nd: e.nd, pd: e.pd } },
          }),
        );
        a.Yb.count.value += 1;
        a.Yb.xd = !1;
        return a;
      },
      ['delete']() {
        this.Yb.bc || Za(this);
        if (this.Yb.xd && !this.Yb.yd) throw new K('Object already scheduled for deletion');
        ab(this);
        var a = this.Yb;
        --a.count.value;
        0 === a.count.value && (a.nd ? a.pd.sd(a.nd) : a.ld.kd.sd(a.bc));
        this.Yb.yd || ((this.Yb.nd = void 0), (this.Yb.bc = void 0));
      },
      isDeleted: function () {
        return !this.Yb.bc;
      },
      deleteLater: function () {
        this.Yb.bc || Za(this);
        if (this.Yb.xd && !this.Yb.yd) throw new K('Object already scheduled for deletion');
        hb.push(this);
        this.Yb.xd = !0;
        return this;
      },
    });
    Object.assign(ub.prototype, {
      Rd(a) {
        this.Jd && (a = this.Jd(a));
        return a;
      },
      Hd(a) {
        this.sd?.(a);
      },
      qd: 8,
      readValueFromPointer: Ta,
      fromWireType: function (a) {
        function b() {
          return this.Bd
            ? gb(this.kd.vd, { ld: this.Wd, bc: c, pd: this, nd: a })
            : gb(this.kd.vd, { ld: this, bc: a });
        }
        var c = this.Rd(a);
        if (!c) return this.Hd(a), null;
        var d = eb(this.kd, c);
        if (void 0 !== d) {
          if (0 === d.Yb.count.value) return (d.Yb.bc = c), (d.Yb.nd = a), d.clone();
          d = d.clone();
          this.Hd(a);
          return d;
        }
        d = this.kd.Qd(c);
        d = cb[d];
        if (!d) return b.call(this);
        d = this.Ad ? d.Md : d.pointerType;
        var e = bb(c, this.kd, d.kd);
        return null === e
          ? b.call(this)
          : this.Bd
          ? gb(d.kd.vd, { ld: d, bc: e, pd: this, nd: a })
          : gb(d.kd.vd, { ld: d, bc: e });
      },
    });
    yb = h.UnboundTypeError = ((a, b) => {
      var c = jb(b, function (d) {
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
    O.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1);
    h.count_emval_handles = () => O.length / 2 - 5 - Mb.length;
    (() => {
      function a() {
        this.ud = {};
        this.Ld = 1;
        this.create = function (b, c = {}) {
          var d = this.Ld++;
          c.Fd = 1;
          c.object = b;
          this.ud[d] = c;
          return d;
        };
        this.get = function (b) {
          if (b) return this.ud[b].object;
        };
        this.Kd = function (b) {
          this.ud[b].Fd++;
        };
        this.release = function (b) {
          var c = this.ud[b];
          c.Fd--;
          0 >= c.Fd && delete this.ud[b];
        };
      }
      Ic = new a();
      new a();
      new a();
      R = new a();
      Jc = new a();
      Kc = new a();
      Lc = new a();
      T = new a();
      Mc = new a();
      Nc = new a();
      W = new a();
      Oc = new a();
      P = new a();
      Pc = new a();
      Qc = new a();
      Rc = new a();
      kc = new a();
      Sc = new a();
      Tc = new a();
      Uc = new a();
      new a();
      new a();
    })();
    var ce = {
        j: (a, b, c, d) =>
          wa(
            `Assertion failed: ${a ? D(t, a) : ''}, at: ` +
              [b ? (b ? D(t, b) : '') : 'unknown filename', c, d ? (d ? D(t, d) : '') : 'unknown function'],
          ),
        Mb: (a) => {
          var b = new Ma(a);
          0 == p[b.bc + 12] && ((p[b.bc + 12] = 1), Ka--);
          p[b.bc + 13] = 0;
          Ja.push(b);
          gd(a);
          return hd(a);
        },
        Lb: () => {
          X(0, 0);
          var a = Ja.pop();
          jd(a.Od);
          La = 0;
        },
        b: () => Pa([]),
        q: (a, b) => Pa([a, b]),
        z: (a, b, c) => {
          var d = new Ma(a);
          v[(d.bc + 16) >> 2] = 0;
          v[(d.bc + 4) >> 2] = b;
          v[(d.bc + 8) >> 2] = c;
          La = a;
          Ka++;
          throw La;
        },
        d: (a) => {
          La ||= a;
          throw La;
        },
        Cb: () => {},
        Ab: () => {},
        Bb: () => {},
        Fb: function () {},
        Hb: () => wa(''),
        W: (a) => {
          var b = Ra[a];
          delete Ra[a];
          var c = b.Ed,
            d = b.sd,
            e = b.Id,
            f = e.map((g) => g.Ud).concat(e.map((g) => g.ae));
          H([a], f, (g) => {
            var k = {};
            e.forEach((m, n) => {
              var q = g[n],
                r = m.Sd,
                x = m.Td,
                z = g[n + e.length],
                w = m.$d,
                B = m.be;
              k[m.Pd] = {
                read: (I) => q.fromWireType(r(x, I)),
                write: (I, U) => {
                  var F = [];
                  w(B, I, z.toWireType(F, U));
                  Sa(F);
                },
              };
            });
            return [
              {
                name: b.name,
                fromWireType: (m) => {
                  var n = {},
                    q;
                  for (q in k) n[q] = k[q].read(m);
                  d(m);
                  return n;
                },
                toWireType: (m, n) => {
                  for (var q in k) if (!(q in n)) throw new TypeError(`Missing field: "${q}"`);
                  var r = c();
                  for (q in k) k[q].write(r, n[q]);
                  null !== m && m.push(d, r);
                  return r;
                },
                qd: 8,
                readValueFromPointer: Ta,
                rd: d,
              },
            ];
          });
        },
        tb: () => {},
        Ta: (a, b, c, d) => {
          b = J(b);
          G(a, {
            name: b,
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, f) {
              return f ? c : d;
            },
            qd: 8,
            readValueFromPointer: function (e) {
              return this.fromWireType(t[e]);
            },
            rd: null,
          });
        },
        N: (a, b, c, d, e, f, g, k, m, n, q, r, x) => {
          q = J(q);
          f = L(e, f);
          k &&= L(g, k);
          n &&= L(m, n);
          x = L(r, x);
          var z = mb(q);
          lb(z, function () {
            Bb(`Cannot construct ${q} due to unbound types`, [d]);
          });
          H([a, b, c], d ? [d] : [], (w) => {
            w = w[0];
            if (d) {
              var B = w.kd;
              var I = B.vd;
            } else I = ib.prototype;
            w = jb(q, function (...Aa) {
              if (Object.getPrototypeOf(this) !== U) throw new K("Use 'new' to construct " + q);
              if (void 0 === F.td) throw new K(q + ' has no accessible constructor');
              var S = F.td[Aa.length];
              if (void 0 === S)
                throw new K(
                  `Tried to invoke ctor of ${q} with invalid number of parameters (${
                    Aa.length
                  }) - expected (${Object.keys(F.td).toString()}) parameters instead!`,
                );
              return S.apply(this, Aa);
            });
            var U = Object.create(I, { constructor: { value: w } });
            w.prototype = U;
            var F = new nb(q, w, U, x, B, f, k, n);
            if (F.od) {
              var V;
              (V = F.od).Gd ?? (V.Gd = []);
              F.od.Gd.push(F);
            }
            B = new ub(q, F, !0, !1, !1);
            V = new ub(q + '*', F, !1, !1, !1);
            I = new ub(q + ' const*', F, !1, !0, !1);
            cb[a] = { pointerType: V, Md: I };
            vb(z, w);
            return [B, V, I];
          });
        },
        L: (a, b, c, d, e, f) => {
          var g = Cb(b, c);
          e = L(d, e);
          H([], [a], (k) => {
            k = k[0];
            var m = `constructor ${k.name}`;
            void 0 === k.kd.td && (k.kd.td = []);
            if (void 0 !== k.kd.td[b - 1])
              throw new K(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  k.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            k.kd.td[b - 1] = () => {
              Bb(`Cannot construct ${k.name} due to unbound types`, g);
            };
            H([], g, (n) => {
              n.splice(1, 0, null);
              k.kd.td[b - 1] = Kb(m, n, null, e, f);
              return [];
            });
            return [];
          });
        },
        o: (a, b, c, d, e, f, g, k) => {
          var m = Cb(c, d);
          b = J(b);
          b = Lb(b);
          f = L(e, f);
          H([], [a], (n) => {
            function q() {
              Bb(`Cannot call ${r} due to unbound types`, m);
            }
            n = n[0];
            var r = `${n.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            k && n.kd.Xd.push(b);
            var x = n.kd.vd,
              z = x[b];
            void 0 === z || (void 0 === z.md && z.className !== n.name && z.wd === c - 2)
              ? ((q.wd = c - 2), (q.className = n.name), (x[b] = q))
              : (kb(x, b, r), (x[b].md[c - 2] = q));
            H([], m, (w) => {
              w = Kb(r, w, n, f, g);
              void 0 === x[b].md ? ((w.wd = c - 2), (x[b] = w)) : (x[b].md[c - 2] = w);
              return [];
            });
            return [];
          });
        },
        Sa: (a) => G(a, Pb),
        P: (a, b, c, d) => {
          function e() {}
          b = J(b);
          e.values = {};
          G(a, {
            name: b,
            constructor: e,
            fromWireType: function (f) {
              return this.constructor.values[f];
            },
            toWireType: (f, g) => g.value,
            qd: 8,
            readValueFromPointer: Qb(b, c, d),
            rd: null,
          });
          lb(b, e);
        },
        x: (a, b, c) => {
          var d = Rb(a, 'enum');
          b = J(b);
          a = d.constructor;
          d = Object.create(d.constructor.prototype, {
            value: { value: c },
            constructor: { value: jb(`${d.name}_${b}`, function () {}) },
          });
          a.values[c] = d;
          a[b] = d;
        },
        ja: (a, b, c) => {
          b = J(b);
          G(a, {
            name: b,
            fromWireType: (d) => d,
            toWireType: (d, e) => e,
            qd: 8,
            readValueFromPointer: Sb(b, c),
            rd: null,
          });
        },
        V: (a, b, c, d, e, f) => {
          var g = Cb(b, c);
          a = J(a);
          a = Lb(a);
          e = L(d, e);
          lb(
            a,
            function () {
              Bb(`Cannot call ${a} due to unbound types`, g);
            },
            b - 1,
          );
          H([], g, (k) => {
            vb(a, Kb(a, [k[0], null].concat(k.slice(1)), null, e, f), b - 1);
            return [];
          });
        },
        C: (a, b, c, d, e) => {
          b = J(b);
          -1 === e && (e = 4294967295);
          e = (k) => k;
          if (0 === d) {
            var f = 32 - 8 * c;
            e = (k) => (k << f) >>> f;
          }
          var g = b.includes('unsigned')
            ? function (k, m) {
                return m >>> 0;
              }
            : function (k, m) {
                return m;
              };
          G(a, { name: b, fromWireType: e, toWireType: g, qd: 8, readValueFromPointer: Tb(b, c, 0 !== d), rd: null });
        },
        u: (a, b, c) => {
          function d(f) {
            return new e(p.buffer, v[(f + 4) >> 2], v[f >> 2]);
          }
          var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][
            b
          ];
          c = J(c);
          G(a, { name: c, fromWireType: d, qd: 8, readValueFromPointer: d }, { Vd: !0 });
        },
        U: (a) => {
          G(a, Ub);
        },
        lb: (a, b, c, d, e, f, g, k, m, n, q, r) => {
          c = J(c);
          f = L(e, f);
          k = L(g, k);
          n = L(m, n);
          r = L(q, r);
          H([a], [b], (x) => {
            x = x[0];
            return [new ub(c, x.kd, !1, !1, !0, x, d, f, k, n, r)];
          });
        },
        ka: (a, b) => {
          b = J(b);
          var c = 'std::string' === b;
          G(a, {
            name: b,
            fromWireType: function (d) {
              var e = v[d >> 2],
                f = d + 4;
              if (c)
                for (var g = f, k = 0; k <= e; ++k) {
                  var m = f + k;
                  if (k == e || 0 == t[m]) {
                    g = g ? D(t, g, m - g) : '';
                    if (void 0 === n) var n = g;
                    else (n += String.fromCharCode(0)), (n += g);
                    g = m + 1;
                  }
                }
              else {
                n = Array(e);
                for (k = 0; k < e; ++k) n[k] = String.fromCharCode(t[f + k]);
                n = n.join('');
              }
              M(d);
              return n;
            },
            toWireType: function (d, e) {
              e instanceof ArrayBuffer && (e = new Uint8Array(e));
              var f,
                g = 'string' == typeof e;
              if (!(g || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array))
                throw new K('Cannot pass non-string to std::string');
              if (c && g)
                for (var k = (f = 0); k < e.length; ++k) {
                  var m = e.charCodeAt(k);
                  127 >= m ? f++ : 2047 >= m ? (f += 2) : 55296 <= m && 57343 >= m ? ((f += 4), ++k) : (f += 3);
                }
              else f = e.length;
              k = kd(4 + f + 1);
              m = k + 4;
              v[k >> 2] = f;
              if (c && g) Qa(e, m, f + 1);
              else if (g)
                for (g = 0; g < f; ++g) {
                  var n = e.charCodeAt(g);
                  if (255 < n) throw (M(m), new K('String has UTF-16 code units that do not fit in 8 bits'));
                  t[m + g] = n;
                }
              else for (g = 0; g < f; ++g) t[m + g] = e[g];
              null !== d && d.push(M, k);
              return k;
            },
            qd: 8,
            readValueFromPointer: Ta,
            rd(d) {
              M(d);
            },
          });
        },
        T: (a, b, c) => {
          c = J(c);
          if (2 === b) {
            var d = Wb;
            var e = Xb;
            var f = Yb;
            var g = (k) => oa[k >> 1];
          } else 4 === b && ((d = Zb), (e = $b), (f = ac), (g = (k) => v[k >> 2]));
          G(a, {
            name: c,
            fromWireType: (k) => {
              for (var m = v[k >> 2], n, q = k + 4, r = 0; r <= m; ++r) {
                var x = k + 4 + r * b;
                if (r == m || 0 == g(x))
                  (q = d(q, x - q)), void 0 === n ? (n = q) : ((n += String.fromCharCode(0)), (n += q)), (q = x + b);
              }
              M(k);
              return n;
            },
            toWireType: (k, m) => {
              if ('string' != typeof m) throw new K(`Cannot pass non-string to C++ string type ${c}`);
              var n = f(m),
                q = kd(4 + n + b);
              v[q >> 2] = n / b;
              e(m, q + 4, n + b);
              null !== k && k.push(M, q);
              return q;
            },
            qd: 8,
            readValueFromPointer: Ta,
            rd(k) {
              M(k);
            },
          });
        },
        X: (a, b, c, d, e, f) => {
          Ra[a] = { name: J(b), Ed: L(c, d), sd: L(e, f), Id: [] };
        },
        y: (a, b, c, d, e, f, g, k, m, n) => {
          Ra[a].Id.push({ Pd: J(b), Ud: c, Sd: L(d, e), Td: f, ae: g, $d: L(k, m), be: n });
        },
        Ua: (a, b) => {
          b = J(b);
          G(a, { de: !0, name: b, qd: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        yb: () => {
          Ha = !1;
          Fb = 0;
        },
        ub: () => {
          throw Infinity;
        },
        Xa: (a, b, c, d) => {
          a = bc[a];
          b = Ob(b);
          return a(null, b, c, d);
        },
        va: Nb,
        Wa: (a, b, c) => {
          var d = dc(a, b),
            e = d.shift();
          a--;
          var f = Array(a);
          b = `methodCaller<(${d.map((g) => g.name).join(', ')}) => ${e.name}>`;
          return cc(
            jb(b, (g, k, m, n) => {
              for (var q = 0, r = 0; r < a; ++r) (f[r] = d[r].readValueFromPointer(n + q)), (q += d[r].qd);
              k = 1 === c ? ec(k, f) : k.apply(g, f);
              g = [];
              k = e.toWireType(g, k);
              g.length && (v[m >> 2] = sb(g));
              return k;
            }),
          );
        },
        ab: (a) => {
          9 < a && (O[a + 1] += 1);
        },
        Va: (a) => {
          var b = Ob(a);
          Sa(b);
          Nb(a);
        },
        J: (a, b) => {
          a = Rb(a, '_emval_take_value');
          a = a.readValueFromPointer(b);
          return sb(a);
        },
        vb: (a, b) => {
          fc[a] && (clearTimeout(fc[a].id), delete fc[a]);
          if (!b) return 0;
          var c = setTimeout(() => {
            delete fc[a];
            Hb(() => ld(a, performance.now()));
          }, b);
          fc[a] = { id: c, ge: b };
          return 0;
        },
        wb: (a, b, c, d) => {
          var e = new Date().getFullYear(),
            f = new Date(e, 0, 1).getTimezoneOffset();
          e = new Date(e, 6, 1).getTimezoneOffset();
          v[a >> 2] = 60 * Math.max(f, e);
          u[b >> 2] = Number(f != e);
          b = (g) => {
            var k = Math.abs(g);
            return `UTC${0 <= g ? '-' : '+'}${String(Math.floor(k / 60)).padStart(2, '0')}${String(k % 60).padStart(
              2,
              '0',
            )}`;
          };
          a = b(f);
          b = b(e);
          e < f ? (Qa(a, c, 17), Qa(b, d, 17)) : (Qa(a, d, 17), Qa(b, c, 17));
        },
        Sb: () => performance.now(),
        xb: (a) => {
          var b = t.length;
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
        Pb: () => {
          if (void 0 === Vc) {
            var a = h.preinitializedWebGPUDevice,
              b = { Yd: Jc.create(a.queue) };
            Vc = R.create(a, b);
          }
          R.Kd(Vc);
          return Vc;
        },
        Jb: (a, b) => {
          var c = 0;
          Yc().forEach((d, e) => {
            var f = b + c;
            e = v[(a + 4 * e) >> 2] = f;
            for (f = 0; f < d.length; ++f) p[e++] = d.charCodeAt(f);
            p[e] = 0;
            c += d.length + 1;
          });
          return 0;
        },
        Kb: (a, b) => {
          var c = Yc();
          v[a >> 2] = c.length;
          var d = 0;
          c.forEach((e) => (d += e.length + 1));
          v[b >> 2] = d;
          return 0;
        },
        Gb: () => 52,
        Eb: () => 52,
        Db: (a, b, c, d) => {
          for (var e = 0, f = 0; f < c; f++) {
            var g = v[b >> 2],
              k = v[(b + 4) >> 2];
            b += 8;
            for (var m = 0; m < k; m++) {
              var n = a,
                q = t[g + m],
                r = Zc[n];
              0 === q || 10 === q ? ((1 === n ? ha : ia)(D(r)), (r.length = 0)) : r.push(q);
            }
            e += k;
          }
          v[d >> 2] = e;
          return 0;
        },
        Rb: md,
        r: nd,
        oa: od,
        g: pd,
        A: qd,
        pa: rd,
        f: sd,
        i: td,
        Z: ud,
        H: vd,
        l: wd,
        v: xd,
        la: yd,
        eb: zd,
        Za: Ad,
        ob: Bd,
        nb: Cd,
        kb: Dd,
        gb: Ed,
        O: Fd,
        a: Gd,
        E: Hd,
        F: Id,
        c: Jd,
        e: Kd,
        na: Ld,
        Nb: Md,
        k: Nd,
        Qb: Od,
        h: Pd,
        K: Qd,
        Y: Rd,
        db: Sd,
        $a: Td,
        fb: Ud,
        bb: Vd,
        mb: Wd,
        _a: Xd,
        hb: Yd,
        jb: Zd,
        ib: $d,
        cb: ae,
        Ya: be,
        t: (a) => a,
        Ib: Gb,
        zb: (a, b) => {
          ad(t.subarray(a, a + b));
          return 0;
        },
        Pa: (a) => Rc.release(a),
        Qa: (a) => Nc.release(a),
        Ga: (a) => {
          var b = W.ud[a];
          if (b.Cd) {
            for (var c = 0; c < b.Cd.length; ++c) b.Cd[c]();
            b.Cd = void 0;
          }
          W.get(a).destroy();
        },
        qb: function (a) {
          a = W.get(a).size;
          Na(
            ((Ea = a),
            1 <= +Math.abs(Ea)
              ? 0 < Ea
                ? +Math.floor(Ea / 4294967296) >>> 0
                : ~~+Math.ceil((Ea - +(~~Ea >>> 0)) / 4294967296) >>> 0
              : 0),
          );
          return a >>> 0;
        },
        Fa: (a) => W.release(a),
        $: (a) => Kc.release(a),
        wa: (a, b) => {
          if (b) {
            var c = v[(b + 8) >> 2];
            c =
              0 !== c
                ? {
                    querySet: Qc.get(v[c >> 2]),
                    beginningOfPassWriteIndex: v[(c + 4) >> 2],
                    endOfPassWriteIndex: v[(c + 8) >> 2],
                  }
                : void 0;
            c = { label: void 0, timestampWrites: c };
            (b = v[(b + 4) >> 2]) && (c.label = b ? D(t, b) : '');
          }
          a = Lc.get(a);
          return Mc.create(a.beginComputePass(c));
        },
        ga: (a, b) => {
          var c = v[b >> 2],
            d = void 0;
          0 !== c && (d = 4294967296 * v[(c + 12) >> 2] + v[(c + 8) >> 2]);
          var e = v[(b + 8) >> 2],
            f = v[(b + 12) >> 2];
          c = [];
          for (var g = 0; g < e; ++g) {
            var k = c,
              m = k.push;
            var n = f + 56 * g;
            var q = v[(n + 4) >> 2];
            if (0 !== q) {
              var r = u[(n + 8) >> 2];
              -1 == r && (r = void 0);
              var x = v[(n + 16) >> 2],
                z = v[(n + 20) >> 2];
              var w = n + 24;
              w = { r: A[w >> 3], g: A[(w + 8) >> 3], b: A[(w + 16) >> 3], a: A[(w + 24) >> 3] };
              n = {
                view: Pc.get(q),
                depthSlice: r,
                resolveTarget: Pc.get(v[(n + 12) >> 2]),
                clearValue: w,
                loadOp: wc[x],
                storeOp: Cc[z],
              };
            } else n = void 0;
            m.call(k, n);
          }
          e = v[(b + 16) >> 2];
          e =
            0 !== e
              ? {
                  view: Pc.get(v[e >> 2]),
                  depthClearValue: y[(e + 12) >> 2],
                  depthLoadOp: wc[v[(e + 4) >> 2]],
                  depthStoreOp: Cc[v[(e + 8) >> 2]],
                  depthReadOnly: !!v[(e + 16) >> 2],
                  stencilClearValue: v[(e + 28) >> 2],
                  stencilLoadOp: wc[v[(e + 20) >> 2]],
                  stencilStoreOp: Cc[v[(e + 24) >> 2]],
                  stencilReadOnly: !!v[(e + 32) >> 2],
                }
              : void 0;
          f = Qc.get(v[(b + 20) >> 2]);
          g = v[(b + 24) >> 2];
          g =
            0 !== g
              ? {
                  querySet: Qc.get(v[g >> 2]),
                  beginningOfPassWriteIndex: v[(g + 4) >> 2],
                  endOfPassWriteIndex: v[(g + 8) >> 2],
                }
              : void 0;
          d = {
            label: void 0,
            colorAttachments: c,
            depthStencilAttachment: e,
            occlusionQuerySet: f,
            timestampWrites: g,
            maxDrawCount: d,
          };
          (b = v[(b + 4) >> 2]) && (d.label = b ? D(t, b) : '');
          a = Lc.get(a);
          return T.create(a.beginRenderPass(d));
        },
        I: (a, b, c, d) => {
          a = Lc.get(a);
          d = gc(d);
          a.copyTextureToTexture(ic(b), ic(c), d);
        },
        aa: (a) => {
          a = Lc.get(a);
          return Kc.create(a.finish());
        },
        _: (a) => Lc.release(a),
        ca: (a, b, c, d) => {
          Mc.get(a).dispatchWorkgroups(b, c, d);
        },
        ua: (a) => {
          Mc.get(a).end();
        },
        ta: (a) => Mc.release(a),
        D: (a, b, c, d, e) => {
          a = Mc.get(a);
          c = Nc.get(c);
          if (0 == d) a.setBindGroup(b, c);
          else {
            for (var f = [], g = 0; g < d; g++, e += 4) f.push(v[e >> 2]);
            a.setBindGroup(b, c, f);
          }
        },
        da: (a, b) => {
          a = Mc.get(a);
          b = Tc.get(b);
          a.setPipeline(b);
        },
        Aa: (a) => Tc.release(a),
        G: (a, b) => {
          for (var c = Rc.get(v[(b + 8) >> 2]), d = v[(b + 12) >> 2], e = v[(b + 16) >> 2], f = [], g = 0; g < d; ++g) {
            var k = f,
              m = k.push;
            var n = e + 40 * g;
            var q = v[(n + 8) >> 2],
              r = v[(n + 32) >> 2],
              x = v[(n + 36) >> 2],
              z = v[(n + 4) >> 2];
            q
              ? ((r = n + 24),
                (r = v[r >> 2] + 4294967296 * u[(r + 4) >> 2]),
                -1 == r && (r = void 0),
                (n = {
                  binding: z,
                  resource: { buffer: W.get(q), offset: 4294967296 * v[(n + 4 + 16) >> 2] + v[(n + 16) >> 2], size: r },
                }))
              : (n = r ? { binding: z, resource: Oc.get(r) } : { binding: z, resource: Pc.get(x) });
            m.call(k, n);
          }
          c = { label: void 0, layout: c, entries: f };
          (b = v[(b + 4) >> 2]) && (c.label = b ? D(t, b) : '');
          a = R.get(a);
          return Nc.create(a.createBindGroup(c));
        },
        B: (a, b) => {
          for (var c = v[(b + 8) >> 2], d = v[(b + 12) >> 2], e = [], f = 0; f < c; ++f) {
            var g = e,
              k = g.push,
              m = d + 80 * f,
              n = v[(m + 4) >> 2],
              q = v[(m + 8) >> 2];
            var r = m + 16;
            var x = v[(r + 4) >> 2];
            r = x
              ? {
                  type: qc[x],
                  hasDynamicOffset: !!v[(r + 8) >> 2],
                  minBindingSize: 4294967296 * v[(r + 4 + 16) >> 2] + v[(r + 16) >> 2],
                }
              : void 0;
            x = (x = v[(m + 40 + 4) >> 2]) ? { type: zc[x] } : void 0;
            var z = m + 48;
            var w = v[(z + 4) >> 2];
            z = w
              ? { sampleType: Ec[w], viewDimension: Fc[v[(z + 8) >> 2]], multisampled: !!v[(z + 12) >> 2] }
              : void 0;
            m += 64;
            m = (w = v[(m + 4) >> 2])
              ? { access: Bc[w], format: Q[v[(m + 8) >> 2]], viewDimension: Fc[v[(m + 12) >> 2]] }
              : void 0;
            k.call(g, { binding: n, visibility: q, buffer: r, sampler: x, texture: z, storageTexture: m });
          }
          c = { entries: e };
          (b = v[(b + 4) >> 2]) && (c.label = b ? D(t, b) : '');
          a = R.get(a);
          return Rc.create(a.createBindGroupLayout(c));
        },
        Q: (a, b) => {
          var c = !!v[(b + 24) >> 2],
            d = {
              label: void 0,
              usage: v[(b + 8) >> 2],
              size: 4294967296 * v[(b + 4 + 16) >> 2] + v[(b + 16) >> 2],
              mappedAtCreation: c,
            };
          (b = v[(b + 4) >> 2]) && (d.label = b ? D(t, b) : '');
          b = R.get(a);
          a = {};
          d = W.create(b.createBuffer(d), a);
          c && ((a.ee = 2), (a.Cd = []));
          return d;
        },
        ba: (a, b) => {
          if (b) {
            var c = { label: void 0 };
            (b = v[(b + 4) >> 2]) && (c.label = b ? D(t, b) : '');
          }
          a = R.get(a);
          return Lc.create(a.createCommandEncoder(c));
        },
        Ba: (a, b) => {
          var c = lc(v[(b + 8) >> 2]);
          var d = b + 12;
          if (d) {
            var e = { module: Uc.get(v[(d + 4) >> 2]), constants: jc(v[(d + 12) >> 2], v[(d + 16) >> 2]) };
            (d = v[(d + 8) >> 2]) && (e.entryPoint = d ? D(t, d) : '');
          } else e = void 0;
          c = { label: void 0, layout: c, compute: e };
          (b = v[(b + 4) >> 2]) && (c.label = b ? D(t, b) : '');
          a = R.get(a);
          return Tc.create(a.createComputePipeline(c));
        },
        Ca: (a, b) => {
          for (var c = v[(b + 8) >> 2], d = v[(b + 12) >> 2], e = [], f = 0; f < c; ++f)
            e.push(Rc.get(v[(d + 4 * f) >> 2]));
          c = { label: void 0, bindGroupLayouts: e };
          (b = v[(b + 4) >> 2]) && (c.label = b ? D(t, b) : '');
          a = R.get(a);
          return kc.create(a.createPipelineLayout(c));
        },
        s: (a, b) => {
          b = cd(b);
          a = R.get(a);
          return Sc.create(a.createRenderPipeline(b));
        },
        Oa: (a, b) => {
          if (b) {
            var c = {
              label: void 0,
              addressModeU: mc[v[(b + 8) >> 2]],
              addressModeV: mc[v[(b + 12) >> 2]],
              addressModeW: mc[v[(b + 16) >> 2]],
              magFilter: tc[v[(b + 20) >> 2]],
              minFilter: tc[v[(b + 24) >> 2]],
              mipmapFilter: xc[v[(b + 28) >> 2]],
              lodMinClamp: y[(b + 32) >> 2],
              lodMaxClamp: y[(b + 36) >> 2],
              compare: rc[v[(b + 40) >> 2]],
            };
            (b = v[(b + 4) >> 2]) && (c.label = b ? D(t, b) : '');
          }
          a = R.get(a);
          return Oc.create(a.createSampler(c));
        },
        Da: (a, b) => {
          var c = v[b >> 2],
            d = v[(c + 4) >> 2],
            e = { label: void 0, code: '' };
          (b = v[(b + 4) >> 2]) && (e.label = b ? D(t, b) : '');
          switch (d) {
            case 5:
              d = v[(c + 12) >> 2] >> 2;
              e.code = v.subarray(d, d + v[(c + 8) >> 2]);
              break;
            case 6:
              (c = v[(c + 8) >> 2]) && (e.code = c ? D(t, c) : '');
          }
          a = R.get(a);
          return Uc.create(a.createShaderModule(e));
        },
        R: (a, b) => {
          var c = {
              label: void 0,
              size: gc(b + 16),
              mipLevelCount: v[(b + 32) >> 2],
              sampleCount: v[(b + 36) >> 2],
              dimension: Dc[v[(b + 12) >> 2]],
              format: Q[v[(b + 28) >> 2]],
              usage: v[(b + 8) >> 2],
            },
            d = v[(b + 4) >> 2];
          d && (c.label = d ? D(t, d) : '');
          if ((d = v[(b + 40) >> 2]))
            (b = v[(b + 44) >> 2]), (c.viewFormats = Array.from(u.subarray(b >> 2, (b + 4 * d) >> 2), (e) => Q[e]));
          a = R.get(a);
          return P.create(a.createTexture(c));
        },
        Ra: (a) => {
          a = R.ud[a].Yd;
          Jc.Kd(a);
          return a;
        },
        Ob: (a, b) => {
          a = v[(v[b >> 2] + 8) >> 2];
          a = 2 < a ? (a ? D(t, a) : '') : a;
          a = (dd[a] || document.querySelector(a)).getContext('webgpu');
          if (!a) return 0;
          if ((b = v[(b + 4) >> 2])) a.fe = b ? D(t, b) : '';
          return Ic.create(a);
        },
        ya: (a) => kc.release(a),
        Ea: (a) => Jc.release(a),
        M: (a, b, c) => {
          a = Jc.get(a);
          b = Array.from(u.subarray(c >> 2, (c + 4 * b) >> 2), (d) => Kc.get(d));
          a.submit(b);
        },
        pb: function (a, b, c, d, e, f) {
          c = bd(c, d);
          a = Jc.get(a);
          b = W.get(b);
          a.writeBuffer(b, c, t.subarray(e, e + f), 0, f);
        },
        ia: (a, b, c, d, e, f) => {
          a = Jc.get(a);
          b = ic(b);
          var g = v[(e + 16) >> 2],
            k = v[(e + 20) >> 2];
          a.writeTexture(
            b,
            t.subarray(c, c + d),
            {
              offset: 4294967296 * v[(e + 4 + 8) >> 2] + v[(e + 8) >> 2],
              bytesPerRow: 4294967295 === g ? void 0 : g,
              rowsPerImage: 4294967295 === k ? void 0 : k,
            },
            gc(f),
          );
        },
        S: (a, b, c, d, e, f) => {
          T.get(a).drawIndexed(b, c, d, e, f);
        },
        fa: (a) => {
          T.get(a).end();
        },
        ea: (a) => T.release(a),
        m: (a, b, c, d, e) => {
          a = T.get(a);
          c = Nc.get(c);
          if (0 == d) a.setBindGroup(b, c);
          else {
            for (var f = [], g = 0; g < d; g++, e += 4) f.push(v[e >> 2]);
            a.setBindGroup(b, c, f);
          }
        },
        rb: function (a, b, c, d, e, f, g) {
          d = bd(d, e);
          f = bd(f, g);
          a = T.get(a);
          b = W.get(b);
          -1 == f && (f = void 0);
          a.setIndexBuffer(b, vc[c], d, f);
        },
        n: (a, b) => {
          a = T.get(a);
          b = Sc.get(b);
          a.setPipeline(b);
        },
        w: (a, b, c, d, e) => {
          T.get(a).setScissorRect(b, c, d, e);
        },
        p: (a, b) => {
          T.get(a).setStencilReference(b);
        },
        sb: function (a, b, c, d, e, f, g) {
          d = bd(d, e);
          f = bd(f, g);
          a = T.get(a);
          c = W.get(c);
          -1 == f && (f = void 0);
          a.setVertexBuffer(b, c, d, f);
        },
        za: (a) => Sc.release(a),
        Ha: (a) => Oc.release(a),
        xa: (a) => Uc.release(a),
        ra: (a, b) => {
          var c = v[(b + 4) >> 2];
          a = Ic.get(a);
          var d = [v[(b + 28) >> 2], v[(b + 32) >> 2]];
          0 !== d[0] && (a.canvas.width = d[0]);
          0 !== d[1] && (a.canvas.height = d[1]);
          c = {
            device: R.get(c),
            format: Q[v[(b + 8) >> 2]],
            usage: v[(b + 12) >> 2],
            alphaMode: nc[v[(b + 24) >> 2]],
          };
          if ((d = v[(b + 16) >> 2]))
            (b = v[(b + 20) >> 2]), (c.viewFormats = Array.from(u.subarray(b >> 2, (b + 4 * d) >> 2), (e) => Q[e]));
          a.configure(c);
        },
        qa: (a, b) => {
          a = Ic.get(a);
          try {
            var c = P.create(a.getCurrentTexture());
            v[b >> 2] = c;
            u[(b + 4) >> 2] = 0;
            u[(b + 8) >> 2] = 0;
          } catch (d) {
            (v[b >> 2] = 0), (u[(b + 4) >> 2] = 0), (u[(b + 8) >> 2] = 5);
          }
        },
        ma: (a) => Ic.release(a),
        sa: (a) => {
          Ic.get(a).unconfigure();
        },
        Ka: (a, b) => {
          if (b) {
            var c = v[(b + 20) >> 2];
            var d = v[(b + 28) >> 2];
            c = {
              format: Q[v[(b + 8) >> 2]],
              dimension: Fc[v[(b + 12) >> 2]],
              baseMipLevel: v[(b + 16) >> 2],
              mipLevelCount: 4294967295 === c ? void 0 : c,
              baseArrayLayer: v[(b + 24) >> 2],
              arrayLayerCount: 4294967295 === d ? void 0 : d,
              aspect: hc[v[(b + 32) >> 2]],
            };
            (b = v[(b + 4) >> 2]) && (c.label = b ? D(t, b) : '');
          }
          a = P.get(a);
          return Pc.create(a.createView(c));
        },
        Ia: (a) => P.get(a).destroy(),
        La: (a) => {
          a = P.get(a);
          return Q.indexOf(a.format);
        },
        Ma: (a) => P.get(a).height,
        Na: (a) => P.get(a).width,
        ha: (a) => P.release(a),
        Ja: (a) => Pc.release(a),
      },
      N = (function () {
        function a(c) {
          N = c.exports;
          N = Ib();
          ka = N.Tb;
          pa();
          ra.unshift(N.Ub);
          C--;
          h.monitorRunDependencies?.(C);
          0 == C && (null !== ua && (clearInterval(ua), (ua = null)), va && ((c = va), (va = null), c()));
          return N;
        }
        C++;
        h.monitorRunDependencies?.(C);
        var b = { a: ce };
        if (h.instantiateWasm)
          try {
            return h.instantiateWasm(b, a);
          } catch (c) {
            ia(`Module.instantiateWasm callback failed with error: ${c}`), ba(c);
          }
        ya ??= xa('DotLottiePlayer.wasm')
          ? 'DotLottiePlayer.wasm'
          : h.locateFile
          ? h.locateFile('DotLottiePlayer.wasm', l)
          : l + 'DotLottiePlayer.wasm';
        Da(b, function (c) {
          a(c.instance);
        }).catch(ba);
        return {};
      })(),
      kd = (a) => (kd = N.Vb)(a),
      zb = (a) => (zb = N.Wb)(a),
      M = (a) => (M = N.Xb)(a),
      ld = (a, b) => (ld = N.Zb)(a, b),
      X = (a, b) => (X = N._b)(a, b),
      Na = (a) => (Na = N.$b)(a),
      Y = (a) => (Y = N.ac)(a),
      Z = () => (Z = N.cc)(),
      jd = (a) => (jd = N.dc)(a),
      gd = (a) => (gd = N.ec)(a),
      Oa = (a, b, c) => (Oa = N.fc)(a, b, c),
      hd = (a) => (hd = N.gc)(a),
      de = (h.dynCall_viii = (a, b, c, d) => (de = h.dynCall_viii = N.hc)(a, b, c, d)),
      dynCall_vi = (h.dynCall_vi = (a, b) => (dynCall_vi = h.dynCall_vi = N.ic)(a, b)),
      dynCall_vii = (h.dynCall_vii = (a, b, c) => (dynCall_vii = h.dynCall_vii = N.jc)(a, b, c)),
      ee = (h.dynCall_viiii = (a, b, c, d, e) => (ee = h.dynCall_viiii = N.kc)(a, b, c, d, e)),
      dynCall_iii = (h.dynCall_iii = (a, b, c) => (dynCall_iii = h.dynCall_iii = N.lc)(a, b, c)),
      fe = (h.dynCall_ii = (a, b) => (fe = h.dynCall_ii = N.mc)(a, b)),
      ge = (h.dynCall_iiff = (a, b, c, d) => (ge = h.dynCall_iiff = N.nc)(a, b, c, d)),
      he = (h.dynCall_ji = (a, b) => (he = h.dynCall_ji = N.oc)(a, b)),
      ie = (h.dynCall_fi = (a, b) => (ie = h.dynCall_fi = N.pc)(a, b)),
      je = (h.dynCall_iif = (a, b, c) => (je = h.dynCall_iif = N.qc)(a, b, c)),
      ke = (h.dynCall_iiiiii = (a, b, c, d, e, f) => (ke = h.dynCall_iiiiii = N.rc)(a, b, c, d, e, f)),
      le = (h.dynCall_iiii = (a, b, c, d) => (le = h.dynCall_iiii = N.sc)(a, b, c, d)),
      me = (h.dynCall_iiiif = (a, b, c, d, e) => (me = h.dynCall_iiiif = N.tc)(a, b, c, d, e)),
      ne = (h.dynCall_viiiii = (a, b, c, d, e, f) => (ne = h.dynCall_viiiii = N.uc)(a, b, c, d, e, f)),
      oe = (h.dynCall_iiiii = (a, b, c, d, e) => (oe = h.dynCall_iiiii = N.vc)(a, b, c, d, e)),
      pe = (h.dynCall_jii = (a, b, c) => (pe = h.dynCall_jii = N.wc)(a, b, c)),
      qe = (h.dynCall_fii = (a, b, c) => (qe = h.dynCall_fii = N.xc)(a, b, c));
    h.dynCall_iijj = (a, b, c, d, e, f) => (h.dynCall_iijj = N.yc)(a, b, c, d, e, f);
    h.dynCall_vijj = (a, b, c, d, e, f) => (h.dynCall_vijj = N.zc)(a, b, c, d, e, f);
    var re = (h.dynCall_vidi = (a, b, c, d) => (re = h.dynCall_vidi = N.Ac)(a, b, c, d)),
      se = (h.dynCall_vij = (a, b, c, d) => (se = h.dynCall_vij = N.Bc)(a, b, c, d)),
      te = (h.dynCall_jjji = (a, b, c, d, e, f) => (te = h.dynCall_jjji = N.Cc)(a, b, c, d, e, f)),
      ue = (h.dynCall_viijj = (a, b, c, d, e, f, g) => (ue = h.dynCall_viijj = N.Dc)(a, b, c, d, e, f, g)),
      ve = (h.dynCall_viijji = (a, b, c, d, e, f, g, k) => (ve = h.dynCall_viijji = N.Ec)(a, b, c, d, e, f, g, k)),
      we = (h.dynCall_viij = (a, b, c, d, e) => (we = h.dynCall_viij = N.Fc)(a, b, c, d, e)),
      xe = (h.dynCall_iiiijj = (a, b, c, d, e, f, g, k) => (xe = h.dynCall_iiiijj = N.Gc)(a, b, c, d, e, f, g, k)),
      ye = (h.dynCall_viiij = (a, b, c, d, e, f) => (ye = h.dynCall_viiij = N.Hc)(a, b, c, d, e, f)),
      ze = (h.dynCall_viiiiii = (a, b, c, d, e, f, g) => (ze = h.dynCall_viiiiii = N.Ic)(a, b, c, d, e, f, g)),
      Ae = (h.dynCall_viijii = (a, b, c, d, e, f, g) => (Ae = h.dynCall_viijii = N.Jc)(a, b, c, d, e, f, g)),
      Be = (h.dynCall_viiiff = (a, b, c, d, e, f) => (Be = h.dynCall_viiiff = N.Kc)(a, b, c, d, e, f)),
      Ce = (h.dynCall_vif = (a, b, c) => (Ce = h.dynCall_vif = N.Lc)(a, b, c)),
      De = (h.dynCall_vijiji = (a, b, c, d, e, f, g, k) => (De = h.dynCall_vijiji = N.Mc)(a, b, c, d, e, f, g, k)),
      Ee = (h.dynCall_ffff = (a, b, c, d) => (Ee = h.dynCall_ffff = N.Nc)(a, b, c, d)),
      Fe = (h.dynCall_viiif = (a, b, c, d, e) => (Fe = h.dynCall_viiif = N.Oc)(a, b, c, d, e)),
      Ge = (h.dynCall_iiiiff = (a, b, c, d, e, f) => (Ge = h.dynCall_iiiiff = N.Pc)(a, b, c, d, e, f)),
      He = (h.dynCall_jiii = (a, b, c, d) => (He = h.dynCall_jiii = N.Qc)(a, b, c, d)),
      Ie = (h.dynCall_iiiiiiii = (a, b, c, d, e, f, g, k) => (Ie = h.dynCall_iiiiiiii = N.Rc)(a, b, c, d, e, f, g, k)),
      Je = (h.dynCall_viiiiiii = (a, b, c, d, e, f, g, k) => (Je = h.dynCall_viiiiiii = N.Sc)(a, b, c, d, e, f, g, k));
    h.dynCall_viif = (a, b, c, d) => (h.dynCall_viif = N.Tc)(a, b, c, d);
    var Ke = (h.dynCall_viiiiff = (a, b, c, d, e, f, g) => (Ke = h.dynCall_viiiiff = N.Uc)(a, b, c, d, e, f, g)),
      Le = (h.dynCall_viiji = (a, b, c, d, e, f) => (Le = h.dynCall_viiji = N.Vc)(a, b, c, d, e, f)),
      Me = (h.dynCall_viiiji = (a, b, c, d, e, f, g) => (Me = h.dynCall_viiiji = N.Wc)(a, b, c, d, e, f, g)),
      Ne = (h.dynCall_viijiii = (a, b, c, d, e, f, g, k) => (Ne = h.dynCall_viijiii = N.Xc)(a, b, c, d, e, f, g, k)),
      Oe = (h.dynCall_iji = (a, b, c, d) => (Oe = h.dynCall_iji = N.Yc)(a, b, c, d)),
      dynCall_v = (h.dynCall_v = (a) => (dynCall_v = h.dynCall_v = N.Zc)(a)),
      Pe = (h.dynCall_vijjjj = (a, b, c, d, e, f, g, k, m, n) =>
        (Pe = h.dynCall_vijjjj = N._c)(a, b, c, d, e, f, g, k, m, n));
    h.dynCall_i = (a) => (h.dynCall_i = N.$c)(a);
    h.dynCall_iiiiiii = (a, b, c, d, e, f, g) => (h.dynCall_iiiiiii = N.ad)(a, b, c, d, e, f, g);
    h.dynCall_iiif = (a, b, c, d) => (h.dynCall_iiif = N.bd)(a, b, c, d);
    h.dynCall_iiiff = (a, b, c, d, e) => (h.dynCall_iiiff = N.cd)(a, b, c, d, e);
    h.dynCall_iidiiii = (a, b, c, d, e, f, g) => (h.dynCall_iidiiii = N.dd)(a, b, c, d, e, f, g);
    h.dynCall_iiiiiiiii = (a, b, c, d, e, f, g, k, m) => (h.dynCall_iiiiiiiii = N.ed)(a, b, c, d, e, f, g, k, m);
    h.dynCall_iiiifi = (a, b, c, d, e, f) => (h.dynCall_iiiifi = N.fd)(a, b, c, d, e, f);
    h.dynCall_iiiiij = (a, b, c, d, e, f, g) => (h.dynCall_iiiiij = N.gd)(a, b, c, d, e, f, g);
    h.dynCall_iiiiid = (a, b, c, d, e, f) => (h.dynCall_iiiiid = N.hd)(a, b, c, d, e, f);
    h.dynCall_iiiiijj = (a, b, c, d, e, f, g, k, m) => (h.dynCall_iiiiijj = N.id)(a, b, c, d, e, f, g, k, m);
    h.dynCall_iiiiiijj = (a, b, c, d, e, f, g, k, m, n) => (h.dynCall_iiiiiijj = N.jd)(a, b, c, d, e, f, g, k, m, n);
    function Jd(a, b, c) {
      var d = Z();
      try {
        dynCall_vii(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function Kd(a, b, c, d) {
      var e = Z();
      try {
        de(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function Gd(a, b) {
      var c = Z();
      try {
        dynCall_vi(a, b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function Nd(a, b, c, d, e) {
      var f = Z();
      try {
        ee(a, b, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function pd(a, b) {
      var c = Z();
      try {
        return fe(a, b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function nd(a, b) {
      var c = Z();
      try {
        return ie(a, b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function qd(a, b, c) {
      var d = Z();
      try {
        return je(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function td(a, b, c, d) {
      var e = Z();
      try {
        return le(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function rd(a, b, c, d) {
      var e = Z();
      try {
        return ge(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function xd(a, b, c, d, e, f) {
      var g = Z();
      try {
        return ke(a, b, c, d, e, f);
      } catch (k) {
        Y(g);
        if (k !== k + 0) throw k;
        X(1, 0);
      }
    }
    function wd(a, b, c, d, e) {
      var f = Z();
      try {
        return oe(a, b, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function sd(a, b, c) {
      var d = Z();
      try {
        return dynCall_iii(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function ud(a, b, c, d, e) {
      var f = Z();
      try {
        return me(a, b, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function Pd(a, b, c, d, e, f) {
      var g = Z();
      try {
        ne(a, b, c, d, e, f);
      } catch (k) {
        Y(g);
        if (k !== k + 0) throw k;
        X(1, 0);
      }
    }
    function od(a, b, c) {
      var d = Z();
      try {
        return qe(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function Qd(a, b, c, d, e, f, g) {
      var k = Z();
      try {
        ze(a, b, c, d, e, f, g);
      } catch (m) {
        Y(k);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function Rd(a, b, c, d, e, f, g, k) {
      var m = Z();
      try {
        Je(a, b, c, d, e, f, g, k);
      } catch (n) {
        Y(m);
        if (n !== n + 0) throw n;
        X(1, 0);
      }
    }
    function Hd(a, b, c, d) {
      var e = Z();
      try {
        re(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function Id(a, b, c) {
      var d = Z();
      try {
        Ce(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function md(a, b, c, d) {
      var e = Z();
      try {
        return Ee(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function Od(a, b, c, d, e, f, g) {
      var k = Z();
      try {
        Ke(a, b, c, d, e, f, g);
      } catch (m) {
        Y(k);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function vd(a, b, c, d, e, f) {
      var g = Z();
      try {
        return Ge(a, b, c, d, e, f);
      } catch (k) {
        Y(g);
        if (k !== k + 0) throw k;
        X(1, 0);
      }
    }
    function Ld(a, b, c, d, e) {
      var f = Z();
      try {
        Fe(a, b, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function Md(a, b, c, d, e, f) {
      var g = Z();
      try {
        Be(a, b, c, d, e, f);
      } catch (k) {
        Y(g);
        if (k !== k + 0) throw k;
        X(1, 0);
      }
    }
    function yd(a, b, c, d, e, f, g, k) {
      var m = Z();
      try {
        return Ie(a, b, c, d, e, f, g, k);
      } catch (n) {
        Y(m);
        if (n !== n + 0) throw n;
        X(1, 0);
      }
    }
    function Fd(a) {
      var b = Z();
      try {
        dynCall_v(a);
      } catch (c) {
        Y(b);
        if (c !== c + 0) throw c;
        X(1, 0);
      }
    }
    function Bd(a, b) {
      var c = Z();
      try {
        return he(a, b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function Cd(a, b, c) {
      var d = Z();
      try {
        return pe(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function Wd(a, b, c, d, e, f, g) {
      var k = Z();
      try {
        Ae(a, b, c, d, e, f, g);
      } catch (m) {
        Y(k);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function Dd(a, b, c, d) {
      var e = Z();
      try {
        return He(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function Zd(a, b, c, d, e, f, g, k) {
      var m = Z();
      try {
        ve(a, b, c, d, e, f, g, k);
      } catch (n) {
        Y(m);
        if (n !== n + 0) throw n;
        X(1, 0);
      }
    }
    function $d(a, b, c, d) {
      var e = Z();
      try {
        se(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function Yd(a, b, c, d, e, f, g) {
      var k = Z();
      try {
        ue(a, b, c, d, e, f, g);
      } catch (m) {
        Y(k);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function Ed(a, b, c, d, e, f) {
      var g = Z();
      try {
        return te(a, b, c, d, e, f);
      } catch (k) {
        Y(g);
        if (k !== k + 0) throw k;
        X(1, 0);
      }
    }
    function Ud(a, b, c, d, e) {
      var f = Z();
      try {
        we(a, b, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function zd(a, b, c, d, e, f, g, k) {
      var m = Z();
      try {
        return xe(a, b, c, d, e, f, g, k);
      } catch (n) {
        Y(m);
        if (n !== n + 0) throw n;
        X(1, 0);
      }
    }
    function Sd(a, b, c, d, e, f) {
      var g = Z();
      try {
        ye(a, b, c, d, e, f);
      } catch (k) {
        Y(g);
        if (k !== k + 0) throw k;
        X(1, 0);
      }
    }
    function ae(a, b, c, d, e, f, g, k) {
      var m = Z();
      try {
        De(a, b, c, d, e, f, g, k);
      } catch (n) {
        Y(m);
        if (n !== n + 0) throw n;
        X(1, 0);
      }
    }
    function Vd(a, b, c, d, e, f) {
      var g = Z();
      try {
        Le(a, b, c, d, e, f);
      } catch (k) {
        Y(g);
        if (k !== k + 0) throw k;
        X(1, 0);
      }
    }
    function Td(a, b, c, d, e, f, g) {
      var k = Z();
      try {
        Me(a, b, c, d, e, f, g);
      } catch (m) {
        Y(k);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function Xd(a, b, c, d, e, f, g, k) {
      var m = Z();
      try {
        Ne(a, b, c, d, e, f, g, k);
      } catch (n) {
        Y(m);
        if (n !== n + 0) throw n;
        X(1, 0);
      }
    }
    function Ad(a, b, c, d) {
      var e = Z();
      try {
        return Oe(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function be(a, b, c, d, e, f, g, k, m, n) {
      var q = Z();
      try {
        Pe(a, b, c, d, e, f, g, k, m, n);
      } catch (r) {
        Y(q);
        if (r !== r + 0) throw r;
        X(1, 0);
      }
    }
    var Qe;
    va = function Re() {
      Qe || Se();
      Qe || (va = Re);
    };
    function Se() {
      function a() {
        if (!Qe && ((Qe = !0), (h.calledRun = !0), !la)) {
          Ga(ra);
          aa(h);
          h.onRuntimeInitialized?.();
          if (h.postRun)
            for ('function' == typeof h.postRun && (h.postRun = [h.postRun]); h.postRun.length; ) {
              var b = h.postRun.shift();
              sa.unshift(b);
            }
          Ga(sa);
        }
      }
      if (!(0 < C)) {
        if (h.preRun) for ('function' == typeof h.preRun && (h.preRun = [h.preRun]); h.preRun.length; ) ta();
        Ga(qa);
        0 < C ||
          (h.setStatus
            ? (h.setStatus('Running...'),
              setTimeout(() => {
                setTimeout(() => h.setStatus(''), 1);
                a();
              }, 1))
            : a());
      }
    }
    if (h.preInit)
      for ('function' == typeof h.preInit && (h.preInit = [h.preInit]); 0 < h.preInit.length; ) h.preInit.pop()();
    Se();
    moduleRtn = ca;

    return moduleRtn;
  };
})();
export default createDotLottiePlayerModule;
