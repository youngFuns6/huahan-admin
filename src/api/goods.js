import request from '@/utils/request'

export function getGoods(queryInfo) {
    return request({
        url: '/goods',
        method: "get",
        params: queryInfo
    })
}


export function addGoods(data) {
    return request({
        url: '/goods',
        method: "post",
        data
    })
}

export function editGoods(data) {
    return request({
        url: '/goods',
        method: "put",
        data
    })
}

export function deleteGoods(data) {
    return request({
        url: '/goods',
        method: "delete",
        data
    })
}

// 商品分类
export function getGoodsCate(queryInfo) {
    return request({
        url: '/goods/cate',
        method: "get",
        params: queryInfo
    })
}

export function addGoodsCate(data) {
    return request({
        url: '/goods/cate',
        method: "post",
        data
    })
}

export function editGoodsCate(data) {
    return request({
        url: '/goods/cate',
        method: "put",
        data
    })
}

export function deleteGoodsCate(type) {
    return request({
        url: '/goods/cate',
        method: "delete",
        data: {type}
    })
}

export function topGoods(id) {
    return request({
        url: '/goods/top',
        method: "post",
        data: { id }
    })
}