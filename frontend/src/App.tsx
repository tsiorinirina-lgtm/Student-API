import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import "./App.css";

type User = { id: number; username: string; email: string };
type Student = {
  std?: number;
  id?: number;
  first_name: string;
  last_name: string;
  student_year: number;
  email: string;
  phone_number: string;
};
type Stats = {
  total: number;
  average_year: number | null;
  by_year: Array<{ student_year: number; count: number }>;
};

const API_URL = import.meta.env.VITE_API_URL ?? "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("student-api-token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(body.error ?? "Something went wrong. Please try again.");
  return body;
}

function App() {
  const [user, setUser] = useState<User | null>(() =>
    JSON.parse(localStorage.getItem("student-api-user") ?? "null"),
  );
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(user !== null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    Promise.all([
      request<{ data: Student[] }>("/students"),
      request<{ data: Stats }>("/students/stats"),
    ])
      .then(([studentsResponse, statsResponse]) => {
        setStudents(studentsResponse.data);
        setStats(statsResponse.data);
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, [user]);

  const submitAuth = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await request<{ data: User; token: string }>(
        isRegistering ? "/auth/register" : "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(
            isRegistering
              ? form
              : { email: form.email, password: form.password },
          ),
        },
      );
      localStorage.setItem("student-api-token", response.token);
      localStorage.setItem("student-api-user", JSON.stringify(response.data));
      setUser(response.data);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to connect to the API.",
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("student-api-token");
    localStorage.removeItem("student-api-user");
    setUser(null);
    setStats(null);
    setStudents([]);
  };

  if (!user)
    return (
      <main className="auth-shell">
        <section className="auth-intro">
          <span className="eyebrow">STUDENT API / 01</span>
          <h1>
            Make student data feel <em>clear.</em>
          </h1>
          <p>
            A focused workspace for the people, records, and patterns behind
            your institution.
          </p>
          <div className="signal">
            <span className="signal-dot" /> API connection ready
          </div>
        </section>
        <section className="auth-panel">
          <div className="brand-mark">
            S<span>/</span>A
          </div>
          <div className="panel-copy">
            <span className="eyebrow">
              {isRegistering ? "Create account" : "Welcome back"}
            </span>
            <h2>
              {isRegistering
                ? "Start your workspace."
                : "Your students, at a glance."}
            </h2>
            <p>
              {isRegistering
                ? "Set up your account to access the dashboard."
                : "Sign in to continue to your student directory."}
            </p>
          </div>
          <form onSubmit={submitAuth}>
            {isRegistering && (
              <label>
                Username
                <input
                  required
                  value={form.username}
                  onChange={(event) =>
                    setForm({ ...form, username: event.target.value })
                  }
                  placeholder="e.g. amina.rahman"
                />
              </label>
            )}
            <label>
              Email address
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="you@institution.edu"
              />
            </label>
            <label>
              Password
              <input
                required
                minLength={6}
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                placeholder="At least 6 characters"
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button className="primary-button" disabled={loading}>
              {loading
                ? "Connecting..."
                : isRegistering
                  ? "Create account"
                  : "Sign in"}{" "}
              <span>→</span>
            </button>
          </form>
          <p className="switch-copy">
            {isRegistering
              ? "Already have an account?"
              : "New to the workspace?"}{" "}
            <button
              className="text-button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
              }}
            >
              {isRegistering ? "Sign in" : "Register"}
            </button>
          </p>
        </section>
      </main>
    );

  return (
    <main className="dashboard">
      <header className="topbar">
        <div className="brand-mark">
          S<span>/</span>A
        </div>
        <div className="topbar-right">
          <span className="api-status">
            <i /> Live API
          </span>
          <span className="user-name">{user.username}</span>
          <button className="logout" onClick={logout}>
            Log out
          </button>
        </div>
      </header>
      <section className="dashboard-content">
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">
              Overview /{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <h1>Good to see you, {user.username}.</h1>
            <p>Here is what is happening across your student directory.</p>
          </div>
          <button
            className="refresh"
            onClick={() => {
              setLoading(true);
              setUser({ ...user });
            }}
            aria-label="Refresh dashboard"
          >
            ↻ Refresh
          </button>
        </div>
        {error && <div className="notice">{error}</div>}
        <div className="stat-grid">
          <article>
            <span>Total students</span>
            <strong>{stats?.total ?? "—"}</strong>
            <small>Across all years</small>
          </article>
          <article>
            <span>Average year</span>
            <strong>{stats?.average_year?.toFixed(1) ?? "—"}</strong>
            <small>Current student average</small>
          </article>
          <article>
            <span>Directory status</span>
            <strong className="status-value">
              ● {loading ? "Syncing" : "Live"}
            </strong>
            <small>Connected to the API</small>
          </article>
        </div>
        <section className="directory">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Records</span>
              <h2>Student directory</h2>
            </div>
            <span className="record-count">{students.length} records</span>
          </div>
          {loading ? (
            <div className="empty-state">Loading your directory...</div>
          ) : students.length === 0 ? (
            <div className="empty-state">No student records found yet.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Year</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id ?? student.std}>
                      <td>
                        <span className="avatar">
                          {student.first_name[0]}
                          {student.last_name[0]}
                        </span>
                        <b>
                          {student.first_name} {student.last_name}
                        </b>
                      </td>
                      <td>{student.email}</td>
                      <td>
                        <span className="year-tag">
                          Year {student.student_year}
                        </span>
                      </td>
                      <td>{student.phone_number || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
