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
import axios from "@/axios.js";

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
  emits: ["update:modalValue", "reset-chatroom-id"],
  setup(props, { emit }) {
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
        console.error("Error fetching modal history list:", error);
      }
    };
    // 닫기
    const close = () => {
      chatroomId.value = "";
      messages.value = [];
      emit("update:modalValue", false);
      emit("reset-chatroom-id");
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
