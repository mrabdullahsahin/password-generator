import Generator from "@/components/generator/Generator";
import es from "@/i18n/messages/es.json";
import { I18nProvider } from "@/i18n/I18nProvider";

export default function HomeES() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <I18nProvider messages={es}>
        <Generator />
      </I18nProvider>
    </div>
  );
}


