import { EmojiNodeData } from "@vtechguys/tiptap-emoji-node";

export type EmojiData = EmojiNodeData & {
  /**
   * short codes for searching the emoji :squared_cool: may be short code for `🆒` emoji
   */
  shortcodes?: string[];

  /**
   * ! Internal type
   */
  isSupported?: boolean;
};
