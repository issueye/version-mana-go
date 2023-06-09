<template>
<div class="content">
    <el-card class="form-box">
        <el-form 
            :model="form" 
            label-width="120px"
        >
            <el-form-item 
                label="检索" 
                :inline="true"
            >
                <el-col :span="4">
                    <el-input v-model="form.condition" />
                </el-col>
                <el-col :span="4">
                    <span class="form-button">
                        <el-button 
                            type="primary" 
                            @click="handleQuery"
                        >查询</el-button>
                    </span>
                    <span class="form-button">
                        <el-button 
                            type="primary" 
                            @click="handleAdd"
                        >添加</el-button>
                    </span>
                </el-col>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card>
        <el-table 
            :data="tableData" 
            stripe 
            border 
            style="width: 100%"
        >
            <el-table-column fixed prop="id" label="编码" width="200" />
            <el-table-column fixed prop="name" label="名称" width="200" />
            <el-table-column prop="branch" label="当前分支" width="200" />
            <el-table-column prop="path" label="代码路径" min-width="300" />
            <el-table-column prop="createTime" label="创建时间" min-width="300" />
            <!-- 操作按钮 -->
            <el-table-column fixed="right" label="操作" width="300" align="center">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="handleWork(scope.row)">工作台</el-button>
                    <el-button type="primary" size="small" @click="handleModify(scope.row)">修改</el-button>
                    <el-button type="danger" size="small" @click="handleClose(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</div>

<!-- 日志弹窗 -->
<el-dialog 
    v-model="dialogWorkVisible" 
    :title="dialogWorkTitle" 
    width="80%" 
    top="1vh" 
    :close-on-click-modal="false" 
    @open="handleOpenLogView"
    @opened="handleDiagLogViewOpened"
>
    <Work :info="info" />
</el-dialog>

<!-- 添加、修改弹窗 -->
<el-dialog 
    v-model="dialogVisible" 
    :title="dialogTitle" 
    width="30%" 
    top="1vh" 
    :close-on-click-modal="false" 
    :before-close="handleDiagClose"
>
    <el-form :model="editForm" :label-position="right" label-width="80px">
        <el-form-item label="名称">
            <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="代码路径">
            <el-input v-model="editForm.path" />
        </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
            <el-button type="primary" @click="handelSave">确定</el-button>
        </span>
    </template>
</el-dialog>
</template>

<script setup name="monitor">
import Work from './work.vue'
import { reactive, ref } from "vue"
import { apiRepoList, apiRepoAdd, apiRepoModify, apiRepoDel, apiRepoClone } from '../../api/repo.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const form = reactive({
    condition: ''
});

const editForm = reactive({
    id: '',
    name: '',
    logPath: '',
    level: '',
    scriptPath: '',
});

const info = reactive({
    id: '',
    name: '',
    path: '',
    branch: ''
});

// 添加编辑弹窗
const dialogVisible = ref(false);
const dialogTitle = ref('添加');
// 日志弹窗是否显示
const dialogWorkVisible = ref(false);
const dialogWorkTitle = ref('');

// 表格
const tableData = ref([]);

// 获取参数列表
const getData = async () => {
    let {
        data
    } = await apiRepoList(form);
    console.log('data', data);
    if (data.code == 200) {
        tableData.value = data.data
    }
}

getData()

// 修改状态
const handleWork = async (row) => {
    dialogWorkVisible.value = true
    dialogWorkTitle.value = `${row.name}>>工作台`

    info.id = row.id
    info.name = row.name
    info.path = row.path
    info.branch = row.branch 
}

// 修改参数
const handleModify = (row) => {
    editForm.id = row.id
    editForm.name = row.name
    editForm.logPath = row.logPath
    editForm.level = row.level
    editForm.scriptPath = row.scriptPath

    dialogTitle.value = '修改'
    dialogVisible.value = true
}

const handleClose = (row) => {
    ElMessageBox.confirm('确定是否删除?', '删除', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }
    ).then(async () => {
        // 调用接口
        let { data } = await apiRepoDel(row.id)
        if (data.code == 200) {
            ElMessage({
                type: 'success',
                message: data.message,
            })
        } else {
            ElMessage({
                type: 'error',
                message: data.message,
            })
        }
        getData()
    }).catch((action) => {
        ElMessage({
            type: 'info',
            message: action === 'cancel' ?
                '取消删除' :
                'Stay in the current route',
        })
    })
}

const handleQuery = () => {
    console.log('handleQuery');
    getData()
}

// 添加按钮
const handleAdd = () => {
    dialogVisible.value = true;
    dialogTitle.value = '添加';

    editForm.id = ''
    editForm.name = ''
    editForm.logPath = ''
    editForm.level = -1
    editForm.scriptPath = ''
}

// 调用接口
const handelSave = async () => {
    if (dialogTitle.value == '添加') {
        let { data } = await apiRepoAdd(editForm)
        if (data.code == 200) {
            ElMessage({
                type: 'success',
                message: data.message,
            })
        }
    }

    if (dialogTitle.value == '修改') {
        let { data } = await apiRepoModify(editForm)
        if (data.code == 200) {
            ElMessage({
                type: 'success',
                message: data.message,
            })
        } else {
            ElMessage({
                type: 'error',
                message: data.message,
            })
            return
        }
    }

    dialogVisible.value = false
    getData()
}
</script>

<style>
.form-box {
    margin-bottom: 10px;
}

.form-button {
    margin-left: 10px;
}

.content {
    /* width: 900px; */
    text-align: left;
}
</style>
