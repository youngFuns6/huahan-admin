import request from '@/utils/request'

export function getWebInfo() {
    return request({
        url: '/info',
        method: 'get'
    })
}

export function editWebInfo(data) {
    return request({
        url: '/info',
        method: 'put',
        data
    })
}
