import { assertAuthenticated } from "@/lib/session";
import { pageTitleStyles } from "@/styles/common";
import { getGroupByIdUseCase } from "@/use-cases/groups";
import { ConfigurationPanel } from "@/components/configuration-panel";
import { DeleteGroupButton } from "./delete-group-button";

export default async function DangerTab({
  params,
}: {
  params: { groupId: string };
}) {
  const user = await assertAuthenticated();
  const group = await getGroupByIdUseCase(user, parseInt(params.groupId));

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className={pageTitleStyles}>Perigo</h1>

      <div className="grid grid-cols-2 gap-8">
        <ConfigurationPanel variant="destructive" title={"Excluir este grupo"}>
          <div className="flex flex-col gap-8">
            <p className="dark:text-gray-400">
            Exclua este grupo e todos os seus dados.
            </p>
            <DeleteGroupButton />
          </div>
        </ConfigurationPanel>
      </div>
    </div>
  );
}
