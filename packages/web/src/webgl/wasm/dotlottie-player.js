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
      n = '',
      fa;
    'undefined' != typeof document && document.currentScript && (n = document.currentScript.src);
    _scriptName && (n = _scriptName);
    n.startsWith('blob:') ? (n = '') : (n = n.substr(0, n.replace(/[?#].*/, '').lastIndexOf('/') + 1));
    fa = (a) =>
      fetch(a, { credentials: 'same-origin' }).then((b) =>
        b.ok ? b.arrayBuffer() : Promise.reject(Error(b.status + ' : ' + b.url)),
      );
    var ha = k.print || console.log.bind(console),
      p = k.printErr || console.error.bind(console);
    Object.assign(k, da);
    da = null;
    k.thisProgram && (ea = k.thisProgram);
    var ia = k.wasmBinary,
      ja,
      ka = !1,
      la,
      r,
      t,
      u,
      ma,
      w,
      x,
      na,
      oa;
    function pa() {
      var a = ja.buffer;
      k.HEAP8 = r = new Int8Array(a);
      k.HEAP16 = u = new Int16Array(a);
      k.HEAPU8 = t = new Uint8Array(a);
      k.HEAPU16 = ma = new Uint16Array(a);
      k.HEAP32 = w = new Int32Array(a);
      k.HEAPU32 = x = new Uint32Array(a);
      k.HEAPF32 = na = new Float32Array(a);
      k.HEAPF64 = oa = new Float64Array(a);
    }
    var qa = [],
      ta = [],
      ua = [];
    function va() {
      var a = k.preRun.shift();
      qa.unshift(a);
    }
    var y = 0,
      wa = null,
      xa = null;
    function ya(a) {
      k.onAbort?.(a);
      a = 'Aborted(' + a + ')';
      p(a);
      ka = !0;
      a = new WebAssembly.RuntimeError(a + '. Build with -sASSERTIONS for more info.');
      ba(a);
      throw a;
    }
    var za = (a) => a.startsWith('data:application/octet-stream;base64,'),
      Aa;
    function Ba(a) {
      if (a == Aa && ia) return new Uint8Array(ia);
      throw 'both async and sync fetching of the wasm failed';
    }
    function Ca(a) {
      return ia
        ? Promise.resolve().then(() => Ba(a))
        : fa(a).then(
            (b) => new Uint8Array(b),
            () => Ba(a),
          );
    }
    function Da(a, b, c) {
      return Ca(a)
        .then((d) => WebAssembly.instantiate(d, b))
        .then(c, (d) => {
          p(`failed to asynchronously prepare wasm: ${d}`);
          ya(d);
        });
    }
    function Ea(a, b) {
      var c = Aa;
      return ia || 'function' != typeof WebAssembly.instantiateStreaming || za(c) || 'function' != typeof fetch
        ? Da(c, a, b)
        : fetch(c, { credentials: 'same-origin' }).then((d) =>
            WebAssembly.instantiateStreaming(d, a).then(b, function (e) {
              p(`wasm streaming compile failed: ${e}`);
              p('falling back to ArrayBuffer instantiation');
              return Da(c, a, b);
            }),
          );
    }
    class Fa {
      name = 'ExitStatus';
      constructor(a) {
        this.message = `Program terminated with exit(${a})`;
        this.status = a;
      }
    }
    var Ga = (a) => {
        for (; 0 < a.length; ) a.shift()(k);
      },
      Ha = k.noExitRuntime || !0,
      Ia = 'undefined' != typeof TextDecoder ? new TextDecoder() : void 0,
      A = (a, b = 0, c = NaN) => {
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
        this.le = a;
        this.wd = a - 24;
      }
    }
    var Pa = (a) => {
        var b = La;
        if (!b) return Na(0), 0;
        var c = new Ma(b);
        x[(c.wd + 16) >> 2] = b;
        var d = x[(c.wd + 4) >> 2];
        if (!d) return Na(0), b;
        for (var e of a) {
          if (0 === e || e === d) break;
          if (Oa(e, d, c.wd + 16)) return Na(e), b;
        }
        Na(d);
        return b;
      },
      C = (a, b, c) => {
        var d = t;
        if (!(0 < c)) return 0;
        var e = b;
        c = b + c - 1;
        for (var f = 0; f < a.length; ++f) {
          var g = a.charCodeAt(f);
          if (55296 <= g && 57343 >= g) {
            var h = a.charCodeAt(++f);
            g = (65536 + ((g & 1023) << 10)) | (h & 1023);
          }
          if (127 >= g) {
            if (b >= c) break;
            d[b++] = g;
          } else {
            if (2047 >= g) {
              if (b + 1 >= c) break;
              d[b++] = 192 | (g >> 6);
            } else {
              if (65535 >= g) {
                if (b + 2 >= c) break;
                d[b++] = 224 | (g >> 12);
              } else {
                if (b + 3 >= c) break;
                d[b++] = 240 | (g >> 18);
                d[b++] = 128 | ((g >> 12) & 63);
              }
              d[b++] = 128 | ((g >> 6) & 63);
            }
            d[b++] = 128 | (g & 63);
          }
        }
        d[b] = 0;
        return b - e;
      },
      Qa = {},
      Ra = (a) => {
        for (; a.length; ) {
          var b = a.pop();
          a.pop()(b);
        }
      };
    function Sa(a) {
      return this.fromWireType(x[a >> 2]);
    }
    var Ta = {},
      E = {},
      Ua = {},
      Va,
      G = (a, b, c) => {
        function d(h) {
          h = c(h);
          if (h.length !== a.length) throw new Va('Mismatched type converter count');
          for (var l = 0; l < a.length; ++l) F(a[l], h[l]);
        }
        a.forEach((h) => (Ua[h] = b));
        var e = Array(b.length),
          f = [],
          g = 0;
        b.forEach((h, l) => {
          E.hasOwnProperty(h)
            ? (e[l] = E[h])
            : (f.push(h),
              Ta.hasOwnProperty(h) || (Ta[h] = []),
              Ta[h].push(() => {
                e[l] = E[h];
                ++g;
                g === f.length && d(e);
              }));
        });
        0 === f.length && d(e);
      },
      Wa,
      H = (a) => {
        for (var b = ''; t[a]; ) b += Wa[t[a++]];
        return b;
      },
      K;
    function Xa(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new K(`type "${d}" must have a positive integer typeid pointer`);
      if (E.hasOwnProperty(a)) {
        if (c.te) return;
        throw new K(`Cannot register type '${d}' twice`);
      }
      E[a] = b;
      delete Ua[a];
      Ta.hasOwnProperty(a) && ((b = Ta[a]), delete Ta[a], b.forEach((e) => e()));
    }
    function F(a, b, c = {}) {
      return Xa(a, b, c);
    }
    var Ya = (a) => {
        throw new K(a.jc.yd.xd.name + ' instance already deleted');
      },
      Za = !1,
      $a = () => {},
      ab = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.Bd) return null;
        a = ab(a, b, c.Bd);
        return null === a ? null : c.ke(a);
      },
      bb = {},
      cb = {},
      db = (a, b) => {
        if (void 0 === b) throw new K('ptr should not be undefined');
        for (; a.Bd; ) (b = a.Nd(b)), (a = a.Bd);
        return cb[b];
      },
      fb = (a, b) => {
        if (!b.yd || !b.wd) throw new Va('makeClassHandle requires ptr and ptrType');
        if (!!b.Cd !== !!b.Ad) throw new Va('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return eb(Object.create(a, { jc: { value: b, writable: !0 } }));
      },
      eb = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (eb = (b) => b), a;
        Za = new FinalizationRegistry((b) => {
          b = b.jc;
          --b.count.value;
          0 === b.count.value && (b.Ad ? b.Cd.Fd(b.Ad) : b.yd.xd.Fd(b.wd));
        });
        eb = (b) => {
          var c = b.jc;
          c.Ad && Za.register(b, { jc: c }, b);
          return b;
        };
        $a = (b) => {
          Za.unregister(b);
        };
        return eb(a);
      },
      hb = [];
    function ib() {}
    var jb = (a, b) => Object.defineProperty(b, 'name', { value: a }),
      kb = (a, b, c) => {
        if (void 0 === a[b].zd) {
          var d = a[b];
          a[b] = function (...e) {
            if (!a[b].zd.hasOwnProperty(e.length))
              throw new K(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].zd})!`,
              );
            return a[b].zd[e.length].apply(this, e);
          };
          a[b].zd = [];
          a[b].zd[d.Jd] = d;
        }
      },
      lb = (a, b, c) => {
        if (k.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== k[a].zd && void 0 !== k[a].zd[c]))
            throw new K(`Cannot register public name '${a}' twice`);
          kb(k, a, a);
          if (k[a].zd.hasOwnProperty(c))
            throw new K(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          k[a].zd[c] = b;
        } else (k[a] = b), (k[a].Jd = c);
      },
      mb = (a) => {
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function nb(a, b, c, d, e, f, g, h) {
      this.name = a;
      this.constructor = b;
      this.Hd = c;
      this.Fd = d;
      this.Bd = e;
      this.oe = f;
      this.Nd = g;
      this.ke = h;
      this.we = [];
    }
    var ob = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.Nd) throw new K(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.Nd(a);
        b = b.Bd;
      }
      return a;
    };
    function pb(a, b) {
      if (null === b) {
        if (this.Ud) throw new K(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.jc) throw new K(`Cannot pass "${qb(b)}" as a ${this.name}`);
      if (!b.jc.wd) throw new K(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return ob(b.jc.wd, b.jc.yd.xd, this.xd);
    }
    function rb(a, b) {
      if (null === b) {
        if (this.Ud) throw new K(`null is not a valid ${this.name}`);
        if (this.Pd) {
          var c = this.Vd();
          null !== a && a.push(this.Fd, c);
          return c;
        }
        return 0;
      }
      if (!b || !b.jc) throw new K(`Cannot pass "${qb(b)}" as a ${this.name}`);
      if (!b.jc.wd) throw new K(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.Od && b.jc.yd.Od)
        throw new K(
          `Cannot convert argument of type ${b.jc.Cd ? b.jc.Cd.name : b.jc.yd.name} to parameter type ${this.name}`,
        );
      c = ob(b.jc.wd, b.jc.yd.xd, this.xd);
      if (this.Pd) {
        if (void 0 === b.jc.Ad) throw new K('Passing raw pointer to smart pointer is illegal');
        switch (this.Be) {
          case 0:
            if (b.jc.Cd === this) c = b.jc.Ad;
            else
              throw new K(
                `Cannot convert argument of type ${b.jc.Cd ? b.jc.Cd.name : b.jc.yd.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            c = b.jc.Ad;
            break;
          case 2:
            if (b.jc.Cd === this) c = b.jc.Ad;
            else {
              var d = b.clone();
              c = this.xe(
                c,
                sb(() => d['delete']()),
              );
              null !== a && a.push(this.Fd, c);
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
        if (this.Ud) throw new K(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.jc) throw new K(`Cannot pass "${qb(b)}" as a ${this.name}`);
      if (!b.jc.wd) throw new K(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.jc.yd.Od) throw new K(`Cannot convert argument of type ${b.jc.yd.name} to parameter type ${this.name}`);
      return ob(b.jc.wd, b.jc.yd.xd, this.xd);
    }
    function ub(a, b, c, d, e, f, g, h, l, m, q) {
      this.name = a;
      this.xd = b;
      this.Ud = c;
      this.Od = d;
      this.Pd = e;
      this.ve = f;
      this.Be = g;
      this.ee = h;
      this.Vd = l;
      this.xe = m;
      this.Fd = q;
      e || void 0 !== b.Bd ? (this.toWireType = rb) : ((this.toWireType = d ? pb : tb), (this.Ed = null));
    }
    var vb = (a, b, c) => {
        if (!k.hasOwnProperty(a)) throw new Va('Replacing nonexistent public symbol');
        void 0 !== k[a].zd && void 0 !== c ? (k[a].zd[c] = b) : ((k[a] = b), (k[a].Jd = c));
      },
      wb = (a, b, c = []) => {
        a = a.replace(/p/g, 'i');
        return (0, k['dynCall_' + a])(b, ...c);
      },
      xb =
        (a, b) =>
        (...c) =>
          wb(a, b, c),
      L = (a, b) => {
        a = H(a);
        var c = xb(a, b);
        if ('function' != typeof c) throw new K(`unknown function pointer with signature ${a}: ${b}`);
        return c;
      },
      yb,
      Ab = (a) => {
        a = zb(a);
        var b = H(a);
        N(a);
        return b;
      },
      Bb = (a, b) => {
        function c(f) {
          e[f] || E[f] || (Ua[f] ? Ua[f].forEach(c) : (d.push(f), (e[f] = !0)));
        }
        var d = [],
          e = {};
        b.forEach(c);
        throw new yb(`${a}: ` + d.map(Ab).join([', ']));
      },
      Cb = (a, b) => {
        for (var c = [], d = 0; d < a; d++) c.push(x[(b + 4 * d) >> 2]);
        return c;
      };
    function Db(a) {
      for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].Ed) return !0;
      return !1;
    }
    var Eb = (a) => {
        if (!(a instanceof Fa || 'unwind' == a)) throw a;
      },
      Fb = 0,
      Gb = (a) => {
        la = a;
        Ha || 0 < Fb || (k.onExit?.(a), (ka = !0));
        throw new Fa(a);
      },
      Hb = (a) => {
        if (!ka)
          try {
            if ((a(), !(Ha || 0 < Fb)))
              try {
                (la = a = la), Gb(a);
              } catch (b) {
                Eb(b);
              }
          } catch (b) {
            Eb(b);
          }
      };
    function Ib() {
      var a = O,
        b = {};
      for (let [c, d] of Object.entries(a))
        b[c] =
          'function' == typeof d
            ? (...e) => {
                Jb.push(c);
                try {
                  return d(...e);
                } finally {
                  ka || Jb.pop();
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
        h = Db(b),
        l = 'void' !== b[0].name,
        m = f - 2,
        q = Array(m),
        v = [],
        z = [];
      return jb(a, function (...I) {
        z.length = 0;
        v.length = g ? 2 : 1;
        v[0] = e;
        if (g) {
          var B = b[1].toWireType(z, this);
          v[1] = B;
        }
        for (var D = 0; D < m; ++D) (q[D] = b[D + 2].toWireType(z, I[D])), v.push(q[D]);
        I = d(...v);
        if (h) Ra(z);
        else
          for (D = g ? 1 : 2; D < b.length; D++) {
            var M = 1 === D ? B : q[D - 2];
            null !== b[D].Ed && b[D].Ed(M);
          }
        B = l ? b[0].fromWireType(I) : void 0;
        return B;
      });
    }
    var Lb = (a) => {
        a = a.trim();
        const b = a.indexOf('(');
        return -1 !== b ? a.substr(0, b) : a;
      },
      Mb = [],
      P = [],
      Nb = (a) => {
        9 < a && 0 === --P[a + 1] && ((P[a] = void 0), Mb.push(a));
      },
      Ob = (a) => {
        if (!a) throw new K('Cannot use deleted val. handle = ' + a);
        return P[a];
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
            const b = Mb.pop() || P.length;
            P[b] = a;
            P[b + 1] = 1;
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
        Dd: 8,
        readValueFromPointer: Sa,
        Ed: null,
      },
      Qb = (a, b, c) => {
        switch (b) {
          case 1:
            return c
              ? function (d) {
                  return this.fromWireType(r[d]);
                }
              : function (d) {
                  return this.fromWireType(t[d]);
                };
          case 2:
            return c
              ? function (d) {
                  return this.fromWireType(u[d >> 1]);
                }
              : function (d) {
                  return this.fromWireType(ma[d >> 1]);
                };
          case 4:
            return c
              ? function (d) {
                  return this.fromWireType(w[d >> 2]);
                }
              : function (d) {
                  return this.fromWireType(x[d >> 2]);
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
      Tb = (a, b, c) => {
        switch (b) {
          case 1:
            return c ? (d) => r[d] : (d) => t[d];
          case 2:
            return c ? (d) => u[d >> 1] : (d) => ma[d >> 1];
          case 4:
            return c ? (d) => w[d >> 2] : (d) => x[d >> 2];
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Ub = Object.assign({ optional: !0 }, Pb),
      Vb = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Wb = (a, b) => {
        var c = a >> 1;
        for (var d = c + b / 2; !(c >= d) && ma[c]; ) ++c;
        c <<= 1;
        if (32 < c - a && Vb) return Vb.decode(t.subarray(a, c));
        c = '';
        for (d = 0; !(d >= b / 2); ++d) {
          var e = u[(a + 2 * d) >> 1];
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
        for (var e = 0; e < c; ++e) (u[b >> 1] = a.charCodeAt(e)), (b += 2);
        u[b >> 1] = 0;
        return b - d;
      },
      Yb = (a) => 2 * a.length,
      Zb = (a, b) => {
        for (var c = 0, d = ''; !(c >= b / 4); ) {
          var e = w[(a + 4 * c) >> 2];
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
          w[b >> 2] = f;
          b += 4;
          if (b + 4 > c) break;
        }
        w[b >> 2] = 0;
        return b - d;
      },
      bc = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          b += 4;
        }
        return b;
      },
      cc = [],
      dc = (a) => {
        var b = cc.length;
        cc.push(a);
        return b;
      },
      ec = (a, b) => {
        for (var c = Array(a), d = 0; d < a; ++d) c[d] = Rb(x[(b + 4 * d) >> 2], 'parameter ' + d);
        return c;
      },
      fc = Reflect.construct,
      gc = {},
      Q,
      hc = (a) => {
        var b = a.getExtension('ANGLE_instanced_arrays');
        b &&
          ((a.vertexAttribDivisor = (c, d) => b.vertexAttribDivisorANGLE(c, d)),
          (a.drawArraysInstanced = (c, d, e, f) => b.drawArraysInstancedANGLE(c, d, e, f)),
          (a.drawElementsInstanced = (c, d, e, f, g) => b.drawElementsInstancedANGLE(c, d, e, f, g)));
      },
      ic = (a) => {
        var b = a.getExtension('OES_vertex_array_object');
        b &&
          ((a.createVertexArray = () => b.createVertexArrayOES()),
          (a.deleteVertexArray = (c) => b.deleteVertexArrayOES(c)),
          (a.bindVertexArray = (c) => b.bindVertexArrayOES(c)),
          (a.isVertexArray = (c) => b.isVertexArrayOES(c)));
      },
      jc = (a) => {
        var b = a.getExtension('WEBGL_draw_buffers');
        b && (a.drawBuffers = (c, d) => b.drawBuffersWEBGL(c, d));
      },
      kc = (a) => {
        var b =
          'ANGLE_instanced_arrays EXT_blend_minmax EXT_disjoint_timer_query EXT_frag_depth EXT_shader_texture_lod EXT_sRGB OES_element_index_uint OES_fbo_render_mipmap OES_standard_derivatives OES_texture_float OES_texture_half_float OES_texture_half_float_linear OES_vertex_array_object WEBGL_color_buffer_float WEBGL_depth_texture WEBGL_draw_buffers EXT_color_buffer_float EXT_conservative_depth EXT_disjoint_timer_query_webgl2 EXT_texture_norm16 NV_shader_noperspective_interpolation WEBGL_clip_cull_distance EXT_clip_control EXT_color_buffer_half_float EXT_depth_clamp EXT_float_blend EXT_polygon_offset_clamp EXT_texture_compression_bptc EXT_texture_compression_rgtc EXT_texture_filter_anisotropic KHR_parallel_shader_compile OES_texture_float_linear WEBGL_blend_func_extended WEBGL_compressed_texture_astc WEBGL_compressed_texture_etc WEBGL_compressed_texture_etc1 WEBGL_compressed_texture_s3tc WEBGL_compressed_texture_s3tc_srgb WEBGL_debug_renderer_info WEBGL_debug_shaders WEBGL_lose_context WEBGL_multi_draw WEBGL_polygon_mode'.split(
            ' ',
          );
        return (a.getSupportedExtensions() || []).filter((c) => b.includes(c));
      },
      lc = 1,
      mc = [],
      R = [],
      nc = [],
      oc = [],
      pc = [],
      S = [],
      qc = [],
      T = [],
      rc = (a) => {
        for (var b = lc++, c = a.length; c < b; c++) a[c] = null;
        return b;
      },
      sc = (a, b, c, d) => {
        for (var e = 0; e < a; e++) {
          var f = Q[c](),
            g = f && rc(d);
          f ? ((f.name = g), (d[g] = f)) : (U ||= 1282);
          w[(b + 4 * e) >> 2] = g;
        }
      },
      uc = (a, b) => {
        a.ce ||
          ((a.ce = a.getContext),
          (a.getContext = function (d, e) {
            e = a.ce(d, e);
            return ('webgl' == d) == e instanceof WebGLRenderingContext ? e : null;
          }));
        var c = 1 < b.de ? a.getContext('webgl2', b) : a.getContext('webgl', b);
        return c ? tc(c, b) : 0;
      },
      tc = (a, b) => {
        var c = rc(T),
          d = { handle: c, attributes: b, version: b.de, Id: a };
        a.canvas && (a.canvas.he = d);
        T[c] = d;
        ('undefined' == typeof b.ae || b.ae) && vc(d);
        return c;
      },
      vc = (a) => {
        a ||= V;
        if (!a.ue) {
          a.ue = !0;
          var b = a.Id;
          b.Ke = b.getExtension('WEBGL_multi_draw');
          b.Ge = b.getExtension('EXT_polygon_offset_clamp');
          b.Fe = b.getExtension('EXT_clip_control');
          b.Pe = b.getExtension('WEBGL_polygon_mode');
          hc(b);
          ic(b);
          jc(b);
          b.Ce = b.getExtension('WEBGL_draw_instanced_base_vertex_base_instance');
          b.Ie = b.getExtension('WEBGL_multi_draw_instanced_base_vertex_base_instance');
          2 <= a.version && (b.$d = b.getExtension('EXT_disjoint_timer_query_webgl2'));
          if (2 > a.version || !b.$d) b.$d = b.getExtension('EXT_disjoint_timer_query');
          kc(b).forEach((c) => {
            c.includes('lose_context') || c.includes('debug') || b.getExtension(c);
          });
        }
      },
      U,
      V,
      wc = [],
      xc = {},
      yc = ['default', 'low-power', 'high-performance'],
      zc = [0, document, window],
      Ac = {},
      Cc = () => {
        if (!Bc) {
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
          for (b in Ac) void 0 === Ac[b] ? delete a[b] : (a[b] = Ac[b]);
          var c = [];
          for (b in a) c.push(`${b}=${a[b]}`);
          Bc = c;
        }
        return Bc;
      },
      Bc,
      Dc = [null, [], []],
      Ec = () => {
        var a = kc(Q);
        return (a = a.concat(a.map((b) => 'GL_' + b)));
      },
      Fc = (a, b) => {
        if (b) {
          var c = void 0;
          switch (a) {
            case 36346:
              c = 1;
              break;
            case 36344:
              return;
            case 34814:
            case 36345:
              c = 0;
              break;
            case 34466:
              var d = Q.getParameter(34467);
              c = d ? d.length : 0;
              break;
            case 33309:
              if (2 > V.version) {
                U ||= 1282;
                return;
              }
              c = Ec().length;
              break;
            case 33307:
            case 33308:
              if (2 > V.version) {
                U ||= 1280;
                return;
              }
              c = 33307 == a ? 3 : 0;
          }
          if (void 0 === c)
            switch (((d = Q.getParameter(a)), typeof d)) {
              case 'number':
                c = d;
                break;
              case 'boolean':
                c = d ? 1 : 0;
                break;
              case 'string':
                U ||= 1280;
                return;
              case 'object':
                if (null === d)
                  switch (a) {
                    case 34964:
                    case 35725:
                    case 34965:
                    case 36006:
                    case 36007:
                    case 32873:
                    case 34229:
                    case 36662:
                    case 36663:
                    case 35053:
                    case 35055:
                    case 36010:
                    case 35097:
                    case 35869:
                    case 32874:
                    case 36389:
                    case 35983:
                    case 35368:
                    case 34068:
                      c = 0;
                      break;
                    default:
                      U ||= 1280;
                      return;
                  }
                else {
                  if (
                    d instanceof Float32Array ||
                    d instanceof Uint32Array ||
                    d instanceof Int32Array ||
                    d instanceof Array
                  ) {
                    for (a = 0; a < d.length; ++a) w[(b + 4 * a) >> 2] = d[a];
                    return;
                  }
                  try {
                    c = d.name | 0;
                  } catch (e) {
                    U ||= 1280;
                    p(
                      `GL_INVALID_ENUM in glGet${0}v: Unknown object returned from WebGL getParameter(${a})! (error: ${e})`,
                    );
                    return;
                  }
                }
                break;
              default:
                U ||= 1280;
                p(
                  `GL_INVALID_ENUM in glGet${0}v: Native code calling glGet${0}v(${a}) and it returns ${d} of type ${typeof d}!`,
                );
                return;
            }
          w[b >> 2] = c;
        } else U ||= 1281;
      },
      Gc = (a) => ']' == a.slice(-1) && a.lastIndexOf('['),
      Hc = [],
      Ic = (a) => {
        a -= 5120;
        return 0 == a
          ? r
          : 1 == a
          ? t
          : 2 == a
          ? u
          : 4 == a
          ? w
          : 6 == a
          ? na
          : 5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a
          ? x
          : ma;
      },
      Jc = (a) => {
        var b = Q.je;
        if (b) {
          var c = b.Md[a];
          'number' == typeof c && (b.Md[a] = c = Q.getUniformLocation(b, b.fe[a] + (0 < c ? `[${c}]` : '')));
          return c;
        }
        U ||= 1282;
      },
      Kc = [],
      Lc = () => {
        if ('object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
          return (a) => crypto.getRandomValues(a);
        ya('initRandomDevice');
      },
      Mc = (a) => (Mc = Lc())(a);
    Va = k.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    for (var Nc = Array(256), Oc = 0; 256 > Oc; ++Oc) Nc[Oc] = String.fromCharCode(Oc);
    Wa = Nc;
    K = k.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    Object.assign(ib.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof ib && a instanceof ib)) return !1;
        var b = this.jc.yd.xd,
          c = this.jc.wd;
        a.jc = a.jc;
        var d = a.jc.yd.xd;
        for (a = a.jc.wd; b.Bd; ) (c = b.Nd(c)), (b = b.Bd);
        for (; d.Bd; ) (a = d.Nd(a)), (d = d.Bd);
        return b === d && c === a;
      },
      clone: function () {
        this.jc.wd || Ya(this);
        if (this.jc.Ld) return (this.jc.count.value += 1), this;
        var a = eb,
          b = Object,
          c = b.create,
          d = Object.getPrototypeOf(this),
          e = this.jc;
        a = a(
          c.call(b, d, {
            jc: { value: { count: e.count, Kd: e.Kd, Ld: e.Ld, wd: e.wd, yd: e.yd, Ad: e.Ad, Cd: e.Cd } },
          }),
        );
        a.jc.count.value += 1;
        a.jc.Kd = !1;
        return a;
      },
      ['delete']() {
        this.jc.wd || Ya(this);
        if (this.jc.Kd && !this.jc.Ld) throw new K('Object already scheduled for deletion');
        $a(this);
        var a = this.jc;
        --a.count.value;
        0 === a.count.value && (a.Ad ? a.Cd.Fd(a.Ad) : a.yd.xd.Fd(a.wd));
        this.jc.Ld || ((this.jc.Ad = void 0), (this.jc.wd = void 0));
      },
      isDeleted: function () {
        return !this.jc.wd;
      },
      deleteLater: function () {
        this.jc.wd || Ya(this);
        if (this.jc.Kd && !this.jc.Ld) throw new K('Object already scheduled for deletion');
        hb.push(this);
        this.jc.Kd = !0;
        return this;
      },
    });
    Object.assign(ub.prototype, {
      pe(a) {
        this.ee && (a = this.ee(a));
        return a;
      },
      Zd(a) {
        this.Fd?.(a);
      },
      Dd: 8,
      readValueFromPointer: Sa,
      fromWireType: function (a) {
        function b() {
          return this.Pd
            ? fb(this.xd.Hd, { yd: this.ve, wd: c, Cd: this, Ad: a })
            : fb(this.xd.Hd, { yd: this, wd: a });
        }
        var c = this.pe(a);
        if (!c) return this.Zd(a), null;
        var d = db(this.xd, c);
        if (void 0 !== d) {
          if (0 === d.jc.count.value) return (d.jc.wd = c), (d.jc.Ad = a), d.clone();
          d = d.clone();
          this.Zd(a);
          return d;
        }
        d = this.xd.oe(c);
        d = bb[d];
        if (!d) return b.call(this);
        d = this.Od ? d.ie : d.pointerType;
        var e = ab(c, this.xd, d.xd);
        return null === e
          ? b.call(this)
          : this.Pd
          ? fb(d.xd.Hd, { yd: d, wd: e, Cd: this, Ad: a })
          : fb(d.xd.Hd, { yd: d, wd: e });
      },
    });
    yb = k.UnboundTypeError = ((a, b) => {
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
    P.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1);
    k.count_emval_handles = () => P.length / 2 - 5 - Mb.length;
    for (var W = 0; 32 > W; ++W) Hc.push(Array(W));
    var Pc = new Int32Array(288);
    for (W = 0; 288 >= W; ++W) Kc[W] = Pc.subarray(0, W);
    var Md = {
        l: (a, b, c, d) =>
          ya(
            `Assertion failed: ${a ? A(t, a) : ''}, at: ` +
              [b ? (b ? A(t, b) : '') : 'unknown filename', c, d ? (d ? A(t, d) : '') : 'unknown function'],
          ),
        Xb: (a) => {
          var b = new Ma(a);
          0 == r[b.wd + 12] && ((r[b.wd + 12] = 1), Ka--);
          r[b.wd + 13] = 0;
          Ja.push(b);
          Qc(a);
          return Rc(a);
        },
        Wb: () => {
          X(0, 0);
          var a = Ja.pop();
          Sc(a.le);
          La = 0;
        },
        b: () => Pa([]),
        n: (a, b) => Pa([a, b]),
        w: (a, b, c) => {
          var d = new Ma(a);
          x[(d.wd + 16) >> 2] = 0;
          x[(d.wd + 4) >> 2] = b;
          x[(d.wd + 8) >> 2] = c;
          La = a;
          Ka++;
          throw La;
        },
        d: (a) => {
          La ||= a;
          throw La;
        },
        Nb: () => {},
        Kb: () => {},
        Lb: () => {},
        Qb: function () {},
        Sb: () => ya(''),
        ca: (a) => {
          var b = Qa[a];
          delete Qa[a];
          var c = b.Vd,
            d = b.Fd,
            e = b.be,
            f = e.map((g) => g.se).concat(e.map((g) => g.ze));
          G([a], f, (g) => {
            var h = {};
            e.forEach((l, m) => {
              var q = g[m],
                v = l.qe,
                z = l.re,
                I = g[m + e.length],
                B = l.ye,
                D = l.Ae;
              h[l.ne] = {
                read: (M) => q.fromWireType(v(z, M)),
                write: (M, ra) => {
                  var J = [];
                  B(D, M, I.toWireType(J, ra));
                  Ra(J);
                },
              };
            });
            return [
              {
                name: b.name,
                fromWireType: (l) => {
                  var m = {},
                    q;
                  for (q in h) m[q] = h[q].read(l);
                  d(l);
                  return m;
                },
                toWireType: (l, m) => {
                  for (var q in h) if (!(q in m)) throw new TypeError(`Missing field: "${q}"`);
                  var v = c();
                  for (q in h) h[q].write(v, m[q]);
                  null !== l && l.push(d, v);
                  return v;
                },
                Dd: 8,
                readValueFromPointer: Sa,
                Ed: d,
              },
            ];
          });
        },
        Db: () => {},
        gb: (a, b, c, d) => {
          b = H(b);
          F(a, {
            name: b,
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, f) {
              return f ? c : d;
            },
            Dd: 8,
            readValueFromPointer: function (e) {
              return this.fromWireType(t[e]);
            },
            Ed: null,
          });
        },
        T: (a, b, c, d, e, f, g, h, l, m, q, v, z) => {
          q = H(q);
          f = L(e, f);
          h &&= L(g, h);
          m &&= L(l, m);
          z = L(v, z);
          var I = mb(q);
          lb(I, function () {
            Bb(`Cannot construct ${q} due to unbound types`, [d]);
          });
          G([a, b, c], d ? [d] : [], (B) => {
            B = B[0];
            if (d) {
              var D = B.xd;
              var M = D.Hd;
            } else M = ib.prototype;
            B = jb(q, function (...gb) {
              if (Object.getPrototypeOf(this) !== ra) throw new K("Use 'new' to construct " + q);
              if (void 0 === J.Gd) throw new K(q + ' has no accessible constructor');
              var ac = J.Gd[gb.length];
              if (void 0 === ac)
                throw new K(
                  `Tried to invoke ctor of ${q} with invalid number of parameters (${
                    gb.length
                  }) - expected (${Object.keys(J.Gd).toString()}) parameters instead!`,
                );
              return ac.apply(this, gb);
            });
            var ra = Object.create(M, { constructor: { value: B } });
            B.prototype = ra;
            var J = new nb(q, B, ra, z, D, f, h, m);
            if (J.Bd) {
              var sa;
              (sa = J.Bd).Xd ?? (sa.Xd = []);
              J.Bd.Xd.push(J);
            }
            D = new ub(q, J, !0, !1, !1);
            sa = new ub(q + '*', J, !1, !1, !1);
            M = new ub(q + ' const*', J, !1, !0, !1);
            bb[a] = { pointerType: sa, ie: M };
            vb(I, B);
            return [D, sa, M];
          });
        },
        S: (a, b, c, d, e, f) => {
          var g = Cb(b, c);
          e = L(d, e);
          G([], [a], (h) => {
            h = h[0];
            var l = `constructor ${h.name}`;
            void 0 === h.xd.Gd && (h.xd.Gd = []);
            if (void 0 !== h.xd.Gd[b - 1])
              throw new K(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  h.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            h.xd.Gd[b - 1] = () => {
              Bb(`Cannot construct ${h.name} due to unbound types`, g);
            };
            G([], g, (m) => {
              m.splice(1, 0, null);
              h.xd.Gd[b - 1] = Kb(l, m, null, e, f);
              return [];
            });
            return [];
          });
        },
        m: (a, b, c, d, e, f, g, h) => {
          var l = Cb(c, d);
          b = H(b);
          b = Lb(b);
          f = L(e, f);
          G([], [a], (m) => {
            function q() {
              Bb(`Cannot call ${v} due to unbound types`, l);
            }
            m = m[0];
            var v = `${m.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            h && m.xd.we.push(b);
            var z = m.xd.Hd,
              I = z[b];
            void 0 === I || (void 0 === I.zd && I.className !== m.name && I.Jd === c - 2)
              ? ((q.Jd = c - 2), (q.className = m.name), (z[b] = q))
              : (kb(z, b, v), (z[b].zd[c - 2] = q));
            G([], l, (B) => {
              B = Kb(v, B, m, f, g);
              void 0 === z[b].zd ? ((B.Jd = c - 2), (z[b] = B)) : (z[b].zd[c - 2] = B);
              return [];
            });
            return [];
          });
        },
        fb: (a) => F(a, Pb),
        Y: (a, b, c, d) => {
          function e() {}
          b = H(b);
          e.values = {};
          F(a, {
            name: b,
            constructor: e,
            fromWireType: function (f) {
              return this.constructor.values[f];
            },
            toWireType: (f, g) => g.value,
            Dd: 8,
            readValueFromPointer: Qb(b, c, d),
            Ed: null,
          });
          lb(b, e);
        },
        s: (a, b, c) => {
          var d = Rb(a, 'enum');
          b = H(b);
          a = d.constructor;
          d = Object.create(d.constructor.prototype, {
            value: { value: c },
            constructor: { value: jb(`${d.name}_${b}`, function () {}) },
          });
          a.values[c] = d;
          a[b] = d;
        },
        va: (a, b, c) => {
          b = H(b);
          F(a, {
            name: b,
            fromWireType: (d) => d,
            toWireType: (d, e) => e,
            Dd: 8,
            readValueFromPointer: Sb(b, c),
            Ed: null,
          });
        },
        ba: (a, b, c, d, e, f) => {
          var g = Cb(b, c);
          a = H(a);
          a = Lb(a);
          e = L(d, e);
          lb(
            a,
            function () {
              Bb(`Cannot call ${a} due to unbound types`, g);
            },
            b - 1,
          );
          G([], g, (h) => {
            vb(a, Kb(a, [h[0], null].concat(h.slice(1)), null, e, f), b - 1);
            return [];
          });
        },
        A: (a, b, c, d, e) => {
          b = H(b);
          -1 === e && (e = 4294967295);
          e = (h) => h;
          if (0 === d) {
            var f = 32 - 8 * c;
            e = (h) => (h << f) >>> f;
          }
          var g = b.includes('unsigned')
            ? function (h, l) {
                return l >>> 0;
              }
            : function (h, l) {
                return l;
              };
          F(a, { name: b, fromWireType: e, toWireType: g, Dd: 8, readValueFromPointer: Tb(b, c, 0 !== d), Ed: null });
        },
        p: (a, b, c) => {
          function d(f) {
            return new e(r.buffer, x[(f + 4) >> 2], x[f >> 2]);
          }
          var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][
            b
          ];
          c = H(c);
          F(a, { name: c, fromWireType: d, Dd: 8, readValueFromPointer: d }, { te: !0 });
        },
        aa: (a) => {
          F(a, Ub);
        },
        Mb: (a, b, c, d, e, f, g, h, l, m, q, v) => {
          c = H(c);
          f = L(e, f);
          h = L(g, h);
          m = L(l, m);
          v = L(q, v);
          G([a], [b], (z) => {
            z = z[0];
            return [new ub(c, z.xd, !1, !1, !0, z, d, f, h, m, v)];
          });
        },
        wa: (a, b) => {
          b = H(b);
          var c = 'std::string' === b;
          F(a, {
            name: b,
            fromWireType: function (d) {
              var e = x[d >> 2],
                f = d + 4;
              if (c)
                for (var g = f, h = 0; h <= e; ++h) {
                  var l = f + h;
                  if (h == e || 0 == t[l]) {
                    g = g ? A(t, g, l - g) : '';
                    if (void 0 === m) var m = g;
                    else (m += String.fromCharCode(0)), (m += g);
                    g = l + 1;
                  }
                }
              else {
                m = Array(e);
                for (h = 0; h < e; ++h) m[h] = String.fromCharCode(t[f + h]);
                m = m.join('');
              }
              N(d);
              return m;
            },
            toWireType: function (d, e) {
              e instanceof ArrayBuffer && (e = new Uint8Array(e));
              var f,
                g = 'string' == typeof e;
              if (!(g || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array))
                throw new K('Cannot pass non-string to std::string');
              if (c && g)
                for (var h = (f = 0); h < e.length; ++h) {
                  var l = e.charCodeAt(h);
                  127 >= l ? f++ : 2047 >= l ? (f += 2) : 55296 <= l && 57343 >= l ? ((f += 4), ++h) : (f += 3);
                }
              else f = e.length;
              h = Tc(4 + f + 1);
              l = h + 4;
              x[h >> 2] = f;
              if (c && g) C(e, l, f + 1);
              else if (g)
                for (g = 0; g < f; ++g) {
                  var m = e.charCodeAt(g);
                  if (255 < m) throw (N(l), new K('String has UTF-16 code units that do not fit in 8 bits'));
                  t[l + g] = m;
                }
              else for (g = 0; g < f; ++g) t[l + g] = e[g];
              null !== d && d.push(N, h);
              return h;
            },
            Dd: 8,
            readValueFromPointer: Sa,
            Ed(d) {
              N(d);
            },
          });
        },
        $: (a, b, c) => {
          c = H(c);
          if (2 === b) {
            var d = Wb;
            var e = Xb;
            var f = Yb;
            var g = (h) => ma[h >> 1];
          } else 4 === b && ((d = Zb), (e = $b), (f = bc), (g = (h) => x[h >> 2]));
          F(a, {
            name: c,
            fromWireType: (h) => {
              for (var l = x[h >> 2], m, q = h + 4, v = 0; v <= l; ++v) {
                var z = h + 4 + v * b;
                if (v == l || 0 == g(z))
                  (q = d(q, z - q)), void 0 === m ? (m = q) : ((m += String.fromCharCode(0)), (m += q)), (q = z + b);
              }
              N(h);
              return m;
            },
            toWireType: (h, l) => {
              if ('string' != typeof l) throw new K(`Cannot pass non-string to C++ string type ${c}`);
              var m = f(l),
                q = Tc(4 + m + b);
              x[q >> 2] = m / b;
              e(l, q + 4, m + b);
              null !== h && h.push(N, q);
              return q;
            },
            Dd: 8,
            readValueFromPointer: Sa,
            Ed(h) {
              N(h);
            },
          });
        },
        da: (a, b, c, d, e, f) => {
          Qa[a] = { name: H(b), Vd: L(c, d), Fd: L(e, f), be: [] };
        },
        v: (a, b, c, d, e, f, g, h, l, m) => {
          Qa[a].be.push({ ne: H(b), se: c, qe: L(d, e), re: f, ze: g, ye: L(h, l), Ae: m });
        },
        hb: (a, b) => {
          b = H(b);
          F(a, { He: !0, name: b, Dd: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        Ib: () => {
          Ha = !1;
          Fb = 0;
        },
        Eb: () => {
          throw Infinity;
        },
        rb: (a, b, c, d) => {
          a = cc[a];
          b = Ob(b);
          return a(null, b, c, d);
        },
        Oa: Nb,
        jb: (a, b, c) => {
          var d = ec(a, b),
            e = d.shift();
          a--;
          var f = Array(a);
          b = `methodCaller<(${d.map((g) => g.name).join(', ')}) => ${e.name}>`;
          return dc(
            jb(b, (g, h, l, m) => {
              for (var q = 0, v = 0; v < a; ++v) (f[v] = d[v].readValueFromPointer(m + q)), (q += d[v].Dd);
              h = 1 === c ? fc(h, f) : h.apply(g, f);
              g = [];
              h = e.toWireType(g, h);
              g.length && (x[l >> 2] = sb(g));
              return h;
            }),
          );
        },
        Cb: (a) => {
          9 < a && (P[a + 1] += 1);
        },
        ib: (a) => {
          var b = Ob(a);
          Ra(b);
          Nb(a);
        },
        L: (a, b) => {
          a = Rb(a, '_emval_take_value');
          a = a.readValueFromPointer(b);
          return sb(a);
        },
        Fb: (a, b) => {
          gc[a] && (clearTimeout(gc[a].id), delete gc[a]);
          if (!b) return 0;
          var c = setTimeout(() => {
            delete gc[a];
            Hb(() => Uc(a, performance.now()));
          }, b);
          gc[a] = { id: c, Ne: b };
          return 0;
        },
        Gb: (a, b, c, d) => {
          var e = new Date().getFullYear(),
            f = new Date(e, 0, 1).getTimezoneOffset();
          e = new Date(e, 6, 1).getTimezoneOffset();
          x[a >> 2] = 60 * Math.max(f, e);
          w[b >> 2] = Number(f != e);
          b = (g) => {
            var h = Math.abs(g);
            return `UTC${0 <= g ? '-' : '+'}${String(Math.floor(h / 60)).padStart(2, '0')}${String(h % 60).padStart(
              2,
              '0',
            )}`;
          };
          a = b(f);
          b = b(e);
          e < f ? (C(a, c, 17), C(b, d, 17)) : (C(a, d, 17), C(b, c, 17));
        },
        dc: () => performance.now(),
        Hb: (a) => {
          var b = t.length;
          a >>>= 0;
          if (2147483648 < a) return !1;
          for (var c = 1; 4 >= c; c *= 2) {
            var d = b * (1 + 0.2 / c);
            d = Math.min(d, a + 100663296);
            a: {
              d =
                ((Math.min(2147483648, 65536 * Math.ceil(Math.max(a, d) / 65536)) - ja.buffer.byteLength + 65535) /
                  65536) |
                0;
              try {
                ja.grow(d);
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
        Zb: (a, b) => {
          var c = b >> 2;
          b = {
            alpha: !!r[b + 0],
            depth: !!r[b + 1],
            stencil: !!r[b + 2],
            antialias: !!r[b + 3],
            premultipliedAlpha: !!r[b + 4],
            preserveDrawingBuffer: !!r[b + 5],
            powerPreference: yc[w[c + 2]],
            failIfMajorPerformanceCaveat: !!r[b + 12],
            de: w[c + 4],
            Je: w[c + 5],
            ae: r[b + 24],
            me: r[b + 25],
            Le: w[c + 7],
            Me: r[b + 32],
          };
          a = 2 < a ? (a ? A(t, a) : '') : a;
          a = zc[a] || document.querySelector(a);
          return !a || b.me ? 0 : uc(a, b);
        },
        _b: (a) => {
          V == a && (V = 0);
          V === T[a] && (V = null);
          if ('object' == typeof xc)
            for (var b = T[a].Id.canvas, c = 0; c < wc.length; ++c)
              if (wc[c].target == b) {
                var d = c--,
                  e = wc[d];
                e.target.removeEventListener(e.Ee, e.De, e.Oe);
                wc.splice(d, 1);
              }
          T[a] && T[a].Id.canvas && (T[a].Id.canvas.he = void 0);
          T[a] = null;
        },
        eb: () => (V ? V.handle : 0),
        ta: (a) => {
          V = T[a];
          k.ctx = Q = V?.Id;
          return !a || Q ? 0 : -5;
        },
        Ub: (a, b) => {
          var c = 0;
          Cc().forEach((d, e) => {
            var f = b + c;
            e = x[(a + 4 * e) >> 2] = f;
            for (f = 0; f < d.length; ++f) r[e++] = d.charCodeAt(f);
            r[e] = 0;
            c += d.length + 1;
          });
          return 0;
        },
        Vb: (a, b) => {
          var c = Cc();
          x[a >> 2] = c.length;
          var d = 0;
          c.forEach((e) => (d += e.length + 1));
          x[b >> 2] = d;
          return 0;
        },
        Rb: () => 52,
        Pb: () => 52,
        Ob: (a, b, c, d) => {
          for (var e = 0, f = 0; f < c; f++) {
            var g = x[b >> 2],
              h = x[(b + 4) >> 2];
            b += 8;
            for (var l = 0; l < h; l++) {
              var m = a,
                q = t[g + l],
                v = Dc[m];
              0 === q || 10 === q ? ((1 === m ? ha : p)(A(v)), (v.length = 0)) : v.push(q);
            }
            e += h;
          }
          x[d >> 2] = e;
          return 0;
        },
        La: (a) => Q.activeTexture(a),
        qa: (a, b) => {
          Q.attachShader(R[a], S[b]);
        },
        x: (a, b) => {
          35051 == a ? (Q.Yd = b) : 35052 == a && (Q.Td = b);
          Q.bindBuffer(a, mc[b]);
        },
        Ja: (a, b, c, d, e) => {
          Q.bindBufferRange(a, b, mc[c], d, e);
        },
        u: (a, b) => {
          Q.bindFramebuffer(a, nc[b]);
        },
        Z: (a, b) => {
          Q.bindRenderbuffer(a, oc[b]);
        },
        M: (a, b) => {
          Q.bindTexture(a, pc[b]);
        },
        ra: (a) => {
          Q.bindVertexArray(qc[a]);
        },
        X: (a) => Q.blendEquation(a),
        z: (a, b) => Q.blendFunc(a, b),
        fa: (a, b, c, d, e, f, g, h, l, m) => Q.blitFramebuffer(a, b, c, d, e, f, g, h, l, m),
        sa: (a, b, c, d) => {
          2 <= V.version
            ? c && b
              ? Q.bufferData(a, t, d, c, b)
              : Q.bufferData(a, b, d)
            : Q.bufferData(a, c ? t.subarray(c, c + b) : b, d);
        },
        ga: (a) => Q.clear(a),
        ha: (a, b, c, d) => Q.clearColor(a, b, c, d),
        Ga: (a) => Q.clearDepth(a),
        Ha: (a) => Q.clearStencil(a),
        G: (a, b, c, d) => {
          Q.colorMask(!!a, !!b, !!c, !!d);
        },
        Ca: (a) => {
          Q.compileShader(S[a]);
        },
        $a: () => {
          var a = rc(R),
            b = Q.createProgram();
          b.name = a;
          b.Sd = b.Qd = b.Rd = 0;
          b.Wd = 1;
          R[a] = b;
          return a;
        },
        Ea: (a) => {
          var b = rc(S);
          S[b] = Q.createShader(a);
          return b;
        },
        Va: (a) => Q.cullFace(a),
        cb: (a, b) => {
          for (var c = 0; c < a; c++) {
            var d = w[(b + 4 * c) >> 2],
              e = mc[d];
            e && (Q.deleteBuffer(e), (e.name = 0), (mc[d] = null), d == Q.Yd && (Q.Yd = 0), d == Q.Td && (Q.Td = 0));
          }
        },
        Sa: (a, b) => {
          for (var c = 0; c < a; ++c) {
            var d = w[(b + 4 * c) >> 2],
              e = nc[d];
            e && (Q.deleteFramebuffer(e), (e.name = 0), (nc[d] = null));
          }
        },
        oa: (a) => {
          if (a) {
            var b = R[a];
            b ? (Q.deleteProgram(b), (b.name = 0), (R[a] = null)) : (U ||= 1281);
          }
        },
        Ra: (a, b) => {
          for (var c = 0; c < a; c++) {
            var d = w[(b + 4 * c) >> 2],
              e = oc[d];
            e && (Q.deleteRenderbuffer(e), (e.name = 0), (oc[d] = null));
          }
        },
        W: (a) => {
          if (a) {
            var b = S[a];
            b ? (Q.deleteShader(b), (S[a] = null)) : (U ||= 1281);
          }
        },
        ua: (a, b) => {
          for (var c = 0; c < a; c++) {
            var d = w[(b + 4 * c) >> 2],
              e = pc[d];
            e && (Q.deleteTexture(e), (e.name = 0), (pc[d] = null));
          }
        },
        ab: (a, b) => {
          for (var c = 0; c < a; c++) {
            var d = w[(b + 4 * c) >> 2];
            Q.deleteVertexArray(qc[d]);
            qc[d] = null;
          }
        },
        Ta: (a) => Q.depthFunc(a),
        O: (a) => {
          Q.depthMask(!!a);
        },
        N: (a) => Q.disable(a),
        Wa: (a) => {
          Q.disableVertexAttribArray(a);
        },
        Ia: (a, b, c, d) => {
          Q.drawElements(a, b, c, d);
        },
        E: (a) => Q.enable(a),
        Na: (a) => {
          Q.enableVertexAttribArray(a);
        },
        ia: (a, b, c, d) => {
          Q.framebufferRenderbuffer(a, b, c, oc[d]);
        },
        Qa: (a, b, c, d, e) => {
          Q.framebufferTexture2D(a, b, c, pc[d], e);
        },
        Ua: (a) => Q.frontFace(a),
        db: (a, b) => {
          sc(a, b, 'createBuffer', mc);
        },
        la: (a, b) => {
          sc(a, b, 'createFramebuffer', nc);
        },
        ka: (a, b) => {
          sc(a, b, 'createRenderbuffer', oc);
        },
        na: (a, b) => {
          sc(a, b, 'createTexture', pc);
        },
        bb: (a, b) => {
          sc(a, b, 'createVertexArray', qc);
        },
        _: (a, b) => Fc(a, b),
        Za: (a, b, c, d) => {
          a = Q.getProgramInfoLog(R[a]);
          null === a && (a = '(unknown error)');
          b = 0 < b && d ? C(a, d, b) : 0;
          c && (w[c >> 2] = b);
        },
        pa: (a, b, c) => {
          if (c)
            if (a >= lc) U ||= 1281;
            else if (((a = R[a]), 35716 == b))
              (a = Q.getProgramInfoLog(a)), null === a && (a = '(unknown error)'), (w[c >> 2] = a.length + 1);
            else if (35719 == b) {
              if (!a.Sd) {
                var d = Q.getProgramParameter(a, 35718);
                for (b = 0; b < d; ++b) a.Sd = Math.max(a.Sd, Q.getActiveUniform(a, b).name.length + 1);
              }
              w[c >> 2] = a.Sd;
            } else if (35722 == b) {
              if (!a.Qd)
                for (d = Q.getProgramParameter(a, 35721), b = 0; b < d; ++b)
                  a.Qd = Math.max(a.Qd, Q.getActiveAttrib(a, b).name.length + 1);
              w[c >> 2] = a.Qd;
            } else if (35381 == b) {
              if (!a.Rd)
                for (d = Q.getProgramParameter(a, 35382), b = 0; b < d; ++b)
                  a.Rd = Math.max(a.Rd, Q.getActiveUniformBlockName(a, b).length + 1);
              w[c >> 2] = a.Rd;
            } else w[c >> 2] = Q.getProgramParameter(a, b);
          else U ||= 1281;
        },
        Ba: (a, b, c, d) => {
          a = Q.getShaderInfoLog(S[a]);
          null === a && (a = '(unknown error)');
          b = 0 < b && d ? C(a, d, b) : 0;
          c && (w[c >> 2] = b);
        },
        ea: (a, b, c) => {
          c
            ? 35716 == b
              ? ((a = Q.getShaderInfoLog(S[a])),
                null === a && (a = '(unknown error)'),
                (w[c >> 2] = a ? a.length + 1 : 0))
              : 35720 == b
              ? ((a = Q.getShaderSource(S[a])), (w[c >> 2] = a ? a.length + 1 : 0))
              : (w[c >> 2] = Q.getShaderParameter(S[a], b))
            : (U ||= 1281);
        },
        t: (a, b) => Q.getUniformBlockIndex(R[a], b ? A(t, b) : ''),
        C: (a, b) => {
          b = b ? A(t, b) : '';
          if ((a = R[a])) {
            var c = a,
              d = c.Md,
              e = c.ge,
              f;
            if (!d) {
              c.Md = d = {};
              c.fe = {};
              var g = Q.getProgramParameter(c, 35718);
              for (f = 0; f < g; ++f) {
                var h = Q.getActiveUniform(c, f);
                var l = h.name;
                h = h.size;
                var m = Gc(l);
                m = 0 < m ? l.slice(0, m) : l;
                var q = c.Wd;
                c.Wd += h;
                e[m] = [h, q];
                for (l = 0; l < h; ++l) (d[q] = l), (c.fe[q++] = m);
              }
            }
            c = a.Md;
            d = 0;
            e = b;
            f = Gc(b);
            0 < f && ((d = parseInt(b.slice(f + 1)) >>> 0), (e = b.slice(0, f)));
            if ((e = a.ge[e]) && d < e[0] && ((d += e[1]), (c[d] = c[d] || Q.getUniformLocation(a, b)))) return d;
          } else U ||= 1281;
          return -1;
        },
        Fa: (a, b, c) => {
          for (var d = Hc[b], e = 0; e < b; e++) d[e] = w[(c + 4 * e) >> 2];
          Q.invalidateFramebuffer(a, d);
        },
        _a: (a) => {
          a = R[a];
          Q.linkProgram(a);
          a.Md = 0;
          a.ge = {};
        },
        ja: (a, b, c, d, e) => Q.renderbufferStorageMultisample(a, b, c, d, e),
        K: (a, b, c, d) => Q.scissor(a, b, c, d),
        Da: (a, b, c, d) => {
          for (var e = '', f = 0; f < b; ++f) {
            var g = (g = x[(c + 4 * f) >> 2]) ? A(t, g, d ? x[(d + 4 * f) >> 2] : void 0) : '';
            e += g;
          }
          Q.shaderSource(S[a], e);
        },
        R: (a, b, c) => Q.stencilFunc(a, b, c),
        I: (a, b, c, d) => Q.stencilFuncSeparate(a, b, c, d),
        Q: (a, b, c) => Q.stencilOp(a, b, c),
        H: (a, b, c, d) => Q.stencilOpSeparate(a, b, c, d),
        ma: (a, b, c, d, e, f, g, h, l) => {
          if (2 <= V.version) {
            if (Q.Td) {
              Q.texImage2D(a, b, c, d, e, f, g, h, l);
              return;
            }
            if (l) {
              var m = Ic(h);
              l >>>= 31 - Math.clz32(m.BYTES_PER_ELEMENT);
              Q.texImage2D(a, b, c, d, e, f, g, h, m, l);
              return;
            }
          }
          if (l) {
            m = Ic(h);
            var q =
              e *
              ((d *
                ({ 5: 3, 6: 4, 8: 2, 29502: 3, 29504: 4, 26917: 2, 26918: 2, 29846: 3, 29847: 4 }[g - 6402] || 1) *
                m.BYTES_PER_ELEMENT +
                4 -
                1) &
                -4);
            l = m.subarray(
              l >>> (31 - Math.clz32(m.BYTES_PER_ELEMENT)),
              (l + q) >>> (31 - Math.clz32(m.BYTES_PER_ELEMENT)),
            );
          } else l = null;
          Q.texImage2D(a, b, c, d, e, f, g, h, l);
        },
        B: (a, b, c) => Q.texParameteri(a, b, c),
        Pa: (a, b) => {
          Q.uniform1f(Jc(a), b);
        },
        Xa: (a, b, c) => {
          if (2 <= V.version) b && Q.uniform1iv(Jc(a), w, c >> 2, b);
          else {
            if (288 >= b) for (var d = Kc[b], e = 0; e < b; ++e) d[e] = w[(c + 4 * e) >> 2];
            else d = w.subarray(c >> 2, (c + 4 * b) >> 2);
            Q.uniform1iv(Jc(a), d);
          }
        },
        Ka: (a, b, c) => {
          a = R[a];
          Q.uniformBlockBinding(a, b, c);
        },
        Ya: (a) => {
          a = R[a];
          Q.useProgram(a);
          Q.je = a;
        },
        Ma: (a, b, c, d, e, f) => {
          Q.vertexAttribPointer(a, b, c, !!d, e, f);
        },
        P: (a, b, c, d) => Q.viewport(a, b, c, d),
        ac: Vc,
        o: Wc,
        bc: Xc,
        g: Yc,
        y: Zc,
        cc: $c,
        f: ad,
        i: bd,
        Aa: cd,
        J: dd,
        k: ed,
        r: fd,
        xa: gd,
        sb: hd,
        lb: jd,
        Bb: kd,
        Ab: ld,
        yb: md,
        ub: nd,
        U: od,
        a: pd,
        D: qd,
        F: rd,
        c: sd,
        e: td,
        ya: ud,
        Yb: vd,
        j: wd,
        $b: xd,
        h: yd,
        V: zd,
        za: Ad,
        qb: Bd,
        nb: Cd,
        tb: Dd,
        ob: Ed,
        zb: Fd,
        mb: Gd,
        vb: Hd,
        xb: Id,
        wb: Jd,
        pb: Kd,
        kb: Ld,
        q: (a) => a,
        Tb: Gb,
        Jb: (a, b) => {
          Mc(t.subarray(a, a + b));
          return 0;
        },
      },
      O = (function () {
        function a(c) {
          O = c.exports;
          O = Ib();
          ja = O.ec;
          pa();
          ta.unshift(O.fc);
          y--;
          k.monitorRunDependencies?.(y);
          0 == y && (null !== wa && (clearInterval(wa), (wa = null)), xa && ((c = xa), (xa = null), c()));
          return O;
        }
        y++;
        k.monitorRunDependencies?.(y);
        var b = { a: Md };
        if (k.instantiateWasm)
          try {
            return k.instantiateWasm(b, a);
          } catch (c) {
            p(`Module.instantiateWasm callback failed with error: ${c}`), ba(c);
          }
        Aa ??= za('DotLottiePlayer.wasm')
          ? 'DotLottiePlayer.wasm'
          : k.locateFile
          ? k.locateFile('DotLottiePlayer.wasm', n)
          : n + 'DotLottiePlayer.wasm';
        Ea(b, function (c) {
          a(c.instance);
        }).catch(ba);
        return {};
      })(),
      Tc = (a) => (Tc = O.gc)(a),
      zb = (a) => (zb = O.hc)(a),
      N = (a) => (N = O.ic)(a),
      Uc = (a, b) => (Uc = O.kc)(a, b),
      X = (a, b) => (X = O.lc)(a, b),
      Na = (a) => (Na = O.mc)(a),
      Y = (a) => (Y = O.nc)(a),
      Z = () => (Z = O.oc)(),
      Sc = (a) => (Sc = O.pc)(a),
      Qc = (a) => (Qc = O.qc)(a),
      Oa = (a, b, c) => (Oa = O.rc)(a, b, c),
      Rc = (a) => (Rc = O.sc)(a),
      Nd = (k.dynCall_viii = (a, b, c, d) => (Nd = k.dynCall_viii = O.tc)(a, b, c, d)),
      dynCall_vi = (k.dynCall_vi = (a, b) => (dynCall_vi = k.dynCall_vi = O.uc)(a, b)),
      dynCall_vii = (k.dynCall_vii = (a, b, c) => (dynCall_vii = k.dynCall_vii = O.vc)(a, b, c)),
      Od = (k.dynCall_viiii = (a, b, c, d, e) => (Od = k.dynCall_viiii = O.wc)(a, b, c, d, e)),
      dynCall_iii = (k.dynCall_iii = (a, b, c) => (dynCall_iii = k.dynCall_iii = O.xc)(a, b, c)),
      Pd = (k.dynCall_ii = (a, b) => (Pd = k.dynCall_ii = O.yc)(a, b)),
      Qd = (k.dynCall_fi = (a, b) => (Qd = k.dynCall_fi = O.zc)(a, b)),
      Rd = (k.dynCall_iiiiii = (a, b, c, d, e, f) => (Rd = k.dynCall_iiiiii = O.Ac)(a, b, c, d, e, f)),
      Sd = (k.dynCall_iiii = (a, b, c, d) => (Sd = k.dynCall_iiii = O.Bc)(a, b, c, d)),
      Td = (k.dynCall_ji = (a, b) => (Td = k.dynCall_ji = O.Cc)(a, b)),
      Ud = (k.dynCall_iif = (a, b, c) => (Ud = k.dynCall_iif = O.Dc)(a, b, c)),
      Vd = (k.dynCall_iiff = (a, b, c, d) => (Vd = k.dynCall_iiff = O.Ec)(a, b, c, d)),
      Wd = (k.dynCall_viiiii = (a, b, c, d, e, f) => (Wd = k.dynCall_viiiii = O.Fc)(a, b, c, d, e, f)),
      Xd = (k.dynCall_iiiif = (a, b, c, d, e) => (Xd = k.dynCall_iiiif = O.Gc)(a, b, c, d, e)),
      Yd = (k.dynCall_iiiii = (a, b, c, d, e) => (Yd = k.dynCall_iiiii = O.Hc)(a, b, c, d, e)),
      Zd = (k.dynCall_jii = (a, b, c) => (Zd = k.dynCall_jii = O.Ic)(a, b, c)),
      $d = (k.dynCall_fii = (a, b, c) => ($d = k.dynCall_fii = O.Jc)(a, b, c));
    k.dynCall_iijj = (a, b, c, d, e, f) => (k.dynCall_iijj = O.Kc)(a, b, c, d, e, f);
    k.dynCall_vijj = (a, b, c, d, e, f) => (k.dynCall_vijj = O.Lc)(a, b, c, d, e, f);
    var ae = (k.dynCall_vij = (a, b, c, d) => (ae = k.dynCall_vij = O.Mc)(a, b, c, d)),
      be = (k.dynCall_vidi = (a, b, c, d) => (be = k.dynCall_vidi = O.Nc)(a, b, c, d)),
      ce = (k.dynCall_jjji = (a, b, c, d, e, f) => (ce = k.dynCall_jjji = O.Oc)(a, b, c, d, e, f)),
      de = (k.dynCall_viijj = (a, b, c, d, e, f, g) => (de = k.dynCall_viijj = O.Pc)(a, b, c, d, e, f, g)),
      ee = (k.dynCall_viijji = (a, b, c, d, e, f, g, h) => (ee = k.dynCall_viijji = O.Qc)(a, b, c, d, e, f, g, h)),
      fe = (k.dynCall_viij = (a, b, c, d, e) => (fe = k.dynCall_viij = O.Rc)(a, b, c, d, e)),
      ge = (k.dynCall_iiiijj = (a, b, c, d, e, f, g, h) => (ge = k.dynCall_iiiijj = O.Sc)(a, b, c, d, e, f, g, h)),
      he = (k.dynCall_viiij = (a, b, c, d, e, f) => (he = k.dynCall_viiij = O.Tc)(a, b, c, d, e, f)),
      ie = (k.dynCall_viiiiii = (a, b, c, d, e, f, g) => (ie = k.dynCall_viiiiii = O.Uc)(a, b, c, d, e, f, g)),
      je = (k.dynCall_viijii = (a, b, c, d, e, f, g) => (je = k.dynCall_viijii = O.Vc)(a, b, c, d, e, f, g)),
      ke = (k.dynCall_viiiff = (a, b, c, d, e, f) => (ke = k.dynCall_viiiff = O.Wc)(a, b, c, d, e, f)),
      le = (k.dynCall_vif = (a, b, c) => (le = k.dynCall_vif = O.Xc)(a, b, c)),
      me = (k.dynCall_vijiji = (a, b, c, d, e, f, g, h) => (me = k.dynCall_vijiji = O.Yc)(a, b, c, d, e, f, g, h)),
      ne = (k.dynCall_ffff = (a, b, c, d) => (ne = k.dynCall_ffff = O.Zc)(a, b, c, d)),
      oe = (k.dynCall_viiif = (a, b, c, d, e) => (oe = k.dynCall_viiif = O._c)(a, b, c, d, e)),
      pe = (k.dynCall_iiiiff = (a, b, c, d, e, f) => (pe = k.dynCall_iiiiff = O.$c)(a, b, c, d, e, f)),
      qe = (k.dynCall_jiii = (a, b, c, d) => (qe = k.dynCall_jiii = O.ad)(a, b, c, d)),
      re = (k.dynCall_iiiiiiii = (a, b, c, d, e, f, g, h) => (re = k.dynCall_iiiiiiii = O.bd)(a, b, c, d, e, f, g, h)),
      se = (k.dynCall_viiiiiii = (a, b, c, d, e, f, g, h) => (se = k.dynCall_viiiiiii = O.cd)(a, b, c, d, e, f, g, h));
    k.dynCall_viif = (a, b, c, d) => (k.dynCall_viif = O.dd)(a, b, c, d);
    var te = (k.dynCall_viiiiff = (a, b, c, d, e, f, g) => (te = k.dynCall_viiiiff = O.ed)(a, b, c, d, e, f, g)),
      ue = (k.dynCall_viiji = (a, b, c, d, e, f) => (ue = k.dynCall_viiji = O.fd)(a, b, c, d, e, f)),
      ve = (k.dynCall_viiiji = (a, b, c, d, e, f, g) => (ve = k.dynCall_viiiji = O.gd)(a, b, c, d, e, f, g)),
      we = (k.dynCall_viijiii = (a, b, c, d, e, f, g, h) => (we = k.dynCall_viijiii = O.hd)(a, b, c, d, e, f, g, h)),
      xe = (k.dynCall_iji = (a, b, c, d) => (xe = k.dynCall_iji = O.id)(a, b, c, d)),
      dynCall_v = (k.dynCall_v = (a) => (dynCall_v = k.dynCall_v = O.jd)(a)),
      ye = (k.dynCall_vijjjj = (a, b, c, d, e, f, g, h, l, m) =>
        (ye = k.dynCall_vijjjj = O.kd)(a, b, c, d, e, f, g, h, l, m));
    k.dynCall_i = (a) => (k.dynCall_i = O.ld)(a);
    k.dynCall_iiiiiii = (a, b, c, d, e, f, g) => (k.dynCall_iiiiiii = O.md)(a, b, c, d, e, f, g);
    k.dynCall_iiif = (a, b, c, d) => (k.dynCall_iiif = O.nd)(a, b, c, d);
    k.dynCall_iiiff = (a, b, c, d, e) => (k.dynCall_iiiff = O.od)(a, b, c, d, e);
    k.dynCall_iidiiii = (a, b, c, d, e, f, g) => (k.dynCall_iidiiii = O.pd)(a, b, c, d, e, f, g);
    k.dynCall_iiiiiiiii = (a, b, c, d, e, f, g, h, l) => (k.dynCall_iiiiiiiii = O.qd)(a, b, c, d, e, f, g, h, l);
    k.dynCall_iiiifi = (a, b, c, d, e, f) => (k.dynCall_iiiifi = O.rd)(a, b, c, d, e, f);
    k.dynCall_iiiiij = (a, b, c, d, e, f, g) => (k.dynCall_iiiiij = O.sd)(a, b, c, d, e, f, g);
    k.dynCall_iiiiid = (a, b, c, d, e, f) => (k.dynCall_iiiiid = O.td)(a, b, c, d, e, f);
    k.dynCall_iiiiijj = (a, b, c, d, e, f, g, h, l) => (k.dynCall_iiiiijj = O.ud)(a, b, c, d, e, f, g, h, l);
    k.dynCall_iiiiiijj = (a, b, c, d, e, f, g, h, l, m) => (k.dynCall_iiiiiijj = O.vd)(a, b, c, d, e, f, g, h, l, m);
    function sd(a, b, c) {
      var d = Z();
      try {
        dynCall_vii(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function td(a, b, c, d) {
      var e = Z();
      try {
        Nd(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function pd(a, b) {
      var c = Z();
      try {
        dynCall_vi(a, b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function wd(a, b, c, d, e) {
      var f = Z();
      try {
        Od(a, b, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function Yc(a, b) {
      var c = Z();
      try {
        return Pd(a, b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function Zc(a, b, c) {
      var d = Z();
      try {
        return Ud(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function bd(a, b, c, d) {
      var e = Z();
      try {
        return Sd(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function Wc(a, b) {
      var c = Z();
      try {
        return Qd(a, b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function $c(a, b, c, d) {
      var e = Z();
      try {
        return Vd(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function fd(a, b, c, d, e, f) {
      var g = Z();
      try {
        return Rd(a, b, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function ad(a, b, c) {
      var d = Z();
      try {
        return dynCall_iii(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function cd(a, b, c, d, e) {
      var f = Z();
      try {
        return Xd(a, b, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function yd(a, b, c, d, e, f) {
      var g = Z();
      try {
        Wd(a, b, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function ed(a, b, c, d, e) {
      var f = Z();
      try {
        return Yd(a, b, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function Xc(a, b, c) {
      var d = Z();
      try {
        return $d(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function zd(a, b, c, d, e, f, g) {
      var h = Z();
      try {
        ie(a, b, c, d, e, f, g);
      } catch (l) {
        Y(h);
        if (l !== l + 0) throw l;
        X(1, 0);
      }
    }
    function Ad(a, b, c, d, e, f, g, h) {
      var l = Z();
      try {
        se(a, b, c, d, e, f, g, h);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function qd(a, b, c, d) {
      var e = Z();
      try {
        be(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function rd(a, b, c) {
      var d = Z();
      try {
        le(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function Vc(a, b, c, d) {
      var e = Z();
      try {
        return ne(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function xd(a, b, c, d, e, f, g) {
      var h = Z();
      try {
        te(a, b, c, d, e, f, g);
      } catch (l) {
        Y(h);
        if (l !== l + 0) throw l;
        X(1, 0);
      }
    }
    function dd(a, b, c, d, e, f) {
      var g = Z();
      try {
        return pe(a, b, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function ud(a, b, c, d, e) {
      var f = Z();
      try {
        oe(a, b, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function vd(a, b, c, d, e, f) {
      var g = Z();
      try {
        ke(a, b, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function gd(a, b, c, d, e, f, g, h) {
      var l = Z();
      try {
        return re(a, b, c, d, e, f, g, h);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function od(a) {
      var b = Z();
      try {
        dynCall_v(a);
      } catch (c) {
        Y(b);
        if (c !== c + 0) throw c;
        X(1, 0);
      }
    }
    function kd(a, b) {
      var c = Z();
      try {
        return Td(a, b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        X(1, 0);
      }
    }
    function ld(a, b, c) {
      var d = Z();
      try {
        return Zd(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        X(1, 0);
      }
    }
    function Fd(a, b, c, d, e, f, g) {
      var h = Z();
      try {
        je(a, b, c, d, e, f, g);
      } catch (l) {
        Y(h);
        if (l !== l + 0) throw l;
        X(1, 0);
      }
    }
    function md(a, b, c, d) {
      var e = Z();
      try {
        return qe(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function Id(a, b, c, d, e, f, g, h) {
      var l = Z();
      try {
        ee(a, b, c, d, e, f, g, h);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function Jd(a, b, c, d) {
      var e = Z();
      try {
        ae(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function Hd(a, b, c, d, e, f, g) {
      var h = Z();
      try {
        de(a, b, c, d, e, f, g);
      } catch (l) {
        Y(h);
        if (l !== l + 0) throw l;
        X(1, 0);
      }
    }
    function nd(a, b, c, d, e, f) {
      var g = Z();
      try {
        return ce(a, b, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function Dd(a, b, c, d, e) {
      var f = Z();
      try {
        fe(a, b, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        X(1, 0);
      }
    }
    function hd(a, b, c, d, e, f, g, h) {
      var l = Z();
      try {
        return ge(a, b, c, d, e, f, g, h);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function Bd(a, b, c, d, e, f) {
      var g = Z();
      try {
        he(a, b, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function Kd(a, b, c, d, e, f, g, h) {
      var l = Z();
      try {
        me(a, b, c, d, e, f, g, h);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function Ed(a, b, c, d, e, f) {
      var g = Z();
      try {
        ue(a, b, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        X(1, 0);
      }
    }
    function Cd(a, b, c, d, e, f, g) {
      var h = Z();
      try {
        ve(a, b, c, d, e, f, g);
      } catch (l) {
        Y(h);
        if (l !== l + 0) throw l;
        X(1, 0);
      }
    }
    function Gd(a, b, c, d, e, f, g, h) {
      var l = Z();
      try {
        we(a, b, c, d, e, f, g, h);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        X(1, 0);
      }
    }
    function jd(a, b, c, d) {
      var e = Z();
      try {
        return xe(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        X(1, 0);
      }
    }
    function Ld(a, b, c, d, e, f, g, h, l, m) {
      var q = Z();
      try {
        ye(a, b, c, d, e, f, g, h, l, m);
      } catch (v) {
        Y(q);
        if (v !== v + 0) throw v;
        X(1, 0);
      }
    }
    var ze;
    xa = function Ae() {
      ze || Be();
      ze || (xa = Ae);
    };
    function Be() {
      function a() {
        if (!ze && ((ze = !0), (k.calledRun = !0), !ka)) {
          Ga(ta);
          aa(k);
          k.onRuntimeInitialized?.();
          if (k.postRun)
            for ('function' == typeof k.postRun && (k.postRun = [k.postRun]); k.postRun.length; ) {
              var b = k.postRun.shift();
              ua.unshift(b);
            }
          Ga(ua);
        }
      }
      if (!(0 < y)) {
        if (k.preRun) for ('function' == typeof k.preRun && (k.preRun = [k.preRun]); k.preRun.length; ) va();
        Ga(qa);
        0 < y ||
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
    Be();
    moduleRtn = ca;

    return moduleRtn;
  };
})();
export default createDotLottiePlayerModule;
