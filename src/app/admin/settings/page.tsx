import { getSiteSettings, updateSiteSetting } from "../actions/settings";
import SettingsManager from "./SettingsManager";

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  async function handleUpdate(key: string, value: string) {
    "use server";
    await updateSiteSetting(key, value);
  }

  return (
    <div className="max-w-3xl">
      <SettingsManager settings={settings} onUpdate={handleUpdate} />
    </div>
  );
}
