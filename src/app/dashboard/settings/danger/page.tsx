import { ConfigurationPanel } from "@/components/configuration-panel";
import { DeleteAccountButton } from "./delete-account-button";

export default async function DangerPage() {
  return (
    <ConfigurationPanel variant="destructive" title="Excluir conta">
      <div className="flex flex-col gap-4">
        <div>Você pode excluir sua conta abaixo</div>
        <DeleteAccountButton />
      </div>
    </ConfigurationPanel>
  );
}
