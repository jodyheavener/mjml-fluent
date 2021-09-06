/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { FluentBundle, FluentResource } from "@fluent/bundle";
import { negotiateLanguages } from "@fluent/langneg";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { registerComponent } from "mjml-core";
import mjml2html from "mjml";
import MjLocalize, { MjmlLocalization, setLocalizer } from "../lib/mjml-fluent";

// This makes <mj-localize> available as a component.
registerComponent(MjLocalize);

const availableLocales = ["en-US"];
const userLocales = ["en-US"];
const currentLocales = negotiateLanguages(userLocales, availableLocales, {
  defaultLocale: "en-US",
});

createFluentBundleGenerator(join(__dirname, "locales"), currentLocales, [
  "main",
]).then((bundleGenerator) => {
  // Set up the localizer using our bundles
  setLocalizer(new MjmlLocalization(bundleGenerator()));

  // Read the MJML and compile it to HTML
  const data = readFileSync(join(__dirname, "template.mjml"), "utf8");
  const result = mjml2html(data);
  writeFileSync(join(__dirname, "output.html"), result.html);

  console.log("Compiled MJML");
});

// Below is just setting up Fluent, and is unrelated to the component itself

async function fetchMessages(baseDir: string, locale: string, bundle: string) {
  try {
    return readFileSync(join(baseDir, locale, `${bundle}.ftl`), "utf8");
  } catch (e) {
    console.error(e);
    // We couldn't fetch any strings; just return nothing and
    // fluent will fall back to the default locale if needed.
    return "";
  }
}

function fetchAllMessages(
  baseDir: string,
  locale: string,
  bundles: Array<string>
) {
  return Promise.all(
    bundles.map((bundle) => fetchMessages(baseDir, locale, bundle))
  );
}

async function createFluentBundleGenerator(
  baseDir: string,
  currentLocales: Array<string>,
  bundles: Array<string>
) {
  const fetched = await Promise.all(
    currentLocales.map(async (locale) => {
      return { [locale]: await fetchAllMessages(baseDir, locale, bundles) };
    })
  );

  const mergedBundle = fetched.reduce((obj, cur) => Object.assign(obj, cur));

  return function* generateFluentBundles() {
    for (const locale of currentLocales) {
      const cx = new FluentBundle(locale);
      for (const i of mergedBundle[locale]) {
        const resource = new FluentResource(i);
        cx.addResource(resource);
      }
      yield cx;
    }
  };
}
