import request from '@/utils/request'

export function getCondition(queryInfo){
  return request({
    url: '/condition',
    method: "get",
    params: queryInfo
  })
}


export function addCondition(data){
  return request({
    url: '/condition',
    method: "post",
    data
  })
}