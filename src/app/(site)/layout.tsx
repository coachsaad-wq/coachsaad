import { Header } from "@/components/marketing/header";
import { Footer } from "@/components/marketing/footer";
import { AssistantWidget } from "@/components/marketing/assistant-widget";
import { CookieConsent } from "@/components/marketing/cookie-consent";
import { getAssistantConfig } from "@/lib/services/assistant";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const assistantConfig = await getAssistantConfig();

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <AssistantWidget config={assistantConfig} />
      <CookieConsent />
    </>
  );
}
