import type { Editor } from "@tiptap/core";
import type { SuggestionKeyDownProps, SuggestionProps } from "@tiptap/suggestion";
import { Props } from "tippy.js";
import { EmojiData } from "./types";
type ViewClasses = {
    root?: string;
    emojiContainer?: string;
    emojiChar?: string;
    emojiImage: string;
};
type ViewArgs = {
    classes?: ViewClasses;
    onEmojiSelect?: (event: Event, data: Pick<SuggestionProps, "range" | "editor"> & {
        emoji: EmojiData;
    }) => void;
};
export type RenderItemsProps = {
    tippy: Partial<Props>;
    editor: Editor;
    classes: ViewArgs["classes"];
    onEmojiSelected?: ViewArgs["onEmojiSelect"];
};
export declare const getRenderItems: (args: RenderItemsProps) => {
    onStart: (props: SuggestionProps) => void;
    onUpdate(props: SuggestionProps): void;
    onKeyDown(props: SuggestionKeyDownProps): boolean;
    onExit(props: SuggestionProps): void;
};
export declare const filterEmoji: (query: string, emojis: EmojiData[]) => EmojiData[];
export {};
