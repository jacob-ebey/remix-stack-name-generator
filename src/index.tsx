import { h } from "preact";
import { renderToString } from "preact-render-to-string";

import genres from "./genres";

export default {
  fetch(request: Request): Response {
    const genre = genres[Math.floor(Math.random() * genres.length)];
    const genreSlug = slugify(genre.replace(/\smusic/, ""));

    if (request.headers.get("Accept")?.includes("json")) {
      return new Response(JSON.stringify({ name: genre, slug: genreSlug }));
    }

    return new Response(renderToString(h(Document, { genre, genreSlug })), {
      headers: { "Content-Type": "text/html" },
    });
  },
};

function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  const to = "aaaaeeeeiiiioooouuuunc------";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
}

function Document({ genre, genreSlug }: { genre: string; genreSlug: string }) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <title>Remix Stack Name Generator</title>
        <meta
          name="description"
          content="A simple Remix stack name generator."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/@exampledev/new.css@1.1.3/new.css"
        />
        <link
          rel="icon"
          href="https://raw.githubusercontent.com/remix-run/remix/583953a/templates/remix/public/favicon.ico"
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@ebey_jacob" />
        <meta
          property="og:url"
          content="https://remix-stack-name-generator.jacob-ebey.workers.dev/"
        />
        <meta property="og:title" content="Remix Stack Name Generator" />
        <meta
          property="og:description"
          content="A simple Remix stack name generator."
        />
        <meta
          property="og:image"
          content="https://elaborate-crumble-874853.netlify.app/1200x627%20-%20Glowing.png"
        />
        <meta
          property="twitter:image"
          content="https://elaborate-crumble-874853.netlify.app/1200x627%20-%20Glowing.png"
        />
      </head>
      <body>
        <main>
          <article>
            <h1>Remix Stack Name Generator</h1>
            <p>
              How about the <code>{genreSlug}-stack</code>?
            </p>
            <form>
              <button type="submit">Try again</button>
            </form>
            <p>
              Learn more about {genre} on{" "}
              <a
                href={`https://wikipedia.org/wiki/${genre}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Wikipedia
              </a>
            </p>
            <h2>API</h2>
            <p>
              You can send this page a GET request with the header{" "}
              <code>Accept: application/json</code> to recieve the response
              format of:
            </p>
            <pre>
              <code
                dangerouslySetInnerHTML={{
                  __html: `{
  "name": "St. Louis blues",
  "slug": "st-louis-blues"
}`,
                }}
              />
            </pre>
          </article>
          <footer>
            <a
              href="https://github.com/jacob-ebey/remix-stack-name-generator/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source code
            </a>
          </footer>
        </main>
      </body>
    </html>
  );
}
