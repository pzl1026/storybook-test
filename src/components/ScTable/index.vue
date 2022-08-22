<template>
  <a-table v-bind="$attrs"></a-table>
</template>

<script setup></script>

<style
  scoped
  lang="scss"
>
:deep(.ant-table-thead) > tr > th {
  background: #e8f3ff;
  height: 40px;
  padding: 0 16px;
  min-width: 30px;
}
</style>
