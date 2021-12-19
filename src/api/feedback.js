import request from '@/utils/request'

export function getFeedback() {
    return request({
        url: '/feedback',
        method: 'get'
    })
}

export function deleteFeedback(id) {
    return request({
        url: '/feedback',
        method: 'delete',
        data: {id}
    })
}