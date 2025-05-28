var createDotLottiePlayerModule = (() => {
  return async function (moduleArg = {}) {
    var moduleRtn;

    var n = moduleArg,
      aa,
      ba,
      ca = new Promise((b, a) => {
        aa = b;
        ba = a;
      }),
      da = './this.program',
      ea = import.meta.url,
      fa = '',
      ha;
    try {
      fa = new URL('.', ea).href;
    } catch {}
    ha = async (b) => {
      b = await fetch(b, { credentials: 'same-origin' });
      if (b.ok) return b.arrayBuffer();
      throw Error(b.status + ' : ' + b.url);
    };
    var ia = console.log.bind(console),
      p = console.error.bind(console),
      q,
      la,
      ma = !1,
      na,
      r,
      t,
      v,
      x,
      A,
      B,
      oa,
      pa,
      qa,
      ra;
    function sa() {
      var b = la.buffer;
      r = new Int8Array(b);
      v = new Int16Array(b);
      t = new Uint8Array(b);
      x = new Uint16Array(b);
      A = new Int32Array(b);
      B = new Uint32Array(b);
      oa = new Float32Array(b);
      ra = new Float64Array(b);
      pa = new BigInt64Array(b);
      qa = new BigUint64Array(b);
    }
    var C = 0,
      D = null;
    function ta(b) {
      n.onAbort?.(b);
      b = 'Aborted(' + b + ')';
      p(b);
      ma = !0;
      b = new WebAssembly.RuntimeError(b + '. Build with -sASSERTIONS for more info.');
      ba(b);
      throw b;
    }
    var ua;
    async function va(b) {
      if (!q)
        try {
          var a = await ha(b);
          return new Uint8Array(a);
        } catch {}
      if (b == ua && q) b = new Uint8Array(q);
      else throw 'both async and sync fetching of the wasm failed';
      return b;
    }
    async function wa(b, a) {
      try {
        var c = await va(b);
        return await WebAssembly.instantiate(c, a);
      } catch (d) {
        p(`failed to asynchronously prepare wasm: ${d}`), ta(d);
      }
    }
    async function xa(b) {
      var a = ua;
      if (!q && 'function' == typeof WebAssembly.instantiateStreaming)
        try {
          var c = fetch(a, { credentials: 'same-origin' });
          return await WebAssembly.instantiateStreaming(c, b);
        } catch (d) {
          p(`wasm streaming compile failed: ${d}`), p('falling back to ArrayBuffer instantiation');
        }
      return wa(a, b);
    }
    class ya {
      name = 'ExitStatus';
      constructor(b) {
        this.message = `Program terminated with exit(${b})`;
        this.status = b;
      }
    }
    var za = (b) => {
        for (; 0 < b.length; ) b.shift()(n);
      },
      Aa = [],
      Ba = [],
      Ca = () => {
        var b = n.preRun.shift();
        Ba.push(b);
      },
      Da = !0,
      Ea = 'undefined' != typeof TextDecoder ? new TextDecoder() : void 0,
      F = (b, a = 0, c = NaN) => {
        var d = a + c;
        for (c = a; b[c] && !(c >= d); ) ++c;
        if (16 < c - a && b.buffer && Ea) return Ea.decode(b.subarray(a, c));
        for (d = ''; a < c; ) {
          var e = b[a++];
          if (e & 128) {
            var f = b[a++] & 63;
            if (192 == (e & 224)) d += String.fromCharCode(((e & 31) << 6) | f);
            else {
              var g = b[a++] & 63;
              e =
                224 == (e & 240)
                  ? ((e & 15) << 12) | (f << 6) | g
                  : ((e & 7) << 18) | (f << 12) | (g << 6) | (b[a++] & 63);
              65536 > e
                ? (d += String.fromCharCode(e))
                : ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))));
            }
          } else d += String.fromCharCode(e);
        }
        return d;
      },
      Fa = [],
      Ga = 0,
      H = 0;
    class Ha {
      constructor(b) {
        this.ac = b;
        this.Ab = b - 24;
      }
    }
    var Ka = (b) => {
        var a = H;
        if (!a) return Ia(0), 0;
        var c = new Ha(a);
        B[(c.Ab + 16) >> 2] = a;
        var d = B[(c.Ab + 4) >> 2];
        if (!d) return Ia(0), a;
        for (var e of b) {
          if (0 === e || e === d) break;
          if (Ja(e, d, c.Ab + 16)) return Ia(e), a;
        }
        Ia(d);
        return a;
      },
      La = (b, a) => Object.defineProperty(a, 'name', { value: b }),
      Ma = [],
      I = [],
      K = (n.BindingError = class extends Error {
        constructor(b) {
          super(b);
          this.name = 'BindingError';
        }
      }),
      Na = (b) => {
        throw new K(b);
      },
      L = (b) => {
        if (!b) throw new K(`Cannot use deleted val. handle = ${b}`);
        return I[b];
      },
      Oa = (b) => {
        switch (b) {
          case void 0:
            return 2;
          case null:
            return 4;
          case !0:
            return 6;
          case !1:
            return 8;
          default:
            const a = Ma.pop() || I.length;
            I[a] = b;
            I[a + 1] = 1;
            return a;
        }
      };
    class Pa extends Error {}
    var Qa,
      M = (b) => {
        for (var a = ''; t[b]; ) a += Qa[t[b++]];
        return a;
      },
      Ra = {},
      Sa = (b, a) => {
        if (void 0 === a) throw new K('ptr should not be undefined');
        for (; b.Eb; ) (a = b.Pb(a)), (b = b.Eb);
        return a;
      },
      N = {},
      Va = (b) => {
        b = Ua(b);
        var a = M(b);
        O(b);
        return a;
      },
      Wa = (b, a) => {
        var c = N[b];
        if (void 0 === c) throw ((b = `${a} has unknown type ${Va(b)}`), new K(b));
        return c;
      },
      Xa = () => {},
      Ya = !1,
      P = (b) => {
        if ('undefined' === typeof FinalizationRegistry) return (P = (a) => a), b;
        Ya = new FinalizationRegistry((a) => {
          a = a.zb;
          --a.count.value;
          0 === a.count.value && (a.Fb ? a.Ib.Jb(a.Fb) : a.Cb.Bb.Jb(a.Ab));
        });
        P = (a) => {
          var c = a.zb;
          c.Fb && Ya.register(a, { zb: c }, a);
          return a;
        };
        Xa = (a) => {
          Ya.unregister(a);
        };
        return P(b);
      },
      Za = {},
      $a = (b) => {
        for (; b.length; ) {
          var a = b.pop();
          b.pop()(a);
        }
      };
    function ab(b) {
      return this.fromWireType(B[b >> 2]);
    }
    var Q = {},
      bb = {},
      cb = (n.InternalError = class extends Error {
        constructor(b) {
          super(b);
          this.name = 'InternalError';
        }
      }),
      S = (b, a, c) => {
        function d(h) {
          h = c(h);
          if (h.length !== b.length) throw new cb('Mismatched type converter count');
          for (var k = 0; k < b.length; ++k) R(b[k], h[k]);
        }
        b.forEach((h) => (bb[h] = a));
        var e = Array(a.length),
          f = [],
          g = 0;
        a.forEach((h, k) => {
          N.hasOwnProperty(h)
            ? (e[k] = N[h])
            : (f.push(h),
              Q.hasOwnProperty(h) || (Q[h] = []),
              Q[h].push(() => {
                e[k] = N[h];
                ++g;
                g === f.length && d(e);
              }));
        });
        0 === f.length && d(e);
      },
      db = (b) => {
        if (null === b) return 'null';
        var a = typeof b;
        return 'object' === a || 'array' === a || 'function' === a ? b.toString() : '' + b;
      };
    function eb(b, a, c = {}) {
      var d = a.name;
      if (!b) throw new K(`type "${d}" must have a positive integer typeid pointer`);
      if (N.hasOwnProperty(b)) {
        if (c.ic) return;
        throw new K(`Cannot register type '${d}' twice`);
      }
      N[b] = a;
      delete bb[b];
      Q.hasOwnProperty(b) && ((a = Q[b]), delete Q[b], a.forEach((e) => e()));
    }
    function R(b, a, c = {}) {
      return eb(b, a, c);
    }
    var fb = (b, a, c) => {
        switch (a) {
          case 1:
            return c ? (d) => r[d] : (d) => t[d];
          case 2:
            return c ? (d) => v[d >> 1] : (d) => x[d >> 1];
          case 4:
            return c ? (d) => A[d >> 2] : (d) => B[d >> 2];
          case 8:
            return c ? (d) => pa[d >> 3] : (d) => qa[d >> 3];
          default:
            throw new TypeError(`invalid integer width (${a}): ${b}`);
        }
      },
      gb = (b) => {
        throw new K(b.zb.Cb.Bb.name + ' instance already deleted');
      },
      hb = [];
    function ib() {}
    var jb = {},
      kb = (b, a, c) => {
        if (void 0 === b[a].Db) {
          var d = b[a];
          b[a] = function (...e) {
            if (!b[a].Db.hasOwnProperty(e.length))
              throw new K(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${b[a].Db})!`,
              );
            return b[a].Db[e.length].apply(this, e);
          };
          b[a].Db = [];
          b[a].Db[d.Lb] = d;
        }
      },
      lb = (b, a, c) => {
        if (n.hasOwnProperty(b)) {
          if (void 0 === c || (void 0 !== n[b].Db && void 0 !== n[b].Db[c]))
            throw new K(`Cannot register public name '${b}' twice`);
          kb(n, b, b);
          if (n[b].Db.hasOwnProperty(c))
            throw new K(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          n[b].Db[c] = a;
        } else (n[b] = a), (n[b].Lb = c);
      },
      mb = (b) => {
        b = b.replace(/[^a-zA-Z0-9_]/g, '$');
        var a = b.charCodeAt(0);
        return 48 <= a && 57 >= a ? `_${b}` : b;
      };
    function nb(b, a, c, d, e, f, g, h) {
      this.name = b;
      this.constructor = a;
      this.Kb = c;
      this.Jb = d;
      this.Eb = e;
      this.cc = f;
      this.Pb = g;
      this.$b = h;
      this.Xb = [];
    }
    var ob = (b, a, c) => {
      for (; a !== c; ) {
        if (!a.Pb) throw new K(`Expected null or instance of ${c.name}, got an instance of ${a.name}`);
        b = a.Pb(b);
        a = a.Eb;
      }
      return b;
    };
    function pb(b, a) {
      if (null === a) {
        if (this.Tb) throw new K(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!a.zb) throw new K(`Cannot pass "${db(a)}" as a ${this.name}`);
      if (!a.zb.Ab) throw new K(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return ob(a.zb.Ab, a.zb.Cb.Bb, this.Bb);
    }
    function qb(b, a) {
      if (null === a) {
        if (this.Tb) throw new K(`null is not a valid ${this.name}`);
        if (this.Sb) {
          var c = this.Ub();
          null !== b && b.push(this.Jb, c);
          return c;
        }
        return 0;
      }
      if (!a || !a.zb) throw new K(`Cannot pass "${db(a)}" as a ${this.name}`);
      if (!a.zb.Ab) throw new K(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.Rb && a.zb.Cb.Rb)
        throw new K(
          `Cannot convert argument of type ${a.zb.Ib ? a.zb.Ib.name : a.zb.Cb.name} to parameter type ${this.name}`,
        );
      c = ob(a.zb.Ab, a.zb.Cb.Bb, this.Bb);
      if (this.Sb) {
        if (void 0 === a.zb.Fb) throw new K('Passing raw pointer to smart pointer is illegal');
        switch (this.pc) {
          case 0:
            if (a.zb.Ib === this) c = a.zb.Fb;
            else
              throw new K(
                `Cannot convert argument of type ${a.zb.Ib ? a.zb.Ib.name : a.zb.Cb.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            c = a.zb.Fb;
            break;
          case 2:
            if (a.zb.Ib === this) c = a.zb.Fb;
            else {
              var d = a.clone();
              c = this.lc(
                c,
                Oa(() => d['delete']()),
              );
              null !== b && b.push(this.Jb, c);
            }
            break;
          default:
            throw new K('Unsupporting sharing policy');
        }
      }
      return c;
    }
    function rb(b, a) {
      if (null === a) {
        if (this.Tb) throw new K(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!a.zb) throw new K(`Cannot pass "${db(a)}" as a ${this.name}`);
      if (!a.zb.Ab) throw new K(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (a.zb.Cb.Rb) throw new K(`Cannot convert argument of type ${a.zb.Cb.name} to parameter type ${this.name}`);
      return ob(a.zb.Ab, a.zb.Cb.Bb, this.Bb);
    }
    var sb = (b, a, c) => {
        if (a === c) return b;
        if (void 0 === c.Eb) return null;
        b = sb(b, a, c.Eb);
        return null === b ? null : c.$b(b);
      },
      tb = (b, a) => {
        a = Sa(b, a);
        return Ra[a];
      },
      ub = (b, a) => {
        if (!a.Cb || !a.Ab) throw new cb('makeClassHandle requires ptr and ptrType');
        if (!!a.Ib !== !!a.Fb) throw new cb('Both smartPtrType and smartPtr must be specified');
        a.count = { value: 1 };
        return P(Object.create(b, { zb: { value: a, writable: !0 } }));
      };
    function vb(b, a, c, d, e, f, g, h, k, l, m) {
      this.name = b;
      this.Bb = a;
      this.Tb = c;
      this.Rb = d;
      this.Sb = e;
      this.kc = f;
      this.pc = g;
      this.Yb = h;
      this.Ub = k;
      this.lc = l;
      this.Jb = m;
      e || void 0 !== a.Eb ? (this.toWireType = qb) : ((this.toWireType = d ? pb : rb), (this.Gb = null));
    }
    var wb = (b, a, c) => {
        if (!n.hasOwnProperty(b)) throw new cb('Replacing nonexistent public symbol');
        void 0 !== n[b].Db && void 0 !== c ? (n[b].Db[c] = a) : ((n[b] = a), (n[b].Lb = c));
      },
      T,
      U = (b, a) => {
        b = M(b);
        var c = T.get(a);
        if ('function' != typeof c) throw new K(`unknown function pointer with signature ${b}: ${a}`);
        return c;
      };
    class xb extends Error {}
    var yb = (b, a) => {
      function c(f) {
        e[f] || N[f] || (bb[f] ? bb[f].forEach(c) : (d.push(f), (e[f] = !0)));
      }
      var d = [],
        e = {};
      a.forEach(c);
      throw new xb(`${b}: ` + d.map(Va).join([', ']));
    };
    function zb(b) {
      for (var a = 1; a < b.length; ++a) if (null !== b[a] && void 0 === b[a].Gb) return !0;
      return !1;
    }
    function Ab(b, a, c, d, e, f) {
      var g = a.length;
      if (2 > g) throw new K("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var h = null !== a[1] && null !== c,
        k = zb(a);
      c = 'void' !== a[0].name;
      d = [b, Na, d, e, $a, a[0], a[1]];
      for (e = 0; e < g - 2; ++e) d.push(a[e + 2]);
      if (!k) for (e = h ? 1 : 2; e < a.length; ++e) null !== a[e].Gb && d.push(a[e].Gb);
      k = zb(a);
      e = a.length - 2;
      var l = [],
        m = ['fn'];
      h && m.push('thisWired');
      for (g = 0; g < e; ++g) l.push(`arg${g}`), m.push(`arg${g}Wired`);
      l = l.join(',');
      m = m.join(',');
      l = `return function (${l}) {\n`;
      k && (l += 'var destructors = [];\n');
      var u = k ? 'destructors' : 'null',
        w = 'humanName throwBindingError invoker fn runDestructors retType classParam'.split(' ');
      h && (l += `var thisWired = classParam['toWireType'](${u}, this);\n`);
      for (g = 0; g < e; ++g)
        (l += `var arg${g}Wired = argType${g}['toWireType'](${u}, arg${g});\n`), w.push(`argType${g}`);
      l += (c || f ? 'var rv = ' : '') + `invoker(${m});\n`;
      if (k) l += 'runDestructors(destructors);\n';
      else
        for (g = h ? 1 : 2; g < a.length; ++g)
          (f = 1 === g ? 'thisWired' : 'arg' + (g - 2) + 'Wired'),
            null !== a[g].Gb && ((l += `${f}_dtor(${f});\n`), w.push(`${f}_dtor`));
      c && (l += "var ret = retType['fromWireType'](rv);\nreturn ret;\n");
      let [y, z] = [w, l + '}\n'];
      a = new Function(...y, z)(...d);
      return La(b, a);
    }
    var Cb = (b, a) => {
        for (var c = [], d = 0; d < b; d++) c.push(B[(a + 4 * d) >> 2]);
        return c;
      },
      Db = (b) => {
        b = b.trim();
        const a = b.indexOf('(');
        return -1 === a ? b : b.slice(0, a);
      },
      Eb = (b) => {
        9 < b && 0 === --I[b + 1] && ((I[b] = void 0), Ma.push(b));
      },
      Fb = {
        name: 'emscripten::val',
        fromWireType: (b) => {
          var a = L(b);
          Eb(b);
          return a;
        },
        toWireType: (b, a) => Oa(a),
        Hb: 8,
        readValueFromPointer: ab,
        Gb: null,
      },
      Gb = (b, a, c) => {
        switch (a) {
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
                  return this.fromWireType(v[d >> 1]);
                }
              : function (d) {
                  return this.fromWireType(x[d >> 1]);
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
            throw new TypeError(`invalid integer width (${a}): ${b}`);
        }
      },
      Hb = (b, a) => {
        switch (a) {
          case 4:
            return function (c) {
              return this.fromWireType(oa[c >> 2]);
            };
          case 8:
            return function (c) {
              return this.fromWireType(ra[c >> 3]);
            };
          default:
            throw new TypeError(`invalid float width (${a}): ${b}`);
        }
      },
      Ib = Object.assign({ optional: !0 }, Fb),
      V = (b, a, c) => {
        var d = t;
        if (!(0 < c)) return 0;
        var e = a;
        c = a + c - 1;
        for (var f = 0; f < b.length; ++f) {
          var g = b.charCodeAt(f);
          if (55296 <= g && 57343 >= g) {
            var h = b.charCodeAt(++f);
            g = (65536 + ((g & 1023) << 10)) | (h & 1023);
          }
          if (127 >= g) {
            if (a >= c) break;
            d[a++] = g;
          } else {
            if (2047 >= g) {
              if (a + 1 >= c) break;
              d[a++] = 192 | (g >> 6);
            } else {
              if (65535 >= g) {
                if (a + 2 >= c) break;
                d[a++] = 224 | (g >> 12);
              } else {
                if (a + 3 >= c) break;
                d[a++] = 240 | (g >> 18);
                d[a++] = 128 | ((g >> 12) & 63);
              }
              d[a++] = 128 | ((g >> 6) & 63);
            }
            d[a++] = 128 | (g & 63);
          }
        }
        d[a] = 0;
        return a - e;
      },
      Jb = (b) => {
        for (var a = 0, c = 0; c < b.length; ++c) {
          var d = b.charCodeAt(c);
          127 >= d ? a++ : 2047 >= d ? (a += 2) : 55296 <= d && 57343 >= d ? ((a += 4), ++c) : (a += 3);
        }
        return a;
      },
      Kb = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Lb = (b, a) => {
        var c = b >> 1;
        for (var d = c + a / 2; !(c >= d) && x[c]; ) ++c;
        c <<= 1;
        if (32 < c - b && Kb) return Kb.decode(t.subarray(b, c));
        c = '';
        for (d = 0; !(d >= a / 2); ++d) {
          var e = v[(b + 2 * d) >> 1];
          if (0 == e) break;
          c += String.fromCharCode(e);
        }
        return c;
      },
      Mb = (b, a, c) => {
        c ??= 2147483647;
        if (2 > c) return 0;
        c -= 2;
        var d = a;
        c = c < 2 * b.length ? c / 2 : b.length;
        for (var e = 0; e < c; ++e) (v[a >> 1] = b.charCodeAt(e)), (a += 2);
        v[a >> 1] = 0;
        return a - d;
      },
      Nb = (b) => 2 * b.length,
      Ob = (b, a) => {
        for (var c = 0, d = ''; !(c >= a / 4); ) {
          var e = A[(b + 4 * c) >> 2];
          if (0 == e) break;
          ++c;
          65536 <= e
            ? ((e -= 65536), (d += String.fromCharCode(55296 | (e >> 10), 56320 | (e & 1023))))
            : (d += String.fromCharCode(e));
        }
        return d;
      },
      Pb = (b, a, c) => {
        c ??= 2147483647;
        if (4 > c) return 0;
        var d = a;
        c = d + c - 4;
        for (var e = 0; e < b.length; ++e) {
          var f = b.charCodeAt(e);
          if (55296 <= f && 57343 >= f) {
            var g = b.charCodeAt(++e);
            f = (65536 + ((f & 1023) << 10)) | (g & 1023);
          }
          A[a >> 2] = f;
          a += 4;
          if (a + 4 > c) break;
        }
        A[a >> 2] = 0;
        return a - d;
      },
      Qb = (b) => {
        for (var a = 0, c = 0; c < b.length; ++c) {
          var d = b.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          a += 4;
        }
        return a;
      },
      Rb = 0,
      Sb = (b, a, c) => {
        var d = [];
        b = b.toWireType(d, c);
        d.length && (B[a >> 2] = Oa(d));
        return b;
      },
      Tb = [],
      Ub = {},
      Vb = (b) => {
        var a = Tb.length;
        Tb.push(b);
        return a;
      },
      Wb = (b, a) => {
        for (var c = Array(b), d = 0; d < b; ++d) c[d] = Wa(B[(a + 4 * d) >> 2], `parameter ${d}`);
        return c;
      },
      Xb = {},
      Yb = (b) => {
        if (!(b instanceof ya || 'unwind' == b)) throw b;
      },
      Zb = (b) => {
        na = b;
        Da || 0 < Rb || (n.onExit?.(b), (ma = !0));
        throw new ya(b);
      },
      $b = (b) => {
        if (!ma)
          try {
            if ((b(), !(Da || 0 < Rb)))
              try {
                (na = b = na), Zb(b);
              } catch (a) {
                Yb(a);
              }
          } catch (a) {
            Yb(a);
          }
      },
      ac = {},
      cc = () => {
        if (!bc) {
          var b = {
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
            a;
          for (a in ac) void 0 === ac[a] ? delete b[a] : (b[a] = ac[a]);
          var c = [];
          for (a in b) c.push(`${a}=${b[a]}`);
          bc = c;
        }
        return bc;
      },
      bc,
      dc = [null, [], []],
      ec = () => (b) => crypto.getRandomValues(b),
      fc = (b) => {
        (fc = ec())(b);
      };
    I.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1);
    n.count_emval_handles = () => I.length / 2 - 5 - Ma.length;
    for (var gc = Array(256), hc = 0; 256 > hc; ++hc) gc[hc] = String.fromCharCode(hc);
    Qa = gc;
    (() => {
      let b = ib.prototype;
      Object.assign(b, {
        isAliasOf: function (c) {
          if (!(this instanceof ib && c instanceof ib)) return !1;
          var d = this.zb.Cb.Bb,
            e = this.zb.Ab;
          c.zb = c.zb;
          var f = c.zb.Cb.Bb;
          for (c = c.zb.Ab; d.Eb; ) (e = d.Pb(e)), (d = d.Eb);
          for (; f.Eb; ) (c = f.Pb(c)), (f = f.Eb);
          return d === f && e === c;
        },
        clone: function () {
          this.zb.Ab || gb(this);
          if (this.zb.Nb) return (this.zb.count.value += 1), this;
          var c = P,
            d = Object,
            e = d.create,
            f = Object.getPrototypeOf(this),
            g = this.zb;
          c = c(
            e.call(d, f, {
              zb: { value: { count: g.count, Ob: g.Ob, Nb: g.Nb, Ab: g.Ab, Cb: g.Cb, Fb: g.Fb, Ib: g.Ib } },
            }),
          );
          c.zb.count.value += 1;
          c.zb.Ob = !1;
          return c;
        },
        ['delete']() {
          this.zb.Ab || gb(this);
          if (this.zb.Ob && !this.zb.Nb) throw new K('Object already scheduled for deletion');
          Xa(this);
          var c = this.zb;
          --c.count.value;
          0 === c.count.value && (c.Fb ? c.Ib.Jb(c.Fb) : c.Cb.Bb.Jb(c.Ab));
          this.zb.Nb || ((this.zb.Fb = void 0), (this.zb.Ab = void 0));
        },
        isDeleted: function () {
          return !this.zb.Ab;
        },
        deleteLater: function () {
          this.zb.Ab || gb(this);
          if (this.zb.Ob && !this.zb.Nb) throw new K('Object already scheduled for deletion');
          hb.push(this);
          this.zb.Ob = !0;
          return this;
        },
      });
      const a = Symbol.dispose;
      a && (b[a] = b['delete']);
    })();
    Object.assign(vb.prototype, {
      dc(b) {
        this.Yb && (b = this.Yb(b));
        return b;
      },
      Vb(b) {
        this.Jb?.(b);
      },
      Hb: 8,
      readValueFromPointer: ab,
      fromWireType: function (b) {
        function a() {
          return this.Sb
            ? ub(this.Bb.Kb, { Cb: this.kc, Ab: c, Ib: this, Fb: b })
            : ub(this.Bb.Kb, { Cb: this, Ab: b });
        }
        var c = this.dc(b);
        if (!c) return this.Vb(b), null;
        var d = tb(this.Bb, c);
        if (void 0 !== d) {
          if (0 === d.zb.count.value) return (d.zb.Ab = c), (d.zb.Fb = b), d.clone();
          d = d.clone();
          this.Vb(b);
          return d;
        }
        d = this.Bb.cc(c);
        d = jb[d];
        if (!d) return a.call(this);
        d = this.Rb ? d.Zb : d.pointerType;
        var e = sb(c, this.Bb, d.Bb);
        return null === e
          ? a.call(this)
          : this.Sb
          ? ub(d.Bb.Kb, { Cb: d, Ab: e, Ib: this, Fb: b })
          : ub(d.Bb.Kb, { Cb: d, Ab: e });
      },
    });
    n.noExitRuntime && (Da = n.noExitRuntime);
    n.print && (ia = n.print);
    n.printErr && (p = n.printErr);
    n.wasmBinary && (q = n.wasmBinary);
    n.thisProgram && (da = n.thisProgram);
    var xd = {
        l: (b, a, c, d) =>
          ta(
            `Assertion failed: ${b ? F(t, b) : ''}, at: ` +
              [a ? (a ? F(t, a) : '') : 'unknown filename', c, d ? (d ? F(t, d) : '') : 'unknown function'],
          ),
        xa: (b) => {
          var a = new Ha(b);
          0 == r[a.Ab + 12] && ((r[a.Ab + 12] = 1), Ga--);
          r[a.Ab + 13] = 0;
          Fa.push(a);
          ic(b);
          return jc(b);
        },
        wa: () => {
          W(0, 0);
          var b = Fa.pop();
          kc(b.ac);
          H = 0;
        },
        b: () => Ka([]),
        o: (b, a) => Ka([b, a]),
        u: (b, a, c) => {
          var d = new Ha(b);
          B[(d.Ab + 16) >> 2] = 0;
          B[(d.Ab + 4) >> 2] = a;
          B[(d.Ab + 8) >> 2] = c;
          H = b;
          Ga++;
          throw H;
        },
        d: (b) => {
          H ||= b;
          throw H;
        },
        cb: () => {},
        ab: () => {},
        bb: () => {},
        eb: function () {},
        gb: () => ta(''),
        sa: (b, a, c) => {
          b = M(b);
          a = Wa(a, 'wrapper');
          c = L(c);
          var d = a.Bb,
            e = d.Kb,
            f = d.Eb.Kb,
            g = d.Eb.constructor;
          b = La(b, function (...h) {
            d.Eb.Xb.forEach(
              function (k) {
                if (this[k] === f[k]) throw new Pa(`Pure virtual function ${k} must be implemented in JavaScript`);
              }.bind(this),
            );
            Object.defineProperty(this, '__parent', { value: e });
            this.__construct(...h);
          });
          e.__construct = function (...h) {
            if (this === e) throw new K("Pass correct 'this' to __construct");
            h = g.implement(this, ...h);
            Xa(h);
            var k = h.zb;
            h.notifyOnDestruction();
            k.Nb = !0;
            Object.defineProperties(this, { zb: { value: k } });
            P(this);
            h = k.Ab;
            h = Sa(d, h);
            if (Ra.hasOwnProperty(h)) throw new K(`Tried to register registered instance: ${h}`);
            Ra[h] = this;
          };
          e.__destruct = function () {
            if (this === e) throw new K("Pass correct 'this' to __destruct");
            Xa(this);
            var h = this.zb.Ab;
            h = Sa(d, h);
            if (Ra.hasOwnProperty(h)) delete Ra[h];
            else throw new K(`Tried to unregister unregistered instance: ${h}`);
          };
          b.prototype = Object.create(e);
          Object.assign(b.prototype, c);
          return Oa(b);
        },
        R: (b) => {
          var a = Za[b];
          delete Za[b];
          var c = a.Ub,
            d = a.Jb,
            e = a.Wb,
            f = e.map((g) => g.hc).concat(e.map((g) => g.nc));
          S([b], f, (g) => {
            var h = {};
            e.forEach((k, l) => {
              var m = g[l],
                u = k.ec,
                w = k.fc,
                y = g[l + e.length],
                z = k.mc,
                G = k.oc;
              h[k.bc] = {
                read: (J) => m.fromWireType(u(w, J)),
                write: (J, ja) => {
                  var E = [];
                  z(G, J, y.toWireType(E, ja));
                  $a(E);
                },
                optional: g[l].optional,
              };
            });
            return [
              {
                name: a.name,
                fromWireType: (k) => {
                  var l = {},
                    m;
                  for (m in h) l[m] = h[m].read(k);
                  d(k);
                  return l;
                },
                toWireType: (k, l) => {
                  for (var m in h) if (!(m in l || h[m].optional)) throw new TypeError(`Missing field: "${m}"`);
                  var u = c();
                  for (m in h) h[m].write(u, l[m]);
                  null !== k && k.push(d, u);
                  return u;
                },
                Hb: 8,
                readValueFromPointer: ab,
                Gb: d,
              },
            ];
          });
        },
        qa: (b, a, c) => {
          a = M(a);
          R(b, {
            name: a,
            fromWireType: (d) => d,
            toWireType: function (d, e) {
              if ('bigint' != typeof e && 'number' != typeof e)
                throw new TypeError(`Cannot convert "${db(e)}" to ${this.name}`);
              'number' == typeof e && (e = BigInt(e));
              return e;
            },
            Hb: 8,
            readValueFromPointer: fb(a, c, -1 == a.indexOf('u')),
            Gb: null,
          });
        },
        Qa: (b, a, c, d) => {
          a = M(a);
          R(b, {
            name: a,
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, f) {
              return f ? c : d;
            },
            Hb: 8,
            readValueFromPointer: function (e) {
              return this.fromWireType(t[e]);
            },
            Gb: null,
          });
        },
        D: (b, a, c, d, e, f, g, h, k, l, m, u, w) => {
          m = M(m);
          f = U(e, f);
          h &&= U(g, h);
          l &&= U(k, l);
          w = U(u, w);
          var y = mb(m);
          lb(y, function () {
            yb(`Cannot construct ${m} due to unbound types`, [d]);
          });
          S([b, a, c], d ? [d] : [], (z) => {
            z = z[0];
            if (d) {
              var G = z.Bb;
              var J = G.Kb;
            } else J = ib.prototype;
            z = La(m, function (...Ta) {
              if (Object.getPrototypeOf(this) !== ja) throw new K(`Use 'new' to construct ${m}`);
              if (void 0 === E.Mb) throw new K(`${m} has no accessible constructor`);
              var Bb = E.Mb[Ta.length];
              if (void 0 === Bb)
                throw new K(
                  `Tried to invoke ctor of ${m} with invalid number of parameters (${
                    Ta.length
                  }) - expected (${Object.keys(E.Mb).toString()}) parameters instead!`,
                );
              return Bb.apply(this, Ta);
            });
            var ja = Object.create(J, { constructor: { value: z } });
            z.prototype = ja;
            var E = new nb(m, z, ja, w, G, f, h, l);
            if (E.Eb) {
              var ka;
              (ka = E.Eb).Qb ?? (ka.Qb = []);
              E.Eb.Qb.push(E);
            }
            G = new vb(m, E, !0, !1, !1);
            ka = new vb(m + '*', E, !1, !1, !1);
            J = new vb(m + ' const*', E, !1, !0, !1);
            jb[b] = { pointerType: ka, Zb: J };
            wb(y, z);
            return [G, ka, J];
          });
        },
        P: (b, a, c, d, e, f, g, h) => {
          var k = Cb(c, d);
          a = M(a);
          a = Db(a);
          f = U(e, f);
          S([], [b], (l) => {
            function m() {
              yb(`Cannot call ${u} due to unbound types`, k);
            }
            l = l[0];
            var u = `${l.name}.${a}`;
            a.startsWith('@@') && (a = Symbol[a.substring(2)]);
            var w = l.Bb.constructor;
            void 0 === w[a] ? ((m.Lb = c - 1), (w[a] = m)) : (kb(w, a, u), (w[a].Db[c - 1] = m));
            S([], k, (y) => {
              y = Ab(u, [y[0], null].concat(y.slice(1)), null, f, g, h);
              void 0 === w[a].Db ? ((y.Lb = c - 1), (w[a] = y)) : (w[a].Db[c - 1] = y);
              if (l.Bb.Qb) for (const z of l.Bb.Qb) z.constructor.hasOwnProperty(a) || (z.constructor[a] = y);
              return [];
            });
            return [];
          });
        },
        O: (b, a, c, d, e, f) => {
          var g = Cb(a, c);
          e = U(d, e);
          S([], [b], (h) => {
            h = h[0];
            var k = `constructor ${h.name}`;
            void 0 === h.Bb.Mb && (h.Bb.Mb = []);
            if (void 0 !== h.Bb.Mb[a - 1])
              throw new K(
                `Cannot register multiple constructors with identical number of parameters (${a - 1}) for class '${
                  h.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            h.Bb.Mb[a - 1] = () => {
              yb(`Cannot construct ${h.name} due to unbound types`, g);
            };
            S([], g, (l) => {
              l.splice(1, 0, null);
              h.Bb.Mb[a - 1] = Ab(k, l, null, e, f);
              return [];
            });
            return [];
          });
        },
        m: (b, a, c, d, e, f, g, h, k) => {
          var l = Cb(c, d);
          a = M(a);
          a = Db(a);
          f = U(e, f);
          S([], [b], (m) => {
            function u() {
              yb(`Cannot call ${w} due to unbound types`, l);
            }
            m = m[0];
            var w = `${m.name}.${a}`;
            a.startsWith('@@') && (a = Symbol[a.substring(2)]);
            h && m.Bb.Xb.push(a);
            var y = m.Bb.Kb,
              z = y[a];
            void 0 === z || (void 0 === z.Db && z.className !== m.name && z.Lb === c - 2)
              ? ((u.Lb = c - 2), (u.className = m.name), (y[a] = u))
              : (kb(y, a, w), (y[a].Db[c - 2] = u));
            S([], l, (G) => {
              G = Ab(w, G, m, f, g, k);
              void 0 === y[a].Db ? ((G.Lb = c - 2), (y[a] = G)) : (y[a].Db[c - 2] = G);
              return [];
            });
            return [];
          });
        },
        Oa: (b) => R(b, Fb),
        U: (b, a, c, d) => {
          function e() {}
          a = M(a);
          e.values = {};
          R(b, {
            name: a,
            constructor: e,
            fromWireType: function (f) {
              return this.constructor.values[f];
            },
            toWireType: (f, g) => g.value,
            Hb: 8,
            readValueFromPointer: Gb(a, c, d),
            Gb: null,
          });
          lb(a, e);
        },
        v: (b, a, c) => {
          var d = Wa(b, 'enum');
          a = M(a);
          b = d.constructor;
          d = Object.create(d.constructor.prototype, {
            value: { value: c },
            constructor: { value: La(`${d.name}_${a}`, function () {}) },
          });
          b.values[c] = d;
          b[a] = d;
        },
        pa: (b, a, c) => {
          a = M(a);
          R(b, {
            name: a,
            fromWireType: (d) => d,
            toWireType: (d, e) => e,
            Hb: 8,
            readValueFromPointer: Hb(a, c),
            Gb: null,
          });
        },
        Q: (b, a, c, d, e, f, g) => {
          var h = Cb(a, c);
          b = M(b);
          b = Db(b);
          e = U(d, e);
          lb(
            b,
            function () {
              yb(`Cannot call ${b} due to unbound types`, h);
            },
            a - 1,
          );
          S([], h, (k) => {
            wb(b, Ab(b, [k[0], null].concat(k.slice(1)), null, e, f, g), a - 1);
            return [];
          });
        },
        A: (b, a, c, d, e) => {
          a = M(a);
          -1 === e && (e = 4294967295);
          e = (h) => h;
          if (0 === d) {
            var f = 32 - 8 * c;
            e = (h) => (h << f) >>> f;
          }
          var g = a.includes('unsigned')
            ? function (h, k) {
                return k >>> 0;
              }
            : function (h, k) {
                return k;
              };
          R(b, { name: a, fromWireType: e, toWireType: g, Hb: 8, readValueFromPointer: fb(a, c, 0 !== d), Gb: null });
        },
        r: (b, a, c) => {
          function d(f) {
            return new e(r.buffer, B[(f + 4) >> 2], B[f >> 2]);
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
          ][a];
          c = M(c);
          R(b, { name: c, fromWireType: d, Hb: 8, readValueFromPointer: d }, { ic: !0 });
        },
        S: (b) => {
          R(b, Ib);
        },
        Z: (b, a, c, d, e, f, g, h, k, l, m, u) => {
          c = M(c);
          f = U(e, f);
          h = U(g, h);
          l = U(k, l);
          u = U(m, u);
          S([b], [a], (w) => {
            w = w[0];
            return [new vb(c, w.Bb, !1, !1, !0, w, d, f, h, l, u)];
          });
        },
        Pa: (b, a) => {
          a = M(a);
          R(b, {
            name: a,
            fromWireType: function (c) {
              for (var d = B[c >> 2], e = c + 4, f, g = e, h = 0; h <= d; ++h) {
                var k = e + h;
                if (h == d || 0 == t[k])
                  (g = g ? F(t, g, k - g) : ''),
                    void 0 === f ? (f = g) : ((f += String.fromCharCode(0)), (f += g)),
                    (g = k + 1);
              }
              O(c);
              return f;
            },
            toWireType: function (c, d) {
              d instanceof ArrayBuffer && (d = new Uint8Array(d));
              var e = 'string' == typeof d;
              if (!(e || (ArrayBuffer.isView(d) && 1 == d.BYTES_PER_ELEMENT)))
                throw new K('Cannot pass non-string to std::string');
              var f = e ? Jb(d) : d.length;
              var g = lc(4 + f + 1),
                h = g + 4;
              B[g >> 2] = f;
              e ? V(d, h, f + 1) : t.set(d, h);
              null !== c && c.push(O, g);
              return g;
            },
            Hb: 8,
            readValueFromPointer: ab,
            Gb(c) {
              O(c);
            },
          });
        },
        Y: (b, a, c) => {
          c = M(c);
          if (2 === a) {
            var d = Lb;
            var e = Mb;
            var f = Nb;
            var g = (h) => x[h >> 1];
          } else 4 === a && ((d = Ob), (e = Pb), (f = Qb), (g = (h) => B[h >> 2]));
          R(b, {
            name: c,
            fromWireType: (h) => {
              for (var k = B[h >> 2], l, m = h + 4, u = 0; u <= k; ++u) {
                var w = h + 4 + u * a;
                if (u == k || 0 == g(w))
                  (m = d(m, w - m)), void 0 === l ? (l = m) : ((l += String.fromCharCode(0)), (l += m)), (m = w + a);
              }
              O(h);
              return l;
            },
            toWireType: (h, k) => {
              if ('string' != typeof k) throw new K(`Cannot pass non-string to C++ string type ${c}`);
              var l = f(k),
                m = lc(4 + l + a);
              B[m >> 2] = l / a;
              e(k, m + 4, l + a);
              null !== h && h.push(O, m);
              return m;
            },
            Hb: 8,
            readValueFromPointer: ab,
            Gb(h) {
              O(h);
            },
          });
        },
        K: (b, a, c, d, e, f) => {
          Za[b] = { name: M(a), Ub: U(c, d), Jb: U(e, f), Wb: [] };
        },
        x: (b, a, c, d, e, f, g, h, k, l) => {
          Za[b].Wb.push({ bc: M(a), hc: c, ec: U(d, e), fc: f, nc: g, mc: U(h, k), oc: l });
        },
        Ra: (b, a) => {
          a = M(a);
          R(b, { jc: !0, name: a, Hb: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        ya: function () {
          return Date.now();
        },
        _a: () => {
          Da = !1;
          Rb = 0;
        },
        Va: () => {
          throw Infinity;
        },
        ra: (b, a, c) => {
          b = L(b);
          a = Wa(a, 'emval::as');
          return Sb(a, c, b);
        },
        Ta: (b, a, c, d) => {
          b = Tb[b];
          a = L(a);
          return b(null, a, c, d);
        },
        E: (b, a, c, d, e) => {
          b = Tb[b];
          a = L(a);
          var f = Ub[c];
          c = void 0 === f ? M(c) : f;
          return b(a, a[c], d, e);
        },
        Ka: Eb,
        B: (b, a, c) => {
          a = Wb(b, a);
          var d = a.shift();
          b--;
          var e = 'return function (obj, func, destructorsRef, args) {\n',
            f = 0,
            g = [];
          0 === c && g.push('obj');
          for (var h = ['retType'], k = [d], l = 0; l < b; ++l)
            g.push(`arg${l}`),
              h.push(`argType${l}`),
              k.push(a[l]),
              (e += `  var arg${l} = argType${l}.readValueFromPointer(args${f ? '+' + f : ''});\n`),
              (f += a[l].Hb);
          e += `  var rv = ${1 === c ? 'new func' : 'func.call'}(${g.join(', ')});\n`;
          d.jc ||
            (h.push('emval_returnValue'),
            k.push(Sb),
            (e += '  return emval_returnValue(retType, destructorsRef, rv);\n'));
          b = new Function(...h, e + '};\n')(...k);
          c = `methodCaller<(${a.map((m) => m.name).join(', ')}) => ${d.name}>`;
          return Vb(La(c, b));
        },
        Ua: (b) => {
          9 < b && (I[b + 1] += 1);
        },
        Sa: (b) => {
          var a = L(b);
          $a(a);
          Eb(b);
        },
        J: (b, a) => {
          b = Wa(b, '_emval_take_value');
          b = b.readValueFromPointer(a);
          return Oa(b);
        },
        Xa: (b, a) => {
          Xb[b] && (clearTimeout(Xb[b].id), delete Xb[b]);
          if (!a) return 0;
          var c = setTimeout(() => {
            delete Xb[b];
            $b(() => mc(b, performance.now()));
          }, a);
          Xb[b] = { id: c, qc: a };
          return 0;
        },
        Ya: (b, a, c, d) => {
          var e = new Date().getFullYear(),
            f = new Date(e, 0, 1).getTimezoneOffset();
          e = new Date(e, 6, 1).getTimezoneOffset();
          B[b >> 2] = 60 * Math.max(f, e);
          A[a >> 2] = Number(f != e);
          a = (g) => {
            var h = Math.abs(g);
            return `UTC${0 <= g ? '-' : '+'}${String(Math.floor(h / 60)).padStart(2, '0')}${String(h % 60).padStart(
              2,
              '0',
            )}`;
          };
          b = a(f);
          a = a(e);
          e < f ? (V(b, c, 17), V(a, d, 17)) : (V(b, d, 17), V(a, c, 17));
        },
        Za: (b) => {
          var a = t.length;
          b >>>= 0;
          if (2147483648 < b) return !1;
          for (var c = 1; 4 >= c; c *= 2) {
            var d = a * (1 + 0.2 / c);
            d = Math.min(d, b + 100663296);
            a: {
              d =
                ((Math.min(2147483648, 65536 * Math.ceil(Math.max(b, d) / 65536)) - la.buffer.byteLength + 65535) /
                  65536) |
                0;
              try {
                la.grow(d);
                sa();
                var e = 1;
                break a;
              } catch (f) {}
              e = void 0;
            }
            if (e) return !0;
          }
          return !1;
        },
        ib: (b, a) => {
          var c = 0,
            d = 0,
            e;
          for (e of cc()) {
            var f = a + c;
            B[(b + d) >> 2] = f;
            c += V(e, f, Infinity) + 1;
            d += 4;
          }
          return 0;
        },
        jb: (b, a) => {
          var c = cc();
          B[b >> 2] = c.length;
          b = 0;
          for (var d of c) b += Jb(d) + 1;
          B[a >> 2] = b;
          return 0;
        },
        fb: () => 52,
        db: () => 52,
        ta: (b, a, c, d) => {
          for (var e = 0, f = 0; f < c; f++) {
            var g = B[a >> 2],
              h = B[(a + 4) >> 2];
            a += 8;
            for (var k = 0; k < h; k++) {
              var l = b,
                m = t[g + k],
                u = dc[l];
              0 === m || 10 === m ? ((1 === l ? ia : p)(F(u)), (u.length = 0)) : u.push(m);
            }
            e += h;
          }
          B[d >> 2] = e;
          return 0;
        },
        ua: nc,
        va: oc,
        Wa: pc,
        Fa: qc,
        n: rc,
        na: sc,
        La: tc,
        g: uc,
        w: vc,
        X: wc,
        I: xc,
        N: yc,
        f: zc,
        la: Ac,
        h: Bc,
        Ma: Cc,
        k: Dc,
        W: Ec,
        t: Fc,
        Ha: Gc,
        $: Hc,
        aa: Ic,
        ba: Jc,
        L: Kc,
        Ia: Lc,
        ma: Mc,
        oa: Nc,
        V: Oc,
        Ga: Pc,
        ha: Qc,
        a: Rc,
        C: Sc,
        G: Tc,
        da: Uc,
        c: Vc,
        Na: Wc,
        Da: Xc,
        Ea: Yc,
        e: Zc,
        ea: $c,
        T: ad,
        j: bd,
        y: cd,
        i: dd,
        p: ed,
        s: fd,
        ka: gd,
        Ba: hd,
        Aa: jd,
        fa: kd,
        ca: ld,
        Ca: md,
        M: nd,
        z: od,
        H: pd,
        za: qd,
        ia: rd,
        ja: sd,
        F: td,
        Ja: ud,
        _: vd,
        ga: wd,
        q: (b) => b,
        hb: Zb,
        $a: (b, a) => {
          fc(t.subarray(b, b + a));
          return 0;
        },
      },
      X = await (async function () {
        function b(d) {
          X = d.exports;
          la = X.kb;
          sa();
          T = X.pb;
          C--;
          n.monitorRunDependencies?.(C);
          0 == C && D && ((d = D), (D = null), d());
          return X;
        }
        C++;
        n.monitorRunDependencies?.(C);
        var a = { a: xd };
        if (n.instantiateWasm)
          return new Promise((d) => {
            n.instantiateWasm(a, (e, f) => {
              d(b(e, f));
            });
          });
        ua ??= n.locateFile
          ? n.locateFile
            ? n.locateFile('dotlottie-player.wasm', fa)
            : fa + 'dotlottie-player.wasm'
          : '';
        try {
          var c = await xa(a);
          return b(c.instance);
        } catch (d) {
          return ba(d), Promise.reject(d);
        }
      })(),
      lc = X.mb,
      Ua = X.nb,
      O = X.ob,
      mc = X.qb,
      W = X.rb,
      Ia = X.sb,
      Y = X.tb,
      Z = X.ub,
      kc = X.vb,
      ic = X.wb,
      Ja = X.xb,
      jc = X.yb;
    function Vc(b, a, c) {
      var d = Z();
      try {
        T.get(b)(a, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function Zc(b, a, c, d) {
      var e = Z();
      try {
        T.get(b)(a, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function Rc(b, a) {
      var c = Z();
      try {
        T.get(b)(a);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        W(1, 0);
      }
    }
    function bd(b, a, c, d, e) {
      var f = Z();
      try {
        T.get(b)(a, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function uc(b, a) {
      var c = Z();
      try {
        return T.get(b)(a);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        W(1, 0);
      }
    }
    function zc(b, a, c) {
      var d = Z();
      try {
        return T.get(b)(a, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function Nc(b, a, c) {
      var d = Z();
      try {
        return T.get(b)(a, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        W(1, 0);
        return 0n;
      }
    }
    function sc(b, a, c) {
      var d = Z();
      try {
        return T.get(b)(a, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function Mc(b, a) {
      var c = Z();
      try {
        return T.get(b)(a);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        W(1, 0);
        return 0n;
      }
    }
    function wc(b, a, c, d) {
      var e = Z();
      try {
        return T.get(b)(a, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function Fc(b, a, c, d, e, f) {
      var g = Z();
      try {
        return T.get(b)(a, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function Tc(b, a, c) {
      var d = Z();
      try {
        T.get(b)(a, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function rc(b, a) {
      var c = Z();
      try {
        return T.get(b)(a);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        W(1, 0);
      }
    }
    function vc(b, a, c) {
      var d = Z();
      try {
        return T.get(b)(a, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function Bc(b, a, c, d) {
      var e = Z();
      try {
        return T.get(b)(a, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function Wc(b, a, c, d, e) {
      var f = Z();
      try {
        T.get(b)(a, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function dd(b, a, c, d, e, f) {
      var g = Z();
      try {
        T.get(b)(a, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function Cc(b, a, c, d, e) {
      var f = Z();
      try {
        return T.get(b)(a, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function yc(b, a, c, d, e, f) {
      var g = Z();
      try {
        return T.get(b)(a, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function xc(b, a, c, d, e, f) {
      var g = Z();
      try {
        return T.get(b)(a, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function Dc(b, a, c, d, e) {
      var f = Z();
      try {
        return T.get(b)(a, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function Ec(b, a, c, d, e, f, g) {
      var h = Z();
      try {
        return T.get(b)(a, c, d, e, f, g);
      } catch (k) {
        Y(h);
        if (k !== k + 0) throw k;
        W(1, 0);
      }
    }
    function tc(b, a, c, d) {
      var e = Z();
      try {
        return T.get(b)(a, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function Ac(b, a, c, d) {
      var e = Z();
      try {
        return T.get(b)(a, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function ud(b, a, c, d) {
      var e = Z();
      try {
        T.get(b)(a, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function od(b, a, c, d, e) {
      var f = Z();
      try {
        T.get(b)(a, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function Lc(b, a, c) {
      var d = Z();
      try {
        return T.get(b)(a, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function ed(b, a, c, d, e, f, g) {
      var h = Z();
      try {
        T.get(b)(a, c, d, e, f, g);
      } catch (k) {
        Y(h);
        if (k !== k + 0) throw k;
        W(1, 0);
      }
    }
    function pd(b, a, c, d, e, f) {
      var g = Z();
      try {
        T.get(b)(a, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function Oc(b, a, c, d) {
      var e = Z();
      try {
        return T.get(b)(a, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
        return 0n;
      }
    }
    function fd(b, a, c, d, e, f, g, h) {
      var k = Z();
      try {
        T.get(b)(a, c, d, e, f, g, h);
      } catch (l) {
        Y(k);
        if (l !== l + 0) throw l;
        W(1, 0);
      }
    }
    function Gc(b, a, c, d, e, f, g) {
      var h = Z();
      try {
        return T.get(b)(a, c, d, e, f, g);
      } catch (k) {
        Y(h);
        if (k !== k + 0) throw k;
        W(1, 0);
      }
    }
    function gd(b, a, c, d, e, f, g, h, k) {
      var l = Z();
      try {
        T.get(b)(a, c, d, e, f, g, h, k);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        W(1, 0);
      }
    }
    function Sc(b, a, c, d) {
      var e = Z();
      try {
        T.get(b)(a, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function sd(b, a, c, d, e, f) {
      var g = Z();
      try {
        T.get(b)(a, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function td(b, a, c) {
      var d = Z();
      try {
        T.get(b)(a, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function rd(b, a, c, d, e) {
      var f = Z();
      try {
        T.get(b)(a, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function Qc(b) {
      var a = Z();
      try {
        T.get(b)();
      } catch (c) {
        Y(a);
        if (c !== c + 0) throw c;
        W(1, 0);
      }
    }
    function wd(b, a, c, d, e) {
      var f = Z();
      try {
        T.get(b)(a, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function Pc(b, a, c, d) {
      var e = Z();
      try {
        return T.get(b)(a, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
        return 0n;
      }
    }
    function nd(b, a, c, d) {
      var e = Z();
      try {
        T.get(b)(a, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function Kc(b, a, c, d, e, f) {
      var g = Z();
      try {
        return T.get(b)(a, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function kd(b, a, c, d, e) {
      var f = Z();
      try {
        T.get(b)(a, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function qc(b, a, c, d) {
      var e = Z();
      try {
        return T.get(b)(a, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function Yc(b, a, c, d, e, f, g) {
      var h = Z();
      try {
        T.get(b)(a, c, d, e, f, g);
      } catch (k) {
        Y(h);
        if (k !== k + 0) throw k;
        W(1, 0);
      }
    }
    function $c(b, a, c, d, e) {
      var f = Z();
      try {
        T.get(b)(a, c, d, e);
      } catch (g) {
        Y(f);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function cd(b, a, c, d, e, f, g, h) {
      var k = Z();
      try {
        T.get(b)(a, c, d, e, f, g, h);
      } catch (l) {
        Y(k);
        if (l !== l + 0) throw l;
        W(1, 0);
      }
    }
    function Uc(b, a, c, d) {
      var e = Z();
      try {
        T.get(b)(a, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function Xc(b, a, c, d, e, f, g) {
      var h = Z();
      try {
        T.get(b)(a, c, d, e, f, g);
      } catch (k) {
        Y(h);
        if (k !== k + 0) throw k;
        W(1, 0);
      }
    }
    function ad(b, a, c, d, e, f) {
      var g = Z();
      try {
        T.get(b)(a, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function ld(b, a, c, d, e, f) {
      var g = Z();
      try {
        T.get(b)(a, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function md(b, a, c, d, e, f) {
      var g = Z();
      try {
        T.get(b)(a, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function hd(b, a, c, d, e, f, g, h, k, l, m) {
      var u = Z();
      try {
        T.get(b)(a, c, d, e, f, g, h, k, l, m);
      } catch (w) {
        Y(u);
        if (w !== w + 0) throw w;
        W(1, 0);
      }
    }
    function jd(b, a, c, d, e, f, g, h, k, l, m, u, w) {
      var y = Z();
      try {
        T.get(b)(a, c, d, e, f, g, h, k, l, m, u, w);
      } catch (z) {
        Y(y);
        if (z !== z + 0) throw z;
        W(1, 0);
      }
    }
    function Jc(b, a, c, d, e, f, g, h, k, l) {
      var m = Z();
      try {
        return T.get(b)(a, c, d, e, f, g, h, k, l);
      } catch (u) {
        Y(m);
        if (u !== u + 0) throw u;
        W(1, 0);
      }
    }
    function Ic(b, a, c, d, e, f, g, h, k) {
      var l = Z();
      try {
        return T.get(b)(a, c, d, e, f, g, h, k);
      } catch (m) {
        Y(l);
        if (m !== m + 0) throw m;
        W(1, 0);
      }
    }
    function qd(b, a, c, d, e, f, g) {
      var h = Z();
      try {
        T.get(b)(a, c, d, e, f, g);
      } catch (k) {
        Y(h);
        if (k !== k + 0) throw k;
        W(1, 0);
      }
    }
    function Hc(b, a, c, d, e, f, g, h) {
      var k = Z();
      try {
        return T.get(b)(a, c, d, e, f, g, h);
      } catch (l) {
        Y(k);
        if (l !== l + 0) throw l;
        W(1, 0);
      }
    }
    function vd(b, a, c, d, e, f) {
      var g = Z();
      try {
        T.get(b)(a, c, d, e, f);
      } catch (h) {
        Y(g);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function oc(b, a, c, d) {
      var e = Z();
      try {
        return T.get(b)(a, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function nc(b, a) {
      var c = Z();
      try {
        return T.get(b)(a);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        W(1, 0);
      }
    }
    function pc(b, a, c) {
      var d = Z();
      try {
        return T.get(b)(a, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function yd() {
      function b() {
        n.calledRun = !0;
        if (!ma) {
          X.lb();
          aa(n);
          n.onRuntimeInitialized?.();
          if (n.postRun)
            for ('function' == typeof n.postRun && (n.postRun = [n.postRun]); n.postRun.length; ) {
              var a = n.postRun.shift();
              Aa.push(a);
            }
          za(Aa);
        }
      }
      if (0 < C) D = yd;
      else {
        if (n.preRun) for ('function' == typeof n.preRun && (n.preRun = [n.preRun]); n.preRun.length; ) Ca();
        za(Ba);
        0 < C
          ? (D = yd)
          : n.setStatus
          ? (n.setStatus('Running...'),
            setTimeout(() => {
              setTimeout(() => n.setStatus(''), 1);
              b();
            }, 1))
          : b();
      }
    }
    if (n.preInit)
      for ('function' == typeof n.preInit && (n.preInit = [n.preInit]); 0 < n.preInit.length; ) n.preInit.shift()();
    yd();
    moduleRtn = ca;

    return moduleRtn;
  };
})();
export default createDotLottiePlayerModule;
