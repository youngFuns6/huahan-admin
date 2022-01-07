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

export function editCondition(data) {
  return request({
    url: '/condition',
    method: "put",
    data
  })
}

export function deleteCondition(data) {
  return request({
    url: '/condition',
    method: "delete",
    data
  })
}
