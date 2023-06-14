<template>
  <el-dialog
    model-value="dialogVisible"
    title="添加"
    width="40%"
    @close="handleClose"
  >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="150px"
      >
          <el-form-item label="问卷名称" prop="name">
              <el-input v-model="form.name"/>
          </el-form-item>
          <el-form-item label="问卷密码" prop="password">
              <el-input v-model="form.password"/>
          </el-form-item>
      </el-form>
      <template #footer>
          <span class="dialog-footer">
              <el-button @click="handleClose">取消</el-button>
              <el-button type="primary" @click="handleAdd">提交</el-button>
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
    name: "",
    password: "",
    surveyQuestonIds: "0",
    published: "未发布",
    userId: 0
})

// 定义表单验证规则
const rules = ref({
    name: [
        {
            required: true,
            message: '请输入问卷名称！'
        }
    ]
})

// 监听本页面dialogVisible（是否可见）值的变化
watch(
    ()=>props.dialogVisible,
    ()=>{
        // 表单数据置空
        form.value = {
            id: null,
            name: "",
            password: "",
            surveyQuestonIds: "0",
            published: "未发布",
            userId: 0
        }
    }
)

// 定义要调用的父组件的方法
const emits = defineEmits(['update:modelValue','initList']);

/**
 * 点击提交时调用
 */
const handleAdd = () => {
    formRef.value.validate(async (valid) => {
        if (valid) {
            try {
                // 向后端发送新增数据请求
                let res = await axios.post('/api/survey-assembly/add', form.value);
                console.log(res)
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
            } catch (err) {
                console.log("error:"+err);
                ElMessage.error("系统错误，请联系管理员");
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