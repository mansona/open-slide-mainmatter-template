import { modifier } from 'ember-modifier';
import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.js';
import RevealNotes from 'reveal.js/plugin/notes/notes.js';

export default modifier(function reveal(/*element, positional, named*/) {
  let deck = new Reveal({
    plugins: [Markdown, RevealHighlight, RevealNotes],
  });
  deck.initialize({
    transition: 'none',
    backgroundTransition: 'none',
    width: '1280',
    height: '720',
    margin: 0.1,
    center: false,
    hash: true,
    display: 'flex',
    dependencies: [],
  });
});
