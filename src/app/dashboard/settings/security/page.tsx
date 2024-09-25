import { ConfigurationPanel } from "@/components/configuration-panel";
import { LogoutButton } from "./logout-button";

export default async function SecurityPage() {
  return (
    <ConfigurationPanel title="Sessões">
      <div className="flex flex-col gap-4">
        <p>
        Se você estiver conectado em vários dispositivos, poderá forçar o logout em todos
        deles.
        </p>

        <div className="w-fit">
          <LogoutButton />
        </div>
      </div>
    </ConfigurationPanel>
  );
}
