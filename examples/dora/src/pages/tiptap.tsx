import { JSX } from "solid-js";
import ContentEditable from "~/app/Card";
import "virtual:windi.css";

const CONTENT = `
<h2>
Hi there,
</h2>
<p>
this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
<li>
  That’s a bullet list with one …
</li>
<li>
  … or two list items.
</li>
</ul>
<p>
Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
Wow, that’s amazing. Good work, boy! 👏
<br />
— Mom
</blockquote>    
`;

export default function App(): JSX.Element {
  return (
    <div class="w-screen h-screen bg-gradient-to-bl from-sky-400 to-blue-500 flex items-center justify-center">
      <div class="flex-1 m-16">
        <ContentEditable content={CONTENT} />
      </div>
    </div>
  );
}
