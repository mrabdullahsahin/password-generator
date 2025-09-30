"use client";

import { useMemo, useState } from "react";
import { generateRandomPassword, type PasswordOptions } from "@/features/generator/core/random";
import { generatePassphrase } from "@/features/generator/core/passphrase";
import { generatePin } from "@/features/generator/core/pin";
import { estimateEntropyBitsFromOptions } from "@/features/generator/strength/entropy";
import type { PolicySettings } from "@/features/generator/policy/policy-engine";
import PolicyWarnings from "./PolicyWarnings";
import StrengthMeter from "./StrengthMeter";
import OutputCard from "./OutputCard";
import Presets from "./Presets";
import { useT } from "@/i18n/I18nProvider";

type TabKey = "random" | "passphrase" | "pin";

export default function Generator() {
  const t = useT();
  const [tab, setTab] = useState<TabKey>("random");

  // Random password state
  const [pwOpts, setPwOpts] = useState<PasswordOptions>({
    length: 16,
    useLowercase: true,
    useUppercase: true,
    useDigits: true,
    useSymbols: false,
    excludeLookAlikes: true,
    requireEachEnabledClass: true,
  });
  const [password, setPassword] = useState<string>("");
  const [policy, setPolicy] = useState<PolicySettings>({
    warnOnRepeats: true,
    warnOnSequences: true,
    warnOnKeyboardRuns: true,
  });

  // Passphrase state (temporary English seed words)
  const seedWords = useMemo(() => defaultSeedWords, []);
  const [passphrase, setPassphrase] = useState<string>("");
  const [ppCount, setPpCount] = useState(4);
  const [ppSep, setPpSep] = useState("-");
  const [ppCap, setPpCap] = useState(true);
  const [ppNoDup, setPpNoDup] = useState(true);

  // PIN state
  const [pinLen, setPinLen] = useState(6);
  const [pin, setPin] = useState("");

  const entropyBits = useMemo(() => estimateEntropyBitsFromOptions(pwOpts), [pwOpts]);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">{t("generator.title")}</h1>
      <div className="flex gap-2">
        <button className={btnCls(tab === "random")} onClick={() => setTab("random")}>{t("tabs.random")}</button>
        <button className={btnCls(tab === "passphrase")} onClick={() => setTab("passphrase")}>{t("tabs.passphrase")}</button>
        <button className={btnCls(tab === "pin")} onClick={() => setTab("pin")}>{t("tabs.pin")}</button>
      </div>

      {tab === "random" && (
        <section className="space-y-4">
          <OutputCard value={password} ariaLabel="Generated password" />
          <div className="text-sm text-neutral-600">{t("entropy.label")} ≈ {entropyBits.toFixed(1)} bits</div>
          {password && <StrengthMeter value={password} />}
          {password && (
            <PolicyWarnings value={password} settings={policy} />
          )}

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2">{t("labels.length")}
              <input type="number" min={4} max={128} value={pwOpts.length}
                     onChange={(e) => setPwOpts({ ...pwOpts, length: Number(e.target.value) })}
                     className="border rounded px-2 py-1 w-20" />
            </label>
            <div className="col-span-2 grid grid-cols-3 gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={policy.warnOnRepeats}
                       onChange={(e) => setPolicy({ ...policy, warnOnRepeats: e.target.checked })} /> {t("policy.repeats")}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={policy.warnOnSequences}
                       onChange={(e) => setPolicy({ ...policy, warnOnSequences: e.target.checked })} /> {t("policy.sequences")}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={policy.warnOnKeyboardRuns}
                       onChange={(e) => setPolicy({ ...policy, warnOnKeyboardRuns: e.target.checked })} /> {t("policy.keyboardRuns")}
              </label>
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={pwOpts.useSymbols}
                     onChange={(e) => setPwOpts({ ...pwOpts, useSymbols: e.target.checked })} /> {t("labels.symbols")}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={pwOpts.useUppercase}
                     onChange={(e) => setPwOpts({ ...pwOpts, useUppercase: e.target.checked })} /> {t("labels.uppercase")}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={pwOpts.useLowercase}
                     onChange={(e) => setPwOpts({ ...pwOpts, useLowercase: e.target.checked })} /> {t("labels.lowercase")}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={pwOpts.useDigits}
                     onChange={(e) => setPwOpts({ ...pwOpts, useDigits: e.target.checked })} /> {t("labels.digits")}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={pwOpts.excludeLookAlikes}
                     onChange={(e) => setPwOpts({ ...pwOpts, excludeLookAlikes: e.target.checked })} /> {t("labels.excludeLookAlikes")}
            </label>
            <div className="col-span-2">
              <Presets value={pwOpts} onChange={setPwOpts} />
            </div>
          </div>

          <div className="flex gap-2">
            <button className={primaryBtnCls()} onClick={() => setPassword(generateRandomPassword(pwOpts))}>{t("actions.generate")}</button>
            <button className={secondaryBtnCls()} onClick={() => navigator.clipboard.writeText(password)} disabled={!password}>{t("actions.copy")}</button>
          </div>
        </section>
      )}

      {tab === "passphrase" && (
        <section className="space-y-4">
          <div className="p-4 border rounded-md">
            <span className="font-mono text-lg break-all">{passphrase || "…"}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2">{t("labels.words")}
              <input type="number" min={3} max={8} value={ppCount}
                     onChange={(e) => setPpCount(Number(e.target.value))}
                     className="border rounded px-2 py-1 w-20" />
            </label>
            <label className="flex items-center gap-2">{t("labels.separator")}
              <input type="text" value={ppSep}
                     onChange={(e) => setPpSep(e.target.value)}
                     className="border rounded px-2 py-1 w-20" />
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={ppCap} onChange={(e) => setPpCap(e.target.checked)} /> {t("labels.capitalize")}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={ppNoDup} onChange={(e) => setPpNoDup(e.target.checked)} /> {t("labels.avoidDuplicates")}
            </label>
          </div>
          <div className="flex gap-2">
            <button className={primaryBtnCls()} onClick={() => setPassphrase(generatePassphrase({ words: seedWords, wordCount: ppCount, separator: ppSep, capitalizeWords: ppCap, avoidDuplicates: ppNoDup, numericOrSymbolSuffix: null }))}>{t("actions.generate")}</button>
            <button className={secondaryBtnCls()} onClick={() => navigator.clipboard.writeText(passphrase)} disabled={!passphrase}>{t("actions.copy")}</button>
          </div>
        </section>
      )}

      {tab === "pin" && (
        <section className="space-y-4">
          <div className="p-4 border rounded-md">
            <span className="font-mono text-lg">{pin || "…"}</span>
          </div>
          <label className="flex items-center gap-2">{t("labels.length")}
            <input type="number" min={3} max={12} value={pinLen}
                   onChange={(e) => setPinLen(Number(e.target.value))}
                   className="border rounded px-2 py-1 w-20" />
          </label>
          <div className="flex gap-2">
            <button className={primaryBtnCls()} onClick={() => setPin(generatePin(pinLen))}>{t("actions.generate")}</button>
            <button className={secondaryBtnCls()} onClick={() => navigator.clipboard.writeText(pin)} disabled={!pin}>{t("actions.copy")}</button>
          </div>
        </section>
      )}
    </div>
  );
}

function btnCls(active: boolean): string {
  return `px-3 py-1 rounded border ${active ? "bg-black text-white" : "bg-white hover:bg-neutral-50"}`;
}
function primaryBtnCls(): string {
  return "px-3 py-1 rounded bg-black text-white hover:bg-neutral-800";
}
function secondaryBtnCls(): string {
  return "px-3 py-1 rounded border bg-white hover:bg-neutral-50";
}

// Temporary EN seed words for passphrase (>=256 words recommended)
const defaultSeedWords = [
  "apple","river","mountain","cloud","silver","forest","ocean","stone","candle","bridge","planet","thunder","autumn","breeze","shadow","ember","meadow","harbor","galaxy","prairie","island","valley","beacon","crystal","echo","falcon","granite","horizon","ivory","jungle","kelp","lantern","meteor","nectar","onyx","pebble","quartz","reef","saffron","tundra","umber","violet","willow","xenon","yonder","zephyr",
  "acorn","blossom","compass","drift","ember","flint","glacier","harvest","ink","jasper","kestrel","lagoon","moss","nimbus","orchid","petal","quiver","raven","sage","talc","ultra","vesper","whisper","yarrow","zest",
  "amber","brook","cobalt","dune","ember","fable","grove","harp","iris","joule","knoll","lilac","maple","nectar","omega","pearl","quill","ripple","spruce","terra","umber","verve","wheat","yoke","zinc",
  "alpine","bamboo","cedar","delta","embers","fjord","gale","haven","indigo","jade","kepler","lotus","marble","nebula","opal","poppy","quasar","rivera","sierra","topaz","urban","vortex","walnut","yeti","zen",
  "atom","bolt","cinder","dawn","emberly","flare","glisten","halo","ion","jigsaw","keystone","lumen","magma","nadir","orbit","prism","quanta","rippled","solace","titan","umbra","vivid","wander","yodel","zenith"
];


