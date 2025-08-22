var createDotLottiePlayerModule = (() => {
  var _scriptName = typeof document != 'undefined' ? document.currentScript?.src : undefined;

  return function (moduleArg = {}) {
    var moduleRtn;

    var g = moduleArg,
      aa,
      ba,
      ea = new Promise((a, b) => {
        aa = a;
        ba = b;
      }),
      fa = 'object' == typeof window,
      ha = 'undefined' != typeof WorkerGlobalScope,
      ia = Object.assign({}, g),
      ja = './this.program',
      l = '',
      ka,
      la;
    if (fa || ha)
      ha
        ? (l = self.location.href)
        : 'undefined' != typeof document && document.currentScript && (l = document.currentScript.src),
        _scriptName && (l = _scriptName),
        l.startsWith('blob:') ? (l = '') : (l = l.substr(0, l.replace(/[?#].*/, '').lastIndexOf('/') + 1)),
        ha &&
          (la = (a) => {
            var b = new XMLHttpRequest();
            b.open('GET', a, !1);
            b.responseType = 'arraybuffer';
            b.send(null);
            return new Uint8Array(b.response);
          }),
        (ka = async (a) => {
          a = await fetch(a, { credentials: 'same-origin' });
          if (a.ok) return a.arrayBuffer();
          throw Error(a.status + ' : ' + a.url);
        });
    var ma = g.printErr || console.error.bind(console);
    Object.assign(g, ia);
    ia = null;
    g.thisProgram && (ja = g.thisProgram);
    var na = g.wasmBinary,
      oa,
      pa = !1,
      qa,
      q,
      t,
      ra,
      sa,
      x,
      y,
      ta,
      ua,
      va,
      wa;
    function xa() {
      var a = oa.buffer;
      g.HEAP8 = q = new Int8Array(a);
      g.HEAP16 = ra = new Int16Array(a);
      g.HEAPU8 = t = new Uint8Array(a);
      g.HEAPU16 = sa = new Uint16Array(a);
      g.HEAP32 = x = new Int32Array(a);
      g.HEAPU32 = y = new Uint32Array(a);
      g.HEAPF32 = ta = new Float32Array(a);
      g.HEAPF64 = wa = new Float64Array(a);
      g.HEAP64 = ua = new BigInt64Array(a);
      g.HEAPU64 = va = new BigUint64Array(a);
    }
    var ya = [],
      za = [],
      Aa = [];
    function Ba() {
      var a = g.preRun.shift();
      ya.unshift(a);
    }
    var Ca = 0,
      Da = null;
    function Ea(a) {
      g.onAbort?.(a);
      a = 'Aborted(' + a + ')';
      ma(a);
      pa = !0;
      a = new WebAssembly.RuntimeError(a + '. Build with -sASSERTIONS for more info.');
      ba(a);
      throw a;
    }
    var Fa = (a) => a.startsWith('data:application/octet-stream;base64,'),
      Ha;
    async function Ia(a) {
      if (!na)
        try {
          var b = await ka(a);
          return new Uint8Array(b);
        } catch {}
      if (a == Ha && na) a = new Uint8Array(na);
      else if (la) a = la(a);
      else throw 'both async and sync fetching of the wasm failed';
      return a;
    }
    async function Ja(a, b) {
      try {
        var c = await Ia(a);
        return await WebAssembly.instantiate(c, b);
      } catch (d) {
        ma(`failed to asynchronously prepare wasm: ${d}`), Ea(d);
      }
    }
    async function Ka(a) {
      var b = Ha;
      if (!na && 'function' == typeof WebAssembly.instantiateStreaming && !Fa(b) && 'function' == typeof fetch)
        try {
          var c = fetch(b, { credentials: 'same-origin' });
          return await WebAssembly.instantiateStreaming(c, a);
        } catch (d) {
          ma(`wasm streaming compile failed: ${d}`), ma('falling back to ArrayBuffer instantiation');
        }
      return Ja(b, a);
    }
    class La {
      name = 'ExitStatus';
      constructor(a) {
        this.message = `Program terminated with exit(${a})`;
        this.status = a;
      }
    }
    var Ma = (a) => {
        for (; 0 < a.length; ) a.shift()(g);
      },
      Na = g.noExitRuntime || !0,
      Oa = 'undefined' != typeof TextDecoder ? new TextDecoder() : void 0,
      A = (a = 0, b = NaN) => {
        var c = t,
          d = a + b;
        for (b = a; c[b] && !(b >= d); ) ++b;
        if (16 < b - a && c.buffer && Oa) return Oa.decode(c.subarray(a, b));
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
    class Pa {
      constructor(a) {
        this.Cc = a - 24;
      }
    }
    var Qa = 0,
      Ra = 0,
      Sa = (a, b, c) => {
        var d = t;
        if (!(0 < c)) return 0;
        var e = b;
        c = b + c - 1;
        for (var f = 0; f < a.length; ++f) {
          var h = a.charCodeAt(f);
          if (55296 <= h && 57343 >= h) {
            var k = a.charCodeAt(++f);
            h = (65536 + ((h & 1023) << 10)) | (k & 1023);
          }
          if (127 >= h) {
            if (b >= c) break;
            d[b++] = h;
          } else {
            if (2047 >= h) {
              if (b + 1 >= c) break;
              d[b++] = 192 | (h >> 6);
            } else {
              if (65535 >= h) {
                if (b + 2 >= c) break;
                d[b++] = 224 | (h >> 12);
              } else {
                if (b + 3 >= c) break;
                d[b++] = 240 | (h >> 18);
                d[b++] = 128 | ((h >> 12) & 63);
              }
              d[b++] = 128 | ((h >> 6) & 63);
            }
            d[b++] = 128 | (h & 63);
          }
        }
        d[b] = 0;
        return b - e;
      },
      Ta = {},
      Ua = (a) => {
        for (; a.length; ) {
          var b = a.pop();
          a.pop()(b);
        }
      };
    function Va(a) {
      return this.fromWireType(y[a >> 2]);
    }
    var Wa = {},
      Xa = {},
      Ya = {},
      Za,
      $a = (a, b, c) => {
        function d(k) {
          k = c(k);
          if (k.length !== a.length) throw new Za('Mismatched type converter count');
          for (var m = 0; m < a.length; ++m) B(a[m], k[m]);
        }
        a.forEach((k) => (Ya[k] = b));
        var e = Array(b.length),
          f = [],
          h = 0;
        b.forEach((k, m) => {
          Xa.hasOwnProperty(k)
            ? (e[m] = Xa[k])
            : (f.push(k),
              Wa.hasOwnProperty(k) || (Wa[k] = []),
              Wa[k].push(() => {
                e[m] = Xa[k];
                ++h;
                h === f.length && d(e);
              }));
        });
        0 === f.length && d(e);
      },
      ab = (a) => {
        if (null === a) return 'null';
        var b = typeof a;
        return 'object' === b || 'array' === b || 'function' === b ? a.toString() : '' + a;
      },
      bb,
      C = (a) => {
        for (var b = ''; t[a]; ) b += bb[t[a++]];
        return b;
      },
      D;
    function cb(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new D(`type "${d}" must have a positive integer typeid pointer`);
      if (Xa.hasOwnProperty(a)) {
        if (c.Pd) return;
        throw new D(`Cannot register type '${d}' twice`);
      }
      Xa[a] = b;
      delete Ya[a];
      Wa.hasOwnProperty(a) && ((b = Wa[a]), delete Wa[a], b.forEach((e) => e()));
    }
    function B(a, b, c = {}) {
      return cb(a, b, c);
    }
    var db = (a, b, c) => {
        switch (b) {
          case 1:
            return c ? (d) => q[d] : (d) => t[d];
          case 2:
            return c ? (d) => ra[d >> 1] : (d) => sa[d >> 1];
          case 4:
            return c ? (d) => x[d >> 2] : (d) => y[d >> 2];
          case 8:
            return c ? (d) => ua[d >> 3] : (d) => va[d >> 3];
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      eb = (a) => {
        throw new D(a.Ac.Ec.Dc.name + ' instance already deleted');
      },
      fb = !1,
      gb = () => {},
      hb = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.Hc) return null;
        a = hb(a, b, c.Hc);
        return null === a ? null : c.Hd(a);
      },
      ib = {},
      jb = {},
      kb = (a, b) => {
        if (void 0 === b) throw new D('ptr should not be undefined');
        for (; a.Hc; ) (b = a.$c(b)), (a = a.Hc);
        return jb[b];
      },
      mb = (a, b) => {
        if (!b.Ec || !b.Cc) throw new Za('makeClassHandle requires ptr and ptrType');
        if (!!b.Kc !== !!b.Gc) throw new Za('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return lb(Object.create(a, { Ac: { value: b, writable: !0 } }));
      },
      lb = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (lb = (b) => b), a;
        fb = new FinalizationRegistry((b) => {
          b = b.Ac;
          --b.count.value;
          0 === b.count.value && (b.Gc ? b.Kc.Lc(b.Gc) : b.Ec.Dc.Lc(b.Cc));
        });
        lb = (b) => {
          var c = b.Ac;
          c.Gc && fb.register(b, { Ac: c }, b);
          return b;
        };
        gb = (b) => {
          fb.unregister(b);
        };
        return lb(a);
      },
      nb = [];
    function ob() {}
    var pb = (a, b) => Object.defineProperty(b, 'name', { value: a }),
      qb = (a, b, c) => {
        if (void 0 === a[b].Fc) {
          var d = a[b];
          a[b] = function (...e) {
            if (!a[b].Fc.hasOwnProperty(e.length))
              throw new D(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].Fc})!`,
              );
            return a[b].Fc[e.length].apply(this, e);
          };
          a[b].Fc = [];
          a[b].Fc[d.Uc] = d;
        }
      },
      rb = (a, b, c) => {
        if (g.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== g[a].Fc && void 0 !== g[a].Fc[c]))
            throw new D(`Cannot register public name '${a}' twice`);
          qb(g, a, a);
          if (g[a].Fc.hasOwnProperty(c))
            throw new D(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          g[a].Fc[c] = b;
        } else (g[a] = b), (g[a].Uc = c);
      },
      sb = (a) => {
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function tb(a, b, c, d, e, f, h, k) {
      this.name = a;
      this.constructor = b;
      this.Rc = c;
      this.Lc = d;
      this.Hc = e;
      this.Kd = f;
      this.$c = h;
      this.Hd = k;
      this.Sd = [];
    }
    var ub = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.$c) throw new D(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.$c(a);
        b = b.Hc;
      }
      return a;
    };
    function vb(a, b) {
      if (null === b) {
        if (this.md) throw new D(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Ac) throw new D(`Cannot pass "${ab(b)}" as a ${this.name}`);
      if (!b.Ac.Cc) throw new D(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return ub(b.Ac.Cc, b.Ac.Ec.Dc, this.Dc);
    }
    function wb(a, b) {
      if (null === b) {
        if (this.md) throw new D(`null is not a valid ${this.name}`);
        if (this.ed) {
          var c = this.od();
          null !== a && a.push(this.Lc, c);
          return c;
        }
        return 0;
      }
      if (!b || !b.Ac) throw new D(`Cannot pass "${ab(b)}" as a ${this.name}`);
      if (!b.Ac.Cc) throw new D(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.dd && b.Ac.Ec.dd)
        throw new D(
          `Cannot convert argument of type ${b.Ac.Kc ? b.Ac.Kc.name : b.Ac.Ec.name} to parameter type ${this.name}`,
        );
      c = ub(b.Ac.Cc, b.Ac.Ec.Dc, this.Dc);
      if (this.ed) {
        if (void 0 === b.Ac.Gc) throw new D('Passing raw pointer to smart pointer is illegal');
        switch (this.Yd) {
          case 0:
            if (b.Ac.Kc === this) c = b.Ac.Gc;
            else
              throw new D(
                `Cannot convert argument of type ${b.Ac.Kc ? b.Ac.Kc.name : b.Ac.Ec.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            c = b.Ac.Gc;
            break;
          case 2:
            if (b.Ac.Kc === this) c = b.Ac.Gc;
            else {
              var d = b.clone();
              c = this.Ud(
                c,
                xb(() => d['delete']()),
              );
              null !== a && a.push(this.Lc, c);
            }
            break;
          default:
            throw new D('Unsupporting sharing policy');
        }
      }
      return c;
    }
    function yb(a, b) {
      if (null === b) {
        if (this.md) throw new D(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.Ac) throw new D(`Cannot pass "${ab(b)}" as a ${this.name}`);
      if (!b.Ac.Cc) throw new D(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.Ac.Ec.dd) throw new D(`Cannot convert argument of type ${b.Ac.Ec.name} to parameter type ${this.name}`);
      return ub(b.Ac.Cc, b.Ac.Ec.Dc, this.Dc);
    }
    function zb(a, b, c, d, e, f, h, k, m, n, p) {
      this.name = a;
      this.Dc = b;
      this.md = c;
      this.dd = d;
      this.ed = e;
      this.Rd = f;
      this.Yd = h;
      this.zd = k;
      this.od = m;
      this.Ud = n;
      this.Lc = p;
      e || void 0 !== b.Hc ? (this.toWireType = wb) : ((this.toWireType = d ? vb : yb), (this.Jc = null));
    }
    var Ab = (a, b, c) => {
        if (!g.hasOwnProperty(a)) throw new Za('Replacing nonexistent public symbol');
        void 0 !== g[a].Fc && void 0 !== c ? (g[a].Fc[c] = b) : ((g[a] = b), (g[a].Uc = c));
      },
      F,
      G = (a, b) => {
        a = C(a);
        var c = F.get(b);
        if ('function' != typeof c) throw new D(`unknown function pointer with signature ${a}: ${b}`);
        return c;
      },
      Bb,
      Db = (a) => {
        a = Cb(a);
        var b = C(a);
        H(a);
        return b;
      },
      Eb = (a, b) => {
        function c(f) {
          e[f] || Xa[f] || (Ya[f] ? Ya[f].forEach(c) : (d.push(f), (e[f] = !0)));
        }
        var d = [],
          e = {};
        b.forEach(c);
        throw new Bb(`${a}: ` + d.map(Db).join([', ']));
      },
      Fb = (a, b) => {
        for (var c = [], d = 0; d < a; d++) c.push(y[(b + 4 * d) >> 2]);
        return c;
      };
    function Gb(a) {
      for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].Jc) return !0;
      return !1;
    }
    function Hb(a, b, c, d, e) {
      var f = b.length;
      if (2 > f) throw new D("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var h = null !== b[1] && null !== c,
        k = Gb(b),
        m = 'void' !== b[0].name,
        n = f - 2,
        p = Array(n),
        r = [],
        u = [];
      return pb(a, function (...w) {
        u.length = 0;
        r.length = h ? 2 : 1;
        r[0] = e;
        if (h) {
          var v = b[1].toWireType(u, this);
          r[1] = v;
        }
        for (var z = 0; z < n; ++z) (p[z] = b[z + 2].toWireType(u, w[z])), r.push(p[z]);
        w = d(...r);
        if (k) Ua(u);
        else
          for (z = h ? 1 : 2; z < b.length; z++) {
            var I = 1 === z ? v : p[z - 2];
            null !== b[z].Jc && b[z].Jc(I);
          }
        v = m ? b[0].fromWireType(w) : void 0;
        return v;
      });
    }
    var Ib = (a) => {
        a = a.trim();
        const b = a.indexOf('(');
        return -1 !== b ? a.substr(0, b) : a;
      },
      Jb = [],
      J = [],
      Kb = (a) => {
        9 < a && 0 === --J[a + 1] && ((J[a] = void 0), Jb.push(a));
      },
      Lb = (a) => {
        if (!a) throw new D('Cannot use deleted val. handle = ' + a);
        return J[a];
      },
      xb = (a) => {
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
            const b = Jb.pop() || J.length;
            J[b] = a;
            J[b + 1] = 1;
            return b;
        }
      },
      Mb = {
        name: 'emscripten::val',
        fromWireType: (a) => {
          var b = Lb(a);
          Kb(a);
          return b;
        },
        toWireType: (a, b) => xb(b),
        Ic: 8,
        readValueFromPointer: Va,
        Jc: null,
      },
      Nb = (a, b, c) => {
        switch (b) {
          case 1:
            return c
              ? function (d) {
                  return this.fromWireType(q[d]);
                }
              : function (d) {
                  return this.fromWireType(t[d]);
                };
          case 2:
            return c
              ? function (d) {
                  return this.fromWireType(ra[d >> 1]);
                }
              : function (d) {
                  return this.fromWireType(sa[d >> 1]);
                };
          case 4:
            return c
              ? function (d) {
                  return this.fromWireType(x[d >> 2]);
                }
              : function (d) {
                  return this.fromWireType(y[d >> 2]);
                };
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Ob = (a, b) => {
        var c = Xa[a];
        if (void 0 === c) throw ((a = `${b} has unknown type ${Db(a)}`), new D(a));
        return c;
      },
      Pb = (a, b) => {
        switch (b) {
          case 4:
            return function (c) {
              return this.fromWireType(ta[c >> 2]);
            };
          case 8:
            return function (c) {
              return this.fromWireType(wa[c >> 3]);
            };
          default:
            throw new TypeError(`invalid float width (${b}): ${a}`);
        }
      },
      Qb = Object.assign({ optional: !0 }, Mb),
      Rb = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Sb = (a, b) => {
        var c = a >> 1;
        for (var d = c + b / 2; !(c >= d) && sa[c]; ) ++c;
        c <<= 1;
        if (32 < c - a && Rb) return Rb.decode(t.subarray(a, c));
        c = '';
        for (d = 0; !(d >= b / 2); ++d) {
          var e = ra[(a + 2 * d) >> 1];
          if (0 == e) break;
          c += String.fromCharCode(e);
        }
        return c;
      },
      Tb = (a, b, c) => {
        c ??= 2147483647;
        if (2 > c) return 0;
        c -= 2;
        var d = b;
        c = c < 2 * a.length ? c / 2 : a.length;
        for (var e = 0; e < c; ++e) (ra[b >> 1] = a.charCodeAt(e)), (b += 2);
        ra[b >> 1] = 0;
        return b - d;
      },
      Ub = (a) => 2 * a.length,
      Vb = (a, b) => {
        for (var c = 0, d = ''; !(c >= b / 4); ) {
          var e = x[(a + 4 * c) >> 2];
          if (0 == e) break;
          ++c;
          65536 <= e
            ? ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))))
            : (d += String.fromCharCode(e));
        }
        return d;
      },
      Wb = (a, b, c) => {
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
          x[b >> 2] = f;
          b += 4;
          if (b + 4 > c) break;
        }
        x[b >> 2] = 0;
        return b - d;
      },
      Xb = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          b += 4;
        }
        return b;
      },
      Yb = 0,
      Zb = (a, b, c) => {
        var d = [];
        a = a.toWireType(d, c);
        d.length && (y[b >> 2] = xb(d));
        return a;
      },
      $b = [],
      ac = (a) => {
        var b = $b.length;
        $b.push(a);
        return b;
      },
      bc = (a, b) => {
        for (var c = Array(a), d = 0; d < a; ++d) c[d] = Ob(y[(b + 4 * d) >> 2], 'parameter ' + d);
        return c;
      },
      cc = Reflect.construct,
      dc = {},
      ec = (a) => {
        if (!(a instanceof La || 'unwind' == a)) throw a;
      },
      fc = (a) => {
        qa = a;
        Na || 0 < Yb || (g.onExit?.(a), (pa = !0));
        throw new La(a);
      },
      gc = (a) => {
        if (!pa)
          try {
            if ((a(), !(Na || 0 < Yb)))
              try {
                (qa = a = qa), fc(a);
              } catch (b) {
                ec(b);
              }
          } catch (b) {
            ec(b);
          }
      },
      K,
      hc = (a) => {
        var b = a.getExtension('ANGLE_instanced_arrays');
        b &&
          ((a.vertexAttribDivisor = (c, d) => b.vertexAttribDivisorANGLE(c, d)),
          (a.drawArraysInstanced = (c, d, e, f) => b.drawArraysInstancedANGLE(c, d, e, f)),
          (a.drawElementsInstanced = (c, d, e, f, h) => b.drawElementsInstancedANGLE(c, d, e, f, h)));
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
      L = [],
      nc = [],
      oc = [],
      pc = [],
      M = [],
      qc = [],
      N = [],
      rc = [1, 1, 2, 2, 4, 4, 4, 2, 3, 4, 8],
      sc = (a) => {
        for (var b = lc++, c = a.length; c < b; c++) a[c] = null;
        return b;
      },
      tc = (a, b, c, d) => {
        for (var e = 0; e < a; e++) {
          var f = K[c](),
            h = f && sc(d);
          f ? ((f.name = h), (d[h] = f)) : (O ||= 1282);
          x[(b + 4 * e) >> 2] = h;
        }
      },
      uc = (a) => {
        a = 32 - Math.clz32(0 === a ? 0 : a - 1);
        var b = P.Sc[a];
        if (b) return b;
        b = K.getParameter(34965);
        P.Sc[a] = K.createBuffer();
        K.bindBuffer(34963, P.Sc[a]);
        K.bufferData(34963, 1 << a, 35048);
        K.bindBuffer(34963, b);
        return P.Sc[a];
      },
      wc = (a) => {
        vc = !1;
        for (var b = 0; b < P.nd; ++b) {
          var c = P.Qc[b];
          if (c.bd && c.enabled) {
            vc = !0;
            var d = c.size;
            var e = c.type,
              f = c.stride;
            d = 0 < f ? a * f : d * rc[e - 5120] * a;
            e = 32 - Math.clz32(0 === d ? 0 : d - 1);
            f = P.Tc[e];
            var h = P.Mc[e];
            P.Mc[e] = (P.Mc[e] + 1) & 63;
            var k = f[h];
            k
              ? (e = k)
              : ((k = K.getParameter(34964)),
                (f[h] = K.createBuffer()),
                K.bindBuffer(34962, f[h]),
                K.bufferData(34962, 1 << e, 35048),
                K.bindBuffer(34962, k),
                (e = f[h]));
            K.bindBuffer(34962, e);
            K.bufferSubData(34962, 0, t.subarray(c.Cc, c.Cc + d));
            c.Dd.call(K, b, c.size, c.type, c.yd, c.stride, 0);
          }
        }
      },
      yc = (a, b) => {
        a.ad ||
          ((a.ad = a.getContext),
          (a.getContext = function (d, e) {
            e = a.ad(d, e);
            return ('webgl' == d) == e instanceof WebGLRenderingContext ? e : null;
          }));
        var c = 1 < b.xd ? a.getContext('webgl2', b) : a.getContext('webgl', b);
        return c ? xc(c, b) : 0;
      },
      xc = (a, b) => {
        var c = sc(N),
          d = { handle: c, attributes: b, version: b.xd, Nc: a };
        a.canvas && (a.canvas.Ed = d);
        N[c] = d;
        ('undefined' == typeof b.vd || b.vd) && zc(d);
        d.nd = d.Nc.getParameter(34921);
        d.Qc = [];
        for (a = 0; a < d.nd; a++)
          d.Qc[a] = { enabled: !1, bd: !1, size: 0, type: 0, yd: 0, stride: 0, Cc: 0, Dd: null };
        d.Mc = [];
        d.kd = [];
        d.Mc.length = d.kd.length = 22;
        d.Tc = [];
        d.Yc = [];
        d.Tc.length = d.Yc.length = 22;
        d.Sc = [];
        d.Sc.length = 22;
        for (a = 0; 21 >= a; ++a) {
          d.Sc[a] = null;
          d.Mc[a] = d.kd[a] = 0;
          d.Tc[a] = [];
          d.Yc[a] = [];
          b = d.Tc[a];
          var e = d.Yc[a];
          b.length = e.length = 64;
          for (var f = 0; 64 > f; ++f) b[f] = e[f] = null;
        }
        return c;
      },
      zc = (a) => {
        a ||= P;
        if (!a.Qd) {
          a.Qd = !0;
          var b = a.Nc;
          b.he = b.getExtension('WEBGL_multi_draw');
          b.ce = b.getExtension('EXT_polygon_offset_clamp');
          b.be = b.getExtension('EXT_clip_control');
          b.oe = b.getExtension('WEBGL_polygon_mode');
          hc(b);
          ic(b);
          jc(b);
          b.Zd = b.getExtension('WEBGL_draw_instanced_base_vertex_base_instance');
          b.fe = b.getExtension('WEBGL_multi_draw_instanced_base_vertex_base_instance');
          2 <= a.version && (b.ud = b.getExtension('EXT_disjoint_timer_query_webgl2'));
          if (2 > a.version || !b.ud) b.ud = b.getExtension('EXT_disjoint_timer_query');
          kc(b).forEach((c) => {
            c.includes('lose_context') || c.includes('debug') || b.getExtension(c);
          });
        }
      },
      O,
      P,
      vc,
      Ac = [],
      Bc = {},
      Cc = ['default', 'low-power', 'high-performance'],
      Dc = [0, 'undefined' != typeof document ? document : 0, 'undefined' != typeof window ? window : 0],
      Ec = (a) => {
        a = 2 < a ? (a ? A(a) : '') : a;
        return Dc[a] || ('undefined' != typeof document ? document.querySelector(a) : null);
      },
      Fc = (a) => ({ width: y[a >> 2], height: y[(a + 4) >> 2], depthOrArrayLayers: y[(a + 8) >> 2] }),
      Hc = (a) => {
        var b = Q.get(y[(a + 4) >> 2]),
          c = a + 12;
        return {
          texture: b,
          mipLevel: y[(a + 8) >> 2],
          origin: { x: y[c >> 2], y: y[(c + 4) >> 2], z: y[(c + 8) >> 2] },
          aspect: Gc[y[(a + 24) >> 2]],
        };
      },
      Ic = (a, b) => {
        if (a) {
          for (var c = {}, d = 0; d < a; ++d) {
            var e = b + 16 * d;
            var f = (f = y[(e + 4) >> 2]) ? A(f) : '';
            c[f] = wa[(e + 8) >> 3];
          }
          return c;
        }
      },
      Kc = (a) => (a ? Jc.get(a) : 'auto'),
      Lc = [, 'clamp-to-edge', 'repeat', 'mirror-repeat'],
      Mc = [, 'opaque', 'premultiplied'],
      Nc = [
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
      Oc = [, 'add', 'subtract', 'reverse-subtract', 'min', 'max'],
      Pc = [, 'uniform', 'storage', 'read-only-storage'],
      Qc = [, 'never', 'less', 'equal', 'less-equal', 'greater', 'not-equal', 'greater-equal', 'always'],
      Rc = [, 'none', 'front', 'back'],
      Sc = [, 'nearest', 'linear'],
      Tc = [, 'ccw', 'cw'],
      Uc = [, 'uint16', 'uint32'],
      Vc = [, 'clear', 'load'],
      Wc = [, 'nearest', 'linear'],
      Xc = [, 'point-list', 'line-list', 'line-strip', 'triangle-list', 'triangle-strip'],
      Yc = [, 'filtering', 'non-filtering', 'comparison'],
      Zc = [
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
      $c = [, 'write-only', 'read-only', 'read-write'],
      ad = [, 'store', 'discard'],
      Gc = [, 'all', 'stencil-only', 'depth-only'],
      bd = [, '1d', '2d', '3d'],
      R = [
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
      cd = [, 'float', 'unfilterable-float', 'depth', 'sint', 'uint'],
      dd = [, '1d', '2d', '2d-array', 'cube', 'cube-array', '3d'],
      ed = [
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
      fd = [, 'vertex-buffer-not-used', 'vertex', 'instance'],
      gd,
      S,
      hd,
      jd,
      kd,
      T,
      ld,
      U,
      md,
      Q,
      nd,
      od,
      pd,
      Jc,
      qd,
      rd,
      sd,
      td = {},
      vd = () => {
        if (!ud) {
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
              _: ja || './this.program',
            },
            b;
          for (b in td) void 0 === td[b] ? delete a[b] : (a[b] = td[b]);
          var c = [];
          for (b in a) c.push(`${b}=${a[b]}`);
          ud = c;
        }
        return ud;
      },
      ud,
      wd = () => {
        var a = kc(K);
        return (a = a.concat(a.map((b) => 'GL_' + b)));
      },
      xd = (a, b) => {
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
              var d = K.getParameter(34467);
              c = d ? d.length : 0;
              break;
            case 33309:
              if (2 > P.version) {
                O ||= 1282;
                return;
              }
              c = wd().length;
              break;
            case 33307:
            case 33308:
              if (2 > P.version) {
                O ||= 1280;
                return;
              }
              c = 33307 == a ? 3 : 0;
          }
          if (void 0 === c)
            switch (((d = K.getParameter(a)), typeof d)) {
              case 'number':
                c = d;
                break;
              case 'boolean':
                c = d ? 1 : 0;
                break;
              case 'string':
                O ||= 1280;
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
                      O ||= 1280;
                      return;
                  }
                else {
                  if (
                    d instanceof Float32Array ||
                    d instanceof Uint32Array ||
                    d instanceof Int32Array ||
                    d instanceof Array
                  ) {
                    for (a = 0; a < d.length; ++a) x[(b + 4 * a) >> 2] = d[a];
                    return;
                  }
                  try {
                    c = d.name | 0;
                  } catch (e) {
                    O ||= 1280;
                    ma(
                      `GL_INVALID_ENUM in glGet${0}v: Unknown object returned from WebGL getParameter(${a})! (error: ${e})`,
                    );
                    return;
                  }
                }
                break;
              default:
                O ||= 1280;
                ma(
                  `GL_INVALID_ENUM in glGet${0}v: Native code calling glGet${0}v(${a}) and it returns ${d} of type ${typeof d}!`,
                );
                return;
            }
          x[b >> 2] = c;
        } else O ||= 1281;
      },
      yd = (a) => ']' == a.slice(-1) && a.lastIndexOf('['),
      zd = [],
      Ad = (a) => {
        a -= 5120;
        return 0 == a
          ? q
          : 1 == a
          ? t
          : 2 == a
          ? ra
          : 4 == a
          ? x
          : 6 == a
          ? ta
          : 5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a
          ? y
          : sa;
      },
      Bd = (a) => {
        var b = K.Gd;
        if (b) {
          var c = b.Zc[a];
          'number' == typeof c && (b.Zc[a] = c = K.getUniformLocation(b, b.Bd[a] + (0 < c ? `[${c}]` : '')));
          return c;
        }
        O ||= 1282;
      },
      Cd = [],
      Dd = () => {
        if ('object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
          return (a) => crypto.getRandomValues(a);
        Ea('initRandomDevice');
      },
      Ed = (a) => (Ed = Dd())(a),
      Fd = (a) => {
        function b(e) {
          if (e) return { operation: Oc[y[e >> 2]], srcFactor: Nc[y[(e + 4) >> 2]], dstFactor: Nc[y[(e + 8) >> 2]] };
        }
        function c(e) {
          return {
            compare: Qc[y[e >> 2]],
            failOp: Zc[y[(e + 4) >> 2]],
            depthFailOp: Zc[y[(e + 8) >> 2]],
            passOp: Zc[y[(e + 12) >> 2]],
          };
        }
        var d = {
          label: void 0,
          layout: Kc(y[(a + 8) >> 2]),
          vertex: (function (e) {
            if (e) {
              var f = rd.get(y[(e + 4) >> 2]),
                h = Ic(y[(e + 12) >> 2], y[(e + 16) >> 2]);
              var k = y[(e + 20) >> 2];
              var m = y[(e + 24) >> 2];
              if (k) {
                for (var n = [], p = 0; p < k; ++p) {
                  var r = n,
                    u = r.push;
                  var w = m + 24 * p;
                  if (w) {
                    var v = y[(w + 8) >> 2];
                    if (1 === v) var z = null;
                    else {
                      z = 4294967296 * y[(w + 4) >> 2] + y[w >> 2];
                      v = fd[v];
                      var I = y[(w + 12) >> 2];
                      w = y[(w + 16) >> 2];
                      for (var ca = [], E = 0; E < I; ++E) {
                        var da = ca,
                          Ga = da.push;
                        var Z = w + 24 * E;
                        Z = {
                          format: ed[y[Z >> 2]],
                          offset: 4294967296 * y[(Z + 4 + 8) >> 2] + y[(Z + 8) >> 2],
                          shaderLocation: y[(Z + 16) >> 2],
                        };
                        Ga.call(da, Z);
                      }
                      z = { arrayStride: z, stepMode: v, attributes: ca };
                    }
                  } else z = void 0;
                  u.call(r, z);
                }
                k = n;
              } else k = void 0;
              f = { module: f, constants: h, buffers: k };
              (e = y[(e + 8) >> 2]) && (f.entryPoint = e ? A(e) : '');
              return f;
            }
          })(a + 12),
          primitive: (function (e) {
            if (e) {
              var f = y[e >> 2];
              return {
                topology: Xc[y[(e + 4) >> 2]],
                stripIndexFormat: Uc[y[(e + 8) >> 2]],
                frontFace: Tc[y[(e + 12) >> 2]],
                cullMode: Rc[y[(e + 16) >> 2]],
                unclippedDepth: 7 === (f ? y[(f + 4) >> 2] : 0) && !!y[(f + 8) >> 2],
              };
            }
          })(a + 40),
          depthStencil: (function (e) {
            if (e)
              return {
                format: R[y[(e + 4) >> 2]],
                depthWriteEnabled: !!y[(e + 8) >> 2],
                depthCompare: Qc[y[(e + 12) >> 2]],
                stencilFront: c(e + 16),
                stencilBack: c(e + 32),
                stencilReadMask: y[(e + 48) >> 2],
                stencilWriteMask: y[(e + 52) >> 2],
                depthBias: x[(e + 56) >> 2],
                depthBiasSlopeScale: ta[(e + 60) >> 2],
                depthBiasClamp: ta[(e + 64) >> 2],
              };
          })(y[(a + 60) >> 2]),
          multisample: (function (e) {
            if (e) return { count: y[(e + 4) >> 2], mask: y[(e + 8) >> 2], alphaToCoverageEnabled: !!y[(e + 12) >> 2] };
          })(a + 64),
          fragment: (function (e) {
            if (e) {
              for (
                var f = rd.get(y[(e + 4) >> 2]),
                  h = Ic(y[(e + 12) >> 2], y[(e + 16) >> 2]),
                  k = y[(e + 20) >> 2],
                  m = y[(e + 24) >> 2],
                  n = [],
                  p = 0;
                p < k;
                ++p
              ) {
                var r = n,
                  u = r.push,
                  w = m + 16 * p,
                  v = y[(w + 4) >> 2];
                if (0 === v) w = void 0;
                else {
                  v = R[v];
                  var z = (z = y[(w + 8) >> 2]) ? { alpha: b(z + 12), color: b(z + 0) } : void 0;
                  w = { format: v, blend: z, writeMask: y[(w + 12) >> 2] };
                }
                u.call(r, w);
              }
              f = { module: f, constants: h, targets: n };
              (e = y[(e + 8) >> 2]) && (f.entryPoint = e ? A(e) : '');
              return f;
            }
          })(y[(a + 80) >> 2]),
        };
        (a = y[(a + 4) >> 2]) && (d.label = a ? A(a) : '');
        return d;
      };
    Za = g.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    for (var Gd = Array(256), Hd = 0; 256 > Hd; ++Hd) Gd[Hd] = String.fromCharCode(Hd);
    bb = Gd;
    D = g.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    Object.assign(ob.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof ob && a instanceof ob)) return !1;
        var b = this.Ac.Ec.Dc,
          c = this.Ac.Cc;
        a.Ac = a.Ac;
        var d = a.Ac.Ec.Dc;
        for (a = a.Ac.Cc; b.Hc; ) (c = b.$c(c)), (b = b.Hc);
        for (; d.Hc; ) (a = d.$c(a)), (d = d.Hc);
        return b === d && c === a;
      },
      clone: function () {
        this.Ac.Cc || eb(this);
        if (this.Ac.Xc) return (this.Ac.count.value += 1), this;
        var a = lb,
          b = Object,
          c = b.create,
          d = Object.getPrototypeOf(this),
          e = this.Ac;
        a = a(
          c.call(b, d, {
            Ac: { value: { count: e.count, Wc: e.Wc, Xc: e.Xc, Cc: e.Cc, Ec: e.Ec, Gc: e.Gc, Kc: e.Kc } },
          }),
        );
        a.Ac.count.value += 1;
        a.Ac.Wc = !1;
        return a;
      },
      ['delete']() {
        this.Ac.Cc || eb(this);
        if (this.Ac.Wc && !this.Ac.Xc) throw new D('Object already scheduled for deletion');
        gb(this);
        var a = this.Ac;
        --a.count.value;
        0 === a.count.value && (a.Gc ? a.Kc.Lc(a.Gc) : a.Ec.Dc.Lc(a.Cc));
        this.Ac.Xc || ((this.Ac.Gc = void 0), (this.Ac.Cc = void 0));
      },
      isDeleted: function () {
        return !this.Ac.Cc;
      },
      deleteLater: function () {
        this.Ac.Cc || eb(this);
        if (this.Ac.Wc && !this.Ac.Xc) throw new D('Object already scheduled for deletion');
        nb.push(this);
        this.Ac.Wc = !0;
        return this;
      },
    });
    Object.assign(zb.prototype, {
      Ld(a) {
        this.zd && (a = this.zd(a));
        return a;
      },
      td(a) {
        this.Lc?.(a);
      },
      Ic: 8,
      readValueFromPointer: Va,
      fromWireType: function (a) {
        function b() {
          return this.ed
            ? mb(this.Dc.Rc, { Ec: this.Rd, Cc: c, Kc: this, Gc: a })
            : mb(this.Dc.Rc, { Ec: this, Cc: a });
        }
        var c = this.Ld(a);
        if (!c) return this.td(a), null;
        var d = kb(this.Dc, c);
        if (void 0 !== d) {
          if (0 === d.Ac.count.value) return (d.Ac.Cc = c), (d.Ac.Gc = a), d.clone();
          d = d.clone();
          this.td(a);
          return d;
        }
        d = this.Dc.Kd(c);
        d = ib[d];
        if (!d) return b.call(this);
        d = this.dd ? d.Fd : d.pointerType;
        var e = hb(c, this.Dc, d.Dc);
        return null === e
          ? b.call(this)
          : this.ed
          ? mb(d.Dc.Rc, { Ec: d, Cc: e, Kc: this, Gc: a })
          : mb(d.Dc.Rc, { Ec: d, Cc: e });
      },
    });
    Bb = g.UnboundTypeError = ((a, b) => {
      var c = pb(b, function (d) {
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
    J.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1);
    g.count_emval_handles = () => J.length / 2 - 5 - Jb.length;
    var Id = () => {
      if (P) {
        var a = P.Tc;
        P.Tc = P.Yc;
        P.Yc = a;
        a = P.Mc;
        P.Mc = P.kd;
        P.kd = a;
        for (a = 0; 21 >= a; ++a) P.Mc[a] = 0;
      }
    };
    'undefined' != typeof MainLoop && MainLoop.ie.push(Id);
    (() => {
      function a() {
        this.Pc = {};
        this.ad = 1;
        this.create = function (b, c = {}) {
          var d = this.ad++;
          c.pd = 1;
          c.object = b;
          this.Pc[d] = c;
          return d;
        };
        this.get = function (b) {
          if (b) return this.Pc[b].object;
        };
        this.Ad = function (b) {
          this.Pc[b].pd++;
        };
        this.release = function (b) {
          var c = this.Pc[b];
          c.pd--;
          0 >= c.pd && delete this.Pc[b];
        };
      }
      gd = new a();
      new a();
      new a();
      S = new a();
      hd = new a();
      jd = new a();
      kd = new a();
      T = new a();
      new a();
      ld = new a();
      U = new a();
      md = new a();
      Q = new a();
      nd = new a();
      od = new a();
      pd = new a();
      Jc = new a();
      qd = new a();
      new a();
      rd = new a();
      new a();
      new a();
    })();
    for (var Jd = 0; 32 > Jd; ++Jd) zd.push(Array(Jd));
    var Kd = new Int32Array(288);
    for (Jd = 0; 288 >= Jd; ++Jd) Cd[Jd] = Kd.subarray(0, Jd);
    var Wd = {
        a: (a, b, c, d) =>
          Ea(
            `Assertion failed: ${a ? A(a) : ''}, at: ` +
              [b ? (b ? A(b) : '') : 'unknown filename', c, d ? (d ? A(d) : '') : 'unknown function'],
          ),
        p: (a, b, c) => {
          var d = new Pa(a);
          y[(d.Cc + 16) >> 2] = 0;
          y[(d.Cc + 4) >> 2] = b;
          y[(d.Cc + 8) >> 2] = c;
          Qa = a;
          Ra++;
          throw Qa;
        },
        Gb: () => {},
        Cb: () => {},
        Db: () => {},
        Ib: function () {},
        Eb: () => {},
        Kb: () => Ea(''),
        T: (a) => {
          var b = Ta[a];
          delete Ta[a];
          var c = b.od,
            d = b.Lc,
            e = b.wd,
            f = e.map((h) => h.Od).concat(e.map((h) => h.Wd));
          $a([a], f, (h) => {
            var k = {};
            e.forEach((m, n) => {
              var p = h[n],
                r = m.Md,
                u = m.Nd,
                w = h[n + e.length],
                v = m.Vd,
                z = m.Xd;
              k[m.Jd] = {
                read: (I) => p.fromWireType(r(u, I)),
                write: (I, ca) => {
                  var E = [];
                  v(z, I, w.toWireType(E, ca));
                  Ua(E);
                },
              };
            });
            return [
              {
                name: b.name,
                fromWireType: (m) => {
                  var n = {},
                    p;
                  for (p in k) n[p] = k[p].read(m);
                  d(m);
                  return n;
                },
                toWireType: (m, n) => {
                  for (var p in k) if (!(p in n)) throw new TypeError(`Missing field: "${p}"`);
                  var r = c();
                  for (p in k) k[p].write(r, n[p]);
                  null !== m && m.push(d, r);
                  return r;
                },
                Ic: 8,
                readValueFromPointer: Va,
                Jc: d,
              },
            ];
          });
        },
        ya: (a, b, c) => {
          b = C(b);
          B(a, {
            name: b,
            fromWireType: (d) => d,
            toWireType: function (d, e) {
              if ('bigint' != typeof e && 'number' != typeof e)
                throw new TypeError(`Cannot convert "${ab(e)}" to ${this.name}`);
              'number' == typeof e && (e = BigInt(e));
              return e;
            },
            Ic: 8,
            readValueFromPointer: db(b, c, -1 == b.indexOf('u')),
            Jc: null,
          });
        },
        Qb: (a, b, c, d) => {
          b = C(b);
          B(a, {
            name: b,
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, f) {
              return f ? c : d;
            },
            Ic: 8,
            readValueFromPointer: function (e) {
              return this.fromWireType(t[e]);
            },
            Jc: null,
          });
        },
        r: (a, b, c, d, e, f, h, k, m, n, p, r, u) => {
          p = C(p);
          f = G(e, f);
          k &&= G(h, k);
          n &&= G(m, n);
          u = G(r, u);
          var w = sb(p);
          rb(w, function () {
            Eb(`Cannot construct ${p} due to unbound types`, [d]);
          });
          $a([a, b, c], d ? [d] : [], (v) => {
            v = v[0];
            if (d) {
              var z = v.Dc;
              var I = z.Rc;
            } else I = ob.prototype;
            v = pb(p, function (...Ga) {
              if (Object.getPrototypeOf(this) !== ca) throw new D("Use 'new' to construct " + p);
              if (void 0 === E.Oc) throw new D(p + ' has no accessible constructor');
              var Z = E.Oc[Ga.length];
              if (void 0 === Z)
                throw new D(
                  `Tried to invoke ctor of ${p} with invalid number of parameters (${
                    Ga.length
                  }) - expected (${Object.keys(E.Oc).toString()}) parameters instead!`,
                );
              return Z.apply(this, Ga);
            });
            var ca = Object.create(I, { constructor: { value: v } });
            v.prototype = ca;
            var E = new tb(p, v, ca, u, z, f, k, n);
            if (E.Hc) {
              var da;
              (da = E.Hc).rd ?? (da.rd = []);
              E.Hc.rd.push(E);
            }
            z = new zb(p, E, !0, !1, !1);
            da = new zb(p + '*', E, !1, !1, !1);
            I = new zb(p + ' const*', E, !1, !0, !1);
            ib[a] = { pointerType: da, Fd: I };
            Ab(w, v);
            return [z, da, I];
          });
        },
        G: (a, b, c, d, e, f) => {
          var h = Fb(b, c);
          e = G(d, e);
          $a([], [a], (k) => {
            k = k[0];
            var m = `constructor ${k.name}`;
            void 0 === k.Dc.Oc && (k.Dc.Oc = []);
            if (void 0 !== k.Dc.Oc[b - 1])
              throw new D(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  k.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            k.Dc.Oc[b - 1] = () => {
              Eb(`Cannot construct ${k.name} due to unbound types`, h);
            };
            $a([], h, (n) => {
              n.splice(1, 0, null);
              k.Dc.Oc[b - 1] = Hb(m, n, null, e, f);
              return [];
            });
            return [];
          });
        },
        e: (a, b, c, d, e, f, h, k) => {
          var m = Fb(c, d);
          b = C(b);
          b = Ib(b);
          f = G(e, f);
          $a([], [a], (n) => {
            function p() {
              Eb(`Cannot call ${r} due to unbound types`, m);
            }
            n = n[0];
            var r = `${n.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            k && n.Dc.Sd.push(b);
            var u = n.Dc.Rc,
              w = u[b];
            void 0 === w || (void 0 === w.Fc && w.className !== n.name && w.Uc === c - 2)
              ? ((p.Uc = c - 2), (p.className = n.name), (u[b] = p))
              : (qb(u, b, r), (u[b].Fc[c - 2] = p));
            $a([], m, (v) => {
              v = Hb(r, v, n, f, h);
              void 0 === u[b].Fc ? ((v.Uc = c - 2), (u[b] = v)) : (u[b].Fc[c - 2] = v);
              return [];
            });
            return [];
          });
        },
        Ob: (a) => B(a, Mb),
        _: (a, b, c, d) => {
          function e() {}
          b = C(b);
          e.values = {};
          B(a, {
            name: b,
            constructor: e,
            fromWireType: function (f) {
              return this.constructor.values[f];
            },
            toWireType: (f, h) => h.value,
            Ic: 8,
            readValueFromPointer: Nb(b, c, d),
            Jc: null,
          });
          rb(b, e);
        },
        o: (a, b, c) => {
          var d = Ob(a, 'enum');
          b = C(b);
          a = d.constructor;
          d = Object.create(d.constructor.prototype, {
            value: { value: c },
            constructor: { value: pb(`${d.name}_${b}`, function () {}) },
          });
          a.values[c] = d;
          a[b] = d;
        },
        xa: (a, b, c) => {
          b = C(b);
          B(a, {
            name: b,
            fromWireType: (d) => d,
            toWireType: (d, e) => e,
            Ic: 8,
            readValueFromPointer: Pb(b, c),
            Jc: null,
          });
        },
        x: (a, b, c, d, e, f) => {
          var h = Fb(b, c);
          a = C(a);
          a = Ib(a);
          e = G(d, e);
          rb(
            a,
            function () {
              Eb(`Cannot call ${a} due to unbound types`, h);
            },
            b - 1,
          );
          $a([], h, (k) => {
            Ab(a, Hb(a, [k[0], null].concat(k.slice(1)), null, e, f), b - 1);
            return [];
          });
        },
        y: (a, b, c, d, e) => {
          b = C(b);
          -1 === e && (e = 4294967295);
          e = (k) => k;
          if (0 === d) {
            var f = 32 - 8 * c;
            e = (k) => (k << f) >>> f;
          }
          var h = b.includes('unsigned')
            ? function (k, m) {
                return m >>> 0;
              }
            : function (k, m) {
                return m;
              };
          B(a, { name: b, fromWireType: e, toWireType: h, Ic: 8, readValueFromPointer: db(b, c, 0 !== d), Jc: null });
        },
        m: (a, b, c) => {
          function d(f) {
            return new e(q.buffer, y[(f + 4) >> 2], y[f >> 2]);
          }
          var e = [
            Int8Array,
            Uint8Array,
            Int16Array,
            Uint16Array,
            Int32Array,
            Uint32Array,
            Float32Array,
            Float64Array,
            BigInt64Array,
            BigUint64Array,
          ][b];
          c = C(c);
          B(a, { name: c, fromWireType: d, Ic: 8, readValueFromPointer: d }, { Pd: !0 });
        },
        D: (a) => {
          B(a, Qb);
        },
        S: (a, b, c, d, e, f, h, k, m, n, p, r) => {
          c = C(c);
          f = G(e, f);
          k = G(h, k);
          n = G(m, n);
          r = G(p, r);
          $a([a], [b], (u) => {
            u = u[0];
            return [new zb(c, u.Dc, !1, !1, !0, u, d, f, k, n, r)];
          });
        },
        Pb: (a, b) => {
          b = C(b);
          B(a, {
            name: b,
            fromWireType: function (c) {
              for (var d = y[c >> 2], e = c + 4, f, h = e, k = 0; k <= d; ++k) {
                var m = e + k;
                if (k == d || 0 == t[m])
                  (h = h ? A(h, m - h) : ''),
                    void 0 === f ? (f = h) : ((f += String.fromCharCode(0)), (f += h)),
                    (h = m + 1);
              }
              H(c);
              return f;
            },
            toWireType: function (c, d) {
              d instanceof ArrayBuffer && (d = new Uint8Array(d));
              var e,
                f = 'string' == typeof d;
              if (!(f || d instanceof Uint8Array || d instanceof Uint8ClampedArray || d instanceof Int8Array))
                throw new D('Cannot pass non-string to std::string');
              if (f)
                for (var h = (e = 0); h < d.length; ++h) {
                  var k = d.charCodeAt(h);
                  127 >= k ? e++ : 2047 >= k ? (e += 2) : 55296 <= k && 57343 >= k ? ((e += 4), ++h) : (e += 3);
                }
              else e = d.length;
              h = Ld(4 + e + 1);
              k = h + 4;
              y[h >> 2] = e;
              if (f) Sa(d, k, e + 1);
              else if (f)
                for (f = 0; f < e; ++f) {
                  var m = d.charCodeAt(f);
                  if (255 < m) throw (H(k), new D('String has UTF-16 code units that do not fit in 8 bits'));
                  t[k + f] = m;
                }
              else for (f = 0; f < e; ++f) t[k + f] = d[f];
              null !== c && c.push(H, h);
              return h;
            },
            Ic: 8,
            readValueFromPointer: Va,
            Jc(c) {
              H(c);
            },
          });
        },
        $: (a, b, c) => {
          c = C(c);
          if (2 === b) {
            var d = Sb;
            var e = Tb;
            var f = Ub;
            var h = (k) => sa[k >> 1];
          } else 4 === b && ((d = Vb), (e = Wb), (f = Xb), (h = (k) => y[k >> 2]));
          B(a, {
            name: c,
            fromWireType: (k) => {
              for (var m = y[k >> 2], n, p = k + 4, r = 0; r <= m; ++r) {
                var u = k + 4 + r * b;
                if (r == m || 0 == h(u))
                  (p = d(p, u - p)), void 0 === n ? (n = p) : ((n += String.fromCharCode(0)), (n += p)), (p = u + b);
              }
              H(k);
              return n;
            },
            toWireType: (k, m) => {
              if ('string' != typeof m) throw new D(`Cannot pass non-string to C++ string type ${c}`);
              var n = f(m),
                p = Ld(4 + n + b);
              y[p >> 2] = n / b;
              e(m, p + 4, n + b);
              null !== k && k.push(H, p);
              return p;
            },
            Ic: 8,
            readValueFromPointer: Va,
            Jc(k) {
              H(k);
            },
          });
        },
        U: (a, b, c, d, e, f) => {
          Ta[a] = { name: C(b), od: G(c, d), Lc: G(e, f), wd: [] };
        },
        q: (a, b, c, d, e, f, h, k, m, n) => {
          Ta[a].wd.push({ Jd: C(b), Od: c, Md: G(d, e), Nd: f, Wd: h, Vd: G(k, m), Xd: n });
        },
        Rb: (a, b) => {
          b = C(b);
          B(a, { de: !0, name: b, Ic: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        Ab: () => {
          Na = !1;
          Yb = 0;
        },
        yb: () => {
          throw Infinity;
        },
        wa: (a, b, c) => {
          a = Lb(a);
          b = Ob(b, 'emval::as');
          return Zb(b, c, a);
        },
        F: (a, b, c, d) => {
          a = $b[a];
          b = Lb(b);
          return a(null, b, c, d);
        },
        jc: Kb,
        Wb: (a, b) => {
          a = Lb(a);
          b = Lb(b);
          return a == b;
        },
        E: (a, b, c) => {
          var d = bc(a, b),
            e = d.shift();
          a--;
          var f = Array(a);
          b = `methodCaller<(${d.map((h) => h.name).join(', ')}) => ${e.name}>`;
          return ac(
            pb(b, (h, k, m, n) => {
              for (var p = 0, r = 0; r < a; ++r) (f[r] = d[r].readValueFromPointer(n + p)), (p += d[r].Ic);
              h = 1 === c ? cc(k, f) : k.apply(h, f);
              return Zb(e, m, h);
            }),
          );
        },
        Ca: (a) => {
          9 < a && (J[a + 1] += 1);
        },
        Fb: (a) => {
          var b = Lb(a);
          Ua(b);
          Kb(a);
        },
        V: (a, b) => {
          a = Ob(a, '_emval_take_value');
          a = a.readValueFromPointer(b);
          return xb(a);
        },
        wb: (a, b) => {
          dc[a] && (clearTimeout(dc[a].id), delete dc[a]);
          if (!b) return 0;
          var c = setTimeout(() => {
            delete dc[a];
            gc(() => Md(a, performance.now()));
          }, b);
          dc[a] = { id: c, me: b };
          return 0;
        },
        xb: (a, b, c, d) => {
          var e = new Date().getFullYear(),
            f = new Date(e, 0, 1).getTimezoneOffset();
          e = new Date(e, 6, 1).getTimezoneOffset();
          y[a >> 2] = 60 * Math.max(f, e);
          x[b >> 2] = Number(f != e);
          b = (h) => {
            var k = Math.abs(h);
            return `UTC${0 <= h ? '-' : '+'}${String(Math.floor(k / 60)).padStart(2, '0')}${String(k % 60).padStart(
              2,
              '0',
            )}`;
          };
          a = b(f);
          b = b(e);
          e < f ? (Sa(a, c, 17), Sa(b, d, 17)) : (Sa(a, d, 17), Sa(b, c, 17));
        },
        ub: () => performance.now(),
        nb: (a) => !N[a] || N[a].Nc.isContextLost(),
        zb: (a) => {
          var b = t.length;
          a >>>= 0;
          if (2147483648 < a) return !1;
          for (var c = 1; 4 >= c; c *= 2) {
            var d = b * (1 + 0.2 / c);
            d = Math.min(d, a + 100663296);
            a: {
              d =
                ((Math.min(2147483648, 65536 * Math.ceil(Math.max(a, d) / 65536)) - oa.buffer.byteLength + 65535) /
                  65536) |
                0;
              try {
                oa.grow(d);
                xa();
                var e = 1;
                break a;
              } catch (f) {}
              e = void 0;
            }
            if (e) return !0;
          }
          return !1;
        },
        tb: (a, b) => {
          var c = b >> 2;
          b = {
            alpha: !!q[b + 0],
            depth: !!q[b + 1],
            stencil: !!q[b + 2],
            antialias: !!q[b + 3],
            premultipliedAlpha: !!q[b + 4],
            preserveDrawingBuffer: !!q[b + 5],
            powerPreference: Cc[x[c + 2]],
            failIfMajorPerformanceCaveat: !!q[b + 12],
            xd: x[c + 4],
            ge: x[c + 5],
            vd: q[b + 24],
            Id: q[b + 25],
            je: x[c + 7],
            ke: q[b + 32],
          };
          a = Ec(a);
          return !a || b.Id ? 0 : yc(a, b);
        },
        fb: (a) => {
          P == a && (P = 0);
          P === N[a] && (P = null);
          if ('object' == typeof Bc)
            for (var b = N[a].Nc.canvas, c = 0; c < Ac.length; ++c)
              if (Ac[c].target == b) {
                var d = c--,
                  e = Ac[d];
                e.target.removeEventListener(e.ae, e.$d, e.ne);
                Ac.splice(d, 1);
              }
          N[a] && N[a].Nc.canvas && (N[a].Nc.canvas.Ed = void 0);
          N[a] = null;
        },
        rb: () => (P ? P.handle : 0),
        ma: (a) => {
          P = N[a];
          g.ctx = K = P?.Nc;
          return !a || K ? 0 : -5;
        },
        qc: () => {
          if (void 0 === sd) {
            var a = g.preinitializedWebGPUDevice,
              b = { Td: hd.create(a.queue) };
            sd = S.create(a, b);
          }
          S.Ad(sd);
          return sd;
        },
        Mb: (a, b) => {
          var c = 0;
          vd().forEach((d, e) => {
            var f = b + c;
            e = y[(a + 4 * e) >> 2] = f;
            for (f = 0; f < d.length; ++f) q[e++] = d.charCodeAt(f);
            q[e] = 0;
            c += d.length + 1;
          });
          return 0;
        },
        Nb: (a, b) => {
          var c = vd();
          y[a >> 2] = c.length;
          var d = 0;
          c.forEach((e) => (d += e.length + 1));
          y[b >> 2] = d;
          return 0;
        },
        Jb: () => 52,
        Hb: () => 52,
        Ua: (a) => K.activeTexture(a),
        ia: (a, b) => {
          K.attachShader(L[a], M[b]);
        },
        K: (a, b) => {
          34962 == a ? (K.cd = b) : 34963 == a && (K.Vc = b);
          35051 == a ? (K.sd = b) : 35052 == a && (K.ld = b);
          K.bindBuffer(a, mc[b]);
        },
        Sa: (a, b, c, d, e) => {
          K.bindBufferRange(a, b, mc[c], d, e);
        },
        i: (a, b) => {
          K.bindFramebuffer(a, nc[b]);
        },
        Z: (a, b) => {
          K.bindRenderbuffer(a, oc[b]);
        },
        N: (a, b) => {
          K.bindTexture(a, pc[b]);
        },
        ka: (a) => {
          K.bindVertexArray(qc[a]);
          a = K.getParameter(34965);
          K.Vc = a ? a.name | 0 : 0;
        },
        X: (a) => K.blendEquation(a),
        w: (a, b) => K.blendFunc(a, b),
        z: (a, b, c, d, e, f, h, k, m, n) => K.blitFramebuffer(a, b, c, d, e, f, h, k, m, n),
        la: (a, b, c, d) => {
          2 <= P.version
            ? c && b
              ? K.bufferData(a, t, d, c, b)
              : K.bufferData(a, b, d)
            : K.bufferData(a, c ? t.subarray(c, c + b) : b, d);
        },
        ea: (a) => K.clear(a),
        fa: (a, b, c, d) => K.clearColor(a, b, c, d),
        Oa: (a) => K.clearDepth(a),
        Pa: (a) => K.clearStencil(a),
        H: (a, b, c, d) => {
          K.colorMask(!!a, !!b, !!c, !!d);
        },
        eb: (a) => {
          K.compileShader(M[a]);
        },
        cb: () => {
          var a = sc(L),
            b = K.createProgram();
          b.name = a;
          b.hd = b.fd = b.gd = 0;
          b.qd = 1;
          L[a] = b;
          return a;
        },
        hb: (a) => {
          var b = sc(M);
          M[b] = K.createShader(a);
          return b;
        },
        qb: (a) => K.cullFace(a),
        lb: (a, b) => {
          for (var c = 0; c < a; c++) {
            var d = x[(b + 4 * c) >> 2],
              e = mc[d];
            e &&
              (K.deleteBuffer(e),
              (e.name = 0),
              (mc[d] = null),
              d == K.cd && (K.cd = 0),
              d == K.Vc && (K.Vc = 0),
              d == K.sd && (K.sd = 0),
              d == K.ld && (K.ld = 0));
          }
        },
        ua: (a, b) => {
          for (var c = 0; c < a; ++c) {
            var d = x[(b + 4 * c) >> 2],
              e = nc[d];
            e && (K.deleteFramebuffer(e), (e.name = 0), (nc[d] = null));
          }
        },
        ga: (a) => {
          if (a) {
            var b = L[a];
            b ? (K.deleteProgram(b), (b.name = 0), (L[a] = null)) : (O ||= 1281);
          }
        },
        ta: (a, b) => {
          for (var c = 0; c < a; c++) {
            var d = x[(b + 4 * c) >> 2],
              e = oc[d];
            e && (K.deleteRenderbuffer(e), (e.name = 0), (oc[d] = null));
          }
        },
        Y: (a) => {
          if (a) {
            var b = M[a];
            b ? (K.deleteShader(b), (M[a] = null)) : (O ||= 1281);
          }
        },
        va: (a, b) => {
          for (var c = 0; c < a; c++) {
            var d = x[(b + 4 * c) >> 2],
              e = pc[d];
            e && (K.deleteTexture(e), (e.name = 0), (pc[d] = null));
          }
        },
        jb: (a, b) => {
          for (var c = 0; c < a; c++) {
            var d = x[(b + 4 * c) >> 2];
            K.deleteVertexArray(qc[d]);
            qc[d] = null;
          }
        },
        ob: (a) => K.depthFunc(a),
        P: (a) => {
          K.depthMask(!!a);
        },
        B: (a) => K.disable(a),
        Va: (a) => {
          P.Qc[a].enabled = !1;
          K.disableVertexAttribArray(a);
        },
        Wa: (a, b, c, d) => {
          var e = 0;
          if (!K.Vc) {
            var f = 1 * rc[c - 5120] * b;
            var h = uc(f);
            K.bindBuffer(34963, h);
            K.bufferSubData(34963, 0, t.subarray(d, d + f));
            if (0 < b)
              for (h = 0; h < P.nd; ++h)
                if (((f = P.Qc[h]), f.bd && f.enabled)) {
                  switch (c) {
                    case 5121:
                      e = Uint8Array;
                      break;
                    case 5123:
                      e = Uint16Array;
                      break;
                    case 5125:
                      e = Uint32Array;
                      break;
                    default:
                      O ||= 1282;
                      return;
                  }
                  e = new e(t.buffer, d, b).reduce((k, m) => Math.max(k, m)) + 1;
                  break;
                }
            d = 0;
          }
          wc(e);
          K.drawElements(a, b, c, d);
          vc && K.bindBuffer(34962, mc[K.cd]);
          K.Vc || K.bindBuffer(34963, null);
        },
        s: (a) => K.enable(a),
        Ra: (a) => {
          P.Qc[a].enabled = !0;
          K.enableVertexAttribArray(a);
        },
        pa: (a, b, c, d) => {
          K.framebufferRenderbuffer(a, b, c, oc[d]);
        },
        sb: (a, b, c, d, e) => {
          K.framebufferTexture2D(a, b, c, pc[d], e);
        },
        pb: (a) => K.frontFace(a),
        mb: (a, b) => {
          tc(a, b, 'createBuffer', mc);
        },
        sa: (a, b) => {
          tc(a, b, 'createFramebuffer', nc);
        },
        ra: (a, b) => {
          tc(a, b, 'createRenderbuffer', oc);
        },
        oa: (a, b) => {
          tc(a, b, 'createTexture', pc);
        },
        kb: (a, b) => {
          tc(a, b, 'createVertexArray', qc);
        },
        ib: (a, b) => xd(a, b),
        ab: (a, b, c, d) => {
          a = K.getProgramInfoLog(L[a]);
          null === a && (a = '(unknown error)');
          b = 0 < b && d ? Sa(a, d, b) : 0;
          c && (x[c >> 2] = b);
        },
        ha: (a, b, c) => {
          if (c)
            if (a >= lc) O ||= 1281;
            else if (((a = L[a]), 35716 == b))
              (a = K.getProgramInfoLog(a)), null === a && (a = '(unknown error)'), (x[c >> 2] = a.length + 1);
            else if (35719 == b) {
              if (!a.hd) {
                var d = K.getProgramParameter(a, 35718);
                for (b = 0; b < d; ++b) a.hd = Math.max(a.hd, K.getActiveUniform(a, b).name.length + 1);
              }
              x[c >> 2] = a.hd;
            } else if (35722 == b) {
              if (!a.fd)
                for (d = K.getProgramParameter(a, 35721), b = 0; b < d; ++b)
                  a.fd = Math.max(a.fd, K.getActiveAttrib(a, b).name.length + 1);
              x[c >> 2] = a.fd;
            } else if (35381 == b) {
              if (!a.gd)
                for (d = K.getProgramParameter(a, 35382), b = 0; b < d; ++b)
                  a.gd = Math.max(a.gd, K.getActiveUniformBlockName(a, b).length + 1);
              x[c >> 2] = a.gd;
            } else x[c >> 2] = K.getProgramParameter(a, b);
          else O ||= 1281;
        },
        db: (a, b, c, d) => {
          a = K.getShaderInfoLog(M[a]);
          null === a && (a = '(unknown error)');
          b = 0 < b && d ? Sa(a, d, b) : 0;
          c && (x[c >> 2] = b);
        },
        ja: (a, b, c) => {
          c
            ? 35716 == b
              ? ((a = K.getShaderInfoLog(M[a])),
                null === a && (a = '(unknown error)'),
                (x[c >> 2] = a ? a.length + 1 : 0))
              : 35720 == b
              ? ((a = K.getShaderSource(M[a])), (x[c >> 2] = a ? a.length + 1 : 0))
              : (x[c >> 2] = K.getShaderParameter(M[a], b))
            : (O ||= 1281);
        },
        Za: (a, b) => K.getUniformBlockIndex(L[a], b ? A(b) : ''),
        _a: (a, b) => {
          b = b ? A(b) : '';
          if ((a = L[a])) {
            var c = a,
              d = c.Zc,
              e = c.Cd,
              f;
            if (!d) {
              c.Zc = d = {};
              c.Bd = {};
              var h = K.getProgramParameter(c, 35718);
              for (f = 0; f < h; ++f) {
                var k = K.getActiveUniform(c, f);
                var m = k.name;
                k = k.size;
                var n = yd(m);
                n = 0 < n ? m.slice(0, n) : m;
                var p = c.qd;
                c.qd += k;
                e[n] = [k, p];
                for (m = 0; m < k; ++m) (d[p] = m), (c.Bd[p++] = n);
              }
            }
            c = a.Zc;
            d = 0;
            e = b;
            f = yd(b);
            0 < f && ((d = parseInt(b.slice(f + 1)) >>> 0), (e = b.slice(0, f)));
            if ((e = a.Cd[e]) && d < e[0] && ((d += e[1]), (c[d] = c[d] || K.getUniformLocation(a, b)))) return d;
          } else O ||= 1281;
          return -1;
        },
        Na: (a, b, c) => {
          for (var d = zd[b], e = 0; e < b; e++) d[e] = x[(c + 4 * e) >> 2];
          K.invalidateFramebuffer(a, d);
        },
        bb: (a) => {
          a = L[a];
          K.linkProgram(a);
          a.Zc = 0;
          a.Cd = {};
        },
        qa: (a, b, c, d, e) => K.renderbufferStorageMultisample(a, b, c, d, e),
        v: (a, b, c, d) => K.scissor(a, b, c, d),
        gb: (a, b, c, d) => {
          for (var e = '', f = 0; f < b; ++f) {
            var h = (h = y[(c + 4 * f) >> 2]) ? A(h, d ? y[(d + 4 * f) >> 2] : void 0) : '';
            e += h;
          }
          K.shaderSource(M[a], e);
        },
        R: (a, b, c) => K.stencilFunc(a, b, c),
        J: (a, b, c, d) => K.stencilFuncSeparate(a, b, c, d),
        Q: (a, b, c) => K.stencilOp(a, b, c),
        I: (a, b, c, d) => K.stencilOpSeparate(a, b, c, d),
        na: (a, b, c, d, e, f, h, k, m) => {
          if (2 <= P.version) {
            if (K.ld) {
              K.texImage2D(a, b, c, d, e, f, h, k, m);
              return;
            }
            if (m) {
              var n = Ad(k);
              m >>>= 31 - Math.clz32(n.BYTES_PER_ELEMENT);
              K.texImage2D(a, b, c, d, e, f, h, k, n, m);
              return;
            }
          }
          if (m) {
            n = Ad(k);
            var p =
              e *
              ((d *
                ({ 5: 3, 6: 4, 8: 2, 29502: 3, 29504: 4, 26917: 2, 26918: 2, 29846: 3, 29847: 4 }[h - 6402] || 1) *
                n.BYTES_PER_ELEMENT +
                4 -
                1) &
                -4);
            m = n.subarray(
              m >>> (31 - Math.clz32(n.BYTES_PER_ELEMENT)),
              (m + p) >>> (31 - Math.clz32(n.BYTES_PER_ELEMENT)),
            );
          } else m = null;
          K.texImage2D(a, b, c, d, e, f, h, k, m);
        },
        C: (a, b, c) => K.texParameteri(a, b, c),
        Xa: (a, b) => {
          K.uniform1f(Bd(a), b);
        },
        Ya: (a, b, c) => {
          if (2 <= P.version) b && K.uniform1iv(Bd(a), x, c >> 2, b);
          else {
            if (288 >= b) for (var d = Cd[b], e = 0; e < b; ++e) d[e] = x[(c + 4 * e) >> 2];
            else d = x.subarray(c >> 2, (c + 4 * b) >> 2);
            K.uniform1iv(Bd(a), d);
          }
        },
        Ta: (a, b, c) => {
          a = L[a];
          K.uniformBlockBinding(a, b, c);
        },
        $a: (a) => {
          a = L[a];
          K.useProgram(a);
          K.Gd = a;
        },
        Qa: (a, b, c, d, e, f) => {
          var h = P.Qc[a];
          K.cd
            ? ((h.bd = !1), K.vertexAttribPointer(a, b, c, !!d, e, f))
            : ((h.size = b),
              (h.type = c),
              (h.yd = d),
              (h.stride = e),
              (h.Cc = f),
              (h.bd = !0),
              (h.Dd = function (k, m, n, p, r, u) {
                this.vertexAttribPointer(k, m, n, p, r, u);
              }));
        },
        A: (a, b, c, d) => K.viewport(a, b, c, d),
        t: Nd,
        j: Od,
        g: Pd,
        za: Qd,
        Sb: Rd,
        b: Sd,
        d: Td,
        n: Ud,
        L: Vd,
        Lb: fc,
        Bb: (a, b) => {
          Ed(t.subarray(a, a + b));
          return 0;
        },
        Zb: (a) => pd.release(a),
        _b: (a) => ld.release(a),
        ic: (a) => {
          var b = U.Pc[a];
          if (b.jd) {
            for (var c = 0; c < b.jd.length; ++c) b.jd[c]();
            b.jd = void 0;
          }
          U.get(a).destroy();
        },
        W: function (a) {
          a = U.get(a).size;
          return BigInt(a);
        },
        hc: (a) => U.release(a),
        ec: (a) => jd.release(a),
        ba: (a, b) => {
          var c = y[b >> 2],
            d = void 0;
          0 !== c && (d = 4294967296 * y[(c + 12) >> 2] + y[(c + 8) >> 2]);
          var e = y[(b + 8) >> 2],
            f = y[(b + 12) >> 2];
          c = [];
          for (var h = 0; h < e; ++h) {
            var k = c,
              m = k.push;
            var n = f + 56 * h;
            var p = y[(n + 4) >> 2];
            if (0 !== p) {
              var r = x[(n + 8) >> 2];
              -1 == r && (r = void 0);
              var u = y[(n + 16) >> 2],
                w = y[(n + 20) >> 2];
              var v = n + 24;
              v = { r: wa[v >> 3], g: wa[(v + 8) >> 3], b: wa[(v + 16) >> 3], a: wa[(v + 24) >> 3] };
              n = {
                view: nd.get(p),
                depthSlice: r,
                resolveTarget: nd.get(y[(n + 12) >> 2]),
                clearValue: v,
                loadOp: Vc[u],
                storeOp: ad[w],
              };
            } else n = void 0;
            m.call(k, n);
          }
          e = y[(b + 16) >> 2];
          e =
            0 !== e
              ? {
                  view: nd.get(y[e >> 2]),
                  depthClearValue: ta[(e + 12) >> 2],
                  depthLoadOp: Vc[y[(e + 4) >> 2]],
                  depthStoreOp: ad[y[(e + 8) >> 2]],
                  depthReadOnly: !!y[(e + 16) >> 2],
                  stencilClearValue: y[(e + 28) >> 2],
                  stencilLoadOp: Vc[y[(e + 20) >> 2]],
                  stencilStoreOp: ad[y[(e + 24) >> 2]],
                  stencilReadOnly: !!y[(e + 32) >> 2],
                }
              : void 0;
          f = od.get(y[(b + 20) >> 2]);
          h = y[(b + 24) >> 2];
          h =
            0 !== h
              ? {
                  querySet: od.get(y[h >> 2]),
                  beginningOfPassWriteIndex: y[(h + 4) >> 2],
                  endOfPassWriteIndex: y[(h + 8) >> 2],
                }
              : void 0;
          d = {
            label: void 0,
            colorAttachments: c,
            depthStencilAttachment: e,
            occlusionQuerySet: f,
            timestampWrites: h,
            maxDrawCount: d,
          };
          (b = y[(b + 4) >> 2]) && (d.label = b ? A(b) : '');
          a = kd.get(a);
          return T.create(a.beginRenderPass(d));
        },
        $b: (a, b, c, d) => {
          a = kd.get(a);
          d = Fc(d);
          a.copyTextureToTexture(Hc(b), Hc(c), d);
        },
        fc: (a) => {
          a = kd.get(a);
          return jd.create(a.finish());
        },
        dc: (a) => kd.release(a),
        O: (a, b) => {
          for (var c = pd.get(y[(b + 8) >> 2]), d = y[(b + 12) >> 2], e = y[(b + 16) >> 2], f = [], h = 0; h < d; ++h) {
            var k = f,
              m = k.push;
            var n = e + 40 * h;
            var p = y[(n + 8) >> 2],
              r = y[(n + 32) >> 2],
              u = y[(n + 36) >> 2],
              w = y[(n + 4) >> 2];
            p
              ? ((r = n + 24),
                (r = y[r >> 2] + 4294967296 * x[(r + 4) >> 2]),
                -1 == r && (r = void 0),
                (n = {
                  binding: w,
                  resource: { buffer: U.get(p), offset: 4294967296 * y[(n + 4 + 16) >> 2] + y[(n + 16) >> 2], size: r },
                }))
              : (n = r ? { binding: w, resource: md.get(r) } : { binding: w, resource: nd.get(u) });
            m.call(k, n);
          }
          c = { label: void 0, layout: c, entries: f };
          (b = y[(b + 4) >> 2]) && (c.label = b ? A(b) : '');
          a = S.get(a);
          return ld.create(a.createBindGroup(c));
        },
        u: (a, b) => {
          for (var c = y[(b + 8) >> 2], d = y[(b + 12) >> 2], e = [], f = 0; f < c; ++f) {
            var h = e,
              k = h.push,
              m = d + 80 * f,
              n = y[(m + 4) >> 2],
              p = y[(m + 8) >> 2];
            var r = m + 16;
            var u = y[(r + 4) >> 2];
            r = u
              ? {
                  type: Pc[u],
                  hasDynamicOffset: !!y[(r + 8) >> 2],
                  minBindingSize: 4294967296 * y[(r + 4 + 16) >> 2] + y[(r + 16) >> 2],
                }
              : void 0;
            u = (u = y[(m + 40 + 4) >> 2]) ? { type: Yc[u] } : void 0;
            var w = m + 48;
            var v = y[(w + 4) >> 2];
            w = v
              ? { sampleType: cd[v], viewDimension: dd[y[(w + 8) >> 2]], multisampled: !!y[(w + 12) >> 2] }
              : void 0;
            m += 64;
            m = (v = y[(m + 4) >> 2])
              ? { access: $c[v], format: R[y[(m + 8) >> 2]], viewDimension: dd[y[(m + 12) >> 2]] }
              : void 0;
            k.call(h, { binding: n, visibility: p, buffer: r, sampler: u, texture: w, storageTexture: m });
          }
          c = { entries: e };
          (b = y[(b + 4) >> 2]) && (c.label = b ? A(b) : '');
          a = S.get(a);
          return pd.create(a.createBindGroupLayout(c));
        },
        ca: (a, b) => {
          var c = !!y[(b + 24) >> 2],
            d = {
              label: void 0,
              usage: y[(b + 8) >> 2],
              size: 4294967296 * y[(b + 4 + 16) >> 2] + y[(b + 16) >> 2],
              mappedAtCreation: c,
            };
          (b = y[(b + 4) >> 2]) && (d.label = b ? A(b) : '');
          b = S.get(a);
          a = {};
          d = U.create(b.createBuffer(d), a);
          c && ((a.ee = 2), (a.jd = []));
          return d;
        },
        gc: (a, b) => {
          if (b) {
            var c = { label: void 0 };
            (b = y[(b + 4) >> 2]) && (c.label = b ? A(b) : '');
          }
          a = S.get(a);
          return kd.create(a.createCommandEncoder(c));
        },
        Xb: (a, b) => {
          for (var c = y[(b + 8) >> 2], d = y[(b + 12) >> 2], e = [], f = 0; f < c; ++f)
            e.push(pd.get(y[(d + 4 * f) >> 2]));
          c = { label: void 0, bindGroupLayouts: e };
          (b = y[(b + 4) >> 2]) && (c.label = b ? A(b) : '');
          a = S.get(a);
          return Jc.create(a.createPipelineLayout(c));
        },
        k: (a, b) => {
          b = Fd(b);
          a = S.get(a);
          return qd.create(a.createRenderPipeline(b));
        },
        La: (a, b) => {
          if (b) {
            var c = {
              label: void 0,
              addressModeU: Lc[y[(b + 8) >> 2]],
              addressModeV: Lc[y[(b + 12) >> 2]],
              addressModeW: Lc[y[(b + 16) >> 2]],
              magFilter: Sc[y[(b + 20) >> 2]],
              minFilter: Sc[y[(b + 24) >> 2]],
              mipmapFilter: Wc[y[(b + 28) >> 2]],
              lodMinClamp: ta[(b + 32) >> 2],
              lodMaxClamp: ta[(b + 36) >> 2],
              compare: Qc[y[(b + 40) >> 2]],
            };
            (b = y[(b + 4) >> 2]) && (c.label = b ? A(b) : '');
          }
          a = S.get(a);
          return md.create(a.createSampler(c));
        },
        Yb: (a, b) => {
          var c = y[b >> 2],
            d = y[(c + 4) >> 2],
            e = { label: void 0, code: '' };
          (b = y[(b + 4) >> 2]) && (e.label = b ? A(b) : '');
          switch (d) {
            case 5:
              d = y[(c + 12) >> 2] >> 2;
              e.code = y.subarray(d, d + y[(c + 8) >> 2]);
              break;
            case 6:
              (c = y[(c + 8) >> 2]) && (e.code = c ? A(c) : '');
          }
          a = S.get(a);
          return rd.create(a.createShaderModule(e));
        },
        da: (a, b) => {
          var c = {
              label: void 0,
              size: Fc(b + 16),
              mipLevelCount: y[(b + 32) >> 2],
              sampleCount: y[(b + 36) >> 2],
              dimension: bd[y[(b + 12) >> 2]],
              format: R[y[(b + 28) >> 2]],
              usage: y[(b + 8) >> 2],
            },
            d = y[(b + 4) >> 2];
          d && (c.label = d ? A(d) : '');
          if ((d = y[(b + 40) >> 2]))
            (b = y[(b + 44) >> 2]), (c.viewFormats = Array.from(x.subarray(b >> 2, (b + 4 * d) >> 2), (e) => R[e]));
          a = S.get(a);
          return Q.create(a.createTexture(c));
        },
        Ma: (a) => {
          a = S.Pc[a].Td;
          hd.Ad(a);
          return a;
        },
        vb: (a) => S.release(a),
        pc: (a, b) => {
          a = Ec(y[(y[b >> 2] + 8) >> 2]).getContext('webgpu');
          if (!a) return 0;
          if ((b = y[(b + 4) >> 2])) a.le = b ? A(b) : '';
          return gd.create(a);
        },
        Ub: (a) => Jc.release(a),
        oc: (a) => hd.release(a),
        Fa: (a, b, c) => {
          a = hd.get(a);
          b = Array.from(x.subarray(c >> 2, (c + 4 * b) >> 2), (d) => jd.get(d));
          a.submit(b);
        },
        M: function (a, b, c, d, e) {
          c = -9007199254740992 > c || 9007199254740992 < c ? NaN : Number(c);
          a = hd.get(a);
          b = U.get(b);
          a.writeBuffer(b, c, t.subarray(d, d + e), 0, e);
        },
        Ha: (a, b, c, d, e, f) => {
          a = hd.get(a);
          b = Hc(b);
          var h = y[(e + 16) >> 2],
            k = y[(e + 20) >> 2];
          a.writeTexture(
            b,
            t.subarray(c, c + d),
            {
              offset: 4294967296 * y[(e + 4 + 8) >> 2] + y[(e + 8) >> 2],
              bytesPerRow: 4294967295 === h ? void 0 : h,
              rowsPerImage: 4294967295 === k ? void 0 : k,
            },
            Fc(f),
          );
        },
        Aa: (a, b, c, d, e, f) => {
          T.get(a).drawIndexed(b, c, d, e, f);
        },
        Ea: (a) => {
          T.get(a).end();
        },
        Da: (a) => T.release(a),
        c: (a, b, c, d, e) => {
          a = T.get(a);
          c = ld.get(c);
          if (0 == d) a.setBindGroup(b, c);
          else {
            for (var f = [], h = 0; h < d; h++, e += 4) f.push(y[e >> 2]);
            a.setBindGroup(b, c, f);
          }
        },
        Ba: function (a, b, c, d, e) {
          d = -9007199254740992 > d || 9007199254740992 < d ? NaN : Number(d);
          e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
          a = T.get(a);
          b = U.get(b);
          -1 == e && (e = void 0);
          a.setIndexBuffer(b, Uc[c], d, e);
        },
        f: (a, b) => {
          a = T.get(a);
          b = qd.get(b);
          a.setPipeline(b);
        },
        l: (a, b, c, d, e) => {
          T.get(a).setScissorRect(b, c, d, e);
        },
        h: (a, b) => {
          T.get(a).setStencilReference(b);
        },
        aa: function (a, b, c, d, e) {
          d = -9007199254740992 > d || 9007199254740992 < d ? NaN : Number(d);
          e = -9007199254740992 > e || 9007199254740992 < e ? NaN : Number(e);
          a = T.get(a);
          c = U.get(c);
          -1 == e && (e = void 0);
          a.setVertexBuffer(b, c, d, e);
        },
        Vb: (a) => qd.release(a),
        Ka: (a) => md.release(a),
        Tb: (a) => rd.release(a),
        bc: (a, b) => {
          var c = y[(b + 4) >> 2];
          a = gd.get(a);
          var d = [y[(b + 28) >> 2], y[(b + 32) >> 2]];
          0 !== d[0] && (a.canvas.width = d[0]);
          0 !== d[1] && (a.canvas.height = d[1]);
          c = {
            device: S.get(c),
            format: R[y[(b + 8) >> 2]],
            usage: y[(b + 12) >> 2],
            alphaMode: Mc[y[(b + 24) >> 2]],
          };
          if ((d = y[(b + 16) >> 2]))
            (b = y[(b + 20) >> 2]), (c.viewFormats = Array.from(x.subarray(b >> 2, (b + 4 * d) >> 2), (e) => R[e]));
          a.configure(c);
        },
        ac: (a, b) => {
          a = gd.get(a);
          try {
            var c = Q.create(a.getCurrentTexture());
            y[b >> 2] = c;
            x[(b + 4) >> 2] = 0;
            x[(b + 8) >> 2] = 0;
          } catch (d) {
            (y[b >> 2] = 0), (x[(b + 4) >> 2] = 0), (x[(b + 8) >> 2] = 5);
          }
        },
        cc: (a) => {
          gd.get(a).unconfigure();
        },
        lc: (a, b) => {
          if (b) {
            var c = y[(b + 20) >> 2];
            var d = y[(b + 28) >> 2];
            c = {
              format: R[y[(b + 8) >> 2]],
              dimension: dd[y[(b + 12) >> 2]],
              baseMipLevel: y[(b + 16) >> 2],
              mipLevelCount: 4294967295 === c ? void 0 : c,
              baseArrayLayer: y[(b + 24) >> 2],
              arrayLayerCount: 4294967295 === d ? void 0 : d,
              aspect: Gc[y[(b + 32) >> 2]],
            };
            (b = y[(b + 4) >> 2]) && (c.label = b ? A(b) : '');
          }
          a = Q.get(a);
          return nd.create(a.createView(c));
        },
        nc: (a) => Q.get(a).destroy(),
        mc: (a) => {
          a = Q.get(a);
          return R.indexOf(a.format);
        },
        Ia: (a) => Q.get(a).height,
        Ja: (a) => Q.get(a).width,
        Ga: (a) => Q.release(a),
        kc: (a) => nd.release(a),
      },
      V;
    (async function () {
      function a(d) {
        V = d.exports;
        oa = V.rc;
        xa();
        F = V.uc;
        za.unshift(V.sc);
        Ca--;
        g.monitorRunDependencies?.(Ca);
        0 == Ca && Da && ((d = Da), (Da = null), d());
        return V;
      }
      Ca++;
      g.monitorRunDependencies?.(Ca);
      var b = { a: Wd };
      if (g.instantiateWasm)
        try {
          return g.instantiateWasm(b, a);
        } catch (d) {
          ma(`Module.instantiateWasm callback failed with error: ${d}`), ba(d);
        }
      Ha ??= Fa('DotLottiePlayer.wasm')
        ? 'DotLottiePlayer.wasm'
        : g.locateFile
        ? g.locateFile('DotLottiePlayer.wasm', l)
        : l + 'DotLottiePlayer.wasm';
      try {
        var c = await Ka(b);
        a(c.instance);
        return c;
      } catch (d) {
        ba(d);
      }
    })();
    var Ld = (g._malloc = (a) => (Ld = g._malloc = V.tc)(a)),
      H = (g._free = (a) => (H = g._free = V.vc)(a)),
      Cb = (a) => (Cb = V.wc)(a),
      Md = (a, b) => (Md = V.xc)(a, b),
      W = (a, b) => (W = V.yc)(a, b),
      X = (a) => (X = V.zc)(a),
      Y = () => (Y = V.Bc)();
    function Nd(a, b) {
      var c = Y();
      try {
        return F.get(a)(b);
      } catch (d) {
        X(c);
        if (d !== d + 0) throw d;
        W(1, 0);
      }
    }
    function Qd(a, b, c, d, e, f) {
      var h = Y();
      try {
        return F.get(a)(b, c, d, e, f);
      } catch (k) {
        X(h);
        if (k !== k + 0) throw k;
        W(1, 0);
      }
    }
    function Sd(a, b) {
      var c = Y();
      try {
        F.get(a)(b);
      } catch (d) {
        X(c);
        if (d !== d + 0) throw d;
        W(1, 0);
      }
    }
    function Ud(a, b, c, d) {
      var e = Y();
      try {
        F.get(a)(b, c, d);
      } catch (f) {
        X(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function Od(a, b, c) {
      var d = Y();
      try {
        return F.get(a)(b, c);
      } catch (e) {
        X(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function Td(a, b, c) {
      var d = Y();
      try {
        F.get(a)(b, c);
      } catch (e) {
        X(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function Rd(a) {
      var b = Y();
      try {
        F.get(a)();
      } catch (c) {
        X(b);
        if (c !== c + 0) throw c;
        W(1, 0);
      }
    }
    function Pd(a, b, c, d) {
      var e = Y();
      try {
        return F.get(a)(b, c, d);
      } catch (f) {
        X(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function Vd(a, b, c, d, e) {
      var f = Y();
      try {
        F.get(a)(b, c, d, e);
      } catch (h) {
        X(f);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    var Xd;
    Da = function Yd() {
      Xd || Zd();
      Xd || (Da = Yd);
    };
    function Zd() {
      function a() {
        if (!Xd && ((Xd = !0), (g.calledRun = !0), !pa)) {
          Ma(za);
          aa(g);
          g.onRuntimeInitialized?.();
          if (g.postRun)
            for ('function' == typeof g.postRun && (g.postRun = [g.postRun]); g.postRun.length; ) {
              var b = g.postRun.shift();
              Aa.unshift(b);
            }
          Ma(Aa);
        }
      }
      if (!(0 < Ca)) {
        if (g.preRun) for ('function' == typeof g.preRun && (g.preRun = [g.preRun]); g.preRun.length; ) Ba();
        Ma(ya);
        0 < Ca ||
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
    Zd();
    moduleRtn = ea;

    return moduleRtn;
  };
})();
export default createDotLottiePlayerModule;
