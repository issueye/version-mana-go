<template>
<div>
    <div class="header-box">
        <el-form :model="form" label-width="120px">
        <el-row>
            <el-col :span="6">
                <el-form-item label="仓库名称" prop="name">
                    <el-input v-model="form.name" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="10">
                <el-form-item label="仓库地址" prop="name">
                    <el-input v-model="form.path" disabled />
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <span class="header-button">
                    <el-button type="primary" @click="handleRepoClone">克隆仓库</el-button>
                </span>
                <span class="header-button">
                    <el-button type="primary" @click="handleRepoOpen">打开仓库</el-button>
                </span>
            </el-col>
        </el-row>
    </el-form>
    </div>
    <div class="content">
        <el-row :gutter="20">
            <div class="left-box">
                <el-table :data="branchList" border>
                    <el-table-column prop="name" label="名称" min-width="150" show-overflow-tooltip />
                    <el-table-column prop="type" label="类型" width="100" />
                </el-table>
            </div>
            <el-divider direction="vertical" />
            <div class="main-box">
                <el-form :model="form" label-width="120px">
                    <el-form-item label="检索" :inline="true">
                        <el-col :span="8">
                            <el-input v-model="form.condition" />
                        </el-col>
                        <el-col :span="8">
                            <span class="form-button">
                                <el-button type="primary" @click="handleQuery">查询</el-button>
                            </span>
                            <span class="form-button">
                                <el-button type="primary" @click="handleAdd">添加</el-button>
                            </span>
                        </el-col>
                    </el-form-item>
                </el-form>
                <el-table :data="branchList" border>
                    <el-table-column prop="name" label="名称" min-width="150" show-overflow-tooltip />
                    <el-table-column prop="type" label="类型" width="100" />
                </el-table>
            </div>
        </el-row>
    </div>
</div>
</template>

<script setup>
import {
    reactive,
    ref,
    toRefs,
    defineProps
} from "vue"
import {
    apiRepoClone,
    apiRepoOpen,
    apiBranchList
} from '../../api/repo.js'
import {
    ElMessage,
    ElMessageBox
} from 'element-plus'

const props = defineProps({
    //子组件接收父组件传递过来的值
    info: {
        id: '',
        name: '',
        path: '',
        branch: '',
    },
})

const form = reactive({
    id: '',
    name: '',
    branch: '',
    path: ''
});
const data = toRefs(props.info);

form.id = data.id.value;
form.name = data.name.value;
form.path = data.path.value;
form.branch = data.branch.value;

const branchList = ref([]);
const getBranchList = async (id) => {
    let {
        data
    } = await apiBranchList(id)
    console.log('getBranchList data', data);
    if (data.code == 200) {
        branchList.value = data.data
    }
}

getBranchList(form.id)

// 克隆分支
const handleRepoClone = async () => {
    let {
        data
    } = await apiRepoClone(form.id)
    if (data.code == 200) {
        ElMessage({
            type: 'success',
            message: data.message,
        })

        // 获取分支列表
        getBranchList(form.id)
    } else {
        ElMessage({
            type: 'error',
            message: data.message,
        })
    }
}

// 打开仓库
const handleRepoOpen = async () => {
    let {
        data
    } = await apiRepoOpen(form.id)
    if (data.code == 200) {
        ElMessage({
            type: 'success',
            message: data.message,
        })

        // 获取分支列表
        getBranchList(form.id)
    } else {
        ElMessage({
            type: 'error',
            message: data.message,
        })
    }
}
</script>

<style scoped>

.header-box{
    border-bottom: 1px solid #e6e8eb;
}
.left-box {
    margin-left: 10px;
    margin-top: 10px;
}

.header-button{
    margin-left: 10px;
}

.box-divider{
    margin-bottom: 0px;
}

.main-box {
    margin-top: 10px;
    width: 65em;
    padding: 5px;
}

.el-divider--vertical {
    display: inline-block;
    width: 1px;
    height: 37em;
    position: relative;
    vertical-align: middle;
}

.content {
    /* width: 900px; */
    text-align: left;
    height: 500px;
}
</style>
