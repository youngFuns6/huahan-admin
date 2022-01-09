import request from '@/utils/request'

export function getFeedback(queryInfo) {
    return request({
        url: '/feedback',
        method: 'get',
        params: queryInfo
    })
}

export function deleteFeedback(id) {
    return request({
        url: '/feedback',
        method: 'delete',
        data: {id}
    })
}