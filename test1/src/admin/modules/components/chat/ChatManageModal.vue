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
      카테고리 :
      <select v-model="category">
        <option value="cate1">category1</option>
        <option value="cate2">category2</option>
        <option value="cate3">category3</option>
      </select>
      메모 :
      <textarea v-model="memo" rows="4" cols="50"></textarea>

      <!-- Validation Error Message -->
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <button @click="save">저장</button>
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
  emits: ["update:modalValue"],
  setup(props, { emit }) {
    const category = ref("");
    const memo = ref("");
    const errorMessage = ref("");
    const chatroomId = computed(() => props.chatroomId);
    const visible = ref(props.modalValue);
    const modalContent = ref(null);
    let isDragging = ref(false);
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    // 채팅방 관리 정보
    const getMyChatManageInfo = async () => {
      try {
        const response = await axios.post("/api/admin/chat/chatManageInfo", {
          chatroomId: chatroomId.value,
        });
        category.value = response.data.category;
        memo.value = response.data.memo;
      } catch (error) {
        console.error("Error fetching chat list:", error);
      }
    };

    // 저장
    const save = () => {
      if (validate()) {
        if (confirm("저장하시겠습니까?")) {
          const response = axios.post("api/admin/chat/saveChatManageInfo", {
            chatroomId: chatroomId.value,
            category: category.value,
            memo: memo.value,
          });
        }
      }
    };

    // 유효성 검사
    const validate = () => {
      if (!category.value) {
        errorMessage.value = "카테고리를 선택해주세요.";
        return false;
      }
      if (!memo.value || !memo.value.trim()) {
        errorMessage.value = "메모를 입력해주세요.";
        return false;
      }
      errorMessage.value = "";
      return true;
    };

    // 닫기
    const close = () => {
      chatroomId.value = "";
      category.value = "";
      memo.value = "";
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
          getMyChatManageInfo();
        }
      }
    );

    return {
      category,
      memo,
      errorMessage,
      chatroomId,
      visible,
      close,
      modalContent,
      startDrag,
      stopDrag,
      drag,
      save,
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
