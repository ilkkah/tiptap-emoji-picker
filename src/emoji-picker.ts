import { Extension } from "@tiptap/react";

import Suggestion, {
  SuggestionOptions as NativeSuggestionOption
} from "@tiptap/suggestion";
import { EmojiNode } from "@vtechguys/tiptap-emoji-node";


import { isEmojiSupported } from "@vtechguys/tiptap-emoji-node";
import { EmojiData } from "./types";
import { filterEmoji, getRenderItems, RenderItemsProps } from "./utils";


type SuggestionOptions = Pick<NativeSuggestionOption, "char" | "command">;

type Emoji = EmojiData & {
  search?: string;
};

type EmojiPickerOptions = {
  emojis: Emoji[];
  suggestion: SuggestionOptions;
  fetch?: () => Promise<Emoji[]>;
  tippy: RenderItemsProps["tippy"];
  onEmojiSelected?: RenderItemsProps["onEmojiSelected"];
  classes: RenderItemsProps["classes"];
};

const populateEmoji = (emojis: Emoji[]) => {
  emojis.forEach((emoji) => {
    emoji.isSupported = isEmojiSupported(emoji.emoji);
  });

  return emojis;
};

export const EmojiPicker = Extension.create<EmojiPickerOptions>({
  name: "emoji-picker",

  /**
   * Picker needs basic extension for rendering emoji node
   */
  addExtensions() {
    return [EmojiNode];
  },

  addStorage() {
    return {
      emojis: [],
    };
  },

  onCreate() {
    /**
     * storage is initialized with emojis
     */
    this.storage.emojis = populateEmoji(this.options.emojis) || [];

    /**
     * The init didn't provided emojis,
     * thus we will try to fetch from url
     */
    if (this.storage.emojis.length === 0) {
      this.options.fetch?.()?.then((data) => {
        this.storage.emojis = populateEmoji(data);
      });
    }
  },

  addOptions() {
    return {
      tippy: {
        maxWidth: 364,
      },
      emojis: [],
      suggestion: {
        char: ":",
        command: ({ editor, range, props }) => {
          props.command({ editor, range, props });
        },
      },
      classes: {
        root: "emoji-picker__container",
        emojiContainer: "emoji-picker__emoji",
        emojiImage: "emoji-picker__emoji__img",
        emojiChar: "emoji-picker__emoji__char",
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,

        ...this.options.suggestion,

        items: ({ query }) => {
          return filterEmoji(query, this.storage.emojis);
        },

        allowSpaces: false,
        startOfLine: false,

        render: () =>
          getRenderItems({
            tippy: this.options.tippy,
            editor: this.editor,
            onEmojiSelected: this.options.onEmojiSelected,
            classes: this.options.classes,
          }),
      }),
    ];
  },
});
