import { useState }         from "react";
import { useTheme }         from "@context/ThemeContext";
import { useNotifications } from "@context/NotificationContext";
import { ChartCard, Badge, Modal } from "@components/common";
import { MOCK_USERS } from "@constants/mockData";
import { ROLE_COLORS } from "@constants/roles";

export default function UserManagement() {
  const { dark }  = useTheme();
  const { toast } = useNotifications();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal,  setModal]  = useState(false);

  const text   = dark ? "#f1f5f9" : "#0f172a";
  const muted  = dark ? "#64748b" : "#94a3b8";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const inputBg = dark ? "#1e293b" : "#f8fafc";

  const all = [...MOCK_USERS, ...MOCK_USERS.map((u, i) => ({ ...u, id: 10 + i, name: u.name + " (demo)", email: `u${i}@x.io` }))];
  const shown = all.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || u.role === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ padding: 24, fontFamily: "'Outfit',sans-serif" }}>
      <ChartCard title="User Management"
        action={
          <button onClick={() => setModal(true)} style={{ padding: "7px 16px", borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
            + Add User
          </button>
        }>
        {/* Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users…"
            style={{ flex: 1, minWidth: 200, padding: "8px 12px", borderRadius: 9, border: `1px solid ${border}`, background: inputBg, color: text, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
          {["all", "admin", "teacher", "student", "parent"].map((r) => (
            <button key={r} onClick={() => setFilter(r)}
              style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${border}`, background: filter === r ? "#6366f1" : "transparent", color: filter === r ? "#fff" : muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
              {r === "all" ? "All Roles" : r}
            </button>
          ))}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${border}` }}>
                {["User", "Email", "Role", "Phone", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((u) => (
                <tr key={u.id} style={{ borderBottom: `1px solid ${border}` }}>
                  <td style={{ padding: "12px", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: `${ROLE_COLORS[u.role] ?? "#6366f1"}30`, display: "flex", alignItems: "center", justifyContent: "center", color: ROLE_COLORS[u.role] ?? "#6366f1", fontWeight: 700, fontSize: 12 }}>{u.avatar}</div>
                    <span style={{ color: text, fontSize: 14, fontWeight: 500, fontFamily: "inherit" }}>{u.name}</span>
                  </td>
                  <td style={{ padding: "12px", color: muted, fontSize: 13 }}>{u.email}</td>
                  <td style={{ padding: "12px" }}><Badge status={u.role} color={ROLE_COLORS[u.role]} /></td>
                  <td style={{ padding: "12px", color: muted, fontSize: 13 }}>{u.phone ?? "—"}</td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => toast(`Editing ${u.name}`, "info")} style={{ padding: "4px 10px", borderRadius: 6, background: "#6366f115", border: "none", color: "#6366f1", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                      <button onClick={() => toast(`Deleting ${u.name}`, "error")} style={{ padding: "4px 10px", borderRadius: 6, background: "#f43f5e15", border: "none", color: "#f43f5e", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <Modal open={modal} onClose={() => setModal(false)} title="Add New User">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {["Full Name", "Email", "Phone"].map((f) => (
            <div key={f}>
              <label style={{ display: "block", color: muted, fontSize: 11, fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>{f}</label>
              <input placeholder={`Enter ${f.toLowerCase()}`} style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: `1px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
          ))}
          <div>
            <label style={{ display: "block", color: muted, fontSize: 11, fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Role</label>
            <select style={{ width: "100%", padding: "10px 13px", borderRadius: 9, border: `1px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", fontFamily: "inherit" }}>
              <option>Student</option><option>Teacher</option><option>Parent</option><option>Admin</option>
            </select>
          </div>
          <button onClick={() => { toast("User created successfully!", "success"); setModal(false); }}
            style={{ padding: 12, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", fontSize: 15, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
            Create User
          </button>
        </div>
      </Modal>
    </div>
  );
}
