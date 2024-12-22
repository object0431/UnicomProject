import request from '@/utils/request'

// 新增公告
export function saveNotice(data) {
  return request({
    url: '/notice/save',
    method: 'post',
    data: data
  })
}

// 编辑公告
export function updateNotice(data) {
  return request({
    url: '/notice/edit',
    method: 'post',
    data: data
  })
}

// 查询公告单列表
export function listNotice(query) {
  return request({
    url: '/notice/list',
    method: 'get',
    params: query
  })
}

// 根据ID查询公告单列表
export function getNotice(id) {
  return request({
    url: '/notice/query/' + id,
    method: 'get'
  })
}

//根据用户所在区县查询公告
export function listNoticeByUser(query) {
  return request({
    url: '/notice/listByUser',
    method: 'get',
    params: query
  })
}

// 角色状态修改
export function changeState(id, state) {
  const data = {
    id,
    state
  }
  return request({
    url: '/notice/changeState',
    method: 'put',
    data: data
  })
}
