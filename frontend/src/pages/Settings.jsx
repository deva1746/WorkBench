import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();

  return (
    <>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your profile and preferences.</p>
      </div>

      <div className="glass" style={{ padding: "1.5rem" }}>
        <h3 style={{ marginBottom: "1rem" }}>
          Profile Information
        </h3>

        <div style={{ marginBottom: "1rem" }}>
          <strong>Name:</strong>
          <p>{user?.full_name}</p>
        </div>

        <div>
          <strong>Email:</strong>
          <p>{user?.email}</p>
        </div>
      </div>
    </>
  );
}