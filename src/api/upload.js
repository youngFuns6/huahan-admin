import request from '@/utils/request'

export function uploadHonorImages(file) {
    return request({
        url: '/upload',
        method: "post",
        data: file
    })
}

export function uploadSitemap(file) {
    return request({
        url: '/upload/sitemap',
        method: "post",
        data: file
    })
}

// 百度api文章提交
export function noticeApi(data) {
    return request({
        url: '/noticeApi',
        method: "post",
        data: data
    })
}
