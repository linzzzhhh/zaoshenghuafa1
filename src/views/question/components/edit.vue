giur<template>
  <el-dialog
    model-value="dialogVisible"
    title="修改"
    width="40%"
    @close="handleClose"
  >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="150px"
      >
          <el-form-item label="问题" prop="content">
              <el-input v-model="form.content"/>
          </el-form-item>
          <el-form-item label="描述" prop="description">
              <el-input v-model="form.description"/>
          </el-form-item>
          <el-form-item label="题目类型" prop="surveyCateId">
              <el-select v-model="form.surveyCateId" placeholder="请选择..">
                  <el-option
                          v-for="item in cateList"
                          :key="item.id"
                          :label="item.cateName"
                          :value="item.id"
                  ></el-option>
              </el-select>
          </el-form-item>
      </el-form>
      <template #footer>
          <span class="dialog-footer">
              <el-button @click="handleClose">取消</el-button>
              <el-button type="primary" @click="handleConfirm">确认</el-button>
          </span>
      </template>
  </el-dialog>
</template>

<script setup>
import {defineEmits, defineProps, ref, watch} from "vue";
import axios from "@/util/axios";
import {ElMessage} from "element-plus";

// 定义父组件传递的参数，并初始化
const props = defineProps(
    {
      id: {
        type: Number,
        default: -1,
        required: true
      },
      dialogVisible: {
        type: Boolean,
        default: false,
        required: true
      }
    }
)

// 初始化表单控件
const formRef = ref(null);

// 初始化表单元素的数据
const form = ref({
    id: null,
    content: "",
    description: "",
    surveyCateId: null,
    surveyItemIds: "0",
    userId: 0
})

// 定义表单验证规则
const rules = ref({
    content: [
        {
            required: true,
            message: '请输入问题内容！'
        }
    ],
    surveyCateId: [
        {
            required: true,
            message: '请选择题目类型！'
        }
    ],
})

// 监听本页面dialogVisible（是否可见）值的变化
watch(
    ()=>props.dialogVisible,
    ()=>{
        let id = props.id; // 父组件传入的id
        if (id !== -1 && props.dialogVisible === true) {
            // 本页面可见时，根据父组件传入的id获取表单数据
            initFormData(id);
        }
    }
)

// 定义要调用的父组件的方法
const emits = defineEmits(['update:modelValue','initList']);

/**
 * 获取表单数据
 * @param id
 * @returns {Promise<void>}
 */
const initFormData = async (id) => {
    // 向后端发送根据ID获取一条数据的请求
    const res = await axios.get('/api/survey-question/one/' + id);
    // 将返回的结果赋值给表单绑定的数据对象
    form.value = res.data.data.surveyQuestion;
}

// 初始化类型下拉框数据
const cateList = ref([]);

/**
 * 获取题目类型下拉框数据
 * @returns {Promise<void>}
 */
const initCateList = async () => {
  // 向后端请求获取所有题目类型
  const res = await axios.get('/api/survey-cate/all');
  // 将返回结果赋值给cateList
  cateList.value = res.data.data.surveyCates;
}
initCateList();

/**
 * 点击确认时调用
 */
const handleConfirm = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            // 向后端发送修改数据请求
            let res = await axios.post('/api/survey-question/edit', form.value);
            if (res.data.success === true) {
                ElMessage.success("执行成功！");
                // 重置表单
                formRef.value.resetFields();
                // 刷新父组件表格数据
                emits('initList');
                // 关闭该弹窗
                handleClose();
            } else {
                ElMessage.error(res.data.msg);
            }
        } else {
            console.log("error:"+err);
            ElMessage.error("系统错误，请联系管理员");
        }
    })
}

/**
 * 点击关闭或取消时调用
 */
const handleClose = () => {
  // 重置表单
  formRef.value.resetFields();
  // 设置dialogVisible为不可见
  emits('update:modelValue', false);
}
</script>

<style scoped>

</style>