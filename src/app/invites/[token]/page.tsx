import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { getCurrentUser } from "@/lib/session";
import { pageTitleStyles, pageWrapperStyles } from "@/styles/common";
import { Link } from "@react-email/components";
import { redirect } from "next/navigation";

export default async function InvitesPage({
  params,
}: {
  params: {
    token: string;
  };
}) {
  const { token } = params;

  if (!token) {
    throw new Error("Invalid invite link");
  }

  const user = await getCurrentUser();

  return (
    <div className={pageWrapperStyles}>
      {!user && (
        <>
          <h1 className={pageTitleStyles}>Processing Invites</h1>
          <p className="max-w-md text-lg">
            Someone sent you an invite, but you need to first login to accept
            it. Click the button below to get started.
          </p>

          <Button asChild>
            <Link
              href={`/sign-in?callbackUrl=${env.HOST_NAME}/invites/${token}`}
            >
              Login to Accept Invite
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}
