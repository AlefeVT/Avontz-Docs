import { BannerUploadForm } from "@/app/dashboard/groups/[groupId]/settings/banner-upload-form";
import { getGroupImageUrl } from "@/app/dashboard/groups/[groupId]/settings/util";
import { GroupVisibilitySwitch } from "@/app/dashboard/groups/[groupId]/settings/visibility-switch";
import { assertAuthenticated } from "@/lib/session";
import { pageTitleStyles } from "@/styles/common";
import { getGroupByIdUseCase } from "@/use-cases/groups";
import Image from "next/image";
import { GroupNameForm } from "./group-name-form";
import { ConfigurationPanel } from "@/components/configuration-panel";
import { GroupDescriptionForm } from "./group-description-form";
import { SocialLinksForm } from "./social-links-form";

export default async function Settings({
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
      <h1 className={`${pageTitleStyles} text-center md:text-left`}>
      Configurações de grupo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ConfigurationPanel title={"Imagem do grupo"}>
          <div className="flex flex-col gap-8">
            <Image
              src={getGroupImageUrl(group)}
              width={200}
              height={200}
              className="w-full h-[100px] object-cover"
              alt="image of the group"
            />
            <p className="dark:text-gray-400 text-sm">
            Faça upload de uma imagem de grupo para destacar seu grupo.
            </p>
            <BannerUploadForm groupId={group.id} />
          </div>
        </ConfigurationPanel>

        <ConfigurationPanel title={"Nome do grupo"}>
          <GroupNameForm groupId={group.id} groupName={group?.name ?? ""} />
        </ConfigurationPanel>

        <ConfigurationPanel title={"Visibilidade do grupo"}>
          <div className="flex flex-col gap-8">
            <p className="dark:text-gray-400 text-sm">
            Os grupos são privados por padrão. Se você quiser pessoas aleatórias no
              internet para encontrar e ingressar no seu grupo sem convite, mude
              isso em diante.
            </p>
            <GroupVisibilitySwitch group={group} />
          </div>
        </ConfigurationPanel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ConfigurationPanel title={"Descrição do grupo"}>
          <GroupDescriptionForm
            groupId={group.id}
            description={group?.description ?? ""}
          />
        </ConfigurationPanel>

        <ConfigurationPanel title={"Social Links"}>
          <SocialLinksForm group={group} />
        </ConfigurationPanel>
      </div>
    </div>
  );
}
