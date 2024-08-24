import type { Editor } from "@tiptap/core";
import type {
  SuggestionKeyDownProps,
  SuggestionProps
} from "@tiptap/suggestion";
import tippy, { GetReferenceClientRect, Props } from "tippy.js";
import { EmojiData } from "./types";

type ViewClasses = {
  root?: string;
  emojiContainer?: string;
  emojiChar?: string;
  emojiImage: string;
};

type ViewArgs = {
  classes?: ViewClasses;
  onEmojiSelect?: (
    event: Event,
    data: Pick<SuggestionProps, "range" | "editor"> & { emoji: EmojiData }
  ) => void;
};

export type RenderItemsProps = {
  tippy: Partial<Props>;
  editor: Editor;
  classes: ViewArgs["classes"];
  onEmojiSelected?: ViewArgs["onEmojiSelect"];
};

export const getRenderItems = (args: RenderItemsProps) => {
  /**
   * Maintains the latest list of rendered items,
   * !Note: Should be updated first in every cycle of render
   */
  let currentItems: EmojiData[];

  let component: ReturnType<typeof initNodeView>;
  let popup: any;

  return {
    onStart: (props: SuggestionProps) => {
      // 1. update the current items first
      currentItems = props.items;
      // 2. init the node view
      component = initNodeView(args);
      // 3. init the popup, tippy
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect as GetReferenceClientRect,
        appendTo: () => document.body,
        content: component.root,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
        maxWidth: args.tippy.maxWidth,
        zIndex: args.tippy.zIndex || 2147483647,
        ...args.tippy,
      });
      // 4. render after init is completed
      component.render(props);
    },

    onUpdate(props: SuggestionProps) {
      // 1. update the list of items
      currentItems = props.items;
      // 2. render the items with updated props
      component.render(props);
      // 3. update popup
      popup[0].setProps({
        getReferenceClientRect: props.clientRect,
      });
    },

    onKeyDown(props: SuggestionKeyDownProps) {
      /**
       * Esc are treated as escape from popup
       */
      if (props.event.key === "Escape") {
        popup[0].hide();
        return true;
      }

      /**
       * Close the suggestion is user press `:` and there was only one matching element in list,
       * example `:cool` will filter and show  🆒  in picker popup list,
       * now as soon as user press `:` again close the popup and insert the matching emoji, here 🆒
       * as :cool: is short code for 🆒
       */
      if (props.event.key === ":" && currentItems.length === 1) {
        args.editor
          .chain()
          .deleteRange(props.range)
          .insertEmoji(currentItems[0])
          .run();
        return true;
      }

      return component.onKeyDown?.(props);
    },

    onExit(props: SuggestionProps) {
      popup[0].destroy();
      component.destroy();
    },
  };
};

/**
 * Utility to add event on element and return cancelable token
 * @param element
 * @param event
 * @param listener
 * @returns
 */
const addEvent = (
  element: HTMLElement,
  event: string,
  listener: (event: Event) => void
) => {
  const wrapper = (e: Event) => listener(e);

  element.addEventListener(event, wrapper);

  return {
    destroy: () => {
      element.removeEventListener(event, wrapper);
    },
  };
};

/**
 * Init the view of the item
 * @param args
 * @returns
 */
const initNodeView = (args: ViewArgs) => {
  /**
   * record current render props
   */
  let renderProps: SuggestionProps | null = null;

  /**
   * create the root level element
   */

  const root = document.createElement("div");
  root.classList.add(args.classes?.root || "");

  /**
   * create click event on listener
   */
  const clickBinding = addEvent(root, "click", (event) => {

    if (!renderProps) {
      return;
    }




    let emoji = null;
    const position = Number(((event.target as HTMLElement)?.closest("[data-position]") as HTMLElement)?.dataset?.position);

    if (!Number.isNaN(position)) {
      emoji = renderProps?.items?.[position];
    }


    if (!emoji) {
      return;
    }
 

    if (args?.onEmojiSelect) {
      args.onEmojiSelect?.(event, {
        range: renderProps.range,
        editor: renderProps.editor,
        emoji,
      });
    } else {
      renderProps.editor?.chain?.()?.deleteRange(renderProps.range)?.insertEmoji?.(emoji)?.run?.();
    }
  });

  /**
   * create each emoji element
   */
  const createEmoji = (emoji: EmojiData, index: number) => {
    const emojiContainer = document.createElement("span");
    emojiContainer.classList.add(args.classes?.emojiContainer || "");

    emojiContainer.setAttribute("data-position", `${index}`);

    const isSupported = emoji.isSupported;

    const img = document.createElement("img");
    img.classList.add(args.classes?.emojiImage || "");
    img.setAttribute("src", emoji.url || "");
    img.setAttribute("alt", "Emoji of " + emoji.annotation);
    img.style.display = isSupported ? "none" : "inline-block";

    const char = document.createElement("span");
    img.classList.add(args.classes?.emojiChar || "");

    char.setAttribute("role", "img");
    char.ariaLabel = emoji.annotation;
    char.style.display = isSupported ? "inline-block" : "none";
    char.appendChild(document.createTextNode(emoji.emoji));

    emojiContainer.append(img, char);

    return emojiContainer;
  };

  return {
    root,
    /**
     * render the view with given props
     */
    render(props: SuggestionProps) {
      renderProps = props;

      root.innerHTML = "";

      const emojis = props.items.map((emoji, index) =>
        createEmoji(emoji, index)
      );
      root.append(...emojis);
    },
    /**
     * destroy view
     */
    destroy() {
      renderProps = null;
      clickBinding?.destroy();
      root.remove();
    },

    onKeyDown(props: SuggestionKeyDownProps) {
      // TODO: move between emojis

      return false;
    },
  };
};

export const filterEmoji = (query: string, emojis: EmojiData[]) => {
  const queryModified = query.toLocaleLowerCase();

  let ret = emojis.filter((emoji) => {
    return (
      emoji.emoji === queryModified ||
      emoji.annotation.includes(queryModified) ||
      emoji.shortcodes?.includes?.(queryModified)
    );
  });
  return ret;
};
