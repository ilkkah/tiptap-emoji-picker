# Emoji Picker

Tiptap extension for Beautiful Emoji picker for your editor.

- Framework agnostic, all you need is tiptap
- Based on Suggestion Extension
- Supports custom Emoji
- Allows you to set your own emoji-database
- Filter and search emoji as you type

Uses [@vteshguys/tiptap-emoji-node](https://www.npmjs.com/package/@vtechguys/tiptap-emoji-node) for emoji schema.


## Usage

```ts





// add in extensions
extension: [
    EmojiPicker.configure({
        /**
         * Array of emojis, this can be provided at time of initialization
         * with a static array of `EmojiData`, you can also add your own custom
         * emojis here.
         * 
         * The library exports a emoji database of 1900+ emojis, you may use that or
         * provide your own database.
         * **/
        emojis,
        /**
         * fetch emojis from from cdn,
         * this is useful in cases where we don't want to bundle emojis database
         * in main bundle and so you load it from a cdn when tiptap instance is created
         */
        fetch: async () => {
          let emojis = [];
          try {
            emojis = await fetch("/cdn/emoji.json").then((res) =>
              res.json()
            );
          } catch (e) {
            console.log(e);
          }
          return emojis;
        },
      }),
      /**
       * These are tippy.js config for the popup, (optional)
       * **/
      tippy: {},
      /**
       * suggestion options to override, (optional)
       * **/
      suggestions: {},
      /**
       * classes to be used for styling emoji in picker
       * 
       * div.root
       *  span.emoji-box
       *    img.emoji-img
       *    span.emoji-char
       * 
       * **/
      classes: {
        // root container
        root: "emoji-picker__container",
        // emoji box
        emojiContainer: "emoji-picker__emoji",
        // fallback image
        emojiImage: "emoji-picker__emoji__img",
        // unicode char emoji
        emojiChar: "emoji-picker__emoji__char",
      }
]
```


Other exported resources
```ts
// basic css for picker
import "@vtechguys/tiptap-emoji-picker/emoji-picker.css";
// emoji json databse, you may choose emojibase.dev for more emojis
// pass this to .configure.emojis
import emojis from "@vtechguys/tiptap-emoji-picker/emoji.json";

```

### Working sample


![file](https://github.com/user-attachments/assets/baed9352-b6a3-481b-8474-b0cdc36856d5)
