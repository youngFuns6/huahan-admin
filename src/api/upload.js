import request from '@/utils/request'

export function uploadHonorImages(file) {
    return request({
        url: '/upload',
        method: "post",
        data: file
    })
}