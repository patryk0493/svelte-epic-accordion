<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import AccordionSection from "./AccordionSection.svelte";
  import type { Context } from "../contracts/model.type";
  import { accordion } from "../actions/accordion.action";
  import { parentResizeObserver } from "../actions/parent-size-observer.action";
  import { CONTEXT_KEY } from "../utils/context-key";
  import { createSectionsWritable } from "../utils/create-sections-writable";

  const parentHeight = writable<number>(0);
  const sections = createSectionsWritable();

  setContext<Context>(CONTEXT_KEY, { sections });
</script>

<main
  data-testid="accordion"
  use:accordion={{ parentHeight, sections }}
  use:parentResizeObserver={{ parentHeight }}
  {...$$restProps}
>
  <slot Section={AccordionSection} />
</main>

<style>
  main {
    color: white;
  }
</style>
