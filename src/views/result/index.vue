<template>
<el-card>
    <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="serveyListId" label="对应问卷ID" width="150" />
        <el-table-column prop="results" label="调查结果" width="300" />
        <el-table-column prop="userId" label="答卷用户ID" width="120"/>
        <el-table-column prop="createTime" label="提交时间" width="300" />
    </el-table>
</el-card>
</template>

<script setup>
import {ref} from "vue";
import axios from "@/util/axios";

// 数据定义
const tableData = ref([]); // 表格数据

/**
 * 获取表格数据
 * @returns {Promise<void>}
 */
const initList = async () => {
    // 请求数据
    const res = await axios.get('/api/survey-results/all');
    // 赋值给tableData
    tableData.value = res.data.data.surveyResults;
}
initList();

</script>

<style scoped>

</style>