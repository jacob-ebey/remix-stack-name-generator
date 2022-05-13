import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import type {
  Element,
  Node,
} from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const wikiResponse = await fetch(
  "https://en.wikipedia.org/wiki/List_of_music_genres_and_styles"
);
const wikiHtml = await wikiResponse.text();

const document = new DOMParser().parseFromString(wikiHtml, "text/html");

if (!document) {
  console.error("Could not parse wikipedia response");
  Deno.exit(1);
}

function isDoneIteratingBody(node: Node | null | undefined) {
  if (!node) return false;
  if (node.nodeName !== "H2") return true;
  const text = node.textContent.trim();
  return text !== "Other[edit]";
}

const generes: string[] = [];
function parseListItem(li: Node) {
  if (li?.nodeName !== "LI") return;
  const text = li.firstChild.textContent.trim();
  // filter out blanks and unwanted items
  if (text && !text.toLowerCase().includes("nazi")) generes.push(text);
}

for (
  let node = document.getElementById("toc")?.nextSibling;
  isDoneIteratingBody(node);
  node = node?.nextSibling
) {
  const element = node as Element;
  if (!node || !element.querySelectorAll) continue;
  for (const li of element.querySelectorAll("li")) {
    parseListItem(li);
  }
}

const js = String.raw;
await Deno.writeTextFile(
  "./src/genres.ts",
  js`
export default ${JSON.stringify(generes, null, 2).replace(`"\n]`, `",\n]`)};
`.trimStart()
);

console.log(
  `Wrote ${generes.length} genres to ${await Deno.realPath("./src/genres.ts")}`
);
