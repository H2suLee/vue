<template>
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div
      class="modal-content"
      ref="modalContent"
      @mousedown="startDrag"
      @mouseup="stopDrag"
      @mousemove="drag"
    >
      <button class="modal-close" @click="close">×</button>
      <div v-for="(msg, index) in messages" :key="index">
        <p>{{ msg.nick }} : {{ msg.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";
import axios from "axios";

export default {
  props: {
    modalValue: {
      type: Boolean,
      default: false,
    },
    chatroomId: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modalValue"],
  setup(props, { emit }) {
    const userId = computed(() => props.userId);
    const nick = computed(() => props.nick);
    const chatroomId = computed(() => props.chatroomId);
    const visible = ref(props.modalValue);
    const modalContent = ref(null);
    let isDragging = ref(false);
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;
    const message = ref("");
    let messages = ref([]);

    // 대화내용 불러오기
    const getMyChat = async () => {
      try {
        const response = await axios.post("/api/chat/chatList", {
          chatroomId: chatroomId.value,
        });
        messages.value = response.data;
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    };
    // 닫기
    const close = () => {
      chatroomId.value = "";
      messages.value = [];
      emit("update:modalValue", false);
    };

    //드래그 제어
    const startDrag = (event) => {
      isDragging.value = true;
      startX = event.clientX;
      startY = event.clientY;
      const rect = modalContent.value.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;
    };
    const stopDrag = () => {
      isDragging.value = false;
    };
    const drag = (event) => {
      if (!isDragging.value) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      modalContent.value.style.left = `${initialLeft + dx}px`;
      modalContent.value.style.top = `${initialTop + dy}px`;
    };

    watch(
      () => props.modalValue,
      (newValue) => {
        visible.value = newValue;
      }
    );
    watch(
      () => chatroomId.value,
      (newValue) => {
        if (newValue) {
          getMyChat();
        }
      }
    );

    return {
      userId,
      nick,
      chatroomId,
      visible,
      close,
      modalContent,
      startDrag,
      stopDrag,
      drag,
      message,
      messages,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  position: absolute; /* 변경: absolute로 설정하여 드래그 시 이동 가능 */
  cursor: move; /* 드래그 가능한 모양으로 변경 */
  max-width: 500px;
  width: 100%;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
}
</style>
