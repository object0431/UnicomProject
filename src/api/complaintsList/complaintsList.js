import request from '@/utils/request'

// 查询用户投诉单列表
export function listComplaintsByUser(query) {
  return request({
    url: '/complaints/listByUser',
    method: 'get',
    params: query
  })
}

// 新增投诉单
export function saveComplaints(data) {
  return request({
    url: '/complaints/save',
    method: 'post',
    data: data
  })
}

// 编辑投诉单
export function updateComplaints(data) {
  return request({
    url: '/complaints/edit',
    method: 'post',
    data: data
  })
}

// 查询投诉单列表
export function listComplaints(query) {
  return request({
    url: '/complaints/list',
    method: 'get',
    params: query
  })
}

// 查询反馈详细
export function getComplaints(complaintsId) {
  return request({
    url: '/feedback/' + complaintsId,
    method: 'get'
  })
}

// 保存反馈结果
export function saveFeedback(data) {
  return request({
    url: '/feedback/save',
    method: 'post',
    data: data
  })
}

// 提交反馈结果
export function submitFeedback(data) {
  return request({
    url: '/feedback/submit',
    method: 'post',
    data: data
  })
}


