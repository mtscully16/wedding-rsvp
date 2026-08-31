import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import "./App.css";

type RSVP = {
  id: string;
  created_at: string;
  name: string;
  attending: boolean;
  bringing_plus_one: boolean | null;
  plus_one_name: string | null;
  bringing_kids: boolean | null;
  number_of_kids: number | null;
  kid_names: string[] | null;
  notes: string | null;
};

function Admin() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setCheckingAuth(false);

      if (session) {
        await loadRsvps();
      }
    }

    checkAuth();
  }, []);

  async function loadRsvps() {
    const { data, error } = await supabase
      .from("RSVPs")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("RSVP data:", data);
    console.log("RSVP error:", error);

    if (error) {
      console.error("Error loading RSVPs:", error);
      setLoadError(error.message);
      setLoading(false);
      return;
    }

    setRsvps(data ?? []);
    setLoading(false);
  }

  const attendingCount = rsvps.filter(
    (rsvp) => rsvp.attending === true
  ).length;

  const declinedCount = rsvps.filter(
    (rsvp) => rsvp.attending === false
  ).length;

  const plusOneCount = rsvps.filter(
    (rsvp) => rsvp.bringing_plus_one === true
  ).length;

  const childCount = rsvps.reduce(
    (total, rsvp) => total + (rsvp.number_of_kids ?? 0),
    0
  );

  if (checkingAuth) {
    return (
      <main className="page">
        <div className="card">
          <p>Checking login...</p>
        </div>
      </main>
    );
  }

  if (!session) {
    window.location.href = "/admin-login";
    return null;
  }

  if (loading) {
    return (
      <main className="page">
        <div className="card">
          <p>Loading RSVPs...</p>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="page">
        <div className="card">
          <h1>Admin Error</h1>
          <p>{loadError}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <h1>Wedding RSVP Admin</h1>

        <div className="admin-stats">
          <div className="stat-card">
            <strong>{rsvps.length}</strong>
            <span>Total Responses</span>
          </div>

          <div className="stat-card">
            <strong>{attendingCount}</strong>
            <span>Attending</span>
          </div>

          <div className="stat-card">
            <strong>{declinedCount}</strong>
            <span>Declined</span>
          </div>

          <div className="stat-card">
            <strong>{plusOneCount}</strong>
            <span>+1s</span>
          </div>

          <div className="stat-card">
            <strong>{childCount}</strong>
            <span>Children</span>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Attending</th>
                <th>+1</th>
                <th>+1 Name</th>
                <th>Children</th>
                <th>Child Names</th>
                <th>Notes</th>
              </tr>
            </thead>

            <tbody>
              {rsvps.map((rsvp) => (
                <tr key={rsvp.id}>
                  <td>{rsvp.name}</td>

                  <td>
                    {rsvp.attending ? "Yes" : "No"}
                  </td>

                  <td>
                    {rsvp.bringing_plus_one ? "Yes" : "No"}
                  </td>

                  <td>
                    {rsvp.plus_one_name ?? "—"}
                  </td>

                  <td>
                    {rsvp.number_of_kids ?? 0}
                  </td>

                  <td>
                    {rsvp.kid_names?.length
                      ? rsvp.kid_names.join(", ")
                      : "—"}
                  </td>

                  <td>
                    {rsvp.notes ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Admin;