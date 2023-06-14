<template>
    <el-card>
        <el-row :gutter="20" class="top">
            <el-button type="primary" :icon="DocumentAdd" @click="handleAddDialog()">添加调查问题</el-button>
        </el-row>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="content" label="问题" width="250" />
            <el-table-column prop="description" label="描述" width="250" />
            <el-table-column prop="surveyCateId" label="分类ID" width="120" :formatter="cateFormatter"/>
            <el-table-column prop="surveyItemIds" label="选项ID" width="120" />
            <el-table-column prop="action" label="操作">
                <template v-slot="scope">
                    <el-button type="primary" :icon="Edit"
                               @click="handleEditDialog(scope.row.id)">
                    </el-button>
                    <el-button type="primary" :icon="Edit"
                               :disabled="scope.row.surveyCateId < 3 ? false : true"
                               @click="handleEditItemsDialog(scope.row.id)">
                        编辑选项
                    </el-button>
                    <el-button type="danger" :icon="Delete"
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
                :id="questionId"
                :dialogVisible="dialogVisible2"
                @initList="initList"
    ></EditDialog>
    <EditItemsDialog v-model="dialogVisible3"
                :id="questionId"
                :dialogVisible="dialogVisible3"
                @initList="initList"
    ></EditItemsDialog>
</template>

<script setup>
import {Delete, DocumentAdd, Edit} from "@element-plus/icons-vue";
import {ref} from "vue";
import axios from "@/util/axios";
import AddDialog from "@/views/question/components/add";
import EditDialog from "@/views/question/components/edit";
import EditItemsDialog from "@/views/question/components/editItems";
import {ElMessage, ElMessageBox} from "element-plus";

// 数据定义
const tableData = ref([]); // 表格数据
const dialogVisible = ref(false); // 控制AddDialog是否可见
const dialogVisible2 = ref(false); // 控制EditDialog是否可见
const dialogVisible3 = ref(false); // 控制EditItemsDialog（编辑题目选项界面）是否可见
const questionId = ref(-1); // 题目ID，用于EditDialog、EditItemsDialog的数据初始化

/**
 * 获取表格数据
 * @returns {Promise<void>}
 */
const initList = async () => {
    // 请求数据
    const res = await axios.get('/api/survey-question/all');
    // 赋值给tableData
    tableData.value = res.data.data.surveyQuestions;
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
    // 将触发时所在行的id赋值给questionId
    questionId.value = id;
    // 使EditDialog可见
    dialogVisible2.value = true;
}

/**
 * 点击编辑选项时调用，使EditItemsDialog可见（即弹出编辑选项页面）
 * @param id
 */
const handleEditItemsDialog = (id) => {
    // 将触发时所在行的id赋值给questionId
    questionId.value = id;
    // 使EditItemsDialog可见
    dialogVisible3.value = true;
}

/**
 * 将类型ID翻译成对应的类型名称
 */
const cateFormatter = (row) => {
    switch (row.surveyCateId) {
        case 1:
            return "单选题"
        case 2:
            return "多选题"
        case 3:
            return "判断题"
        default:
            return "简答题"
    }
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
        let res = await axios.get('/api/survey-question/delete/' + id)
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