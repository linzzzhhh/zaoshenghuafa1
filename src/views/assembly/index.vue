<template>
    <el-card>
        <el-row :gutter="20" class="top">
            <el-button type="primary" :icon="DocumentAdd" @click="handleAddDialog">组卷</el-button>
        </el-row>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="问卷名称" width="250" />
            <el-table-column prop="password" label="问卷密码" width="150" />
            <el-table-column prop="surveyQuestonIds" label="题目ID" width="250" />
            <el-table-column prop="published" label="问卷状态" width="150" />
            <el-table-column prop="action" label="操作">
                <template v-slot="scope">
                    <el-button type="primary" :icon="Edit"
                               :disabled="scope.row.published === '未发布' ? false : true"
                               @click="handleEditDialog(scope.row.id)">
                    </el-button>
                    <el-button type="primary" :icon="Edit"
                               @click="handleEditQuestionDialog(scope.row.id)">
                        编辑试题
                    </el-button>
                    <el-button type="danger" :icon="Delete"
                               :disabled="scope.row.published === '未发布' ? false : true"
                               @click="handleDelete(scope.row.id)">
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <AddDialog v-model="dialogVisible"
               :dialogVisible="dialogVisible"
               @initList="initList"
    ></AddDialog>
    <EditDialog v-model="dialogVisible2"
                :id="assemblyId"
                :dialogVisible="dialogVisible2"
                @initList="initList"
    ></EditDialog>
    <EditQuestionDialog v-model="dialogVisible3"
                     :id="assemblyId"
                     :dialogVisible="dialogVisible3"
                     @initList="initList"
    ></EditQuestionDialog>
</template>

<script setup>
import {Delete, DocumentAdd, Edit} from "@element-plus/icons-vue";
import {ref} from "vue";
import axios from "@/util/axios";
import {ElMessage, ElMessageBox} from "element-plus";
import AddDialog from "@/views/assembly/components/add";
import EditDialog from "@/views/assembly/components/edit.vue";
import EditQuestionDialog from "@/views/assembly/components/editQuestion";

// 数据定义
const tableData = ref([]); // 表格数据
const dialogVisible = ref(false); // 控制AddDialog是否可见
const dialogVisible2 = ref(false); // 控制EditDialog是否可见
const dialogVisible3 = ref(false); // 控制EditQuestionDialog（编辑问卷题目界面）是否可见
const assemblyId = ref(-1); // 组卷ID，用于EditDialog、EditQuestionDialog的数据初始化

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
 * 点击添加时调用，使AddDialog可见（即弹出新增数据页面）
 */
const handleAddDialog = () => {
    // 使AddDialog可见
    dialogVisible.value = true;
}

/**
 * 点击修改时调用，使EditDialog可见（即弹出修改数据页面）
 * @param id
 */
const handleEditDialog = (id) => {
    // 将触发时所在行的id赋值给assemblyId
    assemblyId.value = id;
    // 使EditDialog可见
    dialogVisible2.value = true;
}

/**
 * 点击编辑试题时调用，使EditQuestionDialog可见（即弹出编辑选项页面）
 * @param id
 */
const handleEditQuestionDialog = (id) => {
    // 将触发时所在行的id赋值给assemblyId
    assemblyId.value = id;
    // 使EditQuestionDialog可见
    dialogVisible3.value = true;
}

/**
 * 点击删除时调用
 * @param id
 */
const handleDelete = (id) => {
    ElMessageBox.confirm(
        '确定要删除吗？',
        '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async () => {
        // 向后端发送删除请求
        let res = await axios.get('/api/survey-assembly/delete/' + id)
        if (res.data.success === true) {
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            // 请求成功后刷新表格数据
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
</script>

<style lang="scss" scoped>
.top {
    padding-bottom: 30px;
    box-sizing: border-box;
}
</style>