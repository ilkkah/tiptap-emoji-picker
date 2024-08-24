import { Extension } from "@tiptap/react";
import { SuggestionOptions as NativeSuggestionOption } from "@tiptap/suggestion";
import { EmojiData } from "./types";
import { RenderItemsProps } from "./utils";
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
export declare const EmojiPicker: Extension<EmojiPickerOptions, any>;
export {};
