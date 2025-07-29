<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content" ref="modalContent">
      <button class="modal-close" @click="close">×</button>
      <table>
        <thead>
          <tr>
            <td colspan="4">
              <label for=""
                ><input
                  type="checkbox"
                  :checked="chkAll === 'Y'"
                  @change="readAll($event)"
                />모두읽음</label
              >
            </td>
          </tr>
        </thead>
        <tbody>
          <div v-if="pushs.length == 0">알림이 없습니다.</div>
          <div v-for="(p, index) in pushs" :key="index">
            <tr>
              <td>{{ p.title }}</td>
              <td>{{ p.body }}</td>
              <td>{{ p.credt }}</td>
              <td>
                <input
                  type="checkbox"
                  v-model="p.chkYn"
                  true-value="Y"
                  false-value="N"
                  @change="readOne(p, $event)"
                />
              </td>
            </tr>
          </div>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";
import { usePushStore } from "@/stores/pushStore";

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const chkAll = ref("N");
    const visible = ref(props.modelValue);
    const pushStore = usePushStore();
    const pushs = computed(() => pushStore.pushList);

    // 닫기
    const close = () => {
      emit("update:modelValue", false);
    };

    const readOne = (push, event) => {
      pushStore.readOne(push);
    };

    const readAll = async (event) => {
      await pushStore.readAll();
      chkAll.value = "N";
    };

    watch(
      () => props.modelValue,
      (newValue) => {
        visible.value = newValue;
      }
    );

    return {
      visible,
      close,
      pushs,
      readOne,
      readAll,
    };
  },
};
</script>
