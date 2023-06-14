<template>
    <el-card>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="问卷名称" width="250" />
            <el-table-column prop="surveyQuestonIds" label="题目ID" width="250" />
            <el-table-column prop="published" label="问卷状态" width="250" />
            <el-table-column prop="action" label="操作">
                <template v-slot="scope">
                    <el-button type="danger"
                               :disabled="scope.row.published === '未发布' ? false : true"
                               @click="handlePublished(scope.row)">
                        发布
                    </el-button>
                    <el-button type="primary" :icon="Edit"
                               :disabled="scope.row.published === '未发布' ? true : false"
                               @click="handleSurveyDialog(scope.row.id, scope.row.password, scope.row.surveyQuestonIds)">
                        去答题
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <SurveyDialog v-model="dialogVisible"
                  :id="assemblyId"
                  :dialogVisible="dialogVisible"
                  :surveyQuestionIds="questionIds"
                  @initList="initList"
    ></SurveyDialog>
</template>

<script setup>
import {ref} from "vue";
import axios from "@/util/axios";
import {Edit} from "@element-plus/icons-vue";
import SurveyDialog from "@/views/survey/components/surveyDialog.vue";
import {ElMessage, ElMessageBox} from "element-plus";

// 数据定义
const tableData = ref([]); // 表格数据
const dialogVisible = ref(false); // 控制SurveyDialog是否可见
const assemblyId = ref(-1); // 组卷ID，用于SurveyDialog的数据初始化
const questionIds = ref("0"); // 组卷问题IDs，用于SurveyDialog（答题界面）的数据初始化

/**
 * 获取表格数据
 * @returns {Promise<void>}
 */
const initList = async () => {
    // 请求数据
    const res = await axios.get('/api/survey-assembly/all');
    // 赋值给tableData
    tableData.value = res.data.data.surveyAssemblys;
}
initList();

/**
 * 点击发布时调用
 * @param row
 */
const handlePublished = (row) => {
    ElMessageBox.confirm(
        '您确定要发布该问卷吗？发布后不可再编辑！',
        '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        // 仅修改published的值
        row.published = "发布";
        // 向后端发送修改数据请求
        let res = await axios.post('/api/survey-assembly/edit', row);
        if (res.data.success === true) {
            ElMessage({
                type: 'success',
                message: '执行成功',
            })
            // 刷新表格数据
            initList();
        } else {
            ElMessage({
                type: 'error',
                message: res.data.msg,
            })
        }
    }).catch(() => {

    })
}

/**
 * 点击去答题时调用
 * @param id
 * @param password
 * @param surveyQuestionIds
 * @returns {Promise<void>}
 */
const handleSurveyDialog = async (id, password, surveyQuestionIds) => {
    // 如果没密码
    if (typeof password === 'undefined' || password == null || password === '') {
        // 传入组卷ID
        assemblyId.value = id;
        // 传入该组卷的问题IDs
        questionIds.value= surveyQuestionIds;
        // 答题界面设为可见
        dialogVisible.value = true;
    }
    // 如果有密码
    else {
        ElMessageBox.prompt('请输入问卷密码', '身份验证', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        })  // 输入密码，点击确定后执行以下
            .then(({ value }) => {
                // 如果密码正确
                if (value === password) {
                    ElMessage({
                        type: 'success',
                        message: '密码正确',
                    });
                    // 传入组卷ID
                    assemblyId.value = id;
                    // 传入该组卷的问题IDs
                    questionIds.value= surveyQuestionIds;
                    // 答题界面设为可见
                    dialogVisible.value = true;
                } else {    // 如果密码错误
                    // 弹窗提示密码错误
                    ElMessage({
                        type: 'error',
                        message: '密码错误',
                    });
                }
            })
            .catch(() => {})
    }
}
</script>

<style scoped>

</style>