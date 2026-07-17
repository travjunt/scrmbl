import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type PropType,
  type VNode,
} from "vue";
import { ScrambleController } from "../lib/controller";
import type { ResolveOrder, ScrambleOptions } from "../lib/types";

function textFromVNodes(nodes: VNode[] | undefined): string {
  if (!nodes) return "";
  return nodes
    .map((n) => {
      if (typeof n.children === "string") return n.children;
      if (Array.isArray(n.children)) return textFromVNodes(n.children as VNode[]);
      return "";
    })
    .join("");
}

/**
 * Vue component. Use the `text` prop (preferred) or a plain-text default slot:
 *
 * ```vue
 * <Scramble :text="title" charset="upper" order="random" />
 * ```
 */
export const Scramble = defineComponent({
  name: "Scramble",
  props: {
    text: { type: String, default: undefined },
    as: { type: String, default: "span" },
    autoStart: { type: Boolean, default: true },
    duration: { type: Number, default: undefined },
    stagger: { type: Number, default: undefined },
    order: { type: String as PropType<ResolveOrder>, default: undefined },
    charset: { type: String, default: undefined },
    glyphRate: { type: Number, default: undefined },
    ignore: { type: String, default: undefined },
    scrambleAll: { type: Boolean, default: undefined },
    sweep: { type: Boolean, default: undefined },
    seed: { type: Number, default: undefined },
    respectReducedMotion: { type: Boolean, default: undefined },
  },
  emits: ["start", "complete"],
  setup(props, { slots, emit, expose }) {
    const el = ref<HTMLElement | null>(null);
    const controller = new ScrambleController();

    const options = (): ScrambleOptions => {
      const o: ScrambleOptions = {
        onStart: () => emit("start"),
        onComplete: () => emit("complete"),
      };
      if (props.duration !== undefined) o.duration = props.duration;
      if (props.stagger !== undefined) o.stagger = props.stagger;
      if (props.order !== undefined) o.order = props.order;
      if (props.charset !== undefined) o.charset = props.charset;
      if (props.glyphRate !== undefined) o.glyphRate = props.glyphRate;
      if (props.ignore !== undefined) o.ignore = props.ignore;
      if (props.scrambleAll !== undefined) o.scrambleAll = props.scrambleAll;
      if (props.sweep !== undefined) o.sweep = props.sweep;
      if (props.seed !== undefined) o.seed = props.seed;
      if (props.respectReducedMotion !== undefined)
        o.respectReducedMotion = props.respectReducedMotion;
      return o;
    };

    const target = () => props.text ?? textFromVNodes(slots.default?.());

    onMounted(() => {
      if (!el.value) return;
      controller.attach(el.value, options());
      if (props.autoStart) controller.replay();
    });

    watch(target, (text) => {
      controller.setOptions(options());
      if (text !== controller.text) controller.update(text);
    });

    onBeforeUnmount(() => controller.destroy());

    expose({
      replay: () => controller.setOptions(options()).replay(),
      controller,
    });

    return () => h(props.as, { ref: el }, target());
  },
});
