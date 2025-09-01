import React, { useEffect, useState } from "react";
import { fetchSettings, updateSettings } from "../api";

function Settings() {
  const [settings, setSettings] = useState({
    theme: "light",
    notifications_enabled: true,
    preferences: {},
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const save = async (e) => {
    e.preventDefault();
    setStatus("Saving...");
    await updateSettings(settings);
    setStatus("Preferences updated.");
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <form className="settings-form" onSubmit={save}>
      <h2>Settings</h2>
      <label>
        Theme: &nbsp;
        <select name="theme" value={settings.theme} onChange={handleChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <label>
        <input
          name="notifications_enabled"
          type="checkbox"
          checked={!!settings.notifications_enabled}
          onChange={handleChange}
        />
        Enable Notifications
      </label>
      <button type="submit">Save</button>
      {status && <div className="info">{status}</div>}
    </form>
  );
}

export default Settings;
