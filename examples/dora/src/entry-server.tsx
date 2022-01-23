import { renderToStream, renderToStringAsync } from "solid-js/web";
import { StartServer, createHandler, RequestContext, serverModules } from "solid-start/components";

export const renderPage = () => {
  return async ({ request, manifest, headers, context = {} }: RequestContext) => {
    // streaming
    // const { readable, writable } = new TransformStream();
    const str = await renderToStringAsync(() => (
      <StartServer context={context} url={request.url} manifest={manifest} />
    ));

    headers.set("Content-Type", "text/html");

    return new Response(str, {
      status: 200,
      headers
    });
  };
};

export default createHandler(serverModules, renderPage);
