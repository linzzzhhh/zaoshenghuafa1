<template>
    <el-dropdown>
    <span class="el-dropdown-link">
      <el-avatar :size="40" :src="circleUrl" />
    </span>
    </el-dropdown>
</template>

<script setup>
import {ref} from 'vue';

const circleUrl = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png');
</script>

<style lang="scss" scoped>

</style>