<template>
    <el-dialog
        model-value="dialogVisible"
        title="选项管理"
        width="50%"
        @close="handleClose"
        center
    >
        请选择要组卷的题目：
        <el-table :data="tableData" stripe @selection-change="handleSelectionChange" style="width: 100%">
            <!-- 复选框 -->
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="content" label="问题" width="250" />
            <el-table-column prop="description" label="描述" width="250" />
            <el-table-column prop="surveyCateId" label="分类ID" width="120" :formatter="cateFormatter"/>
            <el-table-column prop="surveyItemIds" label="选项ID" width="120" />
        </el-table>
        <el-button type="primary" @click="handleConfirm">确定组卷</el-button>
    </el-dialog>
</template>

<script setup>
import {defineEmits, defineProps, ref, watch} from "vue";
import axios from "@/util/axios";
import {ElMessage} from "element-plus";

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

// 初始化问题表数据
const tableData = ref([]);

/**
 * 获取问题表数据
 * @returns {Promise<void>}
 */
const initQuestionList = async () => {
    // 请求数据
    const res = await axios.get('/api/survey-question/all');
    // 赋值给tableData
    tableData.value = res.data.data.surveyQuestions;
};

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

// 初始化assembly
const assembly = ref({});

/**
 * 根据ID获取要编辑问题的问卷的原始数据
 * @param id
 * @returns {Promise<void>}
 */
const initData = async (id) => {
  const res = await axios.get('/api/survey-assembly/one/' + id);
  assembly.value = res.data.data.surveyAssembly;
}

// 监听本页面dialogVisible（是否可见）值的变化
watch(
    () => props.dialogVisible,
    () => {
        if (props.dialogVisible === true) {
            // 本页面可见时，获取问题表数据
            initQuestionList();
            // 根据父组件传入的id获取要编辑问题的问卷的原始数据
            initData(props.id);
        }
    },
);

// 初始化要加入该问卷的问题IDs
const questionIds = ref("0");

/**
 * 表格左侧复选框改变时调用
 * @param val
 */
const handleSelectionChange = (val) => {
    // 获取选中的问题的ID数组
    let idList = val.map((item) =>{
        return item.id;
    });
    if (idList.length === 0) {
        questionIds.value = "0";
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
    // 赋值给questionIds
    questionIds.value = itemIds;
}

/**
 * 点击确定组卷时调用
 * @returns {Promise<void>}
 */
const handleConfirm = async () => {
    // 修改原来assembly的surveyQuestonIds为questionIds的值
    assembly.value.surveyQuestonIds = questionIds.value;
    // 向后端发送修改数据请求
    let res = await axios.post('/api/survey-assembly/edit', assembly.value);
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

// 定义要调用的父组件的方法
const emits = defineEmits(['update:modelValue','initList']);

/**
 * 点击关闭或取消时调用
 */
const handleClose = () => {
    // 设置dialogVisible为不可见
    emits('update:modelValue', false);
}
</script>

<style>

</style>