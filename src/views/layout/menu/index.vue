<template>
    <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-vertical-demo"
            default-active="home"
            text-color="#fff"
            router
            :default-openeds="['manage1']"
    >
        <el-menu-item index="home">
            <el-icon><home-filled /></el-icon>
            <span>首页</span>
        </el-menu-item>
        <el-sub-menu index="manage1">
            <template #title >
                <el-icon><tickets /></el-icon>
                <span>问题管理</span>
            </template>
            <el-menu-item index="category">
                <el-icon><tickets /></el-icon>
                <span>问题类型</span>
            </el-menu-item>
            <el-menu-item index="question">
                <el-icon><tickets /></el-icon>
                <span>题目管理</span>
            </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="assembly">
            <el-icon><tickets /></el-icon>
            <span>组卷</span>
        </el-menu-item>
        <el-menu-item index="survey">
            <el-icon><tickets /></el-icon>
            <span>问卷</span>
        </el-menu-item>
        <el-menu-item index="result">
            <el-icon><tickets /></el-icon>
            <span>答卷记录</span>
        </el-menu-item>
    </el-menu>
</template>

<script setup>
import {HomeFilled,Tickets} from '@element-plus/icons-vue';
</script>

<style lang="scss" scoped>

</style>