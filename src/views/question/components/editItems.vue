<template>
    <el-dialog
        model-value="dialogVisible"
        title="选项管理"
        width="50%"
        @close="handleClose"
        center
    >
        <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="100px"
            style="text-align: center"
        >
            <el-form-item label="选项内容" prop="item">
                <el-input placeholder="格式如：A、学生" v-model="form.item" style="width: 300px"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleAddItem" style="margin-left: 500px">添加</el-button>
            </el-form-item>
        </el-form>
        请选择要加入该题目的选项：
        <el-table :data="tableData" stripe @selection-change="handleSelectionChange" style="width: 100%">
            <!-- 复选框 -->
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="id" label="ID" width="50" />
            <el-table-column prop="item" label="选项内容" width="400" />
            <el-table-column prop="action" label="操作" width="150" >
                <template v-slot="scope">
                    <el-button type="primary" :icon="Edit"
                               @click="handleEdit(scope.row.id)"></el-button>
                    <el-button type="danger" :icon="Delete"
                               @click="handleDelete(scope.row.id)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-button type="primary" @click="handleChangeItems">确定选项</el-button>
    </el-dialog>
</template>

<script setup>
import {defineEmits, defineProps, ref, watch} from "vue";
import axios from "@/util/axios";
import {ElMessage, ElMessageBox} from "element-plus";
import {Delete, Edit} from '@element-plus/icons-vue'

// 定义父组件传递的参数，并初始化
const props = defineProps(
    {
        dialogVisible: {
            type: Boolean,
            default: false,
            required: true
        },
        id: {
            type: Number,
            default: -1,
            required: true
        }
    }
);

// 初始化表单控件
const formRef = ref(null);

// 初始化表单元素的数据
const form = ref({
    id: null,
    item: "",
    userId: 0
});

// 定义表单验证规则
const rules = ref({
    item: [
        {
            required: true,
            message: '请输入选项内容'
        }
    ],
});

// 初始化选项表数据
const tableData = ref([]);

/**
 * 获取选项表数据
 * @returns {Promise<void>}
 */
const initItemList = async () => {
    // 请求数据
    const res = await axios.get('/api/survey-item/all');
    // 赋值给tableData
    tableData.value = res.data.data.surveyItems;
};

// 初始化question
const question = ref({});

/**
 * 根据ID获取要编辑选项的问题的原始数据
 * @param id
 * @returns {Promise<void>}
 */
const initData = async (id) => {
    const res = await axios.get('/api/survey-question/one/' + id);
    // 返回数据赋值给question
    question.value = res.data.data.surveyQuestion;
}

// 监听本页面dialogVisible（是否可见）值的变化
watch(
    () => props.dialogVisible,
    () => {
        if (props.dialogVisible === true) {
            // 本页面可见时，获取选项表数据
            initItemList();
            // 根据父组件传入的id获取要编辑选项的问题的原始数据
            initData(props.id);
        }
    },
);

// 定义要调用的父组件的方法
const emits = defineEmits(['update:modelValue','initList']);

/**
 * 点击添加时调用，新增一个选项，此时还未加入到该问题中
 */
const handleAddItem = async () => {
    formRef.value.validate(async(valid)=>{
        if(valid){
            // 向后端发送新增选项请求
            let res = await axios.post('/api/survey-item/add', form.value);
            if (res.data.success === true) {
                ElMessage.success("执行成功！");
                // 重置表单
                formRef.value.resetFields();
                // 刷新本页面选项表数据
                initItemList();
            } else {
                ElMessage.error(res.data.msg);
            }
        }
    })
}

// 初始化要加入该题目的选项IDs
const addItemIds = ref("0");

/**
 * 表格左侧复选框改变时调用
 * @param val
 */
const handleSelectionChange = (val) => {
    // 获取选中的选项的ID数组
    let idList = val.map((item) =>{
        return item.id;
    });
    if (idList.length === 0) {
        addItemIds.value = "0";
        return;
    }
    // 将idList中的ID拼接成以逗号分隔的字符串
    let itemIds = "";
    idList.forEach((item, index)=>{
        itemIds += item;
        if (index !== idList.length-1) {
            itemIds += ",";
        }
    })
    console.log(itemIds);
    // 赋值给addItemIds
    addItemIds.value = itemIds;
}

/**
 * 点击确定选项时调用
 * @returns {Promise<void>}
 */
const handleChangeItems = async () => {
    // 修改原来question的surveyItemIds为addItemIds的值
    question.value.surveyItemIds = addItemIds.value;
    // 向后端发送修改数据请求
    let res = await axios.post('/api/survey-question/edit', question.value);
    if (res.data.success === true) {
        ElMessage.success("执行成功！");
        // 刷新父组件表格数据
        emits('initList');
        // 关闭该弹窗
        handleClose();
    } else {
        ElMessage.error(res.data.msg);
    }
}

/**
 * 点击编辑选项时调用
 * @param id
 */
const handleEdit = (id) => {
    ElMessageBox.prompt('修改选项内容', '内容', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    })   // 如果点击确定，执行一下操作
        .then(async ({ value }) => {
            // 修改请求数据
            let newItem = {
                id: id,
                item: value,
                userId: 3
            }
            // 向后端发送修改数据请求
            let res = await axios.post('/api/survey-item/edit', newItem);
            if (res.data.success === true) {
                ElMessage.success("执行成功！");
                // 刷新本页面选项表数据
                initItemList();
            } else {
                ElMessage.error(res.data.msg);
            }
        })
        .catch(() => {})
}

/**
 * 点击删除时调用
 * @param id
 */
const handleDelete = (id) =>{
    ElMessageBox.confirm(
        '您确定要删除这条记录吗？',
        '系统提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async() => {
            // 向后端发送删除请求
            let res=await axios.get('/api/survey-item/delete/'+id)
            if(res.data.success === true){
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                });
                // 刷新本页面选项表数据
                initItemList();
            }else{
                ElMessage({
                    type: 'error',
                    message: res.data.msg,
                });
            }
        })
        .catch(() => {
        })
}

/**
 * 点击关闭或取消时调用
 */
const handleClose = () => {
    // 重置表单
    formRef.value.resetFields();
    // 表单数据置空
    form.value = {
        id: null,
        item: "",
        userId: 0
    };
    // 设置dialogVisible为不可见
    emits('update:modelValue', false);
}
</script>

<style>

</style>