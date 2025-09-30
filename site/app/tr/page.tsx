import Generator from "@/components/generator/Generator";
import tr from "@/i18n/messages/tr.json";
import { I18nProvider } from "@/i18n/I18nProvider";

export default function HomeTR() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <I18nProvider messages={tr}>
        <Generator />
      </I18nProvider>
    </div>
  );
}


