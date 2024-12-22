import request from '@/utils/request'

export function fileUpload(data) {
  return request({
    url: '/sys/file/uploadImg',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
}
