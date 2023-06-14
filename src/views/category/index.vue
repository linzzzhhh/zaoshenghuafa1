<template>
    <el-card>
        <el-row :gutter="20" class="top">
            <el-button type="primary" :icon="DocumentAdd" @click="handleAddDialog()">添加题目类型</el-button>
        </el-row>
        <el-table :data="tableData" stripe style="width: 50%">
            <el-table-column prop="id" label="ID" width="100" />
            <el-table-column prop="cateName" label="题目类型" width="200" />
            <el-table-column prop="action" label="操作" width="200">
                <template v-slot="scope">
                    <el-button type="primary" :icon="Edit"
                               :disabled="scope.row.id > 4 ? false : true"
                               @click="handleEditDialog(scope.row.id)">
                    </el-button>
                    <el-button type="danger" :icon="Delete"
                               :disabled="scope.row.id > 4 ? false : true"
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
               :id="cateId"
               :dialogVisible="dialogVisible2"
               @initList="initList"
    ></EditDialog>
</template>

<script setup>
import {ref} from 'vue';
import axios from '@/util/axios';
import {DocumentAdd, Edit, Delete} from "@element-plus/icons-vue";
import AddDialog from "@/views/category/components/add";
import EditDialog from "@/views/category/components/edit";
import {ElMessage, ElMessageBox} from "element-plus";

// 数据定义
const tableData = ref([]); // 表格数据
const dialogVisible = ref(false); // 控制AddDialog是否可见
const dialogVisible2 = ref(false); // 控制EditDialog是否可见
const cateId = ref(-1); // 类型ID，用于EditDialog的数据初始化

/**
 * 获取表格数据
 * @returns {Promise<void>}
 */
const initList = async () => {
    // 请求数据
    const res = await axios.get('/api/survey-cate/all');
    // 赋值给tableData
    tableData.value = res.data.data.surveyCates;
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
    // 将触发时所在行的id赋值给cateId
    cateId.value = id;
    // 使EditDialog可见
    dialogVisible2.value = true;
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
        let res = await axios.get('/api/survey-cate/delete/' + id)
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