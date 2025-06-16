<template>
  <div class="contentW">
    <table class="tbl">
      <!-- 내용, 날짜, 상태 -->
      <tbody>
        <tr
          v-for="(item, idx) in articles?.slice(
            pageStartIdx,
            pageStartIdx + ITEM_PER_PAGE
          )"
          :key="idx"
        >
          {{
            item
          }}
        </tr>
      </tbody>
    </table>
    <Pagination
      :list="articles"
      v-bind="{ ITEM_PER_PAGE, PAGE_PER_SECTION }"
      @change-page="onChangePage"
    />
  </div>
</template>

<script>
import Pagination from "./Pagination";
import { ref, computed } from "vue";

export default {
  components: { Pagination },
  setup() {
    const articles = new Array(111);
    for (let i = 0; i < articles.length; i++) {
      articles[i] = `Article ${i + 1}`;
    }

    const ITEM_PER_PAGE = ref(10);
    const PAGE_PER_SECTION = ref(5);
    let curPage = ref(1);

    const pageStartIdx = computed(() => {
      return (curPage.value - 1) * ITEM_PER_PAGE.value;
    });

    const onChangePage = (data) => {
      curPage.value = data;
    };

    return {
      ITEM_PER_PAGE,
      PAGE_PER_SECTION,
      articles,
      pageStartIdx,
      //
      onChangePage,
    };
  },
};
</script>
