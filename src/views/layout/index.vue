<template>
    <div class="app-wrapper">
        <el-container>
            <el-aside width="200px" class="sidebar-container"><Menu/></el-aside>
            <el-container>
                <el-header>
                    <div class="nav-bar">
                        <Breadcrumb/>
                        <div class="navbar-right">
                            <Avatar/>
                        </div>
                    </div>
                </el-header>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>


<script setup>
import Menu from '@/views/layout/menu';
import Breadcrumb from '@/views/layout/header/breadcrumb';
import Avatar from '@/views/layout/header/avatar';
</script>

<style lang="scss" scoped>
.app-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}
.sidebar-container {
    background-color: #545c64;
    height: 100%;
}
:deep(.el-container) {
    height: 100%;
}
:deep(ul.el-menu) {
    border-right-width: 0px;
}
.nav-bar {
    width: 100%;
    height: 60px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    padding: 0 16px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    position: relative;
}
:deep(.el-header) {
    padding: 0;
}
.navbar-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
</style>