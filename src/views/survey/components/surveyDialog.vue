<template>
  <el-dialog
      model-value="dialogVisible"
      title="答题"
      width="40%"
      @close="handleClose"
  >
    <el-form :model="form">
      <el-row style="margin-bottom: 50px"
              v-for="(question,index) in form.questionList"
              :key="question.id"
      >
        <el-col :span="24">
          <!--题目内容-->
          <el-row class="question">
            <el-col :span="1">{{index+1}}、</el-col>
            <el-col :span="23">{{question.content}}</el-col>
          </el-row>
          <!--如果有描述则显示描述-->
          <el-row v-if="question.description!=''" class="description">
            注：<span>{{question.description}}</span>
          </el-row>
          <!--题目选项或答题区-->
          <el-row class="result">
            <!--单选题-->
            <el-col :span="24" v-if="question.surveyCateId===1">
              <el-row>
                <el-form-item @change="(val)=>handleChange(val,index)">
                  <el-radio-group v-model="question.result">
                    <el-radio class="item"
                              v-for="(option,i) in question.itemList"
                              :key="i"
                              v-model="question.result"
                              :label="option.item"
                    >
                      {{option.item}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
            </el-col>
            <!--多选题-->
            <el-col :span="24" v-if="question.surveyCateId===2">
              <el-row>
                <el-form-item>
                  <el-checkbox-group v-model="question.selection">
                    <el-checkbox class="item"
                                 v-for="(option,i) in question.itemList"
                                 :key="i"
                                 :label="option.item"
                                 @change="(val)=>handleCheck(val,index)"
                    >
                      {{option.item}}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-row>
            </el-col>
            <!--判断题-->
            <el-col :span="24" v-if="question.surveyCateId===3">
              <el-row>
                <el-form-item @change="(val)=>handleChange(val,index)">
                  <el-radio-group v-model="question.result">
                    <el-radio label="是">是</el-radio>
                    <el-radio label="否">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
            </el-col>
            <!--如果是简答题-->
            <el-col :span="24" v-if="question.surveyCateId!==1 && question.surveyCateId!==2 && question.surveyCateId!==3">
              <el-row>
                <el-form-item @blur.native.capture="(val)=>handleChange(val,index)">
                  <el-input type="textarea" style="width: 500px" v-model="question.result"/>
                </el-form-item>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
          <span class="dialog-footer">
              <el-button @click="handleClose">取消</el-button>
              <el-button type="primary" @click="handleConfirm">提交</el-button>
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
      },
      surveyQuestionIds: {
        type: String,
        default: "0",
        required: true
      }
    }
)

// 监听本页面dialogVisible（是否可见）值的变化
watch(
    ()=>props.dialogVisible,
    ()=>{
      let id = props.id;
      if (id !== -1 && props.dialogVisible === true) {
        // 本页面可见时，根据题目Ids获取题目集合，并做初始化处理
        initData(props.surveyQuestionIds);
      }
    }
)

// 初始化表单元素的数据
const form = ref({
  questionList: [
    {
      id: 0,
      content: "",
      description: "",
      surveyCateId: 1,
      itemList: [],
      result: "",
      selection: [] // 用于绑定多选题的值
    }
  ]
})

/**
 * 单选、判断、简答题，答案的值改变时调用
 * @param val
 * @param index
 */
const handleChange = (val,index) => {
  // 获取改变的值，赋值给form中的questionList中的相应题的result
  form.value.questionList[index].result = val.srcElement.value
}

/**
 * 多选题选中的选项改变时调用
 * @param val
 * @param index
 */
const handleCheck = (val,index) => {
  // 取出和多选题组件绑定的 选中的选项的ID数组
  let selection = form.value.questionList[index].selection;
  console.log(selection);
  // 将该集合用","连接成字符串
  let result = "";
  selection.map((item, index) => {
    result += item;
    if (index !== selection.length-1) {
      result += ",";
    }
  })
  console.log(result);
  // 将拼接好的字符串赋值给form中的questionList中的相应题（根据index确定）的result
  form.value.questionList[index].result = result;
}

// 定义要调用的父组件的方法
const emits = defineEmits(['update:modelValue','initList']);

/**
 * 根据题目Ids获取题目集合，并做初始化处理
 * @param surveyQuestionIds
 * @returns {Promise<void>}
 */
const initData = async (surveyQuestionIds) => {
  // 向后端发送请求，根据组卷id串获取问卷题目集合
  let res = await axios.get('/api/survey-question/getSurveyQuestionsByIds/' + surveyQuestionIds);
  // 将返回的数据赋值给中间变量list
  let list = res.data.data.surveyQuestions
  // 遍历题目集合list
  for (var i=0; i<list.length; i++) {
    // 如果是选择题，加载选项
    if (list[i].surveyCateId === 1 || list[i].surveyCateId === 2) {
      // 向后端发送请求，根据题目id串获取该题的选项集合
      let res2 = await axios.get('/api/survey-item/getSurveyItemsByIds/' + list[i].surveyItemIds);
      let itemList = res2.data.data.surveyItems;
      // 选项ID为int类型不能反显，转为string
      itemList.forEach((item)=> item.id = item.id.toString())
      // 如果是多选题，添加checked属性
      if (list[i].surveyCateId === 2) {
        itemList.forEach((item)=> item.checked = false)
      }
      // 将处理好的选项数组赋值给list中相应项的itemList属性
      list[i].itemList = itemList;
    } else {    // 不是选择题，itemList设为空
      list[i].itemList = [];
    }
    // 初始化每道题的result（答案）属性，用于记录答卷人每道题的答案
    list[i].result = "";
  }
  // 将处理好的list赋值给form中的questionList
  form.value.questionList = list;
  console.log(form.value.questionList)
}

/**
 * 点击提交时调用
 */
const handleConfirm = async () => {
  let list = form.value.questionList;
  let results = "";
  // 遍历问卷所有result，拼接成”问题id-答案“的形式
  list.map((item, index) => {
    results += item.content + "-" + item.result;
    if (index !== list.length-1) {
      results += ";"
    }
  });
  console.log(results);
  // 获取浏览器中存储的当前登录用户的ID
  const userId = window.sessionStorage.getItem('userId');
  // 提交问卷调查结果
  const resultObj = {
    results: results,
    serveyListId: props.id,
    userId: userId
  };
  let res = await axios.post('/api/survey-results/add', resultObj);
  console.log(res)
  if (res.data.success === true) {
    ElMessage.success("提交成功！");
    // 关闭该弹窗
    handleClose();
  } else {
    ElMessage.error(res.data.msg);
  }
}

/**
 * 点击关闭或取消时调用
 */
const handleClose = () => {
  // 设置dialogVisible为不可见
  emits('update:modelValue', false);
}
</script>

<style lang="scss" scoped>
.question {
  margin-bottom: 15px;
  font-size: large;
}
.description {
  margin: 15px;
}
.result {
  margin-bottom: 15px;
}
.item {
  margin-left: 15px;
}
</style>