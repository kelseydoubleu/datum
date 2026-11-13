import sys, io, json, traceback, warnings, base64, linecache
warnings.filterwarnings("ignore")

class CheckFail(Exception):
    pass

_SHELL = {"__name__": "__main__"}
_WS_DB = None
SEED_SQL = ""


def _clean_tb(e):
    tb = traceback.format_exception(type(e), e, e.__traceback__)
    keep = []
    for part in tb:
        if part.startswith("Traceback"):
            keep.append(part)
            continue
        if part.lstrip().startswith("File "):
            if 'File "script.py"' in part or 'File "<shell>"' in part:
                keep.append(part)
            continue
        keep.append(part)
    if len(keep) == 2 and keep[0].startswith("Traceback"):
        keep = keep[1:]
    return "".join(keep)


def _exec(code, ns, fname="script.py"):
    buf = io.StringIO()
    old_out, old_err = sys.stdout, sys.stderr
    sys.stdout = buf
    sys.stderr = buf
    err = None
    linecache.cache[fname] = (len(code), None, [l + "\n" for l in code.splitlines()], fname)
    try:
        exec(compile(code, fname, "exec"), ns)
    except SyntaxError as e:
        err = "".join(traceback.format_exception_only(type(e), e))
    except Exception as e:
        err = _clean_tb(e)
    finally:
        sys.stdout, sys.stderr = old_out, old_err
    return buf.getvalue(), err


def _plt():
    return sys.modules.get("matplotlib.pyplot")


def _mpl_setup():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    plt.show = lambda *a, **k: None
    plt.rcParams["figure.figsize"] = (6.4, 4.2)


def _fignums():
    plt = _plt()
    return list(plt.get_fignums()) if plt else []


def _render(nums):
    plt = _plt()
    out = []
    if not plt:
        return out
    for n in nums:
        f = plt.figure(n)
        b = io.BytesIO()
        f.savefig(b, format="png", dpi=96, bbox_inches="tight", facecolor="white")
        out.append(base64.b64encode(b.getvalue()).decode())
    return out


def _close_all():
    plt = _plt()
    if plt:
        plt.close("all")


def _eq(a, b):
    pd = sys.modules.get("pandas")
    np = sys.modules.get("numpy")
    if pd is not None:
        if isinstance(a, pd.DataFrame) or isinstance(b, pd.DataFrame):
            if not (isinstance(a, pd.DataFrame) and isinstance(b, pd.DataFrame)):
                return False
            try:
                pd.testing.assert_frame_equal(a, b, check_dtype=False)
                return True
            except AssertionError:
                return False
        if isinstance(a, pd.Series) or isinstance(b, pd.Series):
            if not (isinstance(a, pd.Series) and isinstance(b, pd.Series)):
                return False
            try:
                pd.testing.assert_series_equal(a, b, check_dtype=False, check_names=False)
                return True
            except AssertionError:
                return False
        if isinstance(a, pd.Index):
            return isinstance(b, pd.Index) and a.equals(b)
    if np is not None and (isinstance(a, np.ndarray) or isinstance(b, np.ndarray)):
        if not (isinstance(a, np.ndarray) and isinstance(b, np.ndarray)):
            return False
        try:
            if a.shape != b.shape:
                return False
            if a.dtype.kind in "fc" or b.dtype.kind in "fc":
                return bool(np.allclose(a, b, equal_nan=True))
            return bool(np.array_equal(a, b))
        except Exception:
            return False
    if isinstance(a, bool) or isinstance(b, bool):
        return type(a) == type(b) and a == b
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return abs(a - b) < 1e-6 * max(1, abs(b))
    if isinstance(a, (list, tuple)) and isinstance(b, (list, tuple)):
        return type(a) == type(b) and len(a) == len(b) and all(_eq(x, y) for x, y in zip(a, b))
    try:
        r = a == b
        return bool(r) and type(a) == type(b)
    except Exception:
        return False


def run_py(code, pre, mode, sol, check):
    global _SHELL
    _close_all()
    ns = {"__name__": "__main__"}
    _exec(pre, ns, "<pre>")
    out, err = _exec(code, ns)
    _SHELL = ns
    user_nums = _fignums()
    res = {"out": out, "err": err, "figs": [], "ok": None, "msg": ""}
    if mode == "submit":
        if err:
            res["ok"] = False
            res["msg"] = "Your code generated an error. Read the message in the shell, fix it and submit again."
        else:
            S = {"__name__": "__main__"}
            _exec(pre, S, "<pre>")
            sol_out, sol_err = _exec(sol, S, "<sol>")
            sol_nums = [n for n in _fignums() if n not in user_nums]
            plt = _plt()
            U = ns

            def need(cond, msg):
                if not cond:
                    raise CheckFail(msg)

            def has_var(name, msg=None):
                need(name in U, msg or "Did you define the variable `%s`? Check the spelling." % name)

            def eq_var(name, msg=None):
                has_var(name)
                need(_eq(U[name], S[name]), msg or "The value of `%s` isn't quite right. Have another look at the instructions." % name)

            def printed(s, msg):
                need(s in out, msg)

            def out_has_sol(msg=None):
                for line in sol_out.strip().splitlines():
                    line = line.strip()
                    if line:
                        need(line in out, msg or "Your printout doesn't match what we expected. Did you print everything the instructions ask for?")

            def ufigs():
                return [plt.figure(n) for n in user_nums] if plt else []

            def sfigs():
                return [plt.figure(n) for n in sol_nums] if plt else []

            def uax(i=0):
                fs = ufigs()
                need(len(fs) > 0, "We couldn't find a figure. Did you create one with `plt.subplots()`?")
                axs = fs[-1].axes
                need(len(axs) > i, "We couldn't find the Axes we expected. Check the call to `plt.subplots()`.")
                return axs[i]

            env = {"need": need, "has_var": has_var, "eq_var": eq_var, "printed": printed,
                   "out_has_sol": out_has_sol, "U": U, "S": S, "out": out, "sol_out": sol_out,
                   "ufigs": ufigs, "sfigs": sfigs, "uax": uax, "_eq": _eq, "code": code}
            try:
                exec(check, env)
                res["ok"] = True
            except CheckFail as e:
                res["ok"] = False
                res["msg"] = str(e)
            except Exception as e:
                res["ok"] = False
                res["msg"] = "Something isn't right yet. Compare your code with the instructions. (%s)" % type(e).__name__
            if plt:
                for n in sol_nums:
                    plt.close(n)
    res["figs"] = _render(user_nums)
    return json.dumps(res)


def shell(code):
    buf_code = code.strip()
    if not buf_code:
        return json.dumps({"out": "", "err": None, "figs": []})
    before = _fignums()
    try:
        compiled = compile(buf_code, "<shell>", "eval")
        is_expr = True
        linecache.cache["<shell>"] = (len(buf_code), None, [l + "\n" for l in buf_code.splitlines()], "<shell>")
    except SyntaxError:
        is_expr = False
    if is_expr:
        bufo = io.StringIO()
        old_out, old_err = sys.stdout, sys.stderr
        sys.stdout = bufo
        sys.stderr = bufo
        err = None
        try:
            val = eval(compiled, _SHELL)
            if val is not None:
                print(repr(val))
        except Exception as e:
            err = _clean_tb(e)
        finally:
            sys.stdout, sys.stderr = old_out, old_err
        out = bufo.getvalue()
    else:
        out, err = _exec(buf_code, _SHELL, "<shell>")
    after = _fignums()
    figs = _render(after) if after and (after != before or 'plt' in code or 'ax' in code or 'fig' in code) else []
    return json.dumps({"out": out, "err": err, "figs": figs})


def _fresh_db():
    import sqlite3
    db = sqlite3.connect(":memory:")
    db.executescript(SEED_SQL)
    return db


def _q(db, sql):
    cur = db.cursor()
    cur.execute(sql)
    cols = [d[0] for d in cur.description] if cur.description else []
    rows = [list(r) for r in cur.fetchall()] if cur.description else []
    db.commit()
    return cols, rows


def _norm_rows(rows):
    def v(x):
        if isinstance(x, float):
            return round(x, 6)
        return x
    return [[v(x) for x in r] for r in rows]


def run_sql(code, mode, sol, workspace=False):
    global _WS_DB
    if workspace:
        if _WS_DB is None:
            _WS_DB = _fresh_db()
        db = _WS_DB
    else:
        db = _fresh_db()
    res = {"cols": [], "rows": [], "err": None, "ok": None, "msg": "", "count": 0}
    try:
        cols, rows = _q(db, code)
        res["cols"] = cols
        res["count"] = len(rows)
        res["rows"] = rows[:500]
    except Exception as e:
        res["err"] = "%s: %s" % (type(e).__name__, e)
    if mode == "submit":
        if res["err"]:
            res["ok"] = False
            res["msg"] = "Your query generated an error. Check the message below the editor and try again."
        else:
            scols, srows = _q(_fresh_db(), sol)
            ucl = [c.lower() for c in cols]
            scl = [c.lower() for c in scols]
            if len(ucl) != len(scl):
                res["ok"] = False
                res["msg"] = "Your query returned %d column(s), but we expected %d: %s." % (len(ucl), len(scl), ", ".join(scols))
            elif ucl != scl:
                res["ok"] = False
                res["msg"] = "Check your column names and their order. We expected: %s." % ", ".join(scols)
            else:
                u = _norm_rows(rows)
                s = _norm_rows(srows)
                if len(u) != len(s):
                    res["ok"] = False
                    res["msg"] = "Your query returned %d row(s), but we expected %d. Check your filtering." % (len(u), len(s))
                elif "order by" in sol.lower():
                    res["ok"] = u == s
                    if not res["ok"]:
                        same = sorted(map(repr, u)) == sorted(map(repr, s))
                        res["msg"] = "The rows are right, but the order isn't. Check your ORDER BY." if same else "The values in your result don't match what we expected."
                else:
                    res["ok"] = sorted(map(repr, u)) == sorted(map(repr, s))
                    if not res["ok"]:
                        res["msg"] = "The values in your result don't match what we expected."
    return json.dumps(res, default=str)
