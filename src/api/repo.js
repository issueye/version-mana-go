import request from '../utils/request.js'

export const apiRepoList = (params) => {
    return request({
        url: 'api/v1/repo',
        method: 'get',
        params: params,
    })
}

export const apiRepoAdd = (data) => {
    return request({
        url: 'api/v1/repo',
        method: 'post',
        data: data,
    })
}

export const apiRepoModify = (data) => {
    return request({
        url: 'api/v1/repo',
        method: 'put',
        data: data,
    })
}

// 删除
export const apiRepoDel = (id) => {
    return request({
        url: `api/v1/repo/${id}`,
        method: 'delete',
    })
}

// 克隆仓库
export const apiRepoClone = (id) => {
    return request({
        url: `api/v1/repo/clone/${id}`,
        method: 'get',
    })
}

// 打开仓库
export const apiRepoOpen = (id) => {
    return request({
        url: `api/v1/repo/open/${id}`,
        method: 'get',
    })
}


// 分支列表
export const apiBranchList = (id) => {
    return request({
        url: `api/v1/repo/branch/${id}`,
        method: 'get',
    })
}