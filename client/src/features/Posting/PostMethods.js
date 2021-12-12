import FormData from 'form-data';

const baseUrl = 'http://cis557-group20-project.herokuapp.com/api';
const fileUrl = baseUrl.concat('/file');
const postUrl = baseUrl.concat('/posting');

export async function PostFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(fileUrl, {
      method: 'POST',
      // headers: {
      //   'Content-Type': 'multipart/form-data; ',
      // },
      body: formData,
    });
    return response.json();
  } catch (err) {
    return {};
  }
}

export const MakePost = (groupId, heading, creatorId, content,
  attachmentId, attachmentType) => fetch(postUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    groupId,
    heading,
    creatorId,
    content,
    attachmentId,
    attachmentType,
  }),
});

export async function GetPost(postingId) {
  const url = baseUrl.concat(`/${postingId}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}

export async function GetComment(commentId) {
  const url = baseUrl.concat(`/${commentId}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
}
