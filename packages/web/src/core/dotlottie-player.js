var createDotLottiePlayerModule = (() => {
  var _scriptName = typeof document != 'undefined' ? document.currentScript?.src : undefined;

  return function (moduleArg = {}) {
    var moduleRtn;

    var l = moduleArg,
      aa,
      ba,
      ca = new Promise((a, b) => {
        aa = a;
        ba = b;
      }),
      da = Object.assign({}, l),
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
    var ha = l.print || console.log.bind(console),
      q = l.printErr || console.error.bind(console);
    Object.assign(l, da);
    da = null;
    l.thisProgram && (ea = l.thisProgram);
    var ia = l.wasmBinary,
      ja,
      ka = !1,
      na,
      r,
      t,
      w,
      x,
      A,
      B,
      oa,
      pa;
    function qa() {
      var a = ja.buffer;
      l.HEAP8 = r = new Int8Array(a);
      l.HEAP16 = w = new Int16Array(a);
      l.HEAPU8 = t = new Uint8Array(a);
      l.HEAPU16 = x = new Uint16Array(a);
      l.HEAP32 = A = new Int32Array(a);
      l.HEAPU32 = B = new Uint32Array(a);
      l.HEAPF32 = oa = new Float32Array(a);
      l.HEAPF64 = pa = new Float64Array(a);
    }
    var ra = [],
      sa = [],
      ta = [];
    function ua() {
      var a = l.preRun.shift();
      ra.unshift(a);
    }
    var C = 0,
      va = null,
      D = null;
    function wa(a) {
      l.onAbort?.(a);
      a = 'Aborted(' + a + ')';
      q(a);
      ka = !0;
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
          q(`failed to asynchronously prepare wasm: ${d}`);
          wa(d);
        });
    }
    function Ca(a, b) {
      var c = ya;
      return ia || 'function' != typeof WebAssembly.instantiateStreaming || xa(c) || 'function' != typeof fetch
        ? Ba(c, a, b)
        : fetch(c, { credentials: 'same-origin' }).then((d) =>
            WebAssembly.instantiateStreaming(d, a).then(b, function (e) {
              q(`wasm streaming compile failed: ${e}`);
              q('falling back to ArrayBuffer instantiation');
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
        for (; 0 < a.length; ) a.shift()(l);
      },
      Fa = l.noExitRuntime || !0,
      Ga = 'undefined' != typeof TextDecoder ? new TextDecoder() : void 0,
      H = (a, b = 0, c = NaN) => {
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
      Ha = [],
      Ia = 0,
      I = 0;
    class Ja {
      constructor(a) {
        this.Fc = a;
        this.dc = a - 24;
      }
    }
    var Ma = (a) => {
        var b = I;
        if (!b) return Ka(0), 0;
        var c = new Ja(b);
        B[(c.dc + 16) >> 2] = b;
        var d = B[(c.dc + 4) >> 2];
        if (!d) return Ka(0), b;
        for (var e of a) {
          if (0 === e || e === d) break;
          if (La(e, d, c.dc + 16)) return Ka(e), b;
        }
        Ka(d);
        return b;
      },
      Na = (a, b, c) => {
        var d = t;
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
      J = (a, b) => Object.defineProperty(b, 'name', { value: a }),
      Oa = [],
      K = [],
      L,
      Pa = (a) => {
        throw new L(a);
      },
      M = (a) => {
        if (!a) throw new L('Cannot use deleted val. handle = ' + a);
        return K[a];
      },
      Qa = (a) => {
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
            const b = Oa.pop() || K.length;
            K[b] = a;
            K[b + 1] = 1;
            return b;
        }
      },
      Ra = (a) => {
        var b = Error,
          c = J(a, function (d) {
            this.name = a;
            this.message = d;
            d = Error(d).stack;
            void 0 !== d && (this.stack = this.toString() + '\n' + d.replace(/^Error(:[^\n]*)?\n/, ''));
          });
        c.prototype = Object.create(b.prototype);
        c.prototype.constructor = c;
        c.prototype.toString = function () {
          return void 0 === this.message ? this.name : `${this.name}: ${this.message}`;
        };
        return c;
      },
      Sa,
      Ta,
      N = (a) => {
        for (var b = ''; t[a]; ) b += Ta[t[a++]];
        return b;
      },
      Ua = {},
      Va = (a, b) => {
        if (void 0 === b) throw new L('ptr should not be undefined');
        for (; a.ic; ) (b = a.tc(b)), (a = a.ic);
        return b;
      },
      O = {},
      Ya = (a) => {
        a = Xa(a);
        var b = N(a);
        P(a);
        return b;
      },
      Za = (a, b) => {
        var c = O[a];
        if (void 0 === c) throw ((a = `${b} has unknown type ${Ya(a)}`), new L(a));
        return c;
      },
      $a = () => {},
      ab = !1,
      bb = (a, b, c) => {
        if (b === c) return a;
        if (void 0 === c.ic) return null;
        a = bb(a, b, c.ic);
        return null === a ? null : c.Ec(a);
      },
      cb = {},
      db = (a, b) => {
        b = Va(a, b);
        return Ua[b];
      },
      eb,
      fb = (a, b) => {
        if (!b.fc || !b.dc) throw new eb('makeClassHandle requires ptr and ptrType');
        if (!!b.lc !== !!b.jc) throw new eb('Both smartPtrType and smartPtr must be specified');
        b.count = { value: 1 };
        return Q(Object.create(a, { cc: { value: b, writable: !0 } }));
      },
      Q = (a) => {
        if ('undefined' === typeof FinalizationRegistry) return (Q = (b) => b), a;
        ab = new FinalizationRegistry((b) => {
          b = b.cc;
          --b.count.value;
          0 === b.count.value && (b.jc ? b.lc.nc(b.jc) : b.fc.ec.nc(b.dc));
        });
        Q = (b) => {
          var c = b.cc;
          c.jc && ab.register(b, { cc: c }, b);
          return b;
        };
        $a = (b) => {
          ab.unregister(b);
        };
        return Q(a);
      },
      gb = {},
      hb = (a) => {
        for (; a.length; ) {
          var b = a.pop();
          a.pop()(b);
        }
      };
    function ib(a) {
      return this.fromWireType(B[a >> 2]);
    }
    var R = {},
      jb = {},
      T = (a, b, c) => {
        function d(g) {
          g = c(g);
          if (g.length !== a.length) throw new eb('Mismatched type converter count');
          for (var k = 0; k < a.length; ++k) S(a[k], g[k]);
        }
        a.forEach((g) => (jb[g] = b));
        var e = Array(b.length),
          f = [],
          h = 0;
        b.forEach((g, k) => {
          O.hasOwnProperty(g)
            ? (e[k] = O[g])
            : (f.push(g),
              R.hasOwnProperty(g) || (R[g] = []),
              R[g].push(() => {
                e[k] = O[g];
                ++h;
                h === f.length && d(e);
              }));
        });
        0 === f.length && d(e);
      };
    function kb(a, b, c = {}) {
      var d = b.name;
      if (!a) throw new L(`type "${d}" must have a positive integer typeid pointer`);
      if (O.hasOwnProperty(a)) {
        if (c.Mc) return;
        throw new L(`Cannot register type '${d}' twice`);
      }
      O[a] = b;
      delete jb[a];
      R.hasOwnProperty(a) && ((b = R[a]), delete R[a], b.forEach((e) => e()));
    }
    function S(a, b, c = {}) {
      return kb(a, b, c);
    }
    var lb = (a) => {
        throw new L(a.cc.fc.ec.name + ' instance already deleted');
      },
      mb = [];
    function nb() {}
    var ob = (a, b, c) => {
        if (void 0 === a[b].hc) {
          var d = a[b];
          a[b] = function (...e) {
            if (!a[b].hc.hasOwnProperty(e.length))
              throw new L(
                `Function '${c}' called with an invalid number of arguments (${e.length}) - expects one of (${a[b].hc})!`,
              );
            return a[b].hc[e.length].apply(this, e);
          };
          a[b].hc = [];
          a[b].hc[d.pc] = d;
        }
      },
      pb = (a, b, c) => {
        if (l.hasOwnProperty(a)) {
          if (void 0 === c || (void 0 !== l[a].hc && void 0 !== l[a].hc[c]))
            throw new L(`Cannot register public name '${a}' twice`);
          ob(l, a, a);
          if (l[a].hc.hasOwnProperty(c))
            throw new L(`Cannot register multiple overloads of a function with the same number of arguments (${c})!`);
          l[a].hc[c] = b;
        } else (l[a] = b), (l[a].pc = c);
      },
      qb = (a) => {
        a = a.replace(/[^a-zA-Z0-9_]/g, '$');
        var b = a.charCodeAt(0);
        return 48 <= b && 57 >= b ? `_${a}` : a;
      };
    function rb(a, b, c, d, e, f, h, g) {
      this.name = a;
      this.constructor = b;
      this.oc = c;
      this.nc = d;
      this.ic = e;
      this.Hc = f;
      this.tc = h;
      this.Ec = g;
      this.Bc = [];
    }
    var sb = (a, b, c) => {
      for (; b !== c; ) {
        if (!b.tc) throw new L(`Expected null or instance of ${c.name}, got an instance of ${b.name}`);
        a = b.tc(a);
        b = b.ic;
      }
      return a;
    };
    function tb(a, b) {
      if (null === b) {
        if (this.xc) throw new L(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.cc) throw new L(`Cannot pass "${ub(b)}" as a ${this.name}`);
      if (!b.cc.dc) throw new L(`Cannot pass deleted object as a pointer of type ${this.name}`);
      return sb(b.cc.dc, b.cc.fc.ec, this.ec);
    }
    function vb(a, b) {
      if (null === b) {
        if (this.xc) throw new L(`null is not a valid ${this.name}`);
        if (this.wc) {
          var c = this.yc();
          null !== a && a.push(this.nc, c);
          return c;
        }
        return 0;
      }
      if (!b || !b.cc) throw new L(`Cannot pass "${ub(b)}" as a ${this.name}`);
      if (!b.cc.dc) throw new L(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (!this.vc && b.cc.fc.vc)
        throw new L(
          `Cannot convert argument of type ${b.cc.lc ? b.cc.lc.name : b.cc.fc.name} to parameter type ${this.name}`,
        );
      c = sb(b.cc.dc, b.cc.fc.ec, this.ec);
      if (this.wc) {
        if (void 0 === b.cc.jc) throw new L('Passing raw pointer to smart pointer is illegal');
        switch (this.Tc) {
          case 0:
            if (b.cc.lc === this) c = b.cc.jc;
            else
              throw new L(
                `Cannot convert argument of type ${b.cc.lc ? b.cc.lc.name : b.cc.fc.name} to parameter type ${
                  this.name
                }`,
              );
            break;
          case 1:
            c = b.cc.jc;
            break;
          case 2:
            if (b.cc.lc === this) c = b.cc.jc;
            else {
              var d = b.clone();
              c = this.Pc(
                c,
                Qa(() => d['delete']()),
              );
              null !== a && a.push(this.nc, c);
            }
            break;
          default:
            throw new L('Unsupporting sharing policy');
        }
      }
      return c;
    }
    function wb(a, b) {
      if (null === b) {
        if (this.xc) throw new L(`null is not a valid ${this.name}`);
        return 0;
      }
      if (!b.cc) throw new L(`Cannot pass "${ub(b)}" as a ${this.name}`);
      if (!b.cc.dc) throw new L(`Cannot pass deleted object as a pointer of type ${this.name}`);
      if (b.cc.fc.vc) throw new L(`Cannot convert argument of type ${b.cc.fc.name} to parameter type ${this.name}`);
      return sb(b.cc.dc, b.cc.fc.ec, this.ec);
    }
    function xb(a, b, c, d, e, f, h, g, k, m, n) {
      this.name = a;
      this.ec = b;
      this.xc = c;
      this.vc = d;
      this.wc = e;
      this.Oc = f;
      this.Tc = h;
      this.Cc = g;
      this.yc = k;
      this.Pc = m;
      this.nc = n;
      e || void 0 !== b.ic ? (this.toWireType = vb) : ((this.toWireType = d ? tb : wb), (this.kc = null));
    }
    var yb = (a, b, c) => {
        if (!l.hasOwnProperty(a)) throw new eb('Replacing nonexistent public symbol');
        void 0 !== l[a].hc && void 0 !== c ? (l[a].hc[c] = b) : ((l[a] = b), (l[a].pc = c));
      },
      U,
      zb = (a, b, c = []) => {
        a.includes('j') ? ((a = a.replace(/p/g, 'i')), (b = (0, l['dynCall_' + a])(b, ...c))) : (b = U.get(b)(...c));
        return b;
      },
      Ab =
        (a, b) =>
        (...c) =>
          zb(a, b, c),
      V = (a, b) => {
        a = N(a);
        var c = a.includes('j') ? Ab(a, b) : U.get(b);
        if ('function' != typeof c) throw new L(`unknown function pointer with signature ${a}: ${b}`);
        return c;
      },
      Bb,
      Cb = (a, b) => {
        function c(f) {
          e[f] || O[f] || (jb[f] ? jb[f].forEach(c) : (d.push(f), (e[f] = !0)));
        }
        var d = [],
          e = {};
        b.forEach(c);
        throw new Bb(`${a}: ` + d.map(Ya).join([', ']));
      };
    function Db(a) {
      for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].kc) return !0;
      return !1;
    }
    function Eb(a) {
      var b = Function;
      if (!(b instanceof Function))
        throw new TypeError(`new_ called with constructor type ${typeof b} which is not a function`);
      var c = J(b.name || 'unknownFunctionName', function () {});
      c.prototype = b.prototype;
      c = new c();
      a = b.apply(c, a);
      return a instanceof Object ? a : c;
    }
    function Fb(a, b, c, d, e, f) {
      var h = b.length;
      if (2 > h) throw new L("argTypes array size mismatch! Must at least get return value and 'this' types!");
      var g = null !== b[1] && null !== c,
        k = Db(b);
      c = 'void' !== b[0].name;
      d = [a, Pa, d, e, hb, b[0], b[1]];
      for (e = 0; e < h - 2; ++e) d.push(b[e + 2]);
      if (!k) for (e = g ? 1 : 2; e < b.length; ++e) null !== b[e].kc && d.push(b[e].kc);
      k = Db(b);
      e = b.length - 2;
      var m = [],
        n = ['fn'];
      g && n.push('thisWired');
      for (h = 0; h < e; ++h) m.push(`arg${h}`), n.push(`arg${h}Wired`);
      m = m.join(',');
      n = n.join(',');
      m = `return function (${m}) {\n`;
      k && (m += 'var destructors = [];\n');
      var u = k ? 'destructors' : 'null',
        v = 'humanName throwBindingError invoker fn runDestructors retType classParam'.split(' ');
      g && (m += `var thisWired = classParam['toWireType'](${u}, this);\n`);
      for (h = 0; h < e; ++h)
        (m += `var arg${h}Wired = argType${h}['toWireType'](${u}, arg${h});\n`), v.push(`argType${h}`);
      m += (c || f ? 'var rv = ' : '') + `invoker(${n});\n`;
      if (k) m += 'runDestructors(destructors);\n';
      else
        for (h = g ? 1 : 2; h < b.length; ++h)
          (f = 1 === h ? 'thisWired' : 'arg' + (h - 2) + 'Wired'),
            null !== b[h].kc && ((m += `${f}_dtor(${f});\n`), v.push(`${f}_dtor`));
      c && (m += "var ret = retType['fromWireType'](rv);\nreturn ret;\n");
      let [y, z] = [v, m + '}\n'];
      y.push(z);
      b = Eb(y)(...d);
      return J(a, b);
    }
    var Gb = (a, b) => {
        for (var c = [], d = 0; d < a; d++) c.push(B[(b + 4 * d) >> 2]);
        return c;
      },
      Hb = (a) => {
        a = a.trim();
        const b = a.indexOf('(');
        return -1 !== b ? a.substr(0, b) : a;
      },
      Ib = (a) => {
        9 < a && 0 === --K[a + 1] && ((K[a] = void 0), Oa.push(a));
      },
      Jb = {
        name: 'emscripten::val',
        fromWireType: (a) => {
          var b = M(a);
          Ib(a);
          return b;
        },
        toWireType: (a, b) => Qa(b),
        mc: 8,
        readValueFromPointer: ib,
        kc: null,
      },
      Kb = (a, b, c) => {
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
                  return this.fromWireType(w[d >> 1]);
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
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      ub = (a) => {
        if (null === a) return 'null';
        var b = typeof a;
        return 'object' === b || 'array' === b || 'function' === b ? a.toString() : '' + a;
      },
      Lb = (a, b) => {
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
      Nb = (a, b, c) => {
        switch (b) {
          case 1:
            return c ? (d) => r[d] : (d) => t[d];
          case 2:
            return c ? (d) => w[d >> 1] : (d) => x[d >> 1];
          case 4:
            return c ? (d) => A[d >> 2] : (d) => B[d >> 2];
          default:
            throw new TypeError(`invalid integer width (${b}): ${a}`);
        }
      },
      Ob = Object.assign({ optional: !0 }, Jb),
      Pb = 'undefined' != typeof TextDecoder ? new TextDecoder('utf-16le') : void 0,
      Qb = (a, b) => {
        var c = a >> 1;
        for (var d = c + b / 2; !(c >= d) && x[c]; ) ++c;
        c <<= 1;
        if (32 < c - a && Pb) return Pb.decode(t.subarray(a, c));
        c = '';
        for (d = 0; !(d >= b / 2); ++d) {
          var e = w[(a + 2 * d) >> 1];
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
        for (var e = 0; e < c; ++e) (w[b >> 1] = a.charCodeAt(e)), (b += 2);
        w[b >> 1] = 0;
        return b - d;
      },
      Sb = (a) => 2 * a.length,
      Tb = (a, b) => {
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
      Ub = (a, b, c) => {
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
      Vb = (a) => {
        for (var b = 0, c = 0; c < a.length; ++c) {
          var d = a.charCodeAt(c);
          55296 <= d && 57343 >= d && ++c;
          b += 4;
        }
        return b;
      },
      Wb = 0,
      Xb = (a, b, c) => {
        var d = [];
        a = a.toWireType(d, c);
        d.length && (B[b >> 2] = Qa(d));
        return a;
      },
      Yb = [],
      Zb = {},
      $b = (a) => {
        var b = Yb.length;
        Yb.push(a);
        return b;
      },
      ac = (a, b) => {
        for (var c = Array(a), d = 0; d < a; ++d) c[d] = Za(B[(b + 4 * d) >> 2], 'parameter ' + d);
        return c;
      },
      bc = {},
      cc = (a) => {
        if (!(a instanceof Da || 'unwind' == a)) throw a;
      },
      dc = (a) => {
        na = a;
        Fa || 0 < Wb || (l.onExit?.(a), (ka = !0));
        throw new Da(a);
      },
      ec = (a) => {
        if (!ka)
          try {
            if ((a(), !(Fa || 0 < Wb)))
              try {
                (na = a = na), dc(a);
              } catch (b) {
                cc(b);
              }
          } catch (b) {
            cc(b);
          }
      },
      fc = {},
      hc = () => {
        if (!gc) {
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
          for (b in fc) void 0 === fc[b] ? delete a[b] : (a[b] = fc[b]);
          var c = [];
          for (b in a) c.push(`${b}=${a[b]}`);
          gc = c;
        }
        return gc;
      },
      gc,
      ic = [null, [], []],
      jc = () => {
        if ('object' == typeof crypto && 'function' == typeof crypto.getRandomValues)
          return (a) => crypto.getRandomValues(a);
        wa('initRandomDevice');
      },
      kc = (a) => (kc = jc())(a);
    L = l.BindingError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'BindingError';
      }
    };
    K.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1);
    l.count_emval_handles = () => K.length / 2 - 5 - Oa.length;
    Sa = l.PureVirtualError = Ra('PureVirtualError');
    for (var lc = Array(256), mc = 0; 256 > mc; ++mc) lc[mc] = String.fromCharCode(mc);
    Ta = lc;
    eb = l.InternalError = class extends Error {
      constructor(a) {
        super(a);
        this.name = 'InternalError';
      }
    };
    Object.assign(nb.prototype, {
      isAliasOf: function (a) {
        if (!(this instanceof nb && a instanceof nb)) return !1;
        var b = this.cc.fc.ec,
          c = this.cc.dc;
        a.cc = a.cc;
        var d = a.cc.fc.ec;
        for (a = a.cc.dc; b.ic; ) (c = b.tc(c)), (b = b.ic);
        for (; d.ic; ) (a = d.tc(a)), (d = d.ic);
        return b === d && c === a;
      },
      clone: function () {
        this.cc.dc || lb(this);
        if (this.cc.rc) return (this.cc.count.value += 1), this;
        var a = Q,
          b = Object,
          c = b.create,
          d = Object.getPrototypeOf(this),
          e = this.cc;
        a = a(
          c.call(b, d, {
            cc: { value: { count: e.count, sc: e.sc, rc: e.rc, dc: e.dc, fc: e.fc, jc: e.jc, lc: e.lc } },
          }),
        );
        a.cc.count.value += 1;
        a.cc.sc = !1;
        return a;
      },
      ['delete']() {
        this.cc.dc || lb(this);
        if (this.cc.sc && !this.cc.rc) throw new L('Object already scheduled for deletion');
        $a(this);
        var a = this.cc;
        --a.count.value;
        0 === a.count.value && (a.jc ? a.lc.nc(a.jc) : a.fc.ec.nc(a.dc));
        this.cc.rc || ((this.cc.jc = void 0), (this.cc.dc = void 0));
      },
      isDeleted: function () {
        return !this.cc.dc;
      },
      deleteLater: function () {
        this.cc.dc || lb(this);
        if (this.cc.sc && !this.cc.rc) throw new L('Object already scheduled for deletion');
        mb.push(this);
        this.cc.sc = !0;
        return this;
      },
    });
    Object.assign(xb.prototype, {
      Ic(a) {
        this.Cc && (a = this.Cc(a));
        return a;
      },
      zc(a) {
        this.nc?.(a);
      },
      mc: 8,
      readValueFromPointer: ib,
      fromWireType: function (a) {
        function b() {
          return this.wc
            ? fb(this.ec.oc, { fc: this.Oc, dc: c, lc: this, jc: a })
            : fb(this.ec.oc, { fc: this, dc: a });
        }
        var c = this.Ic(a);
        if (!c) return this.zc(a), null;
        var d = db(this.ec, c);
        if (void 0 !== d) {
          if (0 === d.cc.count.value) return (d.cc.dc = c), (d.cc.jc = a), d.clone();
          d = d.clone();
          this.zc(a);
          return d;
        }
        d = this.ec.Hc(c);
        d = cb[d];
        if (!d) return b.call(this);
        d = this.vc ? d.Dc : d.pointerType;
        var e = bb(c, this.ec, d.ec);
        return null === e
          ? b.call(this)
          : this.wc
          ? fb(d.ec.oc, { fc: d, dc: e, lc: this, jc: a })
          : fb(d.ec.oc, { fc: d, dc: e });
      },
    });
    Bb = l.UnboundTypeError = Ra('UnboundTypeError');
    var yd = {
        l: (a, b, c, d) =>
          wa(
            `Assertion failed: ${a ? H(t, a) : ''}, at: ` +
              [b ? (b ? H(t, b) : '') : 'unknown filename', c, d ? (d ? H(t, d) : '') : 'unknown function'],
          ),
        Fa: (a) => {
          var b = new Ja(a);
          0 == r[b.dc + 12] && ((r[b.dc + 12] = 1), Ia--);
          r[b.dc + 13] = 0;
          Ha.push(b);
          nc(a);
          return oc(a);
        },
        Ea: () => {
          W(0, 0);
          var a = Ha.pop();
          pc(a.Fc);
          I = 0;
        },
        b: () => Ma([]),
        o: (a, b) => Ma([a, b]),
        v: (a, b, c) => {
          var d = new Ja(a);
          B[(d.dc + 16) >> 2] = 0;
          B[(d.dc + 4) >> 2] = b;
          B[(d.dc + 8) >> 2] = c;
          I = a;
          Ia++;
          throw I;
        },
        d: (a) => {
          I ||= a;
          throw I;
        },
        wa: () => {},
        ta: () => {},
        ua: () => {},
        ya: function () {},
        va: () => {},
        Aa: () => wa(''),
        da: (a, b, c) => {
          a = N(a);
          b = Za(b, 'wrapper');
          c = M(c);
          var d = b.ec,
            e = d.oc,
            f = d.ic.oc,
            h = d.ic.constructor;
          a = J(a, function (...g) {
            d.ic.Bc.forEach(
              function (k) {
                if (this[k] === f[k]) throw new Sa(`Pure virtual function ${k} must be implemented in JavaScript`);
              }.bind(this),
            );
            Object.defineProperty(this, '__parent', { value: e });
            this.__construct(...g);
          });
          e.__construct = function (...g) {
            if (this === e) throw new L("Pass correct 'this' to __construct");
            g = h.implement(this, ...g);
            $a(g);
            var k = g.cc;
            g.notifyOnDestruction();
            k.rc = !0;
            Object.defineProperties(this, { cc: { value: k } });
            Q(this);
            g = k.dc;
            g = Va(d, g);
            if (Ua.hasOwnProperty(g)) throw new L(`Tried to register registered instance: ${g}`);
            Ua[g] = this;
          };
          e.__destruct = function () {
            if (this === e) throw new L("Pass correct 'this' to __destruct");
            $a(this);
            var g = this.cc.dc;
            g = Va(d, g);
            if (Ua.hasOwnProperty(g)) delete Ua[g];
            else throw new L(`Tried to unregister unregistered instance: ${g}`);
          };
          a.prototype = Object.create(e);
          Object.assign(a.prototype, c);
          return Qa(a);
        },
        N: (a) => {
          var b = gb[a];
          delete gb[a];
          var c = b.yc,
            d = b.nc,
            e = b.Ac,
            f = e.map((h) => h.Lc).concat(e.map((h) => h.Rc));
          T([a], f, (h) => {
            var g = {};
            e.forEach((k, m) => {
              var n = h[m],
                u = k.Jc,
                v = k.Kc,
                y = h[m + e.length],
                z = k.Qc,
                E = k.Sc;
              g[k.Gc] = {
                read: (F) => n.fromWireType(u(v, F)),
                write: (F, la) => {
                  var G = [];
                  z(E, F, y.toWireType(G, la));
                  hb(G);
                },
              };
            });
            return [
              {
                name: b.name,
                fromWireType: (k) => {
                  var m = {},
                    n;
                  for (n in g) m[n] = g[n].read(k);
                  d(k);
                  return m;
                },
                toWireType: (k, m) => {
                  for (var n in g) if (!(n in m)) throw new TypeError(`Missing field: "${n}"`);
                  var u = c();
                  for (n in g) g[n].write(u, m[n]);
                  null !== k && k.push(d, u);
                  return u;
                },
                mc: 8,
                readValueFromPointer: ib,
                kc: d,
              },
            ];
          });
        },
        ma: () => {},
        Pa: (a, b, c, d) => {
          b = N(b);
          S(a, {
            name: b,
            fromWireType: function (e) {
              return !!e;
            },
            toWireType: function (e, f) {
              return f ? c : d;
            },
            mc: 8,
            readValueFromPointer: function (e) {
              return this.fromWireType(t[e]);
            },
            kc: null,
          });
        },
        C: (a, b, c, d, e, f, h, g, k, m, n, u, v) => {
          n = N(n);
          f = V(e, f);
          g &&= V(h, g);
          m &&= V(k, m);
          v = V(u, v);
          var y = qb(n);
          pb(y, function () {
            Cb(`Cannot construct ${n} due to unbound types`, [d]);
          });
          T([a, b, c], d ? [d] : [], (z) => {
            z = z[0];
            if (d) {
              var E = z.ec;
              var F = E.oc;
            } else F = nb.prototype;
            z = J(n, function (...Wa) {
              if (Object.getPrototypeOf(this) !== la) throw new L("Use 'new' to construct " + n);
              if (void 0 === G.qc) throw new L(n + ' has no accessible constructor');
              var Mb = G.qc[Wa.length];
              if (void 0 === Mb)
                throw new L(
                  `Tried to invoke ctor of ${n} with invalid number of parameters (${
                    Wa.length
                  }) - expected (${Object.keys(G.qc).toString()}) parameters instead!`,
                );
              return Mb.apply(this, Wa);
            });
            var la = Object.create(F, { constructor: { value: z } });
            z.prototype = la;
            var G = new rb(n, z, la, v, E, f, g, m);
            if (G.ic) {
              var ma;
              (ma = G.ic).uc ?? (ma.uc = []);
              G.ic.uc.push(G);
            }
            E = new xb(n, G, !0, !1, !1);
            ma = new xb(n + '*', G, !1, !1, !1);
            F = new xb(n + ' const*', G, !1, !0, !1);
            cb[a] = { pointerType: ma, Dc: F };
            yb(y, z);
            return [E, ma, F];
          });
        },
        L: (a, b, c, d, e, f, h, g) => {
          var k = Gb(c, d);
          b = N(b);
          b = Hb(b);
          f = V(e, f);
          T([], [a], (m) => {
            function n() {
              Cb(`Cannot call ${u} due to unbound types`, k);
            }
            m = m[0];
            var u = `${m.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            var v = m.ec.constructor;
            void 0 === v[b] ? ((n.pc = c - 1), (v[b] = n)) : (ob(v, b, u), (v[b].hc[c - 1] = n));
            T([], k, (y) => {
              y = Fb(u, [y[0], null].concat(y.slice(1)), null, f, h, g);
              void 0 === v[b].hc ? ((y.pc = c - 1), (v[b] = y)) : (v[b].hc[c - 1] = y);
              if (m.ec.uc) for (const z of m.ec.uc) z.constructor.hasOwnProperty(b) || (z.constructor[b] = y);
              return [];
            });
            return [];
          });
        },
        K: (a, b, c, d, e, f) => {
          var h = Gb(b, c);
          e = V(d, e);
          T([], [a], (g) => {
            g = g[0];
            var k = `constructor ${g.name}`;
            void 0 === g.ec.qc && (g.ec.qc = []);
            if (void 0 !== g.ec.qc[b - 1])
              throw new L(
                `Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${
                  g.name
                }'! Overload resolution is currently only performed using the parameter count, not actual type info!`,
              );
            g.ec.qc[b - 1] = () => {
              Cb(`Cannot construct ${g.name} due to unbound types`, h);
            };
            T([], h, (m) => {
              m.splice(1, 0, null);
              g.ec.qc[b - 1] = Fb(k, m, null, e, f);
              return [];
            });
            return [];
          });
        },
        m: (a, b, c, d, e, f, h, g, k) => {
          var m = Gb(c, d);
          b = N(b);
          b = Hb(b);
          f = V(e, f);
          T([], [a], (n) => {
            function u() {
              Cb(`Cannot call ${v} due to unbound types`, m);
            }
            n = n[0];
            var v = `${n.name}.${b}`;
            b.startsWith('@@') && (b = Symbol[b.substring(2)]);
            g && n.ec.Bc.push(b);
            var y = n.ec.oc,
              z = y[b];
            void 0 === z || (void 0 === z.hc && z.className !== n.name && z.pc === c - 2)
              ? ((u.pc = c - 2), (u.className = n.name), (y[b] = u))
              : (ob(y, b, v), (y[b].hc[c - 2] = u));
            T([], m, (E) => {
              E = Fb(v, E, n, f, h, k);
              void 0 === y[b].hc ? ((E.pc = c - 2), (y[b] = E)) : (y[b].hc[c - 2] = E);
              return [];
            });
            return [];
          });
        },
        Oa: (a) => S(a, Jb),
        P: (a, b, c, d) => {
          function e() {}
          b = N(b);
          e.values = {};
          S(a, {
            name: b,
            constructor: e,
            fromWireType: function (f) {
              return this.constructor.values[f];
            },
            toWireType: (f, h) => h.value,
            mc: 8,
            readValueFromPointer: Kb(b, c, d),
            kc: null,
          });
          pb(b, e);
        },
        w: (a, b, c) => {
          var d = Za(a, 'enum');
          b = N(b);
          a = d.constructor;
          d = Object.create(d.constructor.prototype, {
            value: { value: c },
            constructor: { value: J(`${d.name}_${b}`, function () {}) },
          });
          a.values[c] = d;
          a[b] = d;
        },
        aa: (a, b, c) => {
          b = N(b);
          S(a, {
            name: b,
            fromWireType: (d) => d,
            toWireType: (d, e) => e,
            mc: 8,
            readValueFromPointer: Lb(b, c),
            kc: null,
          });
        },
        M: (a, b, c, d, e, f, h) => {
          var g = Gb(b, c);
          a = N(a);
          a = Hb(a);
          e = V(d, e);
          pb(
            a,
            function () {
              Cb(`Cannot call ${a} due to unbound types`, g);
            },
            b - 1,
          );
          T([], g, (k) => {
            yb(a, Fb(a, [k[0], null].concat(k.slice(1)), null, e, f, h), b - 1);
            return [];
          });
        },
        z: (a, b, c, d, e) => {
          b = N(b);
          -1 === e && (e = 4294967295);
          e = (g) => g;
          if (0 === d) {
            var f = 32 - 8 * c;
            e = (g) => (g << f) >>> f;
          }
          var h = b.includes('unsigned')
            ? function (g, k) {
                return k >>> 0;
              }
            : function (g, k) {
                return k;
              };
          S(a, { name: b, fromWireType: e, toWireType: h, mc: 8, readValueFromPointer: Nb(b, c, 0 !== d), kc: null });
        },
        r: (a, b, c) => {
          function d(f) {
            return new e(r.buffer, B[(f + 4) >> 2], B[f >> 2]);
          }
          var e = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][
            b
          ];
          c = N(c);
          S(a, { name: c, fromWireType: d, mc: 8, readValueFromPointer: d }, { Mc: !0 });
        },
        O: (a) => {
          S(a, Ob);
        },
        T: (a, b, c, d, e, f, h, g, k, m, n, u) => {
          c = N(c);
          f = V(e, f);
          g = V(h, g);
          m = V(k, m);
          u = V(n, u);
          T([a], [b], (v) => {
            v = v[0];
            return [new xb(c, v.ec, !1, !1, !0, v, d, f, g, m, u)];
          });
        },
        ba: (a, b) => {
          b = N(b);
          var c = 'std::string' === b;
          S(a, {
            name: b,
            fromWireType: function (d) {
              var e = B[d >> 2],
                f = d + 4;
              if (c)
                for (var h = f, g = 0; g <= e; ++g) {
                  var k = f + g;
                  if (g == e || 0 == t[k]) {
                    h = h ? H(t, h, k - h) : '';
                    if (void 0 === m) var m = h;
                    else (m += String.fromCharCode(0)), (m += h);
                    h = k + 1;
                  }
                }
              else {
                m = Array(e);
                for (g = 0; g < e; ++g) m[g] = String.fromCharCode(t[f + g]);
                m = m.join('');
              }
              P(d);
              return m;
            },
            toWireType: function (d, e) {
              e instanceof ArrayBuffer && (e = new Uint8Array(e));
              var f,
                h = 'string' == typeof e;
              if (!(h || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array))
                throw new L('Cannot pass non-string to std::string');
              if (c && h)
                for (var g = (f = 0); g < e.length; ++g) {
                  var k = e.charCodeAt(g);
                  127 >= k ? f++ : 2047 >= k ? (f += 2) : 55296 <= k && 57343 >= k ? ((f += 4), ++g) : (f += 3);
                }
              else f = e.length;
              g = qc(4 + f + 1);
              k = g + 4;
              B[g >> 2] = f;
              if (c && h) Na(e, k, f + 1);
              else if (h)
                for (h = 0; h < f; ++h) {
                  var m = e.charCodeAt(h);
                  if (255 < m) throw (P(k), new L('String has UTF-16 code units that do not fit in 8 bits'));
                  t[k + h] = m;
                }
              else for (h = 0; h < f; ++h) t[k + h] = e[h];
              null !== d && d.push(P, g);
              return g;
            },
            mc: 8,
            readValueFromPointer: ib,
            kc(d) {
              P(d);
            },
          });
        },
        S: (a, b, c) => {
          c = N(c);
          if (2 === b) {
            var d = Qb;
            var e = Rb;
            var f = Sb;
            var h = (g) => x[g >> 1];
          } else 4 === b && ((d = Tb), (e = Ub), (f = Vb), (h = (g) => B[g >> 2]));
          S(a, {
            name: c,
            fromWireType: (g) => {
              for (var k = B[g >> 2], m, n = g + 4, u = 0; u <= k; ++u) {
                var v = g + 4 + u * b;
                if (u == k || 0 == h(v))
                  (n = d(n, v - n)), void 0 === m ? (m = n) : ((m += String.fromCharCode(0)), (m += n)), (n = v + b);
              }
              P(g);
              return m;
            },
            toWireType: (g, k) => {
              if ('string' != typeof k) throw new L(`Cannot pass non-string to C++ string type ${c}`);
              var m = f(k),
                n = qc(4 + m + b);
              B[n >> 2] = m / b;
              e(k, n + 4, m + b);
              null !== g && g.push(P, n);
              return n;
            },
            mc: 8,
            readValueFromPointer: ib,
            kc(g) {
              P(g);
            },
          });
        },
        H: (a, b, c, d, e, f) => {
          gb[a] = { name: N(b), yc: V(c, d), nc: V(e, f), Ac: [] };
        },
        x: (a, b, c, d, e, f, h, g, k, m) => {
          gb[a].Ac.push({ Gc: N(b), Lc: c, Jc: V(d, e), Kc: f, Rc: h, Qc: V(g, k), Sc: m });
        },
        Qa: (a, b) => {
          b = N(b);
          S(a, { Nc: !0, name: b, mc: 0, fromWireType: () => {}, toWireType: () => {} });
        },
        Ga: function () {
          return Date.now();
        },
        ra: () => {
          Fa = !1;
          Wb = 0;
        },
        na: () => {
          throw Infinity;
        },
        ca: (a, b, c) => {
          a = M(a);
          b = Za(b, 'emval::as');
          return Xb(b, c, a);
        },
        Sa: (a, b, c, d) => {
          a = Yb[a];
          b = M(b);
          return a(null, b, c, d);
        },
        D: (a, b, c, d, e) => {
          a = Yb[a];
          b = M(b);
          var f = Zb[c];
          c = void 0 === f ? N(c) : f;
          return a(b, b[c], d, e);
        },
        Ja: Ib,
        A: (a, b, c) => {
          b = ac(a, b);
          var d = b.shift();
          a--;
          var e = 'return function (obj, func, destructorsRef, args) {\n',
            f = 0,
            h = [];
          0 === c && h.push('obj');
          for (var g = ['retType'], k = [d], m = 0; m < a; ++m)
            h.push('arg' + m),
              g.push('argType' + m),
              k.push(b[m]),
              (e += `  var arg${m} = argType${m}.readValueFromPointer(args${f ? '+' + f : ''});\n`),
              (f += b[m].mc);
          e += `  var rv = ${1 === c ? 'new func' : 'func.call'}(${h.join(', ')});\n`;
          d.Nc ||
            (g.push('emval_returnValue'),
            k.push(Xb),
            (e += '  return emval_returnValue(retType, destructorsRef, rv);\n'));
          g.push(e + '};\n');
          a = Eb(g)(...k);
          c = `methodCaller<(${b.map((n) => n.name).join(', ')}) => ${d.name}>`;
          return $b(J(c, a));
        },
        Ta: (a) => {
          9 < a && (K[a + 1] += 1);
        },
        Ra: (a) => {
          var b = M(a);
          hb(b);
          Ib(a);
        },
        F: (a, b) => {
          a = Za(a, '_emval_take_value');
          a = a.readValueFromPointer(b);
          return Qa(a);
        },
        oa: (a, b) => {
          bc[a] && (clearTimeout(bc[a].id), delete bc[a]);
          if (!b) return 0;
          var c = setTimeout(() => {
            delete bc[a];
            ec(() => rc(a, performance.now()));
          }, b);
          bc[a] = { id: c, Uc: b };
          return 0;
        },
        pa: (a, b, c, d) => {
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
          e < f ? (Na(a, c, 17), Na(b, d, 17)) : (Na(a, d, 17), Na(b, c, 17));
        },
        qa: (a) => {
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
        Ca: (a, b) => {
          var c = 0;
          hc().forEach((d, e) => {
            var f = b + c;
            e = B[(a + 4 * e) >> 2] = f;
            for (f = 0; f < d.length; ++f) r[e++] = d.charCodeAt(f);
            r[e] = 0;
            c += d.length + 1;
          });
          return 0;
        },
        Da: (a, b) => {
          var c = hc();
          B[a >> 2] = c.length;
          var d = 0;
          c.forEach((e) => (d += e.length + 1));
          B[b >> 2] = d;
          return 0;
        },
        za: () => 52,
        xa: () => 52,
        U: (a, b, c, d) => {
          for (var e = 0, f = 0; f < c; f++) {
            var h = B[b >> 2],
              g = B[(b + 4) >> 2];
            b += 8;
            for (var k = 0; k < g; k++) {
              var m = a,
                n = t[h + k],
                u = ic[m];
              0 === n || 10 === n ? ((1 === m ? ha : q)(H(u)), (u.length = 0)) : u.push(n);
            }
            e += g;
          }
          B[d >> 2] = e;
          return 0;
        },
        Ia: sc,
        n: tc,
        $: uc,
        La: vc,
        g: wc,
        u: xc,
        Na: yc,
        G: zc,
        J: Ac,
        f: Bc,
        _: Cc,
        h: Dc,
        Ma: Ec,
        k: Fc,
        R: Gc,
        t: Hc,
        V: Ic,
        W: Jc,
        Xa: Kc,
        bb: Lc,
        ha: Mc,
        ka: Nc,
        la: Oc,
        fa: Pc,
        db: Qc,
        I: Rc,
        a: Sc,
        B: Tc,
        E: Uc,
        X: Vc,
        c: Wc,
        Ka: Xc,
        Ha: Yc,
        e: Zc,
        Y: $c,
        Q: ad,
        j: bd,
        y: cd,
        i: dd,
        p: ed,
        s: fd,
        Z: gd,
        Wa: hd,
        Za: jd,
        Ya: kd,
        ab: ld,
        $a: md,
        _a: nd,
        cb: od,
        ia: pd,
        ga: qd,
        Va: rd,
        fb: sd,
        ea: td,
        gb: ud,
        ja: vd,
        Ua: wd,
        eb: xd,
        q: (a) => a,
        Ba: dc,
        sa: (a, b) => {
          kc(t.subarray(a, a + b));
          return 0;
        },
      },
      X = (function () {
        function a(c) {
          X = c.exports;
          ja = X.hb;
          qa();
          U = X.mb;
          sa.unshift(X.ib);
          C--;
          l.monitorRunDependencies?.(C);
          0 == C && (null !== va && (clearInterval(va), (va = null)), D && ((c = D), (D = null), c()));
          return X;
        }
        C++;
        l.monitorRunDependencies?.(C);
        var b = { a: yd };
        if (l.instantiateWasm)
          try {
            return l.instantiateWasm(b, a);
          } catch (c) {
            q(`Module.instantiateWasm callback failed with error: ${c}`), ba(c);
          }
        ya ??= xa('DotLottiePlayer.wasm')
          ? 'DotLottiePlayer.wasm'
          : l.locateFile
          ? l.locateFile('DotLottiePlayer.wasm', p)
          : p + 'DotLottiePlayer.wasm';
        Ca(b, function (c) {
          a(c.instance);
        }).catch(ba);
        return {};
      })(),
      qc = (a) => (qc = X.jb)(a),
      Xa = (a) => (Xa = X.kb)(a),
      P = (a) => (P = X.lb)(a),
      rc = (a, b) => (rc = X.nb)(a, b),
      W = (a, b) => (W = X.ob)(a, b),
      Ka = (a) => (Ka = X.pb)(a),
      Y = (a) => (Y = X.qb)(a),
      Z = () => (Z = X.rb)(),
      pc = (a) => (pc = X.sb)(a),
      nc = (a) => (nc = X.tb)(a),
      La = (a, b, c) => (La = X.ub)(a, b, c),
      oc = (a) => (oc = X.vb)(a),
      zd = (l.dynCall_ji = (a, b) => (zd = l.dynCall_ji = X.wb)(a, b)),
      Ad = (l.dynCall_viji = (a, b, c, d, e) => (Ad = l.dynCall_viji = X.xb)(a, b, c, d, e)),
      Bd = (l.dynCall_jii = (a, b, c) => (Bd = l.dynCall_jii = X.yb)(a, b, c));
    l.dynCall_iijj = (a, b, c, d, e, f) => (l.dynCall_iijj = X.zb)(a, b, c, d, e, f);
    l.dynCall_vijj = (a, b, c, d, e, f) => (l.dynCall_vijj = X.Ab)(a, b, c, d, e, f);
    var Cd = (l.dynCall_vjiii = (a, b, c, d, e, f) => (Cd = l.dynCall_vjiii = X.Bb)(a, b, c, d, e, f)),
      Dd = (l.dynCall_vij = (a, b, c, d) => (Dd = l.dynCall_vij = X.Cb)(a, b, c, d)),
      Ed = (l.dynCall_viijii = (a, b, c, d, e, f, h) => (Ed = l.dynCall_viijii = X.Db)(a, b, c, d, e, f, h)),
      Fd = (l.dynCall_jjji = (a, b, c, d, e, f) => (Fd = l.dynCall_jjji = X.Eb)(a, b, c, d, e, f)),
      Gd = (l.dynCall_viijj = (a, b, c, d, e, f, h) => (Gd = l.dynCall_viijj = X.Fb)(a, b, c, d, e, f, h)),
      Hd = (l.dynCall_viijji = (a, b, c, d, e, f, h, g) => (Hd = l.dynCall_viijji = X.Gb)(a, b, c, d, e, f, h, g)),
      Id = (l.dynCall_viij = (a, b, c, d, e) => (Id = l.dynCall_viij = X.Hb)(a, b, c, d, e)),
      Jd = (l.dynCall_iiiijj = (a, b, c, d, e, f, h, g) => (Jd = l.dynCall_iiiijj = X.Ib)(a, b, c, d, e, f, h, g)),
      Kd = (l.dynCall_viiij = (a, b, c, d, e, f) => (Kd = l.dynCall_viiij = X.Jb)(a, b, c, d, e, f)),
      Ld = (l.dynCall_viiji = (a, b, c, d, e, f) => (Ld = l.dynCall_viiji = X.Kb)(a, b, c, d, e, f)),
      Md = (l.dynCall_jiii = (a, b, c, d) => (Md = l.dynCall_jiii = X.Lb)(a, b, c, d)),
      Nd = (l.dynCall_viiiji = (a, b, c, d, e, f, h) => (Nd = l.dynCall_viiiji = X.Mb)(a, b, c, d, e, f, h)),
      Od = (l.dynCall_viiijj = (a, b, c, d, e, f, h, g) => (Od = l.dynCall_viiijj = X.Nb)(a, b, c, d, e, f, h, g)),
      Pd = (l.dynCall_viiiijjiiiiii = (a, b, c, d, e, f, h, g, k, m, n, u, v, y, z) =>
        (Pd = l.dynCall_viiiijjiiiiii = X.Ob)(a, b, c, d, e, f, h, g, k, m, n, u, v, y, z)),
      Qd = (l.dynCall_viiiijjiiii = (a, b, c, d, e, f, h, g, k, m, n, u, v) =>
        (Qd = l.dynCall_viiiijjiiii = X.Pb)(a, b, c, d, e, f, h, g, k, m, n, u, v)),
      Rd = (l.dynCall_iiiiiijjii = (a, b, c, d, e, f, h, g, k, m, n, u) =>
        (Rd = l.dynCall_iiiiiijjii = X.Qb)(a, b, c, d, e, f, h, g, k, m, n, u)),
      Sd = (l.dynCall_viiiijjii = (a, b, c, d, e, f, h, g, k, m, n) =>
        (Sd = l.dynCall_viiiijjii = X.Rb)(a, b, c, d, e, f, h, g, k, m, n)),
      Td = (l.dynCall_viijiii = (a, b, c, d, e, f, h, g) => (Td = l.dynCall_viijiii = X.Sb)(a, b, c, d, e, f, h, g)),
      Ud = (l.dynCall_iji = (a, b, c, d) => (Ud = l.dynCall_iji = X.Tb)(a, b, c, d)),
      Vd = (l.dynCall_vijjjj = (a, b, c, d, e, f, h, g, k, m) =>
        (Vd = l.dynCall_vijjjj = X.Ub)(a, b, c, d, e, f, h, g, k, m));
    l.dynCall_vjii = (a, b, c, d, e) => (l.dynCall_vjii = X.Vb)(a, b, c, d, e);
    l.dynCall_vjfii = (a, b, c, d, e, f) => (l.dynCall_vjfii = X.Wb)(a, b, c, d, e, f);
    l.dynCall_vj = (a, b, c) => (l.dynCall_vj = X.Xb)(a, b, c);
    l.dynCall_vjiiiii = (a, b, c, d, e, f, h, g) => (l.dynCall_vjiiiii = X.Yb)(a, b, c, d, e, f, h, g);
    l.dynCall_vjiffii = (a, b, c, d, e, f, h, g) => (l.dynCall_vjiffii = X.Zb)(a, b, c, d, e, f, h, g);
    l.dynCall_vjiiii = (a, b, c, d, e, f, h) => (l.dynCall_vjiiii = X._b)(a, b, c, d, e, f, h);
    l.dynCall_iiiiij = (a, b, c, d, e, f, h) => (l.dynCall_iiiiij = X.$b)(a, b, c, d, e, f, h);
    l.dynCall_iiiiijj = (a, b, c, d, e, f, h, g, k) => (l.dynCall_iiiiijj = X.ac)(a, b, c, d, e, f, h, g, k);
    l.dynCall_iiiiiijj = (a, b, c, d, e, f, h, g, k, m) => (l.dynCall_iiiiiijj = X.bc)(a, b, c, d, e, f, h, g, k, m);
    function Wc(a, b, c) {
      var d = Z();
      try {
        U.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function Sc(a, b) {
      var c = Z();
      try {
        U.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        W(1, 0);
      }
    }
    function Zc(a, b, c, d) {
      var e = Z();
      try {
        U.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function bd(a, b, c, d, e) {
      var f = Z();
      try {
        U.get(a)(b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function wc(a, b) {
      var c = Z();
      try {
        return U.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        W(1, 0);
      }
    }
    function Bc(a, b, c) {
      var d = Z();
      try {
        return U.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function uc(a, b, c) {
      var d = Z();
      try {
        return U.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function yc(a, b, c, d) {
      var e = Z();
      try {
        return U.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function Uc(a, b, c) {
      var d = Z();
      try {
        U.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function tc(a, b) {
      var c = Z();
      try {
        return U.get(a)(b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        W(1, 0);
      }
    }
    function xc(a, b, c) {
      var d = Z();
      try {
        return U.get(a)(b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function Dc(a, b, c, d) {
      var e = Z();
      try {
        return U.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function Hc(a, b, c, d, e, f) {
      var h = Z();
      try {
        return U.get(a)(b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function zc(a, b, c, d, e, f) {
      var h = Z();
      try {
        return U.get(a)(b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function Fc(a, b, c, d, e) {
      var f = Z();
      try {
        return U.get(a)(b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function Ec(a, b, c, d, e) {
      var f = Z();
      try {
        return U.get(a)(b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function Gc(a, b, c, d, e, f, h) {
      var g = Z();
      try {
        return U.get(a)(b, c, d, e, f, h);
      } catch (k) {
        Y(g);
        if (k !== k + 0) throw k;
        W(1, 0);
      }
    }
    function Ac(a, b, c, d, e, f) {
      var h = Z();
      try {
        return U.get(a)(b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function dd(a, b, c, d, e, f) {
      var h = Z();
      try {
        U.get(a)(b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function Cc(a, b, c, d) {
      var e = Z();
      try {
        return U.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function vc(a, b, c, d) {
      var e = Z();
      try {
        return U.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function Xc(a, b, c, d, e) {
      var f = Z();
      try {
        U.get(a)(b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function ed(a, b, c, d, e, f, h) {
      var g = Z();
      try {
        U.get(a)(b, c, d, e, f, h);
      } catch (k) {
        Y(g);
        if (k !== k + 0) throw k;
        W(1, 0);
      }
    }
    function fd(a, b, c, d, e, f, h, g) {
      var k = Z();
      try {
        U.get(a)(b, c, d, e, f, h, g);
      } catch (m) {
        Y(k);
        if (m !== m + 0) throw m;
        W(1, 0);
      }
    }
    function gd(a, b, c, d, e, f, h, g, k) {
      var m = Z();
      try {
        U.get(a)(b, c, d, e, f, h, g, k);
      } catch (n) {
        Y(m);
        if (n !== n + 0) throw n;
        W(1, 0);
      }
    }
    function Tc(a, b, c, d) {
      var e = Z();
      try {
        U.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function sc(a, b, c, d) {
      var e = Z();
      try {
        return U.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function Yc(a, b, c, d, e, f, h) {
      var g = Z();
      try {
        U.get(a)(b, c, d, e, f, h);
      } catch (k) {
        Y(g);
        if (k !== k + 0) throw k;
        W(1, 0);
      }
    }
    function $c(a, b, c, d, e) {
      var f = Z();
      try {
        U.get(a)(b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function cd(a, b, c, d, e, f, h, g) {
      var k = Z();
      try {
        U.get(a)(b, c, d, e, f, h, g);
      } catch (m) {
        Y(k);
        if (m !== m + 0) throw m;
        W(1, 0);
      }
    }
    function Vc(a, b, c, d) {
      var e = Z();
      try {
        U.get(a)(b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function ad(a, b, c, d, e, f) {
      var h = Z();
      try {
        U.get(a)(b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function Jc(a, b, c, d, e, f, h, g, k) {
      var m = Z();
      try {
        return U.get(a)(b, c, d, e, f, h, g, k);
      } catch (n) {
        Y(m);
        if (n !== n + 0) throw n;
        W(1, 0);
      }
    }
    function Ic(a, b, c, d, e, f, h, g) {
      var k = Z();
      try {
        return U.get(a)(b, c, d, e, f, h, g);
      } catch (m) {
        Y(k);
        if (m !== m + 0) throw m;
        W(1, 0);
      }
    }
    function Rc(a) {
      var b = Z();
      try {
        U.get(a)();
      } catch (c) {
        Y(b);
        if (c !== c + 0) throw c;
        W(1, 0);
      }
    }
    function Oc(a, b, c) {
      var d = Z();
      try {
        return Bd(a, b, c);
      } catch (e) {
        Y(d);
        if (e !== e + 0) throw e;
        W(1, 0);
      }
    }
    function Nc(a, b) {
      var c = Z();
      try {
        return zd(a, b);
      } catch (d) {
        Y(c);
        if (d !== d + 0) throw d;
        W(1, 0);
      }
    }
    function vd(a, b, c, d, e) {
      var f = Z();
      try {
        Ad(a, b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function pd(a, b, c, d, e, f) {
      var h = Z();
      try {
        Ld(a, b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function Mc(a, b, c, d) {
      var e = Z();
      try {
        return Ud(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function qd(a, b, c, d, e, f, h) {
      var g = Z();
      try {
        Ed(a, b, c, d, e, f, h);
      } catch (k) {
        Y(g);
        if (k !== k + 0) throw k;
        W(1, 0);
      }
    }
    function Pc(a, b, c, d) {
      var e = Z();
      try {
        return Md(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function td(a, b, c, d, e, f, h, g) {
      var k = Z();
      try {
        Hd(a, b, c, d, e, f, h, g);
      } catch (m) {
        Y(k);
        if (m !== m + 0) throw m;
        W(1, 0);
      }
    }
    function ud(a, b, c, d) {
      var e = Z();
      try {
        Dd(a, b, c, d);
      } catch (f) {
        Y(e);
        if (f !== f + 0) throw f;
        W(1, 0);
      }
    }
    function sd(a, b, c, d, e, f, h) {
      var g = Z();
      try {
        Gd(a, b, c, d, e, f, h);
      } catch (k) {
        Y(g);
        if (k !== k + 0) throw k;
        W(1, 0);
      }
    }
    function xd(a, b, c, d, e, f) {
      var h = Z();
      try {
        Cd(a, b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function Qc(a, b, c, d, e, f) {
      var h = Z();
      try {
        return Fd(a, b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function od(a, b, c, d, e) {
      var f = Z();
      try {
        Id(a, b, c, d, e);
      } catch (h) {
        Y(f);
        if (h !== h + 0) throw h;
        W(1, 0);
      }
    }
    function Lc(a, b, c, d, e, f, h, g) {
      var k = Z();
      try {
        return Jd(a, b, c, d, e, f, h, g);
      } catch (m) {
        Y(k);
        if (m !== m + 0) throw m;
        W(1, 0);
      }
    }
    function ld(a, b, c, d, e, f) {
      var h = Z();
      try {
        Kd(a, b, c, d, e, f);
      } catch (g) {
        Y(h);
        if (g !== g + 0) throw g;
        W(1, 0);
      }
    }
    function md(a, b, c, d, e, f, h) {
      var g = Z();
      try {
        Nd(a, b, c, d, e, f, h);
      } catch (k) {
        Y(g);
        if (k !== k + 0) throw k;
        W(1, 0);
      }
    }
    function nd(a, b, c, d, e, f, h, g) {
      var k = Z();
      try {
        Od(a, b, c, d, e, f, h, g);
      } catch (m) {
        Y(k);
        if (m !== m + 0) throw m;
        W(1, 0);
      }
    }
    function jd(a, b, c, d, e, f, h, g, k, m, n, u, v) {
      var y = Z();
      try {
        Qd(a, b, c, d, e, f, h, g, k, m, n, u, v);
      } catch (z) {
        Y(y);
        if (z !== z + 0) throw z;
        W(1, 0);
      }
    }
    function kd(a, b, c, d, e, f, h, g, k, m, n, u, v, y, z) {
      var E = Z();
      try {
        Pd(a, b, c, d, e, f, h, g, k, m, n, u, v, y, z);
      } catch (F) {
        Y(E);
        if (F !== F + 0) throw F;
        W(1, 0);
      }
    }
    function Kc(a, b, c, d, e, f, h, g, k, m, n, u) {
      var v = Z();
      try {
        return Rd(a, b, c, d, e, f, h, g, k, m, n, u);
      } catch (y) {
        Y(v);
        if (y !== y + 0) throw y;
        W(1, 0);
      }
    }
    function hd(a, b, c, d, e, f, h, g, k, m, n) {
      var u = Z();
      try {
        Sd(a, b, c, d, e, f, h, g, k, m, n);
      } catch (v) {
        Y(u);
        if (v !== v + 0) throw v;
        W(1, 0);
      }
    }
    function rd(a, b, c, d, e, f, h, g) {
      var k = Z();
      try {
        Td(a, b, c, d, e, f, h, g);
      } catch (m) {
        Y(k);
        if (m !== m + 0) throw m;
        W(1, 0);
      }
    }
    function wd(a, b, c, d, e, f, h, g, k, m) {
      var n = Z();
      try {
        Vd(a, b, c, d, e, f, h, g, k, m);
      } catch (u) {
        Y(n);
        if (u !== u + 0) throw u;
        W(1, 0);
      }
    }
    var Wd;
    D = function Xd() {
      Wd || Yd();
      Wd || (D = Xd);
    };
    function Yd() {
      function a() {
        if (!Wd && ((Wd = !0), (l.calledRun = !0), !ka)) {
          Ea(sa);
          aa(l);
          l.onRuntimeInitialized?.();
          if (l.postRun)
            for ('function' == typeof l.postRun && (l.postRun = [l.postRun]); l.postRun.length; ) {
              var b = l.postRun.shift();
              ta.unshift(b);
            }
          Ea(ta);
        }
      }
      if (!(0 < C)) {
        if (l.preRun) for ('function' == typeof l.preRun && (l.preRun = [l.preRun]); l.preRun.length; ) ua();
        Ea(ra);
        0 < C ||
          (l.setStatus
            ? (l.setStatus('Running...'),
              setTimeout(() => {
                setTimeout(() => l.setStatus(''), 1);
                a();
              }, 1))
            : a());
      }
    }
    if (l.preInit)
      for ('function' == typeof l.preInit && (l.preInit = [l.preInit]); 0 < l.preInit.length; ) l.preInit.pop()();
    Yd();
    moduleRtn = ca;

    return moduleRtn;
  };
})();
export default createDotLottiePlayerModule;
